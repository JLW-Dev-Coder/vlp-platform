import { generateSitemap } from '@vlp/member-ui'

export const dynamic = 'force-static'

export default function sitemap() {
  return generateSitemap('taxmonitor.pro', [
    { path: '/', changeFrequency: 'weekly', priority: 1.0 },
    { path: '/pricing', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/features', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/directory', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/calendar', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/support', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/tools/irs-payment-calculator', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/resources/transcript-central', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/legal/privacy', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/legal/terms', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/legal/refund', changeFrequency: 'yearly', priority: 0.3 },
  ])
}
