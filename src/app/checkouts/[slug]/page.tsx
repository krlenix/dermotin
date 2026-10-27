import { getProductsForCountry, resolveStorefrontProduct } from '@/config/products';
import { getCountryConfig } from '@/config/countries';
import { ProductLanding } from '@/components/store/ProductLanding';
import { ClientRedirect } from '@/components/store/ClientRedirect';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const countryConfig = getCountryConfig('rs'); // Only Serbian now
  const resolved = await resolveStorefrontProduct(slug, 'rs');
  if (resolved.kind === 'missing') {
    notFound();
  }
  if (resolved.kind === 'redirect') {
    return <ClientRedirect to={`/rs/checkouts/${resolved.slug}`} />;
  }
  const product = resolved.product;

  // Stari funnel lander (AdvancedLandingPage) je penzionisan — legacy checkout
  // URL-ovi služe novu product stranicu sa korpom.
  return <ProductLanding product={product} countryConfig={countryConfig} locale="rs" />;
}

export async function generateStaticParams() {
  const products = await getProductsForCountry('rs', 'rs');
  return products.map((product) => ({
    slug: product.slug,
  }));
}
