'use client';

import { useState, useEffect } from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import { Label } from '@/components/ui/label';


import { Badge } from '@/components/ui/badge';
import { ProductVariant } from '@/config/products';
import { CountryConfig, CourierInfo, getAvailableCouriers, COUNTRIES } from '@/config/countries';

import { useTranslations } from 'next-intl';
import { VALIDATION_RULES } from '@/config/constants';
import { calculateShippingCost, qualifiesForFreeShipping } from '@/utils/shipping';
import { getDefaultCourier } from '@/config/countries';
import { Truck, Banknote, Shield, Phone, MapPin, User, Check, Tag, X } from 'lucide-react';
import Image from 'next/image';
import { UpsellCrossSell } from './UpsellCrossSell';
import { CompactOrderSummary } from './CompactOrderSummary';
import { usePixelTracking } from '@/components/tracking/PixelTracker';
import { CheckoutDialog, CheckoutDialogType } from './CheckoutDialog';
import { getFacebookTrackingData } from '@/utils/facebook-cookies';
import { getMarketingCookies } from '@/utils/marketing-cookies';
import { validateCouponWithAPI, calculateCouponDiscount, type Coupon } from '@/config/coupons';

interface CheckoutFormProps {
  selectedVariant: ProductVariant;
  countryConfig: CountryConfig;
  productName: string;
  bundleItems?: {[key: string]: number};
  onOrderSubmit: (orderData: Record<string, unknown>) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  className?: string;
  mainProductId: string;
  onAddToBundle: (productId: string, price: number) => void;
  selectedCourier?: CourierInfo;
  onCourierChange?: (courier: CourierInfo) => void;
  onReselect?: () => void;
}

export function CheckoutForm({ 
  selectedVariant, 
  countryConfig, 
  productName,
  bundleItems = {},
  onOrderSubmit,
  className,
  mainProductId,
  onAddToBundle,
  selectedCourier,
  onCourierChange,
  onReselect
}: CheckoutFormProps) {
  const t = useTranslations();
  // Simple price formatter using the country's currency symbol (no conversion)
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('sr-RS', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount) + ' ' + countryConfig.currencySymbol;
  };
  
  // Helper function to round prices to 2 decimal places (avoid floating-point errors)
  const roundPrice = (price: number): number => {
    return Math.round(price * 100) / 100;
  };
  
  const { trackEvent } = usePixelTracking(countryConfig.code);
  
  // Form validation function
  const validateField = (field: string, value: string): string => {
    const tValidation = t.raw('validation');
    switch (field) {
      case 'firstName':
        return value.length < VALIDATION_RULES.minNameLength ? tValidation.name_min_length : '';
      case 'lastName':
        return value.length < VALIDATION_RULES.minSurnameLength ? tValidation.surname_min_length : '';
      case 'phone':
        return !isValidPhoneNumber(value) ? tValidation.phone_invalid : '';
      case 'address':
        return value.length < VALIDATION_RULES.minAddressLength ? tValidation.address_min_length : '';
      case 'city':
        return value.length < VALIDATION_RULES.minCityLength ? tValidation.city_min_length : '';
      case 'postalCode':
        if (value && !/^\d{5}$/.test(value)) {
          return tValidation.postal_code_invalid || 'Poštanski broj mora imati tačno 5 cifara';
        }
        return '';
      default:
        return '';
    }
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cod',
    agreeMarketing: false
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogType, setDialogType] = useState<CheckoutDialogType>(null);
  const [dialogError, setDialogError] = useState<string>('');
  const [orderResult, setOrderResult] = useState<{orderId?: string; customerName?: string; totalPrice?: number; currency?: string}>({});
  const [hasStartedCheckout, setHasStartedCheckout] = useState(false);
  
  // Coupon state
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string>('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [showCouponField, setShowCouponField] = useState(true);
  const [isValidatingUrlCoupon, setIsValidatingUrlCoupon] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [animatedSavings, setAnimatedSavings] = useState(0);
  
  // Coupon handling functions
  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = codeToApply || couponCode;
    if (!code.trim()) return;
    
    setIsApplyingCoupon(true);
    setCouponError('');
    
    try {
      // Calculate current subtotal (before shipping)
      const orderTotal = selectedVariant.discountPrice || selectedVariant.price;
      const bundleTotal = Object.values(bundleItems).reduce((sum, price) => sum + price, 0);
      const subtotal = roundPrice(orderTotal + bundleTotal);
      
      // Validate coupon with API integration (falls back to static if API fails)
      const validation = await validateCouponWithAPI(code, subtotal, countryConfig.code);
      
      if (!validation.valid) {
        // Set error message based on error type
        if (validation.error === 'invalid_code') {
          setCouponError(t('coupons.invalid_code'));
        } else if (validation.error === 'not_valid_country') {
          setCouponError(t('coupons.not_valid_country'));
        } else if (validation.error === 'min_order_not_met' && validation.coupon) {
          const minValue = validation.coupon.minOrderValue || 0;
          setCouponError(t('coupons.min_order_not_met', { amount: formatPrice(minValue) }));
        }
        setIsApplyingCoupon(false);
        return;
      }
      
      // Apply coupon with success animation
      setAppliedCoupon(validation.coupon!);
      setCouponError('');
      setIsApplyingCoupon(false);
      
      // Trigger success animation instantly
      setShowSuccessAnimation(true);
      
      // Show final savings amount immediately (no rolling animation)
      const targetSavings = couponDiscount.totalDiscount || 0;
      setAnimatedSavings(targetSavings);
      
      // Reset animation flag quickly
      setTimeout(() => {
        setShowSuccessAnimation(false);
      }, 400);
    } catch (error) {
      console.error('Error applying coupon:', error);
      setCouponError(t('coupons.invalid_code'));
      setIsApplyingCoupon(false);
    }
  };
  
  // Check URL parameters for coupon and medium on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const urlCoupon = searchParams.get('coupon');
      const urlMedium = searchParams.get('medium');
      
      // Hide coupon field if medium is set in URL
      if (urlMedium) {
        setShowCouponField(false);
      }
      
      // Auto-apply coupon from URL if present (async, non-blocking)
      if (urlCoupon && !urlMedium) {
        const normalizedCode = urlCoupon.toUpperCase();
        setCouponCode(normalizedCode);
        setIsValidatingUrlCoupon(true);
        
        // Validate coupon asynchronously without blocking page load
        (async () => {
          try {
            // Small delay to ensure component is fully mounted
            await new Promise(resolve => setTimeout(resolve, 100));
            
            console.log(`🔍 Auto-validating coupon from URL: ${normalizedCode}`);
            await handleApplyCoupon(normalizedCode);
            
          } catch (error) {
            console.error('Error auto-applying URL coupon:', error);
          } finally {
            setIsValidatingUrlCoupon(false);
          }
        })();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (field: string, value: string | boolean) => {
    // For postal code, only allow numeric input
    if (field === 'postalCode' && typeof value === 'string') {
      value = value.replace(/\D/g, '').slice(0, 5);
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Track InitiateCheckout event when user starts filling the form (only once)
    if (!hasStartedCheckout && typeof value === 'string' && value.trim().length > 0) {
      setHasStartedCheckout(true);
      
      // Track the event with order data
      const eventData = {
        content_name: productName,
        content_category: 'Product',
        content_ids: [selectedVariant.id || mainProductId],
        contents: [{
          id: selectedVariant.id || mainProductId,
          quantity: 1,
          item_price: selectedVariant.discountPrice || selectedVariant.price
        }],
        currency: countryConfig.currency || 'RSD',
        value: (selectedVariant.discountPrice || selectedVariant.price) + Object.values(bundleItems).reduce((sum, price) => sum + price, 0),
        num_items: 1 + Object.keys(bundleItems).length
      };
      
      trackEvent('initiate_checkout', eventData);
    }
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field: string) => {
    const value = formData[field as keyof typeof formData] as string;
    const error = validateField(field, value);
    if (error) {
      setFormErrors(prev => ({ ...prev, [field]: error }));
    }
  };
  
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const fieldsToValidate = ['firstName', 'lastName', 'phone', 'address', 'city', 'postalCode'];
    
    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData] as string);
      if (error) {
        errors[field] = error;
      }
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setDialogType('loading');
    
    try {
      // Get Facebook tracking data for CAPI deduplication
      const fbTrackingData = getFacebookTrackingData(typeof document !== 'undefined' ? document.cookie : null);
      
      // Get marketing parameters (from cookies or sessionStorage)
      const marketingData = getMarketingCookies();
      
      // Generate event ID for deduplication between browser pixel and CAPI
      const eventId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Prepare order data
      const orderData = {
        ...formData,
        variant: selectedVariant,
        bundleItems: bundleItems,
        country: countryConfig.code,
        orderTotal: finalTotal,
        subtotal: subtotal,
        shippingCost: shippingCost,
        fbp: fbTrackingData.fbp || undefined,
        fbc: fbTrackingData.fbc || undefined,
        eventId: eventId,
        // Include marketing parameters for webhook
        marketingParams: marketingData,
        // Include coupon data
        coupon: appliedCoupon ? {
          code: appliedCoupon.code,
          type: appliedCoupon.type,
          productDiscount: couponDiscount.productDiscount,
          shippingDiscount: couponDiscount.shippingDiscount,
          totalDiscount: couponDiscount.totalDiscount
        } : undefined
      };

      // Call onOrderSubmit and wait for result
      const result = await onOrderSubmit(orderData);
      
      if (result.success) {
        // Track Purchase event immediately after successful order submission
        const purchaseEventData = {
          content_name: productName,
          content_category: 'Product',
          content_ids: [selectedVariant.id || 'main-product'],
          contents: [{
            id: selectedVariant.id || 'main-product',
            quantity: selectedVariant.quantity || 1,
            item_price: finalTotal
          }],
          currency: countryConfig.currency || 'RSD',
          value: finalTotal,
          order_id: result.orderId,
          num_items: selectedVariant.quantity || 1
        };
        
        // Fire Purchase event for both Meta and TikTok with eventId for deduplication
        trackEvent('purchase', purchaseEventData, eventId);
        
        // Set success dialog data
        setOrderResult({
          orderId: result.orderId,
          customerName: `${formData.firstName} ${formData.lastName}`,
          totalPrice: finalTotal,
          currency: countryConfig.currencySymbol
        });
        setDialogType('success');
        
        // Auto-close success dialog and redirect after 3 seconds
        setTimeout(() => {
          setDialogType(null);
          // Redirect to thank you page
          window.location.replace(`/${countryConfig.code}/thank-you`);
        }, 3000);
      } else {
        // Show error dialog
        setDialogError(result.error || t('validation.order_submission_failed'));
        setDialogType('error');
        setIsSubmitting(false);
      }
    } catch (error) {
      // Show error dialog
      setDialogError(error instanceof Error ? error.message : t('validation.order_submission_failed'));
      setDialogType('error');
      setIsSubmitting(false);
      console.error('Form submission error:', error);
    }
  };

  const handleDialogClose = () => {
    const currentDialogType = dialogType;
    setDialogType(null);
    setDialogError('');
    
    if (currentDialogType === 'error') {
      setIsSubmitting(false);
    } else if (currentDialogType === 'success') {
      // If user manually closes success dialog, redirect immediately
      window.location.replace(`/${countryConfig.code}/thank-you`);
    }
  };

  const orderTotal = selectedVariant.discountPrice || selectedVariant.price;
  const bundleTotal = Object.values(bundleItems).reduce((sum, price) => sum + price, 0);
  const subtotal = roundPrice(orderTotal + bundleTotal);
  
  // Use selected courier or fallback to default
  const displayCourier = selectedCourier || getDefaultCourier(countryConfig);
  const availableCouriers = getAvailableCouriers(countryConfig);
  const showCourierSelection = availableCouriers.length >= 1;
  const isSingleCourier = availableCouriers.length === 1;
  
  // Get supported countries for phone input (only countries we have configured)
  const supportedCountries = Object.keys(COUNTRIES).map(code => code.toUpperCase()) as Array<'RS' | 'BA' | 'HR'>;
  
  // Calculate shipping cost using selected courier and country threshold
  const hasFreeShipping = qualifiesForFreeShipping(subtotal, countryConfig);
  const baseShippingCost = hasFreeShipping ? 0 : roundPrice(calculateShippingCost(subtotal, displayCourier, countryConfig));
  
  // Calculate coupon discounts
  const couponDiscount = appliedCoupon 
    ? calculateCouponDiscount(appliedCoupon, subtotal, baseShippingCost)
    : { productDiscount: 0, shippingDiscount: 0, totalDiscount: 0 };
  
  // Apply discounts
  const subtotalAfterDiscount = roundPrice(subtotal - couponDiscount.productDiscount);
  const shippingCost = roundPrice(baseShippingCost - couponDiscount.shippingDiscount);
  const finalTotal = roundPrice(subtotalAfterDiscount + shippingCost);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Checkout Form */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <User className="h-5 w-5" />
            {t('order_summary.delivery_info')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* URL Coupon Validation Status - Show while validating from URL */}
            {isValidatingUrlCoupon && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <div>
                    <p className="text-sm font-semibold text-blue-900">
                      {t('coupons.validating')}
                    </p>
                    <p className="text-xs text-blue-600">
                      {t('coupons.checking_code')} &ldquo;{couponCode}&rdquo;...
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Coupon Code Section - Show only if not hidden by medium parameter AND no coupon applied */}
            {showCouponField && !appliedCoupon && (
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2 mb-3">
                  <Tag className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <Label className="text-sm font-semibold text-gray-900 mb-1 block">
                      {t('coupons.have_coupon')}
                    </Label>
                    <p className="text-xs text-gray-600">{t('coupons.enter_code')}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                    <Input
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      setCouponError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleApplyCoupon();
                      }
                    }}
                    placeholder={t('coupons.placeholder')}
                    className="flex-1 uppercase focus:ring-green-500 focus:border-green-500"
                    disabled={isApplyingCoupon}
                  />
                  <Button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    disabled={!couponCode.trim() || isApplyingCoupon}
                    className="bg-green-600 hover:bg-green-700 text-white px-6"
                  >
                    {isApplyingCoupon ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      t('coupons.apply')
                    )}
                  </Button>
                </div>
                
                {couponError && (
                  <p className="text-red-600 text-xs font-medium flex items-center gap-1.5 mt-2">
                    <span className="inline-flex w-3 h-3 rounded-full bg-red-100 items-center justify-center flex-shrink-0">
                      <span className="text-red-600 text-[9px] font-bold leading-none">!</span>
                    </span>
                    {couponError}
                  </p>
                )}
              </div>
            )}
            
            {/* Applied Coupon Display - Simple and clean, shows when coupon is applied */}
            {appliedCoupon && showCouponField && (
              <div className={`p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 rounded-lg transition-all duration-200 ease-out ${
                showSuccessAnimation 
                  ? 'border-green-500 shadow-xl shadow-green-300/50 scale-[1.02]' 
                  : 'border-green-400'
              }`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-green-900 mb-1">
                      {t('coupons.coupon_applied')} 🎉
                    </p>
                    <p className="text-xs text-green-700">
                      {t('coupons.code')}: <span className="font-bold text-green-800">{appliedCoupon.code}</span>
                      {appliedCoupon.type === 'percentage' && ` • ${appliedCoupon.value}% ${t('coupons.discount')}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {couponDiscount.totalDiscount > 0 && (
                      <div className="text-right">
                        <p className="text-xs text-gray-600">{t('coupons.you_save')}</p>
                        <p className="text-xl font-bold text-green-600 tabular-nums">
                          -{formatPrice(showSuccessAnimation ? animatedSavings : couponDiscount.totalDiscount)}
                        </p>
                      </div>
                    )}
                    <Button
                      type="button"
                      onClick={handleRemoveCoupon}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="flex items-center gap-1 text-gray-700">
                  <User className="h-4 w-4" />
                  {t('forms.name')} *
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  onBlur={() => handleBlur('firstName')}
                  required
                  className={`focus:ring-brand-orange focus:border-brand-orange ${
                    formErrors.firstName ? 'border-red-500 ring-2 ring-red-200' : ''
                  }`}
                />
                {formErrors.firstName && (
                  <p className="text-red-600 text-xs font-medium flex items-center gap-1.5 mt-1">
                    <span className="inline-flex w-3 h-3 rounded-full bg-red-100 items-center justify-center flex-shrink-0">
                      <span className="text-red-600 text-[9px] font-bold leading-none">!</span>
                    </span>
                    {formErrors.firstName}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-700">{t('forms.surname')} *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  onBlur={() => handleBlur('lastName')}
                  required
                  className={`focus:ring-brand-orange focus:border-brand-orange ${
                    formErrors.lastName ? 'border-red-500 ring-2 ring-red-200' : ''
                  }`}
                />
                {formErrors.lastName && (
                  <p className="text-red-600 text-xs font-medium flex items-center gap-1.5 mt-1">
                    <span className="inline-flex w-3 h-3 rounded-full bg-red-100 items-center justify-center flex-shrink-0">
                      <span className="text-red-600 text-[9px] font-bold leading-none">!</span>
                    </span>
                    {formErrors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-1 text-gray-700">
                  <Phone className="h-4 w-4" />
                  {t('forms.phone')} *
                </Label>
                <PhoneInput
                  value={formData.phone}
                  onChange={(value) => handleInputChange('phone', value || '')}
                  onBlur={() => handleBlur('phone')}
                  placeholder="Enter phone number"
                  defaultCountry={countryConfig.code.toUpperCase() as 'RS' | 'BA' | 'HR'}
                  countries={supportedCountries}
                  className={`focus:ring-brand-orange focus:border-brand-orange ${
                    formErrors.phone ? 'border-red-500 ring-2 ring-red-200' : ''
                  }`}
                />
                {formErrors.phone && (
                  <p className="text-red-600 text-xs font-medium flex items-center gap-1.5 mt-1">
                    <span className="inline-flex w-3 h-3 rounded-full bg-red-100 items-center justify-center flex-shrink-0">
                      <span className="text-red-600 text-[9px] font-bold leading-none">!</span>
                    </span>
                    {formErrors.phone}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="text-gray-700">{t('forms.city')} *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  onBlur={() => handleBlur('city')}
                  required
                  className={`focus:ring-brand-orange focus:border-brand-orange ${
                    formErrors.city ? 'border-red-500 ring-2 ring-red-200' : ''
                  }`}
                />
                {formErrors.city && (
                  <p className="text-red-600 text-xs font-medium flex items-center gap-1.5 mt-1">
                    <span className="inline-flex w-3 h-3 rounded-full bg-red-100 items-center justify-center flex-shrink-0">
                      <span className="text-red-600 text-[9px] font-bold leading-none">!</span>
                    </span>
                    {formErrors.city}
                  </p>
                )}
              </div>
            </div>

            {/* Hidden email field */}
            <input
              type="hidden"
              name="email"
              value={formData.email}
            />

            {/* Address */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-1 text-gray-700">
                    <MapPin className="h-4 w-4" />
                    {t('forms.address')} *
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    onBlur={() => handleBlur('address')}
                    required
                    placeholder={t('placeholders.address')}
                    className={`focus:ring-brand-orange focus:border-brand-orange ${
                      formErrors.address ? 'border-red-500 ring-2 ring-red-200' : ''
                    }`}
                  />
                  {formErrors.address && (
                    <p className="text-red-600 text-xs font-medium flex items-center gap-1.5 mt-1">
                      <span className="inline-flex w-3 h-3 rounded-full bg-red-100 items-center justify-center flex-shrink-0">
                        <span className="text-red-600 text-[9px] font-bold leading-none">!</span>
                      </span>
                      {formErrors.address}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode" className="text-gray-700">{t('forms.postal_code')}</Label>
                  <Input
                    id="postalCode"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={5}
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    onBlur={() => handleBlur('postalCode')}
                    placeholder="12345"
                    className={`focus:ring-brand-orange focus:border-brand-orange ${
                      formErrors.postalCode ? 'border-red-500 ring-2 ring-red-200' : ''
                    }`}
                  />
                  {formErrors.postalCode && (
                    <p className="text-red-600 text-xs font-medium flex items-center gap-1.5 mt-1">
                      <span className="inline-flex w-3 h-3 rounded-full bg-red-100 items-center justify-center flex-shrink-0">
                        <span className="text-red-600 text-[9px] font-bold leading-none">!</span>
                      </span>
                      {formErrors.postalCode}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Compact Order Summary */}
            <CompactOrderSummary
              selectedVariant={selectedVariant}
              productName={productName}
              countryConfig={countryConfig}
              bundleItems={bundleItems}
              onReselect={onReselect || (() => {})}
              className="mb-4"
            />

                         {/* Courier Selection */}
             {showCourierSelection && (
               <div className="space-y-2 sm:space-y-3">
                 <Label className="text-sm sm:text-base font-semibold text-gray-900">
                   {isSingleCourier ? t('delivery.courier_service') : t('delivery.select_courier')}
                 </Label>
                <div className="space-y-2">
                  {availableCouriers.map((courier) => {
                    const isSelected = displayCourier.id === courier.id;
                    
                    return (
                      <div
                        key={courier.id}
                        onClick={() => onCourierChange?.(courier)}
                        className={`
                          relative flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border rounded-lg cursor-pointer transition-all
                          ${isSelected 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                          }
                        `}
                      >
                        {/* Recommended Badge in Corner */}
                        {courier.isDefault && (
                          <Badge 
                            variant="secondary" 
                            className={`absolute -top-1 sm:-top-2 -right-1 sm:-right-2 text-xs z-10 ${
                              isSelected ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-500 border-gray-200'
                            }`}
                          >
                            {t('delivery.recommended')}
                          </Badge>
                        )}
                        {/* Selection Indicator */}
                        <div className={`
                          w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center transition-all
                          ${isSelected 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-300 bg-white'
                          }
                        `}>
                          {isSelected && (
                            <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                          )}
                        </div>
                        
                        {/* Courier Logo */}
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded shadow-sm flex items-center justify-center">
                          <Image
                            src={courier.logo}
                            alt={courier.name}
                            width={24}
                            height={24}
                            className={`w-4 h-4 sm:w-6 sm:h-6 object-contain ${
                              isSelected ? 'opacity-100' : 'opacity-60'
                            }`}
                          />
                        </div>
                        
                        {/* Courier Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <span className={`text-xs sm:text-sm font-medium ${
                              isSelected ? 'text-blue-900' : 'text-gray-600'
                            }`}>
                              {courier.name}
                            </span>
                          </div>
                                                     <div className="flex items-center gap-1 sm:gap-2">
                             <span className={`text-xs ${
                               isSelected ? 'text-blue-600' : 'text-gray-400'
                             }`}>
                               {courier.deliveryTime}
                             </span>
                             {hasFreeShipping ? (
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${
                                  isSelected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                }`}
                              >
                                {t('bundles.free_shipping')}
                              </Badge>
                            ) : (
                              <span className={`text-xs ${
                                isSelected ? 'text-blue-600' : 'text-gray-400'
                              }`}>
                                {formatPrice(courier.shipping.cost)} {t('delivery.shipping')}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Truck Icon */}
                        <Truck className={`h-3 w-3 sm:h-4 sm:w-4 ${
                          isSelected ? 'text-blue-500' : 'text-gray-300'
                        }`} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="space-y-2 sm:space-y-4">
              <Label className="text-sm sm:text-base font-semibold text-gray-900">{t('checkout.payment_method')}</Label>
              <div className="p-3 sm:p-4 border rounded-lg bg-green-50 border-green-200">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Banknote className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                    <div className="flex-1">
                      <p className="font-medium text-green-800 text-sm sm:text-base">{t('checkout.cod')}</p>
                      <p className="text-xs sm:text-sm text-green-600">{t('payment_cod.description')}</p>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>

            {/* Upsell/Cross-sell */}
            <UpsellCrossSell
              mainProductId={mainProductId}
              onAddToBundle={onAddToBundle}
              className="mb-6"
              countryConfig={countryConfig}
            />

            {/* Submit Button */}
            <div className="relative animate-elegant-pulse">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-green hover:bg-green-600 text-white font-bold py-6 px-8 text-xl rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-green-400/30 hover:border-green-300/50 transform hover:-translate-y-1 hover:scale-[1.02] group sword-shine focus:outline-none focus:ring-4 focus:ring-green-300/50"
                size="lg"
              >
                <span className="relative z-10">
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span className="text-xl">{t('order_summary.processing_order')}</span>
                    </div>
                  ) : (
                    t('order_summary.place_order')
                  )}
                </span>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 p-2 text-center">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-600 font-medium">
                {t('order_summary.secure_purchase_guarantee')}
              </span>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Order Summary - COMMENTED OUT FOR FUTURE USE */}
      {/* 
      <Card className="border-brand-orange/30 bg-gradient-to-br from-white to-orange-50/30 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-brand-orange text-lg">
            <Package className="h-5 w-5" />
            {t('order_summary.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Product Details */}
          {/* 
          <div className="flex justify-between items-start p-4 bg-white/80 rounded-lg border border-orange-100">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-base">{productName}</h4>
              <p className="text-sm text-gray-600 mt-1">{selectedVariant.name}</p>
              <p className="text-xs text-gray-500">{selectedVariant.size}</p>
            </div>
            <div className="text-right ml-4">
              <p className="font-bold text-xl text-brand-orange">
                {formatPrice(orderTotal)}
              </p>
              {selectedVariant.discountPrice && (
                <p className="text-sm text-gray-500 line-through">
                  {formatPrice(selectedVariant.price)}
                </p>
              )}
            </div>
          </div>
          
          {/* Price Breakdown */}
          {/* 
          <div className="space-y-3 p-4 bg-gray-50/50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">{t('order_summary.product')}</span>
              <span className="font-medium">{formatPrice(orderTotal)}</span>
            </div>
            
            {/* Bundle Items */}
            {/* 
            {Object.keys(bundleItems).length > 0 && (
              <>
                {Object.entries(bundleItems).map(([productId, price]) => (
                  <div key={productId} className="flex justify-between text-sm">
                    <span className="text-green-700">{t('order_summary.additional_product')}</span>
                    <span className="font-medium text-green-700">+{formatPrice(price)}</span>
                  </div>
                ))}
              </>
            )}
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">{t('order_summary.delivery')}</span>
              <span className={`font-medium ${shippingCost > 0 ? 'text-gray-900' : 'text-green-600'}`}>
                {shippingCost > 0 ? formatPrice(shippingCost) : t('order_summary.free')}
              </span>
            </div>
            
            <Separator className="my-3" />
            
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-900">{t('order_summary.total')}</span>
              <span className="text-brand-orange text-xl">{formatPrice(finalTotal)}</span>
            </div>
          </div>

          {/* Trust Indicators */}
          {/* 
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-gray-600">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">{t('order_summary.secure_purchase')}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Truck className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">{t('order_summary.fast_delivery')}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Package className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">{t('order_summary.quality_guarantee')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      */}

      {/* Checkout Dialog */}
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
