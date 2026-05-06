export type AssetCategory =
  | 'linkedin'
  | 'social'
  | 'email'
  | 'talking-points'
  | 'proposal'
  | 'faq'

export interface ProductAsset {
  category: AssetCategory
  title: string
  body: string
  subject?: string // for email
}

export interface Product {
  slug: string
  name: string
  domain: string
  tagline: string
  summary: string
  assets: ProductAsset[]
}

export const ASSET_CATEGORIES: Record<AssetCategory, { label: string; description: string }> = {
  linkedin: {
    label: 'LinkedIn DM',
    description: 'Direct-message script for LinkedIn outreach.',
  },
  social: {
    label: 'Facebook / Threads',
    description: 'Short scroll-stopping script for social feeds.',
  },
  email: {
    label: 'Email',
    description: 'Long-form email with subject line and full body.',
  },
  'talking-points': {
    label: 'Talking Points',
    description: 'What to say when prospects ask. Includes ICP, objections, anti-fits.',
  },
  proposal: {
    label: 'Proposal Template',
    description: 'Short follow-up proposal after an initial conversation.',
  },
  faq: {
    label: 'FAQ Responses',
    description: 'Pre-written answers to common questions.',
  },
}

export const PRODUCTS: Product[] = [
  {
    slug: 'vlp',
    name: 'Virtual Launch Pro',
    domain: 'virtuallaunch.pro',
    tagline: 'Speed to Lead',
    summary: 'The fastest way for tax pros to find new clients.',
    assets: [
      {
        category: 'linkedin',
        title: 'LinkedIn DM',
        body: `Hi {{FIRST_NAME}},

Saw you're a {{CREDENTIAL}} working with tax clients. Quick question — how are you currently getting new client inquiries?

I ask because I've been recommending Virtual Launch Pro to tax pros in my network. They run a directory that taxpayers actively search to find credentialed help. The pitch is simple: you set up a free profile, taxpayers in your area submit inquiries, you get an email the moment one matches your services. No cold outreach, no ad spend.

Free tier gets you listed and receiving leads. Pro tier ($199/mo) gets you priority delivery and a featured badge. Scale ($399/mo) gets you a 30-minute exclusive window before anyone else sees the inquiry.

Worth a look?

{{REFERRAL_LINK}}`,
      },
      {
        category: 'social',
        title: 'Facebook / Threads',
        body: `Tax pros: VLP runs a directory where taxpayers actively look for credentialed help. Free tier gets you listed and receiving lead notifications. No ads, no cold outreach.

Three plans, one differentiator: how fast you get the lead.

{{REFERRAL_LINK}}`,
      },
      {
        category: 'email',
        title: 'Email',
        subject: 'A directory built specifically for tax pros',
        body: `Hi {{FIRST_NAME}},

If you're a credentialed tax pro (CPA, EA, or attorney) and you're spending time chasing leads, you should know about Virtual Launch Pro.

It's a directory that taxpayers actively search when they need help. You set up a free profile with your credential, location, and services. When a taxpayer submits an inquiry that matches you, you get an email in seconds.

The differentiator is speed:

- Free — you receive lead notifications on standard delivery
- Pro ($199/mo) — priority delivery and a featured badge in directory results
- Scale ($399/mo) — 30-minute exclusive window before any other pro sees the inquiry

Setup takes 5 minutes. The free tier is genuinely free — no credit card to start receiving leads.

{{REFERRAL_LINK}}

Happy to answer questions.

{{AFFILIATE_NAME}}`,
      },
      {
        category: 'talking-points',
        title: 'Talking Points',
        body: `**What VLP is, in one sentence:**
A lead-delivery platform for credentialed tax pros — taxpayers submit inquiries through a directory, you get notified by email when one matches your services.

**Who VLP serves:**
- CPAs, EAs, and tax attorneys serving individual taxpayers and small business owners
- Solo practitioners and small firms
- US-based pros (taxpayers searching are US-based)

**Why it works (talking points):**
- It's the inverse of cold outreach — taxpayers are looking for *you*, not the other way around
- Profile doubles as marketing — set up once, visible to every taxpayer searching
- Speed-tiered pricing means the differentiator is *when* you get the lead, not whether you get it

**Who it's NOT for:**
- Bookkeepers without tax credentials (no place to list a non-tax credential)
- Tax pros who only serve one specific niche (the directory matches by services + location, broad services do better)
- Anyone unwilling to respond to inquiries within a few hours (speed is the entire value prop)

**Common objections:**
- *"I already get leads from referrals."* — VLP supplements, doesn't replace. The marginal lead from VLP is one you wouldn't have gotten otherwise.
- *"$199/mo is a lot."* — One closed client at typical tax-prep pricing covers it. The Pro tier exists because most tax pros find that priority lead delivery is the difference between closing and not.
- *"I don't have time to manage another platform."* — Setup is 5 minutes. After that, all you do is respond to email notifications.`,
      },
      {
        category: 'proposal',
        title: 'Proposal Template',
        body: `**Re: Adding VLP to your client-acquisition stack**

{{FIRST_NAME}},

Following up on our conversation. Here's what I'd suggest based on what you described:

**Recommended starting tier:** {{TIER}} — {{REASONING}}

**Setup time:** ~5 minutes (profile + credential + service area)

**First lead:** depends on demand in your area; some pros see inquiries within their first week

**What you'd do differently:** less time on outreach, more time on the work that pays

**What you'd need from me:** nothing — you set up your own account and the platform handles the rest

Sign up here: {{REFERRAL_LINK}}

Or reply if you want to talk through which tier fits.

{{AFFILIATE_NAME}}`,
      },
      {
        category: 'faq',
        title: 'FAQ Responses',
        body: `**"How fast will I actually get leads?"**
Depends on demand in your area. VLP's own copy says they don't promise specific volume — it's a function of how many taxpayers in your service area are searching. Pro and Scale tiers exist because faster delivery converts higher.

**"Do I need to be on the paid tiers to get leads?"**
No. Free tier receives lead notifications on standard delivery. Pro and Scale change *when* you see the lead, not whether.

**"What's the difference between Pro and Scale?"**
Pro ($199/mo) gets you priority delivery and a featured badge in directory listings. Scale ($399/mo) gets you a 30-minute exclusive window — you see new inquiries before any other pro does. Scale also gets you 250 transcript tokens and 300 tax tool game tokens monthly (versus Pro's 100/120).

**"Is there a contract?"**
No. Month-to-month. Cancel anytime from your dashboard.

**"Do I need to do any marketing on my end?"**
No. Your profile in the directory is your marketing. VLP drives taxpayers to the directory through their own outreach.

**"Will I get matched outside my service area?"**
No. Matching is by location, credential, and services. You set the radius and specialties on your profile.

**"What happens if I sign up for free and like it?"**
You can upgrade to Pro or Scale anytime from your dashboard. No re-onboarding.`,
      },
    ],
  },
  {
    slug: 'dvlp',
    name: 'Developers VLP',
    domain: 'developers.virtuallaunch.pro',
    tagline: 'Work with U.S. Clients',
    summary: 'Connect talented developers with premium U.S. clients.',
    assets: [
      {
        category: 'linkedin',
        title: 'LinkedIn DM',
        body: `Hi {{FIRST_NAME}},

Saw your portfolio — strong work. Quick question: are you actively looking for US clients right now?

I ask because I'm referring developers to Developers VLP. It connects vetted international developers with premium US clients — no cold outreach, no race-to-the-bottom bidding wars. Clients come pre-qualified, you set your own rates, you choose your projects.

Free tier gets you listed and receiving monthly job matches. Premium ($2.99/mo) gets you priority matching, weekly notifications, featured profile placement, and a 1-on-1 intro consultation.

Worth a look?

{{REFERRAL_LINK}}`,
      },
      {
        category: 'social',
        title: 'Facebook / Threads',
        body: `Developers: stop bidding on Upwork. Developers VLP connects vetted devs with premium US clients — set your own rates, choose your projects. Free tier gets you listed.

{{REFERRAL_LINK}}`,
      },
      {
        category: 'email',
        title: 'Email',
        subject: 'Pre-vetted US clients (no cold outreach)',
        body: `Hi {{FIRST_NAME}},

If you're a developer tired of low-quality leads, scope creep, and bidding wars, Developers VLP is worth ten minutes of your time.

It's a matching platform — you set up a profile, US clients with real budgets get warm-introduced to you when they need your specific skill set. No cold pitching, no auction races.

Two tiers:

- Starter — Free. Profile listing + monthly job notifications.
- Premium — $2.99/mo. Priority matching, weekly notifications, featured placement, 1-on-1 intro consultation, dedicated support.

The pitch is simple: clients come to you, not the other way around.

{{REFERRAL_LINK}}

Reply if you want to talk through whether your skill set fits what they're matching for.

{{AFFILIATE_NAME}}`,
      },
      {
        category: 'talking-points',
        title: 'Talking Points',
        body: `**One-sentence pitch:** A matching platform that warm-introduces vetted developers to premium US clients — no cold outreach, no bidding.

**Who it serves:**
- International developers seeking US client work
- Devs with strong English communication skills (clients work directly with you)
- Specialized expertise welcome (web, mobile, AI, infrastructure, etc.)

**Why it works:**
- Inverts the freelance-platform model — clients come to *you*
- No race-to-the-bottom — you set your rates
- Quality filter on both sides (vetted devs, vetted clients)

**Who it's NOT for:**
- Generalists with no portfolio — DVLP requires proven track record
- Devs who can't communicate professionally in English
- Anyone wanting hourly low-budget work — clients here pay for expertise

**Common objections:**
- *"I already use Upwork/Toptal."* — DVLP is supplemental. The differentiator is no bidding and no cold outreach.
- *"Premium is only $2.99/mo — what's the catch?"* — No catch. The platform monetizes via clients, not via dev fees. Premium is for prioritization.
- *"Why would clients come here vs. just hiring direct?"* — Pre-vetting and faster matching. Clients save weeks of search time.`,
      },
      {
        category: 'proposal',
        title: 'Proposal Template',
        body: `**Re: Joining Developers VLP**

{{FIRST_NAME}},

Based on what you described, here's what I'd suggest:

**Recommended tier:** {{TIER}} — {{REASONING}}

**Setup time:** ~10 minutes (profile + portfolio links + skill tags + rate)

**First match:** depends on client demand in your skill area; some devs see introductions within the first 2–4 weeks

**What you keep:** 100% of your project rate. DVLP doesn't take a cut from your earnings.

Sign up: {{REFERRAL_LINK}}

Reply if you want to talk through whether your skill set is a fit.

{{AFFILIATE_NAME}}`,
      },
      {
        category: 'faq',
        title: 'FAQ Responses',
        body: `**"Does DVLP take a cut of my project payments?"**
No. DVLP charges devs a flat monthly fee (Premium $2.99/mo) and monetizes via the client side. Your project rate is yours.

**"How are clients vetted?"**
DVLP screens for budget, scope clarity, and project quality before warm-introducing. Clients with vague requirements or rate-pressure history don't make it through.

**"How fast will I get my first match?"**
Depends on demand in your skill area. No guarantee on volume — typical Premium devs see introductions within 2–4 weeks.

**"Can I work with clients I find on DVLP outside the platform?"**
Yes. Once you're introduced, the working relationship is yours. DVLP doesn't insert itself into your contracts.

**"Do I need to be in a specific country?"**
DVLP serves international developers. Clients are US-based. You need to be able to work with US time zones and communicate in English.

**"What's the difference between Starter and Premium?"**
Starter is free, monthly notifications, basic listing. Premium ($2.99/mo) gets you priority matching, weekly notifications, featured placement, and an intro consultation.

**"Is there a contract?"**
No. Month-to-month. Cancel anytime.`,
      },
    ],
  },
  {
    slug: 'gvlp',
    name: 'Games VLP',
    domain: 'games.virtuallaunch.pro',
    tagline: 'Game-based engagement',
    summary: 'Tax-themed mini-games for client education and leads.',
    assets: [
      {
        category: 'linkedin',
        title: 'LinkedIn DM',
        body: `Hi {{FIRST_NAME}},

Quick question — are clients engaging with your practice website between appointments? Most tax pros tell me their site sits idle 11 months out of 12.

Games VLP fixes that. Drop tax-themed mini-games into your existing site (one iframe — no rebuild). Clients play between appointments, learn tax concepts, and your practice stays top-of-mind.

Free tier gets you 100 tokens/mo + 1 game slot. Strategist tier ($19/mo, most popular) gets you 1,500 tokens + 6 game slots + advanced analytics.

Setup is under 5 minutes.

{{REFERRAL_LINK}}`,
      },
      {
        category: 'social',
        title: 'Facebook / Threads',
        body: `Tax pros: drop a Tax Spin Wheel onto your practice website. Clients play, you stay top-of-mind. One iframe, 5-minute setup. Free tier available.

{{REFERRAL_LINK}}`,
      },
      {
        category: 'email',
        title: 'Email',
        subject: 'Make your practice website actually do something',
        body: `Hi {{FIRST_NAME}},

Most tax practice websites sit idle. Clients visit during onboarding, then forget the URL exists.

Games VLP changes that. You drop tax-themed mini-games into your site — Tax Spin Wheel, Tax Trivia, Tax Match Mania — clients play between appointments and your practice stays in their mind.

Four tiers:

- Starter — Free. 100 tokens/mo, 1 game slot.
- Apprentice — $9/mo. 500 tokens, 3 game slots.
- Strategist — $19/mo (most popular). 1,500 tokens, 6 game slots, advanced analytics.
- Navigator — $39/mo. 5,000 tokens, 9 game slots, full analytics, dedicated support.

Setup is one iframe or script tag. Works with WordPress, Squarespace, Webflow, or plain HTML.

{{REFERRAL_LINK}}

Reply if you want to see what the Tax Spin Wheel looks like before signing up.

{{AFFILIATE_NAME}}`,
      },
      {
        category: 'talking-points',
        title: 'Talking Points',
        body: `**One-sentence pitch:** Embeddable tax-themed mini-games that turn idle practice websites into engagement engines.

**Who it serves:**
- CPAs, EAs, tax strategists with their own practice websites
- Solo and mid-size firms wanting client engagement between appointments
- Pros who want to differentiate from competitors still emailing static PDFs

**Why it works:**
- Single iframe install — no developer required
- Plays in any browser, any device, no client account needed
- Token-based — costs scale with usage, not with seats

**Who it's NOT for:**
- Firms without a website to embed on (build the site first via Website Lotto)
- Pros who don't communicate with clients between tax seasons (no engagement to amplify)
- Practices serving exclusively enterprise clients (games are consumer-friendly)

**Common objections:**
- *"My clients won't play games on my site."* — Engagement data from existing GVLP customers shows 40% repeat-visit uptick. Tax Trivia becomes a meeting talking point.
- *"$19/mo seems high for games."* — At Strategist tier, 1,500 tokens covers ~750 client plays per month. Cost-per-engagement is pennies.
- *"I don't have time to set this up."* — One iframe. Five minutes. Works with whatever site builder you're already using.`,
      },
      {
        category: 'proposal',
        title: 'Proposal Template',
        body: `**Re: Adding mini-games to your practice site**

{{FIRST_NAME}},

Here's what I'd suggest based on our conversation:

**Recommended tier:** {{TIER}} — {{REASONING}}

**Setup time:** ~5 minutes (one iframe in your site builder)

**First plays:** typically within 24 hours of embedding, depending on traffic

**What changes:** clients have a reason to come back to your site between appointments

Sign up: {{REFERRAL_LINK}}

Or reply if you want me to show you the embed code first.

{{AFFILIATE_NAME}}`,
      },
      {
        category: 'faq',
        title: 'FAQ Responses',
        body: `**"Do clients need an account to play?"**
No. Games run directly in your site for any visitor. Tokens are tied to your subscription, not individual players.

**"How do I embed a game?"**
Copy one iframe or script tag from your dashboard into any page on your site. Works with WordPress, Squarespace, Webflow, or plain HTML.

**"Do tokens roll over?"**
No. Tokens refresh monthly with your subscription. Unused tokens don't carry forward.

**"Can I customize the games for my brand?"**
Yes. Set brand colors and frame styling from your dashboard. The games match your site's look.

**"What games are available?"**
Tax Spin Wheel, Tax Match Mania, Tax Trivia. New games added regularly.

**"How do I know if it's working?"**
Analytics dashboard shows plays, completions, time-on-site, and engagement trends. Strategist and Navigator tiers include advanced analytics.

**"Is there a contract?"**
No. Month-to-month. Cancel anytime.`,
      },
    ],
  },
  {
    slug: 'tavlp',
    name: 'Tax Avatar Pro',
    domain: 'taxavatar.virtuallaunch.pro',
    tagline: 'AI YouTube channel for tax pros',
    summary: 'Done-for-you faceless YouTube channel for tax practices.',
    assets: [
      {
        category: 'linkedin',
        title: 'LinkedIn DM',
        body: `Hi {{FIRST_NAME}},

Quick question — do you have a YouTube channel for your tax practice? Most tax pros say they should, but won't be on camera and don't have time to script and edit.

Tax Avatar Pro solves both. We build a faceless YouTube channel for your practice. An AI avatar (you pick from six) scripts, records, and publishes IRS code explainers — every video drives viewers to your branded intake page.

$29/mo as an add-on to TaxClaim Pro ($10/mo). Combined: $39/mo.

The DIY equivalent at typical billing rates is $1,250+ per video. This produces 4 per month.

{{REFERRAL_LINK}}`,
      },
      {
        category: 'social',
        title: 'Facebook / Threads',
        body: `Tax pros: faceless YouTube channel for your practice. AI avatar scripts, records, publishes IRS code videos. Photo in. Leads out. $29/mo.

{{REFERRAL_LINK}}`,
      },
      {
        category: 'email',
        title: 'Email',
        subject: 'A YouTube channel for your tax practice (without being on camera)',
        body: `Hi {{FIRST_NAME}},

You probably know you should have a YouTube channel for your tax practice. You probably also won't be on camera and don't have 3 hours to script, record, and edit one video.

Tax Avatar Pro handles all of it.

Pick an AI avatar (six to choose from). We write scripts on IRS codes that taxpayers actively search — Code 810, Code 570, Code 846, refund timing. We record, edit, and publish to your channel. Every video drives viewers to your branded intake page.

Pricing:

- TaxClaim Pro (required base) — $10/mo
- Tax Avatar Pro (the channel) — $29/mo
- Combined — $39/mo (most popular)

The math: at $250/hr billing, one DIY video costs you $750–$1,250 in opportunity cost. Tax Avatar Pro produces 4/month for $29. The math isn't close.

Industry context: 400,000 CPAs left the industry in the last 5 years. Half of those remaining retire in 7. The taxpayers searching for help aren't going away.

{{REFERRAL_LINK}}

{{AFFILIATE_NAME}}`,
      },
      {
        category: 'talking-points',
        title: 'Talking Points',
        body: `**One-sentence pitch:** A done-for-you faceless YouTube channel for your tax practice — AI avatar scripts, records, and publishes IRS-code videos that drive leads to your intake page.

**Who it serves:**
- CPAs, EAs, tax attorneys who want YouTube authority without being on camera
- Pros who've tried DIY content and given up on the time cost
- Tax pros looking for evergreen lead generation (IRS codes get searched year-round)

**Why it works:**
- Faceless = no camera anxiety, no studio setup, no personal brand exposure
- AI avatars are explicitly allowed under YouTube's 2026 AI content policy
- IRS-code videos have evergreen search demand — this isn't seasonal content
- $29/mo vs. $1,250+ DIY opportunity cost per video

**Who it's NOT for:**
- Pros who already have an established YouTube channel they're growing themselves
- Anyone uncomfortable with AI-generated content as a brand vehicle
- Pros without TaxClaim Pro (TAVLP requires it as a base — combined is $39/mo)

**Common objections:**
- *"Won't AI content get my channel banned?"* — No. YouTube's 2026 policy allows AI narration. Spam is what's banned. Every video reviewed before publishing.
- *"Won't my clients distrust an avatar?"* — Your clients aren't watching at 2pm in your office. Strangers searching "IRS Code 810" at midnight are watching. They convert into your clients.
- *"I can do this myself with ChatGPT."* — At $250/hr billing, the opportunity cost is $750–$1,250 per video. TAVLP is $29/mo for 4 videos.`,
      },
      {
        category: 'proposal',
        title: 'Proposal Template',
        body: `**Re: Tax Avatar Pro for your practice**

{{FIRST_NAME}},

Based on what you described:

**Recommended start:** Combined plan ($39/mo) — TaxClaim Pro + Tax Avatar Pro bundled

**Avatar selection:** {{AVATAR_REASONING}}

**Setup time:** ~30 minutes (avatar selection + intake page branding)

**First video published:** typically within the first 2 weeks

**What changes:** taxpayers searching IRS codes find your channel, watch your avatar explain the code, click through to your intake page

Sign up: {{REFERRAL_LINK}}

Reply if you want to see the six avatars before deciding.

{{AFFILIATE_NAME}}`,
      },
      {
        category: 'faq',
        title: 'FAQ Responses',
        body: `**"Will AI content get my channel banned?"**
No. YouTube's 2026 policy explicitly allows AI-generated narration. Spam content is banned — every Tax Avatar Pro video is reviewed before publishing.

**"Won't my clients distrust an avatar?"**
Your existing clients aren't the audience. The audience is taxpayers searching "IRS Code 810" at midnight on Google. They watch the explanation, click through to your intake page, and become clients.

**"Can't I just do this myself with ChatGPT and Canva?"**
You can. At $250/hr billing rate, one DIY video costs $750–$1,250 in opportunity cost. Tax Avatar Pro is $29/mo for 4 videos.

**"Do I need TaxClaim Pro?"**
Yes. Tax Avatar Pro is a $29/mo add-on to TaxClaim Pro ($10/mo). Combined plan is $39/mo and includes both.

**"How quickly will I see results?"**
Proof-of-concept channels hit 923 views in 30 days with zero promotion. Compounding takes 90+ days.

**"What happens after the Kwong deadline (July 2026)?"**
Kwong is the launch fuel. IRS codes don't expire — Kwong gets you in the door, IRS-code SEO keeps the channel compounding indefinitely.

**"Is there a contract?"**
No. Month-to-month. Cancel anytime.`,
      },
    ],
  },
  {
    slug: 'wlvlp',
    name: 'Website Lotto',
    domain: 'websitelotto.virtuallaunch.pro',
    tagline: "Don't gamble on your website design",
    summary: 'Win, bid on, or buy ready-to-launch websites.',
    assets: [
      {
        category: 'linkedin',
        title: 'LinkedIn DM',
        body: `Hi {{FIRST_NAME}},

Saw you're starting a {{BUSINESS_TYPE}} — quick question: do you have a website yet?

If not, Website Lotto is worth a look. 210+ professionally designed templates across 40+ categories. Pick one, pay once ($249 standard / $399 premium), and you own it. 12 months hosting included. Cloudflare CDN, SSL, mobile-responsive — all standard.

Three ways to get a site: Buy at list price, Bid below list (you only pay if you win), or Win one free with a scratch ticket.

{{REFERRAL_LINK}}`,
      },
      {
        category: 'social',
        title: 'Facebook / Threads',
        body: `Need a website without hiring an agency? Website Lotto: 210+ pro templates, $249 one-time, 12 months hosting included. Buy, bid, or scratch-to-win.

{{REFERRAL_LINK}}`,
      },
      {
        category: 'email',
        title: 'Email',
        subject: 'A professional website without the agency price tag',
        body: `Hi {{FIRST_NAME}},

Quick pitch — Website Lotto sells professionally designed website templates as a one-time purchase. No subscriptions, no agency contracts, no $5K+ build fees.

Two tiers:

- Standard — $249 one-time. Lifestyle, hobby, food, beauty, entertainment, sports niches.
- Premium — $399 one-time. Tax, legal, services, real estate, tech niches.

Both include 12 months of hosting, Cloudflare CDN, SSL, mobile-responsive design, and a branded subdomain.

Three ways to acquire a site:

- Buy — pay list price, own it outright
- Bid — name your price below list, only pay if you win the auction
- Win — free scratch ticket can land you a free template, discount, or hosting credit

Setup is under an hour. Plug in your Stripe link, customize your content, launch.

{{REFERRAL_LINK}}

Reply if you want to see the templates in your niche before deciding.

{{AFFILIATE_NAME}}`,
      },
      {
        category: 'talking-points',
        title: 'Talking Points',
        body: `**One-sentence pitch:** A marketplace of 210+ professionally designed websites — buy, bid, or win one — with one-time pricing instead of agency contracts.

**Who it serves:**
- Solo entrepreneurs, service providers, and small business owners
- Anyone needing a website without hiring an agency or freelancer
- Cost-conscious DIY buyers who want a professional result

**Why it works:**
- One-time payment ($249 / $399) instead of subscription web builders or $5K+ agency builds
- 12 months of hosting included — no surprise bills in month 13
- Three acquisition paths (buy/bid/win) lets price-sensitive buyers participate at lower entry points
- Cloudflare-backed (CDN, SSL, DDoS protection) — enterprise infrastructure on a small-business budget

**Who it's NOT for:**
- Businesses needing custom-coded functionality (e-commerce with complex inventory, SaaS frontends, etc.)
- Buyers who want to use their own domain immediately (custom domain support pending — currently subdomain only)
- Anyone wanting ongoing SEO/content services bundled (premium hosting after year 1 includes some, but not full agency-level)

**Common objections:**
- *"Why not just use Squarespace/Wix?"* — Those are subscription forever. WL is one-time + cheap hosting. Math wins after ~18 months.
- *"$399 seems steep for a template."* — Compare to a $5K agency build or even a $99/mo Squarespace plan over 4 years ($4,752). $399 wins.
- *"What happens after 12 months?"* — Standard hosting $14/mo, Premium $49/mo. Premium includes content updates, SEO, priority support.`,
      },
      {
        category: 'proposal',
        title: 'Proposal Template',
        body: `**Re: Getting your website launched**

{{FIRST_NAME}},

Based on what you described:

**Recommended tier:** {{TIER}} — {{REASONING}}

**Acquisition path:** {{PATH}} — {{PATH_REASONING}}

**Setup time:** ~1 hour (template selection + content + Stripe link)

**Total first-year cost:** {{COST}} (includes 12 months hosting)

Sign up: {{REFERRAL_LINK}}

Reply if you want me to walk you through templates in your niche.

{{AFFILIATE_NAME}}`,
      },
      {
        category: 'faq',
        title: 'FAQ Responses',
        body: `**"Is this a subscription?"**
No. You pay one time ($249 standard or $399 premium) and own the site. First 12 months of hosting included.

**"What happens after 12 months?"**
$14/mo standard hosting, or $49/mo premium. Premium includes content updates, SEO, and priority support.

**"What's the difference between standard and premium?"**
Standard covers lifestyle, hobby, food, beauty, entertainment, and sports niches. Premium covers tax, legal, services, real estate, and tech — higher-value niches.

**"Can I bid below list price?"**
Yes. Bid is one of three acquisition paths. If no one outbids you by close, the site is yours at your number. You only pay if you win.

**"What's the scratch ticket?"**
Free scratch ticket can win you a free template, a discount, or hosting credit. Try it before buying.

**"Can I use my own domain?"**
Currently sites run on a \`.virtuallaunch.pro\` subdomain. Custom domain support is in development.

**"What happens when a template is sold?"**
It's marked Sold and removed from the available pool. Each buyer gets exclusive use.`,
      },
    ],
  },
  {
    slug: 'tcvlp',
    name: 'TaxClaim Pro',
    domain: 'taxclaim.virtuallaunch.pro',
    tagline: 'Form 843 automation for tax pros',
    summary: 'Generate Form 843 in 5 minutes. Built for the Kwong v. US window.',
    assets: [
      {
        category: 'linkedin',
        title: 'LinkedIn DM',
        body: `Hi {{FIRST_NAME}},

Quick question — are you tracking the Kwong v. US window for your clients? On November 25, 2025, the U.S. Court of Federal Claims ruled that IRS penalties assessed on obligations between January 2020 and July 2023 are challengeable under IRC §7508A(d). Filing window closes July 10, 2026.

TaxClaim Pro automates the Form 843 prep. Enter penalty data, generate a complete Form 843 in 5 minutes (vs. 30 minutes manual). Built-in eligibility checker flags which client penalties fall in the Kwong window.

$10/mo Starter, $29/mo Professional (most popular), $79/mo Firm tier with white-label and API.

The window is finite. Worth a look.

{{REFERRAL_LINK}}`,
      },
      {
        category: 'social',
        title: 'Facebook / Threads',
        body: `Tax pros: Kwong v. US window closes July 10, 2026. TaxClaim Pro generates Form 843 in 5 minutes vs. 30 manual. $10/mo. Don't leave client refunds on the table.

{{REFERRAL_LINK}}`,
      },
      {
        category: 'email',
        title: 'Email',
        subject: 'Form 843 in 5 minutes — Kwong window closes July 2026',
        body: `Hi {{FIRST_NAME}},

If you have clients with IRS penalties from 2020–2023, you need to know about Kwong v. US.

On November 25, 2025, the U.S. Court of Federal Claims ruled that IRC §7508A(d) required mandatory postponement of federal tax deadlines during the COVID-19 national disaster period. The court found the IRS lacked authority to assess failure-to-file penalties, failure-to-pay penalties, and underpayment interest on obligations due between January 20, 2020, and July 10, 2023.

Translation: those penalties are challengeable. Filing deadline is July 10, 2026.

TaxClaim Pro automates the Form 843 prep:

- Starter — $10/mo. Form 843 generation, 1 branded claim page, penalty calculations, Kwong eligibility checker.
- Professional — $29/mo (most popular). Unlimited claim pages, priority generation, bulk PDF export, transcript integration.
- Firm — $79/mo. White-label branding, multi-practitioner access, API access, 4hr SLA support.

Manual Form 843 prep takes 30 minutes per client. TCP takes 5. Less than one billable hour pays for the Starter tier for the rest of the year.

{{REFERRAL_LINK}}

{{AFFILIATE_NAME}}`,
      },
      {
        category: 'talking-points',
        title: 'Talking Points',
        body: `**One-sentence pitch:** Form 843 automation built for the Kwong v. US refund window — generate a complete penalty abatement claim in 5 minutes instead of 30.

**Who it serves:**
- CPAs, EAs, and tax attorneys with clients holding 2020–2023 IRS penalties
- Solo practitioners (Starter $10/mo) through multi-practitioner firms (Firm $79/mo)
- Anyone running penalty abatement workflows

**Why it works:**
- Court-backed: Kwong v. US, decided November 25, 2025, U.S. Court of Federal Claims, Judge Molly R. Silfen, 179 Fed. Cl. 382
- Time math: 5 min vs. 30 min per client = 6x throughput on penalty work
- Built-in eligibility checker flags which client penalties fall in the Kwong window — no manual date-checking
- Branded claim pages let clients submit penalty details through your URL

**Who it's NOT for:**
- Pros without 2020–2023 penalty clients (the Kwong window is the wedge)
- Anyone expecting TCP to file the form with the IRS — TCP generates the form, you and the client mail it
- Pros looking for full case management (TCP is form generation, not full litigation tooling)

**Common objections:**
- *"What is Form 843?"* — IRS Form 843 is the official form for requesting refund or abatement of taxes, penalties, or interest. Standard, well-established form.
- *"Does TCP file with the IRS?"* — No. TCP generates the completed form. Client signs, you mail. TCP keeps you in the workflow without taking over the practice.
- *"What happens after July 2026?"* — The Kwong-specific window closes. Form 843 generation continues for standard penalty abatement claims indefinitely.`,
      },
      {
        category: 'proposal',
        title: 'Proposal Template',
        body: `**Re: TaxClaim Pro for your Kwong-eligible clients**

{{FIRST_NAME}},

Based on what you described:

**Recommended tier:** {{TIER}} — {{REASONING}}

**Estimated Kwong-eligible clients:** {{COUNT}}

**Setup time:** ~15 minutes (account + branded claim page)

**Per-client throughput:** 5 minutes per Form 843 (vs. 30 manual)

**Window remaining:** until July 10, 2026

Sign up: {{REFERRAL_LINK}}

Reply if you want to talk through which clients qualify under Kwong.

{{AFFILIATE_NAME}}`,
      },
      {
        category: 'faq',
        title: 'FAQ Responses',
        body: `**"What is Form 843?"**
IRS Form 843 is the official form for requesting a refund or abatement of certain taxes, penalties, or interest. It's been around for decades.

**"What is the Kwong v. US ruling?"**
Decided November 25, 2025. The U.S. Court of Federal Claims ruled that IRC §7508A(d) required mandatory postponement of federal tax deadlines during the COVID-19 national disaster period (January 20, 2020 – July 10, 2023). Penalties assessed in that window are challengeable. Filing deadline July 10, 2026.

**"Does TaxClaim Pro file the form with the IRS?"**
No. TCP generates the completed Form 843. You review, your client signs, you mail it.

**"Can I use this with IRS transcripts?"**
Yes. Professional and Firm tiers include direct integration with Transcript Tax Monitor Pro (TTMP).

**"What happens after July 2026?"**
The Kwong-specific eligibility window closes. Form 843 generation continues to work for standard penalty abatement claims.

**"What's the difference between tiers?"**
Starter ($10/mo) — 1 claim page, basic generation. Professional ($29/mo) — unlimited claim pages, bulk export, transcript integration. Firm ($79/mo) — white-label, multi-practitioner, API access.

**"Is there a contract?"**
No. Month-to-month. Cancel anytime.`,
      },
    ],
  },
  {
    slug: 'tmp',
    name: 'Tax Monitor Pro',
    domain: 'taxmonitor.pro',
    tagline: 'IRS transcript monitoring & compliance',
    summary: 'A monitoring-first directory for taxpayers and tax pros.',
    assets: [
      {
        category: 'linkedin',
        title: 'LinkedIn DM',
        body: `Hi {{FIRST_NAME}},

Quick question — do your clients know what's on their IRS account transcripts right now? Most don't. Notices arrive late, deadlines slip, balances surprise people.

Tax Monitor Pro is a monitoring-first directory. Clients find a tax pro through TMP, the pro pulls their transcripts on a schedule, and the client gets plain-English reports on what changed and what it means. No IRS jargon.

Memberships start at $9/mo (Essential), $19/mo (Plus, most popular), or $39/mo (Premier). Each includes transcript tokens, tool tokens, and access to your tax pro through the platform.

{{REFERRAL_LINK}}`,
      },
      {
        category: 'social',
        title: 'Facebook / Threads',
        body: `Stop being surprised by IRS notices. Tax Monitor Pro: a tax pro watches your IRS transcripts, explains what changed in plain English, before it costs you. From $9/mo.

{{REFERRAL_LINK}}`,
      },
      {
        category: 'email',
        title: 'Email',
        subject: 'A tax pro who watches before trouble lands',
        body: `Hi {{FIRST_NAME}},

Most people only hear from their tax preparer once a year — at filing. The other 11 months, the IRS is making moves on your account that you'll find out about via certified mail, usually too late.

Tax Monitor Pro flips that. You connect with a credentialed tax pro through the directory. They pull your IRS account transcripts on a schedule, decode any new activity, and send you a plain-English report — before a notice arrives, before a deadline slips, before a balance compounds.

Membership tiers:

- Essential — $9/mo. 5 tool tokens + 2 transcript tokens monthly. Email support.
- Plus — $19/mo (most popular). 15 tool tokens + 5 transcript tokens. Priority support.
- Premier — $39/mo. 40 tool tokens + 10 transcript tokens. Dedicated support.

All plans include directory access, calendar scheduling, and direct messaging with your tax pro.

Best fit for: business owners, high-income earners, anyone with past IRS issues, or frequent travelers who can't always catch the mail.

{{REFERRAL_LINK}}

{{AFFILIATE_NAME}}`,
      },
      {
        category: 'talking-points',
        title: 'Talking Points',
        body: `**One-sentence pitch:** A monitoring-first directory connecting taxpayers with credentialed pros who watch IRS account activity and explain changes in plain English — before notices become problems.

**Who it serves:**
- Business owners (no time to decode IRS movement)
- High-income earners (more complexity = more mismatch risk)
- Anyone with past IRS issues (notice, audit, balance, filing problem)
- Frequent travelers (can't reliably catch mailed notices)

**Why it works:**
- Inverts the once-a-year tax relationship — pros watch year-round
- Plain-English reports replace jargon-dense IRS letters
- Early alerts catch problems before penalties compound
- Directory matches taxpayers to credentialed pros (CPA/EA/Attorney) automatically

**Who it's NOT for:**
- People with simple W-2-only returns and no IRS activity (low value relative to fee)
- Anyone wanting full audit defense or representation (TMP is monitoring; representation is a separate engagement with the matched pro)
- Cost-sensitive filers who only care about April 15 (TMP is for ongoing peace of mind)

**Common objections:**
- *"My CPA already handles this."* — Most CPAs file your return. TMP is between filings. Ask your CPA when they last pulled your transcripts. Most haven't.
- *"$9/mo for what?"* — At Essential tier, you get 2 transcript pulls per month, tool tokens, and a directory-matched tax pro. The monitoring itself is the product.
- *"I haven't had IRS issues."* — Best time to start monitoring. Once a notice arrives, you're already behind.`,
      },
      {
        category: 'proposal',
        title: 'Proposal Template',
        body: `**Re: Tax Monitor Pro membership**

{{FIRST_NAME}},

Based on what you described:

**Recommended tier:** {{TIER}} — {{REASONING}}

**Why this matters for your situation:** {{REASONING_PERSONAL}}

**Setup time:** ~10 minutes (intake form + tax pro match)

**First report:** typically within 2 weeks of intake

**What changes:** you stop being surprised by IRS activity

Sign up: {{REFERRAL_LINK}}

Reply if you want to talk through whether monitoring fits your tax picture.

{{AFFILIATE_NAME}}`,
      },
      {
        category: 'faq',
        title: 'FAQ Responses',
        body: `**"What is a transcript token?"**
A transcript token lets you request and analyze one IRS transcript through Tax Monitor Pro. Tokens are included with paid plans and roll over for 60 days if unused.

**"What is a tool token?"**
Tool tokens give you access to interactive tax education games on Tax Tools Arcade.

**"Can I upgrade or downgrade?"**
Yes. Change your plan anytime from your dashboard.

**"Is there a contract?"**
No. All plans are month-to-month. Cancel anytime.

**"Does intake create IRS representation?"**
No. Intake gathers info so the platform can match you with a tax pro. Representation only begins if you and the matched pro sign a separate engagement letter.

**"How does the tax pro match work?"**
Based on your location, the complexity of your situation, and the credentials you need (CPA/EA/Attorney). The directory pulls from VLP-listed pros.

**"What if I already have a tax pro?"**
You can still use TMP for monitoring tools and tokens. Some clients use TMP independently and bring reports to their existing pro.`,
      },
    ],
  },
  {
    slug: 'ttmp',
    name: 'Transcript Tax Monitor Pro',
    domain: 'transcript.taxmonitor.pro',
    tagline: 'Transcript automation',
    summary: 'IRS transcript automation, decoded for clients.',
    assets: [
      {
        category: 'linkedin',
        title: 'LinkedIn DM',
        body: `Hi {{FIRST_NAME}},

Quick question — when a client sends you their IRS transcript and asks "is this bad?", how long does it take you to translate the codes into plain English?

Most tax pros tell me 15–20 minutes per client. Multiply that across a practice and you're losing billable hours every week to code lookups.

Transcript Tax Monitor Pro automates the parse. Upload the PDF, get a client-ready report in under 30 seconds — every code interpreted in plain English, with your firm logo and colors. PDF parsing runs locally in your browser, so client data never leaves your machine.

No subscription. Token packs: 10 for $19, 25 for $29 (most popular), 100 for $129. Tokens never expire.

{{REFERRAL_LINK}}`,
      },
      {
        category: 'social',
        title: 'Facebook / Threads',
        body: `Tax pros: stop translating IRS transcript codes by hand. TTMP parses any transcript in under 30 seconds — branded client report, plain English, runs locally. No subscription. From $19.

{{REFERRAL_LINK}}`,
      },
      {
        category: 'email',
        title: 'Email',
        subject: 'IRS transcripts decoded in 30 seconds',
        body: `Hi {{FIRST_NAME}},

If you read IRS transcripts for clients, this is worth two minutes.

Transcript Tax Monitor Pro turns raw IRS transcripts into client-ready reports automatically. Upload the PDF, get every transaction code interpreted in plain English, branded with your firm logo, ready to send. Runs locally in your browser — client data never leaves your machine.

No subscription. Pay-as-you-go token packs:

- 10 tokens — $19 ($1.90/token). Occasional use.
- 25 tokens — $29 ($1.16/token). Most popular.
- 100 tokens — $129 ($1.29/token). High-volume practices.

Tokens never expire. Local PDF parsing is always free — you only spend a token when you save a finished branded report.

Use cases: Code 846 (refund timing), 810 (refund freeze), 570 + 971 (notice timeline), 420 (audit signal), 290 (zero additional tax). All explained, in context.

Built for licensed practitioners — CPAs, EAs, tax attorneys. If you handle more than 5 transcripts a month, the time savings pay for themselves in the first week.

{{REFERRAL_LINK}}

{{AFFILIATE_NAME}}`,
      },
      {
        category: 'talking-points',
        title: 'Talking Points',
        body: `**One-sentence pitch:** Token-based IRS transcript automation that parses any transcript in under 30 seconds and produces a branded client-ready report — runs locally, no subscription, tokens never expire.

**Who it serves:**
- CPAs, EAs, tax attorneys handling client transcripts regularly
- Solo practitioners through mid-size firms
- Anyone who reads more than 5 IRS transcripts a month

**Why it works:**
- Pay-as-you-go pricing — no subscription pressure, tokens never expire
- Local PDF parsing — client data never uploaded to the cloud (compliance + privacy)
- Branded reports — your logo, your colors, ready to send to clients
- Covers all 4 transcript types and every common transaction code (846, 810, 570, 971, 420, 290, 150+806, etc.)
- Parsing is free — you only spend a token when you save a finished report

**Who it's NOT for:**
- Tax pros who handle fewer than 5 transcripts a month (volume too low to matter)
- Anyone needing full audit-defense workflow (TTMP is parse + report, not litigation tooling)
- Firms wanting subscription billing for budgeting reasons (TTMP is one-time token packs)

**Common objections:**
- *"Do I need a subscription?"* — No. Pay once for tokens, use them when you need them. Tokens never expire.
- *"Is my client data secure?"* — Parsing runs locally in your browser. Data never uploads during extraction.
- *"How long does it take?"* — Under 30 seconds from PDF upload to finished report.
- *"Does parsing cost a token?"* — No. Parsing, raw text extraction, and JSON output are always free. Tokens are only spent when you save a finished branded report.`,
      },
      {
        category: 'proposal',
        title: 'Proposal Template',
        body: `**Re: TTMP token pack for your practice**

{{FIRST_NAME}},

Based on transcript volume you described:

**Recommended pack:** {{PACK}} — {{REASONING}}

**Per-transcript time:** under 30 seconds (vs. 15–20 minutes manual)

**Setup time:** ~5 minutes (firm logo upload + brand colors)

**Data security:** parsing runs locally — client transcripts never leave your machine

Buy: {{REFERRAL_LINK}}

Reply if you want me to walk you through a sample report before deciding.

{{AFFILIATE_NAME}}`,
      },
      {
        category: 'faq',
        title: 'FAQ Responses',
        body: `**"Do I need a subscription?"**
No. Transcript Tax Monitor Pro uses a credit-based, pay-as-you-go model. Buy tokens once, use them when you need them.

**"How long does a transcript analysis take?"**
Most transcripts parse and render a full client-ready report in under 30 seconds.

**"Are tokens refundable?"**
Unused tokens are refundable per the refund policy.

**"Can I download reports for client files?"**
Yes. Every report exports as a branded PDF with your firm logo and colors.

**"Does parsing cost tokens?"**
No. Parsing, raw text extraction, and JSON output are always free. You only spend a token when you save a finished report.

**"Is my client data stored or uploaded?"**
PDF parsing runs entirely in your browser. No data is uploaded during extraction.

**"What transcript types are supported?"**
All 4 — Account, Wage and Income, Return, and Record of Account.

**"Do tokens expire?"**
No. Tokens never expire.`,
      },
    ],
  },
  {
    slug: 'tttmp',
    name: 'Tax Tools Arcade',
    domain: 'taxtools.taxmonitor.pro',
    tagline: 'Gamified tax education',
    summary: 'Interactive games that teach IRS forms and tax rules.',
    assets: [
      {
        category: 'linkedin',
        title: 'LinkedIn DM',
        body: `Hi {{FIRST_NAME}},

Quick question — how do you keep your tax knowledge sharp between busy seasons?

Tax Tools Arcade is gamified IRS education for tax pros. 21 games covering transaction codes, IRS notices, deductions, Circular 230, and more. Every game is built on official IRS procedures.

Token-based — 30 tokens for $9, 80 for $19, or 200 for $39 (best value). Most games run 2 tokens per play. Tokens never expire.

Built for CPAs, EAs, tax attorneys, and anyone preparing for IRS-related credentials.

{{REFERRAL_LINK}}`,
      },
      {
        category: 'social',
        title: 'Facebook / Threads',
        body: `Tax pros: keep your IRS knowledge sharp between seasons. Tax Tools Arcade — 21 games on transaction codes, notices, Circular 230. From $9 for 30 tokens. Tokens never expire.

{{REFERRAL_LINK}}`,
      },
      {
        category: 'email',
        title: 'Email',
        subject: 'Gamified IRS training for tax pros',
        body: `Hi {{FIRST_NAME}},

Continuing education for tax pros usually means PDFs and webinars. Tax Tools Arcade is the opposite — IRS procedures taught through play.

21 games and counting:

- IRS Notice Showdown — match notice excerpts to the correct IRS notice (10 rounds, drag-and-drop)
- IRS Tax Detective — decode transaction codes to solve a refund offset case
- Circular 230 Quest — RPG-style walkthrough of Treasury rules governing practice before the IRS
- Tax Mythbusters Quiz — true-or-false debunking common tax myths

All built on official IRS procedures, transaction code definitions, and form specifications.

Token-based pricing:

- 30 tokens — $9
- 80 tokens — $19
- 200 tokens — $39 (best value)

Most games are 2 tokens per play. Tokens never expire. Most games offer free demo mode before you spend a token.

Built for CPAs, EAs, tax attorneys, and students preparing for IRS-related credentials.

{{REFERRAL_LINK}}

{{AFFILIATE_NAME}}`,
      },
      {
        category: 'talking-points',
        title: 'Talking Points',
        body: `**One-sentence pitch:** Gamified continuing education for tax pros — 21 games covering IRS transaction codes, notices, Circular 230, and tax procedures, all built on official IRS sources.

**Who it serves:**
- CPAs, EAs, tax attorneys keeping skills sharp between busy seasons
- Students preparing for EA, CPA, or other IRS-related credentials
- Pros training newer staff (multi-seat use cases via shared token pool)

**Why it works:**
- Token pricing — no subscription, tokens never expire, pay only for what you use
- Built on official IRS procedures and code definitions (not third-party interpretations)
- Free demo mode on most games — try before spending a token
- Mix of formats: matching, quizzes, RPG-style quests — keeps engagement high
- Tracks progress, badges, streaks — gamification that actually rewards depth

**Who it's NOT for:**
- Pros who only need formal CE credit (TTTMP is sharpening, not credentialed CE — yet)
- Anyone wanting passive video-based learning (TTTMP is interactive only)
- Firms requiring centralized training rollout with reporting (single-user model currently)

**Common objections:**
- *"Why games and not just CE courses?"* — CE is for credit. TTTMP is for retention. Studies show interactive formats produce better recall than passive content.
- *"Tokens never expire — what's the catch?"* — No catch. Buy 200 tokens, use them over a year if you want.
- *"Will I learn anything new, or is it just review?"* — Both. Circular 230 Quest specifically is depth, not review. Notice and code games are useful for newer pros and rusty veterans alike.`,
      },
      {
        category: 'proposal',
        title: 'Proposal Template',
        body: `**Re: Tax Tools Arcade for skill-sharpening**

{{FIRST_NAME}},

Based on what you described:

**Recommended pack:** {{PACK}} — {{REASONING}}

**Top games for your situation:** {{GAME_RECOMMENDATIONS}}

**Setup time:** ~5 minutes (account + first token purchase)

**First play:** demo mode is free; spend a token when you want progress tracking

Buy: {{REFERRAL_LINK}}

Reply if you want me to walk you through which games fit your specialty.

{{AFFILIATE_NAME}}`,
      },
      {
        category: 'faq',
        title: 'FAQ Responses',
        body: `**"How does token pricing work?"**
30 tokens for $9, 80 for $19, or 200 for $39 (best value). Tokens never expire. Most games cost 2 tokens per play; the Circular 230 RPG runs 5 tokens.

**"Who is Tax Tools Arcade built for?"**
Tax professionals (CPAs, EAs, tax attorneys) and students preparing for IRS-related credentials.

**"Can I try before I buy?"**
Yes. Most games offer free demo mode. Form tools show a preview of the output before you spend a token.

**"What do I get after playing?"**
Every game tracks your progress and scoring. Many games include badges, streaks, and achievement levels.

**"Does this count as CE credit?"**
Not currently. TTTMP is skill-sharpening and credential-prep, not credentialed CE.

**"What games are available?"**
Currently 21 games including IRS Notice Showdown (matching), IRS Tax Detective (matching), Circular 230 Quest (RPG), Tax Mythbusters Quiz (quiz), plus 17 more. New games added regularly.

**"Do tokens expire?"**
No. Tokens never expire.`,
      },
    ],
  },
]
