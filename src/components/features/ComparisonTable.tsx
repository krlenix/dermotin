'use client';

import Image from 'next/image';
import { Check, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { CountryConfig } from '@/config/countries';
import { useTranslations } from 'next-intl';

interface ComparisonTableProps {
  countryConfig: CountryConfig;
  className?: string;
}

export function ComparisonTable({ countryConfig, className }: ComparisonTableProps) {
  const t = useTranslations();
  
  const comparisonData = [
    {
      feature: t('comparison.no_corticosteroids'),
      dermotin: true,
      others: false
    },
    {
      feature: t('comparison.natural'),
      dermotin: true,
      others: false
    },
    {
      feature: t('comparison.made_in_serbia'),
      dermotin: true,
      others: false
    },
    {
      feature: t('comparison.money_back'),
      dermotin: true,
      others: false
    },
    {
      feature: t('comparison.dermatologically_tested'),
      dermotin: true,
      others: false
    },
    {
      feature: t('comparison.highly_rated'),
      dermotin: true,
      others: false
    }
  ];

  return (
    <section className={`py-12 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {t('comparison.why_dermotin')}
            </h2>
            <p className="text-gray-600 text-sm">
              {t('comparison.compare_competition')}
            </p>
          </div>

          <Card className="overflow-hidden shadow-lg py-0 gap-0">
            <div className="overflow-x-auto" style={{maxWidth: '100%'}}>
              <table className="w-full">
                {/* Header */}
                <thead>
                  <tr>
                    <th className="text-left p-3 bg-gray-100 border-b font-medium text-gray-700 text-sm">
                      {t('comparison.features')}
                    </th>
                    <th className="text-center p-3 bg-brand-green border-b">
                      <div className="flex flex-col items-center">
                        <Image
                          src={countryConfig.logo}
                          alt={t('ui.alt_logo')}
                          width={100}
                          height={32}
                          className="h-6 w-auto filter brightness-0 invert"
                        />
                      </div>
                    </th>
                    <th className="text-center p-3 bg-gray-100 border-b">
                      <div className="text-sm font-bold text-gray-700">
                        {t('comparison.others')}
                      </div>
                    </th>
                  </tr>
                </thead>

                {/* Body */}
                <tbody>
                  {comparisonData.map((item, index) => (
                    <tr key={index} className="border-b last:border-b-0">
                      <td className="p-3 bg-gray-50 text-gray-700 font-medium text-sm">
                        {item.feature}
                      </td>
                      <td className="p-3 text-center bg-brand-green/5">
                        {item.dermotin ? (
                          <div className="inline-flex items-center justify-center w-6 h-6 bg-brand-green rounded-full">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-6 h-6 bg-red-500 rounded-full">
                            <X className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-center bg-gray-50">
                        {item.others ? (
                          <div className="inline-flex items-center justify-center w-6 h-6 bg-brand-green rounded-full">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-6 h-6 bg-red-500 rounded-full">
                            <X className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Call to Action */}
            <div className="bg-brand-green p-3 text-center">
              <div className="text-white">
                <h3 className="text-lg font-bold mb-1">
                  {t('comparison.clear_choice')}
                </h3>
                <p className="text-green-100 text-sm">
                  {t('comparison.natural_reliable')}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
