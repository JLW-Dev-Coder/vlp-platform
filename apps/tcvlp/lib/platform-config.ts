import type { PlatformConfig } from '@vlp/member-ui'

export const tcvlpConfig: PlatformConfig = {
  brandName: 'TaxClaim Pro',
  brandAbbrev: 'TCVLP',
  brandColor: '#ef4444',
  brandSubtitle: 'Penalty Abatement',
  logoText: 'TCP',
  apiBaseUrl: 'https://api.virtuallaunch.pro',
  navSections: [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
        { label: 'Claims', href: '/claim', icon: 'FileText' },
        { label: 'Form 843', href: '/what-is-form-843', icon: 'FileCheck' },
        { label: 'Submissions', href: '/dashboard', icon: 'ScrollText' },
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
