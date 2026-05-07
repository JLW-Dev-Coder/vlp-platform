-- Migration: tcvlp_pros.plan default change + drop NOT NULL
-- 2026-05-07
-- Reason: column previously defined as NOT NULL DEFAULT 'tcvlp_starter'
-- (migration 0051) which silently lied about missing plan data. Race
-- condition between Stripe checkout webhook UPDATE (index.js:5224)
-- and onboarding form INSERT (index.js:17712) caused Donovan
-- Branford's tcvlp_pros row to persist with the default value despite
-- a successful Professional purchase (audit c14a887, Bug 1).
--
-- Default is removed and NOT NULL constraint dropped. Column now
-- allows NULL, and the dashboard handler at index.js:19208 (commit
-- 75d9ea5) already treats NULL as honest "unknown" state rather than
-- coercing to Starter.
--
-- SQLite does not support ALTER COLUMN to change defaults/nullability,
-- so this uses the standard table-rebuild pattern. All UNIQUE indexes
-- on tcvlp_pros are auto-generated (sqlite_autoindex_*) and recreate
-- automatically with the table definition.

CREATE TABLE tcvlp_pros_new (
  pro_id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  firm_name TEXT NOT NULL,
  display_name TEXT,
  logo_url TEXT,
  welcome_message TEXT,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT,
  plan TEXT,
  firm_phone TEXT,
  firm_website TEXT,
  notifications_enabled INTEGER NOT NULL DEFAULT 1,
  firm_email TEXT,
  firm_linkedin TEXT,
  firm_telegram TEXT
);

INSERT INTO tcvlp_pros_new (
  pro_id, account_id, slug, firm_name, display_name, logo_url,
  welcome_message, stripe_customer_id, stripe_subscription_id, status,
  created_at, updated_at, plan, firm_phone, firm_website,
  notifications_enabled, firm_email, firm_linkedin, firm_telegram
)
SELECT
  pro_id, account_id, slug, firm_name, display_name, logo_url,
  welcome_message, stripe_customer_id, stripe_subscription_id, status,
  created_at, updated_at, plan, firm_phone, firm_website,
  notifications_enabled, firm_email, firm_linkedin, firm_telegram
FROM tcvlp_pros;

DROP TABLE tcvlp_pros;

ALTER TABLE tcvlp_pros_new RENAME TO tcvlp_pros;
