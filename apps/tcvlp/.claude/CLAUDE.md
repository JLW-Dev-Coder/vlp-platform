# CLAUDE.md — apps/tcvlp (TaxClaim Pro)

See monorepo root `.claude/CLAUDE.md` for shared context, canonical docs, and architecture.

---

## Platform

- **Name:** TaxClaim Pro
- **Abbrev:** TCVLP
- **Domain:** taxclaim.virtuallaunch.pro
- **Brand Color:** #eab308 (yellow)
- **Adapter:** static export (`output: 'export'`) → Cloudflare Pages
- **Fonts:** DM Sans (body) + Raleway (display) via next/font

---

## Pricing Tiers (Stripe Live)

| Tier | Price | Product ID | Price ID |
|------|-------|------------|----------|
| Starter | $10/mo | `prod_UCK4SzsEnjp19U` | `price_1TDvQe9ROeyeXOqek1fpOWWH` |
| Professional | $29/mo | `prod_UKy33CcU8nh21Y` | `price_1TMI7d9ROeyeXOqeRSrkysQW` |
| Firm | $79/mo | `prod_UKy3UTHKIfNG6H` | `price_1TMI7k9ROeyeXOqeUlKb4Uso` |

---

## Shared Components

All member area UI comes from `@vlp/member-ui`. Do NOT create local copies of:
- AppShell, MemberSidebar, MemberTopbar
- KPICard, HeroCard, ContentCard, DataTable, FullCalendar
- SEO utilities (generateSitemap, generateRobots, BusinessJsonLd, generatePageMeta)

TCVLP passes `tcvlpConfig` (defined in `lib/platform-config.ts`) to `AppShell`.

---

## TCVLP Features

### All Tiers (Starter, Professional, Firm)
- **Form 843 Generation** (`app/claim/`) — auto-generate IRS Form 843 penalty abatement claims — live
- **Branded Claim Page** (`app/claim/`) — firm-branded landing page for client intake — live (GET /v1/tcvlp/profile, GET/PATCH profile routes)
- **Penalty Calculations** (`app/claim/`) — automated penalty/interest calculations from transcript data — live
- **Taxpayer Dashboard** (`app/dashboard/`) — client claim status, submissions, document downloads — live
- **Kwong v. US Deadline Tools** (`components/DeadlineBanner.tsx`, `KwongCard.tsx`) — eligibility checker for Jan 2020–July 2023 penalties — live

### Professional + Firm Only
- **Unlimited Claim Pages** — separate branded pages per office/partner — not started
- **Priority Generation** — Form 843 PDFs generated ahead of queue — not started
- **Bulk Export** — ZIP download of all generated Form 843 PDFs — not started
- **Transcript Integration** — direct TTMP transcript parsing into Form 843 — live (parseTranscriptText in Worker, auto-populates Kwong penalties on upload)

### Firm Only
- **White-Label Branding** (`app/claim/`) — remove all TaxClaim Pro branding — frontend partial, Worker pending
- **Multi-Practitioner Access** — team management with per-user logins — not started
- **API Access** — programmatic Form 843 generation via REST API — not started
- **Dedicated Support** (`app/support/`) — priority support queue, 4hr response — live, needs priority flag

### Other TCVLP Pages (not tier-gated)
- **Demo page** (`app/demo/`) — 5-step public walkthrough of claim process
- **Form 843 explainer** (`app/what-is-form-843/`) — educational content for SEO
- **Onboarding flow** (`app/onboarding/`) — 3-step wizard (firm details → slug → payment)
- **AuthGuard** (`components/AuthGuard.tsx`) — session check for protected pages

---

## Route Structure

### Marketing (public)
`/`, `/demo`, `/what-is-form-843`, `/pricing`, `/onboarding`, `/support`, `/success`, `/sign-in`

### Member (authenticated)
`/dashboard` (Overview, Embed Link, Submissions, Settings, Upgrade tabs)
`/calendar`, `/affiliate`

### Client-facing (parameterized by slug)
`/claim?slug=...`

---

## Build

```bash
npx turbo build --filter=tcvlp
```
