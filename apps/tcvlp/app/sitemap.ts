import { generateSitemap } from '@vlp/member-ui'

export const dynamic = 'force-static'

export default function sitemap() {
  return generateSitemap('taxclaim.virtuallaunch.pro', [
    { path: '/', changeFrequency: 'weekly', priority: 1.0 },
    { path: '/gala', changeFrequency: 'weekly', priority: 0.95 },
    { path: '/kennedy', changeFrequency: 'weekly', priority: 0.95 },
    { path: '/demo', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/what-is-form-843', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/onboarding', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/support', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/affiliate', changeFrequency: 'monthly', priority: 0.5 },
  ])
}
