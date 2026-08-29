import { Metadata } from 'next';
import HomePageClient from '@/components/HomePageClient';
import { getCountryConfig } from '@/config/countries';
import { SOCIAL_LINKS } from '@/config/app-config';
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

const HOME_DESCRIPTIONS: Record<string, string> = {
  rs: 'DERMOTIN prirodna kozmetika i suplementi za svakodnevnu negu kože i noktiju. Biljni ekstrakti i eterična ulja, plaćanje pouzećem i isporuka u Srbiji.',
  ba: 'DERMOTIN prirodna kozmetika i suplementi za svakodnevnu njegu kože i noktiju. Biljni ekstrakti i eterična ulja, plaćanje pouzećem i dostava u BiH.',
  me: 'DERMOTIN prirodna kozmetika i suplementi za svakodnevnu njegu kože i noktiju. Biljni ekstrakti i eterična ulja, plaćanje pouzećem i dostava u Crnoj Gori.',
};

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const canonical = `${getSiteUrl()}/${locale}`;
  const title = HOME_TITLES[locale] || HOME_TITLES.rs;
  const description = HOME_DESCRIPTIONS[locale] || HOME_DESCRIPTIONS.rs;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(SITE_LOCALES, (l) => `/${l}`),
    },
    openGraph: {
      title,
      description,
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
    '@type': 'OnlineStore',
    '@id': `${base}/#organization`,
    name: 'DERMOTIN',
    alternateName: 'Dermotin',
    url: base,
    logo: {
      '@type': 'ImageObject',
      url: `${base}/images/main/logo.png`,
    },
    image: `${base}/images/main/hero-image.webp`,
    email: countryConfig.company.email,
    ...(countryConfig.company.phone ? { telephone: countryConfig.company.phone } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: countryConfig.company.address,
      addressLocality: countryConfig.company.city,
      postalCode: countryConfig.company.postalCode,
      addressCountry: countryConfig.code.toUpperCase(),
    },
    areaServed: {
      '@type': 'Country',
      name: countryConfig.company.country,
    },
    sameAs: Object.values(SOCIAL_LINKS),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: countryConfig.company.email,
      ...(countryConfig.company.phone
        ? { telephone: countryConfig.company.phone }
        : {}),
      areaServed: countryConfig.code.toUpperCase(),
      availableLanguage: ['sr', 'bs'],
    },
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: countryConfig.code.toUpperCase(),
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: countryConfig.business.returnPeriodDays,
      returnMethod: 'https://schema.org/ReturnByMail',
    },
  };
}

function buildWebSiteJsonLd(locale: string) {
  const base = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${base}/#website`,
    name: 'DERMOTIN',
    alternateName: 'Dermotin',
    url: base,
    publisher: { '@id': `${base}/#organization` },
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
