import type { PlatformConfig, ReviewConfig } from '@vlp/member-ui'

// Tax Prep Pro — TPP / app #10
// SD-led marketing app: members live in SuiteDash, not Next.js. Bookings
// (Discovery + Support) flow through Cal.com event types per
// canonical-cal-events.md §3 — TPP adopted the hybrid Cal/SD pattern on
// 2026-05-09 (see §7.4). The SuiteDash workspace remains the post-conversion
// home for clients; only the booking surface is Cal.com.
export const tppConfig: PlatformConfig = {
  brandName: 'Tax Prep Pro',
  brandAbbrev: 'TPP',
  brandColor: '#E91E63',
  themeMode: 'light',
  brandSubtitle: 'For Service Bureaus & Tax Pros',
  logoText: 'TPP',
  apiBaseUrl: 'https://api.virtuallaunch.pro',

  // Cal.com event types — see canonical-cal-events.md §3 for the full registry.
  calBookingNamespace: 'tpvlp-support',
  calBookingSlug: 'tax-monitor-pro/tpvlp-support',
  calIntroNamespace: 'tpvlp-intro',
  calIntroSlug: 'tax-monitor-pro/tpvlp-intro',

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
    phone: '619-800-5457',
    supportEmail: 'outreach@virtuallaunch.pro',
  },

  marketing: {
    tagline: 'For service bureaus & tax pros',
    primaryNav: [
      { label: 'About', href: '/about' },
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'How It Works', href: '/how-it-works' },
      { label: 'Reviews', href: '/reviews' },
    ],
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

// Adapter for the shared ReviewDisplayPage / ReviewSubmitPage components.
// ReviewConfig is a distinct shape from PlatformConfig: `apiBase` (not `apiBaseUrl`),
// and `platform` is the lowercase Worker API key (not the brand abbrev). Derived
// from tppConfig where fields overlap so apiBaseUrl/brand changes propagate.
export const tppReviewConfig: ReviewConfig = {
  platform: 'taxprep',
  platformName: tppConfig.brandName,
  themeColor: tppConfig.brandColor,
  apiBase: tppConfig.apiBaseUrl,
  formTypes: ['review', 'case_study', 'testimonial'],
  themeMode: tppConfig.themeMode,
}
