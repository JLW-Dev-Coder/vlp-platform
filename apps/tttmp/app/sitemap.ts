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
    { path: '/pricing', changeFrequency: 'monthly', priority: 0.8 },
    ...learnPages,
    { path: '/contact', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/legal/privacy', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/legal/terms', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/legal/refund', changeFrequency: 'yearly', priority: 0.3 },
  ])
}
