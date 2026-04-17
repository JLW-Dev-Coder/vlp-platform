import type { PlatformConfig } from '@vlp/member-ui'

export const dvlpConfig: PlatformConfig = {
  brandName: 'Developers VLP',
  brandAbbrev: 'DVLP',
  brandColor: '#3b82f6',
  brandSubtitle: 'Developer Marketplace',
  logoText: 'DVLP',
  apiBaseUrl: 'https://api.virtuallaunch.pro',
  calBookingNamespace: 'dvlp-support',
  calBookingSlug: 'tax-monitor-pro/dvlp-support',
  calIntroNamespace: 'dvlp-intro',
  calIntroSlug: 'tax-monitor-pro/dvlp-intro',
  calOnboardingNamespace: 'dvlp-onboarding',
  calOnboardingSlug: 'tax-monitor-pro/dvlp-onboarding',
  navSections: [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Dashboard', href: '/operator', icon: 'LayoutDashboard' },
        { label: 'Find Developers', href: '/developers', icon: 'Search' },
        { label: 'Onboarding', href: '/onboarding', icon: 'UserPlus' },
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
        { label: 'Account', href: '/operator', icon: 'Settings' },
        { label: 'Support', href: '/support', icon: 'HelpCircle' },
      ],
    },
  ],
  routes: {
    home: '/',
    signIn: '/sign-in',
    signOut: '/sign-in',
    dashboard: '/operator',
    account: '/operator',
    profile: '/operator',
    support: '/support',
  },
}
