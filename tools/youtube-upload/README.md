# tools/youtube-upload

Local Python CLI for batch-uploading training videos to YouTube via the Data API v3.

## Architecture

- **OAuth refresh token** lives as a Cloudflare Worker secret (`YOUTUBE_REFRESH_TOKEN`).
- **Worker route** at `POST /v1/youtube/access-token` exchanges the refresh token for a short-lived access token.
- **This script** calls the Worker for an access token, then uploads videos directly to YouTube from the operator's machine.

The refresh token never lives on the operator's machine. Multiple machines can run uploads using the same Worker-held token.

## One-time setup

### 1. Create a Google Cloud OAuth client

This produces the `YOUTUBE_CLIENT_ID` and `YOUTUBE_CLIENT_SECRET` Worker secrets.

1. Go to https://console.cloud.google.com/
2. Create or select a project
3. Enable the YouTube Data API v3 (APIs & Services → Library → search "YouTube Data API v3" → Enable)
4. Create OAuth credentials (APIs & Services → Credentials → Create credentials → OAuth client ID)
   - Application type: Desktop app
   - Name: `vlp-youtube-uploader`
5. Download the client JSON. Note the `client_id` and `client_secret`.

### 2. Get a refresh token

One-time interactive flow on a machine with a browser. The refresh token only needs to be obtained once and is good indefinitely (until revoked).

```bash
cd tools/youtube-upload
python -m venv .venv
.venv\Scripts\activate            # Windows
# source .venv/bin/activate       # Mac/Linux
pip install -r requirements.txt
python get_refresh_token.py       # interactive: opens a browser, prints the refresh token
```

(See `get_refresh_token.py` — Owner authors this small helper. It uses `google-auth-oauthlib`'s `InstalledAppFlow` and prints the resulting refresh token to stdout.)

### 3. Set Worker secrets

```bash
cd apps/worker
wrangler secret put YOUTUBE_CLIENT_ID
wrangler secret put YOUTUBE_CLIENT_SECRET
wrangler secret put YOUTUBE_REFRESH_TOKEN
wrangler deploy
```

### 4. Configure local .env

```bash
cd tools/youtube-upload
cp .env.example .env
# Edit .env to set WORKER_BASE_URL and WORKER_AUTH_HEADER
```

## Running an upload batch

```bash
cd tools/youtube-upload
.venv\Scripts\activate
python upload.py \
  --manifest ../../apps/tax-prep-pro/youtube/uploads-tppsg.json \
  --zip ../../heygen_project.zip
```

### Options

- `--dry-run` — parse + plan without uploading. Verifies the ZIP, the manifest, and the filename pattern.
- `--module N` — limit to a specific module (e.g., `--module 3` uploads only Module 3 lessons).
- `--lesson N` — combined with `--module`, upload a single lesson.
- `--keep-zip` — do not delete the source ZIP after successful uploads.

### Resumability

If the script crashes mid-batch, the manifest is saved after each successful upload. Re-running the script skips rows that already have a populated `youtube_url`.

### ZIP deletion

After all 40 manifest rows have a populated `youtube_url`, the script deletes the source ZIP. Override with `--keep-zip` if you want to retain the archive.

## Filename pattern

Per Phase 1 ZIP inspection of `heygen_project.zip`:

```
Lesson_{MN}__{Title}.mp4
```

Where `MN` encodes module + lesson positionally:
- Last digit = lesson (1-4)
- Preceding digits = module (1-10)

Examples: `Lesson_11__...` = M1L1, `Lesson_54__...` = M5L4, `Lesson_103__...` = M10L3.

The script's parser uses a regex `^Lesson_(\d+)__(.+)\.mp4$` and validates module ∈ [1,10], lesson ∈ [1,4].

## Default upload visibility

Per `canonical-youtube.md` §5.5: **Private**. Videos go up Private, get QA'd, then flipped to Public/Unlisted in YouTube Studio.

The manifest can override per-row via `privacy_status` (`private` | `unlisted` | `public`).

## Thumbnails

This course does not use custom thumbnails (Owner decision, Phase 1). Videos rely on YouTube's auto-generated thumbnails. If custom thumbnails are produced later, run a separate `set-thumbnails.py` pass (not yet authored).

## Compliance

- The script writes `youtube_url` and `youtube_video_id` back into the manifest. The manifest is the audit trail for what was uploaded.
- The Worker token-broker route is auth-gated. Unauthenticated callers cannot mint access tokens.
- The refresh token never lives on the operator's machine.
