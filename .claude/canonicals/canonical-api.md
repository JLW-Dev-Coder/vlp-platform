<!--
Status: Authoritative
Last updated: 2026-04-23
Owner: JLW (Principal Engineer review required for changes)
Scope: All 8 apps in the vlp-platform monorepo
Parent: canonical-app-blueprint.md
-->

# canonical-api.md

Master API endpoint registry for the VLP Worker (`apps/worker/src/index.js`).

Last updated: 2026-04-23
Total routes: ~196

---

## 1. Shared Endpoints (All Platforms)

### Authentication

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| GET | `/v1/auth/session` | Get current user session | Yes |
| POST | `/v1/auth/logout` | Logout and terminate session | Yes |
| GET | `/v1/auth/google/start` | Initiate Google OAuth flow | No |
| GET | `/v1/auth/google/callback` | Google OAuth callback | No |
| POST | `/v1/auth/magic-link/request` | Request magic link email | No |
| GET | `/v1/auth/magic-link/verify` | Verify magic link token | No |
| GET | `/v1/auth/handoff/exchange` | Exchange handoff token for session | No |
| GET | `/v1/auth/sso/oidc/start` | Initiate OIDC SSO flow | No |
| GET | `/v1/auth/sso/oidc/callback` | OIDC callback handler | No |
| GET | `/v1/auth/sso/saml/start` | Initiate SAML SSO flow | No |
| POST | `/v1/auth/sso/saml/acs` | SAML Assertion Consumer Service | No |
| GET | `/v1/auth/2fa/status/:account_id` | Check 2FA enrollment status | Yes |
| POST | `/v1/auth/2fa/enroll/init` | Start TOTP 2FA enrollment | Yes |
| POST | `/v1/auth/2fa/enroll/verify` | Verify 2FA enrollment | Yes |
| POST | `/v1/auth/2fa/challenge/verify` | Verify 2FA challenge code | Yes |
| POST | `/v1/auth/2fa/disable` | Disable 2FA for account | Yes |

### Accounts & Profiles

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| POST | `/v1/accounts` | Create new account | No |
| GET | `/v1/accounts/by-email/:email` | Look up account by email | No |
| GET | `/v1/accounts/:account_id` | Get account details | Yes |
| PATCH | `/v1/accounts/:account_id` | Update account information | Yes |
| DELETE | `/v1/accounts/:account_id` | Delete account | Yes |
| GET | `/v1/accounts/preferences/:account_id` | Get user preferences | Yes |
| PATCH | `/v1/accounts/preferences/:account_id` | Update user preferences | Yes |
| POST | `/v1/accounts/photo-upload-init` | Initialize photo upload | Yes |
| POST | `/v1/accounts/photo-upload-complete` | Complete photo upload | Yes |
| GET | `/v1/accounts/:account_id/status` | Get account status | Yes |
| GET | `/v1/profiles` | List professional profiles | No |
| POST | `/v1/profiles` | Create professional profile | Yes |
| GET | `/v1/profiles/public/:professional_id` | Get public profile | No |
| GET | `/v1/profiles/:professional_id` | Get profile details | Yes |
| PATCH | `/v1/profiles/:professional_id` | Update profile | Yes |

### Membership & Billing

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| POST | `/v1/memberships` | Create membership | Yes |
| GET | `/v1/memberships/by-account/:account_id` | Get account memberships | Yes |
| GET | `/v1/memberships/:membership_id` | Get membership details | Yes |
| PATCH | `/v1/memberships/:membership_id` | Update membership | Yes |
| GET | `/v1/billing/config` | Get billing configuration | No |
| GET | `/v1/pricing` | Get pricing information | No |
| POST | `/v1/billing/customers` | Create billing customer | Yes |
| GET | `/v1/billing/payment-methods/:account_id` | Get payment methods | Yes |
| POST | `/v1/billing/payment-methods/attach` | Attach payment method | Yes |
| POST | `/v1/billing/setup-intents` | Create Stripe setup intent | Yes |
| POST | `/v1/billing/payment-intents` | Create Stripe payment intent | Yes |
| POST | `/v1/billing/subscriptions` | Create subscription | Yes |
| PATCH | `/v1/billing/subscriptions/:membership_id` | Update subscription | Yes |
| POST | `/v1/billing/subscriptions/:membership_id/cancel` | Cancel subscription | Yes |
| POST | `/v1/billing/portal/sessions` | Create billing portal session | Yes |
| POST | `/v1/billing/tokens/purchase` | Purchase tokens via billing | Yes |
| GET | `/v1/billing/receipts/:account_id` | Get billing receipts | Yes |

### Checkout

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| POST | `/v1/checkout/session` | Create checkout session | Yes |
| POST | `/v1/checkout/sessions` | Create checkout sessions (batch) | Yes |
| GET | `/v1/checkout/status` | Get checkout status | Yes |

### Webhooks

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| POST | `/v1/webhooks/stripe` | Stripe webhook handler | Signature |
| POST | `/v1/webhooks/twilio` | Twilio webhook handler | No |
| POST | `/v1/webhooks/cal` | Cal.com webhook handler | Signature |

### Calendar & Bookings

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| GET | `/v1/cal/oauth/start` | Initiate Cal.com OAuth | Yes |
| GET | `/v1/cal/pro/oauth/start` | Initiate Cal.com Pro OAuth | Yes |
| GET | `/v1/cal/oauth/callback` | Cal.com OAuth callback | No |
| GET | `/cal/app/oauth/callback` | Cal.com app OAuth callback | No |
| GET | `/v1/cal/status` | Get Cal.com connection status | Yes |
| GET | `/v1/calcom/status` | Get Cal.com status | Yes |
| POST | `/v1/calcom/disconnect` | Disconnect Cal.com | Yes |
| GET | `/v1/calcom/bookings` | Get Cal.com bookings | Yes |
| GET | `/v1/calcom/stats` | Get Cal.com statistics | Yes |
| GET | `/v1/google/oauth/start` | Initiate Google Calendar OAuth | Yes |
| GET | `/v1/google/oauth/callback` | Google Calendar OAuth callback | No |
| GET | `/v1/google/status` | Get Google Calendar status | Yes |
| GET | `/v1/google/events` | Get Google Calendar events | Yes |
| GET | `/v1/calendar/events` | Get calendar events | Yes |
| POST | `/v1/bookings` | Create booking | Yes |
| GET | `/v1/bookings/by-account/:account_id` | Get bookings for account | Yes |
| GET | `/v1/bookings/by-professional/:professional_id` | Get professional bookings | Yes |
| GET | `/v1/bookings/:booking_id` | Get booking details | Yes |
| PATCH | `/v1/bookings/:booking_id` | Update booking | Yes |

### Support & Notifications

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| POST | `/v1/contact/submit` | Submit contact form | No |
| POST | `/v1/leads/chatbot` | Submit chatbot lead (anonymous) | No |
| POST | `/v1/support/tickets` | Create support ticket | Yes |
| GET | `/v1/support/tickets/by-account/:account_id` | Get account tickets | Yes |
| GET | `/v1/support/tickets/:ticket_id` | Get ticket details | Yes |
| PATCH | `/v1/support/tickets/:ticket_id` | Update ticket | Yes |
| POST | `/v1/support/messages` | Post support message | Yes |
| GET | `/v1/support/messages` | Get messages by ticket_id | Yes |
| POST | `/v1/notifications/in-app` | Create in-app notification | Yes |
| GET | `/v1/notifications/in-app` | Get in-app notifications (supports unreadOnly=1; returns unreadCount) | Yes |
| PATCH | `/v1/notifications/in-app/:notification_id` | Mark notification read | Yes |
| POST | `/v1/notifications/in-app/mark-all-read` | Mark all notifications read | Yes |
| GET | `/v1/notifications/preferences/:account_id` | Get notification prefs | Yes |
| PATCH | `/v1/notifications/preferences/:account_id` | Update notification prefs | Yes |
| POST | `/v1/notifications/sms/send` | Send SMS notification | Yes |

### Tokens

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| GET | `/v1/tokens/balance/:account_id` | Get token balance | Yes |
| POST | `/v1/tokens/spend` | Spend tokens | Yes |
| POST | `/v1/tokens/purchase` | Purchase tokens | Yes |
| GET | `/v1/tokens/pricing` | Get token pricing | No |
| GET | `/v1/tokens/usage/:account_id` | Get token usage history | Yes |
| POST | `/v1/tokens/consume` | Consume tokens | Yes |
| POST | `/v1/tokens/credit` | Credit tokens | Yes |

### Tools & Transcripts

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| POST | `/v1/tools/form2848` | Process Form 2848 | Yes |
| POST | `/v1/tools/2848/generate` | Generate Form 2848 | Yes |
| POST | `/v1/tools/transcript-parser` | Parse transcript | Yes |
| GET | `/v1/tools/transcript-parser/history/:account_id` | Transcript parser history | Yes |
| POST | `/v1/transcripts/upload` | Upload transcript | Yes |
| POST | `/v1/transcripts/jobs` | Create transcript job | Yes |
| GET | `/v1/transcripts/jobs/:job_id` | Get transcript job status | Yes |
| POST | `/v1/transcripts/preview` | Preview transcript | Yes |
| GET | `/v1/transcripts/reports` | Get transcript reports | Yes |
| GET | `/v1/transcripts/report-data` | Get report data | Yes |
| POST | `/v1/transcripts/report-link` | Create report link | Yes |
| GET | `/v1/transcripts/report` | Get report (public link) | No |
| GET | `/v1/transcripts/report/data` | Get report data (public) | No |
| POST | `/v1/transcripts/report-email` | Email transcript report | Yes |
| GET | `/v1/transcripts/purchases` | Get transcript purchases | Yes |
| GET | `/v1/pricing/transcripts` | Get transcript pricing | No |
| POST | `/v1/compliance/report-generate` | Generate compliance report | Yes |

### Affiliates & Referrals

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| POST | `/v1/affiliates/connect/onboard` | Onboard affiliate (Stripe Connect) | No |
| GET | `/v1/affiliates/connect/callback` | Affiliate OAuth callback | No |
| GET | `/v1/affiliates/:account_id` | Get affiliate details | Yes |
| GET | `/v1/affiliates/:account_id/events` | Get affiliate events | Yes |
| POST | `/v1/affiliates/payout/request` | Request affiliate payout | Yes |
| GET | `/v1/affiliates/payout/:payout_id` | Get payout details | Yes |
| GET | `/v1/ref/:code` | Get referral details | No |

### Inquiries

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| POST | `/v1/inquiries` | Create inquiry | Yes |
| GET | `/v1/inquiries` | Get inquiries | Yes |
| GET | `/v1/inquiries/:inquiry_id` | Get inquiry details | Yes |
| PATCH | `/v1/inquiries/:inquiry_id` | Update inquiry | Yes |
| POST | `/v1/inquiries/:inquiry_id/respond` | Respond to inquiry | Yes |

### Dashboard & Games

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| GET | `/v1/dashboard` | Get dashboard data | Yes |
| GET | `/v1/games/access` | Check game access | Yes |

### R2 Storage

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| GET | `/v1/r2/*` | Read from R2 storage | Yes |
| PUT | `/v1/r2/*` | Write to R2 storage | Yes |

### Admin (Operator Only)

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| POST | `/v1/admin/tokens/grant` | Grant tokens to user | Admin |
| GET | `/v1/admin/support/tickets` | List all support tickets | Admin |
| PATCH | `/v1/admin/support/tickets/:ticket_id` | Update ticket (admin) | Admin |
| GET | `/v1/admin/stats` | Get platform statistics | Admin |
| GET | `/v1/admin/accounts/:account_id` | Get account (admin) | Admin |
| GET | `/v1/admin/analytics/all` | Analytics across platforms | Admin |
| GET | `/v1/admin/analytics/:platform` | Platform analytics | Admin |
| GET | `/v1/analytics/posthog/repo/:zone` | PostHog-backed per-zone behavioral analytics (pageviews-by-path, signups, purchases, revenue, 3-step funnel). Requires `POSTHOG_PERSONAL_API_KEY` + `POSTHOG_PROJECT_ID` Worker secrets. Returns `collecting:true` with zeroed counts when PostHog has insufficient data. | Admin |
| GET | `/v1/admin/scale/workflow` | Scale workflow info | Admin |
| GET | `/v1/admin/scale/prospects/search` | Search prospects | Admin |
| GET | `/v1/admin/scale/prospects/:slug` | Get prospect details | Admin |
| GET | `/v1/admin/bookings` | List all bookings | Admin |

### Internal / Utility

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| GET | `/unsubscribe` | CAN-SPAM unsubscribe | No |
| POST | `/internal/backfill-canspam-footer` | Backfill CAN-SPAM footer | Internal key |
| POST | `/internal/backfill-asset-pages` | Backfill asset pages | Internal key |

---

## 2. VLP-Specific Endpoints

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| GET | `/v1/vlp/preferences/:account_id` | Get VLP preferences | Yes |
| PATCH | `/v1/vlp/preferences/:account_id` | Update VLP preferences | Yes |

---

## 3. TMP Endpoints (`/v1/tmp/*`)

| Method | Path | Purpose | Auth | Frontend |
|--------|------|---------|------|----------|
| GET | `/v1/tmp/directory` | Professional directory | No | TMP |
| GET | `/v1/tmp/pricing` | Pricing info | No | TMP |
| POST | `/v1/tmp/memberships/checkout` | Checkout membership | No | TMP |
| GET | `/v1/tmp/memberships/:account_id` | Membership status | Yes | TMP |
| GET | `/v1/tmp/dashboard` | TMP dashboard | Yes | TMP |
| GET | `/v1/tmp/monitoring/status` | Monitoring status | Yes | TMP |
| GET | `/v1/tmp/client-pool` | Available clients | Yes | TMP |
| POST | `/v1/tmp/inquiries` | Create TMP inquiry | Yes | TMP |
| POST | `/v1/tmp/client-pool/accept` | Accept client | Yes | TMP |
| POST | `/v1/tmp/compliance-records` | Create compliance record | Yes | TMP |
| GET | `/v1/tmp/compliance-records/:order_id` | Get compliance record | Yes | TMP |
| GET | `/v1/tmp/compliance-records/:order_id/report` | Compliance report | Yes | TMP |

---

## 4. TTTMP Endpoints (`/v1/tttmp/*`)

| Method | Path | Purpose | Auth | Frontend |
|--------|------|---------|------|----------|
| POST | `/v1/tttmp/auth/magic-link/request` | Request magic link | No | TTTMP |
| GET | `/v1/tttmp/auth/magic-link/verify` | Verify magic link | No | TTTMP |
| GET | `/v1/tttmp/auth/session` | Get session | Yes | TTTMP |
| POST | `/v1/tttmp/auth/logout` | Logout | Yes | TTTMP |
| POST | `/v1/tttmp/checkout/sessions` | Create checkout session | No | TTTMP |
| GET | `/v1/tttmp/checkout/status` | Checkout status + token credit | No | TTTMP |
| POST | `/v1/tttmp/support/tickets` | Create support ticket | Yes | TTTMP |
| GET | `/v1/tttmp/support/tickets/:ticket_id` | Get ticket | Yes | TTTMP |
| GET | `/v1/tttmp/tokens/balance` | Token balance | Yes | TTTMP |
| GET | `/v1/tttmp/health` | Health check | No | TTTMP |
| POST | `/v1/tttmp/vesperi/intake` | Vesperi game guide intake | No | TTTMP |
| GET | `/v1/tttmp/vesperi/clips/:filename` | Serve Vesperi video clips from R2 | No | TTTMP |
| GET | `/v1/tttmp/vesperi/unsubscribe` | Vesperi drip unsubscribe (HMAC-signed email link) | No | TTTMP |

---

## 5. DVLP Endpoints (`/v1/dvlp/*`)

| Method | Path | Purpose | Auth | Frontend |
|--------|------|---------|------|----------|
| GET | `/v1/dvlp/developers` | List developers | No | DVLP |
| GET | `/v1/dvlp/pricing` | Pricing info | No | DVLP |
| GET | `/v1/dvlp/onboarding` | Onboarding info | No | DVLP |
| POST | `/v1/dvlp/onboarding` | Submit onboarding | No | DVLP |
| PATCH | `/v1/dvlp/onboarding` | Update onboarding | Yes | DVLP |
| GET | `/v1/dvlp/onboarding/status` | Onboarding status | Yes | DVLP |
| GET | `/v1/dvlp/jobs` | List available jobs | No | DVLP |
| GET | `/v1/dvlp/reviews` | Get reviews | No | DVLP |
| POST | `/v1/dvlp/reviews` | Submit review | Yes | DVLP |
| POST | `/v1/dvlp/developer-match-intake` | Developer match intake | No | DVLP |
| POST | `/v1/dvlp/stripe/checkout` | Stripe checkout | Yes | DVLP |
| GET | `/v1/dvlp/stripe/session-status` | Stripe session status | Yes | DVLP |
| POST | `/v1/dvlp/stripe/webhook` | Stripe webhook | Signature | DVLP |
| POST | `/v1/dvlp/operator/analytics` | Post analytics | Operator | DVLP |
| GET | `/v1/dvlp/operator/submissions` | Get submissions | Operator | DVLP |
| GET | `/v1/dvlp/operator/developer` | Get developer | Operator | DVLP |
| PATCH | `/v1/dvlp/operator/developer` | Update developer | Operator | DVLP |
| GET | `/v1/dvlp/operator/developers` | List developers | Operator | DVLP |
| GET | `/v1/dvlp/operator/jobs` | List jobs | Operator | DVLP |
| POST | `/v1/dvlp/operator/jobs` | Create job | Operator | DVLP |
| PATCH | `/v1/dvlp/operator/jobs/:job_id` | Update job | Operator | DVLP |
| POST | `/v1/dvlp/operator/post` | Post content | Operator | DVLP |
| POST | `/v1/dvlp/operator/messages` | Send message | Operator | DVLP |
| GET | `/v1/dvlp/operator/messages` | Get messages | Operator | DVLP |
| GET | `/v1/dvlp/operator/tickets` | Get tickets | Operator | DVLP |
| POST | `/v1/dvlp/operator/tickets/:ticket_id/reply` | Reply to ticket | Operator | DVLP |
| GET | `/v1/dvlp/operator/canned-responses` | Get canned responses | Operator | DVLP |
| POST | `/v1/dvlp/operator/canned-responses` | Create canned response | Operator | DVLP |
| PATCH | `/v1/dvlp/operator/canned-responses/:template_id` | Update canned response | Operator | DVLP |
| DELETE | `/v1/dvlp/operator/canned-responses/:template_id` | Delete canned response | Operator | DVLP |
| POST | `/v1/dvlp/operator/bulk-email` | Send bulk email | Operator | DVLP |

---

## 6. GVLP Endpoints (`/v1/gvlp/*`)

| Method | Path | Purpose | Auth | Frontend |
|--------|------|---------|------|----------|
| GET | `/v1/gvlp/config` | Game config | No | GVLP |
| POST | `/v1/gvlp/tokens/use` | Use game tokens | Yes | GVLP |
| GET | `/v1/gvlp/tokens/balance` | Token balance | Yes | GVLP |
| POST | `/v1/gvlp/stripe/checkout` | Stripe checkout | Yes | GVLP |
| POST | `/v1/gvlp/stripe/webhook` | Stripe webhook | Signature | GVLP |
| GET | `/v1/gvlp/operator/:account_id` | Operator data | Operator | GVLP |
| PATCH | `/v1/gvlp/operator/:account_id` | Update operator data | Operator | GVLP |
| GET | `/v1/gvlp/operator/:account_id/plays` | Game plays | Operator | GVLP |

---

## 7. TCVLP Endpoints (`/v1/tcvlp/*`)

| Method | Path | Purpose | Auth | Frontend |
|--------|------|---------|------|----------|
| POST | `/v1/tcvlp/onboarding` | Submit onboarding | No | TCVLP |
| GET | `/v1/tcvlp/pro/:pro_id` | Get pro details | No | TCVLP |
| GET | `/v1/tcvlp/pro/by-slug/:slug` | Get pro by slug | No | TCVLP |
| GET | `/v1/tcvlp/mailing-address` | Get mailing address | No | TCVLP |
| POST | `/v1/tcvlp/transcript/upload` | Upload transcript | Yes | TCVLP |
| POST | `/v1/tcvlp/forms/843/generate` | Generate Form 843 | Yes | TCVLP |
| POST | `/v1/tcvlp/forms/843/submit` | Submit Form 843 | Yes | TCVLP |
| GET | `/v1/tcvlp/forms/843/:submission_id/download` | Download Form 843 | No (link) | TCVLP |
| POST | `/v1/tcvlp/gala/intake` | Submit Gala intake | No | TCVLP |
| GET | `/v1/tcvlp/gala/:filename` | Serve Gala video clip | No | TCVLP |
| GET | `/v1/tcvlp/videos/kennedy/:clipId` | Serve Kennedy sales-video clip from R2 (`tcvlp/videos/kennedy/{clipId}.mp4`) | No | TCVLP |
| — | (cron: Gala drip, 15:00 UTC) | 3-email welcome sequence to Gala intakes via Resend | Internal | TCVLP |

---

## 8. WLVLP Endpoints (`/v1/wlvlp/*`)

| Method | Path | Purpose | Auth | Frontend |
|--------|------|---------|------|----------|
| GET | `/v1/wlvlp/asset-pages/:slug` | Get asset page | No | WLVLP |
| POST | `/v1/wlvlp/site-requests` | Create site request | Yes | WLVLP |
| GET | `/v1/wlvlp/site-requests/:slug` | Get site request | Yes | WLVLP |
| GET | `/v1/wlvlp/custom-sites/:slug` | Get custom site | No | WLVLP |
| GET | `/v1/wlvlp/templates` | List templates | No | WLVLP |
| GET | `/v1/wlvlp/templates/:slug` | Get template | No | WLVLP |
| POST | `/v1/wlvlp/templates/:slug/vote` | Vote on template | Yes | WLVLP |
| POST | `/v1/wlvlp/templates/:slug/bid` | Bid on template | Yes | WLVLP |
| GET | `/v1/wlvlp/templates/:slug/bids` | Get template bids | Yes | WLVLP |
| POST | `/v1/wlvlp/checkout` | Create checkout | Yes | WLVLP |
| POST | `/v1/wlvlp/scratch` | Create scratch card | Yes | WLVLP |
| POST | `/v1/wlvlp/scratch/:ticket_id/reveal` | Reveal scratch card | Yes | WLVLP |
| GET | `/v1/wlvlp/scratch/prizes/:account_id` | Get scratch prizes | Yes | WLVLP |
| GET | `/v1/wlvlp/buyer/:account_id` | Get buyer info | Yes | WLVLP |
| GET | `/v1/wlvlp/sites/by-account/:account_id` | Sites by account | Yes | WLVLP |
| PATCH | `/v1/wlvlp/config/:slug` | Update site config | Yes | WLVLP |
| PATCH | `/v1/wlvlp/sites/:slug/data` | Update site data | Yes | WLVLP |
| GET | `/v1/wlvlp/sites/:slug/data` | Get site data | Yes | WLVLP |
| POST | `/v1/wlvlp/sites/:slug/domain` | Setup custom domain | Yes | WLVLP |
| GET | `/v1/wlvlp/sites/expiring` | Get expiring sites | Admin | WLVLP |
| POST | `/v1/wlvlp/upload-logo` | Upload logo | Yes | WLVLP |
| POST | `/v1/wlvlp/stripe/webhook` | Stripe webhook | Signature | WLVLP |
| GET | `/v1/wlvlp/admin/trigger-site-gen` | Trigger site generation | Admin | WLVLP |
| POST | `/v1/wlvlp/admin/upload-prospects` | Upload prospects | Admin | WLVLP |
| GET | `/v1/wlvlp/admin/trigger-batch-gen` | Trigger batch generation | Admin | WLVLP |

---

## 9. Scale Endpoints (`/v1/scale/*`)

| Method | Path | Purpose | Auth | Frontend |
|--------|------|---------|------|----------|
| GET | `/v1/scale/dashboard` | Scale dashboard | Yes | VLP |
| GET | `/v1/scale/analytics` | Scale analytics | Yes | VLP |
| GET | `/v1/scale/youtube-analytics` | YouTube Data + Analytics API (public API always, OAuth analytics when connected) | Admin | VLP |
| GET | `/v1/scale/youtube-oauth/start` | Begin YouTube Analytics OAuth flow | Admin | VLP |
| GET | `/v1/scale/youtube-oauth/callback` | YouTube Analytics OAuth callback, persists tokens to KV | Admin (via state) | VLP |
| POST | `/v1/scale/youtube-oauth/disconnect` | Revoke stored YouTube Analytics OAuth tokens | Admin | VLP |
| GET | `/scale/asset-page/:slug` | Asset page (legacy path) | No | Public |
| POST | `/scale/init-send-state` | Initialize send state | Internal | Cron |
| GET | `/v1/scale/prospects/status` | Prospect status | Admin | VLP |
| GET | `/v1/scale/prospects/search` | Search prospects | Admin | VLP |
| GET | `/v1/scale/prospects/:slug` | Prospect details | Admin | VLP |
| POST | `/v1/scale/cron/find-emails` | Find emails (cron) | Internal | Cron |
| POST | `/v1/scale/cron/validate-emails` | Validate emails (cron) | Internal | Cron |
| POST | `/v1/scale/cron/wlvlp-enrich` | Enrich WLVLP data (cron) | Internal | Cron |
| POST | `/v1/wlvlp/cron/auction-settle` | Settle auctions (cron) | Internal | Cron |
| POST | `/v1/scale/cron/backfill-asset-pages` | Backfill asset pages (cron) | Internal | Cron |
| GET | `/v1/scale/asset/:slug` | Get asset page | No | Public |
| PUT | `/v1/scale/prospects/upload-source` | Upload prospect source | Admin | VLP |

---

## 10. Route Statistics

| Category | Count |
|----------|-------|
| GET routes | ~77 |
| POST routes | ~96 |
| PATCH routes | ~14 |
| PUT routes | ~2 |
| DELETE routes | ~1 |
| OPTIONS (CORS) | 1 (global preflight) |
| **Total** | **~193** |

| Auth Level | Count |
|------------|-------|
| Public (no auth) | ~40 |
| Authenticated (session) | ~120 |
| Operator/Admin | ~33 |

| Platform | Route Count |
|----------|------------|
| Shared/Core | ~105 |
| DVLP | ~31 |
| WLVLP | ~25 |
| Scale | ~14 |
| TMP | ~12 |
| TTTMP | ~10 |
| GVLP | ~8 |
| TCVLP | ~8 |
| VLP | ~2 |
