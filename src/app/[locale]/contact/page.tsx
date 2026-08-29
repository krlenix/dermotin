import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import ContactPage from '@/components/ContactPage';
import { SITE_LOCALES, buildLanguageAlternates, getSiteUrl } from '@/lib/seo';

interface ContactPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const canonical = `${getSiteUrl()}/${locale}/contact`;
  
  return {
    title: { absolute: `${t('contact.page_title')} | DERMOTIN` },
    description: t('contact.page_subtitle'),
    alternates: {
      canonical,
      languages: buildLanguageAlternates(SITE_LOCALES, (l) => `/${l}/contact`),
    },
    openGraph: {
      title: `${t('contact.page_title')} | DERMOTIN`,
      description: t('contact.page_subtitle'),
      url: canonical,
      type: 'website',
    },
  };
}

export default async function Contact({ params }: ContactPageProps) {
  const { locale } = await params;
  return <ContactPage locale={locale} />;
}
