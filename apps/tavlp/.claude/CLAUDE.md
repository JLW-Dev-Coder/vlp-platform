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

Tax Avatar Pro is a $29/mo managed AI YouTube channel add-on for tax professionals (EAs, CPAs, attorneys). It is sold as an add-on to TaxClaim Pro (TCVLP) — the $10/mo TCVLP base subscription is required, making the combined service $39/mo.

We use HeyGen avatars to produce a fully-managed, branded YouTube channel for tax pros: scripts written, avatars recorded, episodes uploaded, channel grown — all turnkey. The customer chooses an avatar and we handle the rest.

---

## Pricing

| Tier | Price | Notes |
|------|-------|-------|
| TaxClaim Pro (base) | $10/mo | Required to add Tax Avatar Pro |
| Tax Avatar Pro (add-on) | $29/mo | Managed AI YouTube channel |
| Combined | $39/mo | Most common purchase path |

Stripe price IDs to be added once products are created.

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
Member area lives in TCVLP. TAVLP is an add-on, no separate dashboard yet.

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

## Status

- Scaffold: in progress
- Full landing page port from `tavlp-site/index.html`: deferred
- Worker product/Stripe integration: not started
- Member dashboard: deferred (lives in TCVLP)
