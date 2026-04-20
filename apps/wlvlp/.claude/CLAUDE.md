# CLAUDE.md — apps/wlvlp (Website Lotto)

See monorepo root `.claude/CLAUDE.md` for shared context, canonical docs, and architecture.

---

## Platform

- **Name:** Website Lotto
- **Abbrev:** WLVLP
- **Domain:** websitelotto.virtuallaunch.pro
- **Brand Color:** #a855f7 (purple)
- **Adapter:** static export (`output: 'export'`, `trailingSlash: true`) → Cloudflare Pages
- **Fonts:** next/font/google (Sora, DM Sans, IBM Plex Mono)

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
- **AuthGuard** (`components/AuthGuard.tsx`) — session check for protected pages. NOT migrated to shared `AuthGate` from `@vlp/member-ui` because AuthGuard exposes the authenticated `Session` to children via a render-prop API (`children: (session) => ReactNode`), while `AuthGate` only gates rendering and does not pass session. Callers (`/onboarding`, `/admin/upload`, `/scratch`) rely on `session.account_id`. Migration would require adding session exposure to `AuthGate` or extracting a session-provider pattern — flagged for Owner.
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

---

## Theming Divergences

WLVLP has been migrated to canonical tokens (Tier 3D, 2026-04-19). All `--neon-*`,
`--void`, and `--charcoal` legacy variables have been removed. CSS Modules have been
deleted; styling is now Tailwind utilities + shared canonical tokens throughout.

The body background is now the shared flat `--surface-bg` (the previous three-stop
neon gradient was a marketing aesthetic with no canonical equivalent).

The local `--color-success`, `--color-warning`, `--color-error`, `--color-info`
variables in `app/globals.css` mirror canonical-style.md §2.5 semantic tokens. They
remain local pending the shared-layer addition tracked as cleanup §13 item 7.

Two `@keyframes` definitions remain in `app/globals.css` (`marquee`, `float`) —
referenced inline via Tailwind arbitrary `animate-[marquee_3s_linear_infinite]`
syntax. The shared `@vlp/member-ui` preset doesn't include these.
