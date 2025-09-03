/**
 * Pixel tracking configuration for Meta and TikTok
 * Uses environment variables for pixel IDs
 */

export interface PixelConfig {
  meta: {
    pixelId: string;
    enabled: boolean;
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
  
  // Debug: Log what we're looking for and what we find
  console.log('🔧 getPixelConfigForCountry Debug:', {
    countryCode,
    upperCountryCode,
    isClient: typeof window !== 'undefined',
    processEnv: typeof process !== 'undefined' ? 'available' : 'not available'
  });
  
  // Try to get environment variables
  let metaPixelId = '';
  let tiktokPixelId = '';
  
  if (typeof process !== 'undefined' && process.env) {
    metaPixelId = process.env[`NEXT_PUBLIC_META_PIXEL_${upperCountryCode}`] || '';
    tiktokPixelId = process.env[`NEXT_PUBLIC_TIKTOK_PIXEL_${upperCountryCode}`] || '';
    
    console.log('🔧 Environment variables found:', {
      metaKey: `NEXT_PUBLIC_META_PIXEL_${upperCountryCode}`,
      tiktokKey: `NEXT_PUBLIC_TIKTOK_PIXEL_${upperCountryCode}`,
      metaValue: metaPixelId,
      tiktokValue: tiktokPixelId,
      allPixelEnvs: Object.keys(process.env).filter(key => key.includes('PIXEL'))
    });
  } else {
    console.log('🔧 process.env not available');
  }
  
  // Check if pixel ID is valid (not empty and not a placeholder)
  // Allow any non-empty string that doesn't start with placeholder text
  const isValidMetaPixel = metaPixelId && !metaPixelId.startsWith('your_meta_pixel_id');
  const isValidTiktokPixel = tiktokPixelId && !tiktokPixelId.startsWith('your_tiktok_pixel_id');
  
  const config = {
    meta: {
      pixelId: metaPixelId,
      enabled: !!isValidMetaPixel,
    },
    tiktok: {
      pixelId: tiktokPixelId,
      enabled: !!isValidTiktokPixel,
    },
  };
  
  console.log('🔧 Final pixel config:', config);
  
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
