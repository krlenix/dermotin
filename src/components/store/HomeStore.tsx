'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight, Banknote, BadgeCheck, Check, ChevronDown, ClipboardCheck, Leaf, Mail, MousePointerClick, Package, Phone, RotateCcw, Truck } from 'lucide-react';

import type { Product } from '@/config/products';
import { getDefaultCourier, type CountryConfig } from '@/config/countries';
import { STORE_HERO_IMAGE, getNeedTiles, getProductFacts, getStoreOffers, getStoreVisual, tightPackshot, type StoreOffer } from '@/config/store-content';
import { SITE_CUSTOMERS, STORE_PROOF } from '@/config/store-proof';
import { getLanderContent } from '@/config/lander-content';
import { getProductVariantsForCountry } from '@/config/products';
import { ShopHeader } from '@/components/shop/ShopHeader';
import { CookieConsent } from '@/components/features/CookieConsent';
import { PixelTracker } from '@/components/tracking/PixelTracker';
import { useMarketingTracking } from '@/hooks/useMarketingTracking';
import { cn } from '@/lib/utils';
import { landerFontClass } from './fonts';
import { Bold, CountUp, FOREST_BG, LANDER_BG, LanderFooter, Marked, ReviewShots, Stars, richTags, useReveal } from './LanderKit';
import { LanderProductCard } from './LanderStore';
import { useGeneralFaq } from './StoreSections';
import { formatMoney, variantDiscountPercent, variantPrice, variantSavings } from './format';

interface HomeStoreProps {
  products: Product[];
  countryConfig: CountryConfig;
  locale: string;
}

/** Proizvodi čija svedočanstva idu na početnu. */
const HOME_TESTIMONIALS = ['biomelis_kapi', 'fungel', 'immunis_kapi'];
const GREEN_PATTERN = "bg-[#7FCB95] bg-[url('/images/lander/bg2-h17.jpg')] bg-cover bg-center";

function defaultVariant(product: Product, locale: string) {
  const variants = getProductVariantsForCountry(product, locale);
  return variants.find((v) => v.isDefault) || variants[0];
}

/** Naslov sekcije poravnat levo (početna), sa opcionom vezom desno. */
function HomeHeading({ children, sub, action, className }: { children: React.ReactNode; sub?: React.ReactNode; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-3 md:flex-row md:items-end md:justify-between', className)}>
      <div>
        <h2 className="text-[28px] font-extrabold leading-tight md:text-[40px]">{children}</h2>
        {sub && <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[#4a4a4a] md:text-[16px]">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function HomeStore({ products, countryConfig, locale }: HomeStoreProps) {
  const t = useTranslations('store');
  const tl = useTranslations('store.landerHome');
  const tLander = useTranslations('store.lander');
  useMarketingTracking();
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);
  const faq = useGeneralFaq(countryConfig.code).slice(0, 6);

  const byId = new Map(products.map((product) => [product.id, product]));
  const offers = getStoreOffers(locale).filter((offer) => byId.has(offer.productId));
  const needs = getNeedTiles(locale).filter((need) => byId.has(need.productId));
  const offerIds = new Set(offers.map((offer) => offer.productId));
  const catalog = [...products.filter((p) => offerIds.has(p.id)), ...products.filter((p) => !offerIds.has(p.id))];
  const anchor = offers.length > 0 ? '#akcije' : '#proizvodi';
  const courier = getDefaultCourier(countryConfig);
  const company = countryConfig.company;
  const featured = offers[0];
  const featuredProduct = featured ? byId.get(featured.productId) : undefined;
  const featuredVariant = featuredProduct ? defaultVariant(featuredProduct, locale) : undefined;
  const maxPercent = Math.max(0, ...offers.map((offer) => {
    const variant = defaultVariant(byId.get(offer.productId)!, locale);
    return variant ? variantDiscountPercent(variant) : 0;
  }));
  const testimonials = HOME_TESTIMONIALS.map((id) => getLanderContent(id)?.testimonials.find((item) => item.photo)).filter(
    (item): item is NonNullable<typeof item> => Boolean(item)
  );

  return (
    <div ref={rootRef} className={cn(landerFontClass, 'min-h-screen overflow-x-hidden', LANDER_BG)}>
      <PixelTracker countryCode={countryConfig.code} />
      <ShopHeader />

      <main>
        {/* ── HERO (preko cele širine) ─────────────────────────────── */}
        <section className="relative overflow-hidden bg-[#2E8655]">
          <div className="pointer-events-none absolute inset-0 bg-[url('/images/lander/bg2-h17.jpg')] bg-cover bg-center opacity-30 mix-blend-soft-light" aria-hidden />
          <div className="pointer-events-none absolute -right-24 top-10 h-[420px] w-[420px] rounded-full bg-white/15 blur-3xl" aria-hidden />
          <div className="relative mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-4 px-4 pb-10 pt-8 md:grid-cols-[1.05fr_1fr] md:gap-10 md:px-6 md:pb-16 md:pt-14">
            <div className="min-w-0 text-white">
              <p className="inline-flex flex-wrap items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-[12.5px] font-semibold backdrop-blur">
                <Stars size={14} />
                {tl('hero_badge', { rating: '5/5', reviews: STORE_PROOF.reviewsCount, customers: SITE_CUSTOMERS })}
              </p>
              <h1 className="mt-5 text-[32px] font-extrabold leading-[1.12] [text-shadow:0_1px_2px_rgba(0,0,0,0.15)] md:text-[54px]">
                {t('home.hero_title_1')}{' '}
                <Marked tone="coral" animate>{t('home.hero_title_highlight')}</Marked> {t('home.hero_title_2')}
              </h1>
              <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-white/90 md:text-[18px]">
                {t.rich('home.hero_text', { b: (chunks) => <strong className="font-bold text-white">{chunks}</strong> })}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href={anchor}
                  className="lander-shine inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#F0735A] px-8 text-[15px] font-bold uppercase tracking-wide text-white shadow-[0_6px_0_#c4533b] transition hover:scale-[1.02]"
                >
                  {offers.length > 0 ? t('home.cta_offers') : t('home.cta_products')}
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  href={`/${locale}/products`}
                  className="inline-flex h-14 items-center justify-center rounded-full border-2 border-white/80 px-8 text-[15px] font-bold uppercase tracking-wide text-white transition hover:bg-white/10"
                >
                  {t('home.cta_all')}
                </Link>
              </div>
            </div>

            <div className="relative min-w-0">
              <div className="relative mx-auto aspect-[5/4] w-full max-w-[560px] md:aspect-square">
                <div className="lander-float absolute inset-0">
                  <Image src={STORE_HERO_IMAGE} alt="DERMOTIN" fill priority sizes="(max-width: 768px) 92vw, 560px" className="object-contain object-bottom" />
                </div>
                {maxPercent > 0 && (
                  <a
                    href={anchor}
                    className="lander-pop absolute right-0 top-0 flex h-[84px] w-[84px] rotate-[10deg] flex-col items-center justify-center rounded-full bg-[#F0735A] text-white shadow-[0_10px_24px_-8px_rgba(0,0,0,0.45)] [animation-delay:600ms] md:right-4 md:top-6 md:h-28 md:w-28"
                  >
                    <span className="text-[10px] font-semibold uppercase leading-none">{tl('sticker')}</span>
                    <span className="text-[24px] font-extrabold leading-tight md:text-[32px]">−{maxPercent}%</span>
                  </a>
                )}
              </div>
              {featured && featuredProduct && featuredVariant && (
                <Link
                  href={`/${locale}/products/${featuredProduct.slug}`}
                  className="group mx-auto mt-3 flex max-w-[420px] items-center gap-3 rounded-[18px] bg-white p-3 text-[#151515] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.5)] transition hover:-translate-y-0.5"
                >
                  <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[12px] bg-[#EEF6F0]">
                    <Image src={tightPackshot(getStoreVisual(featuredProduct).packshot)} alt={featured.title} fill sizes="64px" className="object-contain p-1" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10.5px] font-bold uppercase tracking-wide text-[#F0735A]">{tl('offer_of_day')} · {featured.badge}</span>
                    <span className="block truncate text-[15px] font-extrabold">{featured.title}</span>
                    <span className="flex items-baseline gap-2">
                      <span className="text-[17px] font-extrabold text-[#2E8655]">{formatMoney(variantPrice(featuredVariant), countryConfig)}</span>
                      {variantSavings(featuredVariant) > 0 && (
                        <span className="text-[12px] text-[#999] line-through">{formatMoney(featuredVariant.price, countryConfig)}</span>
                      )}
                    </span>
                  </span>
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2E8655] text-white transition group-hover:translate-x-0.5">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* ── TRAKA POVERENJA ─────────────────────────────────── */}
        <section className="mx-auto mt-6 max-w-[1180px] px-3 md:mt-8 md:px-6">
          <ul className="grid grid-cols-2 gap-2 rounded-[22px] bg-white p-3 shadow-[0_8px_24px_rgba(0,0,0,0.06)] md:grid-cols-4 md:gap-4 md:p-5">
            {[
              { icon: Banknote, title: t('trust.cod_title'), text: t('trust.cod_text') },
              { icon: Truck, title: t('trust.delivery_title', { time: courier.deliveryTime }), text: t('trust.delivery_text', { amount: formatMoney(countryConfig.business.freeShippingThreshold, countryConfig) }) },
              { icon: RotateCcw, title: t('trust.returns_title', { days: countryConfig.business.returnPeriodDays }), text: t('trust.returns_text') },
              { icon: BadgeCheck, title: tl('trust_registered_title'), text: tl('trust_registered_text') },
            ].map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-center gap-3 rounded-[14px] p-2">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2E8655] text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13.5px] font-bold leading-tight md:text-[15px]">{title}</span>
                  <span className="block text-[12px] leading-snug text-[#666] md:text-[13px]">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── AKCIJE (bento) ──────────────────────────────────── */}
        {featured && featuredProduct && (
          <section id="akcije" className="mx-auto mt-14 max-w-[1180px] scroll-mt-24 px-3 md:mt-20 md:px-6">
            <HomeHeading
              sub={t('home.offers_text')}
              action={
                <Link href={`/${locale}/products`} className="inline-flex items-center gap-1.5 text-[15px] font-bold text-[#2E8655] hover:underline">
                  {tl('all_offers')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              }
            >
              {tl.rich('offers_title', richTags)}
            </HomeHeading>
            <div className="mt-6 grid gap-4 md:mt-8 lg:grid-cols-[1.15fr_1fr] lg:gap-5">
              <FeaturedOfferCard offer={featured} product={featuredProduct} locale={locale} countryConfig={countryConfig} />
              <div className="grid gap-4 lg:gap-5">
                {offers.slice(1).map((offer) => (
                  <CompactOfferCard key={offer.productId} offer={offer} product={byId.get(offer.productId)!} locale={locale} countryConfig={countryConfig} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── KATEGORIJE ──────────────────────────────────────── */}
        {needs.length > 0 && (
          <section className="mx-auto mt-14 max-w-[1180px] px-3 md:mt-20 md:px-6">
            <HomeHeading sub={t('home.needs_text')}>{tl.rich('needs_title', richTags)}</HomeHeading>
            <div className="-mx-3 mt-6 flex snap-x gap-3 overflow-x-auto px-3 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-6 md:gap-4 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
              {needs.map((need) => {
                const product = byId.get(need.productId)!;
                return (
                  <Link
                    key={need.productId}
                    href={`/${locale}/products/${product.slug}`}
                    className="reveal group flex w-[132px] shrink-0 snap-start flex-col items-center text-center md:w-auto"
                  >
                    <span className="relative flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-[0_10px_24px_-12px_rgba(0,0,0,0.35)] ring-4 ring-[#F0735A]/80 transition group-hover:-translate-y-1 group-hover:ring-[#2E8655] md:h-32 md:w-32">
                      <span className="relative h-[72%] w-[72%]">
                        <Image src={tightPackshot(getStoreVisual(product).packshot)} alt={need.title} fill sizes="96px" className="object-contain" />
                      </span>
                    </span>
                    <span className="mt-3 text-[15px] font-extrabold leading-tight">{need.title}</span>
                    <span className="mt-1 text-[12.5px] leading-snug text-[#555]">{need.text}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── SVI PROIZVODI ───────────────────────────────────── */}
        <section id="proizvodi" className="mx-auto mt-14 max-w-[1180px] scroll-mt-24 px-3 md:mt-20 md:px-6">
          <HomeHeading sub={t('home.products_text')}>{tl.rich('products_title', richTags)}</HomeHeading>
          <div className="mt-6 grid grid-cols-2 gap-2.5 md:gap-4 lg:grid-cols-4">
            {catalog.map((product) => (
              <LanderProductCard key={product.id} product={product} locale={locale} countryConfig={countryConfig} />
            ))}
          </div>
        </section>

        {/* ── ZAŠTO DERMOTIN (tamna traka) ─────────────────────── */}
        <section className={cn('relative mt-16 overflow-hidden md:mt-24', FOREST_BG)}>
          <div className="absolute inset-0 bg-[#0f1a14]/70" aria-hidden />
          <div className="relative mx-auto grid max-w-[1180px] items-center gap-8 px-4 py-12 text-white md:grid-cols-[0.9fr_1.1fr] md:gap-14 md:px-6 md:py-20">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-[24px] border-4 border-white/10">
              <Image src="/images/main/third-image.jpg" alt={t('home.why_image_alt')} fill sizes="(max-width: 768px) 92vw, 420px" className="object-cover" />
              <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-[#2E8655] px-4 py-2 text-[13px] font-bold">
                <Leaf className="h-4 w-4" />
                {t('home.why_1_title')}
              </span>
            </div>
            <div>
              <p className="text-[12.5px] font-bold uppercase tracking-[0.16em] text-[#9FE0B6]">{t('home.why_eyebrow')}</p>
              <h2 className="mt-3 text-[30px] font-extrabold leading-tight md:text-[42px]">{t('home.why_title')}</h2>
              <p className="mt-4 text-[15.5px] leading-relaxed text-white/85">{t('home.why_text')}</p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {[1, 2, 3, 4].map((n) => (
                  <li key={n} className="flex gap-3 rounded-[16px] bg-white/[0.07] p-3.5 ring-1 ring-white/10">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F0735A]">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    <span>
                      <span className="block text-[15px] font-bold">{t(`home.why_${n}_title`)}</span>
                      <span className="block text-[13px] leading-snug text-white/75">{t(`home.why_${n}_text`)}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  { value: <CountUp value={SITE_CUSTOMERS} />, plus: true, label: tl('stat_customers') },
                  { value: STORE_PROOF.reviewsCount.replace('+', ''), plus: true, label: tl('stat_reviews') },
                  { value: String(STORE_PROOF.years), plus: false, label: tl('stat_years') },
                  { value: String(countryConfig.business.returnPeriodDays), plus: false, label: tl('stat_returns') },
                ].map(({ value, plus, label }) => (
                  <div key={label} className="rounded-[16px] bg-white p-3 text-center text-[#151515]">
                    <dt className="text-[26px] font-extrabold leading-none text-[#2E8655] md:text-[30px]">
                      {value}
                      {plus && <span className="text-[#F0735A]">+</span>}
                    </dt>
                    <dd className="mt-1.5 text-[12px] font-semibold leading-tight text-[#555]">{label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* ── RECENZIJE ────────────────────────────────────────── */}
        <section id="utisci" className="mx-auto mt-14 max-w-[1180px] scroll-mt-24 px-3 md:mt-20 md:px-6">
          <HomeHeading
            action={
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[14px] font-bold shadow-[0_6px_16px_rgba(0,0,0,0.06)]">
                <Stars size={16} /> 5/5 · {STORE_PROOF.reviewsCount}
              </span>
            }
          >
            {tl.rich('reviews_title_home', richTags)}
          </HomeHeading>
          <div className="mt-6 grid gap-3 md:grid-cols-3 md:gap-5">
            {testimonials.map((item, index) => (
              <figure
                key={item.name}
                className="reveal flex flex-col rounded-[20px] bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)] ring-1 ring-black/5"
                style={{ '--reveal-delay': `${index * 100}ms` } as React.CSSProperties}
              >
                <div className="flex items-center gap-3">
                  {item.photo && (
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-[3px] border-[#2E8655]">
                      <Image src={item.photo} alt={item.name} fill sizes="48px" className="object-cover" />
                    </span>
                  )}
                  <span>
                    <span className="block text-[15px] font-bold">{item.name}</span>
                    {item.age && <span className="block text-[12.5px] text-[#666]">{item.age} {tLander('years')}</span>}
                  </span>
                  <span className="ml-auto">
                    <Stars size={14} />
                  </span>
                </div>
                <blockquote className="mt-4 text-[14.5px] leading-relaxed text-[#333]">„{item.text}“</blockquote>
              </figure>
            ))}
          </div>
          <ReviewShots shots={STORE_PROOF.shots} title={tLander('shots_title')} />
        </section>

        {/* ── KAKO PORUČITI + GARANCIJA ────────────────────────── */}
        <section className="mx-auto mt-14 grid max-w-[1180px] gap-4 px-3 md:mt-20 md:grid-cols-2 md:gap-6 md:px-6">
          <div className="reveal rounded-[22px] bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)] md:p-8">
            <h2 className="text-[24px] font-extrabold md:text-[30px]">{tLander.rich('how_title', richTags)}</h2>
            <ol className="relative mt-6 space-y-5 before:absolute before:bottom-4 before:left-[21px] before:top-4 before:w-0.5 before:bg-[#2E8655]/20">
              {[
                { icon: MousePointerClick, title: t('how.step1_title'), text: t('how.step1_text') },
                { icon: ClipboardCheck, title: t('how.step2_title'), text: t('how.step2_text') },
                { icon: Package, title: t('how.step3_title', { time: courier.deliveryTime }), text: t('how.step3_text') },
              ].map(({ icon: Icon, title, text }) => (
                <li key={title} className="relative flex gap-4">
                  <span className="relative z-10 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2E8655] text-white ring-4 ring-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-[16px] font-bold">{title}</span>
                    <span className="mt-0.5 block text-[14px] leading-relaxed text-[#555]">{text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="reveal flex flex-col items-center justify-center gap-4 rounded-[22px] border-2 border-[#F0735A] bg-[#FFF6F3] p-5 text-center md:p-8">
            <div className="relative h-28 w-28 shrink-0">
              <span className="absolute inset-0 rounded-full border-[3px] border-dashed border-[#2E8655]/70 motion-safe:animate-[spin_24s_linear_infinite]" aria-hidden />
              <span className="absolute inset-[9px] flex flex-col items-center justify-center rounded-full bg-[#F0735A] text-white">
                <span className="text-[26px] font-extrabold leading-none">100%</span>
                <span className="mt-1 text-[9.5px] font-bold uppercase tracking-[0.12em]">{tLander('seal_label')}</span>
              </span>
            </div>
            <h2 className="text-[24px] font-extrabold leading-snug md:text-[30px]">{tLander.rich('guarantee_title', richTags)}</h2>
            <p className="text-[15px] leading-relaxed">{tLander.rich('guarantee_text', { ...richTags, unit: tl('guarantee_unit_home') })}</p>
          </div>
        </section>

        {/* ── ČESTA PITANJA (dve kolone) ───────────────────────── */}
        {faq.length > 0 && (
          <section className="mx-auto mt-14 grid max-w-[1180px] gap-6 px-3 md:mt-20 md:grid-cols-[0.8fr_1.2fr] md:gap-12 md:px-6">
            <div>
              <h2 className="text-[28px] font-extrabold leading-tight md:text-[40px]">{tLander.rich('faq_title', richTags)}</h2>
              <p className="mt-2 text-[15px] text-[#4a4a4a]">{tl('faq_sub')}</p>
              <div className="mt-5 space-y-2">
                {company.phone && (
                  <a href={`tel:${company.phone}`} className="flex items-center gap-3 rounded-[14px] bg-white p-3.5 font-semibold shadow-[0_4px_14px_rgba(0,0,0,0.05)]">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#2E8655] text-white"><Phone className="h-4 w-4" /></span>
                    {company.phone}
                  </a>
                )}
                <a href={`mailto:${company.email}`} className="flex items-center gap-3 rounded-[14px] bg-white p-3.5 font-semibold shadow-[0_4px_14px_rgba(0,0,0,0.05)]">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#2E8655] text-white"><Mail className="h-4 w-4" /></span>
                  <span className="break-all">{company.email}</span>
                </a>
              </div>
            </div>
            <div className="space-y-2">
              {faq.map((item) => (
                <details key={item.question} className="group rounded-[14px] bg-white px-4 shadow-[0_4px_14px_rgba(0,0,0,0.05)] open:shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-4 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <ChevronDown className="h-5 w-5 shrink-0 text-[#2E8655] transition group-open:rotate-180" />
                  </summary>
                  <p className="pb-4 text-[14.5px] leading-relaxed text-[#444]">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* ── ZAVRŠNI POZIV ────────────────────────────────────── */}
        <section className="mx-auto mt-14 max-w-[1180px] px-3 md:mt-20 md:px-6">
          <div className={cn('relative overflow-hidden rounded-[28px] px-5 py-10 text-center md:px-12 md:py-14', GREEN_PATTERN)}>
            <h2 className="text-[28px] font-extrabold leading-tight text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.12)] md:text-[42px]">{tl.rich('final_title', richTags)}</h2>
            <p className="mx-auto mt-3 max-w-xl text-[15.5px] font-medium text-white">{tl('final_text')}</p>
            <a
              href={anchor}
              className="lander-shine mt-6 inline-flex h-14 items-center gap-2 rounded-full bg-white px-8 text-[15px] font-bold uppercase tracking-wide text-[#2E8655] shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)] transition hover:scale-[1.03]"
            >
              {offers.length > 0 ? t('home.cta_offers') : t('home.cta_products')}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <div className="mt-14 md:mt-20">
        <LanderFooter countryConfig={countryConfig} locale={locale} className="pb-6" />
      </div>
      <CookieConsent isEU={countryConfig.isEU} />
    </div>
  );
}

/** Velika istaknuta akcija (bento, levo). */
function FeaturedOfferCard({ offer, product, locale, countryConfig }: { offer: StoreOffer; product: Product; locale: string; countryConfig: CountryConfig }) {
  const t = useTranslations('store');
  const variant = defaultVariant(product, locale);
  if (!variant) return null;
  const percent = variantDiscountPercent(variant);
  const savings = variantSavings(variant);
  const quantity = Math.max(1, variant.quantity ?? 1);
  const facts = getProductFacts(product.id).slice(0, 3);

  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
      className="reveal group flex flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_14px_36px_-18px_rgba(0,0,0,0.4)] ring-2 ring-[#F0735A]"
    >
      <div className={cn('relative aspect-[16/10] overflow-hidden', GREEN_PATTERN)}>
        <Image
          src={tightPackshot(getStoreVisual(product).packshot)}
          alt={offer.title}
          fill
          sizes="(max-width: 1024px) 100vw, 640px"
          className="object-contain p-6 drop-shadow-[0_18px_22px_rgba(0,0,0,0.2)] transition duration-700 group-hover:scale-[1.04]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-[#F0735A] px-3 py-1.5 text-[12px] font-bold uppercase tracking-wide text-white">{offer.badge}</span>
        {percent > 0 && (
          <span className="absolute right-4 top-4 flex h-16 w-16 rotate-[8deg] flex-col items-center justify-center rounded-full bg-white text-[#F0735A] shadow">
            <span className="text-[9px] font-bold uppercase leading-none">{t('card.save')}</span>
            <span className="text-[20px] font-extrabold leading-tight">{percent}%</span>
          </span>
        )}
        {quantity > 1 && (
          <span className="absolute bottom-4 right-4 rounded-full bg-[#2E8655] px-3 py-1 text-[17px] font-extrabold text-white shadow">× {quantity}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <p className="text-[24px] font-extrabold leading-tight md:text-[28px]">{offer.title}</p>
        <p className="mt-2 text-[15px] leading-relaxed text-[#444]">
          <Bold text={offer.pitch} />
        </p>
        {facts.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {facts.map((fact) => (
              <li key={fact.label} className="rounded-full bg-[#2E8655]/10 px-2.5 py-1 text-[12.5px] font-medium text-[#1d5434]">
                <strong className="font-extrabold">{fact.value}</strong> {fact.label}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-5">
          <div>
            {savings > 0 && <p className="text-[13px] text-[#888] line-through">{formatMoney(variant.price, countryConfig)}</p>}
            <p className="inline-block bg-[#2E8655] px-2 py-0.5 text-[32px] font-extrabold leading-none text-white [text-shadow:2px_2px_0_#14402a]">
              {formatMoney(variantPrice(variant), countryConfig)}
            </p>
            {offer.priceNote && <p className="mt-1.5 text-[12.5px] text-[#666]">{offer.priceNote}</p>}
          </div>
          <span className="lander-shine inline-flex h-12 items-center gap-2 rounded-full bg-[#2E8655] px-6 text-[15px] font-bold text-white shadow-[0_4px_0_#1d5434]">
            {t('lander.submit')}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Kompaktna akcija (bento, desno): slika levo, tekst i cena desno. */
function CompactOfferCard({ offer, product, locale, countryConfig }: { offer: StoreOffer; product: Product; locale: string; countryConfig: CountryConfig }) {
  const t = useTranslations('store');
  const variant = defaultVariant(product, locale);
  if (!variant) return null;
  const percent = variantDiscountPercent(variant);
  const savings = variantSavings(variant);

  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
      className="reveal group flex items-stretch overflow-hidden rounded-[20px] bg-white shadow-[0_8px_24px_-14px_rgba(0,0,0,0.35)] ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:ring-[#2E8655]/40"
    >
      <div className={cn('relative w-[38%] shrink-0 overflow-hidden', GREEN_PATTERN)}>
        <Image
          src={tightPackshot(getStoreVisual(product).packshot)}
          alt={offer.title}
          fill
          sizes="200px"
          className="object-contain p-3 drop-shadow-[0_10px_14px_rgba(0,0,0,0.2)] transition duration-500 group-hover:scale-[1.06]"
        />
        {percent > 0 && <span className="absolute left-2 top-2 rounded-full bg-[#F0735A] px-2 py-0.5 text-[11.5px] font-extrabold text-white">−{percent}%</span>}
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-3.5 md:p-4">
        <span className="text-[10.5px] font-bold uppercase tracking-wide text-[#F0735A]">{offer.badge}</span>
        <p className="mt-0.5 text-[16px] font-extrabold leading-tight md:text-[18px]">{offer.title}</p>
        {offer.priceNote && <p className="mt-1 text-[12.5px] text-[#666]">{offer.priceNote}</p>}
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            {savings > 0 && <p className="text-[11.5px] text-[#999] line-through">{formatMoney(variant.price, countryConfig)}</p>}
            <p className="text-[20px] font-extrabold leading-none text-[#2E8655]">{formatMoney(variantPrice(variant), countryConfig)}</p>
            {savings > 0 && <p className="mt-0.5 text-[11.5px] font-bold text-[#F0735A]">{t('card.you_save', { amount: formatMoney(savings, countryConfig) })}</p>}
          </div>
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2E8655] text-white transition group-hover:translate-x-0.5">
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
