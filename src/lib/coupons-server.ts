// Serversko razrešavanje kupona — jedini izvor istine za popust u porudžbini.
// Redosled kao i ranije u browseru: BOGO → statički kuponi (admin panel) → OMS afilijacijski kodovi.

import { getBOGOCoupon, getCouponByCode, type Coupon } from '@/config/coupons';
import { lookupAffiliateCode } from '@/lib/affiliate-codes';

export type CouponError = 'invalid_code' | 'not_valid_country' | 'min_order_not_met' | 'unavailable';

export type CouponResolution =
  | { valid: true; coupon: Coupon }
  | { valid: false; error: CouponError; coupon?: Coupon };

const CODE_PATTERN = /^[A-Z0-9_-]{2,40}$/;

export function normalizeCouponCode(code: unknown): string | null {
  if (typeof code !== 'string') return null;
  const normalized = code.trim().toUpperCase();
  return CODE_PATTERN.test(normalized) ? normalized : null;
}

export async function resolveCoupon(code: string, subtotal: number, countryCode: string): Promise<CouponResolution> {
  const normalized = normalizeCouponCode(code);
  if (!normalized) return { valid: false, error: 'invalid_code' };

  const bogo = getBOGOCoupon(normalized);
  if (bogo) return { valid: true, coupon: bogo };

  const staticCoupon = getCouponByCode(normalized);
  if (staticCoupon && staticCoupon.type !== 'bogo') {
    if (staticCoupon.countries && !staticCoupon.countries.includes(countryCode.toLowerCase())) {
      return { valid: false, error: 'not_valid_country' };
    }
    if (staticCoupon.minOrderValue && subtotal < staticCoupon.minOrderValue) {
      return { valid: false, error: 'min_order_not_met', coupon: staticCoupon };
    }
    return { valid: true, coupon: staticCoupon };
  }

  const affiliate = await lookupAffiliateCode(normalized, countryCode);
  if (affiliate.status === 'found') return { valid: true, coupon: affiliate.coupon };
  if (affiliate.status === 'unavailable') return { valid: false, error: 'unavailable' };
  return { valid: false, error: 'invalid_code' };
}
