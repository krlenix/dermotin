'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight, ArrowUpRight, Banknote, Leaf, ShieldCheck } from 'lucide-react';

import type { Product } from '@/config/products';
import { getDefaultCourier, type CountryConfig } from '@/config/countries';
import { STORE_HERO_IMAGE, getNeedTiles, getStoreOffers, getStoreVisual } from '@/config/store-content';
import { getProductVariantsForCountry } from '@/config/products';
import { ShopHeader } from '@/components/shop/ShopHeader';
import { CookieConsent } from '@/components/features/CookieConsent';
import { PixelTracker } from '@/components/tracking/PixelTracker';
import { useMarketingTracking } from '@/hooks/useMarketingTracking';
import { cn } from '@/lib/utils';
import { storeFontClass } from './fonts';
import { FeaturedOffer, OfferSpotlight, ProductCard, ProductStage } from './ProductCard';
import {
  Eyebrow,
  GuaranteeBand,
  HowToOrder,
  SectionHeading,
  StoreFaq,
  StoreFooter,
  TrustStrip,
  btnOutline,
  btnPrimary,
} from './StoreSections';
import { formatMoney, variantDiscountPercent, variantPrice } from './format';
import { DashTitle } from './Rich';
import { STORE_PROOF } from '@/config/store-proof';
import { ProofSummary, ReviewsShowcase } from './ProofSections';

/** Fotografije iz upotrebe uz izdvojene proizvode (opciono) */
const SPOTLIGHT_PHOTOS: Record<string, string> = {
  fungel_fungomax_set: '/images/main/banner-image.jpg',
  biomelis_set: '/images/main/hero-image.webp',
};

interface HomeStoreProps {
  products: Product[];
  countryConfig: CountryConfig;
  locale: string;
}

export function HomeStore({ products, countryConfig, locale }: HomeStoreProps) {
  const t = useTranslations('store');
  useMarketingTracking();

  const byId = new Map(products.map((product) => [product.id, product]));
  const offers = getStoreOffers(locale).filter((offer) => byId.has(offer.productId));
  const needs = getNeedTiles(locale).filter((need) => byId.has(need.productId));
  const heroOffer = offers[0];
  const heroProduct = heroOffer ? byId.get(heroOffer.productId) : undefined;
  const heroVariant = heroProduct
    ? (() => {
        const variants = getProductVariantsForCountry(heroProduct, locale);
        return variants.find((v) => v.isDefault) || variants[0];
      })()
    : undefined;
  const offerIds = new Set(offers.map((offer) => offer.productId));
  const catalog = [...products.filter((p) => offerIds.has(p.id)), ...products.filter((p) => !offerIds.has(p.id))];
  const anchor = offers.length > 0 ? '#akcije' : '#proizvodi';
  const maxPercent = Math.max(
    0,
    ...offers.map((offer) => {
      const product = byId.get(offer.productId)!;
      const variants = getProductVariantsForCountry(product, locale);
      const variant = variants.find((v) => v.isDefault) || variants[0];
      return variant ? variantDiscountPercent(variant) : 0;
    })
  );
  const marquee = [
    t('home.marquee_1'),
    t('home.marquee_2'),
    t('home.marquee_3'),
    t('home.marquee_4', { time: getDefaultCourier(countryConfig).deliveryTime }),
    t('home.marquee_5', { days: countryConfig.business.returnPeriodDays }),
    t('home.marquee_6'),
  ];
  const closingProduct = byId.get('fungel_fungomax_set') ?? catalog[0];

  return (
    <div className={cn(storeFontClass, 'min-h-screen overflow-x-hidden bg-paper')}>
      <PixelTracker countryCode={countryConfig.code} />
      <ShopHeader />

      <main>
        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="container mx-auto grid items-center gap-10 px-4 pb-14 pt-10 md:pt-16 lg:grid-cols-[1fr_1fr] lg:gap-20 lg:pb-24">
          <div className="store-fade-up">
            <Eyebrow>{offers.length > 0 ? t('home.hero_badge_offers') : t('home.hero_badge')}</Eyebrow>
            <h1 className="mt-6 font-display text-[54px] leading-[0.96] text-ink sm:text-[72px] xl:text-[92px]">
              {t('home.hero_title_1')}{' '}
              <em className="relative inline-block italic text-moss">
                {t('home.hero_title_highlight')}
                <svg className="absolute -bottom-1 left-0 h-[0.18em] w-full text-coral" viewBox="0 0 300 14" fill="none" preserveAspectRatio="none" aria-hidden>
                  <path d="M3 10C70 3 160 2 297 7" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </em>{' '}
              {t('home.hero_title_2')}
            </h1>
            <p className="mt-7 max-w-lg text-[17px] leading-relaxed text-ink/75 md:text-[18.5px]">
              {t.rich('home.hero_text', { b: (chunks) => <strong className="font-semibold text-ink">{chunks}</strong> })}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href={anchor} className={btnPrimary}>
                {offers.length > 0 ? t('home.cta_offers') : t('home.cta_products')}
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link href={`/${locale}/products`} className={btnOutline}>
                {t('home.cta_all')}
              </Link>
            </div>
            <ProofSummary proof={STORE_PROOF} className="mt-8" />
            <ul className="mt-6 flex flex-wrap gap-2">
              {[
                { icon: Leaf, text: t('home.marquee_1') },
                { icon: ShieldCheck, text: t('home.marquee_2') },
                { icon: Banknote, text: t('home.marquee_3') },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-[13.5px] font-medium text-ink/85">
                  <Icon className="h-4 w-4 text-moss" strokeWidth={1.8} />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative store-fade-up [animation-delay:120ms]">
            <ProductStage
              src={STORE_HERO_IMAGE}
              alt="DERMOTIN"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="mx-auto aspect-[5/6] w-full max-w-[620px] rounded-b-[32px] rounded-t-[999px]"
              imageClassName="object-bottom"
            />
            {maxPercent > 0 && (
              <a
                href={anchor}
                className="absolute right-2 top-[14%] flex h-28 w-28 rotate-[10deg] flex-col items-center justify-center rounded-full bg-coral text-center text-white shadow-[0_20px_40px_-16px_rgba(201,83,58,0.9)] transition hover:rotate-0 sm:right-6 md:h-32 md:w-32"
              >
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] opacity-90">{t('home.sticker_label')}</span>
                <span className="font-display text-[44px] leading-none md:text-[52px]">−{maxPercent}%</span>
              </a>
            )}
            {heroProduct && heroVariant && heroOffer && (
              <Link
                href={`/${locale}/products/${heroProduct.slug}`}
                className="group absolute -bottom-6 left-3 right-3 flex items-center gap-4 rounded-[20px] bg-white/95 p-3 pr-5 shadow-[0_30px_60px_-30px_rgba(26,38,32,0.45)] backdrop-blur sm:left-auto sm:right-0 sm:w-[380px] lg:-left-10 lg:right-auto"
              >
                <ProductStage src={getStoreVisual(heroProduct).packshot} alt={heroOffer.title} sizes="80px" className="h-20 w-20 shrink-0 rounded-[14px]" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-coral">{heroOffer.badge}</p>
                  <p className="mt-1 truncate text-[15px] font-semibold text-ink">{heroOffer.title}</p>
                  <p className="mt-0.5 flex items-baseline gap-2">
                    <span className="text-[17px] font-semibold text-ink">{formatMoney(variantPrice(heroVariant), countryConfig)}</span>
                    {heroVariant.discountPrice && (
                      <span className="text-[12.5px] text-ink/40 line-through">{formatMoney(heroVariant.price, countryConfig)}</span>
                    )}
                  </p>
                </div>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-ink/40 transition group-hover:text-coral" />
              </Link>
            )}
          </div>
        </section>

        <section className="container mx-auto mt-6 px-4 md:mt-4">
          <TrustStrip countryConfig={countryConfig} />
        </section>

        {/* ── TRAKA SA PREDNOSTIMA ─────────────────────────────── */}
        <div className="mt-16 overflow-hidden bg-coral py-5 text-white md:mt-24 md:py-7" aria-hidden>
          <div className="flex w-max animate-marquee-slow">
            {Array.from({ length: 5 }).map((_, copy) => (
              <div key={copy} className="flex shrink-0 items-center">
                {marquee.map((item) => (
                  <span key={`${copy}-${item}`} className="flex items-center whitespace-nowrap font-display text-[30px] italic leading-none md:text-[44px]">
                    <span className="px-6 md:px-9">{item}</span>
                    <span className="text-[18px] not-italic text-white/70 md:text-[24px]">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── AKCIJE ───────────────────────────────────────────── */}
        {offers.length > 0 && (
          <section id="akcije" className="container mx-auto scroll-mt-28 px-4 pt-20 md:pt-32">
            <SectionHeading
              eyebrow={t('home.offers_eyebrow')}
              title={t('home.offers_title')}
              text={t('home.offers_text')}
              action={
                <Link href={`/${locale}/products`} className="group inline-flex items-center gap-2 text-[15px] font-semibold text-ink">
                  <span className="border-b border-ink/30 pb-0.5 transition group-hover:border-ink">{t('home.offers_link')}</span>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              }
            />
            <FeaturedOffer offer={offers[0]} product={byId.get(offers[0].productId)!} locale={locale} countryConfig={countryConfig} />
            {offers.length > 1 && (
              <div className="mt-20 space-y-24 md:mt-28 md:space-y-32">
                {offers.slice(1).map((offer, index) => (
                  <OfferSpotlight
                    key={offer.productId}
                    offer={offer}
                    product={byId.get(offer.productId)!}
                    locale={locale}
                    countryConfig={countryConfig}
                    reverse={index % 2 === 1}
                    photo={SPOTLIGHT_PHOTOS[offer.productId]}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── PO POTREBI ───────────────────────────────────────── */}
        {needs.length > 0 && (
          <section className="container mx-auto px-4 pt-24 md:pt-36">
            <SectionHeading eyebrow={t('home.needs_eyebrow')} title={t('home.needs_title')} text={t('home.needs_text')} />
            <div className="grid gap-px overflow-hidden rounded-[24px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {needs.map((need) => {
                const product = byId.get(need.productId)!;
                return (
                  <Link
                    key={need.productId}
                    href={`/${locale}/products/${product.slug}`}
                    className="group flex items-center gap-5 bg-paper p-4 transition duration-300 hover:bg-[#F2ECE3] md:p-6"
                  >
                    <ProductStage
                      src={getStoreVisual(product).packshot}
                      alt={need.title}
                      sizes="120px"
                      className="h-24 w-24 shrink-0 rounded-[16px] md:h-28 md:w-28"
                      imageClassName="group-hover:scale-[1.06]"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-[26px] leading-[1.05] text-ink md:text-[30px]">{need.title}</p>
                      <p className="mt-1.5 text-[14px] leading-snug text-ink/65">{need.text}</p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-ink/25 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-coral" />
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── SVI PROIZVODI ────────────────────────────────────── */}
        <section id="proizvodi" className="container mx-auto scroll-mt-28 px-4 pt-24 md:pt-36">
          <SectionHeading eyebrow={t('home.products_eyebrow')} title={t('home.products_title')} text={t('home.products_text')} />
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14 lg:grid-cols-4">
            {catalog.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} countryConfig={countryConfig} />
            ))}
          </div>
        </section>

        {/* ── UTISCI KUPACA ─────────────────────────────────────── */}
        <ReviewsShowcase proof={STORE_PROOF} className="pt-24 md:pt-36" />

        {/* ── ZAŠTO DERMOTIN ───────────────────────────────────── */}
        <section className="mt-24 bg-forest text-paper md:mt-36">
          <div className="container mx-auto px-4 py-20 md:py-28">
            <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
              <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[28px]">
                <Image src="/images/main/third-image.jpg" alt={t('home.why_image_alt')} fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
              </div>
              <div>
                <Eyebrow invert>{t('home.why_eyebrow')}</Eyebrow>
                <h2 className="mt-5 font-display text-[44px] leading-[1.02] md:text-[64px]"><DashTitle text={t("home.why_title")} accentClassName="text-[#F2A08C]" /></h2>
                <p className="mt-6 max-w-xl text-[16.5px] leading-relaxed text-paper/70 md:text-[17.5px]">{t('home.why_text')}</p>
                <div className="mt-12 grid gap-x-10 gap-y-8 border-t border-paper/15 pt-10 sm:grid-cols-2">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n}>
                      <p className="text-[16px] font-semibold">{t(`home.why_${n}_title`)}</p>
                      <p className="mt-2 text-[14.5px] leading-relaxed text-paper/60">{t(`home.why_${n}_text`)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <dl className="mt-20 grid grid-cols-2 border-t border-paper/15 md:mt-28 lg:grid-cols-4">
              {[
                { value: t('home.stat_1_value'), label: t('home.stat_1_label') },
                { value: t('home.stat_2_value'), label: t('home.stat_2_label') },
                { value: t('home.stat_3_value'), label: t('home.stat_3_label') },
                { value: String(countryConfig.business.returnPeriodDays), label: t('home.stat_4_label') },
              ].map(({ value, label }, index) => (
                <div
                  key={label}
                  className={cn(
                    'pt-8 lg:pt-12',
                    index % 2 === 1 && 'border-l border-paper/15 pl-6',
                    index >= 2 && 'mt-8 border-t border-paper/15 lg:mt-0 lg:border-t-0',
                    index === 2 && 'lg:border-l lg:pl-6',
                    index > 0 && 'lg:pl-10'
                  )}
                >
                  <dt className="font-display text-[64px] leading-none md:text-[88px]">{value}</dt>
                  <dd className="mt-3 max-w-[14rem] text-[14px] leading-snug text-paper/60">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── KAKO PORUČITI ────────────────────────────────────── */}
        <section className="container mx-auto px-4 pt-24 md:pt-36">
          <SectionHeading eyebrow={t('how.eyebrow')} title={t('how.title')} text={t('how.text')} />
          <HowToOrder countryConfig={countryConfig} />
          <div className="mt-12">
            <GuaranteeBand countryConfig={countryConfig} />
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 pt-24 md:pt-36">
          <StoreFaq countryConfig={countryConfig} />
        </section>

        {/* ── ZAVRŠNI POZIV ────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24 md:py-36">
          <div className="grid overflow-hidden rounded-[32px] bg-sand md:grid-cols-[1.1fr_1fr]">
            <div className="flex flex-col justify-center p-8 md:p-16">
              <Eyebrow>{t('home.final_eyebrow')}</Eyebrow>
              <p className="mt-5 font-display text-[44px] leading-[1.02] text-ink md:text-[60px]">{t('home.final_title')}</p>
              <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ink/75">{t('home.final_text')}</p>
              <a href={anchor} className={cn(btnPrimary, 'mt-9 self-start')}>
                {offers.length > 0 ? t('home.cta_offers') : t('home.cta_products')}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            {closingProduct && (
              <ProductStage
                src={getStoreVisual(closingProduct).packshot}
                alt={closingProduct.name}
                sizes="(max-width: 768px) 100vw, 45vw"
                className="aspect-square md:aspect-auto md:min-h-[480px]"
              />
            )}
          </div>
        </section>
      </main>

      <StoreFooter countryConfig={countryConfig} locale={locale} />
      <CookieConsent isEU={countryConfig.isEU} />
    </div>
  );
}
