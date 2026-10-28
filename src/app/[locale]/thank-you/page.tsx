import type { Metadata } from 'next';
import { getCountryConfig } from '@/config/countries';
import { ThankYouPage } from '@/components/ThankYouPage';

interface ThankYouPageProps {
  params: Promise<{ locale: string }>;
}

// Lična stranica posle porudžbine (podaci iz sessionStorage) — ne indeksira se i linkovi se ne prate
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default async function ThankYou({ params }: ThankYouPageProps) {
  const { locale } = await params;

  // Get country configuration
  const countryConfig = getCountryConfig(locale);

  return (
    <ThankYouPage
      countryConfig={countryConfig}
      locale={locale}
    />
  );
}
