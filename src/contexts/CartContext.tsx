'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { buildBogoGroupLines } from '@/utils/bogo-pair';

export interface CartLineItem {
  /** Stable unique key per cart row (needed when 1+1 duplicates the same SKU) */
  lineId: string;
  productId: string;
  productSlug: string;
  variantId: string;
  sku: string;
  productName: string;
  variantName: string;
  image: string;
  quantity: number;
  /** Unit price actually charged (discount price when available; half for 1+1 lines) */
  unitPrice: number;
  /** Regular unit price, used for strikethrough display */
  regularPrice: number;
  currency: string;
  /** Shared id for both lines of a 1+1 pair */
  bogoPairId?: string;
  /** Which side of the 1+1 pair this line is shown as (customer-facing) */
  bogoRole?: 'paid' | 'free';
  /** Original charged unit price before 1+1 half-split */
  bogoOriginalUnitPrice?: number;
}

type CartItemInput = Omit<CartLineItem, 'quantity' | 'lineId'> & { lineId?: string };

interface CartContextValue {
  items: CartLineItem[];
  totalItems: number;
  subtotal: number;
  /** Total savings vs regular prices */
  totalSavings: number;
  isHydrated: boolean;
  isDrawerOpen: boolean;
  addItem: (item: CartItemInput, quantity?: number) => void;
  /** Add a 1+1 group: paid variant + one gratis line per selected product (group total = paid price). */
  addBogoGroup: (primary: CartItemInput, secondaries: CartItemInput[]) => string;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_VERSION = 'v2';

function getStorageKey(locale: string) {
  return `dermotin_cart_${CART_VERSION}_${locale}`;
}

function newLineId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `line_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeStoredItems(parsed: unknown): CartLineItem[] {
  if (!Array.isArray(parsed)) return [];
  const items: CartLineItem[] = parsed
    .filter((item) => item && typeof item.variantId === 'string' && item.quantity > 0)
    .map((item) => ({
      ...item,
      lineId: typeof item.lineId === 'string' ? item.lineId : newLineId(),
    }));

  // Integritet 1+1 grupa: svaka mora imati tačno jednu plaćenu i bar jednu gratis
  // liniju — nepotpune grupe (npr. ručno menjan localStorage) se odbacuju cele.
  const invalidGroupIds = new Set<string>();
  const groups = new Map<string, CartLineItem[]>();
  for (const item of items) {
    if (!item.bogoPairId) continue;
    const group = groups.get(item.bogoPairId) ?? [];
    group.push(item);
    groups.set(item.bogoPairId, group);
  }
  for (const [groupId, lines] of groups) {
    const paidCount = lines.filter((line) => line.bogoRole === 'paid').length;
    const freeCount = lines.filter((line) => line.bogoRole === 'free').length;
    if (paidCount !== 1 || freeCount < 1) {
      invalidGroupIds.add(groupId);
    }
  }
  return items.filter((item) => !item.bogoPairId || !invalidGroupIds.has(item.bogoPairId));
}

interface CartProviderProps {
  locale: string;
  children: ReactNode;
}

export function CartProvider({ locale, children }: CartProviderProps) {
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const skipNextPersist = useRef(true);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(getStorageKey(locale));
      if (stored) {
        setItems(normalizeStoredItems(JSON.parse(stored)));
      }
    } catch (error) {
      console.error('Failed to load cart from storage:', error);
    }
    skipNextPersist.current = true;
    setIsHydrated(true);
  }, [locale]);

  useEffect(() => {
    if (!isHydrated) return;
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }
    try {
      window.localStorage.setItem(getStorageKey(locale), JSON.stringify(items));
    } catch (error) {
      console.error('Failed to persist cart:', error);
    }
  }, [items, isHydrated, locale]);

  const addItem = useCallback((item: CartItemInput, quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev.find(
        (line) => line.variantId === item.variantId && !line.bogoPairId && !item.bogoPairId
      );
      if (existing) {
        return prev.map((line) =>
          line.lineId === existing.lineId
            ? { ...line, quantity: Math.min(line.quantity + quantity, 99) }
            : line
        );
      }
      const { lineId: _ignored, ...rest } = item;
      return [...prev, { ...rest, lineId: newLineId(), quantity: Math.min(quantity, 99) }];
    });
  }, []);

  const addBogoGroup = useCallback((primary: CartItemInput, secondaries: CartItemInput[]) => {
    const { lineId: _p, ...primaryRest } = primary;
    const secondariesRest = secondaries.map(({ lineId: _s, ...rest }) => rest);
    const groupLines = buildBogoGroupLines(primaryRest, secondariesRest);
    setItems((prev) => [
      ...prev,
      ...groupLines.map((line) => ({ ...line, lineId: newLineId(), quantity: 1 })),
    ]);
    return groupLines[0].bogoPairId as string;
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    setItems((prev) => {
      const target = prev.find((line) => line.lineId === lineId);
      if (!target) return prev;

      if (target.bogoPairId) {
        // 1+1 grupa: količina je fiksna; quantity <= 0 = ukloni celu grupu
        if (quantity <= 0) {
          return prev.filter((line) => line.bogoPairId !== target.bogoPairId);
        }
        return prev;
      }

      if (quantity <= 0) {
        return prev.filter((line) => line.lineId !== lineId);
      }
      return prev.map((line) =>
        line.lineId === lineId ? { ...line, quantity: Math.min(quantity, 99) } : line
      );
    });
  }, []);

  const removeItem = useCallback((lineId: string) => {
    setItems((prev) => {
      const target = prev.find((line) => line.lineId === lineId);
      if (!target) return prev;
      if (target.bogoPairId) {
        return prev.filter((line) => line.bogoPairId !== target.bogoPairId);
      }
      return prev.filter((line) => line.lineId !== lineId);
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const { totalItems, subtotal, totalSavings } = useMemo(() => {
    let count = 0;
    let sum = 0;
    let savings = 0;
    for (const line of items) {
      count += line.quantity;
      sum += line.unitPrice * line.quantity;
      savings += Math.max(0, line.regularPrice - line.unitPrice) * line.quantity;
    }
    return {
      totalItems: count,
      subtotal: Math.round(sum * 100) / 100,
      totalSavings: Math.round(savings * 100) / 100,
    };
  }, [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalItems,
      subtotal,
      totalSavings,
      isHydrated,
      isDrawerOpen,
      addItem,
      addBogoGroup,
      updateQuantity,
      removeItem,
      clearCart,
      openDrawer,
      closeDrawer,
    }),
    [
      items,
      totalItems,
      subtotal,
      totalSavings,
      isHydrated,
      isDrawerOpen,
      addItem,
      addBogoGroup,
      updateQuantity,
      removeItem,
      clearCart,
      openDrawer,
      closeDrawer,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
