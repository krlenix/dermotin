import { getProductBySlug, getProductsForCountry } from '@/config/products';
import { getCountryConfig } from '@/config/countries';
import { ClassicProductPage } from '@/components/shop/ClassicProductPage';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const countryConfig = getCountryConfig('rs'); // Only Serbian now
  const product = await getProductBySlug(slug, 'rs');

  if (!product) {
    notFound();
  }

  // Stari funnel lander (AdvancedLandingPage) je penzionisan — legacy checkout
  // URL-ovi služe novu product stranicu sa korpom.
  return <ClassicProductPage product={product} countryConfig={countryConfig} locale="rs" />;
}

export async function generateStaticParams() {
  const products = await getProductsForCountry('rs', 'rs');
  return products.map((product) => ({
    slug: product.slug,
  }));
}
