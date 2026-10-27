'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  ArrowRight,
  Banknote,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock,
  Gift,
  HandHeart,
  Leaf,
  MousePointerClick,
  Package,
  Plus,
  ShieldCheck,
  Truck,
} from 'lucide-react';

import { getProductVariantsForCountry, type Product } from '@/config/products';
import { getDefaultCourier, type CountryConfig } from '@/config/countries';
import type { LanderContent } from '@/config/lander-content';
import { getStoreOffers, getStoreVisual } from '@/config/store-content';
import { cn } from '@/lib/utils';
import type { BundlePart } from './BundleContents';
import { landerFontClass } from './fonts';
import { Bold, CountUp, FOREST_BG, LanderFooter, Marked, Stars, TornBand, plural, richTags, useDeliveryRange, useReveal } from './LanderKit';
import { QuickOrderForm, type QuickOrderLine } from './QuickOrderForm';
import { formatMoney, scrollToOrderForm, variantDiscountPercent, variantPrice, variantSavings } from './format';

interface CheckoutLanderProps {
  product: Product;
  content: LanderContent;
  countryConfig: CountryConfig;
  locale: string;
  /** Sastav seta (učitava ProductLanding) — za prikaz „šta dobijate“ */
  bundleParts?: BundlePart[];
  /** Snimci pravih komentara (opciono, ispod svedočanstava) */
  shots?: Array<[string, number, number]>;
  reviewsCount?: string;
  /** Viber: bez praćenja, kraća stranica, kampanja za OMS */
  channel?: 'viber';
  campaign?: string;
  /** Kratka verzija: bez sastojaka, koraka, ikonica i čestih pitanja */
  compact?: boolean;
  /** Mala oznaka iznad naslova (npr. „Samo za Viber pratioce“) */
  kicker?: string;
  formTitle?: string;
}

export function CheckoutLander({ product, content, countryConfig, locale, bundleParts = [], shots = [], reviewsCount = '850+', channel, campaign, compact = false, kicker, formTitle }: CheckoutLanderProps) {
  const t = useTranslations('store.lander');
  const tStore = useTranslations('store');
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  // Akcija je jedina ponuda na stranici: podrazumevano (akcijsko) pakovanje, bez biranja
  const variant = useMemo(() => {
    const variants = getProductVariantsForCountry(product, locale);
    return variants.find((v) => v.isDefault) || variants[0];
  }, [product, locale]);
  const price = variantPrice(variant);
  const savings = variantSavings(variant);
  const percent = variantDiscountPercent(variant);
  const { packshot } = getStoreVisual(product);
  const courier = getDefaultCourier(countryConfig);
  const registration = content.registration;
  const deliveryRange = useDeliveryRange();
  const [showSticky, setShowSticky] = useState(false);

  const lines: QuickOrderLine[] = useMemo(
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

  // Donja traka na telefonu: posle hero dela, sakrivena dok je forma na ekranu
  useEffect(() => {
    const form = document.getElementById('naruci');
    let formVisible = false;
    const update = () => setShowSticky(!formVisible && window.scrollY > 640);
    const observer = form
      ? new IntersectionObserver(([entry]) => {
          formVisible = entry.isIntersecting;
          update();
        })
      : null;
    if (form && observer) observer.observe(form);
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', update);
    };
  }, []);

  const ctaLabel = content.cta ? <span>{content.cta}</span> : t.rich('cta', richTags);

  return (
    <div ref={rootRef} className={cn(landerFontClass, 'min-h-screen overflow-x-hidden bg-[#EAE9E6] text-[#151515]')}>
      {/* ── TRAKA HITNOSTI ─────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => scrollToOrderForm()}
        className="sticky top-0 z-[150] flex w-full items-center justify-center gap-3 bg-[#2E8655] px-3 py-2.5 text-white shadow-[0_4px_14px_rgba(0,0,0,0.18)] md:gap-5"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0735A] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide md:text-[12px]">
          <Clock className="h-3.5 w-3.5 animate-pulse" />
          {t('urgency_pill')}
        </span>
        <span className="text-left leading-tight">
          <span className="block text-[15px] font-semibold md:text-[16px]">{t('urgency_title')}</span>
          <span className="block text-[11.5px] text-white/85 md:text-[12px]">{t('urgency_sub')}</span>
        </span>
        <ArrowRight className="h-5 w-5 rotate-90" />
      </button>

      <main className="mx-auto max-w-[1180px] px-3 pt-3 md:px-6 md:pt-6">
        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden rounded-[28px] bg-[#7FCB95] bg-[url('/images/lander/bg2-h17.jpg')] bg-cover bg-center">
          <div className="pointer-events-none absolute -right-16 top-1/3 h-72 w-72 rounded-full bg-white/25 blur-3xl md:right-24" aria-hidden />
          <div className="relative grid items-center px-3 pb-2 pt-6 md:grid-cols-2 md:px-14 md:py-12">
            <div className="text-center">
              {kicker && (
                <span className="mb-3 inline-flex rounded-full bg-[#7360F2] px-3.5 py-1.5 text-[11.5px] font-bold uppercase tracking-wide text-white shadow">{kicker}</span>
              )}
              <h1 className="text-[30px] font-extrabold leading-[1.22] text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.12)] md:text-[42px]">
                {content.hero.map((line, index) => (
                  <span key={line.text} className="block">
                    {line.mark ? (
                      <Marked tone={line.mark} animate className={index > 1 ? '[animation-delay:350ms]' : undefined}>
                        {line.text}
                      </Marked>
                    ) : (
                      line.text
                    )}
                  </span>
                ))}
              </h1>
              <div className="mt-4 flex items-center justify-center gap-2 text-[13px] font-medium text-white">
                <Stars size={16} />
                <span>{t.rich('hero_rating', { b: (chunks) => <strong className="font-bold">{chunks}</strong>, count: reviewsCount })}</span>
              </div>
              <button
                type="button"
                onClick={() => scrollToOrderForm()}
                className="lander-shine mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-[13px] font-semibold uppercase tracking-wide text-[#2E8655] shadow-[0_8px_18px_-8px_rgba(0,0,0,0.35)] transition hover:scale-[1.03]"
              >
                {t('learn_more')}
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#2E8655] text-white">
                  <ArrowRight className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
              </button>
            </div>
            <div className="relative mx-auto mt-1 aspect-[5/4] w-full max-w-[480px] md:mt-0 md:aspect-square">
              <div className="lander-float absolute inset-0">
                <Image
                  src={packshot}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 92vw, 460px"
                  className="object-cover object-[50%_72%] drop-shadow-[0_20px_24px_rgba(0,0,0,0.18)] md:object-contain"
                />
              </div>
              {percent > 0 && (
                <span className="lander-pop absolute right-1 top-2 flex h-[78px] w-[78px] rotate-[10deg] flex-col items-center justify-center rounded-full bg-[#F0735A] text-white shadow-[0_10px_24px_-8px_rgba(0,0,0,0.4)] [animation-delay:600ms] md:right-6 md:top-10 md:h-24 md:w-24">
                  <span className="text-[10px] font-semibold uppercase leading-none">{tStore('card.save')}</span>
                  <span className="text-[24px] font-extrabold leading-tight md:text-[30px]">−{percent}%</span>
                </span>
              )}
            </div>
          </div>
        </section>

        <div className="mt-4 grid gap-6 md:mt-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-8">
          {/* ── LEVA KOLONA ───────────────────────────────────────── */}
          <div className="min-w-0 space-y-6 md:space-y-8">
            {/* 10,000+ i prednosti */}
            <section className="reveal rounded-[24px] border-l-4 border-[#2E8655] bg-white p-3 shadow-[0_8px_24px_rgba(0,0,0,0.06)] md:p-6">
              <p className="pt-2 text-center text-[58px] font-extrabold leading-none tracking-tight md:text-[84px]">
                <CountUp value={content.customers} /> <span className="text-[#2E8655]">+</span>
              </p>
              <p className="mt-2 text-center text-[18px] font-semibold md:text-[21px]">{t.rich('customers_line', { ...richTags, customers: content.customers })}</p>
              <p className="mt-2 text-center text-[14.5px]">{t.rich('story_line', richTags)}</p>

              <div className={cn('relative mt-4 overflow-hidden rounded-[18px] p-3.5 md:p-6', FOREST_BG)}>
                <div className="absolute inset-0 bg-[#0f1a14]/55" aria-hidden />
                <div className="relative">
                  {content.benefitsTitle && <p className="mb-2 text-[17px] font-semibold text-white">{content.benefitsTitle}</p>}
                  <ul>
                    {content.benefits.map((benefit, index) => (
                      <li
                        key={benefit}
                        className="reveal flex gap-3 border-b border-dashed border-white/20 py-2 text-[14.5px] leading-snug text-white last:border-0"
                        style={{ '--reveal-delay': `${index * 90}ms` } as React.CSSProperties}
                      >
                        <span className="mt-0.5 text-[18px] font-bold leading-none text-[#F0735A]">✱</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <figure className="mt-4 rounded-[14px] border-2 border-[#F0735A] bg-white/10 p-4 backdrop-blur-[2px]">
                    <Stars size={18} />
                    <blockquote className="mt-2 text-[14.5px] leading-relaxed text-white">{content.quote}</blockquote>
                  </figure>
                </div>
              </div>
            </section>

            <TornBand label={ctaLabel} className="-mx-3 md:mx-0" />

            {/* Sastojci */}
            {!compact && (
            <section className="reveal text-center">
              <h2 className="text-[30px] font-extrabold leading-tight text-[#2E8655] md:text-[36px]">{t.rich('ingredients_title', richTags)}</h2>
              <div className="mt-4 flex items-center justify-center gap-3 md:mt-6 md:gap-6">
                {['Ehinacea.png', 'Rusa.png', 'Rusa-1.png'].map((src, index) => (
                  <div
                    key={src}
                    className={cn(
                      'relative overflow-hidden rounded-full border-[3px] border-[#F0735A] bg-white shadow-[0_8px_20px_-10px_rgba(0,0,0,0.35)] transition hover:scale-105',
                      index === 1 ? 'h-24 w-24 md:h-32 md:w-32' : 'h-20 w-20 md:h-28 md:w-28'
                    )}
                  >
                    <Image
                      src={`/images/lander/${src}`}
                      alt=""
                      fill
                      sizes="128px"
                      className={cn('scale-110 object-cover motion-safe:animate-[spin_50s_linear_infinite]', index === 1 && 'motion-safe:[animation-direction:reverse]')}
                    />
                  </div>
                ))}
              </div>
              <div className={cn('relative mt-5 overflow-hidden rounded-[18px] p-2.5 md:p-5', FOREST_BG)}>
                <div className="relative rounded-[12px] bg-white/95 p-4 text-left md:p-6">
                  <p className="text-[16px] leading-relaxed">
                    <Bold text={content.ingredientsIntro} />
                  </p>
                  {content.ingredientsLead && <p className="mt-4 text-[15px] font-semibold">{content.ingredientsLead}</p>}
                  <ul className="mt-3 space-y-2">
                    {content.ingredients.map(([name, text]) => (
                      <li key={`${name}-${text}`} className="flex gap-2.5 text-[15px] leading-snug">
                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2BB673] text-white">
                          <Check className="h-3 w-3" strokeWidth={3.5} />
                        </span>
                        <span>
                          {name && <strong className="font-bold">{name}</strong>}
                          {name ? ` – ${text}` : text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            )}

            {/* Garancija */}
            <section className="reveal flex flex-col items-center gap-4 px-2 text-center">
              <div className="relative h-28 w-28 shrink-0">
                <span className="absolute inset-0 rounded-full border-[3px] border-dashed border-[#2E8655]/70 motion-safe:animate-[spin_24s_linear_infinite]" aria-hidden />
                <span className="absolute inset-[9px] flex flex-col items-center justify-center rounded-full bg-[#F0735A] text-white shadow-[0_10px_22px_-10px_rgba(240,115,90,0.9)]">
                  <span className="text-[26px] font-extrabold leading-none">100%</span>
                  <span className="mt-1 text-[9.5px] font-bold uppercase tracking-[0.12em]">{t('seal_label')}</span>
                </span>
              </div>
              <h2 className="text-[28px] font-extrabold leading-snug md:text-[34px]">{t.rich('guarantee_title', richTags)}</h2>
              <p className="text-[15.5px] leading-relaxed">{t.rich('guarantee_text', { ...richTags, unit: content.unit })}</p>
            </section>
          </div>

          {/* ── DESNA KOLONA: PORUDŽBINA ───────────────────────────── */}
          <aside className="lg:sticky lg:top-20">
            <div className="reveal rounded-[22px] bg-white p-4 shadow-[0_14px_40px_rgba(0,0,0,0.12)] md:p-6">
              {registration && (
                <div className="rounded-[16px] border-[3px] border-dashed border-[#2E8655]/50 p-4 shadow-[0_6px_16px_rgba(0,0,0,0.08)]">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-14 shrink-0">
                      <Image
                        src={registration.kind === 'ministry' ? '/images/regulatory/serbian-coat-of-arms.png' : '/images/lander/european-union.png'}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold uppercase leading-snug text-[#2E8655]">
                        {registration.kind === 'ministry' ? t('ministry_title') : registration.title}
                      </p>
                      {registration.kind === 'ministry' ? (
                        <p className="mt-1 text-[11.5px] text-[#666]">{t('ministry_number')}</p>
                      ) : (
                        registration.text && <p className="mt-1 text-[11.5px] leading-snug text-[#666]">{registration.text}</p>
                      )}
                      <p className="mt-2 inline-flex rounded-full bg-[#2E8655] px-4 py-1.5 text-[14px] font-bold text-white">{registration.number}</p>
                      <p className="mt-1.5 text-[11.5px] italic text-[#777]">
                        {registration.kind === 'ministry' ? t('date_label') : t('lab_date_label')} {registration.date}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <ul className="mt-5 space-y-3">
                {content.checks.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[17px] leading-snug">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-[#2E8655]" strokeWidth={1.8} />
                    {item}
                  </li>
                ))}
              </ul>

              <OfferBox
                product={product}
                packshot={packshot}
                price={price}
                regular={variant.price}
                savings={savings}
                percent={percent}
                quantity={Math.max(1, variant.quantity ?? 1)}
                usage={variant.size}
                bundleParts={bundleParts}
                countryConfig={countryConfig}
                locale={locale}
              />

              <div className="mt-5 text-center">
                <p className="text-[32px] font-extrabold leading-none underline decoration-[#2E8655] decoration-[3px] underline-offset-[6px] md:text-[38px]">
                  {t('price_label')}
                </p>
                <p className="mt-3 inline-block bg-[#2E8655] px-3 py-1 text-[44px] font-extrabold leading-none text-white [text-shadow:2px_2px_0_#14402a] md:text-[50px]">
                  {formatMoney(price, countryConfig)}
                </p>
                {savings > 0 && (
                  <p className="mt-2 text-[14px] text-[#555]">
                    {t('regular_price')} <span className="line-through">{formatMoney(variant.price, countryConfig)}</span>
                    <span className="ml-2 font-bold text-[#F0735A]">−{formatMoney(savings, countryConfig)}</span>
                  </p>
                )}
              </div>

              {/* Isporuka i plaćanje */}
              <div className="mt-5 grid grid-cols-2 gap-2 text-[13px] leading-snug">
                <div className="flex flex-col items-center gap-1.5 rounded-[14px] border border-[#2E8655]/20 bg-[#F4F8F5] px-2 py-3 text-center">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#2E8655] text-white">
                    <Truck className="h-[18px] w-[18px]" />
                  </span>
                  <span>
                    {deliveryRange
                      ? t.rich('delivery_tile', { b: (chunks) => <strong className="block font-bold text-[#111]">{chunks}</strong>, range: deliveryRange })
                      : t('check_delivery')}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5 rounded-[14px] border border-[#2E8655]/20 bg-[#F4F8F5] px-2 py-3 text-center">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#2E8655] text-white">
                    <Banknote className="h-[18px] w-[18px]" />
                  </span>
                  <span>
                    <strong className="block font-bold text-[#111]">{t('check_cod')}</strong>
                    {t('cod_sub')}
                  </span>
                </div>
              </div>

              <QuickOrderForm countryConfig={countryConfig} lines={lines} channel={channel} campaign={campaign} title={formTitle} appearance="classic" className="mt-5" />
            </div>
          </aside>
        </div>

        {/* ── RECENZIJE ─────────────────────────────────────────── */}
        <section id="utisci" className="reveal mt-10 scroll-mt-20 text-center md:mt-20">
          <h2 className="text-[30px] font-extrabold leading-tight md:text-[38px]">{t.rich('reviews_title', richTags)}</h2>
          <div className="mt-3 flex flex-col items-center gap-3">
            <Stars size={26} />
            <Image src="/images/lander/thumb.webp" alt="" width={128} height={44} className="h-11 w-auto" />
          </div>

          <TestimonialCarousel items={content.testimonials} yearsLabel={t('years')} />

          {shots.length > 0 && (
            <div className="mt-8">
              <p className="text-[18px] font-bold">{t('shots_title')}</p>
              <div className="-mx-3 mt-4 flex snap-x gap-3 overflow-x-auto px-3 pb-2 text-left [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
                {shots.map(([src, width, height]) => (
                  <div key={src} className="w-[240px] shrink-0 snap-start self-start overflow-hidden rounded-[12px] border border-[#ddd] bg-white">
                    <Image src={src} alt="Komentar kupca" width={width} height={height} sizes="240px" className="h-auto max-h-[380px] w-full object-cover object-top" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="mt-8 text-[24px] font-extrabold leading-tight md:text-[30px]">{t.rich('reviews_more', { ...richTags, count: reviewsCount })}</p>
          <p className="mx-auto mt-3 max-w-xl text-[21px] font-bold leading-snug md:text-[24px]">{t.rich('reviews_sub', richTags)}</p>
        </section>

        {!compact && (
          <>
        {/* ── KAKO PORUČITI ─────────────────────────────────────── */}
        <section className="reveal mt-10 text-center">
          <h2 className="text-[26px] font-extrabold md:text-[32px]">{t.rich('how_title', richTags)}</h2>
          <ol className="mt-5 grid grid-cols-3 gap-2 md:gap-5">
            {[
              { icon: MousePointerClick, title: tStore('how.step2_title') },
              { icon: ClipboardCheck, title: tStore('form.reassure_cod') },
              { icon: Package, title: tStore('how.step3_title', { time: courier.deliveryTime }) },
            ].map(({ icon: Icon, title }, index) => (
              <li
                key={title}
                className="reveal relative rounded-[16px] bg-white px-2 pb-4 pt-6 shadow-[0_6px_18px_rgba(0,0,0,0.06)] md:px-5"
                style={{ '--reveal-delay': `${index * 120}ms` } as React.CSSProperties}
              >
                <span className="absolute -top-3 left-1/2 inline-flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-[#F0735A] text-[13px] font-bold text-white">
                  {index + 1}
                </span>
                <Icon className="mx-auto h-7 w-7 text-[#2E8655]" />
                <p className="mt-2 text-[12.5px] font-semibold leading-snug md:text-[15px]">{title}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── ČETIRI RAZLOGA ─────────────────────────────────────── */}
        <section className="mt-8 grid gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
          {[
            { icon: Truck, title: t('card_delivery_title'), text: t('card_delivery_text') },
            { icon: Leaf, title: t('card_natural'), text: content.cards.natural },
            { icon: HandHeart, title: t('card_safe'), text: content.cards.safe },
            { icon: CheckCircle2, title: t('card_tested'), text: content.cards.tested },
          ].map(({ icon: Icon, title, text }, index) => (
            <div
              key={title}
              className="reveal group rounded-[18px] border-2 border-[#F0735A] bg-white p-5 text-center transition hover:-translate-y-1 hover:shadow-[0_14px_30px_-14px_rgba(240,115,90,0.6)]"
              style={{ '--reveal-delay': `${index * 90}ms` } as React.CSSProperties}
            >
              <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#2E8655] text-white transition group-hover:scale-110">
                <Icon className="h-7 w-7" />
              </span>
              <p className="mt-4 text-[20px] font-bold">{title}</p>
              <p className="mt-2 text-[14.5px] leading-relaxed text-[#333]">{text}</p>
            </div>
          ))}
        </section>

        {/* ── ČESTA PITANJA ─────────────────────────────────────── */}
        {product.productFAQ && product.productFAQ.length > 0 && (
          <section className="reveal mx-auto mt-10 max-w-3xl">
            <h2 className="text-center text-[26px] font-extrabold md:text-[32px]">{t.rich('faq_title', richTags)}</h2>
            <div className="mt-5 space-y-2">
              {product.productFAQ.slice(0, 5).map((item) => (
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
          </>
        )}
      </main>

      <TornBand label={ctaLabel} className="mt-8" />

      <LanderFooter countryConfig={countryConfig} locale={locale} />

      {/* ── DONJA TRAKA (telefon) ─────────────────────────────── */}
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-[140] border-t border-black/5 bg-white/95 px-3 py-2.5 shadow-[0_-10px_30px_-12px_rgba(0,0,0,0.25)] backdrop-blur transition-transform duration-300 lg:hidden',
          showSticky ? 'translate-y-0' : 'translate-y-full'
        )}
        style={{ paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom))' }}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            {savings > 0 && <p className="text-[12px] text-[#888] line-through">{formatMoney(variant.price, countryConfig)}</p>}
            <p className="text-[21px] font-extrabold leading-none text-[#2E8655]">{formatMoney(price, countryConfig)}</p>
          </div>
          <button
            type="button"
            onClick={() => scrollToOrderForm()}
            className="lander-shine ml-auto inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#2E8655] px-4 text-[16px] font-bold text-white shadow-[0_4px_0_#1d5434]"
          >
            {t('sticky_cta')}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

    </div>
  );
}

/** Okvir akcije: šta tačno kupac dobija, po kojoj ceni po komadu i koliko štedi. */
function OfferBox({
  product,
  packshot,
  price,
  regular,
  savings,
  percent,
  quantity,
  usage,
  bundleParts,
  countryConfig,
  locale,
}: {
  product: Product;
  packshot: string;
  price: number;
  regular: number;
  savings: number;
  percent: number;
  quantity: number;
  usage?: string;
  bundleParts: BundlePart[];
  countryConfig: CountryConfig;
  locale: string;
}) {
  const t = useTranslations('store.lander');
  const offer = getStoreOffers(locale).find((item) => item.productId === product.id);
  const bottles = product.category === 'supplements';
  const forms = bottles ? t('bottle_forms') : t('pack_forms');
  const b = { b: (chunks: React.ReactNode) => <strong className="font-bold text-[#111]">{chunks}</strong> };
  const gratis = bundleParts.find((part) => part.gratis);
  const isSet = bundleParts.length > 1;
  const freeShipping = price >= countryConfig.business.freeShippingThreshold;

  const points: React.ReactNode[] = [];
  if (isSet) {
    points.push(t.rich('offer_set', { ...b, count: bundleParts.length }));
    if (gratis) points.push(t.rich('offer_gratis', { ...b, name: gratis.product.name }));
    if (savings > 0) points.push(t.rich('offer_set_value', { ...b, regular: formatMoney(regular, countryConfig), price: formatMoney(price, countryConfig) }));
  } else if (quantity > 1) {
    points.push(t.rich('offer_qty', { ...b, qty: quantity, unit: plural(quantity, forms) }));
    points.push(
      t.rich('offer_per_piece', {
        ...b,
        price: formatMoney(Math.round(price / quantity), countryConfig),
        per: bottles ? t('per_bottle') : t('per_pack'),
        regular: formatMoney(Math.round(regular / quantity), countryConfig),
      })
    );
  } else {
    points.push(t.rich('offer_single', { ...b, name: product.name }));
  }
  if (usage) points.push(usage);
  if (savings > 0) points.push(t.rich('offer_save', { ...b, amount: formatMoney(savings, countryConfig), percent }));
  if (freeShipping) points.push(t.rich('offer_free_shipping', b));

  return (
    <div className="relative mt-6 overflow-hidden rounded-[18px] border-2 border-[#F0735A] bg-[#FFF6F3]">
      <div className="flex items-center justify-between gap-2 bg-[#F0735A] px-4 py-2 text-white">
        <span className="inline-flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-wide">
          <Gift className="h-4 w-4" />
          {offer?.badge ?? t('offer_default_badge')}
        </span>
        {percent > 0 && <span className="rounded-full bg-white px-2.5 py-0.5 text-[12.5px] font-extrabold text-[#F0735A]">−{percent}%</span>}
      </div>
      <div className="p-4">
        <p className="text-[17px] font-bold">{t('offer_title')}</p>

        {/* Vizuelno: komponente seta ili broj komada */}
        <div className="mt-3 flex items-center justify-center gap-2 rounded-[14px] bg-white p-2">
          {isSet ? (
            bundleParts.map((part, index) => (
              <div key={part.product.id} className="flex items-center gap-2">
                {index > 0 && (
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2E8655] text-white">
                    <Plus className="h-4 w-4" strokeWidth={3} />
                  </span>
                )}
                <div className="relative h-24 w-28">
                  <Image src={getStoreVisual(part.product).packshot} alt={part.product.name} fill sizes="112px" className="object-cover object-[50%_75%]" />
                  {part.gratis && (
                    <span className="absolute -top-1 right-0 rounded-full bg-[#F0735A] px-2 py-0.5 text-[10px] font-bold uppercase text-white">Gratis</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="relative h-28 w-full max-w-[240px]">
              <Image src={packshot} alt={product.name} fill sizes="240px" className="object-cover object-[50%_75%]" />
              {quantity > 1 && (
                <span className="absolute right-0 top-0 rounded-full bg-[#2E8655] px-3 py-1 text-[16px] font-extrabold text-white">× {quantity}</span>
              )}
            </div>
          )}
        </div>

        <ul className="mt-3 space-y-2">
          {points.map((point, index) => (
            <li key={index} className="flex gap-2.5 text-[14.5px] leading-snug text-[#333]">
              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2BB673] text-white">
                <Check className="h-3 w-3" strokeWidth={3.5} />
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Svedočanstva: na telefonu prevlačenje + automatsko listanje i tačkice, na desktopu dve kolone. */
export function TestimonialCarousel({ items, yearsLabel }: { items: LanderContent['testimonials']; yearsLabel: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length < 2 || window.matchMedia('(min-width: 768px)').matches) return;
    const id = window.setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const next = (active + 1) % items.length;
      const child = track.children[next] as HTMLElement | undefined;
      if (child) track.scrollTo({ left: child.offsetLeft - track.offsetLeft - 12, behavior: 'smooth' });
    }, 5000);
    return () => window.clearInterval(id);
  }, [active, paused, items.length]);

  return (
    <>
      <div
        ref={trackRef}
        onTouchStart={() => setPaused(true)}
        onScroll={(event) => {
          const track = event.currentTarget;
          const width = (track.children[0] as HTMLElement | undefined)?.offsetWidth ?? track.clientWidth;
          setActive(Math.min(items.length - 1, Math.round(track.scrollLeft / (width + 16))));
        }}
        className="-mx-3 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-3 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => (
          <figure key={`${item.name}-${index}`} className="w-[85%] shrink-0 snap-center md:w-auto">
            <blockquote className="relative rounded-[12px] border-2 border-[#F0735A] bg-white px-5 py-5 text-[14.5px] leading-relaxed shadow-[0_6px_18px_rgba(0,0,0,0.06)] md:px-7">
              <Stars size={15} />
              <span className="mt-2 block">{item.text}</span>
              <span className="absolute -bottom-[11px] left-1/2 h-5 w-5 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-[#F0735A] bg-white" aria-hidden />
            </blockquote>
            <figcaption className="mt-6 flex items-center justify-center gap-3">
              {item.photo ? (
                <span className="relative h-14 w-14 overflow-hidden rounded-full border-[3px] border-[#2E8655]">
                  <Image src={item.photo} alt={item.name} fill sizes="56px" className="object-cover" />
                </span>
              ) : (
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#2E8655] text-[20px] font-bold text-white">{item.name.charAt(0)}</span>
              )}
              <span className="text-left">
                <span className="block text-[15px] font-bold">{item.name}</span>
                {item.age && (
                  <span className="block text-[13px] text-[#666]">
                    {item.age} {yearsLabel}
                  </span>
                )}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      {items.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5 md:hidden">
          {items.map((item, index) => (
            <span key={`${item.name}-dot-${index}`} className={cn('h-2 rounded-full transition-all', index === active ? 'w-6 bg-[#2E8655]' : 'w-2 bg-[#2E8655]/25')} />
          ))}
        </div>
      )}
    </>
  );
}
