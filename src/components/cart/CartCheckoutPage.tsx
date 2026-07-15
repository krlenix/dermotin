'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { isValidPhoneNumber } from 'react-phone-number-input';
import {
  ArrowRight,
  ChevronDown,
  Gift,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneInput } from '@/components/ui/phone-input';
import { cn } from '@/lib/utils';
import { COUNTRIES, CountryConfig, getDefaultCourier } from '@/config/countries';
import { VALIDATION_RULES } from '@/config/constants';
import { calculateShippingCost, getAmountForFreeShipping, qualifiesForFreeShipping } from '@/utils/shipping';
import { useCart } from '@/contexts/CartContext';
import { ShopHeader } from '@/components/shop/ShopHeader';
import { Footer } from '@/components/ui/footer';
import { CookieConsent } from '@/components/features/CookieConsent';
import { CheckoutDialog, CheckoutDialogType } from '@/components/features/CheckoutDialog';
import { PixelTracker, usePixelTracking } from '@/components/tracking/PixelTracker';
import { useMarketingTracking } from '@/hooks/useMarketingTracking';
import { getFacebookTrackingData } from '@/utils/facebook-cookies';
import { getMarketingCookies } from '@/utils/marketing-cookies';
import { CouponBanner } from '@/components/shop/CouponBanner';
import {
  clearCouponCookie,
  COUPON_CLEARED_EVENT,
  getActiveCouponCode,
  storeCouponCookie,
} from '@/utils/coupon-cookies';
import { calculateCouponDiscount, validateCouponWithAPI, type Coupon } from '@/config/coupons';
import { BOGO_CONFIG } from '@/utils/bogo-cookies';
import { groupCartItemsForDisplay } from '@/utils/bogo-pair';

interface CartCheckoutPageProps {
  countryConfig: CountryConfig;
  locale: string;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs font-medium text-red-600">{message}</p>;
}

export function CartCheckoutPage({ countryConfig, locale }: CartCheckoutPageProps) {
  const t = useTranslations();
  const { trackEvent } = usePixelTracking(countryConfig.code);
  const {
    items,
    subtotal,
    totalItems,
    totalSavings,
    isHydrated,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  useMarketingTracking();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogType, setDialogType] = useState<CheckoutDialogType>(null);
  const [dialogError, setDialogError] = useState('');
  const [orderResult, setOrderResult] = useState<{ orderId?: string; customerName?: string; totalPrice?: number; currency?: string }>({});
  const [hasStartedCheckout, setHasStartedCheckout] = useState(false);
  const submitInFlightRef = useRef(false);

  // Kupon (npr. POPUST20 iz reklame — auto-primena iz URL-a/kolačića + ručni unos)
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponApplying, setCouponApplying] = useState(false);
  const [couponDismissed, setCouponDismissed] = useState(false);

  const courier = getDefaultCourier(countryConfig);
  const supportedCountries = Object.keys(COUNTRIES).map((code) => code.toUpperCase()) as Array<'RS' | 'BA' | 'ME'>;

  const roundPrice = (price: number) => Math.round(price * 100) / 100;

  const formatPrice = (amount: number) =>
    `${new Intl.NumberFormat('sr-RS', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)} ${countryConfig.currencySymbol}`;

  const hasFreeShipping = qualifiesForFreeShipping(subtotal, countryConfig);
  const baseShippingCost = hasFreeShipping ? 0 : roundPrice(calculateShippingCost(subtotal, courier, countryConfig));
  const amountForFreeShipping = getAmountForFreeShipping(subtotal, countryConfig);

  // 1+1 par u korpi — kupon 1PLUS1 se smatra primenjenim (cene su već prepolovljene po stavci)
  const hasBogoPair = items.some((line) => Boolean(line.bogoPairId));
  const displayGroups = useMemo(() => groupCartItemsForDisplay(items), [items]);
  const bogoGratisValue = roundPrice(
    items
      .filter((line) => line.bogoRole === 'free')
      .reduce((sum, line) => sum + (line.bogoOriginalUnitPrice ?? line.regularPrice) * line.quantity, 0)
  );

  // Obračun kupona — minOrderValue se proverava dinamički jer se korpa menja.
  // 1+1 se ne kombinuje sa drugim kuponima.
  const couponMinNotMet = Boolean(appliedCoupon?.minOrderValue && subtotal < appliedCoupon.minOrderValue);
  const couponAmounts =
    appliedCoupon && !couponMinNotMet && !hasBogoPair
      ? calculateCouponDiscount(appliedCoupon, subtotal, baseShippingCost)
      : { productDiscount: 0, shippingDiscount: 0, totalDiscount: 0 };
  const shippingCost = roundPrice(Math.max(0, baseShippingCost - couponAmounts.shippingDiscount));
  const total = roundPrice(Math.max(0, subtotal - couponAmounts.productDiscount) + shippingCost);

  const applyCoupon = async (code: string, source: 'auto' | 'manual') => {
    const normalized = code.trim().toUpperCase();
    if (!normalized || couponApplying) return;

    setCouponApplying(true);
    setCouponError('');
    try {
      const result = await validateCouponWithAPI(normalized, subtotal, countryConfig.code);
      // BOGO kupon (1PLUS1) se ne obračunava ovde — popust je već u prepolovljenim cenama para
      if (result.valid && result.coupon?.type === 'bogo') {
        if (source === 'manual') {
          setCouponInput('');
          setCouponError('');
        }
        return;
      }
      if (result.valid && result.coupon) {
        setAppliedCoupon(result.coupon);
        setCouponDismissed(false);
        storeCouponCookie(normalized, source === 'manual' ? 'manual' : 'url');
        if (source === 'manual') setCouponInput('');
      } else if (source === 'manual') {
        if (result.error === 'min_order_not_met' && result.coupon?.minOrderValue) {
          setCouponError(t('coupons.min_order_not_met', { amount: formatPrice(result.coupon.minOrderValue) }));
        } else if (result.error === 'not_valid_country') {
          setCouponError(t('coupons.not_valid_country'));
        } else {
          setCouponError(t('coupons.invalid_code'));
        }
      }
    } catch (error) {
      console.error('Coupon validation failed:', error);
      if (source === 'manual') setCouponError(t('coupons.invalid_code'));
    } finally {
      setCouponApplying(false);
    }
  };

  const removeCoupon = () => {
    clearCouponCookie();
    setAppliedCoupon(null);
    setCouponDismissed(true);
    setCouponError('');
  };

  // Auto-primena kupona iz URL-a (?coupon_code=) ili ranije upamćenog kolačića.
  // Preskače se kada je 1+1 par u korpi — ta akcija isključuje druge kupone.
  useEffect(() => {
    if (!isHydrated || items.length === 0 || appliedCoupon || couponDismissed || hasBogoPair) return;
    const code = getActiveCouponCode();
    if (code) applyCoupon(code, 'auto');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, items.length, hasBogoPair]);

  useEffect(() => {
    const handleCouponCleared = () => setAppliedCoupon(null);
    window.addEventListener(COUPON_CLEARED_EVENT, handleCouponCleared);
    return () => window.removeEventListener(COUPON_CLEARED_EVENT, handleCouponCleared);
  }, []);

  const validateField = (field: string, value: string): string => {
    const tValidation = t.raw('validation');

    switch (field) {
      case 'firstName':
        return value.trim().length < VALIDATION_RULES.minNameLength ? tValidation.name_min_length : '';
      case 'lastName':
        return value.trim().length < VALIDATION_RULES.minSurnameLength ? tValidation.surname_min_length : '';
      case 'phone':
        return !isValidPhoneNumber(value) ? tValidation.phone_invalid : '';
      case 'address':
        return value.trim().length < VALIDATION_RULES.minAddressLength ? tValidation.address_min_length : '';
      case 'city':
        return value.trim().length < VALIDATION_RULES.minCityLength ? tValidation.city_min_length : '';
      case 'postalCode':
        return /^\d{5}$/.test(value) ? '' : tValidation.postal_code_invalid;
      case 'email':
        return value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
          ? t('forms.invalid_email')
          : '';
      default:
        return '';
    }
  };

  const handleInputChange = (field: string, value: string) => {
    let nextValue = value;

    if (field === 'postalCode') {
      nextValue = value.replace(/\D/g, '').slice(0, 5);
    }

    setFormData((prev) => ({ ...prev, [field]: nextValue }));

    if (!hasStartedCheckout && nextValue.trim().length > 0 && items.length > 0) {
      setHasStartedCheckout(true);
      trackEvent('initiate_checkout', {
        content_category: 'Cart',
        content_ids: items.map((line) => line.sku),
        contents: items.map((line) => ({
          id: line.sku,
          quantity: line.quantity,
          item_price: line.unitPrice,
        })),
        currency: countryConfig.currency || 'RSD',
        value: subtotal,
        num_items: totalItems,
      });
    }

    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field: string) => {
    const value = formData[field as keyof typeof formData];
    const error = validateField(field, value);

    if (error) {
      setFormErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const isFieldActive = (field: keyof typeof formData) => formData[field].length > 0;

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const fieldsToValidate = ['firstName', 'lastName', 'phone', 'address', 'city', 'postalCode', 'email'];

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) {
        errors[field] = error;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting || submitInFlightRef.current || items.length === 0) return;
    if (!validateForm()) return;

    submitInFlightRef.current = true;
    setIsSubmitting(true);
    setDialogType('loading');

    try {
      const fbTrackingData = getFacebookTrackingData(typeof document !== 'undefined' ? document.cookie : null);
      const marketingData = getMarketingCookies();
      const eventId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const productSummary =
        items.length === 1
          ? items[0].productName
          : `${items[0].productName} + ${items.length - 1}`;
      const variantSummary = items
        .map((line) => {
          const bogoNote =
            line.bogoRole === 'free' ? ' [1+1 gratis]' : line.bogoPairId ? ' [1+1]' : '';
          return `${line.productName} - ${line.variantName} x${line.quantity}${bogoNote}`;
        })
        .join(', ');

      const apiOrderData = {
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email.trim(),
        customerPhone: formData.phone,
        customerAddress: formData.address,
        customerCity: formData.city,
        customerPostalCode: formData.postalCode,
        productName: productSummary,
        productVariant: variantSummary,
        productSku: items[0].sku,
        quantity: totalItems,
        totalPrice: total,
        subtotal,
        shippingCost,
        currency: countryConfig.currencySymbol,
        courierName: courier.name,
        deliveryTime: courier.deliveryTime,
        paymentMethod: 'cod',
        bundleItems: {},
        coupon:
          appliedCoupon && couponAmounts.totalDiscount > 0
            ? {
                code: appliedCoupon.code,
                type: appliedCoupon.type,
                productDiscount: couponAmounts.productDiscount,
                shippingDiscount: couponAmounts.shippingDiscount,
                totalDiscount: couponAmounts.totalDiscount,
              }
            : hasBogoPair
              ? {
                  // Tag only — prices are already halved on line items (no extra discount)
                  code: BOGO_CONFIG.couponCode,
                  type: 'bogo' as const,
                  productDiscount: 0,
                  shippingDiscount: 0,
                  totalDiscount: 0,
                }
              : undefined,
        locale: countryConfig.code,
        fbp: fbTrackingData.fbp || undefined,
        fbc: fbTrackingData.fbc || undefined,
        eventId,
        pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
        marketingParams: marketingData,
        cartItems: items.map((line) => ({
          sku: line.sku,
          name: `${line.productName} - ${line.variantName}`,
          quantity: line.quantity,
          // 1+1: unitPrice is already regular/2 for both lines
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
        setDialogError(result.error || t('validation.order_submission_failed'));
        setDialogType('error');
        setIsSubmitting(false);
        submitInFlightRef.current = false;
        return;
      }

      trackEvent(
        'purchase',
        {
          content_category: 'Cart',
          content_ids: items.map((line) => line.sku),
          contents: items.map((line) => ({
            id: line.sku,
            quantity: line.quantity,
            item_price: line.unitPrice,
          })),
          currency: countryConfig.currency || 'RSD',
          value: total,
          order_id: result.orderId,
          num_items: totalItems,
        },
        eventId,
      );

      sessionStorage.setItem(
        'completedOrder',
        JSON.stringify({
          ...apiOrderData,
          orderId: result.orderId,
        })
      );

      clearCart();
      clearCouponCookie();

      setOrderResult({
        orderId: result.orderId,
        customerName: `${formData.firstName} ${formData.lastName}`,
        totalPrice: total,
        currency: countryConfig.currencySymbol,
      });
      setDialogType('success');

      setTimeout(() => {
        setDialogType(null);
        window.location.replace(`/${countryConfig.code}/thank-you`);
      }, 3000);
    } catch (error) {
      console.error('Cart checkout error:', error);
      setDialogError(error instanceof Error ? error.message : t('validation.order_submission_failed'));
      setDialogType('error');
      setIsSubmitting(false);
      submitInFlightRef.current = false;
    }
  };

  const handleDialogClose = () => {
    const currentDialogType = dialogType;

    setDialogType(null);
    setDialogError('');

    if (currentDialogType === 'error') {
      setIsSubmitting(false);
      submitInFlightRef.current = false;
    } else if (currentDialogType === 'success') {
      window.location.replace(`/${countryConfig.code}/thank-you`);
    }
  };

  const floatingLabelClass = (field: keyof typeof formData) =>
    cn(
      'pointer-events-none absolute left-3 right-3 z-10 origin-left truncate font-medium text-[#7d7d7d] transition-all duration-150',
      isFieldActive(field)
        ? 'top-[3px] text-[10px] uppercase tracking-[0.02em]'
        : 'top-1/2 -translate-y-1/2 text-[17px]',
    );

  const inputClass =
    'h-[52px] rounded-[6px] border-[#d9d0c5] px-3 pb-0 pt-[3px] !text-[17px] font-medium leading-[52px] text-slate-900 shadow-none placeholder:text-transparent';

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#f6f8f6_0%,#ffffff_30%,#f8fbf9_65%,#ffffff_100%)]" style={{ maxWidth: '100vw' }}>
      <PixelTracker countryCode={countryConfig.code} />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-28 right-0 h-96 w-96 rounded-full bg-[#358055]/8 blur-3xl" />
        <div className="absolute top-[26rem] -left-16 h-80 w-80 rounded-full bg-[#F3765D]/8 blur-3xl" />
      </div>

      <ShopHeader />

      <main className="relative pb-16">
        <div className="container mx-auto px-4 pt-6 md:pt-8">
          <h1 className="text-3xl font-black leading-tight tracking-[-0.01em] text-slate-950 md:text-4xl">
            {t('checkout.title')}
          </h1>

          {isHydrated && items.length === 0 ? (
            <div className="section-card-strong mx-auto mt-8 flex max-w-xl flex-col items-center gap-4 px-6 py-12 text-center">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#358055]/8">
                <ShoppingBag className="h-9 w-9 text-[#358055]/60" />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900">{t('cart.empty_title')}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">{t('cart.empty_subtitle')}</p>
              </div>
              <Link
                href={`/${locale}/products`}
                className="mt-2 inline-flex items-center justify-center rounded-full bg-[#F3765D] px-7 py-3.5 text-base font-extrabold text-white shadow-[0_16px_32px_rgba(243,118,93,0.28)] transition-colors hover:bg-[#e0654d]"
              >
                {t('cart.browse_products')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
              {/* Delivery form */}
              <div className="section-card-strong px-5 py-6 md:px-7 md:py-7">
                <h2 className="text-xl font-black text-slate-900">{t('checkout_v2.simpleTitle')}</h2>

                <div className="mt-5 space-y-3">
                  <div className="space-y-1.5">
                    <div className="relative rounded-[6px] border border-[#d9d0c5] bg-white">
                      <Label
                        htmlFor="phone"
                        className={cn(
                          'pointer-events-none absolute left-[68px] z-10 origin-left truncate font-medium text-[#7d7d7d] transition-all duration-150',
                          isFieldActive('phone')
                            ? 'left-[66px] top-[3px] text-[10px] uppercase tracking-[0.02em]'
                            : 'top-1/2 -translate-y-1/2 text-[17px]',
                        )}
                      >
                        {t('forms.phone')} <span className="text-[#F3765D]">*</span>
                      </Label>
                      <PhoneInput
                        value={formData.phone}
                        onChange={(value) => handleInputChange('phone', value || '')}
                        onBlur={() => handleBlur('phone')}
                        placeholder=""
                        defaultCountry={countryConfig.code.toUpperCase() as 'RS' | 'BA' | 'ME'}
                        countries={supportedCountries}
                        aria-invalid={Boolean(formErrors.phone)}
                        className="[&>[data-slot=button]]:h-[52px] [&>[data-slot=button]]:rounded-none [&>[data-slot=button]]:rounded-l-[6px] [&>[data-slot=button]]:border-0 [&>[data-slot=button]]:border-r [&>[data-slot=button]]:border-[#d9d0c5] [&>[data-slot=button]]:bg-white [&>[data-slot=button]]:px-3 [&_[data-slot=input]]:h-[52px] [&_[data-slot=input]]:rounded-none [&_[data-slot=input]]:rounded-r-[6px] [&_[data-slot=input]]:border-0 [&_[data-slot=input]]:px-3 [&_[data-slot=input]]:pb-0 [&_[data-slot=input]]:pt-[3px] [&_[data-slot=input]]:!text-[17px] [&_[data-slot=input]]:font-medium [&_[data-slot=input]]:leading-[52px] [&_[data-slot=input]]:shadow-none"
                      />
                    </div>
                    <FieldError message={formErrors.phone} />
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <div className="relative">
                        <Label htmlFor="firstName" className={floatingLabelClass('firstName')}>
                          {t('forms.name')} <span className="text-[#F3765D]">*</span>
                        </Label>
                        <Input
                          id="firstName"
                          autoComplete="given-name"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          onBlur={() => handleBlur('firstName')}
                          aria-invalid={Boolean(formErrors.firstName)}
                          placeholder=""
                          className={inputClass}
                        />
                      </div>
                      <FieldError message={formErrors.firstName} />
                    </div>

                    <div className="space-y-1.5">
                      <div className="relative">
                        <Label htmlFor="lastName" className={floatingLabelClass('lastName')}>
                          {t('forms.surname')} <span className="text-[#F3765D]">*</span>
                        </Label>
                        <Input
                          id="lastName"
                          autoComplete="family-name"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          onBlur={() => handleBlur('lastName')}
                          aria-invalid={Boolean(formErrors.lastName)}
                          placeholder=""
                          className={inputClass}
                        />
                      </div>
                      <FieldError message={formErrors.lastName} />
                    </div>

                    <div className="space-y-1.5">
                      <div className="relative">
                        <Label htmlFor="address" className={floatingLabelClass('address')}>
                          {t('checkout_v2.simpleAddressLabel')} <span className="text-[#F3765D]">*</span>
                        </Label>
                        <Input
                          id="address"
                          autoComplete="street-address"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          onBlur={() => handleBlur('address')}
                          aria-invalid={Boolean(formErrors.address)}
                          placeholder=""
                          className={inputClass}
                        />
                      </div>
                      <FieldError message={formErrors.address} />
                    </div>

                    <div className="space-y-1.5">
                      <div className="relative">
                        <Label htmlFor="city" className={floatingLabelClass('city')}>
                          {t('forms.city')} <span className="text-[#F3765D]">*</span>
                        </Label>
                        <Input
                          id="city"
                          autoComplete="address-level2"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          onBlur={() => handleBlur('city')}
                          aria-invalid={Boolean(formErrors.city)}
                          placeholder=""
                          className={inputClass}
                        />
                      </div>
                      <FieldError message={formErrors.city} />
                    </div>

                    <div className="space-y-1.5">
                      <div className="relative">
                        <Label htmlFor="postalCode" className={floatingLabelClass('postalCode')}>
                          {t('forms.postal_code')} <span className="text-[#F3765D]">*</span>
                        </Label>
                        <Input
                          id="postalCode"
                          autoComplete="postal-code"
                          inputMode="numeric"
                          maxLength={5}
                          value={formData.postalCode}
                          onChange={(e) => handleInputChange('postalCode', e.target.value)}
                          onBlur={() => handleBlur('postalCode')}
                          aria-invalid={Boolean(formErrors.postalCode)}
                          placeholder=""
                          className={inputClass}
                        />
                      </div>
                      <FieldError message={formErrors.postalCode} />
                    </div>

                    <div className="space-y-1.5">
                      <div className="relative flex h-[52px] items-center rounded-[6px] border border-[#d9d0c5] bg-white px-3">
                        <span className="text-[17px] font-medium leading-[52px] text-slate-900">{countryConfig.name}</span>
                        <ChevronDown className="ml-auto h-4 w-4 text-slate-500" />
                      </div>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <div className="relative">
                        <Label htmlFor="email" className={floatingLabelClass('email')}>
                          {t('forms.email')} ({t('forms.optional')})
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          autoComplete="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          onBlur={() => handleBlur('email')}
                          aria-invalid={Boolean(formErrors.email)}
                          placeholder=""
                          className={inputClass}
                        />
                      </div>
                      <FieldError message={formErrors.email} />
                    </div>
                  </div>
                </div>

                {/* Courier info */}
                <div className="mt-5 rounded-[1rem] border border-[#358055]/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(247,251,248,0.98))] p-4 shadow-[0_10px_24px_rgba(53,128,85,0.08)]">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[0.85rem] border border-[#358055]/12 bg-white shadow-[0_6px_16px_rgba(15,23,42,0.06)]">
                      <Image
                        src={courier.logo}
                        alt={courier.name}
                        width={32}
                        height={32}
                        className="h-8 w-8 object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[17px] font-black leading-none text-slate-950">{courier.name}</p>
                      <p className="mt-2 text-sm font-medium leading-6 text-slate-700">
                        {t('shop.delivery_time', { time: courier.deliveryTime })}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 rounded-[0.8rem] bg-[#358055]/8 px-3 py-2 text-sm font-semibold text-[#358055]">
                    {t('faq_ui.cash_on_delivery')}
                  </p>
                </div>
              </div>

              {/* Order summary */}
              <div className="space-y-4">
                <div className="section-card-strong px-5 py-6 md:px-6 md:py-6">
                  <h2 className="text-xl font-black text-slate-900">{t('order_summary.title')}</h2>

                  <div className="mt-4 space-y-3">
                    {displayGroups.map((group) => {
                      if (group.type === 'bogo') {
                        const { paid, free } = group;
                        return (
                          <div
                            key={paid.bogoPairId}
                            className="overflow-hidden rounded-[1.1rem] border border-[#358055]/30 bg-white"
                          >
                            <div className="flex gap-3 p-3">
                              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[0.8rem] bg-[linear-gradient(180deg,#fafafa,#efefef)]">
                                <Image
                                  src={paid.image}
                                  alt={paid.productName}
                                  fill
                                  className="object-contain p-1"
                                  sizes="64px"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-black uppercase text-slate-900">
                                      {paid.productName}
                                    </p>
                                    <p className="truncate text-xs font-medium text-slate-500">
                                      {paid.variantName}
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeItem(paid.lineId)}
                                    aria-label={t('cart.remove')}
                                    className="shrink-0 rounded-full p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                                <div className="mt-2 flex items-center justify-between gap-2">
                                  <span className="text-xs font-semibold text-[#358055]">
                                    {t('bogo.pair_includes_gratis', { count: free.length })}
                                  </span>
                                  <div className="text-right">
                                    {paid.regularPrice >
                                      (paid.bogoOriginalUnitPrice ?? paid.unitPrice) && (
                                      <p className="text-xs text-slate-400 line-through">
                                        {formatPrice(paid.regularPrice * paid.quantity)}
                                      </p>
                                    )}
                                    <p className="text-sm font-black text-slate-950">
                                      {formatPrice(
                                        (paid.bogoOriginalUnitPrice ?? paid.unitPrice) *
                                          paid.quantity
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {free.length > 0 && (
                              <div className="border-t border-[#358055]/10 bg-[#f3faf6] px-3 py-2">
                                <ul className="space-y-1.5">
                                  {free.map((line) => (
                                    <li key={line.lineId} className="flex items-center gap-2 pl-1.5">
                                      <span
                                        className="h-7 w-0.5 shrink-0 rounded-full bg-[#358055]/35"
                                        aria-hidden
                                      />
                                      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md bg-white">
                                        <Image
                                          src={line.image}
                                          alt={line.productName}
                                          fill
                                          className="object-contain p-0.5"
                                          sizes="36px"
                                        />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-bold text-slate-800">
                                          {line.productName}
                                        </p>
                                        <p className="truncate text-[11px] text-slate-500">
                                          {line.variantName}
                                        </p>
                                      </div>
                                      <span className="shrink-0 text-[11px] font-black uppercase text-[#358055]">
                                        {t('bogo.pair_gratis')}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      }

                      const line = group.line;
                      return (
                        <div
                          key={line.lineId}
                          className="flex gap-3 rounded-[1.1rem] border border-[#358055]/10 bg-white p-3"
                        >
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[0.8rem] bg-[linear-gradient(180deg,#fafafa,#efefef)]">
                            <Image
                              src={line.image}
                              alt={line.productName}
                              fill
                              className="object-contain p-1"
                              sizes="64px"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-black uppercase text-slate-900">
                                  {line.productName}
                                </p>
                                <p className="truncate text-xs font-medium text-slate-500">
                                  {line.variantName}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeItem(line.lineId)}
                                aria-label={t('cart.remove')}
                                className="shrink-0 rounded-full p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="mt-2 flex items-center justify-between gap-2">
                              <div className="inline-flex items-center rounded-full border border-[#358055]/15 bg-white">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(line.lineId, line.quantity - 1)}
                                  aria-label="-"
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-l-full text-slate-600 transition-colors hover:bg-[#358055]/8 hover:text-[#358055]"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="min-w-6 text-center text-sm font-bold text-slate-900">
                                  {line.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(line.lineId, line.quantity + 1)}
                                  aria-label="+"
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-r-full text-slate-600 transition-colors hover:bg-[#358055]/8 hover:text-[#358055]"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <div className="text-right">
                                {line.regularPrice > line.unitPrice && (
                                  <p className="text-xs text-slate-400 line-through">
                                    {formatPrice(line.regularPrice * line.quantity)}
                                  </p>
                                )}
                                <p className="text-sm font-black text-slate-950">
                                  {formatPrice(line.unitPrice * line.quantity)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {!hasFreeShipping && amountForFreeShipping > 0 && (
                    <div className="mt-4 flex items-center gap-2 rounded-[0.9rem] bg-[#F3765D]/8 px-3 py-2.5 text-sm font-semibold text-[#ba5a47]">
                      <Truck className="h-4 w-4 shrink-0" />
                      {t('cart.free_shipping_progress', { amount: formatPrice(amountForFreeShipping) })}
                    </div>
                  )}

                  {/* 1+1 kupon — automatski primenjen kada je par u korpi */}
                  {hasBogoPair && (
                    <div
                      className="coupon-banner-animate mt-4 flex items-center gap-3 rounded-[1.1rem] p-3 text-white shadow-[0_14px_30px_rgba(53,128,85,0.28)]"
                      style={{ background: 'linear-gradient(120deg, #358055 0%, #2a6844 100%)' }}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                        <Gift className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black uppercase tracking-wide">
                          {t('bogo.coupon_applied', { code: BOGO_CONFIG.couponCode })}
                        </p>
                        <p className="text-xs font-semibold text-white/85">
                          {t('bogo.coupon_applied_note', { amount: formatPrice(bogoGratisValue) })}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Kupon — sakriven kada je 1+1 aktivan (akcije se ne kombinuju) */}
                  {!hasBogoPair &&
                    (appliedCoupon ? (
                      <div className="mt-4 space-y-2">
                        <CouponBanner coupon={appliedCoupon} formatPrice={formatPrice} onRemove={removeCoupon} />
                        {couponMinNotMet && appliedCoupon.minOrderValue && (
                          <p className="rounded-[0.8rem] bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
                            {t('coupons.min_order_not_met', { amount: formatPrice(appliedCoupon.minOrderValue) })}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="mt-4 rounded-[1.1rem] border border-[#358055]/10 bg-white p-3">
                        <p className="text-sm font-bold text-slate-700">{t('coupons.have_coupon')}</p>
                        <div className="mt-2 flex gap-2">
                          <Input
                            value={couponInput}
                            onChange={(e) => {
                              setCouponInput(e.target.value.toUpperCase());
                              if (couponError) setCouponError('');
                            }}
                            placeholder={t('coupons.placeholder')}
                            className="h-10 uppercase"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            disabled={couponApplying || !couponInput.trim()}
                            onClick={() => applyCoupon(couponInput, 'manual')}
                            className="h-10 shrink-0 border-[#358055]/30 font-bold text-[#358055] hover:bg-[#358055]/5"
                          >
                            {couponApplying ? t('coupons.validating') : t('coupons.apply')}
                          </Button>
                        </div>
                        {couponError && <p className="mt-1.5 text-xs font-medium text-red-600">{couponError}</p>}
                      </div>
                    ))}

                  <div className="mt-4 divide-y divide-[#358055]/8 rounded-[1.2rem] border border-[#358055]/10 bg-white">
                    {totalSavings > 0 && (
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-sm text-slate-500">{t('cart.you_save')}</span>
                        <span className="text-sm font-bold text-[#358055]">-{formatPrice(totalSavings)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm text-slate-500">{t('cart.subtotal')}</span>
                      <span className="text-sm font-semibold text-slate-900">{formatPrice(subtotal)}</span>
                    </div>
                    {hasBogoPair && (
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-sm text-slate-500">
                          {t('bogo.coupon_row_label', { code: BOGO_CONFIG.couponCode })}
                        </span>
                        <span className="text-sm font-black uppercase text-[#358055]">
                          {t('bogo.pair_gratis')}
                        </span>
                      </div>
                    )}
                    {couponAmounts.productDiscount > 0 && appliedCoupon && (
                      <div className="coupon-banner-animate flex items-center justify-between px-4 py-3">
                        <span className="text-sm text-slate-500">
                          {t('checkout_v2.discountLabel')} ({appliedCoupon.code})
                        </span>
                        <span className="text-sm font-bold text-[#358055]">
                          -{formatPrice(couponAmounts.productDiscount)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm text-slate-500">{t('order_summary.delivery')}</span>
                      <span className={`text-sm font-semibold ${shippingCost > 0 ? 'text-slate-900' : 'text-[#358055]'}`}>
                        {shippingCost > 0 ? formatPrice(shippingCost) : t('order_summary.free')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-4">
                      <span className="text-base font-semibold text-slate-700">{t('order_summary.total')}</span>
                      <span className="text-xl font-black text-[#F3765D]">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting || items.length === 0}
                      className="h-13 w-full rounded-full bg-[#358055] py-4 text-base font-extrabold text-white shadow-[0_16px_32px_rgba(53,128,85,0.24)] hover:bg-[#2d6d48]"
                    >
                      {isSubmitting ? t('order_summary.processing_order') : t('order_summary.place_order')}
                    </Button>

                    <div className="flex items-center justify-center gap-2 rounded-[8px] border border-[#e6ddd1] bg-[#fbf8f4] px-4 py-3 text-center">
                      <ShieldCheck className="h-4 w-4 text-[#358055]" />
                      <span className="text-sm font-medium text-slate-700">{t('order_summary.secure_purchase_guarantee')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer countryConfig={countryConfig} locale={locale} />
      <CookieConsent isEU={countryConfig.isEU} />

      <CheckoutDialog
        type={dialogType}
        isOpen={dialogType !== null}
        onClose={handleDialogClose}
        errorMessage={dialogError}
        countryConfig={countryConfig}
        orderData={orderResult}
      />
    </div>
  );
}
