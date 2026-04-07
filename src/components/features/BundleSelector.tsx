'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductVariant } from '@/config/products';
import { CountryConfig } from '@/config/countries';

import { useTranslations } from 'next-intl';
import { CheckCircle } from 'lucide-react';


interface BundleSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant;
  onVariantChange: (variant: ProductVariant) => void;
  countryConfig: CountryConfig;
  productImage?: string;
  className?: string;
  triggerShake?: boolean; // New prop to trigger shake animation
}

export function BundleSelector({ 
  variants, 
  selectedVariant, 
  onVariantChange, 
  countryConfig,
  productImage = '/images/products/fungel/fungel-box-only.png',
  className,
  triggerShake = false
}: BundleSelectorProps) {
  const t = useTranslations();
  const [isShaking, setIsShaking] = useState(false);
  
  // Trigger shake animation when triggerShake changes
  useEffect(() => {
    if (triggerShake) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 600); // Shake duration
      return () => clearTimeout(timer);
    }
  }, [triggerShake]);
  
  // Simple price formatter using the country's currency symbol
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('sr-RS', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount) + ' ' + countryConfig.currencySymbol;
  };

  const getBundleBadge = (index: number) => {
    // Calculate savings based on actual prices
    const basePrice = variants[0].discountPrice || variants[0].price;
    const currentVariant = variants[index];
    const currentPrice = currentVariant.discountPrice || currentVariant.price;
    const totalBasePrice = basePrice * (index + 1);
    const savings = totalBasePrice - currentPrice;
    
    if (savings <= 0) return null;
    
    switch (index) {
      case 1: return { text: t('bundles.save_amount', { amount: formatPrice(Math.round(savings)) }), color: 'bg-red-500' };
      case 2: return { text: t('bundles.save_amount', { amount: formatPrice(Math.round(savings)) }), color: 'bg-red-600' };
      default: return null;
    }
  };

  const getBundleHighlight = (index: number) => {
    switch (index) {
      case 1: return t('bundles.best_offer');
      case 2: return t('bundles.biggest_savings');
      default: return null;
    }
  };

  return (
    <div 
      id="bundle-selector" 
      className={`space-y-4 ${className} w-full max-w-full overflow-hidden ${
        isShaking ? 'animate-shake' : ''
      }`}
    >
      <div className="mb-4 text-center">
        <h3 id="bundle-title" className="py-2 text-2xl font-black text-slate-950">
          {t('bundles.choose_option')}
        </h3>
      </div>

      <div className="mt-4 space-y-4 overflow-visible w-full">
        {variants.filter((_, index) => index < 3).map((variant, index) => {
          const isSelected = selectedVariant.id === variant.id;
          const badge = getBundleBadge(index);
          const highlight = getBundleHighlight(index);
          const originalPrice = variant.price;
          const discountPrice = variant.discountPrice || variant.price;
          const hasDiscount = variant.discountPrice && variant.discountPrice < variant.price;
          const pricePerItem = Math.round(discountPrice / (index + 1));

          return (
            <Card 
              key={variant.id}
              className={`relative cursor-pointer transition-all duration-200 overflow-visible w-full ${
                isSelected 
                  ? 'border-2 border-brand-green bg-brand-green/5 shadow-[0_18px_35px_rgba(26,54,42,0.08)]' 
                  : 'border border-brand-green/12 hover:border-brand-green/25 bg-white/90 shadow-none'
              }`}
              onClick={() => onVariantChange(variant)}
            >
              {/* Highlight Badge */}
              {highlight && (
                <div className="absolute -top-3 left-4 z-10">
                  <Badge className={`${index === 1 ? 'bg-brand-orange text-white' : 'bg-brand-green text-white'} rounded-full px-4 py-1 text-xs font-bold max-w-full shadow-sm`}>
                    {highlight}
                  </Badge>
                </div>
              )}

              {/* Discount Badge */}
              {badge && (
                <div className="absolute -top-2 -right-2 z-10">
                  <Badge className={`${badge.color} text-white px-3 py-1 text-sm font-bold transform rotate-12 shadow-lg`}>
                    {badge.text}
                  </Badge>
                </div>
              )}

              <div className="px-4 py-4">
                <div className="flex flex-row items-center justify-between w-full gap-3">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {/* Product Image */}
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-xl border border-brand-green/10 overflow-visible flex-shrink-0">
                      <Image
                        src={productImage}
                        alt={t('ui.alt_package')}
                        fill
                        className="object-contain p-1"
                      />
                      {/* Quantity Badge on thumbnail */}
                      <div className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-brand-green to-brand-orange rounded-full flex items-center justify-center text-white text-xs font-bold z-30 shadow-lg border-2 border-white">
                        {index + 1}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-base sm:text-lg text-slate-900 mb-1 truncate">
                        {variant.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-500 mb-1">
                        {variant.size}
                      </p>
                      {(() => {
                        const orderTotal = variant.discountPrice || variant.price;
                        const hasFreeShipping = orderTotal >= countryConfig.business.freeShippingThreshold;
                        return hasFreeShipping && (
                          <p className="text-xs text-brand-green font-semibold">
                            {t('bundles.free_shipping')}
                          </p>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 min-w-fit">
                    {hasDiscount && (
                      <p className="mb-1 text-xs text-slate-400 line-through">
                        {formatPrice(originalPrice)}
                      </p>
                    )}
                    <div className="mb-1 text-lg sm:text-xl font-black text-brand-orange">
                      {formatPrice(discountPrice)}
                    </div>
                    {index > 0 && (
                      <p className="text-xs sm:text-sm text-slate-500">
                        {formatPrice(pricePerItem)} {t('bundles.per_item')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Selection Indicator */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected 
                      ? 'bg-brand-green border-brand-green' 
                      : 'border-slate-300'
                  }`}>
                    {isSelected && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                  {isSelected && (
                    <span className="text-sm font-semibold text-brand-green">
                      {t('bundles.selected')}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
