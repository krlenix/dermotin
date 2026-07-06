'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { Product, getProductVariantsForCountry } from '@/config/products';
import { CountryConfig } from '@/config/countries';
import { useCart } from '@/contexts/CartContext';
import { ShopHeader } from '@/components/shop/ShopHeader';
import { Footer } from '@/components/ui/footer';
import { CookieConsent } from '@/components/features/CookieConsent';
import { ProductImageHover } from '@/components/features/ProductImageHover';
import { PixelTracker, usePixelTracking } from '@/components/tracking/PixelTracker';
import { useMarketingTracking } from '@/hooks/useMarketingTracking';

interface ProductsPageProps {
  products: Product[];
  countryConfig: CountryConfig;
  locale: string;
}

export function ProductsPage({ products, countryConfig, locale }: ProductsPageProps) {
  const t = useTranslations();
  const { addItem, openDrawer } = useCart();
  const { trackEvent } = usePixelTracking(countryConfig.code);

  useMarketingTracking();

  const formatPrice = (amount: number) =>
    `${new Intl.NumberFormat('sr-RS', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)} ${countryConfig.currencySymbol}`;

  const handleQuickAdd = (product: Product) => {
    const variants = getProductVariantsForCountry(product, locale);
    const variant = variants.find((v) => v.isDefault) || variants[0];
    if (!variant) return;

    addItem({
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

    trackEvent('add_to_cart', {
      content_type: 'product',
      content_name: product.name,
      content_ids: [variant.sku],
      contents: [{ id: variant.sku, quantity: 1, item_price: variant.discountPrice ?? variant.price }],
      currency: countryConfig.currency,
      value: variant.discountPrice ?? variant.price,
    });

    toast.success(t('product.add_to_cart_success'));
    openDrawer();
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#f6f8f6_0%,#ffffff_30%,#f8fbf9_65%,#ffffff_100%)]" style={{ maxWidth: '100vw' }}>
      <PixelTracker countryCode={countryConfig.code} />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-28 right-0 h-96 w-96 rounded-full bg-[#358055]/8 blur-3xl" />
        <div className="absolute top-[28rem] -left-20 h-80 w-80 rounded-full bg-[#F3765D]/8 blur-3xl" />
      </div>

      <ShopHeader />

      <main className="relative pb-16">
        {/* Page intro */}
        <section className="pt-8 md:pt-10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-[#358055]">
                <Sparkles className="h-4 w-4" />
                {t('homepage.featured_products')}
              </p>
              <h1 className="mt-3 text-4xl font-black leading-[1.06] tracking-[-0.02em] text-slate-950 md:text-5xl">
                {t('shop.products_title')}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                {t('homepage.product_showcase_subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Product grid */}
        <section className="py-8 md:py-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => {
                const variants = getProductVariantsForCountry(product, locale);
                const defaultVariant = variants.find((v) => v.isDefault) || variants[0];
                const price = defaultVariant.discountPrice ?? defaultVariant.price;
                const hasDiscount = Boolean(defaultVariant.discountPrice && defaultVariant.discountPrice < defaultVariant.price);
                const discountPercent = hasDiscount
                  ? Math.round((1 - (defaultVariant.discountPrice! / defaultVariant.price)) * 100)
                  : 0;

                return (
                  <div
                    key={product.id}
                    className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-[#d7e6de] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,23,42,0.09)]"
                  >
                    <Link
                      href={`/${locale}/products/${product.slug}`}
                      className="relative block aspect-square overflow-hidden bg-[linear-gradient(180deg,#fafafa_0%,#ececec_100%)]"
                    >
                      {hasDiscount && (
                        <div className="absolute left-3 top-3 z-10 rounded-full bg-[#F3765D] px-3 py-1 text-xs font-black tracking-[0.04em] text-white shadow-[0_8px_18px_rgba(243,118,93,0.35)]">
                          -{discountPercent}%
                        </div>
                      )}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.45),rgba(255,255,255,0.12)_34%,transparent_62%)]" />
                      <ProductImageHover
                        mainImage={product.images.main}
                        hoverImage={
                          product.images.gallery && product.images.gallery.length > 0
                            ? product.images.gallery[product.images.gallery.length - 1] || product.images.main
                            : product.images.main
                        }
                        productName={product.name}
                        width={520}
                        height={520}
                        className="h-full w-full transition-transform duration-500 group-hover:scale-[1.01]"
                        imageClassName="object-contain object-center"
                      />
                    </Link>

                    <div className="flex flex-1 flex-col gap-3 px-4 py-4 md:px-5">
                      <div className="flex-1">
                        <Link href={`/${locale}/products/${product.slug}`}>
                          <h2 className="text-lg font-black uppercase tracking-[0.02em] text-[#24553a] transition-colors group-hover:text-[#F3765D]">
                            {product.name}
                          </h2>
                        </Link>
                        <p className="mt-1 line-clamp-2 text-sm font-medium leading-5 text-slate-600">
                          {product.shortDescription}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div>
                          {hasDiscount && (
                            <p className="text-xs text-slate-400 line-through">{formatPrice(defaultVariant.price)}</p>
                          )}
                          <p className="text-xl font-black leading-tight text-slate-950">{formatPrice(price)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleQuickAdd(product)}
                            aria-label={`${t('common.add_to_cart')} - ${product.name}`}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#F3765D] text-white shadow-[0_12px_24px_rgba(243,118,93,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e0654d]"
                          >
                            <ShoppingBag className="h-5 w-5" />
                          </button>
                          <Link
                            href={`/${locale}/products/${product.slug}`}
                            className="inline-flex h-11 items-center justify-center rounded-full border border-[#358055]/20 bg-white px-4 text-sm font-bold text-[#358055] transition-colors hover:border-[#358055] hover:bg-[#358055]/5"
                          >
                            {t('homepage.view_product')}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer countryConfig={countryConfig} locale={locale} />
      <CookieConsent isEU={countryConfig.isEU} />
    </div>
  );
}
