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
  
  // Use direct access to environment variables - Next.js dynamic access doesn't work reliably on client
  let metaPixelId = '';
  let tiktokPixelId = '';
  
  // Map country codes to their specific environment variables
  switch (upperCountryCode) {
    case 'RS':
      metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_RS || '';
      tiktokPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_RS || '';
      break;
    case 'BA':
      metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_BA || '';
      tiktokPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_BA || '';
      break;
    case 'BG':
      metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_BG || '';
      tiktokPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_BG || '';
      break;
    case 'HR':
      metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_HR || '';
      tiktokPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_HR || '';
      break;
    case 'ME':
      metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ME || '';
      tiktokPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ME || '';
      break;
    case 'RO':
      metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_RO || '';
      tiktokPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_RO || '';
      break;
    case 'EU':
      metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_EU || '';
      tiktokPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_EU || '';
      break;
    default:
      // Fallback to dynamic access (might not work on client)
      metaPixelId = process.env[`NEXT_PUBLIC_META_PIXEL_${upperCountryCode}`] || '';
      tiktokPixelId = process.env[`NEXT_PUBLIC_TIKTOK_PIXEL_${upperCountryCode}`] || '';
      break;
  }
  
  // Check if pixel ID is valid (not empty and not a placeholder)
  // Allow any non-empty string that doesn't start with placeholder text
  const isValidMetaPixel = metaPixelId && !metaPixelId.startsWith('your_meta_pixel_id') && !metaPixelId.startsWith('your_actual_meta_pixel_id');
  const isValidTiktokPixel = tiktokPixelId && !tiktokPixelId.startsWith('your_tiktok_pixel_id') && !tiktokPixelId.startsWith('your_actual_tiktok_pixel_id');
  
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
