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

const OWNER_EMAIL = 'jamie.williams@virtuallaunch.pro';

export function isOwnerEmail(email: string | null | undefined): boolean {
  return (email || '').toLowerCase() === OWNER_EMAIL;
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
        'That’s exactly why I’m calling. Jamie Williams at Virtual Launch Pro has helped tax professionals like you add a monitoring service their clients actually pay for monthly. She can show you how it works in about 15 minutes — no pressure, no obligation.',
        'Would you be open to a quick call with her this week?',
      ],
      maybe: [
        'Totally fair. A lot of the {credential} we work with felt the same way at first — they weren’t looking for anything new. But once they saw it adds $50–$100 per client per month in recurring revenue with almost no extra work, they found 15 minutes was worth it. Would it hurt to take a quick look?',
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
          { type: 'say', text: 'That’s exactly why I’m calling. Jamie Williams at Virtual Launch Pro has helped tax professionals like you add a monitoring service their clients actually pay for monthly. She can show you how it works in about 15 minutes — no pressure, no obligation.' },
          { type: 'say', text: 'Would you be open to a quick call with her this week?' },
        ],
      },
      {
        number: 4,
        title: 'Objection Handling',
        lines: [
          { type: 'instruction', text: 'Feel → Felt → Found. Acknowledge, share a peer experience, redirect to the booking.' },
          { type: 'objection', objectionLabel: 'I’m not interested', text: 'I totally understand. A lot of the professionals we work with felt the same way at first — they weren’t looking for anything new. But once they saw how the monitoring service creates $50–$100/month per client in recurring revenue with almost no extra work, they found it was worth the 15 minutes. Would it hurt to take a quick look?' },
          { type: 'objection', objectionLabel: 'I’m too busy', text: 'I hear you — tax season never really ends. That’s actually why Jamie built this. It runs in the background for your clients. Can I book just 15 minutes at a time that works for you? Early morning or late afternoon?' },
          { type: 'objection', objectionLabel: 'Send me an email', text: 'Absolutely, I can do that. But honestly, a quick 15-minute call will give you way more clarity than an email ever could. Jamie can walk you through the whole thing and answer your questions live. What does your Thursday look like?' },
          { type: 'objection', objectionLabel: 'How much does it cost?', text: 'Great question. There are a few different options depending on your practice size. Jamie can walk you through pricing on the call and help you figure out what makes sense — no commitment. Does this week or next work better?' },
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
          { type: 'say', text: 'Hi {first_name}, this is {setter_name} calling on behalf of Jamie Williams at Virtual Launch Pro. She works with {credential} like you to help grow their practice with a service their clients actually pay for monthly. I’ll try you again — or you can reach her at virtuallaunch.pro. Have a great day.' },
        ],
      },
    ],
  },
  voicemail:
    'Hi {first_name}, this is {setter_name} calling on behalf of Jamie Williams at Virtual Launch Pro. She works with {credential} like you to help grow their practice with a service their clients actually pay for monthly. I’ll try you again — or you can reach her at virtuallaunch.pro. Have a great day.',
};

export const closerScript: GsvlpScript = {
  role: 'closer',
  dashboardPreview: {
    label: 'CLOSER',
    opening: [
      'Hi, is this {full_name}? Great — this is Jamie Williams. I run Virtual Launch Pro, and we work specifically with {credential} in {state}.',
      'I’m calling because I’ve been helping tax professionals like you add a recurring revenue stream using a transcript monitoring service — and I wanted to see if it might be a fit for your practice. Do you have about 2 minutes?',
    ],
    responseOptions: ['No', 'Maybe', 'Yes'],
    followUp: {
      yes: [
        'Before I go into anything — can I ask, how are you currently getting new clients into your practice?',
        'And when it comes to your existing clients, do you have any recurring service — something they pay for monthly — or is it mostly seasonal work?',
        'If there were a way to add $50 to $100 per client per month in recurring revenue — without adding hours to your week — would that be worth exploring?',
      ],
      maybe: [
        'Totally fair. Let me ask one quick thing — if there were a way to add $50–$100 per client per month in recurring revenue without adding hours to your week, would that be worth two minutes of your time right now?',
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
          { type: 'say', text: 'I’m calling because I’ve been helping tax professionals like you add a recurring revenue stream using a transcript monitoring service — and I wanted to see if it might be a fit for your practice. Do you have about 2 minutes?' },
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
          { type: 'say', text: 'Got it. And if there were a way to add $50 to $100 per client per month in recurring revenue — without adding hours to your week — would that be worth exploring?' },
          { type: 'instruction', text: 'Three questions — general → specific → trial close. Let the prospect tell you they have the problem.' },
        ],
      },
      {
        number: 3,
        title: 'Presentation',
        lines: [
          { type: 'say', text: 'Here’s what I’ve built. It’s called Transcript Tax Monitor Pro. It automatically pulls IRS transcripts for your clients, monitors them for changes — new codes, balance shifts, notices — and sends you an alert.' },
          { type: 'say', text: 'Your clients pay you a monthly fee for the monitoring. You’re not doing the work — the system is. It’s recurring revenue that runs in the background.' },
          { type: 'say', text: 'Most of the {credential} I work with charge between $50 and $100 per client per month. If you have even 20 clients on it, that’s $1,000 to $2,000 a month you’re not earning right now.' },
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
          { type: 'objection', objectionLabel: 'I need to think about it', text: 'Absolutely — I’d want you to think about it. Can I ask, what specifically are you weighing? Is it the pricing, the fit, or something else? Let me set you up with a free look — no commitment. You can see the dashboard, see how transcripts pull in, and decide from there. If it’s not a fit, no hard feelings. Fair enough?' },
          { type: 'objection', objectionLabel: 'How much does it cost?', text: 'It depends on what you need. Plans start at $10 a month. But honestly, most practices make that back from one client in the first month. Would it help if I walked you through the options?' },
          { type: 'objection', objectionLabel: 'I already have something like this', text: 'That’s great — you’re ahead of most practices. Out of curiosity, does your current system monitor transcripts automatically and alert you when codes change? Because that’s where most of the value is — catching things before your client calls you in a panic.' },
          { type: 'objection', objectionLabel: 'I’m not sure my clients would pay for that', text: 'Fair point. What I’ve found is that most clients don’t even realize transcript monitoring exists — and when they hear it can catch IRS notices before they get blindsided, $50–$100 a month is an easy yes. Want me to show you how the other {credential} I work with position it?' },
        ],
      },
      {
        number: 6,
        title: 'Close',
        lines: [
          { type: 'say', text: 'Here’s what I’d recommend. Let me get you set up today — you can see the full dashboard, run a few transcripts, and see how it works with your clients. If you love it, great. If not, you cancel anytime.' },
          { type: 'say', text: 'Would you want to start with the basic plan at $10/month, or the professional plan that includes monitoring for all your clients?' },
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
    'Hi {first_name}, this is Jamie Williams from Virtual Launch Pro. I work with {credential} like you to add recurring revenue through automated transcript monitoring. I’ll try you again — or you can reach me at virtuallaunch.pro. Have a great day.',
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
};

export function renderTemplate(text: string, vars: TemplateVars): string {
  return text.replace(/\{(\w+)\}/g, (_match, key) => {
    const value = (vars as Record<string, string | undefined>)[key];
    return value && value.length > 0 ? value : `{${key}}`;
  });
}
