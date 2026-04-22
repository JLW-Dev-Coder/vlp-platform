ALTER TABLE tttmp_vesperi_intake ADD COLUMN drip_email1_sent_at TEXT;
ALTER TABLE tttmp_vesperi_intake ADD COLUMN drip_email2_sent_at TEXT;
ALTER TABLE tttmp_vesperi_intake ADD COLUMN drip_email3_sent_at TEXT;
ALTER TABLE tttmp_vesperi_intake ADD COLUMN drip_unsubscribed INTEGER DEFAULT 0;
