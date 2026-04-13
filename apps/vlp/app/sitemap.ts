import { generateSitemap } from '@vlp/member-ui'

export default function sitemap() {
  return generateSitemap('virtuallaunch.pro', [
    { path: '/', changeFrequency: 'weekly', priority: 1.0 },
    { path: '/pricing', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/features', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/features/booking', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/features/public-profile', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/how-it-works', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/blog', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/help', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/legal/privacy', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/legal/terms', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/legal/refund', changeFrequency: 'yearly', priority: 0.3 },
  ])
}
