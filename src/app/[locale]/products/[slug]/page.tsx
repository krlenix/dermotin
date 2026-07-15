import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProductsForLocale, getProductVariantsForCountry } from '@/config/products';
import { getCountryConfig } from '@/config/countries';
import { ClassicProductPage } from '@/components/shop/ClassicProductPage';
import { CountryMismatchBanner } from '@/components/features/CountryMismatchBanner';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  buildLanguageAlternates,
  getProductLocales,
  getProductOgImage,
  getSiteUrl,
  toAbsoluteUrl,
} from '@/lib/seo';
import type { Product } from '@/config/types';

interface ProductPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug, locale);

  if (!product) {
    return { title: 'DERMOTIN' };
  }

  const availableLocales = await getProductLocales(product.slug);
  const title = product.seoTitle || `${product.name} | DERMOTIN`;
  const description = product.seoDescription || product.shortDescription;
  const ogImage = getProductOgImage(product);
  // Canonical always points to the primary slug so alternative slugs
  // (A/B landing variants) don't create duplicate content.
  const canonical = `${getSiteUrl()}/${locale}/products/${product.slug}`;

  return {
    // seoTitle already contains the brand suffix — bypass the layout template
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(
        availableLocales,
        (l) => `/${l}/products/${product.slug}`
      ),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 1200, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export async function generateStaticParams() {
  const locales = ['rs', 'ba', 'me'];
  const params: Array<{ locale: string; slug: string }> = [];

  for (const locale of locales) {
    const products = await getProductsForLocale(locale);
    for (const product of Object.values(products)) {
      if (product.availableCountries.includes(locale)) {
        params.push({ locale, slug: product.slug });
      }
    }
  }

  return params;
}

function buildProductJsonLd(product: Product, locale: string, currency: string) {
  const url = `${getSiteUrl()}/${locale}/products/${product.slug}`;
  const variants = getProductVariantsForCountry(product, locale);
  const prices = variants.map((v) => v.discountPrice ?? v.price);
  const testimonials = product.testimonials || [];

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.seoDescription || product.description,
    sku: product.variants[0]?.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: 'DERMOTIN',
    },
    image: [
      getProductOgImage(product),
      ...[product.images.main, ...product.images.gallery].map(toAbsoluteUrl),
    ],
    url,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: currency,
      lowPrice: Math.min(...prices).toFixed(2),
      highPrice: Math.max(...prices).toFixed(2),
      offerCount: variants.length,
      availability: 'https://schema.org/InStock',
      url,
    },
  };

  if (testimonials.length > 0) {
    const avg =
      testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / testimonials.length;
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: avg.toFixed(1),
      reviewCount: testimonials.length,
      bestRating: 5,
      worstRating: 1,
    };
    jsonLd.review = testimonials.slice(0, 5).map((t) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: t.name },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: t.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: t.text,
    }));
  }

  return jsonLd;
}

function buildBreadcrumbJsonLd(product: Product, locale: string) {
  const base = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'DERMOTIN', item: `${base}/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Proizvodi', item: `${base}/${locale}/products` },
      { '@type': 'ListItem', position: 3, name: product.name, item: `${base}/${locale}/products/${product.slug}` },
    ],
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;

  const product = await getProductBySlug(slug, locale);
  if (!product) {
    notFound();
  }

  if (product.availableCountries && !product.availableCountries.includes(locale)) {
    notFound();
  }

  const countryConfig = getCountryConfig(locale);

  return (
    <>
      <JsonLd data={buildProductJsonLd(product, locale, countryConfig.currency)} />
      <JsonLd data={buildBreadcrumbJsonLd(product, locale)} />
      <CountryMismatchBanner />
      <ClassicProductPage product={product} countryConfig={countryConfig} locale={locale} />
    </>
  );
}
