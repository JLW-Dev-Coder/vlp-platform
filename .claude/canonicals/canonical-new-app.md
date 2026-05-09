<!--
Status: Authoritative
Last updated: 2026-04-28
Owner: JLW (Principal Engineer review required for changes)
Scope: All apps in the vlp-platform monorepo
Parent: canonical-app-blueprint.md
-->

# canonical-new-app.md

Workflow for adding a new platform app to the VLP monorepo and bringing it to canonical standard. This is the playbook for app #10 and beyond.

---

## Purpose

Codifies the complete process of launching a new VLP ecosystem app — from concept to live production site at canonical standard. Ensures no file is missed, no canonical is skipped, and the process is repeatable without iterative discovery.

---

## Prerequisites (what the Principal Engineer must provide)

Before the Execution Engineer begins, the following must exist:

| Input | Description | Example |
|-------|-------------|---------|
| **Platform code** | 2–6 letter uppercase abbreviation | TAVLP |
| **Brand name** | Full product name | Tax Avatar Pro |
| **Brand abbreviation** | Short display name (for logo mark) | TAP |
| **Domain** | Production domain | taxavatar.virtuallaunch.pro |
| **Brand color** | Primary hex color | #ec4899 |
| **Font** | Display + body font | Sora |
| **Audience** | Who uses this product | Tax professionals (EAs, CPAs, attorneys) |
| **Pricing** | Pricing structure | $29/mo add-on to TCVLP |
| **Parent platform** | If add-on, which platform | TCVLP |
| **Homepage design** | Complete landing page HTML or detailed wireframe | tavlp-landing-v4.html |
| **Feature list** | 4–8 key features with descriptions | Custom avatar, weekly publishing, etc. |
| **Cal.com events** | Intro + support event slugs/namespaces | tax-monitor-pro/tax-avatar-virtual-launch-pro |
| **Intake/form endpoint** | Where form submissions POST | POST /v1/tcvlp/gala/intake |
| **Cross-platform links** | Which other VLP apps to link from footer | TCVLP, Tax Transcript AI |
| **Legal specifics** | Product-specific privacy/terms/refund language | YouTube data, HeyGen avatars, channel transfer |
| **Reference app** | Which existing app to clone structure from | apps/tcvlp/ |

---

## Phase 1: Scaffold (Day 1)

### 1.1 Create the app directory

```
apps/{abbrev}/
├── .claude/
│   └── CLAUDE.md              # Per canonical-claude.md template
├── app/
│   ├── (marketing)/
│   │   ├── layout.tsx         # MarketingHeader + MarketingFooter from @vlp/member-ui
│   │   ├── page.tsx           # Homepage (port the provided landing page)
│   │   ├── about/page.tsx
│   │   ├── features/page.tsx
│   │   ├── how-it-works/page.tsx
│   │   ├── pricing/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── reviews/page.tsx
│   │   ├── reviews/submit/page.tsx
│   │   ├── sign-in/page.tsx
│   │   └── legal/
│   │       ├── privacy/page.tsx
│   │       ├── terms/page.tsx
│   │       └── refund/page.tsx
│   ├── layout.tsx             # Root layout (fonts, metadata, analytics)
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   └── marketing/
│       └── LandingPage.tsx    # Client component with ported homepage
├── lib/
│   ├── platform-config.ts     # PlatformConfig
│   └── metadata.ts
├── public/
│   └── favicon.svg
├── next.config.ts             # output: 'export' (or adapter-specific)
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── wrangler.toml
└── README.md                  # Per canonical-readme.md template
```

### 1.2 Create PlatformConfig

Must include all fields per `packages/member-ui/src/types/config.ts`:
- platformName, platformCode, brandAbbrev, brandName
- themeColor, domain, apiBaseUrl
- Cal.com: calBookingNamespace, calBookingSlug, calIntroNamespace, calIntroSlug
- routes: home, signIn, dashboard
- marketing: nav, footerResources, footerTagline, footerCopyright, ctaLabel, ctaPath, megaMenu

### 1.3 Wire shared components

- `MarketingHeader` + `MarketingFooter` from `@vlp/member-ui` in the marketing layout
- `ReviewDisplayPage` + `ReviewSubmitPage` for /reviews
- `LegalPageLayout` for legal pages
- `ContactPage` pattern for /contact with Cal.com embed

---

## Phase 2: Content (Days 1–2)

### 2.1 Port the homepage

Convert the provided HTML landing page into a Next.js client component. Rules:
- Line-by-line port — do NOT rewrite or simplify
- Keep all CSS as-is (namespaced under a data attribute to avoid bleeding into Header/Footer)
- Keep all vanilla JS in useEffect hooks
- Preserve every section, animation, and interactive feature

### 2.2 Create marketing pages

Per `canonical-site-nav.md` §1, every app needs:

| Page | Content source |
|------|---------------|
| /about | Principal Engineer provides narrative + context |
| /features | Derived from feature list provided in prerequisites |
| /how-it-works | Derived from homepage "How it works" section, expanded |
| /pricing | Derived from pricing structure provided |
| /contact | Cal.com embed + contact form |
| /reviews | Shared ReviewDisplayPage component |
| /sign-in | Shared auth components or placeholder |
| /legal/* | Adapted from reference app with product-specific language |

### 2.3 Create legal pages

Adapt from reference app. Must include product-specific language for:
- What data is collected
- How the service works (subscription, managed service, etc.)
- Cancellation and refund policy
- Third-party services used (HeyGen, YouTube, etc.)

---

## Phase 3: Canonical File Updates (Day 2)

These files in `.claude/canonicals/` must be updated when adding ANY new app:

### 3.1 Required updates

| File | What to update |
|------|---------------|
| `canonical-cal-events.md` | Add intro + support events to §3 registry table, update count |
| `canonical-feature-matrix.md` | Add new platform section with feature → route → R2 → D1 → frontend → status mapping |
| `canonical-feature-benefits.md` | Add human-readable benefit descriptions for each feature |
| `canonical-api.md` | Add any new Worker endpoints (if applicable) |
| `canonical-stack.md` | Add platform to the stack matrix table |
| `canonical-deploy.md` | Add deploy procedure (adapter type, project name, output dir) |
| `canonical-site-nav.md` | Add platform to Tools & Extras table in mega menu section |
| Root `.claude/CLAUDE.md` | Add platform to §3 registry, §4 build table, §9 repo locations |

### 3.2 New files to create

| File | Template |
|------|----------|
| `apps/{abbrev}/.claude/CLAUDE.md` | Per `canonical-claude.md` |
| `apps/{abbrev}/README.md` | Per `canonical-readme.md` |
| `apps/worker/contracts/{platform}/` | If new contracts needed |

---

## Phase 4: Infrastructure (Day 2–3)

### 4.1 Cloudflare Pages project

1. Create Pages project in Cloudflare Dashboard (or via Wrangler)
2. Add custom domain
3. Verify DNS (auto-configures if zone is already on Cloudflare)

### 4.2 CI/CD

Add to `.github/workflows/deploy-pages.yml`:
- New job for the app
- Paths filter for `apps/{abbrev}/**`
- Dispatch option for manual deploys

### 4.3 Worker routes (if needed)

Add any new routes to `apps/worker/src/index.js`. Common patterns:
- R2 serving route for media assets (`/{prefix}/*`)
- Cron jobs for data refresh
- Intake/form endpoints

### 4.4 R2 asset organization

Media assets stored under `{platform}/` prefix in the `virtuallaunch-pro` bucket:
- `{platform}/videos/` — video content
- `{platform}/avatars/` — avatar images
- `{platform}/assets/` — general assets

---

## Phase 5: QA & Verification (Day 3)

### 5.1 Build verification

```bash
npx turbo build --filter={app}
```

All routes must prerender. No TypeScript errors. No blocking lint errors.

### 5.2 Page checklist

Every page must be checked in browser:

| Page | Check |
|------|-------|
| / (homepage) | All sections render, videos play, forms submit, animations work |
| /about | Content renders, responsive |
| /features | All features listed, responsive |
| /how-it-works | Steps render, responsive |
| /pricing | Tiers render, CTAs link correctly |
| /contact | Cal.com embed loads, form submits |
| /reviews | Empty state or reviews render |
| /sign-in | Auth flow works or placeholder renders |
| /legal/privacy | Content renders |
| /legal/terms | Content renders |
| /legal/refund | Content renders |
| /avatars (if applicable) | Media loads from R2 |

### 5.3 Cross-cutting checks

- [ ] Header nav links to all pages
- [ ] Footer links work
- [ ] Mobile responsive at sm/md/lg/xl breakpoints
- [ ] No hydration errors in console
- [ ] Favicon displays
- [ ] Page title and meta description set
- [ ] OG tags set for social sharing
- [ ] Forms POST to correct endpoints
- [ ] External links open in new tab
- [ ] Cal.com embeds load
- [ ] Videos play from R2
- [ ] No mixed content warnings

### 5.4 Design token compliance

Per `canonical-style.md` §11 self-check:
- [ ] Brand colors use blueprint §4.5 tokens
- [ ] Surfaces use surface.* tokens
- [ ] Typography uses correct scale (marketing OR app, not mixed)
- [ ] Buttons use canonical variants and sizes
- [ ] Containers use canonical max-widths (1280px marketing, 1200px app, 960px narrow)

---

## Phase 6: Production Deploy (Day 3)

### 6.1 Deploy

```bash
cd apps/{abbrev}
npx turbo build --filter={app}
npx wrangler pages deploy out --project-name={pages-project-name}
```

### 6.2 Post-deploy verification

Run the full page checklist from §5.2 against the production URL.

### 6.3 Backup

Keep any previous static site as a one-command rollback until the new app is confirmed stable.

---

## Phase 6.5: Deploy Verification Loop

The canonical deploy contract is **direct push to `main`** (per `canonical-deploy.md` and `.claude/CLAUDE.md` §8 working rule #7). PRs are not part of the deploy workflow. Cloudflare Pages auto-deploys from `main` on every push for static-export and `@cloudflare/next-on-pages` apps; TPP and TTMP deploy via GitHub Actions (`deploy-pages.yml` and `deploy-ttmp.yml`) on the same `main` push.

### 6.5.1 The loop (every change, every app)

```
make change → commit → push origin main → watch GH Actions run → smoke-check production URL
```

There is no PR step. There is no review queue. There is no `gh pr create`. RC commits and pushes directly to `main` per the standing instructions in `.claude/CLAUDE.md`.

### 6.5.2 Branches: when and why

Branches exist only for **in-progress multi-day work** that isn't safe to land incrementally on `main` (e.g., `feat/taxprep-app-10` was retained for the TPP launch as a discoverable launch boundary). When the work is ready, the branch is fast-forward or squash-merged into `main` locally — not via PR. Feature branches are deleted from origin and locally once their work has landed, except when explicitly preserved as a launch boundary.

### 6.5.3 What to watch after each push

- **Pages apps (static export + next-on-pages):** the corresponding `deploy-pages.yml` job in GitHub Actions, OR the auto-deploy run for the app's Pages project in the Cloudflare dashboard.
- **TTMP:** the `deploy-ttmp.yml` job (Workers via `@opennextjs/cloudflare`).
- **Worker:** the `deploy-worker.yml` job (or `wrangler deploy` if pushed via local Wrangler).

If a deploy run fails, RC investigates and ships a follow-up commit to `main` — there is no rollback to a pre-push state because there is no pre-push state to roll back to. Rollback uses `git revert <bad-commit>` and the standard push loop (or, for static apps, `wrangler pages deployment retry/rollback` against the previous successful deployment).

### 6.5.4 What this rules out

- ❌ `gh pr create` for any change to a deployed app — PRs do not deploy
- ❌ Working on a branch and "saving up" the work for a single PR — direct, smaller commits to `main` are preferred
- ❌ Adding a `pr-checks.yml` GitHub Actions workflow — there is no PR queue to gate
- ❌ Treating "merged via PR" as deployed; only "pushed to `main`" means deployed

---

## Phase 7: Documentation & Handoff (Day 3)

### 7.1 README

Create `apps/{abbrev}/README.md` per `canonical-readme.md` with all 14 sections filled in.

### 7.2 Marketing kit (in README)

Add a "Marketing Kit" section to the README:

```markdown
## Marketing Kit

| Asset | Location |
|-------|----------|
| Landing page copy | apps/{abbrev}/components/marketing/LandingPage.tsx |
| Feature descriptions | apps/{abbrev}/app/(marketing)/features/page.tsx |
| Avatar roster | R2: tavlp/avatars/ |
| Kennedy scripts | [ClickUp doc link] |
| Social proof | Phillip Gillian (YouTube), Conny R. (Facebook) |
| Competitor reference | IRS Client Machine by Tax Resolution Growth Academy |
| Brand color | #ec4899 |
| Font | Sora |
| Logo mark | TAP (pink play button on slate-950) |
```

### 7.3 Update global README

Add the new app to the monorepo root `README.md` platform registry table.

---

## Checklist Summary

Use this as a single-pass checklist when onboarding a new app:

```
PHASE 1: SCAFFOLD
[ ] apps/{abbrev}/ directory created (mirror reference app structure)
[ ] PlatformConfig created with all required fields
[ ] .claude/CLAUDE.md created per canonical-claude.md
[ ] Marketing layout with shared Header/Footer
[ ] tailwind.config.ts, tsconfig.json, package.json, wrangler.toml

PHASE 2: CONTENT
[ ] Homepage ported from provided HTML (line-by-line, not rewritten)
[ ] /about page
[ ] /features page
[ ] /how-it-works page
[ ] /pricing page
[ ] /contact page with Cal.com embed
[ ] /reviews page with shared ReviewDisplayPage
[ ] /reviews/submit page
[ ] /sign-in page
[ ] /legal/privacy, /legal/terms, /legal/refund

PHASE 3: CANONICAL UPDATES
[ ] canonical-cal-events.md — add intro + support events
[ ] canonical-feature-matrix.md — add platform section
[ ] canonical-feature-benefits.md — add feature benefits
[ ] canonical-api.md — add any new endpoints
[ ] canonical-stack.md — add to stack matrix
[ ] canonical-deploy.md — add deploy procedure
[ ] canonical-site-nav.md — add to mega menu Tools & Extras
[ ] Root .claude/CLAUDE.md — add to registry, build, repo sections

PHASE 4: INFRASTRUCTURE
[ ] Cloudflare Pages project created
[ ] Custom domain configured
[ ] CI/CD job added to deploy-pages.yml
[ ] Worker routes added (if needed)
[ ] R2 assets organized under {platform}/ prefix

PHASE 5: QA
[ ] turbo build passes
[ ] All pages checked in browser
[ ] Mobile responsive
[ ] No hydration errors
[ ] Design token compliance
[ ] Forms submit correctly
[ ] Videos/media load from R2

PHASE 6: DEPLOY
[ ] Production deploy
[ ] Post-deploy verification
[ ] Backup preserved

PHASE 7: DOCUMENTATION
[ ] README.md created per canonical-readme.md
[ ] Marketing kit section added to README
[ ] Global README updated
```

---

## What this prevents

- Forgetting to update canonical files (feature-matrix, cal-events, stack, etc.)
- Iterative discovery of missing pages ("oh, we also need /features")
- Hydration errors from dependency mismatches
- Inconsistent design tokens across apps
- Missing CI/CD configuration
- Undocumented deploy procedures
- No README for new contributors

---

## Relationship to other canonicals

| Canonical | Role in this workflow |
|-----------|---------------------|
| `canonical-app-blueprint.md` | Parent — all design decisions |
| `canonical-claude.md` | Template for app-level CLAUDE.md |
| `canonical-readme.md` | Template for app README |
| `canonical-site-nav.md` | Defines required pages and navigation structure |
| `canonical-style.md` | Design tokens for QA compliance |
| `canonical-deploy.md` | Deploy procedures to add to |
| `canonical-feature-matrix.md` | Feature registry to update |
| `canonical-feature-benefits.md` | Benefit copy to update |
| `canonical-cal-events.md` | Cal.com events to register |
| `canonical-stack.md` | Stack matrix to update |
| `canonical-api.md` | API registry to update |

---

## Decision log

| Date | Change | Rationale |
|------|--------|-----------|
| 2026-05-09 | Added Phase 6.5 "Deploy Verification Loop" codifying the direct-push deploy contract | The TPP launch (app #10) initially used PR-based deploys, which contradicts `canonical-deploy.md`. A hardening PR was originally going to teach the wrong process; corrected before landing. New apps deploy via direct push to `main` per `canonical-deploy.md` and `.claude/CLAUDE.md` §8 working rule #7. Cloudflare Pages auto-deploys from `main` on push. |
