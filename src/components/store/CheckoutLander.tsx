'use client';

import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
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

import { getProductVariantsForCountry, type Product, type ProductVariant } from '@/config/products';
import { getDefaultCourier, type CountryConfig } from '@/config/countries';
import type { LanderContent } from '@/config/lander-content';
import { getStoreOffers, getStoreVisual, getUnitPackshot, tightPackshot } from '@/config/store-content';
import { calculateShippingCost } from '@/utils/shipping';
import { cn } from '@/lib/utils';
import { landerFontClass } from './fonts';
import {
  Bold,
  CountUp,
  FOREST_BG,
  LANDER_BG,
  LanderFooter,
  Marked,
  ReviewShots,
  Stars,
  TestimonialCarousel,
  TornBand,
  plural,
  richTags,
  useDeliveryRange,
  useReveal,
} from './LanderKit';
import { QuickOrderForm, type QuickOrderLine } from './QuickOrderForm';
import { formatMoney, scrollToOrderForm, variantDiscountPercent, variantPrice, variantSavings } from './format';

/** Jedan proizvod iz sastava seta (gratis = poklon u setu). */
export interface BundlePart {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  gratis: boolean;
}

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
  /** Nalepnica uz proizvod (npr. „Samo za Viber pratioce“) */
  kicker?: string;
  formTitle?: string;
  /** Stranica iz kataloga: zaglavlje sajta je iznad, bez trake hitnosti */
  storefront?: boolean;
  /** Druga radnja ispod forme (npr. „Dodaj u korpu“) */
  afterForm?: React.ReactNode;
}

export function CheckoutLander({
  product,
  content,
  countryConfig,
  locale,
  bundleParts = [],
  shots = [],
  reviewsCount = '850+',
  channel,
  campaign,
  compact = false,
  kicker,
  formTitle,
  storefront = false,
  afterForm,
}: CheckoutLanderProps) {
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
  const shipping = calculateShippingCost(price, courier, countryConfig);
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
    <div ref={rootRef} className={cn(landerFontClass, 'min-h-screen overflow-x-hidden', LANDER_BG)}>
      {/* ── TRAKA HITNOSTI (oglasni lander) — na telefonu se skroluje sa stranicom ── */}
      {!storefront && (
        <button
          type="button"
          onClick={() => scrollToOrderForm()}
          className="z-[150] flex w-full items-center justify-center gap-3 bg-green px-3 py-2.5 text-white shadow-[0_4px_14px_rgb(0_0_0/0.18)] md:sticky md:top-0 md:gap-5"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-coral-deep px-3 py-1.5 text-[0.75rem] font-semibold uppercase tracking-wide">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {t('urgency_pill')}
          </span>
          <span className="text-left leading-tight">
            <span className="block text-[0.9375rem] font-semibold md:text-[1rem]">{t('urgency_title')}</span>
            <span className="block text-[0.75rem]">{t('urgency_sub')}</span>
          </span>
          <ArrowRight className="h-5 w-5 rotate-90" aria-hidden />
        </button>
      )}

      <main className="mx-auto max-w-[1180px] px-3 pt-3 md:px-6 md:pt-6">
        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden rounded-[1.75rem] bg-mint">
          {/* Šara iza naslova: next/image (manja slika za telefon, učitava se odmah — LCP) */}
          <Image src="/images/lander/bg2-h17.jpg" alt="" fill priority sizes="(max-width: 768px) 100vw, 1180px" className="object-cover object-center" />
          <div className="relative grid items-center px-3 pb-2 pt-6 md:grid-cols-2 md:px-14 md:py-12">
            <div className="text-center">
              <h1 className="text-balance text-[1.875rem] font-extrabold leading-[1.22] text-ink md:text-[2.625rem]">
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
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[0.875rem] font-medium text-ink">
                <Stars size={16} />
                <span>{t.rich('hero_rating', { b: (chunks) => <strong className="font-bold">{chunks}</strong>, count: reviewsCount })}</span>
              </div>
              <button
                type="button"
                onClick={() => scrollToOrderForm()}
                className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-[0.875rem] font-semibold uppercase tracking-wide text-forest shadow-float transition hover:scale-[1.03]"
              >
                {t('sticky_cta')}
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green text-white">
                  <ArrowRight className="h-3 w-3" strokeWidth={3} aria-hidden />
                </span>
              </button>
            </div>
            <div className="relative mx-auto mt-1 aspect-[5/4] w-full max-w-[480px] md:mt-0 md:aspect-square">
              <Image
                src={packshot}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 92vw, 460px"
                className="object-cover object-[50%_72%] drop-shadow-[0_20px_24px_rgb(0_0_0/0.18)] md:object-contain"
              />
              {kicker && (
                <span className="absolute left-1 top-3 max-w-[60%] rounded-full bg-viber px-3.5 py-1.5 text-[0.75rem] font-bold uppercase leading-tight tracking-wide text-white shadow-float md:left-4">
                  {kicker}
                </span>
              )}
              {percent > 0 && (
                <span className="lander-pop absolute right-1 top-2 flex h-[84px] w-[84px] rotate-[10deg] flex-col items-center justify-center rounded-full bg-coral-deep text-white shadow-float [animation-delay:600ms] md:right-6 md:top-10 md:h-24 md:w-24">
                  <span className="text-[0.75rem] font-semibold uppercase leading-none">{tStore('card.save')}</span>
                  <span className="text-[1.5rem] font-extrabold leading-tight md:text-[1.875rem]">−{percent}%</span>
                </span>
              )}
            </div>
          </div>
        </section>

        <div className="mt-4 grid gap-6 md:mt-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-8">
          {/* ── LEVA KOLONA ───────────────────────────────────────── */}
          <div className="min-w-0 space-y-6 md:space-y-8">
            {/* 30.000+ i prednosti */}
            <section className="reveal rounded-card bg-white p-3 shadow-card md:p-6">
              <p className="pt-2 text-center text-[3.625rem] font-extrabold leading-none tracking-tight md:text-[5.25rem]">
                <CountUp value={content.customers} /> <span className="text-green">+</span>
              </p>
              <p className="mt-2 text-balance text-center text-[1.125rem] font-semibold md:text-[1.25rem]">
                {t.rich('customers_line', { ...richTags, customers: content.customers })}
              </p>
              <p className="mt-2 text-center text-[0.9375rem]">{t.rich('story_line', richTags)}</p>

              <div className={cn('relative mt-4 overflow-hidden rounded-[1.125rem] p-4 md:p-6', FOREST_BG)}>
                <div className="absolute inset-0 bg-night/55" aria-hidden />
                <div className="relative">
                  {content.benefitsTitle && <p className="mb-2 text-[1.125rem] font-semibold text-white">{content.benefitsTitle}</p>}
                  <ul>
                    {content.benefits.map((benefit, index) => (
                      <li
                        key={benefit}
                        className="reveal flex gap-3 border-b border-dashed border-white/20 py-2.5 text-[0.9375rem] leading-snug text-white last:border-0"
                        style={{ '--reveal-delay': `${index * 90}ms` } as React.CSSProperties}
                      >
                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-coral text-white">
                          <Check className="h-3 w-3" strokeWidth={3.5} aria-hidden />
                        </span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <figure className="mt-4 border-t border-white/25 pt-4">
                    <Stars size={18} />
                    <blockquote className="mt-2 text-[0.9375rem] leading-relaxed text-white">{content.quote}</blockquote>
                  </figure>
                </div>
              </div>
            </section>

            <TornBand label={ctaLabel} className="-mx-3 md:mx-0" />

            {/* Sastojci */}
            {!compact && (
              <section className="reveal text-center">
                <h2 className="text-balance text-[1.875rem] font-extrabold leading-tight text-forest md:text-[2.25rem]">{t.rich('ingredients_title', richTags)}</h2>
                <div className="mt-4 flex items-center justify-center gap-3 md:mt-6 md:gap-6">
                  {['Ehinacea.png', 'Rusa.png', 'Rusa-1.png'].map((src, index) => (
                    <div
                      key={src}
                      className={cn(
                        'relative overflow-hidden rounded-full border-[3px] border-coral bg-white shadow-float',
                        index === 1 ? 'h-24 w-24 md:h-32 md:w-32' : 'h-20 w-20 md:h-28 md:w-28'
                      )}
                    >
                      <Image src={`/images/lander/${src}`} alt="" fill sizes="128px" className="scale-110 object-cover" />
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-card bg-white p-4 text-left shadow-card md:p-6">
                  <p className="text-[1rem] leading-relaxed">
                    <Bold text={content.ingredientsIntro} />
                  </p>
                  {content.ingredientsLead && <p className="mt-4 text-[0.9375rem] font-semibold">{content.ingredientsLead}</p>}
                  <ul className="mt-3 space-y-2">
                    {content.ingredients.map(([name, text]) => (
                      <li key={`${name}-${text}`} className="flex gap-2.5 text-[0.9375rem] leading-snug">
                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green text-white">
                          <Check className="h-3 w-3" strokeWidth={3.5} aria-hidden />
                        </span>
                        <span>
                          {name && <strong className="font-bold">{name}</strong>}
                          {name ? ` – ${text}` : text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Garancija */}
            <section className="reveal flex flex-col items-center gap-4 px-2 text-center">
              <div className="relative h-28 w-28 shrink-0">
                <span className="absolute inset-0 rounded-full border-[3px] border-dashed border-green/70" aria-hidden />
                <span className="absolute inset-[9px] flex flex-col items-center justify-center rounded-full bg-coral-deep text-white shadow-float">
                  <span className="text-[1.5rem] font-extrabold leading-none">100%</span>
                  <span className="mt-1 text-[0.75rem] font-bold uppercase tracking-[0.08em]">{t('seal_label')}</span>
                </span>
              </div>
              <h2 className="text-balance text-[1.875rem] font-extrabold leading-snug md:text-[2.25rem]">{t.rich('guarantee_title', richTags)}</h2>
              <p className="max-w-prose text-[1rem] leading-relaxed">{t.rich('guarantee_text', { ...richTags, unit: content.unit })}</p>
            </section>
          </div>

          {/* ── DESNA KOLONA: PORUDŽBINA ───────────────────────────── */}
          <aside className={cn('lg:sticky', storefront ? 'lg:top-28' : 'lg:top-20')}>
            <div className="reveal rounded-card bg-white p-4 shadow-raised md:p-6">
              {registration && (
                <div className="flex items-center gap-4 border-b border-line pb-4">
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
                    <p className="text-[0.8125rem] font-bold uppercase leading-snug text-forest">
                      {registration.kind === 'ministry' ? t('ministry_title') : registration.title}
                    </p>
                    {registration.kind === 'ministry' ? (
                      <p className="mt-1 text-[0.8125rem] text-ink-muted">{t('ministry_number')}</p>
                    ) : (
                      registration.text && <p className="mt-1 text-[0.8125rem] leading-snug text-ink-muted">{registration.text}</p>
                    )}
                    <p className="mt-2 inline-flex rounded-full bg-green px-4 py-1.5 text-[0.875rem] font-bold text-white">{registration.number}</p>
                    <p className="mt-1.5 text-[0.8125rem] text-ink-muted">
                      {registration.kind === 'ministry' ? t('date_label') : t('lab_date_label')} {registration.date}
                    </p>
                  </div>
                </div>
              )}

              <ul className="mt-5 space-y-3">
                {content.checks.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[1.125rem] leading-snug">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-green" strokeWidth={1.8} aria-hidden />
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

              <div className="mt-6 text-center">
                <p className="text-[1.875rem] font-extrabold leading-none underline decoration-green decoration-[3px] underline-offset-[6px] md:text-[2.25rem]">
                  {t('price_label')}
                </p>
                <p className="mt-3 inline-block bg-green px-3 py-1 text-[2.625rem] font-extrabold leading-none text-white md:text-[3.125rem]">
                  {formatMoney(price, countryConfig)}
                </p>
                {savings > 0 && (
                  <p className="mt-2 text-[0.875rem] text-ink-soft">
                    {t('regular_price')} <span className="line-through">{formatMoney(variant.price, countryConfig)}</span>
                    <span className="ml-2 font-bold text-coral-deep">−{formatMoney(savings, countryConfig)}</span>
                  </p>
                )}
                {/* Cena bez iznenađenja: dostava odmah uz cenu, pre forme */}
                <p className="mt-1 text-[0.875rem] font-semibold text-forest">
                  {shipping > 0
                    ? t('shipping_note', {
                        cost: formatMoney(shipping, countryConfig),
                        threshold: formatMoney(countryConfig.business.freeShippingThreshold, countryConfig),
                      })
                    : t('free_shipping_note')}
                </p>
              </div>

              {/* Isporuka i plaćanje */}
              <div className="mt-5 grid grid-cols-2 divide-x divide-line border-y border-line py-3 text-[0.8125rem] leading-snug">
                <div className="flex flex-col items-center gap-1.5 px-2 text-center">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-green text-white">
                    <Truck className="h-[18px] w-[18px]" aria-hidden />
                  </span>
                  <span>
                    {deliveryRange
                      ? t.rich('delivery_tile', { b: (chunks) => <strong className="block font-bold text-ink">{chunks}</strong>, range: deliveryRange })
                      : t('check_delivery')}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5 px-2 text-center">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-green text-white">
                    <Banknote className="h-[18px] w-[18px]" aria-hidden />
                  </span>
                  <span>
                    <strong className="block font-bold text-ink">{t('check_cod')}</strong>
                    {t('cod_sub')}
                  </span>
                </div>
              </div>

              <QuickOrderForm countryConfig={countryConfig} lines={lines} channel={channel} campaign={campaign} title={formTitle} className="mt-5" />
              {afterForm}
            </div>
          </aside>
        </div>

        {/* ── RECENZIJE ─────────────────────────────────────────── */}
        <section id="utisci" className="reveal mt-10 scroll-mt-20 text-center md:mt-20">
          <h2 className="text-balance text-[1.875rem] font-extrabold leading-tight md:text-[2.25rem]">{t.rich('reviews_title', richTags)}</h2>
          <div className="mt-3 flex justify-center">
            <Stars size={26} />
          </div>

          <TestimonialCarousel items={content.testimonials} yearsForms={t('years_forms')} label={t('carousel_label')} />

          <ReviewShots shots={shots} title={t('shots_title')} />

          <p className="mt-8 text-balance text-[1.5rem] font-extrabold leading-tight md:text-[1.875rem]">{t.rich('reviews_more', { ...richTags, count: reviewsCount })}</p>
          <p className="mx-auto mt-3 max-w-xl text-balance text-[1.25rem] font-bold leading-snug md:text-[1.5rem]">{t.rich('reviews_sub', richTags)}</p>
        </section>

        {!compact && (
          <>
            {/* ── KAKO PORUČITI ─────────────────────────────────────── */}
            <section className="reveal mt-10 text-center">
              <h2 className="text-[1.5rem] font-extrabold md:text-[1.875rem]">{t.rich('how_title', richTags)}</h2>
              <ol className="mx-auto mt-5 grid max-w-3xl gap-3 sm:grid-cols-3 md:gap-5">
                {[
                  { icon: MousePointerClick, title: tStore('how.step2_title') },
                  { icon: ClipboardCheck, title: tStore('form.reassure_cod') },
                  { icon: Package, title: tStore('how.step3_title', { time: courier.deliveryTime }) },
                ].map(({ icon: Icon, title }, index) => (
                  <li
                    key={title}
                    className="reveal flex items-center gap-4 rounded-panel bg-white px-4 py-4 text-left shadow-card sm:flex-col sm:gap-2 sm:pt-6 sm:text-center"
                    style={{ '--reveal-delay': `${index * 120}ms` } as React.CSSProperties}
                  >
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-coral-deep text-[0.9375rem] font-bold text-white">
                      {index + 1}
                    </span>
                    <Icon className="hidden h-7 w-7 text-green sm:block" aria-hidden />
                    <p className="text-[0.9375rem] font-semibold leading-snug">{title}</p>
                  </li>
                ))}
              </ol>
            </section>

            {/* ── ČETIRI RAZLOGA ─────────────────────────────────────── */}
            <section className="reveal mt-8 rounded-card bg-white p-2 shadow-card md:p-4">
              <ul className="grid divide-y divide-line sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
                {[
                  { icon: Truck, title: t('card_delivery_title'), text: t('card_delivery_text') },
                  { icon: Leaf, title: t('card_natural'), text: content.cards.natural },
                  { icon: HandHeart, title: t('card_safe'), text: content.cards.safe },
                  { icon: CheckCircle2, title: t('card_tested'), text: content.cards.tested },
                ].map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex gap-4 px-3 py-4 md:flex-col md:gap-3 md:px-4">
                    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green text-white">
                      <Icon className="h-6 w-6" aria-hidden />
                    </span>
                    <div>
                      <p className="text-[1.125rem] font-bold leading-snug">{title}</p>
                      <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink-soft">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* ── ČESTA PITANJA ─────────────────────────────────────── */}
            {product.productFAQ && product.productFAQ.length > 0 && (
              <section className="reveal mx-auto mt-10 max-w-3xl">
                <h2 className="text-center text-[1.5rem] font-extrabold md:text-[1.875rem]">{t.rich('faq_title', richTags)}</h2>
                <div className="mt-5 space-y-2">
                  {product.productFAQ.slice(0, 5).map((item) => (
                    <details key={item.question} className="group rounded-panel bg-white px-4 shadow-card">
                      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 py-3 text-[1rem] font-semibold [&::-webkit-details-marker]:hidden">
                        {item.question}
                        <ChevronDown className="h-5 w-5 shrink-0 text-green transition group-open:rotate-180" aria-hidden />
                      </summary>
                      <p className="pb-4 text-[0.9375rem] leading-relaxed text-ink-soft">{item.answer}</p>
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
          'fixed inset-x-0 bottom-0 z-[140] border-t border-black/5 bg-white/95 px-3 py-2.5 shadow-[0_-10px_30px_-12px_rgb(0_0_0/0.25)] backdrop-blur transition-transform duration-300 lg:hidden',
          showSticky ? 'translate-y-0' : 'translate-y-full'
        )}
        style={{ paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom))' }}
        aria-hidden={!showSticky}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            {savings > 0 && <p className="text-[0.8125rem] text-ink-muted line-through">{formatMoney(variant.price, countryConfig)}</p>}
            <p className="text-[1.25rem] font-extrabold leading-none text-forest">{formatMoney(price, countryConfig)}</p>
          </div>
          <button
            type="button"
            onClick={() => scrollToOrderForm()}
            tabIndex={showSticky ? 0 : -1}
            className="ml-auto inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-green px-4 text-[1rem] font-bold text-white shadow-press"
          >
            {t('sticky_cta')}
            <ArrowRight className="h-4 w-4" aria-hidden />
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
  const b = { b: (chunks: React.ReactNode) => <strong className="font-bold text-ink">{chunks}</strong> };
  const gratis = bundleParts.find((part) => part.gratis);
  const isSet = bundleParts.length > 1;
  const freeShipping = price >= countryConfig.business.freeShippingThreshold;

  const points: React.ReactNode[] = [];
  if (isSet) {
    points.push(t.rich('offer_set', { ...b, count: bundleParts.length }));
    if (gratis) {
      const units = gratis.quantity * Math.max(1, gratis.variant?.quantity ?? 1);
      const gratisForms = gratis.product.category === 'supplements' ? t('bottle_forms') : t('pack_forms');
      points.push(t.rich('offer_gratis', { ...b, qty: units, unit: plural(units, gratisForms), name: gratis.product.name }));
    }
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
    <div className="relative mt-6 overflow-hidden rounded-[1.125rem] border-2 border-coral bg-coral-soft">
      <div className="flex items-center justify-between gap-2 bg-coral-deep px-4 py-2 text-white">
        <span className="inline-flex items-center gap-1.5 text-[0.8125rem] font-bold uppercase tracking-wide">
          <Gift className="h-4 w-4" aria-hidden />
          {offer?.badge ?? t('offer_default_badge')}
        </span>
        {percent > 0 && <span className="rounded-full bg-white px-2.5 py-0.5 text-[0.8125rem] font-extrabold text-coral-deep">−{percent}%</span>}
      </div>
      <div className="p-4">
        <p className="text-[1.125rem] font-bold">{t('offer_title')}</p>

        {/* Vizuelno: tačno ono što kupac dobija (komponente seta po komadu ili broj komada) */}
        <div className="mt-3">
          {isSet ? (
            <div className="flex items-start justify-center gap-1.5">
              {bundleParts.map((part, index) => {
                const units = part.quantity * Math.max(1, part.variant?.quantity ?? 1);
                const partForms = part.product.category === 'supplements' ? t('bottle_forms') : t('pack_forms');
                return (
                  <Fragment key={part.product.id}>
                    {index > 0 && (
                      <span className="mt-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green text-white">
                        <Plus className="h-4 w-4" strokeWidth={3} aria-hidden />
                      </span>
                    )}
                    <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                      <div className="relative h-28 w-full max-w-[150px]">
                        <Image
                          src={tightPackshot(getUnitPackshot(part.product))}
                          alt={part.product.name}
                          fill
                          sizes="150px"
                          className="object-contain object-bottom drop-shadow-[0_8px_10px_rgb(0_0_0/0.14)]"
                        />
                      </div>
                      <p className="mt-2 text-[0.75rem] font-extrabold uppercase leading-tight">{part.product.name}</p>
                      <p
                        className={cn(
                          'mt-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[0.75rem] font-bold',
                          part.gratis ? 'bg-coral-deep text-white' : 'bg-green/10 text-forest'
                        )}
                      >
                        {units} {plural(units, partForms)}
                        {part.gratis ? ' · GRATIS' : ''}
                      </p>
                    </div>
                  </Fragment>
                );
              })}
            </div>
          ) : (
            <div className="relative mx-auto h-32 w-full max-w-[260px]">
              <Image src={tightPackshot(packshot)} alt={product.name} fill sizes="260px" className="object-contain object-bottom drop-shadow-[0_8px_10px_rgb(0_0_0/0.14)]" />
              {quantity > 1 && (
                <span className="absolute right-0 top-0 rounded-full bg-green px-3 py-1 text-[1rem] font-extrabold text-white">× {quantity}</span>
              )}
            </div>
          )}
        </div>

        <ul className="mt-3 space-y-2">
          {points.map((point, index) => (
            <li key={index} className="flex gap-2.5 text-[0.9375rem] leading-snug text-ink-soft">
              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green text-white">
                <Check className="h-3 w-3" strokeWidth={3.5} aria-hidden />
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
