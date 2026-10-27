'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowDown, ChevronLeft, ChevronRight, Quote, ShieldCheck, Star } from 'lucide-react';
import type { CountryConfig } from '@/config/countries';
import type { ProductProof, Registration, Testimonial } from '@/config/store-proof';
import { cn } from '@/lib/utils';
import { formatMoney, scrollToOrderForm } from './format';
import { DashTitle } from './Rich';

function Stars({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <span className={cn('inline-flex gap-0.5 text-[#F2A93B]', className)} aria-label="5/5">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} style={{ width: size, height: size }} className="fill-current" strokeWidth={0} />
      ))}
    </span>
  );
}

const AVATAR_TONES = ['bg-moss', 'bg-coral', 'bg-forest', 'bg-[#B98B5E]'];

function Avatar({ name, index, className }: { name: string; index: number; className?: string }) {
  const initial = name.trim().charAt(0).toUpperCase();
  return (
    <span className={cn('inline-flex items-center justify-center rounded-full font-semibold text-white ring-2 ring-paper', AVATAR_TONES[index % AVATAR_TONES.length], className)}>
      {initial}
    </span>
  );
}

/** Kratka linija ispod naslova: zvezdice + broj kupaca (kao na starom sajtu). */
export function ProofSummary({
  proof,
  className,
}: {
  proof: Pick<ProductProof, 'testimonials' | 'years' | 'customers' | 'reviewsCount'>;
  className?: string;
}) {
  const t = useTranslations('store.proof');
  const names = proof.testimonials.map((item) => item.name).filter((name) => !name.startsWith('Kupac')).slice(0, 3);
  return (
    <a href="#utisci" className={cn('group inline-flex flex-wrap items-center gap-x-3 gap-y-1.5', className)}>
      <span className="flex -space-x-2">
        {(names.length > 0 ? names : ['D', 'M', 'J']).map((name, index) => (
          <Avatar key={`${name}-${index}`} name={name} index={index} className="h-7 w-7 text-[11px]" />
        ))}
      </span>
      <Stars size={16} />
      <span className="w-full text-[14px] text-ink/80 sm:w-auto">
        <strong className="font-semibold text-ink">{t('customers_line', { years: proof.years, customers: proof.customers })}</strong>
        <span className="ml-1.5 text-ink/50 underline decoration-ink/20 underline-offset-4 transition group-hover:text-ink">
          · {proof.reviewsCount} {t('reviews_label')}
        </span>
      </span>
    </a>
  );
}

/** „Akcijska cena“ — velika cena u tamnom okviru, kao na starom sajtu. */
export function PriceBox({
  price,
  regular,
  savings,
  percent,
  countryConfig,
  note,
  className,
}: {
  price: number;
  regular: number;
  savings: number;
  percent: number;
  countryConfig: CountryConfig;
  note?: string;
  className?: string;
}) {
  const t = useTranslations('store');
  return (
    <div className={cn('relative overflow-hidden rounded-[22px] bg-forest p-5 text-paper sm:p-6', className)}>
      <div className="flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="inline-flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-[#F2A08C]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#F2A08C]" />
            {t('proof.price_label')} · {t('proof.urgency')}
          </p>
          <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-1">
            <span className="font-display text-[52px] leading-[0.9] sm:text-[60px]">{formatMoney(price, countryConfig)}</span>
            {savings > 0 && <span className="pb-1 text-[16px] text-paper/45 line-through">{formatMoney(regular, countryConfig)}</span>}
          </div>
          {savings > 0 && (
            <p className="mt-2 text-[14px] font-semibold text-[#F2A08C]">{t('pdp.you_save', { amount: formatMoney(savings, countryConfig) })}</p>
          )}
          {note && <p className="mt-1 text-[12.5px] text-paper/55">{note}</p>}
        </div>
        {percent > 0 && (
          <span className="flex h-[84px] w-[84px] shrink-0 rotate-[8deg] flex-col items-center justify-center rounded-full bg-coral text-white shadow-[0_14px_30px_-12px_rgba(0,0,0,0.5)] sm:h-24 sm:w-24">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] opacity-90">{t('card.save')}</span>
            <span className="font-display text-[34px] leading-none sm:text-[38px]">{percent}%</span>
          </span>
        )}
      </div>
    </div>
  );
}

function TestimonialCard({ item, index }: { item: Testimonial; index: number }) {
  const meta = [item.age ? `${item.age} god.` : null, item.city].filter(Boolean).join(', ');
  return (
    <figure className="flex h-full flex-col rounded-[24px] border border-line bg-white p-6 md:p-7">
      <div className="flex items-center justify-between">
        <Stars size={18} />
        <Quote className="h-7 w-7 text-coral/25" />
      </div>
      <blockquote className="mt-4 flex-1 text-[15.5px] leading-relaxed text-ink/85 md:text-[16px]">„{item.text}“</blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
        <Avatar name={item.name} index={index} className="h-10 w-10 text-[15px]" />
        <span>
          <span className="block text-[14.5px] font-semibold text-ink">{item.name}</span>
          {meta && <span className="block text-[13px] text-ink/55">{meta}</span>}
        </span>
      </figcaption>
    </figure>
  );
}

/** Utisci kupaca: brojke, svedočanstva i zid sa snimcima pravih komentara. */
export function ReviewsShowcase({
  proof,
  className,
}: {
  proof: Pick<ProductProof, 'customers' | 'years' | 'reviewsCount' | 'testimonials' | 'shots'>;
  className?: string;
}) {
  const t = useTranslations('store.proof');
  const trackRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: 1 | -1) => trackRef.current?.scrollBy({ left: direction * trackRef.current.clientWidth * 0.8, behavior: 'smooth' });

  return (
    <section id="utisci" className={cn('scroll-mt-28', className)}>
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.2em] text-moss">{t('reviews_eyebrow')}</p>
            <h2 className="mt-4 font-display text-[44px] leading-[1.02] text-ink md:text-[64px]">
              <DashTitle text={t('reviews_title')} />
            </h2>
          </div>
          <dl className="grid grid-cols-3 overflow-hidden rounded-[22px] border border-line bg-white">
            <div className="px-4 py-5 text-center md:px-8">
              <dt className="font-display text-[38px] leading-none text-coral md:text-[48px]">{proof.customers}</dt>
              <dd className="mt-2 text-[12px] leading-tight text-ink/65 md:text-[13px]">{t('satisfied')}</dd>
            </div>
            <div className="border-l border-line px-4 py-5 text-center md:px-8">
              <dt className="font-display text-[38px] leading-none text-coral md:text-[48px]">{proof.reviewsCount}</dt>
              <dd className="mt-2 text-[12px] leading-tight text-ink/65 md:text-[13px]">{t('reviews_label')}</dd>
            </div>
            <div className="border-l border-line px-4 py-5 text-center md:px-8">
              <dt className="flex items-center justify-center gap-1.5 font-display text-[38px] leading-none text-coral md:text-[48px]">
                5<Star className="h-6 w-6 fill-[#F2A93B] text-[#F2A93B] md:h-7 md:w-7" strokeWidth={0} />
              </dt>
              <dd className="mt-2 text-[12px] leading-tight text-ink/65 md:text-[13px]">{t('rating_label')}</dd>
            </div>
          </dl>
        </div>

        {proof.testimonials.length > 0 && (
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-5">
            {proof.testimonials.slice(0, 6).map((item, index) => (
              <TestimonialCard key={`${item.name}-${index}`} item={item} index={index} />
            ))}
          </div>
        )}
      </div>

      {proof.shots.length > 0 && (
        <div className="mt-16">
          <div className="container mx-auto mb-6 flex items-end justify-between gap-4 px-4">
            <p className="font-display text-[28px] leading-tight text-ink md:text-[36px]">{t('shots_title')}</p>
            <div className="hidden shrink-0 gap-2 md:flex">
              <button type="button" onClick={() => scroll(-1)} aria-label="Prethodni" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink transition hover:border-ink">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button type="button" onClick={() => scroll(1)} aria-label="Sledeći" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink transition hover:border-ink">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] md:px-[max(1rem,calc((100vw-1400px)/2+1rem))] [&::-webkit-scrollbar]:hidden"
          >
            {proof.shots.map(([src, width, height]) => (
              <div key={src} className="w-[260px] shrink-0 snap-start self-start overflow-hidden rounded-[18px] border border-line bg-white shadow-[0_18px_40px_-28px_rgba(26,38,32,0.45)] md:w-[300px]">
                <Image src={src} alt="Komentar kupca" width={width} height={height} sizes="300px" className="h-auto max-h-[460px] w-full object-cover object-top" />
              </div>
            ))}
          </div>
          <p className="container mx-auto mt-4 px-4 text-[14px] font-medium text-ink/65">{t('reviews_more', { count: proof.reviewsCount })}</p>
        </div>
      )}
    </section>
  );
}

function RegistrationCard({ registration }: { registration: Registration | null }) {
  const t = useTranslations('store.proof');
  const ministry = registration?.kind === 'ministry';
  const lab = registration?.kind === 'lab';
  return (
    <div className="rounded-[24px] border-2 border-dashed border-moss/40 bg-white p-6 md:p-7">
      <div className="flex items-start gap-5">
        <div className="relative h-16 w-14 shrink-0">
          <Image
            src={ministry ? '/images/regulatory/serbian-coat-of-arms.png' : '/images/regulatory/eu-flag.png'}
            alt=""
            fill
            sizes="56px"
            className="object-contain"
          />
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold uppercase leading-snug tracking-[0.08em] text-moss">
            {ministry ? t('ministry_title') : lab ? t('lab_title') : t('cpsr_title')}
          </p>
          {lab && <p className="mt-2 text-[14px] leading-relaxed text-ink/70">{t('lab_text')}</p>}
          {!ministry && !lab && <p className="mt-2 text-[14px] leading-relaxed text-ink/70">{t('cpsr_text')}</p>}
          {registration && (
            <>
              {ministry && <p className="mt-2 text-[13px] text-ink/60">{t('ministry_number')}:</p>}
              <p className="mt-2 inline-flex rounded-full bg-moss px-4 py-1.5 text-[15px] font-semibold tracking-wide text-white">{registration.number}</p>
              <p className="mt-2 text-[12.5px] italic text-ink/55">
                {t('date_label')}: {registration.date}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/** Garancija povraćaja novca + upis/sertifikat + tri provere (blok sa starog sajta). */
export function GuaranteeProof({ proof, className }: { proof: ProductProof; className?: string }) {
  const t = useTranslations('store.proof');
  const registrations: Array<Registration | null> = proof.registrations.length > 0 ? proof.registrations : [null];
  return (
    <div className={cn('grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-8', className)}>
      <div className="relative overflow-hidden rounded-[28px] bg-forest p-7 text-paper md:p-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
          <div className="relative aspect-square w-36 shrink-0 md:w-44">
            <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-[spin_40s_linear_infinite] text-paper/70 motion-reduce:animate-none" aria-hidden>
              <defs>
                <path id="money-seal" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
              </defs>
              <text className="fill-current text-[11.5px] font-semibold uppercase">
                <textPath href="#money-seal" textLength="486" lengthAdjust="spacing">{t('guarantee_seal')}</textPath>
              </text>
            </svg>
            <div className="absolute inset-[22%] flex flex-col items-center justify-center rounded-full bg-coral text-white">
              <span className="font-display text-[40px] leading-none md:text-[48px]">100%</span>
            </div>
          </div>
          <div>
            <p className="font-display text-[36px] leading-[1.02] md:text-[48px]">
              <DashTitle text={t('guarantee_title')} accentClassName="text-[#F2A08C]" />
            </p>
            <p className="mt-4 text-[15.5px] leading-relaxed text-paper/80 md:text-[16.5px]">{t('guarantee_text', { unit: proof.guaranteeUnit })}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {registrations.map((registration, index) => (
          <RegistrationCard key={registration?.number ?? index} registration={registration} />
        ))}
        <ul className="space-y-3 rounded-[24px] border border-line bg-white p-6">
          {[t('check_1'), t('check_2'), t('check_3')].map((item) => (
            <li key={item} className="flex items-center gap-3 text-[15.5px] text-ink/85">
              <ShieldCheck className="h-5 w-5 shrink-0 text-moss" strokeWidth={1.8} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Koralna traka sa pozivom na porudžbinu između sekcija. */
export function CtaBand({ price, countryConfig }: { price: number; countryConfig: CountryConfig }) {
  const t = useTranslations('store.proof');
  return (
    <section className="bg-coral text-white">
      <div className="container mx-auto flex flex-col items-center gap-5 px-4 py-10 text-center md:flex-row md:justify-between md:py-12 md:text-left">
        <p className="font-display text-[34px] italic leading-[1.05] md:text-[46px]">
          <DashTitle text={t('cta_band_title')} accentClassName="text-white/80" />
        </p>
        <button
          type="button"
          onClick={() => scrollToOrderForm()}
          className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-8 text-[15.5px] font-semibold text-coral-deep shadow-[0_16px_32px_-16px_rgba(0,0,0,0.45)] transition hover:scale-[1.02]"
        >
          {t('cta_band')} · {formatMoney(price, countryConfig)}
          <ArrowDown className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

/** Tanka koralna traka hitnosti iznad sadržaja stranice. */
export function UrgencyStrip({ savings, countryConfig }: { savings: number; countryConfig: CountryConfig }) {
  const t = useTranslations('store');
  return (
    <button
      type="button"
      onClick={() => scrollToOrderForm()}
      className="flex w-full items-center justify-center gap-2.5 bg-coral px-4 py-2.5 text-[13px] font-medium text-white md:text-[14px]"
    >
      <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
      <span className="font-semibold uppercase tracking-[0.12em]">{t('proof.urgency')}</span>
      <span className="hidden sm:inline">· {t('proof.urgency_text')}</span>
      {savings > 0 && <span className="font-semibold">· {t('pdp.you_save', { amount: formatMoney(savings, countryConfig) })}</span>}
    </button>
  );
}
