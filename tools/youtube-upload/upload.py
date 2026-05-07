"""
YouTube batch uploader for VLP training video courses.

Reads a manifest JSON file, extracts videos from a ZIP archive, uploads each
to YouTube via the Data API v3, captures the resulting video URL back into
the manifest, and (on full success) deletes the source ZIP.

OAuth flow:
  - Refresh token is stored as a Cloudflare Worker secret.
  - This script POSTs to {WORKER_BASE_URL}/v1/youtube/access-token to get a
    fresh access token before each upload batch.
  - Refresh token never lives on the operator's machine.

Filename parser (per Phase 1 ZIP inspection):
  Pattern: ^Lesson_(\\d+)__(.+)\\.mp4$
  The captured digits encode module + lesson positionally:
    - Last digit  = lesson (1-4)
    - Preceding digits = module (1-10)
  Examples:
    Lesson_11__... -> M1, L1
    Lesson_54__... -> M5, L4
    Lesson_101__... -> M10, L1

Usage:
    python upload.py --manifest path/to/uploads-tppsg.json \\
                     --zip path/to/heygen_project.zip \\
                     [--dry-run] [--module N] [--lesson N]

The script is resumable: if it crashes mid-batch, re-running it skips rows
that already have a populated youtube_url.
"""

import argparse
import json
import os
import re
import shutil
import sys
import tempfile
import zipfile
from pathlib import Path
from typing import Optional

import requests
from dotenv import load_dotenv
from google.oauth2.credentials import Credentials as OAuth2Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload


# ---------- Constants ----------

LESSON_FILENAME_RE = re.compile(r'^Lesson_(\d+)__(.+)\.mp4$')
YOUTUBE_API_SCOPES = ['https://www.googleapis.com/auth/youtube.upload']
YOUTUBE_API_SERVICE_NAME = 'youtube'
YOUTUBE_API_VERSION = 'v3'


# ---------- Filename parser ----------

def parse_lesson_filename(basename: str) -> tuple[int, int, str]:
    """
    Parse a Lesson_{MN}__{title}.mp4 basename into (module, lesson, slug).

    Raises ValueError if the basename does not match the expected pattern.

    >>> parse_lesson_filename("Lesson_11__Welcome.mp4")
    (1, 1, 'Welcome')
    >>> parse_lesson_filename("Lesson_54__How_to_Customize.mp4")
    (5, 4, 'How_to_Customize')
    >>> parse_lesson_filename("Lesson_103__Book_Your_Support_Call.mp4")
    (10, 3, 'Book_Your_Support_Call')
    """
    match = LESSON_FILENAME_RE.match(basename)
    if not match:
        raise ValueError(f"Filename does not match Lesson_NN__Title.mp4 pattern: {basename}")

    digits, slug = match.groups()
    if len(digits) < 2:
        raise ValueError(f"Lesson digits too short (need at least 2): {basename}")

    lesson = int(digits[-1])
    module = int(digits[:-1])

    if not (1 <= lesson <= 4):
        raise ValueError(f"Lesson out of range 1-4: {basename}")
    if not (1 <= module <= 10):
        raise ValueError(f"Module out of range 1-10: {basename}")

    return module, lesson, slug


# ---------- OAuth token broker ----------

def fetch_access_token(worker_base_url: str, worker_auth_header: str) -> str:
    """
    Call the Worker token-broker route to get a fresh YouTube access token.

    worker_auth_header: the full value of the Authorization header the Worker
    expects (e.g., "Bearer <session-token>"). Read from .env.
    """
    url = f"{worker_base_url.rstrip('/')}/v1/youtube/access-token"
    resp = requests.post(
        url,
        headers={'Authorization': worker_auth_header, 'Content-Type': 'application/json'},
        json={},
        timeout=15,
    )
    if resp.status_code != 200:
        raise RuntimeError(
            f"Worker token broker returned {resp.status_code}: {resp.text}"
        )
    data = resp.json()
    if 'access_token' not in data:
        raise RuntimeError(f"Worker response missing access_token: {data}")
    return data['access_token']


# ---------- YouTube upload ----------

def build_youtube_client(access_token: str):
    """Build an authenticated YouTube Data API v3 client from a bare access token."""
    creds = OAuth2Credentials(token=access_token, scopes=YOUTUBE_API_SCOPES)
    return build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION, credentials=creds, cache_discovery=False)


def upload_video(
    youtube,
    video_path: Path,
    title: str,
    description: str,
    tags: list,
    privacy_status: str,
    category_id: str = '27',  # 27 = Education
) -> str:
    """Upload a single video file to YouTube. Returns the video ID on success."""
    body = {
        'snippet': {
            'title': title,
            'description': description,
            'tags': tags,
            'categoryId': category_id,
        },
        'status': {
            'privacyStatus': privacy_status,
            'selfDeclaredMadeForKids': False,
        },
    }

    media = MediaFileUpload(str(video_path), mimetype='video/mp4', resumable=True, chunksize=8 * 1024 * 1024)
    request = youtube.videos().insert(part=','.join(body.keys()), body=body, media_body=media)

    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            pct = int(status.progress() * 100)
            print(f"    upload progress: {pct}%", end='\r', flush=True)
    print()

    return response['id']


# ---------- Manifest I/O ----------

def load_manifest(path: Path) -> dict:
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_manifest(path: Path, manifest: dict) -> None:
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
        f.write('\n')


def find_row_for_file(manifest: dict, module: int, lesson: int) -> Optional[dict]:
    for row in manifest['videos']:
        if row['module'] == module and row['lesson'] == lesson:
            return row
    return None


# ---------- ZIP extraction ----------

def extract_zip_to_temp(zip_path: Path) -> Path:
    """Extract the ZIP to a fresh temp directory. Returns the temp dir path."""
    tmp_dir = Path(tempfile.mkdtemp(prefix='heygen_extract_'))
    print(f"Extracting {zip_path} -> {tmp_dir}")
    with zipfile.ZipFile(zip_path, 'r') as z:
        z.extractall(tmp_dir)
    return tmp_dir


def find_video_files(extracted_dir: Path) -> list:
    """Find all .mp4 files under the extracted ZIP directory tree."""
    return sorted(extracted_dir.rglob('*.mp4'))


# ---------- Main orchestration ----------

def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--manifest', required=True, type=Path, help='Path to uploads manifest JSON')
    parser.add_argument('--zip', required=True, type=Path, help='Path to HeyGen project ZIP')
    parser.add_argument('--dry-run', action='store_true', help='Parse + plan without uploading')
    parser.add_argument('--module', type=int, help='Limit to a specific module (1-10)')
    parser.add_argument('--lesson', type=int, help='Limit to a specific lesson within the module (1-4)')
    parser.add_argument('--keep-zip', action='store_true', help='Do not delete the ZIP after successful uploads')
    args = parser.parse_args()

    load_dotenv()
    worker_base_url = os.environ.get('WORKER_BASE_URL', '').strip()
    worker_auth_header = os.environ.get('WORKER_AUTH_HEADER', '').strip()
    if not args.dry_run:
        if not worker_base_url or not worker_auth_header:
            print("ERROR: WORKER_BASE_URL and WORKER_AUTH_HEADER must be set in .env", file=sys.stderr)
            return 2

    if not args.manifest.exists():
        print(f"ERROR: manifest not found: {args.manifest}", file=sys.stderr)
        return 2
    if not args.zip.exists():
        print(f"ERROR: ZIP not found: {args.zip}", file=sys.stderr)
        return 2

    manifest = load_manifest(args.manifest)

    extract_dir = extract_zip_to_temp(args.zip)
    try:
        videos = find_video_files(extract_dir)
        print(f"Found {len(videos)} .mp4 files in extracted ZIP")

        plan = []
        for vp in videos:
            try:
                module, lesson, slug = parse_lesson_filename(vp.name)
            except ValueError as e:
                print(f"  SKIP unparseable: {vp.name} ({e})")
                continue

            row = find_row_for_file(manifest, module, lesson)
            if row is None:
                print(f"  SKIP no manifest row: M{module}L{lesson} ({vp.name})")
                continue

            if args.module and module != args.module:
                continue
            if args.lesson and lesson != args.lesson:
                continue

            if row.get('youtube_url'):
                print(f"  SKIP already uploaded: M{module}L{lesson} -> {row['youtube_url']}")
                continue

            if '[LESSON_TITLE_PLACEHOLDER]' in row.get('lesson_title', ''):
                print(f"  HALT lesson title placeholder unfilled for M{module}L{lesson}", file=sys.stderr)
                return 3

            plan.append((vp, module, lesson, row))

        print(f"\nPlan: {len(plan)} videos to upload")
        for vp, m, l, row in plan:
            print(f"  M{m}L{l}: {row['youtube_title']} <- {vp.name}")

        if args.dry_run:
            print("\nDry run complete. No uploads performed.")
            return 0

        if not plan:
            print("\nNothing to upload. Exiting.")
            return 0

        print("\nFetching access token from Worker token broker...")
        access_token = fetch_access_token(worker_base_url, worker_auth_header)
        youtube = build_youtube_client(access_token)

        successes = 0
        failures = []
        for vp, module, lesson, row in plan:
            print(f"\nUploading M{module}L{lesson}: {row['youtube_title']}")
            try:
                video_id = upload_video(
                    youtube,
                    video_path=vp,
                    title=row['youtube_title'],
                    description=row['youtube_description'],
                    tags=row.get('tags', []),
                    privacy_status=row.get('privacy_status', 'private'),
                )
                youtube_url = f"https://youtu.be/{video_id}"
                row['youtube_video_id'] = video_id
                row['youtube_url'] = youtube_url
                save_manifest(args.manifest, manifest)
                print(f"  OK -> {youtube_url}")
                successes += 1
            except Exception as e:
                print(f"  FAIL: {e}", file=sys.stderr)
                failures.append((module, lesson, str(e)))

        print(f"\n=== Summary ===")
        print(f"Succeeded: {successes}")
        print(f"Failed:    {len(failures)}")
        for m, l, err in failures:
            print(f"  M{m}L{l}: {err}")

        all_uploaded = all(r.get('youtube_url') for r in manifest['videos'])
        if all_uploaded and not args.keep_zip:
            print(f"\nAll videos uploaded successfully. Deleting ZIP at {args.zip}")
            args.zip.unlink()
        elif all_uploaded and args.keep_zip:
            print(f"\nAll videos uploaded successfully. ZIP retained at {args.zip} (--keep-zip)")
        else:
            print(f"\nNot all videos uploaded. ZIP retained at {args.zip}")

        return 0 if not failures else 1

    finally:
        print(f"\nCleaning up temp extraction dir: {extract_dir}")
        shutil.rmtree(extract_dir, ignore_errors=True)


if __name__ == '__main__':
    sys.exit(main())
