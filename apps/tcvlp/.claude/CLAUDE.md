# CLAUDE.md — apps/tcvlp (TaxClaim Pro)

See monorepo root `.claude/CLAUDE.md` for shared context, canonical docs, and architecture.

---

## Platform

- **Name:** TaxClaim Pro
- **Abbrev:** TCVLP
- **Domain:** taxclaim.virtuallaunch.pro
- **Brand Color:** #ef4444 (red)
- **Adapter:** static export (`output: 'export'`) → Cloudflare Pages
- **Fonts:** DM Sans (body) + Raleway (display) via next/font

---

## Shared Components

All member area UI comes from `@vlp/member-ui`. Do NOT create local copies of:
- AppShell, MemberSidebar, MemberTopbar
- KPICard, HeroCard, ContentCard, DataTable, FullCalendar
- SEO utilities (generateSitemap, generateRobots, BusinessJsonLd, generatePageMeta)

TCVLP passes `tcvlpConfig` (defined in `lib/platform-config.ts`) to `AppShell`.

---

## TCVLP-Specific Features (not shared)

- **Claim form** (`app/claim/`) — multi-step Form 843 preparation (transcript upload, taxpayer info, penalty details, generation)
- **Demo page** (`app/demo/`) — 5-step public walkthrough of claim process
- **Form 843 explainer** (`app/what-is-form-843/`) — educational content for SEO
- **Onboarding flow** (`app/onboarding/`) — 3-step wizard (firm details → slug → payment)
- **Dashboard components** — Overview, EmbedLink, Submissions, Settings, Upgrade
- **DeadlineBanner** (`components/DeadlineBanner.tsx`) — July 10, 2026 deadline alert
- **KwongCard** (`components/KwongCard.tsx`) — Kwong v. US ruling info card
- **AuthGuard** (`components/AuthGuard.tsx`) — session check for protected pages

---

## Route Structure

### Marketing (public)
`/`, `/demo`, `/what-is-form-843`, `/onboarding`, `/support`, `/success`, `/sign-in`

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
