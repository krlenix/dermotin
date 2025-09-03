/**
 * Temporary test version of pixels config with hardcoded values
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

/**
 * Test pixel configuration with hardcoded values
 */
export function getPixelConfigTest(countryCode: string): PixelConfig {

  
  // Hardcoded test values
  const config = {
    meta: {
      pixelId: '1234567890',
      enabled: true,
    },
    tiktok: {
      pixelId: '0987654321',
      enabled: true,
    },
  };
  

  
  return config;
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
  INITIATE_CHECKOUT: 'InitiateCheckout', // TikTok standard event
  PURCHASE: 'CompletePayment', // TikTok's purchase event (not 'Purchase')
  ADD_TO_CART: 'AddToCart',
  LEAD: 'SubmitForm',
  COMPLETE_REGISTRATION: 'CompleteRegistration',
} as const;
