'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductVariant } from '@/config/products';
import { CountryConfig } from '@/config/countries';
import { BOGO_CONFIG as BOGO_COUPON_CONFIG, calculateBOGODiscount } from '@/config/coupons';
import { BOGO_CONFIG } from '@/utils/bogo-cookies';
import { useTranslations } from 'next-intl';
import { Gift, Check, Sparkles, Package, Clock, AlertTriangle } from 'lucide-react';

interface BOGOSelectorProps {
  baseVariant: ProductVariant; // The single unit variant (1 package)
  selectedQuantity: number;
  onQuantityChange: (quantity: number) => void;
  countryConfig: CountryConfig;
  className?: string;
  triggerShake?: boolean;
  productImage?: string;
}

export function BOGOSelector({
  baseVariant,
  selectedQuantity,
  onQuantityChange,
  countryConfig,
  className,
  triggerShake = false,
  productImage = '/images/products/fungel/fungel-box-only.png'
}: BOGOSelectorProps) {
  const t = useTranslations();
  const [isShaking, setIsShaking] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Trigger shake animation when triggerShake changes
  useEffect(() => {
    if (triggerShake) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 600);
      return () => clearTimeout(timer);
    }
  }, [triggerShake]);

  // Countdown timer - uses expiration date from centralized config
  useEffect(() => {
    // Use expiration date from BOGO_CONFIG
    const endDate = new Date(BOGO_CONFIG.expirationDate);
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = endDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Use discount price (1990) for BOGO - the "regular" price shown is fake/inflated
  const unitPrice = baseVariant.discountPrice || baseVariant.price;

  // Simple price formatter using the country's currency symbol
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('sr-RS', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' ' + countryConfig.currencySymbol;
  };

  // Generate quantity options: 1+1, 2+2, 3+3
  const quantityOptions = Array.from(
    { length: BOGO_COUPON_CONFIG.maxQuantity },
    (_, i) => i + 1
  );

  return (
    <div
      id="bogo-selector"
      className={`space-y-6 ${className} w-full max-w-full px-1 ${
        isShaking ? 'animate-shake' : ''
      }`}
    >
      {/* Professional Header with Urgency */}
      <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
        {/* Top Red Banner */}
        <div className="bg-red-600 text-white py-2 px-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="h-4 w-4 fill-white" />
            <span className="font-bold text-sm uppercase tracking-wider">{t('bogo.once_in_five_years')}</span>
          </div>
        </div>
        
        <div className="p-5 text-center">
          <h3 id="bogo-title" className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">
            {t('bogo.buy_one_get_one')}
          </h3>
          <p className="text-gray-600 font-medium">
            {t('bogo.select_quantity')}
          </p>
          
          {/* Clean Countdown Timer */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-3 text-red-600">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-bold uppercase">{t('bogo.offer_ends_in')}</span>
            </div>
            <div className="flex items-center gap-3">
              {[
                { val: timeLeft.days, label: t('bogo.days') },
                { val: timeLeft.hours, label: t('bogo.hours') },
                { val: timeLeft.minutes, label: t('bogo.minutes') },
                { val: timeLeft.seconds, label: t('bogo.seconds') }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="bg-gray-900 text-white rounded px-2 py-1 min-w-[40px] sm:min-w-[48px] text-center">
                    <span className="text-lg sm:text-xl font-bold tabular-nums">
                      {String(item.val).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium mt-1 uppercase">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOGO Options - Clean E-commerce Design */}
      <div className="space-y-3">
        {quantityOptions.map((qty) => {
          const isSelected = selectedQuantity === qty;
          const bogoCalc = calculateBOGODiscount(unitPrice, qty);
          
          // Badges - Clean solid colors
          const getBadgeInfo = () => {
            switch (qty) {
              case 2: return { text: t('bogo.most_popular'), color: 'bg-blue-600' };
              case 3: return { text: t('bogo.best_value'), color: 'bg-red-600' };
              default: return null;
            }
          };
          
          const badge = getBadgeInfo();

          return (
            <div
              key={qty}
              onClick={() => onQuantityChange(qty)}
              className={`relative rounded-xl cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-2 border-green-600 bg-green-50/30 shadow-md z-10'
                  : 'border border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {/* Top Badge */}
              {badge && (
                <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${badge.color} text-white px-3 py-0.5 rounded-full text-xs font-bold shadow-sm`}>
                  {badge.text}
                </div>
              )}

              <div className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
                  {/* Left: Selection & Info */}
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Radio Indicator */}
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'border-green-600 bg-green-600' : 'border-gray-300 bg-white'
                    }`}>
                      {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          {t('bogo.buy')} {qty} + {t('bogo.get')} {qty} {t('bogo.free')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-green-200">
                          +{qty} GRATIS
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Visual Representation (Images) */}
                  <div className="flex items-center justify-center gap-2 sm:gap-3 py-1 sm:py-0">
                    {/* Paid Group */}
                    <div className="flex items-center -space-x-3 sm:-space-x-4">
                      {Array.from({ length: Math.min(qty, 3) }).map((_, i) => (
                        <div 
                          key={`paid-${i}`} 
                          className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 border-white shadow-sm bg-white overflow-hidden z-${10-i}`}
                        >
                          <Image
                            src={productImage}
                            alt="Product"
                            fill
                            className="object-contain p-0.5"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Plus Sign */}
                    <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-xs shadow-inner">
                      +
                    </div>

                    {/* Free Group */}
                    <div className="flex items-center -space-x-3 sm:-space-x-4">
                      {Array.from({ length: Math.min(qty, 3) }).map((_, i) => (
                        <div 
                          key={`free-${i}`} 
                          className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 border-green-200 shadow-sm bg-green-50 overflow-hidden z-${10-i}`}
                        >
                          <Image
                            src={productImage}
                            alt="Free Product"
                            fill
                            className="object-contain p-0.5 opacity-90 mix-blend-multiply"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-green-500/10">
                            <Gift className="w-3 h-3 text-green-600 drop-shadow-sm" />
                          </div>
                          {/* Free Label Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-[6px] text-white text-center font-bold py-0.5">
                            GRATIS
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Price */}
                  <div className="text-center sm:text-right w-full sm:w-auto border-t sm:border-0 border-gray-100 pt-2 sm:pt-0 mt-1 sm:mt-0">
                    <div className="flex flex-row sm:flex-col items-baseline sm:items-end justify-center sm:justify-end gap-2 sm:gap-0">
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(bogoCalc.totalPaid * 2)}
                      </span>
                      <span className="text-xl font-bold text-brand-orange">
                        {formatPrice(bogoCalc.totalPaid)}
                      </span>
                    </div>
                    <p className="text-[10px] text-green-600 font-medium hidden sm:block mt-1">
                      {t('bogo.save')} {formatPrice(bogoCalc.freeValue)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust / Info Footer */}
      <div className="flex items-center justify-center gap-2 text-gray-500 text-xs mt-4">
        <Check className="h-3 w-3 text-green-600" />
        <span>{t('guarantee.title')}</span>
        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
        <Package className="h-3 w-3 text-blue-600" />
        <span>{t('bogo.ends_date', { date: '28.11' })}</span>
      </div>
    </div>
  );
}

