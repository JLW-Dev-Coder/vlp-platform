# YouTube Description Batch Update

Updates YouTube video descriptions for all videos in a manifest file.
Uses the same Worker token broker as `tools/youtube-upload/`.

## Usage

```powershell
node tools/youtube-desc-fix/fix-descriptions.js <MANIFEST_PATH> <CHANNEL_ID>
```

Example (TPP Setup Guide):
```powershell
node tools/youtube-desc-fix/fix-descriptions.js apps/tax-prep-pro/youtube/uploads-tppsg.json UC6rGo0nvKtHxDhbDBcPPMEw
```

## How it works

1. Reads the manifest JSON to get each video's expected title and description
2. Fetches an OAuth access token via the Worker token broker (`POST {WORKER_BASE_URL}/v1/youtube/access-token`)
3. Lists all videos on the channel via `youtube.search.list`
4. Matches each manifest entry to a live video. If the manifest entry has a `youtube_video_id`, that ID is used directly. Otherwise the script falls back to a fuzzy title match (manifest `youtube_title` contained within the YT title, or vice-versa)
5. For each matched video, calls `youtube.videos.list` to fetch the current snippet, then `youtube.videos.update` with `part=snippet` to set the description from the manifest
6. Preserves all other snippet fields (title, tags, categoryId, defaultLanguage)
7. Logs each video: matched/updated/skipped/error

## Quota cost

- `search.list`: 100 units per page
- `videos.list`: 1 unit per call
- `videos.update`: 50 units per call
- 40 videos ≈ 2,200 units (well under 10,000/day default)

## Env

Loaded via dotenv from the local `.env`, with fallback to `tools/youtube-upload/.env`:

- `WORKER_BASE_URL`
- `WORKER_AUTH_HEADER`
