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

The following local tokens exist in `app/globals.css` and are NOT part of the shared
canonical token set. They power CSS Module marketing pages scheduled for Tier 3
migration (WLVLP-CANON MarketingHeader/Footer adoption).

| Variable | Value | Used By | Canonical Equivalent (post-migration) |
|----------|-------|---------|---------------------------------------|
| `--void` | `#07070A` | `app/page.module.css`, `app/asset/[slug]/page.module.css`, body gradient | `--surface-bg` |
| `--charcoal` | `#12121A` | `app/page.module.css` (mobile panel), body gradient | `--surface-elevated` |
| `--neon-blue` | `#00D4FF` | `app/page.module.css`, `app/asset/[slug]/page.module.css` (logo, hover, accents) | `--brand-primary` |
| `--neon-yellow` | `#FFE534` | `app/page.module.css`, `app/asset/[slug]/page.module.css` | TBD (accent token) |
| `--neon-magenta` | `#FF2D8A` | `app/page.module.css` (gradients only) | TBD (accent token) |
| `--neon-cyan` | `#00F0D0` | `app/page.module.css` (marquee gradient only) | TBD (accent token) |

**Body background:** `app/globals.css` applies a custom three-stop gradient
(`--void` → `#0D0D15` → `--charcoal`) rather than the flat shared `--surface-bg`.
The middle stop `#0D0D15` has no token alias — it's a visual-only blend step.
This divergence is intentional for marketing pages and will be revisited during Tier 3.

**`--text-muted` note:** WLVLP previously defined a local `--text-muted: #888888`.
This local has been removed — references now resolve to the shared
`rgba(255, 255, 255, 0.66)` value, which is authoritative per `canonical-style.md` §2.4.

These divergences will be removed when WLVLP marketing pages migrate from CSS Modules
to Tailwind + shared tokens (Tier 3 scope).
