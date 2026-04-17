import type { PlatformConfig } from '@vlp/member-ui'

export const gvlpConfig: PlatformConfig = {
  brandName: 'Games VLP',
  brandAbbrev: 'GVLP',
  brandColor: '#22c55e',
  brandSubtitle: 'Game Dashboard',
  logoText: 'GVLP',
  apiBaseUrl: 'https://api.virtuallaunch.pro',
  navSections: [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
        { label: 'Games', href: '/games', icon: 'Gamepad2' },
        { label: 'Embed Codes', href: '/dashboard', icon: 'Code2' },
        { label: 'Tokens', href: '/dashboard', icon: 'Coins' },
      ],
    },
    {
      title: 'EARNINGS',
      items: [
        { label: 'Affiliate', href: '/dashboard/affiliate', icon: 'Link2' },
      ],
    },
    {
      title: 'SETTINGS',
      items: [
        { label: 'Account', href: '/dashboard', icon: 'Settings' },
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
    profile: '/dashboard',
    support: '/support',
  },
}
