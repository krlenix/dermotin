'use client';

import { useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Product } from '@/config/products';
import { CountryConfig } from '@/config/countries';
import { getStoreOffers } from '@/config/store-content';
import { STORE_PROOF } from '@/config/store-proof';
import { ShopHeader } from '@/components/shop/ShopHeader';
import { CookieConsent } from '@/components/features/CookieConsent';
import { PixelTracker } from '@/components/tracking/PixelTracker';
import { useMarketingTracking } from '@/hooks/useMarketingTracking';
import { landerFontClass } from '@/components/store/fonts';
import { LANDER_BG, LanderFooter, Stars, TornBand, richTags, useReveal } from '@/components/store/LanderKit';
import { GreenHero, LanderGuarantee, LanderHeading, LanderProductCard, OfferTile } from '@/components/store/LanderStore';
import { cn } from '@/lib/utils';

interface ProductsPageProps {
  products: Product[];
  countryConfig: CountryConfig;
  locale: string;
}

type Filter = 'all' | 'bundle' | 'skincare' | 'supplements';

export function ProductsPage({ products, countryConfig, locale }: ProductsPageProps) {
  const t = useTranslations('store');
  const tl = useTranslations('store.landerHome');
  const tLander = useTranslations('store.lander');
  useMarketingTracking();
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);
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
  const scrollToOffers = () => document.querySelector(offers.length > 0 ? '#akcije' : '#proizvodi')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div ref={rootRef} className={cn(landerFontClass, 'min-h-screen overflow-x-hidden', LANDER_BG)}>
      <PixelTracker countryCode={countryConfig.code} />
      <ShopHeader />

      <main className="mx-auto max-w-[1180px] space-y-10 px-3 pt-3 md:space-y-14 md:px-6 md:pt-6">
        <GreenHero>
          <h1 className="text-[30px] font-extrabold leading-[1.18] text-[#151515] md:text-[46px]">
            {tl.rich('shop_title', richTags)}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[15px] text-[#4a4a4a] md:text-[16px]">{t('shop.text')}</p>
          <div className="mt-4 flex items-center justify-center gap-2 pb-2 text-[13px] font-medium text-[#333]">
            <Stars size={16} />
            <span>{tLander.rich('hero_rating', { b: (chunks) => <strong className="font-bold">{chunks}</strong>, count: STORE_PROOF.reviewsCount })}</span>
          </div>
        </GreenHero>

        {offers.length > 0 && (
          <section id="akcije" className="scroll-mt-24">
            <LanderHeading>{tl.rich('offers_title', richTags)}</LanderHeading>
            <div className="mt-6 grid gap-4 md:grid-cols-2 md:gap-6">
              {offers.map((offer) => (
                <OfferTile key={offer.productId} offer={offer} product={byId.get(offer.productId)!} locale={locale} countryConfig={countryConfig} />
              ))}
            </div>
          </section>
        )}

        <section id="proizvodi" className="scroll-mt-24">
          <LanderHeading>{tl.rich('products_title', richTags)}</LanderHeading>
          {available.length > 2 && (
            <div className="-mx-3 mt-5 flex justify-start gap-2 overflow-x-auto px-3 [scrollbar-width:none] md:justify-center">
              {available.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'shrink-0 rounded-full px-5 py-2.5 text-[14px] font-semibold transition',
                    filter === f.id ? 'bg-[#2E8655] text-white shadow-[0_4px_0_#1d5434]' : 'bg-white text-[#222] ring-1 ring-black/10 hover:ring-[#2E8655]/50'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
          <div className="mt-6 grid grid-cols-2 gap-2.5 md:gap-4 lg:grid-cols-4">
            {visible.map((product) => (
              <LanderProductCard key={product.id} product={product} locale={locale} countryConfig={countryConfig} />
            ))}
          </div>
        </section>

        <LanderGuarantee unit={tl('guarantee_unit_home')} />
      </main>

      <TornBand label={tLander.rich('cta', richTags)} onClick={scrollToOffers} className="mt-10" />
      <LanderFooter countryConfig={countryConfig} locale={locale} className="pb-6" />
      <CookieConsent isEU={countryConfig.isEU} />
    </div>
  );
}
