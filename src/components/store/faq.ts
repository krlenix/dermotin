import { useTranslations } from 'next-intl';
import { getFAQForCountry, type FAQItem } from '@/config/faq';

/** Opšta česta pitanja (dostava, plaćanje, povraćaj…) prevedena za lokal. */
export function useGeneralFaq(countryCode: string): FAQItem[] {
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
