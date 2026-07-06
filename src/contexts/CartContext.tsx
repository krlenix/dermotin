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

export interface CartLineItem {
  productId: string;
  productSlug: string;
  variantId: string;
  sku: string;
  productName: string;
  variantName: string;
  image: string;
  quantity: number;
  /** Unit price actually charged (discount price when available) */
  unitPrice: number;
  /** Regular unit price, used for strikethrough display */
  regularPrice: number;
  currency: string;
}

interface CartContextValue {
  items: CartLineItem[];
  totalItems: number;
  subtotal: number;
  /** Total savings vs regular prices */
  totalSavings: number;
  isHydrated: boolean;
  isDrawerOpen: boolean;
  addItem: (item: Omit<CartLineItem, 'quantity'>, quantity?: number) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_VERSION = 'v1';

function getStorageKey(locale: string) {
  return `dermotin_cart_${CART_VERSION}_${locale}`;
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

  // Hydrate cart from localStorage on mount (client only, avoids SSR mismatch)
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(getStorageKey(locale));
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed.filter((item) => item && typeof item.variantId === 'string' && item.quantity > 0));
        }
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

  const addItem = useCallback((item: Omit<CartLineItem, 'quantity'>, quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((line) => line.variantId === item.variantId);
      if (existing) {
        return prev.map((line) =>
          line.variantId === item.variantId
            ? { ...line, quantity: Math.min(line.quantity + quantity, 99) }
            : line
        );
      }
      return [...prev, { ...item, quantity: Math.min(quantity, 99) }];
    });
  }, []);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((line) => line.variantId !== variantId);
      }
      return prev.map((line) =>
        line.variantId === variantId ? { ...line, quantity: Math.min(quantity, 99) } : line
      );
    });
  }, []);

  const removeItem = useCallback((variantId: string) => {
    setItems((prev) => prev.filter((line) => line.variantId !== variantId));
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
      updateQuantity,
      removeItem,
      clearCart,
      openDrawer,
      closeDrawer,
    }),
    [items, totalItems, subtotal, totalSavings, isHydrated, isDrawerOpen, addItem, updateQuantity, removeItem, clearCart, openDrawer, closeDrawer]
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
