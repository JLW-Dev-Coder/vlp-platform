<!--
Status: Authoritative
Last updated: 2026-05-06
Owner: JLW (Principal Engineer review required for changes)
Scope: All in-app + email notification templates and dispatch across all 8 apps
Parent: canonical-app-blueprint.md
-->

# canonical-notifications.md

Governs the in-app + email notification template system across all 8 VLP
ecosystem apps. Templates and the dispatcher live in the Worker
(`apps/worker/src/notifications/`) and are consumed by webhook handlers,
cron jobs, and an admin-only manual dispatch endpoint.

This canonical exists to prevent the proliferation of one-off email +
notification code that already pervades `apps/worker/src/index.js`
(20+ inline `fetch('https://api.resend.com/emails', ...)` call sites as
of 2026-05-06). All new customer-facing notifications must go through the
template + dispatcher path defined here.

---

## Required Sections (in order)

### 1. Header

Purpose: govern in-app + email notification templates across all 8
platforms. Drive every customer-facing message through a single,
testable, registered template — not through inline Resend calls in
route handlers.

In scope:
- Customer-facing transactional notifications (billing events, account
  events, support events, booking events, refunds, etc.)
- Both channels they fan out to today: in-app + email
- The Worker-side dispatcher and template registry

Out of scope:
- SCALE outreach emails (governed by `canonical-scale.md`)
- Welcome/onboarding drip sequences (per-app, governed by feature contracts)
- Operator/admin internal notifications (use Slack webhook, not this system)

### 2. Channels

| Channel | What it is | What it is NOT for |
|---------|-----------|-------------------|
| **in-app** | Notification rows surfaced via `/v1/notifications/in-app`, written to R2 (`notifications/in-app/{id}.json`) + D1 (`notifications` table). Surfaced in the topbar bell + `/dashboard/notifications` page (where built per-app). | Time-critical alerts the user must see before opening the dashboard — use email for those. Long-form content — keep `message` short (< 280 chars). |
| **email** | Transactional email via Resend (`https://api.resend.com/emails`), keyed `RESEND_API_KEY` secret. Default `from: Virtual Launch Pro <noreply@virtuallaunch.pro>`. Templates must include both `html` and `text` versions. | Marketing email — those go through the SCALE pipeline (`canonical-scale.md`). Bulk sends — Resend rate limits, dispatcher fans out one-by-one. |
| **sms** *(future)* | Twilio. Endpoint exists at `POST /v1/notifications/sms/send` but Twilio call is not wired (sends are queued to R2 only). Gated by `vlp_preferences.sms_enabled`. | Anything urgent today — until Twilio is wired, SMS is not a deliverable channel. |

In-app and email are independent: a single `dispatchNotification()` call
fans out to one or both based on user preferences.

### 3. Template registry

**Location:** `apps/worker/src/notifications/templates/`

**File-per-template.** One template = one file. No multi-template files.

**Naming:** `<domain>-<event>.{js,ts}` — e.g. `billing-refund-issued.js`,
`booking-confirmed.js`, `account-2fa-enabled.js`. Domains are short
nouns matching the area of the system that triggers the event
(`billing`, `booking`, `account`, `support`, `affiliate`, `tokens`,
`compliance`, `tcvlp`, `wlvlp`, etc.).

**Index file:** `apps/worker/src/notifications/templates/index.js` exports
a registry map keyed by template id (`{ 'billing-refund-issued': mod, ... }`)
so the dispatcher can resolve at runtime without dynamic imports.

**Worker bundle status (2026-05-06):** zero templates exist today. The
first template (`billing-refund-issued`) is authored by the follow-up
prompt to this canonical.

### 4. Template structure

Every template module must export these five values. No exceptions.

| Export | Type | Purpose |
|--------|------|---------|
| `id` | string | Stable template id, matches filename without extension. Used by callers and the dispatcher. |
| `inAppPayload(data)` | function | Returns `{ title, message, severity, link }`. `title` ≤ 80 chars. `message` ≤ 280 chars. `severity` ∈ `{error, info, success, warning}`. `link` is an absolute URL or app-relative path. |
| `emailSubject(data)` | function | Returns the email subject line as a string. ≤ 120 chars. No emoji unless the design explicitly calls for it. |
| `emailHtml(data)` | function | Returns the HTML body. Must inline all styles (no external CSS — most clients strip `<link>` and many strip `<style>`). |
| `emailText(data)` | function | Returns the plain-text body. **Required, not optional** — accessibility (screen readers) and deliverability (Resend rates HTML-only mail lower). |

Templates must declare their `data` shape at the top of the file as a
JSDoc `@typedef` (or TypeScript interface if the file is `.ts`). This
is the contract callers honor when invoking the dispatcher.

### 5. Dispatcher contract

**Single function:** `dispatchNotification(env, accountId, templateId, data, options?)`

**Behavior:**
1. Resolves `templateId` against the registry. If not found → throws
   (caller bug; do not silently skip).
2. Loads the recipient's prefs from `vlp_preferences` (D1) — the existing
   table behind `/v1/notifications/preferences/:account_id`. Today the
   table only has `in_app_enabled` + `sms_enabled` columns; an
   `email_enabled` column will be added in the prompt that introduces
   the dispatcher.
3. Looks up the recipient email via `accounts.email` (D1) — falls back to
   the `accounts.json` R2 record if the D1 row is missing.
4. Fans out:
   - **in-app:** if `prefs.in_app_enabled` (default true) and `options.channels`
     allows it. Writes both R2 + D1 rows using a generated `notification_id`
     (`NTF_<uuid>`) so the existing GET endpoint surfaces them unchanged.
   - **email:** if `prefs.email_enabled` (default true) and the recipient
     has an email on file. Calls Resend directly with `subject`, `html`,
     `text`. Does NOT use the existing `sendEmail()` helper at
     `apps/worker/src/index.js:1194` because that helper does not accept
     a text body and overrides `from` — the dispatcher needs both
     under template control.
5. Returns `{ inApp: { ok, notificationId? }, email: { ok, providerId? } }`.
   Each sub-result is independent; failure of one does not block the other.
6. Errors are logged with `[dispatchNotification] {templateId}` prefix
   and written to an R2 receipt at
   `receipts/notifications/{accountId}/{ISO}_{templateId}.json` for
   audit, regardless of success or failure.

**Idempotency:** the dispatcher does not deduplicate. Callers that need
idempotency (webhooks especially) must check whether the event has
already been processed before invoking dispatch, using whatever
event-id storage exists for their domain.

**Default channels:** `['in-app', 'email']`. Pass `options.channels` to
constrain (e.g. `['in-app']` for low-stakes events; `['email']` for
events the user must see even if they never log in).

### 6. Trigger sources

Three legitimate trigger sources for `dispatchNotification`:

1. **Webhook handlers** — Stripe, Twilio, Cal.com webhooks at
   `/v1/webhooks/stripe`, `/v1/webhooks/calcom`, etc. Webhook triggers
   must be **opt-in via metadata flag**, not auto-fire on every event:
   - For Stripe: gate on `obj.metadata?.notify_customer === 'true'` set
     when the upstream action (refund, subscription change) was
     initiated by an operator who explicitly chose to notify.
   - Default-off prevents firing on every administrative refund or
     test-mode event.
2. **Cron jobs** — scheduled cron handlers in the Worker (booking
   reminders, expiry warnings, weekly digests).
3. **Admin-only manual dispatch** — `POST /v1/notifications/dispatch`
   (to be added in a follow-up prompt). Body:
   `{ account_id, template_id, data, channels? }`. Auth: operator role
   (`accounts.role IN ('operator', 'admin')`). For one-off or
   incident-recovery sends. Logged to R2 receipts with the operator's
   account id for audit.

What is NOT a legitimate trigger source: ad-hoc inline Resend calls
inside route handlers. Those are how we got 20+ unmanaged email
sites today; new code does not add to that pile.

### 7. Authoring rules

When adding or editing a template:

1. **Both HTML and text email versions required.** No HTML-only templates.
2. **In-app payload includes a destination.** `link` field on
   `inAppPayload` returns either an absolute URL or app-relative path
   so the user has somewhere to go. Empty links are not acceptable
   (a notification with no follow-up action is noise).
3. **`data` shape contract at top of file.** JSDoc `@typedef` (or TS
   interface). Every field used inside the template body must appear
   in the contract.
4. **Test against staging before production.** The dispatcher logs to
   R2 receipts unconditionally, so staging runs are inspectable.
5. **No PII in template files.** Templates are checked into git;
   recipient email, account id, refund amounts, and other
   per-message data come from `data` at runtime, not from string
   literals in the template.
6. **Subject line lead with the action, not the brand.** Customers
   filter on subject — "Refund issued" beats "Virtual Launch Pro:
   refund issued".

### 8. Existing infrastructure

Audit findings as of 2026-05-06 (apps/worker/src/index.js HEAD).

**Resend helper:**
- `sendEmail(to, subject, htmlBody, env)` at line 1194. Hardcodes
  `from: 'Virtual Launch Pro <noreply@virtuallaunch.pro>'`. Returns
  boolean. No `text` body, no `reply_to`, no per-platform `from`.
- Bypassed by ~20 inline `fetch('https://api.resend.com/emails', ...)`
  call sites scattered across the file (TCVLP form 843 flow, WLVLP
  buyer notifications, DVLP messaging, scale outreach, magic-link
  auth, etc.). The dispatcher introduced by this canonical replaces
  all customer-facing transactional uses; the helper itself stays for
  auth flows (magic link, sign-in) which are non-template by nature.

**In-app notification handlers** (canonical-api.md "Support &
Notifications" block, implementation in `apps/worker/src/index.js`):

| Route | Line | Body / Query | Storage | Response |
|-------|------|--------------|---------|----------|
| `POST /v1/notifications/in-app` | 7127 | `{ accountId, message, notificationId, severity, title }` — all required. `severity ∈ {error,info,success,warning}`. notificationId is caller-supplied. | R2: `notifications/in-app/{notificationId}.json`. D1: `notifications` table (`notification_id, account_id, title, message, severity, read, created_at`). | `{ ok, notificationId, status: 'created' }` |
| `GET /v1/notifications/in-app` | 7157 | Query: `accountId` (required), `limit` (default 20, max 100), `unreadOnly=1`. | Reads D1 only. | `{ ok, notifications: [...], unreadCount }` |
| `PATCH /v1/notifications/in-app/:notification_id` | 7186 | `{ read }` (default true). | D1 + R2 update. | `{ ok, notificationId, read }` |
| `POST /v1/notifications/in-app/mark-all-read` | 7212 | `{ accountId }`. | D1 bulk update. | `{ ok, accountId }` |
| `GET /v1/notifications/preferences/:account_id` | 7232 | — | Reads `vlp_preferences` table. | `{ ok, preferences: { accountId, inAppEnabled, smsEnabled } }` |
| `PATCH /v1/notifications/preferences/:account_id` | 7255 | `{ inAppEnabled?, smsEnabled? }` | `vlp_preferences` D1 + R2 mirror. | `{ ok, accountId, status: 'updated' }` |

Note: the prefs table is `vlp_preferences` (not `notification_preferences`
as the prior naming suggested), and it lacks an `email_enabled` column
today. The dispatcher prompt must add the column + extend GET/PATCH
to surface it.

**Existing internal notifier** — `notifyTicketCreated()` at line 1228
is the closest precedent for what the dispatcher does: writes both
R2 + D1 in-app rows, then sends a Resend email, all non-blocking.
The dispatcher generalizes this pattern.

**Notification page consumers:**
- VLP `/notifications` page (`apps/vlp/app/(member)/notifications/`)
  exists but renders static notification *settings* + dashboard
  activity. It does not call `GET /v1/notifications/in-app`.
- TMP and TTTMP have notification pages too; canonical-feature-matrix.md
  lists `/dashboard/notifications` as live only on VLP.
- TCVLP, DVLP, GVLP, TAVLP, WLVLP have no notifications page today.
  The topbar bell on these apps either does not exist or links to a
  404. This is a separate cleanup outside the scope of this canonical
  but should be tracked when the dispatcher ships, since dispatching
  in-app notifications to apps with no surface to view them is silent
  failure from the user's perspective.

**Stripe webhook handler** — `POST /v1/webhooks/stripe` at line 5145.
Verifies HMAC-SHA256 against either `STRIPE_WEBHOOK_SECRET` or
`STRIPE_WEBHOOK_SECRET_VLP`. Current event types in the switch:

- `checkout.session.completed` (5216)
- `customer.subscription.updated` (5878)
- `customer.subscription.deleted` (5894)
- `invoice.paid` (5945)
- `invoice.payment_failed` (6093)
- `payment_intent.succeeded` (6107)
- `payment_intent.payment_failed` (6116)
- `charge.dispute.created` (6124)

`charge.refunded` is **not** currently handled. The follow-up prompt
adds the case and gates customer notification on
`obj.metadata?.notify_customer === 'true'`.

Per-platform Stripe webhooks at `/v1/dvlp/stripe/webhook` (16126),
`/v1/gvlp/stripe/webhook` (17210), `/v1/wlvlp/stripe/webhook` (20749)
exist for platform-specific subscription handling. The dispatcher does
not need to be wired into these unless a per-platform notification is
required.

**Stripe customer → VLP account_id lookup** —
`SELECT account_id FROM billing_customers WHERE stripe_customer_id = ?`
(line 5949). R2 mirror at `billing_customers/{accountId}.json`. This
is the canonical mapping; the dispatcher relies on the caller having
already resolved `account_id` (callers do this lookup themselves).

### 9. Migration path

No templates exist today. Migration is forward-only:

1. **Phase 1 (this prompt):** Author this canonical. No code change.
2. **Phase 2 (next prompt):** Add the dispatcher
   (`apps/worker/src/notifications/dispatch.js`), the template registry
   (`apps/worker/src/notifications/templates/index.js`), the first
   template (`billing-refund-issued.js`), and the `email_enabled`
   column on `vlp_preferences`. Wire `charge.refunded` in the Stripe
   webhook to call the dispatcher when `notify_customer` metadata is
   set.
3. **Phase 3+ (incremental):** As each customer-facing inline Resend
   call is touched for any other reason (per-app refactors, bug fixes,
   feature work), migrate it to a template. No big-bang rewrite —
   inline calls are grandfathered until otherwise touched, consistent
   with `canonical-app-blueprint.md` §4.9.

The dispatcher must be live before Phase 3 migrations start. No
intermediate "halfway migrated" state.

### 10. Decision log

| Date | Change | Rationale |
|------|--------|-----------|
| 2026-05-06 | Created canonical | Triggered by duplicate-charge refund incident (customer Donovan Branford, TCVLP, three $29 charges on 2026-05-05 → two refunded 2026-05-06). The customer-facing refund confirmation was sent via a one-off backfill script using existing infrastructure because no reusable template system existed. This canonical governs the reusable system that will replace one-offs going forward. The follow-up prompt adds the dispatcher + first template (`billing-refund-issued`) + `charge.refunded` webhook gate. |
| 2026-05-07 | §6.5 Stripe-receipts-off accommodation deferred to first billing template prompt | Section was scoped during the Donovan billing-refund sweep but not committed into the canonical. Stripe payment + refund receipts confirmed off at account level via Stripe support 2026-05-06. Implication for future work: billing-category templates are primary notification (no Stripe fallback); dispatcher must bypass user prefs for email channel on billing templates. To be added when first billing template (`billing-refund-issued`) is implemented. |
