# Project Instruction — TTTMP Canonical Audit + Vesperi AI Guide + YouTube Channel

**Status:** Active
**Created:** 2026-04-21
**Owner:** JLW
**Scope:** `apps/tttmp/` (frontend) + `apps/worker/src/index.js` (endpoints) + R2 (video assets) + YouTube channel

---

## Roles

Per `canonical-roles.md` and `.claude/ROLES.md` in the vlp-platform monorepo:

- **Principal Engineer (Chat Claude):** Authors this instruction and reviews RC output
- **Execution Engineer (RC / Claude Code):** Executes each objective as specified, commits with descriptive messages, runs build verification
- **Owner (JLW):** Final authority on all decisions

---

## 1. Platform Context

### TTTMP — Tax Tools Arcade

| Field | Value |
|-------|-------|
| Domain | `taxtools.taxmonitor.pro` |
| App Dir | `apps/tttmp` |
| Adapter | `@cloudflare/next-on-pages` (Cloudflare Pages with SSR) |
| Brand Color | `#8b5cf6` (violet) |
| Backend | `apps/worker/src/index.js` → `api.virtuallaunch.pro` |
| Storage | R2 (authoritative) + D1 (projection) |
| Pages Project | `taxtools-taxmonitor-pro-site` |
| Build Command | `npx @cloudflare/next-on-pages` |
| Output Dir | `.vercel/output/static` |

### What TTTMP Does Today (live features)

- **Tax Tools Arcade Games** — Interactive games teaching IRS forms, tax concepts, and filing requirements (Form 2848 POA walkthrough, Form 8821 TIA, estimated payment calculators)
- **Game Tokens** — Token-gated access to games; tokens purchased via Stripe or included with VLP membership
- **Game Analytics** — Track which games clients play, completion rates, concept mastery (planned)

### TTTMP Endpoints (current)

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| POST | `/v1/tttmp/auth/magic-link/request` | Request magic link | No |
| GET | `/v1/tttmp/auth/magic-link/verify` | Verify magic link | No |
| GET | `/v1/tttmp/auth/session` | Get session | Yes |
| POST | `/v1/tttmp/auth/logout` | Logout | Yes |
| POST | `/v1/tttmp/checkout/sessions` | Create checkout session | No |
| GET | `/v1/tttmp/checkout/status` | Checkout status | Yes |
| POST | `/v1/tttmp/support/tickets` | Create support ticket | Yes |
| GET | `/v1/tttmp/support/tickets/:ticket_id` | Get ticket | Yes |
| GET | `/v1/tttmp/tokens/balance` | Token balance | Yes |
| GET | `/v1/tttmp/health` | Health check | No |
| POST | `/v1/tttmp/grant-access` | Grant game access | Yes |
| POST | `/v1/tttmp/verify-access` | Verify game access | Yes |
| POST | `/v1/tttmp/end-game` | End game session | Yes |

---

## 2. Work Phases

### Phase 0: Full Canonical Audit ✅ COMPLETE

Completed 2026-04-21. Drift report: `apps/tttmp/.claude/audit-report-2026-04-21.md`

29 findings: 9 Fix-Now / 11 Fix-with-Vesperi / 9 Fix-Later

### Phase 1: Fix Critical Drift ← CURRENT

Address all "Fix now" items from the audit. Each fix is its own commit.

### Phase 2: Vesperi AI Game Guide (Landing Page)

**Concept:** Similar to TCVLP's Gala, but tailored to TTTMP's audience and product. Vesperi is an AI avatar guide who walks visitors through the Tax Tools Arcade — explaining what games are available, who they're for, and how tokens work.

**Avatar:** Vesperi (HeyGen, 14 looks available)
**Primary look for landing page:** TBD after Owner reviews looks (see §4)
**Landing page URL:** TBD (e.g., `/vesperi` or `/guide`)
**Tone:** Engaging, educational, slightly playful — matches a game/learning product

**Decision tree:** TBD — to be designed once the audit is complete and we understand the current state of the games, pricing, and onboarding flow.

### Phase 3: YouTube Channel Setup

**Channel:** New channel for TTTMP (separate from TCVLP's TaxClaim Pro channel)
**Channel name:** TBD
**Avatar for videos:** Vesperi (HeyGen, looks TBD per content type)
**Content strategy:** TBD after Phase 2 landing page design

### Phase 4: Integration (intake, PostHog, email drip)

Follow the same pattern as TCVLP/Gala:
- Intake endpoint (Worker)
- PostHog funnel events
- Welcome email drip (Resend via Worker cron)

---

## 3. Avatar — Vesperi

| Field | Value |
|-------|-------|
| Platform | HeyGen |
| Name | Vesperi |
| Looks Available | 14 |
| Voices Available | 1 |

**Look categories observed (from screenshot):**
- Office/professional settings (looks 1, 10)
- Casual sofa settings (looks 2-9, appears to be various sofa/room backgrounds)
- Pink/magenta outfit variants (looks 10-12)
- Dark outfit variants (looks 12-13)
- Light/casual variants (look 14)

**Owner to confirm:** Which look for landing page clips vs. YouTube content (same decision pattern as Gala: one consistent look for landing page, 2-3 looks for YouTube variety).

---

## 4. Open Decisions (Owner to confirm)

| # | Question | Options | Impact |
|---|----------|---------|--------|
| 1 | Landing page URL | `/vesperi` vs `/guide` vs `/arcade-guide` | URL permanence, brand alignment |
| 2 | YouTube channel name | "Tax Tools Arcade" vs "Tax Study Games" vs other | Brand identity |
| 3 | Vesperi's landing page look | One of the 14 available looks | Visual consistency |
| 4 | Vesperi's YouTube look(s) | 2-3 looks for variety | Content differentiation |
| 5 | Decision tree focus | Game selection guide vs. tax concept explainer vs. combined | Landing page purpose |
| 6 | Channel identity | Tax-pro focused vs. taxpayer focused vs. both | Content strategy |

**These decisions are made AFTER Phase 1 fixes, not before.**

---

## 5. Monorepo References

| Resource | Path / Location |
|----------|----------------|
| TTTMP app | `apps/tttmp/` |
| TTTMP CLAUDE.md | `apps/tttmp/.claude/CLAUDE.md` (if exists) |
| Worker | `apps/worker/src/index.js` |
| TTTMP features | `.claude/canonicals/canonical-feature-matrix.md` (TTTMP section) |
| TTTMP feature benefits | `.claude/canonicals/canonical-feature-benefits.md` (TTTMP section) |
| API registry | `.claude/canonicals/canonical-api.md` (TTTMP section) |
| Style guide | `.claude/canonicals/canonical-style.md` |
| Component guide | `.claude/canonicals/canonical-app-components.md` |
| Site nav structure | `.claude/canonicals/canonical-site-nav.md` |
| Deploy procedures | `.claude/canonicals/canonical-deploy.md` |
| Cookie consent | `.claude/canonicals/canonical-cookies.md` |
| Cal.com events | `.claude/canonicals/canonical-cal-events.md` |
| SEO | `.claude/canonicals/canonical-seo.md` |
| Roles | `.claude/ROLES.md` |
| Platform registry | `.claude/CLAUDE.md` §3 |
| TCVLP Gala reference | `.claude/instructions/tcvlp-gala-youtube.md` (pattern to follow) |
| Audit report | `apps/tttmp/.claude/audit-report-2026-04-21.md` |

---

## 6. Standing Rules

- RC commits all changes with descriptive messages
- RC pushes to `origin/main` unless instructed otherwise
- TTMP is in maintenance mode — do not touch
- DVLP is curbed until Owner advises
- WLVLP is in maintenance mode after post-purchase flow completion
- TCVLP Gala project is complete (Phases 1-4, 6 shipped) — do not modify
- All external links in dashboard context must open in new tab
- Dashboard page titles/subtitles must match the canonical pattern (`font-sora text-3xl font-extrabold text-white` + `text-white/55 text-[0.95rem]`)
- Phone inputs use canonical §10 normalization
- PostHog analytics is live across all apps — new pages are automatically tracked via cookie consent gate
- Build verification: `npx turbo build --filter=tttmp` after every change (note: TTTMP uses `@cloudflare/next-on-pages`, not static export)
