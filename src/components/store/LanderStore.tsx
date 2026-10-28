'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight, Check, CheckCircle2, ChevronDown, Gift, HandHeart, Leaf, Truck } from 'lucide-react';

import type { CountryConfig } from '@/config/countries';
import { getProductVariantsForCountry, type Product } from '@/config/products';
import { getProductFacts, getStoreVisual, type NeedTile, type StoreOffer } from '@/config/store-content';
import { getLanderContent } from '@/config/lander-content';
import { cn } from '@/lib/utils';
import { TestimonialCarousel } from './CheckoutLander';
import { Bold, Marked, ReviewShots, Stars, richTags } from './LanderKit';
import { useGeneralFaq } from './StoreSections';
import { formatMoney, variantDiscountPercent, variantPrice, variantSavings } from './format';

/*
 * Delovi početne i liste proizvoda u stilu prodajne stranice (stari dermotin.rs).
 */

const GREEN_PATTERN = "bg-[#7FCB95] bg-[url('/images/lander/bg2-h17.jpg')] bg-cover bg-center";

function defaultVariant(product: Product, locale: string) {
  const variants = getProductVariantsForCountry(product, locale);
  return variants.find((v) => v.isDefault) || variants[0];
}

/** Naslov sekcije sa obojenim isticanjem iz poruka (<g>, <c>, <b>) */
export function LanderHeading({ children, sub, className }: { children: React.ReactNode; sub?: React.ReactNode; className?: string }) {
  return (
    <div className={cn('text-center', className)}>
      <h2 className="text-[28px] font-extrabold leading-tight md:text-[38px]">{children}</h2>
      {sub && <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-[#444] md:text-[16px]">{sub}</p>}
    </div>
  );
}

/** Kartica akcije: šta kupac dobija, koliko štedi, velika cena i dugme. */
export function OfferTile({ offer, product, locale, countryConfig }: { offer: StoreOffer; product: Product; locale: string; countryConfig: CountryConfig }) {
  const t = useTranslations('store');
  const variant = defaultVariant(product, locale);
  if (!variant) return null;
  const price = variantPrice(variant);
  const savings = variantSavings(variant);
  const percent = variantDiscountPercent(variant);
  const quantity = Math.max(1, variant.quantity ?? 1);
  const facts = getProductFacts(product.id).slice(0, 2);
  const href = `/${locale}/products/${product.slug}`;

  return (
    <Link
      href={href}
      className="reveal group flex h-full flex-col overflow-hidden rounded-[22px] border-2 border-[#F0735A] bg-white shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:shadow-[0_22px_40px_-20px_rgba(240,115,90,0.55)]"
    >
      <div className="flex items-center justify-between gap-2 bg-[#F0735A] px-4 py-2 text-white">
        <span className="inline-flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-wide">
          <Gift className="h-4 w-4" />
          {offer.badge}
        </span>
        {percent > 0 && <span className="rounded-full bg-white px-2.5 py-0.5 text-[12.5px] font-extrabold text-[#F0735A]">−{percent}%</span>}
      </div>
      <div className={cn('relative aspect-[2/1] overflow-hidden md:aspect-[16/10]', GREEN_PATTERN)}>
        <Image
          src={getStoreVisual(product).packshot}
          alt={offer.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-[50%_74%] transition duration-700 group-hover:scale-[1.05]"
        />
        {quantity > 1 && (
          <span className="absolute right-3 top-3 rounded-full bg-[#2E8655] px-3 py-1 text-[16px] font-extrabold text-white shadow">× {quantity}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4 md:p-5">
        <p className="text-[21px] font-extrabold leading-tight md:text-[23px]">{offer.title}</p>
        <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-[#444] md:line-clamp-none md:text-[14.5px]">
          <Bold text={offer.pitch} />
        </p>
        {facts.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {facts.map((fact) => (
              <li key={fact.label} className="rounded-full bg-[#2E8655]/10 px-2.5 py-1 text-[12px] font-medium text-[#1d5434]">
                <strong className="font-extrabold">{fact.value}</strong> {fact.label}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto pt-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              {savings > 0 && <p className="text-[13px] text-[#888] line-through">{formatMoney(variant.price, countryConfig)}</p>}
              <p className="inline-block bg-[#2E8655] px-2 py-0.5 text-[30px] font-extrabold leading-none text-white [text-shadow:2px_2px_0_#14402a]">
                {formatMoney(price, countryConfig)}
              </p>
            </div>
            {savings > 0 && (
              <p className="text-right text-[13px] font-bold text-[#F0735A]">{t('card.you_save', { amount: formatMoney(savings, countryConfig) })}</p>
            )}
          </div>
          {offer.priceNote && <p className="mt-1.5 text-[12.5px] text-[#666]">{offer.priceNote}</p>}
          <span className="lander-shine mt-4 flex h-12 items-center justify-center gap-2 rounded-full bg-[#2E8655] text-[16px] font-bold text-white shadow-[0_4px_0_#1d5434] transition group-hover:bg-[#2a7349]">
            {t('lander.submit')}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Kartica proizvoda u mreži. */
export function LanderProductCard({ product, locale, countryConfig }: { product: Product; locale: string; countryConfig: CountryConfig }) {
  const t = useTranslations('store');
  const variant = defaultVariant(product, locale);
  if (!variant) return null;
  const percent = variantDiscountPercent(variant);
  const savings = variantSavings(variant);

  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
      className="reveal group flex h-full flex-col overflow-hidden rounded-[18px] bg-white shadow-[0_8px_24px_-14px_rgba(0,0,0,0.3)] ring-1 ring-black/5 transition hover:-translate-y-1 hover:ring-[#2E8655]/40"
    >
      <div className="relative aspect-square overflow-hidden bg-[#EEF6F0]">
        <Image
          src={getStoreVisual(product).packshot}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover object-[50%_72%] transition duration-700 group-hover:scale-[1.06]"
        />
        {percent > 0 && <span className="absolute left-2.5 top-2.5 rounded-full bg-[#F0735A] px-2.5 py-1 text-[12px] font-extrabold text-white">−{percent}%</span>}
        {product.isBundle && (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-[#2E8655] px-2.5 py-1 text-[11px] font-bold uppercase text-white">{t('card.set')}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3 md:p-4">
        <p className="text-[14.5px] font-extrabold uppercase leading-tight md:text-[16px]">{product.name}</p>
        <p className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-[#555] md:text-[13.5px]">{product.shortDescription}</p>
        <div className="mt-auto pt-3">
          {savings > 0 && <span className="mr-1.5 text-[12px] text-[#999] line-through">{formatMoney(variant.price, countryConfig)}</span>}
          <span className="text-[19px] font-extrabold text-[#2E8655]">{formatMoney(variantPrice(variant), countryConfig)}</span>
          <span className="mt-2.5 flex h-10 items-center justify-center gap-1.5 rounded-full bg-[#2E8655] text-[14px] font-bold text-white transition group-hover:bg-[#2a7349]">
            {t('landerHome.order')}
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Brzi izbor po potrebi. */
export function NeedsGrid({ needs, byId, locale }: { needs: NeedTile[]; byId: Map<string, Product>; locale: string }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-4">
      {needs.map((need, index) => {
        const product = byId.get(need.productId);
        if (!product) return null;
        return (
          <Link
            key={need.productId}
            href={`/${locale}/products/${product.slug}`}
            className="reveal group flex flex-col items-center rounded-[18px] bg-white p-3 text-center shadow-[0_6px_18px_rgba(0,0,0,0.06)] ring-1 ring-black/5 transition hover:-translate-y-1 hover:ring-[#2E8655]/40 md:flex-row md:gap-4 md:p-4 md:text-left"
            style={{ '--reveal-delay': `${index * 70}ms` } as React.CSSProperties}
          >
            <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-[3px] border-[#F0735A] bg-[#EEF6F0] md:h-24 md:w-24">
              <Image src={getStoreVisual(product).packshot} alt={need.title} fill sizes="96px" className="scale-125 object-cover object-[50%_70%]" />
            </span>
            <span className="mt-2 min-w-0 md:mt-0">
              <span className="block text-[15px] font-extrabold leading-tight md:text-[18px]">{need.title}</span>
              <span className="mt-1 block text-[12.5px] leading-snug text-[#555] md:text-[13.5px]">{need.text}</span>
            </span>
            <ArrowRight className="ml-auto hidden h-5 w-5 shrink-0 text-[#2E8655] transition group-hover:translate-x-1 md:block" />
          </Link>
        );
      })}
    </div>
  );
}

/** Svedočanstva sa svih prodajnih stranica + snimci pravih komentara. */
export function LanderReviews({ productIds, shots, reviewsCount }: { productIds: string[]; shots: Array<[string, number, number]>; reviewsCount: string }) {
  const t = useTranslations('store.lander');
  const testimonials = productIds
    .map((id) => getLanderContent(id)?.testimonials.find((item) => item.photo))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <section id="utisci" className="reveal scroll-mt-24 text-center">
      <LanderHeading>{t.rich('reviews_title', richTags)}</LanderHeading>
      <div className="mt-3 flex flex-col items-center gap-3">
        <Stars size={26} />
        <Image src="/images/lander/thumb.webp" alt="" width={128} height={44} className="h-11 w-auto" />
      </div>
      <TestimonialCarousel items={testimonials} yearsLabel={t('years')} />
      <ReviewShots shots={shots} title={t('shots_title')} />
      <p className="mt-8 text-[24px] font-extrabold leading-tight md:text-[30px]">{t.rich('reviews_more', { ...richTags, count: reviewsCount })}</p>
      <p className="mx-auto mt-3 max-w-xl text-[20px] font-bold leading-snug md:text-[24px]">{t.rich('reviews_sub', richTags)}</p>
    </section>
  );
}

/** Garancija povraćaja novca sa pečatom. */
export function LanderGuarantee({ unit }: { unit: string }) {
  const t = useTranslations('store.lander');
  return (
    <section className="reveal mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-[24px] bg-white px-4 py-8 text-center shadow-[0_8px_24px_rgba(0,0,0,0.06)] md:px-10">
      <div className="relative h-28 w-28 shrink-0">
        <span className="absolute inset-0 rounded-full border-[3px] border-dashed border-[#2E8655]/70 motion-safe:animate-[spin_24s_linear_infinite]" aria-hidden />
        <span className="absolute inset-[9px] flex flex-col items-center justify-center rounded-full bg-[#F0735A] text-white shadow-[0_10px_22px_-10px_rgba(240,115,90,0.9)]">
          <span className="text-[26px] font-extrabold leading-none">100%</span>
          <span className="mt-1 text-[9.5px] font-bold uppercase tracking-[0.12em]">{t('seal_label')}</span>
        </span>
      </div>
      <h2 className="text-[26px] font-extrabold leading-snug md:text-[34px]">{t.rich('guarantee_title', richTags)}</h2>
      <p className="text-[15.5px] leading-relaxed">{t.rich('guarantee_text', { ...richTags, unit })}</p>
    </section>
  );
}

/** Četiri razloga (isporuka, prirodno, bez hemikalija, provereno). */
export function LanderIconCards({ natural, safe, tested }: { natural: string; safe: string; tested: string }) {
  const t = useTranslations('store.lander');
  return (
    <section className="grid gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
      {[
        { icon: Truck, title: t('card_delivery_title'), text: t('card_delivery_text') },
        { icon: Leaf, title: t('card_natural'), text: natural },
        { icon: HandHeart, title: t('card_safe'), text: safe },
        { icon: CheckCircle2, title: t('card_tested'), text: tested },
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
  );
}

/** Kompaktna česta pitanja (opšta). */
export function LanderFaq({ countryCode, limit = 6 }: { countryCode: string; limit?: number }) {
  const t = useTranslations('store.lander');
  const items = useGeneralFaq(countryCode).slice(0, limit);
  if (items.length === 0) return null;
  return (
    <section className="reveal mx-auto max-w-3xl">
      <LanderHeading>{t.rich('faq_title', richTags)}</LanderHeading>
      <div className="mt-5 space-y-2">
        {items.map((item) => (
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
  );
}

/** Zeleni hero sa šarom (kao na prodajnoj stranici). */
export function GreenHero({ children, image, sticker }: { children: React.ReactNode; image?: React.ReactNode; sticker?: React.ReactNode }) {
  return (
    <section className={cn('relative overflow-hidden rounded-[28px]', GREEN_PATTERN)}>
      <div className="pointer-events-none absolute -right-16 top-1/3 h-72 w-72 rounded-full bg-white/25 blur-3xl md:right-24" aria-hidden />
      <div className={cn('relative grid items-center px-3 pb-3 pt-7 md:px-14 md:py-12', image && 'md:grid-cols-2')}>
        <div className="text-center">{children}</div>
        {image && (
          <div className="relative mx-auto mt-2 aspect-[5/4] w-full max-w-[520px] md:mt-0 md:aspect-square">
            <div className="lander-float absolute inset-0">{image}</div>
            {sticker}
          </div>
        )}
      </div>
    </section>
  );
}

/** Bela pilula na zelenoj pozadini (kao „Saznaj više“). */
export function HeroButton({ href, children, variant = 'solid' }: { href: string; children: React.ReactNode; variant?: 'solid' | 'ghost' }) {
  return (
    <a
      href={href}
      className={cn(
        'inline-flex h-12 items-center gap-2 rounded-full px-6 text-[13.5px] font-semibold uppercase tracking-wide transition hover:scale-[1.03]',
        variant === 'solid'
          ? 'lander-shine bg-white text-[#2E8655] shadow-[0_8px_18px_-8px_rgba(0,0,0,0.35)]'
          : 'border-2 border-white/80 text-white hover:bg-white/10'
      )}
    >
      {children}
      {variant === 'solid' && (
        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#2E8655] text-white">
          <ArrowRight className="h-2.5 w-2.5" strokeWidth={3} />
        </span>
      )}
    </a>
  );
}

/** Lista sa zelenim kvačicama */
export function CheckList({ items, className }: { items: React.ReactNode[]; className?: string }) {
  return (
    <ul className={cn('space-y-2', className)}>
      {items.map((item, index) => (
        <li key={index} className="flex gap-2.5 text-[15px] leading-snug">
          <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2BB673] text-white">
            <Check className="h-3 w-3" strokeWidth={3.5} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export { Marked };
