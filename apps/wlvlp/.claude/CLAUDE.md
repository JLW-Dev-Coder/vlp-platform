# CLAUDE.md — apps/wlvlp (Website Lotto)

See monorepo root `.claude/CLAUDE.md` for shared context, canonical docs, and architecture.

---

## Platform

- **Name:** Website Lotto
- **Abbrev:** WLVLP
- **Domain:** websitelotto.virtuallaunch.pro
- **Brand Color:** #a855f7 (purple)
- **Adapter:** static export (`output: 'export'`, `trailingSlash: true`) → Cloudflare Pages
- **Fonts:** Sora + DM Sans (Google Fonts link)

---

## Shared Components

All member area UI comes from `@vlp/member-ui`. Do NOT create local copies of:
- AppShell, MemberSidebar, MemberTopbar
- KPICard, HeroCard, ContentCard, DataTable, FullCalendar
- SEO utilities (generateSitemap, generateRobots, BusinessJsonLd, generatePageMeta)

WLVLP passes `wlvlpConfig` (defined in `lib/platform-config.ts`) to `AppShell`.

---

## WLVLP-Specific Features (not shared)

- **Template marketplace** (`app/page.tsx`) — browse 210+ templates, filter/sort, vote, bid, buy
- **Template detail pages** (`app/sites/[slug]/`) — statically generated for all 211 templates (high-value SEO)
- **Scratch to Win** (`app/scratch/`) — gamified ticket reveal for discounts/free templates
- **Buyer dashboard** (`app/dashboard/`) — My Site preview, Edit Content/Brand/Contact, Subscription tabs
- **My Sites** (`app/dashboard/sites/`) — list all purchased templates, edit per-site
- **Site editor** (`app/dashboard/sites/[slug]/edit/`) — schema-based field editor per template
- **Asset/prospect pages** (`app/asset/[slug]/`) — dynamic prospect targeting (shell + Cloudflare rewrite)
- **Template catalog** (`wlvlp-catalog.json`) — 223 entries with metadata
- **Template previews** (`public/sites/{slug}/`) — HTML preview + schema.json + thumbnails
- **AuthGuard** (`components/AuthGuard.tsx`) — session check for protected pages
- **Pricing logic** (`lib/pricing.ts`) — Standard $249, Premium $399 (one-time)

---

## Route Structure

### Marketing (public)
`/`, `/scratch`, `/support`, `/sign-in`, `/onboarding`, `/success`, `/purchase-success`

### Template pages (public, statically generated — 211 pages)
`/sites/[slug]`

### Member (authenticated)
`/dashboard` (My Site, Edit Content, Edit Brand, Edit Contact, Subscription)
`/dashboard/sites`, `/dashboard/sites/[slug]/edit`
`/affiliate`

### Asset (prospect, Cloudflare rewrite)
`/asset/[slug]` → `/asset/__shell__/`

### Admin
`/admin/upload`

---

## SEO

The sitemap includes all 211 dynamically generated `/sites/[slug]` pages. This is high-value SEO — each template is a unique indexable URL.

---

## Build

```bash
npx turbo build --filter=wlvlp
```
