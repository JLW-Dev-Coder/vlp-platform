-- Migration: tcvlp_claim_pages
-- Additional branded claim pages (slugs) owned by a tax pro.
-- The primary slug lives on tcvlp_pros.slug; this table stores extras
-- (Unlimited Claim Pages — Professional/Firm tier feature).

CREATE TABLE IF NOT EXISTS tcvlp_claim_pages (
  page_id TEXT PRIMARY KEY,
  pro_id TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT,
  description TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  active INTEGER DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_tcvlp_claim_pages_pro_id ON tcvlp_claim_pages(pro_id);
CREATE INDEX IF NOT EXISTS idx_tcvlp_claim_pages_slug ON tcvlp_claim_pages(slug);
