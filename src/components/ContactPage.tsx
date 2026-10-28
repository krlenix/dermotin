'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Building2, ChevronDown, Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import { getCountryConfig } from '@/config/countries';
import { CookieConsent } from '@/components/features/CookieConsent';
import { ShopHeader } from '@/components/shop/ShopHeader';
import { landerFontClass } from '@/components/store/fonts';
import { LANDER_BG, LanderFooter } from '@/components/store/LanderKit';
import { GreenHero, LanderFaq } from '@/components/store/LanderStore';
import { cn } from '@/lib/utils';

interface ContactPageProps {
  locale: string;
}

type Field = 'name' | 'phone' | 'subject' | 'message';

const FORM_ID = 'kontakt';

/**
 * Kontakt u stilu prodajne stranice. Telefon i mejl su glavni kanali (odmah na vrhu);
 * poruka iz forme se šalje preko mejl aplikacije kupca (mailto sa popunjenim podacima) —
 * sajt nema server za slanje mejlova, pa forma jasno kaže šta će se desiti.
 */
export default function ContactPage({ locale }: ContactPageProps) {
  const t = useTranslations();
  const countryConfig = getCountryConfig(locale);
  const company = countryConfig.company;
  // tel: prima samo cifre i + („011/44-100-22“ nije ispravan tel: link na svim telefonima)
  const phoneHref = company.phone ? `tel:${company.phone.replace(/[^\d+]/g, '')}` : null;
  const [form, setForm] = useState<Record<Field, string>>({ name: '', phone: '', subject: 'general', message: '' });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

  const subjects = ['general', 'product', 'order', 'complaint', 'suggestion'].map((value) => ({ value, label: t(`contact.subject_${value}`) }));

  const update = (field: Field, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const next: Partial<Record<Field, string>> = {};
    if (!form.name.trim()) next.name = t('store.form.error_name');
    if (!form.message.trim()) next.message = t('contact.error_message');
    setErrors(next);
    const firstInvalid = (['name', 'message'] as const).find((field) => next[field]);
    if (firstInvalid) {
      document.getElementById(`${FORM_ID}-${firstInvalid}`)?.focus();
      return;
    }
    const subjectLabel = subjects.find((item) => item.value === form.subject)?.label ?? '';
    const lines = [form.message.trim(), '', `${t('contact.form_name')}: ${form.name.trim()}`];
    if (form.phone.trim()) lines.push(`${t('contact.form_phone')}: ${form.phone.trim()}`);
    const body = lines.join('\n');
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(`${subjectLabel} — ${form.name.trim()}`)}&body=${encodeURIComponent(body)}`;
  };

  // Polja kao u QuickOrderForm: labela iznad, greška ispod (povezana aria-describedby), fokus green-press
  const inputClass = (field: Field) =>
    cn(
      'w-full rounded-md border bg-white px-4 text-[1rem] text-ink outline-none transition placeholder:text-ink-muted focus:border-green-press focus:ring-2 focus:ring-green-press/25',
      errors[field] ? 'border-red-600 bg-red-50/40' : 'border-line'
    );

  const fieldProps = (field: Field, required = false) => ({
    id: `${FORM_ID}-${field}`,
    name: field,
    'aria-required': required || undefined,
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errors[field] ? `${FORM_ID}-${field}-error` : undefined,
  });

  const label = (field: Field, text: string, mark?: 'required' | 'optional') => (
    <label htmlFor={`${FORM_ID}-${field}`} className="mb-1.5 block text-[0.875rem] font-medium text-ink-soft">
      {text}
      {mark === 'required' && <span aria-hidden> *</span>}
      {mark === 'optional' && <span className="font-normal text-ink-muted"> ({t('forms.optional')})</span>}
    </label>
  );

  const fieldError = (field: Field) =>
    errors[field] ? (
      <p id={`${FORM_ID}-${field}-error`} className="mt-1.5 text-[0.8125rem] font-medium text-red-700">
        {errors[field]}
      </p>
    ) : null;

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <div className={cn(landerFontClass, 'min-h-screen overflow-x-hidden', LANDER_BG)}>
      <ShopHeader />

      <main className="mx-auto max-w-[1180px] space-y-8 px-3 pb-10 pt-3 md:space-y-12 md:px-6 md:pt-6">
        {/* ── DIREKTAN KONTAKT: poziv i mejl odmah na vrhu ─────── */}
        <GreenHero>
          <h1 className="text-balance text-[1.875rem] font-extrabold leading-[1.22] text-ink md:text-[2.625rem]">{t('contact.page_title')}</h1>
          <p className="mx-auto mt-3 max-w-xl text-balance text-[1rem] text-ink-soft md:text-[1.125rem]">{t('contact.page_subtitle')}</p>

          <div className="mx-auto mt-6 grid max-w-md gap-3 pb-4">
            {phoneHref && (
              <>
                <a
                  href={phoneHref}
                  className="flex min-h-16 items-center justify-center gap-3 rounded-full bg-green px-6 text-white shadow-card transition hover:bg-green-press"
                >
                  <Phone className="h-6 w-6 shrink-0" aria-hidden />
                  <span className="text-left leading-tight">
                    <span className="block text-[0.875rem] font-medium">{t('faq_ui.call_us')}</span>
                    <span className="block text-[1.5rem] font-extrabold">{company.phone}</span>
                  </span>
                </a>
                <p className="flex items-center justify-center gap-1.5 text-[0.875rem] text-ink-soft">
                  <Clock className="h-4 w-4 shrink-0 text-forest" aria-hidden />
                  {t('contact.working_hours_value')}
                </p>
              </>
            )}
            <a
              href={`mailto:${company.email}`}
              className="mt-1 flex min-h-14 items-center justify-center gap-2.5 rounded-full border-2 border-green bg-white px-5 text-[1rem] font-semibold text-forest transition hover:bg-mint-soft"
            >
              <Mail className="h-5 w-5 shrink-0" aria-hidden />
              <span className="[overflow-wrap:anywhere]">{company.email}</span>
            </a>
            <p className="text-[0.875rem] font-semibold text-forest">{t('contact.response_time_value')}</p>
          </div>
        </GreenHero>

        <div className="grid items-start gap-5 md:grid-cols-[minmax(0,1fr)_20rem] md:gap-6">
          {/* ── PORUKA (otvara mejl aplikaciju kupca) ───────────── */}
          <section aria-labelledby={`${FORM_ID}-title`} className="rounded-card bg-white p-4 shadow-card md:p-8">
            <h2 id={`${FORM_ID}-title`} className="text-balance text-[1.5rem] font-extrabold leading-tight md:text-[1.875rem]">
              {t('contact.contact_form_title')}
            </h2>
            <p className="mt-1.5 text-[0.9375rem] text-ink-soft">{t('contact.contact_form_subtitle')}</p>
            <p className="mt-1 text-[0.8125rem] text-ink-muted">{t('contact.required_fields')}</p>

            <form id={FORM_ID} onSubmit={submit} noValidate className="mt-6 space-y-4">
              <p className="sr-only" aria-live="polite">
                {errorCount > 0 ? t('store.form.check_fields') : ''}
              </p>

              <div>
                {label('name', t('contact.form_name'), 'required')}
                <input
                  {...fieldProps('name', true)}
                  autoComplete="name"
                  className={cn(inputClass('name'), 'h-[52px]')}
                  placeholder={t('store.form.full_name_placeholder')}
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                />
                {fieldError('name')}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  {label('phone', t('contact.form_phone'), 'optional')}
                  <input
                    {...fieldProps('phone')}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    className={cn(inputClass('phone'), 'h-[52px]')}
                    placeholder={t('store.form.phone_placeholder')}
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                  />
                </div>
                <div>
                  {label('subject', t('contact.form_subject'))}
                  <div className="relative">
                    <select
                      {...fieldProps('subject')}
                      className={cn(inputClass('subject'), 'min-h-[52px] appearance-none pr-11')}
                      value={form.subject}
                      onChange={(e) => update('subject', e.target.value)}
                    >
                      {subjects.map((subject) => (
                        <option key={subject.value} value={subject.value}>
                          {subject.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted" aria-hidden />
                  </div>
                </div>
              </div>

              <div>
                {label('message', t('contact.form_message'), 'required')}
                <textarea
                  {...fieldProps('message', true)}
                  rows={5}
                  className={cn(inputClass('message'), 'resize-y py-3 leading-relaxed')}
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                />
                {fieldError('message')}
              </div>

              <button
                type="submit"
                aria-describedby={`${FORM_ID}-mailto-note`}
                className="flex min-h-14 w-full items-center justify-center gap-2.5 rounded-full bg-green px-5 text-[1.125rem] font-bold text-white transition hover:bg-green-press"
              >
                <Send className="h-5 w-5 shrink-0" aria-hidden />
                {t('contact.form_submit')}
              </button>
              <p id={`${FORM_ID}-mailto-note`} className="text-center text-[0.875rem] leading-relaxed text-ink-soft">
                {t('contact.mailto_note', { email: company.email })}
              </p>
            </form>
          </section>

          {/* ── FIRMA ───────────────────────────────────────────── */}
          <section aria-labelledby="kontakt-firma-title" className="rounded-card bg-white p-5 shadow-card md:p-6">
            <h2 id="kontakt-firma-title" className="flex items-center gap-2.5 text-[1.125rem] font-extrabold">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green text-white" aria-hidden>
                <Building2 className="h-[18px] w-[18px]" />
              </span>
              {t('contact.office_address')}
            </h2>
            <div className="mt-4 divide-y divide-line border-y border-line text-[0.9375rem]">
              {/* Brend + pravno lice, bez ponavljanja kada naziv firme već sadrži brend */}
              <p className="py-3 font-bold">
                {company.legalName.toLowerCase().includes(company.name.toLowerCase()) ? company.legalName : `${company.name.toUpperCase()} — ${company.legalName}`}
              </p>
              <p className="flex items-start gap-2 py-3 text-ink-soft">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green" aria-hidden />
                <span>
                  {company.address}, {company.postalCode} {company.city}
                </span>
              </p>
              {(company.taxNumber || company.registrationNumber) && (
                <p className="py-3 text-[0.8125rem] text-ink-muted">
                  {[company.taxNumber && `PIB: ${company.taxNumber.trim()}`, company.registrationNumber && `MB: ${company.registrationNumber}`].filter(Boolean).join(' | ')}
                </p>
              )}
            </div>
          </section>
        </div>

        <LanderFaq countryCode={countryConfig.code} />
      </main>

      <LanderFooter countryConfig={countryConfig} locale={locale} className="pb-6" />
      <CookieConsent isEU={countryConfig.isEU} />
    </div>
  );
}
