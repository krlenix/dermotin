import type { CartLineItem } from '@/contexts/CartContext';
import { isBOGOActive } from '@/utils/bogo-cookies';

/** Zaokruži cenu na 2 decimale (RSD ostaje ceo broj). */
export function roundMoney(amount: number): number {
  return Math.round(amount * 100) / 100;
}

export function createBogoPairId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `bogo_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/** Koliko kompletiranih 1+1 parova ima u korpi. */
export function countBogoPairs(items: CartLineItem[]): number {
  const ids = new Set(items.filter((item) => item.bogoPairId).map((item) => item.bogoPairId));
  return ids.size;
}

/**
 * Da li treba otvoriti modal za izbor gratis proizvoda.
 * Aktivna akcija + još uvek ima mesta za novi par.
 */
export function shouldOfferBogoPair(items: CartLineItem[], maxPairs: number): boolean {
  if (!isBOGOActive()) return false;
  return countBogoPairs(items) < maxPairs;
}

type CartItemBase = Omit<CartLineItem, 'quantity' | 'lineId'>;

/**
 * Sastavi obe linije 1+1 para.
 *
 * Kupac plaća SVOJ (primarni) proizvod, izabrani drugi je GRATIS.
 * Za TopOMS se ukupan iznos para (cena primarnog) deli na dve JEDNAKE
 * polovine — nikad 0 ili 1 dinar na gratis liniji:
 *   - obe linije: unitPrice = cena primarnog / 2
 *   - bogoRole označava koja se linija kupcu prikazuje kao plaćena, a koja kao GRATIS
 */
export function buildBogoPairLines(
  primary: CartItemBase,
  secondary: CartItemBase
): [CartItemBase, CartItemBase] {
  const pairId = createBogoPairId();
  const pairTotal = primary.unitPrice;
  const half = roundMoney(pairTotal / 2);

  const paidLine: CartItemBase = {
    ...primary,
    bogoPairId: pairId,
    bogoRole: 'paid',
    bogoOriginalUnitPrice: primary.unitPrice,
    unitPrice: half,
    regularPrice: Math.max(primary.regularPrice, primary.unitPrice),
  };

  const freeLine: CartItemBase = {
    ...secondary,
    bogoPairId: pairId,
    bogoRole: 'free',
    bogoOriginalUnitPrice: secondary.unitPrice,
    unitPrice: half,
    regularPrice: Math.max(secondary.regularPrice, secondary.unitPrice),
  };

  return [paidLine, freeLine];
}
