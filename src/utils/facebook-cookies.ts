/**
 * Facebook Cookie Utilities
 * Extracts and manages Facebook pixel cookies (_fbp and _fbc) for CAPI event deduplication
 * 
 * Based on Meta's official documentation:
 * https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/fbp-and-fbc
 */

/**
 * Get a cookie value by name
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  
  return null;
}

/**
 * Set a cookie with proper domain and expiration
 */
function setCookie(name: string, value: string, days: number = 90): void {
  if (typeof document === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  
  // Get the root domain (e.g., example.com from www.example.com)
  const hostname = window.location.hostname;
  const domain = hostname.split('.').slice(-2).join('.');
  
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; domain=.${domain}; SameSite=Lax`;
}

/**
 * Get the _fbp cookie value (Facebook Browser ID)
 * This cookie is automatically set by the Facebook Pixel and uniquely identifies the browser
 * 
 * Format: fb.{domain}.{timestamp}.{random}
 * Example: fb.1.1554763741205.1098115397
 */
export function getFacebookBrowserId(): string | null {
  return getCookie('_fbp');
}

/**
 * Initialize and store _fbc cookie if fbclid is present in URL
 * This should be called on page load to capture Facebook ad clicks
 * 
 * Format: fb.{subdomain_index}.{creation_time}.{fbclid}
 * - subdomain_index: 1 for most cases (server-side generation)
 * - creation_time: UNIX timestamp in milliseconds when fbclid was first observed
 * - fbclid: The Facebook Click ID from the URL parameter
 * 
 * Example: fb.1.1554763741205.IwAR2F4-dbP0l7Mn1IawQQGCINEz7PYXQvwjNwB_qa2ofrHyiLjcbCRxTDGrc
 */
export function initializeFacebookClickId(): void {
  if (typeof window === 'undefined') return;
  
  // Check if _fbc cookie already exists
  const existingFbc = getCookie('_fbc');
  if (existingFbc) return; // Don't overwrite existing _fbc
  
  // Check if fbclid is in the URL
  const urlParams = new URLSearchParams(window.location.search);
  const fbclid = urlParams.get('fbclid');
  
  if (fbclid) {
    // Create _fbc cookie value according to Meta specification
    // Format: fb.{subdomain_index}.{creation_time}.{fbclid}
    const subdomainIndex = 1; // Use 1 for server-side generation as per Meta docs
    const creationTime = Date.now(); // UNIX timestamp in milliseconds
    const fbcValue = `fb.${subdomainIndex}.${creationTime}.${fbclid}`;
    
    // Store the cookie (expires in 90 days as per Meta recommendation)
    setCookie('_fbc', fbcValue, 90);
  }
}

/**
 * Get the _fbc cookie value (Facebook Click ID)
 * This cookie captures the click ID when a user clicks on a Facebook ad
 * 
 * Note: Call initializeFacebookClickId() on page load to ensure this cookie is set
 */
export function getFacebookClickId(): string | null {
  return getCookie('_fbc');
}

/**
 * Get all Facebook tracking data for CAPI
 * This combines both _fbp (browser ID) and _fbc (click ID) for optimal event matching
 */
export interface FacebookTrackingData {
  fbp: string | null;
  fbc: string | null;
}

export function getFacebookTrackingData(): FacebookTrackingData {
  // Ensure _fbc is initialized from URL if present
  initializeFacebookClickId();
  
  return {
    fbp: getFacebookBrowserId(),
    fbc: getFacebookClickId(),
  };
}

