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
    <footer className="py-10">
      <div className="container mx-auto px-4">
        <div className="rounded-[2rem] border border-brand-green/12 bg-[linear-gradient(180deg,rgba(245,250,247,0.96),rgba(255,255,255,0.98))] px-6 py-8 shadow-[0_18px_45px_rgba(26,54,42,0.06)] md:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <Image
                src={countryConfig.logo}
                alt={t('ui.alt_logo')}
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <p className="mb-4 text-base leading-relaxed text-slate-600">
              {t('footer.brand_description')}
            </p>
            <div className="mt-4">
              <h5 className="mb-2 text-sm font-semibold text-slate-900">{t('footer.select_language', { default: 'Select Language' })}</h5>
              <CountrySwitcher variant="outline" className="!border-brand-green/15 !bg-white hover:!bg-brand-green/5 !text-slate-700" />
            </div>
          </div>
          
          <div>
            <h4 className="mb-4 font-bold text-slate-900">{t('footer.company_info')}</h4>
            <div className="space-y-3 text-sm text-slate-600">
              {countryConfig.company.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-brand-orange" />
                  <a 
                    href={`tel:${countryConfig.company.phone}`}
                    className="font-medium text-slate-700 transition-colors hover:text-brand-orange"
                  >
                    {countryConfig.company.phone}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-brand-orange" />
                <span className="font-medium text-slate-700">{countryConfig.company.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-brand-orange" />
                <span className="font-medium text-slate-700">{countryConfig.company.name} {t('footer.powered_by')} {countryConfig.company.legalName}</span>
              </div>
              
              {/* Address - Styled like phone/email */}
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-brand-orange" />
                <span className="font-medium text-slate-700">
                  {countryConfig.company.address}, {countryConfig.company.city}, {countryConfig.company.postalCode}, {countryConfig.company.country}
                </span>
              </div>
              
              {/* Business Information - Styled like phone/email */}
              {(countryConfig.company.taxNumber || countryConfig.company.registrationNumber) && (
                <div className="flex items-center gap-3">
                  <Hash className="h-4 w-4 text-brand-orange" />
                  <div className="text-sm font-medium text-slate-700">
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
            <h4 className="mb-4 font-bold text-slate-900">{t('footer.legal_documents')}</h4>
            <div className="space-y-2 text-sm">
              <button
                onClick={() => openDocument('terms-of-service', t('legal.terms_of_service'))}
                className="flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left text-slate-600 transition-colors hover:bg-brand-green/5 hover:text-slate-900"
              >
                <FileText className="h-4 w-4 text-brand-orange" />
                {t('legal.terms_of_service')}
              </button>
              <button
                onClick={() => openDocument('privacy-policy', t('legal.privacy_policy'))}
                className="flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left text-slate-600 transition-colors hover:bg-brand-green/5 hover:text-slate-900"
              >
                <FileText className="h-4 w-4 text-brand-orange" />
                {t('legal.privacy_policy')}
              </button>
              <button
                onClick={() => openDocument('cookie-policy', t('legal.cookie_policy'))}
                className="flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left text-slate-600 transition-colors hover:bg-brand-green/5 hover:text-slate-900"
              >
                <FileText className="h-4 w-4 text-brand-orange" />
                {t('legal.cookie_policy')}
              </button>
              <button
                onClick={() => openDocument('returns-policy', t('legal.returns_policy'))}
                className="flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left text-slate-600 transition-colors hover:bg-brand-green/5 hover:text-slate-900"
              >
                <FileText className="h-4 w-4 text-brand-orange" />
                {t('legal.returns_policy')}
              </button>
              <button
                onClick={() => openDocument('disclaimer', t('legal.disclaimer'))}
                className="flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left text-slate-600 transition-colors hover:bg-brand-green/5 hover:text-slate-900"
              >
                <FileText className="h-4 w-4 text-brand-orange" />
                {t('legal.disclaimer')}
              </button>
              <button
                onClick={() => openDocument('contact-info', t('legal.contact_info'))}
                className="flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left text-slate-600 transition-colors hover:bg-brand-green/5 hover:text-slate-900"
              >
                <FileText className="h-4 w-4 text-brand-orange" />
                {t('legal.contact_info')}
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-brand-green/10 pt-6">
          {/* Copyright */}
          <div className="text-center">
            <p className="text-sm text-slate-500">
              © 2024 {countryConfig.company.name}. {t('footer.all_rights_reserved')}
            </p>
          </div>
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
