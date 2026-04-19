import type { PlatformConfig } from '@vlp/member-ui'

export const ttmpConfig: PlatformConfig = {
  brandName: 'Transcript Tax Monitor',
  brandAbbrev: 'TTMP',
  brandColor: '#14b8a6',
  brandSubtitle: 'Pro Dashboard',
  logoText: 'TT',
  apiBaseUrl: 'https://api.taxmonitor.pro',
  posthog: {
    apiKey: 'phc_o5nTrNkxc37W2G9PXFL8peXMjWzdjo5d2HSjE5XzggkY',
    apiHost: 'https://us.i.posthog.com',
    autocapture: true,
    capturePageview: true,
    capturePageleave: true,
    disabledInDev: false,
  },
  calBookingNamespace: 'ttmp-support',
  calBookingSlug: 'tax-monitor-pro/ttmp-support',
  calIntroNamespace: 'ttmp-intro',
  calIntroSlug: 'tax-monitor-pro/ttmp-intro',
  calDiscoveryNamespace: 'ttmp-discovery',
  calDiscoverySlug: 'tax-monitor-pro/ttmp-discovery',
  navSections: [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Dashboard', href: '/app/dashboard/', icon: 'LayoutDashboard' },
        { label: 'Calendar', href: '/app/calendar/', icon: 'Calendar' },
        { label: 'Parser', href: '/app/tools/', icon: 'Wrench' },
        { label: 'Reports', href: '/app/reports/', icon: 'FileText' },
      ],
    },
    {
      title: 'EARNINGS',
      items: [
        { label: 'Affiliate', href: '/app/affiliate/', icon: 'Link2' },
        { label: 'Bidding', href: '/app/bidding/', icon: 'Gavel' },
        { label: 'Winning', href: '/app/winning/', icon: 'Trophy' },
      ],
    },
    {
      title: 'SETTINGS',
      items: [
        {
          label: 'Account',
          href: '/app/account/',
          icon: 'Settings',
          children: [
            { label: 'Payments', href: '/app/account/#payments', icon: 'Wallet' },
          ],
        },
        { label: 'Profile', href: '/app/profile/', icon: 'User' },
        { label: 'Support', href: '/app/support/', icon: 'LifeBuoy' },
        { label: 'Usage', href: '/app/token-usage/', icon: 'Activity' },
      ],
    },
  ],
  routes: {
    home: '/',
    signIn: '/sign-in/',
    signOut: '/sign-in/',
    dashboard: '/app/dashboard/',
    account: '/app/account/',
    profile: '/app/profile/',
    support: '/app/support/',
  },
  businessInfo: {
    legalEntity: 'Lenore, Inc.',
    address: {
      line1: '1175 Avocado Avenue',
      line2: 'Suite 101 PMB 1010',
      city: 'El Cajon',
      state: 'CA',
      zip: '92020',
    },
    phone: '619-800-5457',
    supportEmail: 'outreach@virtuallaunch.pro',
  },
  marketing: {
    tagline: 'Transcript automation',
    summary: 'IRS transcript automation that turns raw codes into clear, client-ready insights.',
    ctaLabel: 'Free Code Lookup',
    ctaPath: '/tools/code-lookup',
    megaMenu: {
      discover: [
        { label: 'About', href: '/about', description: 'Why Transcript Tax Monitor exists' },
        { label: 'Contact', href: '/contact', description: 'Talk to our team or start intake' },
        { label: 'Resource Guide', href: '/resources', description: 'Free transcript-reading playbook' },
      ],
      explore: [
        { label: 'Features', href: '/features' },
        { label: 'How It Works', href: '/how-it-works' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Help Center', href: '/app/support' },
        { label: 'Code Lookup', href: '/tools/code-lookup' },
      ],
      toolsExtras: [
        { label: 'Free Code Lookup', href: '/tools/code-lookup' },
        { label: 'Free Guide', href: '/magnets/guide' },
        { label: 'Transcript Codes', href: '/resources/transcript-codes' },
        { label: 'IRS Phone Numbers', href: '/resources/irs-phone-numbers' },
      ],
      ctaText: 'Need human review before a transcript issue becomes a client fire drill?',
      ctaMagnetLabel: 'Free Code Lookup',
      ctaMagnetPath: '/tools/code-lookup',
    },
    footerResources: [
      { label: 'Free Code Lookup', href: '/tools/code-lookup' },
      { label: 'Affiliate Program', href: '/affiliate' },
      { label: 'Tax Monitor Pro', href: 'https://taxmonitor.pro', external: true },
      { label: 'Tax Tools Arcade', href: 'https://taxtools.taxmonitor.pro', external: true },
      { label: 'Virtual Launch Pro', href: 'https://virtuallaunch.pro', external: true },
    ],
    footerLegal: [
      { label: 'Privacy', href: '/legal/privacy' },
      { label: 'Refund', href: '/legal/refund' },
      { label: 'Terms', href: '/legal/terms' },
    ],
    footerTagline: 'Transcript automation',
  },
  chatbot: {
    enabled: true,
    aiEnabled: false,
    nudge: {
      label: 'Tax Transcript AI',
      message: 'Save 15 min per transcript',
    },
    header: {
      avatarInitials: 'TT',
      title: 'Tax Transcript AI',
      subtitle: 'AI + real humans · fast reply',
    },
    welcome:
      "Hey — I can show you how this works, what it costs, or point you at a real human. Which one?",
    questions: [
      {
        id: 'q1',
        label: 'How does the parser work?',
        response: [
          "Good question — here's the short version.",
          "Upload an IRS transcript PDF and the parser explains every code, flags holds, and interprets dates in plain English. About 10 seconds per transcript instead of 15–20 minutes manually.",
        ],
        askBack: 'Are you mostly looking at client transcripts, or your own?',
        primaryCta: { label: 'See a sample report →', action: { type: 'link', href: '/features' } },
        secondaryCta: {
          label: 'Watch the 90-sec demo',
          action: { type: 'link', href: 'https://www.youtube.com/@TaxTranscriptAI', external: true },
        },
      },
      {
        id: 'q2',
        label: 'What does it cost?',
        response: [
          "Depends on your volume — here's the honest breakdown.",
          "Pay-as-you-go tokens (first parse is free), or monthly subscription for unlimited parses. No per-seat fees, no setup cost.",
        ],
        askBack: 'Rough sense of how many transcripts you handle a month?',
        primaryCta: { label: 'See pricing →', action: { type: 'link', href: '/pricing' } },
        secondaryCta: { label: 'Talk it through', action: { type: 'human-path' } },
      },
      {
        id: 'q3',
        label: 'Is this right for my practice?',
        response: [
          'Honestly? Probably.',
          'Built for CPAs, EAs, and tax attorneys reading client transcripts. If you do more than five a month, most say the time savings cover the cost in week one.',
        ],
        primaryCta: {
          label: 'Start free →',
          action: { type: 'link', href: '/tools/code-lookup' },
        },
        secondaryCta: { label: 'Book 10 min with us', action: { type: 'cal-intro' } },
      },
    ],
    emailFooterLabel: 'Prefer email?',
    humanPath: {
      intro: 'Pick the fastest path — we read every message.',
      bookCall: {
        label: 'Book a 10-min intro call',
        description: 'See available times on our calendar. No-pressure walkthrough, ask anything.',
        calTarget: 'intro',
      },
      sendMessage: {
        label: 'Send a message',
        description: 'Tell us about your practice. One-business-day reply, always from a real person.',
      },
    },
    socialProof: {
      text: 'Trusted by tax pros · @TaxTranscriptAI on YouTube',
      href: 'https://www.youtube.com/@TaxTranscriptAI',
    },
  },
}
