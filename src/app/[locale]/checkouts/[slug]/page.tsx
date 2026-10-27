import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProductsForLocale, isStorefrontProduct, resolveStorefrontProduct } from '@/config/products';
import { getCountryConfig } from '@/config/countries';
import { ProductLanding } from '@/components/store/ProductLanding';
import { ClientRedirect } from '@/components/store/ClientRedirect';
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
  if (!isStorefrontProduct(product)) {
    return { title: product.name, robots: { index: false, follow: true } };
  }

  const availableLocales = await getProductLocales(product.slug);
  const title = product.seoTitle || `${product.name} | DERMOTIN`;
  const description = product.seoDescription || product.shortDescription;
  const ogImage = getProductOgImage(product);
  // Alternative slugs (A/B landing variants) canonicalize to the primary slug
  // so they don't compete in search results.
  // Checkout/landing pages render the same product content as the canonical PDP.
  // Keep funnels available for ads, but consolidate search signals on one URL.
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

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { locale, slug } = await params;

  // Skriveni proizvodi (npr. BIOROID pojedinačno) preusmeravaju na zamenski set,
  // uz očuvan query string iz oglasa.
  const resolved = await resolveStorefrontProduct(slug, locale);
  if (resolved.kind === 'missing') {
    notFound();
  }
  if (resolved.kind === 'redirect') {
    return <ClientRedirect to={`/${locale}/checkouts/${resolved.slug}`} />;
  }
  const product = resolved.product;
  const countryConfig = getCountryConfig(locale);

  // Stari funnel lander (AdvancedLandingPage) je penzionisan — checkout URL-ovi
  // (na koje pokazuju aktivne reklame) služe novu product stranicu sa korpom.
  return (
    <>
      <CountryMismatchBanner />
      <ProductLanding product={product} countryConfig={countryConfig} locale={locale} />
    </>
  );
}

export async function generateStaticParams() {
  const locales = ['rs', 'ba', 'me'];
  const params: Array<{ locale: string; slug: string }> = [];

  for (const locale of locales) {
    const products = await getProductsForLocale(locale);
    for (const product of Object.values(products)) {
      if (!product.availableCountries.includes(locale) || product.salesChannel) continue;
      for (const slug of [product.slug, ...product.alternativeSlugs]) {
        params.push({ locale, slug });
      }
    }
  }

  return params;
}
