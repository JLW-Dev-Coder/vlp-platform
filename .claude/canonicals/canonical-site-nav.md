# canonical-site-nav.md — VLP Ecosystem Site Navigation

Last updated: 2026-04-14

---

## Purpose

Defines the standard navigation structure for all 8 VLP platform frontends. Every platform uses the same layout skeleton. Platform-specific items are marked with their platform code. Items without a code appear on every platform.

Implementation: shared components in `packages/member-ui` driven by `PlatformConfig`. Each app passes its config (platform name, theme color, nav items, sidebar items). The components render accordingly.

---

## 1. Marketing Site (Public Pages)

### Header

Primary nav (horizontal, left-aligned after logo):

| Item | Path | Notes |
|------|------|-------|
| About | /about | Why [Platform Name] exists |
| Features | /features | Platform-specific feature list |
| Pricing | /pricing | Tiers, token packs, or one-time pricing |
| How It Works | /how-it-works | Step-by-step workflow |
| Contact | /contact | Talk to the team or start intake |
| Reviews | /reviews | Public review cards (powered by unified submissions) |
| Resources | — | Opens mega menu (see below) |

Right-aligned actions:

| Item | Type | Notes |
|------|------|-------|
| Log In | Text link | Routes to /sign-in |
| [CTA] | Primary button | Platform-specific free magnet (e.g., "Free Code Lookup" for TTMP, "Free Site Preview" for WLVLP) |

### Resources Mega Menu

Opens on hover/click of "Resources" nav item. Three content columns plus a CTA column.

**Column 1 — DISCOVER**

| Item | Description | Path |
|------|-------------|------|
| About | Why [Platform Name] exists | /about |
| Contact | Talk to our team or start intake | /contact |
| [Resource Guide] | Platform-specific guide or resource | varies |

**Column 2 — EXPLORE**

| Item | Path |
|------|------|
| Features | /features |
| How It Works | /how-it-works |
| Pricing | /pricing |
| Help Center | /support |
| [Asset] | Platform-specific (e.g., /tools/code-lookup for TTMP) |

**Column 3 — TOOLS & EXTRAS**

Up to 4 platform-specific items. Examples:

| Platform | Items |
|----------|-------|
| TTMP | Free Code Lookup, Sample Report, Transcript Guide, API Docs |
| WLVLP | Template Gallery, Before/After Preview, Site Hosting FAQ, Design Tips |
| TMP | IRS Payment Calculator, Directory Search, Tax Pro Guide, Compliance Checklist |
| TCVLP | Form 843 Explainer, Penalty Calculator, Case Examples, Filing Guide |
| TTTMP | Game Demo, IRS Form Guide, Code Quiz, Study Tools |
| DVLP | Portfolio Examples, Hiring Guide, Skill Matcher, Rate Calculator |
| GVLP | Game Previews, Leaderboards, Achievement Guide, Tournament Rules |
| VLP | Platform Overview, Integration Guide, API Docs, Partner Program |

**Column 4 — CTA**

| Element | Notes |
|---------|-------|
| [Contextual text] | Platform-specific hook (e.g., TTMP: "Need human review before a transcript issue becomes a client fire drill?") |
| Free Guide | Link to the platform's primary free magnet |
| Log In | Button, routes to /sign-in |

### Footer

Four columns:

**Column 1 — Brand**

| Element | Notes |
|---------|-------|
| Logo/Icon | Platform icon |
| Platform Name | e.g., "Transcript Tax Monitor Pro" |
| Tagline | Two-word descriptor on second line (e.g., "Transcript Automation") |
| Summary | One sentence describing the platform |
| CTA link | e.g., "Generate a report" or "View sample report" |

**Column 2 — Links**

| Item | Path |
|------|------|
| About | /about |
| Contact | /contact |
| Features | /features |
| How It Works | /how-it-works |
| Pricing | /pricing |
| Sign In | /sign-in |

**Column 3 — Resources**

| Item | Notes |
|------|-------|
| Free Guide | Platform-specific magnet |
| Affiliate Program | /affiliate |
| [Cross-platform link 1] | e.g., "Tax Monitor Pro" linking to taxmonitor.pro |
| [Cross-platform link 2] | e.g., "Tax Tools Arcade" linking to taxtools.taxmonitor.pro |
| [Cross-platform link 3] | e.g., "Transcript Automation" linking to transcript.taxmonitor.pro |

**Column 4 — Legal**

| Item | Path |
|------|------|
| Privacy | /legal/privacy |
| Refund | /legal/refund |
| Terms | /legal/terms |

---

## 2. App (Authenticated Dashboard)

### Topbar

Fixed at top of authenticated pages. Contains:

| Element | Position | Notes |
|---------|----------|-------|
| Platform logo + name | Left | Links to dashboard home |
| Help | Right (icon) | Opens help center or support page |
| Notifications | Right (icon) | Bell icon with unread count badge |
| Avatar | Right | Dropdown with: Account, Profile, Sign Out |

### Sidebar

Collapsible left sidebar. Three sections with headers.

**WORKSPACE** (platform-specific items shown per platform):

| Item | Platforms | Path |
|------|-----------|------|
| Dashboard | ALL | /dashboard |
| Booking Analytics | VLP | /dashboard/bookings |
| Calendar | VLP (includes Scheduling) | /dashboard/calendar |
| Client Pool | VLP | /dashboard/clients |
| Discounts / Entitlements | TMP | /dashboard/discounts |
| Directory Profile | DVLP, VLP | /dashboard/profile/directory |
| Premium Domain Hosting | WLVLP | /dashboard/hosting |
| Game Access | GVLP | /dashboard/games |
| Game Analytics | TTTMP | /dashboard/game-analytics |
| Job Matching Access | DVLP | /dashboard/jobs |
| Taxpayer Intake | TMP | /dashboard/intake |
| Messaging | TMP, VLP | /dashboard/messages |
| Parser | TTMP | /dashboard/parser |
| Reports | ALL | /dashboard/reports |
| Tax Monitoring | TMP | /dashboard/monitoring |
| Voting Analytics | WLVLP | /dashboard/voting |
| White-Labeled Hosted Site | TCVLP, WLVLP | /dashboard/sites |

**EARNINGS**

| Item | Platforms | Path |
|------|-----------|------|
| Affiliate | ALL | /dashboard/affiliate |
| Bidding | WLVLP | /dashboard/bidding |
| Winning | WLVLP | /dashboard/winning |

**SETTINGS**

| Item | Platforms | Path |
|------|-----------|------|
| Account | ALL | /dashboard/account |
| Profile | ALL | /dashboard/profile |
| Support | ALL | /dashboard/support |
| Usage | ALL | /dashboard/usage |

---

## 3. PlatformConfig Shape (for member-ui)

Each app provides a config object that drives the shared nav components:

```typescript
interface SiteNavConfig {
  platform: string;                    // "ttmp", "vlp", etc.
  platformName: string;                // "Transcript Tax Monitor Pro"
  tagline: string;                     // "Transcript Automation"
  summary: string;                     // One-line platform description
  themeColor: string;                  // "#14b8a6"
  ctaLabel: string;                    // "Free Code Lookup"
  ctaPath: string;                     // "/tools/code-lookup"
  megaMenu: {
    discover: Array<{ label: string; description: string; path: string }>;
    explore: Array<{ label: string; path: string }>;
    toolsExtras: Array<{ label: string; path: string }>;
    ctaText: string;                   // Hook text for the CTA column
    ctaMagnetLabel: string;            // "Free Guide"
    ctaMagnetPath: string;             // "/resources/guide"
  };
  footerResources: Array<{ label: string; href: string }>;
  sidebarItems: {
    workspace: Array<{ label: string; path: string; icon: string }>;
    earnings: Array<{ label: string; path: string; icon: string }>;
  };
}
```

Components read this config and render. No hardcoded platform values in shared code.

---

## 4. Implementation Notes

- Shared components live in `packages/member-ui/src/components/`
- Each app imports and wraps with its own config
- The mega menu should be accessible (keyboard navigable, closes on Escape)
- Mobile: header collapses to hamburger menu, sidebar becomes a drawer
- Active nav item highlighted with platform's theme color
- Footer is identical structure across all platforms, only content differs via config