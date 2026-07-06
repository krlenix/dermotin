import { Metadata } from 'next';
import { getCountryConfig } from '@/config/countries';
import { CartCheckoutPage } from '@/components/cart/CartCheckoutPage';

interface CheckoutRouteProps {
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  title: 'DERMOTIN | Checkout',
  robots: { index: false },
};

export function generateStaticParams() {
  return ['rs', 'ba', 'me'].map((locale) => ({ locale }));
}

export default async function CheckoutRoute({ params }: CheckoutRouteProps) {
  const { locale } = await params;
  const countryConfig = getCountryConfig(locale);

  return <CartCheckoutPage countryConfig={countryConfig} locale={locale} />;
}
