'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { getCountryConfig } from '@/config/countries';
import { getAmountForFreeShipping, qualifiesForFreeShipping } from '@/utils/shipping';

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

  const formatPrice = (amount: number) =>
    `${new Intl.NumberFormat('sr-RS', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)} ${countryConfig.currencySymbol}`;

  const hasFreeShipping = qualifiesForFreeShipping(subtotal, countryConfig);
  const amountForFreeShipping = getAmountForFreeShipping(subtotal, countryConfig);
  const freeShippingProgress = Math.min(
    (subtotal / countryConfig.business.freeShippingThreshold) * 100,
    100
  );

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

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="space-y-3">
                {items.map((line) => (
                  <div
                    key={line.variantId}
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
                          onClick={() => removeItem(line.variantId)}
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
                            onClick={() => updateQuantity(line.variantId, line.quantity - 1)}
                            aria-label="-"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-l-full text-slate-600 transition-colors hover:bg-[#358055]/8 hover:text-[#358055]"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-7 text-center text-sm font-bold text-slate-900">{line.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(line.variantId, line.quantity + 1)}
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
                ))}
              </div>
            </div>

            {/* Summary footer */}
            <div className="border-t border-[#358055]/10 bg-white px-5 py-4 shadow-[0_-10px_30px_rgba(15,23,42,0.04)]">
              {totalSavings > 0 && (
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-500">{t('cart.you_save')}</span>
                  <span className="font-bold text-[#358055]">-{formatPrice(totalSavings)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-slate-700">{t('cart.subtotal')}</span>
                <span className="text-xl font-black text-slate-950">{formatPrice(subtotal)}</span>
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
