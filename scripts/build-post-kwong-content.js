#!/usr/bin/env node
// Build post-Kwong content files for TCVLP and TAVLP.
// Both files cover Jul 13 - Aug 9, 2026 (4 weeks, 28 days).
// TCVLP schema matches kwong-campaign-content.json (day, dayOfWeek, fbPage, fbPersonal, linkedin, imagePrompt).
// TAVLP schema matches tavlp-campaign-content.json (dayNumber, title, fbPage, linkedin, imagePrompt).

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.resolve(__dirname, '..');

// ===========================================================================
// TCVLP — post-Kwong: evergreen penalty abatement, $10/mo Form 843 automation,
// IRS code explainers, "IRS penalty relief" framing (NOT Kwong urgency).
// ===========================================================================

const TCVLP_LINK_HOME = 'https://taxclaim.virtuallaunch.pro';
const TCVLP_LINK_KENNEDY = 'https://taxclaim.virtuallaunch.pro/kennedy';
const TCVLP_LINK_GALA = 'https://taxclaim.virtuallaunch.pro/gala';
const TCVLP_LINK_DEMO = 'https://cal.com/tax-monitor-pro/tcvlp-intro';
const TCVLP_LINK_INQUIRY = 'https://taxmonitor.pro/inquiry';
const TCVLP_COMPLIANCE = 'IRS penalty abatement is not guaranteed. Each claim depends on individual facts and circumstances.';

function tcDay(day, date, dayOfWeek, fb09Copy, fb15Copy, fbPersonalCopy, linkedinCopy, imagePrompt) {
  return {
    day,
    date,
    dayOfWeek,
    fbPage: [
      { time: '09:00', copy: fb09Copy },
      { time: '15:00', copy: fb15Copy },
    ],
    fbPersonal: { copy: fbPersonalCopy },
    linkedin: { copy: linkedinCopy },
    imagePrompt,
  };
}

const tcWeeks = [];

// --- TCVLP Week 1: Penalty Abatement Basics (Jul 13-19) ---
tcWeeks.push({
  weekNumber: 1,
  theme: 'Penalty Abatement Basics',
  dates: 'Jul 13 – Jul 19',
  focus: 'Reframe from Kwong-specific to evergreen IRS penalty relief.',
  days: [
    tcDay(1, '2026-07-13', 'Monday',
      `If the IRS hit you with a failure-to-file or failure-to-pay penalty in the last three years, you may be eligible for relief. There are several established paths: first-time abatement, reasonable cause, and statutory exceptions. The right path depends on your facts. Most taxpayers don't know any of these exist.\n\n${TCVLP_COMPLIANCE}`,
      `Penalty abatement is not a loophole. It's a formal IRS process built into the rules. The IRS denies most claims that are filed wrong, not because the taxpayer didn't qualify. Get them filed right the first time. Free check: link in bio.\n\n${TCVLP_COMPLIANCE}`,
      `If you paid IRS penalties in the last three years, there is a real chance the IRS will refund part or all of them. The process is called penalty abatement. It's not new and it's not a scam. Most pros don't push it because the paperwork is tedious. DM me if you want to know if you qualify.`,
      `Tax pros: penalty abatement is the cleanest revenue stream in your existing book of business. Every client who paid an IRS penalty in 2022, 2023, or 2024 is a candidate for first-time abatement, reasonable cause, or statutory relief. Form 843 is the vehicle. TaxClaim Pro automates the filing for $10/mo flat, unlimited clients. ${TCVLP_LINK_KENNEDY}`,
      'Professional infographic — three penalty-relief paths in a row (first-time abatement, reasonable cause, statutory exception). Clean blue/white. Form 843 partial overlay. Yellow accent.'
    ),
    tcDay(2, '2026-07-14', 'Tuesday',
      `First-time penalty abatement (FTA) is the simplest path. If you have a clean 3-year compliance record before the penalty year, you may qualify automatically. The IRS doesn't volunteer this. You have to ask. Form 843, plain language, sent to the right service center.\n\n${TCVLP_COMPLIANCE}`,
      `If your tax pro has not at least checked you for first-time abatement, ask them why. It is the lowest-friction relief path the IRS offers. Most CPAs are too busy with returns to chase it.\n\n${TCVLP_COMPLIANCE}`,
      `One of the easiest IRS relief paths nobody talks about: first-time abatement. If your last 3 years before the penalty were clean, the IRS will often grant abatement just for asking. Took me 12 minutes on a recent client. DM me if you want me to check yours.`,
      `First-time abatement is the highest-conversion relief path most tax pros under-use. Eligibility: clean 3-year compliance record + a single year with a penalty. Filed on Form 843 with the right boilerplate, granted in 4-8 weeks. TaxClaim Pro generates the filing in under 5 minutes. ${TCVLP_LINK_HOME}`,
      'Side-by-side checklist: 3 clean years on left, 1 penalty year on right, big check mark over Form 843. Blue/white professional, yellow accent.'
    ),
    tcDay(3, '2026-07-15', 'Wednesday',
      `Reasonable cause is the second IRS relief path. Illness, natural disaster, IRS error, reliance on a tax professional, fire, theft. The IRS rules list specific acceptable categories. The trick is documenting the cause and matching it to the rule.\n\n${TCVLP_COMPLIANCE}`,
      `If the IRS denied your reasonable cause request once, that is not the end. Re-filings with better documentation succeed regularly. Most pros do not bother. We do.\n\n${TCVLP_COMPLIANCE}`,
      `Reasonable cause for IRS penalties: illness, natural disaster, IRS error, reliance on a CPA who failed you. There is a documented list. The IRS approves these every day for taxpayers who file the request the right way. DM me to see if your situation fits.`,
      `Reasonable cause is the most negotiable IRS relief category. The framework is in IRM 20.1.1 and dozens of court rulings clarify what works. Documented illness, casualty, and reliance-on-professional are the three highest-conversion paths. Form 843 with attached affidavit and supporting docs. TaxClaim Pro templates the affidavit. ${TCVLP_LINK_HOME}`,
      'Reasonable cause categories listed in a clean column with example documentation. Stamp of "ACCEPTED" overlay. Professional blue/white.'
    ),
    tcDay(4, '2026-07-16', 'Thursday',
      `Statutory exceptions are the third relief path. These are penalties the IRS is required by law to abate when specific conditions are met — for example, written advice from the IRS that turned out to be wrong. Narrow but very strong when they apply.\n\n${TCVLP_COMPLIANCE}`,
      `If an IRS agent gave you written advice and you followed it, you cannot be penalized for the result. Section 6404(f). Most taxpayers do not even know they have this letter saved.\n\n${TCVLP_COMPLIANCE}`,
      `Did the IRS ever send you written advice you followed and a penalty came from it anyway? You can fight the penalty under §6404(f). DM me — happy to look at the letter.`,
      `IRS statutory relief categories tax pros routinely miss: §6404(f) reliance on written IRS advice, §6651(h) relief during installment agreements, §7508 combat-zone postponements. Each has a narrow but iron-clad fact pattern. Form 843 with the exact statutory citation. TaxClaim Pro's reasonable-cause and statutory templates ship with the right citations preloaded. ${TCVLP_LINK_HOME}`,
      'A federal statute book open to §6404 with highlighted text. Blue/white professional. Subtle gold accent on the highlight.'
    ),
    tcDay(5, '2026-07-17', 'Friday',
      `Penalty abatement does not require an attorney. Form 843 is a 1-page IRS form. The work is in the supporting language, not the filing. A good Enrolled Agent or CPA handles this routinely — often for less than the penalty refund pays back.\n\n${TCVLP_COMPLIANCE}`,
      `What you need to file Form 843: your IRS notice or transcript, the penalty amount, the year, and a one-paragraph reason. Everything else is templatable.\n\n${TCVLP_COMPLIANCE}`,
      `One myth: you need a lawyer to fight an IRS penalty. You don't. An Enrolled Agent or CPA handles this routinely. The IRS process is designed to be accessible. DM me if you want me to look at the letter.`,
      `Penalty abatement engagements are some of the cleanest hourly work in a tax practice. Average filing time with TaxClaim Pro: 15 minutes. Average client refund: $300-$2,500. Engagement fee: $200-$500. The math is durable. ${TCVLP_LINK_HOME}`,
      'Professional Enrolled Agent at desk reviewing a 1040 and a Form 843. Clean blue/white. EA badge visible.'
    ),
    tcDay(6, '2026-07-18', 'Saturday',
      `Saturday tip: pull your IRS account transcript. It lists every penalty you've been charged and the dollar amount. Free at IRS.gov. If you see anything in there from 2022, 2023, or 2024, it is worth a 10-minute phone call with a tax pro.\n\n${TCVLP_COMPLIANCE}`,
      `If your transcript shows codes 160, 161, 170, 180, or 270, those are penalty assessments. Each one is a possible refund target.\n\n${TCVLP_COMPLIANCE}`,
      `Spent the morning showing a client how to pull her IRS transcript. Free at IRS.gov, takes 5 minutes. We found three penalty assessments she didn't know about. All three are now in the abatement pipeline.`,
      `Saturday admin tip for tax pros: a transcript-pull blitz across your client base is the fastest way to surface penalty-relief opportunities. TaxClaim Pro ingests transcript codes (150, 160, 161, 170, 180, 270) and flags candidates. Run it once per quarter. ${TCVLP_LINK_HOME}`,
      'Sample IRS account transcript with penalty codes highlighted. Yellow highlights on 160 and 270. Clean and readable.'
    ),
    tcDay(7, '2026-07-19', 'Sunday',
      `Sunday recap. Three penalty-relief paths the IRS offers: first-time abatement, reasonable cause, statutory exceptions. All filed on Form 843. None require an attorney. Most taxpayers qualify for at least one. The hard part is finding out you can ask.\n\n${TCVLP_COMPLIANCE}`,
      `If you've ever paid an IRS penalty, this week's content is for you. Bookmark it and share it with anyone who has gotten an IRS letter.\n\n${TCVLP_COMPLIANCE}`,
      `Quiet Sunday. Recap of the week: three IRS penalty relief paths, one form, no attorney required. If you have ever paid an IRS penalty in the last three years, DM me — happy to do a free check.`,
      `Tax pros: this week's content was the foundation. Next week we walk through the IRS transcript codes (150, 810, 826, 971) that signal penalty-relief opportunities — and how to spot them inside your existing client base. ${TCVLP_LINK_KENNEDY}`,
      'Three-icon row: first-time abatement, reasonable cause, statutory. Clean blue/white. Professional summary card layout.'
    ),
  ],
});

// --- TCVLP Week 2: IRS Code Explainers (Jul 20-26) ---
tcWeeks.push({
  weekNumber: 2,
  theme: 'IRS Transcript Code Explainers',
  dates: 'Jul 20 – Jul 26',
  focus: 'Education on transcript codes — evergreen, high-search-volume content.',
  days: [
    tcDay(1, '2026-07-20', 'Monday',
      `IRS transcript code 150 means your tax return has been processed. The dollar amount next to it is the tax liability the IRS calculated. If that number is bigger than what you reported, the IRS made a change. If it's the same, you're aligned. This is where every IRS dispute starts.\n\n${TCVLP_COMPLIANCE}`,
      `If you got an IRS letter and it referenced your return, your transcript will show code 150. Pull the transcript at IRS.gov, free. Compare to your filed 1040. The difference is the dispute.\n\n${TCVLP_COMPLIANCE}`,
      `Spent the morning explaining IRS transcript code 150 to a client. It's the line that says 'your tax return was processed.' If that number doesn't match what you filed, something is wrong. Worth pulling your transcript and comparing.`,
      `Code 150 walk-throughs are a high-volume search topic for taxpayers and an underused content lane for tax pros. The pattern: short video or post explaining what 150 means, what dollar amount appears next to it, and what to do if the number is wrong. TaxClaim Pro generates the dispute letter in 4 minutes. ${TCVLP_LINK_HOME}`,
      'IRS transcript section showing code 150 with dollar amount circled in red. Annotated with arrow and label "Tax liability per IRS."'
    ),
    tcDay(2, '2026-07-21', 'Tuesday',
      `IRS transcript code 810 means your refund has been frozen. The IRS is reviewing your return. They have not denied anything yet — they want more information. If you see 810, do not ignore it. The freeze can stay in place for months without action.\n\n${TCVLP_COMPLIANCE}`,
      `Code 810 + a CP05 letter = the IRS is reviewing your refund. Respond fast and you get the refund back. Wait too long and the case escalates.\n\n${TCVLP_COMPLIANCE}`,
      `Anyone seeing code 810 on their IRS transcript: that's a refund freeze, not a denial. Respond to the letter that comes with it and you get your refund. Just don't ignore it. DM me if you got one.`,
      `Code 810 (refund freeze) is the second-most-asked-about transcript code among taxpayers we work with. Most cases resolve in 60-90 days when the response letter is filed correctly. Form 843 is not the right vehicle here — the response is to the underlying CP05/CP05A. TaxClaim Pro pivots to the right form automatically. ${TCVLP_LINK_HOME}`,
      'Transcript with code 810 highlighted, big red FROZEN stamp. CP05 letter peeking from the side. Professional layout.'
    ),
    tcDay(3, '2026-07-22', 'Wednesday',
      `IRS transcript code 826 means a refund from this tax year was applied to a prior-year balance. If you were expecting a refund and got nothing, code 826 is the explanation. The IRS used your refund to cover an old debt — sometimes correctly, sometimes not.\n\n${TCVLP_COMPLIANCE}`,
      `If code 826 appears and you do not actually owe a prior balance, that is a refund recovery case. Form 843 is the right tool.\n\n${TCVLP_COMPLIANCE}`,
      `Saw a client this week whose entire $4K refund disappeared. Code 826 — applied to a prior balance she had already paid. We pulled the records and the IRS double-counted. Refund coming back.`,
      `Code 826 is one of the highest-dollar transcript codes for taxpayer-recovery work. Common pattern: prior balance was paid via installment agreement but IRS posting lagged. TaxClaim Pro pulls the prior-year transcripts to verify the offset before drafting the recovery filing. ${TCVLP_LINK_HOME}`,
      'Transcript with code 826 highlighted, $4,000 amount visible. Arrow from current year to prior year balance. Blue/white.'
    ),
    tcDay(4, '2026-07-23', 'Thursday',
      `IRS transcript code 971 is a notice issued. It means the IRS has sent you a letter. If you see 971 and don't have the letter, it got lost. Call the IRS or go to your IRS.gov account to retrieve a copy.\n\n${TCVLP_COMPLIANCE}`,
      `971 is procedural — what matters is the letter that 971 references. The number next to 971 is the notice code (CP14, CP504, LT11, etc).\n\n${TCVLP_COMPLIANCE}`,
      `If you see code 971 on your transcript and never got the letter, it likely got lost in the mail. Call the IRS or pull it from your IRS.gov account. Don't let an unknown notice sit.`,
      `Code 971 is a procedural marker — its real value is the cross-reference to the notice code (CP14, CP504, CP05, LT11, CP2000). Our triage flow: pull transcript, identify 971-referenced notices, fetch each notice from the IRS portal, route to the right response form. TaxClaim Pro automates the routing. ${TCVLP_LINK_HOME}`,
      'Transcript with 971 line highlighted. Arrow pointing to a stack of IRS letters with codes CP14, CP504, etc visible.'
    ),
    tcDay(5, '2026-07-24', 'Friday',
      `Transcript code recap: 150 = return processed, 810 = refund frozen, 826 = refund applied to old balance, 971 = notice issued. If any of these show on your transcript and you don't know why, it's worth a phone call with a tax pro.\n\n${TCVLP_COMPLIANCE}`,
      `Bookmark this for the next time you pull your IRS transcript. Codes 150, 810, 826, 971 are the four most common ones taxpayers ask about.\n\n${TCVLP_COMPLIANCE}`,
      `Friday cheat sheet for anyone reading IRS transcripts: 150 (processed), 810 (frozen), 826 (offset), 971 (notice). DM me if any of these are on yours and the explanation isn't obvious.`,
      `Tax pros: a 4-code reference card (150, 810, 826, 971) in your client onboarding pack saves hours of explanation per case. Most clients have never opened a transcript. The reference card pays for itself by the second engagement. TaxClaim Pro ships a printable version. ${TCVLP_LINK_HOME}`,
      'Reference card layout — 4 transcript codes in 4 quadrants, each with definition and action. Clean professional design.'
    ),
    tcDay(6, '2026-07-25', 'Saturday',
      `Saturday tip: pull the IRS transcript before you call the IRS. Half of all calls go better when the taxpayer can read the transcript codes back. The IRS phone system rewards prepared callers.\n\n${TCVLP_COMPLIANCE}`,
      `If you have to call the IRS, have the transcript open. Have the notice in hand. Have the year and the SSN ready. The wait is bad enough — make the conversation count.\n\n${TCVLP_COMPLIANCE}`,
      `Saturday tip: if you ever have to call the IRS, pull your transcript first. The phone agents are fast when you can quote the code back. They get stuck when you cannot. Free at IRS.gov.`,
      `Tax pros: a transcript-first intake flow shaves 30+ minutes off the average IRS-call engagement. We require transcripts at intake. TaxClaim Pro auto-parses uploaded transcripts and pre-fills the relevant codes into the case file. ${TCVLP_LINK_HOME}`,
      'Phone with IRS hold music, laptop showing transcript, taxpayer prepared with notes. Cinematic.'
    ),
    tcDay(7, '2026-07-26', 'Sunday',
      `Sunday wrap. This week we covered four transcript codes that explain the most common IRS letters. If anything in your transcript looks unfamiliar, that's worth a free check. The transcript is the document that tells the truth about your IRS account.\n\n${TCVLP_COMPLIANCE}`,
      `Next week: how Form 843 actually works, line by line, and the $10/mo automation that makes it 5-minute work for tax pros.\n\n${TCVLP_COMPLIANCE}`,
      `Quiet Sunday. Recap of transcript codes 150, 810, 826, 971. Pull yours at IRS.gov — free, 5 minutes. DM me if anything looks weird.`,
      `Recap for tax pros: transcript-code education is the cheapest content layer for client trust. Clients who understand 150/810/826/971 close engagement faster and refer more. TaxClaim Pro's onboarding pack ships with the explainer card. ${TCVLP_LINK_KENNEDY}`,
      'Summary card — 4 transcript codes, week recap. Clean and bookmark-able.'
    ),
  ],
});

// --- TCVLP Week 3: $10/mo Automation + Form 843 Mechanics (Jul 27 - Aug 2) ---
tcWeeks.push({
  weekNumber: 3,
  theme: 'Form 843 Mechanics + $10/mo Automation',
  dates: 'Jul 27 – Aug 2',
  focus: 'Why a $10/mo Form 843 generator pays back on engagement #1.',
  days: [
    tcDay(1, '2026-07-27', 'Monday',
      `Form 843 is one page. It looks simple. The work is what you write in line 7 — the explanation. That paragraph decides whether the IRS abates the penalty. Generic explanations fail. Specific, documented, and rule-cited explanations succeed.\n\n${TCVLP_COMPLIANCE}`,
      `If your tax pro wrote one paragraph in line 7 and called it done, the abatement was probably denied. Real reasonable-cause writing pulls from IRM 20.1.1 and cites your facts.\n\n${TCVLP_COMPLIANCE}`,
      `Form 843 is the IRS penalty refund form. It's one page. Most pros under-write line 7 and the IRS denies. We have a template that wins. DM me to see one.`,
      `Tax pros: Form 843 line 7 is where most penalty abatement requests live or die. The IRS evaluator scans for: the specific facts, the cited rule (IRM 20.1.1.3.2 etc), the documentation reference. TaxClaim Pro templates all three. Average drafting time: 4 minutes. ${TCVLP_LINK_HOME}`,
      'Close-up of Form 843 with line 7 boxed and arrow. Annotation: "This paragraph wins or loses the case."'
    ),
    tcDay(2, '2026-07-28', 'Tuesday',
      `Where to mail Form 843 depends on the original return's processing center. Send it to the wrong place and it gets delayed by months. The IRS publishes the routing list but it changes. Check before you mail.\n\n${TCVLP_COMPLIANCE}`,
      `If you mailed Form 843 and have not heard back in 90 days, that's normal. 120 days is when you start calling. 180 days is when you escalate.\n\n${TCVLP_COMPLIANCE}`,
      `Reminder for anyone who filed Form 843 themselves: 90 days is normal silence. 120 you start calling. 180 you escalate. The IRS volume is huge.`,
      `Tax pros: the IRS Form 843 routing matrix is the kind of nit that delays a third of self-filed cases. TaxClaim Pro maintains the current routing table by service center and auto-routes based on the original return. ${TCVLP_LINK_HOME}`,
      'Map of US with IRS service centers marked. Routing arrows from a Form 843 to the correct center. Clean infographic.'
    ),
    tcDay(3, '2026-07-29', 'Wednesday',
      `What does $10/mo for unlimited Form 843 filings actually mean? You handle as many penalty abatement clients as your time allows. Each filing takes you 5 minutes instead of 45. The math compounds across your existing book.\n\n${TCVLP_COMPLIANCE}`,
      `If you have 100 clients and 30 of them paid an IRS penalty in the last 3 years, that's 30 abatement engagements at $300 each. $9,000 of revenue. The tool costs you $120/year.\n\n${TCVLP_COMPLIANCE}`,
      `Tax pros: most of you have $5K-$15K of penalty abatement revenue sitting in your existing book of business. The work is templatable. We built a tool. DM me.`,
      `TaxClaim Pro economics: $10/mo flat. Unlimited clients. Average tax pro working their existing book recovers $5-15K of abatement revenue in the first 90 days. The marginal cost of an additional engagement is your time only — not the tool. ${TCVLP_LINK_KENNEDY}`,
      'Bar chart — book of business on left, abatement revenue extracted on right. Tool cost rounding to zero.'
    ),
    tcDay(4, '2026-07-30', 'Thursday',
      `Penalty abatement is not a one-time service. Most clients qualify again every few years as new penalties hit. A standing quarterly transcript-pull keeps the relationship active and the engagements regular.\n\n${TCVLP_COMPLIANCE}`,
      `Tax pros who run a quarterly transcript audit across their book turn one-time clients into recurring revenue. The $10/mo tool prices itself in once a quarter.\n\n${TCVLP_COMPLIANCE}`,
      `Tax pros doing this right: a quarterly transcript pull on every active client. Surfaces penalties before the client even sees the letter. Recurring revenue.`,
      `The recurring-revenue play for tax pros: quarterly transcript audit + auto-flagged penalty candidates + Form 843 generation = a billable touchpoint every 90 days. TaxClaim Pro's batch transcript ingest runs the audit in under an hour for a 200-client book. ${TCVLP_LINK_HOME}`,
      'Calendar with 4 quarterly checkpoints. Each one shows transcript-audit-then-engagement flow. Professional.'
    ),
    tcDay(5, '2026-07-31', 'Friday',
      `End-of-month reminder: if you got an IRS penalty notice this month, you have time to respond. The first letter is rarely the last word. Most penalties have abatement paths if you act before the case escalates to collection.\n\n${TCVLP_COMPLIANCE}`,
      `If your IRS letter says "final notice", that is a different conversation. Earlier letters (CP14, CP501, CP503) are negotiable. Don't wait for "final."\n\n${TCVLP_COMPLIANCE}`,
      `End of July reminder: if you got an IRS penalty letter this month, don't sit on it. CP14 today is CP504 in 90 days is LT11 in 180 days. The earlier you respond, the cleaner the path.`,
      `Tax pros: late-July is the peak of CP14 wave for prior-year balances. Now through end of August is the highest-volume window for first-time-abatement filings on those notices. Batch them. TaxClaim Pro is built for batch. ${TCVLP_LINK_HOME}`,
      'IRS letter timeline — CP14 → CP501 → CP503 → CP504 → LT11 with abatement window highlighted in green for early stages.'
    ),
    tcDay(6, '2026-08-01', 'Saturday',
      `August check-in. If your tax practice is in summer slow-mode, this is the cheapest month of the year to run an abatement audit on your existing client base. Send a one-line email: "I'm running a free penalty review for clients this week — reply if you've paid an IRS penalty since 2022."\n\n${TCVLP_COMPLIANCE}`,
      `The replies to that email are your August revenue. The work runs you 5 minutes per client with the right tool.\n\n${TCVLP_COMPLIANCE}`,
      `August thought for tax pros: send a 1-line email to your client list — "free penalty review this week if you paid an IRS penalty since 2022". Your replies are your August revenue.`,
      `August opportunity for tax pros: client outreach with a single-question email surfaces 8-15% of your book as abatement candidates. The conversion to engagement is high because the ask is concrete and time-bound. TaxClaim Pro turns each engagement into a 5-minute filing. ${TCVLP_LINK_HOME}`,
      'Email mockup with subject "Free penalty review — reply this week" and a few replies stacking up. Modern.'
    ),
    tcDay(7, '2026-08-02', 'Sunday',
      `Sunday recap. Form 843 is the right tool. Line 7 is where the case is won. $10/mo unlimited filings is the math. Quarterly transcript audits are the recurring revenue play. Late-July CP14 wave is right now.\n\n${TCVLP_COMPLIANCE}`,
      `Next week: long-game positioning, what penalty abatement looks like as a permanent practice line and not a one-quarter campaign.\n\n${TCVLP_COMPLIANCE}`,
      `Quiet Sunday. Recap: Form 843, line 7, $10/mo, quarterly audits, August wave. DM me if you want the template.`,
      `Recap for tax pros: this week reframed penalty abatement as a structural practice line — not a side hustle. Next week: how to position the service in client communications and what the long-term economics look like across your book. ${TCVLP_LINK_KENNEDY}`,
      'Recap card — 4 key takeaways with icons. Bookmark style.'
    ),
  ],
});

// --- TCVLP Week 4: Long-Game Positioning (Aug 3-9) ---
tcWeeks.push({
  weekNumber: 4,
  theme: 'Long-Game Positioning — Penalty Abatement as a Practice Line',
  dates: 'Aug 3 – Aug 9',
  focus: 'How to make penalty abatement permanent revenue, not a campaign.',
  days: [
    tcDay(1, '2026-08-03', 'Monday',
      `Penalty abatement is not a fad. The IRS issues over 40 million penalty notices a year. The relief paths (first-time abatement, reasonable cause, statutory) are written into the rules. This is permanent work, not a special.\n\n${TCVLP_COMPLIANCE}`,
      `Most tax pros treat abatement as a one-time service. Tax pros who treat it as a recurring service double their per-client revenue.\n\n${TCVLP_COMPLIANCE}`,
      `Tax pros: penalty abatement is permanent IRS work, not a campaign. 40M+ penalty notices a year. Most go unchallenged because nobody asks. Be the one who asks.`,
      `Long-view positioning: penalty abatement is structurally a recurring service because the IRS keeps issuing penalties every year. Treat it like a quarterly health check, not a one-time engagement. The pros who set this rhythm in 2026 are the ones whose client retention beats their peers in 2027 and 2028. TaxClaim Pro is the production engine. ${TCVLP_LINK_HOME}`,
      'Bar chart of IRS penalty notices issued per year — flat at 40M+. Permanent work indicator.'
    ),
    tcDay(2, '2026-08-04', 'Tuesday',
      `What penalty abatement looks like in your engagement letter: a quarterly transcript review + filing of any qualifying Form 843 + reporting on outcomes. Priced as a flat add-on or rolled into a retainer. Either works.\n\n${TCVLP_COMPLIANCE}`,
      `The clients who keep coming back for tax filing are the same clients you should be running quarterly transcript audits for. One pass through, multiple engagements per year.\n\n${TCVLP_COMPLIANCE}`,
      `Engagement letter add-on for tax pros: "Quarterly IRS transcript review + Form 843 filings as needed". $50-100/qtr per client. Recurring. Easy yes for most clients.`,
      `Tax pros: integrating Form 843 work into the standard engagement letter at $50-100/quarter per client converts a one-time abatement into a per-quarter recurring revenue line. Average client lifetime: 6+ years. The compounding is real. TaxClaim Pro is the unit-cost component. ${TCVLP_LINK_KENNEDY}`,
      'Engagement letter mockup with quarterly transcript-review clause highlighted. Professional.'
    ),
    tcDay(3, '2026-08-05', 'Wednesday',
      `Client communication: explain penalty abatement once, in a one-page handout, included with their first engagement. Most clients read it. Some realize they have a penalty case. All of them remember it.\n\n${TCVLP_COMPLIANCE}`,
      `The handout pays for itself in the first three referred clients.\n\n${TCVLP_COMPLIANCE}`,
      `Tax pros — a one-page penalty abatement handout in your onboarding pack does the marketing for you. Some clients will tell their friend who got a penalty letter. Compounds.`,
      `Marketing-by-handout is one of the highest-conversion playbooks for tax pros. A one-page penalty abatement explainer included in client onboarding triggers 3-5 referred cases per year for a typical solo practice. TaxClaim Pro ships a printable handout in the onboarding pack. ${TCVLP_LINK_HOME}`,
      'Glossy one-page handout titled "What is IRS Penalty Abatement?" Professional design.'
    ),
    tcDay(4, '2026-08-06', 'Thursday',
      `What about clients who are not currently in a penalty? Run a one-time historical scan when they onboard. If they paid a penalty in the last 3 years, file Form 843 in the first 90 days of the engagement. Strong relationship signal.\n\n${TCVLP_COMPLIANCE}`,
      `New-client onboarding flow: 1) Get the transcript. 2) Scan for penalties. 3) File Form 843 if applicable. 4) Set quarterly cadence.\n\n${TCVLP_COMPLIANCE}`,
      `Tax pros: the most underrated onboarding step is pulling the new client's transcript and scanning for penalties they paid before they came to you. Easy refund, instant trust.`,
      `New-client onboarding playbook for tax pros: pull historical transcripts, scan 3 years back for penalty assessments, file Form 843 on any qualifiers in the first 90 days. The first-engagement refund builds trust faster than any other deliverable. TaxClaim Pro's batch ingest runs the historical scan in 2 minutes. ${TCVLP_LINK_HOME}`,
      'Onboarding flow diagram — 4 boxes with arrows. Clean. Professional blue/white.'
    ),
    tcDay(5, '2026-08-07', 'Friday',
      `Friday economics. A solo tax pro with 80 clients running quarterly abatement audits at $75/quarter recurring + $300 per actual filing recovers $20K+ per year in new revenue from the existing book. Tool cost: $120. Net: $19,880.\n\n${TCVLP_COMPLIANCE}`,
      `That math repeats every year. The audits compound. Some clients have penalties every year, some every other year. The book becomes a steady revenue source.\n\n${TCVLP_COMPLIANCE}`,
      `Solo tax pro math for the doubters: 80 clients × $75/qtr quarterly audits + ~10 actual filings × $300 = $20K/yr from existing book. Tool: $120/yr. Net: $19,880.`,
      `Long-run economics for a solo tax pro adopting penalty abatement as a recurring practice line: $15-25K of new annual revenue from the existing book. The math holds because IRS penalty volume is structural and the audit cadence makes the engagement repeatable. TaxClaim Pro is the marginal-cost-zero production engine. ${TCVLP_LINK_KENNEDY}`,
      'Spreadsheet math visual: revenue line items, $19,880 highlighted. Professional and convincing.'
    ),
    tcDay(6, '2026-08-08', 'Saturday',
      `Saturday tip: keep a running list of every Form 843 you've filed and the outcome. After 12 months, you have a case-success rate by category. That data informs which paths to push first on new clients.\n\n${TCVLP_COMPLIANCE}`,
      `Pros who track win rates outperform pros who file blind. The IRS does not improve on its own — your filings get sharper.\n\n${TCVLP_COMPLIANCE}`,
      `Saturday tip for tax pros adopting abatement work: keep a simple log of every Form 843 — category, outcome, IRS response time. After a year you have a real win-rate dataset. Sharpens every future filing.`,
      `Tax pros: a simple Form 843 outcomes log (date filed, category — first-time/reasonable-cause/statutory, IRS response time, outcome) over 12 months produces a win-rate dataset that rivals what mid-size firms charge consultants for. TaxClaim Pro logs all of this automatically. ${TCVLP_LINK_HOME}`,
      'Spreadsheet with Form 843 cases — categorized, win rates calculated. Clean professional.'
    ),
    tcDay(7, '2026-08-09', 'Sunday',
      `Sunday wrap. Penalty abatement is a permanent practice line. The math works at any practice size. The work is templatable. The IRS keeps issuing penalties. The clients keep needing relief.\n\n${TCVLP_COMPLIANCE}`,
      `If you have read this far and not started, the move is to subscribe and run one historical transcript scan on your next client meeting. The first refund pays for the rest of the year.\n\n${TCVLP_COMPLIANCE}`,
      `Quiet Sunday. End of the post-Kwong content series. Penalty abatement is permanent work. The math is durable. DM me if you want to set up the workflow.`,
      `Closing the post-Kwong series: penalty abatement is the structurally durable practice line. Recurring, templatable, scalable. The pros who set the rhythm in 2026 are positioned for 2027-2028 client retention and revenue stability. TaxClaim Pro is the operating layer. ${TCVLP_LINK_KENNEDY}`,
      'Final summary card — 4-week recap. Permanent practice line theme. Professional design.'
    ),
  ],
});

const tcvlpFile = {
  campaign: {
    name: 'TaxClaim Pro — Post-Kwong Evergreen Penalty Abatement',
    start: '2026-07-13',
    end: '2026-08-09',
    operator: 'Jamie L. Williams, EA, CB, OTC',
    product: {
      name: 'TaxClaim Pro',
      price: '$10/mo flat, unlimited clients',
      domain: 'taxclaim.virtuallaunch.pro',
      gala: 'taxclaim.virtuallaunch.pro/gala',
      kennedy: 'taxclaim.virtuallaunch.pro/kennedy',
      inquiry: 'taxmonitor.pro/inquiry',
      demo: 'cal.com/tax-monitor-pro/tcvlp-intro',
    },
    hooks: {
      taxpayer: 'If you paid an IRS penalty in the last three years, the IRS may owe you that money back. We help tax pros file Form 843 in 5 minutes.',
      taxPro: 'Penalty abatement is the cleanest revenue stream in your existing book. $10/mo flat, unlimited Form 843 filings.',
    },
    compliance: TCVLP_COMPLIANCE,
    citation: 'IRM 20.1.1; Form 843; first-time abatement, reasonable cause, statutory exception',
  },
  weeks: tcWeeks,
};

fs.writeFileSync(path.join(OUT_DIR, '.tcvlp-post-kwong.json'), JSON.stringify(tcvlpFile, null, 2));

// ===========================================================================
// TAVLP — post-Kwong: pivot from "Kwong is the launch fuel" to
// "IRS codes are the long game" — 4 weeks, evergreen content lanes.
// Schema matches existing tavlp-campaign-content.json.
// ===========================================================================

const TAVLP_URL_MAIN = 'https://taxavatar.virtuallaunch.pro';
const TAVLP_URL_AVATARS = 'https://taxavatar.virtuallaunch.pro/avatars';
const TAVLP_URL_BOOK = 'https://cal.com/tax-monitor-pro/tax-avatar-virtual-launch-pro';

function taDay(date, dayNumber, title, fb1, fb2, li, imagePrompt) {
  return {
    date,
    dayNumber,
    title,
    fbPage: [
      { time: '09:00', title: fb1.title, copy: fb1.copy },
      { time: '15:00', title: fb2.title, copy: fb2.copy },
    ],
    linkedin: { title: li.title, copy: li.copy },
    imagePrompt,
  };
}

const tavlpWeeks = [
  // --- TAVLP post-Kwong Week 1: IRS codes channel ---
  {
    weekNumber: 1,
    weekLabel: 'IRS Codes — the long-game channel',
    days: [
      taDay('2026-07-13', 71, 'IRS codes are the long game',
        { title: 'After Kwong', copy: `The Kwong window closed. The IRS code search traffic did not.\n\nTranscript codes 150, 810, 826, 971 are searched by panicked taxpayers every day of the year.\n\nA Tax Avatar Pro channel built around these codes is the long-game asset.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Evergreen', copy: `Kwong was the spike. IRS codes are the steady state.\n\n6 avatars. Unlimited videos. $29/mo.\n\nPick a code. Ship a video. Repeat.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Pivoting from a deadline campaign to evergreen content',
          copy: `The Kwong campaign closed July 10. The Tax Avatar Pro channels that ran the campaign now have 50+ videos and a working booking funnel.\n\nThe next move is to pivot from deadline-driven content to evergreen content.\n\nThe highest-volume evergreen lane on YouTube for tax pros is IRS transcript codes. Codes 150, 810, 826, 971 — and 30 others — are searched daily by taxpayers who just received a confusing letter.\n\nThe channels that build a one-code-per-video library compound for years. Each video is evergreen, each one ranks for a specific search query, and the audience finds you when they need help — which is the moment you can convert.\n\nTax Avatar Pro is the production engine. The library is the asset.\n\n${TAVLP_URL_MAIN}` },
        'Calendar with July 10 crossed out and arrow forward to evergreen content library, hot pink'
      ),
      taDay('2026-07-14', 72, 'Code 150',
        { title: 'Code 150', copy: `IRS transcript code 150 = your return was processed.\n\nThe number next to it = the IRS's calculation of your tax liability.\n\nIf it does not match what you filed, the IRS made a change.\n\nA 4-minute avatar video on this is one of the highest-volume tax searches.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Title format', copy: `Title: "What does IRS transcript code 150 mean?"\n\nDescription: keyword stack. CTA. Pinned booking link.\n\nRender, upload, ship.\n\n${TAVLP_URL_MAIN}` },
        { title: 'How to script a 4-minute IRS-code video',
          copy: `For tax pros building a Tax Avatar Pro channel around IRS codes, the scripting pattern is templatable:\n\n1. 0:00 — state the code in the title and the first sentence.\n2. 0:15 — define what it means in plain English.\n3. 1:00 — show what it looks like on a real transcript (screen recording).\n4. 2:00 — explain the most common scenario where this code appears.\n5. 3:00 — explain when to act and when not to.\n6. 3:30 — CTA: book a consult.\n\nWith Tax Avatar Pro, the production is 30 minutes. Render is 5. Upload and metadata is 5.\n\nOne 40-minute work session per week = 4 ranking videos per month.\n\n${TAVLP_URL_MAIN}` },
        'Avatar with on-screen overlay of IRS transcript showing code 150 highlighted, hot pink'
      ),
      taDay('2026-07-15', 73, 'Code 810',
        { title: 'Code 810', copy: `IRS transcript code 810 = refund frozen.\n\nIt is not a denial. It means the IRS is reviewing.\n\nMost cases resolve in 60-90 days when the right response goes out.\n\nA video on this saves panic.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Demand signal', copy: `When the IRS sends a CP05 letter, the search volume on "code 810" spikes for 2 weeks.\n\nA video that ranks captures that wave.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Code 810 — the refund-freeze video that converts',
          copy: `Of all the IRS code videos on YouTube, code 810 (refund freeze) has the highest viewer panic. The audience is searching at peak anxiety: \"my refund disappeared and the transcript shows 810\".\n\nThe video that lands does three things:\n\n1. Removes the panic — \"this is not a denial\".\n2. Explains the timeline — \"60 to 90 days typical\".\n3. Names the response — \"respond to the CP05 letter the IRS sent with this freeze\".\n\nViewers in this state convert. They have already decided they need help and they are looking for someone who can explain it. Be that someone.\n\nWith Tax Avatar Pro, this video is 35 minutes of script + render. The booking link in the description does the rest.\n\n${TAVLP_URL_MAIN}` },
        'Avatar with calm composure, transcript with 810 highlighted, "FROZEN not DENIED" text overlay, hot pink'
      ),
      taDay('2026-07-16', 74, 'Code 826',
        { title: 'Code 826', copy: `IRS code 826 = your refund was applied to a prior balance.\n\nSometimes correct. Sometimes the IRS made a posting mistake.\n\nA video walking through both cases is the third-most-searched code on YouTube.\n\n${TAVLP_URL_MAIN}` },
        { title: 'High-dollar conversion', copy: `826 cases involve real money. Booking conversion is highest of any code video.\n\nWrite once. Rank for years.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Code 826 — the highest-dollar conversion video',
          copy: `Code 826 (refund applied to prior balance) is the highest-conversion video in the IRS-code lineup for tax pros, by my read.\n\nReason: the dollar amounts are real. A taxpayer expecting a $4,000 refund who finds code 826 instead is motivated to act.\n\nThe video pattern that converts:\n\n1. Define the code.\n2. Show the transcript example (screen recording).\n3. Explain the legitimate scenario (prior balance owed).\n4. Explain the error scenario (prior balance already paid but posting lagged).\n5. CTA: \"if your refund disappeared and you do not know why, book a consult\".\n\nThe error scenario alone is enough to drive bookings. We see this in our test channel data.\n\nWith Tax Avatar Pro, this is one afternoon of script + render. The library compounds.\n\n${TAVLP_URL_MAIN}` },
        'Avatar pointing to transcript code 826 with "where did my refund go?" text, hot pink'
      ),
      taDay('2026-07-17', 75, 'Code 971',
        { title: 'Code 971', copy: `IRS code 971 = a notice was issued.\n\nIt is a procedural marker. The real action is the notice it references — CP14, CP504, CP05, LT11, CP2000.\n\nVideo: how to use 971 to find the notice you missed.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Cross-reference', copy: `971 is the index. The cross-referenced notice is the substance.\n\nA channel that builds the index videos AND the notice videos owns the entire query stack.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Code 971 — the index video that drives the rest of the channel',
          copy: `Code 971 is procedurally important but content-thin on its own. The value is what 971 cross-references: CP14, CP504, CP05, LT11, CP2000.\n\nThe smart channel structure: 971 video is the hub. Each linked notice gets its own video. The hub video links to all of them. The notice videos link back to the hub.\n\nThis is YouTube SEO 101 applied to IRS content. Internal linking signals topical authority. The algorithm rewards channels that own a query cluster.\n\nTax Avatar Pro production cost for the full cluster (971 hub + 5 notice videos): one weekend. After that the cluster ranks together for years.\n\nThe library is the asset.\n\n${TAVLP_URL_MAIN}` },
        'Hub-and-spoke diagram — 971 in center, CP14/CP504/CP05/LT11/CP2000 around it, hot pink'
      ),
      taDay('2026-07-18', 76, 'Saturday — script day',
        { title: 'Saturday script time', copy: `Saturdays are the cheapest content production day for tax pros.\n\nNo phones. No client calls.\n\n3 hours = 4 weeks of avatar videos.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Batch the renders', copy: `Tax Avatar Pro renders 4 videos in one sitting. Hit publish on the schedule. Done.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Saturday batch days as the production rhythm',
          copy: `The pros who sustain a Tax Avatar Pro channel for 12+ months all converge on the same rhythm: Saturday batch days.\n\n3 hours, every other Saturday. Script 4 videos. Render 4 videos. Schedule them across the next 4 weeks.\n\n6 batch days per quarter = 24 ranking videos per quarter = 96 ranking videos per year.\n\nNo daily content treadmill. No production stress. The channel just publishes.\n\n${TAVLP_URL_MAIN}` },
        'Empty Saturday office with laptop and 4 video thumbnails queued, hot pink'
      ),
      taDay('2026-07-19', 77, 'Week 1 wrap',
        { title: 'Codes are evergreen', copy: `4 codes covered this week. ~30 codes total in the IRS transcript universe.\n\n30 videos = 30 evergreen rankings.\n\n7 weeks of work with Tax Avatar Pro.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Next', copy: `Next week: notice walkthroughs. CP14, CP2000, CP504, LT11, CP90.\n\nThe library compounds.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Closing week 1 of the post-Kwong evergreen pivot',
          copy: `Week 1 of the post-Kwong content shift covered the four most-searched IRS transcript codes — 150, 810, 826, 971.\n\nA tax pro who scripts and ships these four videos has four evergreen rankings that compound for years.\n\nThe ~30-code IRS transcript universe is roughly 7 weekend batch days of work with Tax Avatar Pro. After that the library produces returns on autopilot.\n\nNext week: the IRS notice walkthrough series. CP14, CP2000, CP504, LT11, CP90.\n\nThe library is the asset.\n\n${TAVLP_URL_MAIN}` },
        'Library shelf with 4 books labeled with codes 150/810/826/971, hot pink'
      ),
    ],
  },

  // --- TAVLP post-Kwong Week 2: Notice Walkthroughs ---
  {
    weekNumber: 2,
    weekLabel: 'Notice Walkthroughs — riding IRS mail waves',
    days: [
      taDay('2026-07-20', 78, 'CP14',
        { title: 'CP14', copy: `CP14 = first IRS balance-due notice.\n\nMost taxpayers panic. Most cases are negotiable at this stage.\n\nThe video: what CP14 means, what to do this week, what NOT to do.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Late-July spike', copy: `CP14 search volume spikes mid-July to late August every year.\n\nIf you publish now, you catch the wave.\n\n${TAVLP_URL_MAIN}` },
        { title: 'CP14 — the first-notice video that converts',
          copy: `CP14 (initial balance-due notice) is the highest-volume IRS notice search every year, by a wide margin. The wave hits mid-July through August as the IRS works through the post-April-15 backlog.\n\nThe video that captures this wave does four things:\n\n1. Defines the notice.\n2. Calms the panic — \"this is the first letter, not the last\".\n3. Explains the response options (pay, payment plan, dispute).\n4. CTA: \"book a consult before you pay anything you do not owe\".\n\nA Tax Avatar Pro video published the third week of July typically pulls the largest single-month traffic of any notice video on the channel.\n\n${TAVLP_URL_MAIN}` },
        'Avatar with CP14 letter on screen, calm explainer pose, hot pink'
      ),
      taDay('2026-07-21', 79, 'CP2000',
        { title: 'CP2000', copy: `CP2000 = the IRS thinks your reported income did not match what they got from third parties (W-2s, 1099s).\n\nIt is a proposed adjustment, not a final bill.\n\nMost cases close with a corrected return, not a payment.\n\n${TAVLP_URL_MAIN}` },
        { title: 'The mismatch wave', copy: `CP2000s peak in late summer and fall as the IRS finishes matching third-party reports.\n\nA video that ranks captures the entire wave.\n\n${TAVLP_URL_MAIN}` },
        { title: 'CP2000 — the proposed-adjustment video that wins on calm',
          copy: `CP2000 notices scare taxpayers because the proposed adjustment is usually a 4- or 5-figure number. Most cases resolve without the taxpayer paying that amount.\n\nThe video that performs:\n\n1. Defines the notice in plain English.\n2. Names the trigger — third-party mismatch (W-2s, 1099s, 1099-Bs, K-1s).\n3. Explains the response — agree, partially agree, dispute.\n4. Calms the dollar-amount panic.\n5. CTA: \"do not sign and return without checking your records\".\n\nWith Tax Avatar Pro, the production is templatable. The first version takes an hour. The next 5 take 30 minutes each.\n\n${TAVLP_URL_MAIN}` },
        'CP2000 letter on screen with line items and check marks/Xs, calm avatar, hot pink'
      ),
      taDay('2026-07-22', 80, 'CP504',
        { title: 'CP504', copy: `CP504 = final notice intent to levy state refund.\n\nNot the same as LT11. Different statutory rights. Different urgency.\n\nA video clarifying the difference is one of the highest-converting IRS notice videos.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Pre-LT11 window', copy: `CP504 is the warning shot. The next letter is LT11 — different rules. Most taxpayers conflate them.\n\n${TAVLP_URL_MAIN}` },
        { title: 'CP504 vs LT11 — the distinction nobody on YouTube explains correctly',
          copy: `CP504 is regularly conflated with LT11 in YouTube content. They are different notices with different statutory rights.\n\nCP504: final notice of intent to levy a state refund. Triggered after multiple unpaid balance reminders. Does NOT confer Collection Due Process (CDP) hearing rights.\n\nLT11: final notice of intent to levy and right to a hearing. The CDP hearing is the procedural protection most taxpayers do not know they have.\n\nA Tax Avatar Pro video that clarifies the distinction in 4 minutes is one of the highest-conversion notice videos on the channel — because the audience watching CP504 content is at peak anxiety AND most existing YouTube videos on the topic are wrong.\n\nThe library compounds when the content is correct.\n\n${TAVLP_URL_MAIN}` },
        'Side-by-side comparison — CP504 left, LT11 right, with statutory rights listed under each, hot pink'
      ),
      taDay('2026-07-23', 81, 'LT11',
        { title: 'LT11', copy: `LT11 = final notice with right to a Collection Due Process hearing.\n\nThe hearing is the protection most taxpayers do not realize they have.\n\nA video on this saves taxpayers from levy in real cases.\n\n${TAVLP_URL_MAIN}` },
        { title: 'CDP hearing', copy: `Filing Form 12153 within 30 days of LT11 freezes collection.\n\nThe video pays for itself for any taxpayer who watches it.\n\n${TAVLP_URL_MAIN}` },
        { title: 'LT11 — the CDP hearing video that protects taxpayers',
          copy: `LT11 (final notice of intent to levy + right to hearing) is the most consequential IRS notice for an unpaid balance, and the response window is short — 30 days to file Form 12153.\n\nA Tax Avatar Pro video that walks through:\n\n1. What LT11 means.\n2. The 30-day clock.\n3. Form 12153 — what it is and how to file it.\n4. What a CDP hearing actually does (freezes collection, opens negotiation).\n5. CTA: \"if you got LT11, the clock is running, call now\".\n\n— performs strongly because the audience is in active crisis. The booking conversion rate on LT11 traffic is among the highest in the channel.\n\nWrite once. Rank for years. Help real taxpayers. The math is durable.\n\n${TAVLP_URL_MAIN}` },
        'LT11 letter with red 30-day countdown circled, Form 12153 underneath, hot pink'
      ),
      taDay('2026-07-24', 82, 'CP90',
        { title: 'CP90', copy: `CP90 = final notice intent to seize assets (Federal Payment Levy Program).\n\nApplies primarily to federal contractors and Social Security garnishment cases.\n\nNarrow but high-stakes.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Specialized lane', copy: `CP90 search volume is lower than CP14, but the audience is smaller and more motivated.\n\nGreat niche video lane.\n\n${TAVLP_URL_MAIN}` },
        { title: 'CP90 — the niche notice with high-intent traffic',
          copy: `CP90 has a fraction of the search volume of CP14 — but the audience is concentrated and the engagement value is high. Federal contractors, Social Security recipients, and federal payment recipients facing the Federal Payment Levy Program (FPLP).\n\nFor a tax pro with a niche in any of these areas, a CP90 video is one of the highest-leverage pieces of content possible.\n\nThe video pattern:\n\n1. Define the notice.\n2. Name the FPLP — most taxpayers have never heard the acronym.\n3. Explain the response window and options.\n4. CTA: \"if you got CP90 and rely on federal payments, call this week\".\n\nLow volume, high conversion. The library benefits from specialty lanes.\n\n${TAVLP_URL_MAIN}` },
        'CP90 letter with FPLP graphic showing federal payment seizure, hot pink'
      ),
      taDay('2026-07-25', 83, 'Saturday — notice cluster build',
        { title: 'Cluster day', copy: `If you spent today building the notice cluster — CP14, CP2000, CP504, LT11, CP90, plus the 971 hub — you have 6 ranking videos by Monday.\n\n${TAVLP_URL_MAIN}` },
        { title: '6 videos one weekend', copy: `Tax Avatar Pro production cost: one Saturday. Library payoff: years.\n\n${TAVLP_URL_MAIN}` },
        { title: 'The notice cluster build — one weekend, six ranking videos',
          copy: `For tax pros looking for a single highest-leverage weekend in 2026, the IRS notice cluster build is at the top of the list.\n\n6 videos: CP14, CP2000, CP504, LT11, CP90, plus the 971 hub video that links to all five.\n\nProduction with Tax Avatar Pro: roughly 4 hours of script + render across one Saturday. Internal linking handled in YouTube descriptions.\n\nThe cluster ranks as a unit. Internal linking signals topical authority to YouTube's algorithm. Each video links to the others; viewers consume 2-3 in a session; channel watch-time metrics improve.\n\nOne weekend. Six ranking videos. Years of evergreen returns.\n\n${TAVLP_URL_MAIN}` },
        '6-video grid with linking arrows showing internal cluster, hot pink'
      ),
      taDay('2026-07-26', 84, 'Week 2 wrap',
        { title: 'Notice library', copy: `5 notices + 1 hub = 6 evergreen videos.\n\nNext week: niche × topic — combining notices with audience segments.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Library compounding', copy: `2 weeks into the post-Kwong shift, the library is at 14 videos.\n\nThe channel is ranking. The booking funnel is working.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Two weeks into the post-Kwong evergreen library',
          copy: `Two weeks into the post-Kwong content pivot, a Tax Avatar Pro channel that followed the schedule has:\n\n- Week 1: 4 IRS code videos (150, 810, 826, 971).\n- Week 2: 6 notice videos (CP14, CP2000, CP504, LT11, CP90, plus the 971-hub cross-ref).\n\nTotal: 10 evergreen videos. Each one ranking for a high-volume tax-procedure search.\n\nThe channel is past the cold-start phase. The booking funnel is converting. The library compounds from here.\n\nNext week: niche × topic — combining notice content with audience segments (truckers, real-estate investors, crypto traders, multi-state remote workers).\n\n${TAVLP_URL_MAIN}` },
        'Library shelf — 10 books, 2 rows. Hot pink accent.'
      ),
    ],
  },

  // --- TAVLP post-Kwong Week 3: Niche × Topic ---
  {
    weekNumber: 3,
    weekLabel: 'Niche × Topic — owning the SEO intersection',
    days: [
      taDay('2026-07-27', 85, 'Niche × topic basics',
        { title: 'Niche the topic', copy: `Generic tax content is crowded. Niche × topic is empty.\n\n"Form 843 for truckers". "CP2000 for crypto traders". "Multi-state tax for remote tech workers".\n\nEach intersection ranks fast.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Pick where you already work', copy: `The shortcut: niche where your existing book of business already is.\n\nYou already know the questions. Tax Avatar Pro turns them into video.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Niche × topic — the SEO play that solo pros can win',
          copy: `Generalist tax content competes with every channel. Niche × topic competes with almost nothing.\n\nFor a solo tax pro with an existing book of business, the move is to identify the niche your book is already in (or where you want it to go) and build the content cluster at the intersection of that niche and the high-volume topics.\n\nExamples:\n\n- Trucker tax × penalty abatement.\n- Real-estate investor × CP2000.\n- Crypto trader × IRS code 826.\n- Multi-state remote worker × LT11.\n\nEach intersection has under-served search volume. Each one is a video a Tax Avatar Pro user can ship in 30 minutes.\n\n${TAVLP_URL_MAIN}` },
        'Venn diagram — niche on left, topic on right, intersection highlighted, hot pink'
      ),
      taDay('2026-07-28', 86, 'Trucker tax × penalty',
        { title: 'OTR drivers', copy: `Trucker tax is one of the most under-served niches on YouTube.\n\nSchedule C, per diem, owner-operator vs employee, multi-state, penalty exposure — all topics.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Avatar fits', copy: `For OTR audiences, Knox or Tariq read more authentic than the generalist tax-tube vibe.\n\n${TAVLP_URL_AVATARS}` },
        { title: 'Trucker tax — an under-served niche with high pro-fit',
          copy: `Trucker tax (especially owner-operator and OTR) is one of the highest-leverage niches for solo tax pros in 2026.\n\nWhy:\n\n1. The audience is large (~3M owner-operators in the US).\n2. The tax issues are complex enough to need a pro (Schedule C, per diem, multi-state, fuel taxes, S-corp election).\n3. Existing YouTube content is thin and outdated.\n4. Penalty exposure is high — late filings, missed quarterly estimates, multi-state issues.\n\nA Tax Avatar Pro channel built around \"Trucker tax explained\" with 30 niche × topic videos can rank fast and pull qualified leads year-round.\n\n${TAVLP_URL_MAIN}` },
        'Truck on highway with overlay of Schedule C and per diem icons, hot pink'
      ),
      taDay('2026-07-29', 87, 'RE investor × CP2000',
        { title: 'Real-estate audiences', copy: `Real-estate investors trigger CP2000 notices regularly — 1099-S, 1099-MISC, K-1 mismatches.\n\nA video on \"CP2000 for short-term rental hosts\" pulls qualified search.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Niche conversion', copy: `STR / Airbnb / VRBO host audiences search the same questions repeatedly. Rank once, lead forever.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Real-estate investor × CP2000 — a worked SEO example',
          copy: `Concrete example of niche × topic for a tax pro:\n\nNiche: short-term rental hosts.\nTopic: CP2000 notices.\nQuery the audience types: \"got a CP2000 about my Airbnb\".\n\nA generic CP2000 video does not rank for this query. A niche-specific video — \"CP2000 for short-term rental hosts (Airbnb, VRBO)\" — does.\n\nThe pattern repeats:\n\n- Real-estate investors × form 8825.\n- STR hosts × passive activity rules.\n- Real-estate investors × Schedule E penalty exposure.\n- Real-estate investors × code 1099-S mismatches.\n\nWith Tax Avatar Pro, this is one weekend of content for a tax pro whose book is already heavy on real-estate clients.\n\n${TAVLP_URL_MAIN}` },
        'Airbnb listing with CP2000 letter overlay, hot pink'
      ),
      taDay('2026-07-30', 88, 'Crypto × code 826',
        { title: 'Crypto traders', copy: `Crypto traders generate IRS notices at higher rates than W-2 earners. Reporting mismatches, 1099-B issues, basis disputes.\n\nA video on \"IRS code 826 for crypto traders\" finds an audience that searches every refund cycle.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Sharp avatar', copy: `For crypto-native audiences, Tariq or Genesis fit better than Knox.\n\n${TAVLP_URL_AVATARS}` },
        { title: 'Crypto trader audiences — sharp content, sharp avatar',
          copy: `Crypto traders are one of the highest-anxiety audiences in tax-procedure content. The reporting rules are complex, the broker 1099-Bs are inconsistent, and the IRS notices come with significant dollar exposure.\n\nA Tax Avatar Pro channel that builds the crypto × IRS content cluster:\n\n- IRS code 826 for crypto traders (refund offset).\n- CP2000 for crypto wash-sale mismatches.\n- Form 843 for crypto-trader penalty abatement.\n- Code 810 for under-reported crypto income.\n\nProduction note: the audience is younger and crypto-native. Tariq or Genesis avatars convert better than Knox here. Match the host to the audience.\n\n${TAVLP_URL_MAIN}` },
        'Crypto chart with IRS notice overlay, sharper avatar style, hot pink'
      ),
      taDay('2026-07-31', 89, 'Multi-state × LT11',
        { title: 'Remote workers', copy: `Multi-state remote workers often get LT11 from the wrong state.\n\nA video on \"LT11 for multi-state remote workers\" is one of the cleanest niche × topic plays in 2026.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Tech audiences', copy: `Tech-employee audiences read tax content like product docs. Clear, structured, sourced.\n\nGriffin reads as a peer.\n\n${TAVLP_URL_AVATARS}` },
        { title: 'Multi-state × LT11 — engineering audience, technical content',
          copy: `Multi-state remote workers (especially in tech) generate a disproportionate share of LT11 notices because state residency rules trip them up.\n\nThe content lane:\n\n- LT11 for multi-state remote workers.\n- Multi-state tax allocation for remote tech employees.\n- State residency rules — what triggers an audit.\n- Wage-allocation disputes and CDP hearings.\n\nThe audience reads tax content like product documentation: structured, sourced, technically precise. A tax pro who matches that voice — with the Griffin avatar — captures an audience most generalist channels do not even know to target.\n\n${TAVLP_URL_MAIN}` },
        'Map of US with LT11 letter and remote-worker laptop overlay, hot pink'
      ),
      taDay('2026-08-01', 90, 'August 1 — niche batch day',
        { title: 'Saturday batch', copy: `Today: pick your niche. Pick 4 topics. Script. Render. Schedule.\n\n${TAVLP_URL_MAIN}` },
        { title: 'One niche, four videos', copy: `4 niche × topic videos = 4 evergreen rankings inside a niche almost nobody else owns.\n\n${TAVLP_URL_MAIN}` },
        { title: 'August 1 — the niche batch day playbook',
          copy: `Concrete batch-day playbook for a tax pro adopting niche × topic strategy:\n\n1. (10 min) Pick the niche — usually where your existing book is.\n2. (10 min) List 4 high-volume topics for that niche (penalty abatement, CP2000, LT11, multi-state allocation).\n3. (60 min) Script each video — 400 words, ~4 minutes spoken.\n4. (30 min) Render each with Tax Avatar Pro. Pick the avatar that fits the audience.\n5. (20 min) Upload, title, description, schedule across the next 4 weeks.\n\nTotal: ~2 hours. 4 evergreen videos for a niche almost nobody else owns.\n\n${TAVLP_URL_MAIN}` },
        'Saturday workspace with 4 video thumbnails ready, hot pink'
      ),
      taDay('2026-08-02', 91, 'Week 3 wrap',
        { title: '3 weeks in', copy: `Library: 14 videos (codes + notices + niche × topic).\n\nThe channel is past the cold-start phase. The booking funnel is converting.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Final week ahead', copy: `Next week: how the library compounds across 12 months and what the long-game numbers look like.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Three weeks into the post-Kwong evergreen pivot — the data',
          copy: `Three weeks past the Kwong deadline, a Tax Avatar Pro channel that followed the schedule has:\n\n- 4 IRS code videos.\n- 6 notice videos.\n- 4 niche × topic videos.\n\nTotal: 14 evergreen videos. Each one ranking. The channel is producing inbound bookings without further marketing spend.\n\nThe library is the asset. The booking funnel is the conversion. The avatar is the production engine.\n\nNext week we close the post-Kwong content series with the long-game economics — what the library looks like at 6 months, 12 months, and how the channel valuation compounds.\n\n${TAVLP_URL_MAIN}` },
        '14-video grid showing 3 weeks of content with checkmarks, hot pink'
      ),
    ],
  },

  // --- TAVLP post-Kwong Week 4: Library compounding & evergreen wins ---
  {
    weekNumber: 4,
    weekLabel: 'Library compounding — the long-game economics',
    days: [
      taDay('2026-08-03', 92, 'The library compounds',
        { title: 'Compound math', copy: `One video ranks for 1 query. 30 videos rank for 30 queries.\n\nEach query brings traffic month after month. The library is an asset.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Stacking SEO', copy: `Each new video links to the others. Internal linking signals authority. The whole library lifts together.\n\n${TAVLP_URL_MAIN}` },
        { title: 'How a Tax Avatar Pro library compounds over 12 months',
          copy: `The compounding math for a Tax Avatar Pro channel built on the schedule we have laid out over the last 13 weeks:\n\n- Month 1: 14 videos. Cold-start traffic. ~500 views.\n- Month 3: 30 videos. Earlier videos start ranking. ~3K views/month.\n- Month 6: 50 videos. Internal linking flywheel kicks in. ~10K views/month.\n- Month 12: 80 videos. The library is a self-sustaining traffic source. ~25K views/month.\n\nBookings track viewership at a 1-3% click-to-book rate, with a 30-50% close rate on bookings. At month 12, that is 5-15 booked consults per month from the channel alone.\n\nFor a $29/month tool. The unit economics are not subtle.\n\n${TAVLP_URL_MAIN}` },
        'Compound growth curve — 14 → 30 → 50 → 80 videos over 12 months, hot pink'
      ),
      taDay('2026-08-04', 93, 'Avatar economics',
        { title: 'Per-video cost', copy: `At 80 videos in 12 months, the per-video cost of Tax Avatar Pro is $4.35.\n\nA freelance editor charges $400/video.\n\nThe math is durable.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Time + tool', copy: `Total time investment: ~30 min/video including script. ~40 hours of work over 12 months for an 80-video library.\n\n${TAVLP_URL_MAIN}` },
        { title: 'The unit economics at 12 months',
          copy: `Concrete 12-month unit economics for a tax pro running Tax Avatar Pro:\n\n- Tool cost: $348 ($29 × 12).\n- Videos shipped: 80.\n- Per-video tool cost: $4.35.\n- Time per video: ~30 min (script + render + upload).\n- Total time investment: ~40 hours over 12 months.\n- Per-video time cost at $200/hr: $100.\n- Total per-video all-in cost: ~$104.\n\nFreelance editor comparison: $300-800/video.\nVideo agency comparison: $500-1,500/video.\n\nTax Avatar Pro all-in cost is roughly 1/5th to 1/15th of an agency. The library is the same library either way. The only difference is who builds it.\n\n${TAVLP_URL_MAIN}` },
        'Per-video cost comparison bar chart — Tax Avatar Pro $4 vs agency $400, hot pink'
      ),
      taDay('2026-08-05', 94, 'Booking conversion',
        { title: 'Conversion math', copy: `1-3% of viewers click the booking link. 30-50% of bookings close into engagements.\n\nAt 25K views/month (month 12), that is 75-375 bookings, 25-150 closed.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Revenue is real', copy: `At an average $500/engagement, the channel generates $12K-$75K of revenue per month at scale.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Booking conversion at scale — what month 12 looks like',
          copy: `When tax pros ask whether the library actually converts, the honest answer is: it depends on the booking page, the niche, and the pricing.\n\nBaseline math from the Tax Avatar Pro pilot data:\n\n- Click-to-book rate: 1-3% of video viewers.\n- Book-to-close rate: 30-50% of consults.\n- Average engagement value: $500-$2,500 (varies by niche).\n\nAt 25K views/month (month 12 baseline):\n\n- Bookings: 250-750/month.\n- Closes: 75-375/month.\n- Revenue: $37K-$937K/month.\n\nThe upper end is not realistic for most solo pros — it would saturate capacity. The lower end is conservative. The middle case for a solo pro at month 12 is 30-60 closed engagements per month at ~$1K average = $30-60K/month.\n\n${TAVLP_URL_MAIN}` },
        'Funnel — views → clicks → bookings → closes, with revenue total, hot pink'
      ),
      taDay('2026-08-06', 95, 'Avatar swap experiments',
        { title: 'A/B avatars', copy: `At 80 videos in, you have data. Run an avatar swap on a 4-video batch — different avatar for the same content lane.\n\nMeasure click-through-rate.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Voice variants', copy: `Same script, different voice. CTR can swing 30-40% just from the voice match.\n\n${TAVLP_URL_AVATARS}` },
        { title: 'Avatar A/B testing once you have a library',
          copy: `Once your Tax Avatar Pro library hits ~50 videos, you have enough data to start A/B testing.\n\nThe two highest-leverage tests:\n\n1. Avatar swap on a single content lane. Same script style, same niche, different host. Measure CTR + watch time.\n2. Voice variant on the same avatar. Same script, same avatar, different voice preset. Measure click-through to booking.\n\nBoth tests are cheap to run with Tax Avatar Pro — render the same script twice with different settings. The one that performs better takes over the lane.\n\nBy month 12, this kind of optimization adds another 20-30% to channel performance vs running on the launch defaults.\n\n${TAVLP_URL_MAIN}` },
        'A/B test mockup — 2 avatars same script, with CTR comparison, hot pink'
      ),
      taDay('2026-08-07', 96, 'Channel as asset',
        { title: 'Channel valuation', copy: `An 80-video tax-procedure channel ranking for high-intent search is a sellable asset.\n\nMost solo pros never think of their channel this way.\n\nIt has real exit value.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Beyond inbound', copy: `Beyond the bookings, the channel is a hire-attractor, a partnership-opener, and a reputational asset.\n\n${TAVLP_URL_MAIN}` },
        { title: 'The channel as a sellable asset',
          copy: `A perspective most solo tax pros do not adopt: the YouTube channel is an asset on the balance sheet.\n\nFor a tax pro who exits or partners after 5 years, an 80-200 video channel ranking for high-intent tax-procedure search is a real component of practice valuation. Buyers pay for inbound systems.\n\nValuation rough math: a channel producing $30K/month of attributable revenue at month 12 has an asset value (at typical practice multiples of 1-2x annual gross) of $360K-$720K — independent of the books-of-business value of the practice.\n\nFor a $29/month investment of tooling and ~40 hours of script work, this is one of the most asymmetric asset-build moves a solo tax pro can make in 2026.\n\n${TAVLP_URL_MAIN}` },
        'Channel page mockup with VALUATION sticker and dollar amount, hot pink'
      ),
      taDay('2026-08-08', 97, 'Saturday — long-game review',
        { title: 'Pause + assess', copy: `By month 4, pause and review. Which videos rank? Which avatars perform? Which niche × topic combinations convert?\n\nDouble down on the winners.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Drop the losers', copy: `Some lanes do not work. Drop them. The library does not need to be exhaustive — it needs to compound.\n\n${TAVLP_URL_MAIN}` },
        { title: 'How to review the library at month 4',
          copy: `Schedule a 90-minute review session at month 4 of any Tax Avatar Pro channel build:\n\n1. Pull YouTube Studio analytics.\n2. Sort videos by views.\n3. Sort videos by click-to-booking rate.\n4. Identify the top quartile in each metric — these are your patterns.\n5. Identify the bottom quartile — these are your stop-doings.\n\nDouble down on patterns: more videos in the same niche × topic, same avatar, same script structure.\nStop the stop-doings: the lanes that did not rank, the avatars that did not convert.\n\nMonth 4 review beats month 1 prediction. The data is the strategy.\n\n${TAVLP_URL_MAIN}` },
        'Analytics dashboard with top quartile highlighted, hot pink'
      ),
      taDay('2026-08-09', 98, 'Series close',
        { title: '4 weeks done', copy: `Post-Kwong evergreen series closed. 4 weeks of pivot content shipped.\n\nThe library is built. The compounding starts here.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Next', copy: `Next campaign: open question. Could be Q4 tax planning, year-end IRS notices, or a new niche cluster. Subscribe to find out.\n\n${TAVLP_URL_MAIN}` },
        { title: 'Closing the post-Kwong evergreen content series',
          copy: `Four weeks of post-Kwong content closed today. Recap of what we covered:\n\n- Week 1: IRS code explainers (150, 810, 826, 971).\n- Week 2: Notice walkthroughs (CP14, CP2000, CP504, LT11, CP90 + 971 hub).\n- Week 3: Niche × topic intersections (truckers, RE investors, crypto traders, multi-state remote workers).\n- Week 4: Long-game library compounding economics.\n\nFor any tax pro who has been reading and not started: the channel that exists wins. Every time.\n\nTax Avatar Pro is the production engine. The library is the asset. The booking funnel is the conversion.\n\n$29/month. 6 avatars. Unlimited videos. Closing the series. Subscribe and ship.\n\n${TAVLP_URL_MAIN}` },
        'CAMPAIGN COMPLETE banner with 4-week recap below, hot pink'
      ),
    ],
  },
];

const tavlpFile = {
  campaign: {
    name: 'TAVLP Post-Kwong — Evergreen Library Series',
    start: '2026-07-13',
    end: '2026-08-09',
  },
  weeks: tavlpWeeks,
};

fs.writeFileSync(path.join(OUT_DIR, '.tavlp-post-kwong.json'), JSON.stringify(tavlpFile, null, 2));

// Verify counts
function countDays(file) {
  let days = 0, fb = 0, li = 0;
  for (const w of (file.weeks || [])) {
    for (const d of (w.days || [])) {
      days++;
      fb += (d.fbPage || []).length;
      if (d.linkedin) li++;
    }
  }
  return { weeks: file.weeks.length, days, fb, li };
}
console.log('TCVLP post-Kwong:', JSON.stringify(countDays(tcvlpFile)));
console.log('TAVLP post-Kwong:', JSON.stringify(countDays(tavlpFile)));
console.log('Wrote .tcvlp-post-kwong.json and .tavlp-post-kwong.json');
