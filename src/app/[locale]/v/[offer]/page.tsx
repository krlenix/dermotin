import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProduct } from '@/config/products';
import { getCountryConfig } from '@/config/countries';
import { getViberOffer, VIBER_OFFERS } from '@/config/viber-offers';
import { ViberLanding } from '@/components/store/ViberLanding';

interface ViberPageProps {
  params: Promise<{ locale: string; offer: string }>;
}

export async function generateMetadata({ params }: ViberPageProps): Promise<Metadata> {
  const { locale, offer: slug } = await params;
  const offer = getViberOffer(locale, slug);
  return {
    title: offer ? { absolute: `${offer.headline} | DERMOTIN` } : 'DERMOTIN',
    description: offer?.subheadline,
    // Kampanjske stranice se ne indeksiraju i ne dele SEO signal sa izlogom
    robots: { index: false, follow: false },
  };
}

export function generateStaticParams() {
  return VIBER_OFFERS.map((offer) => ({ locale: offer.locale, offer: offer.slug }));
}

export default async function ViberOfferPage({ params }: ViberPageProps) {
  const { locale, offer: slug } = await params;
  const offer = getViberOffer(locale, slug);
  if (!offer) notFound();

  const product = await getProduct(offer.productId, locale);
  if (!product || !product.availableCountries.includes(locale)) notFound();

  return <ViberLanding offer={offer} product={product} countryConfig={getCountryConfig(locale)} locale={locale} />;
}
