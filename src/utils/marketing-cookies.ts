export interface MarketingParams {
  campaign_id: string | null;
  adset_id: string | null;
  ad_id: string | null;
  aff_id: string | null;
  medium: string;
}

const MARKETING_COOKIE_KEY = 'marketing-params';
const COOKIE_EXPIRY_DAYS = 30;
const TEMP_STORAGE_KEY = 'temp-marketing-params'; // For storing params before consent

// Debug logger - ONLY works in development (localhost), never in production
const debugLog = (message: string, data?: unknown) => {
  if (process.env.NODE_ENV === 'development') {
    if (data !== undefined) {
      console.log(message, data);
    } else {
      console.log(message);
    }
  }
}

/**
 * Set marketing parameters in cookies
 * Stores immediately in sessionStorage (always)
 * Stores in cookies only if consent is given OR user is not from EU
 */
export function setMarketingCookies(params: Partial<MarketingParams>): void {
  if (typeof window === 'undefined') return;

  try {
    // Get existing parameters
    const existing = getMarketingCookies();
    
    // Merge with new parameters (new ones override existing)
    const merged: MarketingParams = {
      campaign_id: params.campaign_id !== undefined ? params.campaign_id : existing.campaign_id,
      adset_id: params.adset_id !== undefined ? params.adset_id : existing.adset_id,
      ad_id: params.ad_id !== undefined ? params.ad_id : existing.ad_id,
      aff_id: params.aff_id !== undefined ? params.aff_id : existing.aff_id,
      medium: params.medium !== undefined ? params.medium : existing.medium,
    };

    // ALWAYS store in sessionStorage (this is fine for GDPR)
    sessionStorage.setItem(TEMP_STORAGE_KEY, JSON.stringify(merged));
    debugLog('📊 Marketing params stored in sessionStorage:', merged);
    
    // Check if we can store in cookies (for server-side access)
    const consent = localStorage.getItem('cookie-consent');
    const canUseCookies = !consent || JSON.parse(consent).marketing === true;
    
    if (canUseCookies) {
      const expires = new Date();
      expires.setDate(expires.getDate() + COOKIE_EXPIRY_DAYS);
      
      document.cookie = `${MARKETING_COOKIE_KEY}=${encodeURIComponent(JSON.stringify(merged))}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
      debugLog('📊 Marketing cookies updated:', merged);
    } else {
      debugLog('⚠️ Waiting for cookie consent before storing in cookies');
    }
  } catch {
    debugLog('❌ Failed to set marketing cookies');
  }
}

/**
 * Get marketing parameters from cookies or temporary storage
 * Returns data from cookies if consent given, or from sessionStorage if awaiting consent
 */
export function getMarketingCookies(): MarketingParams {
  if (typeof window === 'undefined') {
    return {
      campaign_id: null,
      adset_id: null,
      ad_id: null,
      aff_id: null,
      medium: 'website'
    };
  }

  try {
    // First, try to get from cookies (if consent given)
    const cookies = document.cookie.split(';');
    const marketingCookie = cookies.find(cookie => 
      cookie.trim().startsWith(`${MARKETING_COOKIE_KEY}=`)
    );

    if (marketingCookie) {
      const value = marketingCookie.split('=')[1];
      const decoded = decodeURIComponent(value);
      const parsed = JSON.parse(decoded) as MarketingParams;
      
      // Ensure all required fields exist with defaults
      return {
        campaign_id: parsed.campaign_id || null,
        adset_id: parsed.adset_id || null,
        ad_id: parsed.ad_id || null,
        aff_id: parsed.aff_id || null,
        medium: parsed.medium || 'website'
      };
    }

    // If no cookie, check temporary storage
    const tempData = sessionStorage.getItem(TEMP_STORAGE_KEY);
    if (tempData) {
      const parsed = JSON.parse(tempData) as MarketingParams;
      return {
        campaign_id: parsed.campaign_id || null,
        adset_id: parsed.adset_id || null,
        ad_id: parsed.ad_id || null,
        aff_id: parsed.aff_id || null,
        medium: parsed.medium || 'website'
      };
    }
  } catch {
    debugLog('❌ Failed to parse marketing cookies');
  }

  // Return defaults if no cookie or parsing failed
  return {
    campaign_id: null,
    adset_id: null,
    ad_id: null,
    aff_id: null,
    medium: 'website'
  };
}

/**
 * Clear marketing cookies and temporary storage
 */
export function clearMarketingCookies(): void {
  if (typeof window === 'undefined') return;

  document.cookie = `${MARKETING_COOKIE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  sessionStorage.removeItem(TEMP_STORAGE_KEY);
  debugLog('🗑️ Marketing cookies cleared');
}

/**
 * Extract marketing parameters from URL search params
 * Note: fbclid is NOT a campaign_id - it's a Facebook Click ID used for attribution only
 */
export function extractMarketingParamsFromURL(searchParams: URLSearchParams): Partial<MarketingParams> {
  const params: Partial<MarketingParams> = {};

  // Extract campaign_id (from actual campaign tracking parameters)
  // Do NOT confuse with fbclid (Facebook Click ID for attribution)
  const campaignId = searchParams.get('campaign_id') || 
                     searchParams.get('utm_campaign') ||
                     searchParams.get('campaign');
  if (campaignId) {
    params.campaign_id = campaignId;
  }

  // Extract adset_id
  const adsetId = searchParams.get('adset_id') ||
                  searchParams.get('utm_adset');
  if (adsetId) {
    params.adset_id = adsetId;
  }

  // Extract ad_id
  const adId = searchParams.get('ad_id') ||
               searchParams.get('utm_ad');
  if (adId) {
    params.ad_id = adId;
  }

  // Extract aff_id (affiliate ID)
  const affId = searchParams.get('aff_id') ||
                searchParams.get('affiliate_id');
  if (affId) {
    params.aff_id = affId;
  }

  // Extract medium (utm_medium, source, etc.)
  const medium = searchParams.get('utm_medium') || 
                searchParams.get('medium') || 
                searchParams.get('source') ||
                searchParams.get('utm_source');
  if (medium) {
    params.medium = medium;
  } else if (searchParams.has('fbclid')) {
    // If fbclid is present but no explicit medium, it's from Facebook
    params.medium = 'facebook';
  }

  return params;
}

/**
 * Server-side function to get marketing cookies from request headers
 * Logs only in development mode for debugging
 */
export function getMarketingCookiesFromHeaders(cookieHeader: string | null): MarketingParams {
  const isDev = process.env.NODE_ENV === 'development';
  
  if (!cookieHeader) {
    if (isDev) console.log('⚠️ No cookie header found in request');
    return {
      campaign_id: null,
      adset_id: null,
      ad_id: null,
      aff_id: null,
      medium: 'website'
    };
  }

  try {
    const cookies = cookieHeader.split(';');
    const marketingCookie = cookies.find(cookie => 
      cookie.trim().startsWith(`${MARKETING_COOKIE_KEY}=`)
    );

    if (marketingCookie) {
      // Split only on the first '=' to handle URL-encoded values that may contain '='
      const value = marketingCookie.trim().substring(marketingCookie.trim().indexOf('=') + 1);
      const decoded = decodeURIComponent(value);
      const parsed = JSON.parse(decoded) as MarketingParams;
      
      if (isDev) console.log('✅ Marketing cookies parsed from headers:', parsed);
      
      return {
        campaign_id: parsed.campaign_id || null,
        adset_id: parsed.adset_id || null,
        ad_id: parsed.ad_id || null,
        aff_id: parsed.aff_id || null,
        medium: parsed.medium || 'website'
      };
    } else {
      if (isDev) {
        console.log('⚠️ marketing-params cookie not found in header. Available cookies:', 
          cookies.map(c => c.trim().split('=')[0]).join(', '));
      }
    }
  } catch {
    if (isDev) console.log('❌ Failed to parse marketing cookies from headers');
  }

  return {
    campaign_id: null,
    adset_id: null,
    ad_id: null,
    aff_id: null,
    medium: 'website'
  };
}
