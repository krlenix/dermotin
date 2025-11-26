// Discount Coupon Configuration
// Coupons can be absolute, percentage discount, free shipping, or BOGO (Buy One Get One)

import { BOGO_CONFIG as BOGO_COOKIE_CONFIG, isBOGOActive } from '@/utils/bogo-cookies';

export type CouponType = 'absolute' | 'percentage' | 'free_shipping' | 'bogo';

export interface Coupon {
  code: string;
  type: CouponType;
  value: number; // For absolute: amount in currency, for percentage: 0-100, for bogo: not used (set to 0)
  description?: string;
  minOrderValue?: number; // Minimum order value to apply coupon (before shipping)
  maxDiscount?: number; // Maximum discount amount for percentage coupons
  validUntil?: Date; // Expiration date (optional)
  countries?: string[]; // If specified, only valid for these countries (e.g., ['rs', 'ba'])
  enabled: boolean;
}

// BOGO (Buy One Get One) Configuration
// When BOGO is active: buy X items, get X items free at regular price
export interface BOGOConfig {
  couponCode: string;
  maxQuantity: number; // Maximum quantity pairs (e.g., 3 means 3+3)
}

// Re-export BOGO config from centralized location
// To change BOGO settings, edit src/utils/bogo-cookies.ts
export const BOGO_CONFIG: BOGOConfig = {
  couponCode: BOGO_COOKIE_CONFIG.couponCode,
  maxQuantity: BOGO_COOKIE_CONFIG.maxQuantity
};

// Centralized coupon list
// NOTE: Most static coupons are commented out - system now uses API-only validation from OMS
// BOGO coupons are handled locally as they require special UI treatment
export const COUPONS: Record<string, Coupon> = {
  // BOGO (Buy One Get One) coupon - 1+1 offer for all products
  // Note: This coupon's enabled state is controlled by BOGO_CONFIG in bogo-cookies.ts
  '1PLUS1': {
    code: '1PLUS1',
    type: 'bogo',
    value: 0, // Not used for BOGO, discount is calculated based on free items
    description: 'Buy 1 Get 1 Free - BOGO offer',
    minOrderValue: 0,
    enabled: true, // Actual availability is controlled by isBOGOActive()
  },
  // 'WELCOME10': {
  //   code: 'WELCOME10',
  //   type: 'percentage',
  //   value: 10,
  //   description: 'Welcome discount - 10% off',
  //   minOrderValue: 0,
  //   maxDiscount: 500, // Max 500 RSD/BAM/EUR discount
  //   enabled: true,
  // },
  // 'SAVE20': {
  //   code: 'SAVE20',
  //   type: 'percentage',
  //   value: 20,
  //   description: 'Special promotion - 20% off',
  //   minOrderValue: 2000,
  //   maxDiscount: 1000,
  //   enabled: true,
  // },
  // 'FREESHIP': {
  //   code: 'FREESHIP',
  //   type: 'free_shipping',
  //   value: 0,
  //   description: 'Free shipping on all orders',
  //   minOrderValue: 0,
  //   enabled: true,
  // },
  // 'ABSOLUTE500': {
  //   code: 'ABSOLUTE500',
  //   type: 'absolute',
  //   value: 500,
  //   description: '500 off your order',
  //   minOrderValue: 3000,
  //   enabled: true,
  // },
  // 'LOYAL15': {
  //   code: 'LOYAL15',
  //   type: 'percentage',
  //   value: 15,
  //   description: 'Loyalty discount - 15% off',
  //   minOrderValue: 1500,
  //   maxDiscount: 750,
  //   enabled: true,
  // },
};

// Helper function to get coupon by code
export function getCouponByCode(code: string): Coupon | null {
  const normalizedCode = code.trim().toUpperCase();
  const coupon = COUPONS[normalizedCode];
  
  if (!coupon || !coupon.enabled) {
    return null;
  }
  
  // Check if coupon is expired
  if (coupon.validUntil && new Date() > coupon.validUntil) {
    return null;
  }
  
  return coupon;
}

// Helper function to validate coupon for specific country and order value
export function validateCoupon(
  couponCode: string, 
  subtotal: number, 
  countryCode: string
): { valid: boolean; coupon?: Coupon; error?: string } {
  const coupon = getCouponByCode(couponCode);
  
  if (!coupon) {
    return { valid: false, error: 'invalid_code' };
  }
  
  // Check country restriction
  if (coupon.countries && !coupon.countries.includes(countryCode.toLowerCase())) {
    return { valid: false, error: 'not_valid_country' };
  }
  
  // Check minimum order value
  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
    return { valid: false, error: 'min_order_not_met', coupon };
  }
  
  return { valid: true, coupon };
}

// Calculate discount amount based on coupon
export function calculateCouponDiscount(
  coupon: Coupon,
  subtotal: number,
  shippingCost: number
): { productDiscount: number; shippingDiscount: number; totalDiscount: number } {
  let productDiscount = 0;
  let shippingDiscount = 0;
  
  switch (coupon.type) {
    case 'percentage':
      productDiscount = (subtotal * coupon.value) / 100;
      // Apply max discount if specified
      if (coupon.maxDiscount && productDiscount > coupon.maxDiscount) {
        productDiscount = coupon.maxDiscount;
      }
      break;
      
    case 'absolute':
      // Absolute discount cannot exceed subtotal
      productDiscount = Math.min(coupon.value, subtotal);
      break;
      
    case 'free_shipping':
      shippingDiscount = shippingCost;
      break;
      
    case 'bogo':
      // BOGO discount is calculated separately based on quantity
      // This function returns 0 for BOGO as it's handled in the UI component
      productDiscount = 0;
      break;
  }
  
  // Round to 2 decimal places
  productDiscount = Math.round(productDiscount * 100) / 100;
  shippingDiscount = Math.round(shippingDiscount * 100) / 100;
  const totalDiscount = Math.round((productDiscount + shippingDiscount) * 100) / 100;
  
  return { productDiscount, shippingDiscount, totalDiscount };
}

// Calculate BOGO (Buy One Get One) discount
// Returns the value of free items (e.g., if buying 2 at 1990 each, free value is 2 * 1990)
export function calculateBOGODiscount(
  unitPrice: number,
  quantity: number
): { freeItems: number; freeValue: number; totalPaid: number; totalItems: number } {
  const freeItems = quantity; // Same number of free items as paid items
  const freeValue = Math.round(unitPrice * freeItems * 100) / 100;
  const totalPaid = Math.round(unitPrice * quantity * 100) / 100;
  const totalItems = quantity * 2; // Paid items + Free items
  
  return { freeItems, freeValue, totalPaid, totalItems };
}

// Check if a coupon is a BOGO type
export function isBOGOCoupon(coupon: Coupon | null): boolean {
  return coupon?.type === 'bogo';
}

// Get BOGO coupon by code (for static validation)
export function getBOGOCoupon(code: string): Coupon | null {
  const normalizedCode = code.trim().toUpperCase();
  const coupon = COUPONS[normalizedCode];
  
  if (!coupon || !coupon.enabled || coupon.type !== 'bogo') {
    return null;
  }
  
  // Check if BOGO offer is currently active (master switch + expiration)
  if (!isBOGOActive()) {
    return null;
  }
  
  // Check if coupon has its own expiration (in addition to global BOGO expiration)
  if (coupon.validUntil && new Date() > coupon.validUntil) {
    return null;
  }
  
  return coupon;
}

// Get all active coupons (for admin/testing purposes)
export function getAllActiveCoupons(): Coupon[] {
  return Object.values(COUPONS).filter(coupon => coupon.enabled);
}

// Get coupon from API only (no static fallback at the moment)
export async function getCouponWithAPI(
  code: string, 
  countryCode: string
): Promise<Coupon | null> {
  // Fetch coupon from API only
  try {
    const { validateCouponFromAPI } = await import('@/utils/affiliate-codes');
    
    // Get coupon from API
    const apiCoupon = await validateCouponFromAPI(code, countryCode);
    if (apiCoupon) {
      console.log(`✅ Using coupon "${code}" from API`);
      return apiCoupon;
    }
    
    console.log(`❌ Coupon "${code}" not found in API`);
    return null;
    
    // NOTE: Static coupon fallback is disabled for now
    // Uncomment below to enable fallback to static COUPONS when API doesn't have the code
    // console.log(`📋 Checking static coupons for "${code}"`);
    // return getCouponByCode(code);
  } catch (error) {
    console.error('Error fetching coupon from API:', error);
    
    // NOTE: API error fallback to static coupons is disabled
    // Uncomment below to enable fallback when API fails
    // console.log('📋 Falling back to static coupons due to API error');
    // return getCouponByCode(code);
    
    return null;
  }
}

// Validate coupon with API integration
export async function validateCouponWithAPI(
  couponCode: string, 
  subtotal: number, 
  countryCode: string
): Promise<{ valid: boolean; coupon?: Coupon; error?: string }> {
  // First check if it's a BOGO coupon (handled locally)
  const bogoCoupon = getBOGOCoupon(couponCode);
  if (bogoCoupon) {
    // BOGO coupons don't have country restrictions (available everywhere)
    // No minimum order value check for BOGO
    return { valid: true, coupon: bogoCoupon };
  }
  
  // For other coupons, use API validation
  const coupon = await getCouponWithAPI(couponCode, countryCode);
  
  if (!coupon) {
    return { valid: false, error: 'invalid_code' };
  }
  
  // Check country restriction
  if (coupon.countries && !coupon.countries.includes(countryCode.toLowerCase())) {
    return { valid: false, error: 'not_valid_country' };
  }
  
  // Check minimum order value
  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
    return { valid: false, error: 'min_order_not_met', coupon };
  }
  
  return { valid: true, coupon };
}

