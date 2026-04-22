import type { PlatformConfig } from '@vlp/member-ui'

export const tttmpConfig: PlatformConfig = {
  brandName: 'Tax Tools Arcade',
  brandAbbrev: 'TTTMP',
  brandColor: '#8b5cf6',
  brandSubtitle: 'Tax Education Hub',
  logoText: 'TTA',
  apiBaseUrl: 'https://api.virtuallaunch.pro',
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
        { label: 'How It Works', href: '/how-it-works', description: 'See how game-based learning works' },
      ],
      explore: [
        { label: 'Games', href: '/games' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Reviews', href: '/reviews' },
      ],
      toolsExtras: [
        { label: 'Token Balance', href: '/dashboard' },
        { label: 'Support', href: '/contact' },
      ],
      ctaText: 'Ready to learn tax through play?',
      ctaMagnetLabel: 'See Available Games',
      ctaMagnetPath: '/games',
    },
    footerResources: [
      { label: 'Help Center', href: '/support' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
    footerLegal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
  navSections: [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Dashboard', href: '/account', icon: 'LayoutDashboard' },
        { label: 'Games', href: '/games', icon: 'Gamepad2', external: true },
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
        { label: 'Support', href: '/contact', icon: 'HelpCircle', external: true },
      ],
    },
  ],
  routes: {
    home: '/',
    signIn: '/sign-in',
    signOut: '/sign-in',
    dashboard: '/account',
    account: '/account',
    profile: '/account',
    support: '/contact',
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
