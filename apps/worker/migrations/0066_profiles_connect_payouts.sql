-- 0066_profiles_connect_payouts.sql
-- Add Stripe Connect account fields to profiles so pros can receive Client Pool
-- payouts. Reuses the existing /v1/affiliates/connect OAuth flow — when the
-- callback runs, it now writes both `affiliates` and `profiles` for the same
-- account_id (a pro who is also an affiliate has one connected account).
--
-- Also creates client_pool_payouts to track per-case payout attempts.

ALTER TABLE profiles ADD COLUMN stripe_connect_account_id TEXT;
ALTER TABLE profiles ADD COLUMN connect_status TEXT;

CREATE INDEX IF NOT EXISTS idx_profiles_connect_status ON profiles(connect_status);

CREATE TABLE IF NOT EXISTS client_pool_payouts (
  payout_id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL,
  professional_id TEXT NOT NULL,
  account_id TEXT,
  stripe_connect_account_id TEXT,
  amount_cents INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  stripe_transfer_id TEXT,
  failure_reason TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  completed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_client_pool_payouts_pro ON client_pool_payouts(professional_id);
CREATE INDEX IF NOT EXISTS idx_client_pool_payouts_case ON client_pool_payouts(case_id);
CREATE INDEX IF NOT EXISTS idx_client_pool_payouts_status ON client_pool_payouts(status);
