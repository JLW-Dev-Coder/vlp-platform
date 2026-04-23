CREATE TABLE IF NOT EXISTS tttmp_game_plays (
  play_id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  game_slug TEXT NOT NULL,
  grant_id TEXT NOT NULL,
  tokens_cost INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tttmp_game_plays_account
  ON tttmp_game_plays(account_id, created_at DESC);
