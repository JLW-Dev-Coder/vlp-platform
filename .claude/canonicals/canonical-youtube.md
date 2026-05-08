<!--
Status: Authoritative
Last updated: 2026-05-07
Owner: JLW (Principal Engineer review required for changes)
Scope: All YouTube channels operated by Virtual Launch Pro and its platforms
Parent: canonical-app-blueprint.md
-->

# canonical-youtube.md

Template and rules for YouTube channels operated by VLP platforms. Codifies the established pattern in use across CPVLP, TAVLP, TCVLP, TTTMP, and WLVLP, and extends it to TPP and any future platform channel.

A VLP YouTube channel is a hybrid surface: it hosts product walkthroughs, educational content, and (where applicable) training videos. It is moderated, comment-on, and integrated with each platform's email drip and landing-page funnel. Videos start at Private upload visibility and are flipped to Public or Unlisted after QA.

This canonical governs:

- Channel naming, handle, and ownership (§1)
- The standard 17-page CU documentation tree per channel (§2)
- Branding (avatar, banner) (§3)
- Channel description and Launch Kit content (§4)
- YouTube Studio settings — channel-level and upload defaults (§5)
- Community moderation (§6)
- Playlist structure (§7)
- Per-video metadata (§8)
- Upload workflow (§9)
- URL handoff back to embedding surfaces (§10)

---

## 1. Channel ownership and naming

### 1.1 Brand Account requirement

Channels MUST be owned by a Google Brand Account, not a personal Gmail. Brand Accounts allow multi-manager access, ownership transfer, and survive personnel changes. Personal-Gmail-owned channels are deprecated; if one exists, migrate before adding videos.

### 1.2 Channel name and handle

The channel name matches the platform under which it is created (e.g., "TaxClaim Pro" for TCVLP, "Tax Prep Pro" for TPP). Handle is lowercase, no spaces, matches the channel name (`@taxclaimpro`, `@taxpreppro`).

### 1.3 Host persona (optional)

Some platform channels feature a consistent AI host persona (e.g., Gala for TCVLP, Zuri for TPP). When a host persona is used:

- The persona is named in the channel's CU doc on the `Avatar` sub-page
- Per-video descriptions disclose the AI host (see §8.2)
- The host's voice and visual continuity across videos is locked in the platform's project instruction

---

## 2. Per-channel CU documentation tree

Every VLP YouTube channel has a 17-page tree under `YouTube` in the parent CU doc. The pattern is rigid — every channel uses the same structure, every page name uses the same format. The format is `{Platform Code} — YouTube {SubPage}`.

```
{Platform} — YouTube                          [parent stub, content typically empty]
├── {Platform} — YouTube Avatar               [host persona reference + HeyGen links]
├── {Platform} — YouTube Banner               [Canva design URLs for banner + icon]
├── {Platform} — YouTube Email Drip           [3-email welcome sequence triggered from platform CTA]
├── {Platform} — YouTube Launch Kit           [channel description, banner taglines, default video description, first 5 video scripts]
│   └── {Platform} — YouTube Landing Page     [per-clip avatar production spec — ONLY if channel uses an interactive landing page guided by the host persona]
├── {Platform} — YouTube Playlists            [live playlist IDs + URLs + descriptions]
├── {Platform} — YouTube Topics               [6-category content roadmap with video titles]
├── {Platform} — YouTube Upload Task          [repeatable upload workflow specific to this channel]
└── {Platform} — YouTube Settings             [parent stub, content typically empty]
    ├── Settings.Channel.Advanced Settings
    ├── Settings.Channel.Basic Info.Keywords
    ├── Settings.Channel Links
    ├── Settings.Community Moderation.Channel Guidelines
    ├── Settings.Community Moderation.Content Controls
    ├── Settings.Email
    ├── Settings.Upload Defaults.Advanced Settings
    └── Settings.Upload Defaults.Basic Info
```

The parent `{Platform} — YouTube` and `{Platform} — YouTube Settings` pages are intentionally empty (they exist only to hold sub-pages). Every other page must be populated.

A channel is considered "documented" only when all 17 pages exist and have content.

---

## 3. Branding

### 3.1 Brand palette

The channel's avatar and banner use the platform's locked brand palette as defined in the platform's `tailwind.config.ts`. Channel art may not introduce colors outside the platform palette.

### 3.2 Avatar

- 800×800 px, square. Rendered in a circular mask by YouTube — design assuming corner crop.
- PNG (preferred) or JPG.
- Legible at 48×48 px (smallest YouTube render size).
- Source file stored under the platform's brand asset folder. Filename: `{platform}-youtube-avatar-800.png`.
- Linked from the channel's `Avatar` CU sub-page (typically a HeyGen avatar reference if the channel uses an AI host).

### 3.3 Banner

- 2048×1152 px.
- Critical content inside centered 1546×423 mobile-safe rectangle.
- Under 6 MB, sRGB color space.
- Typographic-first; no photographic human faces unless the host persona's image is consistently used.
- Source file stored under the platform's brand asset folder. Filename: `{platform}-youtube-banner-2048x1152.png`.
- Linked from the channel's `Banner` CU sub-page (typically Canva design URLs).

---

## 4. Channel description and Launch Kit

### 4.1 Channel description

Goes in YouTube Studio → Customization → Basic info. 3–5 sentences naming what the channel covers, who it's for, and the platform URL. No sales language. No pricing. No affiliate codes. AI-host disclosure if applicable.

### 4.2 Banner tagline

Short phrase (under 12 words) that appears on the banner art. Reflects the channel's actual purpose. No "grow your firm" / "scale your business" hype.

### 4.3 Default video description template

Every video upload uses this template, with bracketed fields filled in per-video. Template content is captured on the channel's `Launch Kit` CU sub-page. Required elements:

- Video title line
- 1–2 sentence summary
- Primary platform CTA URL
- Disclaimer (educational content, not legal/tax advice — exact wording per platform compliance rules)
- 4–6 hashtags relevant to the platform's keyword set

### 4.4 First 5 video scripts

The Launch Kit CU sub-page documents the first 5 video scripts for the channel — used to seed the channel before topical depth is built out. Each script is 1–2 minutes (≈90–180 words). Naming format: `{PLATFORM} YT### - {Title}`.

---

## 5. YouTube Studio settings (channel-level)

Each setting is documented on its own CU sub-page so the configuration is auditable and reproducible.

### 5.1 Settings.Channel.Advanced Settings

- "No, set this channel as not made for kids"
- Linked Google Ads account (typically the VLP central ad account)
- Allow viewers to clip content
- Let YouTube enhance visual quality
- Let YouTube enhance audio quality
- Allow automatic dubbing
- Manually review dubs before publishing (review experimental languages only)

### 5.2 Settings.Channel.Basic Info.Keywords

Comma-separated channel-level keywords matching the platform's product domain. 6–10 keywords.

### 5.3 Settings.Channel Links

Up to 4 featured links surfaced on the channel banner. Standard set:
1. Platform homepage
2. Primary product CTA (host-guided flow if applicable)
3. Pricing
4. Contact / book review

### 5.4 Settings.Email

Public contact email for business inquiries. Default: `outreach@virtuallaunch.pro`.

### 5.5 Settings.Upload Defaults.Basic Info

**Default visibility: Private.** Videos go up Private, get QA'd, then flipped to Public or Unlisted at the per-video decision point. This is staging-then-flip, not Unlisted-by-default.

### 5.6 Settings.Upload Defaults.Advanced Settings

- Category: Education
- Title and description language: English (US)
- Video language: English (US)

---

## 6. Community moderation

### 6.1 Settings.Community Moderation.Channel Guidelines

Standard 4-line policy:
- Questions are welcome, but responses are not legal or tax advice (or platform-equivalent disclaimer)
- Be respectful. No harassment or hate speech.
- No sharing personal taxpayer / client / customer information in comments
- No solicitation or spam

### 6.2 Settings.Community Moderation.Content Controls

Blocked-words list. Standard entries:
- `refund guaranteed, guaranteed results, DM me, WhatsApp, telegram, pay me, send your SSN`

Plus platform-specific additions for the platform's vocabulary risk surface.

### 6.3 Comments policy

**Comments are ON by default**, moderated by the Channel Guidelines and the Content Controls blocked-words filter. This is not a per-video override — it's a channel-wide stance: VLP YouTube channels are conversational surfaces where qualified questions are welcome and unqualified spam is filtered.

A specific video may have comments disabled if its content does not invite discussion (e.g., a pure procedural training video inside an LMS context). Document the override in the channel's CU `Upload Task` sub-page.

---

## 7. Playlist structure

### 7.1 Topical playlists

Playlists are organized by topic, not by upload date. A typical channel has 5–7 topical playlists matching the 6-category content roadmap on the Topics sub-page.

### 7.2 Playlist privacy

Playlist privacy is independent from video privacy. Playlists are typically Public once they contain at least one Public video. A playlist of all-Private or all-Unlisted videos should match the most-restricted member's privacy.

### 7.3 Playlist documentation

Live playlists are catalogued on the channel's `Playlists` CU sub-page with: playlist name, playlist ID, Studio URL, public URL, 1-sentence description.

---

## 8. Per-video metadata

### 8.1 Title pattern

```
{PLATFORM} YT### - {Title}
```

Example: `TCVLP YT001 - Kwong v. US in 60 Seconds: Do You Qualify?`

`###` is a zero-padded 3-digit sequence number, channel-scoped (each channel has its own counter).

For training-course videos that need module/lesson encoding (e.g., the Tax Prep Pro Setup Guide), the title pattern extends to:

```
{COURSE_CODE} | M{NN}.L{N}: {Lesson Title}
```

Example: `TPPSG | M03.L2: Configuring the Intake Form`

This extended pattern is documented in the channel's CU `Upload Task` sub-page.

### 8.2 Description template

Filled in from the Launch Kit's default template (§4.3). Required elements per video:

- Video title line
- 1–2 sentence summary of what the video covers
- Primary platform CTA URL (e.g., `/gala` for TCVLP, the LMS URL for TPP)
- Educational disclaimer (exact wording per platform compliance)
- 4–6 hashtags

For AI-host channels, every description includes a one-line AI disclosure naming the host and source (HeyGen). Example: `Narrated by Zuri, an AI training avatar (HeyGen). Instruction sourced from Tax Prep Pro configuration documentation.`

### 8.3 Tags

Maximum 10 tags. Tags follow the platform's vocabulary lock. Forbidden cross-platform: any tag that misrepresents the channel's content or violates the platform's compliance rules.

### 8.4 Thumbnails

Custom thumbnail per video, 1280×720 px, < 2 MB. When custom thumbnails are not yet produced, the channel may rely on YouTube's auto-generated thumbnails as an interim measure — flag the gap in the channel's CU `Upload Task` sub-page so the thumbnail-set pass is queued as a follow-up.

### 8.5 End screens and cards

End screen on the last 5–20 seconds: next video in playlist, master playlist link. Cards optional, max 3.

---

## 9. Upload workflow

The repeatable upload pattern is documented on each channel's `Upload Task` CU sub-page. The standard sequence:

1. Generate or composite final video
2. Generate short version (9:16) if applicable
3. Generate thumbnail variants (or accept auto-thumb interim)
4. Upload to YouTube Studio with title + description + tags + playlists
5. Default visibility: Private (per §5.5)
6. QA: play in incognito, verify metadata, verify thumbnail
7. Flip visibility to Public or Unlisted per the per-video decision
8. Capture URL back into the channel's tracking system (CU task fields, embedding LMS, etc.)

For high-volume batch uploads (e.g., a 40-lesson training course), the channel may use the YouTube Data API instead of the Studio web UI. The API path is documented in `tools/youtube-upload/README.md` at the monorepo root and uses a Worker token-broker pattern to keep OAuth credentials centralized.

---

## 10. URL handoff to embedding surfaces

When videos are embedded into LMS or CMS surfaces (e.g., SuiteDash Video Blocks for training courses, marketing landing pages for product walkthroughs), the YouTube URL must be propagated back into the embedding surface.

Two paths:

| Path | When to use |
|---|---|
| Manual paste | Default for channels with low embedding volume or one-off uploads. |
| Programmatic via API + connector | When a recurring video-publishing pipeline justifies the automation cost. Documented as a per-platform skill under `apps/{platform}/.claude/skills/`. |

---

## 11. Self-check

Before declaring a channel "set up and ready for uploads":

- [ ] Channel is on a Google Brand Account
- [ ] Channel name and handle match §1.2
- [ ] Avatar and banner uploaded per §3
- [ ] Channel description applied per §4.1
- [ ] All 8 channel-level Settings sub-pages documented and applied per §5
- [ ] Channel Guidelines and Content Controls applied per §6
- [ ] At least the topical playlists from the channel's `Topics` sub-page exist (empty is fine)
- [ ] All 17 CU sub-pages exist and are populated (or explicitly marked as not applicable for this channel)

Before declaring a video "uploaded and live":

- [ ] Title matches §8.1 pattern
- [ ] Description matches §8.2 template
- [ ] Tags follow §8.3 rules
- [ ] Visibility correctly set (Private during QA, Public/Unlisted post-QA)
- [ ] Added to correct playlists
- [ ] URL captured back into the embedding surface or tracking system

---

## 12. Relationship to other canonicals

| Canonical | What lives there |
|---|---|
| `canonical-app-blueprint.md` | Parent canonical. Brand-token rules apply (§3.1). |
| `canonical-style.md` | Defines the platform color palette and typography that channel art adheres to. |
| `canonical-workflow.md` | The Upload Task CU sub-page is a workflow document. |
| `canonical-skill.md` | If programmatic URL handoff is implemented (§10), the script is a SKILL.md. |
| Platform's project instruction | Defines vocabulary lock, host persona, look-mapping. Per-video descriptions and tags must adhere. |

---

## 13. Decision log

| Date | Decision | Rationale |
|---|---|---|
| 2026-05-07 | Created canonical | Five VLP channels (CPVLP, TAVLP, TCVLP, TTTMP, WLVLP) had already adopted a consistent 17-page CU pattern. Authoring the canonical at the point of adding the sixth channel (TPP) prevents drift and gives future channels a single reference. |
| 2026-05-07 | Locked the 17-page CU sub-page tree (§2) | The pattern is already in production across five platforms. Codifying it makes onboarding new channels mechanical rather than improvisational. |
| 2026-05-07 | Default upload visibility = Private (§5.5) | Matches the staging-then-flip pattern in use across all five existing channels. Videos go up Private for QA, get flipped after review. Unlisted-by-default would skip the QA gate. |
| 2026-05-07 | Comments on with moderation (§6.3) | The existing five channels have Channel Guidelines + Content Controls actively configured. Comments-off-by-default would discard the moderation work and would be inconsistent with the established stance that VLP channels are conversational surfaces. |
| 2026-05-07 | Brand Account ownership mandatory (§1.1) | Personal-Gmail channels are operationally fragile. Brand Accounts allow multi-manager access. |
| 2026-05-07 | Title pattern extension for course/training channels (§8.1) | TPP's training course needs module/lesson encoding for alphabetical sort in YouTube Studio. The standard `YT###` pattern doesn't carry that information. The extended `M{NN}.L{N}` pattern is documented as a per-channel option, applied via the channel's Upload Task sub-page. |

Append-only. Do not rewrite prior entries.

---

## Lessons Learned (Tax Prep Pro rollout, 2026-05-07)

These are traps from the TPP YouTube channel rollout. Read before starting the next Zuri training course or any new VLP YouTube channel.

### 1. Module numbering = phase numbering. No exceptions.

There is **one** correct mapping for any phase-based course: `Module N + 1 = Phase N` for phases 1–8, with Module 1 = Welcome and Module 10 = Course Closer. Do not invent a "teaching order" that puts a phase out of numeric sequence (e.g., E-Sign in module slot 9 because it's "cross-cutting"). The LMS, the CU lesson tree, the YouTube manifest, the YouTube video titles, and the YouTube playlists must all use the same module-to-phase mapping.

The TPP rollout shipped with E-Sign (Phase 6) in YouTube module slot 9 because the canonical author rationalized "E-Sign is taught last because cross-cutting." The LMS and CU lesson tree used standard phase order. The disagreement was caught only after 40 videos were uploaded, requiring a re-title pass on 12 videos and 3 playlist renames.

**Rule:** Before authoring a manifest, audit any other surface (LMS, CU lesson tree, project instruction) where module numbers already exist. Match them. Don't override based on pedagogical preference — pedagogical sequencing is a *playback order* concern (which a master playlist or LMS course-flow setting can express), not a *module numbering* concern.

### 2. Check for existing OAuth integrations before authoring a new token broker.

Phase 2 of the TPP rollout authored a new Worker route (`POST /v1/youtube/access-token`) that read three new secrets (`YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`, `YOUTUBE_REFRESH_TOKEN`) and brokered tokens via Google's OAuth refresh-token grant. The Worker already had a working YouTube OAuth integration for SCALE features at `apps/worker/src/index.js:793` (`getFreshYouTubeOAuthToken(env)` reading from `ENRICHMENT_KV` key `youtube:oauth:tokens`).

The parallel route returned `missing_secrets` at runtime through three deploy cycles and a credential rotation. Root cause was never diagnosed. Phase 2.4 pivoted to call the existing helper instead. The orphaned secrets were deleted.

**Rule:** Before authoring a Worker route that reads secrets matching `*_CLIENT_ID`, `*_CLIENT_SECRET`, `*_REFRESH_TOKEN`, or any OAuth-shaped names, run:

```powershell
Select-String -Path apps\worker\src\index.js -Pattern "{provider}_OAUTH|{provider}_CLIENT|getFresh{Provider}OAuthToken"
```

If anything matches, the integration likely exists already. Reuse it.

### 3. Never include secret values in any artifact, prompt, report, or chat message.

Two credential leaks occurred during the TPP rollout. First when Owner pasted client_id/client_secret/refresh_token in chat to ask RC for help. Second when RC echoed the same values back as paste-bait inside instructions. Both required full credential rotation (Google OAuth client revocation + new client + new refresh token + re-seeding 3 Worker secrets). Cumulative cost: ~30 minutes plus the cognitive load of two rotation cycles.

**Rule (hard):** No secret values appear in any RC prompt, RC report, chat message, or artifact — ever. Not as examples, not as paste targets, not as "here's what to put in." Secrets are referenced by name only. When a value needs to land somewhere, the instruction is "run `wrangler secret put X` and paste the value at the prompt" — never include the value itself. If RC ever has a secret in context (because a tool returned it), RC's job is to flag "rotate this immediately" — not to echo it.

### 4. YouTube quota is real. Default is ~6 uploads/day.

Default Google Cloud quota for YouTube Data API v3 is 10,000 units/day. Each `videos.insert` call costs 1,600 units. That's ~6 uploads/day on a fresh project. For a 40-video course, that's a 7-day rolling cadence unless a quota increase is requested.

The TPP rollout got lucky on its second upload run — quota increase was not requested, but the run completed all 40 in one session anyway (Google may have had a higher silent default, or the project had pre-existing quota allocation).

**Rule:** Before the first upload run for a course of 10+ videos, either (a) request a quota increase from Google Cloud Console (APIs & Services → Quotas → search "youtube" → request increase to ~70,000/day citing legitimate business use; usually granted in 1–2 business days), OR (b) explicitly accept the rolling cadence in the canonical. Don't go in blind.

### 5. OAuth scope additions require user re-consent.

Phase 2.5 added `https://www.googleapis.com/auth/youtube.upload` to the SCALE OAuth integration's scope list. The Worker redeployed in seconds. The KV-stored token did NOT auto-refresh with the new scope — Owner had to manually visit the SCALE OAuth init endpoint, click through Google's consent screen showing the now-three scopes, and Allow.

The Disconnect button on `https://virtuallaunch.pro/scale?tab=youtube` did not properly clear state during this debugging, requiring RC to add a cache-invalidation fix in a subsequent deploy.

**Rule:** When adding an OAuth scope to an existing integration:
- Deploy the scope addition first
- Tell Owner to visit the auth-init URL directly (e.g., `https://api.virtuallaunch.pro/v1/scale/youtube-oauth/auth-init`) — this forces re-consent regardless of Disconnect button state
- Verify the Google consent screen shows ALL the new scopes before Owner clicks Allow
- Confirm Owner is signing in as the correct Google account (the one that owns the target Brand Account / channel)
- After Owner re-consents, KV record is overwritten with the new-scope token; existing reads under prior scopes continue working (additive)

### 6. Updating canonical/role/contract files: read before replace.

A separate session (ROLES.md edit on 2026-05-06) demonstrated this trap: Principal authored "replace entire file with: ..." instructions for `.claude/ROLES.md` without first asking RC to dump the current content. RC executed literally and silently dropped the existing "Brevity rule (global, all roles)" section. Caught only when RC noticed a line-count mismatch and flagged.

Same risk in YouTube canonical edits. The canonical is long; full rewrites lose sections.

**Rule:** When updating an existing canonical, role, or contract file:
- (a) Have RC paste the current file content first, OR
- (b) Use targeted `str_replace`-style edits that add without nuking, OR
- (c) Author a "preserve all existing content + append THIS new section" instruction with the new section called out explicitly

Never author "replace entire file with: ..." for any file with significant existing content.

### 7. CU page numbering audits before bulk LMS work.

The TPP LMS lesson tree had three modules (M07, M08, M09) where the parent page had the correct title but the lesson sub-pages inside used the wrong module prefix (e.g., `LMS 1_Module 6_Lesson 6.1` titled inside `LMS 1_Module 7 — Phase 6 — E-Sign`). The internal numbering of script content also drifted (`Module:` field said "Module 9 — Phase 6" when the parent was Module 7). Cleanup required rewriting 15 CU pages.

The lesson sub-page titling was inherited from a template duplication step that didn't update child references. RC's connector calls don't auto-rename children.

**Rule:** Before propagating URLs or doing any bulk LMS write operation, run a sanity scan over the lesson tree:

```javascript
const pages = await clickup_list_document_pages({ document_id, max_page_depth: -1 });
// For each module, verify: parent title module number === all child titles' module prefix
```

Fix mismatches before the bulk operation runs. Otherwise the bulk operation propagates against incorrect labels.
