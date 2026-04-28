# VLP Platform — Virtual Launch Pro Ecosystem

Monorepo for the VLP ecosystem: 9 platform apps, 1 Cloudflare Worker, shared packages.

## Platforms

| # | Code | Name | Domain | Description | Adapter |
|---|------|------|--------|-------------|---------|
| 1 | VLP | Virtual Launch Pro | virtuallaunch.pro | Platform hub and account management | next-on-pages |
| 2 | TMP | Tax Monitor Pro | taxmonitor.pro | Tax professional directory and monitoring | static export |
| 3 | TTMP | Transcript Tax Monitor Pro | transcript.taxmonitor.pro | IRS transcript analysis and automation | opennextjs/cloudflare |
| 4 | TTTMP | Tax Tools Tax Monitor Pro | taxtools.taxmonitor.pro | Interactive tax education games | next-on-pages |
| 5 | DVLP | Developers VLP | developers.virtuallaunch.pro | Developer tools and portfolio | next-on-pages |
| 6 | GVLP | Games VLP | games.virtuallaunch.pro | Gaming platform | static export |
| 7 | TCVLP | TaxClaim Pro | taxclaim.virtuallaunch.pro | Form 843 automation for Kwong claims | static export |
| 8 | WLVLP | Website Lotto VLP | websitelotto.virtuallaunch.pro | Website bidding and hosting | static export |
| 9 | TAVLP | Tax Avatar Pro | taxavatar.virtuallaunch.pro | AI YouTube channels for tax professionals | static export |

## Architecture

- **Frontend:** Next.js (App Router) × 9 apps
- **Backend:** Single Cloudflare Worker (`apps/worker/`) serving all 9 platforms
- **Storage:** Cloudflare R2 (authoritative), D1 (projection)
- **Shared UI:** `packages/member-ui/` — canonical components used across all apps
- **Styling:** Tailwind CSS with shared design tokens per `canonical-style.md`
- **Payments:** Stripe (subscriptions + one-time)
- **Scheduling:** Cal.com (intro + support events)
- **Email:** Resend (transactional), SCALE pipeline (outreach)

## Structure

```
vlp-platform/
├── apps/
│   ├── vlp/          # Virtual Launch Pro
│   ├── tmp/          # Tax Monitor Pro
│   ├── ttmp/         # Transcript Tax Monitor Pro
│   ├── tttmp/        # Tax Tools Tax Monitor Pro
│   ├── dvlp/         # Developers VLP
│   ├── gvlp/         # Games VLP
│   ├── tcvlp/        # TaxClaim Pro
│   ├── wlvlp/        # Website Lotto VLP
│   ├── tavlp/        # Tax Avatar Pro
│   └── worker/       # Cloudflare Worker (API for all platforms)
├── packages/
│   └── member-ui/    # Shared UI components
├── .claude/
│   ├── CLAUDE.md     # Monorepo-wide context
│   ├── ROLES.md      # Role definitions
│   └── canonicals/   # 20+ canonical templates and standards
└── turbo.json        # Turborepo config
```

## Getting Started

```bash
# Install dependencies
npm install

# Start a specific app
npx turbo dev --filter=apps/{app}

# Build all
npx turbo build

# Build specific app
npx turbo build --filter={app}
```

## Canonicals

All standards, templates, and workflows live in `.claude/canonicals/`. Key files:

| File | Purpose |
|------|---------|
| `canonical-new-app.md` | Adding a new platform (the full workflow) |
| `canonical-app-blueprint.md` | Design system decisions |
| `canonical-style.md` | Design tokens and typography |
| `canonical-site-nav.md` | Navigation structure for all apps |
| `canonical-deploy.md` | Deployment procedures |
| `canonical-api.md` | API endpoint registry (~193 routes) |

## Owner

Jamie L. Williams, EA, CB, OTC
Virtual Launch Pro
