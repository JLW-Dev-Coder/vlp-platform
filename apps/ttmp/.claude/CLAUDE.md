# CLAUDE.md — apps/ttmp (Transcript Tax Monitor Pro)

See monorepo root `.claude/CLAUDE.md` for shared context, canonical docs, and architecture.

---

## Platform

- **Name:** Transcript Tax Monitor Pro
- **Abbrev:** TTMP
- **Domain:** transcript.taxmonitor.pro
- **Brand Color:** #14b8a6 (teal)
- **Adapter:** `@opennextjs/cloudflare` (OpenNext — Cloudflare Workers, NOT Pages)

---

## Shared Components

All member area UI comes from `@vlp/member-ui`. Do NOT create local copies of:
- AppShell, MemberSidebar, MemberTopbar
- KPICard, HeroCard, ContentCard, DataTable, FullCalendar
- SEO utilities (generateSitemap, generateRobots, BusinessJsonLd, generatePageMeta)

TTMP passes `ttmpConfig` (defined in `lib/platform-config.ts`) to `AppShell`.

---

## TTMP-Specific Features (not shared)

- **TranscriptParser** (`components/member/TranscriptParser.tsx`) — PDF upload & IRS transcript parsing
- **Scale pipeline** (`scale/`) — batch outreach generation, email discovery, prospect management
- **Asset pages** (`app/asset/[slug]/`) — personalized prospect landing pages
- **Lead magnets** (`app/magnets/`) — Section 7216 guide, practice analysis
- **Resource templates** (`components/templates/`) — IRS code, explainer, comparison, how-to, sales
- **Content pages** (`content/resources/`) — SEO resource articles
- **SessionContext** (`app/app/SessionContext.tsx`) — TTMP-specific session data (accountId, balance, plan)

---

## Route Structure

### Marketing (public)
`/`, `/about`, `/features`, `/pricing`, `/product`, `/affiliate`, `/contact`, `/demo`, `/reviews`, `/reviews/submit`, `/resources/`, `/resources/help-center/`, `/resources/irs-phone-numbers/`, `/resources/transcript-codes/`, `/resources/[slug]`, `/legal/privacy`, `/legal/terms`, `/legal/refund`, `/magnets/guide`, `/magnets/lead-magnet`, `/magnets/section-7216`

### Member (protected — vlp_session cookie)
`/app/dashboard/`, `/app/calendar/`, `/app/tools/`, `/app/token-usage/`, `/app/reports/`, `/app/report/`, `/app/receipts/`, `/app/affiliate/`, `/app/account/`, `/app/profile/`, `/app/support/`

### Special routes
`/asset/[slug]` (personalized outreach), `/auth/callback`, `/auth/google/callback`, `/sign-in/`, `/tools/code-lookup`

---

## Build & Deploy

```bash
# Build via Turborepo
npx turbo build --filter=ttmp

# Local build (OpenNext)
npm run cf:build

# Deploy (build + deploy + KV cache flush)
npm run deploy
# Equivalent to: npm run cf:build && npx wrangler deploy && npx wrangler kv bulk delete --namespace-id dda38413b0be42e6b7bcb3ff8308439e --force
```

**CRITICAL:** Every deploy must flush the KV incremental cache. OpenNext caches pre-rendered HTML in KV with `s-maxage=31536000` (1 year). Redeploying the Worker does NOT invalidate this cache.

- Build output: `.open-next/` (worker at `worker.js`, static assets at `assets/`)
- Worker name: `transcript-taxmonitor-pro`
- KV namespace: `NEXT_INC_CACHE_KV` (ID: `dda38413b0be42e6b7bcb3ff8308439e`)

---

## API Endpoints (consumed by this frontend)

Base URL: `https://api.taxmonitor.pro` (custom domain on VLP Worker — same Worker as `api.virtuallaunch.pro`)

API client: `lib/api.ts`

Key endpoints: `/v1/auth/session`, `/v1/transcripts/preview`, `/v1/transcripts/reports`, `/v1/tokens/balance/{account_id}`, `/v1/tokens/purchase`, `/v1/affiliates/{account_id}`, `/v1/calendar/events`, `/v1/scale/asset/{slug}`

See legacy CLAUDE.md section 16 for full endpoint documentation.

---

## Scale Pipeline

The `scale/` directory contains the outreach batch generation pipeline:
- `generate-batch.js` — selection + copy generation
- `find-emails.js` — MX precheck + pattern discovery (Reoon API)
- `validate-emails.js` — bulk email verification
- `push-*.js` — R2 push scripts for email queues, asset pages, batch history

Source: `scale/prospects/IRS*.csv` (single master CSV)
Output: `scale/batches/scale-batch-*.json` + `scale/gmail/email1/*.csv`

---

## Canonical Terminology

| Never use | Always use |
|-----------|------------|
| audit page | asset page |
| audit | practice analysis |
| /audit/{slug} | /asset/{slug} |

---

## Hard Constraints

- No backend changes in this repo — all backend logic lives in `apps/worker`
- Never output `email: "undefined"` in scale pipeline
- TTMP uses `@opennextjs/cloudflare` — do NOT switch to `@cloudflare/next-on-pages`
- Canonical documents live at monorepo root `.claude/canonicals/` — never copy into this app
- **CRITICAL: Every task must end with `git add . && git commit && git push`.** The monorepo deploys via GitHub Actions from the main branch. Uncommitted changes are not deployed. Never report a task as "done" without confirming the commit has been pushed to `origin/main`.
