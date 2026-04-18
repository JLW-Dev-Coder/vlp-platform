import type { PlatformConfig } from '@vlp/member-ui'

export const gvlpConfig: PlatformConfig = {
  brandName: 'Games VLP',
  brandAbbrev: 'GVLP',
  brandColor: '#22c55e',
  brandSubtitle: 'Game Dashboard',
  logoText: 'GVLP',
  apiBaseUrl: 'https://api.virtuallaunch.pro',
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
        { label: 'Reports', href: '/dashboard/reports', icon: 'FileText' },
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
}
