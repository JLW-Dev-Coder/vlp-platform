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
