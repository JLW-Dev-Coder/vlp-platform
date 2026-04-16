<!--
Status: Authoritative
Last updated: 2026-04-15
Owner: JLW (Principal Engineer review required for changes)
Scope: All 8 apps in the vlp-platform monorepo
Parent: canonical-app-blueprint.md
-->

# canonical-readme.md

Template for README.md files in the VLP monorepo.

---

## Required Sections (in order)

### 1. Header
- Repo/app name, product name, domain, one-line purpose

### 2. System Overview
- What it is / is not / where it fits in the monorepo
- Monorepo path: `apps/{abbrev}/`

### 3. Architecture
- Frontend framework, styling, adapter
- Backend: `apps/worker/` (single Cloudflare Worker)
- Storage: R2 (authoritative), D1 (projection)
- External systems (Stripe, Cal.com, Twilio, etc.)

### 4. Responsibilities
- Ownership boundaries table
- What this app owns vs. what the Worker owns

### 5. Repo Structure
- Directory tree with folder purposes
- Key files and their roles

### 6. Core Workflows
- Exact flows this app implements (e.g., onboarding, checkout, dashboard)

### 7. Data Contracts
- Key contract files in `apps/worker/contracts/{platform}/`
- What they represent, where data flows

### 8. Setup / Local Development
```bash
# From monorepo root
npm install
npx turbo dev --filter=apps/{app}
```

### 9. Commands
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — lint check
- `npm run typecheck` — TypeScript check

### 10. Environment / Config
- Env var names (no secret values)
- Reference to `apps/worker/wrangler.toml` for API config

### 11. Deployment
- Adapter type, output dir, Cloudflare project name
- Reference `canonical-deploy.md` for full procedures

### 12. Constraints / Rules
- High-level guardrails
- Reference root `.claude/CLAUDE.md` Working Rules

### 13. Related Systems
- Ecosystem map table linking to other platforms
- Reference `canonical-stack.md` for full stack matrix

### 14. Glossary
- Domain-specific terms for this platform
