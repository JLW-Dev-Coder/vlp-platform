<!--
Status: Authoritative
Last updated: 2026-04-15
Owner: JLW (Principal Engineer review required for changes)
Scope: All 8 apps in the vlp-platform monorepo
Parent: canonical-app-blueprint.md
-->

# canonical-scale.md

Template for SCALE batch operations documentation. SCALE is the automated outreach and lead enrichment pipeline.

---

## Required Sections (in order)

### 1. Header
- System name, product being sold, last updated, objective

### 2. Objective
- What SCALE does: automated prospect sourcing, enrichment, and email outreach
- Revenue target and breakeven math
- Which platforms use SCALE (currently: TTMP, WLVLP)

### 3. Tech Stack
| Tool | Plan/Tier | Cost | Purpose |
|------|-----------|------|---------|
| Reoon | $9/mo | Email verification (500/day) |
| Resend | — | Transactional email sending |
| Cloudflare KV | `ENRICHMENT_KV` binding | Enrichment cache |
| Cloudflare R2 | `R2_VIRTUAL_LAUNCH` binding | Prospect data, asset pages |

### 4. Pipeline
Step-by-step from sourcing to sale:
1. Prospect sourcing (FOIA data, manual upload)
2. Email finding (Reoon Power, cron at 06:00 UTC)
3. Email validation (Reoon quick, cron at 08:00 UTC)
4. Asset page generation (cron at 10:00–13:00 UTC)
5. Batch generation (email sequences prepared)
6. Email sending (cron at 14:00 UTC)
7. Follow-up sequences (Email 2, Email 3+)

### 5. Prospect Sourcing
- Lead sources (FOIA data, public records)
- CSV schema and tracking columns
- Selection logic (ordered, mandatory criteria)
- Upload via `PUT /v1/scale/prospects/upload-source`

### 6. Email Sequences
- Email 1: Introduction, value proposition, asset page CTA
- Email 2: Follow-up, social proof, urgency
- Email 3+: Final touch, different angle
- Subject line patterns, body structure, CTAs

### 7. Asset Pages
- URL pattern: `api.virtuallaunch.pro/scale/asset-page/{slug}`
- Data schema: prospect name, firm, credentials, personalized content
- CTAs: booking links, pricing links
- R2 key pattern: `scale/asset-pages/{slug}.json`

### 8. Personalization Rules
- By credential type (CPA, EA, Attorney)
- By firm bucket (solo, small, mid, large)
- By geography (state, city)
- Slug rules and dedup logic

### 9. Output Files
- Batch JSON (R2): `scale/batches/{date}/{batch-id}.json`
- Sending CSV: prospect list with email, personalization
- Updated source CSV: tracking columns updated

### 10. Delivery Pipeline
- Worker cron handles all pipeline steps
- Cron schedule defined in `apps/worker/wrangler.toml`
- Admin monitoring via `/v1/admin/scale/*` and `/v1/scale/*` endpoints

### 11. Analytics
- Tracked metrics: emails sent, opened, clicked, bounced, replied
- Conversion tracking: asset page views, booking requests, purchases

### 12. Tone Rules
- Professional, direct, no hard sell
- CAN-SPAM compliant with unsubscribe link
- No misleading subject lines

### 13. Growth Plan
- Phase 1: Establish pipeline (TTMP prospects)
- Phase 2: Scale volume (WLVLP enrichment)
- Phase 3: Compound (cross-platform referrals, affiliate program)

### 14. Non-Goals
- SCALE does not replace paid advertising
- SCALE does not modify prospect data in source systems
- SCALE does not send without email verification
