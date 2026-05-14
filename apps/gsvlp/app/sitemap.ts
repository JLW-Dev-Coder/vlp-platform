import { generateSitemap } from '@vlp/member-ui'

export const dynamic = 'force-static'

export default function sitemap() {
  return generateSitemap('growthsetters.virtuallaunch.pro', [
    { path: '/', changeFrequency: 'weekly', priority: 1.0 },
  ])
}
