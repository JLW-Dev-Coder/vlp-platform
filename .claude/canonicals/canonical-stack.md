<!--
Status: Authoritative
Last updated: 2026-04-15
Owner: JLW (Principal Engineer review required for changes)
Scope: All 8 apps in the vlp-platform monorepo
Parent: canonical-app-blueprint.md
-->

# canonical-stack.md

Platform stack matrix for the VLP ecosystem monorepo.

Last updated: 2026-04-13

---

## 1. Platform Stack Matrix

| Platform | Abbrev | Domain | App Dir | Framework | Styling | Adapter | Hosting | Build Command | Output Dir | Brand Color |
|----------|--------|--------|---------|-----------|---------|---------|---------|--------------|-----------|-------------|
| Virtual Launch Pro | VLP | virtuallaunch.pro | `apps/vlp` | Next.js 15 (App Router) | Tailwind + CSS Modules | `@cloudflare/next-on-pages` | CF Pages | `npm run pages:build` | `.vercel/output/static` | `#f97316` (orange) |
| Tax Monitor Pro | TMP | taxmonitor.pro | `apps/tmp` | Next.js 15 (App Router) | Tailwind + CSS Modules | Static export | CF Pages | `npm run build` | `out` | `#3b82f6` (blue) |
| Transcript Tax Monitor | TTMP | transcript.taxmonitor.pro | `apps/ttmp` | Next.js 15 (App Router) | Tailwind + CSS Modules | `@opennextjs/cloudflare` | CF Workers | `npm run cf:build` | `.open-next/` | `#14b8a6` (teal) |
| Tax Tools Arcade | TTTMP | taxtools.taxmonitor.pro | `apps/tttmp` | Next.js 15 (App Router) | Tailwind + CSS Modules | `@cloudflare/next-on-pages` | CF Pages | `npx @cloudflare/next-on-pages` | `.vercel/output/static` | `#8b5cf6` (violet) |
| Developers VLP | DVLP | developers.virtuallaunch.pro | `apps/dvlp` | Next.js 15 (App Router) | Tailwind + CSS Modules | `@cloudflare/next-on-pages` | CF Pages | `npm run pages:build` | `.vercel/output/static` | `#3b82f6` (blue) |
| Games VLP | GVLP | games.virtuallaunch.pro | `apps/gvlp` | Next.js 15 (App Router) | Tailwind + CSS Modules | Static export | CF Pages | `npm run build` | `out` | `#ef4444` (red) |
| Tax Claim VLP | TCVLP | taxclaim.virtuallaunch.pro | `apps/tcvlp` | Next.js 15 (App Router) | Tailwind + CSS Modules | Static export | CF Pages | `npm run build` | `out` | `#eab308` (yellow) |
| Website Lotto VLP | WLVLP | websitelotto.virtuallaunch.pro | `apps/wlvlp` | Next.js 15 (App Router) | Tailwind + CSS Modules | Static export | CF Pages | `npm run build` | `out` | `#00D4FF` (neon blue) |
| VLP Worker | Worker | api.virtuallaunch.pro | `apps/worker` | Vanilla JS | N/A | Cloudflare Worker | CF Workers | `npx wrangler deploy` | bundled | N/A |

---

## 2. Monorepo Directory Map

```
vlp-platform/
├── apps/
│   ├── vlp/           # Virtual Launch Pro (main platform)
│   ├── tmp/           # Tax Monitor Pro
│   ├── ttmp/          # Transcript Tax Monitor
│   ├── tttmp/         # Tax Tools Arcade
│   ├── dvlp/          # Developers VLP
│   ├── gvlp/          # Games VLP
│   ├── tcvlp/         # Tax Claim VLP
│   ├── wlvlp/         # Website Lotto VLP
│   └── worker/        # VLP Worker (single backend)
├── packages/
│   └── member-ui/     # @vlp/member-ui shared package
├── .claude/
│   ├── CLAUDE.md      # Root monorepo context
│   └── canonicals/    # 15 canonical document templates
├── turbo.json         # Turborepo pipeline config
└── package.json       # Root workspace config
```

---

## 3. Shared Packages

### `packages/member-ui` (`@vlp/member-ui`)

| What | Description |
|------|-------------|
| PlatformConfig type | TypeScript type each app uses to configure shared components |
| Shared components | Sidebar, nav, member layout — used by all 8 frontend apps |
| CSS variables | Structural member area tokens (`--member-card`, `--member-border`, etc.) |
| Tailwind preset | Shared Tailwind config mapping CSS vars to utility classes |

**Dependency:** All 8 frontend apps declare `"@vlp/member-ui": "*"` in their `package.json`.

**Build order:** `packages/member-ui` builds first (`^build` in turbo.json), then all apps build in parallel.

---

## 4. Backend Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Runtime | Cloudflare Workers (vanilla JS) | Single API serving all 8 platforms |
| Storage | Cloudflare R2 | Authoritative data storage (always source of truth) |
| Database | Cloudflare D1 (SQLite) | Query projection layer (never source of truth) |
| Cache | Cloudflare KV | SCALE pipeline enrichment, TTMP ISR cache |
| Auth | `vlp_session` HttpOnly cookie | Session-based, Google OAuth + Magic Link + SSO + TOTP 2FA |
| Billing | Stripe | Hosted + embedded checkout, webhook reconciliation |
| Affiliates | Stripe Connect Express | 20% flat lifetime commission |
| Email | Resend + Gmail API | Transactional + SCALE outreach |
| SMS | Twilio | 2FA verification, notifications |
| Calendar | Cal.com + Google Calendar | Booking and scheduling |
| PDF | pdf-lib | Form 843 generation |

---

## 5. Architectural Decisions

### Why TTMP uses Workers while others use Pages

TTMP (`transcript.taxmonitor.pro`) requires full SSR with streaming responses, ISR (Incremental Static Regeneration), and server-side data fetching for transcript processing. The `@opennextjs/cloudflare` adapter compiles Next.js for Cloudflare Workers, providing these capabilities. Other platforms either work as static exports or use `@cloudflare/next-on-pages` which is sufficient for their SSR needs.

### Why CSS Modules coexist with Tailwind

The ecosystem migrated from pure CSS Modules to Tailwind incrementally. Existing CSS Modules remain for legacy page-specific styles. New code uses Tailwind utility classes. The shared `@vlp/member-ui` package uses CSS variables for structural tokens, mapped to both CSS Modules and Tailwind via the shared preset.

### Why one Worker serves all platforms

All 8 frontends share a common data model (accounts, sessions, memberships, billing, tokens). A single Worker avoids duplicating auth logic, billing integration, and database schemas across 8 separate backends. Platform-specific routes are namespaced under `/v1/{platform}/*`.

### Why R2 over D1 as source of truth

R2 stores immutable receipts and canonical records. D1 is a queryable projection rebuilt from R2 data. This ensures data durability (R2 has 11 9s of durability) and allows D1 to be wiped and rebuilt from R2 without data loss.

### Tailwind version split (v3 vs v4)

TTMP uses Tailwind CSS v4 (4.2.2) which uses `@source` directives in `globals.css` for content scanning. All other 7 apps use Tailwind CSS v3 which uses the `content` array in `tailwind.config.ts`. When adding new shared packages or component directories, both scan paths must be updated: add to `tailwind.config.ts` content array for v3 apps, and add `@source` directive in `globals.css` for TTMP.

### Why static export for TMP, GVLP, TCVLP, WLVLP

These platforms render entirely client-side. They fetch data from the Worker API at runtime. Static export eliminates cold-start latency, reduces Cloudflare costs, and simplifies deployments (just upload HTML/CSS/JS).

---

## 6. Cloudflare Project Registry

| Platform | CF Project Type | CF Project Name |
|----------|----------------|-----------------|
| VLP | Pages | `virtuallaunch-pro-web` |
| TMP | Pages | `taxmonitor-pro-site` |
| TTMP | Worker | `transcript-taxmonitor-pro` |
| TTTMP | Pages | `taxtools-taxmonitor-pro-site` |
| DVLP | Pages | `developers-virtuallaunch-pro-site` |
| GVLP | Pages | `games-virtuallaunch-pro` |
| TCVLP | Pages | `taxclaim-virtuallaunch-pro` |
| WLVLP | Pages | `websitelotto-virtuallaunch-pro` |
| Worker | Worker | `virtuallaunch-pro-api` |

---

## 7. Domain Architecture

| Zone | Platforms |
|------|----------|
| `virtuallaunch.pro` | VLP, DVLP, GVLP, TCVLP, WLVLP, Worker |
| `taxmonitor.pro` | TMP, TTMP, TTTMP |

All API traffic routes through `api.virtuallaunch.pro` regardless of which frontend makes the request. CORS is configured to allow all 9 platform origins.
