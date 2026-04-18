import type { PlatformConfig } from '@vlp/member-ui'

export const ttmpConfig: PlatformConfig = {
  brandName: 'Transcript Tax Monitor',
  brandAbbrev: 'TTMP',
  brandColor: '#14b8a6',
  brandSubtitle: 'Pro Dashboard',
  logoText: 'TT',
  apiBaseUrl: 'https://api.taxmonitor.pro',
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
}
