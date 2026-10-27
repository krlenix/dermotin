'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import type { Product } from '@/config/products';
import { getDefaultCourier, type CountryConfig } from '@/config/countries';
import { STORE_HERO_IMAGE, getNeedTiles, getStoreOffers } from '@/config/store-content';
import { STORE_PROOF } from '@/config/store-proof';
import { getProductVariantsForCountry } from '@/config/products';
import { ShopHeader } from '@/components/shop/ShopHeader';
import { CookieConsent } from '@/components/features/CookieConsent';
import { PixelTracker } from '@/components/tracking/PixelTracker';
import { useMarketingTracking } from '@/hooks/useMarketingTracking';
import { cn } from '@/lib/utils';
import { landerFontClass } from './fonts';
import { CountUp, FOREST_BG, LANDER_BG, LanderFooter, Marked, Stars, TornBand, richTags, useReveal } from './LanderKit';
import {
  GreenHero,
  HeroButton,
  LanderFaq,
  LanderGuarantee,
  LanderHeading,
  LanderIconCards,
  LanderProductCard,
  LanderReviews,
  NeedsGrid,
  OfferTile,
} from './LanderStore';
import { variantDiscountPercent } from './format';

interface HomeStoreProps {
  products: Product[];
  countryConfig: CountryConfig;
  locale: string;
}

/** Proizvodi čija svedočanstva idu na početnu (redom). */
const HOME_CUSTOMERS = '10,000 +';
const HOME_TESTIMONIALS = ['biomelis_kapi', 'fungel', 'immunis_kapi', 'biomelis', 'bioroid_set', 'biowart'];

export function HomeStore({ products, countryConfig, locale }: HomeStoreProps) {
  const t = useTranslations('store');
  const tl = useTranslations('store.landerHome');
  const tLander = useTranslations('store.lander');
  useMarketingTracking();
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  const byId = new Map(products.map((product) => [product.id, product]));
  const offers = getStoreOffers(locale).filter((offer) => byId.has(offer.productId));
  const needs = getNeedTiles(locale).filter((need) => byId.has(need.productId));
  const offerIds = new Set(offers.map((offer) => offer.productId));
  const catalog = [...products.filter((p) => offerIds.has(p.id)), ...products.filter((p) => !offerIds.has(p.id))];
  const anchor = offers.length > 0 ? '#akcije' : '#proizvodi';
  const courier = getDefaultCourier(countryConfig);
  const maxPercent = Math.max(
    0,
    ...offers.map((offer) => {
      const variants = getProductVariantsForCountry(byId.get(offer.productId)!, locale);
      const variant = variants.find((v) => v.isDefault) || variants[0];
      return variant ? variantDiscountPercent(variant) : 0;
    })
  );
  const scrollTo = (selector: string) => () => document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div ref={rootRef} className={cn(landerFontClass, 'min-h-screen overflow-x-hidden', LANDER_BG)}>
      <PixelTracker countryCode={countryConfig.code} />
      <ShopHeader />

      <main className="mx-auto max-w-[1180px] space-y-10 px-3 pt-3 md:space-y-16 md:px-6 md:pt-6">
        {/* ── HERO ─────────────────────────────────────────────── */}
        <GreenHero
          image={<Image src={STORE_HERO_IMAGE} alt="DERMOTIN" fill priority sizes="(max-width: 768px) 92vw, 520px" className="object-cover object-[50%_75%] md:object-contain" />}
          sticker={
            maxPercent > 0 ? (
              <a
                href={anchor}
                className="lander-pop absolute right-1 top-2 flex h-[86px] w-[86px] rotate-[10deg] flex-col items-center justify-center rounded-full bg-[#F0735A] text-white shadow-[0_10px_24px_-8px_rgba(0,0,0,0.4)] [animation-delay:600ms] md:right-4 md:top-8 md:h-28 md:w-28"
              >
                <span className="text-[10px] font-semibold uppercase leading-none">{tl('sticker')}</span>
                <span className="text-[26px] font-extrabold leading-tight md:text-[32px]">−{maxPercent}%</span>
              </a>
            ) : undefined
          }
        >
          <h1 className="text-[30px] font-extrabold leading-[1.22] text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.12)] md:text-[46px]">
            <span className="block">
              <Marked tone="green" animate>{tl('hero_l1')}</Marked>
            </span>
            <span className="block">{tl('hero_l2')}</span>
            <span className="block">{tl('hero_l3')}</span>
            <span className="block">
              <Marked tone="coral" animate className="[animation-delay:350ms]">{tl('hero_l4')}</Marked>
            </span>
          </h1>
          <div className="mt-4 flex items-center justify-center gap-2 text-[13px] font-medium text-white">
            <Stars size={16} />
            <span>{tLander.rich('hero_rating', { b: (chunks) => <strong className="font-bold">{chunks}</strong>, count: STORE_PROOF.reviewsCount })}</span>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            <HeroButton href={anchor}>{offers.length > 0 ? t('home.cta_offers') : t('home.cta_products')}</HeroButton>
            <HeroButton href={`/${locale}/products`} variant="ghost">{t('home.cta_all')}</HeroButton>
          </div>
          <ul className="mt-5 flex flex-wrap justify-center gap-1.5 text-[12.5px] font-semibold text-white">
            {[tLander('check_cod'), t('trust.delivery_title', { time: courier.deliveryTime }), t('trust.returns_title', { days: countryConfig.business.returnPeriodDays })].map((item) => (
              <li key={item} className="rounded-full bg-white/20 px-3 py-1.5 backdrop-blur-[2px]">✓ {item}</li>
            ))}
          </ul>
        </GreenHero>

        {/* ── 10,000+ I ZAŠTO DERMOTIN ──────────────────────────── */}
        <section className="reveal rounded-[24px] border-l-4 border-[#2E8655] bg-white p-3 shadow-[0_8px_24px_rgba(0,0,0,0.06)] md:grid md:grid-cols-[0.9fr_1.1fr] md:items-center md:gap-8 md:p-8">
          <div className="text-center">
            <p className="pt-2 text-[58px] font-extrabold leading-none tracking-tight md:text-[84px]">
              <CountUp value={HOME_CUSTOMERS} /> <span className="text-[#2E8655]">+</span>
            </p>
            <p className="mt-2 text-[18px] font-semibold md:text-[21px]">{tLander.rich('customers_line', { ...richTags, customers: HOME_CUSTOMERS })}</p>
            <p className="mt-2 text-[14.5px]">{tLander.rich('story_line', richTags)}</p>
          </div>
          <div className={cn('relative mt-4 overflow-hidden rounded-[18px] p-4 md:mt-0 md:p-6', FOREST_BG)}>
            <div className="absolute inset-0 bg-[#0f1a14]/55" aria-hidden />
            <ul className="relative">
              {[1, 2, 3, 4].map((n, index) => (
                <li
                  key={n}
                  className="reveal flex gap-3 border-b border-dashed border-white/20 py-2.5 text-white last:border-0"
                  style={{ '--reveal-delay': `${index * 90}ms` } as React.CSSProperties}
                >
                  <span className="mt-0.5 text-[18px] font-bold leading-none text-[#F0735A]">✱</span>
                  <span>
                    <strong className="block text-[15px]">{t(`home.why_${n}_title`)}</strong>
                    <span className="text-[13.5px] text-white/85">{t(`home.why_${n}_text`)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── AKCIJE ───────────────────────────────────────────── */}
        {offers.length > 0 && (
          <section id="akcije" className="scroll-mt-24">
            <LanderHeading sub={t('home.offers_text')}>{tl.rich('offers_title', richTags)}</LanderHeading>
            <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-2 md:gap-6">
              {offers.map((offer) => (
                <OfferTile key={offer.productId} offer={offer} product={byId.get(offer.productId)!} locale={locale} countryConfig={countryConfig} />
              ))}
            </div>
          </section>
        )}
      </main>

      <TornBand label={tLander.rich('cta', richTags)} onClick={scrollTo(anchor)} className="mt-10 md:mt-16" />

      <main className="mx-auto max-w-[1180px] space-y-10 px-3 pt-8 md:space-y-16 md:px-6 md:pt-12">
        {/* ── PO POTREBI ───────────────────────────────────────── */}
        {needs.length > 0 && (
          <section>
            <LanderHeading sub={t('home.needs_text')}>{tl.rich('needs_title', richTags)}</LanderHeading>
            <div className="mt-6">
              <NeedsGrid needs={needs} byId={byId} locale={locale} />
            </div>
          </section>
        )}

        {/* ── SVI PROIZVODI ────────────────────────────────────── */}
        <section id="proizvodi" className="scroll-mt-24">
          <LanderHeading sub={t('home.products_text')}>{tl.rich('products_title', richTags)}</LanderHeading>
          <div className="mt-6 grid grid-cols-2 gap-2.5 md:gap-4 lg:grid-cols-4">
            {catalog.map((product) => (
              <LanderProductCard key={product.id} product={product} locale={locale} countryConfig={countryConfig} />
            ))}
          </div>
        </section>

        <LanderReviews productIds={HOME_TESTIMONIALS} shots={STORE_PROOF.shots} reviewsCount={STORE_PROOF.reviewsCount} />

        <LanderGuarantee unit={tl('guarantee_unit_home')} />

        <LanderIconCards natural={tl('card_natural_home')} safe={tLander('card_safe_text')} tested={tl('card_tested_home')} />

        <LanderFaq countryCode={countryConfig.code} />
      </main>

      <TornBand label={tLander.rich('cta', richTags)} onClick={scrollTo(anchor)} className="mt-10" />
      <LanderFooter countryConfig={countryConfig} locale={locale} className="pb-6" />
      <CookieConsent isEU={countryConfig.isEU} />
    </div>
  );
}
