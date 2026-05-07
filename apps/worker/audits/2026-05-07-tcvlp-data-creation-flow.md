# TCVLP user-data-creation flow audit
## 2026-05-07

Read-only audit. Maps the complete signup → checkout → entitlement provisioning
flow for TCVLP customers and identifies the structural bugs surfaced by the
2026-05-05 Donovan Branford incident (incident details: prompt §4).

Scope notes:
- Code-level analysis only. Live D1 queries via `npx wrangler d1 execute` were
  blocked by a Cloudflare API authorization error in this environment ("The
  given account is not valid or is not authorized to access this service [code:
  7403]"). All table/row claims below are derived from `apps/worker/src/index.js`
  and the Donovan incident facts already established in commits `27e4630` /
  `fa90fef` / `75d9ea5` / `8ed2121` / `c98d779`.
- The orphan-phantom census (Step 5) is therefore deferred to a follow-up that
  can run with D1 credentials.

---

## 1. Accounts INSERT surface area

Three code paths INSERT into the `accounts` table:

| # | Location | Endpoint / handler | Platform | Columns set | Guards |
|---|---|---|---|---|---|
| 1 | `apps/worker/src/index.js:1514` (helper `upsertAccount`) | Auth flows: Google OAuth callback (`:3660`), magic-link verify (`:3756`), SSO OIDC (`:3874`), SAML ACS (`:3907`), TTTMP magic-link verify (`:12640`) | hardcoded `'vlp'` | account_id, email, first_name, last_name, role='member', status='active', created_at | `ON CONFLICT(email) DO UPDATE SET first_name, last_name, updated_at` — dedupes by email |
| 2 | `apps/worker/src/index.js:5252` | `checkout.session.completed` webhook, TMP-anonymous-reconciliation branch (`platform === 'tmp' && plan_key`, when metadata.account_id is missing or 'anonymous') | hardcoded `'tmp'` | account_id, email, first_name='', last_name='', role='member', status='active', created_at | `ON CONFLICT(email) DO NOTHING`; only fires if `obj.customer_details?.email` or `obj.customer_email` is set |
| 3 | `apps/worker/src/index.js:5537` | `checkout.session.completed` webhook, WLVLP-anonymous-reconciliation branch (`platform === 'wlvlp' && obj.metadata?.slug`, when account_id missing/anonymous) | hardcoded `'wlvlp'` | account_id, email, first_name='', last_name='', role='member', status='active', created_at | `ON CONFLICT(email) DO NOTHING`; same email guard as TMP |

Additionally `upsertAccount` is called by 6 distinct auth handlers — but always
in the context of an authenticated/about-to-be-authenticated user; it is always
followed by `createSession` (which writes a row to `sessions`).

Notable structural observations:
- Sites #2 and #3 (anonymous-checkout reconciliation) intentionally do NOT call
  `createSession`. Rows from these paths will have **no corresponding session
  row** until the user later logs in via auth flow — which is by design, but
  produces a cohort of "orphan-shaped" accounts that match the Donovan-phantom
  signature (account row, no session, no per-platform entitlement row).
- There is **no TCVLP equivalent** of sites #2/#3. The TCVLP `checkout.session.completed`
  branch (line 5219) requires `account_id` to be present in metadata and does
  not run any anonymous-reconciliation fallback. So a TCVLP-specific phantom
  cannot have come from the TCVLP webhook branch.
- Site #1's `ON CONFLICT(email) DO UPDATE` does not change `platform`, so an
  auth-flow upsert against an existing row preserves whatever platform was
  initially recorded.

---

## 2. tcvlp_pros INSERT/UPDATE surface area

| Op | Location | Endpoint / handler | Columns touched | Trigger |
|---|---|---|---|---|
| INSERT | `apps/worker/src/index.js:17712` | `POST /v1/tcvlp/onboarding` | pro_id, account_id, slug, firm_name, display_name, logo_url, welcome_message, **stripe_customer_id=NULL**, **stripe_subscription_id=NULL**, status='active', created_at, updated_at, **plan** (from local Stripe-subscription lookup, defaults to `'tcvlp_starter'`), firm_phone, firm_website=NULL, firm_email, firm_linkedin, firm_telegram. `ON CONFLICT(account_id) DO UPDATE` updates slug/firm_name/display_name/logo_url/welcome_message/plan/firm_phone/firm_email/firm_linkedin/firm_telegram/updated_at — **does NOT update stripe_customer_id, stripe_subscription_id, or status** | User submits onboarding form |
| UPDATE | `apps/worker/src/index.js:5224` | webhook `checkout.session.completed`, branch `platform === 'tcvlp' && account_id` | stripe_customer_id, stripe_subscription_id, plan, status, updated_at | Stripe sends checkout.session.completed for a TCVLP checkout session |
| UPDATE | `apps/worker/src/index.js:5900` | webhook `customer.subscription.deleted` | status='inactive', updated_at; matches by `stripe_subscription_id` | Stripe sends subscription deletion |
| UPDATE | `apps/worker/src/index.js:17889` | `POST /v1/tcvlp/profile` (re-onboarding profile edit) | firm_name, display_name, welcome_message, logo_url, firm_phone, firm_email, firm_website, firm_linkedin, firm_telegram, notifications_enabled, updated_at | User edits profile |

Plan-determination logic in onboarding (lines 17631–17657):
- Reads `billing_customers.stripe_customer_id` for `account_id`.
- If found, walks active Stripe subscriptions to map a price_id → plan_key.
- Otherwise defaults to `'tcvlp_starter'`.
- `billing_customers` is populated by the `invoice.paid` webhook handler at
  `:5945+`. So this lookup only succeeds AFTER an invoice has been paid AND
  the invoice.paid handler has populated billing_customers.

---

## 3. Stripe webhook event handler coverage

Webhook handler entry: `apps/worker/src/index.js:5145`. Switch dispatch at `:5214`.

Cases handled:

| Event | Line | Touches `tcvlp_pros`? | Touches `billing_customers`? |
|---|---|---|---|
| `checkout.session.completed` | 5216 | **Yes** — UPDATE only, requires existing row matched by account_id | No |
| `customer.subscription.updated` | 5878 | No (touches memberships) | No |
| `customer.subscription.deleted` | 5894 | Yes — UPDATE status by stripe_subscription_id | No |
| `invoice.paid` | 5945 | No | Yes — populates billing_customers via stripe_customer_id |
| `invoice.payment_failed` | 6093 | No | No |
| `payment_intent.succeeded` | 6107 | No | No |
| `payment_intent.payment_failed` | 6116 | No | No |
| `charge.dispute.created` | 6124 | No | No |

**Not handled at all:**
- `customer.created`
- `customer.subscription.created`

Cross-referenced against the events Stripe fires for a successful subscription
checkout (per prompt §5 / Stripe docs): `checkout.session.completed`,
`customer.created`, `customer.subscription.created`, `invoice.paid`,
`payment_intent.succeeded`. **The only event in that set that propagates
Stripe IDs into `tcvlp_pros` is `checkout.session.completed`.** All other
events for a TCVLP subscription either short-circuit (not handled) or update
unrelated tables.

This means TCVLP-specific Stripe-ID propagation is single-pathed through one
event handler. There is no idempotent reconciliation pass.

Webhook signature verification (lines 5171–5199) accepts BOTH
`STRIPE_WEBHOOK_SECRET` and `STRIPE_WEBHOOK_SECRET_VLP`. TCVLP price IDs live
on the VLP Stripe account (per `:19279` comment), so the matching secret is
`STRIPE_WEBHOOK_SECRET_VLP`. If only one secret is set in env, signature
verification still succeeds via the loop. If neither is set, returns
400 INVALID_SIGNATURE — Stripe will retry but never succeed.

---

## 4. Donovan's row creation history

Cannot verify against live D1 in this environment. Reasoning from incident facts:

- Donovan's `tcvlp_pros` row created 2026-05-05T22:24:22Z with `plan = 'tcvlp_starter'`,
  `stripe_customer_id = NULL`, `stripe_subscription_id = NULL`. Slug, firm_name,
  display_name populated normally.
- His Stripe state (per prompt §4 Bug 1): active Pro subscription, billing
  customer existed, $29/mo Professional. So checkout completed successfully
  on Stripe's side.
- The `tcvlp_pros` shape — populated firm fields but NULL Stripe linkage — is
  the EXACT shape that the onboarding INSERT (`:17712`) produces when run with
  no prior `billing_customers` row and before `checkout.session.completed`
  has updated the row.

Most likely sequence (consistent with the row shape):

1. Donovan signs up via /v1/auth/* → `upsertAccount` creates accounts row,
   `createSession` creates session.
2. Donovan clicks "Subscribe Pro" → `POST /v1/tcvlp/checkout/sessions`
   (`:19257`) creates Stripe checkout session with metadata
   `{ account_id, platform: 'tcvlp', plan_key: 'tcvlp_professional' }`.
3. Donovan pays. Stripe fires `checkout.session.completed`.
4. Webhook handler reaches the TCVLP branch (`:5219`) and runs UPDATE
   tcvlp_pros WHERE account_id = ?. **No row exists yet** — UPDATE matches
   zero rows, no error, no log.
5. Donovan completes onboarding form → `POST /v1/tcvlp/onboarding` runs
   INSERT (`:17712`). Plan-discovery query at `:17634` looks for
   `billing_customers.stripe_customer_id` for his account_id. If
   `invoice.paid` hadn't yet populated billing_customers (or hadn't fired,
   or fired with a different ordering), the lookup fails → plan defaults
   to `'tcvlp_starter'`. INSERT writes the row with NULL Stripe IDs.

This is **a deterministic bug, not a transient one**: any TCVLP user who
completes Stripe checkout BEFORE submitting the onboarding form will
produce this exact row shape. Whether the bug fires depends solely on the
ordering of step 4 vs. step 5. The frontend onboarding flow could enforce
ordering, but the worker has no defense against the wrong ordering.

Stripe's own webhook delivery history is the authoritative record but
requires Stripe-dashboard access to retrieve. Recommend exporting it for
this account when fixing.

---

## 5. Orphan phantoms in accounts

**Deferred — D1 wrangler access denied in this environment.**

Recommended query (run with appropriate credentials):

```powershell
npx wrangler d1 execute virtuallaunch-pro --remote --command="SELECT a.account_id, a.email, a.platform, a.created_at FROM accounts a LEFT JOIN sessions s ON s.account_id = a.account_id LEFT JOIN tcvlp_pros tp ON tp.account_id = a.account_id WHERE s.session_id IS NULL AND tp.pro_id IS NULL ORDER BY a.created_at DESC"
```

Expected (false-positive) signal sources, derived from §1:
- TMP anonymous-checkout reconciliation accounts (platform='tmp')
- WLVLP anonymous-checkout reconciliation accounts (platform='wlvlp')
  In both cases, the row legitimately has no session until the user later logs in.

Genuine phantoms would have one of:
- platform='vlp' but no session AND no entitlement on any platform (cannot be
  produced by `upsertAccount` without a paired `createSession`, so any
  platform='vlp' row with no session is suspicious).
- platform='tcvlp' (NO code path writes platform='tcvlp' to accounts — Donovan's
  phantom must have been written via one of the three paths in §1 with the
  recorded platform field reflecting whichever path fired).

---

## 6. Phantom-account-creation likely pathway (ACCT_a8dfbc34-...)

Created 2026-05-06T19:43:53Z, email `dbranford@mail.com`, no session, no
tcvlp_pros, no referrer. Cleaned up in commit `27e4630`.

Constraints from §1:
- Path #1 (`upsertAccount`) always runs alongside `createSession`, so a row
  from #1 should have a session. Unless `createSession` failed mid-flow after
  `upsertAccount` succeeded — possible but only in error paths.
- Paths #2 and #3 (TMP and WLVLP anonymous checkout) explicitly skip session
  creation. They DO require a Stripe `checkout.session.completed` event with
  the correct `platform` metadata.

Plausible triggers during the 19:43:53Z call window:
1. **Stripe dashboard "Resend webhook"**: Owner viewing Donovan's payment in
   Stripe dashboard could click "Resend" on the original
   `checkout.session.completed` event. If the original event metadata had
   `platform: 'tmp'` or `platform: 'wlvlp'` (e.g. from a different prior
   purchase), it would re-trigger sites #2/#3. Donovan's email present in
   `customer_details.email` would satisfy the email guard. Result: phantom
   account at the resent-event timestamp.
2. **Owner-issued payment link / invoice**: If during the call Owner created
   any new Stripe payment object that completed with `metadata.platform`
   set to `tmp` or `wlvlp` (e.g. via a saved template), the same paths fire.
3. **Cron interaction**: WLVLP cron at 06:00 / 10:00 / 12:00 / 13:00 UTC and
   SCALE crons run on schedules that don't align with 19:43:53Z UTC; cron
   triggers on 2026-05-06 at 19:43 UTC are not configured. **Cron is not the
   trigger.**
4. **Direct D1 admin INSERT**: not in source; would require manual wrangler
   d1 execute. No evidence in repo.

Most likely: a Stripe-side action (resend webhook, manual payment, refund-
adjacent operation) during the call window fired `checkout.session.completed`
with `platform: 'tmp'` or `platform: 'wlvlp'` metadata, hitting an
anonymous-reconciliation path.

Cannot narrow further without:
- Stripe webhook delivery log around 2026-05-06T19:43:00–19:44:00Z.
- The `platform` value stored on the deleted accounts row (lost — row was
  cleaned in `27e4630`).

---

## 7. Diagnoses

### Bug 1 — Checkout → tcvlp_pros gap

**Root cause:** Single-event, order-dependent reconciliation. The
`checkout.session.completed` webhook handler at `index.js:5224` is the **only**
path that writes Stripe customer/subscription IDs and the correct plan into
`tcvlp_pros`, and it does so via `UPDATE ... WHERE account_id = ?`. If that
UPDATE runs before the onboarding INSERT exists (typical when a user pays
before completing the firm-details form), it matches zero rows, no error is
raised, and no other handler retries. The subsequent onboarding INSERT then
writes `stripe_customer_id = NULL`, `stripe_subscription_id = NULL`, and
`plan = 'tcvlp_starter'` because its plan-discovery query
(`index.js:17634`) reads `billing_customers`, which is itself only populated
by the `invoice.paid` handler — yet another race with no fallback.

Compounding factor: `tcvlp_pros` has a schema default of `tcvlp_starter` for
the `plan` column. The combination of "default exists" + "no reconciler"
produced the exact "$10/mo Starter" misrender that the Prompt B / final fix
chain (`75d9ea5` / `8ed2121` / `c98d779`) hardened against on the read side.
The write side is still wrong.

**Affected users:** Any TCVLP customer who completed Stripe checkout BEFORE
submitting the `/v1/tcvlp/onboarding` form. Estimated count requires the
deferred D1 query in §5 plus `SELECT account_id, slug, plan, stripe_customer_id
FROM tcvlp_pros WHERE stripe_customer_id IS NULL OR stripe_subscription_id
IS NULL`. Unknown until run; likely small (TCVLP user base is small) but
non-zero given Donovan was hit.

**Proposed fix (do not implement in this prompt):**
1. Make `checkout.session.completed` handler at `:5219–5230` an upsert: if
   no `tcvlp_pros` row exists for `account_id`, INSERT a placeholder row with
   the Stripe IDs and correct plan; if it does, UPDATE as today.
2. Add a `customer.subscription.created` handler that performs the same
   upsert as a defense-in-depth reconciler against missed/late
   `checkout.session.completed` events.
3. Onboarding INSERT at `:17726` should NOT clobber the existing
   `stripe_customer_id`/`stripe_subscription_id`/`status`/`plan` on the
   ON CONFLICT branch (today's `DO UPDATE` already preserves these — confirm).
4. Onboarding plan-discovery at `:17631–17657` should additionally call Stripe
   directly when `billing_customers` is empty, since `billing_customers`
   population is itself dependent on a webhook race.

A separate migration prompt should backfill any existing partial-shape rows
by reconciling against Stripe's customer-search API.

### Bug 2 — Phantom account creation pathway

**Root cause:** TMP and WLVLP `checkout.session.completed` reconciliation
branches (`:5252` and `:5537`) create `accounts` rows on receipt of any
checkout event with `platform === 'tmp' || 'wlvlp'`, missing `account_id`
metadata, AND a customer email. They rely on `ON CONFLICT(email) DO NOTHING`
to dedupe by email. They do NOT verify that the checkout was a genuine
new purchase (vs. a webhook resend, a Stripe-dashboard test event, or a
cross-platform metadata mistake). They also intentionally skip session
creation, which is correct for anonymous flows but produces orphan-shaped
rows whenever the customer never returns to log in.

For Donovan specifically, the most likely trigger was a Stripe-side action
during the 2026-05-06 call (resent webhook, manual payment, refund-adjacent
action) carrying `platform: 'tmp'` or `platform: 'wlvlp'` metadata — but the
deleted row's `platform` field can no longer be read to confirm.

**Affected users:** Unknown without §5 D1 query results. Pattern is
"any prior orphan-shaped account with platform='tmp' or 'wlvlp' and no
follow-up session". Many of those will be legitimate (anonymous purchase, no
follow-up login yet). Genuine phantoms would be those without any
corresponding entitlement record (no `memberships` row for TMP, no
`wlvlp_purchases` row for WLVLP).

**Proposed fix (do not implement in this prompt):**
1. Anonymous-reconciliation branches (`:5252`, `:5537`) should ALSO write
   the per-platform entitlement row in the same transaction, then short-circuit
   if no entitlement metadata is present (i.e., refuse to create an account
   row for an event that would not also create a membership/purchase). This
   bounds account-row creation to events that genuinely represent a new
   member.
2. Add idempotency on Stripe `event.id` at the top of the webhook handler
   (after signature verification) to prevent resent events from re-running
   the reconciliation INSERT — even though `ON CONFLICT(email) DO NOTHING`
   protects against duplicates by email, it does not protect against new
   accounts being created from cross-platform metadata mistakes.
3. Add a guard that requires `obj.metadata.platform` AND
   `obj.metadata.plan_key`/`obj.metadata.slug` to BOTH be present; today the
   TMP branch requires `platform === 'tmp' && plan_key`, which is correct,
   but the broader pattern should be enforced.

---

## 8. Out of scope (flagged for separate work)

- **Backfill of partial tcvlp_pros rows** (Donovan and any other affected
  TCVLP customer): requires Stripe-side reconciliation, separate migration
  prompt.
- **Orphan-account census**: blocked on D1 wrangler access in this
  environment. Should be re-run with credentials before scoping fix size.
- **Stripe-side webhook delivery export** for 2026-05-05T22:24:22Z (Donovan
  signup) and 2026-05-06T19:43:53Z (phantom creation): authoritative record
  of which events fired and what metadata they carried.
- **`billing_customers` race**: §2/§4 note that onboarding's plan-discovery
  depends on `billing_customers`, which is populated by `invoice.paid`. This
  is a second-order race that piggybacks on Bug 1 but is also fixable
  independently by querying Stripe directly on read.
- **Lack of `customer.subscription.created` handler**: no current event
  populates `tcvlp_pros` Stripe IDs other than `checkout.session.completed`.
  Adding a second handler is part of Bug 1's fix but is also a generally
  useful defensive change for all subscription platforms (TMP, TCVLP).
- **Schema default `tcvlp_starter`**: combining a default value with
  unreliable plan propagation is the structural pattern that produced the
  Donovan misrender. Consider changing the column default to NULL and
  enforcing plan via webhook only — would have caused the bug to fail loudly
  instead of silently rendering "$10/mo Starter".
