// UI Components
export { AppShell, useAppShell } from './components/AppShell'
export { AuthGate } from './components/AuthGate'
export { default as AdminGate } from './components/AdminGate'
export { createAccountContext } from './lib/createAccountContext'
export type {
  AccountProviderProps,
  AccountContextValue,
} from './lib/createAccountContext'
export { MemberSidebar } from './components/MemberSidebar'
export { MemberTopbar } from './components/MemberTopbar'
export { KPICard } from './components/KPICard'
export { HeroCard } from './components/HeroCard'
export { ContentCard } from './components/ContentCard'
export { DataTable } from './components/DataTable'
export { FullCalendar } from './components/FullCalendar'
export { StatusBadge } from './components/StatusBadge'
export { default as HelpCenter } from './components/HelpCenter'
export type { HelpCenterProps, HelpTopic } from './components/HelpCenter'

// Marketing Components
export { MarketingHeader } from './components/marketing/MarketingHeader'
export type { MarketingHeaderProps } from './components/marketing/MarketingHeader'
export { MarketingFooter } from './components/marketing/MarketingFooter'
export type { MarketingFooterProps } from './components/marketing/MarketingFooter'

// Cookie Components
export { CookieConsent } from './components/cookies/CookieConsent'
export type { CookieConsentProps } from './components/cookies/CookieConsent'
export { ManageCookiesLink } from './components/cookies/ManageCookiesLink'

// Analytics
export { applyAnalyticsConsent, setAnalyticsConfig, getPostHogClient } from './lib/analytics'
export type { AnalyticsConfig, PostHogAnalyticsConfig } from './lib/analytics'
export { PostHogPageview } from './components/analytics/PostHogPageview'

// Chatbot
export { LeadChatbot } from './components/chatbot/LeadChatbot'
export type { LeadChatbotProps } from './components/chatbot/LeadChatbot'

// Legal Components
export { LegalPageLayout } from './components/legal/LegalPageLayout'
export type { LegalPageLayoutProps } from './components/legal/LegalPageLayout'
export { LegalSection } from './components/legal/LegalSection'
export type { LegalSectionProps } from './components/legal/LegalSection'

// Review Components
export { ReviewSubmitPage } from './components/reviews/ReviewSubmitPage'
export { ReviewDisplayPage } from './components/reviews/ReviewDisplayPage'
export { ReviewCard } from './components/reviews/ReviewCard'

// Types
export type {
  PlatformConfig,
  NavSection,
  NavItem,
  MarketingConfig,
  MegaMenuItem,
  FooterLink,
  BusinessInfo,
  BusinessAddress,
  ChatbotConfig,
  ChatbotCta,
  ChatbotCtaAction,
  ChatbotQuestion,
  ChatbotHumanPath,
} from './types/config'
export type { ReviewConfig, ReviewCardData } from './types/review'
export type { ReviewCardProps } from './components/reviews/ReviewCard'
export type { CalendarEvent } from './components/FullCalendar'

// SEO utilities
export { generateSitemap } from './seo/sitemap'
export type { SitemapPage } from './seo/sitemap'
export { generateRobots } from './seo/robots'
export { BusinessJsonLd } from './seo/json-ld'
export type { BusinessJsonLdProps } from './seo/json-ld'
export { generatePageMeta } from './seo/metadata'
export type { PageMetaProps } from './seo/metadata'
