'use client';

import { useState } from 'react';
import { getFAQForCountry, FAQItem } from '@/config/faq';
import type { ProductFAQ, Product } from '@/config/types';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  Truck,
  CreditCard,
  Shield,
  Package,
  HelpCircle,
  Phone,
  Mail,
  Leaf,
  Award,
} from 'lucide-react';

interface AdvancedFAQProps {
  countryCode: string;
  className?: string;
  product?: Product; // Optional: if provided, show product-specific FAQs
}

export function AdvancedFAQ({ countryCode, className, product }: AdvancedFAQProps) {
  const t = useTranslations();
  const tFaq = useTranslations('faq_ui');
  const [openItems, setOpenItems] = useState<string[]>(['0']); // First item open by default

  // Create a proper translations object by manually building it
  // This bypasses the useTranslations issue by creating the structure we need
  const translations = {
    faq_ui: {
      delivery_time_question: tFaq.raw('delivery_time_question'),
      delivery_time_answer: tFaq.raw('delivery_time_answer'),
      delivery_cost_question: tFaq.raw('delivery_cost_question'),
      delivery_cost_answer: tFaq.raw('delivery_cost_answer'),
      cash_on_delivery_question: tFaq.raw('cash_on_delivery_question'),
      cash_on_delivery_answer: tFaq.raw('cash_on_delivery_answer'),
      payment_methods_question: tFaq.raw('payment_methods_question'),
      payment_methods_answer: tFaq.raw('payment_methods_answer'),
      returns_question: tFaq.raw('returns_question'),
      returns_answer: tFaq.raw('returns_answer'),
      support_question: tFaq.raw('support_question'),
      support_answer: tFaq.raw('support_answer'),
      tracking_question: tFaq.raw('tracking_question'),
      tracking_answer: tFaq.raw('tracking_answer'),
      safety_question: tFaq.raw('safety_question'),
      safety_answer: tFaq.raw('safety_answer'),
      warranty_question: tFaq.raw('warranty_question'),
      warranty_answer: tFaq.raw('warranty_answer'),
    },
  };

  // Use product-specific FAQs if product is provided, otherwise use general FAQs
  const faqItems = product ? product.productFAQ || [] : getFAQForCountry(countryCode, translations);

  const toggleItem = (index: string) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'delivery':
        return <Truck className="h-4 w-4" />;
      case 'payment':
        return <CreditCard className="h-4 w-4" />;
      case 'returns':
        return <Shield className="h-4 w-4" />;
      case 'product':
        return <Package className="h-4 w-4" />;
      case 'usage':
        return <Package className="h-4 w-4" />;
      case 'ingredients':
        return <Leaf className="h-4 w-4" />;
      case 'effects':
        return <Award className="h-4 w-4" />;
      case 'safety':
        return <Shield className="h-4 w-4" />;
      case 'storage':
        return <Package className="h-4 w-4" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'delivery':
        return t('faq_ui.delivery');
      case 'product':
        return t('faq_ui.product');
      case 'payment':
        return t('faq_ui.payment');
      case 'returns':
        return t('faq_ui.returns');
      case 'usage':
        return t('faq_ui.usage');
      case 'ingredients':
        return t('faq_ui.ingredients');
      case 'effects':
        return t('faq_ui.effects');
      case 'safety':
        return t('faq_ui.safety');
      case 'storage':
        return t('faq_ui.storage');
      default:
        return t('faq_ui.general');
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Section header */}
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#358055]">FAQ</p>
        <h2 className="mt-2 text-3xl font-black leading-tight text-slate-950 md:text-4xl">
          {t('faq_ui.title')}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-slate-600 md:text-lg">
          {t('faq_ui.subtitle')}
        </p>
      </div>

      {/* FAQ Items */}
      <div className="space-y-3">
        {faqItems.map((item: FAQItem | ProductFAQ, index: number) => {
          const isOpen = openItems.includes(index.toString());

          return (
            <div
              key={index}
              className={cn(
                'overflow-hidden rounded-[1.4rem] border bg-white transition-all duration-300',
                isOpen
                  ? 'border-[#358055]/25 shadow-[0_16px_40px_rgba(26,54,42,0.07)]'
                  : 'border-[#358055]/12 hover:border-[#358055]/25'
              )}
            >
              <button
                type="button"
                onClick={() => toggleItem(index.toString())}
                className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-[#358055]/[0.04] md:px-5"
                aria-expanded={isOpen}
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span
                    className={cn(
                      'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors',
                      isOpen ? 'bg-[#358055] text-white' : 'bg-[#358055]/10 text-[#358055]'
                    )}
                  >
                    {getCategoryIcon(item.category)}
                  </span>
                  <span className="text-sm font-bold leading-snug text-slate-900 md:text-base">
                    {item.question}
                  </span>
                </div>
                <span
                  className={cn(
                    'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-200',
                    isOpen
                      ? 'rotate-180 border-[#358055]/25 bg-[#358055]/8 text-[#358055]'
                      : 'border-[#358055]/12 bg-white text-slate-400'
                  )}
                >
                  <ChevronDown className="h-4 w-4" />
                </span>
              </button>

              <div
                className={cn(
                  'grid transition-all duration-300 ease-in-out',
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                )}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-[#358055]/10 px-4 py-4 md:px-5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#358055]/8 px-3 py-1 text-[11px] font-bold text-[#2f6f4a]">
                      {getCategoryLabel(item.category)}
                    </span>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contact CTA */}
      <div className="rounded-[1.6rem] border border-[#358055]/12 bg-[linear-gradient(135deg,rgba(53,128,85,0.07),rgba(243,118,93,0.06))] p-5 text-center md:p-6">
        <h3 className="text-lg font-black text-slate-950 md:text-xl">{t('faq_ui.no_answer')}</h3>
        <p className="mt-1.5 text-sm text-slate-600 md:text-base">{t('faq_ui.support_team')}</p>

        <div className="mt-4 grid gap-3 md:grid-cols-2 md:gap-4">
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-white/70 bg-white px-4 py-3.5 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3765D]/10">
              <Phone className="h-[18px] w-[18px] text-[#F3765D]" />
            </span>
            <div className="text-left">
              <p className="text-sm font-bold text-slate-900">{t('faq_ui.call_us')}</p>
              <p className="text-xs text-slate-500 md:text-sm">{t('faq_ui.working_hours')}</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 rounded-2xl border border-white/70 bg-white px-4 py-3.5 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3765D]/10">
              <Mail className="h-[18px] w-[18px] text-[#F3765D]" />
            </span>
            <div className="text-left">
              <p className="text-sm font-bold text-slate-900">{t('faq_ui.send_email')}</p>
              <p className="text-xs text-slate-500 md:text-sm">{t('faq_ui.response_time')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
