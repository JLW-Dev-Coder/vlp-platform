CREATE TABLE IF NOT EXISTS tcvlp_guide_leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  ip_hash TEXT
);

CREATE INDEX IF NOT EXISTS idx_tcvlp_guide_leads_email ON tcvlp_guide_leads(email);
CREATE INDEX IF NOT EXISTS idx_tcvlp_guide_leads_created_at ON tcvlp_guide_leads(created_at);
