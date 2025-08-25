'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('legal');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild className="text-gray-600 hover:text-gray-900">
                <Link href={`/${locale}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('back_to_home')}
                </Link>
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-2xl font-bold text-gray-900">{t('legal_pages')}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8 overflow-x-auto py-4">
            <Link 
              href={`/${locale}/legal/terms`}
              className="text-gray-600 hover:text-gray-900 font-medium whitespace-nowrap"
            >
              {t('terms_of_service')}
            </Link>
            <Link 
              href={`/${locale}/legal/privacy`}
              className="text-gray-600 hover:text-gray-900 font-medium whitespace-nowrap"
            >
              {t('privacy_policy')}
            </Link>
            <Link 
              href={`/${locale}/legal/cookies`}
              className="text-gray-600 hover:text-gray-900 font-medium whitespace-nowrap"
            >
              {t('cookie_policy')}
            </Link>
            <Link 
              href={`/${locale}/legal/returns`}
              className="text-gray-600 hover:text-gray-900 font-medium whitespace-nowrap"
            >
              {t('returns_policy')}
            </Link>
            <Link 
              href={`/${locale}/legal/shipping`}
              className="text-gray-600 hover:text-gray-900 font-medium whitespace-nowrap"
            >
              {t('shipping_policy')}
            </Link>
            <Link 
              href={`/${locale}/legal/disclaimer`}
              className="text-gray-600 hover:text-gray-900 font-medium whitespace-nowrap"
            >
              {t('disclaimer')}
            </Link>
            <Link 
              href={`/${locale}/legal/contact`}
              className="text-gray-600 hover:text-gray-900 font-medium whitespace-nowrap"
            >
              {t('legal_contact')}
            </Link>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
