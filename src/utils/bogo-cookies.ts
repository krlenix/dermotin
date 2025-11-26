// BOGO Cookie Management
// Stores and retrieves BOGO coupon state in cookies

const BOGO_COOKIE_NAME = 'bogo_offer';
const BOGO_DISCOVERED_COOKIE = 'bogo_discovered';

// BOGO offer expiration date: 28.11.2025 at 23:59:59
const BOGO_EXPIRATION_DATE = new Date('2025-11-28T23:59:59');

export interface BOGOCookieData {
  couponCode: string;
  discoveredAt: string;
  source: 'url' | 'manual' | 'homepage';
}

/**
 * Check if the BOGO offer has expired
 */
export function isBOGOExpired(): boolean {
  return new Date() > BOGO_EXPIRATION_DATE;
}

/**
 * Get the expiration date for the BOGO cookie
 * Returns the offer end date or a past date if expired
 */
function getCookieExpiration(): Date {
  if (isBOGOExpired()) {
    // Return a past date to effectively delete the cookie
    return new Date(0);
  }
  return BOGO_EXPIRATION_DATE;
}

/**
 * Store BOGO coupon in cookie
 */
export function storeBOGOCookie(couponCode: string, source: 'url' | 'manual' | 'homepage' = 'manual'): void {
  if (typeof document === 'undefined') return;
  
  // Don't store if offer has expired
  if (isBOGOExpired()) {
    console.log('🎁 BOGO offer has expired, not storing cookie');
    return;
  }
  
  const data: BOGOCookieData = {
    couponCode: couponCode.toUpperCase(),
    discoveredAt: new Date().toISOString(),
    source
  };
  
  const expires = getCookieExpiration();
  const cookieValue = encodeURIComponent(JSON.stringify(data));
  
  document.cookie = `${BOGO_COOKIE_NAME}=${cookieValue}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  
  // Also set a flag that the offer was discovered (for showing banner)
  document.cookie = `${BOGO_DISCOVERED_COOKIE}=1; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  
  console.log('🎁 BOGO cookie stored:', data);
}

/**
 * Get BOGO coupon from cookie
 */
export function getBOGOCookie(): BOGOCookieData | null {
  if (typeof document === 'undefined') return null;
  
  // If offer has expired, clear the cookie and return null
  if (isBOGOExpired()) {
    clearBOGOCookie();
    return null;
  }
  
  const cookies = document.cookie.split(';');
  const bogoCookie = cookies.find(c => c.trim().startsWith(`${BOGO_COOKIE_NAME}=`));
  
  if (!bogoCookie) return null;
  
  try {
    const value = bogoCookie.split('=')[1];
    const data = JSON.parse(decodeURIComponent(value)) as BOGOCookieData;
    return data;
  } catch (error) {
    console.error('Error parsing BOGO cookie:', error);
    return null;
  }
}

/**
 * Check if BOGO was recently discovered (for showing banner)
 */
export function wasBOGODiscovered(): boolean {
  if (typeof document === 'undefined') return false;
  
  if (isBOGOExpired()) return false;
  
  const cookies = document.cookie.split(';');
  return cookies.some(c => c.trim().startsWith(`${BOGO_DISCOVERED_COOKIE}=`));
}

/**
 * Clear BOGO cookies
 */
export function clearBOGOCookie(): void {
  if (typeof document === 'undefined') return;
  
  // Set cookies with past expiration to delete them
  document.cookie = `${BOGO_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  document.cookie = `${BOGO_DISCOVERED_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  
  console.log('🎁 BOGO cookies cleared');
}

/**
 * Mark the discovery banner as seen (so it doesn't show again)
 */
export function markBOGOBannerSeen(): void {
  if (typeof document === 'undefined') return;
  
  if (isBOGOExpired()) return;
  
  const expires = getCookieExpiration();
  document.cookie = `bogo_banner_seen=1; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

/**
 * Check if the discovery banner has been seen
 */
export function wasBOGOBannerSeen(): boolean {
  if (typeof document === 'undefined') return false;
  
  const cookies = document.cookie.split(';');
  return cookies.some(c => c.trim().startsWith('bogo_banner_seen='));
}

