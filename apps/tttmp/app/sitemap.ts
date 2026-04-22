import { generateSitemap } from '@vlp/member-ui'
import { GAME_CATALOG } from '@/lib/vesperi-tree'

export const dynamic = 'force-static'

export default function sitemap() {
  const learnPages = GAME_CATALOG.map((g) => ({
    path: `/learn/${g.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return generateSitemap('taxtools.taxmonitor.pro', [
    { path: '/', changeFrequency: 'weekly', priority: 1.0 },
    { path: '/games', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/vesperi', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/learn', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/features', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/pricing', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/how-it-works', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/reviews', changeFrequency: 'weekly', priority: 0.7 },
    ...learnPages,
    { path: '/contact', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/legal/privacy', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/legal/terms', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/legal/refund', changeFrequency: 'yearly', priority: 0.3 },
  ])
}
