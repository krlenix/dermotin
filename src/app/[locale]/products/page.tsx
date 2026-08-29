import { Metadata } from 'next';
import { getProductsForCountry } from '@/config/products';
import { getCountryConfig } from '@/config/countries';
import { ProductsPage } from '@/components/shop/ProductsPage';
import { CountryMismatchBanner } from '@/components/features/CountryMismatchBanner';
import { JsonLd } from '@/components/seo/JsonLd';
import { SITE_LOCALES, buildLanguageAlternates, getSiteUrl } from '@/lib/seo';

interface ProductsRouteProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ProductsRouteProps): Promise<Metadata> {
  const { locale } = await params;
  const title = 'Svi proizvodi – prirodna nega kože i suplementi';
  const description =
    'Pregledajte kompletnu DERMOTIN ponudu: prirodni kozmetički preparati za negu kože i dijetetski suplementi. Plaćanje pouzećem, brza isporuka.';
  const canonical = `${getSiteUrl()}/${locale}/products`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(SITE_LOCALES, (l) => `/${l}/products`),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
    },
  };
}

export function generateStaticParams() {
  return ['rs', 'ba', 'me'].map((locale) => ({ locale }));
}

export default async function ProductsRoute({ params }: ProductsRouteProps) {
  const { locale } = await params;

  const products = await getProductsForCountry(locale, locale);
  const countryConfig = getCountryConfig(locale);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'DERMOTIN proizvodi',
          numberOfItems: products.length,
          itemListElement: products.map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: product.name,
            url: `${getSiteUrl()}/${locale}/products/${product.slug}`,
          })),
        }}
      />
      <CountryMismatchBanner />
      <ProductsPage products={products} countryConfig={countryConfig} locale={locale} />
    </>
  );
}
