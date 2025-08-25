import { CountryConfig } from '@/config/countries';

/**
 * Calculate shipping cost based on order total and country configuration
 */
export function calculateShippingCost(
  orderTotal: number, 
  countryConfig: CountryConfig
): number {
  if (orderTotal >= countryConfig.business.freeShippingThreshold) {
    return 0; // Free shipping
  }
  return countryConfig.business.deliveryCost;
}

/**
 * Check if order qualifies for free shipping
 */
export function qualifiesForFreeShipping(
  orderTotal: number, 
  countryConfig: CountryConfig
): boolean {
  return orderTotal >= countryConfig.business.freeShippingThreshold;
}

/**
 * Get formatted shipping cost string for display
 */
export function getShippingCostDisplay(
  orderTotal: number, 
  countryConfig: CountryConfig,
  formatPrice: (amount: number) => string,
  freeText: string
): string {
  const shippingCost = calculateShippingCost(orderTotal, countryConfig);
  return shippingCost === 0 ? freeText : formatPrice(shippingCost);
}

/**
 * Get the amount needed to reach free shipping
 */
export function getAmountForFreeShipping(
  orderTotal: number, 
  countryConfig: CountryConfig
): number {
  const threshold = countryConfig.business.freeShippingThreshold;
  return Math.max(0, threshold - orderTotal);
}

/**
 * Check if customer is close to free shipping (within 20% of threshold)
 */
export function isCloseToFreeShipping(
  orderTotal: number, 
  countryConfig: CountryConfig
): boolean {
  const threshold = countryConfig.business.freeShippingThreshold;
  const amountNeeded = getAmountForFreeShipping(orderTotal, countryConfig);
  return amountNeeded > 0 && amountNeeded <= (threshold * 0.2);
}
