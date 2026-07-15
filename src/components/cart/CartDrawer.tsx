'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
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
import { getCountryConfig } from '@/config/countries';
import {
  getProductsForCountry,
  getProductVariantsForCountry,
  type Product,
} from '@/config/products';
import { calculateCouponDiscount, validateCouponWithAPI, type Coupon } from '@/config/coupons';
import {
  clearCouponCookie,
  COUPON_CLEARED_EVENT,
  getActiveCouponCode,
} from '@/utils/coupon-cookies';
import { getAmountForFreeShipping, qualifiesForFreeShipping } from '@/utils/shipping';
import { groupCartItemsForDisplay } from '@/utils/bogo-pair';
import { CouponBanner } from '@/components/shop/CouponBanner';
import type { CartLineItem } from '@/contexts/CartContext';

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

  const renderRegularLine = (line: CartLineItem) => (
    <div
      key={line.lineId}
      className="flex gap-3 rounded-[1.2rem] border border-[#358055]/10 bg-white p-3 shadow-[0_8px_20px_rgba(15,23,42,0.04)]"
    >
      <Link
        href={`/${locale}/products/${line.productSlug}`}
        onClick={closeDrawer}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[0.9rem] bg-[linear-gradient(180deg,#fafafa,#efefef)]"
      >
        <Image
          src={line.image}
          alt={line.productName}
          fill
          className="object-contain p-1"
          sizes="80px"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/${locale}/products/${line.productSlug}`}
              onClick={closeDrawer}
              className="block truncate text-sm font-black uppercase tracking-[0.01em] text-slate-900 transition-colors hover:text-[#F3765D]"
            >
              {line.productName}
            </Link>
            <p className="mt-0.5 truncate text-xs font-medium text-slate-500">{line.variantName}</p>
          </div>
          <button
            type="button"
            onClick={() => removeItem(line.lineId)}
            aria-label={t('cart.remove')}
            className="shrink-0 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-2">
          <div className="inline-flex items-center rounded-full border border-[#358055]/15 bg-white">
            <button
              type="button"
              onClick={() => updateQuantity(line.lineId, line.quantity - 1)}
              aria-label="-"
              className="inline-flex h-8 w-8 items-center justify-center rounded-l-full text-slate-600 transition-colors hover:bg-[#358055]/8 hover:text-[#358055]"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-7 text-center text-sm font-bold text-slate-900">{line.quantity}</span>
            <button
              type="button"
              onClick={() => updateQuantity(line.lineId, line.quantity + 1)}
              aria-label="+"
              className="inline-flex h-8 w-8 items-center justify-center rounded-r-full text-slate-600 transition-colors hover:bg-[#358055]/8 hover:text-[#358055]"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="text-right">
            {line.regularPrice > line.unitPrice && (
              <p className="text-xs text-slate-400 line-through">
                {formatPrice(line.regularPrice * line.quantity)}
              </p>
            )}
            <p className="text-sm font-black text-slate-950">
              {formatPrice(line.unitPrice * line.quantity)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBogoGroup = (paid: CartLineItem, free: CartLineItem[]) => (
    <div
      key={paid.bogoPairId}
      className="overflow-hidden rounded-[1.2rem] border border-[#358055]/30 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.04)]"
    >
      {/* Plaćeni proizvod */}
      <div className="flex gap-3 p-3">
        <Link
          href={`/${locale}/products/${paid.productSlug}`}
          onClick={closeDrawer}
          className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[0.9rem] bg-[linear-gradient(180deg,#fafafa,#efefef)]"
        >
          <Image
            src={paid.image}
            alt={paid.productName}
            fill
            className="object-contain p-1"
            sizes="80px"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link
                href={`/${locale}/products/${paid.productSlug}`}
                onClick={closeDrawer}
                className="block truncate text-sm font-black uppercase tracking-[0.01em] text-slate-900 transition-colors hover:text-[#F3765D]"
              >
                {paid.productName}
              </Link>
              <p className="mt-0.5 truncate text-xs font-medium text-slate-500">{paid.variantName}</p>
            </div>
            <button
              type="button"
              onClick={() => removeItem(paid.lineId)}
              aria-label={t('cart.remove')}
              className="shrink-0 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-2.5 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-[#358055]">
              {t('bogo.pair_includes_gratis', { count: free.length })}
            </span>
            <div className="text-right">
              {paid.regularPrice > (paid.bogoOriginalUnitPrice ?? paid.unitPrice) && (
                <p className="text-xs text-slate-400 line-through">
                  {formatPrice(paid.regularPrice * paid.quantity)}
                </p>
              )}
              <p className="text-sm font-black text-slate-950">
                {formatPrice((paid.bogoOriginalUnitPrice ?? paid.unitPrice) * paid.quantity)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ugnježdeni gratis proizvodi */}
      {free.length > 0 && (
        <div className="border-t border-[#358055]/10 bg-[#f3faf6] px-3 py-2.5">
          <ul className="space-y-2">
            {free.map((line) => (
              <li key={line.lineId} className="flex items-center gap-2.5 pl-2">
                <span className="h-8 w-0.5 shrink-0 rounded-full bg-[#358055]/35" aria-hidden />
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-white">
                  <Image
                    src={line.image}
                    alt={line.productName}
                    fill
                    className="object-contain p-0.5"
                    sizes="44px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-slate-800">{line.productName}</p>
                  <p className="truncate text-[11px] text-slate-500">{line.variantName}</p>
                </div>
                <span className="shrink-0 text-xs font-black uppercase tracking-wide text-[#358055]">
                  {t('bogo.pair_gratis')}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
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

  useEffect(() => {
    if (!isDrawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isDrawerOpen, closeDrawer]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[200] bg-[rgba(15,23,42,0.32)] backdrop-blur-[2px] transition-opacity duration-300 ${
          isDrawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className={`fixed inset-y-0 right-0 z-[210] flex w-full max-w-md flex-col bg-[linear-gradient(180deg,#ffffff_0%,#f8fbf9_100%)] shadow-[-24px_0_70px_rgba(15,23,42,0.18)] transition-transform duration-300 ease-out ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={t('cart.title')}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#358055]/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#358055]/10 text-[#358055]">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-black text-slate-950">{t('cart.title')}</h2>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label={t('cart.close')}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#358055]/12 bg-white text-slate-600 transition-colors hover:border-[#F3765D]/40 hover:text-[#F3765D]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#358055]/8">
              <ShoppingBag className="h-9 w-9 text-[#358055]/60" />
            </div>
            <div>
              <p className="text-lg font-black text-slate-900">{t('cart.empty_title')}</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">{t('cart.empty_subtitle')}</p>
            </div>
            <Link
              href={`/${locale}/products`}
              onClick={closeDrawer}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-[#F3765D] px-6 py-3 text-sm font-extrabold text-white shadow-[0_14px_28px_rgba(243,118,93,0.28)] transition-colors hover:bg-[#e0654d]"
            >
              {t('cart.browse_products')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="border-b border-[#358055]/10 px-5 py-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Truck className={`h-4 w-4 ${hasFreeShipping ? 'text-[#358055]' : 'text-slate-400'}`} />
                {hasFreeShipping ? (
                  <span className="text-[#358055]">{t('cart.free_shipping_unlocked')}</span>
                ) : (
                  <span className="text-slate-700">
                    {t('cart.free_shipping_progress', { amount: formatPrice(amountForFreeShipping) })}
                  </span>
                )}
              </div>
              <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-[#358055]/10">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    hasFreeShipping
                      ? 'bg-[#358055]'
                      : 'bg-[linear-gradient(90deg,#F3765D,#358055)]'
                  }`}
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {activeCoupon && (
              <div className="border-b border-[#358055]/10 px-5 py-4">
                <CouponBanner
                  coupon={activeCoupon}
                  formatPrice={formatPrice}
                  onRemove={removeCoupon}
                />
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="space-y-3">
                {displayGroups.map((group) =>
                  group.type === 'bogo'
                    ? renderBogoGroup(group.paid, group.free)
                    : renderRegularLine(group.line)
                )}
              </div>

              {/* Cross-sell: you may also like */}
              {suggestions.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between gap-2">
                    <p className="flex items-center gap-2 text-sm font-black text-slate-900">
                      <Heart className="h-4 w-4 text-[#F3765D]" />
                      {t('cart.you_may_also_like')}
                    </p>
                    {(canScrollLeft || canScrollRight) && (
                      <div className="hidden items-center gap-1.5 sm:flex">
                        <button
                          type="button"
                          onClick={() => scrollSuggestions('left')}
                          disabled={!canScrollLeft}
                          aria-label={t('common.previous')}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#358055]/15 bg-white text-slate-600 transition-colors hover:border-[#358055]/40 hover:text-[#358055] disabled:cursor-default disabled:opacity-35 disabled:hover:border-[#358055]/15 disabled:hover:text-slate-600"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => scrollSuggestions('right')}
                          disabled={!canScrollRight}
                          aria-label={t('common.next')}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#358055]/15 bg-white text-slate-600 transition-colors hover:border-[#358055]/40 hover:text-[#358055] disabled:cursor-default disabled:opacity-35 disabled:hover:border-[#358055]/15 disabled:hover:text-slate-600"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div
                    ref={suggestionsScrollRef}
                    onScroll={updateSuggestionArrows}
                    className="scrollbar-hide -mx-1 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1"
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
                          className="w-36 shrink-0 snap-start rounded-[1.1rem] border border-[#358055]/10 bg-white p-2.5 shadow-[0_8px_20px_rgba(15,23,42,0.04)]"
                        >
                          <div className="relative">
                            <Link
                              href={`/${locale}/products/${product.slug}`}
                              onClick={closeDrawer}
                              className="relative block aspect-square overflow-hidden rounded-[0.85rem] bg-[linear-gradient(180deg,#fafafa,#efefef)]"
                            >
                              <Image
                                src={product.images.main}
                                alt={product.name}
                                fill
                                className="object-contain p-1.5"
                                sizes="144px"
                              />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleSuggestionAdd(product)}
                              aria-label={`${t('common.add_to_cart')} - ${product.name}`}
                              className="absolute -bottom-1.5 -right-1.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#358055] text-white shadow-[0_8px_16px_rgba(53,128,85,0.35)] transition-all duration-200 hover:scale-110 hover:bg-[#2d6d48]"
                            >
                              <Plus className="h-4 w-4" strokeWidth={3} />
                            </button>
                          </div>
                          <p className="mt-2.5 truncate text-xs font-black uppercase tracking-[0.01em] text-slate-900">
                            {product.name}
                          </p>
                          <div className="mt-0.5 flex flex-wrap items-baseline gap-x-1.5">
                            <span className="text-sm font-black text-[#F3765D]">{formatPrice(price)}</span>
                            {hasItemDiscount && (
                              <span className="text-[11px] text-slate-400 line-through">
                                {formatPrice(variant.price)}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Summary footer */}
            <div className="border-t border-[#358055]/10 bg-white px-5 py-4 shadow-[0_-10px_30px_rgba(15,23,42,0.04)]">
              {totalSavingsWithCoupon > 0 && (
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-500">{t('cart.you_save')}</span>
                  <span className="font-bold text-[#358055]">-{formatPrice(totalSavingsWithCoupon)}</span>
                </div>
              )}
              {couponAmounts.productDiscount > 0 && activeCoupon && (
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-500">
                    {t('checkout_v2.discountLabel')} ({activeCoupon.code})
                  </span>
                  <span className="font-bold text-[#358055]">
                    -{formatPrice(couponAmounts.productDiscount)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-slate-700">{t('cart.subtotal')}</span>
                <div className="text-right">
                  {couponAmounts.productDiscount > 0 && (
                    <span className="mr-2 text-sm text-slate-400 line-through">
                      {formatPrice(subtotal)}
                    </span>
                  )}
                  <span className="text-xl font-black text-slate-950">
                    {formatPrice(subtotalWithCoupon)}
                  </span>
                </div>
              </div>
              <p className="mt-1 text-xs text-slate-400">{t('cart.shipping_calculated')}</p>

              <Link
                href={`/${locale}/checkout`}
                onClick={closeDrawer}
                className="mt-4 flex w-full items-center justify-center rounded-full bg-[#F3765D] px-6 py-4 text-base font-extrabold text-white shadow-[0_16px_32px_rgba(243,118,93,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e0654d]"
              >
                {t('cart.checkout')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button
                type="button"
                onClick={closeDrawer}
                className="mt-2.5 w-full rounded-full border border-[#358055]/15 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-[#F3765D]/30 hover:text-[#F3765D]"
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
