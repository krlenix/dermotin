'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowDown, Check, ChevronRight, ShoppingBag } from 'lucide-react';

import {
  INGREDIENTS,
  getProductsForCountry,
  getProductsForLocale,
  getProductVariantsForCountry,
  type Product,
  type ProductVariant,
} from '@/config/products';
import type { CountryConfig } from '@/config/countries';
import { getProductFacts, getSalesCopy, getStoreVisual } from '@/config/store-content';
import { getProductProof } from '@/config/store-proof';
import { getLanderContent } from '@/config/lander-content';
import { CheckoutLander } from './CheckoutLander';
import { useCart } from '@/contexts/CartContext';
import { useBogoPair } from '@/components/shop/BogoPairModal';
import { ShopHeader } from '@/components/shop/ShopHeader';
import { CookieConsent } from '@/components/features/CookieConsent';
import { ReviewsSection } from '@/components/product-page/ReviewsSection';
import { PixelTracker, usePixelTracking } from '@/components/tracking/PixelTracker';
import { useMarketingTracking } from '@/hooks/useMarketingTracking';
import { cn } from '@/lib/utils';
import { storeFontClass } from './fonts';
import { QuickOrderForm, type QuickOrderLine } from './QuickOrderForm';
import { ProductGallery } from './ProductGallery';
import { ProductCard, ProductStage } from './ProductCard';
import { BundleContents, type BundlePart } from './BundleContents';
import { DashTitle, FactRow, Rich } from './Rich';
import { CtaBand, GuaranteeProof, PriceBox, ProofSummary, ReviewsShowcase, UrgencyStrip } from './ProofSections';
import {
  Eyebrow,
  FaqList,
  GuaranteeBand,
  HowToOrder,
  SectionHeading,
  StoreFaq,
  StoreFooter,
  btnCoral,
  useTrustItems,
} from './StoreSections';
import { formatMoney, scrollToOrderForm, variantDiscountPercent, variantPrice, variantSavings } from './format';

interface ProductLandingProps {
  product: Product;
  countryConfig: CountryConfig;
  locale: string;
  /** Viber kampanja: bez pixela, bez korpe, kraći tekst */
  channel?: 'viber';
  campaign?: string;
}

type BundleComponent = BundlePart;

export function ProductLanding({ product, countryConfig, locale, channel, campaign }: ProductLandingProps) {
  const t = useTranslations('store');
  const isViber = channel === 'viber';

  const variants = useMemo(() => getProductVariantsForCountry(product, locale), [product, locale]);
  const defaultVariant = variants.find((v) => v.isDefault) || variants[0];
  const [selected, setSelected] = useState<ProductVariant>(defaultVariant);
  const [components, setComponents] = useState<BundleComponent[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [showSticky, setShowSticky] = useState(false);
  const trustItems = useTrustItems(countryConfig);

  const bestValueId = useMemo(() => {
    // "Najisplativije" = najniža cena po komadu (samo kada postoji više pakovanja)
    if (variants.length < 2) return null;
    return [...variants].sort((a, b) => variantPrice(a) / Math.max(1, a.quantity ?? 1) - variantPrice(b) / Math.max(1, b.quantity ?? 1))[0]?.id ?? null;
  }, [variants]);
  const salesCopy = getSalesCopy(product.id, locale);
  const visual = getStoreVisual(product);
  const price = variantPrice(selected);
  const savings = variantSavings(selected);
  const percent = variantDiscountPercent(selected);
  const freeShipping = price >= countryConfig.business.freeShippingThreshold;
  const gratisComponent = components.find((component) => component.gratis);

  const orderLines: QuickOrderLine[] = useMemo(
    () => [
      {
        productId: product.id,
        variantId: selected.id,
        sku: selected.sku,
        productName: product.name,
        variantName: selected.name,
        image: product.images.main,
        unitPrice: price,
        regularPrice: selected.price,
        quantity: 1,
      },
    ],
    [product, selected, price]
  );

  // Bundle komponente (uključujući proizvode koji se ne prodaju pojedinačno) + preporuke
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const all = await getProductsForLocale(locale);
      if (cancelled) return;
      if (product.isBundle && product.bundleItems?.length) {
        setComponents(
          product.bundleItems
            .map((item): BundleComponent | null => {
              const component = all[item.productId];
              if (!component) return null;
              const componentVariants = getProductVariantsForCountry(component, locale);
              const variant = componentVariants.find((v) => v.id === item.variantId) || componentVariants.find((v) => v.isDefault) || componentVariants[0];
              return { product: component, variant, quantity: item.quantity, gratis: item.gratis === true };
            })
            .filter((item): item is BundleComponent => item !== null)
        );
      }
      if (!isViber) {
        const listed = await getProductsForCountry(locale, locale);
        if (cancelled) return;
        const byId = new Map(listed.map((item) => [item.id, item]));
        const preferred = (product.crossSells ?? []).map((id) => byId.get(id)).filter((item): item is Product => Boolean(item));
        const rest = listed.filter((item) => item.id !== product.id && !preferred.includes(item));
        setRelated([...preferred, ...rest].filter((item) => item.id !== product.id).slice(0, 4));
      }
    })().catch((error) => console.error('Failed to load related products', error));
    return () => {
      cancelled = true;
    };
  }, [locale, product, isViber]);

  // Sticky CTA na mobilnom: vidljiv kada forma nije na ekranu
  useEffect(() => {
    const form = document.getElementById('naruci');
    if (!form) return;
    let formVisible = false;
    const observer = new IntersectionObserver(([entry]) => {
      formVisible = entry.isIntersecting;
      setShowSticky(!formVisible && window.scrollY > 500);
    });
    observer.observe(form);
    const onScroll = () => setShowSticky(!formVisible && window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const ingredientHighlights = useMemo(
    () =>
      product.ingredients
        .map((id) => INGREDIENTS[id])
        .filter((ingredient) => ingredient && ingredient.category === 'herbal_extract')
        .slice(0, 6)
        .map((ingredient) => ({
          ...ingredient,
          description: product.ingredientDescriptions?.[ingredient.id] || ingredient.description,
        })),
    [product]
  );

  const facts = getProductFacts(product.id);
  const proof = getProductProof(product.id);
  const lander = isViber ? null : getLanderContent(product.id);

  // Prodajna stranica preslikana sa starog sajta (dermotin.rs/checkouts) — vlasnik je
  // tražio identičnu stranicu jer je najbolje konvertovala.
  if (lander) {
    return (
      <>
        <PixelTracker countryCode={countryConfig.code} />
        <StorefrontTracking product={product} variant={defaultVariant} countryConfig={countryConfig} />
        <CheckoutLander
          product={product}
          content={lander}
          countryConfig={countryConfig}
          locale={locale}
          bundleParts={components}
          shots={proof?.shots}
          reviewsCount={proof?.reviewsCount}
        />
        <CookieConsent isEU={countryConfig.isEU} />
      </>
    );
  }
  // Druga slika za prodajnu priču (ako postoji), inače glavni packshot
  const storyImage = visual.gallery.find((src, index) => index > 0 && src.startsWith('/images/store/')) ?? visual.packshot;

  return (
    <div className={cn(storeFontClass, 'min-h-screen overflow-x-hidden bg-paper')}>
      {!isViber && <PixelTracker countryCode={countryConfig.code} />}
      {!isViber && <StorefrontTracking product={product} variant={defaultVariant} countryConfig={countryConfig} />}

      <ShopHeader minimal={isViber} />

      <main className="pb-24 lg:pb-0">
        <UrgencyStrip savings={savings} countryConfig={countryConfig} />

        {/* ── HERO + BUY BOX ───────────────────────────────────── */}
        <section className="container mx-auto px-4 pt-4 md:pt-8">
          {!isViber && (
            <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-[13px] text-ink/50" aria-label="Breadcrumb">
              <Link href={`/${locale}`} className="transition hover:text-ink">{t('nav.home')}</Link>
              <ChevronRight className="h-3.5 w-3.5 text-ink/25" />
              <Link href={`/${locale}/products`} className="transition hover:text-ink">{t('nav.all_products')}</Link>
              <ChevronRight className="h-3.5 w-3.5 text-ink/25" />
              <span className="text-ink/80">{product.name}</span>
            </nav>
          )}

          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16 xl:gap-24">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <ProductGallery
                images={visual.gallery}
                alt={product.name}
                badge={percent > 0 ? <span className="rounded-full bg-coral px-3 py-1.5 text-[13px] font-semibold text-white">−{percent}%</span> : null}
              />
            </div>

            <div className="lg:pt-2">
              <div className="flex flex-wrap items-center gap-2">
                {isViber && (
                  <span className="rounded-full bg-[#7360F2] px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white">{t('viber.badge')}</span>
                )}
                {product.isBundle && (
                  <span className="rounded-full border border-moss/30 px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-moss">
                    {gratisComponent ? t('pdp.gratis_offer') : t('pdp.set_offer')}
                  </span>
                )}
                {savings > 0 && (
                  <span className="rounded-full border border-coral/30 px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-coral">
                    {t('pdp.limited_offer')}
                  </span>
                )}
              </div>

              <h1 className="mt-5 font-display text-[48px] leading-[0.95] text-ink md:text-[68px]">{product.name}</h1>
              <p className="mt-4 text-[18px] leading-snug text-ink/80 md:text-[20px]">{product.heroTitle}</p>

              {proof && <ProofSummary proof={proof} className="mt-5" />}

              <FactRow facts={facts} className="mt-6" />

              <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="text-[36px] font-semibold leading-none tracking-tight text-ink md:text-[40px]">{formatMoney(price, countryConfig)}</span>
                {savings > 0 && <span className="text-[17px] text-ink/35 line-through">{formatMoney(selected.price, countryConfig)}</span>}
                {savings > 0 && (
                  <span className="rounded-full bg-coral/10 px-3 py-1 text-[13px] font-semibold text-coral">
                    {t('pdp.you_save', { amount: formatMoney(savings, countryConfig) })}
                  </span>
                )}
              </div>
              <p className="mt-3 text-[13.5px] text-ink/50">
                {freeShipping ? t('pdp.free_shipping_included') : t('pdp.shipping_note', { amount: formatMoney(countryConfig.business.freeShippingThreshold, countryConfig) })}
              </p>

              <ul className="mt-7 space-y-3">
                {product.benefits.slice(0, 4).map((benefit) => (
                  <li key={benefit} className="flex gap-3 text-[15.5px] font-medium leading-snug text-ink/90">
                    <span className="mt-px inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-moss text-white">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>

              <p className="mt-6 line-clamp-3 text-[15px] leading-relaxed text-ink/70 md:line-clamp-none">{product.description}</p>

              {/* Šta je u setu */}
              <BundleContents parts={components} countryConfig={countryConfig} className="mt-8" />

              {/* Izbor pakovanja */}
              {variants.length > 1 && (
                <div className="mt-7">
                  <Eyebrow className="mb-3 text-ink/50">{t('pdp.choose_package')}</Eyebrow>
                  <div className="space-y-2.5">
                    {variants.map((variant) => {
                      const active = variant.id === selected.id;
                      const vSavings = variantSavings(variant);
                      const qty = Math.max(1, variant.quantity ?? 1);
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => setSelected(variant)}
                          className={cn(
                            'relative flex w-full items-center gap-4 rounded-[18px] border bg-white p-4 text-left transition',
                            active ? 'border-forest ring-1 ring-forest' : 'border-line hover:border-ink/30'
                          )}
                        >
                          {variant.id === bestValueId && (
                            <span className="absolute -top-2.5 right-4 rounded-full bg-forest px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-paper">
                              {t('pdp.best_value')}
                            </span>
                          )}
                          <span className={cn('inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border', active ? 'border-forest bg-forest' : 'border-ink/25')}>
                            {active && <span className="h-2 w-2 rounded-full bg-paper" />}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[14.5px] font-semibold text-ink">{variant.name}</span>
                            {variant.size && <span className="block text-[12.5px] text-ink/50">{variant.size}</span>}
                            {qty > 1 && (
                              <span className="block text-[12.5px] font-medium text-moss">
                                {t('pdp.per_piece', { price: formatMoney(Math.round((variantPrice(variant) / qty) * 100) / 100, countryConfig) })}
                              </span>
                            )}
                          </span>
                          <span className="shrink-0 text-right">
                            {vSavings > 0 && <span className="block text-[12px] text-ink/35 line-through">{formatMoney(variant.price, countryConfig)}</span>}
                            <span className="block text-[17px] font-semibold text-ink">{formatMoney(variantPrice(variant), countryConfig)}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <PriceBox
                price={price}
                regular={selected.price}
                savings={savings}
                percent={percent}
                countryConfig={countryConfig}
                note={freeShipping ? t('pdp.free_shipping_included') : t('pdp.shipping_note', { amount: formatMoney(countryConfig.business.freeShippingThreshold, countryConfig) })}
                className="mt-8"
              />

              <QuickOrderForm countryConfig={countryConfig} lines={orderLines} channel={channel} campaign={campaign} className="mt-4" />

              {!isViber && <AddToCartLink product={product} variant={selected} countryConfig={countryConfig} />}

              <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-line pt-6">
                {trustItems.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex gap-3">
                    <Icon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-moss" strokeWidth={1.6} />
                    <span>
                      <span className="block text-[13.5px] font-semibold leading-tight text-ink">{title}</span>
                      <span className="mt-0.5 block text-[12.5px] leading-snug text-ink/50">{text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── UTISCI KUPACA (kao na starom sajtu) ─────────────── */}
        {proof && <ReviewsShowcase proof={proof} className="pt-20 md:pt-32" />}
        {proof && (
          <div className="mt-16 md:mt-24">
            <CtaBand price={price} countryConfig={countryConfig} />
          </div>
        )}

        {/* ── UKRATKO ──────────────────────────────────────────── */}
        {salesCopy && salesCopy.reasons.length > 0 && (
          <section className="mt-20 bg-forest text-paper md:mt-32">
            <div className="container mx-auto px-4 py-14 md:py-20">
              <p className="text-[11.5px] font-semibold uppercase tracking-[0.2em] text-paper/55">{t('pdp.highlights_eyebrow')}</p>
              <div className="mt-8 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                {salesCopy.reasons.map((reason, index) => (
                  <div key={reason.title} className="border-t border-paper/15 pt-6">
                    <span className="font-display text-[44px] leading-none text-[#F2A08C]">{String(index + 1).padStart(2, '0')}</span>
                    <p className="mt-4 font-display text-[30px] leading-[1.05]">{reason.title}</p>
                    <p className="mt-3 text-[15px] leading-relaxed text-paper/75">{reason.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── PRODAJNA PRIČA ───────────────────────────────────── */}
        {salesCopy && (
          <section className="container mx-auto grid items-start gap-12 px-4 pt-24 md:pt-36 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
            <div>
              <Eyebrow>{salesCopy.eyebrow}</Eyebrow>
              <h2 className="mt-5 font-display text-[40px] leading-[1.02] text-ink md:text-[60px]">
                <DashTitle text={salesCopy.headline} />
              </h2>
              <div className="mt-8 space-y-5 text-[16px] leading-relaxed text-ink/75 md:text-[17px]">
                {salesCopy.paragraphs.slice(0, isViber ? 2 : undefined).map((paragraph, index) => (
                  <p key={paragraph} className={cn(index === 0 && 'border-l-2 border-coral pl-5 text-[18px] text-ink/85 md:text-[20px]')}>
                    <Rich text={paragraph} />
                  </p>
                ))}
              </div>
              <button type="button" onClick={() => scrollToOrderForm()} className={cn(btnCoral, 'mt-10')}>
                {t('pdp.order_for', { price: formatMoney(price, countryConfig) })}
                <ArrowDown className="h-4 w-4" />
              </button>
            </div>
            <div className="lg:pt-6">
              <ProductStage
                src={storyImage}
                alt={product.name}
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="aspect-[4/5] rounded-b-[28px] rounded-t-[999px]"
              />
              <div className="mt-10">
                <Eyebrow className="mb-2">{t('pdp.for_whom')}</Eyebrow>
                <ul>
                  {salesCopy.forWhom.map((item) => (
                    <li key={item} className="flex gap-4 border-b border-line py-4 text-[15.5px] leading-snug text-ink/80">
                      <Check className="mt-0.5 h-[18px] w-[18px] shrink-0 text-moss" strokeWidth={2} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* ── SVE PREDNOSTI ───────────────────────────────────── */}
        <section className="container mx-auto px-4 pt-24 md:pt-36">
          <SectionHeading eyebrow={t('pdp.benefits_eyebrow')} title={t('pdp.benefits_title', { name: product.name })} />
          <ol className="grid border-t border-line md:grid-cols-2 md:gap-x-16">
            {product.benefits.map((benefit, index) => (
              <li key={benefit} className="flex gap-6 border-b border-line py-6">
                <span className="w-8 shrink-0 font-display text-[24px] leading-none text-coral">{String(index + 1).padStart(2, '0')}</span>
                <span className="text-[16px] leading-relaxed text-ink/80 md:text-[17px]">{benefit}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ── SASTOJCI ─────────────────────────────────────────── */}
        {!isViber && ingredientHighlights.length > 0 && (
          <section className="mt-24 bg-sand py-20 md:mt-36 md:py-28">
            <div className="container mx-auto px-4">
              <SectionHeading eyebrow={t('pdp.ingredients_eyebrow')} title={t('pdp.ingredients_title')} text={t('pdp.ingredients_text')} />
              <div className="grid border-t border-clay sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-3">
                {ingredientHighlights.map((ingredient) => (
                  <div key={ingredient.id} className="border-b border-clay py-8">
                    <p className="font-display text-[30px] leading-[1.05] text-ink">{ingredient.serbianName}</p>
                    <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-ink/40">{ingredient.inciName}</p>
                    <p className="mt-4 text-[15px] leading-relaxed text-ink/75">{ingredient.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── GARANCIJA + REGISTRACIJA ─────────────────────────── */}
        {proof && (
          <section className="container mx-auto px-4 pt-24 md:pt-36">
            <GuaranteeProof proof={proof} />
          </section>
        )}
        {proof && (
          <div className="mt-24 md:mt-36">
            <CtaBand price={price} countryConfig={countryConfig} />
          </div>
        )}

        {/* ── NAČIN UPOTREBE ───────────────────────────────────── */}
        {product.usageSteps && product.usageSteps.length > 0 && (
          <section className="container mx-auto px-4 pt-24 md:pt-36">
            <SectionHeading eyebrow={t('pdp.usage_eyebrow')} title={t('pdp.usage_title')} />
            <ol className={cn('grid border-t border-line', product.usageSteps.length >= 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3')}>
              {product.usageSteps.map((step, index) => (
                <li key={step} className={cn('py-8 md:pr-8', index > 0 && 'border-t border-line md:border-t-0 md:border-l md:pl-8')}>
                  <span className="font-display text-[48px] leading-none text-coral md:text-[56px]">{String(index + 1).padStart(2, '0')}</span>
                  <p className="mt-4 text-[16px] leading-relaxed text-ink/80">{step}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        <div className="store-reviews">
          <ReviewsSection product={product} />
        </div>

        {/* ── KAKO PORUČITI + GARANCIJA ─────────────────────────── */}
        <section className="container mx-auto px-4 pt-24 md:pt-36">
          <SectionHeading eyebrow={t('how.eyebrow')} title={t('how.title')} text={t('how.text')} />
          <HowToOrder countryConfig={countryConfig} />
          {!proof && (
            <div className="mt-12">
              <GuaranteeBand countryConfig={countryConfig} />
            </div>
          )}
        </section>

        {/* ── FAQ + DETALJI ────────────────────────────────────── */}
        <section className="container mx-auto px-4 pt-24 md:pt-36">
          <StoreFaq countryConfig={countryConfig} items={product.productFAQ} />
          <div className="mt-20 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <h2 className="font-display text-[36px] leading-[1.02] text-ink md:text-[44px]">{t('pdp.details_title')}</h2>
            <ProductDetails product={product} />
          </div>
        </section>

        {/* ── ZAVRŠNI POZIV ────────────────────────────────────── */}
        <section className="container mx-auto px-4 pt-24 md:pt-36">
          <div className="grid overflow-hidden rounded-[32px] bg-forest text-paper md:grid-cols-[1.1fr_1fr]">
            <div className="flex flex-col justify-center p-8 md:p-16">
              <Eyebrow invert>{t('final.eyebrow')}</Eyebrow>
              <p className="mt-5 font-display text-[42px] leading-[1.02] md:text-[60px]">{t('final.title', { name: product.name })}</p>
              <p className="mt-5 max-w-md text-[16px] leading-relaxed text-paper/65">
                {t('final.text', { time: countryConfig.couriers[0]?.deliveryTime ?? '' })}
              </p>
              <div className="mt-8 flex flex-wrap items-end gap-x-4 gap-y-1">
                <span className="font-display text-[52px] leading-none">{formatMoney(price, countryConfig)}</span>
                {savings > 0 && <span className="pb-1 text-[16px] text-paper/40 line-through">{formatMoney(selected.price, countryConfig)}</span>}
              </div>
              <button type="button" onClick={() => scrollToOrderForm()} className={cn(btnCoral, 'mt-8 self-start')}>
                {t('pdp.order_now')}
                <ArrowDown className="h-4 w-4" />
              </button>
            </div>
            <ProductStage src={visual.packshot} alt={product.name} sizes="(max-width: 768px) 100vw, 45vw" className="aspect-square md:aspect-auto md:min-h-[480px]" dark />
          </div>
        </section>

        {related.length > 0 && (
          <section className="container mx-auto px-4 pt-24 md:pt-36">
            <SectionHeading eyebrow={t('pdp.related_eyebrow')} title={t('pdp.related_title')} />
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} locale={locale} countryConfig={countryConfig} />
              ))}
            </div>
          </section>
        )}

        <div className="h-24 md:h-36" />
      </main>

      {/* Sticky CTA (mobilni) */}
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-[130] border-t border-line bg-paper/95 px-4 py-3 backdrop-blur-xl transition-transform duration-300 lg:hidden',
          showSticky ? 'translate-y-0' : 'translate-y-full'
        )}
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <div className="flex items-center gap-4">
          <div className="min-w-0">
            <p className="truncate text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink/50">{product.name}</p>
            <p className="text-[20px] font-semibold leading-tight text-ink">{formatMoney(price, countryConfig)}</p>
          </div>
          <button
            type="button"
            onClick={() => scrollToOrderForm()}
            className="ml-auto inline-flex h-12 flex-1 items-center justify-center rounded-full bg-coral px-5 text-[15px] font-semibold text-white"
          >
            {t('pdp.order_now')}
          </button>
        </div>
      </div>

      {isViber ? <ViberFooter countryConfig={countryConfig} /> : <StoreFooter countryConfig={countryConfig} locale={locale} />}
      {!isViber && <CookieConsent isEU={countryConfig.isEU} />}
    </div>
  );
}

/** Sastav, upotreba i upozorenja — isti akordeon kao FAQ. */
export function ProductDetails({ product }: { product: Product }) {
  const t = useTranslations();
  const ingredients = product.ingredients
    .map((id) => INGREDIENTS[id])
    .filter(Boolean)
    .map((ingredient) => `${ingredient.serbianName} (${ingredient.inciName})`)
    .join(', ');
  const usage = product.usage || (product.usageSteps ?? []).map((step, index) => `${index + 1}. ${step}`).join('\n');
  const items = [
    ingredients && { question: t('product.ingredients'), answer: ingredients },
    usage && { question: t('product.usage'), answer: usage },
    product.warnings.length > 0 && { question: t('product.warnings'), answer: product.warnings.map((w) => `• ${w}`).join('\n') },
  ].filter((item): item is { question: string; answer: string } => Boolean(item));
  return <FaqList items={items} defaultOpen={null} className="[&_p]:whitespace-pre-line" />;
}

function AddToCartLink({ product, variant, countryConfig }: { product: Product; variant: ProductVariant; countryConfig: CountryConfig }) {
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
      className="mt-3 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full border border-ink/15 px-5 text-[14.5px] font-medium text-ink/80 transition hover:border-ink/40 hover:text-ink"
    >
      <ShoppingBag className="h-4 w-4" strokeWidth={1.6} />
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

export function ViberFooter({ countryConfig }: { countryConfig: CountryConfig }) {
  const t = useTranslations('store');
  return (
    <footer className="border-t border-line bg-paper py-10 text-center text-[13.5px] text-ink/65">
      <p className="font-display text-[26px] text-ink">{t('viber.questions')}</p>
      <p className="mt-2">
        {countryConfig.company.phone && (
          <a href={`tel:${countryConfig.company.phone}`} className="font-medium text-ink underline decoration-ink/20 underline-offset-4">{countryConfig.company.phone}</a>
        )}
        {countryConfig.company.phone && ' · '}
        <a href={`mailto:${countryConfig.company.email}`} className="font-medium text-ink underline decoration-ink/20 underline-offset-4">{countryConfig.company.email}</a>
      </p>
      <p className="mt-4 text-[12.5px]">© {new Date().getFullYear()} {countryConfig.company.name} · {countryConfig.company.legalName}</p>
    </footer>
  );
}
