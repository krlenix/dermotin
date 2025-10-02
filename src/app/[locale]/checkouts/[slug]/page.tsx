import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/config/products';
import { getCountryConfig } from '@/config/countries';
import { AdvancedLandingPage } from '@/components/AdvancedLandingPage';

interface CheckoutPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
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

  return (
    <AdvancedLandingPage 
      product={product} 
      countryConfig={countryConfig}
      slug={slug}
    />
  );
}

export async function generateStaticParams() {
  // This would typically come from your product database
  const slugs = ['fungel', 'fungel-promo', 'antifungal-gel', 'gljivice-stopala', 'biomelis', 'biowart', 'bioroid', 'fungomax'];
  const locales = ['rs', 'ba', 'hr'];
  
  const params = [];
  for (const locale of locales) {
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }
  
  return params;
}
