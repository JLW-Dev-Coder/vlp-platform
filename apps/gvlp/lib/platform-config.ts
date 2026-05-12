import type { PlatformConfig } from '@vlp/member-ui'

export const gvlpConfig: PlatformConfig = {
  brandName: 'Games VLP',
  brandAbbrev: 'GVLP',
  brandColor: '#22c55e',
  brandSubtitle: 'Game Dashboard',
  logoText: 'GVLP',
  apiBaseUrl: 'https://api.virtuallaunch.pro',
  posthog: {
    apiKey: 'phc_o5nTrNkxc37W2G9PXFL8peXMjWzdjo5d2HSjE5XzggkY',
    apiHost: 'https://us.i.posthog.com',
    autocapture: true,
    capturePageview: true,
    capturePageleave: true,
    disabledInDev: false,
  },
  calBookingNamespace: 'gvlp-support',
  calBookingSlug: 'tax-monitor-pro/gvlp-support',
  calIntroNamespace: 'gvlp-intro',
  calIntroSlug: 'tax-monitor-pro/gvlp-intro',
  navSections: [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
        { label: 'Game Access JS', href: '/dashboard/games', icon: 'Gamepad2' },
      ],
    },
    {
      title: 'EARNINGS',
      items: [
        { label: 'Affiliate', href: '/dashboard/affiliate', icon: 'Link2' },
        { label: 'Bidding', href: '/dashboard/bidding', icon: 'Gavel' },
        { label: 'Winning', href: '/dashboard/winning', icon: 'Trophy' },
      ],
    },
    {
      title: 'SETTINGS',
      items: [
        { label: 'Account', href: '/dashboard/account', icon: 'Settings' },
        { label: 'Plan', href: '/dashboard/upgrade', icon: 'CreditCard' },
        { label: 'Profile', href: '/dashboard/profile', icon: 'UserCircle' },
        { label: 'Support', href: '/dashboard/support', icon: 'HelpCircle' },
        { label: 'Usage', href: '/dashboard/usage', icon: 'Activity' },
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
    tagline: 'Game-based engagement',
    summary: 'Tax-themed mini-games for client education, lead capture, and practice differentiation.',
    ctaLabel: 'Browse Games',
    ctaPath: '/games',
    megaMenu: {
      discover: [
        { label: 'About', href: '/about', description: 'Why Games Virtual Launch Pro exists' },
        { label: 'Contact', href: '/contact', description: 'Talk to our team about embedding games' },
        { label: 'Game Library', href: '/games', description: 'Browse all available tax-themed games' },
      ],
      explore: [
        { label: 'Features', href: '/features' },
        { label: 'How It Works', href: '/how-it-works' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Help Center', href: '/dashboard/support' },
        { label: 'Reviews', href: '/reviews' },
      ],
      toolsExtras: [
        { label: 'Game Library', href: '/games' },
        { label: 'Sample Embed', href: '/tools/sample-embed' },
        { label: 'Tournament Rules', href: '/tools/tournament-rules' },
        { label: 'Achievement Guide', href: '/tools/achievement-guide' },
      ],
      ctaText: 'Want to embed real tax games on your site without building them yourself?',
      ctaMagnetLabel: 'Browse the Library',
      ctaMagnetPath: '/games',
    },
    footerResources: [
      { label: 'Game Library', href: '/games' },
      { label: 'Affiliate Program', href: '/dashboard/affiliate' },
      { label: 'Virtual Launch Pro', href: 'https://virtuallaunch.pro', external: true },
      { label: 'Tax Monitor Pro', href: 'https://taxmonitor.pro', external: true },
      { label: 'Tax Tools Arcade', href: 'https://taxtools.taxmonitor.pro', external: true },
    ],
    footerLegal: [
      { label: 'Privacy', href: '/legal/privacy' },
      { label: 'Refund', href: '/legal/refund' },
      { label: 'Terms', href: '/legal/terms' },
    ],
    footerTagline: 'Game-based engagement',
  },
  chatbot: {
    enabled: true,
    aiEnabled: false,
    nudge: {
      label: 'Games VLP',
      message: 'Add gamified experiences to your business',
    },
    header: {
      avatarInitials: 'GVL',
      title: 'Games VLP',
      subtitle: 'Gamified engagement for your clients',
    },
    welcome: "Hi! Interested in adding games to your client experience? Here's what to know.",
    questions: [
      {
        id: 'q1',
        label: 'What kind of games are available?',
        response: [
          "Educational and engagement games designed for professional services — tax education, compliance training, client onboarding activities. Each game is built to educate or engage, not just entertain. Your clients interact with your brand through something they actually enjoy.",
        ],
        primaryCta: { label: 'Browse games →', action: { type: 'link', href: '/games' } },
        secondaryCta: { label: 'Talk to a human', action: { type: 'human-path' } },
      },
      {
        id: 'q2',
        label: 'Can I embed games on my site?',
        response: [
          "Yes — unlock the game library and share direct links or embed games on your own site. One subscription covers all your clients, whether you have 10 or 10,000. Predictable pricing that doesn't scale with usage.",
        ],
        primaryCta: { label: 'See how it works →', action: { type: 'link', href: '/how-it-works' } },
        secondaryCta: { label: 'Talk to a human', action: { type: 'human-path' } },
      },
      {
        id: 'q3',
        label: 'How does pricing work?',
        response: [
          "Games VLP uses a subscription model. One plan covers unlimited client access to the full game library. Check our pricing page for details, or book a quick intro call to see the games in action.",
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
}
