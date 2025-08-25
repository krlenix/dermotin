/**
 * Centralized constants for the application
 * This file contains shared constants to avoid duplication across the codebase
 */

// Brand constants
export const BRAND_NAME = 'DERMOTIN';

// Validation constants
export const VALIDATION_RULES = {
  minNameLength: 2,
  minSurnameLength: 2,
  minAddressLength: 5,
  minCityLength: 2,
  minPasswordLength: 8,
} as const;

// UI Animation delays
export const ANIMATION_DELAYS = {
  fast: '0.1s',
  medium: '0.2s',
  slow: '0.4s',
  extraSlow: '0.6s',
} as const;

// Note: Shipping costs and free shipping thresholds are now defined per country
// in src/config/countries.ts under the business.deliveryCost and business.freeShippingThreshold properties

// Common phone number formats by country
export const PHONE_FORMATS = {
  rs: '+381 60 123 4567',
  bg: '+359 88 123 4567',
  ba: '+387 60 123 456',
  me: '+382 67 123 456',
  eu: '+49 30 12345678',
} as const;

// Common email placeholder
export const DEFAULT_EMAIL_PLACEHOLDER = 'primer@email.com';

// Stock thresholds
export const STOCK_THRESHOLDS = {
  lowStock: 10,
  outOfStock: 0,
  criticalStock: 5,
} as const;

// Timer durations (in hours)
export const URGENCY_TIMER_DURATIONS = {
  default: 24,
  flash: 6,
  weekend: 48,
} as const;

// Image optimization settings
export const IMAGE_SETTINGS = {
  quality: 85,
  formats: ['webp', 'jpg'],
  sizes: {
    thumbnail: 150,
    small: 300,
    medium: 600,
    large: 1200,
  },
} as const;

// API endpoints (if needed)
export const API_ENDPOINTS = {
  orders: '/api/orders',
  legalDocument: '/api/legal-document',
} as const;

// Social media links (placeholder - can be moved to country config if needed)
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/dermotin',
  instagram: 'https://instagram.com/dermotin',
  youtube: 'https://youtube.com/@dermotin',
} as const;

// Cookie consent settings
export const COOKIE_SETTINGS = {
  expirationDays: 365,
  sameSite: 'lax' as const,
  secure: true,
} as const;

// Form field names (for consistency)
export const FORM_FIELDS = {
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  phone: 'phone',
  address: 'address',
  city: 'city',
  postalCode: 'postalCode',
  country: 'country',
  paymentMethod: 'paymentMethod',
  agreeMarketing: 'agreeMarketing',
} as const;

// Payment methods
export const PAYMENT_METHODS = {
  cod: 'cod',
  card: 'card',
  bankTransfer: 'bankTransfer',
} as const;

export type PaymentMethod = keyof typeof PAYMENT_METHODS;
export type FormField = keyof typeof FORM_FIELDS;
export type SupportedCountry = keyof typeof PHONE_FORMATS;
