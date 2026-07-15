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
import { Check, Gift, Minus, PartyPopper, Sparkles, X } from 'lucide-react';
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
   * Add to cart — if 1+1 is active, opens modal to pick the free product(s).
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
  const { items, addItem, addBogoGroup, closeDrawer } = useCart();
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
    (secondaries: CartItemInput[]) => {
      if (!pending) return;
      addBogoGroup(pending.primary, secondaries);
      const { onAfterAdd } = pending;
      setPending(null);
      onAfterAdd?.();
    },
    [addBogoGroup, pending]
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
  onSelect: (secondaries: CartItemInput[]) => void;
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
  /** Izabrani gratis proizvodi — isti proizvod može više puta */
  const [selected, setSelected] = useState<Product[]>([]);

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

  // Broj gratis izbora = broj pakovanja u plaćenoj varijanti (2 PAKOVANJA → 2 gratis)
  const freeCount = useMemo(() => {
    const primaryProduct = products.find((p) => p.id === primary.productId);
    if (!primaryProduct) return 1;
    const variants = getProductVariantsForCountry(primaryProduct, locale);
    const variant = variants.find((v) => v.id === primary.variantId);
    return Math.max(1, variant?.quantity ?? 1);
  }, [products, primary.productId, primary.variantId, locale]);

  const remaining = freeCount - selected.length;

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

  const finishWith = (finalSelection: Product[]) => {
    // Mora tačan broj gratis izbora (npr. 2-pak → tačno 2)
    if (finalSelection.length !== freeCount) return;
    const secondaries = finalSelection
      .map((product) => buildSecondaryItem(product))
      .filter((item): item is CartItemInput => item !== null);
    if (secondaries.length !== freeCount) return;
    onSelect(secondaries);
  };

  const handlePick = (product: Product) => {
    if (remaining <= 0) return;
    const next = [...selected, product];
    if (next.length >= freeCount) {
      finishWith(next);
      return;
    }
    setSelected(next);
  };

  const handleUnpick = (product: Product) => {
    const index = selected.findIndex((p) => p.id === product.id);
    if (index === -1) return;
    setSelected((prev) => prev.filter((_, i) => i !== index));
  };

  const selectedCountFor = (productId: string) =>
    selected.filter((p) => p.id === productId).length;

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
        className={`relative z-10 flex h-full max-h-[100dvh] w-full max-w-2xl flex-col overflow-hidden rounded-none bg-white shadow-2xl transition-all duration-300 sm:h-auto sm:max-h-[min(92vh,780px)] sm:rounded-[1.75rem] ${
          visible ? 'translate-y-0 opacity-100 sm:scale-100' : 'translate-y-8 opacity-0 sm:translate-y-4 sm:scale-95'
        }`}
      >
        {/* Header */}
        <div
          className="relative shrink-0 overflow-hidden px-4 pb-3.5 text-white sm:px-7 sm:pb-4"
          style={{
            background: 'linear-gradient(135deg, #358055 0%, #2a6844 55%, #1f5236 100%)',
            paddingTop: 'max(1rem, env(safe-area-inset-top))',
          }}
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
                {freeCount > 1
                  ? t('bogo.pair_congrats_multi', { count: freeCount })
                  : t('bogo.pair_congrats')}
              </h2>
              <p className="mt-1 text-sm font-semibold text-white/90 sm:text-base">
                {freeCount > 1
                  ? t('bogo.pair_pick_free_multi', { count: freeCount })
                  : t('bogo.pair_pick_free')}
              </p>
            </div>
          </div>

          {/* Šta je kupljeno — jasno i za netehničke korisnike */}
          <div className="relative mt-2.5 flex items-center gap-2.5 rounded-xl bg-white/12 px-3 py-2 sm:mt-3">
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-white">
              <Image src={primary.image} alt={primary.productName} fill className="object-contain p-0.5" sizes="36px" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-black leading-tight">{primary.productName}</p>
              <p className="truncate text-[11px] font-semibold text-white/80">{primary.variantName}</p>
            </div>
            <span className="shrink-0 rounded-full bg-amber-300 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-[#1f5236]">
              {t('bogo.pair_in_cart_badge', { count: freeCount })}
            </span>
          </div>
        </div>

        {/* Brojač izbora — vidljiv samo kad se bira više gratis proizvoda */}
        {freeCount > 1 && (
          <div className="flex shrink-0 items-center justify-center gap-2 border-b border-[#358055]/10 bg-[#f3faf6] px-4 py-2.5">
            <Gift className="h-4 w-4 text-[#358055]" />
            <p className="text-sm font-black text-[#358055]">
              {t('bogo.pair_progress', { selected: selected.length, total: freeCount })}
            </p>
            <div className="ml-1 flex items-center gap-1">
              {Array.from({ length: freeCount }).map((_, i) => (
                <span
                  key={i}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    i < selected.length ? 'bg-[#358055]' : 'bg-[#358055]/20'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Product grid */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3 sm:px-7 sm:py-4">
          <p className="mb-2.5 text-center text-[13px] font-bold text-slate-600 sm:mb-3 sm:text-sm">
            {freeCount > 1 ? t('bogo.pair_tap_hint_multi', { count: freeCount }) : t('bogo.pair_tap_hint')}
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
                const pickedCount = selectedCountFor(product.id);
                const isPicked = pickedCount > 0;

                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handlePick(product)}
                    className={`group relative overflow-hidden rounded-2xl border-2 bg-white p-2.5 pb-3 text-left transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(53,128,85,0.2)] active:scale-[0.98] sm:p-3 sm:pb-4 ${
                      isPicked
                        ? 'border-[#358055] shadow-[0_10px_24px_rgba(53,128,85,0.18)]'
                        : 'border-slate-200 hover:border-[#358055]'
                    }`}
                  >
                    {isSameAsPrimary && !isPicked && (
                      <span className="absolute left-2 top-2 z-10 rounded-full bg-[#F3765D] px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">
                        {t('bogo.pair_same_product')}
                      </span>
                    )}
                    {isPicked && (
                      <span className="absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-[#358055] px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">
                        <Check className="h-3 w-3" />
                        {pickedCount > 1
                          ? t('bogo.pair_picked_count', { count: pickedCount })
                          : t('bogo.pair_picked')}
                      </span>
                    )}
                    {isPicked && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleUnpick(product);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            event.stopPropagation();
                            handleUnpick(product);
                          }
                        }}
                        aria-label={t('bogo.pair_remove_one')}
                        className="absolute right-2 top-2 z-10 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/70 text-white transition hover:bg-red-500"
                      >
                        <Minus className="h-3.5 w-3.5" />
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
                    <p className="mt-0.5 line-clamp-2 min-h-[2rem] text-center text-[11px] leading-4 text-slate-500 sm:text-xs">
                      {product.shortDescription || product.purpose}
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

        {/* Footer — skip only; mora se izabrati tačan broj gratis proizvoda */}
        <div className="shrink-0 border-t border-slate-100 bg-white px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5 text-center sm:px-7 sm:pb-3 sm:pt-2">
          {freeCount > 1 && selected.length > 0 && remaining > 0 && (
            <p className="mb-1.5 text-xs font-bold text-[#F3765D]">
              {t('bogo.pair_must_pick_all', { remaining, total: freeCount })}
            </p>
          )}
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
