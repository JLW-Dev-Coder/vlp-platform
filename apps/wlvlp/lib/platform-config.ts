import type { PlatformConfig } from '@vlp/member-ui'

export const wlvlpConfig: PlatformConfig = {
  brandName: 'Website Lotto',
  brandAbbrev: 'WLVLP',
  brandColor: '#00D4FF',
  brandSubtitle: 'Template Marketplace',
  logoText: 'WL',
  apiBaseUrl: 'https://api.virtuallaunch.pro',
  posthog: {
    apiKey: 'phc_o5nTrNkxc37W2G9PXFL8peXMjWzdjo5d2HSjE5XzggkY',
    apiHost: 'https://us.i.posthog.com',
    autocapture: true,
    capturePageview: true,
    capturePageleave: true,
    disabledInDev: false,
  },
  calBookingNamespace: 'wlvlp-support',
  calBookingSlug: 'tax-monitor-pro/wlvlp-support',
  calIntroNamespace: 'wlvlp-intro',
  calIntroSlug: 'tax-monitor-pro/wlvlp-intro',
  navSections: [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
        { label: 'My Sites', href: '/dashboard/sites', icon: 'Globe' },
        { label: 'Hosting', href: '/dashboard/hosting', icon: 'Server' },
        { label: 'Voting', href: '/dashboard/voting', icon: 'ThumbsUp' },
        { label: 'Templates', href: '/', icon: 'LayoutGrid', external: true },
        { label: 'Scratch', href: '/scratch', icon: 'Ticket', external: true },
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
        { label: 'Profile', href: '/dashboard/profile', icon: 'User' },
        { label: 'Support', href: '/dashboard/support', icon: 'LifeBuoy' },
        { label: 'Usage', href: '/dashboard/usage', icon: 'Activity' },
      ],
    },
  ],
  routes: {
    home: '/',
    signIn: '/sign-in',
    signOut: '/sign-in',
    dashboard: '/dashboard',
    account: '/dashboard/account',
    profile: '/dashboard/profile',
    support: '/dashboard/support',
    notifications: '/dashboard/notifications',
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
    tagline: 'Website marketplace',
    summary: 'Win, bid on, or buy professionally designed websites — ready to launch with your brand.',
    ctaLabel: 'Free Ticket',
    ctaPath: '/scratch',
    megaMenu: {
      discover: [
        { label: 'About', href: '/about', description: 'Why Website Lotto exists' },
        { label: 'Contact', href: '/contact', description: 'Talk to our team or start intake' },
        { label: 'Site Hosting FAQ', href: '/support', description: 'How hosting and domains work' },
      ],
      explore: [
        { label: 'Features', href: '/features' },
        { label: 'How It Works', href: '/how-it-works' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Help Center', href: '/support' },
        { label: 'Template Gallery', href: '/' },
      ],
      toolsExtras: [
        { label: 'Get Started', href: '/get-started' },
        { label: 'Template Gallery', href: '/' },
        { label: 'Before/After Preview', href: '/before-after' },
        { label: 'Design Tips', href: '/design-tips' },
        { label: 'Get Launch Ready', href: '/launch' },
      ],
      ctaText: 'Want a professional website without building one yourself?',
      ctaMagnetLabel: 'Try a Free Scratch Ticket',
      ctaMagnetPath: '/scratch',
    },
    footerResources: [
      { label: 'Free Scratch Ticket', href: '/scratch' },
      { label: 'Affiliate Program', href: '/affiliate' },
      { label: 'Virtual Launch Pro', href: 'https://virtuallaunch.pro', external: true },
      { label: 'Tax Monitor Pro', href: 'https://taxmonitor.pro', external: true },
      { label: 'Developers VLP', href: 'https://developers.virtuallaunch.pro', external: true },
    ],
    footerLegal: [
      { label: 'Privacy', href: '/legal/privacy' },
      { label: 'Refund', href: '/legal/refund' },
      { label: 'Terms', href: '/legal/terms' },
    ],
    footerTagline: 'Website marketplace',
  },
  chatbot: {
    enabled: true,
    aiEnabled: false,
    nudge: {
      label: 'Website Lotto',
      message: 'Win or buy a professional website',
    },
    header: {
      avatarInitials: 'WL',
      title: 'Website Lotto',
      subtitle: 'Website marketplace with a twist',
    },
    welcome: "Hi! Interested in getting a professional website? Here's how Website Lotto works.",
    questions: [
      {
        id: 'q1',
        label: 'How does the website lottery work?',
        response: [
          "Browse our template marketplace. See one you like? You can buy it outright, bid on it in auction, or try your luck with a scratch card to win it free. Every template is a fully designed, ready-to-publish website. Pick it up however works for you.",
        ],
        primaryCta: { label: 'Try Scratch to Win →', action: { type: 'link', href: '/scratch' } },
        secondaryCta: { label: 'Talk to a human', action: { type: 'human-path' } },
      },
      {
        id: 'q2',
        label: 'What do I get with a website?',
        response: [
          "A fully designed website with your business name, colors, and content. Connect your own domain. We host and maintain it for you — no server management, no DNS headaches. Professional web presence in minutes, not months.",
        ],
        primaryCta: { label: 'Browse templates →', action: { type: 'link', href: '/' } },
        secondaryCta: { label: 'Talk to a human', action: { type: 'human-path' } },
      },
      {
        id: 'q3',
        label: 'What does it cost?',
        response: [
          "Prices vary by template. Some are free via scratch cards. Others are priced from $49 up, or you can bid below list price in auctions. Hosting is included. Check out our sites page to browse what's available.",
        ],
        primaryCta: { label: 'Browse templates →', action: { type: 'link', href: '/' } },
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
    subheadline: 'Free: Site Evaluation for Your Business',
    description: "We'll review your current web presence and show you what a professional site could look like — on us.",
    freebieType: 'site_evaluation',
    qualifierQuestion: 'Do you currently have a website?',
    qualifierOptions: ['Yes', 'No'],
    ctaLabel: 'Send It to Me',
    successMessage: "Check your inbox! It's on the way.",
  },
}
