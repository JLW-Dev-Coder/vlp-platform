# CLAUDE.md — apps/tttmp (Tax Tools Arcade)

See monorepo root `.claude/CLAUDE.md` for shared context, canonical docs, and architecture.

---

## Platform

- **Name:** Tax Tools Arcade
- **Abbrev:** TTTMP
- **Domain:** taxtools.taxmonitor.pro
- **Brand Color:** #8b5cf6 (violet)
- **Adapter:** Static export (`output: 'export'`) → Cloudflare Pages
- **Output dir:** `out/`

---

## Shared Components

All member area UI comes from `@vlp/member-ui`. Do NOT create local copies of:
- AppShell, MemberSidebar, MemberTopbar
- KPICard, HeroCard, ContentCard, DataTable, FullCalendar
- SEO utilities (generateSitemap, generateRobots, BusinessJsonLd, generatePageMeta)

TTTMP passes `tttmpConfig` (defined in `lib/platform-config.ts`) to `AppShell`.

---

## TTTMP-Specific Features (not shared)

- **Game catalog** (`lib/games.ts`) — 21 interactive tax education games with tiers (quick/standard/premium)
- **Game play** (`app/games/[slug]/play/`) — embedded HTML game player
- **Token system** — users buy tokens, spend to play games
- **Static game files** (`public/games/`) — 21 standalone HTML game files
- **No full dashboard** — simple account page with balance + token purchase

---

## Route Structure

### Marketing (public)
`/`, `/games`, `/games/[slug]`, `/pricing`, `/contact`, `/legal/privacy`, `/legal/terms`, `/legal/refund`

### Member (authenticated)
`/account` (balance + token purchase), `/affiliate` (referral earnings), `/games/[slug]/play` (game access)

### Auth
`/sign-in` (magic link)

---

## Build

```bash
npx turbo build --filter=tttmp
```

Output goes to `apps/tttmp/out/` — deployed as static files to Cloudflare Pages.
