import type { PlatformConfig } from '@vlp/member-ui'

export const tttmpConfig: PlatformConfig = {
  brandName: 'Tax Tools Arcade',
  brandAbbrev: 'TTTMP',
  brandColor: '#8b5cf6',
  brandSubtitle: 'Tax Education Hub',
  logoText: 'TTA',
  apiBaseUrl: 'https://api.taxmonitor.pro',
  posthog: {
    apiKey: 'phc_o5nTrNkxc37W2G9PXFL8peXMjWzdjo5d2HSjE5XzggkY',
    apiHost: 'https://us.i.posthog.com',
    autocapture: true,
    capturePageview: true,
    capturePageleave: true,
    disabledInDev: false,
  },
  calBookingNamespace: 'tttmp-support',
  calBookingSlug: 'tax-monitor-pro/tttmp-support',
  calIntroNamespace: 'tttmp-intro',
  calIntroSlug: 'tax-monitor-pro/tttmp-intro',
  cookiePrefsStorageKey: 'tttmp_cookie_prefs_v1',
  marketing: {
    tagline: 'Tax Tools Arcade',
    summary: 'Interactive games that teach IRS forms, tax concepts, and filing requirements.',
    ctaLabel: 'Play Now',
    ctaPath: '/pricing',
    megaMenu: {
      discover: [
        { label: 'About', href: '/about', description: 'Learn about Tax Tools Arcade' },
        { label: 'Game Guide', href: '/vesperi', description: 'Let Vesperi help you find the right game' },
        { label: 'Learn', href: '/learn', description: 'Video walkthroughs for every game' },
      ],
      explore: [
        { label: 'Features', href: '/features' },
        { label: 'How It Works', href: '/how-it-works' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Games', href: '/games' },
        { label: 'Reviews', href: '/reviews' },
      ],
      toolsExtras: [
        { label: 'Game Demo', href: '/games' },
        { label: 'IRS Form Guide', href: '/learn' },
        { label: 'Token Balance', href: '/dashboard' },
        { label: 'Help Center', href: '/help' },
      ],
      ctaText: 'Ready to learn tax through play?',
      ctaMagnetLabel: 'Meet Vesperi',
      ctaMagnetPath: '/vesperi',
    },
    footerResources: [
      { label: 'Game Guide', href: '/vesperi' },
      { label: 'Walkthroughs', href: '/learn' },
      { label: 'Tax Monitor Pro', href: 'https://taxmonitor.pro', external: true },
      { label: 'Transcript Automation', href: 'https://transcript.taxmonitor.pro', external: true },
      { label: 'TaxClaim Pro', href: 'https://taxclaim.virtuallaunch.pro', external: true },
    ],
    footerLegal: [
      { label: 'Privacy', href: '/legal/privacy' },
      { label: 'Refund', href: '/legal/refund' },
      { label: 'Terms', href: '/legal/terms' },
    ],
    footerTagline: 'Tax Tools Arcade',
  },
  navSections: [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
        { label: 'Game Activity', href: '/dashboard/game-activity', icon: 'Gamepad2' },
        { label: 'Games', href: '/games', icon: 'Joystick', external: true },
        { label: 'Tokens', href: '/pricing', icon: 'Coins', external: true },
      ],
    },
    {
      title: 'EARNINGS',
      items: [
        { label: 'Affiliate', href: '/affiliate', icon: 'Link2' },
      ],
    },
    {
      title: 'SETTINGS',
      items: [
        { label: 'Account', href: '/account', icon: 'Settings' },
        { label: 'Help', href: '/help', icon: 'LifeBuoy', external: true },
        { label: 'Support', href: '/contact', icon: 'HelpCircle', external: true },
      ],
    },
  ],
  routes: {
    home: '/',
    signIn: '/sign-in',
    signOut: '/sign-out',
    dashboard: '/dashboard',
    account: '/account',
    profile: '/account',
    support: '/contact',
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
}
