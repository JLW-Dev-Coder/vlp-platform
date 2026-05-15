# YouTube Embedding Batch Fix

Flips `embeddable: true` on all videos for a given YouTube channel.
Uses the existing Worker OAuth token broker (`getFreshYouTubeOAuthToken`).

## Usage

```powershell
node tools/youtube-embed-fix/fix-embedding.js <CHANNEL_ID>
```

Example (TPP channel):

```powershell
node tools/youtube-embed-fix/fix-embedding.js UC6rGo0nvKtHxDhbDBcPPMEw
```

## How it works

1. Fetches an OAuth access token from the Worker's token broker endpoint (`POST {WORKER_BASE_URL}/v1/youtube/access-token`), same mechanism as `tools/youtube-upload/upload.js`.
2. Calls `youtube.channels.list` to verify the channel exists.
3. Paginates through `youtube.search.list` (type=video, channelId) to collect all video IDs.
4. For each video, calls `youtube.videos.list` (part=status) to read current status.
5. If `embeddable` is already `true`, skips. Otherwise calls `youtube.videos.update` with `part=status` setting `embeddable: true` while preserving `privacyStatus`, `license`, `publicStatsViewable`, and `selfDeclaredMadeForKids` (defaults to false if missing) — dropping these would unpublish videos.
6. Logs each video ID + title + result (success/skip/error).

## Environment

Reads from `tools/youtube-upload/.env` (same dotenv file as the upload tool):

- `WORKER_BASE_URL` — base URL of the deployed Worker
- `WORKER_AUTH_HEADER` — Authorization header value used to call the Worker token broker

## Quota cost

- `search.list`: 100 units per page (50 results/page)
- `videos.list`: 1 unit per call
- `videos.update`: 50 units per call
- 40 videos ≈ 2,100 units total (well under the 10,000/day default)

## Prerequisites

- The Worker must be deployed with YouTube OAuth tokens in KV
- The OAuth token must have `youtube` or `youtube.force-ssl` scope
