'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Banknote, Leaf, Mail, Minus, Phone, Plus, RotateCcw, Truck } from 'lucide-react';
import { CountryConfig, getDefaultCourier } from '@/config/countries';
import { getFAQForCountry, type FAQItem } from '@/config/faq';
import type { ProductFAQ } from '@/config/types';
import { LegalDocumentModal } from '@/components/features/LegalDocumentModal';
import { CountrySwitcher } from '@/components/features/CountrySwitcher';
import { cn } from '@/lib/utils';
import { formatMoney } from './format';
import { DashTitle } from './Rich';

/* ── Dugmad ─────────────────────────────────────────────────────────────── */
export const btnPrimary =
  'inline-flex h-14 items-center justify-center gap-2 rounded-full bg-forest px-8 text-[15px] font-semibold text-paper transition duration-300 hover:bg-ink active:scale-[0.99]';
export const btnCoral =
  'inline-flex h-14 items-center justify-center gap-2 rounded-full bg-coral px-8 text-[15.5px] font-semibold text-white shadow-[0_14px_30px_-14px_rgba(201,83,58,0.75)] transition duration-300 hover:bg-coral-deep active:scale-[0.99]';
export const btnOutline =
  'inline-flex h-14 items-center justify-center gap-2 rounded-full border border-ink/15 px-8 text-[15px] font-semibold text-ink transition duration-300 hover:border-ink/50';

export function Eyebrow({ children, className, invert = false }: { children: React.ReactNode; className?: string; invert?: boolean }) {
  return (
    <p className={cn('text-[11.5px] font-semibold uppercase tracking-[0.2em]', invert ? 'text-paper/60' : 'text-moss', className)}>
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = 'left',
  invert = false,
  action,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  text?: React.ReactNode;
  align?: 'center' | 'left';
  invert?: boolean;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'mb-10 md:mb-14',
        align === 'center' ? 'mx-auto max-w-3xl text-center' : 'flex flex-col gap-6 md:flex-row md:items-end md:justify-between',
        className
      )}
    >
      <div className={cn(align === 'left' && 'max-w-2xl')}>
        {eyebrow && <Eyebrow invert={invert} className="mb-4">{eyebrow}</Eyebrow>}
        <h2 className={cn('font-display text-[40px] leading-[1.02] md:text-[60px]', invert ? 'text-paper' : 'text-ink')}>
          {typeof title === 'string' ? <DashTitle text={title} accentClassName={invert ? 'text-[#F2A08C]' : 'text-coral'} /> : title}
        </h2>
        {text && (
          <p className={cn('mt-5 text-[16px] leading-relaxed md:text-[17.5px]', invert ? 'text-paper/75' : 'text-ink/75', align === 'center' && 'mx-auto max-w-xl')}>
            {text}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ── Prednosti kupovine ─────────────────────────────────────────────────── */
export function useTrustItems(countryConfig: CountryConfig) {
  const t = useTranslations('store');
  const courier = getDefaultCourier(countryConfig);
  return [
    { icon: Banknote, title: t('trust.cod_title'), text: t('trust.cod_text') },
    {
      icon: Truck,
      title: t('trust.delivery_title', { time: courier.deliveryTime }),
      text: t('trust.delivery_text', { amount: formatMoney(countryConfig.business.freeShippingThreshold, countryConfig) }),
    },
    { icon: RotateCcw, title: t('trust.returns_title', { days: countryConfig.business.returnPeriodDays }), text: t('trust.returns_text') },
    { icon: Leaf, title: t('trust.natural_title'), text: t('trust.natural_text') },
  ];
}

/** Četiri razloga za kupovinu bez rizika — tanka traka sa linijama umesto kartica. */
export function TrustStrip({ countryConfig, className, compact = false }: { countryConfig: CountryConfig; className?: string; compact?: boolean }) {
  const items = useTrustItems(countryConfig);
  return (
    <div className={cn('grid grid-cols-2 border-y border-line lg:grid-cols-4', className)}>
      {items.map(({ icon: Icon, title, text }, index) => (
        <div
          key={title}
          className={cn(
            'flex items-start gap-3 py-5 pr-3',
            compact ? 'lg:py-4' : 'lg:py-7',
            index % 2 === 1 && 'border-l border-line pl-4',
            index >= 2 && 'border-t border-line lg:border-t-0',
            index === 2 && 'lg:border-l lg:pl-4',
            index > 0 && 'lg:pl-6'
          )}
        >
          <Icon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-moss" strokeWidth={1.6} />
          <div className="min-w-0">
            <p className="text-[14px] font-semibold leading-tight text-ink">{title}</p>
            <p className="mt-1 text-[12.5px] leading-snug text-ink/65 md:text-[13px]">{text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Kako poručiti ─────────────────────────────────────────────────────── */
export function HowToOrder({ countryConfig }: { countryConfig: CountryConfig }) {
  const t = useTranslations('store');
  const courier = getDefaultCourier(countryConfig);
  const steps = [
    { title: t('how.step1_title'), text: t('how.step1_text') },
    { title: t('how.step2_title'), text: t('how.step2_text') },
    { title: t('how.step3_title', { time: courier.deliveryTime }), text: t('how.step3_text') },
  ];
  return (
    <ol className="grid border-t border-line md:grid-cols-3">
      {steps.map(({ title, text }, index) => (
        <li key={title} className={cn('py-8 md:pr-10', index > 0 && 'border-t border-line md:border-l md:border-t-0 md:pl-10')}>
          <span className="font-display text-[56px] leading-none text-coral md:text-[72px]">{String(index + 1).padStart(2, '0')}</span>
          <p className="mt-5 text-[19px] font-semibold leading-snug text-ink">{title}</p>
          <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-ink/70">{text}</p>
        </li>
      ))}
    </ol>
  );
}

/** Pečat „bez rizika“ — tekst u krugu oko broja dana. */
export function GuaranteeSeal({ days, className, invert = false }: { days: number; className?: string; invert?: boolean }) {
  const t = useTranslations('store');
  const ring = t('guarantee.seal');
  return (
    <div className={cn('relative aspect-square', className)}>
      <svg viewBox="0 0 200 200" className={cn('absolute inset-0 h-full w-full animate-[spin_40s_linear_infinite] motion-reduce:animate-none', invert ? 'text-paper/70' : 'text-ink/70')} aria-hidden>
        <defs>
          <path id="seal-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        {/* textLength razvlači tekst tačno po obimu kruga (2π·78), bez preklapanja */}
        <text className="fill-current text-[12px] font-semibold uppercase">
          <textPath href="#seal-circle" textLength="486" lengthAdjust="spacing">{ring}</textPath>
        </text>
      </svg>
      <div className={cn('absolute inset-[22%] flex flex-col items-center justify-center rounded-full', invert ? 'bg-paper text-ink' : 'bg-forest text-paper')}>
        <span className="font-display text-[44px] leading-none md:text-[52px]">{days}</span>
        <span className="mt-1 text-[10.5px] font-semibold uppercase tracking-[0.18em] opacity-70">{t('guarantee.days')}</span>
      </div>
    </div>
  );
}

export function GuaranteeBand({ countryConfig }: { countryConfig: CountryConfig }) {
  const t = useTranslations('store');
  const days = countryConfig.business.returnPeriodDays;
  return (
    <div className="grid items-center gap-8 rounded-[28px] bg-sand p-7 md:grid-cols-[auto_1fr] md:gap-14 md:p-12">
      <GuaranteeSeal days={days} className="mx-auto w-40 md:w-48" />
      <div>
        <p className="font-display text-[34px] leading-[1.05] text-ink md:text-[44px]">{t('guarantee.title')}</p>
        <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-ink/75 md:text-[17px]">{t('guarantee.text', { days })}</p>
      </div>
    </div>
  );
}

/* ── FAQ ───────────────────────────────────────────────────────────────── */
function useGeneralFaq(countryCode: string): FAQItem[] {
  const tFaq = useTranslations('faq_ui');
  const keys = [
    'delivery_time', 'delivery_cost', 'cash_on_delivery', 'payment_methods', 'returns',
    'support', 'tracking', 'safety', 'warranty',
  ];
  const faq_ui: Record<string, string> = {};
  for (const key of keys) {
    faq_ui[`${key}_question`] = tFaq.raw(`${key}_question`);
    faq_ui[`${key}_answer`] = tFaq.raw(`${key}_answer`);
  }
  return getFAQForCountry(countryCode, { faq_ui });
}

export function FaqList({
  items,
  className,
  defaultOpen = 0,
}: {
  items: Array<{ question: string; answer: string }>;
  className?: string;
  defaultOpen?: number | null;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  return (
    <div className={cn('border-t border-line', className)}>
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.question} className="border-b border-line">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-6 py-5 text-left md:py-6"
              aria-expanded={isOpen}
            >
              <span className="text-[16px] font-semibold leading-snug text-ink md:text-[18px]">{item.question}</span>
              <span className={cn('inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition', isOpen ? 'border-forest bg-forest text-paper' : 'border-line text-ink/70')}>
                {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </span>
            </button>
            <div className={cn('grid transition-all duration-300 ease-out', isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-6 text-[15px] leading-relaxed text-ink/75 md:text-[16px]">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function StoreFaq({ countryConfig, items, className }: { countryConfig: CountryConfig; items?: Array<FAQItem | ProductFAQ>; className?: string }) {
  const t = useTranslations();
  const general = useGeneralFaq(countryConfig.code);
  const list = items && items.length > 0 ? items : general;
  return (
    <div className={cn('grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20', className)}>
      <div className="lg:sticky lg:top-32 lg:self-start">
        <Eyebrow className="mb-4">FAQ</Eyebrow>
        <h2 className="font-display text-[40px] leading-[1.02] text-ink md:text-[56px]">{t('faq_ui.title')}</h2>
        <p className="mt-5 max-w-sm text-[16px] leading-relaxed text-ink/75">{t('faq_ui.subtitle')}</p>
        <div className="mt-8 space-y-3 text-[14.5px]">
          <p className="font-semibold text-ink">{t('faq_ui.no_answer')}</p>
          {countryConfig.company.phone && (
            <a href={`tel:${countryConfig.company.phone}`} className="flex items-center gap-3 text-ink/70 transition hover:text-ink">
              <Phone className="h-4 w-4 text-moss" strokeWidth={1.6} />
              <span>
                {countryConfig.company.phone}
                <span className="text-ink/45"> · {t('faq_ui.working_hours')}</span>
              </span>
            </a>
          )}
          <a href={`mailto:${countryConfig.company.email}`} className="flex items-center gap-3 text-ink/70 transition hover:text-ink">
            <Mail className="h-4 w-4 text-moss" strokeWidth={1.6} />
            {countryConfig.company.email}
          </a>
        </div>
      </div>
      <FaqList items={list} />
    </div>
  );
}

/* ── Footer ────────────────────────────────────────────────────────────── */
export function StoreFooter({ countryConfig, locale }: { countryConfig: CountryConfig; locale: string }) {
  const t = useTranslations();
  const tStore = useTranslations('store');
  const [doc, setDoc] = useState<{ type: string; title: string } | null>(null);
  const legal: Array<[string, string]> = [
    ['terms-of-service', t('legal.terms_of_service')],
    ['privacy-policy', t('legal.privacy_policy')],
    ['cookie-policy', t('legal.cookie_policy')],
    ['returns-policy', t('legal.returns_policy')],
    ['disclaimer', t('legal.disclaimer')],
    ['contact-info', t('legal.contact_info')],
  ];
  const company = countryConfig.company;

  return (
    <footer className="bg-forest text-paper">
      <div className="container mx-auto px-4 pb-10 pt-16 md:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Image src={countryConfig.logo} alt={t('ui.alt_logo')} width={150} height={42} className="h-8 w-auto brightness-0 invert" />
            <p className="mt-6 max-w-sm text-[14.5px] leading-relaxed text-paper/60">{t('footer.brand_description')}</p>
            <div className="mt-6">
              <CountrySwitcher variant="outline" className="!border-paper/20 !bg-transparent !text-paper hover:!bg-paper/10" />
            </div>
          </div>

          <div>
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.2em] text-paper/45">{tStore('nav.shop')}</p>
            <ul className="mt-5 space-y-3 text-[14.5px] text-paper/75">
              <li><Link href={`/${locale}#akcije`} className="transition hover:text-paper">{tStore('nav.offers')}</Link></li>
              <li><Link href={`/${locale}/products`} className="transition hover:text-paper">{tStore('nav.all_products')}</Link></li>
              <li><Link href={`/${locale}/contact`} className="transition hover:text-paper">{t('navigation.contact')}</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.2em] text-paper/45">{t('footer.company_info')}</p>
            <ul className="mt-5 space-y-3 text-[14.5px] text-paper/75">
              {company.phone && (
                <li><a href={`tel:${company.phone}`} className="transition hover:text-paper">{company.phone}</a></li>
              )}
              <li><a href={`mailto:${company.email}`} className="transition hover:text-paper">{company.email}</a></li>
              <li className="text-paper/55">
                {company.name} {t('footer.powered_by')} {company.legalName}
                <br />
                {company.address}, {company.postalCode} {company.city}
              </li>
              {(company.taxNumber || company.registrationNumber) && (
                <li className="text-paper/55">
                  {[company.taxNumber && `PIB: ${company.taxNumber}`, company.registrationNumber && `MB: ${company.registrationNumber}`].filter(Boolean).join(' · ')}
                </li>
              )}
            </ul>
          </div>

          <div>
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.2em] text-paper/45">{t('footer.legal_documents')}</p>
            <ul className="mt-5 space-y-3 text-[14.5px] text-paper/75">
              {legal.map(([type, title]) => (
                <li key={type}>
                  <button type="button" onClick={() => setDoc({ type, title })} className="text-left transition hover:text-paper">
                    {title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-paper/10 pt-8 text-[13px] text-paper/45 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {company.name}. {t('footer.all_rights_reserved')}</p>
          <p>{tStore('trust.cod_title')} · {tStore('trust.returns_title', { days: countryConfig.business.returnPeriodDays })}</p>
        </div>
      </div>

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
    </footer>
  );
}
