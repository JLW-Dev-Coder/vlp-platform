import type { PlatformConfig } from '@vlp/member-ui'

export const gsvlpConfig: PlatformConfig = {
  brandName: 'Growth Setter Pro',
  brandAbbrev: 'GSP',
  brandColor: '#FF6B00',
  brandSubtitle: 'Book Calls. Earn Commission.',
  logoText: 'GSP',
  apiBaseUrl: 'https://api.virtuallaunch.pro',
  calBookingNamespace: 'virtual-launch-pro',
  calBookingSlug: 'tax-monitor-pro/virtual-launch-pro',
  calIntroNamespace: 'virtual-launch-pro',
  calIntroSlug: 'tax-monitor-pro/virtual-launch-pro',
  navSections: [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Overview', href: '/dashboard', icon: 'LayoutDashboard' },
        { label: 'Call Lists', href: '/dashboard/lists', icon: 'PhoneCall' },
        { label: 'Appointments', href: '/dashboard/appointments', icon: 'Calendar' },
        { label: 'Earnings', href: '/dashboard/earnings', icon: 'DollarSign' },
        { label: 'Settings', href: '/dashboard/settings', icon: 'Settings' },
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
    tagline: 'Book calls. Earn commission. Grow with us.',
    summary: 'Growth Setter Pro is a free recruitment and affiliate platform for appointment setters. Get scripts, call lists, and 20% commission on closed deals.',
    ctaLabel: 'Start Now — Free',
    ctaPath: '/sign-in',
    megaMenu: {
      discover: [
        { label: 'How It Works', href: '/how-it-works', description: 'From signup to commission' },
        { label: 'Contact', href: '/contact', description: 'Talk to our team' },
      ],
      explore: [
        { label: 'Pricing', href: '/pricing' },
        { label: 'Help Center', href: '/help' },
      ],
      toolsExtras: [
        { label: 'Virtual Launch Pro', href: 'https://virtuallaunch.pro' },
        { label: 'Tax Avatar Pro', href: 'https://taxavatar.virtuallaunch.pro' },
      ],
      ctaText: 'Free training, FOIA-sourced call lists, and 20% commission on closed deals — no experience required.',
      ctaMagnetLabel: 'Start Now',
      ctaMagnetPath: '/sign-in',
    },
    footerTagline: 'Book calls. Earn commission. Grow with us.',
    footerResources: [
      { label: 'Help Center', href: '/help' },
      { label: 'Virtual Launch Pro', href: 'https://virtuallaunch.pro', external: true },
      { label: 'Affiliate Program', href: 'https://virtuallaunch.pro/affiliate', external: true },
    ],
    footerLegal: [
      { label: 'Privacy', href: '/legal/privacy' },
      { label: 'Terms', href: '/legal/terms' },
    ],
  },
}
