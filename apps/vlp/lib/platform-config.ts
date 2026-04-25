import type { PlatformConfig } from '@vlp/member-ui'

export const vlpConfig: PlatformConfig = {
  brandName: 'Virtual Launch Pro',
  brandAbbrev: 'VLP',
  brandColor: '#f97316',
  brandSubtitle: 'Member Dashboard',
  logoText: 'VLP',
  apiBaseUrl: 'https://api.virtuallaunch.pro',
  posthog: {
    apiKey: 'phc_o5nTrNkxc37W2G9PXFL8peXMjWzdjo5d2HSjE5XzggkY',
    apiHost: 'https://us.i.posthog.com',
    autocapture: true,
    capturePageview: true,
    capturePageleave: true,
    disabledInDev: false,
  },
  calcomReferralLink: 'https://refer.cal.com/tax-monitor-pro-wltn',
  calBookingNamespace: 'vlp-support',
  calBookingSlug: 'tax-monitor-pro/vlp-support',
  calIntroNamespace: 'vlp-intro',
  calIntroSlug: 'tax-monitor-pro/vlp-intro',
  navSections: [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
        { label: 'Inquiries', href: '/inquiries', icon: 'MessageSquare' },
        { label: 'Directory Profile', href: '/profile', icon: 'IdCard' },
        { label: 'Calendar', href: '/calendar', icon: 'Calendar' },
        { label: 'Notifications', href: '/notifications', icon: 'Bell' },
      ],
    },
    {
      title: 'TOOLS',
      items: [
        { label: 'Tokens', href: '/tokens', icon: 'Coins' },
        { label: 'Analytics', href: '/analytics', icon: 'BarChart3' },
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
    tagline: 'Speed to Lead',
    summary: 'The fastest way for tax professionals to find and respond to new clients.',
    ctaLabel: 'Get Your First Leads',
    ctaPath: '/sign-in',
    megaMenu: {
      discover: [
        { label: 'About', href: '/about', description: 'Why Virtual Launch Pro exists' },
        { label: 'Contact', href: '/contact', description: 'Talk to our team or start intake' },
        { label: 'Blog', href: '/blog', description: 'Insights and growth content for tax pros' },
      ],
      explore: [
        { label: 'Pricing', href: '/pricing', description: 'Plans and what you get at each tier' },
        { label: 'Help Center', href: '/help', description: 'Answers, guides, and support' },
      ],
      toolsExtras: [
        { label: 'How It Works', href: '/how-it-works' },
        { label: 'Directory Profile', href: '/features/public-profile' },
        { label: 'Partner Program', href: '/affiliate' },
      ],
      ctaText: 'Your next client is already looking for you. Get listed and start receiving leads.',
      ctaMagnetLabel: 'Get Your First Leads',
      ctaMagnetPath: '/sign-in',
    },
    footerTagline: 'Speed to lead for tax pros',
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
