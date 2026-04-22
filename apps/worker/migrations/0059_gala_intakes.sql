CREATE TABLE IF NOT EXISTS gala_intakes (
  intake_id TEXT PRIMARY KEY,
  submitted_at TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  contact_pref TEXT NOT NULL,
  penalty_type TEXT NOT NULL,
  tax_years TEXT NOT NULL,
  amount TEXT,
  status TEXT DEFAULT 'pending'
);
