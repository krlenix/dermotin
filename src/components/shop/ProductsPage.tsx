'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Product } from '@/config/products';
import { CountryConfig } from '@/config/countries';
import { getStoreOffers } from '@/config/store-content';
import { ShopHeader } from '@/components/shop/ShopHeader';
import { CookieConsent } from '@/components/features/CookieConsent';
import { PixelTracker } from '@/components/tracking/PixelTracker';
import { useMarketingTracking } from '@/hooks/useMarketingTracking';
import { OfferCard, ProductCard } from '@/components/store/ProductCard';
import { Eyebrow, GuaranteeBand, SectionHeading, StoreFooter, TrustStrip } from '@/components/store/StoreSections';
import { storeFontClass } from '@/components/store/fonts';
import { cn } from '@/lib/utils';

interface ProductsPageProps {
  products: Product[];
  countryConfig: CountryConfig;
  locale: string;
}

type Filter = 'all' | 'bundle' | 'skincare' | 'supplements';

export function ProductsPage({ products, countryConfig, locale }: ProductsPageProps) {
  const t = useTranslations('store');
  useMarketingTracking();
  const [filter, setFilter] = useState<Filter>('all');

  const byId = useMemo(() => new Map(products.map((product) => [product.id, product])), [products]);
  const offers = getStoreOffers(locale).filter((offer) => byId.has(offer.productId));

  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: t('shop.filter_all') },
    { id: 'bundle', label: t('shop.filter_sets') },
    { id: 'skincare', label: t('shop.filter_skincare') },
    { id: 'supplements', label: t('shop.filter_supplements') },
  ];
  const available = filters.filter((f) => f.id === 'all' || products.some((p) => p.category === f.id));
  const visible = filter === 'all' ? products : products.filter((product) => product.category === filter);

  return (
    <div className={cn(storeFontClass, 'min-h-screen overflow-x-hidden bg-paper')}>
      <PixelTracker countryCode={countryConfig.code} />
      <ShopHeader />

      <main className="pb-24 md:pb-36">
        <section className="container mx-auto px-4 pb-10 pt-12 md:pb-14 md:pt-20">
          <Eyebrow>{t('shop.eyebrow')}</Eyebrow>
          <h1 className="mt-5 max-w-4xl font-display text-[52px] leading-[0.98] text-ink md:text-[84px]">{t('shop.title')}</h1>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink/75">{t('shop.text')}</p>
        </section>

        <section className="container mx-auto px-4">
          <TrustStrip countryConfig={countryConfig} compact />
        </section>

        {offers.length > 0 && (
          <section className="container mx-auto px-4 pt-20 md:pt-28">
            <SectionHeading eyebrow={t('home.offers_eyebrow')} title={t('home.offers_title')} />
            <div className="grid gap-14 md:grid-cols-2 md:gap-8 xl:grid-cols-4">
              {offers.map((offer) => (
                <OfferCard key={offer.productId} offer={offer} product={byId.get(offer.productId)!} locale={locale} countryConfig={countryConfig} />
              ))}
            </div>
          </section>
        )}

        <section className="container mx-auto px-4 pt-24 md:pt-32">
          <div className="mb-10 flex flex-col gap-6 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
            <h2 className="font-display text-[40px] leading-none text-ink md:text-[56px]">{t('shop.all_title')}</h2>
            {available.length > 2 && (
              <div className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:px-0">
                {available.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilter(f.id)}
                    className={cn(
                      'shrink-0 rounded-full px-5 py-2.5 text-[14px] font-medium transition',
                      filter === f.id ? 'bg-forest text-paper' : 'border border-ink/15 text-ink/75 hover:border-ink/40 hover:text-ink'
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14 lg:grid-cols-4">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} countryConfig={countryConfig} />
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 pt-24 md:pt-32">
          <GuaranteeBand countryConfig={countryConfig} />
        </section>
      </main>

      <StoreFooter countryConfig={countryConfig} locale={locale} />
      <CookieConsent isEU={countryConfig.isEU} />
    </div>
  );
}
