import { CountryConfig, CourierInfo } from '@/config/countries';

/**
 * Calculate shipping cost based on order total, courier, and country's free shipping threshold
 */
export function calculateShippingCost(
  orderTotal: number, 
  courier: CourierInfo,
  countryConfig: CountryConfig
): number {
  if (orderTotal >= countryConfig.business.freeShippingThreshold) {
    return 0; // Free shipping based on order value
  }
  return courier.shipping.cost;
}

/**
 * Check if order qualifies for free shipping based on country's threshold
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
  courier: CourierInfo,
  countryConfig: CountryConfig,
  formatPrice: (amount: number) => string,
  freeText: string
): string {
  const shippingCost = calculateShippingCost(orderTotal, courier, countryConfig);
  return shippingCost === 0 ? freeText : formatPrice(shippingCost);
}

/**
 * Get shipping cost info for a courier
 */
export function getCourierShippingInfo(courier: CourierInfo) {
  return {
    cost: courier.shipping.cost,
    currency: courier.shipping.currency
  };
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
