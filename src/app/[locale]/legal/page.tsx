'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Shield, 
  Cookie, 
  RotateCcw, 
  Truck, 
  AlertTriangle, 
  Mail,
  ExternalLink
} from 'lucide-react';

export default function LegalPage() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('legal');

  const legalPages = [
    {
      title: t('terms_of_service'),
      description: t('terms_description'),
      href: `/${locale}/legal/terms`,
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: t('privacy_policy'),
      description: t('privacy_description'),
      href: `/${locale}/legal/privacy`,
      icon: Shield,
      color: 'text-green-600'
    },
    {
      title: t('cookie_policy'),
      description: t('cookies_description'),
      href: `/${locale}/legal/cookies`,
      icon: Cookie,
      color: 'text-orange-600'
    },
    {
      title: t('returns_policy'),
      description: t('returns_description'),
      href: `/${locale}/legal/returns`,
      icon: RotateCcw,
      color: 'text-purple-600'
    },
    {
      title: t('shipping_policy'),
      description: t('shipping_description'),
      href: `/${locale}/legal/shipping`,
      icon: Truck,
      color: 'text-red-600'
    },
    {
      title: t('disclaimer'),
      description: t('disclaimer_description'),
      href: `/${locale}/legal/disclaimer`,
      icon: AlertTriangle,
      color: 'text-yellow-600'
    },
    {
      title: t('legal_contact'),
      description: t('legal_contact_description'),
      href: `/${locale}/legal/contact`,
      icon: Mail,
      color: 'text-gray-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">{t('legal_documents')}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('legal_overview')}
        </p>
      </div>

      {/* Legal Documents Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {legalPages.map((page, index) => {
          const IconComponent = page.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <IconComponent className={`h-6 w-6 ${page.color}`} />
                  <CardTitle className="text-lg">{page.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm">{page.description}</p>
                <Button asChild variant="outline" className="w-full">
                  <Link href={page.href}>
                    {t('read_more')}
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-3">
          {t('important_note')}
        </h2>
        <p className="text-blue-800 text-sm leading-relaxed">
          {t('legal_disclaimer_note')}
        </p>
      </div>
    </div>
  );
}
