import { generateSitemap } from '@vlp/member-ui'

export const dynamic = 'force-static'

export default function sitemap() {
  return generateSitemap('taxprep.virtuallaunch.pro', [
    { path: '/', changeFrequency: 'weekly', priority: 1.0 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/features', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/how-it-works', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/pricing', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/reviews', changeFrequency: 'monthly', priority: 0.5 },
  ])
}
