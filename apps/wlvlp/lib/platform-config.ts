import type { PlatformConfig } from '@vlp/member-ui'

export const wlvlpConfig: PlatformConfig = {
  brandName: 'Website Lotto',
  brandAbbrev: 'WLVLP',
  brandColor: '#a855f7',
  brandSubtitle: 'Template Marketplace',
  logoText: 'WL',
  apiBaseUrl: 'https://api.virtuallaunch.pro',
  navSections: [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
        { label: 'My Sites', href: '/dashboard/sites', icon: 'Globe' },
        { label: 'Templates', href: '/', icon: 'LayoutGrid' },
        { label: 'Scratch', href: '/scratch', icon: 'Ticket' },
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
        { label: 'Account', href: '/dashboard', icon: 'Settings' },
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
    profile: '/dashboard',
    support: '/support',
  },
}
