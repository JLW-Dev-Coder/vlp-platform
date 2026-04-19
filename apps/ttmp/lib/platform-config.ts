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
      message: 'Try it free — parse any IRS transcript in 10 seconds',
    },
    header: {
      avatarInitials: 'TT',
      title: 'Tax Transcript AI',
      subtitle: 'AI + real humans · fast reply',
    },
    welcome: 'What brings you here today?',
    questions: [
      {
        id: 'q1-how',
        label: 'How does it work?',
        response: [
          "You upload an IRS transcript PDF — the parser reads every transaction code, explains what each one means in plain English, flags holds or issues, and gives you a clean report. Takes about 10 seconds. You can try it right now on the homepage with our sample transcript, no account needed.",
        ],
        primaryCta: { label: 'Try it now →', action: { type: 'link', href: '/#parser' } },
        secondaryCta: { label: 'See a sample report', action: { type: 'link', href: '/features' } },
      },
      {
        id: 'q2-cost',
        label: 'What does it cost?',
        response: [
          "No subscription required. You buy transcript tokens — each one parses one transcript. 10 tokens for $19, 25 for $29, 100 for $129. Your first parse is free on the homepage so you can see exactly what you get before spending anything.",
        ],
        primaryCta: { label: 'See pricing →', action: { type: 'link', href: '/pricing' } },
        secondaryCta: { label: 'Try a free parse first', action: { type: 'link', href: '/#parser' } },
      },
      {
        id: 'q3-free',
        label: 'Can I try it free?',
        response: [
          "Yes — go to the homepage and upload any IRS transcript (or use our sample). You'll see the full parsed report on screen, no account needed. Saving or downloading the report requires tokens, but the preview is completely free.",
        ],
        primaryCta: { label: 'Try it free →', action: { type: 'link', href: '/#parser' } },
        secondaryCta: {
          label: 'Watch a 90-sec demo',
          action: { type: 'link', href: 'https://www.youtube.com/@TaxTranscriptAI', external: true },
        },
      },
      {
        id: 'q4-fit',
        label: 'Is this right for me?',
        response: [
          "If you read IRS transcripts for clients — yes. Built for CPAs, EAs, and tax attorneys. Most users say if you handle more than five transcripts a month, the time savings pay for themselves in the first week.",
        ],
        primaryCta: { label: 'Try it and see →', action: { type: 'link', href: '/#parser' } },
        secondaryCta: { label: 'Talk to a human', action: { type: 'human-path' } },
      },
      {
        id: 'q5-security',
        label: 'Is my data secure?',
        response: [
          "Transcripts are parsed in your browser — the PDF never leaves your device. We don't store transcript content on our servers. Saved reports are encrypted and tied to your account. We're built on Cloudflare's infrastructure with SOC 2-grade security practices.",
        ],
        primaryCta: { label: 'Read our privacy policy →', action: { type: 'link', href: '/legal/privacy' } },
        secondaryCta: { label: 'Try the parser →', action: { type: 'link', href: '/#parser' } },
      },
    ],
    emailFooterLabel: 'Prefer email?',
    humanPath: {
      intro: 'Real humans, fast replies. Pick your preferred way to connect.',
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
