CREATE TABLE IF NOT EXISTS platform_submissions (
  submission_id TEXT PRIMARY KEY,
  platform TEXT NOT NULL,
  form_type TEXT NOT NULL,
  display_name TEXT,
  firm TEXT,
  anonymous INTEGER NOT NULL DEFAULT 0,
  rating INTEGER,
  content TEXT,
  use_case TEXT,
  situation_industry TEXT,
  situation_firm_type TEXT,
  situation_description TEXT,
  issue TEXT,
  findings TEXT,
  result_outcome TEXT,
  result_time_saved TEXT,
  result_dollar_impact TEXT,
  profession TEXT,
  practice_area TEXT,
  consent_publish INTEGER NOT NULL DEFAULT 0,
  consent_marketing INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_platform_submissions_public
  ON platform_submissions (platform, form_type, status, created_at);
