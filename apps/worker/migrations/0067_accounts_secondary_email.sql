-- Migration: add secondary_email column to accounts
-- 2026-05-07
-- Reason: Some users have multiple known email addresses (auth-tied
-- email + preferred contact email). Donovan Branford incident
-- (yosefbranford@gmail.com auth + dbranford@mail.com preferred)
-- exposed the gap. This column captures the secondary address for
-- outbound communications.

ALTER TABLE accounts ADD COLUMN secondary_email TEXT;
