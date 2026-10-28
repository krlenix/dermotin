import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getCountryConfig } from '@/config/countries';
import { CartCheckoutPage } from '@/components/cart/CartCheckoutPage';

interface CheckoutRouteProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: CheckoutRouteProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'checkout' });

  return {
    // Šablon iz korenskog layout-a dodaje „ | DERMOTIN“
    title: t('page_title'),
    robots: { index: false },
  };
}

export function generateStaticParams() {
  return ['rs', 'ba', 'me'].map((locale) => ({ locale }));
}

export default async function CheckoutRoute({ params }: CheckoutRouteProps) {
  const { locale } = await params;
  const countryConfig = getCountryConfig(locale);

  return <CartCheckoutPage countryConfig={countryConfig} locale={locale} />;
}
