'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { landerFontClass } from '@/components/store/fonts';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useBogoPair } from '@/components/shop/BogoPairModal';
import { getCountryConfig, getDefaultCourier } from '@/config/countries';
import {
  getProductsForCountry,
  getProductVariantsForCountry,
  type Product,
} from '@/config/products';
import { calculateCouponDiscount, validateCouponWithAPI, type Coupon } from '@/config/coupons';
import { getStoreVisual, tightPackshot } from '@/config/store-content';
import {
  clearCouponCookie,
  COUPON_CLEARED_EVENT,
  getActiveCouponCode,
} from '@/utils/coupon-cookies';
import { calculateShippingCost, getAmountForFreeShipping, qualifiesForFreeShipping } from '@/utils/shipping';
import { groupCartItemsForDisplay } from '@/utils/bogo-pair';
import { CouponBanner } from '@/components/shop/CouponBanner';
import { cn } from '@/lib/utils';
import type { CartLineItem } from '@/contexts/CartContext';

/** Elementi do kojih se stiže tasterom Tab (zamka fokusa u otvorenoj korpi) */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/* Slike stavki: odmah (ne lenjo) — korpa je van ekrana kada se stavka doda, pa lenja slika nikad ne krene */
/** Novi providni packshot (isti kao na karticama proizvoda); proizvod bez packshot-a zadržava sliku iz korpe */
const linePackshot = (line: CartLineItem) =>
  tightPackshot(getStoreVisual({ id: line.productId, images: { main: line.image, gallery: [] } }).packshot);

export function CartDrawer() {
  const t = useTranslations();
  const locale = useLocale();
  const countryConfig = getCountryConfig(locale);
  const {
    items,
    subtotal,
    totalSavings,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
  } = useCart();
  const { requestAdd } = useBogoPair();

  const headingId = useId();
  const suggestionsHeadingId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  // Naslovi zatvorene korpe nisu deo strukture stranice (SSR HTML, alati za pregled naslova)
  const TitleTag = isDrawerOpen ? 'h2' : 'p';
  const SubtitleTag = isDrawerOpen ? 'h3' : 'p';

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const suggestionsScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);

  const updateSuggestionArrows = useCallback(() => {
    const el = suggestionsScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  const scrollSuggestions = (direction: 'left' | 'right') => {
    const el = suggestionsScrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  const displayGroups = useMemo(() => groupCartItemsForDisplay(items), [items]);

  const formatPrice = (amount: number) =>
    `${new Intl.NumberFormat('sr-RS', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)} ${countryConfig.currencySymbol}`;

  const lineThumbnail = (line: CartLineItem) => (
    // Slika vodi na isti proizvod kao naziv — van Tab redosleda i bez dupliranog naziva za čitače ekrana
    <Link
      href={`/${locale}/products/${line.productSlug}`}
      onClick={closeDrawer}
      tabIndex={-1}
      aria-hidden
      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-panel bg-paper"
    >
      <Image src={linePackshot(line)} alt="" fill loading="eager" className="object-contain p-1.5" sizes="80px" />
    </Link>
  );

  const lineHeader = (line: CartLineItem) => (
    <div className="flex items-start justify-between gap-1">
      <div className="min-w-0 pt-0.5">
        <Link
          href={`/${locale}/products/${line.productSlug}`}
          onClick={closeDrawer}
          className="block truncate text-[0.9375rem] font-bold uppercase leading-snug text-ink transition-colors hover:text-forest"
        >
          {line.productName}
        </Link>
        <p className="mt-0.5 truncate text-[0.8125rem] text-ink-muted">{line.variantName}</p>
      </div>
      <button
        type="button"
        onClick={() => removeItem(line.lineId)}
        aria-label={t('cart.remove_item', { product: line.productName })}
        className="-mr-2 -mt-1.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-coral-soft hover:text-coral-deep"
      >
        <Trash2 className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );

  const linePrice = (regular: number, charged: number) => (
    <div className="text-right">
      {regular > charged && (
        <p className="text-[0.8125rem] text-ink-muted">
          <span className="sr-only">{t('bogo.regular_price')}: </span>
          <span className="line-through">{formatPrice(regular)}</span>
        </p>
      )}
      <p className="text-[0.9375rem] font-extrabold text-ink">{formatPrice(charged)}</p>
    </div>
  );

  const renderRegularLine = (line: CartLineItem) => (
    <li key={line.lineId} className="flex gap-3 py-4">
      {lineThumbnail(line)}

      <div className="min-w-0 flex-1">
        {lineHeader(line)}

        <div className="mt-2 flex items-center justify-between gap-2">
          <div
            role="group"
            aria-label={`${t('cart.quantity')}: ${line.productName}`}
            className="inline-flex items-center rounded-full border border-line bg-white"
          >
            <button
              type="button"
              onClick={() => updateQuantity(line.lineId, line.quantity - 1)}
              aria-label={t('cart.decrease_qty', { product: line.productName })}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-mint-soft hover:text-forest"
            >
              <Minus className="h-4 w-4" aria-hidden />
            </button>
            <span className="min-w-8 text-center text-[0.9375rem] font-bold tabular-nums text-ink" aria-live="polite">
              {line.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(line.lineId, line.quantity + 1)}
              aria-label={t('cart.increase_qty', { product: line.productName })}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-mint-soft hover:text-forest"
            >
              <Plus className="h-4 w-4" aria-hidden />
            </button>
          </div>

          {linePrice(line.regularPrice * line.quantity, line.unitPrice * line.quantity)}
        </div>
      </div>
    </li>
  );

  const renderBogoGroup = (paid: CartLineItem, free: CartLineItem[]) => (
    <li key={paid.bogoPairId} className="py-4">
      {/* Plaćeni proizvod */}
      <div className="flex gap-3">
        {lineThumbnail(paid)}

        <div className="min-w-0 flex-1">
          {lineHeader(paid)}

          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="text-[0.8125rem] font-semibold text-forest">
              {t('bogo.pair_includes_gratis', { count: free.length })}
            </span>
            {linePrice(
              paid.regularPrice * paid.quantity,
              (paid.bogoOriginalUnitPrice ?? paid.unitPrice) * paid.quantity
            )}
          </div>
        </div>
      </div>

      {/* Ugnježdeni gratis proizvodi */}
      {free.length > 0 && (
        <ul className="mt-3 space-y-2 rounded-panel bg-mint-soft p-2.5">
          {free.map((line) => (
            <li key={line.lineId} className="flex items-center gap-2.5">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[0.625rem] bg-white">
                <Image src={linePackshot(line)} alt="" fill loading="eager" className="object-contain p-1" sizes="44px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.8125rem] font-bold text-ink">{line.productName}</p>
                <p className="truncate text-[0.75rem] text-ink-muted">{line.variantName}</p>
              </div>
              <span className="shrink-0 text-[0.8125rem] font-extrabold uppercase text-forest">
                {t('bogo.pair_gratis')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </li>
  );

  useEffect(() => {
    if (!isDrawerOpen || allProducts.length > 0) return;

    let cancelled = false;
    getProductsForCountry(locale, locale)
      .then((loaded) => {
        if (!cancelled) setAllProducts(loaded);
      })
      .catch((error) => console.error('Failed to load cross-sell products:', error));

    return () => {
      cancelled = true;
    };
  }, [isDrawerOpen, allProducts.length, locale]);

  const suggestions = useMemo(() => {
    const productIdsInCart = new Set(items.map((line) => line.productId));
    // Cross-sell proizvodi artikala iz korpe imaju prednost u predlozima
    const crossSellIds = new Set(
      items.flatMap((line) => allProducts.find((p) => p.id === line.productId)?.crossSells ?? [])
    );
    const available = allProducts.filter((product) => !productIdsInCart.has(product.id));
    const prioritized = available.filter((product) => crossSellIds.has(product.id));
    const rest = available.filter((product) => !crossSellIds.has(product.id));
    return [...prioritized, ...rest].slice(0, 6);
  }, [allProducts, items]);

  useEffect(() => {
    const el = suggestionsScrollRef.current;
    if (!isDrawerOpen || !el) return;

    updateSuggestionArrows();
    const observer = new ResizeObserver(updateSuggestionArrows);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isDrawerOpen, suggestions.length, updateSuggestionArrows]);

  const handleSuggestionAdd = (product: Product) => {
    const variants = getProductVariantsForCountry(product, locale);
    const variant = variants.find((v) => v.isDefault) || variants[0];
    if (!variant) return;

    requestAdd({
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
    });
  };

  const hasFreeShipping = qualifiesForFreeShipping(subtotal, countryConfig);
  const amountForFreeShipping = getAmountForFreeShipping(subtotal, countryConfig);
  const couponAmounts = activeCoupon
    ? calculateCouponDiscount(activeCoupon, subtotal, 0)
    : { productDiscount: 0, shippingDiscount: 0, totalDiscount: 0 };
  const subtotalWithCoupon = Math.max(
    0,
    Math.round((subtotal - couponAmounts.productDiscount) * 100) / 100
  );
  const totalSavingsWithCoupon = Math.round(
    (totalSavings + couponAmounts.productDiscount) * 100
  ) / 100;
  const freeShippingProgress = Math.min(
    (subtotal / countryConfig.business.freeShippingThreshold) * 100,
    100
  );
  // Tačan iznos dostave — isti obračun kao u checkout-u (prag za besplatnu dostavu, kupon za besplatnu dostavu)
  const baseShippingCost = hasFreeShipping
    ? 0
    : calculateShippingCost(subtotal, getDefaultCourier(countryConfig), countryConfig);
  const shippingCost = activeCoupon?.type === 'free_shipping' ? 0 : baseShippingCost;
  const totalToPay = Math.round((subtotalWithCoupon + shippingCost) * 100) / 100;

  useEffect(() => {
    if (!isDrawerOpen || subtotal <= 0) {
      if (subtotal <= 0) setActiveCoupon(null);
      return;
    }

    // 1+1 se ne kombinuje sa drugim kuponima
    if (items.some((line) => Boolean(line.bogoPairId))) {
      setActiveCoupon(null);
      return;
    }

    const code = getActiveCouponCode();
    if (!code) {
      setActiveCoupon(null);
      return;
    }

    let cancelled = false;
    validateCouponWithAPI(code, subtotal, countryConfig.code)
      .then((result) => {
        if (cancelled) return;
        setActiveCoupon(
          result.valid && result.coupon && result.coupon.type !== 'bogo'
            ? result.coupon
            : null
        );
      })
      .catch((error) => {
        console.error('Cart coupon validation failed:', error);
        if (!cancelled) setActiveCoupon(null);
      });

    return () => {
      cancelled = true;
    };
  }, [countryConfig.code, isDrawerOpen, subtotal, items]);

  useEffect(() => {
    const handleCouponCleared = () => setActiveCoupon(null);
    window.addEventListener(COUPON_CLEARED_EVENT, handleCouponCleared);
    return () => window.removeEventListener(COUPON_CLEARED_EVENT, handleCouponCleared);
  }, []);

  const removeCoupon = () => {
    clearCouponCookie();
    setActiveCoupon(null);
  };

  // Modalna korpa: fokus na „zatvori“, Tab ostaje u korpi, Esc zatvara, fokus se vraća onome ko je otvorio
  useEffect(() => {
    const panel = panelRef.current;
    if (!isDrawerOpen || !panel) return;

    const active = document.activeElement;
    openerRef.current =
      active instanceof HTMLElement && active !== document.body && !panel.contains(active)
        ? active
        : null;
    closeButtonRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDrawer();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.tabIndex >= 0 && el.getClientRects().length > 0
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;

      if (!panel.contains(current)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
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
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);

      // Fokus se vraća samo ako je ostao u korpi — ne otima ga prozoru koji se upravo otvorio (npr. 1+1)
      const current = document.activeElement;
      if (current && current !== document.body && !panel.contains(current)) return;
      const opener = openerRef.current?.isConnected
        ? openerRef.current
        : Array.from(document.querySelectorAll<HTMLElement>('[data-cart-button]')).find(
            (el) => el.getClientRects().length > 0
          );
      opener?.focus();
    };
  }, [isDrawerOpen, closeDrawer]);

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-[200] bg-night/50 transition-opacity duration-300 motion-reduce:transition-none',
          isDrawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer panel — zatvorena korpa je inert i nevidljiva (posle izlaska), van Tab redosleda i stabla pristupačnosti */}
      <aside
        ref={panelRef}
        className={cn(
          landerFontClass,
          'fixed inset-y-0 right-0 z-[210] flex w-full max-w-md flex-col bg-white text-ink duration-300 ease-out motion-reduce:transition-none',
          // Otvaranje: vidljiva odmah (fokus na „zatvori“ mora da uspe); zatvaranje: nevidljiva tek posle izlaska
          isDrawerOpen
            ? 'visible translate-x-0 shadow-raised transition-[transform,box-shadow]'
            : 'invisible translate-x-full shadow-none transition-[transform,box-shadow,visibility]'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        aria-hidden={!isDrawerOpen}
        inert={!isDrawerOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-mint-soft text-green">
              <ShoppingBag className="h-5 w-5" aria-hidden />
            </span>
            <TitleTag id={headingId} className="text-[1.25rem] font-extrabold leading-tight text-ink">
              {t('cart.title')}
            </TitleTag>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeDrawer}
            aria-label={t('cart.close')}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-line bg-white text-ink transition-colors hover:border-green hover:text-forest"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-mint-soft">
              <ShoppingBag className="h-9 w-9 text-green" aria-hidden />
            </span>
            <div>
              <p className="text-balance text-[1.125rem] font-extrabold text-ink">{t('cart.empty_title')}</p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">{t('cart.empty_subtitle')}</p>
            </div>
            <Link
              href={`/${locale}/products`}
              onClick={closeDrawer}
              className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-green px-6 text-[1rem] font-bold text-white transition-colors hover:bg-green-press"
            >
              {t('cart.browse_products')}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="border-b border-line px-5 py-3.5">
              <p className="flex items-center gap-2 text-[0.875rem] font-semibold">
                <Truck className={cn('h-4 w-4 shrink-0', hasFreeShipping ? 'text-green' : 'text-ink-muted')} aria-hidden />
                {hasFreeShipping ? (
                  <span className="text-forest">{t('cart.free_shipping_unlocked')}</span>
                ) : (
                  <span className="text-ink-soft">
                    {t('cart.free_shipping_progress', { amount: formatPrice(amountForFreeShipping) })}
                  </span>
                )}
              </p>
              <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-green/15" aria-hidden>
                <div
                  className="h-full rounded-full bg-green transition-[width] duration-500 motion-reduce:transition-none"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {activeCoupon && (
              <div className="border-b border-line px-5 py-3">
                <CouponBanner
                  coupon={activeCoupon}
                  formatPrice={formatPrice}
                  onRemove={removeCoupon}
                />
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5">
              <ul className="divide-y divide-line">
                {displayGroups.map((group) =>
                  group.type === 'bogo'
                    ? renderBogoGroup(group.paid, group.free)
                    : renderRegularLine(group.line)
                )}
              </ul>

              {/* Cross-sell: you may also like */}
              {suggestions.length > 0 && (
                <section aria-labelledby={suggestionsHeadingId} className="border-t border-line pb-5 pt-4">
                  <div className="flex items-center justify-between gap-2">
                    <SubtitleTag
                      id={suggestionsHeadingId}
                      className="flex items-center gap-2 text-balance text-[0.9375rem] font-extrabold text-ink"
                    >
                      <Heart className="h-4 w-4 shrink-0 text-coral" aria-hidden />
                      {t('cart.you_may_also_like')}
                    </SubtitleTag>
                    {(canScrollLeft || canScrollRight) && (
                      <div className="hidden items-center gap-1.5 sm:flex">
                        <button
                          type="button"
                          onClick={() => scrollSuggestions('left')}
                          disabled={!canScrollLeft}
                          aria-label={t('common.previous')}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-line bg-white text-ink transition-colors hover:border-green hover:text-forest disabled:cursor-default disabled:opacity-40 disabled:hover:border-line disabled:hover:text-ink"
                        >
                          <ChevronLeft className="h-4 w-4" aria-hidden />
                        </button>
                        <button
                          type="button"
                          onClick={() => scrollSuggestions('right')}
                          disabled={!canScrollRight}
                          aria-label={t('common.next')}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-line bg-white text-ink transition-colors hover:border-green hover:text-forest disabled:cursor-default disabled:opacity-40 disabled:hover:border-line disabled:hover:text-ink"
                        >
                          <ChevronRight className="h-4 w-4" aria-hidden />
                        </button>
                      </div>
                    )}
                  </div>
                  <div
                    ref={suggestionsScrollRef}
                    onScroll={updateSuggestionArrows}
                    className="scrollbar-hide -mx-1 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2"
                  >
                    {suggestions.map((product) => {
                      const variants = getProductVariantsForCountry(product, locale);
                      const variant = variants.find((v) => v.isDefault) || variants[0];
                      if (!variant) return null;
                      const price = variant.discountPrice ?? variant.price;
                      const hasItemDiscount = Boolean(
                        variant.discountPrice && variant.discountPrice < variant.price
                      );

                      return (
                        <div
                          key={product.id}
                          className="w-36 shrink-0 snap-start rounded-panel border border-line bg-white p-2.5"
                        >
                          <div className="relative">
                            <Link
                              href={`/${locale}/products/${product.slug}`}
                              onClick={closeDrawer}
                              className="relative block aspect-square overflow-hidden rounded-[0.625rem] bg-paper"
                            >
                              <Image
                                src={tightPackshot(getStoreVisual(product).packshot)}
                                alt={product.name}
                                fill
                                className="object-contain p-2"
                                sizes="144px"
                              />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleSuggestionAdd(product)}
                              aria-label={`${t('common.add_to_cart')} - ${product.name}`}
                              className="absolute -bottom-2 -right-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-green text-white shadow-float transition-colors hover:bg-green-press"
                            >
                              <Plus className="h-4 w-4" strokeWidth={3} aria-hidden />
                            </button>
                          </div>
                          <p className="mt-3 truncate text-[0.8125rem] font-bold uppercase text-ink">
                            {product.name}
                          </p>
                          <div className="mt-0.5 flex flex-wrap items-baseline gap-x-1.5">
                            <span className="text-[0.9375rem] font-extrabold text-ink">{formatPrice(price)}</span>
                            {hasItemDiscount && (
                              <span className="text-[0.75rem] text-ink-muted">
                                <span className="sr-only">{t('bogo.regular_price')}: </span>
                                <span className="line-through">{formatPrice(variant.price)}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>

            {/* Summary footer — tačan iznos sa dostavom pre checkout-a (PRODUCT.md: cena bez iznenađenja) */}
            <div className="border-t border-line bg-white px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
              <dl className="space-y-1.5 text-[0.875rem]">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-ink-soft">{t('cart.subtotal')}</dt>
                  <dd className="font-medium text-ink">{formatPrice(subtotal)}</dd>
                </div>
                {couponAmounts.productDiscount > 0 && activeCoupon && (
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-ink-soft">
                      {t('checkout_v2.discountLabel')} ({activeCoupon.code})
                    </dt>
                    <dd className="font-semibold text-forest">
                      −{formatPrice(couponAmounts.productDiscount)}
                    </dd>
                  </div>
                )}
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-ink-soft">{t('store.form.shipping')}</dt>
                  <dd className={cn('font-medium', shippingCost === 0 ? 'text-forest' : 'text-ink')}>
                    {shippingCost === 0 ? t('store.form.free') : formatPrice(shippingCost)}
                  </dd>
                </div>
                <div className="flex items-end justify-between gap-3 border-t border-line pt-2.5">
                  <dt className="pb-0.5 text-[0.9375rem] font-semibold text-ink">{t('store.form.total')}</dt>
                  <dd className="text-[1.25rem] font-extrabold leading-none text-ink">
                    {formatPrice(totalToPay)}
                  </dd>
                </div>
              </dl>
              {totalSavingsWithCoupon > 0 && (
                <p className="mt-1.5 text-right text-[0.8125rem] font-medium text-coral-deep">
                  {t('store.form.you_save', { amount: formatPrice(totalSavingsWithCoupon) })}
                </p>
              )}

              <Link
                href={`/${locale}/checkout`}
                onClick={closeDrawer}
                className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-green px-6 text-[1.125rem] font-bold text-white shadow-press transition hover:bg-green-press active:translate-y-[3px] active:shadow-none"
              >
                {t('cart.checkout')}
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
              <button
                type="button"
                onClick={closeDrawer}
                className="mt-2.5 min-h-12 w-full rounded-full border-2 border-line bg-white px-6 text-[0.9375rem] font-semibold text-ink transition-colors hover:border-green hover:text-forest"
              >
                {t('cart.continue_shopping')}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
