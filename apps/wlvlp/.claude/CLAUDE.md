# CLAUDE.md — apps/wlvlp (Website Lotto)

See monorepo root `.claude/CLAUDE.md` for shared context, canonical docs, and architecture.

---

## Platform

- **Name:** Website Lotto
- **Abbrev:** WLVLP
- **Domain:** websitelotto.virtuallaunch.pro
- **Brand Color:** #00D4FF (neon blue) — see Theming Divergences for extended palette
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

WLVLP uses an extended multi-color neon palette (Owner decision, 2026-04-19).
This is an intentional brand divergence from the single-brand-primary pattern,
restored after earlier canonicalization (Tier 3D) flattened the Vegas/lotto aesthetic.

### brand.primary change

Changed from `#a855f7` (purple) to `#00D4FF` (neon blue) to match the Vegas/lotto
design direction. Purple remains available as a secondary accent via `neon.purple`.
The 6 required canonical brand tokens (`brand.primary`, `brand.hover`, `brand.dark`,
`brand.light`, `brand.glow`, `brand.text-on-primary`) plus `brand.gradient-to` are
all present in `tailwind.config.ts`, harmonized to the neon blue primary.

### Extended neon palette (in tailwind.config.ts)

| Token | Value | Purpose |
|-------|-------|---------|
| neon.blue | #00D4FF | Primary action, headlines, borders |
| neon.yellow | #FFE534 | Secondary action, pricing CTA, badges |
| neon.magenta | #FF2D8A | Accent, decorative, tertiary CTAs |
| neon.cyan | #00F0D0 | Subtle accent, cyan badges |
| neon.purple | #a855f7 | Legacy WLVLP purple — retained as secondary |
| void | #07070A | Deep background |
| charcoal | #12121A | Surface background |
| glass | rgba(255,255,255,0.04) | Glass-morphism cards |
| glassBorder | rgba(255,255,255,0.08) | Glass-morphism borders |

### Additional CSS utilities (in globals.css)

Neon glow text shadows (`.glow-blue`, `.glow-yellow`, `.glow-magenta`, `.glow-cyan`),
button glow box-shadows (`.btn-glow-*`), glass-morphism card base (`.glass-card`,
`.card-glow`), neon-border pulse animations (`.neon-border`, `.neon-border-yellow`,
`.neon-border-magenta`, `.neon-border-cyan`), bokeh orb floating (`.bokeh`), Vegas
marquee strip (`.marquee-strip`), neon line dividers (`.neon-line`), light beam
(`.light-beam`), lotto balls (`.lotto-ball`), category pill active state
(`.category-filter-active`), and card motion classes (`.anim-float`, `.anim-dance`,
`.anim-wobble`, `.anim-sway`, `.anim-pulse-scale`, `.anim-icon-bounce`,
`.anim-fade-up`).

All keyframed animations are wrapped in
`@media (prefers-reduced-motion: no-preference)` to respect user accessibility.

### Body background

The body uses a three-stop dark void gradient
(`#07070A 0% → #0D0D15 40% → #12121A 100%`) — the signature Vegas/lotto surface,
not the shared flat `--surface-bg`.

### MarketingHeader/Footer overrides

The shared `MarketingHeader` receives `brandColor` from the platform config (now
neon blue). A CSS override in `app/globals.css` styles the sticky header with
`rgba(7,7,10,0.7)` background + `backdrop-filter: blur(8px)` + a neon-blue
bottom border to match the Canva reference navigation. The shared component is
NOT modified.

### Semantic tokens

The local `--color-success`, `--color-warning`, `--color-error`, `--color-info`
variables in `app/globals.css` mirror canonical-style.md §2.5 semantic tokens.
They remain local pending the shared-layer addition tracked as cleanup §13 item 7.

This palette is by Owner directive and is not drift.
