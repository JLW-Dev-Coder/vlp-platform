# CLAUDE.md — apps/dvlp (Developers VLP)

See monorepo root `.claude/CLAUDE.md` for shared context, canonical docs, and architecture.

---

## Platform

- **Name:** Developers VLP
- **Abbrev:** DVLP
- **Domain:** developers.virtuallaunch.pro
- **Brand Color:** #3b82f6 (blue)
- **Adapter:** static export (`output: 'export'`) → Cloudflare Pages
- **Font:** Sora (Google Fonts link, not next/font)

---

## Shared Components

All member area UI comes from `@vlp/member-ui`. Do NOT create local copies of:
- AppShell, MemberSidebar, MemberTopbar
- KPICard, HeroCard, ContentCard, DataTable, FullCalendar
- SEO utilities (generateSitemap, generateRobots, BusinessJsonLd, generatePageMeta)

DVLP passes `dvlpConfig` (defined in `lib/platform-config.ts`) to `AppShell`.

---

## DVLP-Specific Features (not shared)

- **Operator dashboard** (`app/operator/`) — admin SPA with 10 view modules: Analytics, Submissions, Developers, DeveloperDetail, Jobs, PostToDeveloper, Messages, Tickets, CannedResponses, BulkEmail
- **AdminGuard** (`components/AdminGuard.tsx`) — checks `role === 'admin'`, redirects otherwise
- **AuthGuard** (`components/AuthGuard.tsx`) — basic session check for non-admin pages
- **BackgroundEffects** (`components/BackgroundEffects.tsx`) — animated blobs, grid, beacon rings
- **Onboarding flow** (`app/onboarding/`) — developer signup with Stripe checkout (Free $0 + Paid $2.99/mo)
- **Developer directory** (`app/developers/`) — public developer listing
- **Find Developers** (`app/find-developers/`) — client intake form

---

## Route Structure

### Marketing (public)
`/`, `/developers`, `/find-developers`, `/onboarding`, `/pricing`, `/reviews`, `/support`, `/success`, `/sign-in`

### Member (authenticated)
`/affiliate` (referral earnings)

### Operator (admin only)
`/operator` (full admin dashboard with 10 view modules)

---

## Build

```bash
npx turbo build --filter=dvlp
```
