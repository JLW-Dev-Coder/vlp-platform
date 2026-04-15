# SCALE.md — TCVLP Client Acquisition System

**System:** TCVLP — TaxClaim Pro
**Product:** Automated Form 843 generation + penalty abatement platform
**Price:** $10/mo flat (Stripe: `prod_UCK4SzsEnjp19U`, `price_1TDvQe9ROeyeXOqek1fpOWWH`)
**Last updated:** 2026-04-14
**Objective:** Convert tax professionals into paying TCVLP subscribers by leveraging the Kwong v. US deadline and the pain of manual Form 843 preparation

---

## 1. Header (Identity)

- **System:** VLP SCALE for TCVLP
- **Product being sold:** TaxClaim Pro — automated Form 843 generation + penalty abatement ($10/mo flat)
- **Last updated:** 2026-04-14
- **Objective:** Acquire tax professionals (CPAs, EAs, tax attorneys) handling individual penalty abatement through cold email outreach, social campaigns, and cross-sell from existing TTMP subscribers

---

## 2. Objective

VLP SCALE for TCVLP generates personalized outreach packages — emails, asset pages, and tracking metadata — to convert tax professionals into $10/mo TCVLP subscribers. The primary angle is the Kwong v. US deadline (July 2026), which creates a time-bound window for penalty abatement on penalties assessed between January 2020 and July 2023. TCVLP eliminates the manual burden of preparing Form 843 for each affected client.

**Breakeven:** 14 subscribers at $10/mo covers ~$134/mo stack cost (shared across all platforms).

**Primary audience:** Tax professionals (CPAs, EAs, tax attorneys) handling individual penalty abatement cases.

**Cross-sell pipeline:** TTMP transcript parsing identifies penalties → TCVLP generates Form 843 for those penalties. Existing TTMP subscribers are the highest-conversion prospect segment.

---

## 3. Tech Stack

| Tool | Plan | Cost | Purpose |
|------|------|------|---------|
| Claude | Max | shared | Batch generation (emails, asset pages, personalization) |
| Gmail | Free | $0 | API for cold outreach via VLP Worker cron |
| Resend | Free | $0 | Transactional email delivery |
| Reoon | $9/mo | shared | 500 email validations/day — pre-send email verification |
| Cal.com | Free | $0 | Booking links (cal.com/tax-monitor-pro/tcvlp-intro) |
| Cloudflare KV | `ENRICHMENT_KV` | shared | Enrichment cache |
| Cloudflare R2 | `R2_VIRTUAL_LAUNCH` | shared | Prospect data, asset pages |

**Incremental cost:** $0 — TCVLP shares the existing SCALE infrastructure. All tools are already provisioned for TTMP/VLP/WLVLP campaigns.

---

## 4. Pipeline

| Step | Owner | When | Action |
|------|-------|------|--------|
| 1. Source | JLW | One-time per FOIA refresh | Same Clay CSV pipeline as TTMP — 2,052 prospects loaded into `vlp-scale/foia-leads/foia-master.json` |
| 2. Cross-sell | Worker | Continuous | Flag existing TTMP subscribers with penalty-eligible transcripts for TCVLP outreach |
| 3. Enrich | Worker (`handleEnrichmentBatch`) | 10:00 UTC daily | MX → catch-all → pattern → Reoon validation |
| 4. Route | Worker (`handleDailyBatchGeneration`) | 12:00 UTC daily | Filter eligible, cap per daily allocation, generate 3-email queue per record |
| 5. Send | Worker (`handleTcvlpEmailSend`) | 14:00 UTC daily | Walk queue, send Email 1 + scheduled follow-ups (Day 0, +3, +7) |
| 6. Track | VLP Worker | Continuous | Asset page views, CTA clicks → D1 analytics |
| 7. Close | JLW | As bookings come in | Cal.com → Google Meet → Stripe |

**Cadence:** Email 1 = Day 0, Email 2 = Day +3, Email 3 = Day +7. Three-touch sequence (shorter than TTMP's 6-email sequence — urgency from Kwong deadline reduces need for extended nurture).

---

## 5. Prospect Sourcing

### Primary source
Same IRS FOIA sorted list used by TTMP/VLP/WLVLP — 66,000+ rows of U.S. tax professionals (CPAs, EAs, tax attorneys). 2,052 prospects currently loaded via Clay CSV pipeline.

### Secondary source: TTMP cross-sell
Existing TTMP subscribers whose parsed transcripts contain penalty codes eligible for Form 843 abatement. These prospects already trust the ecosystem and have demonstrated willingness to pay.

### Selection logic (per batch)
1. Filter: `email_found` not empty, not "undefined", not NaN
2. Filter: `email_status` not "invalid"
3. Filter: `tcvlp_email_1_prepared_at` is empty (not yet contacted for TCVLP)
4. Prioritize: prospects with credential = EA or CPA (highest penalty abatement volume)
5. Prioritize: prospects in states with highest individual penalty volume
6. Sort: ascending by `domain_clean` (nulls last)
7. Select: first 50 eligible records per batch

---

## 6. Email Sequences

All cold outreach sent by VLP Worker cron via Gmail API. Templates live inline on each queue record in R2.

### Email 1 — Kwong deadline + Form 843 pain (Day 0)

**Subject line patterns:**
- "{first_name}, the Kwong deadline changes Form 843 math for your clients"
- "Form 843 for penalties Jan 2020 – Jul 2023: {city} {credential}s have until July"
- "{firm_name}: automate Form 843 before the Kwong window closes"

**Body structure:**
1. Open with Kwong v. US ruling and the July 2026 deadline
2. Quantify the pain: manual Form 843 prep takes 2-4 hours per client
3. State the solution: TCVLP automates Form 843 generation from transcript data
4. CTA: "See your eligible penalty estimate" → personalized asset page

### Email 2 — Asset page + demo (Day +3)

**Subject line patterns:**
- "Your penalty abatement estimate, {first_name}"
- "{credential} in {city}: here's the Form 843 time you'd save"

**Body structure:**
1. Reference Email 1
2. Lead with asset page URL showing personalized penalty estimate and time savings
3. Quantify: "At $10/mo, one Form 843 covers the cost"
4. CTAs: asset page + Cal.com booking (cal.com/tax-monitor-pro/tcvlp-intro)

### Email 3 — Final follow-up + booking (Day +7)

**Subject line patterns:**
- "Last note on Kwong, {first_name}"
- "July deadline — one question"

**Body structure:**
1. Short, direct — no more than 4 sentences
2. Single question: "Are you handling any penalty abatement cases before the Kwong deadline?"
3. Single CTA: Cal.com booking link
4. Last touch — no further emails unless prospect engages

---

## 7. Asset Pages

| Field | Value |
|-------|-------|
| URL pattern | `taxclaim.virtuallaunch.pro/asset/{slug}` |
| R2 key | `vlp-scale/tcvlp-asset-pages/{slug}.json` |
| Served by | VLP Worker from R2 |

### Asset page content
- Personalized penalty estimate based on credential type and practice size
- Time savings calculation (manual Form 843 vs. TCVLP automated)
- Kwong v. US deadline countdown
- Eligible penalty window: January 2020 – July 2023

### Asset page CTAs
1. "Start generating Form 843s" → pricing page ($10/mo)
2. "Book an intro call" → cal.com/tax-monitor-pro/tcvlp-intro
3. "How it works" → taxclaim.virtuallaunch.pro/demo

---

## 8. Personalization Rules

### By credential
| Credential | Penalty cases/yr (est.) | Form 843 time saved | Messaging angle |
|------------|------------------------|---------------------|-----------------|
| EA | 15-30 | 30-120 hrs/yr | Volume — enrolled agents handle the most individual penalty cases |
| CPA | 10-20 | 20-80 hrs/yr | Efficiency — CPAs bill $150-400/hr, Form 843 prep is below-rate work |
| Attorney | 5-15 | 10-60 hrs/yr | Precision — attorneys need IRS-ready forms, TCVLP ensures compliance |

### By firm bucket
- **solo_brand:** "You're handling penalty cases alone — every hour on Form 843 is an hour not billing"
- **local_firm:** "Your {city} practice sees these penalties regularly — automate the paperwork"
- **national_firm:** "Standardize Form 843 across your team — consistent output, less training"

### By geography
- Prioritize states with highest individual audit/penalty rates (CA, TX, NY, FL, IL)
- Reference state-specific penalty volume in asset pages

### Slug convention
`{first}-{last}-{city}-{state}` — lowercase, hyphens, strip titles. Dedup: append -2, -3 on collision.

---

## 9. Output Files

Each batch run produces:

1. **JSON batch** — `scale/batches/tcvlp-batch-{YYYY-MM-DD}.json` — full prospect + asset + email data
2. **Sending CSV** — `scale/tcvlp/email1/{YYYY-MM-DD}-batch.csv` — columns: `email, first_name, subject, body`
3. **Updated source CSV** — `tcvlp_email_1_prepared_at` column stamped with ISO timestamp

All sending CSVs are RFC-4180 compliant. Jamie L Williams in every signature.

---

## 10. Delivery Pipeline

| Channel | Tool | Trigger |
|---------|------|---------|
| Cold outreach | Gmail API via VLP Worker cron | Cron at 14:00 UTC reads R2 send queue |
| Transactional | Resend | VLP Worker triggers on events (purchase confirm, Form 843 ready) |
| Asset pages | VLP Worker | Serves from R2 on request |
| Cross-sell | VLP Worker | TTMP penalty detection triggers TCVLP outreach email |

---

## 11. Analytics

### Email (Gmail API via VLP Worker cron + Resend)
Sends, opens, CTA clicks, bounces, unsubscribes, complaints, inbound replies

### Engagement (VLP Worker)
Asset page views per slug, CTA clicks per slug (which CTA), demo page views

### Bookings (Cal.com)
Bookings created via cal.com/tax-monitor-pro/tcvlp-intro, cancellations, attended calls

### Sales (Stripe)
Payment succeeded for `prod_UCK4SzsEnjp19U`, subscriber count, MRR, churn rate

### Kwong-specific
Penalty estimates generated, Form 843s generated, deadline countdown engagement

---

## 12. Tone Rules

Applies to all outreach across all platforms. No exceptions.

| Rule | Detail |
|------|--------|
| Direct | No fluff. State the benefit in the first sentence. |
| Professional but accessible | Written for tax professionals and business owners. Assume intelligence. |
| Specific | Use real numbers — hours saved, revenue recovered, token counts, prices. |
| Problem-first | Lead with the pain point, follow with the solution. |
| No emoji | Professional audience. None in email body, subject, or asset pages. |
| No exclamation marks | Calm confidence, not hype. |

---

## 13. Growth Plan

### Phase 1 — Launch (April 2026)
- Load 2,052 Clay CSV prospects into pipeline
- Begin 3-email sequence targeting EAs and CPAs first
- Cross-sell TCVLP to existing TTMP subscribers with penalty-eligible transcripts
- Launch 10-day social campaign (LinkedIn + Facebook, Kwong deadline angle)

### Phase 2 — Scale (May–June 2026)
- Increase daily batch volume as Kwong deadline approaches
- Ramp urgency in email copy (countdown to July 2026)
- Publish case studies from early adopters
- A/B test Email 2 delay timing (3 vs 5 days)

### Phase 3 — Deadline push (July 2026)
- Maximum urgency — "Kwong window closes this month"
- Daily social posts across all 8 FB groups
- Direct outreach to prospects who opened but didn't convert
- Post-deadline pivot: shift messaging to ongoing penalty abatement (non-Kwong cases)

### Phase 4 — Post-Kwong (August 2026+)
- Reposition from deadline urgency to ongoing efficiency value
- Cross-platform compound: TTMP → TCVLP → VLP membership funnel
- Build Form 843 case study library for SEO
- Target: 50+ subscribers at $10/mo = $500/mo recurring

---

## 14. Non-Goals

TCVLP SCALE does not:
- Send emails directly (VLP Worker handles all delivery via Gmail API and Resend)
- Provide legal advice (TCVLP generates Form 843 documents, not legal opinions)
- File forms with the IRS (the tax professional reviews and files)
- Build backend routes (those belong in VLP Worker)
- Modify prospect source CSVs beyond appending tracking columns
- Store PII in public-facing responses
- Contact any prospect more than once per email sequence step
- Operate without owner (JLW) sign-off on copy, routes, or batch sends
