#!/usr/bin/env node
/**
 * YouTube batch embedding fix.
 *
 * For a given channel, lists every video and flips status.embeddable=true via
 * videos.update. Preserves existing privacyStatus, license, publicStatsViewable,
 * and selfDeclaredMadeForKids — videos.update is a full replace of the status
 * part, and dropping privacyStatus would unpublish public videos.
 *
 * OAuth flow: identical to tools/youtube-upload/upload.js — POSTs to
 * {WORKER_BASE_URL}/v1/youtube/access-token with WORKER_AUTH_HEADER. No OAuth
 * credentials live on the operator's machine.
 *
 * Usage:
 *   node fix-embedding.js <CHANNEL_ID>
 *
 * Example (TPP channel @taxpreppro):
 *   node fix-embedding.js UC6rGo0nvKtHxDhbDBcPPMEw
 *
 * Env (loaded via dotenv from the local .env or tools/youtube-upload/.env):
 *   WORKER_BASE_URL
 *   WORKER_AUTH_HEADER
 */

import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Fall back to the upload tool's .env so operators don't need to duplicate config.
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

async function verifyChannel(accessToken, channelId) {
  const data = await ytGet(accessToken, '/channels', {
    part: 'snippet',
    id: channelId,
  });
  if (!data.items || data.items.length === 0) {
    throw new Error(`Channel not found: ${channelId}`);
  }
  return data.items[0].snippet.title;
}

async function listChannelVideoIds(accessToken, channelId) {
  const ids = [];
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
      if (item.id && item.id.videoId) ids.push(item.id.videoId);
    }
    pageToken = data.nextPageToken;
  } while (pageToken);
  return ids;
}

async function getVideoStatus(accessToken, videoId) {
  const data = await ytGet(accessToken, '/videos', {
    part: 'status,snippet',
    id: videoId,
  });
  if (!data.items || data.items.length === 0) {
    throw new Error(`Video not found: ${videoId}`);
  }
  return {
    title: data.items[0].snippet.title,
    status: data.items[0].status,
  };
}

async function setEmbeddable(accessToken, videoId, currentStatus) {
  // CRITICAL: videos.update replaces the entire status part. Echo back every
  // existing field so we don't accidentally unpublish or relicense the video.
  const newStatus = {
    privacyStatus: currentStatus.privacyStatus,
    embeddable: true,
    selfDeclaredMadeForKids:
      typeof currentStatus.selfDeclaredMadeForKids === 'boolean'
        ? currentStatus.selfDeclaredMadeForKids
        : false,
  };
  if (currentStatus.license) newStatus.license = currentStatus.license;
  if (typeof currentStatus.publicStatsViewable === 'boolean') {
    newStatus.publicStatsViewable = currentStatus.publicStatsViewable;
  }
  if (currentStatus.madeForKids === true) {
    // If YouTube has flagged this as MFK, keep it that way.
    newStatus.selfDeclaredMadeForKids = true;
  }
  await ytPut(accessToken, '/videos', { part: 'status' }, {
    id: videoId,
    status: newStatus,
  });
}

async function main() {
  const channelId = process.argv[2];
  if (!channelId) {
    console.error('Usage: node fix-embedding.js <CHANNEL_ID>');
    console.error('Example: node fix-embedding.js UC6rGo0nvKtHxDhbDBcPPMEw');
    process.exit(2);
  }

  const workerBaseUrl = (process.env.WORKER_BASE_URL || '').trim();
  const workerAuthHeader = (process.env.WORKER_AUTH_HEADER || '').trim();
  if (!workerBaseUrl || !workerAuthHeader) {
    console.error('ERROR: WORKER_BASE_URL and WORKER_AUTH_HEADER must be set in .env');
    console.error('  (this tool falls back to tools/youtube-upload/.env)');
    process.exit(2);
  }

  console.log('Fetching access token from Worker token broker...');
  const accessToken = await fetchAccessToken(workerBaseUrl, workerAuthHeader);

  console.log(`Verifying channel ${channelId}...`);
  const channelTitle = await verifyChannel(accessToken, channelId);
  console.log(`  Channel: ${channelTitle}`);

  console.log('Listing all videos on channel...');
  const videoIds = await listChannelVideoIds(accessToken, channelId);
  console.log(`  Found ${videoIds.length} videos`);

  let skipped = 0;
  let updated = 0;
  const errors = [];

  for (const videoId of videoIds) {
    try {
      const { title, status } = await getVideoStatus(accessToken, videoId);
      if (status.embeddable === true) {
        console.log(`  SKIP ${videoId}  embeddable=true  | ${title}`);
        skipped++;
        continue;
      }
      await setEmbeddable(accessToken, videoId, status);
      console.log(`  OK   ${videoId}  embeddable: false -> true  | ${title}`);
      updated++;
    } catch (e) {
      console.error(`  FAIL ${videoId}: ${e.message}`);
      errors.push({ videoId, error: e.message });
    }
  }

  console.log('\n=== Summary ===');
  console.log(`Channel:           ${channelTitle} (${channelId})`);
  console.log(`Total videos:      ${videoIds.length}`);
  console.log(`Already embeddable: ${skipped}`);
  console.log(`Newly updated:     ${updated}`);
  console.log(`Errors:            ${errors.length}`);
  for (const e of errors) console.log(`  ${e.videoId}: ${e.error}`);

  process.exit(errors.length === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
