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
        { label: 'Games', href: '/games', icon: 'Gamepad2' },
        { label: 'Embed Codes', href: '/dashboard/embed', icon: 'Code2' },
        { label: 'Tokens', href: '/dashboard/tokens', icon: 'Coins' },
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
        { label: 'Account', href: '/dashboard/settings', icon: 'Settings' },
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
    profile: '/dashboard',
    support: '/support',
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
        { label: 'Sample Embed', href: '/games' },
        { label: 'Tournament Rules', href: '/games' },
        { label: 'Achievement Guide', href: '/games' },
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
