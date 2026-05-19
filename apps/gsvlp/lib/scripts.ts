export type ScriptLine =
  | { type: 'say'; text: string }
  | { type: 'instruction'; text: string }
  | { type: 'objection_header'; text: string }
  | { type: 'objection'; objectionLabel: string; text: string };

export interface ScriptStep {
  number: number;
  title: string;
  lines: ScriptLine[];
}

export interface ScriptDashboardPreview {
  label: 'CLOSER' | 'SETTER';
  opening: string[];
  responseOptions: Array<'No' | 'Maybe' | 'Yes'>;
  followUp: {
    yes: string[];
    maybe: string[];
    no: string[];
  };
}

export interface GsvlpScript {
  role: 'closer' | 'setter';
  dashboardPreview: ScriptDashboardPreview;
  callDetail: { steps: ScriptStep[] };
  voicemail: string;
}

export interface ProductObjections {
  notInterested: string;
  tooBusy: string;
  sendEmail: string;
  howMuch: string;
  alreadyHaveSomething: string;
  needToThink: string;
}

export interface ProductProfile {
  id: string;
  name: string;
  shortName: string;
  valueProp: string;
  revenueHook: string;
  quantifiedBenefit: string;
  pricing: string;
  closeOptions: string;
  description: string;
  objections: ProductObjections;
}

const OWNER_EMAIL = 'jamie.williams@virtuallaunch.pro';

export function isOwnerEmail(email: string | null | undefined): boolean {
  return (email || '').toLowerCase() === OWNER_EMAIL;
}

export const products: ProductProfile[] = [
  {
    id: 'ttmp',
    name: 'Transcript Tax Monitor Pro',
    shortName: 'TTMP',
    valueProp: 'a transcript-monitoring service their clients actually pay for monthly',
    revenueHook: '$50 to $100 per client per month in recurring revenue',
    quantifiedBenefit: "If you have even 20 clients on it, that's $1,000 to $2,000 a month you're not earning right now",
    pricing: 'Plans start at $10 a month',
    closeOptions: 'the basic plan at $10/month, or the professional plan that includes monitoring for all your clients',
    description: 'It automatically pulls IRS transcripts for your clients, monitors them for changes — new codes, balance shifts, notices — and sends you an alert. Your clients pay you a monthly fee for the monitoring.',
    objections: {
      notInterested:
        "I totally understand. A lot of the professionals we work with felt the same way at first — they weren't looking for anything new. But once they saw how transcript monitoring creates $50–$100/month per client in recurring revenue with almost no extra work, they found it was worth 15 minutes. Would it hurt to take a quick look?",
      tooBusy:
        "I hear you — tax season never really ends. That's actually why Jamie built this. It runs in the background for your clients. Can I book just 15 minutes at a time that works for you? Early morning or late afternoon?",
      sendEmail:
        "Absolutely, I can do that. But honestly, a quick 15-minute call will give you way more clarity than an email ever could. Jamie can walk you through the whole thing and answer your questions live. What does your Thursday look like?",
      howMuch:
        "Great question. Plans start at $10 a month, and most practices make that back from one client in the first month. Jamie can walk you through what makes sense for your practice size on the call — no commitment. Does this week or next work better?",
      alreadyHaveSomething:
        "That's great — you're ahead of most practices. Out of curiosity, does your current system monitor transcripts automatically and alert you when codes change? Because that's where most of the value is — catching things before your client calls you in a panic.",
      needToThink:
        "Absolutely — I'd want you to think about it. Can I ask, what specifically are you weighing? Is it the pricing, the fit, or something else? Let me set you up with a free look — no commitment. You can see the dashboard, see how transcripts pull in, and decide from there. If it's not a fit, no hard feelings. Fair enough?",
    },
  },
  {
    id: 'tpp',
    name: 'Tax Prep Pro',
    shortName: 'TPP',
    valueProp: 'a done-for-you tax prep practice setup — website, intake forms, CRM, and client management',
    revenueHook: 'a turnkey system that brings in new tax prep clients on autopilot',
    quantifiedBenefit: 'Most practices we set up add 10 to 20 new clients in the first 90 days',
    pricing: 'Setup starts at $497 with a $49/month subscription',
    closeOptions: 'the starter setup at $497, or the full practice launch that includes everything',
    description: 'We build your entire tax prep practice infrastructure — professional website, client intake forms, CRM, email automation, and appointment scheduling. Everything a modern tax practice needs to attract and manage clients.',
    objections: {
      notInterested:
        "I totally understand. A lot of the professionals we work with felt the same way at first — they figured their current setup was good enough. But once they saw how a turnkey practice setup adds 10 to 20 new clients in the first 90 days, they found it was worth 15 minutes. Would it hurt to take a quick look?",
      tooBusy:
        "I hear you — running a practice solo is relentless. That's actually exactly the problem we solve. We build the whole infrastructure for you so clients come to you instead of you chasing them. Can I book just 15 minutes at a time that works? Early morning or late afternoon?",
      sendEmail:
        "Absolutely. But honestly, a quick 15-minute walkthrough will show you way more than an email can — Jamie can show you actual practice sites we've launched and what they're producing. What does your Thursday look like?",
      howMuch:
        "Great question. Setup starts at $497 with a $49/month subscription, and most practices recover that from their first one or two new clients. Jamie can walk you through the options on the call — no commitment. Does this week or next work better?",
      alreadyHaveSomething:
        "That's great. Out of curiosity, is your current setup actively bringing in new clients each month, or is it more of a brochure site? Because that's where most practices leave money on the table — having an online presence that doesn't actually generate leads.",
      needToThink:
        "Absolutely — this is a real decision. Can I ask, what specifically are you weighing? Is it the investment, the timing, or something else? Let me set up a free walkthrough — no commitment. You'll see exactly what we'd build and decide from there. Fair enough?",
    },
  },
  {
    id: 'vlp',
    name: 'Virtual Launch Pro',
    shortName: 'VLP',
    valueProp: 'a complete digital platform that handles your website, client tools, and online presence',
    revenueHook: 'one platform that replaces 5-6 separate tools you\'re probably paying for individually',
    quantifiedBenefit: 'Most professionals we work with save $200 to $500 a month in software costs while getting better tools',
    pricing: 'Starts at $10 a month for the core platform',
    closeOptions: 'the core platform at $10/month, or the professional suite with everything included',
    description: 'Virtual Launch Pro is an all-in-one platform for tax professionals — website hosting, client management, transcript tools, scheduling, and more. One login, one subscription, everything you need.',
    objections: {
      notInterested:
        "I totally understand. A lot of the professionals we work with felt the same way at first — they had a stack of tools that mostly worked. But once they saw how consolidating onto one platform saves $200 to $500 a month with better tools, they found it was worth 15 minutes. Would it hurt to take a quick look?",
      tooBusy:
        "I hear you — and that's exactly the problem. Juggling 5 or 6 different tools is what eats your time. One platform, one login. Can I book just 15 minutes at a time that works for you? Early morning or late afternoon?",
      sendEmail:
        "Absolutely. But honestly, a quick 15-minute demo will give you way more clarity than an email — Jamie can show you exactly what's included and which of your current tools it replaces. What does your Thursday look like?",
      howMuch:
        "Great question. It starts at $10 a month for the core platform, and most practices save more than that by canceling tools they no longer need. Jamie can walk you through the options on the call — no commitment. Does this week or next work better?",
      alreadyHaveSomething:
        "That's great — most professionals do. Out of curiosity, how many separate logins and subscriptions are you maintaining right now? Because that's usually where the cost adds up — and where consolidating onto one platform pays for itself fast.",
      needToThink:
        "Absolutely — I'd want you to think about it. Can I ask, what specifically are you weighing? Is it the switch, the timing, or something else? Let me set you up with a free look — no commitment. You'll see the whole platform and decide from there. Fair enough?",
    },
  },
  {
    id: 'wlvlp',
    name: 'Website Lotto',
    shortName: 'WLVLP',
    valueProp: 'a professional website for your practice — already designed, ready to go, and incredibly affordable',
    revenueHook: 'a professional online presence that brings in clients instead of just sitting there',
    quantifiedBenefit: 'Most practices we work with see their first online leads within 30 days of launching',
    pricing: 'Sites start at $29 through our marketplace',
    closeOptions: 'a starter site at $29, or a premium design with hosting included',
    description: 'Website Lotto is a marketplace of professional tax practice websites. Pick a design, customize it with your info, and launch. Hosting and updates included.',
    objections: {
      notInterested:
        "I totally understand. A lot of the professionals we work with felt the same way at first — they figured their current site was fine, or they didn't have one. But once they saw practices getting their first online leads within 30 days for $29, they found it was worth 15 minutes. Would it hurt to take a quick look?",
      tooBusy:
        "I hear you — and that's exactly why this works. You don't build anything. You pick a design, drop in your info, and it's live. Can I book just 15 minutes at a time that works for you? Early morning or late afternoon?",
      sendEmail:
        "Absolutely. But honestly, a quick 15-minute walkthrough will show you way more than an email — Jamie can show you actual sites in the marketplace and how fast they go live. What does your Thursday look like?",
      howMuch:
        "Great question. Sites start at $29 in the marketplace, and most practices see their first online lead within 30 days. Jamie can show you the options on the call — no commitment. Does this week or next work better?",
      alreadyHaveSomething:
        "That's great. Out of curiosity, is your current site actually bringing in new clients each month, or is it more of a placeholder? Because that's where most practices lose ground — having a site that doesn't convert.",
      needToThink:
        "Absolutely — I'd want you to think about it. Can I ask, what specifically are you weighing? Is it the design, the timing, or something else? Let me set up a quick walkthrough of the marketplace — no commitment. You'll see what's available and decide from there. Fair enough?",
    },
  },
];

export const DEFAULT_PRODUCT_ID = 'ttmp';

export function getProductById(id: string | null | undefined): ProductProfile {
  if (!id) return products[0];
  return products.find((p) => p.id === id) ?? products[0];
}

export const setterScript: GsvlpScript = {
  role: 'setter',
  dashboardPreview: {
    label: 'SETTER',
    opening: [
      'Hi, is this [Tax Pro Name]? My name is {setter_name}, and I’m reaching out because we work specifically with {credential} who want to grow their practice without adding more hours.',
      'Quick question — are you currently looking for ways to bring in new clients or add a recurring revenue stream to your practice?',
    ],
    responseOptions: ['No', 'Maybe', 'Yes'],
    followUp: {
      yes: [
        'That’s exactly why I’m calling. Jamie Williams at Virtual Launch Pro has helped tax professionals like you add {value_prop}. She can show you how it works in about 15 minutes — no pressure, no obligation.',
        'Would you be open to a quick call with her this week?',
      ],
      maybe: [
        'Totally fair. A lot of the {credential} we work with felt the same way at first — they weren’t looking for anything new. But once they saw it adds {revenue_hook} with almost no extra work, they found 15 minutes was worth it. Would it hurt to take a quick look?',
      ],
      no: [
        'No problem — have a great day.',
      ],
    },
  },
  callDetail: {
    steps: [
      {
        number: 1,
        title: 'Opening',
        lines: [
          { type: 'say', text: 'Hi, may I speak with {full_name}? Is this the {firm_name} office?' },
          { type: 'instruction', text: 'Wait for them to confirm.' },
          { type: 'say', text: 'Great. My name is {setter_name}. I’m reaching out because we work specifically with {credential} who want to grow their practice without adding more hours.' },
        ],
      },
      {
        number: 2,
        title: 'Qualify',
        lines: [
          { type: 'say', text: 'Quick question — are you currently looking for ways to bring in new clients or add a recurring revenue stream to your practice?' },
          { type: 'instruction', text: 'Listen. Let them respond. If yes → move to The Bridge. If busy → ask when a better time would be. If no → Objection Handling.' },
        ],
      },
      {
        number: 3,
        title: 'The Bridge',
        lines: [
          { type: 'say', text: 'That’s exactly why I’m calling. Jamie Williams at Virtual Launch Pro has helped tax professionals like you add {value_prop}. She can show you how it works in about 15 minutes — no pressure, no obligation.' },
          { type: 'say', text: 'Would you be open to a quick call with her this week?' },
        ],
      },
      {
        number: 4,
        title: 'Objection Handling',
        lines: [
          { type: 'instruction', text: 'Feel → Felt → Found. Acknowledge, share a peer experience, redirect to the booking.' },
          { type: 'objection', objectionLabel: 'I’m not interested', text: '{obj_not_interested}' },
          { type: 'objection', objectionLabel: 'I’m too busy', text: '{obj_too_busy}' },
          { type: 'objection', objectionLabel: 'Send me an email', text: '{obj_send_email}' },
          { type: 'objection', objectionLabel: 'How much does it cost?', text: '{obj_how_much}' },
        ],
      },
      {
        number: 5,
        title: 'Book It',
        lines: [
          { type: 'say', text: 'Perfect. Jamie has availability on [Day] at [Time] or after [Time]. Which works better?' },
          { type: 'say', text: 'Great. She’ll look forward to speaking with you then. You’ll receive a confirmation shortly.' },
          { type: 'instruction', text: 'Alternative close — give two positive choices, not "are you free."' },
        ],
      },
      {
        number: 6,
        title: 'Voicemail',
        lines: [
          { type: 'say', text: 'Hi {first_name}, this is {setter_name} calling on behalf of Jamie Williams at Virtual Launch Pro. She works with {credential} like you to help grow their practice — {value_prop}. I’ll try you again — or you can reach her at virtuallaunch.pro. Have a great day.' },
        ],
      },
    ],
  },
  voicemail:
    'Hi {first_name}, this is {setter_name} calling on behalf of Jamie Williams at Virtual Launch Pro. She works with {credential} like you to help grow their practice — {value_prop}. I’ll try you again — or you can reach her at virtuallaunch.pro. Have a great day.',
};

export const closerScript: GsvlpScript = {
  role: 'closer',
  dashboardPreview: {
    label: 'CLOSER',
    opening: [
      'Hi, is this {full_name}? Great — this is Jamie Williams. I run Virtual Launch Pro, and we work specifically with {credential} in {state}.',
      'I’m calling because I’ve been helping tax professionals like you with {value_prop} — and I wanted to see if it might be a fit for your practice. Do you have about 2 minutes?',
    ],
    responseOptions: ['No', 'Maybe', 'Yes'],
    followUp: {
      yes: [
        'Before I go into anything — can I ask, how are you currently getting new clients into your practice?',
        'And when it comes to your existing clients, do you have any recurring service — something they pay for monthly — or is it mostly seasonal work?',
        'If there were a way to add {revenue_hook} — without adding hours to your week — would that be worth exploring?',
      ],
      maybe: [
        'Totally fair. Let me ask one quick thing — if there were a way to add {revenue_hook} without adding hours to your week, would that be worth two minutes of your time right now?',
      ],
      no: [
        'No problem — have a great day.',
      ],
    },
  },
  callDetail: {
    steps: [
      {
        number: 1,
        title: 'Opening',
        lines: [
          { type: 'say', text: 'Hi, is this {full_name}? Great — this is Jamie Williams. I run Virtual Launch Pro, and we work specifically with {credential} in {state}.' },
          { type: 'say', text: 'I’m calling because I’ve been helping tax professionals like you with {value_prop} — and I wanted to see if it might be a fit for your practice. Do you have about 2 minutes?' },
          { type: 'instruction', text: 'Earn the right — name, credibility, specificity (state + credential), micro-commitment (2 minutes, not 15).' },
        ],
      },
      {
        number: 2,
        title: 'Needs Discovery',
        lines: [
          { type: 'say', text: 'Before I go into anything — can I ask, how are you currently getting new clients into your practice?' },
          { type: 'instruction', text: 'Listen.' },
          { type: 'say', text: 'And when it comes to your existing clients, do you have any recurring service — something they pay for monthly — or is it mostly seasonal work?' },
          { type: 'instruction', text: 'Listen.' },
          { type: 'say', text: 'Got it. And if there were a way to add {revenue_hook} — without adding hours to your week — would that be worth exploring?' },
          { type: 'instruction', text: 'Three questions — general → specific → trial close. Let the prospect tell you they have the problem.' },
        ],
      },
      {
        number: 3,
        title: 'Presentation',
        lines: [
          { type: 'say', text: 'Here’s what I’ve built. It’s called {product_name}. {product_description}' },
          { type: 'say', text: '{quantified_benefit}.' },
        ],
      },
      {
        number: 4,
        title: 'Trial Close',
        lines: [
          { type: 'say', text: 'Does that sound like something that could work in your practice?' },
          { type: 'instruction', text: 'If yes → Close. If hesitant → "What part are you unsure about?" then re-trial. If objection → Objection Handling.' },
        ],
      },
      {
        number: 5,
        title: 'Objection Handling',
        lines: [
          { type: 'instruction', text: 'Never argue. Isolate. Address. Redirect with a trial close. The takeaway lowers pressure and increases trust.' },
          { type: 'objection', objectionLabel: 'I need to think about it', text: '{obj_need_to_think}' },
          { type: 'objection', objectionLabel: 'How much does it cost?', text: '{obj_how_much}' },
          { type: 'objection', objectionLabel: 'I already have something like this', text: '{obj_already_have}' },
          { type: 'objection', objectionLabel: 'I’m not interested', text: '{obj_not_interested}' },
        ],
      },
      {
        number: 6,
        title: 'Close',
        lines: [
          { type: 'say', text: 'Here’s what I’d recommend. Let me get you set up today — you can see the full setup, try it out, and see how it works in your practice. If you love it, great. If not, you cancel anytime.' },
          { type: 'say', text: 'Would you want to start with {close_options}?' },
          { type: 'instruction', text: 'Alternative close — two yeses, no "yes or no." Assume the sale. Low entry removes financial risk. "Cancel anytime" is the safety net.' },
        ],
      },
      {
        number: 7,
        title: 'Follow-Up (setter-booked appointment)',
        lines: [
          { type: 'say', text: 'Hi {full_name}, this is Jamie Williams from Virtual Launch Pro. I believe you spoke with {setter_name} on my team earlier this week — you had expressed interest in learning about how we help {credential} add recurring revenue.' },
          { type: 'say', text: 'I appreciate you taking the time. Before I walk you through anything, I’d love to hear a little about your practice — how are things going on the client acquisition side?' },
          { type: 'instruction', text: 'Reference the setter by name (trust transfer). Then go straight to Needs Discovery (Step 2). Don’t re-pitch what the setter already said.' },
        ],
      },
    ],
  },
  voicemail:
    'Hi {first_name}, this is Jamie Williams from Virtual Launch Pro. I work with {credential} like you on {value_prop}. I’ll try you again — or you can reach me at virtuallaunch.pro. Have a great day.',
};

export function getActiveScript(email: string | null | undefined): GsvlpScript {
  return isOwnerEmail(email) ? closerScript : setterScript;
}

export type TemplateVars = {
  full_name?: string;
  first_name?: string;
  firm_name?: string;
  credential?: string;
  state?: string;
  setter_name?: string;
  // Product vars
  product_name?: string;
  product_short?: string;
  product_description?: string;
  value_prop?: string;
  revenue_hook?: string;
  quantified_benefit?: string;
  pricing?: string;
  close_options?: string;
  obj_not_interested?: string;
  obj_too_busy?: string;
  obj_send_email?: string;
  obj_how_much?: string;
  obj_already_have?: string;
  obj_need_to_think?: string;
};

export function buildProductVars(product: ProductProfile): TemplateVars {
  return {
    product_name: product.name,
    product_short: product.shortName,
    product_description: product.description,
    value_prop: product.valueProp,
    revenue_hook: product.revenueHook,
    quantified_benefit: product.quantifiedBenefit,
    pricing: product.pricing,
    close_options: product.closeOptions,
    obj_not_interested: product.objections.notInterested,
    obj_too_busy: product.objections.tooBusy,
    obj_send_email: product.objections.sendEmail,
    obj_how_much: product.objections.howMuch,
    obj_already_have: product.objections.alreadyHaveSomething,
    obj_need_to_think: product.objections.needToThink,
  };
}

export function renderTemplate(text: string, vars: TemplateVars): string {
  // Resolve up to 3 passes so nested tokens (e.g. obj_* values containing {pricing}) expand.
  let out = text;
  for (let pass = 0; pass < 3; pass++) {
    const next = out.replace(/\{(\w+)\}/g, (_match, key) => {
      const value = (vars as Record<string, string | undefined>)[key];
      return value && value.length > 0 ? value : `{${key}}`;
    });
    if (next === out) break;
    out = next;
  }
  return out;
}
