# Project Instruction — TCVLP Gala AI Landing Page + YouTube Channel

**Status:** Active
**Created:** 2026-04-21
**Owner:** JLW
**Scope:** `apps/tcvlp/` (frontend) + `apps/worker/src/index.js` (session/clip logic) + R2 (video assets) + YouTube channel

---

## Roles

Per `canonical-roles.md` and `canonical-rc-prompt.md` in the vlp-platform monorepo:

- **Principal Engineer (Chat Claude):** Authors this instruction and reviews RC output
- **Execution Engineer (RC / Claude Code):** Executes each objective as specified, commits with descriptive messages, runs build verification
- **Owner (JLW):** Final authority on all decisions

---

## 1. Platform Context

### TCVLP — TaxClaim Pro

| Field | Value |
|-------|-------|
| Domain | `taxclaim.virtuallaunch.pro` |
| App Dir | `apps/tcvlp` |
| Adapter | Static export (Cloudflare Pages) |
| Brand Color | `#eab308` (yellow) |
| Backend | `apps/worker/src/index.js` → `api.virtuallaunch.pro` |
| Storage | R2 (authoritative) + D1 (projection) |

### What TCVLP Does Today (live features)

- **Form 843 Generation** — auto-generates IRS penalty abatement claims from taxpayer data
- **Branded Claim Page** — practitioner-branded landing pages for client intake (`/claim/[slug]`)
- **Penalty Calculations** — automated penalty/interest calculations from transcript data
- **Taxpayer Dashboard** — clients track claim status, view submissions, download documents
- **Kwong v. US Deadline Tools** — eligibility checker for the Kwong ruling window (Jan 2020 – July 2023 penalties, July 2026 deadline)
- **Submission Notifications** — email alerts on Form 843 submissions
- **Client Contact Preferences** — captured at submission time

### Tiers

| Tier | Price | Key Extras |
|------|-------|-----------|
| Starter | $10/mo | Form 843 generation, branded page, penalty calculations |
| Professional | $29/mo | + Unlimited claim pages, priority generation, bulk export, transcript integration |
| Firm | $79/mo | + White-label branding, multi-practitioner access, API access, dedicated support |

---

## 2. Product Vision — Gala AI Claim Guide

### The Concept

YouTube video → description link → TCVLP landing page → **Gala** (AI avatar) is already visible, waiting → visitor clicks a guided path → Gala responds with pre-recorded clips + dynamic text → conversion to Form 843 intake.

### Why This Works

- Visitors don't need "infinite AI" — they need a face, a greeting, clear guided choices, and a feeling that the page is responding to them
- The Kwong claim has a hard deadline (July 2026) creating natural urgency
- One legal/content lane, one intake flow, one decision tree, one avatar script system, one YouTube content engine

### What Gala Is

Gala is:
- **Explainer** — walks visitors through whether the Kwong claim logic applies
- **Guide** — navigates the decision tree with the user
- **Classifier** — routes visitors to the right path based on their situation
- **Conversion bridge** — leads naturally to Form 843 intake

Gala's tone: calm, precise, confident, not overhyped.

---

## 3. Architecture

### V1 Interaction Model — Hybrid (Levels 1 + 2)

**Level 1 (deterministic):** User clicks known buttons → system returns known Gala clip. Ship first.

**Level 2 (hybrid AI):** User types a question → Claude classifies it to a known path (refund / notice / uncertain / escalate) → page plays the matching Gala clip. Add after Level 1 is stable.

**NOT in V1:** Real-time lip-sync / generated avatar responses (Level 3 — future).

### System Layers

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Video Assets** | R2 (`gala/` prefix) | Stores 8–12 short MP4 clips |
| **Landing Page** | `apps/tcvlp` (Next.js static export) | Hero, video player, response buttons, transcript area, intake form |
| **Session Logic** | `apps/worker` (Cloudflare Worker) | Tracks user path, returns next clip, optional Claude classification |
| **Claude** | Anthropic API (via Worker) | Classifies free-text input to a known path (Level 2 only) |
| **YouTube** | External | Content funnel driving traffic to the landing page |

### R2 Video Asset Structure

```
gala/idle.mp4              — Gala waiting, ambient loop
gala/greeting.mp4          — Opening: "Hi, I'm Gala..."
gala/kwong-intro.mp4       — Explains the Kwong claim framework
gala/kwong-example.mp4     — Walks through a concrete example
gala/refund-path.mp4       — "You paid and want money back" branch
gala/notice-path.mp4       — "You received an IRS notice" branch
gala/not-sure.mp4          — "Not sure if I qualify" branch
gala/qualify-yes.mp4       — "Based on what you've told me, this may fit"
gala/qualify-no.mp4        — "This doesn't seem to match the Kwong framework"
gala/next-steps.mp4        — "Here's what to do next"
gala/book-review.mp4       — CTA: "Get a personalized review"
gala/quick-explain.mp4     — 60-second Kwong overview for impatient visitors
```

### Worker Endpoints (new — to be built)

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| POST | `/v1/tcvlp/gala/session` | Create a new Gala session, return greeting clip URL | No |
| POST | `/v1/tcvlp/gala/next` | Given session_id + user choice, return next clip URL + buttons | No |
| POST | `/v1/tcvlp/gala/classify` | (Level 2) Send free-text → Claude classifies → return path | No |
| GET | `/v1/tcvlp/gala/clips/:clip_id` | Redirect to R2 signed URL for a clip | No |

---

## 4. Decision Tree — Kwong Claim Flow

### Opening (Gala greeting)

> "Hi, I'm Gala. I can walk you through whether the Kwong claim logic may apply to your situation. Start by choosing the option that best matches your case."

**Buttons:**
1. Explain the claim first
2. I already know the issue
3. I received an IRS notice
4. I think the IRS applied something incorrectly
5. I want a quick explanation first

### Branch: "Explain the claim first"

**Clip:** `kwong-intro.mp4`

**Then buttons:**
- I think this fits me → `qualify-yes.mp4` → mini intake form
- I need an example → `kwong-example.mp4` → back to "fits me" / "doesn't fit"
- This sounds different from my situation → `qualify-no.mp4` → alternative resources

### Branch: "I already know the issue"

**Clip:** `refund-path.mp4`

**Then:** mini intake form (tax year, penalty type, amount, what happened)

### Branch: "I received an IRS notice"

**Clip:** `notice-path.mp4`

**Then buttons:**
- The notice mentions penalties from 2020-2023 → `qualify-yes.mp4` → intake
- The notice is about something else → `qualify-no.mp4` → resources
- I'm not sure what the notice says → upload/describe option

### Branch: "I want a quick explanation first"

**Clip:** `quick-explain.mp4` (60-second overview)

**Then:** return to main 5-button menu

### Terminal: Intake Form

After reaching `qualify-yes.mp4` or `next-steps.mp4`:

| Field | Type | Required |
|-------|------|----------|
| Tax Year(s) | multi-select (2020, 2021, 2022, 2023) | Yes |
| Penalty Type | dropdown (failure-to-file, failure-to-pay, estimated tax, other) | Yes |
| Approximate Amount | currency input | No |
| What Happened | textarea | Yes |
| Upload Documents | file input (PDF/image) | No |
| Name | text | Yes |
| Email | email | Yes |
| Phone | tel (canonical §10 normalization) | No |
| Contact Preference | radio (email/phone/text) | Yes |

**After submit:** Gala plays `book-review.mp4` → CTA to schedule review or wait for practitioner contact.

---

## 5. Landing Page Structure

### URL: `/kwong-claim`

| Section | Content |
|---------|---------|
| **Hero** | "Could the Kwong claim logic apply to your case?" / "Gala will walk you through it in under 2 minutes." |
| **Video Panel** | Gala player with idle loop, auto-plays greeting on first interaction |
| **Choice Buttons** | 3–5 contextual buttons below the video, update per branch |
| **Transcript/Caption** | Optional: shows Gala's spoken text as captions below video |
| **Dynamic Panel** | Intake form appears when the flow reaches the terminal state |
| **CTA** | "Get a personalized review" / "See if your facts fit" / "Submit your case details" |

### UX Rules

- **Start with clicks, not typing** — clicking feels easy, typing creates friction
- **Modular clips, not one long video** — faster load, easier edits, branch logic
- **No generic "How can I help?"** — Gala opens with specific, guided context
- **Each click = new Gala response + new button set** — the page feels alive

---

## 6. YouTube Channel Strategy

### Channel Identity

| Field | Value |
|-------|-------|
| Channel Name | TBD — options: "TaxClaim Pro", "Kwong Claim AI", "Tax Penalty Help" |
| Positioning | Educational content about IRS penalty abatement, Kwong v. US ruling, Form 843 |
| CTA Pattern | Every video description links to the Gala landing page |
| Content Style | Short-form (60-90s) explainers + long-form (5-10m) deep dives |

### Content Calendar (initial batch)

| # | Title Pattern | Length | Gala Landing Page Link |
|---|--------------|--------|----------------------|
| 1 | "The IRS Owes You Money? Here's How to Check (Kwong v. US)" | 90s | `/kwong-claim` |
| 2 | "Form 843 Explained in 60 Seconds" | 60s | `/kwong-claim` |
| 3 | "5 Signs the Kwong Claim Applies to Your Case" | 3m | `/kwong-claim` |
| 4 | "IRS Penalty Abatement: What CPAs Need to Know Before July 2026" | 8m | `/kwong-claim` |
| 5 | "How to File Form 843 (Step-by-Step)" | 5m | `/kwong-claim` |
| 6 | "Kwong v. US: The Ruling That Could Get Your Penalty Refunded" | 4m | `/kwong-claim` |

### Thumbnail + Title Rules

- Thumbnails: bold text overlay, face (Gala or presenter), IRS/tax visual elements, yellow brand accent
- Titles: question or number format, include "IRS" or "penalty" for search, deadline urgency where applicable
- Description: first 2 lines = hook + CTA link to `/kwong-claim`, then expanded description, then tags

---

## 7. Build Sequence

### Phase 1: Foundation (no video yet)

1. Define the complete Kwong claim decision tree (this document, §4)
2. Write Gala's branching scripts (text for each clip — what she says)
3. Build the landing page skeleton at `/kwong-claim` with placeholder video area + working button flow
4. Build Worker session endpoints (`/v1/tcvlp/gala/session`, `/v1/tcvlp/gala/next`)

### Phase 2: Video Production

5. Produce 8–12 short Gala clips using HeyGen (or equivalent avatar tool)
6. Upload clips to R2 under `gala/` prefix
7. Wire landing page player to R2 clip URLs via Worker endpoints
8. Test full button-driven flow end-to-end

### Phase 3: Intake Integration

9. Add intake form to the landing page terminal state
10. Wire form submission to existing TCVLP Form 843 pipeline (or new intake endpoint)
11. Add Gala's closing clip after form submission

### Phase 4: YouTube Launch

12. Produce initial batch of 6 YouTube videos
13. Set up channel with branding, descriptions, playlists
14. Publish videos with Gala landing page CTAs in descriptions
15. Set up PostHog tracking on the Gala page for funnel analytics

### Phase 5: Level 2 — Hybrid AI (post-launch)

16. Add free-text input option alongside buttons
17. Build Claude classification endpoint (`/v1/tcvlp/gala/classify`)
18. Map classification results to existing clip paths
19. Test and refine classification accuracy

---

## 8. Confirmed Decisions

| # | Question | Decision |
|---|----------|----------|
| 1 | Landing page URL | **CONFIRMED: `/kwong-claim`** — SEO advantage, "Kwong claim" is the search term |
| 2 | YouTube channel name | **CONFIRMED: `TaxClaim Pro`** — matches product name, broader than just Kwong |
| 3 | Avatar tool | **CONFIRMED: HeyGen** — Gala avatar with 18 looks already created |
| 4 | Gala's appearance | **CONFIRMED: Gala Business Sofa Front (landing page clips), Gala Office Front (YouTube authority pieces)** |
| 5 | First interaction model | **CONFIRMED: A — Button-driven only (Level 1 first).** Level 2 hybrid AI added post-launch. |

---

## 9. Monorepo References

| Resource | Path / Location |
|----------|----------------|
| TCVLP app | `apps/tcvlp/` |
| Worker | `apps/worker/src/index.js` |
| TCVLP features | `.claude/canonicals/canonical-feature-matrix.md` (TCVLP section) |
| TCVLP feature benefits | `.claude/canonicals/canonical-feature-benefits.md` (TCVLP section) |
| API registry | `.claude/canonicals/canonical-api.md` (TCVLP section) |
| Style guide | `.claude/canonicals/canonical-style.md` |
| Component guide | `.claude/canonicals/canonical-app-components.md` |
| Site nav structure | `.claude/canonicals/canonical-site-nav.md` |
| Deploy procedures | `.claude/canonicals/canonical-deploy.md` |
| Cookie consent (PostHog) | `.claude/canonicals/canonical-cookies.md` |
| Roles | `.claude/ROLES.md` |
| Platform registry | `.claude/CLAUDE.md` §3 |

---

## 10. Standing Rules

- RC commits all changes with descriptive messages
- RC pushes to `origin/main` unless instructed otherwise
- TTMP is in maintenance mode — do not touch
- DVLP is curbed until Owner advises
- WLVLP is in maintenance mode after post-purchase flow completion
- All external links in dashboard context must open in new tab
- Dashboard page titles/subtitles must match the canonical pattern (`font-sora text-3xl font-extrabold text-white` + `text-white/55 text-[0.95rem]`)
- Phone inputs use canonical §10 normalization
- PostHog analytics is live across all apps — new pages are automatically tracked via cookie consent gate
- Build verification: `npx turbo build --filter=apps/tcvlp` after every change