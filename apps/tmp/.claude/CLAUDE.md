# CLAUDE.md — apps/tmp (Tax Monitor Pro)

See monorepo root `.claude/CLAUDE.md` for shared context, canonical docs, and architecture.

---

## Platform

- **Name:** Tax Monitor Pro
- **Abbrev:** TMP
- **Domain:** taxmonitor.pro
- **Brand Color:** #f97316 (orange — parent brand)
- **Adapter:** static export (`output: 'export'`) → Cloudflare Pages

---

## Shared Components

All member area UI comes from `@vlp/member-ui`. Do NOT create local copies of:
- AppShell, MemberSidebar, MemberTopbar
- KPICard, HeroCard, ContentCard, DataTable, FullCalendar
- SEO utilities (generateSitemap, generateRobots, BusinessJsonLd, generatePageMeta)

TMP passes `tmpConfig` (defined in `lib/platform-config.ts`) to `AppShell`.

---

## TMP-Specific Features (not shared)

- **Dashboard routes** (`app/dashboard/`) — route-per-view; layout wraps children in shared `AuthGate` + `AppShell(tmpConfig)`. Views: `/dashboard` (DashboardHome), `/dashboard/compliance-report`, `/dashboard/transcript-changes`, `/dashboard/esign-2848`, `/dashboard/active-alerts`, `/dashboard/tokens`, `/dashboard/receipts`, `/dashboard/profile`, `/dashboard/help-center`, plus `/dashboard/support` and `/dashboard/affiliate`. View components source `session.account_id` via `useAppShell()`.
- **AuthGuard** (`components/AuthGuard.tsx`) — TMP-specific session check with redirect, returns `SessionUser` with `account_id`, `email`, `plan`. Used by non-dashboard pages (`/messages`, `/calendar`, `/status`, `/notifications`). Dashboard now uses shared `AuthGate` from `@vlp/member-ui` at the layout level.
- **Intake flow** — `/inquiry` → `/intake` → `/offer` → `/agreement` → `/payment` → `/payment-success`
- **Compliance report** (`app/report/`) — staff/pro tabbed compliance dashboard
- **Directory** (`app/directory/`) — public tax professional listing with profile pages
- **IRS Payment Calculator** (`app/tools/irs-payment-calculator/`) — public lead magnet tool
- **Form 2848** (`app/forms/2848/`) — client-facing eSign page

---

## Route Structure

### Marketing (public)
`/`, `/about`, `/affiliate`, `/contact`, `/calendar`, `/directory`, `/directory/profile`, `/features`, `/pricing`, `/resources/transcript-central`, `/tools/irs-payment-calculator`, `/forms/2848`, `/legal/privacy`, `/legal/terms`, `/legal/refund`, `/sign-in`

### Member (protected — vlp_session cookie)
`/dashboard`, `/dashboard/compliance-report`, `/dashboard/transcript-changes`, `/dashboard/esign-2848`, `/dashboard/active-alerts`, `/dashboard/tokens`, `/dashboard/receipts`, `/dashboard/profile`, `/dashboard/help-center`, `/dashboard/support`, `/dashboard/affiliate`, `/calendar`, `/messages`, `/office`, `/report`, `/report/view`, `/status`. Top-level `/affiliate` is a redirect stub to `/dashboard/affiliate`; `/support` redirects to `/help`.

### Intake flow (public → authenticated)
`/inquiry`, `/intake`, `/offer`, `/agreement`, `/payment`, `/payment-success`

---

## Build

```bash
npx turbo build --filter=tmp
```

Pages build for Cloudflare: `npm run pages:build`
