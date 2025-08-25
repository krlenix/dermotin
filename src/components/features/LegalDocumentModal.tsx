'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import { CountryConfig } from '@/config/countries';
import { useTranslations } from 'next-intl';

interface LegalDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: string;
  documentTitle: string;
  countryConfig: CountryConfig;
  locale: string;
}

export function LegalDocumentModal({
  isOpen,
  onClose,
  documentType,
  documentTitle,
  countryConfig,
  locale
}: LegalDocumentModalProps) {
  const t = useTranslations();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  // Mobile close button text
  const mobileCloseButtonText = t('ui.close') || 'Zatvori';

  useEffect(() => {
    if (isOpen && documentType) {
      loadDocument();
    }
  }, [isOpen, documentType, countryConfig, locale]);

  const loadDocument = async () => {
    setLoading(true);
    try {
      // Fetch the template file
      const response = await fetch(`/api/legal-document?type=${documentType}&locale=${locale}`);
      if (!response.ok) {
        throw new Error('Failed to load document');
      }
      
      const template = await response.text();
      
      // Process placeholders
      const processedContent = processTemplate(template, countryConfig);
      setContent(processedContent);
    } catch (error) {
      console.error('Error loading legal document:', error);
      setContent('Greška pri učitavanju dokumenta. Molimo pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  };

  const processTemplate = (template: string, config: CountryConfig): string => {
    let processed = template;

    // Process company placeholders
    processed = processed.replace(/\{\{company\.name\}\}/g, config.company.name);
    processed = processed.replace(/\{\{company\.legalName\}\}/g, config.company.legalName);
    processed = processed.replace(/\{\{company\.address\}\}/g, config.company.address);
    processed = processed.replace(/\{\{company\.city\}\}/g, config.company.city);
    processed = processed.replace(/\{\{company\.postalCode\}\}/g, config.company.postalCode);
    processed = processed.replace(/\{\{company\.country\}\}/g, config.company.country);
    processed = processed.replace(/\{\{company\.taxNumber\}\}/g, config.company.taxNumber);
    processed = processed.replace(/\{\{company\.registrationNumber\}\}/g, config.company.registrationNumber);
    processed = processed.replace(/\{\{company\.phone\}\}/g, config.company.phone);
    processed = processed.replace(/\{\{company\.email\}\}/g, config.company.email);
    processed = processed.replace(/\{\{company\.website\}\}/g, config.company.website);
    processed = processed.replace(/\{\{company\.activityCode\}\}/g, config.company.activityCode);
    processed = processed.replace(/\{\{company\.activityDescription\}\}/g, config.company.activityDescription);

    // Process business placeholders
    processed = processed.replace(/\{\{business\.deliveryArea\}\}/g, config.business.deliveryArea);
    processed = processed.replace(/\{\{business\.deliveryService\}\}/g, config.business.deliveryService);
    processed = processed.replace(/\{\{business\.deliveryServiceName\}\}/g, config.business.deliveryServiceName);
    processed = processed.replace(/\{\{business\.deliveryCost\}\}/g, config.business.deliveryCost.toString());
    processed = processed.replace(/\{\{business\.deliveryCostCurrency\}\}/g, config.business.deliveryCostCurrency);
    processed = processed.replace(/\{\{business\.deliveryTimeMin\}\}/g, config.business.deliveryTimeMin.toString());
    processed = processed.replace(/\{\{business\.deliveryTimeMax\}\}/g, config.business.deliveryTimeMax.toString());
    processed = processed.replace(/\{\{business\.deliveryTimeUnit\}\}/g, config.business.deliveryTimeUnit);
    processed = processed.replace(/\{\{business\.returnPeriodDays\}\}/g, config.business.returnPeriodDays.toString());
    processed = processed.replace(/\{\{business\.warrantyPeriodYears\}\}/g, config.business.warrantyPeriodYears.toString());
    processed = processed.replace(/\{\{business\.complaintResponseDays\}\}/g, config.business.complaintResponseDays.toString());
    processed = processed.replace(/\{\{business\.complaintResolutionDays\}\}/g, config.business.complaintResolutionDays.toString());
    processed = processed.replace(/\{\{business\.technicalComplaintResolutionDays\}\}/g, config.business.technicalComplaintResolutionDays.toString());

    // Process legal placeholders
    processed = processed.replace(/\{\{legal\.lastUpdated\}\}/g, config.legal.lastUpdated);
    processed = processed.replace(/\{\{legal\.copyrightLaw\}\}/g, config.legal.copyrightLaw);
    processed = processed.replace(/\{\{legal\.criminalCode\}\}/g, config.legal.criminalCode);
    processed = processed.replace(/\{\{legal\.consumerProtectionLaw\}\}/g, config.legal.consumerProtectionLaw);
    processed = processed.replace(/\{\{legal\.dataProtectionLaw\}\}/g, config.legal.dataProtectionLaw);
    processed = processed.replace(/\{\{legal\.obligationsLaw\}\}/g, config.legal.obligationsLaw);
    processed = processed.replace(/\{\{legal\.ministryWebsite\}\}/g, config.legal.ministryWebsite);
    processed = processed.replace(/\{\{legal\.disputeResolutionListUrl\}\}/g, config.legal.disputeResolutionListUrl);

    // Process courier placeholders
    processed = processed.replace(/\{\{courier\.name\}\}/g, config.courier.name);
    processed = processed.replace(/\{\{courier\.deliveryTime\}\}/g, config.courier.deliveryTime);
    processed = processed.replace(/\{\{courier\.trackingUrl\}\}/g, config.courier.trackingUrl || '');

    // Process fulfillment center placeholders (if available)
    if (config.fulfillmentCenter) {
      processed = processed.replace(/\{\{fulfillmentCenter\.name\}\}/g, config.fulfillmentCenter.name);
      processed = processed.replace(/\{\{fulfillmentCenter\.legalName\}\}/g, config.fulfillmentCenter.legalName);
      processed = processed.replace(/\{\{fulfillmentCenter\.address\}\}/g, config.fulfillmentCenter.address);
      processed = processed.replace(/\{\{fulfillmentCenter\.city\}\}/g, config.fulfillmentCenter.city);
      processed = processed.replace(/\{\{fulfillmentCenter\.country\}\}/g, config.fulfillmentCenter.country);
      processed = processed.replace(/\{\{fulfillmentCenter\.email\}\}/g, config.fulfillmentCenter.email);
      processed = processed.replace(/\{\{fulfillmentCenter\.phone\}\}/g, config.fulfillmentCenter.phone);
      processed = processed.replace(/\{\{fulfillmentCenter\.dataRetentionPeriod\}\}/g, config.fulfillmentCenter.dataRetentionPeriod.toString());
      processed = processed.replace(/\{\{fulfillmentCenter\.dataProcessingPurpose\}\}/g, config.fulfillmentCenter.dataProcessingPurpose);
    }

    // Process country-level placeholders
    processed = processed.replace(/\{\{country\.name\}\}/g, config.name);
    processed = processed.replace(/\{\{country\.currency\}\}/g, config.currency);
    processed = processed.replace(/\{\{country\.currencySymbol\}\}/g, config.currencySymbol);

    return processed;
  };



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="w-[95vw] max-w-[95vw] md:w-[50vw] md:max-w-[50vw] max-h-[90vh] p-0 !bg-white border shadow-lg z-[100]" 
        showCloseButton={false}
      >
        <DialogHeader className="p-6 pb-0 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-900">{documentTitle}</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2 hover:bg-gray-100 text-gray-600 hover:text-gray-900"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="px-6 pb-6 bg-white">
          <ScrollArea className="h-[70vh] w-full rounded-md border border-gray-200 p-4 bg-white">
            {loading ? (
              <div className="flex items-center justify-center h-32 bg-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 bg-white min-h-full">
                {content}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Mobile Sticky Close Button - Full Width */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 z-[110]">
          <Button
            onClick={onClose}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white py-4 rounded-lg shadow-lg flex items-center justify-center gap-2 text-lg font-medium"
          >
            <X className="h-5 w-5" />
            {mobileCloseButtonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
