-- 0065_client_pool_funded_cases.sql
-- Extend client_pool table to support funded (paid) cases that enter the pool
-- via Stripe checkout. R2 remains authoritative: client_pool/{case_id}.json
-- Adds dispute resolution table.
--
-- Status lifecycle for paid cases:
--   funded → assigned → in_progress → completed → paid_out
--   refund_requested, disputed, refunded, resolved_partial, dispute_denied,
--   chargeback, chargebacked

ALTER TABLE client_pool ADD COLUMN service_type TEXT;
ALTER TABLE client_pool ADD COLUMN entity_type TEXT;
ALTER TABLE client_pool ADD COLUMN state TEXT;
ALTER TABLE client_pool ADD COLUMN tax_years TEXT;
ALTER TABLE client_pool ADD COLUMN taxpayer_email TEXT;
ALTER TABLE client_pool ADD COLUMN taxpayer_name TEXT;
ALTER TABLE client_pool ADD COLUMN amount_total_cents INTEGER;
ALTER TABLE client_pool ADD COLUMN platform_fee_cents INTEGER;
ALTER TABLE client_pool ADD COLUMN pro_payout_cents INTEGER;
ALTER TABLE client_pool ADD COLUMN stripe_session_id TEXT;
ALTER TABLE client_pool ADD COLUMN stripe_payment_intent_id TEXT;
ALTER TABLE client_pool ADD COLUMN claimed_by TEXT;
ALTER TABLE client_pool ADD COLUMN claimed_at TEXT;
ALTER TABLE client_pool ADD COLUMN paid_out_at TEXT;
ALTER TABLE client_pool ADD COLUMN stripe_transfer_id TEXT;

CREATE INDEX IF NOT EXISTS idx_client_pool_state ON client_pool(state);
CREATE INDEX IF NOT EXISTS idx_client_pool_created ON client_pool(created_at);
CREATE INDEX IF NOT EXISTS idx_client_pool_session ON client_pool(stripe_session_id);

CREATE TABLE IF NOT EXISTS client_pool_disputes (
  dispute_id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL,
  initiated_by TEXT NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  resolution_notes TEXT,
  refund_amount_cents INTEGER,
  pro_payout_cents INTEGER,
  stripe_refund_id TEXT,
  resolved_by TEXT,
  resolved_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_client_pool_disputes_case ON client_pool_disputes(case_id);
CREATE INDEX IF NOT EXISTS idx_client_pool_disputes_status ON client_pool_disputes(status);
