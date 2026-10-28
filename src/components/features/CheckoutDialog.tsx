'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CountryConfig } from '@/config/countries';
// Sopstveni modal umesto Dialog komponente — bolja kontrola vidljivosti i fokusa
import {
  AlertTriangle,
  CheckCircle,
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
  X,
} from 'lucide-react';

export type CheckoutDialogType = 'loading' | 'success' | 'error' | null;

interface CheckoutDialogProps {
  type: CheckoutDialogType;
  isOpen: boolean;
  onClose: () => void;
  /** Poruka servera (/api/orders vraća srpski tekst) — prikazuje se umesto opšte poruke */
  errorMessage?: string;
  countryConfig: CountryConfig;
  orderData?: {
    orderId?: string;
    customerName?: string;
    totalPrice?: number;
    currency?: string;
  };
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const visible = Boolean(type) && isOpen;

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

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

  // Fokus ulazi u prozor i ostaje u njemu; posle zatvaranja se vraća na dugme koje je poslalo porudžbinu
  useEffect(() => {
    if (!visible) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    return () => {
      if (opener?.isConnected) opener.focus();
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    if (type === 'loading') panelRef.current?.focus();
    else closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && type !== 'loading') {
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;
      if (!panel.contains(current) || current === panel) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, type]);

  const phone = countryConfig.company.phone;

  const renderLoadingDialog = () => (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-mint-soft">
        <Loader2 className="h-8 w-8 text-green motion-safe:animate-spin" aria-hidden />
      </div>
      <h2 id={titleId} className="mb-2 text-balance text-[1.25rem] font-bold leading-snug text-ink">
        {t('checkout_dialog.processing_order')}
      </h2>
      <p id={descriptionId} className="text-[1rem] text-ink-soft">
        {t('checkout_dialog.processing_message')}
        <span aria-hidden>{dots}</span>
      </p>
      <p className="mt-2 text-[0.875rem] text-ink-muted">
        {t('checkout_dialog.please_wait')}
      </p>
    </div>
  );

  const renderSuccessDialog = () => (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-mint-soft">
        <CheckCircle className="h-8 w-8 text-green" aria-hidden />
      </div>
      <h2 id={titleId} className="mb-2 text-balance text-[1.25rem] font-bold leading-snug text-ink">
        {t('checkout_dialog.order_confirmed')}
      </h2>
      <p id={descriptionId} className="text-[1rem] text-ink-soft">
        {t('checkout_dialog.success_message')}
      </p>
      {orderData?.orderId && (
        <div className="mt-4 rounded-panel bg-mint-soft p-4">
          <p className="text-[0.9375rem] font-medium text-forest">
            {t('checkout_dialog.order_number')}: <span className="font-bold tabular-nums">{orderData.orderId}</span>
          </p>
          {orderData.customerName && (
            <p className="mt-1 text-[0.875rem] text-ink-soft">
              {t('checkout_dialog.customer')}: {orderData.customerName}
            </p>
          )}
        </div>
      )}
      <p className="mt-4 flex items-center justify-center gap-2 text-[0.875rem] font-medium text-ink-soft">
        <ShieldCheck className="h-4 w-4 shrink-0 text-green" aria-hidden />
        {t('order_summary.secure_purchase_guarantee')}
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-green px-8 text-[1rem] font-bold text-white transition-colors hover:bg-green-press"
      >
        {t('checkout_dialog.continue')}
      </button>
    </div>
  );

  const renderErrorDialog = () => (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle className="h-8 w-8 text-red-700" aria-hidden />
      </div>
      <h2 id={titleId} className="mb-2 text-balance text-[1.25rem] font-bold leading-snug text-ink">
        {t('checkout_dialog.order_failed')}
      </h2>
      {/* Poruka servera je već na srpskom i kaže šta da se uradi; opšta poruka samo kada je nema */}
      <p id={descriptionId} className="text-[1rem] font-medium text-red-700">
        {errorMessage || t('checkout_dialog.error_occurred')}
      </p>

      <div className="mt-5 rounded-panel bg-paper p-4 text-left">
        <p className="text-[0.9375rem] font-semibold text-ink">
          {t('checkout_dialog.need_help')}
        </p>
        <ul className="mt-2 space-y-1.5 text-[0.9375rem] text-ink-soft">
          {phone && (
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden />
              <span>{t('checkout_dialog.contact_phone')}:</span>
              <a
                href={`tel:${phone.replace(/[^+\d]/g, '')}`}
                className="font-semibold text-forest underline underline-offset-2 hover:no-underline"
              >
                {phone}
              </a>
            </li>
          )}
          <li className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <Mail className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden />
            <span>{t('checkout_dialog.contact_email')}:</span>
            <a
              href={`mailto:${countryConfig.company.email}`}
              className="break-all font-semibold text-forest underline underline-offset-2 hover:no-underline"
            >
              {countryConfig.company.email}
            </a>
          </li>
        </ul>
      </div>

      <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-green px-6 text-[1rem] font-bold text-white transition-colors hover:bg-green-press"
        >
          {t('checkout_dialog.try_again')}
        </button>
        <button
          type="button"
          onClick={() => window.location.href = `mailto:${countryConfig.company.email}`}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-green bg-white px-6 text-[1rem] font-semibold text-forest transition-colors hover:bg-mint-soft"
        >
          <Mail className="h-4 w-4" aria-hidden />
          {t('checkout_dialog.contact_support')}
        </button>
      </div>
    </div>
  );

  if (!type) return null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[220] bg-night/60"
        onClick={type !== 'loading' ? onClose : undefined}
        aria-hidden
      />

      {/* Dialog content */}
      <div
        ref={panelRef}
        role={type === 'error' ? 'alertdialog' : 'dialog'}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        aria-busy={type === 'loading'}
        tabIndex={-1}
        className="relative z-[221] max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-card bg-white p-6 shadow-raised outline-none animate-in fade-in-0 zoom-in-95 duration-200 motion-reduce:animate-none"
      >
        {/* Close button for non-loading states */}
        {type !== 'loading' && (
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t('ui.close')}
            className="absolute right-3 top-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-paper hover:text-ink"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        )}

        {type === 'loading' && renderLoadingDialog()}
        {type === 'success' && renderSuccessDialog()}
        {type === 'error' && renderErrorDialog()}
      </div>
    </div>
  );
}
