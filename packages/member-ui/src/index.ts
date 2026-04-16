// UI Components
export { AppShell, useAppShell } from './components/AppShell'
export { MemberSidebar } from './components/MemberSidebar'
export { MemberTopbar } from './components/MemberTopbar'
export { KPICard } from './components/KPICard'
export { HeroCard } from './components/HeroCard'
export { ContentCard } from './components/ContentCard'
export { DataTable } from './components/DataTable'
export { FullCalendar } from './components/FullCalendar'

// Marketing Components
export { MarketingHeader } from './components/marketing/MarketingHeader'
export type { MarketingHeaderProps } from './components/marketing/MarketingHeader'

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
