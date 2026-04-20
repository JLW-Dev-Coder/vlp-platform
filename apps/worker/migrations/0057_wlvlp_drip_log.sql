CREATE TABLE IF NOT EXISTS wlvlp_drip_log (
  id TEXT PRIMARY KEY,
  lead_email TEXT NOT NULL,
  email_id TEXT NOT NULL,
  sent_at TEXT NOT NULL,
  UNIQUE(lead_email, email_id)
);

CREATE INDEX IF NOT EXISTS idx_wlvlp_drip_email ON wlvlp_drip_log(lead_email);
