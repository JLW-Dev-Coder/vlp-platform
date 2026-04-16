<!--
Status: Authoritative
Last updated: 2026-04-15
Owner: JLW (Principal Engineer review required for changes)
Scope: All 8 apps in the vlp-platform monorepo
Parent: canonical-app-blueprint.md
-->

# canonical-deploy.md

Deployment procedures for all VLP ecosystem platforms in the monorepo.

Last updated: 2026-04-13

---

## 1. Pre-Deploy Checklist

Before deploying any platform:

- [ ] Build passes locally: `npx turbo build --filter={app}`
- [ ] No TypeScript errors: `npx turbo typecheck --filter={app}` (where applicable)
- [ ] No new lint errors: `npx turbo lint --filter={app}` (where applicable)
- [ ] Changes committed to `main` branch
- [ ] No unresolved merge conflicts

---

## 2. Adapter Types

### 2.1 Static Export (`output: 'export'`)

**Platforms:** TMP, GVLP, TCVLP, WLVLP

**Output directory:** `out/`

**How it works:** Next.js generates fully static HTML/CSS/JS files. Deployed to Cloudflare Pages as a static site — no server-side rendering.

**Build command:**
```bash
npx turbo build --filter=apps/{app}
# or from app directory:
cd apps/{app} && npm run build
```

**Deploy:** Cloudflare Pages auto-deploys from GitHub on push to `main`. Manual deploy via Wrangler:
```bash
cd apps/{app}
npx wrangler pages deploy out --project-name={pages-project-name}
```

**Pages project names:**
| App | Pages Project |
|-----|--------------|
| TMP | `taxmonitor-pro-site` |
| GVLP | `games-virtuallaunch-pro` |
| TCVLP | `taxclaim-virtuallaunch-pro` |
| WLVLP | `websitelotto-virtuallaunch-pro` |

### 2.2 `@cloudflare/next-on-pages`

**Platforms:** VLP, TTTMP, DVLP

**Output directory:** `.vercel/output/static`

**How it works:** Next.js builds with Vercel build output API, then `@cloudflare/next-on-pages` transforms it for Cloudflare Pages Functions. Supports SSR, API routes, middleware.

**Build command:**
```bash
# VLP
cd apps/vlp && npm run pages:build
# TTTMP
cd apps/tttmp && npx @cloudflare/next-on-pages
# DVLP
cd apps/dvlp && npm run pages:build
```

**Deploy:** Cloudflare Pages auto-deploys from GitHub. Manual:
```bash
cd apps/{app}
npx wrangler pages deploy .vercel/output/static --project-name={pages-project-name}
```

**Pages project names:**
| App | Pages Project |
|-----|--------------|
| VLP | `virtuallaunch-pro-web` |
| TTTMP | `taxtools-taxmonitor-pro-site` |
| DVLP | `developers-virtuallaunch-pro-site` |

### 2.3 `@opennextjs/cloudflare` (Workers)

**Platform:** TTMP only

**Output directory:** `.open-next/`

**How it works:** OpenNext adapter compiles Next.js App Router for Cloudflare Workers (not Pages). Supports full SSR, ISR, streaming. Deployed via GitHub Actions CI/CD, not Cloudflare Pages auto-deploy.

**Build command:**
```bash
cd apps/ttmp && npm run cf:build
```

**Deploy (via GitHub Actions):**
```bash
cd apps/ttmp
npx wrangler deploy
```

**Post-deploy — KV cache flush:**
TTMP uses KV for ISR/SSR cache. After deploy, flush stale cache:
```bash
npx wrangler kv key list --namespace-id={kv-id} | \
  jq -r '.[].name' | \
  xargs -I{} npx wrangler kv key delete --namespace-id={kv-id} {}
```

**Worker name:** `transcript-taxmonitor-pro`

### 2.4 Cloudflare Worker (`wrangler deploy`)

**Platform:** VLP Worker (`apps/worker`)

**How it works:** Vanilla JS Cloudflare Worker. Single `src/index.js` bundled by Wrangler's built-in esbuild. No framework.

**Build + Deploy:**
```bash
cd apps/worker
npx wrangler deploy
```

**Dry-run (verify bundle without deploying):**
```bash
cd apps/worker
npx wrangler deploy --dry-run
```

**Worker name:** `virtuallaunch-pro-api`

---

## 3. Monorepo Build Commands

Build a single app:
```bash
npx turbo build --filter=apps/{app}
```

Build all apps:
```bash
npx turbo build
```

Build dependency chain: `packages/member-ui` builds first (via `^build`), then all apps build in parallel.

---

## 4. Post-Deploy Verification

After every deploy:

1. **Hit the production URL** — verify the site loads without errors
2. **Check response headers** — confirm `cf-ray`, correct `cache-control`, no 5xx
3. **Verify new content** — spot-check a changed page or feature
4. **Check console** — no new JavaScript errors in browser DevTools
5. **API health** — for Worker deploys, hit `api.virtuallaunch.pro/v1/auth/session` and confirm 401 (expected without cookie)

---

## 5. Cache Invalidation

| Platform | Cache Type | How to Purge |
|----------|-----------|-------------|
| TMP, GVLP, TCVLP, WLVLP | Cloudflare CDN (Pages) | Auto-purged on new deploy |
| VLP, TTTMP, DVLP | Cloudflare CDN (Pages) | Auto-purged on new deploy |
| TTMP | KV ISR Cache + CDN | KV flush (see section 2.3) + CDN auto-purge on Worker deploy |
| Worker | None (no static assets) | N/A — Worker code is live immediately on deploy |

**Manual CDN purge (any platform):**
```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

---

## 6. Rollback Procedures

### Static Export & next-on-pages (Pages)
Cloudflare Pages keeps deployment history. Rollback via dashboard:
1. Go to Cloudflare Dashboard > Pages > {project}
2. Find the previous successful deployment
3. Click "Rollback to this deployment"

Or redeploy the previous commit:
```bash
git checkout {previous-commit}
cd apps/{app} && npm run build
npx wrangler pages deploy {output-dir} --project-name={pages-project}
git checkout main
```

### TTMP (Workers via OpenNext)
```bash
npx wrangler rollback --name=transcript-taxmonitor-pro
```

### VLP Worker
```bash
npx wrangler rollback --name=virtuallaunch-pro-api
```

### D1 Migrations (Worker)
D1 migrations are forward-only. If a migration breaks something:
1. Write a new migration that reverses the change
2. Apply it: `npx wrangler d1 migrations apply virtuallaunch-pro`

---

## 7. Platform Deploy Summary

| Platform | Abbrev | Adapter | Output Dir | Deploy Method | Pages/Worker Project |
|----------|--------|---------|-----------|--------------|---------------------|
| Virtual Launch Pro | VLP | next-on-pages | `.vercel/output/static` | Pages auto-deploy | `virtuallaunch-pro-web` |
| Tax Monitor Pro | TMP | static export | `out` | Pages auto-deploy | `taxmonitor-pro-site` |
| Transcript Tax Monitor | TTMP | OpenNext Workers | `.open-next/` | GitHub Actions | `transcript-taxmonitor-pro` |
| Tax Tools Arcade | TTTMP | next-on-pages | `.vercel/output/static` | Pages auto-deploy | `taxtools-taxmonitor-pro-site` |
| Developers VLP | DVLP | next-on-pages | `.vercel/output/static` | Pages auto-deploy | `developers-virtuallaunch-pro-site` |
| Games VLP | GVLP | static export | `out` | Pages auto-deploy | `games-virtuallaunch-pro` |
| Tax Claim VLP | TCVLP | static export | `out` | Pages auto-deploy | `taxclaim-virtuallaunch-pro` |
| Website Lotto VLP | WLVLP | static export | `out` | Pages auto-deploy | `websitelotto-virtuallaunch-pro` |
| VLP Worker | Worker | Cloudflare Worker | bundled | `wrangler deploy` | `virtuallaunch-pro-api` |
