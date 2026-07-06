import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProductsForLocale } from '@/config/products';
import { getCountryConfig } from '@/config/countries';
import { ClassicProductPage } from '@/components/shop/ClassicProductPage';
import { CountryMismatchBanner } from '@/components/features/CountryMismatchBanner';

interface ProductPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug, locale);

  if (!product) {
    return { title: 'DERMOTIN' };
  }

  return {
    title: product.seoTitle || `${product.name} | DERMOTIN`,
    description: product.seoDescription || product.shortDescription,
    openGraph: {
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.shortDescription,
      images: [product.images.main],
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
      <CountryMismatchBanner />
      <ClassicProductPage product={product} countryConfig={countryConfig} locale={locale} />
    </>
  );
}
