# CUTOVER.md — Cloudflare Dashboard Migration Instructions

Monorepo: `JLW-Dev-Coder/vlp-platform`
Date: 2026-04-13

---

## Pre-Cutover Checklist

- [x] Full `turbo build` passes (9/9 tasks, 1m14s)
- [x] `packages/member-ui` builds first, all 8 apps build in parallel
- [x] Static export apps produce `out/` — TMP (66 files), TTTMP (29), DVLP (29), GVLP (28), TCVLP (27), WLVLP (1,379)
- [x] VLP produces `.next/` via `next build` (CF Pages uses `pages:build` for `.vercel/output/static`)
- [x] TTMP produces `.next/` via `next build` (CF Workers uses `cf:build` for `.open-next/`)
- [x] Worker bundles cleanly — 1,779 KiB / gzip 427 KiB, all bindings attached
- [ ] Monorepo pushed to `JLW-Dev-Coder/vlp-platform` on GitHub
- [ ] All 8 CF projects cut over (see below)
- [ ] Post-cutover verification complete (see bottom)

---

## Adapter Corrections

During build verification, two apps were found to differ from the root CLAUDE.md:

| App | Root CLAUDE.md says | Actual (from code) |
|-----|--------------------|--------------------|
| **TTTMP** | `@cloudflare/next-on-pages` → `.vercel/output/static` | `output: 'export'` → `out/` (static export) |
| **DVLP** | `@cloudflare/next-on-pages` → `.vercel/output/static` | `output: 'export'` → `out/` (static export) |

Both apps have `output: 'export'` in `next.config.ts` and produce `out/`. The cutover instructions below use the **actual** adapter, not the documented one.

---

## Cutover Order

**Recommended: Worker first, then Pages apps.**

1. **Worker** — deploy from monorepo path. No frontend depends on a changed Worker URL; this just confirms the monorepo deploy path works.
2. **Pages apps** — cut over in any order. Each is independent. Suggested order: start with low-risk static sites (GVLP, TCVLP), then higher-traffic sites (VLP, TMP, TTMP).

---

## Environment Variables (all CF Pages projects)

Set these in each Pages project's environment variables:

| Variable | Value |
|----------|-------|
| `NODE_VERSION` | `20` |
| `NPM_VERSION` | `10` |

---

## 1. VLP Worker (Cloudflare Worker — not Pages)

```
Worker name: virtuallaunch-pro-api
Deploy method: wrangler deploy (from monorepo)
```

**Deploy command:**
```bash
cd apps/worker && npx wrangler deploy
```

**Dry-run verified:** 1,779.47 KiB / gzip 427.25 KiB — all bindings (R2, D1, KV, env vars) attached.

No CF Pages dashboard change needed — the Worker is deployed via Wrangler CLI, not Pages auto-deploy. Just run the deploy command from the monorepo instead of the legacy path.

---

## 2. VLP (Virtual Launch Pro)

```
Project: virtuallaunch-pro-web
Dashboard: https://dash.cloudflare.com → Pages → virtuallaunch-pro-web → Settings → Builds & deployments
```

**Changes:**
- **Repository:** `JLW-Dev-Coder/vlp-platform`
- **Production branch:** `main`
- **Root directory:** `/` (monorepo root)
- **Build command:** `cd apps/vlp && npx @cloudflare/next-on-pages`
- **Build output directory:** `apps/vlp/.vercel/output/static`

**Notes:**
- VLP is the only SSR app on Pages (uses `@cloudflare/next-on-pages`)
- `@cloudflare/next-on-pages` internally runs `vercel build` then transforms for CF Pages
- Requires `vercel` devDep (already in `apps/vlp/package.json`)

---

## 3. TMP (Tax Monitor Pro)

```
Project: taxmonitor-pro-site
Dashboard: https://dash.cloudflare.com → Pages → taxmonitor-pro-site → Settings → Builds & deployments
```

**Changes:**
- **Repository:** `JLW-Dev-Coder/vlp-platform`
- **Production branch:** `main`
- **Root directory:** `/` (monorepo root)
- **Build command:** `npx turbo build --filter=tmp`
- **Build output directory:** `apps/tmp/out`

**Notes:**
- Static export (`output: 'export'`), produces `out/` with 66 files
- Turbo handles building `@vlp/member-ui` first via `^build` dependency

---

## 4. TTMP (Transcript Tax Monitor Pro)

```
Worker name: transcript-taxmonitor-pro
Deploy method: GitHub Actions CI/CD (NOT CF Pages auto-deploy)
```

**Changes required:**
- Update GitHub Actions workflow in the monorepo to:
  ```bash
  cd apps/ttmp && npm run cf:build && npx wrangler deploy
  ```
- **KV cache flush** after every deploy:
  ```bash
  npx wrangler kv bulk delete --namespace-id dda38413b0be42e6b7bcb3ff8308439e --force
  ```

**Notes:**
- TTMP uses `@opennextjs/cloudflare` (Workers, not Pages)
- `cf:build` produces `.open-next/` with `worker.js` + `assets/`
- Build verified via `next build` (turbo); CF-specific build requires `cf:build`
- No CF Pages dashboard change — TTMP is a Worker deployed via GitHub Actions

---

## 5. TTTMP (Tax Tools Arcade)

```
Project: taxtools-taxmonitor-pro-site
Dashboard: https://dash.cloudflare.com → Pages → taxtools-taxmonitor-pro-site → Settings → Builds & deployments
```

**Changes:**
- **Repository:** `JLW-Dev-Coder/vlp-platform`
- **Production branch:** `main`
- **Root directory:** `/` (monorepo root)
- **Build command:** `npx turbo build --filter=tttmp`
- **Build output directory:** `apps/tttmp/out`

**Notes:**
- Static export (`output: 'export'`), produces `out/` with 29 files
- Despite having `@cloudflare/next-on-pages` as a devDep, the app uses static export

---

## 6. DVLP (Developers VLP)

```
Project: developers-virtuallaunch-pro-site
Dashboard: https://dash.cloudflare.com → Pages → developers-virtuallaunch-pro-site → Settings → Builds & deployments
```

**Changes:**
- **Repository:** `JLW-Dev-Coder/vlp-platform`
- **Production branch:** `main`
- **Root directory:** `/` (monorepo root)
- **Build command:** `npx turbo build --filter=dvlp`
- **Build output directory:** `apps/dvlp/out`

**Notes:**
- Static export (`output: 'export'`), produces `out/` with 29 files

---

## 7. GVLP (Games VLP)

```
Project: games-virtuallaunch-pro
Dashboard: https://dash.cloudflare.com → Pages → games-virtuallaunch-pro → Settings → Builds & deployments
```

**Changes:**
- **Repository:** `JLW-Dev-Coder/vlp-platform`
- **Production branch:** `main`
- **Root directory:** `/` (monorepo root)
- **Build command:** `npx turbo build --filter=gvlp`
- **Build output directory:** `apps/gvlp/out`

**Notes:**
- Static export (`output: 'export'`), produces `out/` with 28 files

---

## 8. TCVLP (TaxClaim Pro)

```
Project: taxclaim-virtuallaunch-pro
Dashboard: https://dash.cloudflare.com → Pages → taxclaim-virtuallaunch-pro → Settings → Builds & deployments
```

**Changes:**
- **Repository:** `JLW-Dev-Coder/vlp-platform`
- **Production branch:** `main`
- **Root directory:** `/` (monorepo root)
- **Build command:** `npx turbo build --filter=tcvlp`
- **Build output directory:** `apps/tcvlp/out`

**Notes:**
- Static export (`output: 'export'`), produces `out/` with 27 files

---

## 9. WLVLP (Website Lotto)

```
Project: websitelotto-virtuallaunch-pro
Dashboard: https://dash.cloudflare.com → Pages → websitelotto-virtuallaunch-pro → Settings → Builds & deployments
```

**Changes:**
- **Repository:** `JLW-Dev-Coder/vlp-platform`
- **Production branch:** `main`
- **Root directory:** `/` (monorepo root)
- **Build command:** `npx turbo build --filter=wlvlp`
- **Build output directory:** `apps/wlvlp/out`

**Notes:**
- Static export (`output: 'export'`, `trailingSlash: true`), produces `out/` with 1,379 files
- Includes 211 statically generated `/sites/[slug]` pages

---

## Post-Cutover Verification

After cutting over each project, verify:

| Platform | Production URL | Check |
|----------|---------------|-------|
| Worker | `https://api.virtuallaunch.pro/v1/auth/session` | Returns 401 (expected without cookie) |
| VLP | `https://virtuallaunch.pro` | Landing page loads, SSR routes work |
| TMP | `https://taxmonitor.pro` | Landing page loads, static pages render |
| TTMP | `https://transcript.taxmonitor.pro` | Landing page loads, resource pages render |
| TTTMP | `https://taxtools.taxmonitor.pro` | Landing page loads, game catalog renders |
| DVLP | `https://developers.virtuallaunch.pro` | Landing page loads, developer directory renders |
| GVLP | `https://games.virtuallaunch.pro` | Landing page loads, game library renders |
| TCVLP | `https://taxclaim.virtuallaunch.pro` | Landing page loads, demo page renders |
| WLVLP | `https://websitelotto.virtuallaunch.pro` | Landing page loads, `/sites/` pages render, 211 template pages indexed |

**For each URL:**
1. Page loads without errors
2. Browser DevTools console shows no JS errors
3. `cf-ray` header present in response
4. Navigation between pages works
5. Member area login flow redirects correctly

---

## Rollback Instructions

If any platform breaks after cutover, revert by pointing the CF Pages project back to the legacy repo:

| Platform | Legacy Repository | Legacy Build Command | Legacy Output Dir |
|----------|------------------|---------------------|-------------------|
| VLP | `JLW-Dev-Coder/virtuallaunch-pro` | `cd web && npm install && npm run pages:build` | `web/.vercel/output/static` |
| TMP | `JLW-Dev-Coder/taxmonitor-pro-site` | `npm run build` | `out` |
| TTMP | `JLW-Dev-Coder/transcript-taxmonitor-pro` | (GitHub Actions) | (Workers) |
| TTTMP | `JLW-Dev-Coder/taxtools-taxmonitor-pro` | `npx @cloudflare/next-on-pages` | `.vercel/output/static` |
| DVLP | `JLW-Dev-Coder/developers-virtuallaunch-pro` | `npm run build` | `out` |
| GVLP | `JLW-Dev-Coder/games-virtuallaunch-pro` | `npm run build` | `out` |
| TCVLP | `JLW-Dev-Coder/taxclaim-virtuallaunch-pro` | `npm run build` | `out` |
| WLVLP | `JLW-Dev-Coder/websitelotto-virtuallaunch-pro` | `npm run build` | `out` |
| Worker | `JLW-Dev-Coder/virtuallaunch-pro` | `cd workers && npx wrangler deploy` | (Worker) |

**Steps to rollback a Pages project:**
1. Go to CF Dashboard > Pages > {project} > Settings > Builds & deployments
2. Change repository back to the legacy repo
3. Restore the legacy build command and output directory
4. Trigger a new deployment

**Steps to rollback the Worker:**
```bash
npx wrangler rollback --name=virtuallaunch-pro-api
```

**Steps to rollback TTMP (Workers):**
```bash
npx wrangler rollback --name=transcript-taxmonitor-pro
```

Or: revert GitHub Actions to deploy from the legacy repo.

---

## Summary Table

| # | Platform | CF Project | Adapter | Build Command | Output Dir |
|---|----------|-----------|---------|---------------|-----------|
| 1 | Worker | `virtuallaunch-pro-api` | Worker | `npx wrangler deploy` | (bundled) |
| 2 | VLP | `virtuallaunch-pro-web` | next-on-pages | `cd apps/vlp && npx @cloudflare/next-on-pages` | `apps/vlp/.vercel/output/static` |
| 3 | TMP | `taxmonitor-pro-site` | static export | `npx turbo build --filter=tmp` | `apps/tmp/out` |
| 4 | TTMP | `transcript-taxmonitor-pro` | OpenNext Workers | `cd apps/ttmp && npm run cf:build` | `.open-next/` (via GitHub Actions) |
| 5 | TTTMP | `taxtools-taxmonitor-pro-site` | static export | `npx turbo build --filter=tttmp` | `apps/tttmp/out` |
| 6 | DVLP | `developers-virtuallaunch-pro-site` | static export | `npx turbo build --filter=dvlp` | `apps/dvlp/out` |
| 7 | GVLP | `games-virtuallaunch-pro` | static export | `npx turbo build --filter=gvlp` | `apps/gvlp/out` |
| 8 | TCVLP | `taxclaim-virtuallaunch-pro` | static export | `npx turbo build --filter=tcvlp` | `apps/tcvlp/out` |
| 9 | WLVLP | `websitelotto-virtuallaunch-pro` | static export | `npx turbo build --filter=wlvlp` | `apps/wlvlp/out` |
