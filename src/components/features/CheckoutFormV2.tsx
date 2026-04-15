'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { useTranslations } from 'next-intl';
import { ChevronDown, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneInput } from '@/components/ui/phone-input';
import { cn } from '@/lib/utils';
import { ProductVariant } from '@/config/products';
import { COUNTRIES, CountryConfig, CourierInfo, getDefaultCourier } from '@/config/countries';
import { VALIDATION_RULES } from '@/config/constants';
import { calculateShippingCost, qualifiesForFreeShipping } from '@/utils/shipping';
import { usePixelTracking } from '@/components/tracking/PixelTracker';
import { CheckoutDialog, CheckoutDialogType } from './CheckoutDialog';
import { getFacebookTrackingData } from '@/utils/facebook-cookies';
import { getMarketingCookies } from '@/utils/marketing-cookies';
import { calculateBOGODiscount, calculateCouponDiscount, isBOGOCoupon, type Coupon, validateCouponWithAPI } from '@/config/coupons';
import { getBOGOCookie, isBOGOActive as checkBOGOActive, storeBOGOCookie, wasBOGOBannerSeen } from '@/utils/bogo-cookies';

interface CheckoutFormV2Props {
  selectedVariant: ProductVariant;
  countryConfig: CountryConfig;
  productName: string;
  bundleItems?: { [key: string]: number };
  onOrderSubmit: (orderData: Record<string, unknown>) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  className?: string;
  mainProductId: string;
  onAddToBundle?: (productId: string, price: number) => void;
  selectedCourier?: CourierInfo;
  onCourierChange?: (courier: CourierInfo) => void;
  onReselect?: () => void;
  onBOGOChange?: (isActive: boolean, coupon: Coupon | null) => void;
  onBOGODiscovered?: (coupon: Coupon) => void;
  bogoQuantity?: number;
  bogoUnitPrice?: number;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="text-xs font-medium text-red-600">{message}</p>;
}

export function CheckoutFormV2({
  selectedVariant,
  countryConfig,
  productName,
  bundleItems = {},
  onOrderSubmit,
  className,
  mainProductId,
  selectedCourier,
  onBOGOChange,
  onBOGODiscovered,
  bogoQuantity = 1,
  bogoUnitPrice,
}: CheckoutFormV2Props) {
  const t = useTranslations();
  const { trackEvent } = usePixelTracking(countryConfig.code);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cod',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogType, setDialogType] = useState<CheckoutDialogType>(null);
  const [dialogError, setDialogError] = useState('');
  const [orderResult, setOrderResult] = useState<{ orderId?: string; customerName?: string; totalPrice?: number; currency?: string }>({});
  const [hasStartedCheckout, setHasStartedCheckout] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const submitInFlightRef = useRef(false);

  const formatPrice = (amount: number) =>
    `${new Intl.NumberFormat('sr-RS', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)} ${countryConfig.currencySymbol}`;

  const roundPrice = (price: number) => Math.round(price * 100) / 100;

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
        return /^\d{5}$/.test(value) ? '' : tValidation.postal_code_invalid || 'Poštanski broj mora imati tačno 5 cifara';
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

    if (!hasStartedCheckout && nextValue.trim().length > 0) {
      setHasStartedCheckout(true);

      trackEvent('initiate_checkout', {
        content_name: productName,
        content_category: 'Product',
        content_ids: [selectedVariant.id || mainProductId],
        contents: [
          {
            id: selectedVariant.id || mainProductId,
            quantity: 1,
            item_price: selectedVariant.discountPrice || selectedVariant.price,
          },
        ],
        currency: countryConfig.currency || 'RSD',
        value: (selectedVariant.discountPrice || selectedVariant.price) + Object.values(bundleItems).reduce((sum, price) => sum + price, 0),
        num_items: 1 + Object.keys(bundleItems).length,
      });
    }

    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field: string) => {
    const value = formData[field as keyof typeof formData] as string;
    const error = validateField(field, value);

    if (error) {
      setFormErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const isFieldActive = (field: keyof typeof formData) => {
    const value = formData[field];
    return typeof value === 'string' && value.length > 0;
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const fieldsToValidate = ['firstName', 'lastName', 'phone', 'address', 'city', 'postalCode'];

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field as keyof typeof formData] as string);
      if (error) {
        errors[field] = error;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isBOGOActive = isBOGOCoupon(appliedCoupon);

  let orderTotal: number;
  let subtotal: number;
  let bogoDiscount = { freeItems: 0, freeValue: 0, totalPaid: 0, totalItems: 0 };

  if (isBOGOActive && bogoUnitPrice) {
    bogoDiscount = calculateBOGODiscount(bogoUnitPrice, bogoQuantity);
    orderTotal = bogoDiscount.totalPaid;
    subtotal = roundPrice(orderTotal);
  } else {
    orderTotal = selectedVariant.discountPrice || selectedVariant.price;
    const bundleTotal = Object.values(bundleItems).reduce((sum, price) => sum + price, 0);
    subtotal = roundPrice(orderTotal + bundleTotal);
  }

  const displayCourier = selectedCourier || getDefaultCourier(countryConfig);
  const supportedCountries = Object.keys(COUNTRIES).map((code) => code.toUpperCase()) as Array<'RS' | 'BA' | 'ME'>;
  const hasFreeShipping = qualifiesForFreeShipping(subtotal, countryConfig);
  const baseShippingCost = hasFreeShipping ? 0 : roundPrice(calculateShippingCost(subtotal, displayCourier, countryConfig));
  const couponDiscount =
    appliedCoupon && !isBOGOActive
      ? calculateCouponDiscount(appliedCoupon, subtotal, baseShippingCost)
      : { productDiscount: 0, shippingDiscount: 0, totalDiscount: 0 };
  const effectiveDiscount = isBOGOActive
    ? { productDiscount: bogoDiscount.freeValue, shippingDiscount: 0, totalDiscount: bogoDiscount.freeValue }
    : couponDiscount;
  const subtotalAfterDiscount = roundPrice(subtotal - couponDiscount.productDiscount);
  const shippingCost = roundPrice(baseShippingCost - couponDiscount.shippingDiscount);
  const finalTotal = roundPrice(subtotalAfterDiscount + shippingCost);

  const handleApplyCoupon = async (codeToApply: string) => {
    const code = codeToApply.trim().toUpperCase();
    if (!code) return;

    try {
      const validation = await validateCouponWithAPI(code, subtotal, countryConfig.code);
      if (!validation.valid) return;

      const nextCoupon = validation.coupon!;
      setAppliedCoupon(nextCoupon);

      if (isBOGOCoupon(nextCoupon)) {
        const isFromUrl = codeToApply !== undefined;
        const isFromCookie = !isFromUrl && getBOGOCookie()?.couponCode === nextCoupon.code;
        const isManualEntry = !isFromUrl && !isFromCookie;

        if (!isFromCookie) {
          storeBOGOCookie(nextCoupon.code, isFromUrl ? 'url' : 'manual');
        }

        if (isManualEntry && !wasBOGOBannerSeen()) {
          onBOGODiscovered?.(nextCoupon);
          setAppliedCoupon(null);
          return;
        }

        onBOGOChange?.(true, nextCoupon);
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const searchParams = new URLSearchParams(window.location.search);
    const urlCoupon = searchParams.get('coupon');
    const urlMedium = searchParams.get('medium');

    let couponToApply: string | null = null;

    if (urlCoupon && !urlMedium) {
      couponToApply = urlCoupon.toUpperCase();
    } else if (!urlMedium && checkBOGOActive()) {
      const storedBOGO = getBOGOCookie();
      if (storedBOGO) {
        couponToApply = storedBOGO.couponCode;
      }
    }

    if (!couponToApply) return;

    (async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 100));
        await handleApplyCoupon(couponToApply!);
      } catch (error) {
        console.error('Error auto-applying coupon:', error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting || submitInFlightRef.current) return;

    if (!validateForm()) return;

    submitInFlightRef.current = true;
    setIsSubmitting(true);
    setDialogType('loading');

    try {
      const fbTrackingData = getFacebookTrackingData(typeof document !== 'undefined' ? document.cookie : null);
      const marketingData = getMarketingCookies();
      const eventId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const orderData = {
        ...formData,
        variant: selectedVariant,
        bundleItems,
        country: countryConfig.code,
        orderTotal: finalTotal,
        subtotal,
        shippingCost,
        fbp: fbTrackingData.fbp || undefined,
        fbc: fbTrackingData.fbc || undefined,
        eventId,
        marketingParams: marketingData,
        coupon: appliedCoupon
          ? {
              code: appliedCoupon.code,
              type: appliedCoupon.type,
              productDiscount: effectiveDiscount.productDiscount,
              shippingDiscount: effectiveDiscount.shippingDiscount,
              totalDiscount: effectiveDiscount.totalDiscount,
              ...(isBOGOActive && {
                isBOGO: true,
                bogoQuantity,
                bogoFreeItems: bogoDiscount.freeItems,
                bogoFreeValue: bogoDiscount.freeValue,
                bogoTotalItems: bogoDiscount.totalItems,
              }),
            }
          : undefined,
      };

      const result = await onOrderSubmit(orderData);

      if (!result.success) {
        setDialogError(result.error || t('validation.order_submission_failed'));
        setDialogType('error');
        setIsSubmitting(false);
        submitInFlightRef.current = false;
        return;
      }

      trackEvent(
        'purchase',
        {
          content_name: productName,
          content_category: 'Product',
          content_ids: [selectedVariant.id || 'main-product'],
          contents: [
            {
              id: selectedVariant.id || 'main-product',
              quantity: selectedVariant.quantity || 1,
              item_price: finalTotal,
            },
          ],
          currency: countryConfig.currency || 'RSD',
          value: finalTotal,
          order_id: result.orderId,
          num_items: selectedVariant.quantity || 1,
        },
        eventId,
      );

      setOrderResult({
        orderId: result.orderId,
        customerName: `${formData.firstName} ${formData.lastName}`,
        totalPrice: finalTotal,
        currency: countryConfig.currencySymbol,
      });
      setDialogType('success');

      setTimeout(() => {
        setDialogType(null);
        window.location.replace(`/${countryConfig.code}/thank-you`);
      }, 3000);
    } catch (error) {
      console.error('Form submission error:', error);
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

  return (
    <div className={cn('space-y-4', className)}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <section className="space-y-3">
          <h3 className="text-center text-xl font-bold text-slate-800">
            {t('checkout_v2.simpleTitle')}
          </h3>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <div className="relative rounded-[6px] border border-[#d9d0c5] bg-white">
                <Label
                  htmlFor="phone"
                  className={cn(
                    'pointer-events-none absolute left-[68px] z-10 origin-left truncate font-medium text-[#7d7d7d] transition-all duration-150',
                    isFieldActive('phone')
                      ? 'left-[66px] top-[3px] text-[10px] uppercase tracking-[0.02em]'
                      : 'top-1/2 -translate-y-1/2 text-[20px]',
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
                  className="[&>[data-slot=button]]:h-[56px] [&>[data-slot=button]]:rounded-none [&>[data-slot=button]]:rounded-l-[6px] [&>[data-slot=button]]:border-0 [&>[data-slot=button]]:border-r [&>[data-slot=button]]:border-[#d9d0c5] [&>[data-slot=button]]:bg-white [&>[data-slot=button]]:px-3 [&_[data-slot=input]]:h-[56px] [&_[data-slot=input]]:rounded-none [&_[data-slot=input]]:rounded-r-[6px] [&_[data-slot=input]]:border-0 [&_[data-slot=input]]:px-3 [&_[data-slot=input]]:pb-0 [&_[data-slot=input]]:pt-[3px] [&_[data-slot=input]]:!text-[20px] [&_[data-slot=input]]:font-medium [&_[data-slot=input]]:leading-[56px] [&_[data-slot=input]]:shadow-none"
                />
              </div>
              <FieldError message={formErrors.phone} />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <div className="relative">
                    <Label
                      htmlFor="firstName"
                      className={cn(
                        'pointer-events-none absolute left-3 right-3 z-10 origin-left truncate font-medium text-[#7d7d7d] transition-all duration-150',
                        isFieldActive('firstName')
                          ? 'top-[3px] text-[10px] uppercase tracking-[0.02em]'
                          : 'top-1/2 -translate-y-1/2 text-[20px]',
                      )}
                    >
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
                      className="h-[56px] rounded-[6px] border-[#d9d0c5] px-3 pb-0 pt-[3px] !text-[20px] font-medium leading-[56px] text-slate-900 shadow-none placeholder:text-transparent"
                    />
                  </div>
                  <FieldError message={formErrors.firstName} />
                </div>

                <div className="space-y-1.5">
                  <div className="relative">
                    <Label
                      htmlFor="lastName"
                      className={cn(
                        'pointer-events-none absolute left-3 right-3 z-10 origin-left truncate font-medium text-[#7d7d7d] transition-all duration-150',
                        isFieldActive('lastName')
                          ? 'top-[3px] text-[10px] uppercase tracking-[0.02em]'
                          : 'top-1/2 -translate-y-1/2 text-[20px]',
                      )}
                    >
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
                      className="h-[56px] rounded-[6px] border-[#d9d0c5] px-3 pb-0 pt-[3px] !text-[20px] font-medium leading-[56px] text-slate-900 shadow-none placeholder:text-transparent"
                    />
                  </div>
                  <FieldError message={formErrors.lastName} />
                </div>

                <div className="space-y-1.5">
                  <div className="relative">
                    <Label
                      htmlFor="address"
                      className={cn(
                        'pointer-events-none absolute left-3 right-3 z-10 origin-left truncate font-medium text-[#7d7d7d] transition-all duration-150',
                        isFieldActive('address')
                          ? 'top-[3px] text-[10px] uppercase tracking-[0.02em]'
                          : 'top-1/2 -translate-y-1/2 text-[20px]',
                      )}
                    >
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
                      className="h-[56px] rounded-[6px] border-[#d9d0c5] px-3 pb-0 pt-[3px] !text-[20px] font-medium leading-[56px] text-slate-900 shadow-none placeholder:text-transparent"
                    />
                  </div>
                  <FieldError message={formErrors.address} />
                </div>

                <div className="space-y-1.5">
                  <div className="relative">
                    <Label
                      htmlFor="city"
                      className={cn(
                        'pointer-events-none absolute left-3 right-3 z-10 origin-left truncate font-medium text-[#7d7d7d] transition-all duration-150',
                        isFieldActive('city')
                          ? 'top-[3px] text-[10px] uppercase tracking-[0.02em]'
                          : 'top-1/2 -translate-y-1/2 text-[20px]',
                      )}
                    >
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
                      className="h-[56px] rounded-[6px] border-[#d9d0c5] px-3 pb-0 pt-[3px] !text-[20px] font-medium leading-[56px] text-slate-900 shadow-none placeholder:text-transparent"
                    />
                  </div>
                  <FieldError message={formErrors.city} />
                </div>

                <div className="space-y-1.5">
                  <div className="relative">
                    <Label
                      htmlFor="postalCode"
                      className={cn(
                        'pointer-events-none absolute left-3 right-3 z-10 origin-left truncate font-medium text-[#7d7d7d] transition-all duration-150',
                        isFieldActive('postalCode')
                          ? 'top-[3px] text-[10px] uppercase tracking-[0.02em]'
                          : 'top-1/2 -translate-y-1/2 text-[20px]',
                      )}
                    >
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
                      className="h-[56px] rounded-[6px] border-[#d9d0c5] px-3 pb-0 pt-[3px] !text-[20px] font-medium leading-[56px] text-slate-900 shadow-none placeholder:text-transparent"
                    />
                  </div>
                  <FieldError message={formErrors.postalCode} />
                </div>

                <div className="space-y-1.5">
                  <div className="relative flex h-[56px] items-center rounded-[6px] border border-[#d9d0c5] bg-white px-3">
                    <span className="text-[20px] font-medium leading-[56px] text-slate-900">{countryConfig.name}</span>
                    <ChevronDown className="ml-auto h-4 w-4 text-slate-500" />
                  </div>
                </div>
            </div>
          </div>
        </section>

        <div className="rounded-[1rem] border border-[#358055]/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(247,251,248,0.98))] p-4 shadow-[0_10px_24px_rgba(53,128,85,0.08)]">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[0.85rem] border border-[#358055]/12 bg-white shadow-[0_6px_16px_rgba(15,23,42,0.06)]">
              <Image
                src={displayCourier.logo}
                alt={displayCourier.name}
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[18px] font-black leading-none text-slate-950">
                  Brza posta - {displayCourier.name}
                </p>
              </div>

              <p className="mt-2 text-sm font-medium leading-6 text-slate-700">
                Poštarina se naplaćuje po zvaničnom cenovniku kurirske službe.
              </p>
            </div>
          </div>

          <p className="mt-3 rounded-[0.8rem] bg-[#358055]/8 px-3 py-2 text-sm font-semibold text-[#358055]">
            Rok isporuke: {displayCourier.deliveryTime}
          </p>
        </div>

        <div className="space-y-3">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="h-12 w-full rounded-[8px] bg-[#358055] text-base font-bold text-white shadow-none hover:bg-[#2d6d48]"
          >
            {isSubmitting ? t('order_summary.processing_order') : t('order_summary.place_order')}
          </Button>

          <div className="flex items-center justify-center gap-2 rounded-[8px] border border-[#e6ddd1] bg-[#fbf8f4] px-4 py-3 text-center">
            <ShieldCheck className="h-4 w-4 text-[#358055]" />
            <span className="text-sm font-medium text-slate-700">{t('order_summary.secure_purchase_guarantee')}</span>
          </div>
        </div>
      </form>

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
