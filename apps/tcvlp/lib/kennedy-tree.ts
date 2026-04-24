export interface KennedyNode {
  id: string
  clipUrl: string
  question?: string
  options?: {
    label: string
    next: string
  }[]
  cta?: {
    label: string
    href: string
    variant: 'primary' | 'secondary'
  }[]
  autoNext?: string
}

const API = 'https://api.virtuallaunch.pro/v1/tcvlp/videos/kennedy'

function clip(id: string): string {
  return `${API}/${id}`
}

export const KENNEDY_TREE: Record<string, KennedyNode> = {
  entry: {
    id: 'entry',
    clipUrl: clip('entry'),
    question: 'What brings you here?',
    options: [
      { label: "I'm just browsing", next: 'p1-overview' },
      { label: 'I want to add penalty abatement to my practice', next: 'p2-practice' },
      { label: "I'm a taxpayer with IRS penalties", next: 'p3-taxpayer' },
    ],
  },

  'p1-overview': {
    id: 'p1-overview',
    clipUrl: clip('p1-overview'),
    question: 'What would help you most right now?',
    options: [
      { label: 'Show me what qualifies', next: 'p1-qualifies' },
      { label: 'How does this make me money', next: 'p1-money' },
      { label: 'What does the workflow look like', next: 'p1-workflow' },
    ],
  },
  'p1-qualifies': {
    id: 'p1-qualifies',
    clipUrl: clip('p1-qualifies'),
    question: 'Have you checked your client list yet?',
    options: [
      { label: 'Not yet', next: 'p2-practice' },
      { label: 'Yes, I have some', next: 'p2-volume' },
      { label: "I don't think I have any", next: 'commit' },
    ],
  },
  'p1-money': {
    id: 'p1-money',
    clipUrl: clip('p1-money'),
    question: 'Want to see how to plug this into your current client base?',
    options: [
      { label: 'Yes', next: 'p2-practice' },
      { label: 'What does the workflow look like', next: 'p1-workflow' },
      { label: 'How fast can I start', next: 'commit' },
    ],
  },
  'p1-workflow': {
    id: 'p1-workflow',
    clipUrl: clip('p1-workflow'),
    question: 'Want to try it or want to go deeper?',
    options: [
      { label: 'Let me try it', next: 'commit' },
      { label: 'Tell me about the claim page', next: 'p2-claimlink' },
      { label: 'I still have questions', next: 'objections' },
    ],
  },

  'p2-practice': {
    id: 'p2-practice',
    clipUrl: clip('p2-practice'),
    question: 'Are you working mostly with individual returns, business returns, or both?',
    options: [
      { label: 'Individual', next: 'p2-volume' },
      { label: 'Business', next: 'p2-volume' },
      { label: 'Both', next: 'p2-volume' },
    ],
  },
  'p2-volume': {
    id: 'p2-volume',
    clipUrl: clip('p2-volume'),
    question: 'How many eligible clients are we talking about — roughly?',
    options: [
      { label: 'Under ten', next: 'p2-current' },
      { label: 'Ten to fifty', next: 'p2-current' },
      { label: 'More than fifty', next: 'p2-current' },
    ],
  },
  'p2-current': {
    id: 'p2-current',
    clipUrl: clip('p2-current'),
    question: 'How are you currently handling IRS penalty abatements?',
    options: [
      { label: "We don't really do them", next: 'p2-current-none' },
      { label: 'We handle them manually', next: 'p2-current-manual' },
      { label: 'We refer them out', next: 'p2-current-refer' },
    ],
  },
  'p2-current-none': {
    id: 'p2-current-none',
    clipUrl: clip('p2-current-none'),
    autoNext: 'p2-claimlink',
  },
  'p2-current-manual': {
    id: 'p2-current-manual',
    clipUrl: clip('p2-current-manual'),
    question: 'Do you want to replace your current process or layer this on top?',
    options: [
      { label: 'Replace it', next: 'p2-claimlink' },
      { label: 'Layer it on', next: 'p2-claimlink' },
      { label: 'I need to see it first', next: 'commit' },
    ],
  },
  'p2-current-refer': {
    id: 'p2-current-refer',
    clipUrl: clip('p2-current-refer'),
    question: 'Want to see how to internalize it without adding workload?',
    options: [
      { label: 'Yes', next: 'p2-claimlink' },
      { label: "What's the cost", next: 'p2-pricing' },
      { label: 'I still have questions', next: 'objections' },
    ],
  },
  'p2-claimlink': {
    id: 'p2-claimlink',
    clipUrl: clip('p2-claimlink'),
    autoNext: 'commit',
  },
  'p2-pricing': {
    id: 'p2-pricing',
    clipUrl: clip('p2-pricing'),
    question: 'Which sounds like you?',
    options: [
      { label: 'Starter — $10/mo', next: 'commit' },
      { label: 'Professional — $29/mo', next: 'commit' },
      { label: 'Firm — $79/mo', next: 'commit' },
      { label: 'Not sure yet', next: 'commit' },
    ],
  },

  'p3-taxpayer': {
    id: 'p3-taxpayer',
    clipUrl: clip('p3-taxpayer'),
    question: 'Quick check — have you already been assessed IRS penalties or interest?',
    options: [
      { label: 'Yes', next: 'p3-taxpayer-yes' },
      { label: 'No', next: 'p3-taxpayer-no' },
      { label: 'Not sure', next: 'p3-taxpayer-unsure' },
    ],
  },
  'p3-taxpayer-yes': {
    id: 'p3-taxpayer-yes',
    clipUrl: clip('p3-taxpayer-yes'),
    cta: [
      { label: 'Check My Eligibility', href: '/gala', variant: 'primary' },
    ],
  },
  'p3-taxpayer-no': {
    id: 'p3-taxpayer-no',
    clipUrl: clip('p3-taxpayer-no'),
    cta: [
      { label: 'Learn What to Watch For', href: '/gala', variant: 'secondary' },
    ],
  },
  'p3-taxpayer-unsure': {
    id: 'p3-taxpayer-unsure',
    clipUrl: clip('p3-taxpayer-unsure'),
    cta: [
      { label: 'Check With a Professional', href: '/gala', variant: 'primary' },
    ],
  },

  commit: {
    id: 'commit',
    clipUrl: clip('commit'),
    question: 'Do you want to test this with a few clients first, or fully roll it out?',
    options: [
      { label: 'Test it', next: 'close-test' },
      { label: 'Roll it out', next: 'close-rollout' },
      { label: 'I still have questions', next: 'close-questions' },
    ],
  },
  'close-questions': {
    id: 'close-questions',
    clipUrl: clip('close-questions'),
    autoNext: 'objections',
  },
  'close-test': {
    id: 'close-test',
    clipUrl: clip('close-test'),
    cta: [
      { label: 'Start My First Claim', href: '/sign-in', variant: 'primary' },
      { label: 'Book 10 Minutes With Kennedy', href: '#cal-booking', variant: 'secondary' },
    ],
  },
  'close-rollout': {
    id: 'close-rollout',
    clipUrl: clip('close-rollout'),
    cta: [
      { label: 'Start Now', href: '/sign-in', variant: 'primary' },
      { label: 'Book 10 Minutes With Kennedy', href: '#cal-booking', variant: 'secondary' },
    ],
  },

  objections: {
    id: 'objections',
    clipUrl: '',
    question: "What's on your mind?",
    options: [
      { label: 'This sounds complicated', next: 'obj-complicated' },
      { label: "I don't have time", next: 'obj-no-time' },
      { label: 'Is this legitimate?', next: 'obj-legit' },
    ],
  },
  'objections-2': {
    id: 'objections-2',
    clipUrl: '',
    question: 'Anything else?',
    options: [
      { label: "What if it doesn't work", next: 'obj-doesnt-work' },
      { label: 'I already do penalty abatement', next: 'obj-already-do' },
      { label: 'How fast can I make money', next: 'obj-how-fast' },
      { label: "I'm ready — let's go", next: 'commit' },
    ],
  },
  'objections-3': {
    id: 'objections-3',
    clipUrl: '',
    question: 'Anything else?',
    options: [
      { label: 'Do I need new software', next: 'obj-new-software' },
      { label: '$10/mo seems too cheap', next: 'obj-too-cheap' },
      { label: "I'm ready — let's go", next: 'commit' },
    ],
  },
  'obj-complicated': {
    id: 'obj-complicated',
    clipUrl: clip('obj-complicated'),
    options: [
      { label: 'What else is on my mind', next: 'objections-2' },
      { label: "I'm ready — let's go", next: 'commit' },
    ],
  },
  'obj-no-time': {
    id: 'obj-no-time',
    clipUrl: clip('obj-no-time'),
    options: [
      { label: 'What else is on my mind', next: 'objections-2' },
      { label: "I'm ready — let's go", next: 'commit' },
    ],
  },
  'obj-legit': {
    id: 'obj-legit',
    clipUrl: clip('obj-legit'),
    options: [
      { label: 'What else is on my mind', next: 'objections-2' },
      { label: "I'm ready — let's go", next: 'commit' },
    ],
  },
  'obj-doesnt-work': {
    id: 'obj-doesnt-work',
    clipUrl: clip('obj-doesnt-work'),
    options: [
      { label: 'What else is on my mind', next: 'objections-3' },
      { label: "I'm ready — let's go", next: 'commit' },
    ],
  },
  'obj-already-do': {
    id: 'obj-already-do',
    clipUrl: clip('obj-already-do'),
    options: [
      { label: 'What else is on my mind', next: 'objections-3' },
      { label: "I'm ready — let's go", next: 'commit' },
    ],
  },
  'obj-how-fast': {
    id: 'obj-how-fast',
    clipUrl: clip('obj-how-fast'),
    options: [
      { label: 'What else is on my mind', next: 'objections-3' },
      { label: "I'm ready — let's go", next: 'commit' },
    ],
  },
  'obj-new-software': {
    id: 'obj-new-software',
    clipUrl: clip('obj-new-software'),
    options: [
      { label: "I'm ready — let's go", next: 'commit' },
    ],
  },
  'obj-too-cheap': {
    id: 'obj-too-cheap',
    clipUrl: clip('obj-too-cheap'),
    options: [
      { label: "I'm ready — let's go", next: 'commit' },
    ],
  },
}
