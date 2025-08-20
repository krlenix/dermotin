'use client';

import { useTranslations } from 'next-intl';
import { CountryConfig } from '@/config/countries';
import { Phone, Mail } from 'lucide-react';
import Image from 'next/image';

interface FooterProps {
  countryConfig: CountryConfig;
}

export function Footer({ countryConfig }: FooterProps) {
  const t = useTranslations();

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src={countryConfig.logo}
                alt={t('ui.alt_logo')}
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-gray-300 text-base mb-4 leading-relaxed">
              {t('footer.brand_description')}
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">{t('footer.company_info')}</h4>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <a 
                  href={`tel:${countryConfig.company.phone}`}
                  className="font-medium text-gray-300 hover:text-white transition-colors"
                >
                  {countryConfig.company.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{countryConfig.company.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 flex items-center justify-center">
                  <div className="w-3 h-3 bg-brand-green rounded-full"></div>
                </div>
                <span className="font-medium">{countryConfig.company.name} by Clicky DOO</span>
              </div>
              <div className="space-y-1 pt-2">
                <p className="text-gray-400">{countryConfig.company.address}</p>
                <p className="text-gray-400">{countryConfig.company.city}, {countryConfig.company.postalCode}</p>
                <p className="text-gray-400">{countryConfig.company.country}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">{t('footer.customer_service')}</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p>{t('delivery_schedule.delivery_1_3_days')}</p>
              <p>{t('delivery_schedule.returns_30_days')}</p>
              <p>{t('delivery_schedule.support_24_7')}</p>
              <p>{t('sections.guarantee_satisfaction')}</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © 2024 {countryConfig.company.name}. {t('footer.all_rights_reserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}
