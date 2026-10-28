'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRight, Building2, Info, Mail, MapPin, Maximize2, Phone, Star, X } from 'lucide-react';
import type { CountryConfig } from '@/config/countries';
import type { LanderContent, Mark } from '@/config/lander-content';
import { SOCIAL_LINKS } from '@/config/app-config';
import { LegalDocumentModal } from '@/components/features/LegalDocumentModal';
import { cn } from '@/lib/utils';
import { scrollToOrderForm } from './format';

/*
 * Zajednički delovi stila prodajne stranice (preslikan sa starog dermotin.rs):
 * Poppins, zelena i koralna iz tokena (globals.css), istaknut tekst, „pocepane“ trake,
 * šumska pozadina. Pravila boja i kontrasta: DESIGN.md.
 */

export const LANDER_BG = 'bg-mist text-ink';

export const FOREST_BG = "bg-night bg-[url('/images/lander/Pozadina-Drvece.webp')] bg-cover bg-center";

/** Obojena podloga iza teksta, kao na starom sajtu (radi i kroz više redova). Samo za krupan tekst. */
export function Marked({ tone, children, animate = false, className }: { tone: Mark; children: React.ReactNode; animate?: boolean; className?: string }) {
  const color = tone === 'green' ? 'var(--color-green)' : 'var(--color-coral)';
  return (
    <span
      className={cn(
        // Podloga je visoka 84% „kutije“ slova (Poppins ≈ 1,4em) ≈ 1,18em — staje u red i ne prekriva susedne redove
        'lander-mark rounded-[6px] px-[0.18em] text-white [box-decoration-break:clone] [-webkit-box-decoration-break:clone]',
        animate && 'lander-mark-anim',
        className
      )}
      style={{ backgroundImage: `linear-gradient(${color}, ${color})` }}
    >
      {children}
    </span>
  );
}

/** Oznake u porukama: <g>zeleno</g>, <c>koralno</c>, <b>podebljano</b> */
export const richTags = {
  g: (chunks: React.ReactNode) => <Marked tone="green">{chunks}</Marked>,
  c: (chunks: React.ReactNode) => <Marked tone="coral">{chunks}</Marked>,
  b: (chunks: React.ReactNode) => <strong className="font-bold">{chunks}</strong>,
};

/** **tekst** iz lander-content.ts → podebljano */
export function Bold({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/).map((part, index) =>
        part.startsWith('**') ? <strong key={index} className="font-bold">{part.slice(2, -2)}</strong> : <span key={index}>{part}</span>
      )}
    </>
  );
}

export function Stars({ size = 22 }: { size?: number }) {
  return (
    <span className="inline-flex gap-1 text-star" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} style={{ width: size, height: size }} className="fill-current" strokeWidth={0} />
      ))}
    </span>
  );
}

/** Srpska množina: 1 bočica, 2–4 bočice, 5+ bočica */
export function plural(n: number, forms: string) {
  const [one, few, many] = forms.split('|');
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

/** Pojavljivanje sekcija pri skrolovanju (.reveal) — samo kada je JS aktivan. */
export function useReveal(rootRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const all = Array.from(root.querySelectorAll<HTMLElement>('.reveal'));
    if (!('IntersectionObserver' in window)) return;
    // Sve što je već na ekranu ili iznad njega ostaje vidljivo; animira se samo ono ispod
    const fold = window.innerHeight * 0.92;
    all.filter((item) => item.getBoundingClientRect().top < fold).forEach((item) => item.classList.add('is-visible'));
    const items = all.filter((item) => !item.classList.contains('is-visible'));
    root.classList.add('lander-js');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [rootRef]);
}

/** „30.000+“ broji naviše kada se pojavi na ekranu (srpski separator hiljada). */
export function CountUp({ value }: { value: string }) {
  const target = Number(value.replace(/[^\d]/g, '')) || 0;
  const [current, setCurrent] = useState(target);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / 1600);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCurrent(Math.round(target * eased));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        setCurrent(0);
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target]);
  return <span ref={ref}>{current.toLocaleString('de-DE')}</span>;
}

/** Procena isporuke: danas + 1–2 radna dana (računa se u browseru zbog vremenske zone). */
export function useDeliveryRange() {
  const [range, setRange] = useState<string | null>(null);
  useEffect(() => {
    const addBusinessDays = (from: Date, days: number) => {
      const date = new Date(from);
      let added = 0;
      while (added < days) {
        date.setDate(date.getDate() + 1);
        if (date.getDay() !== 0 && date.getDay() !== 6) added++;
      }
      return date;
    };
    const format = new Intl.DateTimeFormat('sr-Latn-RS', { weekday: 'short', day: 'numeric', month: 'short' });
    const today = new Date();
    setRange(`${format.format(addBusinessDays(today, 1))} – ${format.format(addBusinessDays(today, 2))}`);
  }, []);
  return range;
}

/** Koralna traka sa „pocepanim“ ivicama i belim dugmetom. */
export function TornBand({ label, className, onClick }: { label: React.ReactNode; className?: string; onClick?: () => void }) {
  const edge = 'M0,18 L40,6 L70,14 L110,4 L150,16 L190,7 L230,15 L270,3 L320,13 L360,6 L400,17 L450,5 L490,14 L530,8 L580,16 L620,4 L660,13 L700,6 L750,15 L790,5 L830,14 L880,7 L920,16 L960,4 L1000,13 L1050,6 L1090,15 L1130,5 L1170,12 L1200,6 L1200,24 L0,24 Z';
  return (
    <div className={cn('relative', className)}>
      <svg viewBox="0 0 1200 24" preserveAspectRatio="none" className="block h-4 w-full text-coral md:h-5" aria-hidden>
        <path d={edge} fill="currentColor" />
      </svg>
      <div className="flex justify-center bg-coral px-4 py-5 md:py-9">
        <button
          type="button"
          onClick={onClick ?? (() => scrollToOrderForm())}
          className="inline-flex min-h-14 items-center gap-2 rounded-full bg-white px-7 text-[0.875rem] font-semibold uppercase tracking-wide text-ink shadow-float transition hover:scale-[1.03] md:min-h-[60px] md:px-10 md:text-[0.9375rem]"
        >
          <span>{label}</span>
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-ink text-white">
            <ArrowRight className="h-3 w-3" strokeWidth={3} aria-hidden />
          </span>
        </button>
      </div>
      <svg viewBox="0 0 1200 24" preserveAspectRatio="none" className="block h-4 w-full rotate-180 text-coral md:h-5" aria-hidden>
        <path d={edge} fill="currentColor" />
      </svg>
    </div>
  );
}

/** Footer: tamna šumska kartica sa kontaktom, pravnim dokumentima i mrežama. */
export function LanderFooter({ countryConfig, locale, className }: { countryConfig: CountryConfig; locale: string; className?: string }) {
  const t = useTranslations('store.lander');
  const tAll = useTranslations();
  const [doc, setDoc] = useState<{ type: string; title: string } | null>(null);
  const company = countryConfig.company;
  return (
    <>
      <footer className={cn('px-3 md:px-6', className ?? 'pb-24 md:pb-6')}>
        <div className={cn('relative mx-auto max-w-[1180px] overflow-hidden rounded-card px-3 py-8 text-center text-white md:px-10 md:py-10', FOREST_BG)}>
          <div className="absolute inset-0 bg-night/60" aria-hidden />
          <div className="relative">
            <Image src={countryConfig.logo} alt={tAll('ui.alt_logo')} width={260} height={74} className="mx-auto h-14 w-auto" />
            <p className="mt-4 text-[1.5rem] font-semibold">{t('footer_title')}</p>
            <p className="mx-auto mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-white">{tAll('footer.brand_description')}</p>

            <div className="mx-auto mt-6 grid max-w-4xl gap-6 rounded-panel bg-white p-5 text-left text-ink md:grid-cols-3 md:gap-8 md:p-6">
              <ul className="space-y-2.5 text-[0.9375rem]">
                {company.phone && (
                  <li className="flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0 text-green" aria-hidden />
                    <a href={`tel:${company.phone}`} className="font-semibold underline decoration-green/40 hover:decoration-green">{company.phone}</a>
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-green" aria-hidden />
                  <a href={`mailto:${company.email}`} className="underline decoration-green/40 hover:decoration-green">{company.email}</a>
                </li>
                <li className="flex items-center gap-2"><Building2 className="h-4 w-4 shrink-0 text-green" aria-hidden /><span><strong>{company.name}</strong> by {company.legalName}</span></li>
                <li className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0 text-green" aria-hidden />{company.address}, {company.city}</li>
                {(company.taxNumber || company.registrationNumber) && (
                  <li className="flex items-center gap-2">
                    <Info className="h-4 w-4 shrink-0 text-green" aria-hidden />
                    {[company.taxNumber && `PIB: ${company.taxNumber}`, company.registrationNumber && `MB: ${company.registrationNumber}`].filter(Boolean).join(' | ')}
                  </li>
                )}
              </ul>
              <div>
                <p className="text-[1.125rem] font-bold">{t('useful_links')}</p>
                <ul className="mt-2 text-[0.9375rem]">
                  {[
                    ['returns-policy', tAll('legal.returns_policy')],
                    ['terms-of-service', tAll('legal.terms_of_service')],
                    ['privacy-policy', tAll('legal.privacy_policy')],
                  ].map(([type, title]) => (
                    <li key={type}>
                      <button
                        type="button"
                        onClick={() => setDoc({ type, title })}
                        className="min-h-11 py-2 text-left underline decoration-ink/20 underline-offset-4 hover:text-forest hover:decoration-green"
                      >
                        {title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[1.125rem] font-bold">{t('follow')}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.entries(SOCIAL_LINKS).map(([name, href]) => (
                    <a
                      key={name}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center justify-center rounded-full bg-green px-4 text-[0.875rem] font-semibold capitalize text-white transition hover:bg-green-press"
                    >
                      {name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {doc && (
        <LegalDocumentModal
          isOpen
          onClose={() => setDoc(null)}
          documentType={doc.type}
          documentTitle={doc.title}
          countryConfig={countryConfig}
          locale={locale}
        />
      )}
    </>
  );
}

/**
 * Svedočanstva: na telefonu prevlačenje i tačkice (samo listanje koje se zaustavlja čim kupac
 * dodirne ili fokusira karusel, i nikad uz „smanjen pokret“), na desktopu dve kolone.
 */
export function TestimonialCarousel({ items, yearsForms, label }: { items: LanderContent['testimonials']; yearsForms: string; label: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length < 2) return;
    if (window.matchMedia('(min-width: 768px), (prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const next = (active + 1) % items.length;
      const child = track.children[next] as HTMLElement | undefined;
      if (child) track.scrollTo({ left: child.offsetLeft - track.offsetLeft - 12, behavior: 'smooth' });
    }, 6000);
    return () => window.clearInterval(id);
  }, [active, paused, items.length]);

  return (
    <>
      <div
        ref={trackRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        onTouchStart={() => setPaused(true)}
        onPointerDown={() => setPaused(true)}
        onFocus={() => setPaused(true)}
        onScroll={(event) => {
          const track = event.currentTarget;
          const width = (track.children[0] as HTMLElement | undefined)?.offsetWidth ?? track.clientWidth;
          setActive(Math.min(items.length - 1, Math.round(track.scrollLeft / (width + 16))));
        }}
        className="-mx-3 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-3 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => (
          <figure key={`${item.name}-${index}`} className="w-[85%] shrink-0 snap-center md:w-auto">
            <blockquote className="relative rounded-panel border-2 border-coral bg-white px-5 py-5 text-left text-[0.9375rem] leading-relaxed shadow-card md:px-7">
              <Stars size={15} />
              <span className="mt-2 block">{item.text}</span>
              <span className="absolute -bottom-[11px] left-1/2 h-5 w-5 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-coral bg-white" aria-hidden />
            </blockquote>
            <figcaption className="mt-6 flex items-center justify-center gap-3">
              {item.photo ? (
                <span className="relative h-14 w-14 overflow-hidden rounded-full border-[3px] border-green">
                  <Image src={item.photo} alt="" fill sizes="56px" className="object-cover" />
                </span>
              ) : (
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-green text-[1.25rem] font-bold text-white" aria-hidden>
                  {item.name.charAt(0)}
                </span>
              )}
              <span className="text-left">
                <span className="block text-[0.9375rem] font-bold">{item.name}</span>
                {item.age && (
                  <span className="block text-[0.8125rem] text-ink-muted">
                    {item.age} {plural(Number(item.age) || 0, yearsForms)}
                  </span>
                )}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      {items.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5 md:hidden" aria-hidden>
          {items.map((item, index) => (
            <span key={`${item.name}-dot-${index}`} className={cn('h-2 rounded-full transition-all', index === active ? 'w-6 bg-green' : 'w-2 bg-green/25')} />
          ))}
        </div>
      )}
    </>
  );
}

/**
 * Snimci pravih komentara: kartice iste visine (bez praznog prostora), strelice na
 * desktopu, a klik otvara ceo komentar preko celog ekrana (Esc ili × zatvara, fokus se vraća).
 */
export function ReviewShots({ shots, title }: { shots: Array<[string, number, number]>; title: string }) {
  const t = useTranslations('store.lander');
  const tUi = useTranslations('ui');
  const trackRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(null);
      // Fokus ostaje u prozoru (jedino dugme je „zatvori“)
      if (event.key === 'Tab') {
        event.preventDefault();
        closeRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    const opener = openerRef.current;
    return () => {
      window.removeEventListener('keydown', onKey);
      opener?.focus();
    };
  }, [open]);

  if (shots.length === 0) return null;
  const scroll = (direction: 1 | -1) => trackRef.current?.scrollBy({ left: direction * trackRef.current.clientWidth * 0.8, behavior: 'smooth' });
  const alt = (index: number) => t('shot_alt', { n: index + 1, total: shots.length });
  const current = open === null ? null : shots[open];

  return (
    <div className="mt-8">
      <div className="flex items-center justify-center gap-3 md:justify-between">
        <div className="text-center md:text-left">
          <p className="text-[1.125rem] font-bold md:text-[1.25rem]">{title}</p>
          <p className="text-[0.8125rem] text-ink-muted">{t('zoom_hint')}</p>
        </div>
        <div className="hidden gap-2 md:flex">
          {([-1, 1] as const).map((direction) => (
            <button
              key={direction}
              type="button"
              onClick={() => scroll(direction)}
              aria-label={direction < 0 ? tUi('previous') : tUi('next')}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-green text-white transition hover:bg-green-press"
            >
              <ArrowRight className={cn('h-4 w-4', direction < 0 && 'rotate-180')} aria-hidden />
            </button>
          ))}
        </div>
      </div>
      <div
        ref={trackRef}
        className="-mx-3 mt-4 flex snap-x gap-3 overflow-x-auto px-3 pb-2 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {shots.map((shot, index) => {
          // Širina prati oblik snimka (fiksna visina) — bez praznog belog prostora
          const width = Math.round(Math.min(340, Math.max(170, (200 * shot[1]) / shot[2])));
          return (
            <button
              key={shot[0]}
              type="button"
              onClick={(event) => {
                openerRef.current = event.currentTarget;
                setOpen(index);
              }}
              style={{ width }}
              aria-label={alt(index)}
              className="group relative h-[200px] shrink-0 snap-start overflow-hidden rounded-panel border border-line bg-white text-left shadow-card"
            >
              <Image src={shot[0]} alt="" fill sizes="340px" className="object-cover object-top transition duration-500 group-hover:scale-[1.03]" />
              <span className="absolute bottom-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink/75 text-white" aria-hidden>
                <Maximize2 className="h-4 w-4" />
              </span>
            </button>
          );
        })}
      </div>
      {current && open !== null && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
          aria-label={alt(open)}
        >
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-auto rounded-panel bg-white p-2" onClick={(event) => event.stopPropagation()}>
            <Image src={current[0]} alt={alt(open)} width={current[1]} height={current[2]} sizes="(max-width: 768px) 100vw, 672px" className="h-auto w-full" />
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(null)}
              className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-ink/85 text-white"
              aria-label={tUi('close')}
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
