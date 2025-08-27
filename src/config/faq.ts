import { getFAQContent } from './app-config';
import { getCountryConfig } from './countries';

export interface FAQItem {
  question: string;
  answer: string;
  category: 'delivery' | 'product' | 'payment' | 'returns' | 'general';
}

export interface CountryFAQ {
  [countryCode: string]: FAQItem[];
}

// FAQ template structure - defines which FAQs to generate
export interface FAQTemplate {
  key: string;
  category: 'delivery' | 'product' | 'payment' | 'returns' | 'general';
  questionKey: string; // Translation key for question
  answerKey: string;   // Translation key for answer template
}

// Define all available FAQ templates - countries can pick which ones to show
export const ALL_FAQ_TEMPLATES: Record<string, FAQTemplate> = {
  delivery_time: { key: 'delivery_time', category: 'delivery', questionKey: 'faq_ui.delivery_time_question', answerKey: 'faq_ui.delivery_time_answer' },
  delivery_cost: { key: 'delivery_cost', category: 'delivery', questionKey: 'faq_ui.delivery_cost_question', answerKey: 'faq_ui.delivery_cost_answer' },
  cash_on_delivery: { key: 'cash_on_delivery', category: 'payment', questionKey: 'faq_ui.cash_on_delivery_question', answerKey: 'faq_ui.cash_on_delivery_answer' },
  payment_methods: { key: 'payment_methods', category: 'payment', questionKey: 'faq_ui.payment_methods_question', answerKey: 'faq_ui.payment_methods_answer' },
  returns: { key: 'returns', category: 'returns', questionKey: 'faq_ui.returns_question', answerKey: 'faq_ui.returns_answer' },
  support: { key: 'support', category: 'general', questionKey: 'faq_ui.support_question', answerKey: 'faq_ui.support_answer' },
  tracking: { key: 'tracking', category: 'delivery', questionKey: 'faq_ui.tracking_question', answerKey: 'faq_ui.tracking_answer' },
  safety: { key: 'safety', category: 'general', questionKey: 'faq_ui.safety_question', answerKey: 'faq_ui.safety_answer' },
  warranty: { key: 'warranty', category: 'returns', questionKey: 'faq_ui.warranty_question', answerKey: 'faq_ui.warranty_answer' },
  // More FAQ items can be added here and countries can choose which ones to display
  shipping_international: { key: 'shipping_international', category: 'delivery', questionKey: 'faq_ui.shipping_international_question', answerKey: 'faq_ui.shipping_international_answer' },
  bulk_orders: { key: 'bulk_orders', category: 'general', questionKey: 'faq_ui.bulk_orders_question', answerKey: 'faq_ui.bulk_orders_answer' }
};

// Get FAQ templates for a specific country (based on country configuration)
export function getFAQTemplatesForCountry(countryCode: string): FAQTemplate[] {
  const countryConfig = getCountryConfig(countryCode);
  return countryConfig.business.faqItems.map(key => ALL_FAQ_TEMPLATES[key]).filter(Boolean);
}

// Dynamic FAQ generation function - now completely modular and country-configurable
export function generateFAQData(countryCode: string, translations: Record<string, unknown>): FAQItem[] {
  const faqContent = getFAQContent(countryCode);
  const faqTemplates = getFAQTemplatesForCountry(countryCode);
  
  return faqTemplates.map(template => {
    // Get question from translations
    const question = getNestedTranslation(translations, template.questionKey);
    
    // Get answer template from translations and replace placeholders
    let answer = getNestedTranslation(translations, template.answerKey);
    
    // Replace placeholders with dynamic data
    answer = replacePlaceholders(answer, faqContent);
    
    return {
      question,
      answer,
      category: template.category
    };
  });
}

// Helper function to get nested translation keys (e.g., 'faq_ui.delivery_time_question')
function getNestedTranslation(translations: Record<string, unknown>, key: string): string {
  const keys = key.split('.');
  let value: unknown = translations;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      console.warn(`Translation key not found: ${key}`, { translations, keys, currentKey: k });
      return key; // Return the key itself as fallback
    }
  }
  
  return typeof value === 'string' ? value : key;
}

// Helper function to replace placeholders in answer templates
function replacePlaceholders(template: string, faqContent: Record<string, unknown>): string {
  if (!template || typeof template !== 'string') {
    console.warn('Invalid template provided to replacePlaceholders:', template);
    return template || '';
  }

  // Debug logging to help identify placeholder issues
  if (template.includes('{freeShippingThreshold}')) {
    console.log('FAQ Debug - Replacing freeShippingThreshold:', {
      template,
      freeShippingThreshold: (faqContent as Record<string, Record<string, unknown>>)?.delivery?.freeShippingThreshold,
      delivery: faqContent?.delivery
    });
  }

  try {
    const content = faqContent as Record<string, Record<string, unknown>>;
    return template
      .replace('{deliveryTime}', (content?.delivery?.time as string) || 'N/A')
      .replace('{deliveryArea}', (content?.delivery?.area as string) || 'N/A')
      .replace('{cost}', (content?.delivery?.cost as string) || 'N/A')
      .replace('{currency}', (content?.delivery?.currency as string) || 'N/A')
      .replace('{threshold}', (content?.delivery?.freeShippingThreshold as string) || 'N/A')
      .replace('{freeShippingThreshold}', (content?.delivery?.freeShippingThreshold as string) || 'N/A')
      .replace('{currencySymbol}', (content?.delivery?.currencySymbol as string) || 'N/A')
      .replace('{periodDays}', (content?.returns?.periodDays as string) || 'N/A')
      .replace('{phone}', (content?.company?.phone as string) || 'N/A')
      .replace('{email}', (content?.company?.email as string) || 'N/A')
      .replace('{paymentMethods}', Array.isArray(content?.payment?.methods) ? (content.payment.methods as string[]).join(', ') : (content?.payment?.methods as string) || 'N/A');
  } catch (error) {
    console.error('Error replacing placeholders:', error, { template, faqContent });
    return template;
  }
}

// This will be populated dynamically by the FAQ component
export const FAQ_DATA: CountryFAQ = {};

export function getFAQForCountry(countryCode: string, translations?: Record<string, unknown>): FAQItem[] {
  // If translations are provided, generate FAQ dynamically
  if (translations) {
    try {
      return generateFAQData(countryCode, translations);
    } catch (error) {
      console.warn('Error generating FAQ with translations, falling back to empty FAQ:', error);
    }
  }
  
  // If no translations provided, return empty array
  // The component should handle loading translations properly
  console.warn(`No translations provided for FAQ in country: ${countryCode}`);
  return [];
}

export function getFAQByCategory(countryCode: string, category: string, translations?: Record<string, unknown>): FAQItem[] {
  return getFAQForCountry(countryCode, translations).filter(item => item.category === category);
}
