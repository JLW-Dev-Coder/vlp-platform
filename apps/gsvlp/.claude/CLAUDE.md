# CLAUDE.md — GSVLP (Growth Setter Pro)

## Identity
- **Platform:** Growth Setter Pro (GSVLP)
- **Domain:** growthsetters.virtuallaunch.pro
- **Adapter:** Static export (Cloudflare Pages)
- **Pages project:** `growthsetters-pro`
- **Brand color:** #22C55E (bright green)

## Purpose
Recruitment and affiliate management platform for appointment setters.
Setters sign up, get a guided call flow with a curated batch of leads (FOIA-sourced),
book appointments with tax professionals via Google Calendar, and earn 20%
commission on closed deals.

## Routes

### Marketing (public)
- `/` — recruitment landing page (video-heavy)
- `/tips` — gated "5 Hot Tips" PDF with email capture (triggers 6-email drip)

### Auth
- `/sign-in` — magic link / Google OAuth sign-in

### Dashboard (authenticated, `vlp_session` cookie)
- `/dashboard` — setter stats overview
- `/dashboard/calls` — assigned batch (call list)
- `/dashboard/calls/[rowNumber]` — guided call flow: 5 product pitch tabs, dispositions (SVG icons), TCVLP pitch script, big buttons, transfer-to-JLW
- `/dashboard/appointments` — booked appointments + summary
- `/dashboard/account` — account settings

## Worker endpoints (`api.virtuallaunch.pro/v1/gsvlp/*`)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/v1/gsvlp/videos/:filename` | Serve recruitment videos from R2 (public) |
| GET | `/v1/gsvlp/call-list` | Return setter's assigned batch (assigns if none) |
| POST | `/v1/gsvlp/call-list/:rowNumber/status` | Update row status / disposition |
| GET | `/v1/gsvlp/availability` | JLW's free slots from Google Calendar FreeBusy |
| POST | `/v1/gsvlp/appointments` | Log appointment + create Google Calendar event |
| GET | `/v1/gsvlp/appointments` | List setter's appointments + summary |
| GET | `/v1/gsvlp/dashboard` | Setter dashboard stats |
| POST | `/v1/gsvlp/tips/subscribe` | Capture email, send welcome with PDF link |
| GET | `/v1/gsvlp/tips/download` | Serve the 5 Hot Tips PDF from R2 (public) |
| GET | `/v1/gsvlp/tips/unsubscribe` | HMAC-validated unsubscribe |

## R2 data model (in `virtuallaunch-pro` bucket — not the stray `gsvlp` bucket)

- `gsvlp/batches/{accountId}.json` — setter's assigned lead batch
- `gsvlp/appointments/{accountId}.json` — setter's booked appointments
- `gsvlp/tips-subscribers/{emailHash}.json` — tips drip subscriber records
- `gsvlp/tips-subscriber-index.json` — index of all tips subscribers
- `gsvlp/tips/5-hot-tips-appointment-setting.pdf` — gated PDF
- `gsvlp/videos/*.mp4` — recruitment demo videos

## External integrations
- **Google Sheets** — source of FOIA lead batches imported into R2 batches
- **Google Calendar** — FreeBusy availability + event creation for booked appointments (JLW's calendar)
- **Resend** — transactional email + 6-email tips drip campaign (sent via daily 15:00 UTC cron)

## Key differences from other apps
- Audience is setters/sales talent, NOT tax professionals
- Free to join (no subscription tiers)
- Commission-based (20% of closed deals via Stripe Connect)
- Includes FOIA-sourced call lists for setters
- Video-heavy recruitment landing page
- Tips PDF is a lead magnet feeding a 6-email drip nurturing flow
