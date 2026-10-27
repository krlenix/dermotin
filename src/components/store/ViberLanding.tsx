'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowDown, Check } from 'lucide-react';

import { getProductsForLocale, getProductVariantsForCountry, type Product } from '@/config/products';
import type { CountryConfig } from '@/config/countries';
import type { ViberOffer } from '@/config/viber-offers';
import { getProductFacts, getStoreVisual } from '@/config/store-content';
import { BundleContents, type BundlePart } from './BundleContents';
import { DashTitle, FactRow } from './Rich';
import { getProductProof } from '@/config/store-proof';
import { GuaranteeProof, PriceBox, ProofSummary, ReviewsShowcase, UrgencyStrip } from './ProofSections';
import { ShopHeader } from '@/components/shop/ShopHeader';
import { cn } from '@/lib/utils';
import { storeFontClass } from './fonts';
import { QuickOrderForm } from './QuickOrderForm';
import { ProductStage } from './ProductCard';
import { ProductDetails, ViberFooter } from './ProductLanding';
import { TrustStrip } from './StoreSections';
import { formatMoney, scrollToOrderForm, variantDiscountPercent, variantPrice, variantSavings } from './format';

interface ViberLandingProps {
  offer: ViberOffer;
  product: Product;
  countryConfig: CountryConfig;
  locale: string;
}

/**
 * Kratka Viber stranica: ponuda → cena → forma. Bez pixela, bez korpe, bez izlaza sa stranice.
 */
export function ViberLanding({ offer, product, countryConfig, locale }: ViberLandingProps) {
  const t = useTranslations('store');
  const variant = useMemo(() => {
    const variants = getProductVariantsForCountry(product, locale);
    return variants.find((v) => v.isDefault) || variants[0];
  }, [product, locale]);
  const [components, setComponents] = useState<BundlePart[]>([]);
  const [campaign, setCampaign] = useState(offer.slug);
  const [showSticky, setShowSticky] = useState(false);

  const price = variantPrice(variant);
  const savings = variantSavings(variant);
  const percent = variantDiscountPercent(variant);
  const proof = getProductProof(product.id);

  useEffect(() => {
    const utm = new URLSearchParams(window.location.search).get('utm_campaign');
    if (utm) setCampaign(utm.slice(0, 100));
  }, []);

  useEffect(() => {
    let cancelled = false;
    getProductsForLocale(locale).then((all) => {
      if (cancelled || !product.bundleItems) return;
      setComponents(
        product.bundleItems.flatMap((item) => {
          const component = all[item.productId];
          if (!component) return [];
          const variants = getProductVariantsForCountry(component, locale);
          const v = variants.find((x) => x.id === item.variantId) || variants[0];
          return [{ product: component, variant: v, quantity: item.quantity, gratis: item.gratis === true }];
        })
      );
    });
    return () => {
      cancelled = true;
    };
  }, [locale, product]);

  useEffect(() => {
    const form = document.getElementById('naruci');
    if (!form) return;
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      setShowSticky(!visible && window.scrollY > 300);
    });
    observer.observe(form);
    const onScroll = () => setShowSticky(!visible && window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const lines = useMemo(
    () => [
      {
        productId: product.id,
        variantId: variant.id,
        sku: variant.sku,
        productName: product.name,
        variantName: variant.name,
        image: product.images.main,
        unitPrice: price,
        regularPrice: variant.price,
        quantity: 1,
      },
    ],
    [product, variant, price]
  );

  return (
    <div className={cn(storeFontClass, 'min-h-screen overflow-x-hidden bg-paper')}>
      <ShopHeader minimal />

      <main className="pb-28">
        <UrgencyStrip savings={savings} countryConfig={countryConfig} />
        <section className="container mx-auto max-w-6xl px-4 pt-6 md:pt-12">
          <div className="mb-6 md:hidden">
            <ViberHeadline offer={offer} />
          </div>
          <div className="grid gap-8 md:grid-cols-[1.05fr_1fr] md:gap-14">
            <div className="md:sticky md:top-28 md:self-start">
              <ProductStage
                src={getStoreVisual(product).packshot}
                alt={product.name}
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="aspect-square rounded-[28px]"
              >
                {savings > 0 && (
                  <span className="absolute bottom-5 left-5 flex h-[88px] w-[88px] flex-col items-center justify-center rounded-full bg-coral text-center text-white shadow-[0_18px_34px_-16px_rgba(201,83,58,0.8)]">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] opacity-85">{t('viber.save')}</span>
                    <span className="mt-0.5 text-[15px] font-semibold leading-tight">{formatMoney(savings, countryConfig)}</span>
                  </span>
                )}
              </ProductStage>

              <BundleContents parts={components} countryConfig={countryConfig} className="mt-6" />
            </div>

            <div>
              <div className="hidden md:block">
                <ViberHeadline offer={offer} />
              </div>

              {proof && <ProofSummary proof={proof} className="mt-1 md:mt-6" />}

              <FactRow facts={getProductFacts(product.id)} className="mt-6" />

              <ul className="mt-6 space-y-3">
                {offer.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3 text-[15.5px] font-medium leading-snug text-ink/90">
                    <span className="mt-px inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-moss text-white">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    {bullet}
                  </li>
                ))}
              </ul>

              <PriceBox price={price} regular={variant.price} savings={savings} percent={percent} countryConfig={countryConfig} className="mt-8" />

              <QuickOrderForm countryConfig={countryConfig} lines={lines} channel="viber" campaign={campaign} title={offer.formTitle} className="mt-4" />
            </div>
          </div>

          <TrustStrip countryConfig={countryConfig} className="mt-16" compact />
        </section>

        {proof && <ReviewsShowcase proof={proof} className="pt-20 md:pt-28" />}

        <section className="container mx-auto max-w-6xl px-4">
          {proof && <GuaranteeProof proof={proof} className="mt-20 md:mt-28" />}

          <div className="mt-16 grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
            <h2 className="font-display text-[36px] leading-[1.02] text-ink md:text-[44px]">{t('pdp.details_title')}</h2>
            <ProductDetails product={product} />
          </div>
        </section>
      </main>

      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-[130] border-t border-line bg-paper/95 px-4 py-3 backdrop-blur-xl transition-transform duration-300',
          showSticky ? 'translate-y-0' : 'translate-y-full'
        )}
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <div className="mx-auto flex max-w-xl items-center gap-4">
          <p className="text-[22px] font-semibold leading-none text-ink">{formatMoney(price, countryConfig)}</p>
          <button
            type="button"
            onClick={() => scrollToOrderForm()}
            className="ml-auto inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-coral px-5 text-[15px] font-semibold text-white"
          >
            {t('pdp.order_now')} <ArrowDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      <ViberFooter countryConfig={countryConfig} />
    </div>
  );
}

function ViberHeadline({ offer }: { offer: ViberOffer }) {
  return (
    <>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#7360F2] px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white">
        {offer.kicker}
      </span>
      <h1 className="mt-5 font-display text-[40px] leading-[1] text-ink md:text-[56px]">
        <DashTitle text={offer.headline} />
      </h1>
      <p className="mt-4 text-[16.5px] leading-relaxed text-ink/75">{offer.subheadline}</p>
    </>
  );
}
