import type { PlatformConfig } from '@vlp/member-ui'

export const vlpConfig: PlatformConfig = {
  brandName: 'Virtual Launch Pro',
  brandAbbrev: 'VLP',
  brandColor: '#f97316',
  brandSubtitle: 'Member Dashboard',
  logoText: 'VLP',
  apiBaseUrl: 'https://api.virtuallaunch.pro',
  calcomReferralLink: 'https://refer.cal.com/tax-monitor-pro-wltn',
  navSections: [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
        { label: 'Analytics', href: '/analytics', icon: 'BarChart3' },
        { label: 'Calendar', href: '/calendar', icon: 'Calendar' },
        { label: 'Inquiries', href: '/inquiries', icon: 'MessageSquare' },
        { label: 'Reports', href: '/reports', icon: 'FileText' },
        { label: 'Tokens', href: '/tokens', icon: 'Coins' },
      ],
    },
    {
      title: 'EARNINGS',
      items: [
        { label: 'Affiliate', href: '/affiliate', icon: 'Link2' },
        { label: 'Payouts', href: '/payouts', icon: 'Wallet' },
      ],
    },
    {
      title: 'SETTINGS',
      items: [
        {
          label: 'Account',
          href: '/account',
          icon: 'Settings',
          children: [
            { label: 'Payments', href: '/account/payments', icon: 'Wallet' },
          ],
        },
        {
          label: 'Profile',
          href: '/profile',
          icon: 'UserCircle',
          children: [
            { label: 'Onboarding', href: '/profile/onboarding', icon: 'User' },
            { label: 'Preview', href: '/profile/preview', icon: 'User' },
          ],
        },
        { label: 'Support', href: '/support', icon: 'HelpCircle' },
        { label: 'Usage', href: '/usage', icon: 'Activity' },
      ],
    },
  ],
  routes: {
    home: '/',
    signIn: '/sign-in',
    signOut: '/sign-in',
    dashboard: '/dashboard',
    account: '/account',
    profile: '/profile',
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
    tagline: 'Launch systems for tax professionals',
    summary: 'Membership platform for tax professionals who want calmer launches, cleaner operations, and a repeatable client acquisition system.',
    ctaLabel: 'Start Here',
    ctaPath: '/contact',
    megaMenu: {
      discover: [
        { label: 'About', href: '/about', description: 'Why Virtual Launch Pro exists' },
        { label: 'Contact', href: '/contact', description: 'Talk to our team or start intake' },
        { label: 'Blog', href: '/blog', description: 'Insights and growth content for tax pros' },
      ],
      explore: [
        { label: 'Booking', href: '/features/booking', description: 'See the booking workflow in action' },
        { label: 'Public Profile', href: '/features/public-profile', description: 'Preview the professional profile experience' },
        { label: 'Help Center', href: '/help', description: 'Answers, guides, and support' },
        { label: 'Pricing', href: '/pricing' },
      ],
      toolsExtras: [
        { label: 'Platform Overview', href: '/features' },
        { label: 'Integration Guide', href: '/how-it-works' },
        { label: 'Partner Program', href: '/affiliate' },
      ],
      ctaText: 'Need a cleaner launch system than duct tape, calendar links, and prayer?',
      ctaMagnetLabel: 'Contact Sales',
      ctaMagnetPath: '/contact',
    },
    footerTagline: 'Calm launch systems',
    footerResources: [
      { label: 'Blog', href: '/blog' },
      { label: 'Transcript Central', href: 'https://taxmonitor.pro/resources/transcript-central', external: true },
      { label: 'How to Read IRS Transcripts', href: 'https://transcript.taxmonitor.pro/resources/how-to-read-irs-transcripts', external: true },
      { label: 'Tax Monitor Pro', href: 'https://taxmonitor.pro', external: true },
      { label: 'Transcript Automation', href: 'https://transcript.taxmonitor.pro', external: true },
      { label: 'TaxTools Arcade', href: 'https://taxtools.taxmonitor.pro', external: true },
      { label: 'Affiliate Program', href: '/affiliate' },
    ],
    footerLegal: [
      { label: 'Privacy', href: '/legal/privacy' },
      { label: 'Terms', href: '/legal/terms' },
    ],
  },
}
