'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  Check,
  ChevronRight,
  CreditCard,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  Zap,
} from 'lucide-react';
import {
  Product,
  ProductVariant,
  getProductsForCountry,
  getProductVariantsForCountry,
} from '@/config/products';
import { CountryConfig, getDefaultCourier } from '@/config/countries';
import { useCart } from '@/contexts/CartContext';
import { ShopHeader } from '@/components/shop/ShopHeader';
import { Footer } from '@/components/ui/footer';
import { CookieConsent } from '@/components/features/CookieConsent';
import { EnhancedImageGallery } from '@/components/features/EnhancedImageGallery';
import { ProductDetailsAccordion } from '@/components/features/ProductDetailsAccordion';
import { AdvancedFAQ } from '@/components/features/AdvancedFAQ';
import { ProofSection } from '@/components/product-page/ProofSection';
import { BenefitsSection } from '@/components/product-page/BenefitsSection';
import { IngredientsShowcase } from '@/components/product-page/IngredientsShowcase';
import { RegulatoryBadge } from '@/components/product-page/RegulatoryBadge';
import { PixelTracker, usePixelTracking } from '@/components/tracking/PixelTracker';
import { useMarketingTracking } from '@/hooks/useMarketingTracking';
import { cn } from '@/lib/utils';

interface ClassicProductPageProps {
  product: Product;
  countryConfig: CountryConfig;
  locale: string;
}

export function ClassicProductPage({ product, countryConfig, locale }: ClassicProductPageProps) {
  const t = useTranslations();
  const router = useRouter();
  const { addItem, openDrawer } = useCart();
  const { trackEvent } = usePixelTracking(countryConfig.code);

  useMarketingTracking();

  // Variants with prices converted to the country currency
  const variants = useMemo(
    () => getProductVariantsForCountry(product, locale),
    [product, locale]
  );
  const defaultVariant = variants.find((v) => v.isDefault) || variants[0];

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(defaultVariant);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const courier = getDefaultCourier(countryConfig);
  const reviewCount = product.testimonials?.length ?? 0;

  const unitPrice = selectedVariant.discountPrice ?? selectedVariant.price;
  const hasDiscount = Boolean(selectedVariant.discountPrice && selectedVariant.discountPrice < selectedVariant.price);
  const discountPercent = hasDiscount
    ? Math.round((1 - (selectedVariant.discountPrice! / selectedVariant.price)) * 100)
    : 0;

  const formatPrice = (amount: number) =>
    `${new Intl.NumberFormat('sr-RS', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)} ${countryConfig.currencySymbol}`;

  // ViewContent pixel event
  useEffect(() => {
    const sku = defaultVariant.sku || product.id;
    trackEvent('view_content', {
      content_type: 'product',
      content_name: product.name,
      content_ids: [sku],
      contents: [{ id: sku, quantity: 1, item_price: defaultVariant.discountPrice ?? defaultVariant.price }],
      currency: countryConfig.currency,
      value: defaultVariant.discountPrice ?? defaultVariant.price,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  // Related products (cross-sell strip)
  useEffect(() => {
    let cancelled = false;

    const loadRelated = async () => {
      try {
        const all = await getProductsForCountry(locale, locale);
        if (!cancelled) {
          setRelatedProducts(all.filter((item) => item.id !== product.id).slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to load related products:', error);
      }
    };

    loadRelated();
    return () => {
      cancelled = true;
    };
  }, [locale, product.id]);

  const buildCartItem = () => ({
    productId: product.id,
    productSlug: product.slug,
    variantId: selectedVariant.id,
    sku: selectedVariant.sku,
    productName: product.name,
    variantName: selectedVariant.name,
    image: product.images.main,
    unitPrice,
    regularPrice: selectedVariant.price,
    currency: countryConfig.currency,
  });

  const trackAddToCart = () => {
    trackEvent('add_to_cart', {
      content_type: 'product',
      content_name: product.name,
      content_ids: [selectedVariant.sku],
      contents: [{ id: selectedVariant.sku, quantity, item_price: unitPrice }],
      currency: countryConfig.currency,
      value: unitPrice * quantity,
    });
  };

  const handleAddToCart = () => {
    addItem(buildCartItem(), quantity);
    trackAddToCart();
    toast.success(t('product.add_to_cart_success'));
    openDrawer();
  };

  const handleBuyNow = () => {
    addItem(buildCartItem(), quantity);
    trackAddToCart();
    router.push(`/${locale}/checkout`);
  };

  const trustItems = [
    {
      icon: Truck,
      text: t('shop.free_shipping_over', { amount: formatPrice(countryConfig.business.freeShippingThreshold) }),
    },
    {
      icon: Zap,
      text: t('shop.delivery_time', { time: courier.deliveryTime }),
    },
    {
      icon: CreditCard,
      text: t('shop.cod_payment'),
    },
    {
      icon: RotateCcw,
      text: t('shop.return_policy', { days: countryConfig.business.returnPeriodDays }),
    },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#f6f8f6_0%,#ffffff_30%,#f8fbf9_65%,#ffffff_100%)]" style={{ maxWidth: '100vw' }}>
      <PixelTracker countryCode={countryConfig.code} />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-[#358055]/8 blur-3xl" />
        <div className="absolute top-[24rem] -left-20 h-80 w-80 rounded-full bg-[#F3765D]/8 blur-3xl" />
      </div>

      <ShopHeader />

      <main className="relative pb-24 md:pb-16">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 pt-4 md:pt-6">
          <nav className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500" aria-label="Breadcrumb">
            <Link href={`/${locale}`} className="transition-colors hover:text-[#F3765D]">
              {t('navigation.home')}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <Link href={`/${locale}/products`} className="transition-colors hover:text-[#F3765D]">
              {t('navigation.products')}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <span className="font-semibold text-slate-800">{product.name}</span>
          </nav>
        </div>

        {/* Main product section */}
        <section className="pt-4 md:pt-6">
          <div className="container mx-auto px-4">
            <div className="section-card-strong overflow-hidden px-5 py-6 md:px-8 md:py-8 lg:px-10 lg:py-9">
              <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
                {/* Gallery */}
                <div className="relative">
                  <div className="absolute -top-5 -left-5 hidden h-24 w-24 rounded-full bg-[#F3765D]/15 blur-2xl md:block" />
                  <div className="absolute -right-4 bottom-10 hidden h-28 w-28 rounded-full bg-[#358055]/15 blur-2xl md:block" />
                  <EnhancedImageGallery
                    images={product.images}
                    productName={product.name}
                    className="w-full"
                    priority={true}
                  />
                </div>

                {/* Product info */}
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-[#358055]/20 bg-[#358055]/10 px-3 py-1 text-[13px] font-extrabold tracking-[0.01em] text-[#2f6f4a]">
                      {t('homepage.trust_natural_ingredients')}
                    </span>
                    {hasDiscount && (
                      <span className="inline-flex items-center rounded-full border border-[#F3765D]/20 bg-[#F3765D]/10 px-3 py-1 text-[13px] font-extrabold tracking-[0.01em] text-[#ba5a47]">
                        -{discountPercent}%
                      </span>
                    )}
                    <span className="inline-flex items-center rounded-full border border-[#358055]/15 bg-white px-3 py-1 text-[13px] font-semibold text-[#358055]">
                      <Check className="mr-1 h-3.5 w-3.5" />
                      {t('product.in_stock')}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h1 className="text-3xl font-black leading-[1.1] tracking-[-0.01em] text-slate-950 md:text-4xl">
                      {product.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <div className="flex text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                        <span className="font-semibold text-slate-800">4.97/5</span>
                      </div>
                      {reviewCount > 0 && (
                        <span className="text-slate-500">
                          {t('sections.based_on_reviews', { count: reviewCount })}
                        </span>
                      )}
                    </div>
                    <p className="text-base leading-relaxed text-slate-600 md:text-lg">
                      {product.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="flex flex-wrap items-end gap-3">
                    <span className="text-4xl font-black leading-none text-[#358055] md:text-[2.8rem]">
                      {formatPrice(unitPrice)}
                    </span>
                    {hasDiscount && (
                      <span className="pb-1 text-xl font-semibold text-slate-400 line-through">
                        {formatPrice(selectedVariant.price)}
                      </span>
                    )}
                  </div>

                  {/* Variant selector */}
                  {variants.length > 1 && (
                    <div className="space-y-2.5">
                      <p className="text-sm font-bold uppercase tracking-[0.08em] text-slate-700">
                        {t('shop.choose_variant')}
                      </p>
                      <div className="grid gap-2.5">
                        {variants.map((variant) => {
                          const isSelected = variant.id === selectedVariant.id;
                          const variantPrice = variant.discountPrice ?? variant.price;
                          const variantHasDiscount = Boolean(variant.discountPrice && variant.discountPrice < variant.price);

                          return (
                            <button
                              key={variant.id}
                              type="button"
                              onClick={() => setSelectedVariant(variant)}
                              className={cn(
                                'flex items-center justify-between gap-3 rounded-[1.1rem] border-2 bg-white px-4 py-3 text-left transition-all duration-200',
                                isSelected
                                  ? 'border-[#358055] shadow-[0_10px_24px_rgba(53,128,85,0.14)]'
                                  : 'border-[#358055]/12 hover:border-[#358055]/40'
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className={cn(
                                    'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                                    isSelected ? 'border-[#358055] bg-[#358055]' : 'border-slate-300 bg-white'
                                  )}
                                >
                                  {isSelected && <Check className="h-3 w-3 text-white" />}
                                </span>
                                <div>
                                  <p className="text-sm font-bold text-slate-900">{variant.name}</p>
                                  {(variant.quantity ?? 1) > 1 && (
                                    <p className="text-xs font-medium text-[#358055]">
                                      {formatPrice(Math.round((variantPrice / (variant.quantity ?? 1)) * 100) / 100)} {t('bundles.per_item')}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                {variantHasDiscount && (
                                  <p className="text-xs text-slate-400 line-through">{formatPrice(variant.price)}</p>
                                )}
                                <p className="text-base font-black text-slate-950">{formatPrice(variantPrice)}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quantity + actions */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-bold uppercase tracking-[0.08em] text-slate-700">
                        {t('cart.quantity')}
                      </p>
                      <div className="inline-flex items-center rounded-full border border-[#358055]/15 bg-white shadow-[0_6px_14px_rgba(15,23,42,0.04)]">
                        <button
                          type="button"
                          onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                          aria-label="-"
                          className="inline-flex h-11 w-11 items-center justify-center rounded-l-full text-slate-600 transition-colors hover:bg-[#358055]/8 hover:text-[#358055]"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-10 text-center text-base font-black text-slate-900">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity((prev) => Math.min(99, prev + 1))}
                          aria-label="+"
                          className="inline-flex h-11 w-11 items-center justify-center rounded-r-full text-slate-600 transition-colors hover:bg-[#358055]/8 hover:text-[#358055]"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5 sm:flex-row">
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className="inline-flex flex-1 items-center justify-center rounded-full bg-[#F3765D] px-6 py-4 text-base font-extrabold text-white shadow-[0_18px_36px_rgba(243,118,93,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e0654d]"
                      >
                        <ShoppingBag className="mr-2 h-5 w-5" />
                        {t('common.add_to_cart')}
                      </button>
                      <button
                        type="button"
                        onClick={handleBuyNow}
                        className="inline-flex flex-1 items-center justify-center rounded-full bg-[#358055] px-6 py-4 text-base font-extrabold text-white shadow-[0_18px_36px_rgba(53,128,85,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2d6d48]"
                      >
                        {t('common.buy_now')}
                      </button>
                    </div>
                  </div>

                  {/* Trust rows */}
                  <div className="overflow-hidden rounded-[1.4rem] border border-[#358055]/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(248,250,248,0.94))]">
                    {trustItems.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.text}
                          className={cn(
                            'flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700',
                            index > 0 && 'border-t border-[#358055]/10'
                          )}
                        >
                          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#358055]/18 bg-[#358055]/8">
                            <Icon className="h-4 w-4 text-[#358055]" />
                          </span>
                          <span className="leading-5">{item.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  <RegulatoryBadge product={product} locale={locale} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Informative sections reused from the funnel pages */}
        <BenefitsSection product={product} />

        <ProofSection product={product} />

        <IngredientsShowcase product={product} />

        {/* Usage, warnings and full ingredient list */}
        <section className="py-8 md:py-10">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#358055]">
                {t('sections.detailed_information')}
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950 md:text-4xl">
                {t('shop.details_title')}
              </h2>
            </div>
            <div className="mt-8">
              <ProductDetailsAccordion product={product} />
            </div>
          </div>
        </section>

        {/* Product FAQ */}
        <section className="py-8 md:py-10">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <AdvancedFAQ countryCode={locale} product={product} className="section-card-strong p-4 md:p-8" />
            </div>
          </div>
        </section>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="py-8 md:py-10">
            <div className="container mx-auto px-4">
              <div className="mb-6 flex items-end justify-between gap-4">
                <h2 className="text-2xl font-black leading-tight text-slate-950 md:text-3xl">
                  {t('shop.related_products')}
                </h2>
                <Link
                  href={`/${locale}/products`}
                  className="inline-flex shrink-0 items-center text-sm font-semibold text-[#F3765D] transition-colors hover:text-[#e0654d]"
                >
                  {t('shop.view_all')}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {relatedProducts.map((related) => {
                  const relatedVariants = getProductVariantsForCountry(related, locale);
                  const relatedDefault = relatedVariants.find((v) => v.isDefault) || relatedVariants[0];
                  const relatedPrice = relatedDefault.discountPrice ?? relatedDefault.price;

                  return (
                    <Link
                      key={related.id}
                      href={`/${locale}/products/${related.slug}`}
                      className="group relative overflow-hidden rounded-[1.35rem] border border-[#d7e6de] bg-[linear-gradient(180deg,#f7faf8_0%,#eef4f0_100%)] shadow-[0_14px_34px_rgba(15,23,42,0.05)] transition-transform duration-300 hover:-translate-y-1"
                    >
                      <div className="relative aspect-square overflow-hidden bg-[linear-gradient(180deg,#fafafa_0%,#ececec_100%)]">
                        <Image
                          src={related.images.main}
                          alt={related.name}
                          fill
                          className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-3">
                          <div className="w-full rounded-[1rem] border border-white/42 bg-[linear-gradient(180deg,rgba(255,255,255,0.6),rgba(255,244,240,0.42))] px-3 py-2.5 shadow-[0_10px_22px_rgba(15,23,42,0.06)] backdrop-blur-lg">
                            <p className="text-base font-black uppercase tracking-[0.02em] text-[#24553a]">{related.name}</p>
                            <p className="mt-0.5 text-sm font-bold text-[#F3765D]">
                              {t('shop.from_price')} {formatPrice(relatedPrice)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Sticky mobile add-to-cart bar */}
      <div className="fixed inset-x-0 bottom-0 z-[130] border-t border-[#358055]/12 bg-white/95 px-4 py-3 shadow-[0_-10px_30px_rgba(15,23,42,0.1)] backdrop-blur-lg md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold uppercase tracking-[0.04em] text-slate-500">{selectedVariant.name}</p>
            <p className="text-lg font-black leading-tight text-[#358055]">{formatPrice(unitPrice)}</p>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#F3765D] px-6 py-3 text-sm font-extrabold text-white shadow-[0_12px_26px_rgba(243,118,93,0.3)] transition-colors hover:bg-[#e0654d]"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            {t('common.add_to_cart')}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center pb-6 md:hidden">
        <div className="inline-flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          {t('order_summary.secure_purchase')}
        </div>
      </div>

      <Footer countryConfig={countryConfig} locale={locale} />
      <CookieConsent isEU={countryConfig.isEU} />
    </div>
  );
}
