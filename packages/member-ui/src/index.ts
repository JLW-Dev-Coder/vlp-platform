// UI Components
export { AppShell, useAppShell } from './components/AppShell'
export { MemberSidebar } from './components/MemberSidebar'
export { MemberTopbar } from './components/MemberTopbar'
export { KPICard } from './components/KPICard'
export { HeroCard } from './components/HeroCard'
export { ContentCard } from './components/ContentCard'
export { DataTable } from './components/DataTable'
export { FullCalendar } from './components/FullCalendar'

// Types
export type { PlatformConfig, NavSection, NavItem } from './types/config'
export type { CalendarEvent } from './components/FullCalendar'

// SEO utilities
export { generateSitemap } from './seo/sitemap'
export type { SitemapPage } from './seo/sitemap'
export { generateRobots } from './seo/robots'
export { BusinessJsonLd } from './seo/json-ld'
export type { BusinessJsonLdProps } from './seo/json-ld'
export { generatePageMeta } from './seo/metadata'
export type { PageMetaProps } from './seo/metadata'
