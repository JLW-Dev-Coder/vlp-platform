import { generateSitemap } from '@vlp/member-ui'

export const dynamic = 'force-static'

export default function sitemap() {
  return generateSitemap('taxavatar.virtuallaunch.pro', [
    { path: '/', changeFrequency: 'weekly', priority: 1.0 },
    { path: '/avatars', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/pricing', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.7 },
  ])
}
