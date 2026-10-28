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
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Check, Gift, Minus, PartyPopper, X } from 'lucide-react';
import { getCountryConfig } from '@/config/countries';
import {
  getProductsForCountry,
  getProductVariantsForCountry,
  type Product,
} from '@/config/products';
import { getStoreVisual, tightPackshot } from '@/config/store-content';
import { landerFontClass } from '@/components/store/fonts';
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
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onSkipRef = useRef(onSkip);

  useEffect(() => {
    onSkipRef.current = onSkip;
  }, [onSkip]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Modalni prozor: fokus na „zatvori“, Tab ostaje u prozoru, Esc = isto što i „zatvori“ (onSkip),
  // a posle zatvaranja fokus se vraća na dugme koje je otvorilo prozor
  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onSkipRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
      ).filter((el) => el.getClientRects().length > 0);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;
      if (!dialog.contains(current)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (opener?.isConnected && opener !== document.body) opener.focus();
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

  // Novi providni packshot kupljenog proizvoda; proizvod bez packshot-a zadržava sliku iz korpe
  const primaryImage = tightPackshot(
    getStoreVisual({ id: primary.productId, images: { main: primary.image, gallery: [] } }).packshot
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-4">
      <div
        className={`absolute inset-0 bg-night/70 transition-opacity duration-300 motion-reduce:transition-none ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onSkip}
        aria-hidden
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bogo-pair-title"
        className={`${landerFontClass} relative z-10 flex h-full max-h-[100dvh] w-full max-w-2xl flex-col overflow-hidden rounded-none bg-white text-ink shadow-raised transition-all duration-300 motion-reduce:transition-none sm:h-auto sm:max-h-[min(92vh,780px)] sm:rounded-[1.75rem] ${
          visible ? 'translate-y-0 opacity-100 sm:scale-100' : 'translate-y-8 opacity-0 sm:translate-y-4 sm:scale-95'
        }`}
      >
        {/* Header — puna forest podloga (beli tekst), bez dekorativnih mrlja i gradijenta */}
        <div
          className="relative shrink-0 bg-forest px-4 pb-3.5 text-white sm:px-7 sm:pb-4"
          style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={onSkip}
            className="absolute right-2 top-2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25 sm:right-4 sm:top-4"
            aria-label={t('bogo.pair_close')}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>

          <div className="flex items-start gap-2.5 sm:gap-3">
            <PartyPopper className="mt-0.5 h-7 w-7 shrink-0 text-mint sm:mt-1 sm:h-9 sm:w-9" aria-hidden />
            <div className="pr-10">
              <h2 id="bogo-pair-title" className="text-balance text-[1.25rem] font-extrabold leading-tight sm:text-[1.875rem]">
                {freeCount > 1
                  ? t('bogo.pair_congrats_multi', { count: freeCount })
                  : t('bogo.pair_congrats')}
              </h2>
              <p className="mt-1 text-[0.9375rem] font-medium text-white sm:text-[1rem]">
                {freeCount > 1
                  ? t('bogo.pair_pick_free_multi', { count: freeCount })
                  : t('bogo.pair_pick_free')}
              </p>
            </div>
          </div>

          {/* Šta je kupljeno — jasno i za netehničke korisnike */}
          <div className="mt-2.5 flex items-center gap-2.5 rounded-panel bg-white/10 px-3 py-2 sm:mt-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[0.625rem] bg-white">
              <Image src={primaryImage} alt="" fill className="object-contain p-1" sizes="40px" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.875rem] font-bold leading-tight">{primary.productName}</p>
              <p className="truncate text-[0.75rem] font-medium text-white">{primary.variantName}</p>
            </div>
            <span className="shrink-0 rounded-full bg-coral-deep px-2.5 py-1 text-[0.75rem] font-bold uppercase tracking-wide text-white">
              {t('bogo.pair_in_cart_badge', { count: freeCount })}
            </span>
          </div>
        </div>

        {/* Brojač izbora — vidljiv samo kad se bira više gratis proizvoda */}
        {freeCount > 1 && (
          <div className="flex shrink-0 items-center justify-center gap-2 border-b border-line bg-mint-soft px-4 py-2.5">
            <Gift className="h-4 w-4 text-green" aria-hidden />
            <p className="text-[0.875rem] font-bold text-forest" aria-live="polite">
              {t('bogo.pair_progress', { selected: selected.length, total: freeCount })}
            </p>
            <div className="ml-1 flex items-center gap-1" aria-hidden>
              {Array.from({ length: freeCount }).map((_, i) => (
                <span
                  key={i}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    i < selected.length ? 'bg-green' : 'bg-green/20'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Product grid */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3 sm:px-7 sm:py-4">
          <p className="mb-2.5 text-balance text-center text-[0.875rem] font-semibold text-ink-soft sm:mb-3">
            {freeCount > 1 ? t('bogo.pair_tap_hint_multi', { count: freeCount }) : t('bogo.pair_tap_hint')}
          </p>

          {loading ? (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-44 rounded-card bg-paper motion-safe:animate-pulse sm:h-48" />
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
                  // Kartica je dugme za izbor; „ukloni jedan“ je zasebno dugme pored nje (ne ugnježdeno)
                  <div key={product.id} className="relative">
                    <button
                      type="button"
                      onClick={() => handlePick(product)}
                      className={`group relative flex h-full w-full flex-col overflow-hidden rounded-card border-2 bg-white p-2.5 pb-3 text-left transition hover:shadow-card active:scale-[0.98] motion-reduce:active:scale-100 sm:p-3 sm:pb-4 ${
                        isPicked ? 'border-green shadow-card' : 'border-line hover:border-green'
                      }`}
                    >
                      {isSameAsPrimary && !isPicked && (
                        <span className="absolute left-2 top-2 z-10 rounded-full bg-coral-deep px-2 py-0.5 text-[0.75rem] font-bold uppercase tracking-wide text-white">
                          {t('bogo.pair_same_product')}
                        </span>
                      )}
                      {isPicked && (
                        <span className="absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-green px-2 py-0.5 text-[0.75rem] font-bold uppercase tracking-wide text-white">
                          <Check className="h-3 w-3" aria-hidden />
                          {pickedCount > 1
                            ? t('bogo.pair_picked_count', { count: pickedCount })
                            : t('bogo.pair_picked')}
                        </span>
                      )}
                      <div className="relative mx-auto mb-1.5 mt-5 aspect-square w-full max-w-[92px] sm:mb-2 sm:max-w-[110px]">
                        <Image
                          src={tightPackshot(getStoreVisual(product).packshot)}
                          alt=""
                          fill
                          className="object-contain transition duration-300 group-hover:scale-105 motion-reduce:group-hover:scale-100"
                          sizes="130px"
                        />
                      </div>
                      <p className="line-clamp-2 text-center text-[0.875rem] font-extrabold text-ink">
                        {product.name}
                      </p>
                      <p className="mt-0.5 line-clamp-2 min-h-[2rem] text-center text-[0.75rem] leading-4 text-ink-muted sm:text-[0.8125rem]">
                        {product.shortDescription || product.purpose}
                      </p>
                      <p className="mt-0.5 text-center text-[0.8125rem] text-ink-muted sm:mt-1">
                        <span className="sr-only">{t('bogo.regular_price')}: </span>
                        <span className="line-through">{formatPrice(full)}</span>
                      </p>
                      <p className="text-center text-[1.125rem] font-extrabold uppercase tracking-wide text-forest sm:mt-0.5">
                        {t('bogo.pair_gratis')}
                      </p>
                      <span className="mt-auto flex w-full items-center justify-center gap-1.5 rounded-full bg-green px-2 py-2.5 text-[0.75rem] font-bold uppercase tracking-wide text-white transition-colors group-hover:bg-green-press sm:px-3 sm:text-[0.8125rem]">
                        <Gift className="h-3.5 w-3.5 shrink-0" aria-hidden />
                        {t('bogo.pair_take_free')}
                      </span>
                    </button>
                    {isPicked && (
                      <button
                        type="button"
                        onClick={() => handleUnpick(product)}
                        aria-label={`${t('bogo.pair_remove_one')}: ${product.name}`}
                        className="absolute right-1 top-1 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white transition-colors hover:bg-coral-deep"
                      >
                        <Minus className="h-4 w-4" aria-hidden />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer — skip only; mora se izabrati tačan broj gratis proizvoda */}
        <div className="shrink-0 border-t border-line bg-white px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5 text-center sm:px-7 sm:pb-3 sm:pt-2">
          {freeCount > 1 && selected.length > 0 && remaining > 0 && (
            <p className="mb-1.5 text-[0.8125rem] font-bold text-coral-deep" aria-live="polite">
              {t('bogo.pair_must_pick_all', { remaining, total: freeCount })}
            </p>
          )}
          <button
            type="button"
            onClick={onSkip}
            className="min-h-11 w-full py-2 text-[0.9375rem] font-semibold text-ink-muted underline-offset-2 transition-colors hover:text-ink hover:underline"
          >
            {t('bogo.pair_skip')}
          </button>
        </div>
      </div>
    </div>
  );
}
