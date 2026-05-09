-- Donovan Branford account reconciliation — canonical account update
-- 2026-05-07
-- Sets secondary_email on accounts row.
-- Sets correct plan + Stripe IDs on tcvlp_pros row.
-- Phantom account cleanup is in a separate file (Commit 3).

UPDATE accounts
SET secondary_email = 'dbranford@mail.com',
    updated_at = '2026-05-07T17:21:11.287Z'
WHERE account_id = 'ACCT_ebdb9818-6fc3-4548-aa32-06b33231247a';

UPDATE tcvlp_pros
SET plan = 'tcvlp_professional',
    stripe_customer_id = 'cus_USn2u46zPZrxpD',
    stripe_subscription_id = 'sub_1TTrSZ9ROeyeXOqexLTlicFK',
    updated_at = '2026-05-07T17:21:11.287Z'
WHERE account_id = 'ACCT_ebdb9818-6fc3-4548-aa32-06b33231247a';
