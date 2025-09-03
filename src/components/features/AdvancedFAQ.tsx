'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { getFAQForCountry, FAQItem } from '@/config/faq';
import { getProductFAQ, ProductFAQ, Product } from '@/config/products';
import { useTranslations } from 'next-intl';
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
  Award
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
      warranty_answer: tFaq.raw('warranty_answer')
    }
  };
  
  
  // Use product-specific FAQs if product is provided, otherwise use general FAQs
  const faqItems = product 
    ? getProductFAQ(product)
    : getFAQForCountry(countryCode, translations);

  const toggleItem = (index: string) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'delivery': return <Truck className="h-5 w-5 text-blue-600" />;
      case 'payment': return <CreditCard className="h-5 w-5 text-green-600" />;
      case 'returns': return <Shield className="h-5 w-5 text-blue-600" />;
      case 'product': return <Package className="h-5 w-5 text-orange-600" />;
      // Product-specific categories
      case 'usage': return <Package className="h-5 w-5 text-purple-600" />;
      case 'ingredients': return <Leaf className="h-5 w-5 text-green-600" />;
      case 'effects': return <Award className="h-5 w-5 text-yellow-600" />;
      case 'safety': return <Shield className="h-5 w-5 text-red-600" />;
      case 'storage': return <Package className="h-5 w-5 text-gray-600" />;
      case 'general': return <HelpCircle className="h-5 w-5 text-gray-600" />;
      default: return <HelpCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'delivery': return 'bg-blue-100 text-blue-800';
      case 'payment': return 'bg-green-100 text-green-800';
      case 'returns': return 'bg-blue-100 text-blue-800';
      case 'product': return 'bg-orange-100 text-orange-800';
      // Product-specific categories
      case 'usage': return 'bg-purple-100 text-purple-800';
      case 'ingredients': return 'bg-green-100 text-green-800';
      case 'effects': return 'bg-yellow-100 text-yellow-800';
      case 'safety': return 'bg-red-100 text-red-800';
      case 'storage': return 'bg-gray-100 text-gray-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          {t('faq_ui.title')}
        </h2>
        <p className="text-gray-600">
          {t('faq_ui.subtitle')}
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {(product 
          ? ['usage', 'ingredients', 'effects', 'safety', 'storage', 'general']
          : ['delivery', 'product', 'payment', 'returns', 'general']
        ).map((category) => {
          const count = faqItems.filter(item => item.category === category).length;
          if (count === 0) return null;
          
          return (
            <Badge key={category} variant="secondary" className={`${getCategoryColor(category)} px-3 py-1`}>
              {getCategoryIcon(category)}
              <span className="ml-1 capitalize">
                {category === 'delivery' ? t('faq_ui.delivery') :
                 category === 'product' ? t('faq_ui.product') :
                 category === 'payment' ? t('faq_ui.payment') :
                 category === 'returns' ? t('faq_ui.returns') :
                 category === 'usage' ? t('faq_ui.usage') :
                 category === 'ingredients' ? t('faq_ui.ingredients') :
                 category === 'effects' ? t('faq_ui.effects') :
                 category === 'safety' ? t('faq_ui.safety') :
                 category === 'storage' ? t('faq_ui.storage') :
                 t('faq_ui.general')}
              </span>
              <span className="ml-1">({count})</span>
            </Badge>
          );
        })}
      </div>

      {/* FAQ Items */}
      <div className="space-y-3">
        {faqItems.map((item: FAQItem | ProductFAQ, index: number) => {
          const isOpen = openItems.includes(index.toString());
          
          return (
            <Card 
              key={index} 
              className="border border-gray-200 hover:border-brand-orange/50 transition-colors cursor-pointer py-0"
              onClick={() => toggleItem(index.toString())}
            >
              <CardContent className="p-0">
                <div className="w-full px-3 md:px-4 py-3 flex justify-between items-center hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {getCategoryIcon(item.category)}
                    </div>
                    <span className="font-semibold text-gray-900 text-sm md:text-base leading-tight">{item.question}</span>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    <ChevronDown 
                      className={`h-4 w-4 md:h-5 md:w-5 text-gray-500 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`} 
                    />
                  </div>
                </div>
                
                {isOpen && (
                  <div className="px-3 md:px-4 pb-3 md:pb-4">
                    <div className="border-t border-gray-100 pt-3">
                      <p className="text-gray-700 leading-relaxed text-sm md:text-base">{item.answer}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Contact Section */}
      <Card className="bg-gradient-to-r from-brand-green/10 to-brand-orange/10 border-brand-orange/20">
        <CardContent className="p-3 md:p-4 text-center">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">
            {t('faq_ui.no_answer')}
          </h3>
          <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">
            {t('faq_ui.support_team')}
          </p>
          
          <div className="grid md:grid-cols-2 gap-3 md:gap-4">
            <div className="flex items-center justify-center gap-2 p-2 md:p-3 bg-white rounded-lg">
              <Phone className="h-4 w-4 md:h-5 md:w-5 text-brand-orange flex-shrink-0" />
              <div className="text-left">
                <p className="font-semibold text-xs md:text-sm">{t('faq_ui.call_us')}</p>
                <p className="text-xs md:text-sm text-gray-600">{t('faq_ui.working_hours')}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 p-2 md:p-3 bg-white rounded-lg">
              <Mail className="h-4 w-4 md:h-5 md:w-5 text-brand-orange flex-shrink-0" />
              <div className="text-left">
                <p className="font-semibold text-xs md:text-sm">{t('faq_ui.send_email')}</p>
                <p className="text-xs md:text-sm text-gray-600">{t('faq_ui.response_time')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
