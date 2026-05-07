#!/usr/bin/env node
/**
 * 2026-05-06 — One-off refund backfill for Donovan Branford
 *
 * Why this exists:
 *   - Donovan was triple-charged $29 on TCVLP on 2026-05-05 due to a
 *     dashboard plan-display bug. Two refunds were issued via Stripe
 *     dashboard on 2026-05-06.
 *   - Stripe receipts are off at account level — customer has no
 *     confirmation of refunds without our outreach.
 *   - This script writes one in-app notification (D1 + R2, matching
 *     the POST /v1/notifications/in-app handler shape exactly) and
 *     sends one Resend email.
 *
 * Re-run safety:
 *   - D1 INSERT fails on UNIQUE constraint (notification_id PK) on
 *     second run — that's the idempotency guard.
 *   - R2 put overwrites cleanly.
 *   - Email is NOT idempotent — re-running sends another email.
 *     Don't re-run unless intentional.
 *
 * Stripe refund notes were corrected manually by Owner via dashboard
 * prior to this commit. This script does not touch Stripe.
 *
 * Reference: principal instruction rc-instruction-path-a-step1.md
 *            and follow-up Step 3 spec.
 *
 * RE-RUN HISTORY:
 * - 2026-05-06 first run: D1 succeeded, R2 failed (wrong bucket
 *   name), email never executed.
 * - 2026-05-07 reconciliation: D1 notification re-bound to canonical
 *   account, R2 object written fresh, billing_customers migrated
 *   to canonical, phantom accounts row deleted. Script edited to
 *   target canonical account_id and BOTH known email addresses
 *   for the customer-comms send.
 * - To re-run after partial failure: set SKIP_D1=true env var.
 *   The D1 row is already canonical-bound; R2 PUT is idempotent.
 */

const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

// --- Constants ---
const ACCOUNT_ID = 'ACCT_ebdb9818-6fc3-4548-aa32-06b33231247a';
const NOTIFICATION_ID = 'NTF_donovan_refund_2026_05_06';
const TITLE = 'Duplicate charges refunded';
const MESSAGE = 'We refunded two duplicate $29.00 charges from May 5. Your TaxClaim Pro Professional ($29/mo) subscription is active and unchanged. Funds will return to your card in 5–10 business days. A confirmation email has also been sent.';
const SEVERITY = 'info';
const RECIPIENT_EMAILS = ['dbranford@mail.com', 'yosefbranford@gmail.com'];
const D1_DATABASE = 'virtuallaunch-pro';
const R2_BUCKET = 'virtuallaunch-pro';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
if (!RESEND_API_KEY) {
  console.error('FATAL: RESEND_API_KEY not set in env. Aborting.');
  process.exit(1);
}

// --- Mint single timestamp used for both D1 and R2 ---
const now = new Date().toISOString();

// --- Step A: D1 INSERT ---
if (process.env.SKIP_D1 === 'true') {
  console.log('[1/3] D1 INSERT — SKIPPED (SKIP_D1=true)');
} else {
  console.log('[1/3] D1 INSERT into notifications...');
  const d1Sql = `INSERT INTO notifications (notification_id, account_id, title, message, severity, read, created_at) VALUES ('${NOTIFICATION_ID.replace(/'/g, "''")}', '${ACCOUNT_ID.replace(/'/g, "''")}', '${TITLE.replace(/'/g, "''")}', '${MESSAGE.replace(/'/g, "''")}', '${SEVERITY.replace(/'/g, "''")}', 0, '${now.replace(/'/g, "''")}');`;
  const d1TmpFile = path.join(os.tmpdir(), `donovan-d1-${Date.now()}.sql`);
  fs.writeFileSync(d1TmpFile, d1Sql, 'utf8');

  const d1Cmd = `npx wrangler d1 execute ${D1_DATABASE} --remote --file=${d1TmpFile}`;

  try {
    const d1Out = execSync(d1Cmd, { encoding: 'utf8', stdio: 'pipe' });
    console.log('  D1 OK');
    console.log('  ' + d1Out.split('\n').slice(-5).join('\n  '));
  } catch (err) {
    console.error('  D1 FAILED:', err.message);
    if (err.stderr) console.error('  stderr:', err.stderr.toString());
    fs.unlinkSync(d1TmpFile);
    process.exit(1);
  }
  fs.unlinkSync(d1TmpFile);
}

// --- Step B: R2 PUT ---
console.log('[2/3] R2 PUT notifications/in-app/' + NOTIFICATION_ID + '.json...');
const r2Body = {
  notificationId: NOTIFICATION_ID,
  accountId: ACCOUNT_ID,
  title: TITLE,
  message: MESSAGE,
  severity: SEVERITY,
  read: false,
  createdAt: now,
};
const tmpFile = path.join(os.tmpdir(), `donovan-r2-${Date.now()}.json`);
fs.writeFileSync(tmpFile, JSON.stringify(r2Body, null, 2));

const r2Cmd = `npx wrangler r2 object put ${R2_BUCKET}/notifications/in-app/${NOTIFICATION_ID}.json --file=${tmpFile} --remote`;

try {
  const r2Out = execSync(r2Cmd, { encoding: 'utf8', stdio: 'pipe' });
  console.log('  R2 OK');
  console.log('  ' + r2Out.split('\n').slice(-5).join('\n  '));
} catch (err) {
  console.error('  R2 FAILED:', err.message);
  if (err.stderr) console.error('  stderr:', err.stderr.toString());
  fs.unlinkSync(tmpFile);
  process.exit(1);
}
fs.unlinkSync(tmpFile);

// --- Step C: Resend email ---
console.log('[3/3] Resend POST /emails...');
const emailBody = {
  from: 'Virtual Launch Pro <noreply@virtuallaunch.pro>',
  to: RECIPIENT_EMAILS,
  reply_to: 'support@virtuallaunch.pro',
  subject: 'Refund issued — duplicate charges from May 5',
  html: `<p>Hi Donovan,</p>

<p>Confirming directly: we've refunded the two duplicate $29.00 charges from May 5. Funds will return to your card in 5–10 business days, depending on your bank's processing time.</p>

<p>One heads-up — our Stripe account doesn't send automatic receipt emails, so you won't get a separate notification from Stripe itself. This email is your confirmation. The refunds will also appear on your card statement once they settle.</p>

<p>Your TaxClaim Pro Professional subscription ($29/mo) is active and unchanged — full access, nothing to re-enter.</p>

<p>The duplicate-charge issue traced back to a display bug on our end: your dashboard showed an old plan label that didn't reflect your actual subscription state, which made the upgrade flow look like it hadn't worked. That's on us, and we're fixing it. Thanks for catching it quickly and giving us a clear report.</p>

<p>If you don't see the refunds settle within 10 business days, or if anything else looks off in your dashboard, just reply to this email and I'll dig in.</p>

<p>— Jamie<br>
Virtual Launch Pro</p>`,
  text: `Hi Donovan,

Confirming directly: we've refunded the two duplicate $29.00 charges from May 5. Funds will return to your card in 5-10 business days, depending on your bank's processing time.

One heads-up - our Stripe account doesn't send automatic receipt emails, so you won't get a separate notification from Stripe itself. This email is your confirmation. The refunds will also appear on your card statement once they settle.

Your TaxClaim Pro Professional subscription ($29/mo) is active and unchanged - full access, nothing to re-enter.

The duplicate-charge issue traced back to a display bug on our end: your dashboard showed an old plan label that didn't reflect your actual subscription state, which made the upgrade flow look like it hadn't worked. That's on us, and we're fixing it. Thanks for catching it quickly and giving us a clear report.

If you don't see the refunds settle within 10 business days, or if anything else looks off in your dashboard, just reply to this email and I'll dig in.

- Jamie
Virtual Launch Pro`,
};

(async () => {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailBody),
    });
    const responseText = await res.text();
    console.log('  Resend status:', res.status);
    console.log('  Resend body:', responseText);

    if (!res.ok) {
      console.error('  Resend FAILED');
      process.exit(1);
    }
    console.log('  Resend OK');
  } catch (err) {
    console.error('  Resend FAILED:', err.message);
    process.exit(1);
  }

  console.log('\n✓ All three operations complete. Donovan notified.');
})();
