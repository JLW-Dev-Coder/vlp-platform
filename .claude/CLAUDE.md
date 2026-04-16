# CLAUDE.md — vlp-platform (Monorepo)

Last updated: 2026-04-15

---

## 1. Identity

**Repo:** vlp-platform
**Structure:** Turborepo monorepo
**Purpose:** All 8 VLP ecosystem platform frontends + Worker + shared packages

---

## 2. What This Repo Is

The unified monorepo for every platform in the VLP ecosystem. Contains:
- **8 platform frontends** (Next.js apps, static exports)
- **1 Cloudflare Worker** (the single backend for all platforms)
- **Shared packages** (`@vlp/member-ui` — shared UI components, types, styles)
- **Canonical documents** (`.claude/canonicals/` — single source of truth)

Every platform that previously lived in its own repo is migrated here.

---

## 3. Platform Registry

| Platform | Abbrev | Domain | App Dir | Adapter | Brand Color |
|----------|--------|--------|---------|---------|-------------|
| Virtual Launch Pro | VLP | virtuallaunch.pro | `apps/vlp` | `@cloudflare/next-on-pages` | `#f97316` (orange) |
| Tax Monitor Pro | TMP | taxmonitor.pro | `apps/tmp` | static export | `#f59e0b` (amber) |
| Transcript Tax Monitor | TTMP | transcript.taxmonitor.pro | `apps/ttmp` | `@opennextjs/cloudflare` (Workers) | `#14b8a6` (teal) |
| Tax Tools Arcade | TTTMP | taxtools.taxmonitor.pro | `apps/tttmp` | `@cloudflare/next-on-pages` | `#8b5cf6` (violet) |
| Developers VLP | DVLP | developers.virtuallaunch.pro | `apps/dvlp` | `@cloudflare/next-on-pages` | `#3b82f6` (blue) |
| Games VLP | GVLP | games.virtuallaunch.pro | `apps/gvlp` | static export | `#22c55e` (green) |
| Tax Claim VLP | TCVLP | taxclaim.virtuallaunch.pro | `apps/tcvlp` | static export | `#eab308` (yellow) |
| Website Lotto VLP | WLVLP | websitelotto.virtuallaunch.pro | `apps/wlvlp` | static export | `#a855f7` (purple) |
| VLP Worker | — | api.virtuallaunch.pro | `apps/worker` | Cloudflare Worker | — |

**Authoritative source:** each app's `tailwind.config.ts` at `theme.extend.colors.brand.500`. If this table and the Tailwind config diverge, the Tailwind config wins. Update this table whenever a platform's brand color changes.

---

## 4. Cloudflare Build Config

| Platform | Pages Project | Build Command | Output Dir | Adapter |
|----------|--------------|---------------|-----------|---------|
| VLP | `virtuallaunch-pro-web` | `cd web && npm install && npm run pages:build` | `web/.vercel/output/static` | `@cloudflare/next-on-pages` |
| TMP | `taxmonitor-pro-site` | `npm run build` | `out` | static export |
| TTMP | `transcript-taxmonitor-pro` (Worker) | `npm run cf:build` | `.open-next/` | `@opennextjs/cloudflare` (Workers, not Pages) |
| TTTMP | `taxtools-taxmonitor-pro-site` | `npx @cloudflare/next-on-pages` | `.vercel/output/static` | `@cloudflare/next-on-pages` |
| DVLP | `developers-virtuallaunch-pro-site` | `npm run pages:build` | `.vercel/output/static` | `@cloudflare/next-on-pages` |
| GVLP | `games-virtuallaunch-pro` | `npm run build` | `out` | static export |
| TCVLP | `taxclaim-virtuallaunch-pro` | `npm run build` | `out` | static export |
| WLVLP | `websitelotto-virtuallaunch-pro` | `npm run build` | `out` | static export |

**TTMP deployment note:** TTMP uses Cloudflare Workers (not Pages) via `@opennextjs/cloudflare` and GitHub Actions CI/CD. All other platforms remain on Pages. TTMP deploys exclusively from the vlp-platform monorepo (`apps/ttmp/`). The standalone `transcript.taxmonitor.pro` repo is deprecated and must not be used for builds or deploys. Its GitHub Actions workflow has been removed.

---

## 5. Shared Packages

### `packages/member-ui` (`@vlp/member-ui`)

The shared component library for all platform member areas. Contains:
- **PlatformConfig type** — each app provides its own config to the shared layout
- **Shared components** — sidebar, nav, member layout (migrated in Phase 2)
- **CSS variables** — structural member area variables (`--member-card`, `--member-border`, etc.)
- **Tailwind config** — shared Tailwind preset mapping CSS vars to utility classes

Apps depend on this package via workspace dependency: `"@vlp/member-ui": "*"`

**Tailwind version:** All 8 apps use Tailwind CSS v3 (3.4.17) with the `content` array in `tailwind.config.ts` for content scanning. When adding new shared packages or component directories, add the path to each app's `tailwind.config.ts` content array.

**CSS variable syntax:** Use `bg-[var(--member-card)]` (explicit `var()`) in arbitrary Tailwind classes. This is the safest form and avoids ambiguity.

---

## 6. Canonical Documents

All canonical documents live in `.claude/canonicals/` at the monorepo root.

**Hard rules:**
- Canonicals live ONLY at monorepo root — apps do NOT have their own copies
- Each app's `.claude/CLAUDE.md` is app-specific context only — shared context lives here
- Never duplicate a canonical into an app directory
- When a canonical is updated, it applies to all apps immediately

### Canonical files (20 total):

| File | Purpose | Use when... |
|------|---------|-------------|
| `canonical-app-blueprint.md` | Master blueprint, entry point for all design decisions (see §1 hierarchy) | Starting any frontend work, refactor, or new app |
| `canonical-app-components.md` | Component-level specs — layout primitives, cards, forms, modals, toasts, empty states, loading states. | Designing or shipping components inside the content area of any app |
| `canonical-api.md` | Master API endpoint registry (~193 routes) | Documenting, adding, or referencing Worker API endpoints |
| `canonical-claude.md` | CLAUDE.md template for app-level context | Creating or editing any app's `.claude/CLAUDE.md` |
| `canonical-contract.json` | Contract JSON schema (7 required sections) | Creating or modifying any data contract |
| `canonical-contract-registry.json` | Registry entry schema (required fields) | Adding entries to platform registries |
| `canonical-deploy.md` | Per-adapter deploy procedures + rollback | Deploying any platform or troubleshooting deploys |
| `canonical-feature-benefits.md` | Human-readable benefit descriptions per feature across all 8 platforms ("what does this do for me") | Writing user-facing feature copy or positioning benefits |
| `canonical-feature-matrix.md` | Feature → Worker route / storage / frontend page / build status mapping across all 8 platforms | Tracking what's live/partial/planned per platform |
| `canonical-index.html` | Landing page structure (8 required sections) | Creating or editing landing pages |
| `canonical-market.md` | Market positioning template (12 sections) | Writing marketing copy or positioning docs |
| `canonical-readme.md` | README template (14 sections) | Creating or editing README files |
| `canonical-roles.md` | Role definitions (Principal, Execution, Owner) | Understanding role boundaries and escalation |
| `canonical-scale.md` | SCALE batch operations pipeline template | Working on SCALE outreach, enrichment, or email pipeline |
| `canonical-site-nav.md` | Standard navigation structure (marketing + member) for all 8 platform frontends | Adding, removing, or reordering nav items on any platform |
| `canonical-skill.md` | SKILL.md template (11 sections) | Defining reusable execution skills |
| `canonical-stack.md` | Platform stack matrix + architecture decisions | Understanding platform tech choices, adapters, or domains |
| `canonical-style.md` | Design tokens, typography, layout patterns | Styling components, pages, or creating new UI |
| `canonical-workflow.md` | Operational playbook template | Writing human-executed workflow documents |
| `canonical-wrangler.toml` | Worker config template + rules | Modifying `apps/worker/wrangler.toml` |

---

## 7. Architecture

| Layer | Technology |
|-------|-----------|
| Monorepo | Turborepo + npm workspaces |
| Frontend | Next.js 15 (App Router) + Tailwind |
| Backend | Single Cloudflare Worker (`apps/worker`) — deny-by-default |
| Database | Cloudflare D1 — projection only, never source of truth |
| Storage | Cloudflare R2 — always authoritative |
| Auth | `vlp_session` HttpOnly cookie, Google OAuth, Magic Link, TOTP 2FA |
| Billing | Stripe (hosted + embedded checkout, webhook reconciliation) |
| Affiliates | Stripe Connect Express, 20% flat lifetime commission |

### Build dependency order

`packages/member-ui` builds first → all apps build in parallel (each depends on `^build`)

---

## 8. Working Rules

1. **One Worker, many frontends.** All backend logic lives in `apps/worker`. No platform frontend creates its own Worker.
2. **R2 is authoritative.** D1 is always a queryable projection of R2. Never treat D1 as source of truth.
3. **Contracts live in the Worker.** All versioned JSON schemas live under `apps/worker/contracts/`.
4. **Canonicals live at root.** `.claude/canonicals/` is the single source of truth. Apps reference, never copy.
5. **PlatformConfig drives branding.** Each app passes its `PlatformConfig` to shared `@vlp/member-ui` components. No hardcoded brand values in shared code.
6. **Pre-task self-check:** Before writing code, confirm: (a) correct app directory, (b) backend vs. frontend, (c) existing contract check, (d) no duplicates.
7. **CRITICAL: Every task must end with `git add . && git commit && git push`.** The monorepo deploys via GitHub Actions from the main branch. Uncommitted changes are not deployed. Never report a task as "done" without confirming the commit has been pushed to `origin/main`.
8. **TTMP changes:** deploys from vlp-platform monorepo ONLY via GitHub Actions (`deploy-ttmp.yml`). Do NOT deploy from the standalone `transcript.taxmonitor.pro` repo — its deploy workflow has been deleted and the repo is deprecated.

---

## 9. Repo Locations (Legacy → Monorepo)

| Platform | Legacy Path | Monorepo Path |
|----------|-----------|---------------|
| VLP | `C:\Users\britn\OneDrive\virtuallaunch.pro` | `apps/vlp` |
| TMP | `C:\Users\britn\OneDrive\taxmonitor.pro-site` | `apps/tmp` |
| TTMP | `C:\Users\britn\OneDrive\transcript.taxmonitor.pro` | `apps/ttmp` |
| TTTMP | `C:\Users\britn\OneDrive\taxtools.taxmonitor.pro` | `apps/tttmp` |
| DVLP | `C:\Users\britn\OneDrive\developers.virtuallaunch.pro` | `apps/dvlp` |
| GVLP | `C:\Users\britn\OneDrive\games.virtuallaunch.pro` | `apps/gvlp` |
| TCVLP | `C:\Users\britn\taxclaim.virtuallaunch.pro` | `apps/tcvlp` |
| WLVLP | `C:\Users\britn\OneDrive\websitelotto.virtuallaunch.pro` | `apps/wlvlp` |
| Worker | `C:\Users\britn\OneDrive\virtuallaunch.pro\workers` | `apps/worker` |
