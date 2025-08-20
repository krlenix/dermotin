import { getProductBySlug, getProductsForCountry } from '@/config/products';
import { getCountryConfig } from '@/config/countries';
import { AdvancedLandingPage } from '@/components/AdvancedLandingPage';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const countryConfig = getCountryConfig('rs'); // Only Serbian now
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <AdvancedLandingPage 
      product={product} 
      countryConfig={countryConfig}
      slug={slug}
    />
  );
}

export async function generateStaticParams() {
  const products = getProductsForCountry('rs');
  return products.map((product) => ({
    slug: product.slug,
  }));
}
