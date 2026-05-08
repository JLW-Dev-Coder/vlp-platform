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

- **No Cal.com.** Discovery / Demo bookings use SuiteDash form embeds.
  - Discovery Call form: `21EGX5mk16QA6qVGj`
  - Demo form: `2rU9ohwhCx3rsijrC`
- **`/sign-in` is outbound** — links to SuiteDash member portal. No in-app auth components.
- **`routes.dashboard`** points to the SD member portal URL.
- **No Worker route** for TPP — SD form embeds POST to SuiteDash directly.

---

## Pricing

| Tier | Price |
|------|-------|
| Tax Prep Pro — Managed | $5,000 setup + $79/mo per active member |
| TPP + Tax Monitor Pro Bundle | $8,500 |
| Ongoing Support | $497/mo or $150/hr |

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
