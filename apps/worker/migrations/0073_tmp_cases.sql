CREATE TABLE IF NOT EXISTS tmp_cases (
  case_id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  professional_id TEXT,
  client_name TEXT,
  client_ssn_last4 TEXT,
  client_address TEXT,
  client_city TEXT,
  client_state TEXT,
  client_zip TEXT,
  client_phone TEXT,
  tax_years TEXT,
  tax_matters TEXT,
  status TEXT DEFAULT 'open',
  esign_2848_complete INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_tmp_cases_account_id ON tmp_cases(account_id);
CREATE INDEX IF NOT EXISTS idx_tmp_cases_professional_id ON tmp_cases(professional_id);
