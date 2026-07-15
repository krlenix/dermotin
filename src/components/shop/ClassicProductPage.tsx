'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Award,
  Check,
  ChevronRight,
  CreditCard,
  Droplets,
  Leaf,
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
import { qualifiesForFreeShipping } from '@/utils/shipping';
import { useCart } from '@/contexts/CartContext';
import { useBogoPair } from '@/components/shop/BogoPairModal';
import { ShopHeader } from '@/components/shop/ShopHeader';
import { Footer } from '@/components/ui/footer';
import { CookieConsent } from '@/components/features/CookieConsent';
import { EnhancedImageGallery } from '@/components/features/EnhancedImageGallery';
import { ProductDetailsAccordion } from '@/components/features/ProductDetailsAccordion';
import { AdvancedFAQ } from '@/components/features/AdvancedFAQ';
import { ReviewsSection } from '@/components/product-page/ReviewsSection';
import { BenefitsSection } from '@/components/product-page/BenefitsSection';
import { IngredientsShowcase } from '@/components/product-page/IngredientsShowcase';
import { RegulatoryBadge } from '@/components/product-page/RegulatoryBadge';
import { PixelTracker, usePixelTracking } from '@/components/tracking/PixelTracker';
import { useMarketingTracking } from '@/hooks/useMarketingTracking';
import { cn } from '@/lib/utils';
import { CouponBanner } from '@/components/shop/CouponBanner';
import {
  clearCouponCookie,
  COUPON_CLEARED_EVENT,
  getActiveCouponCode,
} from '@/utils/coupon-cookies';
import { calculateCouponDiscount, validateCouponWithAPI, type Coupon } from '@/config/coupons';
import { isBOGOActive } from '@/utils/bogo-cookies';

interface ClassicProductPageProps {
  product: Product;
  countryConfig: CountryConfig;
  locale: string;
}

export function ClassicProductPage({ product, countryConfig, locale }: ClassicProductPageProps) {
  const t = useTranslations();
  const router = useRouter();
  const { openDrawer } = useCart();
  const { requestAdd } = useBogoPair();
  const { trackEvent } = usePixelTracking(countryConfig.code);

  useMarketingTracking();

  // Variants with prices converted to the country currency
  const variants = useMemo(
    () => getProductVariantsForCountry(product, locale),
    [product, locale]
  );
  const defaultVariant = variants.find((v) => v.isDefault) || variants[0];

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(defaultVariant);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);

  // Variant with the biggest absolute savings gets the highlight badge
  const maxSavingsVariantId = useMemo(() => {
    let bestId: string | null = null;
    let bestSavings = 0;
    for (const variant of variants) {
      const savings = variant.discountPrice ? variant.price - variant.discountPrice : 0;
      if (savings > bestSavings) {
        bestSavings = savings;
        bestId = variant.id;
      }
    }
    return bestId;
  }, [variants]);

  const courier = getDefaultCourier(countryConfig);
  const reviewCount = product.testimonials?.length ?? 0;
  const averageRating = useMemo(() => {
    if (!product.testimonials || product.testimonials.length === 0) return null;
    return (
      product.testimonials.reduce((sum, review) => sum + review.rating, 0) /
      product.testimonials.length
    );
  }, [product.testimonials]);

  const bogoActive = isBOGOActive();
  const selectedPackCount = Math.max(1, selectedVariant.quantity ?? 1);

  const unitPrice = selectedVariant.discountPrice ?? selectedVariant.price;
  const hasDiscount = Boolean(selectedVariant.discountPrice && selectedVariant.discountPrice < selectedVariant.price);
  const discountPercent = hasDiscount
    ? Math.round((1 - (selectedVariant.discountPrice! / selectedVariant.price)) * 100)
    : 0;

  const getCouponDiscount = (price: number) => {
    if (!activeCoupon || (activeCoupon.minOrderValue && price < activeCoupon.minOrderValue)) {
      return 0;
    }

    return calculateCouponDiscount(activeCoupon, price, 0).productDiscount;
  };

  // Obračun aktivnog kupona za izabranu varijantu (konačan obračun je u korpi/checkout-u)
  const couponDiscount = getCouponDiscount(unitPrice);
  const couponPrice = Math.max(0, Math.round((unitPrice - couponDiscount) * 100) / 100);

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
          // Prednost imaju eksplicitno povezani proizvodi (crossSells), ostatak kataloga dopunjava
          const crossSellIds = product.crossSells ?? [];
          const byId = new Map(all.map((item) => [item.id, item]));
          const preferred = crossSellIds
            .map((id) => byId.get(id))
            .filter((item): item is Product => Boolean(item));
          const rest = all.filter(
            (item) => item.id !== product.id && !crossSellIds.includes(item.id)
          );
          setRelatedProducts([...preferred, ...rest].slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to load related products:', error);
      }
    };

    loadRelated();
    return () => {
      cancelled = true;
    };
  }, [locale, product.id, product.crossSells]);

  // Kupon iz reklame (?coupon_code=POPUST20 / ?coupon=) ili ranije upamćen u kolačiću —
  // validira se kroz OMS API + statičku listu i prikazuje animiran obračun
  useEffect(() => {
    let cancelled = false;
    const code = getActiveCouponCode();
    if (!code) return;

    validateCouponWithAPI(code, unitPrice, countryConfig.code)
      .then((result) => {
        if (cancelled) return;
        // BOGO kuponi imaju poseban tok i ne primenjuju se u klasičnoj korpi
        if (result.valid && result.coupon && result.coupon.type !== 'bogo') {
          setActiveCoupon(result.coupon);
        }
      })
      .catch((error) => console.error('Coupon validation failed:', error));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryConfig.code]);

  useEffect(() => {
    const handleCouponCleared = () => setActiveCoupon(null);
    window.addEventListener(COUPON_CLEARED_EVENT, handleCouponCleared);
    return () => window.removeEventListener(COUPON_CLEARED_EVENT, handleCouponCleared);
  }, []);

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
      contents: [{ id: selectedVariant.sku, quantity: 1, item_price: unitPrice }],
      currency: countryConfig.currency,
      value: unitPrice,
    });
  };

  const handleAddToCart = () => {
    trackAddToCart();
    const tookOver = requestAdd(buildCartItem(), {
      intent: 'drawer',
      onAfterAdd: () => openDrawer(),
    });
    if (!tookOver) openDrawer();
  };

  const handleBuyNow = () => {
    trackAddToCart();
    const tookOver = requestAdd(buildCartItem(), {
      intent: 'checkout',
      onAfterAdd: () => router.push(`/${locale}/checkout`),
    });
    if (!tookOver) router.push(`/${locale}/checkout`);
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
                    {averageRating !== null && (
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-slate-900">
                            {averageRating.toFixed(1)}/5
                          </span>
                          <div className="flex text-amber-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  'h-4 w-4',
                                  star <= Math.round(averageRating)
                                    ? 'fill-current'
                                    : 'fill-slate-200 text-slate-200'
                                )}
                              />
                            ))}
                          </div>
                        </div>
                        <a
                          href="#testimonials"
                          className="font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-[#358055] hover:decoration-[#358055]"
                        >
                          {t('testimonials_ui.review_count_label', { count: reviewCount })}
                        </a>
                      </div>
                    )}
                    <p className="text-base leading-relaxed text-slate-600 md:text-lg">
                      {product.description}
                    </p>
                  </div>

                  {/* Aktivni kupon (iz reklame ili ručno unet) */}
                  {activeCoupon && (
                    <CouponBanner
                      coupon={activeCoupon}
                      formatPrice={formatPrice}
                      onRemove={() => {
                        clearCouponCookie();
                        setActiveCoupon(null);
                      }}
                    />
                  )}

                  {/* Price */}
                  <div className="flex flex-wrap items-center gap-3">
                    {(hasDiscount || couponDiscount > 0) && (
                      <span className="text-xl font-semibold text-slate-400 line-through">
                        {formatPrice(couponDiscount > 0 ? unitPrice : selectedVariant.price)}
                      </span>
                    )}
                    <span
                      key={`${selectedVariant.id}-${activeCoupon?.code ?? 'bez-kupona'}`}
                      className={cn(
                        'text-4xl font-black leading-none md:text-[2.8rem]',
                        couponDiscount > 0
                          ? 'coupon-price-animate text-[#F3765D]'
                          : hasDiscount
                            ? 'text-[#F3765D]'
                            : 'text-[#358055]'
                      )}
                    >
                      {formatPrice(couponDiscount > 0 ? couponPrice : unitPrice)}
                    </span>
                    {couponDiscount > 0 ? (
                      <span className="coupon-price-animate inline-flex items-center rounded-md bg-[#358055] px-2.5 py-1 text-sm font-black text-white shadow-[0_8px_18px_rgba(53,128,85,0.3)]">
                        {t('coupons.with_coupon', { code: activeCoupon!.code })}
                      </span>
                    ) : (
                      hasDiscount && (
                        <span className="inline-flex items-center rounded-md bg-[#F3765D] px-2.5 py-1 text-sm font-black text-white shadow-[0_8px_18px_rgba(243,118,93,0.3)]">
                          {t('shop.save_percent', { percent: discountPercent })}
                        </span>
                      )
                    )}
                  </div>

                  {/* Variant selector */}
                  {variants.length > 1 && (
                    <div className="space-y-2.5">
                      <p className="text-sm font-bold uppercase tracking-[0.08em] text-slate-700">
                        {t('shop.choose_variant')}
                      </p>
                      <div className="grid gap-3">
                        {variants.map((variant) => {
                          const isSelected = variant.id === selectedVariant.id;
                          const variantPrice = variant.discountPrice ?? variant.price;
                          const variantHasDiscount = Boolean(variant.discountPrice && variant.discountPrice < variant.price);
                          const variantCouponDiscount = getCouponDiscount(variantPrice);
                          const variantFinalPrice = Math.max(
                            0,
                            Math.round((variantPrice - variantCouponDiscount) * 100) / 100
                          );
                          const variantSavings = variant.price - variantFinalPrice;
                          const isBestValue = variant.id === maxSavingsVariantId && variants.length > 1;
                          const variantFreeShipping = qualifiesForFreeShipping(variantPrice, countryConfig);

                          return (
                            <button
                              key={variant.id}
                              type="button"
                              onClick={() => setSelectedVariant(variant)}
                              className={cn(
                                'relative rounded-[1.2rem] border-2 bg-white px-4 pb-3.5 text-left transition-all duration-200',
                                isBestValue ? 'pt-5' : 'pt-3.5',
                                isSelected
                                  ? 'border-[#358055] bg-[#358055]/[0.03] shadow-[0_12px_28px_rgba(53,128,85,0.16)]'
                                  : 'border-[#358055]/12 hover:-translate-y-0.5 hover:border-[#358055]/40 hover:shadow-[0_10px_24px_rgba(15,23,42,0.06)]'
                              )}
                            >
                              {isBestValue && (
                                <span className="absolute -top-3 left-4 inline-flex items-center rounded-full bg-[#F3765D] px-3 py-1 text-[11px] font-black tracking-[0.06em] text-white shadow-[0_8px_18px_rgba(243,118,93,0.35)]">
                                  {t('bundles.biggest_savings')}
                                </span>
                              )}

                              <div className="flex items-center justify-between gap-3">
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
                                    {bogoActive ? (
                                      <p className="mt-0.5 text-xs font-extrabold text-[#F3765D]">
                                        {t('bogo.variant_gratis_line', { count: variant.quantity ?? 1 })}
                                      </p>
                                    ) : (
                                      (variant.quantity ?? 1) > 1 && (
                                        <p className="text-xs font-medium text-[#358055]">
                                          {formatPrice(
                                            Math.round((variantFinalPrice / (variant.quantity ?? 1)) * 100) / 100
                                          )}{' '}
                                          {t('bundles.per_item')}
                                        </p>
                                      )
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  {(variantHasDiscount || variantCouponDiscount > 0) && (
                                    <p className="text-xs text-slate-400 line-through">{formatPrice(variant.price)}</p>
                                  )}
                                  <p
                                    className={cn(
                                      'text-lg font-black leading-tight',
                                      variantCouponDiscount > 0 ? 'text-[#F3765D]' : 'text-slate-950'
                                    )}
                                  >
                                    {formatPrice(variantFinalPrice)}
                                  </p>
                                </div>
                              </div>

                              {/* Jedan signal ispod — bez gomile bedževa */}
                              {!bogoActive &&
                                (variantSavings > 0 || variantCouponDiscount > 0 || variantFreeShipping) && (
                                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5 pl-8">
                                    {variantSavings > 0 && (
                                      <span className="inline-flex items-center rounded-full bg-[#358055]/10 px-2.5 py-0.5 text-[11px] font-extrabold text-[#2f6f4a]">
                                        {t('bundles.save_amount', { amount: formatPrice(variantSavings) })}
                                      </span>
                                    )}
                                    {variantCouponDiscount > 0 && (
                                      <span className="inline-flex items-center rounded-full bg-[#358055] px-2.5 py-0.5 text-[11px] font-extrabold text-white">
                                        {t('coupons.with_coupon', { code: activeCoupon!.code })}
                                      </span>
                                    )}
                                    {variantFreeShipping && (
                                      <span className="inline-flex items-center rounded-full bg-[#F3765D]/10 px-2.5 py-0.5 text-[11px] font-extrabold text-[#ba5a47]">
                                        {t('bundles.free_shipping')}
                                      </span>
                                    )}
                                  </div>
                                )}
                              {bogoActive && variantFreeShipping && (
                                <p className="mt-1.5 pl-8 text-[11px] font-semibold text-[#358055]">
                                  {t('bundles.free_shipping')}
                                </p>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-3">
                    {bogoActive && (
                      <div className="rounded-[1.1rem] border border-[#358055]/25 bg-[#f3faf6] px-4 py-3">
                        <p className="text-sm font-black text-[#2a6844]">
                          {selectedPackCount > 1
                            ? t('bogo.pair_headline_multi', { count: selectedPackCount })
                            : t('bogo.pair_headline')}
                        </p>
                        <p className="mt-0.5 text-xs font-medium text-slate-600">
                          {selectedPackCount > 1
                            ? t('bogo.pair_subheadline_multi', { count: selectedPackCount })
                            : t('bogo.pair_subheadline')}
                        </p>
                      </div>
                    )}
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

                  {/* Product attribute icons (Waterdrop-style) */}
                  <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[1.4rem] border border-[#358055]/10 bg-[#358055]/8">
                    {[
                      { icon: Leaf, label: t('homepage.trust_natural_ingredients') },
                      { icon: ShieldCheck, label: t('homepage.trust_dermatologically_tested') },
                      { icon: Droplets, label: t('homepage.trust_no_parabens') },
                      { icon: Award, label: t('homepage.trust_clinically_proven') },
                    ].map((attribute) => {
                      const Icon = attribute.icon;
                      return (
                        <div
                          key={attribute.label}
                          className="flex items-center gap-2.5 bg-white px-4 py-3"
                        >
                          <Icon className="h-[18px] w-[18px] shrink-0 text-[#358055]" />
                          <span className="text-[13px] font-semibold leading-4 text-slate-700">
                            {attribute.label}
                          </span>
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

        <ReviewsSection product={product} />

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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedProducts.map((related) => {
                  const relatedVariants = getProductVariantsForCountry(related, locale);
                  const relatedDefault = relatedVariants.find((v) => v.isDefault) || relatedVariants[0];
                  const relatedPrice = relatedDefault.discountPrice ?? relatedDefault.price;
                  const relatedHasDiscount = Boolean(
                    relatedDefault.discountPrice && relatedDefault.discountPrice < relatedDefault.price
                  );
                  const relatedDiscountPercent = relatedHasDiscount
                    ? Math.round((1 - relatedDefault.discountPrice! / relatedDefault.price) * 100)
                    : 0;
                  const relatedReviews = related.testimonials ?? [];
                  const relatedRating =
                    relatedReviews.length > 0
                      ? relatedReviews.reduce((sum, review) => sum + review.rating, 0) /
                        relatedReviews.length
                      : null;

                  return (
                    <Link
                      key={related.id}
                      href={`/${locale}/products/${related.slug}`}
                      className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-[#d7e6de] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#358055]/30 hover:shadow-[0_22px_50px_rgba(15,23,42,0.1)]"
                    >
                      <div className="relative aspect-square overflow-hidden bg-[linear-gradient(180deg,#fafafa_0%,#efefef_100%)]">
                        {relatedHasDiscount && (
                          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#F3765D] px-3 py-1 text-[11px] font-black tracking-[0.04em] text-white shadow-[0_8px_18px_rgba(243,118,93,0.35)]">
                            {t('shop.save_percent', { percent: relatedDiscountPercent })}
                          </span>
                        )}
                        {relatedRating !== null && (
                          <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full border border-[#358055]/10 bg-white/90 px-2.5 py-1 text-[11px] font-black text-slate-800 backdrop-blur-sm">
                            {relatedRating.toFixed(1)}/5
                            <Star className="h-3 w-3 fill-current text-amber-400" />
                          </span>
                        )}
                        <Image
                          src={related.images.main}
                          alt={related.name}
                          fill
                          className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      <div className="px-4 pb-4 pt-3">
                        <p className="text-base font-black uppercase tracking-[0.02em] text-[#24553a] transition-colors group-hover:text-[#F3765D]">
                          {related.name}
                        </p>
                        <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
                          <span
                            className={`text-lg font-black ${relatedHasDiscount ? 'text-[#F3765D]' : 'text-slate-950'}`}
                          >
                            {t('shop.from_price')} {formatPrice(relatedPrice)}
                          </span>
                          {relatedHasDiscount && (
                            <span className="text-sm text-slate-400 line-through">
                              {formatPrice(relatedDefault.price)}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 line-clamp-1 text-xs font-medium text-slate-500">
                          {related.shortDescription}
                        </p>
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
            <div className="flex items-baseline gap-2">
              {couponDiscount > 0 && (
                <span className="text-xs text-slate-400 line-through">{formatPrice(unitPrice)}</span>
              )}
              <p
                className={cn(
                  'text-lg font-black leading-tight',
                  couponDiscount > 0 ? 'text-[#F3765D]' : 'text-[#358055]'
                )}
              >
                {formatPrice(couponDiscount > 0 ? couponPrice : unitPrice)}
              </p>
            </div>
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
