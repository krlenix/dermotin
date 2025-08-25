'use client';

import { useTranslations } from 'next-intl';

export default function PrivacyPage() {
  const t = useTranslations('legal.privacy');

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

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('information_collection.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <h3 className="text-xl font-medium text-gray-900">{t('information_collection.personal_data.title')}</h3>
              <p>{t('information_collection.personal_data.paragraph_1')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('information_collection.personal_data.item_1')}</li>
                <li>{t('information_collection.personal_data.item_2')}</li>
                <li>{t('information_collection.personal_data.item_3')}</li>
                <li>{t('information_collection.personal_data.item_4')}</li>
              </ul>
              
              <h3 className="text-xl font-medium text-gray-900">{t('information_collection.usage_data.title')}</h3>
              <p>{t('information_collection.usage_data.paragraph_1')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('information_collection.usage_data.item_1')}</li>
                <li>{t('information_collection.usage_data.item_2')}</li>
                <li>{t('information_collection.usage_data.item_3')}</li>
              </ul>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('how_we_use.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('how_we_use.paragraph_1')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('how_we_use.purpose_1')}</li>
                <li>{t('how_we_use.purpose_2')}</li>
                <li>{t('how_we_use.purpose_3')}</li>
                <li>{t('how_we_use.purpose_4')}</li>
                <li>{t('how_we_use.purpose_5')}</li>
              </ul>
            </div>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('information_sharing.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('information_sharing.paragraph_1')}</p>
              <p>{t('information_sharing.paragraph_2')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('information_sharing.circumstance_1')}</li>
                <li>{t('information_sharing.circumstance_2')}</li>
                <li>{t('information_sharing.circumstance_3')}</li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('data_security.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('data_security.paragraph_1')}</p>
              <p>{t('data_security.paragraph_2')}</p>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('your_rights.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('your_rights.paragraph_1')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('your_rights.right_1')}</li>
                <li>{t('your_rights.right_2')}</li>
                <li>{t('your_rights.right_3')}</li>
                <li>{t('your_rights.right_4')}</li>
                <li>{t('your_rights.right_5')}</li>
              </ul>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('cookies.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('cookies.paragraph_1')}</p>
              <p>{t('cookies.paragraph_2')}</p>
            </div>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('third_party.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('third_party.paragraph_1')}</p>
              <p>{t('third_party.paragraph_2')}</p>
            </div>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('children_privacy.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('children_privacy.paragraph_1')}</p>
              <p>{t('children_privacy.paragraph_2')}</p>
            </div>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('changes.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('changes.paragraph_1')}</p>
              <p>{t('changes.paragraph_2')}</p>
            </div>
          </section>

          {/* Contact Us */}
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
