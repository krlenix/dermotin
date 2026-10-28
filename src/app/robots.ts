import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/*/thank-you',
          '/*/checkout$',
        ],
      },
      {
        userAgent: ['OAI-SearchBot', 'ChatGPT-User', 'GPTBot', 'Google-Extended'],
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
