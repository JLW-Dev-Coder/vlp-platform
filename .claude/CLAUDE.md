# CLAUDE.md — vlp-platform (Monorepo)

Last updated: 2026-04-13

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
| Tax Monitor Pro | TMP | taxmonitor.pro | `apps/tmp` | static export | `#3b82f6` (blue) |
| Transcript Tax Monitor | TTMP | transcript.taxmonitor.pro | `apps/ttmp` | `@opennextjs/cloudflare` (Workers) | `#14b8a6` (teal) |
| Tax Tools Arcade | TTTMP | taxtools.taxmonitor.pro | `apps/tttmp` | `@cloudflare/next-on-pages` | `#8b5cf6` (violet) |
| Developers VLP | DVLP | developers.virtuallaunch.pro | `apps/dvlp` | `@cloudflare/next-on-pages` | `#06b6d4` (cyan) |
| Games VLP | GVLP | games.virtuallaunch.pro | `apps/gvlp` | static export | `#ef4444` (red) |
| Tax Claim VLP | TCVLP | taxclaim.virtuallaunch.pro | `apps/tcvlp` | static export | `#eab308` (yellow) |
| Website Lotto VLP | WLVLP | websitelotto.virtuallaunch.pro | `apps/wlvlp` | static export | `#ec4899` (pink) |
| VLP Worker | — | api.virtuallaunch.pro | `apps/worker` | Cloudflare Worker | — |

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

**TTMP deployment note:** TTMP uses Cloudflare Workers (not Pages) via `@opennextjs/cloudflare` and GitHub Actions CI/CD. All other platforms remain on Pages.

---

## 5. Shared Packages

### `packages/member-ui` (`@vlp/member-ui`)

The shared component library for all platform member areas. Contains:
- **PlatformConfig type** — each app provides its own config to the shared layout
- **Shared components** — sidebar, nav, member layout (migrated in Phase 2)
- **CSS variables** — structural member area variables (`--member-card`, `--member-border`, etc.)
- **Tailwind config** — shared Tailwind preset mapping CSS vars to utility classes

Apps depend on this package via workspace dependency: `"@vlp/member-ui": "*"`

---

## 6. Canonical Documents

All canonical documents live in `.claude/canonicals/` at the monorepo root.

**Hard rules:**
- Canonicals live ONLY at monorepo root — apps do NOT have their own copies
- Each app's `.claude/CLAUDE.md` is app-specific context only — shared context lives here
- Never duplicate a canonical into an app directory
- When a canonical is updated, it applies to all apps immediately

### Canonical files:

| File | Purpose |
|------|---------|
| `canonical-claude.md` | CLAUDE.md template for app-level context |
| `canonical-contract.json` | Contract schema template |
| `canonical-contract-registry.json` | Registry entry schema |
| `canonical-index.html` | HTML page template |
| `canonical-market.md` | Market positioning template |
| `canonical-readme.md` | README template |
| `canonical-roles.md` | Roles template |
| `canonical-scale.md` | SCALE batch operations template |
| `canonical-skill.md` | SKILL.md template |
| `canonical-style.md` | STYLE.md template |
| `canonical-workflow.md` | Workflow template |
| `canonical-wrangler.toml` | Wrangler config template |
| `canonical-deploy.md` | Deployment template |
| `canonical-api.md` | API documentation template |
| `canonical-stack.md` | Stack documentation template |

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
