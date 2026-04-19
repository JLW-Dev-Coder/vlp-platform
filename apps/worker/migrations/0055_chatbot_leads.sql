CREATE TABLE IF NOT EXISTS chatbot_leads (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL,
  email TEXT,
  question_id TEXT,
  question_label TEXT,
  message TEXT,
  cal_booked INTEGER NOT NULL DEFAULT 0,
  source TEXT NOT NULL DEFAULT 'chatbot',
  referrer TEXT,
  user_agent TEXT,
  created_at INTEGER NOT NULL,
  r2_key TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_chatbot_leads_platform ON chatbot_leads(platform);
CREATE INDEX IF NOT EXISTS idx_chatbot_leads_created_at ON chatbot_leads(created_at);
CREATE INDEX IF NOT EXISTS idx_chatbot_leads_email ON chatbot_leads(email);
