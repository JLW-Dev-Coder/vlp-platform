#!/usr/bin/env node
/**
 * YouTube batch description update from manifest.
 *
 * Reads a manifest JSON (same shape as tools/youtube-upload manifests), matches
 * each entry to a live YouTube video (by youtube_video_id if present, else by
 * fuzzy title match), and updates the description via videos.update with
 * part=snippet. All other snippet fields (title, tags, categoryId,
 * defaultLanguage) are preserved by reading the current snippet first and
 * echoing the unchanged fields back — videos.update with part=snippet replaces
 * the entire snippet, so dropping any field would clear or break the video.
 *
 * OAuth flow: identical to tools/youtube-upload/upload.js — POSTs to
 * {WORKER_BASE_URL}/v1/youtube/access-token with WORKER_AUTH_HEADER. No OAuth
 * credentials live on the operator's machine.
 *
 * Usage:
 *   node fix-descriptions.js <MANIFEST_PATH> <CHANNEL_ID>
 *
 * Env (loaded via dotenv from the local .env or tools/youtube-upload/.env):
 *   WORKER_BASE_URL
 *   WORKER_AUTH_HEADER
 */

import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
if (!process.env.WORKER_BASE_URL || !process.env.WORKER_AUTH_HEADER) {
  const sharedEnv = path.resolve(__dirname, '..', 'youtube-upload', '.env');
  if (fs.existsSync(sharedEnv)) {
    const text = fs.readFileSync(sharedEnv, 'utf-8');
    for (const line of text.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      const key = m[1];
      let val = m[2];
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

const YT_API = 'https://www.googleapis.com/youtube/v3';

async function fetchAccessToken(workerBaseUrl, workerAuthHeader) {
  const url = `${workerBaseUrl.replace(/\/$/, '')}/v1/youtube/access-token`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: workerAuthHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Worker token broker returned ${resp.status}: ${text}`);
  }
  const data = await resp.json();
  if (!data.access_token) {
    throw new Error(`Worker response missing access_token: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

async function ytGet(accessToken, ytPath, params) {
  const qs = new URLSearchParams(params).toString();
  const url = `${YT_API}${ytPath}?${qs}`;
  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`GET ${ytPath} -> ${resp.status}: ${text}`);
  }
  return resp.json();
}

async function ytPut(accessToken, ytPath, params, body) {
  const qs = new URLSearchParams(params).toString();
  const url = `${YT_API}${ytPath}?${qs}`;
  const resp = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`PUT ${ytPath} -> ${resp.status}: ${text}`);
  }
  return resp.json();
}

async function listChannelVideos(accessToken, channelId) {
  const out = [];
  let pageToken;
  do {
    const params = {
      part: 'snippet',
      channelId,
      type: 'video',
      maxResults: '50',
      order: 'date',
    };
    if (pageToken) params.pageToken = pageToken;
    const data = await ytGet(accessToken, '/search', params);
    for (const item of data.items || []) {
      if (item.id && item.id.videoId) {
        out.push({ videoId: item.id.videoId, title: item.snippet?.title || '' });
      }
    }
    pageToken = data.nextPageToken;
  } while (pageToken);
  return out;
}

async function getVideoSnippet(accessToken, videoId) {
  const data = await ytGet(accessToken, '/videos', {
    part: 'snippet',
    id: videoId,
  });
  if (!data.items || data.items.length === 0) {
    throw new Error(`Video not found: ${videoId}`);
  }
  return data.items[0].snippet;
}

async function updateDescription(accessToken, videoId, currentSnippet, newDescription) {
  // CRITICAL: videos.update with part=snippet replaces the entire snippet.
  // Echo back title, tags, categoryId, and defaultLanguage so we don't wipe
  // them. categoryId is required — omitting it makes the API reject the call.
  const newSnippet = {
    title: currentSnippet.title,
    description: newDescription,
    categoryId: currentSnippet.categoryId,
  };
  if (Array.isArray(currentSnippet.tags)) newSnippet.tags = currentSnippet.tags;
  if (currentSnippet.defaultLanguage) newSnippet.defaultLanguage = currentSnippet.defaultLanguage;
  if (currentSnippet.defaultAudioLanguage) newSnippet.defaultAudioLanguage = currentSnippet.defaultAudioLanguage;
  await ytPut(accessToken, '/videos', { part: 'snippet' }, {
    id: videoId,
    snippet: newSnippet,
  });
}

function findManifestVideos(manifest) {
  // Accept either an array of entries or an object with a `videos` array
  // (the shape used by tools/youtube-upload manifests).
  if (Array.isArray(manifest)) return manifest;
  if (Array.isArray(manifest.videos)) return manifest.videos;
  throw new Error('Manifest has no recognizable videos array (expected top-level array or a `videos` property)');
}

function normalizeTitle(s) {
  return (s || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function findMatch(entry, liveVideos) {
  if (entry.youtube_video_id) {
    const direct = liveVideos.find((v) => v.videoId === entry.youtube_video_id);
    if (direct) return { match: direct, via: 'video_id' };
  }
  const manifestTitle = entry.youtube_title || entry.title || '';
  if (!manifestTitle) return { match: null, via: null };
  const needle = normalizeTitle(manifestTitle);
  const candidates = liveVideos.filter((v) => {
    const yt = normalizeTitle(v.title);
    return yt.includes(needle) || needle.includes(yt);
  });
  if (candidates.length === 0) return { match: null, via: null };
  if (candidates.length > 1) return { match: null, via: 'ambiguous', candidates };
  return { match: candidates[0], via: 'title' };
}

async function main() {
  const manifestPath = process.argv[2];
  const channelId = process.argv[3];
  if (!manifestPath || !channelId) {
    console.error('Usage: node fix-descriptions.js <MANIFEST_PATH> <CHANNEL_ID>');
    console.error('Example: node fix-descriptions.js apps/tax-prep-pro/youtube/uploads-tppsg.json UC6rGo0nvKtHxDhbDBcPPMEw');
    process.exit(2);
  }

  const workerBaseUrl = (process.env.WORKER_BASE_URL || '').trim();
  const workerAuthHeader = (process.env.WORKER_AUTH_HEADER || '').trim();
  if (!workerBaseUrl || !workerAuthHeader) {
    console.error('ERROR: WORKER_BASE_URL and WORKER_AUTH_HEADER must be set in .env');
    console.error('  (this tool falls back to tools/youtube-upload/.env)');
    process.exit(2);
  }

  const absManifest = path.resolve(manifestPath);
  if (!fs.existsSync(absManifest)) {
    console.error(`ERROR: manifest not found: ${absManifest}`);
    process.exit(2);
  }

  const manifest = JSON.parse(fs.readFileSync(absManifest, 'utf-8'));
  const entries = findManifestVideos(manifest);
  console.log(`Loaded manifest: ${absManifest}`);
  console.log(`  ${entries.length} entries`);

  console.log('Fetching access token from Worker token broker...');
  const accessToken = await fetchAccessToken(workerBaseUrl, workerAuthHeader);

  console.log(`Listing all videos on channel ${channelId}...`);
  const liveVideos = await listChannelVideos(accessToken, channelId);
  console.log(`  Found ${liveVideos.length} videos on channel`);

  let matched = 0;
  let updated = 0;
  let skippedNoDesc = 0;
  const noMatch = [];
  const ambiguous = [];
  const errors = [];

  for (const entry of entries) {
    const label = entry.youtube_title || entry.title || `(M${entry.module}L${entry.lesson})`;
    if (!entry.youtube_description) {
      console.log(`  SKIP no youtube_description: ${label}`);
      skippedNoDesc++;
      continue;
    }
    const { match, via, candidates } = findMatch(entry, liveVideos);
    if (!match) {
      if (via === 'ambiguous') {
        console.log(`  AMBIGUOUS ${label} -> ${candidates.length} candidates`);
        ambiguous.push(label);
      } else {
        console.log(`  NO MATCH ${label}`);
        noMatch.push(label);
      }
      continue;
    }
    matched++;
    try {
      const currentSnippet = await getVideoSnippet(accessToken, match.videoId);
      if (currentSnippet.description === entry.youtube_description) {
        console.log(`  SKIP already up-to-date (${via}): ${match.videoId} | ${label}`);
        continue;
      }
      await updateDescription(accessToken, match.videoId, currentSnippet, entry.youtube_description);
      console.log(`  OK   updated (${via}): ${match.videoId} | ${label}`);
      updated++;
    } catch (e) {
      console.error(`  FAIL ${match.videoId} | ${label}: ${e.message}`);
      errors.push({ videoId: match.videoId, label, error: e.message });
    }
  }

  console.log('\n=== Summary ===');
  console.log(`Manifest entries:        ${entries.length}`);
  console.log(`Skipped (no description): ${skippedNoDesc}`);
  console.log(`Matched:                 ${matched}`);
  console.log(`Updated:                 ${updated}`);
  console.log(`No match:                ${noMatch.length}`);
  console.log(`Ambiguous:               ${ambiguous.length}`);
  console.log(`Errors:                  ${errors.length}`);
  for (const t of noMatch) console.log(`  NO MATCH: ${t}`);
  for (const t of ambiguous) console.log(`  AMBIGUOUS: ${t}`);
  for (const e of errors) console.log(`  ERROR ${e.videoId}: ${e.error}`);

  process.exit(errors.length === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
