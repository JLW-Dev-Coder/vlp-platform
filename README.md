# vlp-platform

Turborepo monorepo for the Virtual Launch Pro (VLP) ecosystem — 8 platform frontends, 1 Cloudflare Worker, and shared packages.

## Platforms

| App | Domain | Description |
|-----|--------|-------------|
| `apps/vlp` | virtuallaunch.pro | Core hub — auth, billing, tokens, affiliates |
| `apps/tmp` | taxmonitor.pro | Taxpayer directory + memberships |
| `apps/ttmp` | transcript.taxmonitor.pro | IRS transcript parsing + reports |
| `apps/tttmp` | taxtools.taxmonitor.pro | Tax education games + IRS form tools |
| `apps/dvlp` | developers.virtuallaunch.pro | Freelancer/client matching |
| `apps/gvlp` | games.virtuallaunch.pro | Gamified subscription platform |
| `apps/tcvlp` | taxclaim.virtuallaunch.pro | Auto Form 843 generator |
| `apps/wlvlp` | websitelotto.virtuallaunch.pro | Canva-site marketplace |
| `apps/worker` | api.virtuallaunch.pro | Single Cloudflare Worker backend |

## Packages

| Package | Description |
|---------|-------------|
| `packages/member-ui` | Shared UI components, types, and styles for member areas |

## Getting Started

```bash
npm install
npm run build    # builds all packages and apps via Turborepo
npm run dev      # starts all dev servers
```

## Architecture

- **Turborepo** orchestrates builds across all apps and packages
- **`@vlp/member-ui`** provides shared components driven by `PlatformConfig`
- **Single Worker** at `apps/worker` handles all backend logic for all platforms
- **R2** is authoritative storage; **D1** is a queryable projection
