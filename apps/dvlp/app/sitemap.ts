import { generateSitemap } from '@vlp/member-ui'

export const dynamic = 'force-static'

export default function sitemap() {
  return generateSitemap('developers.virtuallaunch.pro', [
    { path: '/', changeFrequency: 'weekly', priority: 1.0 },
    { path: '/developers', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/find-developers', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/onboarding', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/pricing', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/reviews', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/support', changeFrequency: 'monthly', priority: 0.5 },
  ])
}
