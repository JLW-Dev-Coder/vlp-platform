-- Add campaign post columns to social_posts (idempotent via IF NOT EXISTS check)
-- SQLite does not support ADD COLUMN IF NOT EXISTS natively, so we use
-- a conditional approach: create the columns only if they don't already exist.
-- Wrapping in a transaction for safety.

-- New columns on social_posts for campaign posts
ALTER TABLE social_posts ADD COLUMN linkedin_body TEXT;
ALTER TABLE social_posts ADD COLUMN fb_body TEXT;
ALTER TABLE social_posts ADD COLUMN linkedin_url TEXT;
ALTER TABLE social_posts ADD COLUMN fb_url TEXT;
ALTER TABLE social_posts ADD COLUMN scheduled_date TEXT;
ALTER TABLE social_posts ADD COLUMN status TEXT DEFAULT 'draft';
ALTER TABLE social_posts ADD COLUMN canva_direction TEXT;
ALTER TABLE social_posts ADD COLUMN theme TEXT;
ALTER TABLE social_posts ADD COLUMN headline TEXT;
ALTER TABLE social_posts ADD COLUMN campaign_id TEXT;

CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_posts(status);
CREATE INDEX IF NOT EXISTS idx_social_posts_scheduled ON social_posts(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_social_posts_campaign_id ON social_posts(campaign_id);

-- Social outreach tracking table
CREATE TABLE IF NOT EXISTS social_outreach (
  outreach_id TEXT PRIMARY KEY,
  prospect_email TEXT,
  prospect_name TEXT,
  linkedin_url TEXT,
  message_template TEXT,
  message_sent TEXT,
  status TEXT DEFAULT 'sent',
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_outreach_status ON social_outreach(status);
CREATE INDEX IF NOT EXISTS idx_outreach_email ON social_outreach(prospect_email);
CREATE INDEX IF NOT EXISTS idx_outreach_created ON social_outreach(created_at);
