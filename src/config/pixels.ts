/**
 * Pixel tracking configuration for Meta and TikTok
 * Easily editable pixel codes organized by country
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

// Pixel configuration by country - EASILY EDITABLE
export const PIXEL_CONFIG: CountryPixelConfig = {
  // Serbia
  rs: {
    meta: {
      pixelId: '12345', // Replace with actual Meta Pixel ID for Serbia
      enabled: true,
    },
    tiktok: {
      pixelId: '54321', // Replace with actual TikTok Pixel ID for Serbia
      enabled: true,
    },
  },
  
  // Bosnia and Herzegovina
  ba: {
    meta: {
      pixelId: 'YOUR_META_PIXEL_ID_BA', // Replace with actual Meta Pixel ID for Bosnia
      enabled: true,
    },
    tiktok: {
      pixelId: 'YOUR_TIKTOK_PIXEL_ID_BA', // Replace with actual TikTok Pixel ID for Bosnia
      enabled: true,
    },
  },
};

/**
 * Get pixel configuration for a specific country
 */
export function getPixelConfig(countryCode: string): PixelConfig {
  return PIXEL_CONFIG[countryCode] || PIXEL_CONFIG.rs;
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
