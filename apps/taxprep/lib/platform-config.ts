import type { PlatformConfig } from '@vlp/member-ui'

// Tax Prep Pro — TPP / app #10
// SD-led marketing app: members live in SuiteDash, not Next.js. Cal.com fields
// are intentionally omitted; bookings flow through SuiteDash form embeds.
// See RC prompt §3 Deviations 1, 3, 8, 9 and canonical-cal-events §SuiteDash form bookings.
export const tppConfig: PlatformConfig = {
  brandName: 'Tax Prep Pro',
  brandAbbrev: 'TPP',
  brandColor: '#E91E63',
  themeMode: 'light',
  brandSubtitle: 'For Service Bureaus & Tax Pros',
  logoText: 'TPP',
  apiBaseUrl: 'https://api.virtuallaunch.pro',

  // Deviation 1: SuiteDash form embeds, not Cal.com.
  bookingProvider: 'suitedash',
  suitedashDiscoveryFormId: '21EGX5mk16QA6qVGj',
  suitedashDemoFormId: '2rU9ohwhCx3rsijrC',
  suitedashEmbedBaseUrl: 'https://secure.virtuallaunch.pro/frm',

  // Cal.com fields are unused for TPP (bookingProvider === 'suitedash').
  // Empty strings keep the shared PlatformConfig contract stable; LeadChatbot
  // and HelpCenter (the only consumers that read these) are not rendered on TPP.
  calBookingNamespace: '',
  calBookingSlug: '',
  calIntroNamespace: '',
  calIntroSlug: '',

  navSections: [],

  routes: {
    home: '/',
    signIn: '/sign-in',
    signOut: '/sign-in',
    // Deviation 3: dashboard is OUTBOUND to SuiteDash.
    // TODO(RC): Confirm SD member portal URL with Jamie before production deploy.
    dashboard: 'https://members.virtuallaunch.pro',
    account: 'https://members.virtuallaunch.pro',
    profile: 'https://members.virtuallaunch.pro',
    support: '/contact',
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
    // TODO(copy): Jamie to provide TPP-specific contact phone/email.
    phone: '619-800-5457',
    supportEmail: 'outreach@virtuallaunch.pro',
  },

  marketing: {
    tagline: 'Productize your service bureau end-to-end',
    summary:
      'Tax Prep Pro is a SuiteDash-based productized buildout for service bureaus and credentialed tax practitioners — 8-phase client journey, branded portal, member training included.',
    ctaLabel: 'Book Discovery Call',
    ctaPath: '/contact',
    megaMenu: {
      discover: [
        { label: 'About', href: '/about', description: 'Why Tax Prep Pro exists' },
        { label: 'Contact', href: '/contact', description: 'Book a discovery call' },
      ],
      explore: [
        { label: 'Features', href: '/features' },
        { label: 'How It Works', href: '/how-it-works' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Reviews', href: '/reviews' },
      ],
      toolsExtras: [
        { label: 'Tax Monitor Pro', href: 'https://taxmonitor.pro' },
        { label: 'Bundle (TPP + TMP)', href: '/pricing#bundle' },
      ],
      ctaText: 'Productize your bureau in 30 days. Book a Discovery Call.',
      ctaMagnetLabel: 'Book Discovery Call',
      ctaMagnetPath: '/contact',
    },
    footerTagline: 'For Service Bureaus & Tax Pros',
    footerResources: [
      { label: 'Tax Monitor Pro', href: 'https://taxmonitor.pro', external: true },
      { label: 'Virtual Launch Pro', href: 'https://virtuallaunch.pro', external: true },
    ],
    footerLegal: [
      { label: 'Privacy', href: '/legal/privacy' },
      { label: 'Terms', href: '/legal/terms' },
      { label: 'Refund', href: '/legal/refund' },
    ],
  },
}
