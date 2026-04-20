CREATE TABLE IF NOT EXISTS wlvlp_leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  source TEXT DEFAULT 'launch',
  created_at TEXT NOT NULL,
  UNIQUE(email, source)
);

CREATE INDEX IF NOT EXISTS idx_wlvlp_leads_email ON wlvlp_leads(email);
CREATE INDEX IF NOT EXISTS idx_wlvlp_leads_created ON wlvlp_leads(created_at);
