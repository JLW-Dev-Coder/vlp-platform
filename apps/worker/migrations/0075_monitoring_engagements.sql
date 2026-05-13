CREATE TABLE IF NOT EXISTS monitoring_engagements (
  engagement_id TEXT PRIMARY KEY,
  taxpayer_account_id TEXT NOT NULL,
  professional_account_id TEXT,
  tier TEXT NOT NULL,
  duration_weeks INTEGER,
  cadence_days INTEGER NOT NULL DEFAULT 7,
  started_at TEXT,
  ends_at TEXT,
  status TEXT DEFAULT 'pending_pro',
  last_upload_at TEXT,
  last_check_at TEXT,
  total_uploads INTEGER DEFAULT 0,
  total_alerts INTEGER DEFAULT 0,
  mfj_spouse INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS transcript_uploads (
  upload_id TEXT PRIMARY KEY,
  engagement_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  r2_key TEXT NOT NULL,
  parsed_result_r2_key TEXT,
  diff_r2_key TEXT,
  changes_detected INTEGER DEFAULT 0,
  uploaded_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS monitoring_alerts (
  alert_id TEXT PRIMARY KEY,
  engagement_id TEXT NOT NULL,
  upload_id TEXT,
  alert_type TEXT NOT NULL,
  description TEXT NOT NULL,
  transaction_code TEXT,
  old_value TEXT,
  new_value TEXT,
  severity TEXT DEFAULT 'info',
  notified_taxpayer INTEGER DEFAULT 0,
  notified_pro INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_engagements_taxpayer ON monitoring_engagements(taxpayer_account_id);
CREATE INDEX IF NOT EXISTS idx_engagements_pro ON monitoring_engagements(professional_account_id);
CREATE INDEX IF NOT EXISTS idx_engagements_status ON monitoring_engagements(status);
CREATE INDEX IF NOT EXISTS idx_uploads_engagement ON transcript_uploads(engagement_id);
CREATE INDEX IF NOT EXISTS idx_alerts_engagement ON monitoring_alerts(engagement_id);
