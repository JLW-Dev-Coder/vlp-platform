import type { PlatformConfig } from '@vlp/member-ui'

export const tmpConfig: PlatformConfig = {
  brandName: 'Tax Monitor Pro',
  brandAbbrev: 'TMP',
  brandColor: '#f97316',
  brandSubtitle: 'Pro Dashboard',
  logoText: 'TMP',
  apiBaseUrl: 'https://api.taxmonitor.pro',
  posthog: {
    apiKey: 'phc_o5nTrNkxc37W2G9PXFL8peXMjWzdjo5d2HSjE5XzggkY',
    apiHost: 'https://us.i.posthog.com',
    autocapture: true,
    capturePageview: true,
    capturePageleave: true,
    disabledInDev: false,
  },
  calBookingNamespace: 'tmp-support',
  calBookingSlug: 'tax-monitor-pro/tmp-support',
  calIntroNamespace: 'tmp-intro',
  calIntroSlug: 'tax-monitor-pro/tmp-intro',
  navSections: [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
        { label: 'Compliance Report', href: '/dashboard/compliance-report', icon: 'FileCheck' },
        { label: 'Transcript Changes', href: '/dashboard/transcript-changes', icon: 'ScrollText' },
        { label: 'ESign 2848', href: '/dashboard/esign-2848', icon: 'PenTool' },
      ],
    },
    {
      title: 'MONITORING',
      items: [
        { label: 'Active Alerts', href: '/dashboard/active-alerts', icon: 'Bell' },
        { label: 'Tokens', href: '/dashboard/tokens', icon: 'Coins' },
      ],
    },
    {
      title: 'EARNINGS',
      items: [
        { label: 'Receipts', href: '/dashboard/receipts', icon: 'Receipt' },
        { label: 'Affiliate', href: '/dashboard/affiliate', icon: 'Link2' },
      ],
    },
    {
      title: 'SETTINGS',
      items: [
        { label: 'Profile', href: '/dashboard/profile', icon: 'UserCircle' },
        { label: 'Support', href: '/dashboard/support', icon: 'HelpCircle' },
      ],
    },
  ],
  routes: {
    home: '/',
    signIn: '/sign-in',
    signOut: '/sign-in',
    dashboard: '/dashboard',
    account: '/dashboard',
    profile: '/dashboard/profile',
    support: '/dashboard/support',
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
  chatbot: {
    enabled: true,
    aiEnabled: false,
    nudge: {
      label: 'Tax Monitor Pro',
      message: 'See how Tax Monitor Pro tracks IRS accounts',
    },
    header: {
      avatarInitials: 'TMP',
      title: 'Tax Monitor Pro',
      subtitle: 'IRS account monitoring for tax pros',
    },
    welcome: "Hi! I can help you learn about Tax Monitor Pro. What's on your mind?",
    questions: [
      {
        id: 'q1',
        label: 'How does IRS monitoring work?',
        response: [
          "Tax Monitor Pro continuously monitors your clients' IRS accounts for changes — new notices, balance updates, payment postings, and status changes. You get alerts instead of surprises. Set it up once per client and stay informed automatically.",
        ],
        primaryCta: { label: 'See features →', action: { type: 'link', href: '/features' } },
        secondaryCta: { label: 'Talk to a human', action: { type: 'human-path' } },
      },
      {
        id: 'q2',
        label: 'What does it cost?',
        response: [
          "Tax Monitor Pro uses a subscription model with tiered pricing based on how many clients you monitor. Check our pricing page for current plans and what's included in each tier.",
        ],
        primaryCta: { label: 'See pricing →', action: { type: 'link', href: '/pricing' } },
        secondaryCta: { label: 'Talk to a human', action: { type: 'human-path' } },
      },
      {
        id: 'q3',
        label: 'Can I try it with one client first?',
        response: [
          "Absolutely. Start with a single client account to see how monitoring works for your practice. No commitment to scale until you're ready. Book a quick intro and we'll get you set up.",
        ],
        primaryCta: { label: 'Book an intro call →', action: { type: 'cal-intro' } },
        secondaryCta: { label: 'Talk to a human', action: { type: 'human-path' } },
      },
    ],
    emailFooterLabel: 'Or send us a message',
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
  },
  exitIntent: {
    enabled: true,
    headline: "Wait — this one's on us.",
    subheadline: 'Free: IRS Account Monitoring Checklist',
    description: "The step-by-step checklist for monitoring your clients' IRS accounts. Never miss a notice or status change.",
    freebieType: 'monitoring_checklist',
    qualifierQuestion: 'How many client accounts do you monitor?',
    qualifierOptions: ['1-10', '11-50', '50+'],
    ctaLabel: 'Send It to Me',
    successMessage: "Check your inbox! It's on the way.",
  },
}
