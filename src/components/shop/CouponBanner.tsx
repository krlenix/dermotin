'use client';

import { useTranslations } from 'next-intl';
import { TicketPercent, X } from 'lucide-react';
import type { Coupon } from '@/config/coupons';

interface CouponBannerProps {
  coupon: Coupon;
  formatPrice: (amount: number) => string;
  onRemove?: () => void;
  className?: string;
}

/** Animirani baner aktivnog kupona (npr. POPUST20 iz reklame) na product stranici i u korpi */
export function CouponBanner({ coupon, formatPrice, onRemove, className }: CouponBannerProps) {
  const t = useTranslations();

  const benefitText =
    coupon.type === 'percentage'
      ? t('coupons.percent_off_order', { percent: coupon.value })
      : coupon.type === 'absolute'
        ? t('coupons.amount_off_order', { amount: formatPrice(coupon.value) })
        : coupon.type === 'free_shipping'
          ? t('coupons.free_shipping_benefit')
          : coupon.description ?? '';

  return (
    <div
      className={`coupon-banner-animate relative overflow-hidden rounded-[1.1rem] border border-[#F3765D]/25 bg-[linear-gradient(100deg,#F3765D_0%,#e0654d_100%)] px-4 py-3 text-white shadow-[0_14px_30px_rgba(243,118,93,0.32)] ${className ?? ''}`}
    >
      <div className="coupon-shimmer pointer-events-none absolute inset-0" />
      <div className="relative flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
          <TicketPercent className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black leading-tight md:text-base">
            {t('coupons.activated_title', { code: coupon.code })}
          </p>
          <p className="text-xs font-semibold text-white/85 md:text-sm">{benefitText}</p>
        </div>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={t('coupons.remove_coupon')}
            className="shrink-0 rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/15 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
