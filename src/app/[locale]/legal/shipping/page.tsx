'use client';

import { useTranslations } from 'next-intl';

export default function ShippingPage() {
  const t = useTranslations('legal.shipping');

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

          {/* Shipping Methods */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('shipping_methods.title')}</h2>
            <div className="space-y-6 text-gray-700">
              
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">{t('shipping_methods.standard.title')}</h3>
                <p className="mb-2">{t('shipping_methods.standard.description')}</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>{t('shipping_methods.standard.detail_1')}</li>
                  <li>{t('shipping_methods.standard.detail_2')}</li>
                  <li>{t('shipping_methods.standard.detail_3')}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">{t('shipping_methods.express.title')}</h3>
                <p className="mb-2">{t('shipping_methods.express.description')}</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>{t('shipping_methods.express.detail_1')}</li>
                  <li>{t('shipping_methods.express.detail_2')}</li>
                  <li>{t('shipping_methods.express.detail_3')}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">{t('shipping_methods.free_shipping.title')}</h3>
                <p className="mb-2">{t('shipping_methods.free_shipping.description')}</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>{t('shipping_methods.free_shipping.detail_1')}</li>
                  <li>{t('shipping_methods.free_shipping.detail_2')}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Shipping Costs */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('shipping_costs.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('shipping_costs.paragraph_1')}</p>
              <p>{t('shipping_costs.paragraph_2')}</p>
            </div>
          </section>

          {/* Processing Time */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('processing_time.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('processing_time.paragraph_1')}</p>
              <p>{t('processing_time.paragraph_2')}</p>
            </div>
          </section>

          {/* Delivery Areas */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('delivery_areas.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('delivery_areas.paragraph_1')}</p>
              <p>{t('delivery_areas.paragraph_2')}</p>
            </div>
          </section>

          {/* Tracking Orders */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('tracking.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('tracking.paragraph_1')}</p>
              <p>{t('tracking.paragraph_2')}</p>
            </div>
          </section>

          {/* Delivery Issues */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('delivery_issues.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('delivery_issues.paragraph_1')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('delivery_issues.issue_1')}</li>
                <li>{t('delivery_issues.issue_2')}</li>
                <li>{t('delivery_issues.issue_3')}</li>
                <li>{t('delivery_issues.issue_4')}</li>
              </ul>
            </div>
          </section>

          {/* International Shipping */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('international_shipping.title')}</h2>
            <div className="space-y-4 text-gray-700">
              <p>{t('international_shipping.paragraph_1')}</p>
              <p>{t('international_shipping.paragraph_2')}</p>
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
