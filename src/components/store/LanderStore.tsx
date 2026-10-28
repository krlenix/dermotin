'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight, ChevronDown, Gift } from 'lucide-react';

import type { CountryConfig } from '@/config/countries';
import { getProductVariantsForCountry, type Product } from '@/config/products';
import { getProductFacts, getStoreVisual, tightPackshot, type StoreOffer } from '@/config/store-content';
import { cn } from '@/lib/utils';
import { Bold, richTags } from './LanderKit';
import { useGeneralFaq } from './faq';
import { formatMoney, variantDiscountPercent, variantPrice, variantSavings } from './format';

/*
 * Delovi početne i liste proizvoda u stilu prodajne stranice (stari dermotin.rs).
 */

/** Mekana svetla podloga za slike proizvoda (bez zasićene zelene) */
const SOFT_STAGE = 'bg-[radial-gradient(120%_80%_at_50%_20%,#FFFFFF_0%,#EEF4EF_55%,#E1ECE4_100%)]';

function defaultVariant(product: Product, locale: string) {
  const variants = getProductVariantsForCountry(product, locale);
  return variants.find((v) => v.isDefault) || variants[0];
}

/** Naslov sekcije sa obojenim isticanjem iz poruka (<g>, <c>, <b>) */
export function LanderHeading({ children, sub, className }: { children: React.ReactNode; sub?: React.ReactNode; className?: string }) {
  return (
    <div className={cn('text-center', className)}>
      <h2 className="text-[1.875rem] font-extrabold leading-tight md:text-[2.25rem]">{children}</h2>
      {sub && <p className="mx-auto mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-soft md:text-[1rem]">{sub}</p>}
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
      className="reveal group flex h-full flex-col overflow-hidden rounded-card border-2 border-coral bg-white shadow-card transition hover:-translate-y-1 hover:shadow-raised"
    >
      <div className="flex items-center justify-between gap-2 bg-coral-deep px-4 py-2 text-white">
        <span className="inline-flex items-center gap-1.5 text-[0.8125rem] font-bold uppercase tracking-wide">
          <Gift className="h-4 w-4" aria-hidden />
          {offer.badge}
        </span>
        {percent > 0 && <span className="rounded-full bg-white px-2.5 py-0.5 text-[0.8125rem] font-extrabold text-coral-deep">−{percent}%</span>}
      </div>
      <div className={cn('relative aspect-[2/1] overflow-hidden', SOFT_STAGE)}>
        <Image
          src={tightPackshot(getStoreVisual(product).packshot)}
          alt={offer.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-4 drop-shadow-[0_14px_18px_rgba(0,0,0,0.16)] transition duration-700 group-hover:scale-[1.05]"
        />
        {quantity > 1 && (
          <span className="absolute right-3 top-3 rounded-full bg-green px-3 py-1 text-[1rem] font-extrabold text-white shadow">× {quantity}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4 md:p-5">
        <p className="text-[1.25rem] font-extrabold leading-tight md:text-[1.5rem]">{offer.title}</p>
        <p className="mt-2 line-clamp-3 text-[0.875rem] leading-relaxed text-ink-soft md:line-clamp-none md:text-[0.9375rem]">
          <Bold text={offer.pitch} />
        </p>
        {facts.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {facts.map((fact) => (
              <li key={fact.label} className="rounded-full bg-green/10 px-2.5 py-1 text-[0.75rem] font-medium text-forest">
                <strong className="font-extrabold">{fact.value}</strong> {fact.label}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto pt-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              {savings > 0 && <p className="text-[0.8125rem] text-ink-muted line-through">{formatMoney(variant.price, countryConfig)}</p>}
              <p className="inline-block bg-green px-2 py-0.5 text-[1.875rem] font-extrabold leading-none text-white">
                {formatMoney(price, countryConfig)}
              </p>
            </div>
            {savings > 0 && (
              <p className="text-right text-[0.8125rem] font-bold text-coral-deep">{t('card.you_save', { amount: formatMoney(savings, countryConfig) })}</p>
            )}
          </div>
          {offer.priceNote && <p className="mt-1.5 text-[0.8125rem] text-ink-muted">{offer.priceNote}</p>}
          <span className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-full bg-green text-[1rem] font-bold text-white shadow-press transition group-hover:bg-green-press">
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
      className="reveal group flex h-full flex-col overflow-hidden rounded-[18px] bg-white shadow-[0_8px_24px_-14px_rgba(0,0,0,0.3)] ring-1 ring-black/5 transition hover:-translate-y-1 hover:ring-green/40"
    >
      <div className="relative aspect-square overflow-hidden bg-mint-soft">
        <Image
          src={getStoreVisual(product).packshot}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover object-[50%_72%] transition duration-700 group-hover:scale-[1.06]"
        />
        {percent > 0 && <span className="absolute left-2.5 top-2.5 rounded-full bg-coral-deep px-2.5 py-1 text-[0.75rem] font-extrabold text-white">−{percent}%</span>}
        {product.isBundle && (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-green px-2.5 py-1 text-[0.75rem] font-bold uppercase text-white">{t('card.set')}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3 md:p-4">
        <p className="text-[0.9375rem] font-extrabold uppercase leading-tight md:text-[1rem]">{product.name}</p>
        <p className="mt-1 line-clamp-3 text-[0.8125rem] leading-snug text-ink-soft md:text-[0.875rem]">{product.shortDescription}</p>
        <div className="mt-auto pt-3">
          {savings > 0 && <span className="mr-1.5 text-[0.75rem] text-ink-muted line-through">{formatMoney(variant.price, countryConfig)}</span>}
          <span className="text-[1.125rem] font-extrabold text-green">{formatMoney(variantPrice(variant), countryConfig)}</span>
          <span className="mt-2.5 flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-green text-[0.875rem] font-bold text-white transition group-hover:bg-green-press">
            {t('landerHome.view_offer')}
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Garancija povraćaja novca sa pečatom. */
export function LanderGuarantee({ unit }: { unit: string }) {
  const t = useTranslations('store.lander');
  return (
    <section className="reveal mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-[24px] bg-white px-4 py-8 text-center shadow-[0_8px_24px_rgba(0,0,0,0.06)] md:px-10">
      <div className="relative h-28 w-28 shrink-0">
        <span className="absolute inset-0 rounded-full border-[3px] border-dashed border-green/70" aria-hidden />
        <span className="absolute inset-[9px] flex flex-col items-center justify-center rounded-full bg-coral-deep text-white shadow-float">
          <span className="text-[1.5rem] font-extrabold leading-none">100%</span>
          <span className="mt-1 text-[0.75rem] font-bold uppercase tracking-[0.08em]">{t('seal_label')}</span>
        </span>
      </div>
      <h2 className="text-[1.5rem] font-extrabold leading-snug md:text-[2.25rem]">{t.rich('guarantee_title', richTags)}</h2>
      <p className="text-[1rem] leading-relaxed">{t.rich('guarantee_text', { ...richTags, unit })}</p>
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
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-4 text-[0.9375rem] font-semibold [&::-webkit-details-marker]:hidden">
              {item.question}
              <ChevronDown className="h-5 w-5 shrink-0 text-green transition group-open:rotate-180" />
            </summary>
            <p className="pb-4 text-[0.9375rem] leading-relaxed text-ink-soft">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/** Zeleni hero sa šarom (kao na prodajnoj stranici). */
export function GreenHero({ children, image, sticker }: { children: React.ReactNode; image?: React.ReactNode; sticker?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden rounded-[28px] bg-paper ring-1 ring-black/5">
      <div className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(46,134,85,0.16)_0%,rgba(46,134,85,0)_68%)]" aria-hidden />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(240,115,90,0.12)_0%,rgba(240,115,90,0)_70%)]" aria-hidden />
      <div className={cn('relative grid items-center px-3 pb-3 pt-7 md:px-14 md:py-12', image && 'md:grid-cols-2')}>
        <div className="text-center">{children}</div>
        {image && (
          <div className="relative mx-auto mt-2 aspect-[5/4] w-full max-w-[520px] md:mt-0 md:aspect-square">
            <div className="absolute inset-0">{image}</div>
            {sticker}
          </div>
        )}
      </div>
    </section>
  );
}
