// Discount Coupon Configuration
// Coupons can be absolute, percentage discount, or free shipping

export type CouponType = 'absolute' | 'percentage' | 'free_shipping';

export interface Coupon {
  code: string;
  type: CouponType;
  value: number; // For absolute: amount in currency, for percentage: 0-100
  description?: string;
  minOrderValue?: number; // Minimum order value to apply coupon (before shipping)
  maxDiscount?: number; // Maximum discount amount for percentage coupons
  validUntil?: Date; // Expiration date (optional)
  countries?: string[]; // If specified, only valid for these countries (e.g., ['rs', 'ba'])
  enabled: boolean;
}

// Centralized coupon list
// NOTE: Static coupons are commented out - system now uses API-only validation from OMS
// Uncomment and add coupons here if you want fallback static codes in the future
export const COUPONS: Record<string, Coupon> = {
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
  }
  
  // Round to 2 decimal places
  productDiscount = Math.round(productDiscount * 100) / 100;
  shippingDiscount = Math.round(shippingDiscount * 100) / 100;
  const totalDiscount = Math.round((productDiscount + shippingDiscount) * 100) / 100;
  
  return { productDiscount, shippingDiscount, totalDiscount };
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

