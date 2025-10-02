export interface MarketingParams {
  campaign_id: string | null;
  adset_id: string | null;
  ad_id: string | null;
  medium: string;
}

const MARKETING_COOKIE_KEY = 'marketing-params';
const COOKIE_EXPIRY_DAYS = 30;

/**
 * Set marketing parameters in cookies
 * If new parameters are provided, they override existing ones
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
      medium: params.medium !== undefined ? params.medium : existing.medium,
    };

    // Set cookie with expiry
    const expires = new Date();
    expires.setDate(expires.getDate() + COOKIE_EXPIRY_DAYS);
    
    document.cookie = `${MARKETING_COOKIE_KEY}=${encodeURIComponent(JSON.stringify(merged))}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    
    // console.log('📊 Marketing cookies updated:', merged);
  } catch (error) {
    // console.error('❌ Failed to set marketing cookies:', error);
  }
}

/**
 * Get marketing parameters from cookies
 */
export function getMarketingCookies(): MarketingParams {
  if (typeof window === 'undefined') {
    return {
      campaign_id: null,
      adset_id: null,
      ad_id: null,
      medium: 'website'
    };
  }

  try {
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
        medium: parsed.medium || 'website'
      };
    }
  } catch (error) {
    // console.error('❌ Failed to parse marketing cookies:', error);
  }

  // Return defaults if no cookie or parsing failed
  return {
    campaign_id: null,
    adset_id: null,
    ad_id: null,
    medium: 'website'
  };
}

/**
 * Clear marketing cookies
 */
export function clearMarketingCookies(): void {
  if (typeof window === 'undefined') return;

  document.cookie = `${MARKETING_COOKIE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  // console.log('🗑️ Marketing cookies cleared');
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
 */
export function getMarketingCookiesFromHeaders(cookieHeader: string | null): MarketingParams {
  if (!cookieHeader) {
    return {
      campaign_id: null,
      adset_id: null,
      ad_id: null,
      medium: 'website'
    };
  }

  try {
    const cookies = cookieHeader.split(';');
    const marketingCookie = cookies.find(cookie => 
      cookie.trim().startsWith(`${MARKETING_COOKIE_KEY}=`)
    );

    if (marketingCookie) {
      const value = marketingCookie.split('=')[1];
      const decoded = decodeURIComponent(value);
      const parsed = JSON.parse(decoded) as MarketingParams;
      
      return {
        campaign_id: parsed.campaign_id || null,
        adset_id: parsed.adset_id || null,
        ad_id: parsed.ad_id || null,
        medium: parsed.medium || 'website'
      };
    }
  } catch (error) {
    // console.error('❌ Failed to parse marketing cookies from headers:', error);
  }

  return {
    campaign_id: null,
    adset_id: null,
    ad_id: null,
    medium: 'website'
  };
}
