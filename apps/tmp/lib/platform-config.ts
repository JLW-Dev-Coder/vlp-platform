import type { PlatformConfig } from '@vlp/member-ui'

export const tmpConfig: PlatformConfig = {
  brandName: 'Tax Monitor Pro',
  brandAbbrev: 'TMP',
  brandColor: '#f97316',
  brandSubtitle: 'Pro Dashboard',
  logoText: 'TMP',
  apiBaseUrl: 'https://api.taxmonitor.pro',
  navSections: [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
        { label: 'Compliance Report', href: '/report', icon: 'FileCheck' },
        { label: 'Transcript Changes', href: '/dashboard', icon: 'ScrollText' },
        { label: 'ESign 2848', href: '/forms/2848', icon: 'PenTool' },
      ],
    },
    {
      title: 'MONITORING',
      items: [
        { label: 'Active Alerts', href: '/dashboard', icon: 'Bell' },
        { label: 'Tokens', href: '/dashboard', icon: 'Coins' },
      ],
    },
    {
      title: 'EARNINGS',
      items: [
        { label: 'Receipts', href: '/dashboard', icon: 'Receipt' },
        { label: 'Affiliate', href: '/affiliate', icon: 'Link2' },
      ],
    },
    {
      title: 'SETTINGS',
      items: [
        { label: 'Profile', href: '/dashboard/profile', icon: 'UserCircle' },
        { label: 'Support', href: '/support', icon: 'HelpCircle' },
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
    support: '/support',
  },
}
