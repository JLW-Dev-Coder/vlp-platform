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
`/`, `/games`, `/onboarding`, `/reviews`, `/support`, `/success`, `/sign-in`

### Member (authenticated)
`/dashboard` (Overview, Embed Code, Token Usage, Settings, Upgrade tabs)
`/calendar`, `/affiliate`

### Embed (public, parameterized)
`/embed?client_id=...&game=...`

---

## Build

```bash
npx turbo build --filter=gvlp
```
