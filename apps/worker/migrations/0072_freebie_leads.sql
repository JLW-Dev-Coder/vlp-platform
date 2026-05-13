CREATE TABLE IF NOT EXISTS freebie_leads (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  platform TEXT NOT NULL,
  qualifier_question TEXT,
  qualifier_answer TEXT,
  freebie_type TEXT NOT NULL,
  drip_email1_sent_at TEXT,
  drip_email2_sent_at TEXT,
  drip_email3_sent_at TEXT,
  drip_unsubscribed INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  source TEXT DEFAULT 'exit_intent'
);

CREATE INDEX IF NOT EXISTS idx_freebie_leads_email_platform ON freebie_leads(email, platform);
CREATE INDEX IF NOT EXISTS idx_freebie_leads_platform ON freebie_leads(platform);
