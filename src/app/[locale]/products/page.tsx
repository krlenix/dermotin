import { Metadata } from 'next';
import { getProductsForCountry } from '@/config/products';
import { getCountryConfig } from '@/config/countries';
import { ProductsPage } from '@/components/shop/ProductsPage';
import { CountryMismatchBanner } from '@/components/features/CountryMismatchBanner';

interface ProductsRouteProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ProductsRouteProps): Promise<Metadata> {
  await params;
  return {
    title: 'DERMOTIN | Proizvodi',
    description: 'Prirodni kozmetički preparati i dijetetski suplementi - DERMOTIN',
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
      <CountryMismatchBanner />
      <ProductsPage products={products} countryConfig={countryConfig} locale={locale} />
    </>
  );
}
