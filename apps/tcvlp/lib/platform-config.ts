import type { PlatformConfig } from '@vlp/member-ui'

export const tcvlpConfig: PlatformConfig = {
  brandName: 'TaxClaim Pro',
  brandAbbrev: 'TCVLP',
  brandColor: '#eab308',
  brandSubtitle: 'Penalty Abatement',
  logoText: 'TCP',
  apiBaseUrl: 'https://api.virtuallaunch.pro',
  posthog: {
    apiKey: 'phc_o5nTrNkxc37W2G9PXFL8peXMjWzdjo5d2HSjE5XzggkY',
    apiHost: 'https://us.i.posthog.com',
    autocapture: true,
    capturePageview: true,
    capturePageleave: true,
    disabledInDev: false,
  },
  calBookingNamespace: 'tcvlp-support',
  calBookingSlug: 'tax-monitor-pro/tcvlp-support',
  calIntroNamespace: 'tcvlp-intro',
  calIntroSlug: 'tax-monitor-pro/tcvlp-intro',
  navSections: [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
        { label: 'Embed Link', href: '/dashboard/embed', icon: 'Link2' },
        { label: 'Submissions', href: '/dashboard/submissions', icon: 'ScrollText' },
        { label: 'Form 843', href: '/what-is-form-843', icon: 'FileCheck', external: true },
      ],
    },
    {
      title: 'EARNINGS',
      items: [
        { label: 'Affiliate', href: '/dashboard/affiliate', icon: 'Link2' },
      ],
    },
    {
      title: 'SETTINGS',
      items: [
        { label: 'Account', href: '/dashboard/account', icon: 'Settings' },
        { label: 'Plan', href: '/dashboard/upgrade', icon: 'CreditCard' },
        { label: 'Firm Profile', href: '/dashboard/profile', icon: 'Settings' },
        { label: 'Support', href: '/dashboard/support', icon: 'HelpCircle' },
        { label: 'Usage', href: '/dashboard/usage', icon: 'BarChart3' },
      ],
    },
  ],
  routes: {
    home: '/',
    signIn: '/sign-in',
    signOut: '/sign-in',
    dashboard: '/dashboard',
    account: '/dashboard',
    profile: '/dashboard',
    support: '/support',
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
    tagline: 'Form 843 automation for tax pros',
    summary: 'TaxClaim Pro generates IRS Form 843 preparation guides from your client data in 5 minutes. Built for the Kwong v. US refund window.',
    ctaLabel: 'Get Started',
    ctaPath: '/sign-in?redirect=/onboarding',
    megaMenu: {
      discover: [
        { label: 'About', href: '/about', description: 'Why TaxClaim Pro exists' },
        { label: 'Contact', href: '/contact', description: 'Talk to our team or start intake' },
        { label: 'What is Form 843', href: '/what-is-form-843', description: 'Learn what Form 843 is and who qualifies' },
      ],
      explore: [
        { label: 'Demo', href: '/demo', description: 'See how your clients claim their refund' },
        { label: 'Features', href: '/features' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Help Center', href: '/help', description: 'Answers, FAQs, and booking' },
      ],
      toolsExtras: [
        { label: 'Talk to Kennedy', href: '/kennedy' },
        { label: 'Gala — Claim Guide', href: '/gala' },
        { label: 'Onboarding', href: '/onboarding' },
        { label: 'Affiliate Program', href: '/dashboard/affiliate' },
        { label: 'Book a Call', href: '/help' },
      ],
      ctaText: "The Kwong window closes July 10, 2026. Don't let your clients miss their refund.",
      ctaMagnetLabel: 'See the Demo',
      ctaMagnetPath: '/demo',
    },
    footerTagline: 'Kwong v. US refund window',
    footerResources: [
      { label: 'What is Form 843', href: '/what-is-form-843' },
      { label: 'Official IRS Form 843', href: 'https://www.irs.gov/pub/irs-pdf/f843.pdf', external: true },
      { label: 'Get IRS Transcript', href: 'https://www.irs.gov/individuals/get-transcript', external: true },
      { label: 'Virtual Launch Pro', href: 'https://virtuallaunch.pro', external: true },
      { label: 'Tax Monitor Pro', href: 'https://taxmonitor.pro', external: true },
      { label: 'Transcript Tax Monitor', href: 'https://transcript.taxmonitor.pro', external: true },
      { label: 'Affiliate Program', href: '/dashboard/affiliate' },
    ],
    footerLegal: [
      { label: 'Privacy', href: '/legal/privacy' },
      { label: 'Terms', href: '/legal/terms' },
    ],
  },
  chatbot: {
    enabled: true,
    aiEnabled: false,
    nudge: {
      label: 'TaxClaim Pro',
      message: 'Check if the Kwong claim applies to your client',
    },
    header: {
      avatarInitials: 'TCP',
      title: 'TaxClaim Pro',
      subtitle: 'IRS penalty abatement claims',
    },
    welcome: 'Hi! I can help you learn about TaxClaim Pro and the Kwong v. US ruling. What would you like to know?',
    questions: [
      {
        id: 'q1',
        label: 'What is the Kwong claim?',
        response: [
          "Kwong v. United States established that certain IRS penalties assessed between January 2020 and July 2023 may be eligible for abatement. TaxClaim Pro automates Form 843 generation for these claims. The filing deadline is July 2026 — time is limited.",
        ],
        primaryCta: { label: 'Learn more →', action: { type: 'link', href: '/what-is-form-843' } },
        secondaryCta: { label: 'Talk to a human', action: { type: 'human-path' } },
      },
      {
        id: 'q2',
        label: 'How does Form 843 generation work?',
        response: [
          "Enter your client's penalty details and TaxClaim Pro generates a complete Form 843 with the correct legal basis, penalty calculations, and supporting arguments. Download it ready to file. No manual drafting.",
        ],
        primaryCta: { label: 'See the demo →', action: { type: 'link', href: '/demo' } },
        secondaryCta: { label: 'Talk to a human', action: { type: 'human-path' } },
      },
      {
        id: 'q3',
        label: 'What does it cost?',
        response: [
          "Starter is $10/mo for basic Form 843 generation. Professional is $29/mo for unlimited claim pages and bulk export. Firm is $79/mo for white-label branding and multi-practitioner access. Book an intro to see which tier fits.",
        ],
        primaryCta: { label: 'Book an intro call →', action: { type: 'cal-intro' } },
        secondaryCta: { label: 'See pricing', action: { type: 'link', href: '/pricing' } },
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
    subheadline: 'Free: Kwong Eligibility Quick-Check',
    description: "A simple checklist to determine if your client's penalties qualify under Kwong v. US. Filing deadline is July 2026.",
    freebieType: 'kwong_checklist',
    qualifierQuestion: 'Do you have clients with IRS penalties from 2020-2023?',
    qualifierOptions: ['Yes', 'No', 'Not sure'],
    ctaLabel: 'Send It to Me',
    successMessage: "Check your inbox! It's on the way.",
  },
}
