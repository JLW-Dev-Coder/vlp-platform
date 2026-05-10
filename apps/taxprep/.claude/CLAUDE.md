# CLAUDE.md — apps/taxprep (Tax Prep Pro)

See monorepo root `.claude/CLAUDE.md` for shared context, canonical docs, and architecture.

---

## Platform

- **Name:** Tax Prep Pro
- **Abbrev:** TPP
- **Domain:** taxprep.virtuallaunch.pro
- **Brand Color:** #E91E63 (rose) — full palette registered in canonical-app-blueprint §4.5
- **Adapter:** static export (`output: 'export'`) → Cloudflare Pages
- **Fonts:** Sora (display + body, italic 600 for editorial accents)
- **Audience:** B2B — service bureaus and credentialed tax practitioners (EAs, CPAs, attorneys)
- **Product model:** SD-led — Next.js site is lead-gen only; members live in SuiteDash

---

## Booking & Auth (TPP-specific)

- **Cal.com for bookings** (adopted 2026-05-09 per `canonical-cal-events.md` §7.4).
  Discovery and Support bookings use Cal.com event types `tpvlp-intro` and
  `tpvlp-support`. SuiteDash form embeds were retired.
- **`/sign-in` is account-creation + outbound sign-in** — left card is a form
  that POSTs to `/v1/taxprep/onboarding` (the only TPP Worker route, see
  `canonical-api.md` §1 + §8b); right card links out to the SuiteDash member
  portal at `https://secure.virtuallaunch.pro/site/login`. No in-app session.
- **`routes.dashboard`** still points outbound to the SD member portal.
- **One Worker route**: `POST /v1/taxprep/onboarding` brokers SD
  `POST /secure-api/company`. All other client-side functionality still runs
  inside the SuiteDash workspace; do not add additional `/v1/taxprep/*`
  endpoints without Principal review.

---

## Pricing

| Tier | Price |
|------|-------|
| Tax Prep Pro | $5,000 setup (one-time) |
| Tax Prep Pro + Members | $5,779 setup + $779/mo per additional member |
| Ongoing Support | $497/mo |

---

## Brand Palette (Deviation 8)

| Token | Hex |
|-------|-----|
| `tpp.rose` | `#E91E63` |
| `tpp.rose-deep` | `#C2185B` |
| `tpp.crimson` | `#8B1538` |
| `tpp.crimson-deep` | `#5C0D24` |
| `tpp.champagne` | `#F5E6D3` |
| `tpp.blush` | `#FFE5EC` |
| `tpp.noir` | `#1A0B14` |
| `tpp.gold-leaf` | `#D4A574` |
| `tpp.gold-bright` | `#E8C088` |

---

## Build

```bash
npx turbo build --filter=taxprep
```

---

## Phase status

- Phase 1 (scaffold) — complete
- Phase 2 (content / landing-page port) — complete (commit `f2aad0e`)
- Phase 3 (canonical updates) — complete (commit `26db918`)
- Phase 4 (infrastructure / CI-CD) — complete (commit `41d5a77`); Pages
  project + custom domain provisioned by Jamie (preview deploy live;
  custom-domain DNS still propagating, ≤48h)
- Phase 5 (QA pass — design tokens, build, page checklist) — complete
  (commits `e8b36cd`, `77f6733`)
- Phase 6 (preview deploy) — complete; first deploy:
  `https://cbd50c6c.taxprep.pages.dev` (project `taxprep-pro`,
  branch `main`, 65 files, 3.40s upload)
- Phase 7 (sign-off) — pending Principal browser-check of preview URL
