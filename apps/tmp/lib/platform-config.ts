import type { PlatformConfig } from '@vlp/member-ui'

export const tmpConfig: PlatformConfig = {
  brandName: 'Tax Monitor Pro',
  brandAbbrev: 'TMP',
  brandColor: '#f97316',
  brandSubtitle: 'Pro Dashboard',
  logoText: 'TMP',
  apiBaseUrl: 'https://api.taxmonitor.pro',
  calBookingNamespace: 'tmp-support',
  calBookingSlug: 'tax-monitor-pro/tmp-support',
  calIntroNamespace: 'tmp-intro',
  calIntroSlug: 'tax-monitor-pro/tmp-intro',
  navSections: [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
        { label: 'Compliance Report', href: '/dashboard/compliance-report', icon: 'FileCheck' },
        { label: 'Transcript Changes', href: '/dashboard/transcript-changes', icon: 'ScrollText' },
        { label: 'ESign 2848', href: '/dashboard/esign-2848', icon: 'PenTool' },
      ],
    },
    {
      title: 'MONITORING',
      items: [
        { label: 'Active Alerts', href: '/dashboard/active-alerts', icon: 'Bell' },
        { label: 'Tokens', href: '/dashboard/tokens', icon: 'Coins' },
      ],
    },
    {
      title: 'EARNINGS',
      items: [
        { label: 'Receipts', href: '/dashboard/receipts', icon: 'Receipt' },
        { label: 'Affiliate', href: '/dashboard/affiliate', icon: 'Link2' },
      ],
    },
    {
      title: 'SETTINGS',
      items: [
        { label: 'Profile', href: '/dashboard/profile', icon: 'UserCircle' },
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
    profile: '/dashboard/profile',
    support: '/dashboard/support',
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
