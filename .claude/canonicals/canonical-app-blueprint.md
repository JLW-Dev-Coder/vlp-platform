# Canonical: App Blueprint

**Status:** Authoritative
**Last updated:** 2026-04-15
**Owner:** JLW (Principal Engineer review required for changes)
**Scope:** All 8 apps in the vlp-platform monorepo

---

## 1. Purpose

This file is the **entry point** for frontend design decisions across the monorepo. It defines the tokens, rules, and references that every app must honor for new work. Each section either states the rule inline or points to the sub-canonical where the rule lives.

**Hierarchy of authority** (highest → lowest):
1. This file (`canonical-app-blueprint.md`) — the rules
2. Sub-canonicals (`canonical-style.md`, `canonical-site-nav.md`, `canonical-app-components.md`) — the patterns
3. Each app's `tailwind.config.ts` — the per-app token values
4. Root `CLAUDE.md` Platform Registry — human-readable index

If any two disagree, the higher entry wins. Drift is reported to Principal Engineer.

---

## 2. Scope boundary

**This canonical governs:**
- New components, new pages, new apps
- Refactors that touch visual surface
- Any code under `packages/member-ui/src/` (shared) regardless of age

**This canonical does NOT govern:**
- Existing components in shipped apps (grandfathered — see §4.9)
- Marketing copy, SEO, meta tags (not a design concern)
- Business logic, data shapes, API contracts (see Worker contracts)

---

## 3. The 20 Locked Decisions

Each row links to the section that codifies it. No row is advisory — all are binding.

| # | Decision | Answer | Codified in |
|---|----------|--------|-------------|
| 1 | TTMP/VLP reference access | Project knowledge search | §4.1 |
| 2 | Canonical organization | New blueprint + existing sub-docs authoritative | §1 |
| 3 | VLP as app reference | VLP dashboard + VLP marketing both reference | §4.3 |
| 4 | Token override depth | Full theming allowed, divergences documented | §4.4 |
| 5 | Required brand tokens | Six: primary, hover, dark, light, glow, text-on-primary | §4.5 |
| 6 | Per-platform colors | Reference only — see tailwind configs + registry | §4.6 |
| 7 | Light vs dark mode | Dark today, light planned | §4.7 |
| 8 | Typography stack | Sora + DM Sans + IBM Plex Mono | §4.8 |
| 9 | Retrofit strategy | Canonical for new work, grandfather existing | §4.9 |
| 10 | Heading scale | Dual scale (marketing vs app) | §4.10 |
| 11 | Spacing scale | 4px base + semantic tokens | §4.11 |
| 12 | Radius scale | Six-step + pill | §4.12 |
| 13 | Breakpoints | Tailwind default (640/768/1024/1280/1536) | §4.13 |
| 14 | Max-widths | Three (1280 marketing / 1200 app / 960 narrow) | §4.14 |
| 15 | Surface hierarchy | Four-level (bg, surface, elevated, input) | §4.15 |
| 16 | Borders | Four-state (subtle, default, hover, focus) | §4.16 |
| 17 | Shadows | Three-tier elevation + focus + brand glow | §4.17 |
| 18 | Animations | Six keyframes + timing tokens, reduced-motion for new work | §4.18 |
| 19 | Z-index stack | Six named tokens | §4.19 |
| 20 | Canonical structure | Master blueprint + sub-canonicals | §1 |

---

## 4. Decisions codified

### 4.1 Reference access
When drafting or reviewing frontend work, pull context via project knowledge search against TTMP (app reference) and VLP (marketing + dashboard reference). Do not infer patterns from memory.

### 4.3 VLP as reference
Two surfaces in VLP are both reference implementations:
- **VLP marketing** — public pages, landing, pricing
- **VLP dashboard** — authenticated member UI

When a new app needs a pattern, check VLP first. If VLP doesn't have it, TTMP second. If neither has it, the pattern is new — document it in the relevant sub-canonical before shipping.

### 4.4 Token override depth
Apps MAY override any token in their own `tailwind.config.ts`. Divergences MUST be documented in the app's CLAUDE.md under a "Theming Divergences" section. Undocumented divergences are drift and get flagged.

### 4.5 Required brand tokens
Every app's `tailwind.config.ts` MUST define these six brand tokens:

| Token | Purpose |
|-------|---------|
| `brand.primary` | Default brand color (buttons, links, accents) |
| `brand.hover` | Hover state for primary |
| `brand.dark` | Pressed/active state + darker accents |
| `brand.light` | Tinted backgrounds, badges, subtle fills |
| `brand.glow` | Focus rings, shadows, emphasis |
| `brand.text-on-primary` | Foreground color when placed on `brand.primary` |

Apps SHOULD also define this optional 7th token:

| Token | Purpose |
|-------|---------|
| `brand.gradient-to` | Second color for two-tone brand gradients (logo squares, hero backgrounds, CTA accents). Falls back to `brand.light` when unset. |

Apps may define additional tokens. They may NOT rename or omit the six required.

### 4.6 Per-platform colors
Brand color values are **per-app** and live in each app's `tailwind.config.ts` under `theme.extend.colors.brand`. This file does not embed hex values — embedding creates drift.

**Sources of truth, in order:**
1. `apps/<app>/tailwind.config.ts` — actual deployed values
2. Root `CLAUDE.md` Platform Registry — human-readable index
3. This file — never

If the registry and a tailwind config disagree, the tailwind config wins and the registry gets fixed.

### 4.7 Color mode
**Dark mode today. Light mode planned.**

Current state: all tokens authored for dark backgrounds. No light-mode variants exist yet. No `prefers-color-scheme` branches. No theme toggles shipped.

Planned state: user-controlled light/dark toggle in app profile settings. Preference stored per user. Every token in `canonical-style.md` will have a light-mode pair.

**Blocked on:**
1. Light-mode token authoring in `canonical-style.md`
2. Dual token definitions in each app's `tailwind.config.ts`
3. Worker contract addition: user `theme_preference` field
4. Component audit across shipped apps

Until those four items land, treat dark-only as the authoritative rule. Do not add light-mode variants piecemeal — it's a canonical-level rollout, not a per-component decision.

**Owner:** JLW. Principal Engineer review required to schedule the rollout.

### 4.8 Typography stack
Three font families, no more:

| Family | Usage | Loading |
|--------|-------|---------|
| **Sora** | Display, headings | `next/font/google` |
| **DM Sans** | Body, UI | `next/font/google` |
| **IBM Plex Mono** | Code, data, numeric tables | `next/font/google` |

Apps MUST load fonts via `next/font` (not CDN `<link>` tags). Fallback stacks are the Tailwind defaults for `sans` and `mono`.

### 4.9 Retrofit strategy
**New work:** must follow this canonical.
**Existing apps:** grandfathered. Do not refactor shipped components solely to align with tokens. When a grandfathered component is touched for any other reason, bring it into alignment as part of the change.

Shared packages (`packages/member-ui/`) are NOT grandfathered — they govern multiple apps and drift compounds.

### 4.10 Heading scale
Two scales, picked by context:

**Marketing scale** (landing pages, long-form):
`display-xl` / `display-lg` / `h1` / `h2` / `h3` / `h4`

**App scale** (dashboards, authenticated UI):
`h1` / `h2` / `h3` / `h4` / `h5`

Actual rem values live in `canonical-style.md`. Apps pick one scale per surface — never mix within a single page.

### 4.11 Spacing scale
**Base:** 4px. Tailwind's default `spacing` scale is preserved.

**Semantic overlays** (defined in `canonical-style.md`):
`space-section` / `space-block` / `space-inline` / `space-tight`

Use semantic tokens for layout primitives. Use raw values (`p-4`, `gap-6`) for one-off adjustments inside components.

### 4.12 Radius scale
Six steps plus pill:

`rounded-none` / `rounded-sm` / `rounded-md` / `rounded-lg` / `rounded-xl` / `rounded-2xl` / `rounded-full`

Component defaults (button = `md`, card = `lg`, modal = `xl`, badge = `full`) are codified in `canonical-app-components.md`.

### 4.13 Breakpoints
Tailwind defaults, unmodified:

`sm: 640px` / `md: 768px` / `lg: 1024px` / `xl: 1280px` / `2xl: 1536px`

Apps MUST NOT redefine breakpoints. Custom media queries inside components are allowed for component-internal layout only.

### 4.14 Max-widths
Three container widths:

| Token | Width | Usage |
|-------|-------|-------|
| `max-w-marketing` | 1280px | Marketing pages, landing, pricing |
| `max-w-app` | 1200px | Dashboard, authenticated app views |
| `max-w-narrow` | 960px | Article content, forms, single-column flows |

### 4.15 Surface hierarchy
Four-level surface stack for dark mode:

| Token | Usage |
|-------|-------|
| `bg` | Page background (deepest) |
| `surface` | Cards, panels, primary container |
| `elevated` | Modals, popovers, dropdowns |
| `input` | Form fields, code blocks, inset surfaces |

Hex values live in `canonical-style.md`. Surfaces do NOT nest arbitrarily — `elevated` on top of `surface` is allowed, `surface` on top of `surface` is not.

### 4.16 Borders
Four-state border system:

| Token | Usage |
|-------|-------|
| `border-subtle` | Dividers, section breaks |
| `border-default` | Default component borders |
| `border-hover` | Hover state for interactive elements |
| `border-focus` | Focused inputs, selected cards |

### 4.17 Shadows
Three elevation tiers plus two effect shadows:

| Token | Usage |
|-------|-------|
| `shadow-sm` | Cards, subtle lift |
| `shadow-md` | Popovers, dropdowns |
| `shadow-lg` | Modals, high-elevation overlays |
| `shadow-focus` | Focus ring (uses `brand.glow`) |
| `shadow-brand` | Brand emphasis glow (uses `brand.glow`) |

### 4.18 Animations
Six named keyframes + timing tokens:

**Keyframes:** `fade-in` / `fade-out` / `slide-up` / `slide-down` / `scale-in` / `pulse-subtle`

**Timing:** `duration-fast` (150ms) / `duration-base` (250ms) / `duration-slow` (400ms)

**Easing:** `ease-out` for enter, `ease-in` for exit, `ease-in-out` for neutral.

**Reduced motion:** required for new work. Every new animation MUST be wrapped in `@media (prefers-reduced-motion: no-preference)` or use Tailwind's `motion-safe:` variant.

Existing animations in shipped apps are grandfathered under §4.9 — bring them into compliance when the containing component is touched for any other reason.

### 4.19 Z-index stack
Six named tokens, no raw z-index values in components:

| Token | Value | Usage |
|-------|-------|-------|
| `z-base` | 0 | Default |
| `z-dropdown` | 10 | Dropdowns, select menus |
| `z-sticky` | 20 | Sticky headers, topbars |
| `z-overlay` | 30 | Modal backdrops |
| `z-modal` | 40 | Modal content |
| `z-toast` | 50 | Toasts, notifications |

Raw `z-[9999]` class usage is drift.

---

## 5. Sub-canonicals

This blueprint stays high-level. Depth lives in sub-canonicals:

- **`canonical-style.md`** — token rem/hex values, component patterns, utility classes
- **`canonical-site-nav.md`** — topbar, sidebar, mobile nav, footer patterns
- **`canonical-app-components.md`** — dashboard layouts, forms, modals, toasts, empty states
- **`canonical-dashboard-pages.md`** — standard authenticated page specifications (Dashboard, Tokens, Affiliate, Profile, Account, Support)
- **`canonical-feature-matrix.md`** — per-app feature inventory (unchanged)
- **`canonical-feature-benefits.md`** — per-app benefit copy (unchanged)

Sub-canonicals MAY codify anything not contradicted by this blueprint. They MAY NOT override decisions in §3.

---

## 6. Change control

Changes to this file require:
1. Principal Engineer review (per `ROLES.md` §1)
2. Impact evaluation against all 8 apps
3. Sub-canonical updates in the same PR if decisions cascade

Changes to sub-canonicals require:
1. Principal Engineer review if the change touches any §3 decision
2. Self-review otherwise

Changes to `tailwind.config.ts` in any app require:
1. "Theming Divergences" entry in the app's CLAUDE.md if the change diverges from canonical defaults
2. No Principal review for in-canonical changes (e.g., swapping brand hex within the six-token structure)

---

## 7. Decision log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-15 | Created blueprint with 20 locked decisions | Consolidate scattered design rules, prevent drift |
| 2026-04-15 | Per-platform colors = reference only (§4.6) | Registry fix of 4 apps proved hex-in-docs creates drift |
| 2026-04-15 | §4.7 changed from dark-only to dark-today-light-planned | Owner wants user toggle in profile; scoped as follow-up project |
| 2026-04-15 | §4.18 reduced-motion scoped to new work + grandfather | Consistency with §4.9 retrofit strategy |
| 2026-04-16 | Added optional `brand.gradient-to` 7th brand token | Two-tone brand gradients in shared MarketingHeader/Footer logos looked flat when `brand.light` was an alpha-tinted variant of `brand.primary` (e.g. TCVLP yellow → 15%-alpha yellow). Proper second color produces richer brand identity per platform. |

Append-only. Do not rewrite prior entries.
