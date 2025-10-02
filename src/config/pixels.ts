/**
 * Pixel tracking configuration for Meta and TikTok
 * Uses environment variables for pixel IDs and CAPI tokens
 */

export interface PixelConfig {
  meta: {
    pixelId: string;
    enabled: boolean;
    capi?: {
      accessToken: string;
      testEventCode?: string;
      enabled: boolean;
    };
  };
  tiktok: {
    pixelId: string;
    enabled: boolean;
  };
}

export interface CountryPixelConfig {
  [countryCode: string]: PixelConfig;
}

// Get pixel configuration for a specific country from environment variables
function getPixelConfigForCountry(countryCode: string): PixelConfig {
  const upperCountryCode = countryCode.toUpperCase();
  
  // Use direct access to environment variables - Next.js dynamic access doesn't work reliably on client
  let metaPixelId = '';
  let tiktokPixelId = '';
  let capiAccessToken = '';
  let capiTestEventCode = '';
  
  // Simple country-based configuration (e.g., NEXT_PUBLIC_META_PIXEL_RS)
  // No domain-specific logic - keeps it simple
  
  switch (upperCountryCode) {
    case 'RS':
      metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_RS || '';
      tiktokPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_RS || '';
      capiAccessToken = process.env.META_CAPI_TOKEN_RS || '';
      capiTestEventCode = process.env.META_CAPI_TEST_CODE_RS || '';
      break;
    case 'BA':
      metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_BA || '';
      tiktokPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_BA || '';
      capiAccessToken = process.env.META_CAPI_TOKEN_BA || '';
      capiTestEventCode = process.env.META_CAPI_TEST_CODE_BA || '';
      break;
    case 'BG':
      metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_BG || '';
      tiktokPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_BG || '';
      capiAccessToken = process.env.META_CAPI_TOKEN_BG || '';
      capiTestEventCode = process.env.META_CAPI_TEST_CODE_BG || '';
      break;
    case 'HR':
      metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_HR || '';
      tiktokPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_HR || '';
      capiAccessToken = process.env.META_CAPI_TOKEN_HR || '';
      capiTestEventCode = process.env.META_CAPI_TEST_CODE_HR || '';
      break;
    case 'ME':
      metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ME || '';
      tiktokPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ME || '';
      capiAccessToken = process.env.META_CAPI_TOKEN_ME || '';
      capiTestEventCode = process.env.META_CAPI_TEST_CODE_ME || '';
      break;
    case 'RO':
      metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_RO || '';
      tiktokPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_RO || '';
      capiAccessToken = process.env.META_CAPI_TOKEN_RO || '';
      capiTestEventCode = process.env.META_CAPI_TEST_CODE_RO || '';
      break;
    case 'EU':
      metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_EU || '';
      tiktokPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_EU || '';
      capiAccessToken = process.env.META_CAPI_TOKEN_EU || '';
      capiTestEventCode = process.env.META_CAPI_TEST_CODE_EU || '';
      break;
    default:
      // Fallback to dynamic access
      metaPixelId = process.env[`NEXT_PUBLIC_META_PIXEL_${upperCountryCode}`] || '';
      tiktokPixelId = process.env[`NEXT_PUBLIC_TIKTOK_PIXEL_${upperCountryCode}`] || '';
      capiAccessToken = process.env[`META_CAPI_TOKEN_${upperCountryCode}`] || '';
      capiTestEventCode = process.env[`META_CAPI_TEST_CODE_${upperCountryCode}`] || '';
      break;
  }
  
  // Check if pixel ID is valid (not empty and not a placeholder)
  // Allow any non-empty string that doesn't start with placeholder text
  const isValidMetaPixel = metaPixelId && !metaPixelId.startsWith('your_meta_pixel_id') && !metaPixelId.startsWith('your_actual_meta_pixel_id');
  const isValidTiktokPixel = tiktokPixelId && !tiktokPixelId.startsWith('your_tiktok_pixel_id') && !tiktokPixelId.startsWith('your_actual_tiktok_pixel_id');
  const isValidCapiToken = capiAccessToken && !capiAccessToken.startsWith('your_');
  
  const config = {
    meta: {
      pixelId: metaPixelId,
      enabled: !!isValidMetaPixel,
      capi: isValidMetaPixel ? {
        accessToken: capiAccessToken,
        testEventCode: capiTestEventCode || undefined,
        enabled: !!isValidCapiToken,
      } : undefined,
    },
    tiktok: {
      pixelId: tiktokPixelId,
      enabled: !!isValidTiktokPixel,
    },
  };
  
  // Debug logging for CAPI configuration (commented out for production)
  // console.log(`📊 Pixel Config for ${upperCountryCode}:`, {
  //   metaPixelId: metaPixelId ? `${metaPixelId.substring(0, 10)}...` : 'NOT SET',
  //   isValidMetaPixel,
  //   capiAccessToken: capiAccessToken ? `${capiAccessToken.substring(0, 20)}...` : 'NOT SET',
  //   isValidCapiToken,
  //   capiTestEventCode: capiTestEventCode || 'NOT SET',
  //   capiEnabled: config.meta.capi?.enabled,
  // });
  
  return config;
}

// Cache for pixel configurations to avoid repeated environment variable lookups
const pixelConfigCache: CountryPixelConfig = {};

/**
 * Get pixel configuration for a specific country
 */
export function getPixelConfig(countryCode: string): PixelConfig {
  // Use cache to avoid repeated environment variable lookups
  if (!pixelConfigCache[countryCode]) {
    pixelConfigCache[countryCode] = getPixelConfigForCountry(countryCode);
  }
  
  return pixelConfigCache[countryCode];
}

/**
 * Meta Pixel Events - Latest event names as of 2024
 */
export const META_EVENTS = {
  PAGE_VIEW: 'PageView',
  VIEW_CONTENT: 'ViewContent',
  INITIATE_CHECKOUT: 'InitiateCheckout',
  PURCHASE: 'Purchase',
  ADD_TO_CART: 'AddToCart',
  LEAD: 'Lead',
  COMPLETE_REGISTRATION: 'CompleteRegistration',
} as const;

/**
 * TikTok Pixel Events - Latest event names as of 2024
 */
export const TIKTOK_EVENTS = {
  PAGE_VIEW: 'ViewContent', // TikTok equivalent of PageView
  VIEW_CONTENT: 'ViewContent',
  INITIATE_CHECKOUT: 'InitiateCheckout', // TikTok has this event
  PURCHASE: 'CompletePayment', // TikTok's purchase event
  ADD_TO_CART: 'AddToCart',
  LEAD: 'SubmitForm',
  COMPLETE_REGISTRATION: 'CompleteRegistration',
} as const;

export type MetaEvent = keyof typeof META_EVENTS;
export type TikTokEvent = keyof typeof TIKTOK_EVENTS;
