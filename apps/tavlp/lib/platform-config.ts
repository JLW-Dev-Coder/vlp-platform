import type { PlatformConfig } from '@vlp/member-ui'

export const tavlpConfig: PlatformConfig = {
  brandName: 'Tax Avatar Pro',
  brandAbbrev: 'TAP',
  brandColor: '#ec4899',
  brandSubtitle: 'AI YouTube Channel for Tax Pros',
  logoText: 'TAP',
  apiBaseUrl: 'https://api.virtuallaunch.pro',
  calBookingNamespace: 'tavlp-support',
  calBookingSlug: 'tax-monitor-pro/tavlp-support',
  calIntroNamespace: 'tax-avatar-virtual-launch-pro',
  calIntroSlug: 'tax-monitor-pro/tax-avatar-virtual-launch-pro',
  navSections: [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
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
  marketing: {
    tagline: 'AI YouTube channel for tax pros',
    summary: 'Tax Avatar Pro is a fully-managed AI YouTube channel for tax professionals. We pick the avatar, write the scripts, publish the episodes, and grow your audience.',
    ctaLabel: 'Get Started',
    ctaPath: '/contact',
    megaMenu: {
      discover: [
        { label: 'Avatars', href: '/avatars', description: 'Choose your AI host' },
        { label: 'Contact', href: '/contact', description: 'Talk to our team' },
      ],
      explore: [
        { label: 'Pricing', href: '/pricing' },
      ],
      toolsExtras: [
        { label: 'TaxClaim Pro', href: 'https://taxclaim.virtuallaunch.pro' },
        { label: 'Tax Transcript AI', href: 'https://transcript.taxmonitor.pro' },
      ],
      ctaText: 'A managed AI YouTube channel that builds authority for your tax practice — without you spending a minute on camera.',
      ctaMagnetLabel: 'See Avatars',
      ctaMagnetPath: '/avatars',
    },
    footerTagline: 'AI YouTube channel for tax pros',
    footerResources: [
      { label: 'TaxClaim Pro', href: 'https://taxclaim.virtuallaunch.pro', external: true },
      { label: 'Tax Transcript AI', href: 'https://transcript.taxmonitor.pro', external: true },
      { label: 'Affiliate Program', href: 'https://virtuallaunch.pro/affiliate', external: true },
    ],
    footerLegal: [
      { label: 'Privacy', href: '/legal/privacy' },
      { label: 'Terms', href: '/legal/terms' },
    ],
  },
}
