'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Gift, PartyPopper, Sparkles, X } from 'lucide-react';
import { getCountryConfig } from '@/config/countries';
import {
  getProductsForCountry,
  getProductVariantsForCountry,
  type Product,
} from '@/config/products';
import { useCart, type CartLineItem } from '@/contexts/CartContext';
import { BOGO_CONFIG, storeBOGOCookie } from '@/utils/bogo-cookies';
import { shouldOfferBogoPair } from '@/utils/bogo-pair';

type CartItemInput = Omit<CartLineItem, 'quantity' | 'lineId'> & { lineId?: string };

interface PendingBogoOffer {
  primary: CartItemInput;
  onAfterAdd?: () => void;
}

interface BogoPairContextValue {
  /**
   * Add to cart — if 1+1 is active, opens modal to pick the free product.
   * Returns true when the modal took over (caller should not also open drawer).
   */
  requestAdd: (
    item: CartItemInput,
    options?: { intent?: 'drawer' | 'checkout'; onAfterAdd?: () => void }
  ) => boolean;
  isModalOpen: boolean;
}

const BogoPairContext = createContext<BogoPairContextValue | null>(null);

export function useBogoPair(): BogoPairContextValue {
  const context = useContext(BogoPairContext);
  if (!context) {
    throw new Error('useBogoPair must be used within a BogoPairProvider');
  }
  return context;
}

interface BogoPairProviderProps {
  children: ReactNode;
}

export function BogoPairProvider({ children }: BogoPairProviderProps) {
  const { items, addItem, addBogoPair, closeDrawer } = useCart();
  const [pending, setPending] = useState<PendingBogoOffer | null>(null);

  const requestAdd = useCallback(
    (
      item: CartItemInput,
      options?: { intent?: 'drawer' | 'checkout'; onAfterAdd?: () => void }
    ): boolean => {
      if (!shouldOfferBogoPair(items, BOGO_CONFIG.maxQuantity)) {
        addItem(item, 1);
        options?.onAfterAdd?.();
        return false;
      }

      storeBOGOCookie(BOGO_CONFIG.couponCode, 'manual');
      closeDrawer();
      setPending({ primary: item, onAfterAdd: options?.onAfterAdd });
      return true;
    },
    [addItem, closeDrawer, items]
  );

  const handleSkip = useCallback(() => {
    if (!pending) return;
    addItem(pending.primary, 1);
    const { onAfterAdd } = pending;
    setPending(null);
    onAfterAdd?.();
  }, [addItem, pending]);

  const handleSelect = useCallback(
    (secondary: CartItemInput) => {
      if (!pending) return;
      addBogoPair(pending.primary, secondary);
      const { onAfterAdd } = pending;
      setPending(null);
      onAfterAdd?.();
    },
    [addBogoPair, pending]
  );

  const value = useMemo(
    () => ({
      requestAdd,
      isModalOpen: pending !== null,
    }),
    [requestAdd, pending]
  );

  return (
    <BogoPairContext.Provider value={value}>
      {children}
      {pending && (
        <BogoPairModal
          primary={pending.primary}
          onSelect={handleSelect}
          onSkip={handleSkip}
        />
      )}
    </BogoPairContext.Provider>
  );
}

interface BogoPairModalProps {
  primary: CartItemInput;
  onSelect: (secondary: CartItemInput) => void;
  /** Also used when closing the modal — primary still goes to cart at full price */
  onSkip: () => void;
}

function BogoPairModal({ primary, onSelect, onSkip }: BogoPairModalProps) {
  const t = useTranslations();
  const locale = useLocale();
  const countryConfig = getCountryConfig(locale);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    getProductsForCountry(locale, locale)
      .then((loaded) => {
        if (cancelled) return;
        // Isti proizvod prvi (najčešći izbor za 1+1), zatim ostatak kataloga
        const primaryProduct = loaded.find((p) => p.id === primary.productId);
        const rest = loaded.filter((p) => p.id !== primary.productId);
        setProducts(primaryProduct ? [primaryProduct, ...rest] : rest);
      })
      .catch((error) => console.error('Failed to load BOGO products:', error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [locale, primary.productId]);

  const formatPrice = (amount: number) =>
    `${new Intl.NumberFormat('sr-RS', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)} ${countryConfig.currencySymbol}`;

  const buildSecondaryItem = (product: Product): CartItemInput | null => {
    const variants = getProductVariantsForCountry(product, locale);
    const variant = variants.find((v) => v.isDefault) || variants[0];
    if (!variant) return null;
    return {
      productId: product.id,
      productSlug: product.slug,
      variantId: variant.id,
      sku: variant.sku,
      productName: product.name,
      variantName: variant.name,
      image: product.images.main,
      unitPrice: variant.discountPrice ?? variant.price,
      regularPrice: variant.price,
      currency: countryConfig.currency,
    };
  };

  const handlePick = (product: Product) => {
    const secondary = buildSecondaryItem(product);
    if (!secondary) return;
    onSelect(secondary);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-4">
      <div
        className={`absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onSkip}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bogo-pair-title"
        className={`relative z-10 flex w-full max-w-2xl flex-col overflow-hidden rounded-t-[1.75rem] bg-white shadow-2xl transition-all duration-300 sm:rounded-[1.75rem] ${
          visible ? 'translate-y-0 opacity-100 sm:scale-100' : 'translate-y-8 opacity-0 sm:translate-y-4 sm:scale-95'
        }`}
        style={{ maxHeight: 'min(92dvh, 780px)' }}
      >
        {/* Header */}
        <div
          className="relative shrink-0 overflow-hidden px-4 py-4 text-white sm:px-7 sm:py-5"
          style={{ background: 'linear-gradient(135deg, #358055 0%, #2a6844 55%, #1f5236 100%)' }}
        >
          <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 left-10 h-36 w-36 rounded-full bg-[#F3765D]/30 blur-2xl" />

          <button
            type="button"
            onClick={onSkip}
            className="absolute right-3 top-3 rounded-full bg-white/15 p-2 text-white transition hover:bg-white/25 sm:right-4 sm:top-4"
            aria-label={t('bogo.pair_close')}
          >
            <X className="h-5 w-5" />
          </button>

          <div className="relative flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-amber-200 sm:text-xs">
            <Sparkles className="h-4 w-4" />
            {t('bogo.special_offer')}
          </div>

          <div className="relative mt-1.5 flex items-start gap-2.5 sm:mt-2 sm:gap-3">
            <PartyPopper className="mt-0.5 h-7 w-7 shrink-0 text-amber-300 sm:mt-1 sm:h-9 sm:w-9" />
            <div className="pr-8">
              <h2 id="bogo-pair-title" className="text-xl font-black leading-tight sm:text-3xl">
                {t('bogo.pair_congrats')}
              </h2>
              <p className="mt-1 text-sm font-semibold text-white/90 sm:text-base">
                {t('bogo.pair_pick_free')}
              </p>
            </div>
          </div>
        </div>

        {/* Product grid — tap = done */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3 sm:px-7 sm:py-4">
          <p className="mb-2.5 text-center text-[13px] font-bold text-slate-600 sm:mb-3 sm:text-sm">
            {t('bogo.pair_tap_hint')}
          </p>

          {loading ? (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-44 animate-pulse rounded-2xl bg-slate-100 sm:h-48" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
              {products.map((product) => {
                const variants = getProductVariantsForCountry(product, locale);
                const variant = variants.find((v) => v.isDefault) || variants[0];
                if (!variant) return null;
                const full = variant.discountPrice ?? variant.price;
                const isSameAsPrimary = product.id === primary.productId;

                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handlePick(product)}
                    className="group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-2.5 pb-3 text-left transition hover:-translate-y-0.5 hover:border-[#358055] hover:shadow-[0_14px_30px_rgba(53,128,85,0.2)] active:scale-[0.98] sm:p-3 sm:pb-4"
                  >
                    {isSameAsPrimary && (
                      <span className="absolute left-2 top-2 z-10 rounded-full bg-[#F3765D] px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">
                        {t('bogo.pair_same_product')}
                      </span>
                    )}
                    <div className="relative mx-auto mb-1.5 aspect-square w-full max-w-[92px] sm:mb-2 sm:max-w-[110px]">
                      <Image
                        src={product.images.main}
                        alt={product.name}
                        fill
                        className="object-contain transition duration-300 group-hover:scale-105"
                        sizes="130px"
                      />
                    </div>
                    <p className="line-clamp-2 text-center text-[13px] font-black text-slate-900 sm:text-sm">
                      {product.name}
                    </p>
                    <p className="mt-0.5 text-center text-xs text-slate-400 line-through sm:mt-1">
                      {formatPrice(full)}
                    </p>
                    <p className="text-center text-base font-black uppercase tracking-wide text-[#358055] sm:mt-0.5 sm:text-lg">
                      {t('bogo.pair_gratis')}
                    </p>
                    <span className="mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-full bg-[#358055] px-2 py-2 text-[11px] font-black uppercase tracking-wide text-white transition group-hover:bg-[#2a6844] sm:mt-2 sm:px-3 sm:text-xs">
                      <Gift className="h-3.5 w-3.5 shrink-0" />
                      {t('bogo.pair_take_free')}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer — only the skip link, always visible */}
        <div className="shrink-0 border-t border-slate-100 bg-white px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5 text-center sm:px-7 sm:pb-3 sm:pt-2">
          <button
            type="button"
            onClick={onSkip}
            className="w-full py-2 text-sm font-semibold text-slate-400 underline-offset-2 transition hover:text-slate-600 hover:underline"
          >
            {t('bogo.pair_skip')}
          </button>
        </div>
      </div>
    </div>
  );
}
