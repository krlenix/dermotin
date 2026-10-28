'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ShoppingBag } from 'lucide-react';

import { getProductsForLocale, getProductVariantsForCountry, type Product, type ProductVariant } from '@/config/products';
import type { CountryConfig } from '@/config/countries';
import { getProductProof } from '@/config/store-proof';
import { getLanderContent } from '@/config/lander-content';
import { useCart } from '@/contexts/CartContext';
import { useBogoPair } from '@/components/shop/BogoPairModal';
import { ShopHeader } from '@/components/shop/ShopHeader';
import { CookieConsent } from '@/components/features/CookieConsent';
import { PixelTracker, usePixelTracking } from '@/components/tracking/PixelTracker';
import { useMarketingTracking } from '@/hooks/useMarketingTracking';
import { CheckoutLander, type BundlePart } from './CheckoutLander';
import { variantPrice } from './format';

interface ProductLandingProps {
  product: Product;
  countryConfig: CountryConfig;
  locale: string;
  /**
   * Stranica proizvoda iz kataloga (/products): zaglavlje sajta i „Dodaj u korpu“.
   * Oglasni lander (/checkouts) ostaje bez zaglavlja, sa jednom radnjom — porudžbinom.
   */
  storefront?: boolean;
}

/**
 * Prodajna stranica proizvoda preslikana sa starog sajta (dermotin.rs/checkouts) —
 * vlasnik je tražio istu stranicu jer je najbolje konvertovala.
 */
export function ProductLanding({ product, countryConfig, locale, storefront = false }: ProductLandingProps) {
  const variants = useMemo(() => getProductVariantsForCountry(product, locale), [product, locale]);
  const variant = variants.find((v) => v.isDefault) || variants[0];
  const [bundleParts, setBundleParts] = useState<BundlePart[]>([]);

  // Sastav seta (uključujući proizvode koji se ne prodaju pojedinačno)
  useEffect(() => {
    if (!product.isBundle || !product.bundleItems?.length) return;
    let cancelled = false;
    getProductsForLocale(locale)
      .then((all) => {
        if (cancelled) return;
        setBundleParts(
          (product.bundleItems ?? []).flatMap((item) => {
            const component = all[item.productId];
            if (!component) return [];
            const componentVariants = getProductVariantsForCountry(component, locale);
            const componentVariant =
              componentVariants.find((v) => v.id === item.variantId) || componentVariants.find((v) => v.isDefault) || componentVariants[0];
            return [{ product: component, variant: componentVariant, quantity: item.quantity, gratis: item.gratis === true }];
          })
        );
      })
      .catch((error) => console.error('Failed to load bundle components', error));
    return () => {
      cancelled = true;
    };
  }, [locale, product]);

  const proof = getProductProof(product.id);
  const lander = getLanderContent(product.id);

  return (
    <>
      <PixelTracker countryCode={countryConfig.code} />
      <StorefrontTracking product={product} variant={variant} countryConfig={countryConfig} />
      {storefront && <ShopHeader />}
      {lander && (
        <CheckoutLander
          product={product}
          content={lander}
          countryConfig={countryConfig}
          locale={locale}
          bundleParts={bundleParts}
          shots={proof?.shots}
          reviewsCount={proof?.reviewsCount}
          storefront={storefront}
          afterForm={storefront ? <AddToCartButton product={product} variant={variant} countryConfig={countryConfig} /> : undefined}
        />
      )}
      <CookieConsent isEU={countryConfig.isEU} />
    </>
  );
}

/** Druga radnja ispod forme: proizvod ide u korpu (više proizvoda, besplatna dostava preko praga). */
function AddToCartButton({ product, variant, countryConfig }: { product: Product; variant: ProductVariant; countryConfig: CountryConfig }) {
  const t = useTranslations('store');
  const { openDrawer } = useCart();
  const { requestAdd } = useBogoPair();
  const { trackEvent } = usePixelTracking(countryConfig.code);
  const unitPrice = variantPrice(variant);

  const add = () => {
    trackEvent('add_to_cart', {
      content_type: 'product',
      content_name: product.name,
      content_ids: [variant.sku],
      contents: [{ id: variant.sku, quantity: 1, item_price: unitPrice }],
      currency: countryConfig.currency,
      value: unitPrice,
    });
    const tookOver = requestAdd(
      {
        productId: product.id,
        productSlug: product.slug,
        variantId: variant.id,
        sku: variant.sku,
        productName: product.name,
        variantName: variant.name,
        image: product.images.main,
        unitPrice,
        regularPrice: variant.price,
        currency: countryConfig.currency,
      },
      { intent: 'drawer', onAfterAdd: () => openDrawer() }
    );
    if (!tookOver) openDrawer();
  };

  return (
    <button
      type="button"
      onClick={add}
      className="mt-3 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full border-2 border-green bg-white px-5 text-[1rem] font-semibold text-forest transition hover:bg-mint-soft"
    >
      <ShoppingBag className="h-5 w-5" strokeWidth={1.8} aria-hidden />
      {t('pdp.add_to_cart')}
    </button>
  );
}

function StorefrontTracking({ product, variant, countryConfig }: { product: Product; variant: ProductVariant; countryConfig: CountryConfig }) {
  const { trackEvent } = usePixelTracking(countryConfig.code);
  useMarketingTracking();
  useEffect(() => {
    const value = variantPrice(variant);
    trackEvent('view_content', {
      content_type: 'product',
      content_name: product.name,
      content_ids: [variant.sku],
      contents: [{ id: variant.sku, quantity: 1, item_price: value }],
      currency: countryConfig.currency,
      value,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);
  return null;
}
