-- Add notification fields to tcvlp_form843_submissions
ALTER TABLE tcvlp_form843_submissions ADD COLUMN notify_opt_in INTEGER NOT NULL DEFAULT 0;
ALTER TABLE tcvlp_form843_submissions ADD COLUMN notify_email TEXT;
ALTER TABLE tcvlp_form843_submissions ADD COLUMN notify_phone TEXT;
ALTER TABLE tcvlp_form843_submissions ADD COLUMN notify_preference TEXT;

-- Add notifications_enabled to tcvlp_pros (default true = 1)
ALTER TABLE tcvlp_pros ADD COLUMN notifications_enabled INTEGER NOT NULL DEFAULT 1;
