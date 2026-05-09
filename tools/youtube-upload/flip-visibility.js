#!/usr/bin/env node
/**
 * Batch flip YouTube video visibility for the videos listed in a manifest.
 *
 * Reads youtube_video_id from each manifest row, calls videos.update on the
 * YouTube Data API to set the new privacyStatus, then updates the manifest's
 * privacy_status field per row.
 *
 * Usage:
 *   node flip-visibility.js --manifest path/to/uploads-tppsg.json [--to public|unlisted|private]
 *                           [--module N] [--lesson N] [--dry-run]
 *
 * Default --to value is read from manifest.post_qa_target_visibility (or "public" if absent).
 */

import 'dotenv/config';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import minimist from 'minimist';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const VALID_VISIBILITIES = new Set(['public', 'unlisted', 'private']);

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
  return data.access_token;
}

function buildYouTubeClient(accessToken) {
  const oauth2Client = new OAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.youtube({ version: 'v3', auth: oauth2Client });
}

async function main() {
  const argv = minimist(process.argv.slice(2), {
    string: ['manifest', 'to'],
    boolean: ['dry-run'],
  });

  if (!argv.manifest) {
    console.error('Usage: node flip-visibility.js --manifest <path> [--to public|unlisted|private] [--module N] [--lesson N] [--dry-run]');
    process.exit(2);
  }

  const manifestPath = path.resolve(argv.manifest);
  if (!fs.existsSync(manifestPath)) {
    console.error(`ERROR: manifest not found: ${manifestPath}`);
    process.exit(2);
  }

  const manifest = JSON.parse(await fsp.readFile(manifestPath, 'utf-8'));
  const target = (argv.to || manifest.post_qa_target_visibility || 'public').toLowerCase();
  if (!VALID_VISIBILITIES.has(target)) {
    console.error(`ERROR: --to must be one of ${[...VALID_VISIBILITIES].join('|')}`);
    process.exit(2);
  }

  const plan = [];
  for (const row of manifest.videos) {
    if (!row.youtube_video_id) {
      console.log(`  SKIP not yet uploaded: M${row.module}L${row.lesson}`);
      continue;
    }
    if (argv.module && row.module !== Number(argv.module)) continue;
    if (argv.lesson && row.lesson !== Number(argv.lesson)) continue;
    if (row.privacy_status === target) {
      console.log(`  SKIP already ${target}: M${row.module}L${row.lesson} (${row.youtube_video_id})`);
      continue;
    }
    plan.push(row);
  }

  console.log(`\nPlan: flip ${plan.length} videos to "${target}"`);
  for (const row of plan) {
    console.log(`  M${row.module}L${row.lesson}: ${row.youtube_video_id}  (${row.privacy_status} -> ${target})`);
  }

  if (argv['dry-run']) {
    console.log('\nDry run. No changes made.');
    return;
  }
  if (plan.length === 0) {
    console.log('\nNothing to flip. Exiting.');
    return;
  }

  const workerBaseUrl = (process.env.WORKER_BASE_URL || '').trim();
  const workerAuthHeader = (process.env.WORKER_AUTH_HEADER || '').trim();
  if (!workerBaseUrl || !workerAuthHeader) {
    console.error('ERROR: WORKER_BASE_URL and WORKER_AUTH_HEADER must be set in .env');
    process.exit(2);
  }

  console.log('\nFetching access token from Worker token broker...');
  const accessToken = await fetchAccessToken(workerBaseUrl, workerAuthHeader);
  const youtube = buildYouTubeClient(accessToken);

  let successes = 0;
  const failures = [];
  for (const row of plan) {
    try {
      await youtube.videos.update({
        part: ['status'],
        requestBody: {
          id: row.youtube_video_id,
          status: {
            privacyStatus: target,
            selfDeclaredMadeForKids: false,
          },
        },
      });
      row.privacy_status = target;
      await fsp.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf-8');
      console.log(`  OK M${row.module}L${row.lesson} -> ${target}`);
      successes++;
    } catch (e) {
      console.error(`  FAIL M${row.module}L${row.lesson}: ${e.message}`);
      failures.push({ module: row.module, lesson: row.lesson, error: e.message });
    }
  }

  console.log('\n=== Summary ===');
  console.log(`Flipped: ${successes}`);
  console.log(`Failed:  ${failures.length}`);
  for (const f of failures) console.log(`  M${f.module}L${f.lesson}: ${f.error}`);

  process.exit(failures.length === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
