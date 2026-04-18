import { generateSitemap } from '@vlp/member-ui'

export const dynamic = 'force-static'

export default function sitemap() {
  return generateSitemap('games.virtuallaunch.pro', [
    { path: '/', changeFrequency: 'weekly', priority: 1.0 },
    { path: '/games', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/onboarding', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/reviews', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/support', changeFrequency: 'monthly', priority: 0.5 },
  ])
}
