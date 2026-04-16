<!--
Status: Authoritative
Last updated: 2026-04-15
Owner: JLW (Principal Engineer review required for changes)
Scope: All 8 apps in the vlp-platform monorepo
Parent: canonical-app-blueprint.md
-->

# canonical-claude.md

Template for app-level `.claude/CLAUDE.md` files in the VLP monorepo.
Each app in `apps/{abbrev}/` has its own `.claude/CLAUDE.md` for app-specific context.

---

## Required Sections (in order)

### 1. Header (identity + scope)
- App name and abbreviation
- Domain
- Monorepo path (`apps/{abbrev}/`)
- Last updated
- One-line purpose

### 2. System Definition
- What the system is
- What it is NOT
- Audience
- Stack (explicit: framework, adapter, styling)
- Backend dependency: "All backend logic lives in `apps/worker/`. This app does not create its own Worker."

### 3. Hard Constraints (top-level, early)
- No backend changes in this repo — backend is `apps/worker/`
- Do not modify shared package code for app-specific needs
- Never invent endpoints or contracts — check `canonical-api.md`
- Reference monorepo root `.claude/CLAUDE.md` for shared context

### 4. Terminology (Canonical Language Layer)
- Defines allowed vs forbidden terms for this platform
- Maps legacy terms to canonical terms

### 5. App Structure (Source of Truth Map)
- Directory tree specific to this app
- What each folder does
- What is authoritative vs generated

### 6. Data Contracts
#### 6.1 Source of Truth
- Contract files live in `apps/worker/contracts/{platform}/`
#### 6.2 Schema Definitions
- Key contracts this app uses
#### 6.3 Mutation Rules
- What can be changed from this frontend, what cannot

### 7. API Endpoints Used
- List of Worker endpoints this app calls
- Reference `canonical-api.md` for full registry

### 8. External Interfaces
- R2 keys, API dependencies, Worker routes this app depends on

### 9. Personalization / Business Logic
- Platform-specific branding via PlatformConfig
- Email rules, subject patterns, dynamic variables

### 10. Routing / URL Rules
- App-specific URL structure, page routes

### 11. Build & Deploy
- Build command, output dir, adapter
- Cloudflare project name
- Reference `canonical-deploy.md` for full deploy procedures

### 12. Shared Context
- "For monorepo-wide rules, canonicals, and platform registry, see the root `.claude/CLAUDE.md`."

---

## Rules

1. App-level CLAUDE.md contains ONLY app-specific context
2. Shared context (platform registry, architecture, working rules) lives in root `.claude/CLAUDE.md`
3. Canonicals live ONLY at monorepo root `.claude/canonicals/` — never duplicate into app directories
4. When a canonical is updated at root, it applies to all apps immediately
5. Every app-level CLAUDE.md must end with a reference to root shared context

## Canonicals Enforcement

Before writing any file, check whether the file type has a canonical template.
Canonical templates live in `.claude/canonicals/` at the monorepo root.

| File type | Canonical template | Check before... |
|-----------|-------------------|-----------------|
| CLAUDE.md | canonical-claude.md | Editing any CLAUDE.md |
| Contract JSON | canonical-contract.json | Creating or modifying any contract |
| Contract registry | canonical-contract-registry.json | Adding registry entries |
| index.html (landing) | canonical-index.html | Creating landing pages |
| MARKET.md | canonical-market.md | Editing marketing copy |
| README.md | canonical-readme.md | Editing any README |
| ROLES.md | canonical-roles.md | Editing role definitions |
| SCALE.md | canonical-scale.md | Editing pipeline docs |
| SKILL.md | canonical-skill.md | Editing skill files |
| STYLE.md | canonical-style.md | Editing style guides |
| Workflow docs | canonical-workflow.md | Editing workflow docs |
| wrangler.toml | canonical-wrangler.toml | Editing Worker config |
| Deploy docs | canonical-deploy.md | Editing deploy procedures |
| API docs | canonical-api.md | Documenting API endpoints |
| Stack docs | canonical-stack.md | Documenting platform stack |

### Rules
1. If a canonical exists for the file type, read it BEFORE making changes
2. The output must contain every required section listed in the canonical
3. If the canonical defines required keys, those keys must be present — never omit them
4. If a task would create a new file type not covered by a canonical, stop and report to Principal Engineer before proceeding
5. After completing the task, verify the output against the canonical checklist

### Cross-repo canonical source of truth
All canonical templates live in `.claude/canonicals/` at the monorepo root. This is the single source of truth. Apps reference canonicals but never copy them into their own directories.
