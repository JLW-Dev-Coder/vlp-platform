import type { PlatformConfig } from '@vlp/member-ui'

export const tavlpConfig: PlatformConfig = {
  brandName: 'Tax Avatar Pro',
  brandAbbrev: 'TAP',
  brandColor: '#ec4899',
  brandSubtitle: 'AI YouTube Channel for Tax Pros',
  logoText: 'TAP',
  apiBaseUrl: 'https://api.virtuallaunch.pro',
  posthog: {
    apiKey: 'phc_o5nTrNkxc37W2G9PXFL8peXMjWzdjo5d2HSjE5XzggkY',
    apiHost: 'https://us.i.posthog.com',
    autocapture: true,
    capturePageview: true,
    capturePageleave: true,
    disabledInDev: false,
  },
  calBookingNamespace: 'tavlp-support',
  calBookingSlug: 'tax-monitor-pro/tavlp-support',
  calIntroNamespace: 'tax-avatar-virtual-launch-pro',
  calIntroSlug: 'tax-monitor-pro/tax-avatar-virtual-launch-pro',
  navSections: [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Overview', href: '/dashboard', icon: 'LayoutDashboard' },
        { label: 'Scripts', href: '/dashboard/scripts', icon: 'FileText' },
        { label: 'Videos', href: '/dashboard/videos', icon: 'Video' },
        { label: 'Channel', href: '/dashboard/channel', icon: 'Youtube' },
        { label: 'Settings', href: '/dashboard/settings', icon: 'Settings' },
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
    tagline: 'AI YouTube channel for tax pros',
    summary: 'Tax Avatar Pro is a fully-managed AI YouTube channel for tax professionals. We pick the avatar, write the scripts, publish the episodes, and grow your audience.',
    ctaLabel: 'Get Started',
    ctaPath: '/contact',
    megaMenu: {
      discover: [
        { label: 'Avatars', href: '/avatars', description: 'Choose your AI host' },
        { label: 'Contact', href: '/contact', description: 'Talk to our team' },
      ],
      explore: [
        { label: 'Pricing', href: '/pricing' },
        { label: 'Help Center', href: '/help' },
      ],
      toolsExtras: [
        { label: 'TaxClaim Pro', href: 'https://taxclaim.virtuallaunch.pro' },
        { label: 'Tax Transcript AI', href: 'https://transcript.taxmonitor.pro' },
      ],
      ctaText: 'A managed AI YouTube channel that builds authority for your tax practice — without you spending a minute on camera.',
      ctaMagnetLabel: 'See Avatars',
      ctaMagnetPath: '/avatars',
    },
    footerTagline: 'AI YouTube channel for tax pros',
    footerResources: [
      { label: 'Help Center', href: '/help' },
      { label: 'TaxClaim Pro', href: 'https://taxclaim.virtuallaunch.pro', external: true },
      { label: 'Tax Transcript AI', href: 'https://transcript.taxmonitor.pro', external: true },
      { label: 'Affiliate Program', href: 'https://virtuallaunch.pro/affiliate', external: true },
    ],
    footerLegal: [
      { label: 'Privacy', href: '/legal/privacy' },
      { label: 'Terms', href: '/legal/terms' },
    ],
  },
  chatbot: {
    enabled: true,
    aiEnabled: false,
    nudge: {
      label: 'Tax Avatar Pro',
      message: 'Get an AI avatar for your tax practice',
    },
    header: {
      avatarInitials: 'TAP',
      title: 'Tax Avatar Pro',
      subtitle: 'AI avatars for tax professionals',
    },
    welcome: 'Hi! Want to learn how an AI avatar can work for your practice? Pick a question below.',
    questions: [
      {
        id: 'q1',
        label: 'What is Tax Avatar Pro?',
        response: [
          "Tax Avatar Pro gives you an AI-powered avatar that hosts your YouTube channel, appears on your landing pages, and guides your prospects through your services. Your avatar, your brand, your leads — fully automated content creation for your practice.",
        ],
        primaryCta: { label: 'Browse avatars →', action: { type: 'link', href: '/avatars' } },
        secondaryCta: { label: 'Talk to a human', action: { type: 'human-path' } },
      },
      {
        id: 'q2',
        label: 'How does the avatar work?',
        response: [
          "Choose from our avatar library, customize the look and script, and we produce professional videos for your channel. The avatar appears on your landing pages to greet visitors and guide them to your services. All content is branded to your practice.",
        ],
        primaryCta: { label: 'Browse avatars →', action: { type: 'link', href: '/avatars' } },
        secondaryCta: { label: 'Talk to a human', action: { type: 'human-path' } },
      },
      {
        id: 'q3',
        label: 'What does it cost?',
        response: [
          "Plans start at $49/mo for weekly video publishing. See our pricing page for Launch, Growth, and Pro tiers.",
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
    subheadline: 'Free: AI Avatar Sample Clip',
    description: "See a 30-second AI avatar say your firm's name. We'll generate a personalized demo clip and send it to your inbox.",
    freebieType: 'avatar_sample',
    qualifierQuestion: 'Do you have a YouTube channel?',
    qualifierOptions: ['Yes', 'No', 'Planning one'],
    ctaLabel: 'Send It to Me',
    successMessage: "Check your inbox! It's on the way.",
  },
}
