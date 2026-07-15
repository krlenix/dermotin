import { Metadata } from 'next';
import HomePageClient from '@/components/HomePageClient';
import { getCountryConfig } from '@/config/countries';
import { JsonLd } from '@/components/seo/JsonLd';
import { SITE_LOCALES, buildLanguageAlternates, getSiteUrl } from '@/lib/seo';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

const HOME_TITLES: Record<string, string> = {
  rs: 'DERMOTIN - Prirodni proizvodi za zdravu kožu | Srbija',
  ba: 'DERMOTIN - Prirodni proizvodi za zdravu kožu | Bosna i Hercegovina',
  me: 'DERMOTIN - Prirodni proizvodi za zdravu kožu | Crna Gora',
};

const HOME_DESCRIPTION =
  'DERMOTIN prirodna kozmetika i suplementi: nega kože sklone gljivicama, ekcemima, bradavicama i hemoroidima. Biljni ekstrakti i eterična ulja, bez parabena. Plaćanje pouzećem.';

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const canonical = `${getSiteUrl()}/${locale}`;
  const title = HOME_TITLES[locale] || HOME_TITLES.rs;

  return {
    title: { absolute: title },
    description: HOME_DESCRIPTION,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(SITE_LOCALES, (l) => `/${l}`),
    },
    openGraph: {
      title,
      description: HOME_DESCRIPTION,
      url: canonical,
      type: 'website',
      images: [{ url: '/images/main/hero-image.webp' }],
    },
  };
}

function buildOrganizationJsonLd(locale: string) {
  const base = getSiteUrl();
  const countryConfig = getCountryConfig(locale);

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DERMOTIN',
    url: base,
    logo: `${base}/images/main/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: countryConfig.company.email,
      telephone: countryConfig.company.phone,
      areaServed: countryConfig.code.toUpperCase(),
      availableLanguage: ['sr', 'bs'],
    },
  };
}

function buildWebSiteJsonLd(locale: string) {
  const base = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DERMOTIN',
    url: `${base}/${locale}`,
    inLanguage: getCountryConfig(locale).locale,
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  return (
    <>
      <JsonLd data={buildOrganizationJsonLd(locale)} />
      <JsonLd data={buildWebSiteJsonLd(locale)} />
      <HomePageClient />
    </>
  );
}
