-- Add tax credential fields to profiles for Form 2848 generation.
-- Stored at the top level of the R2 profile and projected into D1 for
-- query / lookup convenience (the 2848 case lookup reads them flat).
ALTER TABLE profiles ADD COLUMN caf_number TEXT;
ALTER TABLE profiles ADD COLUMN ptin TEXT;
ALTER TABLE profiles ADD COLUMN license_number TEXT;
