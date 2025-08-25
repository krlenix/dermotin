import { getCountryConfig } from '@/config/countries';
import { ThankYouPage } from '@/components/ThankYouPage';

interface ThankYouPageProps {
  params: Promise<{ locale: string }>;
}

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
