import { generateSitemap } from '@vlp/member-ui'
import type { MetadataRoute } from 'next'

const DOMAIN = 'transcript.taxmonitor.pro'

export default function sitemap(): MetadataRoute.Sitemap {
  return generateSitemap(DOMAIN, [
    { path: '/', changeFrequency: 'weekly', priority: 1.0 },
    { path: '/about/', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/features/', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/pricing/', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/product/', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/affiliate/', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/contact/', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/demo/', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/resources/', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/resources/help-center/', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/resources/irs-phone-numbers/', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/resources/transcript-codes/', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/magnets/guide/', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/magnets/section-7216/', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/legal/privacy/', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/legal/terms/', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/legal/refund/', changeFrequency: 'yearly', priority: 0.3 },
  ])
}
