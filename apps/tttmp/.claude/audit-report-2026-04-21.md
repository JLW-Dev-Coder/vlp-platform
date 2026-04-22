# TTTMP Canonical Drift Report
**Date:** 2026-04-21
**Auditor:** RC (Claude Code)
**Reviewer:** Principal Engineer (Chat Claude)
**Scope:** `apps/tttmp/` + TTTMP routes in `apps/worker/src/index.js`
**Method:** Read-only; no code changes except this report and the placeholder
instruction file at `.claude/instructions/tttmp-vesperi-youtube.md`.

---

## Summary

- Total findings: **29**
- Fix now: **9**
- Fix with Vesperi work: **11**
- Fix later: **9**

### Audit matrix (by canonical)

| # | Canonical | Status |
|---|-----------|--------|
| 1.1 | canonical-claude.md | ⚠️ Partial — CLAUDE.md exists but omits most required sections |
| 1.2 | canonical-style.md | ❌ Non-compliant — extensive hardcoded colors, raw z-index, CSS-Module sprawl |
| 1.3 | canonical-site-nav.md | ❌ Non-compliant — PlatformConfig shape divergent; nav does not match §1/§2 |
| 1.4 | canonical-app-components.md | ❌ Non-compliant — local `Header`, `SiteFooter`, `CtaBanner`, `SupportModal` instead of shared `@vlp/member-ui` primitives |
| 1.5 | canonical-seo.md | ✅ Compliant |
| 1.6 | canonical-cookies.md | ⚠️ Partial — CookieConsent mounted, PostHog wired in config, but `PostHogPageview` mount is in root layout (acceptable) and feature-matrix still lists it as `—` for TTTMP |
| 1.7 | canonical-cal-events.md | ⚠️ Partial — PlatformConfig Cal fields correct, but `components/SupportModal.tsx:39,76` still hardcodes `https://cal.com/${slug}` |
| 1.8 | canonical-deploy.md | ❌ Non-compliant — `next.config.ts` sets `output: 'export'` which conflicts with the declared `@cloudflare/next-on-pages` adapter |
| 1.9 | canonical-api.md | ⚠️ Partial — all 10 canonical TTTMP routes exist in the Worker; `POST /v1/tttmp/checkout/sessions` auth mismatch (canonical says public, code requires session); frontend does not use any `/v1/tttmp/*` routes — it calls shared `/v1/*` routes instead |
| 1.10 | canonical-feature-matrix.md | ⚠️ Partial — frontend path mismatch (matrix says `/about-games/[slug]`, code has `/games/[slug]`); `PostHogPageview`, `CookieConsent`, `ManageCookiesLink` listed as `—` for TTTMP but are actually wired |

---

## Objective 0 status

**Not completed as specified.** The Owner did not include the project
instruction body in the Phase 0 RC prompt. RC created a placeholder at
`.claude/instructions/tttmp-vesperi-youtube.md` explaining what is missing and
flagged the omission as finding **F-01** below. When the Owner provides the
instruction text, replace the placeholder body and commit.

---

## Fix Now (blocks new work)

### F-01 — Project instruction body missing
- **Canonical:** Phase 0 prompt, Objective 0
- **Expected:** Full content of *"Project Instruction — TTTMP Canonical Audit + Vesperi AI Guide + YouTube Channel"* saved to `.claude/instructions/tttmp-vesperi-youtube.md`.
- **Actual:** Prompt referenced the document but did not paste its content; RC wrote a placeholder instead.
- **File(s):** `.claude/instructions/tttmp-vesperi-youtube.md`
- **Fix:** Owner pastes the instruction text; RC replaces the placeholder body.

### F-02 — `next.config.ts` adapter / output mismatch
- **Canonical:** `canonical-deploy.md` §2.2 and root `CLAUDE.md` §4
- **Expected:** TTTMP uses `@cloudflare/next-on-pages` → output `.vercel/output/static`; `next.config.ts` should not force a static export.
- **Actual:** `apps/tttmp/next.config.ts:3-5` sets `output: 'export'`. With `next build` (the `npm run build` script) this writes to `out/`, not `.vercel/output/static`. The `pages:build` script runs `@cloudflare/next-on-pages` but will disagree with the export setting.
- **File(s):** `apps/tttmp/next.config.ts:3-5`
- **Fix:** Remove `output: 'export'`. Rely on `pages:build` + `@cloudflare/next-on-pages` for Pages output.

### F-03 — PlatformConfig shape divergent from `canonical-site-nav.md` §3
- **Canonical:** `canonical-site-nav.md` §3
- **Expected:** `platform`, `platformName`, `tagline`, `summary`, `themeColor`, `apiBaseUrl`, `ctaLabel`, `ctaPath`, `megaMenu { discover, explore, toolsExtras, ctaText, ctaMagnetLabel, ctaMagnetPath }`, `footerResources`, `navSections`.
- **Actual:** `apps/tttmp/lib/platform-config.ts` uses `brandName`, `brandAbbrev`, `brandColor`, `brandSubtitle`, `logoText`. No `platform`, `platformName`, `tagline`, `summary`, `themeColor`, `ctaLabel`, `ctaPath`, `megaMenu`, or `footerResources`. `navSections` uses `href` (should be `path`) and adds non-canonical `external` flag.
- **File(s):** `apps/tttmp/lib/platform-config.ts:1-66`; `packages/member-ui/src/types/config.ts` (also needs reconciliation)
- **Fix:** Reconcile `PlatformConfig` type in `@vlp/member-ui` with the canonical shape; migrate TTTMP (and every other app that already uses `brand*` naming) in lockstep. This is monorepo-wide — do it as a dedicated task, not inline.

### F-04 — Marketing nav missing required items
- **Canonical:** `canonical-site-nav.md` §1 Header table
- **Expected:** About, Features, Pricing, How It Works, Contact, Reviews, Resources (mega menu).
- **Actual:** `apps/tttmp/components/Header.tsx:34-36` only renders Games, Tokens/Pricing, plus auth actions. No About, Features, How It Works, Contact, Reviews, or Resources mega menu.
- **File(s):** `apps/tttmp/components/Header.tsx:28-60`
- **Fix:** Adopt shared `MarketingHeader` from `@vlp/member-ui` driven by `PlatformConfig.megaMenu`; retire the local `Header` component.

### F-05 — Sidebar/WORKSPACE nav missing canonical entries
- **Canonical:** `canonical-site-nav.md` §2 WORKSPACE/SETTINGS tables
- **Expected:** WORKSPACE includes Dashboard (`/dashboard`) and Game Analytics (TTTMP, `/dashboard/game-analytics`). SETTINGS includes Account, Profile, Support, Usage. EARNINGS includes Affiliate, Bidding, Winning.
- **Actual:** TTTMP `navSections` has no `/dashboard`, no `/dashboard/game-analytics`, no Profile, no Usage, no Bidding, no Winning. Dashboard link points to `/account`.
- **File(s):** `apps/tttmp/lib/platform-config.ts:22-44`
- **Fix:** Populate all required WORKSPACE/EARNINGS/SETTINGS items. Route Dashboard to `/dashboard`, not `/account`. Keep any TTTMP-specific simplification rationale documented in `apps/tttmp/.claude/CLAUDE.md`.

### F-06 — Hardcoded Cal.com URL in SupportModal
- **Canonical:** `canonical-cal-events.md` §4 (element-click popup pattern) and §6 (drift audit already lists TTTMP SupportModal)
- **Expected:** `data-cal-link`, `data-cal-namespace`, `data-cal-config` attributes plus one-time `Cal("init", ...)` using `PlatformConfig.calBookingSlug` + `calBookingNamespace`. No string interpolation of `https://cal.com/...`.
- **Actual:** `apps/tttmp/components/SupportModal.tsx:39,76` builds `https://cal.com/${slug}` and opens in a new tab.
- **File(s):** `apps/tttmp/components/SupportModal.tsx:39,76`
- **Fix:** Replace with the shared element-click Cal pattern (ideally via the shared `HelpCenter` component). The canonical already flags this under §6 drift.

### F-07 — Hardcoded `#8b5cf6`/`#7c3aed` gradients in `tailwind.config.ts`
- **Canonical:** `canonical-style.md` §2.1 brand-token contract
- **Expected:** Brand colors come from the shared token layer / PlatformConfig; `backgroundImage` should reference `var(--brand-*)` tokens.
- **Actual:** `apps/tttmp/tailwind.config.ts:37` hardcodes `#8b5cf6` and `#7c3aed` in a `gradient-brand` entry.
- **File(s):** `apps/tttmp/tailwind.config.ts:17,37`
- **Fix:** Replace with `var(--brand-primary)` / `var(--brand-hover)` token references. `brand.purple` helper at line 17 is not in the canonical six-token set — either delete or align.

### F-08 — Raw z-index values above canonical max (50)
- **Canonical:** `canonical-style.md` §8 z-index tokens (`z-toast` = 50 is the max)
- **Expected:** `z-base`, `z-dropdown` (10), `z-sticky` (20), `z-modal` (40), `z-toast` (50).
- **Actual:**
  - `apps/tttmp/components/Header.module.css:4` — `z-index: 100`
  - `apps/tttmp/components/SupportModal.module.css:4` — `z-index: 1000`
  - `apps/tttmp/components/SupportModal.module.css:40` — `z-index: 1`
  - `apps/tttmp/app/games/[slug]/page.module.css:334` — `z-index: 100`
- **Fix:** Migrate to canonical tokens: Header → `z-sticky`, SupportModal → `z-modal`.

### F-09 — API auth mismatch on `/v1/tttmp/checkout/sessions`
- **Canonical:** `canonical-api.md` TTTMP section
- **Expected:** `POST /v1/tttmp/checkout/sessions` — no auth (public checkout).
- **Actual:** `apps/worker/src/index.js:11619` requires a TTTMP session before creating the checkout session.
- **Fix:** Either (a) fix the Worker to match the canonical (public checkout with account creation on webhook), or (b) fix the canonical to match the code if auth-gated checkout is the intended design. Owner must decide.

---

## Fix with Vesperi Work (Phase 2)

These compound with the Vesperi AI guide / YouTube scope — natural to resolve while refactoring TTTMP marketing and dashboard surfaces.

### F-10 — `apps/tttmp/.claude/CLAUDE.md` missing 8 of 12 required sections
- **Canonical:** `canonical-claude.md` §1 Required Sections
- **Expected:** 12 sections including Terminology, App Structure, Data Contracts, API Endpoints Used, External Interfaces, Personalization / Business Logic, Testing expectations, and Changelog.
- **Actual:** Current file has identity, shared components list, feature list, route structure, build. Missing: Hard Constraints, Terminology, Data Contracts, API Endpoints Used, External Interfaces, Personalization, Testing, Changelog.
- **File(s):** `apps/tttmp/.claude/CLAUDE.md`

### F-11 — CSS Module sprawl (15 files, ~80% of app styling)
- **Canonical:** `canonical-style.md` §1.3 prefer Tailwind utilities
- **Actual:** 15 `.module.css` files in `apps/tttmp/app/` and `apps/tttmp/components/`. Contact page, account, affiliate, games (index, slug, play), pricing, sign-in, CtaBanner, FaqItem, Header, LegalPage, SiteFooter, SupportModal, root `page.module.css`.
- **Fix:** Migrate to Tailwind + shared components during Vesperi rewrite; delete modules as pages convert.

### F-12 — Local `Header`/`SiteFooter`/`CtaBanner` instead of shared components
- **Canonical:** `canonical-app-components.md` + `canonical-site-nav.md` §4.1
- **Actual:** `apps/tttmp/components/Header.tsx`, `SiteFooter.tsx`, `CtaBanner.tsx` implement their own markup and styling.
- **Fix:** Replace with shared `MarketingHeader`, `MarketingFooter`, and the canonical CTA banner pattern from `@vlp/member-ui`. Delete local copies.

### F-13 — `SupportModal` local component
- **Canonical:** `canonical-app-components.md` Modal + `canonical-cal-events.md` §4
- **Actual:** `apps/tttmp/components/SupportModal.tsx` is a local modal with hardcoded Cal URLs (see F-06).
- **Fix:** Use shared `HelpCenter` element-click Cal trigger. Retire this modal.

### F-14 — No `AppShell` / authenticated member layout
- **Canonical:** `canonical-site-nav.md` §2.1 ("Support and Affiliate pages ... wrapped by `AppShell` from `@vlp/member-ui` with the app's `platformConfig`")
- **Actual:** `apps/tttmp/.claude/CLAUDE.md` explicitly says "No full dashboard — simple account page with balance + token purchase." No `AppShell`, no `AuthGuard`, no `MemberSidebar`, no `MemberTopbar`. `/affiliate` and `/account` are not wrapped.
- **Fix:** Wire `AppShell` + `AuthGuard` for authenticated surfaces during Vesperi Phase 2. Add `/dashboard` with sidebar.

### F-15 — `/dashboard/game-analytics` page missing
- **Canonical:** `canonical-site-nav.md` §2 WORKSPACE table + `canonical-feature-matrix.md` TTTMP section
- **Actual:** Matrix lists this route as `planned`. No page exists.
- **Fix:** Build during Vesperi Phase 2 or defer explicitly in updated matrix.

### F-16 — Feature-matrix frontend path mismatch
- **Canonical:** `canonical-feature-matrix.md:113`
- **Expected/Actual:** Matrix says `Tax Tools Arcade Games` → frontend path `/about-games/[slug]`. Code uses `/games/[slug]`. No `/about-games/*` route exists.
- **Fix:** Update `canonical-feature-matrix.md:113` to `/games/[slug]` (path actually shipped).

### F-17 — Feature-matrix rollout table outdated for TTTMP
- **Canonical:** `canonical-feature-matrix.md:47-52`
- **Actual:** Shows TTTMP as `—` for `PostHogPageview`, `CookieConsent`, `ManageCookiesLink`. But `apps/tttmp/app/layout.tsx:63-66` mounts `CookieConsent` and `PostHogPageview`, and `PlatformConfig.posthog` is populated.
- **Fix:** Update matrix rows to reflect live status.

### F-18 — Frontend bypasses `/v1/tttmp/*` routes
- **Canonical:** `canonical-api.md` TTTMP scoping
- **Actual:** Worker exposes TTTMP-scoped auth/checkout/support routes, but `apps/tttmp/lib/api.ts` calls shared `/v1/auth/*`, `/v1/checkout/*`, `/v1/support/tickets`, `/v1/tokens/balance/*`, `/v1/games/*`, `/v1/affiliates/*`.
- **Fix:** Decide which is authoritative. Either (a) delete the `/v1/tttmp/*` scoped routes from the Worker and the canonical, or (b) migrate the frontend to call them. This is a backend decision — flag to Principal Engineer.

### F-19 — Missing marketing pages: `/about`, `/features`, `/how-it-works`, `/reviews`
- **Canonical:** `canonical-site-nav.md` §1 + `canonical-app-pages.md` (already flagged 2026-04-19 for TTTMP)
- **Actual:** Only `/`, `/games`, `/pricing`, `/contact`, `/legal/*`, `/sign-in`, `/account`, `/affiliate` exist.
- **Fix:** Build marketing pages during Vesperi Phase 2 (these are natural homes for Vesperi AI positioning).

### F-20 — Missing authenticated pages: `/dashboard/profile`, `/dashboard/usage`, `/dashboard/support`, `/dashboard/affiliate`, `/dashboard/account`, `/dashboard/bidding`, `/dashboard/winning`
- **Canonical:** `canonical-site-nav.md` §2
- **Actual:** Only `/account` and `/affiliate` (top-level, not under `/dashboard`).
- **Fix:** Build during Vesperi Phase 2 with `AppShell` wrapper.

---

## Fix Later (cosmetic / low-priority)

### F-21 — App-root clutter: `STYLE.md`, `SCALE.md`, `ROLES.md`, `SKILL.md`, `WORKFLOW.md`, `MARKET.md` at `apps/tttmp/`
- **Canonical:** Root `CLAUDE.md` §6 — "Canonicals live ONLY at monorepo root"
- **Actual:** Each of these files exists at `apps/tttmp/*.md`. They are app-level instantiations, not canonicals, but their presence predates the canonical-consolidation rule and duplicates content that should live in root canonicals or `apps/tttmp/.claude/CLAUDE.md`.
- **Fix:** Review each file. If content is still relevant, fold into `apps/tttmp/.claude/CLAUDE.md` or delete. If pure duplication of root canonical content, delete.

### F-22 — Non-brand hex values across CSS Modules
- **Canonical:** `canonical-style.md` §1.3
- **Actual:** `#f59e0b` (amber) in `app/globals.css:11`, `components/LegalPage.module.css:16,63,70`, `app/contact/page.module.css:61`, `app/pricing/page.module.css:30`, `app/games/page.module.css:20`. `#fbbf24`, `#10b981`, `#3b82f6` in games card/badge backgrounds. `#0F0F1A` for `--bg` in globals.css:22.
- **Fix:** Replace with tokens during Tailwind migration (see F-11).

### F-23 — Non-canonical `select` styling
- **Canonical:** `canonical-style.md` §9
- **Actual:** `apps/tttmp/app/contact/page.tsx:119-127` + `page.module.css:74-77`. Missing custom chevron SVG; text size 0.9375rem (below 1rem iOS floor).
- **Fix:** Apply canonical §9 rules or replace with shared select primitive.

### F-24 — Raw shadows
- **Canonical:** `canonical-style.md` §6
- **Actual:** `app/contact/page.module.css:61` (`0 0 0 3px rgba(245,158,11,0.15)`), `app/games/page.module.css:72` (`0 10px 30px -10px rgba(245,158,11,0.25)`).
- **Fix:** Use `shadow-focus` and `shadow-md` tokens.

### F-25 — Local CSS variables shadow shared token layer
- **Canonical:** `canonical-style.md` §1.1
- **Actual:** `app/globals.css` redefines `--accent`, `--surface*`, `--text*`, `--bg`, `--fg`, `--line` that also exist in the shared token layer.
- **Fix:** Remove local redefinitions; rely on `@vlp/member-ui` token import.

### F-26 — Dashboard duplicate link
- **Canonical:** `canonical-site-nav.md` §2
- **Actual:** `navSections` defines Dashboard (`/account`) and Account (`/account`) as separate links to the same path.
- **Fix:** Collapse when rebuilding sidebar (covered by F-05).

### F-27 — Platform emoji in header (`🪙`)
- **Canonical:** Root `CLAUDE.md` system/defaults — "Only use emojis if the user explicitly requests it"
- **Actual:** `apps/tttmp/components/Header.tsx:41` uses `🪙` for the token balance.
- **Fix:** Replace with a lucide icon (`Coins`) during Header migration (F-04).

### F-28 — `Games`, `Tokens`, `Support` sidebar items marked `external: true`
- **Canonical:** `canonical-site-nav.md` NavItem shape
- **Actual:** `apps/tttmp/lib/platform-config.ts:27,28,42` set `external: true` on internal same-domain routes (`/games`, `/pricing`, `/contact`).
- **Fix:** Remove the `external` flag (or, if intentional to force full page reload, document why in app CLAUDE.md).

---

## Compliant Items

- **1.5 canonical-seo.md** — `app/sitemap.ts`, `app/robots.ts`, `generatePageMeta` usage on `app/page.tsx`, and `BusinessJsonLd` in root layout all match canonical.
- **Cal slugs in PlatformConfig** — `calBookingSlug: 'tax-monitor-pro/tttmp-support'`, `calIntroSlug: 'tax-monitor-pro/tttmp-intro'` are exactly as canonical §3 requires.
- **Cookie storage key convention** — Implicitly derived from `brandAbbrev: 'TTTMP'` → `tttmp_cookie_prefs_v1` via shared `CookieConsent`. No override.
- **PostHog config** — `apps/tttmp/lib/platform-config.ts:10-17` matches canonical-cookies.md §Analytics Integration shape.
- **businessInfo block** — Populated with Lenore, Inc. entity and address, per `canonical-legal.md`.
- **Deploy surface-area (Pages project name)** — Cloudflare Pages project `taxtools-taxmonitor-pro-site` and deploy method match canonical-deploy.md §2.2. The failure is isolated to `next.config.ts` (F-02).
- **Worker-side TTTMP route surface** — All 10 canonical TTTMP routes are present in `apps/worker/src/index.js` (lines 11456-11833). Only one auth mismatch (F-09).

---

## Additional Findings Discovered During Build Verification

### F-29 — Duplicate legal pages (Fix Later)
- **Canonical:** `canonical-legal.md`
- **Expected:** Canonical legal paths are `/legal/privacy`, `/legal/refund`, `/legal/terms`.
- **Actual:** Both canonical paths AND legacy top-level `/privacy`, `/refunds`, `/terms` exist in the build output. Legacy pages should be removed or redirected.
- **File(s):** `apps/tttmp/app/privacy/page.tsx`, `apps/tttmp/app/refunds/page.tsx`, `apps/tttmp/app/terms/page.tsx`
- **Fix:** Delete legacy pages; add redirects at the Cloudflare Pages `_redirects` layer if inbound links exist.

## Build Verification

```bash
npx turbo build --filter=tttmp
```

**Result:** ✅ Passed (16.5s, 24 routes prerendered). Despite F-02, `next build`
with `output: 'export'` writes to `out/` successfully. However this is a latent
deploy-pipeline bug — the canonical pipeline expects `.vercel/output/static`
via `pages:build`. A clean `next build` does not validate the actual Pages
deploy pipeline.
