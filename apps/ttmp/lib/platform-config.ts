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
    signIn: '/login/',
    signOut: '/login/',
    dashboard: '/app/dashboard/',
    account: '/app/account/',
    profile: '/app/profile/',
    support: '/app/support/',
  },
}
