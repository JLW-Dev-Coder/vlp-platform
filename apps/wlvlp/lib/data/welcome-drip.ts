// WLVLP /launch welcome drip — 3-email sequence triggered by wlvlp_leads insert.
//
// This file is the authoritative source of drip copy for reference and preview
// pages on the frontend. The Worker inlines its own copies of these emails in
// the cron handler (the Worker cannot import from frontend apps), so changes
// here must be mirrored in apps/worker/src/index.js (handleWlvlpDripCron).

export type DripEmail = {
  id: "welcome" | "social-proof" | "urgency";
  delayDays: number;
  subject: string;
  body: string; // plaintext, {first_name} placeholder
};

export const WELCOME_DRIP: DripEmail[] = [
  {
    id: "welcome",
    delayDays: 0,
    subject: "Your Website Lotto ticket is in — welcome, {first_name}",
    body: `Hey {first_name},

Xavier here from Website Lotto.

You just pulled the tab on a new way to get online — a real, live
website for your business without the designer price tag.

Here's what's waiting for you:

1. Browse the template gallery — every one is production-ready and
   mobile-first. Pick the look that fits your hustle.
   https://websitelotto.virtuallaunch.pro/templates

2. Scratch your ticket — seriously. You're holding a scratch card
   that gives you a shot at a free site. Play it now:
   https://websitelotto.virtuallaunch.pro/scratch

3. Set up in under 10 minutes. Once you pick a template, we launch
   your custom subdomain the same day.

If you have a question, just reply to this email — it comes straight
to my inbox.

— Xavier
Website Lotto | websitelotto.virtuallaunch.pro`,
  },
  {
    id: "social-proof",
    delayDays: 2,
    subject: "{first_name}, here's what other owners built this week (+ 50% off)",
    body: `Hey {first_name},

Quick one — I pulled up the last 7 days of Website Lotto launches
and thought you'd want to see what's possible:

  • A mobile detailer in Phoenix went live Tuesday morning. Had a
    booking by Tuesday night.
  • A small-town bakery swapped out their Facebook-only presence
    for a real site in one afternoon.
  • A tax pro in Atlanta picked our "Firm" template and is already
    ranking for her town name.

None of them had a designer. None of them had a developer. They just
picked a template, filled in their details, and launched.

Still on the fence? Here's a nudge:

  Use code LAUNCH50 at checkout — 50% off any template.

This one's time-limited and won't stack with other promos. If you
want to take a look first:

https://websitelotto.virtuallaunch.pro/templates

Reply if you need help picking — happy to point you at the right
template based on what your business does.

— Xavier
Website Lotto`,
  },
  {
    id: "urgency",
    delayDays: 5,
    subject: "{first_name}, last call — a full month on the house",
    body: `Hey {first_name},

This is the last email in the series from me, so I want to make it
worth your while.

You signed up almost a week ago. If Website Lotto still feels like
the right move but something's holding you back, here's a final
offer — no strings:

  Use code FREEMONTH at checkout — first month of hosting, free.

That covers your custom subdomain, the live site, and all the
updates for 30 days. If you hate it, cancel with one click. If you
love it, keep it going at standard pricing.

The whole point of Website Lotto is to take the risk out of getting
online. This offer does the same.

  https://websitelotto.virtuallaunch.pro/templates

If you ever want to come back later, the door's open — just reply
to any of my emails.

Thanks for giving us a look, {first_name}.

— Xavier
Website Lotto | websitelotto.virtuallaunch.pro`,
  },
];
