/**
 * Centralized Application Configuration
 * This file contains all configurable values that were previously hardcoded
 * Making the system more flexible and maintainable
 */

import { getCountryConfig } from './countries';

// Animation and UI Configuration
export const UI_CONFIG = {
  // Animation durations (in milliseconds)
  animations: {
    fast: 100,
    medium: 200,
    slow: 400,
    extraSlow: 600,
    wheelSpin: 3000,
    confetti: 3000,
    testimonialRotation: 3000,
    socialProofUpdate: 30000,
  },
  
  // Card dimensions
  cards: {
    testimonial: {
      mobile: { width: 280, gap: 16 },
      desktop: { width: 320, gap: 32 }
    }
  },
  
  // Colors (can be moved to theme config if needed)
  colors: {
    wheel: {
      winning: '#1f2937',
      losing: '#6b7280',
      confetti: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#E74C3C']
    }
  }
} as const;

// Business Logic Configuration
export const BUSINESS_CONFIG = {
  // Stock management
  stock: {
    lowStock: 10,
    outOfStock: 0,
    criticalStock: 5,
  },
  
  // Urgency timers (in hours)
  urgency: {
    default: 24,
    flash: 6,
    weekend: 48,
  },
  
  // Image optimization
  images: {
    quality: 85,
    formats: ['webp', 'jpg', 'png'],
    sizes: {
      thumbnail: 150,
      small: 300,
      medium: 600,
      large: 1200,
    },
  },
  
  // Cookie settings
  cookies: {
    expirationDays: 365,
    sameSite: 'lax' as const,
    secure: true,
  }
} as const;

// Feature Flags Configuration
export const FEATURE_FLAGS = {
  // Component visibility by locale
  components: {
    urgencyTimer: {
      enabled: {
        rs: false,  // Disabled for RS locale
        ba: true,   // Enabled for BA locale
      }
    },
    // Add more component feature flags here as needed
    // Example:
    // wheelOfFortune: {
    //   enabled: {
    //     rs: true,
    //     ba: true,
    //   }
    // }
  }
} as const;

// Helper function to check if a component is enabled for a specific locale
export function isComponentEnabled(component: keyof typeof FEATURE_FLAGS.components, locale: string): boolean {
  const componentConfig = FEATURE_FLAGS.components[component];
  if (!componentConfig || !componentConfig.enabled) {
    return true; // Default to enabled if not configured
  }
  
  // Check if the locale is specifically configured
  const localeEnabled = componentConfig.enabled[locale as keyof typeof componentConfig.enabled];
  return localeEnabled !== undefined ? localeEnabled : true; // Default to enabled if locale not found
}

// Dynamic configuration functions
export function getShippingInfo(countryCode: string) {
  const countryConfig = getCountryConfig(countryCode);
  const defaultCourier = countryConfig.couriers.find(c => c.isDefault && c.enabled) || countryConfig.couriers[0];
  
  return {
    cost: defaultCourier?.shipping.cost || 0,
    currency: defaultCourier?.shipping.currency || 'dinara',
    freeShippingThreshold: countryConfig.business.freeShippingThreshold,
    deliveryTime: defaultCourier?.deliveryTime || '1-3 radna dana',
    deliveryArea: countryConfig.business.deliveryArea,
  };
}

export function getProductPricing() {
  // This function should get pricing from the products.ts file
  // and use the country-specific conversion functions already available there
  // Remove this function entirely as it duplicates functionality from products.ts
  
  // Use getProductVariantsForCountry() from products.ts instead
  console.warn('getProductPricing is deprecated. Use getProductVariantsForCountry() from products.ts instead.');
  return {};
}

export function getFAQContent(countryCode: string) {
  const countryConfig = getCountryConfig(countryCode);
  const shippingInfo = getShippingInfo(countryCode);
  
  // Return dynamic data that can be used with translation keys
  // The actual text should come from the translation files (ba.json, rs.json)
  return {
    delivery: {
      time: shippingInfo.deliveryTime,
      area: shippingInfo.deliveryArea,
      cost: shippingInfo.cost,
      currency: shippingInfo.currency,
      freeShippingThreshold: shippingInfo.freeShippingThreshold,
      currencySymbol: countryConfig.currencySymbol,
    },
    payment: {
      methods: countryConfig.business.paymentMethods,
      supportsCashOnDelivery: true,
    },
    returns: {
      periodDays: countryConfig.business.returnPeriodDays,
      warrantyYears: countryConfig.business.warrantyPeriodYears,
    },
    company: {
      name: countryConfig.company.name,
      legalName: countryConfig.company.legalName,
      address: `${countryConfig.company.address}, ${countryConfig.company.city} ${countryConfig.company.postalCode}`,
      phone: countryConfig.company.phone,
      email: countryConfig.company.email,
      taxNumber: countryConfig.company.taxNumber,
      registrationNumber: countryConfig.company.registrationNumber,
    }
  };
}

// Form validation rules
export const VALIDATION_RULES = {
  minNameLength: 2,
  minSurnameLength: 2,
  minAddressLength: 5,
  minCityLength: 2,
  minPasswordLength: 8,
} as const;

// API endpoints
export const API_ENDPOINTS = {
  orders: '/api/orders',
  legalDocument: '/api/legal-document',
} as const;

// Social media links
export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/p/Dermotin-61555041459731/',
  instagram: 'https://www.instagram.com/dermotin.cosmetics/',
  tiktok: 'https://www.tiktok.com/@dermotin.cosmetics',
} as const;

// Form field names for consistency
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
