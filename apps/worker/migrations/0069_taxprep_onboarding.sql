-- Migration 0069: TPP onboarding D1 projection
-- Backs POST /v1/taxprep/onboarding (apps/worker/src/index.js).
-- Per canonical-api.md §1, this is the only TPP Worker route.

CREATE TABLE IF NOT EXISTS taxprep_onboarding (
  event_id TEXT PRIMARY KEY,
  submitted_at TEXT NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  firm_name TEXT NOT NULL,
  category TEXT NOT NULL,
  sd_company_uid TEXT,
  sd_contact_uid TEXT,
  ip_hash TEXT
);

CREATE INDEX IF NOT EXISTS idx_taxprep_onboarding_submitted_at ON taxprep_onboarding(submitted_at);
CREATE INDEX IF NOT EXISTS idx_taxprep_onboarding_email ON taxprep_onboarding(email);
CREATE INDEX IF NOT EXISTS idx_taxprep_onboarding_category ON taxprep_onboarding(category);
