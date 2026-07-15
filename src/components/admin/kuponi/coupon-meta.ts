import type { CouponType } from '@/config/coupons';

/**
 * Zajedničke labele, boje i helperi za admin stranicu „Kuponi".
 */

export const COUPON_TYPE_LABELS: Record<CouponType, string> = {
  percentage: 'Procenat',
  absolute: 'Fiksni iznos',
  free_shipping: 'Besplatna dostava',
  bogo: '1+1 GRATIS',
};

export const COUPON_TYPE_BADGE_CLASSES: Record<CouponType, string> = {
  percentage: 'bg-green-100 text-green-800 border-green-200',
  absolute: 'bg-blue-100 text-blue-800 border-blue-200',
  free_shipping: 'bg-orange-100 text-orange-800 border-orange-200',
  bogo: 'bg-purple-100 text-purple-800 border-purple-200',
};

export const COUPON_TYPE_ORDER: CouponType[] = ['percentage', 'absolute', 'free_shipping', 'bogo'];

export const COUNTRY_OPTIONS = ['rs', 'ba', 'me', 'hr'] as const;
export type CountryCode = (typeof COUNTRY_OPTIONS)[number];

export const COUPON_CODE_REGEX = /^[A-Z0-9_-]+$/;

/** BOGO konfiguracija kako je vraća GET /api/admin/coupons */
export interface BogoSettings {
  enabled: boolean;
  couponCode: string;
  expirationDate: string; // 'YYYY-MM-DDTHH:mm:ss'
  maxQuantity: number;
  configVersion: number;
}

/** Prikaz vrednosti kupona u listi ("20%" / "500" / "—") */
export function formatCouponValue(type: CouponType, value: number): string {
  if (type === 'percentage') return `${value}%`;
  if (type === 'absolute') return String(value);
  return '—';
}

/** ISO datum ('YYYY-MM-DDTHH:mm:ss') → vrednost za <input type="datetime-local"> */
export function isoToLocalInput(iso: string | undefined): string {
  if (!iso) return '';
  return iso.slice(0, 16);
}

/** Vrednost iz <input type="datetime-local"> ('YYYY-MM-DDTHH:mm') → 'YYYY-MM-DDTHH:mm:ss' */
export function localInputToIso(local: string): string {
  if (!local) return '';
  return local.length === 16 ? `${local}:00` : local;
}

/** Čitljiv prikaz ISO datuma, npr. "31.12.2026. 23:59" */
export function formatDateTimeDisplay(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${dd}.${mm}.${date.getFullYear()}. ${hh}:${min}`;
}

/** Srpska množina za „kupon" (1 kupon, 2 kupona, 5 kupona) */
export function pluralKupon(count: number): string {
  return count % 10 === 1 && count % 100 !== 11 ? 'kupon' : 'kupona';
}

/** Srpska množina za „aktivan" (1 aktivan, 2 aktivna, 5 aktivnih) */
export function pluralAktivan(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return 'aktivan';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'aktivna';
  return 'aktivnih';
}
