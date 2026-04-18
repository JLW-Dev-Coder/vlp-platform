# CLAUDE.md — apps/gvlp (Games VLP)

See monorepo root `.claude/CLAUDE.md` for shared context, canonical docs, and architecture.

---

## Platform

- **Name:** Games VLP
- **Abbrev:** GVLP
- **Domain:** games.virtuallaunch.pro
- **Brand Color:** #22c55e (green)
- **Adapter:** static export (`output: 'export'`) → Cloudflare Pages
- **Font:** Outfit (Google Fonts link) + JetBrains Mono (code)

---

## Shared Components

All member area UI comes from `@vlp/member-ui`. Do NOT create local copies of:
- AppShell, MemberSidebar, MemberTopbar
- KPICard, HeroCard, ContentCard, DataTable, FullCalendar
- SEO utilities (generateSitemap, generateRobots, BusinessJsonLd, generatePageMeta)

GVLP passes `gvlpConfig` (defined in `lib/platform-config.ts`) to `AppShell`.

---

## GVLP-Specific Features (not shared)

- **Game embed system** (`app/embed/`) — iframe endpoint for embedded games, token consumption
- **Game library** (`app/games/`) — public showcase of 9 tax education games
- **Token usage** (`app/dashboard/components/TokenUsage.tsx`) — balance and consumption analytics
- **Embed code generator** (`app/dashboard/components/EmbedCode.tsx`) — copy-paste snippet
- **Onboarding flow** (`app/onboarding/`) — 3-step wizard (tier → info → checkout)
- **Visitor tracking** (`lib/visitor.ts`) — client-side visitor ID for embed token tracking
- **AuthGuard** (`components/AuthGuard.tsx`) — session check for protected pages
- **9 HTML games** in `public/games/` with corresponding JS in `public/games/js/`

---

## Route Structure

### Marketing (public)
`/`, `/about`, `/features`, `/pricing`, `/how-it-works`, `/contact`,
`/games`, `/reviews`, `/onboarding`, `/support`, `/success`, `/sign-in`

### Member (authenticated)
`/dashboard` (Overview)
`/dashboard/games` — Game Access JS workspace (tiles for Embed + Tokens + Library)
`/dashboard/embed`, `/dashboard/tokens` — game embed + token pages (fronted by workspace)
`/dashboard/reports`, `/dashboard/bidding`, `/dashboard/winning`,
`/dashboard/profile`, `/dashboard/usage`, `/dashboard/calendar` — stubs
`/dashboard/account` (canonical path; redirects from `/dashboard/settings` via `public/_redirects`)
`/dashboard/affiliate`, `/dashboard/support`, `/dashboard/upgrade`
`/calendar`, `/affiliate` — legacy top-level (pre-dates dashboard refactor)

### Embed (public, parameterized)
`/embed?client_id=...&game=...`

---

## Theming Divergences

GVLP has known drift from the canonical blueprint. Both are Track E-deferred
(Tailwind container migration + z-index tokenization).

- **CSS-modules max-widths** — `app/page.module.css` and remaining module
  CSS use raw widths (e.g., 1152px / 1024px). Canonical §4.14 requires
  the 1280/1200/960 token set mapped via Tailwind `container`. Marketing
  header/footer are now shared (`@vlp/member-ui`) so Nav/Footer module
  CSS was dropped in Phase 2; the landing page still owns its own module.
- **Raw z-index values** — page.module.css uses `z-index: 10` in multiple
  places for decorative orbs/overlays. Canonical §4.19 requires named
  tokens (`z-base / dropdown / sticky / modal / popover / toast`). The
  removed Nav.module.css previously used `z-index: 100`.

---

## Build

```bash
npx turbo build --filter=gvlp
```
