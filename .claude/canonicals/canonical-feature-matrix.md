<!--
Status: Authoritative
Last updated: 2026-04-15
Owner: JLW (Principal Engineer review required for changes)
Scope: All 8 apps in the vlp-platform monorepo
Parent: canonical-app-blueprint.md
-->

# canonical-feature-matrix.md — VLP Ecosystem Feature Matrix

Last updated: 2026-04-19

---

## Purpose

Maps every feature on every platform to its implementation: which Worker route handles it, which R2/D1 stores the data, which frontend page renders it, and whether it's built. This is the single source of truth for "what works and what doesn't" across all 8 platforms.

Status values: `live` (deployed, functional), `partial` (route exists but UI incomplete or untested), `planned` (not yet built), `n/a` (not applicable to this platform).

---

## Shared Features (All 8 Platforms)

These features exist on every platform. The Worker routes are shared; each platform frontend renders its own UI.

| Feature | Worker Route | R2 Key Pattern | D1 Table | Frontend Path | Status |
|---------|-------------|----------------|----------|---------------|--------|
| Account / Membership Mgmt | GET /v1/auth/session, POST /v1/auth/magic-link/request, GET /v1/auth/magic-link/verify, POST /v1/auth/logout, POST /v1/auth/google/start | accounts/{id}.json | accounts | /dashboard/account | live |
| Affiliate Access | GET /v1/affiliates/by-account/{id}, POST /v1/affiliates/register, GET /v1/affiliates/stats/{id} | affiliates/{id}.json | affiliates | /dashboard/affiliate | live |
| Calendar / Scheduling | Cal.com OAuth + webhook | bookings/{id}.json | bookings | /dashboard/calendar | partial — Cal.com integration exists, dashboard UI varies by platform |
| Profile Management | GET /v1/profiles/{id}, PATCH /v1/profiles/{id} | profiles/{id}.json | profiles | /dashboard/profile | live |
| Support Tickets | POST /v1/support/tickets, GET /v1/support/tickets/by-account/{id}, PATCH /v1/support/tickets/{id} | support/{id}.json | support_tickets | /dashboard/support | live |
| Token Balances | GET /v1/tokens/balance/{id} | tokens/{id}.json | tokens | /dashboard (shown in sidebar or header) | live |
| Tool Usage History | GET /v1/dashboard (summary), GET /v1/tokens/usage/{account_id}?limit=25 (detail) | usage/{account_id}/{tool}/{timestamp}.json | usage_log | /dashboard/usage (per shell-path conventions) | partial — VLP + TCVLP shipped per canonical; other 6 apps pending their sweeps |

---

## TTMP — Transcript Tax Monitor Pro

| Feature | Worker Route | R2 Key | D1 Table | Frontend Path | Status |
|---------|-------------|--------|----------|---------------|--------|
| Transcript Parser Tool | POST /v1/tools/transcript-parser | transcripts/jobs/{id}.json | transcript_jobs | /dashboard/parser | live |
| Transcript Report History | GET /v1/transcripts/reports, GET /v1/transcripts/report/{id} | transcripts/results/{id}.json | transcript_results | /dashboard/reports | live |
| Transcript Tokens | GET /v1/tokens/balance/{id} (transcript_tokens field) | tokens/{id}.json | tokens | /dashboard (balance display) | live |

---

## VLP — Virtual Launch Pro

| Feature | Worker Route | R2 Key | D1 Table | Frontend Path | Status |
|---------|-------------|--------|----------|---------------|--------|
| Booking Analytics | GET /v1/bookings/analytics | bookings/analytics/{date}.json | bookings | /dashboard/bookings | partial — route exists, analytics dashboard incomplete |
| Client Pool | GET /v1/clients/by-professional/{id} | clients/{pro_id}/{client_id}.json | clients | /dashboard/clients | planned |
| Directory Profile | GET /v1/profiles/{id}, PATCH /v1/profiles/{id} | profiles/{id}.json | profiles | /dashboard/profile/directory | live |
| Messaging (Pro - Taxpayer) | POST /v1/messages, GET /v1/messages/by-thread/{id} | messages/{thread_id}/{msg_id}.json | messages | /dashboard/messages | planned |
| Profile Visibility | PATCH /v1/profiles/{id} (visibility field) | profiles/{id}.json | profiles | /dashboard/profile (toggle) | live |
| Tax Tool Game Tokens | GET /v1/tokens/balance/{id} (tax_game_tokens field) | tokens/{id}.json | tokens | /dashboard (balance display) | live |
| Transcript Tokens | GET /v1/tokens/balance/{id} (transcript_tokens field) | tokens/{id}.json | tokens | /dashboard (balance display) | live |

---

## TMP — Tax Monitor Pro

| Feature | Worker Route | R2 Key | D1 Table | Frontend Path | Status |
|---------|-------------|--------|----------|---------------|--------|
| Discounts / Entitlements | GET /v1/tmp/entitlements/{id} | entitlements/{id}.json | entitlements | /dashboard/discounts | planned |
| Messaging (Pro - Taxpayer) | POST /v1/messages, GET /v1/messages/by-thread/{id} | messages/{thread_id}/{msg_id}.json | messages | /dashboard/messages | planned |
| Tax Monitoring | GET /v1/tmp/monitoring/{id} | monitoring/{id}.json | monitoring | /dashboard/monitoring | planned |
| Tax Tool Game Tokens | GET /v1/tokens/balance/{id} (tax_game_tokens field) | tokens/{id}.json | tokens | /dashboard (balance display) | live |
| Taxpayer Intake | POST /v1/tmp/inquiries, GET /v1/tmp/inquiries/by-account/{id} | inquiries/{id}.json | inquiries | /inquiry, /intake | live |
| Transcript Tokens | GET /v1/tokens/balance/{id} (transcript_tokens field) | tokens/{id}.json | tokens | /dashboard (balance display) | live |

---

## TTTMP — Tax Tools Arcade

| Feature | Worker Route | R2 Key | D1 Table | Frontend Path | Status |
|---------|-------------|--------|----------|---------------|--------|
| Game Analytics | GET /v1/tttmp/game-analytics/{id} | games/analytics/{id}.json | game_sessions | /dashboard/game-analytics | planned |
| Game Tokens | GET /v1/tokens/balance/{id} (tax_game_tokens field) | tokens/{id}.json | tokens | /dashboard (balance display) | live |
| Tax Tools Arcade Games | POST /v1/tttmp/grant-access, POST /v1/tttmp/verify-access, POST /v1/tttmp/end-game | games/sessions/{id}.json | game_sessions | /about-games/[slug] | live |

---

## TCVLP — TaxClaim Pro

**Tiers:** Starter ($10/mo), Professional ($29/mo), Firm ($79/mo)

| Feature | Worker Route | R2 Key | D1 Table | Frontend Path | Status |
|---------|-------------|--------|----------|---------------|--------|
| Form 843 Generation | POST /v1/tcvlp/forms/843/generate, POST /v1/tcvlp/forms/843/submit | forms/843/{id}.json | form843_submissions | /claim/[slug] | live |
| Branded Claim Page | GET /v1/tcvlp/profile | landing-pages/{slug}.json | landing_pages | /claim/[slug] | partial — frontend live, Worker route pending |
| Penalty Calculations | Part of POST /v1/tcvlp/forms/843/generate | forms/843/{id}.json | form843_submissions | /claim/[slug] | live |
| Taxpayer Dashboard | GET /v1/tcvlp/submissions, GET /v1/tcvlp/stats | forms/843/{id}.json | form843_submissions | /dashboard | live |
| Kwong v. US Deadline Tools | N/A (client-side) | — | — | DeadlineBanner.tsx, KwongCard.tsx | live |
| Unlimited Claim Pages | Needs slug-per-office routing | landing-pages/{slug}.json | landing_pages | /claim/[slug] | planned |
| Priority Generation | Needs queue priority flag on POST /v1/tcvlp/forms/843/generate | — | — | N/A (backend queue priority) | planned |
| Bulk Export | Needs bulk download route | forms/843/exports/{id}.zip | — | Needs new page/component | planned |
| Transcript Integration | Needs cross-platform token route | — | — | Needs TTMP API bridge component | planned |
| White-Label Branding | PATCH /v1/tcvlp/profile | landing-pages/{slug}.json | landing_pages | /claim/[slug] (partial) | partial — frontend partial, Worker pending |
| Multi-Practitioner Access | Needs team/member routes | teams/{id}.json | teams | Needs team management UI | planned |
| API Access | Needs API key management | api-keys/{id}.json | api_keys | N/A (API-only) | planned |
| Dedicated Support | POST /v1/support/tickets (needs priority flag) | support/{id}.json | support_tickets | /dashboard/support | partial — live, needs priority flag |

---

## WLVLP — Website Lotto

| Feature | Worker Route | R2 Key | D1 Table | Frontend Path | Status |
|---------|-------------|--------|----------|---------------|--------|
| Bid on Websites | POST /v1/wlvlp/bids | wlvlp/bids/{slug}/{id}.json | wlvlp_bids | /sites/[slug] (bid UI) | live |
| Premium Domain Hosting | POST /v1/wlvlp/sites/:slug/domain, POST /v1/wlvlp/sites/:slug/renew | wlvlp/sites/{slug}.json | wlvlp_purchases | /dashboard/hosting | live |
| Scratcher Site Winner | POST /v1/wlvlp/scratch | wlvlp/scratch/{id}.json | wlvlp_scratch | /scratch | live |
| Vote on Designs | POST /v1/wlvlp/votes | wlvlp/votes/{slug}/{id}.json | wlvlp_votes | /sites/[slug] (vote UI) | live |
| White-Labeled Hosted Website | POST /v1/wlvlp/checkout, PATCH /v1/wlvlp/sites/:slug/data | wlvlp/sites/{slug}/customizations.json | wlvlp_purchases | /dashboard/sites/[slug]/edit | live |

---

## GVLP — Games VLP

| Feature | Worker Route | R2 Key | D1 Table | Frontend Path | Status |
|---------|-------------|--------|----------|---------------|--------|
| Games Access | Controlled by membership tier + token check | games/access/{id}.json | game_sessions | /dashboard/games | partial — access gating works, game library UI incomplete |
| Unlimited Client Access | Controlled by membership tier check | — | — | /dashboard (gated by tier) | planned — tier enforcement exists, "unlimited" UI not distinct |

---

## DVLP — Developers VLP

| Feature | Worker Route | R2 Key | D1 Table | Frontend Path | Status |
|---------|-------------|--------|----------|---------------|--------|
| Curated Client Intros | GET /v1/dvlp/match-intake/by-developer/{id} | match-intakes/{id}.json | match_intakes | /dashboard/intros | planned |
| Directory Profile | GET /v1/dvlp/developers/{id} | dvlp/developers/{id}.json | dvlp_developers | /developers/[slug] | live |
| Job Matching Access | POST /v1/dvlp/match-intake | match-intakes/{id}.json | match_intakes | /find-developers | live (intake form), planned (dashboard matching UI) |
| Profile Visibility | PATCH /v1/dvlp/developers/{id} (visibility field) | dvlp/developers/{id}.json | dvlp_developers | /dashboard/profile (toggle) | live |

---

## Status Summary

| Platform | Total Features | Live | Partial | Planned |
|----------|---------------|------|---------|---------|
| TTMP | 10 | 9 | 1 | 0 |
| VLP | 14 | 10 | 2 | 2 |
| TMP | 13 | 8 | 1 | 4 |
| TTTMP | 10 | 8 | 0 | 2 |
| TCVLP | 20 | 9 | 5 | 6 |
| WLVLP | 10 | 9 | 0 | 1 |
| GVLP | 7 | 5 | 1 | 1 |
| DVLP | 9 | 7 | 0 | 2 |

**Note:** Shared features (Account, Affiliate, Calendar, Profile, Support, Tokens, Usage) are counted once per platform. Route paths, R2 keys, and D1 tables listed here are based on project knowledge as of 2026-04-14. Verify against the actual Worker source (`apps/worker/src/index.js`) before treating as authoritative — some planned routes may have been built since this doc was written, and some listed routes may have different exact paths.

---

## Maintenance

Update this file whenever:
- A new feature is added to any platform
- A feature status changes (planned → partial → live)
- A Worker route is created or modified for a feature
- A frontend page is created for a feature

This file lives at `.claude/canonicals/canonical-feature-matrix.md` in the vlp-platform monorepo.

---

## Per-App Page Conformance

Last audit: 2026-04-19

Status per app × canonical page. Existence-only check (not a quality audit) against `canonical-site-nav.md` §1 (marketing) and §2 (app), plus `canonical-app-pages.md` contracts. Updated at the end of each sweep.

Legend: ✅ exists · 🟡 partial · ❌ missing · ⚪ n/a

### Marketing Pages

| Page | VLP | TMP | TTMP | TTTMP | DVLP | GVLP | TCVLP | WLVLP |
|------|-----|-----|------|-------|------|------|-------|-------|
| / (landing) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| /about | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ |
| /features | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ |
| /pricing | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| /how-it-works | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ |
| /contact | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| /reviews | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ |
| /support (public redirect) | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| /affiliate (public redirect) | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| /legal/privacy | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| /legal/terms | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| /legal/refund | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### App Pages — Settings (canonical-app-pages.md contracts)

Paths shown as `/dashboard/*` canonical. Grandfathered exceptions per `canonical-site-nav.md` §2: VLP uses `(member)/*`, TTMP uses `/app/*`, DVLP uses `/operator/*` — ✅ if equivalent page exists at the grandfathered path.

| Page | VLP | TMP | TTMP | TTTMP | DVLP | GVLP | TCVLP | WLVLP |
|------|-----|-----|------|-------|------|------|-------|-------|
| /dashboard/account | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ |
| /dashboard/plan (/upgrade) | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | 🟡 |
| /dashboard/profile | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ |
| /dashboard/support | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| /dashboard/usage | ✅ | ❌ | 🟡 | ❌ | ❌ | ✅ | ✅ | ❌ |

### App Pages — Workspace (platform-specific per canonical-site-nav §2)

"Applies to" column copied from canonical-site-nav §2 table. Status only evaluated for apps where the page applies; all others are ⚪.

| Page | Applies to | Status |
|------|-----------|--------|
| /dashboard (home) | ALL | VLP ✅ · TMP ✅ · TTMP ✅ · TTTMP ❌ · DVLP ✅ · GVLP ✅ · TCVLP ✅ · WLVLP ✅ |
| /dashboard/bookings (Booking Analytics) | VLP | ❌ |
| /dashboard/calendar | VLP | ✅ |
| /dashboard/clients (Client Pool) | VLP | ✅ |
| /dashboard/discounts (Entitlements) | TMP | ❌ |
| /dashboard/profile/directory | VLP, DVLP | VLP ✅ · DVLP ❌ |
| /dashboard/hosting (Premium Domain) | WLVLP | ❌ |
| /dashboard/games (Game Access JS) | GVLP | ✅ |
| /dashboard/game-analytics | TTTMP | ❌ |
| /dashboard/jobs (Job Matching) | DVLP | ❌ |
| /dashboard/intake (Taxpayer Intake) | TMP | ❌ |
| /dashboard/messages | TMP, VLP | TMP ❌ · VLP ❌ |
| /dashboard/parser | TTMP | ❌ |
| /dashboard/reports | ALL | VLP ✅ · TMP ❌ · TTMP ✅ · TTTMP ❌ · DVLP ❌ · GVLP ✅ · TCVLP 🟡 · WLVLP ❌ |
| /dashboard/monitoring (Tax Monitoring) | TMP | ❌ |
| /dashboard/voting (Voting Analytics) | WLVLP | ❌ |
| /dashboard/sites (White-Labeled Site) | TCVLP, WLVLP | TCVLP ❌ · WLVLP ✅ |

### App Pages — Earnings

| Page | VLP | TMP | TTMP | TTTMP | DVLP | GVLP | TCVLP | WLVLP |
|------|-----|-----|------|-------|------|------|-------|-------|
| /dashboard/affiliate | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| /dashboard/bidding | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| /dashboard/winning | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |

### Notes

- GVLP SETTINGS pages (Account, Plan/Upgrade, Profile, Support, Usage) achieved canonical §3.1 conformance in the A5 Phase 3 sweep (commits `3b42562..aa3b29f`, 2026-04-18).
- TCVLP SETTINGS pages achieved canonical conformance in an earlier A5 sweep (commits `b694079..f48ae99`).
- Remaining apps (VLP, TMP, TTMP, TTTMP, DVLP, WLVLP) have not yet been audited against `canonical-app-pages.md`.
- WLVLP `/dashboard/plan` marked 🟡 because `/dashboard/subscription` is present and likely fills the Plan role, but path does not match canonical.
- TTMP `/dashboard/usage` marked 🟡 because `/app/token-usage` exists at the grandfathered path but differs from the canonical `usage` name.
- TCVLP `/dashboard/reports` marked 🟡 because `/dashboard/submissions` fills a reports-like role without matching the canonical path.
- VLP grandfathered (member) paths are counted as conformant when a same-named destination exists (e.g. `(member)/account` satisfies `/dashboard/account`).

### How to use this matrix

When planning work:
1. ❌ cells = missing pages; building them is canonical-aligned greenfield work.
2. 🟡 cells = partial pages; existing code with known gaps or path-drift from canonical.
3. ⚪ cells = not canonical for that app; leave alone.
4. ✅ cells = shipped and conformant; don't touch without a reason.

Priority is not determined by this matrix — business priority (revenue, users, bugs) wins. This matrix only answers "what would it take to make everything canonical" — an upper-bound work estimate.
