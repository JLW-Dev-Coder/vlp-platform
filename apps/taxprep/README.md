# Tax Prep Pro (TPP)

Marketing site for Tax Prep Pro — a SuiteDash-based productized buildout for service bureaus and credentialed tax practitioners.

- **Domain:** taxprep.virtuallaunch.pro
- **Adapter:** static export → Cloudflare Pages
- **Brand:** rose / crimson / champagne / gold (see `tailwind.config.ts` + canonical-app-blueprint §4.5)

> Full canonical README pending Phase 7 — see `.claude/canonicals/canonical-readme.md`.

## Develop

```bash
npx turbo build --filter=taxprep
pnpm dev --filter=taxprep
```
