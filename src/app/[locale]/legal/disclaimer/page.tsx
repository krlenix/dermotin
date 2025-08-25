'use client';

import { useTranslations } from 'next-intl';

export default function DisclaimerPage() {
  const t = useTranslations('legal.disclaimer');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-600">
          {t('last_updated')}: <span className="font-medium">{t('last_updated_date')}</span>
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <div className="space-y-6">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('introduction.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('introduction.paragraph_1')}</p>
              <p>{t('introduction.paragraph_2')}</p>
            </div>
          </section>

          {/* Medical Disclaimer */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('medical_disclaimer.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('medical_disclaimer.paragraph_1')}</p>
              <p>{t('medical_disclaimer.paragraph_2')}</p>
              <p>{t('medical_disclaimer.paragraph_3')}</p>
            </div>
          </section>

          {/* Product Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('product_information.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('product_information.paragraph_1')}</p>
              <p>{t('product_information.paragraph_2')}</p>
            </div>
          </section>

          {/* Results Disclaimer */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('results_disclaimer.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('results_disclaimer.paragraph_1')}</p>
              <p>{t('results_disclaimer.paragraph_2')}</p>
            </div>
          </section>

          {/* Website Content */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('website_content.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('website_content.paragraph_1')}</p>
              <p>{t('website_content.paragraph_2')}</p>
            </div>
          </section>

          {/* External Links */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('external_links.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('external_links.paragraph_1')}</p>
              <p>{t('external_links.paragraph_2')}</p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('limitation_of_liability.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('limitation_of_liability.paragraph_1')}</p>
              <p>{t('limitation_of_liability.paragraph_2')}</p>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('contact.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('contact.paragraph_1')}</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{t('contact.company_name')}</p>
                <p>{t('contact.address')}</p>
                <p>{t('contact.email')}</p>
                <p>{t('contact.phone')}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
