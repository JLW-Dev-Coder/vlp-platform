# Project Instruction — TTTMP Canonical Audit + Vesperi AI Guide + YouTube Channel

**Status:** Active
**Created:** 2026-04-21
**Owner:** JLW
**Scope:** `apps/tttmp/` (frontend) + `apps/worker/src/index.js` (endpoints) + R2 (video assets) + YouTube channel

---

## Roles

Per `canonical-roles.md` and `.claude/ROLES.md` in the vlp-platform monorepo:

- **Principal Engineer (Chat Claude):** Authors this instruction and reviews RC output
- **Execution Engineer (RC / Claude Code):** Executes each objective as specified, commits with descriptive messages, runs build verification
- **Owner (JLW):** Final authority on all decisions

---

## 1. Platform Context

### TTTMP — Tax Tools Arcade

| Field | Value |
|-------|-------|
| Domain | `taxtools.taxmonitor.pro` |
| App Dir | `apps/tttmp` |
| Adapter | `@cloudflare/next-on-pages` (Cloudflare Pages with SSR) |
| Brand Color | `#8b5cf6` (violet) |
| Backend | `apps/worker/src/index.js` → `api.virtuallaunch.pro` |
| Storage | R2 (authoritative) + D1 (projection) |
| Pages Project | `taxtools-taxmonitor-pro-site` |
| Build Command | `npx @cloudflare/next-on-pages` |
| Output Dir | `.vercel/output/static` |

### What TTTMP Does Today (live features)

- **Tax Tools Arcade Games** — Interactive games teaching IRS forms, tax concepts, and filing requirements (Form 2848 POA walkthrough, Form 8821 TIA, estimated payment calculators)
- **Game Tokens** — Token-gated access to games; tokens purchased via Stripe or included with VLP membership
- **Game Analytics** — Track which games clients play, completion rates, concept mastery (planned)

### TTTMP Endpoints (current)

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| POST | `/v1/tttmp/auth/magic-link/request` | Request magic link | No |
| GET | `/v1/tttmp/auth/magic-link/verify` | Verify magic link | No |
| GET | `/v1/tttmp/auth/session` | Get session | Yes |
| POST | `/v1/tttmp/auth/logout` | Logout | Yes |
| POST | `/v1/tttmp/checkout/sessions` | Create checkout session | No |
| GET | `/v1/tttmp/checkout/status` | Checkout status | Yes |
| POST | `/v1/tttmp/support/tickets` | Create support ticket | Yes |
| GET | `/v1/tttmp/support/tickets/:ticket_id` | Get ticket | Yes |
| GET | `/v1/tttmp/tokens/balance` | Token balance | Yes |
| GET | `/v1/tttmp/health` | Health check | No |
| POST | `/v1/tttmp/grant-access` | Grant game access | Yes |
| POST | `/v1/tttmp/verify-access` | Verify game access | Yes |
| POST | `/v1/tttmp/end-game` | End game session | Yes |

---

## 2. Work Phases

### Phase 0: Full Canonical Audit ✅ COMPLETE

Completed 2026-04-21. Drift report: `apps/tttmp/.claude/audit-report-2026-04-21.md`

29 findings: 9 Fix-Now / 11 Fix-with-Vesperi / 9 Fix-Later

### Phase 1: Fix Critical Drift ✅ COMPLETE (2026-04-21)

Phase 1 commits `03248aa..54efdf5`. See `apps/tttmp/.claude/audit-report-2026-04-21.md` for the per-finding status matrix.

### Phase 2: Vesperi AI Game Guide (Landing Page) ✅ COMPLETE (2026-04-21)

**Concept:** Similar to TCVLP's Gala, but tailored to TTTMP's audience and product. Vesperi is an AI avatar guide who walks visitors through the Tax Tools Arcade — explaining what games are available, who they're for, and how tokens work.

**Avatar:** Vesperi (HeyGen, 14 looks available)
**Primary look for landing page:** TBD after Owner reviews looks (see §4)
**Landing page URL:** `/vesperi`
**Tone:** Engaging, educational, slightly playful — matches a game/learning product

**Decision tree (shipped):**

```
[root] Welcome — "21 games, tax pro or taxpayer?"
  ├── [tax-pro]
  │     ├── [notices]    → IRS Tax Detective (2t), Match the Tax Notice (5t), IRS Notice Jackpot (5t), IRS Notice Showdown (5t)
  │     ├── [strategy]   → Circular 230 Quest (8t), Tax Strategy Adventures (8t), Audit Defense Showdown (8t), IRS Publication Maze (8t), International Tax Explorer (8t)
  │     ├── [client-ed]  → Tax Mythbusters (2t), Taxpayer Journey Map (5t), Tax Deduction Quest (5t), Tax Return Simulator (8t)
  │     └── [all-games-pro] → all 21 grouped by tier
  └── [taxpayer]
        ├── [filing]     → Tax Mythbusters (2t), Tax Deadline Master (5t), Tax Filing Race (5t), Tax Tips Refund Boost (5t)
        ├── [concepts]   → Tax Time Machine (2t), Tax Jargon Game (8t), Taxpayer Journey Map (5t), Tax Deduction Quest (5t)
        ├── [documents]  → Tax Scavenger Hunt (2t), Tax Document Hunter (8t), Tax Return Simulator (8t)
        └── [all-games-tp] → all 21 grouped by tier
```

**Game catalog:** 21 games across 3 tiers — Starter (2 tokens, 4 games), Intermediate (5 tokens, 8 games), Advanced (8 tokens, 9 games). Full data in `apps/tttmp/lib/vesperi-tree.ts` (`GAME_CATALOG`).

**Shipped scope:**
- `/vesperi` page (`apps/tttmp/app/vesperi/page.tsx`) with state-machine decision tree, video player with mute/unmute, tier-coded game cards, email intake form, Cal.com Talk-to-Us, Back navigation.
- Tree data + game catalog in `apps/tttmp/lib/vesperi-tree.ts`.
- Worker: `POST /v1/tttmp/vesperi/intake` + `GET /v1/tttmp/vesperi/clips/:filename`. D1 migration `0061_tttmp_vesperi_intake.sql`.
- PostHog funnel events (consent-gated): `vesperi_page_view`, `vesperi_node_view`, `vesperi_option_click`, `vesperi_game_click`, `vesperi_cal_click`, `vesperi_intake_submit`, `vesperi_back_click`.
- Nav + sitemap integration (megaMenu.discover, local Header, sitemap priority 0.9).
- Removed TTMP tools (Form 2848 Autofill, Form 8821 Autofill, Transcript Parser) from the TTTMP home page.

**Pending owner inputs:**
- 10 Vesperi HeyGen video clips (root, tax-pro, taxpayer, notices, strategy, client-ed, filing, concepts, documents, all-games) at `tttmp/vesperi/clips/{node-id}.mp4` in R2. Page is functional with missing videos via fallback text.
- Worker deployment (currently committed, not deployed).

### Phase 3: YouTube Channel Content Framework ✅ COMPLETE (2026-04-21)

**Channel Name:** Tax Tools Arcade
**Channel URL:** https://www.youtube.com/channel/UC2AeZcuISEo3yt_6EsKQtzQ
**Avatar for videos:** Vesperi (HeyGen)
**Audience:** Both tax professionals and taxpayers
**Content source:** 21 games in the Tax Tools Arcade

**Content strategy:** Each game yields 2-3 videos:
1. Walkthrough (2-3 min) — Vesperi explains what the game teaches
2. Short (30-60s) — One key concept, cut for YouTube Shorts
3. Deep Dive (optional) — For complex games only

**Companion page pattern:** Every YouTube video has a SEO companion page at `/learn/[slug]`:
- Ranks for same keywords as the video
- Embeds YouTube iframe (when published) or a "coming soon" placeholder
- Renders VideoObject JSON-LD structured data
- "Play This Game" CTA → `/games/[slug]` (live game route)
- "Find Your Game with Vesperi" + "Talk to Us" (Cal.com) CTAs
- Related games by topic cluster

**Shipped scope:**
- `apps/tttmp/lib/youtube-content.ts` — content plan generator, tag map, description template, topic clusters
- `apps/tttmp/app/learn/[slug]/page.tsx` — dynamic companion page (21 pages, one per game)
- `apps/tttmp/app/learn/page.tsx` — `/learn` index grouped by topic cluster with filter tabs
- Sitemap: `/learn` (priority 0.8) + 21 `/learn/[slug]` pages (priority 0.7)
- Nav: "Learn" added to `marketing.megaMenu.explore` and local Header
- `apps/tttmp/.claude/youtube-channel-kit.md` — channel description, tags, thumbnail spec, publishing cadence, Vesperi look map, first 5 video scripts ready for HeyGen

**Vesperi look decisions (recorded):**
| Context | Look |
|---------|------|
| Landing page (`/vesperi`) clips | Look 4 |
| YouTube walkthroughs (standard) | Look 4 |
| YouTube strategy/advanced content | Look 12 |
| YouTube beginner/approachable content | Look 14 |
| YouTube channel trailer | Look 7 |

**Pending owner inputs:**
- HeyGen video production for the 5 scripts in the channel kit
- YouTube upload + URL fill-in on `YouTubeVideo.youtubeUrl` (edit `lib/youtube-content.ts` or via follow-up prompt)
- Channel banner / profile image matching the spec

### Phase 4: Integration (intake, PostHog, email drip) ← CURRENT

Follow the same pattern as TCVLP/Gala:
- Intake endpoint (Worker)
- PostHog funnel events
- Welcome email drip (Resend via Worker cron)

---

## 3. Avatar — Vesperi

| Field | Value |
|-------|-------|
| Platform | HeyGen |
| Name | Vesperi |
| Looks Available | 14 |
| Voices Available | 1 |

**Look categories observed (from screenshot):**
- Office/professional settings (looks 1, 10)
- Casual sofa settings (looks 2-9, appears to be various sofa/room backgrounds)
- Pink/magenta outfit variants (looks 10-12)
- Dark outfit variants (looks 12-13)
- Light/casual variants (look 14)

**Owner to confirm:** Which look for landing page clips vs. YouTube content (same decision pattern as Gala: one consistent look for landing page, 2-3 looks for YouTube variety).

---

## 4. Open Decisions (Owner to confirm)

| # | Question | Options | Impact |
|---|----------|---------|--------|
| 1 | Landing page URL | `/vesperi` vs `/guide` vs `/arcade-guide` | URL permanence, brand alignment |
| 2 | YouTube channel name | "Tax Tools Arcade" vs "Tax Study Games" vs other | Brand identity |
| 3 | Vesperi's landing page look | One of the 14 available looks | Visual consistency |
| 4 | Vesperi's YouTube look(s) | 2-3 looks for variety | Content differentiation |
| 5 | Decision tree focus | Game selection guide vs. tax concept explainer vs. combined | Landing page purpose |
| 6 | Channel identity | Tax-pro focused vs. taxpayer focused vs. both | Content strategy |

**These decisions are made AFTER Phase 1 fixes, not before.**

---

## 5. Monorepo References

| Resource | Path / Location |
|----------|----------------|
| TTTMP app | `apps/tttmp/` |
| TTTMP CLAUDE.md | `apps/tttmp/.claude/CLAUDE.md` (if exists) |
| Worker | `apps/worker/src/index.js` |
| TTTMP features | `.claude/canonicals/canonical-feature-matrix.md` (TTTMP section) |
| TTTMP feature benefits | `.claude/canonicals/canonical-feature-benefits.md` (TTTMP section) |
| API registry | `.claude/canonicals/canonical-api.md` (TTTMP section) |
| Style guide | `.claude/canonicals/canonical-style.md` |
| Component guide | `.claude/canonicals/canonical-app-components.md` |
| Site nav structure | `.claude/canonicals/canonical-site-nav.md` |
| Deploy procedures | `.claude/canonicals/canonical-deploy.md` |
| Cookie consent | `.claude/canonicals/canonical-cookies.md` |
| Cal.com events | `.claude/canonicals/canonical-cal-events.md` |
| SEO | `.claude/canonicals/canonical-seo.md` |
| Roles | `.claude/ROLES.md` |
| Platform registry | `.claude/CLAUDE.md` §3 |
| TCVLP Gala reference | `.claude/instructions/tcvlp-gala-youtube.md` (pattern to follow) |
| Audit report | `apps/tttmp/.claude/audit-report-2026-04-21.md` |

---

## 6. Standing Rules

- RC commits all changes with descriptive messages
- RC pushes to `origin/main` unless instructed otherwise
- TTMP is in maintenance mode — do not touch
- DVLP is curbed until Owner advises
- WLVLP is in maintenance mode after post-purchase flow completion
- TCVLP Gala project is complete (Phases 1-4, 6 shipped) — do not modify
- All external links in dashboard context must open in new tab
- Dashboard page titles/subtitles must match the canonical pattern (`font-sora text-3xl font-extrabold text-white` + `text-white/55 text-[0.95rem]`)
- Phone inputs use canonical §10 normalization
- PostHog analytics is live across all apps — new pages are automatically tracked via cookie consent gate
- Build verification: `npx turbo build --filter=tttmp` after every change (note: TTTMP uses `@cloudflare/next-on-pages`, not static export)
