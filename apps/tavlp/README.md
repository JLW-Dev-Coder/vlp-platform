# Tax Avatar Pro (TAVLP)

**Domain:** taxavatar.virtuallaunch.pro
**Monorepo path:** `apps/tavlp/`
**Purpose:** Fully managed AI YouTube channels for tax professionals (EAs, CPAs, and tax attorneys) — custom avatar, IRS code scripts, branded channel setup, weekly publishing, and a lead pipeline into TaxClaim Pro.

---

## 1. System Overview

Tax Avatar Pro (TAVLP) is the 9th platform in the VLP ecosystem. It delegates a tax practice's YouTube marketing to an AI avatar — same content quality, zero camera time. TAVLP is a standalone 3-tier subscription (Launch $49/mo, Growth $99/mo, Pro $149/mo) with optional add-ons (channel setup fee, additional videos).

**What it is:** A marketing site + intake form + R2-served media (videos, avatars) + YouTube channel stats dashboard.
**What it is not:** A self-serve software product. There is no member dashboard for end customers — TAVLP is a managed service.

---

## 2. Architecture

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v3 + Sora font |
| Adapter | Static export (`output: 'export'`) |
| Backend | `apps/worker/` (single Cloudflare Worker) |
| Storage | R2 (`virtuallaunch-pro` bucket, `tavlp/` prefix) |
| Pages project | `tavlp-site` |
| Output dir | `out/` |
| Booking | Cal.com (`tax-monitor-pro/tax-avatar-virtual-launch-pro`) |

---

## Pipeline

TAVLP runs a fully automated video production pipeline. Once a customer subscribes and their channel is registered, the entire flow from script to published YouTube video requires no manual intervention except script review.

### Automated Flow

```
Customer subscribes (Stripe Checkout)
        ↓
JLW registers channel (SCALE → PUT /v1/tavlp/channels/:account_id)
        ↓
Customer generates scripts (Dashboard → POST /v1/tavlp/scripts/generate)
        ↓ Claude API writes 1-4 scripts → R2
Customer reviews & approves scripts (Dashboard → POST /v1/tavlp/scripts/:script_id/approve)
        ↓
Render triggered (POST /v1/tavlp/render)
        ↓ HeyGen API renders avatar video → polls for completion → downloads to R2
Auto-upload to YouTube (triggered by render status poll on completion)
        ↓ YouTube Data API uploads video → sets metadata → adds to playlist
Customer sees published video in Dashboard with YouTube link
```

### Script Lifecycle

```
pending_review → approved → rendering → rendered → published
                                      ↘ render_failed
```

### Manual Steps (not automated)

| Step | When | Who |
|------|------|-----|
| Channel setup | New subscriber onboarding | JLW via SCALE |
| Channel registration | After channel setup | JLW via SCALE (PUT /v1/tavlp/channels) |
| YouTube ownership transfer | Customer requests from Dashboard | JLW manually in YouTube Studio (7-day process) |

### Transfer Workflow

```
Customer requests transfer (Dashboard)
        ↓ Email 1 → JLW
JLW approves in SCALE (POST /v1/tavlp/transfer/approve)
        ↓ Stripe subscription cancelled
        ↓ Email 2 → Customer ("transfer initiated, 7 business days")
        ↓ Google Calendar event created (day 8)
Day 7: Cron sends Email 3 → JLW ("check YouTube Studio")
        ↓
JLW confirms transfer in YouTube Studio, marks complete in SCALE
        ↓ Email 4 → Customer ("transfer complete, channel is yours")
```

### Worker Endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/v1/tavlp/checkout/sessions` | Session | Stripe checkout |
| POST | `/v1/tavlp/scripts/generate` | Session | Generate scripts (Claude API) |
| GET | `/v1/tavlp/scripts/:account_id` | Session | List scripts |
| POST | `/v1/tavlp/scripts/:script_id/approve` | Session | Approve script |
| GET | `/v1/tavlp/avatars` | Session | Avatar registry (lazy-build from HeyGen) |
| POST | `/v1/tavlp/render` | Session | Start HeyGen render |
| GET | `/v1/tavlp/render/:render_id/status` | Session | Poll render status (auto-uploads on completion) |
| GET | `/v1/tavlp/renders/:account_id` | Session | List renders |
| POST | `/v1/tavlp/youtube/upload` | Admin | Manual YouTube upload (fallback) |
| GET | `/v1/tavlp/channels/:account_id` | Session | Get channel config |
| PUT | `/v1/tavlp/channels/:account_id` | Admin | Register/update channel |
| POST | `/v1/tavlp/transfer/request` | Session | Request channel transfer |
| POST | `/v1/tavlp/transfer/approve` | Admin | Approve transfer (cancels Stripe) |
| POST | `/v1/tavlp/transfer/complete` | Admin | Mark transfer complete |
| GET | `/v1/tavlp/transfers` | Admin | List transfer requests |
| GET | `/v1/tavlp/subscribers` | Admin | List subscribers |

### R2 Storage Map

| Key Pattern | Content |
|-------------|---------|
| `tavlp/config/avatar-registry.json` | Cached HeyGen avatar catalog |
| `tavlp/scripts/{account_id}/{script_id}.json` | Individual script |
| `tavlp/scripts/{account_id}/batches/{batch_id}.json` | Script batch manifest |
| `tavlp/renders/{account_id}/{render_id}.json` | Render job record |
| `tavlp/videos/{account_id}/{render_id}.mp4` | Rendered video file |
| `tavlp/channels/{account_id}.json` | Channel config |
| `tavlp/subscriptions/{account_id}.json` | Subscription record |
| `tavlp/transfer-requests/{account_id}.json` | Transfer request |
| `tavlp/channel-stats.json` | Aggregated channel stats (cron-refreshed) |

### Worker Secrets Required

| Secret | Purpose |
|--------|---------|
| `ANTHROPIC_API_KEY` | Claude API for script generation |
| `HEYGEN_API_KEY` | HeyGen API for avatar video rendering |
| `STRIPE_SECRET_KEY_VLP` | Stripe subscription management |
| `RESEND_API_KEY` | Transactional emails |

YouTube OAuth uses the existing SCALE integration (`getFreshYouTubeOAuthToken` via `ENRICHMENT_KV`). Google Calendar uses per-account OAuth tokens.

### Pricing

| Tier | Monthly | Annual | Videos/mo |
|------|---------|--------|-----------|
| Launch | $49/mo | $490/yr | 4 (1/week) |
| Growth | $99/mo | $990/yr | 8 (2/week) |
| Pro | $149/mo | $1,490/yr | 12 (3/week) |

- One-time channel setup fee: $99 (waived with annual billing)
- Additional videos: $15/each on any tier
- Pro tier includes custom avatar from customer's photo and white-label (no TAVLP branding)

### SCALE Admin

TAVLP management lives at `/scale/tavlp` in the VLP app. Three sections:
- **Subscribers** — all active/cancelled subscribers with tier, channel, video count, transfer status
- **Transfers** — pending and completed transfer requests with approve/complete actions
- **Quick Actions** — register channel, generate scripts, seed avatar registry

---

## 3. Responsibilities

| Owner | Responsibility |
|-------|---------------|
| TAVLP app | Marketing pages, landing page, avatar roster, ported HTML homepage, legal pages |
| Worker | Intake POST, channel-stats cron, R2 media serving, reviews API |
| TCVLP | Form 843 generation downstream of TAVLP-generated leads |
| HeyGen | Avatar video generation (third party) |
| YouTube | Channel hosting + ownership transfer |

---

## 4. Repo Structure

```
apps/tavlp/
├── app/
│   ├── (marketing)/
│   │   ├── about/, features/, how-it-works/, pricing/
│   │   ├── contact/, reviews/, sign-in/
│   │   ├── avatars/                # Avatar roster page
│   │   ├── legal/{privacy,terms,refund}/
│   │   ├── layout.tsx              # MarketingHeader + MarketingFooter
│   │   └── page.tsx                # Landing page entry
│   ├── layout.tsx                  # Root layout, fonts, metadata
│   ├── globals.css
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   └── marketing/
│       └── LandingPage.tsx         # Ported landing page (client component)
├── lib/
│   ├── platform-config.ts
│   └── metadata.ts
├── public/
├── tailwind.config.ts
├── next.config.ts
├── package.json
└── wrangler.toml
```

---

## 5. Core Workflows

1. **Intake** — Visitor lands on `/`, scrolls to intake form, selects credential (EA/CPA/Attorney/Other) + avatar preference, POSTs to `/v1/tcvlp/gala/intake` with `penalty_type: tavlp_channel_interest`.
2. **Avatar selection** — Six avatars (Annie, Tariq, Genesis, Knox, Denyse, Griffin) on `/avatars`. Choice flows into intake metadata.
3. **Channel stats display** — Homepage cards pull live stats from `/tavlp/channel-stats.json` (R2). Refreshed nightly via cron `0 5 * * *`.
4. **Cal.com booking** — `/contact` embeds the intro event `tax-monitor-pro/tax-avatar-virtual-launch-pro`.
5. **Reviews** — `/reviews` reads from `GET /v1/submissions/public?platform=tavlp&form_type=review`; submission via `/reviews/submit`.

---

## 6. Data Contracts

| Contract | Location |
|----------|----------|
| Gala intake (shared with TCVLP) | `apps/worker/contracts/tcvlp/gala-intake.json` |
| Channel stats JSON shape | `apps/worker/contracts/tavlp/` (if applicable) |
| Platform submissions (reviews) | `apps/worker/contracts/shared/platform-submissions.json` |

---

## 7. Setup / Local Development

```bash
# From monorepo root
npm install
npx turbo dev --filter=tavlp
```

Default dev URL: `http://localhost:3000`.

---

## 8. Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Production static export to `out/` |
| `npm run lint` | ESLint check |
| `npm run typecheck` | TypeScript check |

---

## 9. Environment / Config

- `NEXT_PUBLIC_API_BASE` — Worker API base URL (default `https://api.virtuallaunch.pro`)
- See `apps/worker/wrangler.toml` for backend-side configuration (R2 bindings, cron, secrets)

---

## 10. Deployment

| Field | Value |
|-------|-------|
| Adapter | Static export |
| Build | `npm run build` (or `npx turbo build --filter=tavlp`) |
| Output | `out/` |
| Pages project | `tavlp-site` |
| Custom domain | `taxavatar.virtuallaunch.pro` |
| CI workflow | `.github/workflows/deploy-pages.yml` |

Manual deploy:
```bash
cd apps/tavlp
npx turbo build --filter=tavlp
npx wrangler pages deploy out --project-name=tavlp-site
```

See `.claude/canonicals/canonical-deploy.md` for full procedures.

---

## 11. Constraints / Rules

- Static export only — no server components with runtime data fetching at request time
- All backend logic lives in `apps/worker/`
- Brand color `#ec4899` (hot pink) — use Tailwind `brand.500` token, not hardcoded hex
- Sora font via Next.js font loader
- Reference root `.claude/CLAUDE.md` Working Rules for monorepo-wide guardrails

---

## 12. Related Systems

| Platform | Relationship |
|----------|-------------|
| TCVLP | Parent platform — TAVLP intake flows through TCVLP gala pipeline; Form 843 downstream |
| TTMP (Tax Transcript AI) | Sister platform — referenced in cross-app footer |
| VLP | Hub — TAVLP appears in VLP mega menu |
| Worker | Single backend for intake, stats cron, R2 media, reviews |

See `.claude/canonicals/canonical-stack.md` for the full stack matrix.

---

## 13. Glossary

| Term | Meaning |
|------|---------|
| Avatar | An AI presenter generated by HeyGen — selectable from a roster of 6 |
| Look | A specific styled appearance of an avatar (Annie has 57 looks, Tariq 14, etc.) |
| Channel transfer | YouTube's 7-day primary-owner transfer process — TAVLP uses this to hand the channel to the client |
| Kennedy | The reference sales/explainer videos used to demonstrate avatar capability |
| Kwong v. US | July 10, 2026 deadline driving urgency in penalty abatement content |
| Penalty type `tavlp_channel_interest` | The TCVLP gala intake flag identifying TAVLP leads |

---

## 14. Marketing Kit

| Asset | Location |
|-------|----------|
| Landing page (source of truth) | `components/marketing/LandingPage.tsx` |
| Kennedy sales videos (3) | R2: `tavlp/videos/S001-*`, `S002-*`, `V003-*` |
| Avatar intro videos (6) | R2: `tavlp/videos/A001-*` through `A006-*` |
| Avatar look images (6) | R2: `tavlp/avatars/A001-*` through `A006-*` |
| Avatar roster + bios | `app/(marketing)/avatars/page.tsx` |
| Feature descriptions | `app/(marketing)/features/page.tsx` |
| Social proof | Phillip Gillian (YouTube comment), Conny R. (Facebook group) |
| Brand color | #ec4899 (hot pink) |
| Font | Sora (display + body) |
| Logo mark | TAP |
| Cal.com intro | `tax-monitor-pro/tax-avatar-virtual-launch-pro` |
| Intake endpoint | `POST /v1/tcvlp/gala/intake` (penalty_type: tavlp_channel_interest) |
