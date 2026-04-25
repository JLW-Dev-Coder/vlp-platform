-- Add tier and featured columns to profiles for tier-aware directory
-- ordering and notification priority.
--
-- tier values: 'free' | 'pro' | 'scale'
-- featured: 1 when tier is 'pro' or 'scale', else 0

ALTER TABLE profiles ADD COLUMN tier TEXT NOT NULL DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN featured INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_profiles_tier ON profiles(tier);
