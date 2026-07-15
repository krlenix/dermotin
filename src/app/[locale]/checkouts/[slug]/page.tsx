import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProductsForLocale } from '@/config/products';
import { getCountryConfig } from '@/config/countries';
import { ClassicProductPage } from '@/components/shop/ClassicProductPage';
import { CountryMismatchBanner } from '@/components/features/CountryMismatchBanner';
import {
  buildLanguageAlternates,
  getProductLocales,
  getProductOgImage,
  getSiteUrl,
} from '@/lib/seo';

interface CheckoutPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CheckoutPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug, locale);

  if (!product) {
    return { title: 'DERMOTIN' };
  }

  const availableLocales = await getProductLocales(product.slug);
  const title = product.seoTitle || `${product.name} | DERMOTIN`;
  const description = product.seoDescription || product.shortDescription;
  const ogImage = getProductOgImage(product);
  // Alternative slugs (A/B landing variants) canonicalize to the primary slug
  // so they don't compete in search results.
  const canonical = `${getSiteUrl()}/${locale}/checkouts/${product.slug}`;

  return {
    // seoTitle already contains the brand suffix — bypass the layout template
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(
        availableLocales,
        (l) => `/${l}/checkouts/${product.slug}`
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

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { locale, slug } = await params;

  // Get product by slug
  const product = await getProductBySlug(slug, locale);
  if (!product) {
    notFound();
  }

  // Get country configuration
  const countryConfig = getCountryConfig(locale);

  // Check if product is available in this country
  if (product.availableCountries && !product.availableCountries.includes(locale)) {
    notFound();
  }

  // Stari funnel lander (AdvancedLandingPage) je penzionisan — checkout URL-ovi
  // (na koje pokazuju aktivne reklame) služe novu product stranicu sa korpom.
  return (
    <>
      <CountryMismatchBanner />
      <ClassicProductPage product={product} countryConfig={countryConfig} locale={locale} />
    </>
  );
}

export async function generateStaticParams() {
  const locales = ['rs', 'ba', 'me'];
  const params: Array<{ locale: string; slug: string }> = [];

  for (const locale of locales) {
    const products = await getProductsForLocale(locale);
    for (const product of Object.values(products)) {
      if (!product.availableCountries.includes(locale)) continue;
      for (const slug of [product.slug, ...product.alternativeSlugs]) {
        params.push({ locale, slug });
      }
    }
  }

  return params;
}
