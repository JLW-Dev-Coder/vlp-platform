CREATE TABLE IF NOT EXISTS tttmp_vesperi_intake (
  intake_id TEXT PRIMARY KEY,
  submitted_at TEXT NOT NULL,
  email TEXT NOT NULL,
  audience TEXT NOT NULL,
  topic TEXT NOT NULL,
  source_node TEXT NOT NULL,
  utm_source TEXT,
  utm_medium TEXT,
  status TEXT DEFAULT 'captured'
);

CREATE INDEX IF NOT EXISTS idx_tttmp_vesperi_intake_email ON tttmp_vesperi_intake(email);
CREATE INDEX IF NOT EXISTS idx_tttmp_vesperi_intake_submitted ON tttmp_vesperi_intake(submitted_at);
