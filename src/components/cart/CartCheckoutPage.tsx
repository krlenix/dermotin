'use client';

import { checkoutEventId, completeCheckoutAttempt } from '@/utils/checkout-event';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { isValidPhoneNumber } from 'react-phone-number-input';
import {
  ArrowRight,
  Banknote,
  Gift,
  Lock,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from 'lucide-react';

import { PhoneInput } from '@/components/ui/phone-input';
import { cn } from '@/lib/utils';
import { COUNTRIES, CountryConfig, getDefaultCourier } from '@/config/countries';
import { VALIDATION_RULES } from '@/config/constants';
import { calculateShippingCost, getAmountForFreeShipping, qualifiesForFreeShipping } from '@/utils/shipping';
import { useCart } from '@/contexts/CartContext';
import { ShopHeader } from '@/components/shop/ShopHeader';
import { landerFontClass } from '@/components/store/fonts';
import { LANDER_BG, LanderFooter } from '@/components/store/LanderKit';
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
import { getStoreVisual, tightPackshot } from '@/config/store-content';
import type { CartLineItem } from '@/contexts/CartContext';
import type { OrderDisplayItem } from '@/components/ThankYouPage';

interface CartCheckoutPageProps {
  countryConfig: CountryConfig;
  locale: string;
}

/** Redosled polja na ekranu — fokus ide na prvo neispravno polje posle slanja */
const FIELD_ORDER = ['phone', 'firstName', 'lastName', 'address', 'city', 'postalCode', 'email'] as const;

/** Novi providni packshot (isti kao na karticama proizvoda); proizvod bez packshot-a zadržava sliku iz korpe */
const linePackshot = (line: CartLineItem) =>
  tightPackshot(getStoreVisual({ id: line.productId, images: { main: line.image, gallery: [] } }).packshot);

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
    // Tastatura i čitači ekrana: fokus na prvo neispravno polje (redosled kao na ekranu)
    const firstInvalid = FIELD_ORDER.find((field) => errors[field]);
    if (firstInvalid) document.getElementById(firstInvalid)?.focus();
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
      const eventId = await checkoutEventId({ formData, items, total, locale: countryConfig.code });

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
          productId: line.productId,
          variantId: line.variantId,
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

      completeCheckoutAttempt();

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

      // Strukturisane stavke (sa ugnježdenim gratis linijama) samo za prikaz na thank-you strani
      const displayItems: OrderDisplayItem[] = displayGroups.map((group) =>
        group.type === 'bogo'
          ? {
              type: 'bogo' as const,
              name: group.paid.productName,
              variant: group.paid.variantName,
              quantity: group.paid.quantity,
              image: group.paid.image,
              linePrice: roundPrice(
                (group.paid.bogoOriginalUnitPrice ?? group.paid.unitPrice) * group.paid.quantity
              ),
              regularPrice: roundPrice(group.paid.regularPrice * group.paid.quantity),
              free: group.free.map((line) => ({
                name: line.productName,
                variant: line.variantName,
                quantity: line.quantity,
                image: line.image,
              })),
            }
          : {
              type: 'regular' as const,
              name: group.line.productName,
              variant: group.line.variantName,
              quantity: group.line.quantity,
              image: group.line.image,
              linePrice: roundPrice(group.line.unitPrice * group.line.quantity),
              regularPrice: roundPrice(group.line.regularPrice * group.line.quantity),
            }
      );

      sessionStorage.setItem(
        'completedOrder',
        JSON.stringify({
          ...apiOrderData,
          orderId: result.orderId,
          displayItems,
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
      // Greška mreže/pregledača je na engleskom ("Failed to fetch") — kupcu ide srpska poruka
      setDialogError(t('validation.order_submission_failed'));
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

  type Field = keyof typeof formData;

  // Obrazac pristupačne forme iz QuickOrderForm: labela iznad polja, greška ispod (aria-describedby)
  const fieldProps = (field: Field, required = true) => ({
    id: field,
    name: field,
    'aria-required': required || undefined,
    'aria-invalid': Boolean(formErrors[field]),
    'aria-describedby': formErrors[field] ? `${field}-error` : undefined,
    onBlur: () => handleBlur(field),
  });

  const inputClass = (field: Field) =>
    cn(
      'h-[52px] w-full rounded-md border bg-white px-4 text-[1rem] text-ink outline-none transition placeholder:text-ink-muted focus:border-green-press focus:ring-2 focus:ring-green-press/25',
      formErrors[field] ? 'border-red-600 bg-red-50/40' : 'border-line'
    );

  const label = (field: Field, text: ReactNode) => (
    <label htmlFor={field} className="mb-1.5 block text-[0.875rem] font-medium text-ink-soft">
      {text}
    </label>
  );

  const fieldError = (field: Field) =>
    formErrors[field] ? (
      <p id={`${field}-error`} className="mt-1.5 text-[0.8125rem] font-medium text-red-700">
        {formErrors[field]}
      </p>
    ) : null;

  const errorCount = Object.values(formErrors).filter(Boolean).length;
  // Ušteda na proizvodima + popust kupona (isti iznos kao u korpi)
  const savingsShown = roundPrice(totalSavings + couponAmounts.productDiscount);

  const linePrice = (regular: number, charged: number) => (
    <div className="text-right">
      {regular > charged && (
        <p className="text-[0.8125rem] text-ink-muted">
          <span className="sr-only">{t('bogo.regular_price')}: </span>
          <span className="line-through">{formatPrice(regular)}</span>
        </p>
      )}
      <p className="text-[0.9375rem] font-extrabold text-ink">{formatPrice(charged)}</p>
    </div>
  );

  const lineHeader = (line: CartLineItem) => (
    <div className="flex items-start justify-between gap-1">
      <div className="min-w-0 pt-0.5">
        <p className="truncate text-[0.9375rem] font-bold uppercase leading-snug text-ink">{line.productName}</p>
        <p className="mt-0.5 truncate text-[0.8125rem] text-ink-muted">{line.variantName}</p>
      </div>
      <button
        type="button"
        onClick={() => removeItem(line.lineId)}
        aria-label={t('cart.remove_item', { product: line.productName })}
        className="-mr-2 -mt-1.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-coral-soft hover:text-coral-deep"
      >
        <Trash2 className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );

  const lineThumbnail = (line: CartLineItem) => (
    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-panel bg-paper">
      <Image src={linePackshot(line)} alt="" fill className="object-contain p-1.5" sizes="64px" />
    </div>
  );

  return (
    <div className={cn(landerFontClass, 'relative min-h-screen overflow-x-hidden', LANDER_BG)} style={{ maxWidth: '100vw' }}>
      <PixelTracker countryCode={countryConfig.code} />

      <ShopHeader />

      <main className="relative pb-16">
        <div className="mx-auto max-w-[1180px] px-3 pt-6 md:px-6 md:pt-8">
          <h1 className="text-balance text-[1.875rem] font-extrabold leading-tight tracking-[-0.01em] text-ink md:text-[2.25rem]">
            {t('checkout.title')}
          </h1>

          {isHydrated && items.length === 0 ? (
            <div className="section-card-strong mx-auto mt-8 flex max-w-xl flex-col items-center gap-4 px-6 py-12 text-center">
              <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-mint-soft">
                <ShoppingBag className="h-9 w-9 text-green" aria-hidden />
              </span>
              <div>
                <p className="text-balance text-[1.25rem] font-extrabold text-ink">{t('cart.empty_title')}</p>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">{t('cart.empty_subtitle')}</p>
              </div>
              <Link
                href={`/${locale}/products`}
                className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-green px-7 text-[1rem] font-bold text-white transition-colors hover:bg-green-press"
              >
                {t('cart.browse_products')}
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
              {/* Delivery form */}
              <section aria-labelledby="cart-delivery-title" className="section-card-strong px-5 py-6 md:px-7 md:py-7">
                <h2 id="cart-delivery-title" className="text-balance text-[1.125rem] font-bold text-ink">
                  {t('checkout_v2.simpleTitle')}
                </h2>
                <p className="mt-1 text-[0.8125rem] text-ink-muted">{t('checkout.required_note')}</p>
                <p className="sr-only" aria-live="polite">{errorCount > 0 ? t('store.form.check_fields') : ''}</p>

                <div className="mt-5 space-y-4">
                  <div>
                    {label('phone', t('forms.phone'))}
                    <div
                      className={cn(
                        'overflow-hidden rounded-md border bg-white transition focus-within:border-green-press focus-within:ring-2 focus-within:ring-green-press/25',
                        formErrors.phone ? 'border-red-600' : 'border-line'
                      )}
                    >
                      <PhoneInput
                        {...fieldProps('phone')}
                        value={formData.phone}
                        onChange={(value) => handleInputChange('phone', value || '')}
                        placeholder={t('store.form.phone_placeholder')}
                        defaultCountry={countryConfig.code.toUpperCase() as 'RS' | 'BA' | 'ME'}
                        countries={supportedCountries}
                        className="[&>[data-slot=button]]:h-[52px] [&>[data-slot=button]]:rounded-none [&>[data-slot=button]]:border-0 [&>[data-slot=button]]:border-r [&>[data-slot=button]]:border-line [&>[data-slot=button]]:bg-paper [&>[data-slot=button]]:px-3 [&_[data-slot=input]]:h-[52px] [&_[data-slot=input]]:rounded-none [&_[data-slot=input]]:border-0 [&_[data-slot=input]]:px-3 [&_[data-slot=input]]:!text-[1rem] [&_[data-slot=input]]:text-ink [&_[data-slot=input]]:shadow-none [&_[data-slot=input]]:placeholder:text-ink-muted [&_[data-slot=input]]:focus-visible:ring-0"
                      />
                    </div>
                    {fieldError('phone')}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      {label('firstName', t('forms.name'))}
                      <input
                        {...fieldProps('firstName')}
                        autoComplete="given-name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={inputClass('firstName')}
                      />
                      {fieldError('firstName')}
                    </div>

                    <div>
                      {label('lastName', t('forms.surname'))}
                      <input
                        {...fieldProps('lastName')}
                        autoComplete="family-name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={inputClass('lastName')}
                      />
                      {fieldError('lastName')}
                    </div>

                    <div>
                      {label('address', t('checkout_v2.simpleAddressLabel'))}
                      <input
                        {...fieldProps('address')}
                        autoComplete="street-address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder={t('store.form.address_placeholder')}
                        className={inputClass('address')}
                      />
                      {fieldError('address')}
                    </div>

                    <div>
                      {label('city', t('forms.city'))}
                      <input
                        {...fieldProps('city')}
                        autoComplete="address-level2"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder={t('store.form.city_placeholder')}
                        className={inputClass('city')}
                      />
                      {fieldError('city')}
                    </div>

                    <div>
                      {label('postalCode', t('forms.postal_code'))}
                      <input
                        {...fieldProps('postalCode')}
                        autoComplete="postal-code"
                        inputMode="numeric"
                        maxLength={5}
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        className={inputClass('postalCode')}
                      />
                      {fieldError('postalCode')}
                    </div>

                    {/* Zemlja dostave je određena sajtom (nije polje za unos) */}
                    <div>
                      <p className="mb-1.5 text-[0.875rem] font-medium text-ink-soft">{t('forms.country')}</p>
                      <p className="flex h-[52px] items-center rounded-md border border-line bg-paper px-4 text-[1rem] text-ink">
                        {countryConfig.name}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      {label(
                        'email',
                        <>
                          {t('forms.email')} <span className="font-normal text-ink-muted">({t('forms.optional')})</span>
                        </>
                      )}
                      <input
                        {...fieldProps('email', false)}
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={inputClass('email')}
                      />
                      {fieldError('email')}
                    </div>
                  </div>
                </div>

                {/* Courier info */}
                <div className="mt-6 rounded-panel bg-paper p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[0.75rem] bg-white">
                      <Image
                        src={courier.logo}
                        alt=""
                        width={32}
                        height={32}
                        className="h-8 w-8 object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[1rem] font-bold leading-tight text-ink">{courier.name}</p>
                      <p className="mt-1 text-[0.875rem] text-ink-soft">
                        {t('shop.delivery_time', { time: courier.deliveryTime })}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 flex items-center gap-2 text-[0.875rem] font-semibold text-forest">
                    <Banknote className="h-4 w-4 shrink-0 text-green" aria-hidden />
                    {t('store.form.reassure_cod')}
                  </p>
                </div>
              </section>

              {/* Order summary */}
              <section aria-labelledby="cart-summary-title" className="section-card-strong px-5 py-6 md:px-6">
                <h2 id="cart-summary-title" className="text-balance text-[1.125rem] font-bold text-ink">
                  {t('order_summary.title')}
                </h2>

                <ul className="mt-2 divide-y divide-line">
                  {displayGroups.map((group) => {
                    if (group.type === 'bogo') {
                      const { paid, free } = group;
                      return (
                        <li key={paid.bogoPairId} className="py-3.5">
                          <div className="flex gap-3">
                            {lineThumbnail(paid)}
                            <div className="min-w-0 flex-1">
                              {lineHeader(paid)}
                              <div className="mt-1.5 flex items-center justify-between gap-2">
                                <span className="text-[0.8125rem] font-semibold text-forest">
                                  {t('bogo.pair_includes_gratis', { count: free.length })}
                                </span>
                                {linePrice(
                                  paid.regularPrice * paid.quantity,
                                  (paid.bogoOriginalUnitPrice ?? paid.unitPrice) * paid.quantity
                                )}
                              </div>
                            </div>
                          </div>
                          {free.length > 0 && (
                            <ul className="mt-3 space-y-2 rounded-panel bg-mint-soft p-2.5">
                              {free.map((line) => (
                                <li key={line.lineId} className="flex items-center gap-2.5">
                                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[0.625rem] bg-white">
                                    <Image src={linePackshot(line)} alt="" fill className="object-contain p-1" sizes="40px" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-[0.8125rem] font-bold text-ink">{line.productName}</p>
                                    <p className="truncate text-[0.75rem] text-ink-muted">{line.variantName}</p>
                                  </div>
                                  <span className="shrink-0 text-[0.8125rem] font-extrabold uppercase text-forest">
                                    {t('bogo.pair_gratis')}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    }

                    const line = group.line;
                    return (
                      <li key={line.lineId} className="flex gap-3 py-3.5">
                        {lineThumbnail(line)}
                        <div className="min-w-0 flex-1">
                          {lineHeader(line)}
                          <div className="mt-1.5 flex items-center justify-between gap-2">
                            <div
                              role="group"
                              aria-label={`${t('cart.quantity')}: ${line.productName}`}
                              className="inline-flex items-center rounded-full border border-line bg-white"
                            >
                              <button
                                type="button"
                                onClick={() => updateQuantity(line.lineId, line.quantity - 1)}
                                aria-label={t('cart.decrease_qty', { product: line.productName })}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-mint-soft hover:text-forest"
                              >
                                <Minus className="h-4 w-4" aria-hidden />
                              </button>
                              <span className="min-w-8 text-center text-[0.9375rem] font-bold tabular-nums text-ink" aria-live="polite">
                                {line.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(line.lineId, line.quantity + 1)}
                                aria-label={t('cart.increase_qty', { product: line.productName })}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-mint-soft hover:text-forest"
                              >
                                <Plus className="h-4 w-4" aria-hidden />
                              </button>
                            </div>
                            {linePrice(line.regularPrice * line.quantity, line.unitPrice * line.quantity)}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {!hasFreeShipping && amountForFreeShipping > 0 && (
                  <p className="mt-3 flex items-center gap-2 rounded-panel bg-coral-soft px-3 py-2.5 text-[0.875rem] font-semibold text-coral-deep">
                    <Truck className="h-4 w-4 shrink-0" aria-hidden />
                    {t('cart.free_shipping_progress', { amount: formatPrice(amountForFreeShipping) })}
                  </p>
                )}

                {/* 1+1 kupon — automatski primenjen kada je par u korpi */}
                {hasBogoPair && (
                  <div className="coupon-banner-animate mt-4 flex items-center gap-3 rounded-panel bg-green p-3 text-white">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
                      <Gift className="h-5 w-5" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[0.9375rem] font-extrabold uppercase tracking-wide">
                        {t('bogo.coupon_applied', { code: BOGO_CONFIG.couponCode })}
                      </p>
                      <p className="text-[0.8125rem] font-medium text-white">
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
                        <p className="rounded-panel bg-coral-soft px-3 py-2 text-[0.8125rem] font-semibold text-coral-deep">
                          {t('coupons.min_order_not_met', { amount: formatPrice(appliedCoupon.minOrderValue) })}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="mt-4 border-t border-line pt-4">
                      <label htmlFor="coupon-code" className="mb-1.5 block text-[0.875rem] font-medium text-ink-soft">
                        {t('coupons.have_coupon')}
                      </label>
                      <div className="flex gap-2">
                        <input
                          id="coupon-code"
                          name="coupon"
                          autoComplete="off"
                          value={couponInput}
                          onChange={(e) => {
                            setCouponInput(e.target.value.toUpperCase());
                            if (couponError) setCouponError('');
                          }}
                          onKeyDown={(e) => {
                            // Enter u polju za kupon primenjuje kupon — ne šalje porudžbinu
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (couponInput.trim()) applyCoupon(couponInput, 'manual');
                            }
                          }}
                          placeholder={t('coupons.placeholder')}
                          aria-invalid={Boolean(couponError)}
                          aria-describedby={couponError ? 'coupon-code-error' : undefined}
                          className={cn(
                            'h-12 min-w-0 flex-1 rounded-md border bg-white px-4 text-[1rem] uppercase text-ink outline-none transition placeholder:text-ink-muted focus:border-green-press focus:ring-2 focus:ring-green-press/25',
                            couponError ? 'border-red-600 bg-red-50/40' : 'border-line'
                          )}
                        />
                        <button
                          type="button"
                          disabled={couponApplying || !couponInput.trim()}
                          onClick={() => applyCoupon(couponInput, 'manual')}
                          className="h-12 shrink-0 rounded-md border-2 border-green bg-white px-4 text-[0.9375rem] font-bold text-forest transition-colors hover:bg-mint-soft disabled:cursor-not-allowed disabled:border-line disabled:text-ink-muted disabled:hover:bg-white"
                        >
                          {couponApplying ? t('coupons.validating') : t('coupons.apply')}
                        </button>
                      </div>
                      {couponError && (
                        <p id="coupon-code-error" className="mt-1.5 text-[0.8125rem] font-medium text-red-700">
                          {couponError}
                        </p>
                      )}
                    </div>
                  ))}

                {/* Obračun: tačan iznos koji se plaća kuriru, sa dostavom */}
                <dl className="mt-4 space-y-2.5 rounded-[1.125rem] bg-paper p-4 text-[0.875rem] sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-ink-soft">{t('cart.subtotal')}</dt>
                    <dd className="font-medium text-ink">{formatPrice(subtotal)}</dd>
                  </div>
                  {hasBogoPair && (
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-ink-soft">{t('bogo.coupon_row_label', { code: BOGO_CONFIG.couponCode })}</dt>
                      <dd className="font-extrabold uppercase text-forest">{t('bogo.pair_gratis')}</dd>
                    </div>
                  )}
                  {couponAmounts.productDiscount > 0 && appliedCoupon && (
                    <div className="coupon-banner-animate flex items-center justify-between gap-3">
                      <dt className="text-ink-soft">
                        {t('checkout_v2.discountLabel')} ({appliedCoupon.code})
                      </dt>
                      <dd className="font-semibold text-forest">−{formatPrice(couponAmounts.productDiscount)}</dd>
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-3">
                    <dt className="inline-flex items-center gap-2 text-ink-soft">
                      <Truck className="h-4 w-4 text-ink-muted" strokeWidth={1.6} aria-hidden />
                      {t('store.form.shipping')}
                    </dt>
                    <dd className={cn('font-medium', shippingCost > 0 ? 'text-ink' : 'text-forest')}>
                      {shippingCost > 0 ? formatPrice(shippingCost) : t('store.form.free')}
                    </dd>
                  </div>
                  <div className="flex items-end justify-between gap-3 border-t border-line pt-3">
                    <dt className="pb-0.5 text-[0.9375rem] font-semibold text-ink">{t('store.form.total')}</dt>
                    <dd className="text-[1.5rem] font-extrabold leading-none tracking-tight text-ink">{formatPrice(total)}</dd>
                  </div>
                </dl>
                {savingsShown > 0 && (
                  <p className="mt-1.5 text-right text-[0.8125rem] font-medium text-coral-deep">
                    {t('store.form.you_save', { amount: formatPrice(savingsShown) })}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="lander-shine mt-5 flex min-h-[62px] w-full items-center justify-center gap-2.5 rounded-full bg-green-press px-5 text-[1.25rem] font-bold text-white shadow-press-lg transition duration-300 hover:bg-forest active:translate-y-[3px] active:shadow-press disabled:opacity-70"
                >
                  <Lock className="h-5 w-5" aria-hidden />
                  {isSubmitting ? t('checkout.processing') : t('order_summary.place_order')}
                </button>

                <p className="mt-4 flex items-center justify-center gap-2 text-center text-[0.875rem] font-medium text-ink-soft">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-green" aria-hidden />
                  {t('order_summary.secure_purchase_guarantee')}
                </p>
              </section>
            </form>
          )}
        </div>
      </main>

      <LanderFooter countryConfig={countryConfig} locale={locale} className="pb-6" />
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
