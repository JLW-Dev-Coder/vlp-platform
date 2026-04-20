# CLAUDE.md — apps/vlp (Virtual Launch Pro)

See monorepo root `.claude/CLAUDE.md` for shared context, canonical docs, and architecture.

---

## Platform

- **Name:** Virtual Launch Pro
- **Abbrev:** VLP
- **Domain:** virtuallaunch.pro
- **Brand Color:** #f97316 (orange)
- **Adapter:** `@cloudflare/next-on-pages`

---

## Shared Components

All member area UI comes from `@vlp/member-ui`. Do NOT create local copies of:
- AppShell, MemberSidebar, MemberTopbar
- KPICard, HeroCard, ContentCard, DataTable, FullCalendar
- SEO utilities (generateSitemap, generateRobots, BusinessJsonLd, generatePageMeta)

VLP passes `vlpConfig` (defined in `lib/platform-config.ts`) to `AppShell`.

---

## VLP-Specific Features (not shared)

- **Scale dashboard** (`app/scale/`) — operator-only admin panel for CRM, cross-platform analytics, workflow. The `/scale/workflow` page has 6 tabs: **Planner** (default — daily workflow checklist with campaign day rotation, Kwong countdown, FB/Reddit targets, Cal.com links), Upload, Posts, Outreach, Social, Workflow
- **Client Pool** (`app/(member)/client-pool/`) — client case management with compliance forms (2848, 8821)
- **Compliance components** (`app/(member)/client-pool/[clientId]/compliance/`) — IRS form entry, SSN fields, accordion sections
- **ActivityItem** / **StatusBadge** — VLP-specific display components in `app/(member)/components/`

---

## Route Structure

### Marketing (public)
`/`, `/about`, `/blog`, `/blog/[slug]`, `/asset/[slug]`, `/contact`, `/features`, `/features/booking`, `/features/public-profile`, `/help`, `/how-it-works`, `/legal/privacy`, `/legal/terms`, `/legal/refund`, `/pricing`, `/profile/[id]`, `/sign-in`, `/checkout/success`

### Member (protected — vlp_session cookie)
`/dashboard`, `/analytics`, `/calendar`, `/inquiries`, `/tokens`, `/affiliate`, `/payouts`, `/account`, `/account/payments`, `/profile`, `/profile/onboarding`, `/profile/preview`, `/support`, `/support/create`, `/usage`, `/notifications`, `/client-pool`, `/client-pool/[clientId]`, `/client-pool/[clientId]/compliance`, `/client-pool/[clientId]/report`

### Scale (operator only)
`/scale`, `/scale/analytics/[platform]`, `/scale/calendar`, `/scale/crm`, `/scale/crm/clients`, `/scale/crm/clients/[accountId]`, `/scale/crm/prospects`, `/scale/crm/prospects/[slug]`, `/scale/sales`, `/scale/support`, `/scale/workflow`

---

## Build

```bash
npx turbo build --filter=vlp
```

Pages build for Cloudflare: `npm run pages:build`
