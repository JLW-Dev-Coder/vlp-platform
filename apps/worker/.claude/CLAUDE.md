# CLAUDE.md — VLP Worker (`apps/worker`)

Last updated: 2026-04-13

---

## 1. Identity

**App:** VLP Worker
**Domain:** api.virtuallaunch.pro
**Monorepo path:** `apps/worker/`
**Purpose:** Single Cloudflare Worker serving all 8 VLP ecosystem platform frontends

---

## 2. System Definition

**What it is:** The unified backend API for every platform in the VLP ecosystem. One Worker, deny-by-default routing, contract-validated writes.

**What it is NOT:** This is not a frontend app. It does not render HTML (except unsubscribe pages). It does not run on Pages. Each frontend platform has its own app in `apps/{abbrev}/`.

**Audience:** All 8 platform frontends call this Worker via `api.virtuallaunch.pro`.

**Stack:**
- Runtime: Cloudflare Workers (vanilla JS, no framework)
- Storage: R2 (authoritative) + D1 (projection/query layer)
- KV: `ENRICHMENT_KV` for SCALE pipeline caching
- Dependencies: `pdf-lib` (Form 843 PDF generation)

---

## 3. Routes & Custom Domains

**Primary domain:** `api.virtuallaunch.pro`

**Route patterns (wrangler.toml):**
- `api.virtuallaunch.pro/*` → zone `virtuallaunch.pro`
- `*.websitelotto.virtuallaunch.pro/*` → zone `virtuallaunch.pro` (custom WLVLP sites)

**CORS allowed origins:**
- `https://virtuallaunch.pro`
- `https://api.taxmonitor.pro`
- `https://taxmonitor.pro`
- `https://transcript.taxmonitor.pro`
- `https://taxtools.taxmonitor.pro`
- `https://developers.virtuallaunch.pro`
- `https://games.virtuallaunch.pro`
- `https://taxclaim.virtuallaunch.pro`
- `https://websitelotto.virtuallaunch.pro`

---

## 4. Bindings

| Binding | Type | Resource |
|---------|------|----------|
| `R2_VIRTUAL_LAUNCH` | R2 Bucket | `virtuallaunch-pro` (authoritative storage) |
| `ONBOARDING_R2` | R2 Bucket | `virtuallaunch-pro` (same bucket, onboarding context) |
| `DB` | D1 Database | `virtuallaunch-pro` (query projection) |
| `ENRICHMENT_KV` | KV Namespace | SCALE pipeline enrichment cache |

---

## 5. Cron Triggers

| Schedule | UTC | Purpose |
|----------|-----|---------|
| `0 6 * * *` | 06:00 daily | WLVLP site generation + SCALE find-emails (Reoon Power) |
| `0 8 * * *` | 08:00 daily | SCALE validate-emails (Reoon quick mode) |
| `0 9 * * 1` | 09:00 Monday | DVLP job matching |
| `0 10 * * *` | 10:00 daily | WLVLP auction settlement + FOIA lead enrichment + SCALE generate-batch |
| `0 12 * * *` | 12:00 daily | WLVLP SCALE batch generation |
| `0 13 * * *` | 13:00 daily | WLVLP asset page enrichment (crawl + conversion_leak_report) |
| `0 14 * * *` | 14:00 daily | SCALE email sending (TTMP + WLVLP) |

---

## 6. Security Model

- **Deny-by-default:** Every route is explicitly matched. Unmatched paths return 404.
- **Session auth:** `vlp_session` HttpOnly cookie, validated per-request from D1 `sessions` table.
- **Auth methods:** Google OAuth, Magic Link (email), SSO (OIDC + SAML), TOTP 2FA.
- **Webhook verification:** Stripe (signature), Cal.com (signature), Twilio.
- **Admin/Operator routes:** Role-checked against `accounts.role` field.
- **Secrets:** All secrets set via `wrangler secret put`, never in wrangler.toml.

---

## 7. Architecture Rules

1. **R2 is authoritative.** D1 is always a queryable projection. Never treat D1 as source of truth.
2. **Write pipeline:** Request → Contract validation → R2 receipt → Canonical upsert → D1 index → Response.
3. **Contracts live in `contracts/`.** All versioned JSON schemas under `apps/worker/contracts/`.
4. **One Worker for all platforms.** No platform frontend creates its own Worker.
5. **CORS is explicit.** Only the 9 allowed origins above are permitted.

---

## 8. File Structure

```
apps/worker/
├── src/
│   ├── index.js              # Main Worker (21,000+ lines, all routes)
│   ├── form843-template.js   # Base64-encoded Form 843 PDF template
│   └── helpers/
│       └── contract-loader.js # Federated contract registry loader
├── migrations/               # D1 migration SQL files (0001–0053)
├── contracts/                # Versioned JSON contract schemas
│   ├── contract-registry.json
│   ├── webhook-registry.json
│   ├── canonical-contract.json
│   ├── canonical-registry.json
│   ├── registries/           # Per-platform registry files
│   └── {platform}/           # Per-platform contract directories
├── wrangler.toml             # Worker configuration
└── package.json              # Dependencies (pdf-lib)
```

---

## 9. D1 Tables

53 migration files defining tables for: accounts, sessions, memberships, billing_customers, tokens, cal_connections, bookings, profiles, support_tickets, notifications, vlp_preferences, google_calendar, cal_tokens, oauth_state, tool_sessions, transcript_jobs, ttmp_reports, compliance, avatars, dvlp (developers, jobs, reviews, canned_responses), gvlp (operators, visitor_sessions, game_plays), tcvlp (pros with notifications_enabled, form843_submissions with notify_opt_in/notify_email/notify_phone/notify_preference), wlvlp (templates, purchases, site_configs, bids, scratch_tickets, seed_templates), affiliates, handoff_tokens, client_pool, votes, scratch_promo, calcom integration.

### TCVLP Notification Flow
When `POST /v1/tcvlp/forms/843/submit` is called, the handler:
1. Stores notification fields (`notify_opt_in`, `notify_email`, `notify_phone`, `notify_preference`) in D1 and R2
2. Looks up the tax pro's email via `tcvlp_pros.pro_id` → `accounts.email`
3. If `tcvlp_pros.notifications_enabled` is true (default), sends an email via Resend with submission details
4. Email sending is non-blocking — submission succeeds even if email fails

---

## 10. API Surface

~193 routes organized by platform. See `canonical-api.md` at monorepo root for the complete endpoint registry.

**Shared endpoints:** auth, accounts, memberships, billing, checkout, webhooks, calendar, bookings, profiles, support, notifications, tokens, tools, transcripts, compliance, affiliates, referrals, dashboard, admin, R2 storage.

**Per-platform endpoints:** `/v1/vlp/*`, `/v1/tmp/*`, `/v1/tttmp/*`, `/v1/dvlp/*`, `/v1/gvlp/*`, `/v1/tcvlp/*`, `/v1/wlvlp/*`, `/v1/scale/*`.

---

## 11. Deploy

```bash
cd apps/worker
npx wrangler deploy
```

Dry-run: `npx wrangler deploy --dry-run`

Bundle size: ~1,780 KiB / gzip ~427 KiB.

---

## 12. Shared Context

For monorepo-wide rules, canonicals, and platform registry, see the root `.claude/CLAUDE.md`.
