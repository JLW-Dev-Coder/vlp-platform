# tools/youtube-upload

Local Node.js CLI for batch-uploading training videos to YouTube via the Data API v3.

## Architecture

- **YouTube OAuth integration** is shared with SCALE features in this monorepo. There is no separate refresh-token setup for the upload pipeline.
- **OAuth tokens** are stored in the Worker's `ENRICHMENT_KV` namespace under key `youtube:oauth:tokens`, seeded by the SCALE OAuth callback at `/v1/scale/youtube-oauth/callback`.
- **Worker route** at `POST /v1/youtube/access-token` reads the KV record via `getFreshYouTubeOAuthToken(env)`, refreshes the access token if stale, and returns it. Auth-gated by `requireSession + isAdminEmail`.
- **This script** calls the Worker for an access token, then uploads videos directly to YouTube from the operator's machine.

## Prerequisites

Before running uploads, confirm:

1. The SCALE YouTube OAuth flow has been run at least once (this happens automatically the first time anyone uses the SCALE YouTube features in the admin UI). If not, do that first.
2. You have a valid Worker session token for an admin email (`jamie.williams@virtuallaunch.pro` or `hello@virtuallaunch.pro`).
3. Node.js 20 or newer is installed locally.

## Setup

```powershell
cd tools/youtube-upload
npm install
copy .env.example .env
# Edit .env to set WORKER_BASE_URL (default fine) and WORKER_AUTH_HEADER
```

## Running an upload batch

```powershell
cd tools/youtube-upload
node upload.js --manifest ../../apps/tax-prep-pro/youtube/uploads-tppsg.json --zip ../../heygen_project.zip
```

### Options

- `--dry-run` — parse + plan without uploading. Verifies the ZIP, the manifest, and the filename pattern.
- `--module N` — limit to a specific module (e.g., `--module 3` uploads only Module 3 lessons).
- `--lesson N` — combined with `--module`, upload a single lesson.
- `--keep-zip` — do not delete the source ZIP after successful uploads.

### Resumability

If the script crashes mid-batch, the manifest is saved after each successful upload. Re-running skips rows that already have a populated `youtube_url`.

### ZIP deletion

After all 40 manifest rows have a populated `youtube_url`, the script deletes the source ZIP. Override with `--keep-zip` if you want to retain the archive.

## Flipping visibility (post-upload)

All 40 videos upload at `private` visibility. After QA in YouTube Studio, flip them all to public in one batch:

```powershell
node flip-visibility.js --manifest ../../apps/tax-prep-pro/youtube/uploads-tppsg.json
```

This reads `manifest.post_qa_target_visibility` (default `"public"`) and flips every uploaded video to that visibility, updating the manifest's `privacy_status` field per row.

### Options

- `--to public|unlisted|private` — override the manifest's target. Use sparingly.
- `--module N` / `--lesson N` — limit the flip to specific videos.
- `--dry-run` — list what would flip without making changes.

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

Per `canonical-youtube.md` §5.5: **Private**. Videos go up Private, get QA'd in Studio, then flipped to Public in batch via `flip-visibility.js`.

## Thumbnails

This course does not use custom thumbnails (Owner decision, Phase 1). Videos rely on YouTube's auto-generated thumbnails. If custom thumbnails are produced later, run a separate `set-thumbnails.js` pass (not yet authored).

## Compliance

- The script writes `youtube_url` and `youtube_video_id` back into the manifest. The manifest is the audit trail for what was uploaded.
- The Worker token-broker route is auth-gated. Unauthenticated callers cannot mint access tokens.
- No OAuth credentials live on the operator's machine.
