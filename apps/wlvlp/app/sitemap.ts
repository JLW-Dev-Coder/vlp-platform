import { MetadataRoute } from 'next';
import { TEMPLATES } from '@/lib/templates';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://websitelotto.virtuallaunch.pro';

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date() },
    { url: `${base}/scratch`, lastModified: new Date() },
    { url: `${base}/affiliate`, lastModified: new Date() },
    { url: `${base}/sign-in`, lastModified: new Date() },
    { url: `${base}/support`, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/features`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/how-it-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/reviews`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/launch`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  ];

  const templatePages: MetadataRoute.Sitemap = TEMPLATES.map(t => ({
    url: `${base}/sites/${t.slug}`,
    lastModified: new Date(),
  }));

  return [...staticPages, ...templatePages];
}
