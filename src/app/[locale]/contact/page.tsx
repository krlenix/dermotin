import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import ContactPage from '@/components/ContactPage';

interface ContactPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  
  return {
    title: `${t('contact.page_title')} | DERMOTIN`,
    description: t('contact.page_subtitle'),
    openGraph: {
      title: `${t('contact.page_title')} | DERMOTIN`,
      description: t('contact.page_subtitle'),
      type: 'website',
    },
  };
}

export default async function Contact({ params }: ContactPageProps) {
  const { locale } = await params;
  return <ContactPage locale={locale} />;
}
