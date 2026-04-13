import type { PlatformConfig } from '@vlp/member-ui'

export const ttmpConfig: PlatformConfig = {
  brandName: 'Transcript Tax Monitor',
  brandAbbrev: 'TTMP',
  brandColor: '#14b8a6',
  brandSubtitle: 'Pro Dashboard',
  logoText: 'TT',
  apiBaseUrl: 'https://api.taxmonitor.pro',
  navSections: [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Dashboard', href: '/app/dashboard/', icon: 'LayoutDashboard' },
        { label: 'Calendar', href: '/app/calendar/', icon: 'Calendar' },
        { label: 'Transcripts', href: '/app/dashboard/', icon: 'ScrollText' },
        { label: 'Tools', href: '/app/tools/', icon: 'Wrench' },
        { label: 'Tokens', href: '/app/token-usage/', icon: 'Coins' },
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
        { label: 'Profile', href: '/app/profile/', icon: 'UserCircle' },
        { label: 'Support', href: '/app/support/', icon: 'HelpCircle' },
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
