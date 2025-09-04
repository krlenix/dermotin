'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { CountryConfig } from '@/config/countries';
// Using custom modal instead of Dialog component for better visibility control
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Mail, 
  Phone,
  AlertTriangle
} from 'lucide-react';

export type CheckoutDialogType = 'loading' | 'success' | 'error' | null;

interface CheckoutDialogProps {
  type: CheckoutDialogType;
  isOpen: boolean;
  onClose: () => void;
  errorMessage?: string;
  countryConfig: CountryConfig;
  orderData?: {
    orderId?: string;
    customerName?: string;
    totalPrice?: number;
    currency?: string;
  };
}

export function CheckoutDialog({ 
  type, 
  isOpen, 
  onClose, 
  errorMessage,
  countryConfig,
  orderData 
}: CheckoutDialogProps) {
  const t = useTranslations();
  const [dots, setDots] = useState('');

  // Animated dots for loading
  useEffect(() => {
    if (type === 'loading') {
      const interval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, 500);
      return () => clearInterval(interval);
    }
  }, [type]);

  // Lock body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  const renderLoadingDialog = () => (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        {t('checkout_dialog.processing_order')}
      </h2>
      <p className="text-base text-gray-600">
        {t('checkout_dialog.processing_message')}{dots}
        <br />
        <span className="text-sm text-gray-500 mt-2 block">
          {t('checkout_dialog.please_wait')}
        </span>
      </p>
    </div>
  );

  const renderSuccessDialog = () => (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        {t('checkout_dialog.order_confirmed')}
      </h2>
      <div className="text-base text-gray-600 mb-6">
        <div className="space-y-2">
          <p>{t('checkout_dialog.success_message')}</p>
          {orderData?.orderId && (
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <p className="text-sm font-medium text-green-800">
                {t('checkout_dialog.order_number')}: <span className="font-mono">{orderData.orderId}</span>
              </p>
              {orderData.customerName && (
                <p className="text-sm text-green-700 mt-1">
                  {t('checkout_dialog.customer')}: {orderData.customerName}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center">
        <Button 
          onClick={onClose}
          className="bg-green-600 hover:bg-green-700 text-white px-8"
        >
          {t('checkout_dialog.continue')}
        </Button>
      </div>
    </div>
  );

  const renderErrorDialog = () => (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <XCircle className="h-8 w-8 text-red-600" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        {t('checkout_dialog.order_failed')}
      </h2>
      <div className="text-base text-gray-600 mb-6">
        <div className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-red-800">
                  {t('checkout_dialog.error_occurred')}
                </p>
                {errorMessage && (
                  <p className="text-sm text-red-700 font-mono bg-red-100 p-2 rounded border">
                    {errorMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">
              {t('checkout_dialog.need_help')}
            </h4>
            <div className="space-y-2 text-sm text-blue-700">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{t('checkout_dialog.contact_email')}: </span>
                <a 
                  href={`mailto:${countryConfig.company.email}`}
                  className="font-medium underline hover:no-underline"
                >
                  {countryConfig.company.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{t('checkout_dialog.contact_phone')}: </span>
                <span className="font-medium">{countryConfig.company.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-3 justify-center">
        <Button 
          variant="outline"
          onClick={onClose}
          className="px-6"
        >
          {t('checkout_dialog.try_again')}
        </Button>
        <Button 
          onClick={() => window.location.href = `mailto:${countryConfig.company.email}`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6"
        >
          <Mail className="h-4 w-4 mr-2" />
          {t('checkout_dialog.contact_support')}
        </Button>
      </div>
    </div>
  );

  if (!type) return null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={type !== 'loading' ? onClose : undefined}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      />
      
      {/* Dialog content */}
      <div 
        className="relative z-10 w-[90%] max-w-md mx-4 bg-white rounded-lg shadow-2xl border border-gray-200 p-6 animate-in fade-in-0 zoom-in-95 duration-200"
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          borderRadius: '0.5rem',
          padding: '1.5rem'
        }}
      >
        {/* Close button for non-loading states */}
        {type !== 'loading' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-20"
            style={{ zIndex: 20 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        {/* Dialog content */}
        <div>
          {type === 'loading' && renderLoadingDialog()}
          {type === 'success' && renderSuccessDialog()}
          {type === 'error' && renderErrorDialog()}
        </div>
      </div>
    </div>
  );
}
