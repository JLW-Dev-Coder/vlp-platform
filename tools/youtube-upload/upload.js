#!/usr/bin/env node
/**
 * YouTube batch uploader for VLP training video courses.
 *
 * Reads a manifest JSON file, extracts videos from a ZIP archive, uploads each
 * to YouTube via the Data API v3, captures the resulting video URL back into
 * the manifest, and (on full success) deletes the source ZIP.
 *
 * OAuth flow:
 *   - Tokens are stored in the Worker's ENRICHMENT_KV namespace under key
 *     youtube:oauth:tokens, seeded by the SCALE YouTube OAuth callback.
 *   - This script POSTs to {WORKER_BASE_URL}/v1/youtube/access-token to get a
 *     fresh access token. The Worker handles the refresh-token grant
 *     internally via getFreshYouTubeOAuthToken().
 *   - No OAuth credentials live on the operator's machine.
 *
 * Filename parser (per Phase 1 ZIP inspection):
 *   Pattern: ^Lesson_(\d+)__(.+)\.mp4$
 *   The captured digits encode module + lesson positionally:
 *     - Last digit  = lesson (1-4)
 *     - Preceding digits = module (1-10)
 *
 * Usage:
 *   node upload.js --manifest path/to/uploads-tppsg.json \
 *                  --zip path/to/heygen_project.zip \
 *                  [--dry-run] [--module N] [--lesson N] [--keep-zip]
 *
 * The script is resumable: re-running skips rows that already have a populated
 * youtube_url.
 */

import 'dotenv/config';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { pipeline } from 'node:stream/promises';
import minimist from 'minimist';
import yauzl from 'yauzl';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const LESSON_FILENAME_RE = /^Lesson_(\d+)__(.+)\.mp4$/;

// ---------- Filename parser ----------

function parseLessonFilename(basename) {
  const match = basename.match(LESSON_FILENAME_RE);
  if (!match) {
    throw new Error(`Filename does not match Lesson_NN__Title.mp4 pattern: ${basename}`);
  }
  const [, digits, slug] = match;
  if (digits.length < 2) {
    throw new Error(`Lesson digits too short (need at least 2): ${basename}`);
  }
  const lesson = parseInt(digits.slice(-1), 10);
  const module = parseInt(digits.slice(0, -1), 10);
  if (lesson < 1 || lesson > 4) {
    throw new Error(`Lesson out of range 1-4: ${basename}`);
  }
  if (module < 1 || module > 10) {
    throw new Error(`Module out of range 1-10: ${basename}`);
  }
  return { module, lesson, slug };
}

// ---------- OAuth token broker ----------

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

function buildYouTubeClient(accessToken) {
  const oauth2Client = new OAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.youtube({ version: 'v3', auth: oauth2Client });
}

// ---------- ZIP extraction ----------

async function extractZipToTemp(zipPath) {
  const tmpDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'heygen_extract_'));
  console.log(`Extracting ${zipPath} -> ${tmpDir}`);
  return new Promise((resolve, reject) => {
    yauzl.open(zipPath, { lazyEntries: true }, (err, zipfile) => {
      if (err) return reject(err);
      zipfile.readEntry();
      zipfile.on('entry', (entry) => {
        const entryPath = path.join(tmpDir, entry.fileName);
        if (/\/$/.test(entry.fileName)) {
          // Directory entry
          fsp.mkdir(entryPath, { recursive: true }).then(() => zipfile.readEntry()).catch(reject);
        } else {
          fsp.mkdir(path.dirname(entryPath), { recursive: true }).then(() => {
            zipfile.openReadStream(entry, (err, readStream) => {
              if (err) return reject(err);
              const writeStream = fs.createWriteStream(entryPath);
              pipeline(readStream, writeStream).then(() => zipfile.readEntry()).catch(reject);
            });
          }).catch(reject);
        }
      });
      zipfile.on('end', () => resolve(tmpDir));
      zipfile.on('error', reject);
    });
  });
}

async function findVideoFiles(extractDir) {
  const out = [];
  async function walk(dir) {
    const entries = await fsp.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        await walk(full);
      } else if (e.isFile() && e.name.toLowerCase().endsWith('.mp4')) {
        out.push(full);
      }
    }
  }
  await walk(extractDir);
  return out.sort();
}

// ---------- Manifest I/O ----------

async function loadManifest(manifestPath) {
  const text = await fsp.readFile(manifestPath, 'utf-8');
  return JSON.parse(text);
}

async function saveManifest(manifestPath, manifest) {
  await fsp.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf-8');
}

function findRowForFile(manifest, module, lesson) {
  return manifest.videos.find((r) => r.module === module && r.lesson === lesson) || null;
}

// ---------- YouTube upload ----------

async function uploadVideo(youtube, { videoPath, title, description, tags, privacyStatus }) {
  const fileSize = (await fsp.stat(videoPath)).size;
  let uploaded = 0;

  const res = await youtube.videos.insert(
    {
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title,
          description,
          tags,
          categoryId: '27', // Education
        },
        status: {
          privacyStatus,
          selfDeclaredMadeForKids: false,
          embeddable: true,
        },
      },
      media: {
        body: fs.createReadStream(videoPath),
      },
    },
    {
      onUploadProgress: (evt) => {
        uploaded = evt.bytesRead;
        const pct = Math.floor((uploaded / fileSize) * 100);
        process.stdout.write(`    upload progress: ${pct}%\r`);
      },
    }
  );
  process.stdout.write('\n');
  return res.data.id;
}

// ---------- Main ----------

async function main() {
  const argv = minimist(process.argv.slice(2), {
    string: ['manifest', 'zip'],
    boolean: ['dry-run', 'keep-zip'],
    alias: { m: 'module', l: 'lesson' },
  });

  if (!argv.manifest || !argv.zip) {
    console.error('Usage: node upload.js --manifest <path> --zip <path> [--dry-run] [--module N] [--lesson N] [--keep-zip]');
    process.exit(2);
  }

  const manifestPath = path.resolve(argv.manifest);
  const zipPath = path.resolve(argv.zip);

  if (!fs.existsSync(manifestPath)) {
    console.error(`ERROR: manifest not found: ${manifestPath}`);
    process.exit(2);
  }
  if (!fs.existsSync(zipPath)) {
    console.error(`ERROR: ZIP not found: ${zipPath}`);
    process.exit(2);
  }

  const workerBaseUrl = (process.env.WORKER_BASE_URL || '').trim();
  const workerAuthHeader = (process.env.WORKER_AUTH_HEADER || '').trim();
  if (!argv['dry-run']) {
    if (!workerBaseUrl || !workerAuthHeader) {
      console.error('ERROR: WORKER_BASE_URL and WORKER_AUTH_HEADER must be set in .env');
      process.exit(2);
    }
  }

  const manifest = await loadManifest(manifestPath);
  const extractDir = await extractZipToTemp(zipPath);

  try {
    const videos = await findVideoFiles(extractDir);
    console.log(`Found ${videos.length} .mp4 files in extracted ZIP`);

    const plan = [];
    for (const vp of videos) {
      let parsed;
      try {
        parsed = parseLessonFilename(path.basename(vp));
      } catch (e) {
        console.log(`  SKIP unparseable: ${path.basename(vp)} (${e.message})`);
        continue;
      }
      const { module, lesson } = parsed;
      const row = findRowForFile(manifest, module, lesson);
      if (!row) {
        console.log(`  SKIP no manifest row: M${module}L${lesson} (${path.basename(vp)})`);
        continue;
      }
      if (argv.module && module !== Number(argv.module)) continue;
      if (argv.lesson && lesson !== Number(argv.lesson)) continue;
      if (row.youtube_url) {
        console.log(`  SKIP already uploaded: M${module}L${lesson} -> ${row.youtube_url}`);
        continue;
      }
      if ((row.lesson_title || '').includes('[LESSON_TITLE_PLACEHOLDER]')) {
        console.error(`  HALT lesson title placeholder unfilled for M${module}L${lesson}`);
        process.exit(3);
      }
      plan.push({ vp, module, lesson, row });
    }

    console.log(`\nPlan: ${plan.length} videos to upload`);
    for (const { vp, module, lesson, row } of plan) {
      console.log(`  M${module}L${lesson}: ${row.youtube_title} <- ${path.basename(vp)}`);
    }

    if (argv['dry-run']) {
      console.log('\nDry run complete. No uploads performed.');
      return;
    }

    if (plan.length === 0) {
      console.log('\nNothing to upload. Exiting.');
      return;
    }

    console.log('\nFetching access token from Worker token broker...');
    const accessToken = await fetchAccessToken(workerBaseUrl, workerAuthHeader);
    const youtube = buildYouTubeClient(accessToken);

    let successes = 0;
    const failures = [];
    for (const { vp, module, lesson, row } of plan) {
      console.log(`\nUploading M${module}L${lesson}: ${row.youtube_title}`);
      try {
        const videoId = await uploadVideo(youtube, {
          videoPath: vp,
          title: row.youtube_title,
          description: row.youtube_description,
          tags: row.tags || [],
          privacyStatus: row.privacy_status || 'private',
        });
        const youtubeUrl = `https://youtu.be/${videoId}`;
        row.youtube_video_id = videoId;
        row.youtube_url = youtubeUrl;
        await saveManifest(manifestPath, manifest);
        console.log(`  OK -> ${youtubeUrl}`);
        successes++;
      } catch (e) {
        console.error(`  FAIL: ${e.message}`);
        failures.push({ module, lesson, error: e.message });
      }
    }

    console.log('\n=== Summary ===');
    console.log(`Succeeded: ${successes}`);
    console.log(`Failed:    ${failures.length}`);
    for (const f of failures) console.log(`  M${f.module}L${f.lesson}: ${f.error}`);

    const allUploaded = manifest.videos.every((r) => r.youtube_url);
    if (allUploaded && !argv['keep-zip']) {
      console.log(`\nAll videos uploaded successfully. Deleting ZIP at ${zipPath}`);
      await fsp.unlink(zipPath);
    } else if (allUploaded && argv['keep-zip']) {
      console.log(`\nAll videos uploaded successfully. ZIP retained at ${zipPath} (--keep-zip)`);
    } else {
      console.log(`\nNot all videos uploaded. ZIP retained at ${zipPath}`);
    }

    process.exit(failures.length === 0 ? 0 : 1);
  } finally {
    console.log(`\nCleaning up temp extraction dir: ${extractDir}`);
    await fsp.rm(extractDir, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
