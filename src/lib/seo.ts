import { COUNTRIES } from '@/config/countries';
import { getProductBySlug } from '@/config/locales';
import type { Product } from '@/config/types';

export const SITE_LOCALES = ['rs', 'ba', 'me'] as const;
export type SiteLocale = (typeof SITE_LOCALES)[number];

export const SITE_NAME = 'DERMOTIN';
export const DEFAULT_LOCALE: SiteLocale = 'rs';

/**
 * Canonical site origin (protocol + host, no trailing slash).
 * NEXT_PUBLIC_DOMAIN is stored without protocol, so normalize it.
 */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_DOMAIN ||
    'https://dermotin.com';
  const withProtocol = raw.startsWith('http') ? raw : `https://${raw}`;
  return withProtocol.replace(/\/$/, '');
}

/** hreflang code for a locale, e.g. rs -> sr-RS */
export function getHreflang(locale: string): string {
  return COUNTRIES[locale]?.locale || 'sr-RS';
}

/**
 * Build metadata.alternates.languages for a path that exists in the given locales.
 * `pathForLocale` receives a locale and returns the locale-prefixed path
 * (e.g. `/rs/products/fungel`). x-default points to the default locale.
 */
export function buildLanguageAlternates(
  locales: readonly string[],
  pathForLocale: (locale: string) => string
): Record<string, string> {
  const base = getSiteUrl();
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[getHreflang(locale)] = `${base}${pathForLocale(locale)}`;
  }
  const defaultLocale = locales.includes(DEFAULT_LOCALE) ? DEFAULT_LOCALE : locales[0];
  if (defaultLocale) {
    languages['x-default'] = `${base}${pathForLocale(defaultLocale)}`;
  }
  return languages;
}

/**
 * Locales in which a product (by slug) exists and is available.
 * Mirrors the notFound() logic of the product/checkout pages.
 */
export async function getProductLocales(slug: string): Promise<SiteLocale[]> {
  const result: SiteLocale[] = [];
  for (const locale of SITE_LOCALES) {
    const product = await getProductBySlug(slug, locale);
    if (product && product.availableCountries.includes(locale)) {
      result.push(locale);
    }
  }
  return result;
}

export function toAbsoluteUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${getSiteUrl()}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Product image used in feeds and structured data. */
export function getProductOgImage(product: Product): string {
  return toAbsoluteUrl(`/images/meta-catalog/${product.slug}.jpg`);
}
