// Utility to fetch affiliate/coupon codes from the Order Management System API

import { getCountryConfig } from '@/config/countries';
import type { Coupon } from '@/config/coupons';

interface AffiliateCodeResponse {
  success: boolean;
  codes?: string[]; // Array of coupon code strings
  total?: number;
  error?: string;
}

/**
 * Fetch affiliate codes from the OMS API for a specific country
 * @param countryCode - The country code (rs, ba, hr, me)
 * @returns Promise with array of coupons or null if fetch fails
 */
export async function fetchAffiliateCodesFromAPI(countryCode: string): Promise<Coupon[] | null> {
  try {
    const countryConfig = getCountryConfig(countryCode);
    
    // Check if affiliate codes endpoint is configured
    if (!countryConfig.webhooks.affiliateCodes?.url) {
      console.warn(`Affiliate codes endpoint not configured for country: ${countryCode}`);
      return null;
    }
    
    const { url, apiKey } = countryConfig.webhooks.affiliateCodes;
    
    console.log(`🔍 Fetching affiliate codes from: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      cache: 'no-store', // Don't cache to always get fresh codes
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch affiliate codes: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const result: AffiliateCodeResponse = await response.json();
    
    if (!result.success || !result.codes || !Array.isArray(result.codes)) {
      console.error('Invalid response from affiliate codes API:', result.error);
      return null;
    }
    
    // Transform API response to Coupon format
    // OMS returns simple code strings, we apply default 10% discount to all codes
    const coupons: Coupon[] = result.codes.map(code => ({
      code: code,
      type: 'percentage' as const,
      value: 10, // Default 10% discount for all affiliate codes
      description: `Affiliate discount - ${code}`,
      minOrderValue: 0,
      maxDiscount: undefined, // No maximum discount limit
      validUntil: undefined,
      countries: undefined, // Valid for all countries
      enabled: true,
    }));
    
    console.log(`✅ Successfully fetched ${coupons.length} affiliate codes for ${countryCode}:`, result.codes);
    
    return coupons;
  } catch (error) {
    console.error('Error fetching affiliate codes from API:', error);
    return null;
  }
}

/**
 * Fetch and validate a specific coupon code from the API
 * @param couponCode - The coupon code to validate
 * @param countryCode - The country code
 * @returns Promise with the coupon if valid, or null
 */
export async function validateCouponFromAPI(
  couponCode: string,
  countryCode: string
): Promise<Coupon | null> {
  try {
    const coupons = await fetchAffiliateCodesFromAPI(countryCode);
    
    if (!coupons) {
      return null;
    }
    
    // Find the matching coupon (case-insensitive)
    const normalizedCode = couponCode.trim().toUpperCase();
    const coupon = coupons.find(c => c.code.toUpperCase() === normalizedCode && c.enabled);
    
    if (!coupon) {
      console.log(`❌ Coupon code "${couponCode}" not found or disabled`);
      return null;
    }
    
    // Check if coupon is expired
    if (coupon.validUntil && new Date() > coupon.validUntil) {
      console.log(`❌ Coupon code "${couponCode}" has expired`);
      return null;
    }
    
    // Check country restriction
    if (coupon.countries && !coupon.countries.includes(countryCode.toLowerCase())) {
      console.log(`❌ Coupon code "${couponCode}" not valid for country ${countryCode}`);
      return null;
    }
    
    console.log(`✅ Coupon code "${couponCode}" validated successfully`);
    return coupon;
  } catch (error) {
    console.error('Error validating coupon from API:', error);
    return null;
  }
}

/**
 * Cache for affiliate codes to reduce API calls
 * Cache expires after 5 minutes
 */
const codesCache = new Map<string, { codes: Coupon[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch affiliate codes with caching
 * @param countryCode - The country code
 * @returns Promise with array of coupons or null
 */
export async function fetchAffiliateCodesWithCache(countryCode: string): Promise<Coupon[] | null> {
  const cached = codesCache.get(countryCode);
  const now = Date.now();
  
  // Return cached data if it's still fresh
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    console.log(`📦 Using cached affiliate codes for ${countryCode}`);
    return cached.codes;
  }
  
  // Fetch fresh data
  const codes = await fetchAffiliateCodesFromAPI(countryCode);
  
  if (codes) {
    // Update cache
    codesCache.set(countryCode, { codes, timestamp: now });
  }
  
  return codes;
}

