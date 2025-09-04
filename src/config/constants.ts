/**
 * Centralized constants for the application
 * This file contains shared constants to avoid duplication across the codebase
 * 
 * NOTE: Most configuration has been moved to src/config/app-config.ts
 * This file now only contains basic constants that don't need dynamic configuration
 */

// Brand constants
export const BRAND_NAME = 'DERMOTIN';

// Common email placeholder
export const DEFAULT_EMAIL_PLACEHOLDER = 'primer@email.com';

// Common phone number formats by country
export const PHONE_FORMATS = {
  rs: '+381 60 123 4567',
  ba: '+387 60 123 456',
} as const;

// Re-export from app-config for backward compatibility
export { 
  VALIDATION_RULES, 
  API_ENDPOINTS, 
  SOCIAL_LINKS, 
  UI_CONFIG,
  BUSINESS_CONFIG,
  FEATURE_FLAGS,
  isComponentEnabled
} from './app-config';

// Payment methods
export const PAYMENT_METHODS = {
  cod: 'cod',
  card: 'card',
  bankTransfer: 'bankTransfer',
} as const;

export type PaymentMethod = keyof typeof PAYMENT_METHODS;

export type SupportedCountry = keyof typeof PHONE_FORMATS;

// Stock thresholds
export const STOCK_THRESHOLDS = {
  lowStock: 5,
  outOfStock: 0,
  highStock: 20
} as const;

// Note: Pixel tracking configuration is in src/config/pixels.ts
// Update pixel IDs there to enable Meta and TikTok tracking