// BOGO Cookie Management
// Stores and retrieves BOGO coupon state in cookies

const BOGO_COOKIE_NAME = 'bogo_offer';
const BOGO_DISCOVERED_COOKIE = 'bogo_discovered';

// ============================================================
// BOGO OFFER CONFIGURATION - EDIT THESE VALUES TO CONTROL OFFER
// ============================================================

/**
 * BOGO Offer Configuration
 * 
 * To enable a new BOGO offer:
 * 1. Set BOGO_ENABLED to true
 * 2. Set BOGO_EXPIRATION_DATE to the new end date (format: 'YYYY-MM-DDTHH:mm:ss')
 * 3. Optionally update BOGO_COUPON_CODE if using a different code
 * 4. Update CONFIG_VERSION to force cache invalidation
 * 
 * To disable the BOGO offer:
 * 1. Set BOGO_ENABLED to false
 * 2. Update CONFIG_VERSION to force cache invalidation
 */
export const BOGO_CONFIG = {
  // Master switch - set to false to completely disable BOGO feature
  enabled: true,
  
  // Coupon code that triggers BOGO
  couponCode: '1PLUS1',
  
  // Expiration date and time (local time)
  // Format: 'YYYY-MM-DDTHH:mm:ss'
  expirationDate: '2025-11-28T23:59:59',
  
  // Maximum quantity for BOGO (e.g., 3 means max 3+3)
  maxQuantity: 3,
  
  // Config version - INCREMENT THIS when you change any setting above
  // This helps invalidate browser localStorage cache
  configVersion: 1,
};

// ============================================================
// END OF CONFIGURATION
// ============================================================

// Parse the expiration date from config
const BOGO_EXPIRATION_DATE = new Date(BOGO_CONFIG.expirationDate);

export interface BOGOCookieData {
  couponCode: string;
  discoveredAt: string;
  source: 'url' | 'manual' | 'homepage';
  configVersion?: number; // Track which config version created this cookie
}

/**
 * Check if the BOGO offer is currently active
 * Returns false if:
 * - BOGO_ENABLED is false
 * - Current date is past BOGO_EXPIRATION_DATE
 */
export function isBOGOActive(): boolean {
  if (!BOGO_CONFIG.enabled) return false;
  return new Date() <= BOGO_EXPIRATION_DATE;
}

/**
 * Check if the BOGO offer has expired
 * @deprecated Use isBOGOActive() instead for clearer semantics
 */
export function isBOGOExpired(): boolean {
  return !isBOGOActive();
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
  
  // Don't store if offer is not active
  if (!isBOGOActive()) {
    console.log('🎁 BOGO offer is not active, not storing cookie');
    return;
  }
  
  const data: BOGOCookieData = {
    couponCode: couponCode.toUpperCase(),
    discoveredAt: new Date().toISOString(),
    source,
    configVersion: BOGO_CONFIG.configVersion
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
  
  // If offer is not active, clear the cookie and return null
  if (!isBOGOActive()) {
    clearBOGOCookie();
    return null;
  }
  
  const cookies = document.cookie.split(';');
  const bogoCookie = cookies.find(c => c.trim().startsWith(`${BOGO_COOKIE_NAME}=`));
  
  if (!bogoCookie) return null;
  
  try {
    const value = bogoCookie.split('=')[1];
    const data = JSON.parse(decodeURIComponent(value)) as BOGOCookieData;
    
    // Check if cookie was created with an older config version - invalidate if so
    if (data.configVersion !== BOGO_CONFIG.configVersion) {
      console.log('🎁 BOGO cookie config version mismatch, clearing old cookie');
      clearBOGOCookie();
      return null;
    }
    
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
  
  if (!isBOGOActive()) return false;
  
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
  
  if (!isBOGOActive()) return;
  
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

/**
 * Initialize BOGO system - call this on app load
 * Clears stale cookies and localStorage if offer is expired or config changed
 */
export function initializeBOGO(): { isActive: boolean; wasCleared: boolean } {
  if (typeof document === 'undefined') {
    return { isActive: false, wasCleared: false };
  }
  
  let wasCleared = false;
  
  // Check if BOGO is currently active
  const isActive = isBOGOActive();
  
  if (!isActive) {
    // Offer is not active - clear all BOGO cookies
    clearBOGOCookie();
    wasCleared = true;
    console.log('🎁 BOGO offer not active - cleared all cookies');
  } else {
    // Check if existing cookie has outdated config version
    const existingCookie = getBOGOCookie();
    if (existingCookie === null) {
      // getBOGOCookie already handles version mismatch and clears
      // Check if there WAS a cookie that got cleared
      const cookies = document.cookie.split(';');
      const hadCookie = cookies.some(c => c.trim().startsWith(`${BOGO_COOKIE_NAME}=`));
      if (hadCookie) {
        wasCleared = true;
      }
    }
  }
  
  return { isActive, wasCleared };
}

