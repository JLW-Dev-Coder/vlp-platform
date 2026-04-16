import type { PlatformConfig } from '@vlp/member-ui'

export const tcvlpConfig: PlatformConfig = {
  brandName: 'TaxClaim Pro',
  brandAbbrev: 'TCVLP',
  brandColor: '#eab308',
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
  marketing: {
    tagline: 'Form 843 automation for tax pros',
    summary: 'TaxClaim Pro generates IRS Form 843 preparation guides from your client data in 5 minutes. Built for the Kwong v. US refund window.',
    ctaLabel: 'Get Started',
    ctaPath: '/sign-in?redirect=/onboarding',
    megaMenu: {
      discover: [
        { label: 'About', href: '/about', description: 'Why TaxClaim Pro exists' },
        { label: 'Contact', href: '/contact', description: 'Talk to our team or start intake' },
        { label: 'What is Form 843', href: '/what-is-form-843', description: 'Learn what Form 843 is and who qualifies' },
      ],
      explore: [
        { label: 'Demo', href: '/demo', description: 'See how your clients claim their refund' },
        { label: 'Features', href: '/features' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Help Center', href: '/support', description: 'Answers, FAQs, and booking' },
      ],
      toolsExtras: [
        { label: 'Onboarding', href: '/onboarding' },
        { label: 'Affiliate Program', href: '/affiliate' },
        { label: 'Book a Call', href: '/support#book-a-call' },
      ],
      ctaText: "The Kwong window closes July 10, 2026. Don't let your clients miss their refund.",
      ctaMagnetLabel: 'See the Demo →',
      ctaMagnetPath: '/demo',
    },
    footerTagline: 'Kwong v. US refund window',
    footerResources: [
      { label: 'What is Form 843', href: '/what-is-form-843' },
      { label: 'Official IRS Form 843', href: 'https://www.irs.gov/pub/irs-pdf/f843.pdf', external: true },
      { label: 'Get IRS Transcript', href: 'https://www.irs.gov/individuals/get-transcript', external: true },
      { label: 'Virtual Launch Pro', href: 'https://virtuallaunch.pro', external: true },
      { label: 'Tax Monitor Pro', href: 'https://taxmonitor.pro', external: true },
      { label: 'Transcript Tax Monitor', href: 'https://transcript.taxmonitor.pro', external: true },
      { label: 'Affiliate Program', href: '/affiliate' },
    ],
    footerLegal: [
      { label: 'Privacy', href: '/legal/privacy' },
      { label: 'Terms', href: '/legal/terms' },
    ],
  },
}
