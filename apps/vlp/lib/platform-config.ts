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
}
