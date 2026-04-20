# WLVLP QA Checklist

Pre-launch end-to-end manual QA for Website Lotto (websitelotto.virtuallaunch.pro).

Generated from audit of frontend pages, sidebar navSections, and Worker `/v1/wlvlp/*` routes on 2026-04-20. Cross-referenced against `.claude/canonicals/canonical-feature-matrix.md` (WLVLP section) and `.claude/canonicals/canonical-api.md` §8.

Legend for **Status**:
- **Live** — page + endpoint present, feature operational
- **Page exists but untested** — page built, needs manual verification
- **Page missing** — expected page not found
- **Endpoint missing** — backend handler not in Worker
- **Stub only** — placeholder UI, no real logic

---

## Marketing Site

### Flow 1: Landing page / template gallery
- **URL/Endpoint:** `/` (also GET `/v1/wlvlp/templates`)
- **Auth required:** No
- **Expected behavior:** Shows 210+ template cards with filter/sort; each card shows price, status (available/sold), vote/bid counts. Template API response unwraps correctly (fixed in `ae870cb`).
- **Status:** Live
- **Blockers:** None

### Flow 2: Template detail page
- **URL/Endpoint:** `/sites/[slug]` (GET `/v1/wlvlp/templates/:slug`)
- **Auth required:** No (view); Yes (vote/bid)
- **Expected behavior:** Static page for each of 211 templates. Shows preview, price, vote/bid UI. Vote and Bid require sign-in.
- **Status:** Live
- **Blockers:** None

### Flow 3: Marketing navigation (header + mega menu + footer)
- **URL/Endpoint:** `/about`, `/contact`, `/features`, `/how-it-works`, `/pricing`, `/support`, `/help`, `/reviews`, `/affiliate`
- **Auth required:** No
- **Expected behavior:** All marketing pages render; mega menu links from `wlvlpConfig.marketing.megaMenu` resolve; footer resource/legal links work.
- **Status:** Page exists but untested
- **Blockers:** None

### Flow 4: Legal pages
- **URL/Endpoint:** `/legal/privacy`, `/legal/refund`, `/legal/terms`
- **Auth required:** No
- **Expected behavior:** Shared LegalPageLayout renders with `businessInfo` = Lenore, Inc.
- **Status:** Live
- **Blockers:** None

---

## Authentication

### Flow 5: Sign in (Google OAuth + Magic Link)
- **URL/Endpoint:** `/sign-in`
- **Auth required:** No
- **Expected behavior:** Sign-in page offers Google OAuth + Magic Link. On success sets `vlp_session` HttpOnly cookie and redirects to `/dashboard`.
- **Status:** Page exists but untested
- **Blockers:** None

### Flow 6: Onboarding
- **URL/Endpoint:** `/onboarding`
- **Auth required:** Yes (AuthGuard)
- **Expected behavior:** First-time account setup; uses AuthGuard session render-prop to access `account_id`.
- **Status:** Page exists but untested
- **Blockers:** None

### Flow 7: Lead capture (`/launch`)
- **URL/Endpoint:** `/launch` (POST `/v1/wlvlp/leads`)
- **Auth required:** No
- **Expected behavior:** Captures lead with marketing opt-in checkbox (added in `4da7d3f`). Triggers WLVLP 3-email welcome drip (`af21486`).
- **Status:** Live
- **Blockers:** None — note: `POST /v1/wlvlp/leads` is in Worker but NOT documented in canonical-api.md §8. Add to canonical.

---

## Voting

### Flow 8: Vote on template (cast)
- **URL/Endpoint:** POST `/v1/wlvlp/templates/:slug/vote` (called from `/sites/[slug]`)
- **Auth required:** Yes
- **Expected behavior:** Authenticated user can vote on a template. Stored at `wlvlp/votes/{slug}/{id}.json`. Vote count on template page increments.
- **Status:** Live
- **Blockers:** None

### Flow 9: Voting dashboard (view own votes)
- **URL/Endpoint:** `/dashboard/voting` (GET `/v1/wlvlp/votes/by-account/:account_id`)
- **Auth required:** Yes
- **Expected behavior:** Lists all templates the current user has voted on.
- **Status:** Page exists but untested
- **Blockers:** None — note: `GET /v1/wlvlp/votes/by-account/:account_id` is in Worker but NOT in canonical-api.md §8. Add to canonical.

---

## Bidding

### Flow 10: Place bid
- **URL/Endpoint:** POST `/v1/wlvlp/templates/:slug/bid` (called from `/sites/[slug]`)
- **Auth required:** Yes
- **Expected behavior:** Authenticated user places a bid amount. Stored at `wlvlp/bids/{slug}/{id}.json`.
- **Status:** Live
- **Blockers:** None

### Flow 11: View bids on a template
- **URL/Endpoint:** GET `/v1/wlvlp/templates/:slug/bids`
- **Auth required:** Yes
- **Expected behavior:** Returns bid history for a template.
- **Status:** Live
- **Blockers:** None

### Flow 12: Bidding dashboard (view own bids + auction settlement)
- **URL/Endpoint:** `/dashboard/bidding` (GET `/v1/wlvlp/bids/by-account/:account_id`); cron `/v1/wlvlp/cron/auction-settle`
- **Auth required:** Yes
- **Expected behavior:** Lists user's active bids. Auction settle cron awards winning bids.
- **Status:** Page exists but untested
- **Blockers:** None — note: `GET /v1/wlvlp/bids/by-account/:account_id` is in Worker but NOT in canonical-api.md §8. Add to canonical.

---

## Purchasing

### Flow 13: Checkout (buy template directly)
- **URL/Endpoint:** POST `/v1/wlvlp/checkout` (triggered from `/sites/[slug]`)
- **Auth required:** Yes
- **Expected behavior:** Creates Stripe Checkout Session. Pricing from `lib/pricing.ts`: Standard $249, Premium $399 (one-time, dynamic — no hardcoded price_ IDs in frontend). Redirects to Stripe hosted checkout.
- **Status:** Live
- **Blockers:** None

### Flow 14: Stripe webhook → purchase activation
- **URL/Endpoint:** POST `/v1/wlvlp/stripe/webhook`
- **Auth required:** Signature verification
- **Expected behavior:** On `checkout.session.completed`: creates/reconciles account (anonymous → by email), writes receipt to R2, activates template at `wlvlp/sites/{slug}.json`, updates `wlvlp_templates` status → `sold`, inserts `wlvlp_purchases` row, writes notification.
- **Status:** Live
- **Blockers:** None

### Flow 15: Purchase success
- **URL/Endpoint:** `/purchase-success` and `/success`
- **Auth required:** No
- **Expected behavior:** Confirmation page after Stripe redirect.
- **Status:** Page exists but untested
- **Blockers:** Two success pages exist (`/purchase-success` and `/success`) — verify which Stripe redirects to and whether both are needed.

---

## Scratch Card

### Flow 16: Scratch page (issue ticket)
- **URL/Endpoint:** `/scratch` (POST `/v1/wlvlp/scratch`)
- **Auth required:** Yes (AuthGuard)
- **Expected behavior:** Authenticated user can request a scratch ticket. Ticket stored at `wlvlp/scratch/{id}.json`.
- **Status:** Live
- **Blockers:** None

### Flow 17: Reveal scratch card
- **URL/Endpoint:** POST `/v1/wlvlp/scratch/:ticket_id/reveal`
- **Auth required:** Yes
- **Expected behavior:** Reveals prize on ticket (discount code or free template).
- **Status:** Live
- **Blockers:** None

### Flow 18: View won prizes
- **URL/Endpoint:** `/dashboard/winning` (GET `/v1/wlvlp/scratch/prizes/:account_id`)
- **Auth required:** Yes
- **Expected behavior:** Lists all scratch prizes won by current user.
- **Status:** Page exists but untested
- **Blockers:** None

---

## Site Management

### Flow 19: My Sites (list purchased templates)
- **URL/Endpoint:** `/dashboard/sites` (GET `/v1/wlvlp/sites/by-account/:account_id`)
- **Auth required:** Yes
- **Expected behavior:** Lists all templates the current user has purchased.
- **Status:** Live
- **Blockers:** None

### Flow 20: Site editor (edit content/brand/contact)
- **URL/Endpoint:** `/dashboard/sites/[slug]/edit` (PATCH/GET `/v1/wlvlp/sites/:slug/data`, PATCH `/v1/wlvlp/config/:slug`, POST `/v1/wlvlp/upload-logo`)
- **Auth required:** Yes
- **Expected behavior:** Schema-based field editor. Edits persist to `wlvlp/sites/{slug}/customizations.json`. Logo upload goes to R2.
- **Status:** Live
- **Blockers:** None

### Flow 21: Custom domain + hosting
- **URL/Endpoint:** `/dashboard/hosting` (POST `/v1/wlvlp/sites/:slug/domain`)
- **Auth required:** Yes
- **Expected behavior:** User configures custom domain for purchased site. Hosting expiry tracked in `wlvlp_purchases`. Expiring-sites cron: GET `/v1/wlvlp/sites/expiring`.
- **Status:** Live
- **Blockers:** None

---

## Dashboard Sidebar

Cross-reference of sidebar navSections from `lib/platform-config.ts` (13 items). All 13 resolve to existing pages — no mismatches.

### Flow 22: WORKSPACE section
- **URL/Endpoint:** `/dashboard`, `/dashboard/sites`, `/dashboard/hosting`, `/dashboard/voting`, `/` (Templates), `/scratch`
- **Auth required:** Yes (except `/` and `/scratch` which use AuthGuard for gated actions)
- **Expected behavior:** All 6 links navigate to live pages. Active-state highlighting on current page.
- **Status:** Live
- **Blockers:** None

### Flow 23: EARNINGS section
- **URL/Endpoint:** `/dashboard/affiliate`, `/dashboard/bidding`, `/dashboard/winning`
- **Auth required:** Yes
- **Expected behavior:** Affiliate dashboard (Stripe Connect 20% commission), bidding history, scratch prizes won.
- **Status:** Page exists but untested
- **Blockers:** None

### Flow 24: SETTINGS section
- **URL/Endpoint:** `/dashboard/account`, `/dashboard/profile`, `/dashboard/support`, `/dashboard/usage`
- **Auth required:** Yes
- **Expected behavior:** Account (email/security), profile, support (Cal.com booking), usage metrics.
- **Status:** Page exists but untested
- **Blockers:** None

### Flow 25: Extra dashboard pages (tabs, not sidebar)
- **URL/Endpoint:** `/dashboard/brand`, `/dashboard/contact`, `/dashboard/content`, `/dashboard/subscription`
- **Auth required:** Yes
- **Expected behavior:** These pages exist but are not in the sidebar — verify they are reachable as tabs within `/dashboard` or via the site editor. Canonical-feature-matrix §4 flags `/dashboard/plan` as 🟡 because `/dashboard/subscription` likely fills that role but path differs.
- **Status:** Page exists but untested
- **Blockers:** Verify tab-linking from `/dashboard` to these sub-pages works. Consider whether `/dashboard/subscription` should be renamed to `/dashboard/plan` to match canonical.

### Flow 26: Admin surfaces
- **URL/Endpoint:** `/admin/upload` (POST `/v1/wlvlp/admin/upload-prospects`, GET `/v1/wlvlp/admin/trigger-site-gen`, GET `/v1/wlvlp/admin/trigger-batch-gen`)
- **Auth required:** Admin
- **Expected behavior:** Admin-only prospect upload and site-generation triggers.
- **Status:** Page exists but untested
- **Blockers:** None

---

## Audit findings summary

- **Sidebar ↔ pages:** All 13 navSections items resolve to existing pages. No fixes needed.
- **Worker routes in canonical-api.md §8:** 25 documented. All present in Worker.
- **Worker routes NOT in canonical:** 3 undocumented routes live in Worker —
  - `POST /v1/wlvlp/leads`
  - `GET /v1/wlvlp/bids/by-account/:account_id`
  - `GET /v1/wlvlp/votes/by-account/:account_id`
  Recommendation: add to canonical-api.md §8 (separate follow-up).
- **Stripe:** No hardcoded `price_` IDs in WLVLP frontend — checkout uses dynamic pricing from `lib/pricing.ts`. Safe.
- **Feature matrix status:** All 5 WLVLP features (Bidding, Hosting, Scratcher, Voting, Hosted Website) are `live` in canonical-feature-matrix.md and all have matching frontend pages + Worker endpoints.
