'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight, Check } from 'lucide-react';
import type { CountryConfig } from '@/config/countries';
import { getProductVariantsForCountry, type Product } from '@/config/products';
import { getProductFacts, getSalesCopy, getStoreVisual, isPackshot, type StoreOffer } from '@/config/store-content';
import { cn } from '@/lib/utils';
import { formatMoney, variantDiscountPercent, variantPrice, variantSavings } from './format';
import { DashTitle, FactRow, Rich } from './Rich';

function defaultVariant(product: Product, locale: string) {
  const variants = getProductVariantsForCountry(product, locale);
  return variants.find((v) => v.isDefault) || variants[0];
}

/** Slika proizvoda na „sceni“ — packshot-ovi stoje na podu, fotografije idu preko celog okvira. */
export function ProductStage({
  src,
  alt,
  sizes,
  priority,
  className,
  imageClassName,
  dark = false,
  children,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  dark?: boolean;
  children?: React.ReactNode;
}) {
  const packshot = isPackshot(src);
  return (
    <div className={cn('relative overflow-hidden', packshot ? (dark ? 'store-stage-dark' : 'store-stage') : 'bg-sand', className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn(packshot ? 'object-contain' : 'object-cover', 'transition duration-700 ease-out', imageClassName)}
      />
      {children}
    </div>
  );
}

function SavingsBadge({ percent, className }: { percent: number; className?: string }) {
  if (percent <= 0) return null;
  return (
    <span className={cn('inline-flex items-center rounded-full bg-coral px-2.5 py-1 text-[12px] font-semibold text-white shadow-[0_6px_14px_-6px_rgba(201,83,58,0.8)]', className)}>
      −{percent}%
    </span>
  );
}

export function ProductCard({
  product,
  locale,
  countryConfig,
  className,
}: {
  product: Product;
  locale: string;
  countryConfig: CountryConfig;
  className?: string;
}) {
  const t = useTranslations('store');
  const variant = defaultVariant(product, locale);
  if (!variant) return null;
  const percent = variantDiscountPercent(variant);
  const savings = variantSavings(variant);
  const href = `/${locale}/products/${product.slug}`;
  const { packshot } = getStoreVisual(product);
  const facts = getProductFacts(product.id).slice(0, 2);

  return (
    <Link href={href} className={cn('group flex h-full flex-col', className)}>
      <ProductStage
        src={packshot}
        alt={product.name}
        sizes="(max-width: 768px) 50vw, 25vw"
        className="aspect-[4/5] rounded-[20px]"
        imageClassName="group-hover:scale-[1.045]"
      >
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <SavingsBadge percent={percent} />
          {product.isBundle && (
            <span className="rounded-full bg-forest px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-paper">{t('card.set')}</span>
          )}
        </div>
      </ProductStage>
      <div className="flex flex-1 flex-col px-0.5 pt-4">
        <p className="text-[13.5px] font-semibold uppercase tracking-[0.08em] text-ink md:text-[14.5px]">{product.name}</p>
        <p className="mt-1 line-clamp-2 text-[13.5px] leading-snug text-ink/70 md:text-[14px]">{product.shortDescription}</p>
        <FactRow facts={facts} variant="chips" className="mt-3" />
        <div className="mt-auto pt-4">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-[19px] font-semibold tracking-tight text-ink">{formatMoney(variantPrice(variant), countryConfig)}</span>
            {savings > 0 && <span className="text-[13px] text-ink/40 line-through">{formatMoney(variant.price, countryConfig)}</span>}
          </div>
          {savings > 0 && (
            <p className="mt-0.5 text-[12.5px] font-semibold text-coral">{t('card.you_save', { amount: formatMoney(savings, countryConfig) })}</p>
          )}
          <span className="mt-3 flex h-11 w-full items-center justify-center gap-1.5 rounded-full border border-ink/15 text-[13.5px] font-semibold text-ink transition duration-300 group-hover:border-forest group-hover:bg-forest group-hover:text-paper">
            {t('card.order_now')}
            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Velika istaknuta ponuda: scena levo, tamni panel sa cenom desno. */
export function FeaturedOffer({
  offer,
  product,
  locale,
  countryConfig,
}: {
  offer: StoreOffer;
  product: Product;
  locale: string;
  countryConfig: CountryConfig;
}) {
  const t = useTranslations('store');
  const variant = defaultVariant(product, locale);
  if (!variant) return null;
  const savings = variantSavings(variant);
  const percent = variantDiscountPercent(variant);
  const { packshot } = getStoreVisual(product);

  return (
    <Link href={`/${locale}/products/${product.slug}`} className="group grid overflow-hidden rounded-[28px] bg-forest md:grid-cols-2">
      <ProductStage
        src={packshot}
        alt={offer.title}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="aspect-square md:aspect-auto md:min-h-[600px]"
        imageClassName="group-hover:scale-[1.03]"
      >
        {percent > 0 && (
          <span className="absolute right-5 top-5 flex h-24 w-24 rotate-[8deg] flex-col items-center justify-center rounded-full bg-coral text-white shadow-[0_18px_34px_-14px_rgba(201,83,58,0.9)] md:right-8 md:top-8 md:h-28 md:w-28">
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] opacity-90">{t('card.save')}</span>
            <span className="font-display text-[38px] leading-none md:text-[44px]">{percent}%</span>
          </span>
        )}
      </ProductStage>
      <div className="flex flex-col justify-center p-7 text-paper md:p-14">
        <p className="inline-flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-[#F2A08C]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#F2A08C]" />
          {offer.badge}
        </p>
        <p className="mt-4 font-display text-[42px] leading-[1.02] md:text-[60px]">
          <DashTitle text={offer.title} accentClassName="text-[#F2A08C]" />
        </p>
        <p className="mt-5 max-w-md text-[16px] leading-relaxed text-paper/80 md:text-[17px]">
          <Rich text={offer.pitch} strongClassName="text-paper" />
        </p>
        <FactRow facts={getProductFacts(product.id)} variant="dark" className="mt-8" />
        <div className="mt-8 flex flex-wrap items-end gap-x-4 gap-y-2">
          <span className="font-display text-[56px] leading-none md:text-[68px]">{formatMoney(variantPrice(variant), countryConfig)}</span>
          {savings > 0 && <span className="pb-2 text-[16px] text-paper/45 line-through">{formatMoney(variant.price, countryConfig)}</span>}
        </div>
        {savings > 0 && (
          <p className="mt-2 text-[14px] font-semibold text-[#F2A08C]">
            {t('card.you_save', { amount: formatMoney(savings, countryConfig) })}
            {offer.priceNote && <span className="font-normal text-paper/55"> · {offer.priceNote}</span>}
          </p>
        )}
        <span className="mt-8 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-coral px-8 text-[16px] font-semibold text-white shadow-[0_18px_34px_-16px_rgba(222,98,71,0.9)] transition duration-300 group-hover:bg-coral-deep sm:w-auto sm:self-start">
          {t('card.order_now')}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

/** Izdvojeni proizvod na početnoj: velika scena + karakteristike u brojkama + za koga je. */
export function OfferSpotlight({
  offer,
  product,
  locale,
  countryConfig,
  reverse = false,
  photo,
}: {
  offer: StoreOffer;
  product: Product;
  locale: string;
  countryConfig: CountryConfig;
  reverse?: boolean;
  /** Opciona fotografija iz upotrebe, prikazana uz packshot */
  photo?: string;
}) {
  const t = useTranslations('store');
  const variant = defaultVariant(product, locale);
  if (!variant) return null;
  const savings = variantSavings(variant);
  const percent = variantDiscountPercent(variant);
  const { packshot } = getStoreVisual(product);
  const copy = getSalesCopy(product.id, locale);
  const href = `/${locale}/products/${product.slug}`;

  return (
    <article className="grid items-center gap-8 md:grid-cols-2 md:gap-14 lg:gap-20">
      <Link href={href} className={cn('group relative block', reverse && 'md:order-2')}>
        <ProductStage
          src={packshot}
          alt={offer.title}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="aspect-[5/4] rounded-[28px]"
          imageClassName="group-hover:scale-[1.04]"
        >
          <div className="absolute inset-x-5 top-5 flex items-start justify-between gap-2">
            <span className="rounded-full bg-paper/90 px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ink/80 backdrop-blur">{offer.badge}</span>
            <SavingsBadge percent={percent} className="px-3 py-1.5 text-[13px]" />
          </div>
        </ProductStage>
        {photo && (
          <div className={cn('absolute -bottom-6 hidden aspect-[4/5] w-[30%] overflow-hidden rounded-[18px] border-4 border-paper shadow-[0_24px_50px_-24px_rgba(26,38,32,0.5)] md:block', reverse ? '-left-6' : '-right-6')}>
            <Image src={photo} alt="" fill sizes="220px" className="object-cover" />
          </div>
        )}
      </Link>

      <div>
        {copy && <p className="text-[11.5px] font-semibold uppercase tracking-[0.2em] text-moss">{copy.eyebrow}</p>}
        <h3 className="mt-4 font-display text-[40px] leading-[1.02] text-ink md:text-[54px]">
          <DashTitle text={offer.title} />
        </h3>
        <p className="mt-5 text-[16px] leading-relaxed text-ink/75 md:text-[17px]">
          <Rich text={offer.pitch} />
        </p>
        <FactRow facts={getProductFacts(product.id)} className="mt-7" />
        {copy && copy.forWhom.length > 0 && (
          <ul className="mt-6 space-y-2.5">
            {copy.forWhom.slice(0, 2).map((item) => (
              <li key={item} className="flex gap-3 text-[15px] leading-snug text-ink/80">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-moss text-white">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4 border-t border-line pt-7">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-[30px] font-semibold leading-none tracking-tight text-ink">{formatMoney(variantPrice(variant), countryConfig)}</span>
              {savings > 0 && <span className="text-[15px] text-ink/40 line-through">{formatMoney(variant.price, countryConfig)}</span>}
            </div>
            {savings > 0 && <p className="mt-1.5 text-[13px] font-semibold text-coral">{t('card.you_save', { amount: formatMoney(savings, countryConfig) })}</p>}
          </div>
          <Link
            href={href}
            className="ml-auto inline-flex h-14 items-center justify-center gap-2 rounded-full bg-forest px-8 text-[15px] font-semibold text-paper transition duration-300 hover:bg-ink max-sm:w-full"
          >
            {t('card.order_now')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function OfferCard({
  offer,
  product,
  locale,
  countryConfig,
}: {
  offer: StoreOffer;
  product: Product;
  locale: string;
  countryConfig: CountryConfig;
}) {
  const t = useTranslations('store');
  const variant = defaultVariant(product, locale);
  if (!variant) return null;
  const savings = variantSavings(variant);
  const percent = variantDiscountPercent(variant);
  const { packshot } = getStoreVisual(product);

  return (
    <Link href={`/${locale}/products/${product.slug}`} className="group flex h-full flex-col">
      <ProductStage
        src={packshot}
        alt={offer.title}
        sizes="(max-width: 768px) 100vw, 33vw"
        className="aspect-[5/4] rounded-[22px]"
        imageClassName="group-hover:scale-[1.04]"
      >
        <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
          <span className="rounded-full bg-paper/90 px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/80 backdrop-blur">
            {offer.badge}
          </span>
          <SavingsBadge percent={percent} />
        </div>
      </ProductStage>
      <div className="flex flex-1 flex-col pt-6">
        <p className="font-display text-[30px] leading-[1.05] text-ink md:text-[34px]">
          <DashTitle text={offer.title} />
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-ink/75">
          <Rich text={offer.pitch} />
        </p>
        <FactRow facts={getProductFacts(product.id)} variant="chips" className="mt-4" />
        <div className="mt-auto pt-6">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-[24px] font-semibold tracking-tight text-ink">{formatMoney(variantPrice(variant), countryConfig)}</span>
            {savings > 0 && <span className="text-[14px] text-ink/40 line-through">{formatMoney(variant.price, countryConfig)}</span>}
            {savings > 0 && (
              <span className="text-[13px] font-semibold text-coral">{t('card.you_save', { amount: formatMoney(savings, countryConfig) })}</span>
            )}
          </div>
          {offer.priceNote && <p className="mt-1 text-[13px] text-ink/65">{offer.priceNote}</p>}
          <span className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-forest text-[14.5px] font-semibold text-paper transition duration-300 group-hover:bg-ink">
            {t('card.order_now')}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
