'use client';

import { useTranslations } from 'next-intl';

export default function TermsPage() {
  const t = useTranslations('legal.terms');

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

          {/* Acceptance of Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('acceptance.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('acceptance.paragraph_1')}</p>
              <p>{t('acceptance.paragraph_2')}</p>
            </div>
          </section>

          {/* Use of Service */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('use_of_service.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('use_of_service.paragraph_1')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('use_of_service.allowed_1')}</li>
                <li>{t('use_of_service.allowed_2')}</li>
                <li>{t('use_of_service.allowed_3')}</li>
              </ul>
              <p>{t('use_of_service.paragraph_2')}</p>
            </div>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('user_accounts.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('user_accounts.paragraph_1')}</p>
              <p>{t('user_accounts.paragraph_2')}</p>
              <p>{t('user_accounts.paragraph_3')}</p>
            </div>
          </section>

          {/* Privacy Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('privacy.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('privacy.paragraph_1')}</p>
              <p>{t('privacy.paragraph_2')}</p>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('intellectual_property.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('intellectual_property.paragraph_1')}</p>
              <p>{t('intellectual_property.paragraph_2')}</p>
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

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('termination.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('termination.paragraph_1')}</p>
              <p>{t('termination.paragraph_2')}</p>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('governing_law.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('governing_law.paragraph_1')}</p>
              <p>{t('governing_law.paragraph_2')}</p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('changes.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('changes.paragraph_1')}</p>
              <p>{t('changes.paragraph_2')}</p>
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
