'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { Banknote, Check, Lock, ShieldCheck, Tag, Truck, X } from 'lucide-react';

import { PhoneInput } from '@/components/ui/phone-input';
import { CheckoutDialog, CheckoutDialogType } from '@/components/features/CheckoutDialog';
import { usePixelTracking } from '@/components/tracking/PixelTracker';
import { COUNTRIES, CountryConfig, getDefaultCourier } from '@/config/countries';
import { calculateCouponDiscount, validateCouponWithAPI, type Coupon } from '@/config/coupons';
import { calculateShippingCost } from '@/utils/shipping';
import { checkoutEventId, completeCheckoutAttempt } from '@/utils/checkout-event';
import { getFacebookTrackingData } from '@/utils/facebook-cookies';
import { getMarketingCookies } from '@/utils/marketing-cookies';
import { clearCouponCookie, getActiveCouponCode } from '@/utils/coupon-cookies';
import { cn } from '@/lib/utils';
import { formatMoney } from './format';

export interface QuickOrderLine {
  productId: string;
  variantId: string;
  sku: string;
  productName: string;
  variantName: string;
  image: string;
  /** Charged unit price (discount price when available) */
  unitPrice: number;
  regularPrice: number;
  quantity: number;
}

interface QuickOrderFormProps {
  countryConfig: CountryConfig;
  lines: QuickOrderLine[];
  /** Viber i drugi kanali van plaćenih društvenih mreža: bez pixela, bez CAPI-ja. */
  channel?: 'viber';
  /** utm_campaign / naziv kampanje za OMS atribuciju (Viber) */
  campaign?: string;
  id?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  /** classic = izgled forme sa starog sajta (Podaci za isporuku, zeleno dugme) */
  appearance?: 'default' | 'classic';
}

type Field = 'fullName' | 'phone' | 'address' | 'city' | 'postalCode';

const roundPrice = (price: number) => Math.round(price * 100) / 100;

export function QuickOrderForm({
  countryConfig,
  lines,
  channel,
  campaign,
  id = 'naruci',
  title,
  subtitle,
  className,
  appearance = 'default',
}: QuickOrderFormProps) {
  const t = useTranslations('store');
  const classic = appearance === 'classic';
  const tAll = useTranslations();
  const { trackEvent } = usePixelTracking(countryConfig.code);
  const tracking = channel !== 'viber';

  const [form, setForm] = useState<Record<Field, string>>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [dialogType, setDialogType] = useState<CheckoutDialogType>(null);
  const [dialogError, setDialogError] = useState('');
  const [orderResult, setOrderResult] = useState<{ orderId?: string; customerName?: string; totalPrice?: number; currency?: string }>({});
  const [startedCheckout, setStartedCheckout] = useState(false);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const inFlight = useRef(false);

  const courier = getDefaultCourier(countryConfig);
  const supportedCountries = Object.keys(COUNTRIES).map((code) => code.toUpperCase()) as Array<'RS' | 'BA' | 'ME'>;

  const subtotal = useMemo(
    () => roundPrice(lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0)),
    [lines]
  );
  const regularTotal = useMemo(
    () => roundPrice(lines.reduce((sum, line) => sum + line.regularPrice * line.quantity, 0)),
    [lines]
  );
  const totalItems = lines.reduce((sum, line) => sum + line.quantity, 0);

  const baseShipping = roundPrice(calculateShippingCost(subtotal, courier, countryConfig));
  const couponValid = coupon && !(coupon.minOrderValue && subtotal < coupon.minOrderValue);
  const couponAmounts = couponValid
    ? calculateCouponDiscount(coupon, subtotal, baseShipping)
    : { productDiscount: 0, shippingDiscount: 0, totalDiscount: 0 };
  const shipping = roundPrice(Math.max(0, baseShipping - couponAmounts.shippingDiscount));
  const total = roundPrice(Math.max(0, subtotal - couponAmounts.productDiscount) + shipping);
  const savings = roundPrice(regularTotal - subtotal + couponAmounts.totalDiscount);

  // Kupon iz oglasa (?coupon_code=POPUST20) važi i u brzoj porudžbini. Viber ponude su
  // već najniža cena i ne kombinuju se sa kuponima.
  useEffect(() => {
    if (channel === 'viber') return;
    const code = getActiveCouponCode();
    if (!code) return;
    let cancelled = false;
    validateCouponWithAPI(code, subtotal, countryConfig.code)
      .then((result) => {
        if (!cancelled && result.valid && result.coupon && result.coupon.type !== 'bogo') {
          setCoupon(result.coupon);
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryConfig.code, channel]);

  const validate = (field: Field, value: string): string => {
    const v = value.trim();
    switch (field) {
      case 'fullName':
        return v.split(/\s+/).filter((part) => part.length >= 2).length >= 2 ? '' : t('form.error_name');
      case 'phone':
        return value && isValidPhoneNumber(value) ? '' : t('form.error_phone');
      case 'address':
        return v.length >= 4 && /\d|\bbb\b/i.test(v) ? '' : t('form.error_address');
      case 'city':
        return v.length >= 2 ? '' : t('form.error_city');
      case 'postalCode':
        return /^\d{5}$/.test(v) ? '' : t('form.error_postal');
    }
  };

  const onChange = (field: Field, raw: string) => {
    const value = field === 'postalCode' ? raw.replace(/\D/g, '').slice(0, 5) : raw;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));

    if (tracking && !startedCheckout && value.trim()) {
      setStartedCheckout(true);
      trackEvent('initiate_checkout', {
        content_category: 'QuickOrder',
        content_ids: lines.map((line) => line.sku),
        contents: lines.map((line) => ({ id: line.sku, quantity: line.quantity, item_price: line.unitPrice })),
        currency: countryConfig.currency,
        value: subtotal,
        num_items: totalItems,
      });
    }
  };

  const onBlur = (field: Field) => {
    const error = validate(field, form[field]);
    if (error) setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (inFlight.current || lines.length === 0) return;

    const nextErrors: Partial<Record<Field, string>> = {};
    (Object.keys(form) as Field[]).forEach((field) => {
      const error = validate(field, form[field]);
      if (error) nextErrors[field] = error;
    });
    setErrors(nextErrors);
    const firstInvalid = (Object.keys(nextErrors) as Field[]).find((field) => nextErrors[field]);
    if (firstInvalid) {
      document.querySelector<HTMLElement>(`#${id} [name="${firstInvalid}"]`)?.focus();
      return;
    }

    inFlight.current = true;
    setDialogType('loading');

    try {
      const customerName = form.fullName.trim().replace(/\s+/g, ' ');
      const fbTrackingData = tracking ? getFacebookTrackingData(document.cookie) : { fbp: null, fbc: null };
      const marketingParams = channel === 'viber'
        ? { campaign_id: campaign || null, adset_id: null, ad_id: null, aff_id: null, medium: 'viber' }
        : getMarketingCookies();
      const eventId = await checkoutEventId({ form, lines, total, locale: countryConfig.code });

      const apiOrderData = {
        customerName,
        customerEmail: '',
        customerPhone: form.phone,
        customerAddress: form.address.trim(),
        customerCity: form.city.trim(),
        customerPostalCode: form.postalCode,
        productName: lines.length === 1 ? lines[0].productName : `${lines[0].productName} + ${lines.length - 1}`,
        productVariant: lines.map((line) => `${line.productName} - ${line.variantName} x${line.quantity}`).join(', '),
        productSku: lines[0].sku,
        quantity: totalItems,
        totalPrice: total,
        subtotal,
        shippingCost: shipping,
        currency: countryConfig.currencySymbol,
        courierName: courier.name,
        deliveryTime: courier.deliveryTime,
        paymentMethod: 'cod',
        bundleItems: {},
        coupon:
          coupon && couponAmounts.totalDiscount > 0
            ? {
                code: coupon.code,
                type: coupon.type,
                productDiscount: couponAmounts.productDiscount,
                shippingDiscount: couponAmounts.shippingDiscount,
                totalDiscount: couponAmounts.totalDiscount,
              }
            : undefined,
        locale: countryConfig.code,
        fbp: fbTrackingData.fbp || undefined,
        fbc: fbTrackingData.fbc || undefined,
        eventId,
        pageUrl: window.location.href,
        marketingParams,
        ...(channel ? { channel } : {}),
        cartItems: lines.map((line) => ({
          productId: line.productId,
          variantId: line.variantId,
          sku: line.sku,
          name: `${line.productName} - ${line.variantName}`,
          quantity: line.quantity,
          price: roundPrice(line.unitPrice),
        })),
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiOrderData),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        setDialogError(result.error || tAll('validation.order_submission_failed'));
        setDialogType('error');
        inFlight.current = false;
        return;
      }

      completeCheckoutAttempt();
      if (tracking) {
        trackEvent(
          'purchase',
          {
            content_category: 'QuickOrder',
            content_ids: lines.map((line) => line.sku),
            contents: lines.map((line) => ({ id: line.sku, quantity: line.quantity, item_price: line.unitPrice })),
            currency: countryConfig.currency,
            value: total,
            order_id: result.orderId,
            num_items: totalItems,
          },
          eventId
        );
      }

      sessionStorage.setItem(
        'completedOrder',
        JSON.stringify({
          ...apiOrderData,
          orderId: result.orderId,
          displayItems: lines.map((line) => ({
            type: 'regular' as const,
            name: line.productName,
            variant: line.variantName,
            quantity: line.quantity,
            image: line.image,
            linePrice: roundPrice(line.unitPrice * line.quantity),
            regularPrice: roundPrice(line.regularPrice * line.quantity),
          })),
        })
      );
      if (coupon) clearCouponCookie();

      setOrderResult({ orderId: result.orderId, customerName, totalPrice: total, currency: countryConfig.currencySymbol });
      setDialogType('success');
      window.setTimeout(() => window.location.replace(`/${countryConfig.code}/thank-you`), 2500);
    } catch (error) {
      console.error('Quick order failed:', error);
      setDialogError(tAll('validation.order_submission_failed'));
      setDialogType('error');
      inFlight.current = false;
    }
  };

  const closeDialog = () => {
    const current = dialogType;
    setDialogType(null);
    setDialogError('');
    if (current === 'success') window.location.replace(`/${countryConfig.code}/thank-you`);
    if (current === 'error') inFlight.current = false;
  };

  const inputClass = (field: Field) =>
    cn(
      classic
        ? 'h-[52px] w-full rounded-md border bg-white px-4 text-[16px] text-[#222] outline-none transition placeholder:text-[#8a8a8a] focus:border-[#2E7D4F] focus:ring-2 focus:ring-[#2E7D4F]/20'
        : 'h-[54px] w-full rounded-[14px] border bg-white px-4 text-[16px] text-ink outline-none transition placeholder:text-ink/35 focus:border-forest focus:ring-4 focus:ring-forest/10',
      errors[field] ? 'border-red-400 bg-red-50/40' : classic ? 'border-[#d6d6d6]' : 'border-line'
    );

  const label = (field: Field, text: string) => (
    <label htmlFor={`${id}-${field}`} className={cn('mb-1.5 block text-[13px] font-medium', classic ? 'text-[#444]' : 'text-ink/70')}>
      {text}
    </label>
  );

  const fieldError = (field: Field) =>
    errors[field] ? <p className="mt-1.5 text-[12.5px] font-medium text-red-600">{errors[field]}</p> : null;

  return (
    <div
      id={id}
      className={cn(
        'scroll-mt-24',
        !classic && 'rounded-[28px] border border-line bg-white p-5 shadow-[0_40px_80px_-50px_rgba(26,38,32,0.35)] sm:p-7',
        className
      )}
    >
      {classic ? (
        <p className="mb-5 text-center text-[19px] font-semibold text-[#111]">{title || t('lander.form_title')}</p>
      ) : (
        <div className="mb-6">
          <p className="font-display text-[30px] leading-[1.05] text-ink sm:text-[34px]">{title || t('form.title')}</p>
          <p className="mt-2 flex items-center gap-2 text-[14px] text-moss">
            <Banknote className="h-4 w-4 shrink-0" strokeWidth={1.8} />
            {subtitle || t('form.subtitle')}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          {label('fullName', t('form.full_name'))}
          <input
            id={`${id}-fullName`}
            name="fullName"
            autoComplete="name"
            className={inputClass('fullName')}
            placeholder={t('form.full_name_placeholder')}
            value={form.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
            onBlur={() => onBlur('fullName')}
            aria-invalid={Boolean(errors.fullName)}
          />
          {fieldError('fullName')}
        </div>

        <div>
          {label('phone', t('form.phone'))}
          <div className={cn('overflow-hidden rounded-[14px] border bg-white transition focus-within:border-forest focus-within:ring-4 focus-within:ring-forest/10', errors.phone ? 'border-red-400' : 'border-line')}>
            <PhoneInput
              id={`${id}-phone`}
              name="phone"
              value={form.phone}
              onChange={(value) => onChange('phone', value || '')}
              onBlur={() => onBlur('phone')}
              placeholder={t('form.phone_placeholder')}
              defaultCountry={countryConfig.code.toUpperCase() as 'RS' | 'BA' | 'ME'}
              countries={supportedCountries}
              aria-invalid={Boolean(errors.phone)}
              className="[&>[data-slot=button]]:h-[52px] [&>[data-slot=button]]:rounded-none [&>[data-slot=button]]:border-0 [&>[data-slot=button]]:border-r [&>[data-slot=button]]:border-line [&>[data-slot=button]]:bg-paper [&>[data-slot=button]]:px-3 [&_[data-slot=input]]:h-[52px] [&_[data-slot=input]]:rounded-none [&_[data-slot=input]]:border-0 [&_[data-slot=input]]:px-3 [&_[data-slot=input]]:!text-[16px] [&_[data-slot=input]]:text-ink [&_[data-slot=input]]:shadow-none [&_[data-slot=input]]:placeholder:text-ink/35 [&_[data-slot=input]]:focus-visible:ring-0"
            />
          </div>
          {fieldError('phone')}
        </div>

        <div>
          {label('address', t('form.address'))}
          <input
            id={`${id}-address`}
            name="address"
            autoComplete="street-address"
            className={inputClass('address')}
            placeholder={t('form.address_placeholder')}
            value={form.address}
            onChange={(e) => onChange('address', e.target.value)}
            onBlur={() => onBlur('address')}
            aria-invalid={Boolean(errors.address)}
          />
          {fieldError('address')}
        </div>

        <div className="grid grid-cols-[1fr_7.5rem] gap-3">
          <div>
            {label('city', t('form.city'))}
            <input
              id={`${id}-city`}
              name="city"
              autoComplete="address-level2"
              className={inputClass('city')}
              placeholder={t('form.city_placeholder')}
              value={form.city}
              onChange={(e) => onChange('city', e.target.value)}
              onBlur={() => onBlur('city')}
              aria-invalid={Boolean(errors.city)}
            />
            {fieldError('city')}
          </div>
          <div>
            {label('postalCode', t('form.postal'))}
            <input
              id={`${id}-postalCode`}
              name="postalCode"
              inputMode="numeric"
              autoComplete="postal-code"
              className={inputClass('postalCode')}
              placeholder="11000"
              value={form.postalCode}
              onChange={(e) => onChange('postalCode', e.target.value)}
              onBlur={() => onBlur('postalCode')}
              aria-invalid={Boolean(errors.postalCode)}
            />
            {fieldError('postalCode')}
          </div>
        </div>

        {/* Obračun */}
        <div className="!mt-6 space-y-2.5 rounded-[18px] bg-paper p-4 text-[14px] sm:p-5">
          {lines.map((line) => (
            <div key={line.variantId} className="flex items-start justify-between gap-3">
              <span className="font-medium text-ink">
                {line.productName}
                <span className="block text-[12.5px] font-normal text-ink/50">{line.variantName}{line.quantity > 1 ? ` × ${line.quantity}` : ''}</span>
              </span>
              <span className="shrink-0 text-right font-medium text-ink">
                {line.regularPrice > line.unitPrice && (
                  <span className="mr-2 text-[12.5px] font-normal text-ink/35 line-through">{formatMoney(line.regularPrice * line.quantity, countryConfig)}</span>
                )}
                {formatMoney(line.unitPrice * line.quantity, countryConfig)}
              </span>
            </div>
          ))}
          {couponValid && couponAmounts.totalDiscount > 0 && (
            <div className="flex items-center justify-between gap-3 text-moss">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Tag className="h-3.5 w-3.5" /> {t('form.coupon', { code: coupon!.code })}
                <button type="button" onClick={() => { clearCouponCookie(); setCoupon(null); }} className="text-ink/40 hover:text-ink/70" aria-label={t('form.remove_coupon')}>
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
              <span className="font-medium">−{formatMoney(couponAmounts.totalDiscount, countryConfig)}</span>
            </div>
          )}
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-ink/70">
              <Truck className="h-4 w-4 text-ink/45" strokeWidth={1.6} /> {t('form.shipping')}
            </span>
            <span className={cn('font-medium', shipping === 0 ? 'text-moss' : 'text-ink')}>
              {shipping === 0 ? t('form.free') : formatMoney(shipping, countryConfig)}
            </span>
          </div>
          <div className="flex items-end justify-between gap-3 border-t border-line pt-3">
            <span className="pb-0.5 text-[14.5px] font-semibold text-ink">{t('form.total')}</span>
            <span className="text-[26px] font-semibold leading-none tracking-tight text-ink">{formatMoney(total, countryConfig)}</span>
          </div>
          {savings > 0 && (
            <p className="text-right text-[12.5px] font-medium text-coral">{t('form.you_save', { amount: formatMoney(savings, countryConfig) })}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={dialogType === 'loading'}
          className={cn(
            'flex w-full items-center justify-center gap-2.5 px-5 text-white transition duration-300 active:scale-[0.99] disabled:opacity-70',
            classic
              ? 'h-[62px] rounded-full bg-[#2E7D4F] text-[20px] font-bold shadow-[0_6px_0_#1d5434] hover:bg-[#2a7349] active:translate-y-[3px] active:shadow-[0_3px_0_#1d5434]'
              : 'h-[60px] rounded-full bg-coral text-[17px] font-semibold shadow-[0_18px_34px_-16px_rgba(201,83,58,0.8)] hover:bg-coral-deep'
          )}
        >
          <Lock className={classic ? 'h-5 w-5' : 'h-4 w-4'} />
          {classic ? t('lander.submit') : t('form.submit')}
        </button>

        {classic && (
          <ul className="mx-auto grid w-fit gap-1.5 pt-2 text-[16px] text-[#222]">
            {[t('lander.check_delivery'), t('lander.check_cod'), t('lander.check_guarantee')].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#2BB673] text-white">
                  <Check className="h-3 w-3" strokeWidth={3.5} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        )}

        <ul className={cn('grid gap-2 pt-1 text-[13px] text-ink/70', classic && 'hidden')}>
          <li className="flex items-center gap-2.5"><Check className="h-4 w-4 shrink-0 text-moss" strokeWidth={2} />{t('form.reassure_cod')}</li>
          <li className="flex items-center gap-2.5"><Check className="h-4 w-4 shrink-0 text-moss" strokeWidth={2} />{t('form.reassure_delivery', { time: courier.deliveryTime })}</li>
          <li className="flex items-center gap-2.5"><ShieldCheck className="h-4 w-4 shrink-0 text-moss" strokeWidth={1.8} />{t('form.reassure_return', { days: countryConfig.business.returnPeriodDays })}</li>
        </ul>
      </form>

      <CheckoutDialog
        type={dialogType}
        isOpen={dialogType !== null}
        onClose={closeDialog}
        errorMessage={dialogError}
        countryConfig={countryConfig}
        orderData={orderResult}
      />
    </div>
  );
}
