import type { CountryConfig } from '@/config/countries';
import type { ProductVariant } from '@/config/types';

export function formatMoney(amount: number, countryConfig: CountryConfig): string {
  return `${new Intl.NumberFormat('sr-RS', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)} ${countryConfig.currencySymbol}`;
}

export function variantPrice(variant: ProductVariant): number {
  return variant.discountPrice ?? variant.price;
}

export function variantSavings(variant: ProductVariant): number {
  return variant.discountPrice && variant.discountPrice < variant.price
    ? Math.round((variant.price - variant.discountPrice) * 100) / 100
    : 0;
}

export function variantDiscountPercent(variant: ProductVariant): number {
  const savings = variantSavings(variant);
  return savings > 0 ? Math.round((savings / variant.price) * 100) : 0;
}

export function scrollToOrderForm(id = 'naruci') {
  if (typeof document === 'undefined') return;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  // Fokus na prvo polje kada se forma pojavi — manje trenja na mobilnom
  window.setTimeout(() => {
    const first = el.querySelector<HTMLInputElement>('input[name="fullName"]');
    first?.focus({ preventScroll: true });
  }, 600);
}
