'use client';

import { Button } from '@/components/ui/button';
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
    <div className={`bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        {/* Product Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Package className="h-5 w-5 text-brand-orange flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">
              {productName}
            </p>
            <p className="text-xs text-gray-600 truncate">
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

        {/* Reselect Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onReselect}
          className="flex-shrink-0 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white transition-colors"
        >
          <Edit3 className="h-3 w-3 mr-1" />
          <span className="text-xs">{t('order_summary.change')}</span>
        </Button>
      </div>
    </div>
  );
}
