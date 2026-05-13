# CLAUDE.md — apps/tavlp (Tax Avatar Pro)

See monorepo root `.claude/CLAUDE.md` for shared context, canonical docs, and architecture.

---

## Platform

- **Name:** Tax Avatar Pro
- **Abbrev:** TAVLP
- **Domain:** taxavatar.virtuallaunch.pro
- **Brand Color:** #ec4899 (hot pink)
- **Adapter:** static export (`output: 'export'`) → Cloudflare Pages
- **Fonts:** Sora (display + body) via next/font

---

## What TAVLP Is

Tax Avatar Pro is a standalone, fully-managed AI YouTube channel subscription for tax professionals (EAs, CPAs, attorneys). We use HeyGen avatars to produce a branded YouTube channel for tax pros: scripts written, avatars recorded, episodes uploaded, channel grown — all turnkey. The customer chooses an avatar and we handle the rest.

---

### Pricing

TAVLP is a standalone 3-tier subscription product.

| Tier | Monthly | Annual | Videos/mo |
|------|---------|--------|-----------|
| Launch | $49/mo | $490/yr | 4 (1/week) |
| Growth | $99/mo | $990/yr | 8 (2/week) |
| Pro | $149/mo | $1,490/yr | 12 (3/week) |

- One-time channel setup fee: $99 (waived with annual billing)
- Additional videos: $15/each on any tier
- Pro tier includes custom avatar from customer's photo and white-label (no TAVLP branding)
- Channel ownership transfer is opt-in from the customer dashboard; transfer cancels subscription

---

## Shared Components

All UI comes from `@vlp/member-ui`. Do NOT create local copies of MarketingHeader, MarketingFooter, LegalPageLayout, etc.

TAVLP passes `tavlpConfig` (defined in `lib/platform-config.ts`) to shared components.

---

## Cal.com Bindings

- Intro: `tax-avatar-virtual-launch-pro` namespace, `tax-monitor-pro/tax-avatar-virtual-launch-pro` slug
- Booking/support: `tavlp-support` namespace, `tax-monitor-pro/tavlp-support` slug

---

## Route Structure

### Marketing (public)
`/`, `/avatars`, `/pricing`, `/contact`, `/sign-in`, `/legal/privacy`, `/legal/terms`, `/legal/refund`

### Member (authenticated) — not yet built
TAVLP member dashboard is not yet built; customer onboarding is handled via email + Cal.com after Stripe checkout.

---

## R2 Asset Routing

Avatar videos and looks images are served from the Worker's `/tavlp/*` public R2 route at `https://api.virtuallaunch.pro`:
- Videos: `/tavlp/videos/{code}-{name}-intro.mp4`
- Looks: `/tavlp/avatars/{code}-{name}-looks.png`

---

## Build

```bash
npx turbo build --filter=tavlp
```

---

### Pipeline

Fully automated: subscribe → generate scripts (Claude API) → approve → render (HeyGen API) → auto-upload (YouTube Data API) → published.

Manual steps: channel setup (onboarding), channel registration (SCALE), YouTube ownership transfer (if requested).

Script lifecycle: `pending_review → approved → rendering → rendered → published` (or `render_failed`).

Auto-upload triggers in the render status poll endpoint when HeyGen reports completion. Falls back to manual upload endpoint if auto-upload fails.

Transfer lifecycle: `requested → approved → completed`. Approval cancels Stripe subscription and sends notification emails. Day-7 cron reminds JLW to check YouTube Studio.

SCALE admin: `/scale/tavlp` — subscribers, transfers, quick actions.

Endpoints: 16 total under `/v1/tavlp/*`. See README.md for the full table.

Secrets: ANTHROPIC_API_KEY, HEYGEN_API_KEY, STRIPE_SECRET_KEY_VLP, RESEND_API_KEY. YouTube OAuth via ENRICHMENT_KV.
