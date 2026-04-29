#!/usr/bin/env node
// Build full TAVLP campaign content (Weeks 1-10) by reading existing Week 1
// from R2-extracted file and appending hand-authored Weeks 2-10.
// Output: /tmp/tavlp-full-content.json (Windows: .tavlp-full-content.json in repo root)

const fs = require('fs');
const path = require('path');

const week1Path = path.resolve(__dirname, '..', '.tavlp-week1.json');
const week1Data = JSON.parse(fs.readFileSync(week1Path, 'utf8'));

const URL_MAIN = 'https://taxavatar.virtuallaunch.pro';
const URL_AVATARS = 'https://taxavatar.virtuallaunch.pro/avatars';
const URL_BOOK = 'https://cal.com/tax-monitor-pro/tax-avatar-virtual-launch-pro';

// Helper: build a day record
function day(date, dayNumber, title, fb1, fb2, li, imagePrompt) {
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

// ---------- WEEK 2: Avatar Spotlights — Annie, Tariq, Genesis ----------
const week2 = {
  weekNumber: 2,
  weekLabel: 'Avatar Spotlights — Annie, Tariq, Genesis',
  days: [
    day('2026-05-11', 8, 'Meet Annie',
      { title: 'Annie — 57 looks', copy: `Annie has 57 looks inside Tax Avatar Pro.\n\nSeated, standing, professional backdrop, casual office, neutral wall. Pick the one that fits your topic.\n\nOne avatar. 57 looks. Unlimited videos at $29/mo.\n\n${URL_AVATARS}` },
      { title: 'When to use Annie', copy: `Annie reads warm and steady. Best for evergreen explainer videos — Form 843, transcript codes, penalty refunds.\n\nWrite the script. Pick the look. Render.\n\n${URL_AVATARS}` },
      { title: 'Anatomy of an avatar — Annie',
        copy: `One question I keep getting from CPAs and EAs piloting Tax Avatar Pro: how many \"looks\" does an avatar actually have?\n\nAnnie ships with 57. Different framing, different backdrops, different wardrobe — same face, same voice. That matters because audiences fatigue on visual sameness even when the speaker is good.\n\nOne avatar at $29/mo can carry an entire weekly channel for a year without looking repetitive.\n\n${URL_AVATARS}` },
      'Avatar Annie shown in 4 different looks (seated office, standing studio, neutral wall, warm backdrop), hot pink frame'
    ),
    day('2026-05-12', 9, 'Meet Tariq',
      { title: 'Tariq — sharp explainer', copy: `Tariq is the avatar most of our pilot users pick for procedural content.\n\nIRS notices, penalty abatement walkthroughs, transcript code breakdowns.\n\n14 looks. $29/mo flat.\n\n${URL_AVATARS}` },
      { title: 'Why Tariq works for procedure', copy: `Procedural tax content is hard to make watchable. The wrong delivery sounds like a textbook.\n\nTariq reads sharp without sounding rushed. That is the right tone for IRS-procedure videos.\n\n${URL_AVATARS}` },
      { title: 'Picking an avatar for the topic, not the person',
        copy: `When tax pros first try Tax Avatar Pro, they pick the avatar that looks most like them. That is the wrong heuristic.\n\nThe better heuristic: pick the avatar whose voice and presence match the topic. Tariq for procedure-heavy content. Annie for warm explainers. Genesis for newer-pro / younger-audience content.\n\nYou can swap any time. Six avatars are bundled. The constraint becomes content quality, not casting.\n\n${URL_AVATARS}` },
      'Avatar Tariq mid-explanation with on-screen text overlay of IRS form references, hot pink accent'
    ),
    day('2026-05-13', 10, 'Meet Genesis',
      { title: 'Genesis — modern voice', copy: `Genesis is the avatar that lands with younger audiences.\n\n12 looks. Same $29/mo. Same unlimited videos.\n\nIf your prospects are millennials and Gen Z 1099 earners, this is the avatar.\n\n${URL_AVATARS}` },
      { title: 'Audience-fit casting', copy: `The avatar you pick is a casting decision. Genesis fits Instagram-native audiences and YouTube Shorts.\n\nNot every tax pro should be on TikTok. Every tax pro should at least try Shorts.\n\n${URL_MAIN}` },
      { title: 'Why we built Genesis',
        copy: `Tax pros over 50 sometimes ask why we put a younger avatar in the lineup.\n\nThe answer is the audience, not the operator. A 60-year-old EA serving millennial 1099 contractors needs a delivery that sounds like the audience, not the firm.\n\nGenesis gives that voice. The script is still yours. The expertise is still yours. The casting is just better.\n\nThis is the cheapest demographic-fit experiment in marketing — $29/month, swap avatars any time.\n\n${URL_AVATARS}` },
      'Avatar Genesis filming a vertical short, phone-frame mockup, hot pink'
    ),
    day('2026-05-14', 11, 'Swap mid-channel',
      { title: 'Swap any time', copy: `You can swap avatars mid-channel. Subscribers do not bounce — most do not even comment on it.\n\nTry Annie for 4 weeks. Try Tariq for 4. See which gets more watch time.\n\n${URL_AVATARS}` },
      { title: 'Two avatars, one channel', copy: `Some pros run two avatars on one channel — Annie for evergreen, Tariq for breaking-news. The script is yours either way.\n\n${URL_AVATARS}` },
      { title: 'Two-avatar channels — a small pattern we are watching',
        copy: `An interesting pattern from the Tax Avatar Pro pilot: a few pros are running two avatars on a single channel. Annie for the evergreen library — Form 843, transcript codes, IRS letters. Tariq for episodic / news-driven content.\n\nThe playlist organization does most of the work. Subscribers do not seem to mind the variety.\n\nIf you want to A/B avatars to see which one ranks for your niche, this is the lowest-friction way: one channel, two avatars, same script style.\n\n${URL_MAIN}` },
      'Split-screen Annie and Tariq with one channel banner, hot pink'
    ),
    day('2026-05-15', 12, 'Voice match',
      { title: 'Voice fit', copy: `Each avatar pairs with a default voice. Warm, authoritative, sharp, friendly.\n\nIf the default is wrong, pick another. The script is portable.\n\n${URL_AVATARS}` },
      { title: 'Test before publish', copy: `Render a 30-second preview before you commit a full video. The voice can make or break the topic.\n\n${URL_MAIN}` },
      { title: 'Voice is half the casting',
        copy: `The face gets the attention. The voice does the work.\n\nWhen pros review their first Tax Avatar Pro renders, the most common adjustment is voice, not avatar. Same Annie, different vocal pacing — completely different feel.\n\nWe ship voice presets per avatar so the default is reasonable, but the voice picker is where you should spend the second 10 minutes of setup.\n\n${URL_AVATARS}` },
      'Sound-wave overlay across an avatar face, hot pink accents'
    ),
    day('2026-05-16', 13, 'Booking option',
      { title: 'Want a walkthrough?', copy: `If you want to see Tax Avatar Pro in action before subscribing, book a 15-minute walkthrough.\n\n${URL_BOOK}` },
      { title: 'See it live', copy: `15 minutes. We render a sample video on your topic, you decide.\n\n${URL_BOOK}` },
      { title: 'How to evaluate Tax Avatar Pro in 15 minutes',
        copy: `If you are evaluating Tax Avatar Pro and want a structured way to do it, the 15-minute walkthrough is the most efficient format.\n\nWe ask for one topic from your practice — \"Form 843 for unemployment penalty\", \"how to read transcript code 290\" — and render a sample on the call. You see the avatar, the voice, the upload flow, and a draft channel description.\n\nThe ask is your time, not your topic ideas. You leave with a working sample either way.\n\n${URL_BOOK}` },
      'Calendar booking screen with avatar preview, hot pink'
    ),
    day('2026-05-17', 14, 'Week 2 wrap',
      { title: 'Three avatars deep', copy: `This week we covered Annie, Tariq, Genesis. Three avatars. Three different fits.\n\nNext week: the math on why $29/mo replaces a $1,250 setup.\n\n${URL_AVATARS}` },
      { title: 'Pick one and start', copy: `Stop researching avatars. Pick one. Write a script. Render. Publish.\n\nThe channel that wins is the one that ships first.\n\n${URL_MAIN}` },
      { title: 'Casting paralysis is the enemy',
        copy: `If I had to name the single biggest reason tax pros do not launch a channel after signing up for Tax Avatar Pro, it would be casting paralysis.\n\nThey demo all 6 avatars. They render preview clips. They ask their team to vote. Three weeks pass. No video ships.\n\nThe correction: pick Annie. Ship 4 videos. Then evaluate.\n\nThe avatar choice rounds to zero compared to whether the channel publishes weekly. Get the publishing cadence first.\n\n${URL_MAIN}` },
      'Three avatars in a row with a forward arrow, hot pink'
    ),
  ],
};

// ---------- WEEK 3: The Math ----------
const week3 = {
  weekNumber: 3,
  weekLabel: 'The Math — DIY vs $29/mo',
  days: [
    day('2026-05-18', 15, 'DIY total cost',
      { title: 'Add it up', copy: `Camera $400. Lights $200. Mic $150. Editing software $250/yr. Time on camera, every week.\n\nMinimum $1,250 before video one.\n\nTax Avatar Pro: $29/mo. No camera. No setup.\n\n${URL_MAIN}` },
      { title: 'And then time', copy: `Even after the gear, DIY YouTube costs you 4–6 hours per video. That is the part nobody priced in.\n\nAvatar render is minutes.\n\n${URL_MAIN}` },
      { title: 'The hidden cost of DIY YouTube for tax pros',
        copy: `When tax pros price out a YouTube channel, they price the gear. Camera, lights, mic, editing software — call it $1,250.\n\nWhat almost nobody prices is the time. A 5-minute talking-head video, filmed and edited yourself, runs 4–6 hours of pro time once you count retakes, b-roll, cuts, captions, and thumbnails.\n\nAt a $200/hr billable rate, that is $800–$1,200 of opportunity cost per video.\n\nTax Avatar Pro turns that into 30 minutes of script work. Same publish, 1/10th the cost.\n\n${URL_MAIN}` },
      'Spreadsheet showing DIY costs vs Tax Avatar Pro, hot pink'
    ),
    day('2026-05-19', 16, 'Per-video math',
      { title: '$7.25 per video', copy: `4 videos a month at $29/mo = $7.25 per video.\n\n12 videos a month = $2.42 per video.\n\nUnlimited.\n\n${URL_MAIN}` },
      { title: 'Versus an editor', copy: `A freelance editor charges $300–$800 per video. One video a month with an editor costs more than a year of Tax Avatar Pro.\n\n${URL_MAIN}` },
      { title: 'The unit economics of unlimited',
        copy: `Most SaaS pricing penalizes volume. Tax Avatar Pro inverts it.\n\nAt 4 videos/month: $7.25/video.\nAt 8 videos/month: $3.63/video.\nAt 12 videos/month: $2.42/video.\nAt 20 videos/month: $1.45/video.\n\nThe more you publish, the cheaper each video gets. The economic incentive matches the audience-growth incentive.\n\nThis is the right shape for a marketing tool.\n\n${URL_MAIN}` },
      'Cost-per-video curve dropping with volume, hot pink'
    ),
    day('2026-05-20', 17, 'Opportunity cost',
      { title: 'Your hour is $200', copy: `If your billable hour is $200 and DIY costs you 5 hours per video, you are spending $1,000 of opportunity cost per upload.\n\nTax Avatar Pro is $7 per video.\n\n${URL_MAIN}` },
      { title: 'The wrong trade', copy: `Filming yourself is the wrong trade for a tax pro. The hours come out of client work.\n\n${URL_MAIN}` },
      { title: 'Where your time should actually go',
        copy: `Tax pros are time-bound. Not money-bound.\n\nThe hours you spend filming and editing are hours you do not spend on returns, on Kwong filings, on client calls. At $200/hr that is real money walking out the door.\n\nTax Avatar Pro is not a video tool. It is a time-arbitrage tool. You trade $29/month and 30 minutes of script work for the marketing output of a channel that would otherwise cost you 20 hours a month.\n\n${URL_MAIN}` },
      'Hourglass with billable-hour stack, hot pink'
    ),
    day('2026-05-21', 18, 'Versus agencies',
      { title: 'Agency pricing', copy: `Video agencies for tax pros: $300–$800 per finished video.\n\n12 videos a year minimum to rank. That is $3,600–$9,600.\n\nTax Avatar Pro: $348/yr. Unlimited.\n\n${URL_MAIN}` },
      { title: 'You still write the script', copy: `An agency does not write your script. You still do that.\n\nWith Tax Avatar Pro you skip the production layer entirely.\n\n${URL_MAIN}` },
      { title: 'Where agencies still win — and where they do not',
        copy: `Agencies are good at production polish. They are bad at cadence.\n\nA tax pro who hires a video agency typically ships 1 video a month, sometimes less. Production cycles are the bottleneck.\n\nThe channels that rank are the channels that publish weekly. Cadence beats polish at the volume YouTube rewards.\n\nTax Avatar Pro is built for cadence. Same script-writing time as an agency engagement. Zero production cycle.\n\n${URL_MAIN}` },
      'Versus chart agency $400/video vs Tax Avatar Pro $7/video, hot pink'
    ),
    day('2026-05-22', 19, 'No camera, no studio',
      { title: 'Zero gear', copy: `No camera. No lights. No mic. No editing software.\n\nThe only requirement is a script.\n\n${URL_MAIN}` },
      { title: 'Render anywhere', copy: `Write the script on your phone. Render on your laptop. Publish from your office.\n\n${URL_MAIN}` },
      { title: 'The gearless video stack',
        copy: `What goes in a Tax Avatar Pro publish: a Google Doc with the script, a browser, a YouTube account.\n\nThat is the entire stack.\n\nNo studio. No camera. No mic check. No re-shoot when the lighting changes. No editing pass for filler words. No thumbnail Photoshop session.\n\nThis is the lowest-equipment-cost marketing channel a solo tax pro has ever had access to. The savings are not just dollars; they are also the elimination of the 47 reasons a video gets postponed.\n\n${URL_MAIN}` },
      'Empty desk with just a laptop and Google Doc open, hot pink'
    ),
    day('2026-05-23', 20, 'ROI scenarios',
      { title: '1 client = ROI', copy: `One Kwong filing client at $500–$1,500.\n\nA full year of Tax Avatar Pro: $348.\n\nOne client pays for the year. Twice over.\n\n${URL_MAIN}` },
      { title: 'Repeat the math', copy: `Run this math against any single representative engagement in your practice.\n\nThe channel pays for itself on case one.\n\n${URL_MAIN}` },
      { title: 'The single-client ROI test',
        copy: `Here is a sanity check I run with every tax pro evaluating Tax Avatar Pro: what is your average engagement value?\n\nFor a Kwong / Form 843 filer: $500–$1,500.\nFor a transcript-analysis engagement: $300–$800.\nFor a multi-year cleanup: $2,500+.\n\nA full year of Tax Avatar Pro is $348.\n\nThe break-even is one new client. Not a hundred. One.\n\nIf you cannot get one new client out of a year of weekly YouTube content on the topics your prospects are already searching for, the issue is not the channel.\n\n${URL_MAIN}` },
      'Bar showing $348 cost vs $500 single-client revenue, hot pink'
    ),
    day('2026-05-24', 21, 'Week 3 wrap',
      { title: 'Math holds', copy: `The math is not subtle. $29/mo, unlimited, no gear, no camera time.\n\nNext week we cover the proof: the test channel, the comments, the early signals.\n\n${URL_MAIN}` },
      { title: 'Stop pricing, start writing', copy: `If you priced this out and it works, the next move is a script. Not more research.\n\n${URL_MAIN}` },
      { title: 'A note on cost-justification spirals',
        copy: `One pattern I want to flag for tax pros: the cost-justification spiral.\n\nYou price out the gear, you price out the agency, you price out Tax Avatar Pro, you build a spreadsheet, you build a second spreadsheet, you ask your bookkeeper. Six weeks pass.\n\nThe channel that would have ranked by week 6 is still on the to-do list.\n\nFor a $29/month tool with a no-gear footprint, the right move is to subscribe, ship a video, and evaluate after 30 days. The data you get from publishing beats any spreadsheet.\n\n${URL_MAIN}` },
      'Calculator next to a stopwatch with Publish button, hot pink'
    ),
  ],
};

// ---------- WEEK 4: Social Proof ----------
const week4 = {
  weekNumber: 4,
  weekLabel: 'Social Proof — early signals',
  days: [
    day('2026-05-25', 22, 'Test channel results',
      { title: '923 views in 30 days', copy: `Our test channel hit 923 organic views in its first 30 days. Zero ad spend.\n\nThat is not a viral number. That is a ranking number — videos getting found in YouTube search and recommendations.\n\n${URL_MAIN}` },
      { title: 'No ads needed', copy: `923 views came from picking the right topics — Form 843, transcript codes, IRS notices — and publishing weekly.\n\nThat is the playbook.\n\n${URL_MAIN}` },
      { title: 'What 923 organic views actually proves',
        copy: `When we tell tax pros our test channel hit 923 views in 30 days with no ad spend, the most common reaction is \"that is not a lot.\"\n\nIt is not. That is the point.\n\n923 organic views means YouTube's algorithm is matching the videos to search intent. The videos rank, get suggested, and pull in the audience that is actively searching for tax-procedure answers. That is the audience tax pros want.\n\nThe scaling lever from 923 to 9,230 is not a different tool. It is publishing more weeks.\n\n${URL_MAIN}` },
      'YouTube analytics screenshot showing 923 views over 30 days, hot pink frame'
    ),
    day('2026-05-26', 23, 'Phillip Gillian — the comment',
      { title: 'Real demand signal', copy: `One YouTube viewer left a comment asking us for help with IRS transcript codes 810, 150, 806.\n\nThat is the demand. That comment is one search away from a hundred more.\n\nTax Avatar Pro lets you publish the answer this week.\n\n${URL_MAIN}` },
      { title: 'The codes people ask about', copy: `810. 150. 806. 290. 766. These are the codes taxpayers Google when they get an IRS letter.\n\nA video for each = a year of evergreen content.\n\n${URL_MAIN}` },
      { title: 'Reading YouTube comments as a content map',
        copy: `On our test channel, one viewer named Phillip Gillian left a comment asking for help interpreting IRS transcript codes 810, 150, and 806 on his account.\n\nThat one comment is a content map.\n\nIt tells you the exact questions taxpayers are typing into search. It tells you the codes that scare them. It tells you the gap between what the IRS publishes and what taxpayers can actually use.\n\nA tax pro with a Tax Avatar Pro channel can publish a 5-minute video on each of those codes by the end of next week. That is exactly the content YouTube ranks for tax-procedure searches.\n\n${URL_MAIN}` },
      'YouTube comment screenshot referencing transcript codes, hot pink'
    ),
    day('2026-05-27', 24, 'Conny R. — gratitude as signal',
      { title: 'Gratitude is data', copy: `Another viewer commented: \"Thank you for sharing the link! I have been looking up each code individually, and that's so helpful.\"\n\nThat is what under-served looks like.\n\n${URL_MAIN}` },
      { title: 'Be the consolidator', copy: `If your prospects are looking up codes one at a time, the pro who consolidates wins.\n\nA channel of code-by-code videos plus one master \"all the codes\" page is the play.\n\n${URL_MAIN}` },
      { title: 'When viewers say thank you, the market is under-served',
        copy: `A viewer named Conny R. left this comment on one of our test videos: \"Thank you for sharing the link! I have been looking up each code individually, and that's so helpful.\"\n\nThat comment is a market signal.\n\nWhen viewers thank you for content, two things are true: the content was useful, and they could not find it easily anywhere else. That is the textbook definition of an under-served niche.\n\nTax-procedure content for taxpayers — codes, notices, Form 843 walkthroughs — is one of the most under-served, highest-search-volume topics on YouTube. A weekly channel ranks for this fast.\n\nTax Avatar Pro is the cheapest way to be the pro that publishes it.\n\n${URL_MAIN}` },
      'YouTube thank-you comment screenshot, hot pink overlay'
    ),
    day('2026-05-28', 25, 'Tax Transcript AI numbers',
      { title: '26 videos, 475 top', copy: `Our sister channel Tax Transcript AI has 26 videos. The top one is at 475 views. The bottom is in the teens.\n\nThe distribution is the lesson — most videos do nothing, one or two do a lot.\n\nYou cannot pick which. You can only publish.\n\n${URL_MAIN}` },
      { title: 'Power-law content', copy: `YouTube is power-law. Publish 20 videos and one will outperform the rest combined.\n\nTax Avatar Pro lets you ship 20 without filming.\n\n${URL_MAIN}` },
      { title: 'YouTube is power-law — design for that',
        copy: `Across 26 videos on our Tax Transcript AI test channel, the distribution is exactly what every YouTube creator eventually learns: power-law.\n\nTop video: 475 views. Median: ~30. Bottom: single digits.\n\nThis matters for two reasons.\n\nOne — you cannot predict which video ranks. The titles I expected to win mostly did not. The ones I almost did not publish are some of the top performers.\n\nTwo — the strategy is throughput. The pros who ship 50 videos in a year are the ones who win, because the power-law selects from inside their library. The pros who ship 4 do not get a draw.\n\nTax Avatar Pro is built for throughput.\n\n${URL_MAIN}` },
      'Bar chart of 26 videos showing power-law distribution, top bar 475, hot pink'
    ),
    day('2026-05-29', 26, 'Avatar usage stats',
      { title: 'Annie — most used', copy: `Of our 6 avatars, Annie has been used the most across pilot accounts. 57 looks, warm tone, fits most explainer content.\n\n${URL_AVATARS}` },
      { title: 'Knox + Denyse', copy: `Knox (25 looks) and Denyse (33 looks) are next. Each fits a different lane.\n\nUse the one that matches your topic, not the one that looks like you.\n\n${URL_AVATARS}` },
      { title: 'Avatar usage patterns from the pilot',
        copy: `An aggregate look from the Tax Avatar Pro pilot:\n\nAnnie (57 looks) — most-used overall, mostly evergreen explainer content.\nDenyse (33 looks) — strong second, used for client-letter and notice walkthroughs.\nKnox (25 looks) — third, popular for senior-pro / firm-channel content.\nGriffin (20 looks) — fourth, used for procedural deep-dives.\nTariq (14 looks) — fewer total looks, but used heavily where chosen.\nGenesis (12 looks) — niche fit, younger-audience channels.\n\nThe takeaway: most pros default to one avatar and 1 voice for an entire library. Variety happens at the look level, not the avatar level. That is exactly the right shape — recognizable host, varied frame.\n\n${URL_AVATARS}` },
      'Six-avatar stats grid with usage bars, hot pink'
    ),
    day('2026-05-30', 27, 'Booking funnel',
      { title: 'Want a demo?', copy: `If you want to see how this looks before subscribing, book 15 minutes.\n\nWe render a sample on your topic.\n\n${URL_BOOK}` },
      { title: '15 minutes', copy: `One topic from your practice. We render. You decide.\n\n${URL_BOOK}` },
      { title: 'The 15-minute demo as evaluation',
        copy: `If you want to evaluate Tax Avatar Pro on your own topic before subscribing, the demo is 15 minutes and ends with a working sample.\n\nWe ask for one topic from your practice — \"Form 843 for unemployment penalty\", \"how to read transcript code 290\", \"what to do with a CP14 notice\" — and render a 30-second sample on the call.\n\nIf the avatar lands and the voice fits, you subscribe. If not, you walk away with a sample anyway.\n\n${URL_BOOK}` },
      'Calendar with avatar preview and Book Now CTA, hot pink'
    ),
    day('2026-05-31', 28, 'Week 4 wrap',
      { title: 'The signal', copy: `923 views. Real comments. 26-video power-law distribution. 6 avatars in active use.\n\nThe signal is clear. The constraint is publishing.\n\n${URL_MAIN}` },
      { title: 'Next week', copy: `Next week we cover the objections — AI bans, client trust, DIY perfectionism — and how to think past them.\n\n${URL_MAIN}` },
      { title: 'Reading early signals without overfitting',
        copy: `Four weeks of Tax Avatar Pro content gives me four kinds of signal:\n\n1. Quantitative: 923 views in 30 days from one channel, power-law distribution across 26 videos.\n2. Qualitative: real viewer comments asking for help with specific IRS codes.\n3. Behavioral: avatar usage skews toward Annie + Denyse, voice variety > avatar variety.\n4. Negative: nothing has gone viral; nothing needs to.\n\nNone of this is a guarantee. It is enough signal to keep publishing.\n\nFor any tax pro on the fence: the signal you need is whether your specific topics will rank in your specific niche. The only way to find out is to publish 8–12 videos. Tax Avatar Pro removes every other excuse for not doing so.\n\n${URL_MAIN}` },
      'Dashboard summary card with 4 metrics, hot pink'
    ),
  ],
};

// ---------- WEEK 5: Objection Handling ----------
const week5 = {
  weekNumber: 5,
  weekLabel: 'Objection Handling',
  days: [
    day('2026-06-01', 29, 'Will YouTube ban AI?',
      { title: 'AI is allowed', copy: `Question we get most: \"Will YouTube ban my AI channel?\"\n\nNo. YouTube requires disclosure of AI content, not removal.\n\nTax Avatar Pro applies the disclosure tag for you.\n\n${URL_MAIN}` },
      { title: 'Compliance built in', copy: `Disclosure tag, description boilerplate, metadata flags — all auto-applied.\n\nYou write the script. We handle policy hygiene.\n\n${URL_MAIN}` },
      { title: 'AI on YouTube — what the policy actually says',
        copy: `The most common objection I hear from tax pros: \"YouTube is going to ban AI channels.\"\n\nThe policy as of 2026 says the opposite. YouTube requires creators to disclose AI-generated or substantially altered content. Disclosure is a checkbox during upload. Removal is not the policy.\n\nTax Avatar Pro auto-applies the disclosure tag, generates a compliant description boilerplate referencing the avatar use, and flags the metadata. Your channel ships compliant out of the gate.\n\nThe risk to a tax pro on YouTube right now is not getting banned. It is being late.\n\n${URL_MAIN}` },
      'Shield over YouTube logo, AI compliance theme, hot pink'
    ),
    day('2026-06-02', 30, 'Client trust',
      { title: 'Clients do not care', copy: `Worried clients will distrust an AI avatar?\n\nThey do not.\n\nThey care that you answered their question. Format is downstream.\n\n${URL_MAIN}` },
      { title: 'You are still the source', copy: `The script is yours. The expertise is yours. The avatar is the camera.\n\nYour name and credentials are still on the channel.\n\n${URL_MAIN}` },
      { title: 'Will an AI avatar erode client trust?',
        copy: `The second-most-common objection: \"My clients will not trust an AI-fronted channel.\"\n\nThis treats the avatar as the substance. It is not. The substance is the script — your analysis, your interpretation of the IRS notice, your read on the case.\n\nClients hire you for your knowledge. The avatar is a delivery format, the same way a podcast is a delivery format.\n\nThe pros piloting Tax Avatar Pro report the opposite of the predicted reaction: clients comment that the videos are clearer than what they would have gotten from a self-filmed pro. The script gets the attention because nothing else competes for it.\n\n${URL_MAIN}` },
      'Two-column trust comparison: clarity over face, hot pink'
    ),
    day('2026-06-03', 31, 'DIY perfectionism',
      { title: 'Done > perfect', copy: `\"I want to film myself eventually.\"\n\nFine. Do that in year three. Right now, ship 50 videos with an avatar.\n\nThe channel that exists beats the channel that is planned.\n\n${URL_MAIN}` },
      { title: 'Hybrid is fine', copy: `Some pros run an avatar channel for volume and a self-filmed channel for premium content.\n\nBoth lanes work. Avatar removes the bottleneck.\n\n${URL_MAIN}` },
      { title: 'The cost of waiting until you are ready to film',
        copy: `Every tax pro I talk to has the same plan: \"Once I get the studio set up, I will start filming.\"\n\nThat plan is two years old for most of them. The studio never gets set up.\n\nMeanwhile, the prospect who Googled \"can I get a refund for IRS penalties\" found someone else's channel.\n\nTax Avatar Pro is the bridge. Ship 50 videos this year with an avatar. If you want to film yourself in year three, you will have an audience by then. If you do not, you still have 50 ranking videos.\n\nThe channel that exists wins. Every time.\n\n${URL_MAIN}` },
      'Construction-cone studio that never opens vs published channel, hot pink'
    ),
    day('2026-06-04', 32, 'Quality concerns',
      { title: 'Quality is the script', copy: `\"AI avatars look fake.\"\n\nThe avatars are good. The scripts are what make a channel watchable.\n\nWeak script with a real face is worse than strong script with an avatar.\n\n${URL_MAIN}` },
      { title: 'Watch retention', copy: `Audiences stay for value. Tax-procedure content keeps audiences if it answers their question. Format is secondary.\n\n${URL_MAIN}` },
      { title: 'On the quality of AI avatars in 2026',
        copy: `\"AI avatars look obviously fake\" was a fair objection in 2023. It is not in 2026.\n\nThe gap between Tax Avatar Pro avatars and a self-filmed talking head is small enough that the script quality dominates. A good script with an avatar beats a weak script with a real face — every time, on every metric: watch retention, subscribe rate, comment volume.\n\nThis tracks the way audiences have always behaved. Clarity wins. Substance wins. Format is downstream.\n\nIf your script is strong, the avatar is invisible. If your script is weak, no camera is going to save you.\n\n${URL_MAIN}` },
      'Side-by-side avatar vs human, near-identical UI frame, hot pink'
    ),
    day('2026-06-05', 33, 'Compliance and bar rules',
      { title: 'Bar / state board OK', copy: `\"Can attorneys use AI avatars?\"\n\nYes. State bar advertising rules apply to content claims, not delivery format. Tax Avatar Pro is a delivery format.\n\n${URL_MAIN}` },
      { title: 'Same rules, new format', copy: `Whatever your state board says about marketing claims, says about avatar marketing claims. Nothing new to learn.\n\n${URL_MAIN}` },
      { title: 'For tax attorneys: bar rules and avatar marketing',
        copy: `Tax attorneys ask whether state bar advertising rules block avatar-based channels. The short answer is no.\n\nState bar rules govern claims, disclaimers, and solicitation — not delivery medium. The same rules that apply to a self-filmed video apply to an avatar video. \"No guarantee of outcome\" still has to be on the channel. Specialty designations still have to be accurate. Solicitation rules still apply.\n\nTax Avatar Pro lets you template the disclaimer into your description, lock the channel boilerplate, and apply it across every video. That is actually easier than doing it manually on every self-filmed clip.\n\nIf you have specific concerns, your state bar's ethics opinions on AI-generated marketing are usually a 5-minute read.\n\n${URL_MAIN}` },
      'Gavel and avatar with checklist of compliance items, hot pink'
    ),
    day('2026-06-06', 34, 'Time concerns',
      { title: '30 minutes per video', copy: `\"I do not have time.\"\n\nScript: 20 minutes. Render: 5. Publish: 5.\n\n30 minutes per video. One pre-work hour, four videos.\n\n${URL_MAIN}` },
      { title: 'Templated scripts', copy: `We ship a starter pack of script templates: code explainers, notice walkthroughs, Form 843 framing.\n\nFill in the blanks.\n\n${URL_MAIN}` },
      { title: 'A realistic per-video time budget',
        copy: `\"I do not have time for a YouTube channel\" is the third most common objection. It is the one with the cleanest answer.\n\nWith Tax Avatar Pro, the per-video budget is:\n\n- 20 minutes — script writing, ideally from a template.\n- 5 minutes — avatar selection, voice check, render.\n- 5 minutes — upload, title, description, thumbnail.\n\n30 minutes total. One hour before clients in the morning, two videos. Two hours on a Friday afternoon, four videos. That is a month of weekly content in one sitting.\n\nThe time concern is real. The time required is not what you think it is.\n\n${URL_MAIN}` },
      'Stopwatch showing 30:00 with three step icons, hot pink'
    ),
    day('2026-06-07', 35, 'Week 5 wrap',
      { title: 'Objections handled', copy: `AI bans — no. Client trust — fine. Quality — script-driven. Bar rules — same rules. Time — 30 min/video.\n\nNothing left to research. Subscribe. Ship.\n\n${URL_MAIN}` },
      { title: 'One week left to start in time', copy: `If you start a Tax Avatar Pro channel this week, you can have 5 ranking videos before the Kwong deadline.\n\n${URL_MAIN}` },
      { title: 'When the objections are handled, the answer is to start',
        copy: `If you have read this week's posts, the standard objections to avatar-based YouTube channels are off the table. AI is allowed on YouTube. Clients do not care about format. Bar rules apply to claims, not medium. Quality is script-driven. Time per video is 30 minutes.\n\nThe remaining variable is your willingness to start.\n\nThe pros who win the Kwong window are the ones who start in May, not in June. By July 10 the window closes and the audience disperses.\n\n$29/month. 6 avatars. Unlimited videos. Disclosure handled. Time budget 30 minutes per video.\n\nThe move is to subscribe and ship.\n\n${URL_MAIN}` },
      'Checklist of objections all checked off, hot pink'
    ),
  ],
};

// ---------- WEEK 6: CPA Shortage ----------
const week6 = {
  weekNumber: 6,
  weekLabel: 'CPA shortage and the delegation imperative',
  days: [
    day('2026-06-08', 36, 'The shortage',
      { title: '~75,000 fewer CPAs', copy: `The US has lost roughly 75,000 CPAs in the last 5 years. EAs and tax attorneys are not filling the gap fast enough.\n\nDemand is rising. Supply is dropping. The pros who scale themselves win.\n\n${URL_MAIN}` },
      { title: 'Scarcity is leverage', copy: `Fewer CPAs and a Kwong window means a busy year for the pros who show up online.\n\nA YouTube channel is the cheapest way to show up.\n\n${URL_MAIN}` },
      { title: 'The CPA shortage as a marketing tailwind',
        copy: `For most industries a labor shortage is bad news. For solo and small-firm tax pros it is leverage.\n\nThe US has lost ~75,000 CPAs in the last five years. The AICPA pipeline is shrinking. Replacement EAs and tax attorneys are coming online but not at the rate needed to absorb 2026 demand — especially with Kwong pulling millions of new filers into the system.\n\nThis means: every prospect Googling for tax help right now finds fewer pros than they would have five years ago. The ones they find — the ones who rank — capture more of the demand.\n\nA YouTube channel is the cheapest way to be one of the pros they find.\n\nTax Avatar Pro is the cheapest way to run that channel.\n\n${URL_MAIN}` },
      'Downward CPA-count chart with rising demand line, hot pink'
    ),
    day('2026-06-09', 37, 'Delegate or capped',
      { title: 'Delegation = scale', copy: `You delegate bookkeeping. You delegate scheduling. You delegate phones.\n\nThe camera is the next thing to delegate.\n\n${URL_MAIN}` },
      { title: 'Cap at 1x or scale to 5x', copy: `If you do not delegate the marketing camera, your output is capped at the hours you spend filming.\n\nDelegate it. 5x your reach.\n\n${URL_MAIN}` },
      { title: 'Delegation is the only path to scale',
        copy: `Solo tax pros hit a ceiling around $300K–$500K of revenue. The ceiling is not market demand. The ceiling is hours.\n\nThe pros who break through delegate. They delegate bookkeeping to a virtual assistant. They delegate scheduling to a system. They delegate intake to a form.\n\nThe last domino is marketing. Specifically: the camera.\n\nA self-filmed YouTube channel scales linearly with your willingness to film. Tax Avatar Pro scales with your willingness to write scripts.\n\nWriting is delegate-able. Filming is not.\n\n${URL_MAIN}` },
      'Org chart with avatar handling marketing branch, hot pink'
    ),
    day('2026-06-10', 38, 'EA growth opportunity',
      { title: 'EAs win this decade', copy: `Enrolled agents are the fastest-growing tax credential. Lower barrier than CPA, full IRS rights.\n\nA YouTube channel is the fastest way to differentiate.\n\n${URL_MAIN}` },
      { title: 'Build the brand', copy: `New EA? A weekly avatar-fronted channel beats a website that nobody finds.\n\n${URL_MAIN}` },
      { title: 'For new EAs: the channel is the brand',
        copy: `Talked to a dozen newly-credentialed EAs this year. The pattern is consistent: passed the SEE, set up an LLC, built a website nobody visits.\n\nThe website is not the brand. The website is a billboard at the bottom of a closed road.\n\nThe brand is what people find when they search the questions you can answer. For a new EA in 2026, that is YouTube. Specifically: ranking for tax-procedure questions that high-volume CPAs are not bothering to answer in video form.\n\nTax Avatar Pro is the cheapest way to start. $29/month. No camera. Six avatars to pick from.\n\nThe new-EA brand is built one weekly video at a time.\n\n${URL_MAIN}` },
      'EA badge next to YouTube subscriber bar growing, hot pink'
    ),
    day('2026-06-11', 39, 'Tax attorneys differentiation',
      { title: 'Attorneys ranking', copy: `Tax attorneys: ranking on YouTube for IRS-procedure searches differentiates your firm from generic litigation directories.\n\nMost firms still link only to dusty website pages.\n\n${URL_MAIN}` },
      { title: 'Authority signal', copy: `A 50-video YouTube channel is a stronger authority signal than 5 awards on a website.\n\nThe avatar removes the time barrier.\n\n${URL_MAIN}` },
      { title: 'For tax attorneys: differentiation in a directory-saturated market',
        copy: `Tax attorneys live in a market where every prospect's first move is a directory: Avvo, Martindale, Super Lawyers, Best Lawyers. Differentiation inside the directory is small. Everyone has the same review badge.\n\nDifferentiation outside the directory is enormous. A tax attorney with 50 ranking YouTube videos on IRS-procedure topics is the only attorney that prospect finds when they Google their actual question.\n\nThis is not theoretical. The prospects who find a video before they reach a directory close at higher rates and ask fewer price questions. They have already pre-qualified themselves.\n\nTax Avatar Pro is the cheapest way for a tax attorney to build this asset. The bar rules are downstream of the avatar.\n\n${URL_MAIN}` },
      'Search results page with attorney channel ranking #1, hot pink'
    ),
    day('2026-06-12', 40, 'Niche capture',
      { title: 'Pick a niche', copy: `\"Trucker tax\". \"Real-estate-investor tax\". \"Multi-state remote-worker tax\".\n\nA Tax Avatar Pro channel for a niche ranks in 90 days.\n\n${URL_MAIN}` },
      { title: 'Niche + cadence wins', copy: `Generalist tax channels are crowded. Niche-specific channels publishing weekly are not.\n\n${URL_MAIN}` },
      { title: 'Niche capture is the highest-ROI move on YouTube',
        copy: `If you have one weekend to plan a YouTube strategy, spend it picking a niche.\n\nGeneralist tax channels are crowded. \"How to read your IRS transcript\" has 5,000 videos. You will not rank for that in 2026 without a year of grinding.\n\nNiche-specific channels are not crowded. \"Trucker tax for OTR drivers\". \"Real-estate-investor tax for short-term rentals\". \"Multi-state remote-worker tax for tech employees\". Each of these has a few dozen videos. A weekly avatar-fronted channel ranks in 90 days.\n\nThe shortcut: pick the niche where your existing book of business already is.\n\nTax Avatar Pro is the production engine. The niche is the strategy.\n\n${URL_MAIN}` },
      'Funnel showing wide topic narrowing to niche channel, hot pink'
    ),
    day('2026-06-13', 41, 'Hire, channel, both',
      { title: 'Hire vs channel', copy: `An associate costs $80K+. A YouTube channel built with an avatar costs $348/yr.\n\nA channel that brings in 5 clients/year pays for the next associate.\n\n${URL_MAIN}` },
      { title: 'Stack them', copy: `Channel + associate is the actual answer. Channel feeds the funnel. Associate handles the work.\n\n${URL_MAIN}` },
      { title: 'Hire-vs-channel is a false choice',
        copy: `Tax pros considering scale think it through as a binary: hire an associate, or don't.\n\nThe smarter framing: a channel funds the associate.\n\nA YouTube channel that brings in 5 new $1,500 engagements per year ($7,500 of new revenue) covers the marginal cost of a part-time associate. A channel that brings in 20 ($30,000) easily covers a full-time hire.\n\nThe sequence is: build the channel first ($29/month with Tax Avatar Pro), validate that prospects come in, then hire to absorb the demand. The reverse — hire and hope — is the move that bankrupts small firms.\n\n${URL_MAIN}` },
      'Two-step diagram: channel → revenue → hire, hot pink'
    ),
    day('2026-06-14', 42, 'Week 6 wrap',
      { title: 'Scale or stay capped', copy: `The CPA shortage is a tailwind for the pros who scale themselves. The cheapest way to scale is a YouTube channel.\n\nTax Avatar Pro is the cheapest way to run one.\n\n${URL_MAIN}` },
      { title: 'Three weeks to Kwong', copy: `From today, three weeks until Kwong content stops being timely.\n\nIf you start now, you have 12 ranking videos by July 10.\n\n${URL_MAIN}` },
      { title: 'Three weeks until the Kwong window closes — what matters now',
        copy: `Three weeks remain before July 10, 2026.\n\nIn three weeks, a tax pro with a Tax Avatar Pro channel can ship:\n\n- 12 ranking videos on Kwong / Form 843 / penalty refund topics.\n- 6 niche-specific videos for one segment of their book.\n- 4 evergreen explainers on transcript codes.\n- A complete intake page with embedded videos.\n\nThe pros who do this capture the search traffic that lands when the window closes — because that traffic has nowhere else to go. The supply of pros who answered these questions in video form is small. Demand is enormous and rising.\n\nThis is the most asymmetric three-week marketing investment a tax pro can make in 2026. The math says start.\n\n${URL_MAIN}` },
      'Calendar with 21 days marked countdown to Kwong, hot pink'
    ),
  ],
};

// ---------- WEEK 7: Channel types — 843, tools, transcripts ----------
const week7 = {
  weekNumber: 7,
  weekLabel: 'Channel types — Form 843, tools, transcript codes',
  days: [
    day('2026-06-15', 43, 'Form 843 channel',
      { title: 'Form 843 specialist', copy: `An entire YouTube channel built around Form 843 walkthroughs is one of the highest-ROI niches for 2026.\n\nKwong made it the form of the year. Tax Avatar Pro lets you ship every variation.\n\n${URL_MAIN}` },
      { title: '6 video starter set', copy: `843 for unemployment penalty. 843 for failure-to-file. 843 for failure-to-pay. 843 + reasonable cause. 843 + medical hardship. 843 with form 1040X.\n\nSix evergreen videos.\n\n${URL_MAIN}` },
      { title: 'The Form 843 channel as a content blueprint',
        copy: `If a tax pro asked me to design a YouTube channel today, I would build it around Form 843.\n\nKwong made Form 843 the highest-search-volume tax form of the year. Most taxpayers have never heard of it. Most existing YouTube content is either generic or 5+ years old.\n\nThe content blueprint:\n\n- Episode 1: What is Form 843, in plain English.\n- Episode 2: Form 843 for unemployment penalty refunds (Kwong-specific).\n- Episode 3: Form 843 for failure-to-file penalty.\n- Episode 4: Form 843 for failure-to-pay penalty.\n- Episode 5: Reasonable cause language that wins.\n- Episode 6: Form 843 + Form 1040X — when to file both.\n\nSix episodes. Six evergreen rankings. One avatar. One voice. $29/month.\n\nEvery prospect Googling penalty refunds finds you.\n\n${URL_MAIN}` },
      'Form 843 form on screen with avatar pointing to fields, hot pink'
    ),
    day('2026-06-16', 44, 'Tax tools channel',
      { title: 'Tools content', copy: `Channels reviewing tax tools — IRS portal, Direct File, e-services, prep software — are an under-served lane.\n\nAvatars work especially well here because the screen does the visual.\n\n${URL_MAIN}` },
      { title: 'Voiceover-first', copy: `For tool walkthroughs, the avatar is mostly voiceover. Screen recording is the hero.\n\nTax Avatar Pro voices over the demo. You write the script.\n\n${URL_MAIN}` },
      { title: 'The tool-walkthrough channel — an under-served lane',
        copy: `Reviewing tax tools is one of the easiest YouTube niches for tax pros to dominate, and one of the least-touched.\n\nIRS portal walkthrough. e-services demo. Direct File comparison. Comparing TurboTax/H&R Block/FreeTaxUSA from a pro's perspective. Software for tax pros: Drake, Lacerte, ProSeries.\n\nFor these videos the visual is screen-recording. The avatar handles voiceover. The pro who does this becomes the trusted reviewer in their niche, and the affiliate revenue is real.\n\nTax Avatar Pro voices the demo. You scroll the screen. The channel ships.\n\n${URL_MAIN}` },
      'Screen-recording frame with avatar voiceover bubble, hot pink'
    ),
    day('2026-06-17', 45, 'Transcript code channel',
      { title: 'One code at a time', copy: `IRS transcript codes — 150, 290, 766, 810, 971, 977 — are searched by panicked taxpayers daily.\n\nA channel of one-code-per-video is evergreen forever.\n\n${URL_MAIN}` },
      { title: 'Compounding library', copy: `30 codes = 30 videos. Each one is a year of search traffic.\n\nWith Tax Avatar Pro, that is 7 weeks of work.\n\n${URL_MAIN}` },
      { title: 'The transcript-code channel — compounding evergreen content',
        copy: `Of all the YouTube channel types I have audited, the transcript-code channel has the best long-tail.\n\nIRS transcript codes are searched daily by taxpayers who just got an IRS letter and are trying to decode it. The search volume is steady year-round and spikes in the spring and fall notice waves.\n\nThe library:\n\n- Foundational codes: 150, 290, 766, 810, 826, 846, 971, 977.\n- Penalty codes: 160, 161, 170, 180.\n- Refund codes: 846, 898, 740.\n- Audit codes: 420, 421, 922.\n\n~30 codes total. Each one a 4–6 minute video. Each one a year of evergreen search traffic.\n\nWith Tax Avatar Pro, that is roughly 30 hours of script work spread over 7 weeks. After that, the library compounds.\n\n${URL_MAIN}` },
      'Grid of IRS transcript codes with views graph, hot pink'
    ),
    day('2026-06-18', 46, 'Notice walkthrough channel',
      { title: 'CP14, CP504, LT11', copy: `IRS notices have codes too — CP14, CP504, LT11, CP2000.\n\nA video for each = the channel for taxpayers who just opened scary mail.\n\n${URL_MAIN}` },
      { title: 'Demand on demand', copy: `Notice walkthrough searches spike right after the IRS sends a wave. Be the channel that ranks.\n\n${URL_MAIN}` },
      { title: 'The notice-walkthrough channel — riding IRS mail waves',
        copy: `The IRS sends notices in waves. CP14 wave in late spring. CP2000 wave in fall. CP504 and LT11 across the year for unpaid balances.\n\nEach wave produces a search spike that lasts 2–6 weeks. Taxpayers Google the exact notice number. The channels that rank for those queries get the traffic.\n\nA tax pro with a Tax Avatar Pro channel can build the entire library in a month: one video per major notice, plus an \"index\" video linking to all of them.\n\n- CP14 — initial balance due.\n- CP501 / CP503 — reminder notices.\n- CP504 — final notice intent to levy.\n- LT11 — final notice of intent to levy + right to hearing.\n- CP2000 — proposed adjustment.\n- CP90 — intent to seize.\n\nEach video evergreen. Each video on a recurring spike calendar.\n\n${URL_MAIN}` },
      'Stack of IRS envelopes with notice codes, hot pink'
    ),
    day('2026-06-19', 47, 'Topic combinations',
      { title: 'Combine niches', copy: `Combine niches for compounding: \"Form 843 for truckers\". \"Transcript codes for real-estate investors\". \"CP2000 for crypto traders\".\n\nLow competition. High intent.\n\n${URL_MAIN}` },
      { title: 'Niche × topic = audience', copy: `A 30-video library at the niche × topic intersection ranks for searches no big channel can match.\n\n${URL_MAIN}` },
      { title: 'Niche × topic — the highest-leverage YouTube SEO play',
        copy: `Generalist tax content competes with every other tax channel. Niche × topic content competes with almost nothing.\n\nExamples:\n\n- \"Form 843 for owner-operator truckers\".\n- \"Transcript code 150 for real-estate investors\".\n- \"CP2000 notice for crypto traders\".\n- \"Failure-to-file penalty for digital nomads abroad\".\n- \"843 + reasonable cause for medical-leave employees\".\n\nEach intersection has under-served search volume. Each one is a video a Tax Avatar Pro user can ship in 30 minutes.\n\nA library of 30 niche × topic videos becomes the SEO moat for a small firm. By the time a generalist channel notices the niche, you have the rankings.\n\n${URL_MAIN}` },
      'Venn diagram of niche × topic with overlap region highlighted, hot pink'
    ),
    day('2026-06-20', 48, 'YouTube Shorts',
      { title: 'Shorts are easy', copy: `60-second avatar Shorts on a single concept — one transcript code, one notice, one form question — drive subscribers fast.\n\n${URL_MAIN}` },
      { title: 'Long video + 5 Shorts', copy: `One full video can spin out 5 Shorts. The avatar makes it almost free.\n\n${URL_MAIN}` },
      { title: 'YouTube Shorts as the subscriber-acquisition layer',
        copy: `Shorts are the cheapest subscriber-acquisition tool YouTube has shipped.\n\nFor tax pros, the formula is repeatable:\n\n1. Long-form video: 5–8 minute deep dive on one topic.\n2. Spin out 4–6 Shorts from the same script: one stat, one notice example, one common mistake, one CTA.\n3. Cross-link Shorts → long-form video.\n\nShorts get discovery. Long-form gets watch-time. Both get the channel monetized faster.\n\nWith Tax Avatar Pro, the marginal cost of a Short is 10 minutes of script trim and a vertical render. A pro who ships 4 long videos per month plus 16 Shorts is the channel YouTube's algorithm starts to push.\n\n${URL_MAIN}` },
      'Vertical phone mockup with Shorts feed of avatar clips, hot pink'
    ),
    day('2026-06-21', 49, 'Week 7 wrap',
      { title: 'Pick a channel type', copy: `Form 843. Tools. Transcript codes. Notices. Niche × topic. Shorts.\n\nPick one. Ship 10 videos. See what ranks.\n\n${URL_MAIN}` },
      { title: 'Two weeks to Kwong', copy: `The window closes July 10. Two weeks left.\n\nWhich channel type are you going to start?\n\n${URL_MAIN}` },
      { title: 'Choosing your first channel type',
        copy: `Six channel formats covered this week:\n\n- Form 843 specialist.\n- Tax-tools reviewer.\n- Transcript-code library.\n- Notice walkthrough.\n- Niche × topic.\n- Shorts-first.\n\nFor a tax pro starting today with two weeks until the Kwong deadline, the answer is Form 843 specialist + Shorts.\n\nWhy: Form 843 is the form of the year, the search volume is rising weekly, and the deadline gives every video a built-in urgency hook. Shorts pile on the discovery layer.\n\nMost pros will not do this. The few who do will own the search rankings for an entire generation of taxpayers searching for penalty refund help.\n\n${URL_MAIN}` },
      'Six-format menu with Form 843 highlighted, hot pink'
    ),
  ],
};

// ---------- WEEK 8: Kwong Countdown ----------
const week8 = {
  weekNumber: 8,
  weekLabel: 'Kwong countdown',
  days: [
    day('2026-06-22', 50, '24 days remaining',
      { title: '24 days', copy: `24 days until the Kwong v. United States deadline. July 10, 2026.\n\nMillions of taxpayers eligible. Most do not know.\n\nThe pros who explain it now win.\n\n${URL_MAIN}` },
      { title: 'What happens July 10', copy: `After July 10, the penalty refund window closes for most filers. The traffic to penalty-refund content drops sharply.\n\nRank now or wait for the next case.\n\n${URL_MAIN}` },
      { title: '24 days until the Kwong window closes — what to ship now',
        copy: `From today, 24 days remain before the July 10, 2026 Kwong deadline.\n\nFor a tax pro launching a Tax Avatar Pro channel today, that is enough time to:\n\n- Ship 6 weekly videos on Kwong-related topics.\n- Spin out 24 Shorts from those videos.\n- Build a landing page with embedded videos.\n- Pull inbound for the final two weeks of the window.\n\nMost pros will treat the deadline as a deadline. The ones who treat it as a marketing window will be the ones whose phones ring on July 11 from clients who filed in time.\n\nThe arithmetic is simple. The execution is what is rare.\n\n${URL_MAIN}` },
      'Big "24" countdown clock over a calendar, hot pink'
    ),
    day('2026-06-23', 51, 'Eligibility content',
      { title: 'Who is eligible', copy: `W-2 earners with unemployment penalties. 1099 earners with quarterly estimate penalties. Anyone hit with the failure-to-pay or failure-to-file penalty in qualifying years.\n\nVideos for each.\n\n${URL_MAIN}` },
      { title: 'Eligibility video set', copy: `Six eligibility videos cover most of the addressable Kwong market.\n\nWith Tax Avatar Pro, that is one weekend.\n\n${URL_MAIN}` },
      { title: 'The Kwong eligibility video set — what to publish this weekend',
        copy: `If you launched a Kwong-focused YouTube channel this weekend, here is the minimum video set:\n\n1. \"Are you eligible for a Kwong penalty refund?\" — top-of-funnel explainer.\n2. \"Kwong refunds for W-2 employees with unemployment penalties\".\n3. \"Kwong refunds for 1099 contractors with estimated-tax penalties\".\n4. \"Kwong refunds when you missed a quarterly payment\".\n5. \"Kwong refunds and failure-to-file — different rules\".\n6. \"Kwong refunds and reasonable cause — when both apply\".\n\nSix videos. One weekend with Tax Avatar Pro. Six rankings before July 10.\n\nEach video links to your booking page. Each booking is a $500–$1,500 engagement.\n\nThe ROI on this weekend, for any tax pro with a public-facing practice, is enormous.\n\n${URL_MAIN}` },
      'Eligibility flowchart with branches to W-2 and 1099, hot pink'
    ),
    day('2026-06-24', 52, 'Form 843 walkthrough',
      { title: 'Walk it through', copy: `A Form 843 step-by-step video — line-by-line — is the single highest-converting Kwong content.\n\nProspects who watch a walkthrough call you to file it.\n\n${URL_MAIN}` },
      { title: 'Avoid generic', copy: `Generic Form 843 videos exist. None of them are Kwong-specific.\n\nKwong-specific = your video.\n\n${URL_MAIN}` },
      { title: 'Why the Form 843 walkthrough video converts',
        copy: `Of all video formats for tax-procedure marketing, the line-by-line form walkthrough is the highest-converting.\n\nThe psychology: a taxpayer searching for Form 843 information has decided they want a refund. The remaining question is who fills it out. A walkthrough video that shows them what is involved triggers one of two responses: \"I can do this myself\" or \"I cannot do this myself.\"\n\nThe second group calls you. They have already pre-qualified.\n\nWith Tax Avatar Pro, the production is trivial: screen-record a Form 843 PDF, voiceover the avatar, ship a 12-minute video. Pin to your channel.\n\nThis is the single highest-leverage Kwong video a tax pro can publish.\n\n${URL_MAIN}` },
      'Form 843 close-up with line numbers and avatar pointing, hot pink'
    ),
    day('2026-06-25', 53, 'Reasonable cause',
      { title: 'The language', copy: `Reasonable cause language is what wins penalty refunds.\n\nA video unpacking acceptable reasons + sample wording is the second-most-watched Kwong topic.\n\n${URL_MAIN}` },
      { title: 'Be the source', copy: `If your reasonable-cause video is the one that ranks, every taxpayer drafting their own letter is reading your script first.\n\n${URL_MAIN}` },
      { title: 'Reasonable cause as a Kwong content pillar',
        copy: `Reasonable cause is the language that turns a Form 843 from a long-shot into a granted refund.\n\nThe IRS reasonable-cause framework is decades old, but the documented language that lands successful claims is scattered across IRS publications, court rulings, and practitioner blogs. There is no single video that compiles it well for taxpayers.\n\nThat is the gap.\n\nA video — or better, a 4-video series — that walks through:\n\n1. What reasonable cause means.\n2. Acceptable reasons (illness, natural disaster, relied-on-bad-advice, IRS error).\n3. Documentation that supports each.\n4. Sample language that has worked.\n\nThis is a moat. Once it ranks, every Kwong filer reads your script before they call anyone.\n\n${URL_MAIN}` },
      'Sample reasonable-cause letter on screen, hot pink'
    ),
    day('2026-06-26', 54, 'Booking strategy',
      { title: 'CTA in every video', copy: `Every Kwong video should end with the same CTA: book a 15-minute consult.\n\nLink in description. Link pinned to top comment.\n\n${URL_BOOK}` },
      { title: 'Kwong is a closer', copy: `Penalty refunds are a high-intent topic. Prospects who watch your video are 80% closed.\n\nThe booking link does the rest.\n\n${URL_BOOK}` },
      { title: 'Engineering the booking funnel for Kwong content',
        copy: `Kwong viewers are the highest-intent traffic on YouTube right now. Treat the funnel accordingly.\n\nPattern that works:\n\n1. Video opens with the eligibility question — \"Did you pay an IRS penalty in [year]?\".\n2. Body explains the case and Form 843 path.\n3. CTA at the 70% mark — \"If this applies to you and you want help, book 15 minutes\".\n4. End-card CTA repeats it.\n5. Pinned comment with the booking link and a one-line summary.\n6. Description first line: link.\n\nWith Tax Avatar Pro, this CTA structure is template-able. Same closing avatar pattern in every video.\n\nA 5% click-to-book rate on a video that pulls 500 views is 25 booked consults. At a 50% close rate that is 12–13 new engagements at $500–$1,500 each.\n\n${URL_BOOK}` },
      'YouTube end-card with Book Now button, hot pink'
    ),
    day('2026-06-27', 55, 'Crisis content',
      { title: 'Pre-deadline panic', copy: `In the last week of June and first week of July, Kwong searches will spike as taxpayers realize the deadline.\n\nVideos titled \"Kwong deadline July 10 — what you need to do this week\" will pull traffic.\n\n${URL_MAIN}` },
      { title: 'Be ready for the spike', copy: `Pre-script the spike content now. Hit publish on July 1.\n\n${URL_MAIN}` },
      { title: 'The pre-deadline traffic spike — be ready for it',
        copy: `Every deadline-driven topic has a panic spike in the final 7–10 days. Kwong will follow the pattern.\n\nThe last week of June and first week of July will produce a search-volume spike for queries like:\n\n- \"Kwong deadline\"\n- \"How long do I have to file Form 843\"\n- \"Penalty refund deadline 2026\"\n- \"Last chance Kwong\"\n\nThe channels that publish into the spike capture it. The channels that publish two weeks after the spike do not.\n\nWith Tax Avatar Pro, scripting the spike content this week and scheduling it for July 1 is a 90-minute job. The traffic from a single panic-titled video can outperform an entire month of normal publishing.\n\nDo not miss the spike.\n\n${URL_MAIN}` },
      'Search-volume curve spiking before July 10, hot pink'
    ),
    day('2026-06-28', 56, 'Week 8 wrap',
      { title: '12 days left', copy: `12 days. Last full week before deadline.\n\nIf you start a channel today, 3–4 videos by July 10. Still worth it.\n\n${URL_MAIN}` },
      { title: 'After Kwong', copy: `Form 843 stays relevant after Kwong — failure-to-file, failure-to-pay, reasonable cause, all year.\n\nThe channel survives the deadline.\n\n${URL_MAIN}` },
      { title: 'After Kwong — why the channel still wins',
        copy: `One concern from tax pros about a Kwong-themed channel: \"Won't the traffic die on July 11?\"\n\nNo. Here is why.\n\nForm 843 is not Kwong-specific. The form covers failure-to-file penalty, failure-to-pay penalty, reasonable-cause refunds, and a long list of other penalty contexts. Kwong is the headline; the underlying form gets searched all year.\n\nAdjacent topics — transcript codes, IRS notices, niche × topic content — compound for years.\n\nA tax pro who builds a Kwong-themed channel between now and July 10 has a 50-video evergreen library by year-end. The Kwong videos are the spike. The library is the asset.\n\nThe channel is the right move regardless of the deadline.\n\n${URL_MAIN}` },
      'Library shelf labeled "Form 843 evergreen" with Kwong on top shelf, hot pink'
    ),
  ],
};

// ---------- WEEK 9: Avatar Spotlights Part 2 — Knox, Denyse, Griffin ----------
const week9 = {
  weekNumber: 9,
  weekLabel: 'Avatar Spotlights — Knox, Denyse, Griffin',
  days: [
    day('2026-06-29', 57, 'Meet Knox',
      { title: 'Knox — senior pro', copy: `Knox is the avatar most senior partners pick. 25 looks. Authoritative tone.\n\nIf your firm's voice is \"40 years of experience\", Knox lands.\n\n${URL_AVATARS}` },
      { title: 'Firm-channel fit', copy: `Knox is the firm-channel avatar. Multi-partner firms use him for general explainer content.\n\n${URL_AVATARS}` },
      { title: 'Knox — when authority is the brand',
        copy: `Knox is the avatar built for senior-pro and multi-partner-firm channels.\n\n25 looks, all in business-formal framing. The voice presets are deeper, more measured. He reads as a partner, not an associate.\n\nFor a firm with a 40-year history and a brand built on institutional trust, Knox is the right host. He matches the visual the audience expects.\n\nThis is not a young-EA avatar. It is a wealth-management-firm avatar. A partner-led tax-controversy practice avatar.\n\n${URL_AVATARS}` },
      'Avatar Knox in business-formal framing, hot pink'
    ),
    day('2026-06-30', 58, 'Meet Denyse',
      { title: 'Denyse — 33 looks', copy: `Denyse has 33 looks across professional, casual-office, and warm-explainer styles.\n\nUsed across the most pilot accounts after Annie.\n\n${URL_AVATARS}` },
      { title: 'When to pick Denyse', copy: `Pick Denyse for client-letter walkthroughs and notice videos. Her warm tone fits the \"do not panic\" framing.\n\n${URL_AVATARS}` },
      { title: 'Denyse — the second-most-used avatar in the pilot, here is why',
        copy: `Denyse is the second-most-used avatar across the Tax Avatar Pro pilot, behind only Annie.\n\n33 looks. Voice presets that are warm without being soft. Best fit: client-letter and IRS-notice walkthroughs.\n\nThe pattern: when a video topic has a panic or anxiety component — \"I just got a CP14 notice and I do not know what to do\" — Denyse outperforms the alternatives. The audience needs reassurance and clarity at the same time. Her presets handle both.\n\nIf your channel is built around demystifying scary IRS communications, Denyse should be your first stop.\n\n${URL_AVATARS}` },
      'Avatar Denyse with warm office backdrop, hot pink'
    ),
    day('2026-07-01', 59, 'Meet Griffin',
      { title: 'Griffin — procedure', copy: `Griffin handles deep procedural content. 20 looks. Best for dense topics — multi-state, advanced 1040 issues, S-corp basis.\n\n${URL_AVATARS}` },
      { title: 'For the technical lane', copy: `If your audience is other tax pros (CE channels, peer education), Griffin reads as a peer, not a presenter.\n\n${URL_AVATARS}` },
      { title: 'Griffin — for procedural and peer-education channels',
        copy: `Griffin is the avatar built for dense technical content.\n\n20 looks. Voice presets that are crisp and pedagogical. Best fit: multi-state tax allocation, S-corp basis, partnership 754 elections, advanced 1040 schedules.\n\nGriffin's secondary fit is peer-education content. If your channel teaches other tax pros — CE-eligible content, niche software walkthroughs, tax-update summaries — Griffin reads as a peer rather than a presenter. That changes how the audience receives the material.\n\nFor pros considering a CE-revenue channel, Griffin is the right avatar.\n\n${URL_AVATARS}` },
      'Avatar Griffin at a desk with technical diagrams, hot pink'
    ),
    day('2026-07-02', 60, 'Senior + warm + procedural',
      { title: 'Three roles', copy: `Knox = authority. Denyse = warmth. Griffin = procedure.\n\nMost firms can fit any of the three to a content lane.\n\n${URL_AVATARS}` },
      { title: 'One firm, three avatars', copy: `Some firms run all three on one channel — Knox for partner videos, Denyse for client-facing, Griffin for technical.\n\n${URL_AVATARS}` },
      { title: 'How a multi-partner firm uses three avatars on one channel',
        copy: `One pattern from larger firms in the Tax Avatar Pro pilot: three avatars, three lanes, one channel.\n\n- Knox hosts the firm-overview content. \"Here is who we are, here is what we do.\"\n- Denyse hosts the client-facing explainers. \"Here is what your CP2000 means.\"\n- Griffin hosts the technical / CE content. \"Here is how multi-state allocation works for SaaS.\"\n\nEach avatar gets its own playlist. Subscribers self-segment. The firm covers three audiences from one production engine.\n\n$29/month. Six avatars in the bundle. The constraint stops being scope.\n\n${URL_AVATARS}` },
      'Three-avatar firm channel layout with three playlists, hot pink'
    ),
    day('2026-07-03', 61, '6 days to Kwong',
      { title: '6 days', copy: `6 days until July 10.\n\nIf you have not started a Kwong channel by now, the move is to ship 2 panic videos this week and pin them to the channel.\n\n${URL_MAIN}` },
      { title: 'Late-cycle play', copy: `Even at 6 days out, a panic-titled Kwong video can pull 200+ views and 5+ booked consults.\n\n${URL_MAIN}` },
      { title: 'Six days from Kwong — the late-cycle marketing play',
        copy: `If you missed the early-cycle window, six days is enough for a panic play.\n\nThe move: subscribe to Tax Avatar Pro this morning. Script two videos by tomorrow:\n\n1. \"Kwong deadline July 10 — what you need to file this week\".\n2. \"Last-chance Form 843 walkthrough — Kwong edition\".\n\nRender, upload, pin to the channel, share to your existing client list, post to LinkedIn, push to your firm's email list.\n\nA panic-titled Kwong video published July 3 can pull 200+ views and convert 5–10% of viewers to booked consults. That is real revenue from one weekend of work.\n\nThe full channel asset compounds for years afterward.\n\n${URL_MAIN}` },
      'Calendar showing 6 days with Publish Now badge, hot pink'
    ),
    day('2026-07-04', 62, 'Holiday weekend = work',
      { title: 'Holiday script time', copy: `4th of July weekend is the cheapest writing time of the year for tax pros.\n\nNobody is calling. Two videos in three hours.\n\n${URL_MAIN}` },
      { title: 'Hit publish Monday', copy: `Render Sunday, schedule for Monday morning. Cover the panic week.\n\n${URL_MAIN}` },
      { title: 'How to use a holiday weekend as a marketing-leverage window',
        copy: `One of the underused leverage moves for solo tax pros: holiday weekends as content-production windows.\n\nThe phones do not ring on the 4th. Email volume drops. The competing demand for your time is at its lowest.\n\nFor a Tax Avatar Pro channel, that is three hours of script work that produces 6 weeks of content.\n\nThis weekend specifically — with the Kwong deadline 6 days out — turning even a single afternoon into 4 panic-titled videos and 12 Shorts is the highest-ROI marketing move available to a small firm.\n\nThe pros who win are not the ones who work harder during the busy season. They are the ones who use the slow weekends to build leverage.\n\n${URL_MAIN}` },
      'Empty office on July 4 with laptop and Tax Avatar Pro screen, hot pink'
    ),
    day('2026-07-05', 63, 'Week 9 wrap',
      { title: 'Three avatars deeper', copy: `Knox, Denyse, Griffin. Three avatars for senior, warm, and procedural content.\n\nFinal week ahead. Kwong closes Friday.\n\n${URL_MAIN}` },
      { title: 'Final push starts Monday', copy: `Monday begins the last 5 days of the Kwong window. Make them count.\n\n${URL_MAIN}` },
      { title: 'Heading into the final week — what the data says',
        copy: `Going into the final week before the Kwong deadline:\n\n- Search volume on Form 843 / penalty refund queries is at the year's peak.\n- Booking pages with embedded Kwong content are converting at 8–12%.\n- The avatars getting the most usage in pilot accounts are Annie (warm explainer) and Denyse (notice walkthrough).\n- The video format with the highest watch time is the line-by-line Form 843 walkthrough.\n- Shorts referencing the deadline are out-performing topical Shorts 3:1.\n\nFor any tax pro still on the fence: the next 5 days are the highest-ROI marketing days of 2026. After July 10, the window closes and the search traffic decays.\n\nThe move is the same it has been all month. Subscribe. Ship.\n\n${URL_MAIN}` },
      'Dashboard with 5 metrics for final week, hot pink'
    ),
  ],
};

// ---------- WEEK 10: Final Push ----------
const week10 = {
  weekNumber: 10,
  weekLabel: 'Final Push — last week before Kwong deadline',
  days: [
    day('2026-07-06', 64, '4 days',
      { title: '4 days left', copy: `4 days until the Kwong window closes.\n\nIf you have a Tax Avatar Pro channel, this is the week to publish daily.\n\n${URL_MAIN}` },
      { title: 'Daily publish week', copy: `Mon-Thu, one Kwong video per day. Each one keyed to a different eligibility scenario.\n\n${URL_MAIN}` },
      { title: 'Final-week publishing cadence — daily, not weekly',
        copy: `For the final week before a deadline-driven traffic spike, the right cadence is daily — not weekly.\n\nThe rationale: search volume in the final 4 days will exceed search volume from the entire month before. Each day publishing produces one ranking video that catches one wave of the spike.\n\nThe Tax Avatar Pro production budget for daily publishing this week:\n\n- Monday: 30 min — script one eligibility video, render, publish.\n- Tuesday: 30 min — script Form 843 walkthrough, render, publish.\n- Wednesday: 30 min — reasonable-cause language video.\n- Thursday: 30 min — \"last chance — file by Friday\" panic video.\n- Friday: monitor inbound bookings.\n\nTwo hours of work. Four ranking videos. The biggest marketing return of the year.\n\n${URL_MAIN}` },
      'Daily-publish calendar Mon-Thu with checkmarks, hot pink'
    ),
    day('2026-07-07', 65, '3 days',
      { title: '3 days', copy: `Three days. Tomorrow is the panic Wednesday. Friday is the deadline.\n\nThe pros publishing daily will own the search results.\n\n${URL_MAIN}` },
      { title: 'Live videos count', copy: `If you cannot ship a polished video, ship a 3-minute avatar Short with a deadline reminder.\n\nVolume beats perfection in this window.\n\n${URL_MAIN}` },
      { title: 'Three days out — the small video beats no video',
        copy: `Three days before the Kwong deadline.\n\nTo any tax pro who is reading this and has not shipped a video yet: the threshold is not a polished long-form. It is a video that exists.\n\nA 90-second avatar Short titled \"Kwong deadline July 10 — file this week\" with one clear CTA outperforms an unpublished masterpiece every time.\n\nWith Tax Avatar Pro, that 90-second Short is 15 minutes of work. Render and ship.\n\nThe traffic this week is searching for an answer. The pros who provide one — even a brief one — get the calls.\n\n${URL_MAIN}` },
      '3-day countdown with simple Short mockup, hot pink'
    ),
    day('2026-07-08', 66, 'Panic Wednesday',
      { title: 'Panic content', copy: `Today is panic Wednesday. The biggest single-day search-volume bump for Kwong content.\n\nIf you have one video to publish, today is the day.\n\n${URL_MAIN}` },
      { title: 'Title format', copy: `\"Kwong deadline FRIDAY — what to file by July 10\". Direct. Search-keyword aligned. Date in title.\n\n${URL_MAIN}` },
      { title: 'Panic Wednesday — engineering the video that captures the spike',
        copy: `The Wednesday before a Friday deadline produces the largest single-day search volume of the entire deadline cycle. For Kwong on July 10, today is that Wednesday.\n\nThe video that captures the spike has three properties:\n\n1. Title: deadline + day-of-week + form. Example — \"Kwong deadline Friday July 10 — what to file this week\".\n2. First 30 seconds: state the deadline, state the action, state the eligibility. No preamble.\n3. End: booking link, repeated as on-screen text and as a verbal CTA.\n\nWith Tax Avatar Pro, this video is 30 minutes of script + 5 minutes of render. Publish before lunch. Push to your client list, your firm's email list, and your LinkedIn network. The next 48 hours are the inbound peak.\n\n${URL_MAIN}` },
      'Title text PANIC WEDNESDAY with calendar Wed highlighted, hot pink'
    ),
    day('2026-07-09', 67, 'One day left',
      { title: 'One day', copy: `One day until the Kwong deadline.\n\nIf you publish a single video today, make it the booking-page hub video.\n\n${URL_MAIN}` },
      { title: 'Hub video', copy: `60-second video on your booking page that says: \"Kwong deadline is tomorrow. Here is what to do today.\" Avatar-fronted. Done in 20 minutes.\n\n${URL_BOOK}` },
      { title: 'One day before Kwong — the booking-page hub video',
        copy: `On the day before a deadline, the highest-leverage video is not on YouTube. It is on your booking page.\n\nA 60-second avatar-fronted video at the top of your Kwong booking page that says \"Kwong deadline is tomorrow. Here is what to do today, here is how I can help, click below to book\" raises booking-page conversion by a meaningful margin.\n\nWith Tax Avatar Pro, this video is 20 minutes of script and render. Drop it on the booking page. Push the booking link one more time to your audience.\n\nThe last 24 hours are the highest-intent traffic of the whole window. Optimize the booking surface, not the channel.\n\n${URL_BOOK}` },
      'Booking page mockup with avatar hub video at top, hot pink'
    ),
    day('2026-07-10', 68, 'Deadline day',
      { title: 'July 10', copy: `Today is the Kwong deadline. The window closes today.\n\nKwong-eligible Form 843s filed today still count. Inbound calls are at peak.\n\n${URL_MAIN}` },
      { title: 'Take the calls', copy: `Cancel non-essential meetings today. Take the calls.\n\nPublish a single 30-second avatar Short: \"Today is the Kwong deadline. Last chance — call now.\"\n\n${URL_BOOK}` },
      { title: 'Deadline day — operational mode for tax pros',
        copy: `Today is the Kwong deadline.\n\nThis is not a content-marketing day. It is an inbound-handling day.\n\nFor tax pros who built a Tax Avatar Pro channel over the last 10 weeks, today's job is:\n\n1. Publish one final 30-second avatar Short — \"Today is the Kwong deadline. Last chance to file Form 843 — call now.\"\n2. Pin it to the channel and the booking page.\n3. Clear the calendar.\n4. Take the inbound calls.\n5. File what you can today.\n\nThe channel did its job. The funnel did its job. Today is execution.\n\nTomorrow you start the next campaign.\n\n${URL_BOOK}` },
      'Big DEADLINE TODAY badge with phone-ringing icon, hot pink'
    ),
    day('2026-07-11', 69, 'Day after',
      { title: 'After the window', copy: `Kwong window is closed. Search traffic for penalty refunds drops sharply this week.\n\nThe channel does not stop. Form 843 stays evergreen.\n\n${URL_MAIN}` },
      { title: 'New series Monday', copy: `Reset. Pick a new content theme — transcript codes, niche × topic, notice walkthroughs.\n\nThe avatar does not rest.\n\n${URL_MAIN}` },
      { title: 'The day after a deadline — what successful campaigns do next',
        copy: `The day after a deadline-driven content campaign is the most under-thought-about day in marketing for tax pros.\n\nThe wrong move: stop publishing. The channel goes dark, the audience disperses, and the next campaign starts cold.\n\nThe right move: publish a debrief video. \"Kwong window is closed — here is what we filed, here is what is next, here is the next deadline I am tracking for clients.\"\n\nThis video does three things:\n\n1. Captures the post-deadline tail traffic from people who missed it.\n2. Signals to subscribers that the channel is ongoing.\n3. Sets up the next content theme.\n\nWith Tax Avatar Pro, that video is 25 minutes of work. Publish, then plan next week's series.\n\n${URL_MAIN}` },
      'Calendar with July 10 crossed and arrow to next campaign, hot pink'
    ),
    day('2026-07-12', 70, 'Week 10 wrap — campaign close',
      { title: '10 weeks done', copy: `10 weeks of TAVLP launch content done.\n\nThe channels that ran this campaign now have 50–70 ranking videos and a working booking funnel.\n\n${URL_MAIN}` },
      { title: 'Next', copy: `Next campaign: building the evergreen library. Form 843 deep dives, transcript codes, niche × topic. Same playbook.\n\n${URL_MAIN}` },
      { title: 'Closing the 10-week TAVLP launch campaign',
        copy: `Ten weeks ago we launched Tax Avatar Pro with a simple thesis: most tax pros know they should be on YouTube, and almost none of them want to be on camera. Avatar-fronted channels close that gap.\n\nWhat we have seen across the pilot:\n\n- 923 organic views on the test channel in 30 days.\n- Real demand signal in viewer comments asking for help with specific IRS codes.\n- Six avatars in active use, with Annie + Denyse leading and Knox / Griffin / Tariq / Genesis filling specialized lanes.\n- A 26-video power-law distribution that confirms throughput beats perfection.\n- A complete Kwong campaign blueprint that converts.\n\nFor any tax pro who has been reading this campaign and waiting for the right time: the right time is the week after a campaign closes. The avatar does not rest. The channel does not stop.\n\nNext campaign starts Monday. Subscribe and ship.\n\n${URL_MAIN}` },
      'Banner CAMPAIGN COMPLETE with metrics dashboard, hot pink'
    ),
  ],
};

// ---------- Merge ----------
const newWeeks = [week2, week3, week4, week5, week6, week7, week8, week9, week10];
week1Data.weeks.push(...newWeeks);
// Update campaign window
week1Data.campaign = {
  name: 'TAVLP Launch — Weeks 1-10',
  start: '2026-05-04',
  end: '2026-07-12',
};

const outPath = path.resolve(__dirname, '..', '.tavlp-full-content.json');
fs.writeFileSync(outPath, JSON.stringify(week1Data, null, 2));
console.log('Wrote', outPath);
console.log('Total weeks:', week1Data.weeks.length);
let totalDays = 0, totalFb = 0, totalLi = 0;
for (const w of week1Data.weeks) {
  for (const d of (w.days || [])) {
    totalDays++;
    totalFb += (d.fbPage || []).length;
    if (d.linkedin) totalLi++;
  }
}
console.log('Days:', totalDays, 'FB posts:', totalFb, 'LinkedIn posts:', totalLi);
