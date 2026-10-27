'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Building2, Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import { getCountryConfig } from '@/config/countries';
import { CookieConsent } from '@/components/features/CookieConsent';
import { ShopHeader } from '@/components/shop/ShopHeader';
import { landerFontClass } from '@/components/store/fonts';
import { LANDER_BG, LanderFooter, Marked, useReveal } from '@/components/store/LanderKit';
import { GreenHero, LanderFaq } from '@/components/store/LanderStore';
import { cn } from '@/lib/utils';

interface ContactPageProps {
  locale: string;
}

type Field = 'name' | 'phone' | 'subject' | 'message';

/**
 * Kontakt u stilu prodajne stranice. Poruka se šalje preko mejl aplikacije kupca
 * (mailto sa popunjenim podacima) — sajt nema server za slanje mejlova.
 */
export default function ContactPage({ locale }: ContactPageProps) {
  const t = useTranslations();
  const countryConfig = getCountryConfig(locale);
  const company = countryConfig.company;
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);
  const [form, setForm] = useState<Record<Field, string>>({ name: '', phone: '', subject: 'general', message: '' });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

  const subjects = ['general', 'product', 'order', 'complaint', 'suggestion'].map((value) => ({ value, label: t(`contact.subject_${value}`) }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const next: Partial<Record<Field, string>> = {};
    if (!form.name.trim()) next.name = t('forms.required_field');
    if (!form.message.trim()) next.message = t('forms.required_field');
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    const subjectLabel = subjects.find((item) => item.value === form.subject)?.label ?? '';
    const lines = [form.message.trim(), '', `${t('contact.form_name')}: ${form.name.trim()}`];
    if (form.phone.trim()) lines.push(`${t('contact.form_phone')}: ${form.phone.trim()}`);
    const body = lines.join('\n');
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(`${subjectLabel} — ${form.name.trim()}`)}&body=${encodeURIComponent(body)}`;
  };

  const input = (field: Field) =>
    cn(
      'w-full rounded-md border bg-white px-4 text-[16px] outline-none transition placeholder:text-[#8a8a8a] focus:border-[#2E8655] focus:ring-2 focus:ring-[#2E8655]/20',
      errors[field] ? 'border-red-400' : 'border-[#d6d6d6]'
    );

  return (
    <div ref={rootRef} className={cn(landerFontClass, 'min-h-screen overflow-x-hidden', LANDER_BG)}>
      <ShopHeader />

      <main className="mx-auto max-w-[1180px] space-y-8 px-3 pb-10 pt-3 md:space-y-12 md:px-6 md:pt-6">
        <GreenHero>
          <h1 className="text-[32px] font-extrabold leading-[1.2] text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.12)] md:text-[46px]">
            <Marked tone="green" animate>{t('contact.page_title')}</Marked>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[16px] font-medium text-white md:text-[18px]">{t('contact.page_subtitle')}</p>
          <p className="mx-auto mt-2 max-w-xl pb-2 text-[14px] text-white/90">{t('contact.response_time_value')}</p>
        </GreenHero>

        {/* ── NAČINI KONTAKTA ──────────────────────────────────── */}
        <section className="grid gap-3 md:grid-cols-3 md:gap-4">
          {company.phone && (
            <a href={`tel:${company.phone}`} className="reveal group rounded-[20px] border-2 border-[#F0735A] bg-white p-5 text-center transition hover:-translate-y-1">
              <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#2E8655] text-white transition group-hover:scale-110">
                <Phone className="h-6 w-6" />
              </span>
              <p className="mt-3 text-[19px] font-bold">{t('faq_ui.call_us')}</p>
              <p className="mt-1 text-[20px] font-extrabold text-[#2E8655]">{company.phone}</p>
              <p className="mt-1 flex items-center justify-center gap-1.5 text-[13px] text-[#555]">
                <Clock className="h-3.5 w-3.5" />
                {t('contact.working_hours_value')}
              </p>
            </a>
          )}
          <a href={`mailto:${company.email}`} className="reveal group rounded-[20px] border-2 border-[#F0735A] bg-white p-5 text-center transition hover:-translate-y-1">
            <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#2E8655] text-white transition group-hover:scale-110">
              <Mail className="h-6 w-6" />
            </span>
            <p className="mt-3 text-[19px] font-bold">{t('faq_ui.send_email')}</p>
            <p className="mt-1 break-all text-[17px] font-extrabold text-[#2E8655]">{company.email}</p>
            <p className="mt-1 text-[13px] text-[#555]">{t('faq_ui.response_time')}</p>
          </a>
          <div className="reveal rounded-[20px] border-2 border-[#F0735A] bg-white p-5 text-center">
            <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#2E8655] text-white">
              <Building2 className="h-6 w-6" />
            </span>
            <p className="mt-3 text-[19px] font-bold">
              {company.name} by {company.legalName}
            </p>
            <p className="mt-1 flex items-start justify-center gap-1.5 text-[14px] text-[#444]">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#2E8655]" />
              {company.address}, {company.postalCode} {company.city}
            </p>
            {(company.taxNumber || company.registrationNumber) && (
              <p className="mt-1 text-[12.5px] text-[#666]">
                {[company.taxNumber && `PIB: ${company.taxNumber}`, company.registrationNumber && `MB: ${company.registrationNumber}`].filter(Boolean).join(' | ')}
              </p>
            )}
          </div>
        </section>

        {/* ── PORUKA ───────────────────────────────────────────── */}
        <section className="reveal mx-auto max-w-2xl rounded-[22px] bg-white p-4 shadow-[0_14px_40px_rgba(0,0,0,0.1)] md:p-8">
          <h2 className="text-center text-[24px] font-extrabold md:text-[30px]">{t('contact.contact_form_title')}</h2>
          <p className="mt-1 text-center text-[14.5px] text-[#555]">{t('contact.contact_form_subtitle')}</p>
          <form onSubmit={submit} noValidate className="mt-6 space-y-4">
            <div>
              <label htmlFor="contact-name" className="mb-1.5 block text-[13px] font-medium text-[#444]">{t('contact.form_name')} *</label>
              <input id="contact-name" autoComplete="name" className={cn(input('name'), 'h-[52px]')} placeholder={t('placeholders.full_name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              {errors.name && <p className="mt-1 text-[12.5px] font-medium text-red-600">{errors.name}</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-phone" className="mb-1.5 block text-[13px] font-medium text-[#444]">{t('contact.form_phone')}</label>
                <input id="contact-phone" type="tel" autoComplete="tel" className={cn(input('phone'), 'h-[52px]')} placeholder={t('placeholders.phone')} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label htmlFor="contact-subject" className="mb-1.5 block text-[13px] font-medium text-[#444]">{t('contact.form_subject')}</label>
                <select id="contact-subject" className={cn(input('subject'), 'h-[52px]')} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                  {subjects.map((subject) => (
                    <option key={subject.value} value={subject.value}>
                      {subject.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="contact-message" className="mb-1.5 block text-[13px] font-medium text-[#444]">{t('contact.form_message')} *</label>
              <textarea id="contact-message" rows={5} className={cn(input('message'), 'py-3')} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              {errors.message && <p className="mt-1 text-[12.5px] font-medium text-red-600">{errors.message}</p>}
            </div>
            <button
              type="submit"
              className="lander-shine flex h-[58px] w-full items-center justify-center gap-2.5 rounded-full bg-[#2E8655] text-[18px] font-bold text-white shadow-[0_6px_0_#1d5434] transition hover:bg-[#2a7349] active:translate-y-[3px] active:shadow-[0_3px_0_#1d5434]"
            >
              <Send className="h-5 w-5" />
              {t('contact.form_submit')}
            </button>
            <p className="text-center text-[12.5px] text-[#666]">{t('contact.mailto_note')}</p>
          </form>
        </section>

        <LanderFaq countryCode={countryConfig.code} />
      </main>

      <LanderFooter countryConfig={countryConfig} locale={locale} className="pb-6" />
      <CookieConsent isEU={countryConfig.isEU} />
    </div>
  );
}
