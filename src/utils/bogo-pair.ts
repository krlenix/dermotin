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

/** Prikazna grupa: obična stavka ili 1+1 (plaćena + ugnježdeni gratis). */
export type CartDisplayGroup =
  | { type: 'regular'; line: CartLineItem }
  | { type: 'bogo'; pairId: string; paid: CartLineItem; free: CartLineItem[] };

/**
 * Grupiši korpu za UI: gratis linije idu ispod plaćene roditeljske stavke.
 * Redosled prati redosled plaćenih/običnih stavki u korpi.
 */
export function groupCartItemsForDisplay(items: CartLineItem[]): CartDisplayGroup[] {
  const freeByPair = new Map<string, CartLineItem[]>();
  for (const line of items) {
    if (line.bogoPairId && line.bogoRole === 'free') {
      const list = freeByPair.get(line.bogoPairId) ?? [];
      list.push(line);
      freeByPair.set(line.bogoPairId, list);
    }
  }

  const seenPairs = new Set<string>();
  const groups: CartDisplayGroup[] = [];

  for (const line of items) {
    if (!line.bogoPairId) {
      groups.push({ type: 'regular', line });
      continue;
    }
    if (seenPairs.has(line.bogoPairId)) continue;
    if (line.bogoRole !== 'paid') continue;

    seenPairs.add(line.bogoPairId);
    groups.push({
      type: 'bogo',
      pairId: line.bogoPairId,
      paid: line,
      free: freeByPair.get(line.bogoPairId) ?? [],
    });
  }

  return groups;
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
 * Sastavi sve linije jedne 1+1 grupe (plaćena varijanta + n gratis izbora).
 *
 * Kupac plaća SVOJU (primarnu) varijantu; za svako pakovanje u njoj bira
 * po jedan gratis proizvod. Za TopOMS se ukupan iznos grupe (cena primarne
 * varijante) deli tako da nijedna linija nije 0 ili 1 dinar:
 *   - plaćena linija: unitPrice = cena primarne / 2 (+ ostatak zaokruživanja)
 *   - svaka gratis linija: unitPrice = cena primarne / (2 * broj gratis linija)
 *   - bogoRole označava koja se linija kupcu prikazuje kao plaćena, a koje kao GRATIS
 */
export function buildBogoGroupLines(
  primary: CartItemBase,
  secondaries: CartItemBase[]
): CartItemBase[] {
  const groupId = createBogoPairId();
  const groupTotal = primary.unitPrice;
  const freeCount = Math.max(1, secondaries.length);
  const freeShare = roundMoney(groupTotal / (2 * freeCount));
  // Plaćena linija apsorbuje ostatak zaokruživanja da zbir bude tačno groupTotal
  const paidShare = roundMoney(groupTotal - freeShare * secondaries.length);

  const paidLine: CartItemBase = {
    ...primary,
    bogoPairId: groupId,
    bogoRole: 'paid',
    bogoOriginalUnitPrice: primary.unitPrice,
    unitPrice: paidShare,
    regularPrice: Math.max(primary.regularPrice, primary.unitPrice),
  };

  const freeLines: CartItemBase[] = secondaries.map((secondary) => ({
    ...secondary,
    bogoPairId: groupId,
    bogoRole: 'free',
    bogoOriginalUnitPrice: secondary.unitPrice,
    unitPrice: freeShare,
    regularPrice: Math.max(secondary.regularPrice, secondary.unitPrice),
  }));

  return [paidLine, ...freeLines];
}
