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
          '/capi-test',
          '/test-marketing',
          '/test-country-modal',
          '/geolocation-test',
          '/geolocation-demo',
          '/new-template-example',
          '/docs/',
          '/*/thank-you',
          '/*/checkout$',
          '/*/v2/',
          '/*/new-landing',
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
