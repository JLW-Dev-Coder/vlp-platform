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
        { label: 'Submissions', href: '/operator/submissions', icon: 'Inbox' },
        { label: 'Developers', href: '/operator/developers', icon: 'Users' },
        { label: 'Jobs', href: '/operator/jobs', icon: 'Briefcase' },
        { label: 'Post to Developer', href: '/operator/post', icon: 'Send' },
        { label: 'Messages', href: '/operator/messages', icon: 'MessageSquare' },
        { label: 'Tickets', href: '/operator/tickets', icon: 'Ticket' },
        { label: 'Canned Responses', href: '/operator/canned-responses', icon: 'FileText' },
        { label: 'Bulk Email', href: '/operator/bulk-email', icon: 'Mail' },
        { label: 'Find Developers', href: '/developers', icon: 'Search' },
        { label: 'Onboarding', href: '/onboarding', icon: 'UserPlus' },
      ],
    },
    {
      title: 'EARNINGS',
      items: [
        { label: 'Affiliate', href: '/operator/affiliate', icon: 'Link2' },
      ],
    },
    {
      title: 'SETTINGS',
      items: [
        { label: 'Support', href: '/operator/support', icon: 'HelpCircle' },
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
    support: '/operator/support',
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
