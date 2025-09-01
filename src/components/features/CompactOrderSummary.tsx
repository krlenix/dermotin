'use client';

import { ProductVariant } from '@/config/products';
import { CountryConfig } from '@/config/countries';
import { useTranslations } from 'next-intl';
import { Edit3, Package } from 'lucide-react';

interface CompactOrderSummaryProps {
  selectedVariant: ProductVariant;
  productName: string;
  countryConfig: CountryConfig;
  bundleItems?: {[key: string]: number};
  onReselect: () => void;
  className?: string;
}

export function CompactOrderSummary({ 
  selectedVariant, 
  productName,
  countryConfig,
  bundleItems = {},
  onReselect,
  className = ""
}: CompactOrderSummaryProps) {
  const t = useTranslations();
  
  // Simple price formatter using the country's currency symbol (no conversion)
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('sr-RS', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount) + ' ' + countryConfig.currencySymbol;
  };

  const orderTotal = selectedVariant.discountPrice || selectedVariant.price;
  const bundleTotal = Object.values(bundleItems).reduce((sum, price) => sum + price, 0);
  const subtotal = orderTotal + bundleTotal;

  return (
    <div className={`bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4 md:hidden ${className}`}>
      <div className="space-y-3">
        {/* Product Info and Price Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Package className="h-5 w-5 text-brand-orange flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm">
                {productName}
              </p>
              <p className="text-xs text-gray-600">
                {selectedVariant.name}
              </p>
              {Object.keys(bundleItems).length > 0 && (
                <p className="text-xs text-green-600">
                  +{Object.keys(bundleItems).length} {t('order_summary.additional_items')}
                </p>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="text-right flex-shrink-0">
            <p className="font-bold text-lg text-brand-orange">
              {formatPrice(subtotal)}
            </p>
            {selectedVariant.discountPrice && (
              <p className="text-xs text-gray-500 line-through">
                {formatPrice(selectedVariant.price + bundleTotal)}
              </p>
            )}
          </div>
        </div>

        {/* Button Row */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onReselect();
            }}
            className="w-full sm:w-auto h-8 px-3 rounded-md border border-brand-orange bg-white text-brand-orange hover:bg-gray-100 hover:text-brand-orange transition-all duration-200 text-xs font-medium inline-flex items-center justify-center gap-1.5 group"
          >
            <Edit3 className="h-3 w-3 text-brand-orange group-hover:text-brand-orange transition-colors" />
            <span className="text-brand-orange group-hover:text-brand-orange transition-colors">{t('order_summary.change')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}