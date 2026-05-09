-- Donovan Branford account reconciliation — phantom account cleanup
-- 2026-05-07
--
-- Phantom: ACCT_a8dfbc34-3cee-4947-92b2-be559a311450
-- Canonical: ACCT_ebdb9818-6fc3-4548-aa32-06b33231247a
--
-- The phantom row was created 2026-05-06T19:43:53Z by an unknown
-- code path during Owner's call with Donovan. It had no session,
-- no tcvlp_pros row. Donovan never used it.
--
-- This file documents the operations executed (audit trail). The
-- R2 notification object was actually written fresh today rather
-- than fetched-and-edited because the original R2 PUT in the
-- 2026-05-06 backfill run failed with "bucket does not exist"
-- (typo: virtual-launch-pro vs. virtuallaunch-pro), so the R2
-- side never had a phantom-bound object to migrate.

-- 1. Re-bind notification (D1) from phantom to canonical.
UPDATE notifications
SET account_id = 'ACCT_ebdb9818-6fc3-4548-aa32-06b33231247a'
WHERE notification_id = 'NTF_donovan_refund_2026_05_06';

-- (R2 object notifications/in-app/NTF_donovan_refund_2026_05_06.json
-- written fresh with accountId = canonical via wrangler r2 object put.)

-- 2. Delete phantom billing_customers row.
DELETE FROM billing_customers
WHERE account_id = 'ACCT_a8dfbc34-3cee-4947-92b2-be559a311450';

-- 3. Backfill canonical billing_customers row (same Stripe customer).
INSERT INTO billing_customers (account_id, stripe_customer_id, email, created_at, updated_at)
VALUES (
  'ACCT_ebdb9818-6fc3-4548-aa32-06b33231247a',
  'cus_USn2u46zPZrxpD',
  'yosefbranford@gmail.com',
  '2026-05-07T17:21:11.287Z',
  '2026-05-07T17:21:11.287Z'
);

-- 4. Confirm zero references in billing_customers, notifications, sessions
--    (all returned 0). Then delete phantom accounts row.
DELETE FROM accounts
WHERE account_id = 'ACCT_a8dfbc34-3cee-4947-92b2-be559a311450';
