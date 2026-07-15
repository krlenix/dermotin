// Aktivni kupon kod (npr. iz reklame: ?coupon_code=POPUST20) — čuva se u kolačiću
// da preživi navigaciju product stranica → korpa → checkout, do zaključene porudžbine.

const COUPON_COOKIE_NAME = 'dermotin_coupon';
const COUPON_TTL_DAYS = 7;
export const COUPON_CLEARED_EVENT = 'dermotin:coupon-cleared';

export interface StoredCouponData {
  code: string;
  source: 'url' | 'manual';
  storedAt: string;
}

/** Čita kupon kod iz URL-a — podržava i FunnelKit format (?coupon_code=) i stari (?coupon=). */
export function getCouponCodeFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const code = params.get('coupon_code') || params.get('coupon');
  return code ? code.trim().toUpperCase() : null;
}

export function storeCouponCookie(code: string, source: 'url' | 'manual' = 'manual'): void {
  if (typeof document === 'undefined') return;
  const data: StoredCouponData = {
    code: code.trim().toUpperCase(),
    source,
    storedAt: new Date().toISOString(),
  };
  const expires = new Date(Date.now() + COUPON_TTL_DAYS * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${COUPON_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(data))}; expires=${expires}; path=/; SameSite=Lax`;
}

export function getStoredCoupon(): StoredCouponData | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.split('; ').find((row) => row.startsWith(`${COUPON_COOKIE_NAME}=`));
  if (!match) return null;
  try {
    const data = JSON.parse(decodeURIComponent(match.slice(COUPON_COOKIE_NAME.length + 1))) as StoredCouponData;
    return typeof data.code === 'string' && data.code.length > 0 ? data : null;
  } catch {
    return null;
  }
}

export function clearCouponCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${COUPON_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
  const url = new URL(window.location.href);
  const hadCouponInUrl = url.searchParams.has('coupon_code') || url.searchParams.has('coupon');
  url.searchParams.delete('coupon_code');
  url.searchParams.delete('coupon');
  if (hadCouponInUrl) {
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  }
  window.dispatchEvent(new Event(COUPON_CLEARED_EVENT));
}

/**
 * Glavna ulazna tačka na stranicama: uhvati kupon iz URL-a (i upamti ga),
 * a ako ga u URL-u nema, vrati ranije upamćen kod.
 */
export function getActiveCouponCode(): string | null {
  const fromUrl = getCouponCodeFromUrl();
  if (fromUrl) {
    storeCouponCookie(fromUrl, 'url');
    return fromUrl;
  }
  return getStoredCoupon()?.code ?? null;
}
