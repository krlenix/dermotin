'use client';

import { useTranslations } from 'next-intl';

export default function ReturnsPage() {
  const t = useTranslations('legal.returns');

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

          {/* Return Period */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('return_period.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('return_period.paragraph_1')}</p>
              <p>{t('return_period.paragraph_2')}</p>
            </div>
          </section>

          {/* Return Conditions */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('return_conditions.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('return_conditions.paragraph_1')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('return_conditions.condition_1')}</li>
                <li>{t('return_conditions.condition_2')}</li>
                <li>{t('return_conditions.condition_3')}</li>
                <li>{t('return_conditions.condition_4')}</li>
                <li>{t('return_conditions.condition_5')}</li>
              </ul>
            </div>
          </section>

          {/* Non-Returnable Items */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('non_returnable.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('non_returnable.paragraph_1')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('non_returnable.item_1')}</li>
                <li>{t('non_returnable.item_2')}</li>
                <li>{t('non_returnable.item_3')}</li>
                <li>{t('non_returnable.item_4')}</li>
              </ul>
            </div>
          </section>

          {/* Return Process */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('return_process.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('return_process.paragraph_1')}</p>
              <ol className="list-decimal pl-6 space-y-3">
                <li>{t('return_process.step_1')}</li>
                <li>{t('return_process.step_2')}</li>
                <li>{t('return_process.step_3')}</li>
                <li>{t('return_process.step_4')}</li>
                <li>{t('return_process.step_5')}</li>
              </ol>
            </div>
          </section>

          {/* Refund Process */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('refund_process.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('refund_process.paragraph_1')}</p>
              <p>{t('refund_process.paragraph_2')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('refund_process.method_1')}</li>
                <li>{t('refund_process.method_2')}</li>
                <li>{t('refund_process.method_3')}</li>
              </ul>
            </div>
          </section>

          {/* Return Shipping */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('return_shipping.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('return_shipping.paragraph_1')}</p>
              <p>{t('return_shipping.paragraph_2')}</p>
            </div>
          </section>

          {/* Damaged or Defective Items */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('damaged_items.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('damaged_items.paragraph_1')}</p>
              <p>{t('damaged_items.paragraph_2')}</p>
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
