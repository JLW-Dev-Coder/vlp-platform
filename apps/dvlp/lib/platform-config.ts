import type { PlatformConfig } from '@vlp/member-ui'

export const dvlpConfig: PlatformConfig = {
  brandName: 'Developers VLP',
  brandAbbrev: 'DVLP',
  brandColor: '#3b82f6',
  brandSubtitle: 'Developer Marketplace',
  logoText: 'DVLP',
  apiBaseUrl: 'https://api.virtuallaunch.pro',
  posthog: {
    apiKey: 'phc_o5nTrNkxc37W2G9PXFL8peXMjWzdjo5d2HSjE5XzggkY',
    apiHost: 'https://us.i.posthog.com',
    autocapture: true,
    capturePageview: true,
    capturePageleave: true,
    disabledInDev: false,
  },
  calBookingNamespace: 'dvlp-support',
  calBookingSlug: 'tax-monitor-pro/dvlp-support',
  calIntroNamespace: 'dvlp-intro',
  calIntroSlug: 'tax-monitor-pro/dvlp-intro',
  calOnboardingNamespace: 'dvlp-onboarding',
  calOnboardingSlug: 'tax-monitor-pro/dvlp-onboarding',
  navSections: [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Dashboard', href: '/operator', icon: 'LayoutDashboard' },
        { label: 'Submissions', href: '/operator/submissions', icon: 'Inbox' },
        { label: 'Developers', href: '/operator/developers', icon: 'Users' },
        { label: 'Jobs', href: '/operator/jobs', icon: 'Briefcase' },
        { label: 'Post to Developer', href: '/operator/post', icon: 'Send' },
        { label: 'Messages', href: '/operator/messages', icon: 'MessageSquare' },
        { label: 'Tickets', href: '/operator/tickets', icon: 'Ticket' },
        { label: 'Canned Responses', href: '/operator/canned-responses', icon: 'FileText' },
        { label: 'Bulk Email', href: '/operator/bulk-email', icon: 'Mail' },
        { label: 'Find Developers', href: '/developers', icon: 'Search', external: true },
        { label: 'Onboarding', href: '/onboarding', icon: 'UserPlus', external: true },
      ],
    },
    {
      title: 'EARNINGS',
      items: [
        { label: 'Affiliate', href: '/operator/affiliate', icon: 'Link2' },
      ],
    },
    {
      title: 'SETTINGS',
      items: [
        { label: 'Support', href: '/operator/support', icon: 'HelpCircle' },
      ],
    },
  ],
  routes: {
    home: '/',
    signIn: '/sign-in',
    signOut: '/sign-in',
    dashboard: '/operator',
    account: '/operator',
    profile: '/operator',
    support: '/operator/support',
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
      label: 'Developers VLP',
      message: 'Find freelance clients or developers',
    },
    header: {
      avatarInitials: 'DVL',
      title: 'Developers VLP',
      subtitle: 'Developer-client matching platform',
    },
    welcome: "Hi! Whether you're a developer or a business looking for one, I can help. What do you need?",
    questions: [
      {
        id: 'q1',
        label: 'How does developer matching work?',
        response: [
          "Businesses submit a project request describing what they need built, their budget, and timeline. We match them with developers in our directory based on skills, rate, and availability. Developers get qualified introductions — not cold leads.",
        ],
        primaryCta: { label: 'Find a developer →', action: { type: 'link', href: '/find-developers' } },
        secondaryCta: { label: 'Talk to a human', action: { type: 'human-path' } },
      },
      {
        id: 'q2',
        label: 'How do I get listed as a developer?',
        response: [
          "Create your profile with your skills, experience, portfolio, and rate. Once listed, businesses can find you in the directory by technology, location, or specialization. You control your visibility — toggle off when you're booked, toggle on when you're ready.",
        ],
        primaryCta: { label: 'Get listed →', action: { type: 'link', href: '/onboarding' } },
        secondaryCta: { label: 'Talk to a human', action: { type: 'human-path' } },
      },
      {
        id: 'q3',
        label: 'What does it cost?',
        response: [
          "Check our pricing page for current plans. Developers get a profile listing and access to matched client introductions. Businesses submit project requests and get matched developer recommendations.",
        ],
        primaryCta: { label: 'See pricing →', action: { type: 'link', href: '/pricing' } },
        secondaryCta: { label: 'Book an intro call', action: { type: 'cal-intro' } },
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
    subheadline: 'Free: Developer Profile Review',
    description: "Submit your profile and we'll give you feedback on how to attract more client introductions through the platform.",
    freebieType: 'profile_review',
    qualifierQuestion: 'Are you a developer or looking for one?',
    qualifierOptions: ['Developer', 'Looking for a developer'],
    ctaLabel: 'Send It to Me',
    successMessage: "Check your inbox! It's on the way.",
  },
}
