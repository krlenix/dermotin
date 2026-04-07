'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { CountryConfig } from '@/config/countries';
// Using custom modal instead of Dialog component for better visibility control
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  CheckCircle,
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
  XCircle
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
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10">
        <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-slate-950">
        {t('checkout_dialog.processing_order')}
      </h2>
      <p className="text-base text-slate-600">
        {t('checkout_dialog.processing_message')}{dots}
        <br />
        <span className="mt-2 block text-sm text-slate-500">
          {t('checkout_dialog.please_wait')}
        </span>
      </p>
    </div>
  );

  const renderSuccessDialog = () => (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10">
        <CheckCircle className="h-8 w-8 text-brand-green" />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-slate-950">
        {t('checkout_dialog.order_confirmed')}
      </h2>
      <div className="mb-6 text-base text-slate-600">
        <div className="space-y-2">
          <p>{t('checkout_dialog.success_message')}</p>
          {orderData?.orderId && (
            <div className="rounded-2xl border border-brand-green/20 bg-brand-green/5 p-4">
              <p className="text-sm font-medium text-brand-green">
                {t('checkout_dialog.order_number')}: <span className="font-mono">{orderData.orderId}</span>
              </p>
              {orderData.customerName && (
                <p className="mt-1 text-sm text-slate-600">
                  {t('checkout_dialog.customer')}: {orderData.customerName}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mb-6 flex items-center justify-center gap-2 rounded-2xl border border-brand-green/10 bg-brand-green/5 px-4 py-3 text-sm font-medium text-slate-700">
        <ShieldCheck className="h-4 w-4 text-brand-green" />
        {t('order_summary.secure_purchase_guarantee')}
      </div>
      <div className="flex justify-center">
        <Button 
          onClick={onClose}
          className="rounded-xl bg-brand-green px-8 text-white hover:bg-brand-green/90"
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
      <h2 className="mb-2 text-xl font-semibold text-slate-950">
        {t('checkout_dialog.order_failed')}
      </h2>
      <div className="mb-6 text-base text-slate-600">
        <div className="space-y-4">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-red-800">
                  {t('checkout_dialog.error_occurred')}
                </p>
                {errorMessage && (
                  <p className="rounded-xl border bg-red-100 p-2 font-mono text-sm text-red-700">
                    {errorMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h4 className="mb-2 text-sm font-semibold text-slate-900">
              {t('checkout_dialog.need_help')}
            </h4>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-orange" />
                <span>{t('checkout_dialog.contact_email')}: </span>
                <a 
                  href={`mailto:${countryConfig.company.email}`}
                  className="font-medium text-slate-900 underline hover:no-underline"
                >
                  {countryConfig.company.email}
                </a>
              </div>
              {countryConfig.company.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-brand-orange" />
                  <span>{t('checkout_dialog.contact_phone')}: </span>
                  <span className="font-medium text-slate-900">{countryConfig.company.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-3">
        <Button 
          variant="outline"
          onClick={onClose}
          className="rounded-xl px-6"
        >
          {t('checkout_dialog.try_again')}
        </Button>
        <Button 
          onClick={() => window.location.href = `mailto:${countryConfig.company.email}`}
          className="rounded-xl bg-brand-green px-6 text-white hover:bg-brand-green/90"
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
        className="fixed inset-0 bg-slate-950/55 backdrop-blur-sm"
        onClick={type !== 'loading' ? onClose : undefined}
      />
      
      {/* Dialog content */}
      <div 
        className="relative z-10 mx-4 w-[90%] max-w-md rounded-[1.6rem] border border-brand-green/10 bg-white p-6 shadow-[0_28px_80px_rgba(15,23,42,0.18)] animate-in fade-in-0 zoom-in-95 duration-200"
      >
        {/* Close button for non-loading states */}
        {type !== 'loading' && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-20 text-slate-400 transition-colors hover:text-slate-700"
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
