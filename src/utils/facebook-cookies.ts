/**
 * Facebook Cookie Utilities
 * Handles _fbp and _fbc cookie management for CAPI tracking
 */

/**
 * Get Facebook tracking cookies from cookie header string
 */
export function getFacebookTrackingData(cookieHeader: string | null): {
  fbp: string | null;
  fbc: string | null;
} {
  if (!cookieHeader) {
    return { fbp: null, fbc: null };
  }

  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return {
    fbp: cookies._fbp || null,
    fbc: cookies._fbc || null,
  };
}

/**
 * Extract fbclid from URL and format as _fbc cookie value
 * Facebook _fbc cookie format: fb.{subdomainIndex}.{timestamp}.{fbclid}
 */
export function getFbcFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const fbclid = urlObj.searchParams.get('fbclid');
    
    if (!fbclid) {
      return null;
    }

    // Format: fb.1.{timestamp}.{fbclid}
    // 1 = subdomain index (1 for root domain)
    // timestamp = current time in milliseconds
    const timestamp = Date.now();
    return `fb.1.${timestamp}.${fbclid}`;
  } catch (error) {
    console.error('Error extracting fbclid from URL:', error);
    return null;
  }
}

/**
 * Generate _fbp cookie value (Facebook browser ID)
 * Format: fb.{subdomainIndex}.{timestamp}.{randomId}
 */
export function generateFbp(): string {
  const timestamp = Date.now();
  const randomId = Math.floor(Math.random() * 2147483647); // Random 32-bit integer
  return `fb.1.${timestamp}.${randomId}`;
}

/**
 * Set Facebook cookies in the browser
 * This is a fallback when the Meta Pixel isn't loading
 */
export function setFacebookCookies(fbclid?: string | null): {
  fbp: string;
  fbc: string | null;
} {
  if (typeof window === 'undefined') {
    return { fbp: '', fbc: null };
  }

  // Check if cookies already exist
  const existingFbp = document.cookie
    .split('; ')
    .find(row => row.startsWith('_fbp='))
    ?.split('=')[1];

  const existingFbc = document.cookie
    .split('; ')
    .find(row => row.startsWith('_fbc='))
    ?.split('=')[1];

  let fbp = existingFbp;
  let fbc = existingFbc || null;

  // Generate _fbp if it doesn't exist
  if (!fbp) {
    fbp = generateFbp();
    // Set cookie for 90 days (Meta's default)
    const expires = new Date();
    expires.setDate(expires.getDate() + 90);
    document.cookie = `_fbp=${fbp}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    // console.log('✅ Created _fbp cookie:', fbp);
  }

  // Create _fbc from fbclid if provided and doesn't exist
  if (fbclid && !fbc) {
    fbc = `fb.1.${Date.now()}.${fbclid}`;
    // Set cookie for 7 days (Meta's default for _fbc)
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    document.cookie = `_fbc=${fbc}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    // console.log('✅ Created _fbc cookie from fbclid:', fbc);
  }

  return { fbp: fbp || '', fbc };
}

/**
 * Extract fbclid from current URL and create cookies
 * Call this on page load as a fallback when Meta Pixel isn't working
 */
export function initializeFacebookTracking(): {
  fbp: string;
  fbc: string | null;
} {
  if (typeof window === 'undefined') {
    return { fbp: '', fbc: null };
  }

  // Get fbclid from URL
  const urlParams = new URLSearchParams(window.location.search);
  const fbclid = urlParams.get('fbclid');

  // Set cookies
  return setFacebookCookies(fbclid);
}
