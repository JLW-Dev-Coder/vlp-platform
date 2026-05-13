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

  posthog: {
    apiKey: 'phc_o5nTrNkxc37W2G9PXFL8peXMjWzdjo5d2HSjE5XzggkY',
    apiHost: 'https://us.i.posthog.com',
    autocapture: true,
    capturePageview: true,
    capturePageleave: true,
    disabledInDev: false,
  },

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
  chatbot: {
    enabled: true,
    aiEnabled: false,
    nudge: {
      label: 'Tax Prep Pro',
      message: 'See the full client journey for your firm',
    },
    header: {
      avatarInitials: 'TPP',
      title: 'Tax Prep Pro',
      subtitle: 'Turnkey tax prep operations',
    },
    welcome: "Hi! Interested in a complete client journey for your tax prep practice? Here's what to know.",
    questions: [
      {
        id: 'q1',
        label: 'What does Tax Prep Pro include?',
        response: [
          "A branded client portal with the full 8-phase journey — Identify, Intake, Agreement, Payment, Prep, E-Sign 8879, File, Deliver. Your clients see your brand. Your staff follows a consistent process. Setup is handled for you.",
        ],
        primaryCta: { label: 'See features →', action: { type: 'link', href: '/features' } },
        secondaryCta: { label: 'Talk to a human', action: { type: 'human-path' } },
      },
      {
        id: 'q2',
        label: 'How is it different from other tax software?',
        response: [
          "Tax Prep Pro isn't tax calculation software — it's the operational layer around it. Client intake, document collection, e-signatures, payment, and delivery. It works alongside whatever prep software you already use. Think of it as the client experience wrapper.",
        ],
        primaryCta: { label: 'See how it works →', action: { type: 'link', href: '/how-it-works' } },
        secondaryCta: { label: 'Talk to a human', action: { type: 'human-path' } },
      },
      {
        id: 'q3',
        label: 'What does setup cost?',
        response: [
          "Setup is $5,000 one-time for your branded workspace. Ongoing support is $497/mo or $150/hr. If you want member access for staff, that's $79/mo per active member. Book a discovery call to see if it fits your firm.",
        ],
        primaryCta: { label: 'Book an intro call →', action: { type: 'cal-intro' } },
        secondaryCta: { label: 'See pricing', action: { type: 'link', href: '/pricing' } },
      },
    ],
    emailFooterLabel: 'Or send us a message',
    humanPath: {
      intro: 'Real humans, fast replies. Pick your preferred way to connect.',
      bookCall: {
        label: 'Book a 10-min intro call',
        description: 'See available times on our calendar. No-pressure walkthrough, ask anything.',
        calTarget: 'intro',
      },
      sendMessage: {
        label: 'Send a message',
        description: 'Tell us about your practice. One-business-day reply, always from a real person.',
      },
    },
  },
  exitIntent: {
    enabled: true,
    headline: "Wait — this one's on us.",
    subheadline: 'Free: Tax Prep Workflow Assessment',
    description: "We'll map your current client journey against our 8-phase system and show you where the gaps are.",
    freebieType: 'workflow_assessment',
    qualifierQuestion: 'How many returns does your firm prepare annually?',
    qualifierOptions: ['1-100', '100-500', '500+'],
    ctaLabel: 'Send It to Me',
    successMessage: "Check your inbox! It's on the way.",
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
