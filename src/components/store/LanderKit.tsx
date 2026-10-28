'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRight, Building2, Info, Mail, MapPin, Phone, Star } from 'lucide-react';
import type { CountryConfig } from '@/config/countries';
import type { Mark } from '@/config/lander-content';
import { SOCIAL_LINKS } from '@/config/app-config';
import { LegalDocumentModal } from '@/components/features/LegalDocumentModal';
import { cn } from '@/lib/utils';
import { scrollToOrderForm } from './format';

/*
 * Zajednički delovi stila prodajne stranice (preslikan sa starog dermotin.rs):
 * Poppins, zelena #2E8655, koralna #F0735A, istaknut tekst, „pocepane“ trake, šumska pozadina.
 */

export const LANDER_BG = 'bg-[#EAE9E6] text-[#151515]';

export const FOREST_BG = "bg-[#16241d] bg-[url('/images/lander/Pozadina-Drvece.webp')] bg-cover bg-center";

/** Obojena podloga iza teksta, kao na starom sajtu (radi i kroz više redova). */
export function Marked({ tone, children, animate = false, className }: { tone: Mark; children: React.ReactNode; animate?: boolean; className?: string }) {
  const color = tone === 'green' ? '#2E8655' : '#F0735A';
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
    <span className="inline-flex gap-1 text-[#F5A623]">
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
      <svg viewBox="0 0 1200 24" preserveAspectRatio="none" className="block h-4 w-full text-[#F0735A] md:h-5" aria-hidden>
        <path d={edge} fill="currentColor" />
      </svg>
      <div className="flex justify-center bg-[#F0735A] px-4 py-5 md:py-9">
        <button
          type="button"
          onClick={onClick ?? (() => scrollToOrderForm())}
          className="lander-shine inline-flex h-14 items-center gap-2 rounded-full bg-white px-7 text-[14px] font-semibold uppercase tracking-wide text-[#1f1f1f] shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)] transition hover:scale-[1.03] md:h-[60px] md:px-10 md:text-[15px]"
        >
          <span>{label}</span>
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#1f1f1f] text-white">
            <ArrowRight className="h-3 w-3" strokeWidth={3} />
          </span>
        </button>
      </div>
      <svg viewBox="0 0 1200 24" preserveAspectRatio="none" className="block h-4 w-full rotate-180 text-[#F0735A] md:h-5" aria-hidden>
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
        {/* ── FOOTER ─────────────────────────────────────────────── */}
        <footer className={cn('px-3 md:px-6', className ?? 'pb-24 md:pb-6')}>
          <div className={cn('relative mx-auto max-w-[1180px] overflow-hidden rounded-[22px] px-3 py-8 text-center text-white md:px-10 md:py-10', FOREST_BG)}>
            <div className="absolute inset-0 bg-[#0f1a14]/60" aria-hidden />
            <div className="relative">
              <Image src={countryConfig.logo} alt={tAll('ui.alt_logo')} width={260} height={74} className="mx-auto h-14 w-auto" />
              <p className="mt-4 text-[24px] font-semibold">{t('footer_title')}</p>
              <p className="mx-auto mt-3 max-w-2xl text-[14px] leading-relaxed text-white/90">{tAll('footer.brand_description')}</p>
  
              <div className="mx-auto mt-6 grid max-w-4xl gap-6 rounded-[14px] bg-white p-5 text-left text-[#222] md:grid-cols-3 md:gap-8 md:p-6">
                <ul className="space-y-2 text-[13.5px]">
                  {company.phone && (
                    <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#2E8655]" /><a href={`tel:${company.phone}`}>{company.phone}</a></li>
                  )}
                  <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#2E8655]" /><a href={`mailto:${company.email}`}>{company.email}</a></li>
                  <li className="flex items-center gap-2"><Building2 className="h-4 w-4 text-[#2E8655]" /><span><strong>{company.name}</strong> by {company.legalName}</span></li>
                  <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#2E8655]" />{company.address}, {company.city}</li>
                  {(company.taxNumber || company.registrationNumber) && (
                    <li className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-[#2E8655]" />
                      {[company.taxNumber && `PIB: ${company.taxNumber}`, company.registrationNumber && `MB: ${company.registrationNumber}`].filter(Boolean).join(' | ')}
                    </li>
                  )}
                </ul>
                <div>
                  <p className="text-[19px] font-bold">{t('useful_links')}</p>
                  <ul className="mt-3 space-y-2 text-[13.5px]">
                    {[
                      ['returns-policy', tAll('legal.returns_policy')],
                      ['terms-of-service', tAll('legal.terms_of_service')],
                      ['privacy-policy', tAll('legal.privacy_policy')],
                    ].map(([type, title]) => (
                      <li key={type}>
                        <button type="button" onClick={() => setDoc({ type, title })} className="hover:text-[#2E8655]">
                          {title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[19px] font-bold">{t('follow')}</p>
                  <div className="mt-3 flex gap-2">
                    {Object.entries(SOCIAL_LINKS).map(([name, href]) => (
                      <a
                        key={name}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 items-center justify-center rounded-full bg-[#2E8655] px-3 text-[12px] font-semibold capitalize text-white"
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
 * Snimci pravih komentara: kartice iste visine (bez praznog prostora), strelice na
 * desktopu, a klik otvara ceo komentar preko celog ekrana.
 */
export function ReviewShots({ shots, title }: { shots: Array<[string, number, number]>; title: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<[string, number, number] | null>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  if (shots.length === 0) return null;
  const scroll = (direction: 1 | -1) => trackRef.current?.scrollBy({ left: direction * trackRef.current.clientWidth * 0.8, behavior: 'smooth' });

  return (
    <div className="mt-8">
      <div className="flex items-center justify-center gap-3 md:justify-between">
        <p className="text-[18px] font-bold md:text-[20px]">{title}</p>
        <div className="hidden gap-2 md:flex">
          {([-1, 1] as const).map((direction) => (
            <button
              key={direction}
              type="button"
              onClick={() => scroll(direction)}
              aria-label={direction < 0 ? 'Prethodni' : 'Sledeći'}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#2E8655] text-white transition hover:bg-[#2a7349]"
            >
              <ArrowRight className={cn('h-4 w-4', direction < 0 && 'rotate-180')} />
            </button>
          ))}
        </div>
      </div>
      <div
        ref={trackRef}
        className="-mx-3 mt-4 flex snap-x gap-3 overflow-x-auto px-3 pb-2 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {shots.map((shot) => {
          // Širina prati oblik snimka (fiksna visina) — bez praznog belog prostora
          const width = Math.round(Math.min(340, Math.max(170, (200 * shot[1]) / shot[2])));
          return (
            <button
              key={shot[0]}
              type="button"
              onClick={() => setOpen(shot)}
              style={{ width }}
              className="group relative h-[200px] shrink-0 snap-start overflow-hidden rounded-[14px] border border-[#ddd] bg-white text-left shadow-[0_6px_16px_rgba(0,0,0,0.06)]"
            >
              <Image src={shot[0]} alt="Komentar kupca" fill sizes="340px" className="object-cover object-top transition duration-500 group-hover:scale-[1.03]" />
            </button>
          );
        })}
      </div>
      {open && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 p-4" onClick={() => setOpen(null)} role="dialog" aria-modal="true">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-auto rounded-[14px] bg-white p-2" onClick={(event) => event.stopPropagation()}>
            <Image src={open[0]} alt="Komentar kupca" width={open[1]} height={open[2]} sizes="(max-width: 768px) 100vw, 672px" className="h-auto w-full" />
            <button
              type="button"
              onClick={() => setOpen(null)}
              className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#111]/80 text-[18px] font-bold text-white"
              aria-label="Zatvori"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
