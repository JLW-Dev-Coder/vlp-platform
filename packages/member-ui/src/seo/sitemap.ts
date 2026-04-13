import type { MetadataRoute } from 'next'

export interface SitemapPage {
  path: string
  changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  priority: number
  lastModified?: Date
}

export function generateSitemap(domain: string, pages: SitemapPage[]): MetadataRoute.Sitemap {
  return pages.map((page) => ({
    url: `https://${domain}${page.path}`,
    lastModified: page.lastModified || new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))
}
