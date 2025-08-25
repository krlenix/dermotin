'use client';

import { useTranslations } from 'next-intl';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function LegalContactPage() {
  const t = useTranslations('legal.contact');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-lg text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {/* Introduction */}
        <section>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700">{t('introduction')}</p>
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('contact_information.title')}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Company Details */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('company_details.title')}</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-brand-orange mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">{t('company_details.name')}</p>
                    <p className="text-gray-600">{t('company_details.address')}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-brand-orange" />
                  <div>
                    <p className="font-medium text-gray-900">{t('company_details.email_label')}</p>
                    <a href={`mailto:${t('company_details.email')}`} className="text-brand-orange hover:underline">
                      {t('company_details.email')}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-brand-orange" />
                  <div>
                    <p className="font-medium text-gray-900">{t('company_details.phone_label')}</p>
                    <a href={`tel:${t('company_details.phone')}`} className="text-brand-orange hover:underline">
                      {t('company_details.phone')}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-brand-orange mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">{t('company_details.hours_label')}</p>
                    <p className="text-gray-600">{t('company_details.hours')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Department */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('legal_department.title')}</h3>
              <div className="space-y-4">
                <p className="text-gray-700">{t('legal_department.description')}</p>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-brand-orange" />
                  <div>
                    <p className="font-medium text-gray-900">{t('legal_department.email_label')}</p>
                    <a href={`mailto:${t('legal_department.email')}`} className="text-brand-orange hover:underline">
                      {t('legal_department.email')}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-brand-orange" />
                  <div>
                    <p className="font-medium text-gray-900">{t('legal_department.phone_label')}</p>
                    <a href={`tel:${t('legal_department.phone')}`} className="text-brand-orange hover:underline">
                      {t('legal_department.phone')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Response Time */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('response_time.title')}</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-blue-800">{t('response_time.description')}</p>
          </div>
        </section>

        {/* Legal Inquiries */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('legal_inquiries.title')}</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-4">{t('legal_inquiries.description')}</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>{t('legal_inquiries.type_1')}</li>
              <li>{t('legal_inquiries.type_2')}</li>
              <li>{t('legal_inquiries.type_3')}</li>
              <li>{t('legal_inquiries.type_4')}</li>
              <li>{t('legal_inquiries.type_5')}</li>
            </ul>
          </div>
        </section>

        {/* Emergency Contact */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('emergency_contact.title')}</h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800 font-medium mb-2">{t('emergency_contact.description')}</p>
            <p className="text-red-700">{t('emergency_contact.contact_info')}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
