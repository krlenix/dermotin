'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CountryConfig } from '@/config/countries';
import { Phone, Mail, FileText, Building2, MapPin, Hash } from 'lucide-react';
import Image from 'next/image';
import { LegalDocumentModal } from '@/components/features/LegalDocumentModal';
import { CountrySwitcher } from '@/components/features/CountrySwitcher';

interface FooterProps {
  countryConfig: CountryConfig;
  locale?: string;
}

export function Footer({ countryConfig, locale = 'rs' }: FooterProps) {
  const t = useTranslations();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    type: string;
    title: string;
  } | null>(null);

  const openDocument = (type: string, title: string) => {
    setSelectedDocument({ type, title });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDocument(null);
  };

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
            <div className="mt-4">
              <h5 className="text-sm font-semibold text-white mb-2">{t('footer.select_language', { default: 'Select Language' })}</h5>
              <CountrySwitcher variant="outline" className="!bg-gray-700 hover:!bg-gray-600 !border-gray-600 !text-white [&_svg]:!text-gray-300" />
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">{t('footer.company_info')}</h4>
            <div className="space-y-3 text-sm text-gray-300">
              {countryConfig.company.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <a 
                    href={`tel:${countryConfig.company.phone}`}
                    className="font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    {countryConfig.company.phone}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{countryConfig.company.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{countryConfig.company.name} {t('footer.powered_by')} {countryConfig.company.legalName}</span>
              </div>
              
              {/* Address - Styled like phone/email */}
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="font-medium text-gray-300">
                  {countryConfig.company.address}, {countryConfig.company.city}, {countryConfig.company.postalCode}, {countryConfig.company.country}
                </span>
              </div>
              
              {/* Business Information - Styled like phone/email */}
              {(countryConfig.company.taxNumber || countryConfig.company.registrationNumber) && (
                <div className="flex items-center gap-3">
                  <Hash className="h-4 w-4 text-gray-400" />
                  <div className="font-medium text-gray-300 text-sm">
                    {countryConfig.company.taxNumber && countryConfig.company.registrationNumber ? (
                      <span>PIB: {countryConfig.company.taxNumber} | MB: {countryConfig.company.registrationNumber}</span>
                    ) : (
                      <>
                        {countryConfig.company.taxNumber && <span>PIB: {countryConfig.company.taxNumber}</span>}
                        {countryConfig.company.registrationNumber && <span>MB: {countryConfig.company.registrationNumber}</span>}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">{t('footer.legal_documents')}</h4>
            <div className="space-y-2 text-sm">
              <button
                onClick={() => openDocument('terms-of-service', t('legal.terms_of_service'))}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors w-full text-left"
              >
                <FileText className="h-4 w-4" />
                {t('legal.terms_of_service')}
              </button>
              <button
                onClick={() => openDocument('privacy-policy', t('legal.privacy_policy'))}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors w-full text-left"
              >
                <FileText className="h-4 w-4" />
                {t('legal.privacy_policy')}
              </button>
              <button
                onClick={() => openDocument('cookie-policy', t('legal.cookie_policy'))}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors w-full text-left"
              >
                <FileText className="h-4 w-4" />
                {t('legal.cookie_policy')}
              </button>
              <button
                onClick={() => openDocument('returns-policy', t('legal.returns_policy'))}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors w-full text-left"
              >
                <FileText className="h-4 w-4" />
                {t('legal.returns_policy')}
              </button>
              <button
                onClick={() => openDocument('disclaimer', t('legal.disclaimer'))}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors w-full text-left"
              >
                <FileText className="h-4 w-4" />
                {t('legal.disclaimer')}
              </button>
              <button
                onClick={() => openDocument('contact-info', t('legal.contact_info'))}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors w-full text-left"
              >
                <FileText className="h-4 w-4" />
                {t('legal.contact_info')}
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8">
          {/* Copyright */}
          <div className="text-center">
            <p className="text-sm text-gray-400">
              © 2024 {countryConfig.company.name}. {t('footer.all_rights_reserved')}
            </p>
          </div>
        </div>
      </div>

      {/* Legal Document Modal */}
      {selectedDocument && (
        <LegalDocumentModal
          isOpen={modalOpen}
          onClose={closeModal}
          documentType={selectedDocument.type}
          documentTitle={selectedDocument.title}
          countryConfig={countryConfig}
          locale={locale}
        />
      )}
    </footer>
  );
}
