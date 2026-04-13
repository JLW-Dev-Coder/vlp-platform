import type { MetadataRoute } from 'next'

export function generateRobots(domain: string): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/app/', '/api/', '/sign-in', '/success'],
      },
    ],
    sitemap: `https://${domain}/sitemap.xml`,
  }
}
