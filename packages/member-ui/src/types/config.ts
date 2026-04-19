export interface NavItem {
  label: string;
  href: string;
  icon: string; // lucide-react icon name
  children?: { label: string; href: string; icon?: string }[];
}

export interface NavSection {
  title: string; // e.g., "WORKSPACE", "EARNINGS", "SETTINGS"
  items: NavItem[];
}

export interface MegaMenuItem {
  label: string;
  href: string;
  description?: string; // only used by discover column
}

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface MarketingConfig {
  tagline: string;                    // e.g., "Launch systems for tax professionals"
  summary: string;                    // one-line platform description for footer brand column
  ctaLabel: string;                   // e.g., "Start Here" — no trailing arrow; MarketingHeader renders the ArrowRight icon
  ctaPath: string;                    // e.g., "/contact"
  megaMenu: {
    discover: MegaMenuItem[];         // 2-4 items, descriptions required
    explore: MegaMenuItem[];          // 2-5 items, descriptions optional
    toolsExtras: MegaMenuItem[];      // 2-4 items, descriptions optional
    ctaText: string;                  // hook text for CTA column
    ctaMagnetLabel: string;           // e.g., "See the Demo" — no trailing arrow; MarketingHeader renders the ArrowRight icon
    ctaMagnetPath: string;            // e.g., "/resources/guide"
  };
  footerResources: FooterLink[];      // footer col 3 — not used by header
  footerLegal: FooterLink[];          // footer col 4 — not used by header
  footerTagline?: string;             // e.g., "Calm launch systems"
  footerCopyright?: string;           // override default "© {year} {brandName}"
}

export interface BusinessAddress {
  line1: string                    // "1175 Avocado Avenue"
  line2?: string                   // "Suite 101 PMB 1010"
  city: string                     // "El Cajon"
  state: string                    // "CA"
  zip: string                      // "92020"
}

export interface BusinessInfo {
  legalEntity: string              // "Lenore, Inc."
  address: BusinessAddress
  phone?: string                   // "619-800-5457"
  supportEmail: string             // "outreach@virtuallaunch.pro"
}

export interface PlatformConfig {
  brandName: string;           // e.g., "Transcript Tax Monitor"
  brandAbbrev: string;         // e.g., "TTMP"
  brandColor: string;          // e.g., "#14b8a6"
  brandSubtitle: string;       // e.g., "Pro Dashboard"
  logoText: string;            // e.g., "TT" (displayed in sidebar logo)
  navSections: NavSection[];
  routes: {
    home: string;              // marketing site home
    signIn: string;
    signOut: string;
    dashboard: string;
    account: string;
    profile: string;
    support: string;
  };
  apiBaseUrl: string;          // e.g., "https://api.taxmonitor.pro"
  calcomReferralLink?: string;
  // Cal.com event-type bindings (see canonical-cal-events.md)
  calBookingNamespace: string;
  calBookingSlug: string;
  calIntroNamespace: string;
  calIntroSlug: string;
  calDiscoveryNamespace?: string;
  calDiscoverySlug?: string;
  calOnboardingNamespace?: string;
  calOnboardingSlug?: string;
  businessInfo?: BusinessInfo;
  cookiePrefsStorageKey?: string;      // e.g., "vlp_cookie_prefs_v1" — defaults to `${brandAbbrev.toLowerCase()}_cookie_prefs_v1`
  marketing?: MarketingConfig;
  chatbot?: ChatbotConfig;
  posthog?: PostHogAnalyticsConfig;
}

export interface PostHogAnalyticsConfig {
  apiKey: string;                  // PostHog project API key (public — ships in client bundle)
  apiHost?: string;                // e.g., "https://us.i.posthog.com" (US) or "https://eu.i.posthog.com"
  autocapture?: boolean;           // default true
  capturePageview?: boolean;       // default true (SPA pageviews via PostHogPageview)
  capturePageleave?: boolean;      // default true
  disabledInDev?: boolean;         // default false — set true to skip loading in development
}

export type ChatbotCtaAction =
  | { type: 'link'; href: string; external?: boolean }
  | { type: 'human-path' }
  | { type: 'cal-intro' }
  | { type: 'cal-discovery' }
  | { type: 'cal-booking' };

export interface ChatbotCta {
  label: string;
  action: ChatbotCtaAction;
}

export interface ChatbotQuestion {
  id: string;
  label: string;
  response: string[];     // [0] short ack, [1] body — staggered
  askBack?: string;
  primaryCta: ChatbotCta;
  secondaryCta?: ChatbotCta;
}

export interface ChatbotHumanPath {
  intro: string;
  bookCall: {
    label: string;
    description: string;
    calTarget: 'intro' | 'discovery' | 'booking';
  };
  sendMessage: {
    label: string;
    description: string;
  };
}

export interface ChatbotConfig {
  enabled: boolean;
  aiEnabled?: boolean;    // Phase 2 — falsy in v1; no free-text input renders
  nudge: { label: string; message: string };
  header: {
    avatarInitials: string;
    title: string;
    subtitle: string;
  };
  welcome: string;
  questions: ChatbotQuestion[];   // exactly 3 in v1
  emailFooterLabel: string;
  humanPath: ChatbotHumanPath;
  socialProof?: { text: string; href?: string };
}
