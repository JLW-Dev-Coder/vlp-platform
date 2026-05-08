#!/usr/bin/env node
/**
 * Phase 2.5 — Re-title 12 TPPSG YouTube videos to align module slots with LMS.
 *
 * Mapping:
 *   current module 7 (Phase 7 — File)            -> new module 8
 *   current module 8 (Phase 8 — Deliver + Close) -> new module 9
 *   current module 9 (Phase 6 — E-Sign)          -> new module 7
 *
 * For each affected row this script:
 *   1. Updates youtube_title  (M0X prefix)
 *   2. Updates youtube_description (Module XX numeric inside the
 *      "This is Lesson Y of Module XX:" line)
 *   3. Updates the "Module XX" entry in the tags array
 *
 * After all 12 API calls succeed, writes the updated manifest to disk
 * with module_titles corrected and videos sorted by (module, lesson).
 */

import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const MANIFEST_PATH = path.join(
  REPO_ROOT,
  'apps',
  'tax-prep-pro',
  'youtube',
  'uploads-tppsg.json'
);

// current module -> new module
const MODULE_REMAP = { 7: 8, 8: 9, 9: 7 };

const NEW_MODULE_TITLES = {
  '1': 'Welcome — Meet Zuri & The Order Metaphor',
  '2': 'Order: Phase 1 — Identify Taxpayer Type',
  '3': 'Order: Phase 2 — Intake Form',
  '4': 'Order: Phase 3 — Agreement',
  '5': 'Order: Phase 4 — Payment',
  '6': 'Order: Phase 5 — Prep + Review',
  '7': 'Order: Phase 6 — E-Sign',
  '8': 'Order: Phase 7 — File',
  '9': 'Order: Phase 8 — Deliver + Close',
  '10': 'Course Closer — Book Your Support Call',
};

function pad2(n) {
  return String(n).padStart(2, '0');
}

function rewriteTitle(oldTitle, newModule) {
  // "TPPSG | M07.L1: ..." -> "TPPSG | M08.L1: ..."
  return oldTitle.replace(/M\d{2}(\.L\d+:)/, `M${pad2(newModule)}$1`);
}

function rewriteDescription(oldDesc, newModule) {
  // "This is Lesson 1 of Module 09: ..." -> "This is Lesson 1 of Module 07: ..."
  return oldDesc.replace(
    /(This is Lesson \d+ of Module )\d{2}(:)/,
    `$1${pad2(newModule)}$2`
  );
}

function rewriteTags(tags, newModule) {
  return tags.map((t) =>
    /^Module \d{2}$/.test(t) ? `Module ${pad2(newModule)}` : t
  );
}

async function getYouTubeClient() {
  const workerBaseUrl = (process.env.WORKER_BASE_URL || '').trim();
  const workerAuthHeader = (process.env.WORKER_AUTH_HEADER || '').trim();
  if (!workerBaseUrl || !workerAuthHeader) {
    throw new Error('WORKER_BASE_URL and WORKER_AUTH_HEADER must be set in .env');
  }
  const tokenResp = await fetch(`${workerBaseUrl}/v1/youtube/access-token`, {
    method: 'POST',
    headers: {
      Authorization: workerAuthHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });
  if (!tokenResp.ok) {
    const body = await tokenResp.text();
    throw new Error(
      `Worker token broker failed: ${tokenResp.status} ${tokenResp.statusText} — ${body}`
    );
  }
  const { access_token } = await tokenResp.json();
  if (!access_token) {
    throw new Error('Worker token broker returned no access_token');
  }
  const oauth2Client = new OAuth2Client();
  oauth2Client.setCredentials({ access_token });
  return google.youtube({ version: 'v3', auth: oauth2Client });
}

async function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

  // Build update plan
  const plan = [];
  const updatedVideos = manifest.videos.map((row) => {
    if (!(row.module in MODULE_REMAP)) {
      return row; // unchanged
    }
    const newModule = MODULE_REMAP[row.module];
    const newRow = {
      ...row,
      module: newModule,
      youtube_title: rewriteTitle(row.youtube_title, newModule),
      youtube_description: rewriteDescription(row.youtube_description, newModule),
      tags: rewriteTags(row.tags, newModule),
    };
    plan.push({
      videoId: row.youtube_video_id,
      oldModule: row.module,
      newModule,
      oldTitle: row.youtube_title,
      newTitle: newRow.youtube_title,
      newDescription: newRow.youtube_description,
      tags: newRow.tags,
    });
    return newRow;
  });

  if (plan.length !== 12) {
    throw new Error(`Expected 12 affected rows, got ${plan.length}`);
  }

  console.log(`Plan: ${plan.length} videos to update.`);

  const youtube = await getYouTubeClient();

  const succeeded = [];
  const failed = [];

  for (const item of plan) {
    try {
      await youtube.videos.update({
        part: ['snippet'],
        requestBody: {
          id: item.videoId,
          snippet: {
            title: item.newTitle,
            description: item.newDescription,
            categoryId: '27',
            tags: item.tags,
            defaultLanguage: 'en',
          },
        },
      });
      succeeded.push(item.videoId);
      console.log(`OK  ${item.videoId}  M${pad2(item.oldModule)} -> M${pad2(item.newModule)}  ${item.newTitle}`);
    } catch (err) {
      failed.push({ videoId: item.videoId, error: err?.message || String(err) });
      console.error(`FAIL ${item.videoId}: ${err?.message || err}`);
      break;
    }
  }

  if (failed.length > 0) {
    console.error('\nAborting before manifest write due to API failure.');
    console.error(`Succeeded (${succeeded.length}):`, succeeded);
    console.error('Failed:', failed);
    process.exit(1);
  }

  // Sort videos by (module, lesson)
  updatedVideos.sort((a, b) => a.module - b.module || a.lesson - b.lesson);

  const newManifest = {
    ...manifest,
    module_titles: NEW_MODULE_TITLES,
    videos: updatedVideos,
  };

  fs.writeFileSync(
    MANIFEST_PATH,
    JSON.stringify(newManifest, null, 2) + '\n',
    'utf8'
  );

  console.log(`\nAll 12 video updates succeeded. Manifest written: ${MANIFEST_PATH}`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
