-- Social posts tracker for Scale dashboard
CREATE TABLE IF NOT EXISTS social_posts (
  post_id TEXT PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  campaign_day INTEGER,
  campaign_name TEXT,
  post_type TEXT DEFAULT 'organic',
  content_preview TEXT,
  notes TEXT,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_social_posts_platform ON social_posts(platform);
CREATE INDEX IF NOT EXISTS idx_social_posts_campaign ON social_posts(campaign_name);
CREATE INDEX IF NOT EXISTS idx_social_posts_created ON social_posts(created_at);
