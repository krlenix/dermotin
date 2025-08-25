'use client';

import { useTranslations } from 'next-intl';

export default function CookiesPage() {
  const t = useTranslations('legal.cookies');

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

          {/* What Are Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('what_are_cookies.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('what_are_cookies.paragraph_1')}</p>
              <p>{t('what_are_cookies.paragraph_2')}</p>
            </div>
          </section>

          {/* Types of Cookies We Use */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('types_of_cookies.title')}</h2>
            <div className="space-y-6 text-gray-700">
              
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">{t('types_of_cookies.essential.title')}</h3>
                <p className="mb-2">{t('types_of_cookies.essential.description')}</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>{t('types_of_cookies.essential.example_1')}</li>
                  <li>{t('types_of_cookies.essential.example_2')}</li>
                  <li>{t('types_of_cookies.essential.example_3')}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">{t('types_of_cookies.analytics.title')}</h3>
                <p className="mb-2">{t('types_of_cookies.analytics.description')}</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>{t('types_of_cookies.analytics.example_1')}</li>
                  <li>{t('types_of_cookies.analytics.example_2')}</li>
                  <li>{t('types_of_cookies.analytics.example_3')}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">{t('types_of_cookies.functional.title')}</h3>
                <p className="mb-2">{t('types_of_cookies.functional.description')}</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>{t('types_of_cookies.functional.example_1')}</li>
                  <li>{t('types_of_cookies.functional.example_2')}</li>
                  <li>{t('types_of_cookies.functional.example_3')}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">{t('types_of_cookies.marketing.title')}</h3>
                <p className="mb-2">{t('types_of_cookies.marketing.description')}</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>{t('types_of_cookies.marketing.example_1')}</li>
                  <li>{t('types_of_cookies.marketing.example_2')}</li>
                  <li>{t('types_of_cookies.marketing.example_3')}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Third-Party Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('third_party_cookies.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('third_party_cookies.paragraph_1')}</p>
              <p>{t('third_party_cookies.paragraph_2')}</p>
            </div>
          </section>

          {/* Managing Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('managing_cookies.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('managing_cookies.paragraph_1')}</p>
              
              <h3 className="text-xl font-medium text-gray-900 mb-3">{t('managing_cookies.browser_settings.title')}</h3>
              <p className="mb-2">{t('managing_cookies.browser_settings.description')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('managing_cookies.browser_settings.chrome')}</li>
                <li>{t('managing_cookies.browser_settings.firefox')}</li>
                <li>{t('managing_cookies.browser_settings.safari')}</li>
                <li>{t('managing_cookies.browser_settings.edge')}</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">{t('managing_cookies.our_settings.title')}</h3>
              <p>{t('managing_cookies.our_settings.description')}</p>
            </div>
          </section>

          {/* Cookie Duration */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('cookie_duration.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('cookie_duration.paragraph_1')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('cookie_duration.session_cookies')}</li>
                <li>{t('cookie_duration.persistent_cookies')}</li>
              </ul>
            </div>
          </section>

          {/* Updates to Cookie Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('updates.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('updates.paragraph_1')}</p>
              <p>{t('updates.paragraph_2')}</p>
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
