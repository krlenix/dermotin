import type { MetadataRoute } from 'next';
import { getProductsForLocale } from '@/config/locales';
import {
  SITE_LOCALES,
  buildLanguageAlternates,
  getContentLastModified,
  getSiteUrl,
} from '@/lib/seo';

const BASE = getSiteUrl();
const LAST_MODIFIED = getContentLastModified();

function entry(
  path: string,
  locales: readonly string[],
  pathForLocale: (locale: string) => string,
  options: { priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' }
): MetadataRoute.Sitemap[number] {
  return {
    url: `${BASE}${path}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: options.changeFrequency,
    priority: options.priority,
    alternates: {
      languages: buildLanguageAlternates(locales, pathForLocale),
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages present in every locale
  for (const locale of SITE_LOCALES) {
    entries.push(
      entry(`/${locale}`, SITE_LOCALES, (l) => `/${l}`, {
        priority: 1,
        changeFrequency: 'daily',
      }),
      entry(`/${locale}/products`, SITE_LOCALES, (l) => `/${l}/products`, {
        priority: 0.9,
        changeFrequency: 'daily',
      }),
      entry(`/${locale}/contact`, SITE_LOCALES, (l) => `/${l}/contact`, {
        priority: 0.4,
        changeFrequency: 'monthly',
      })
    );
  }

  // Product detail pages (canonical slugs only). Checkout/funnel routes serve
  // the same content and canonicalize here, so they must not duplicate sitemap entries.
  // Compute per-slug locale availability first so hreflang groups are complete.
  const availability = new Map<string, string[]>();
  for (const locale of SITE_LOCALES) {
    const products = await getProductsForLocale(locale);
    for (const product of Object.values(products)) {
      if (!product.availableCountries.includes(locale)) continue;
      const locales = availability.get(product.slug) || [];
      locales.push(locale);
      availability.set(product.slug, locales);
    }
  }

  for (const [slug, locales] of availability) {
    for (const locale of locales) {
      entries.push(
        entry(`/${locale}/products/${slug}`, locales, (l) => `/${l}/products/${slug}`, {
          priority: 0.8,
          changeFrequency: 'weekly',
        })
      );
    }
  }

  return entries;
}
