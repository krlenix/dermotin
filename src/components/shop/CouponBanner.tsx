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

/**
 * Baner aktivnog kupona (npr. POPUST20 iz reklame) u korpi i checkout-u.
 * Koralni „okvir ponude“ (DESIGN.md): sitan koralni tekst je coral-deep na coral-soft podlozi.
 */
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
      className={`coupon-banner-animate flex items-center gap-3 rounded-panel border-2 border-coral bg-coral-soft py-2.5 pl-3 pr-1.5 ${className ?? ''}`}
    >
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-coral-deep text-white">
        <TicketPercent className="h-5 w-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[0.9375rem] font-extrabold leading-snug text-coral-deep">
          {t('coupons.activated_title', { code: coupon.code })}
        </p>
        {benefitText && (
          <p className="text-[0.8125rem] font-medium leading-snug text-ink-soft">{benefitText}</p>
        )}
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={t('coupons.remove_coupon')}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-white hover:text-ink"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      )}
    </div>
  );
}
