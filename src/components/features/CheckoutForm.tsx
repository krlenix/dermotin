'use client';

import { useState } from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ProductVariant } from '@/config/products';
import { CountryConfig, CourierInfo, getAvailableCouriers } from '@/config/countries';
import { useCurrency } from '@/hooks/useCurrency';
import { useTranslations } from 'next-intl';
import { VALIDATION_RULES } from '@/config/constants';
import { calculateShippingCost, getShippingCostDisplay, qualifiesForFreeShipping } from '@/utils/shipping';
import { getDefaultCourier } from '@/config/countries';
import { Package, Truck, CreditCard, Banknote, Shield, Phone, MapPin, User, Check } from 'lucide-react';
import Image from 'next/image';
import { UpsellCrossSell } from './UpsellCrossSell';

interface CheckoutFormProps {
  selectedVariant: ProductVariant;
  countryConfig: CountryConfig;
  productName: string;
  bundleItems?: {[key: string]: number};
  onOrderSubmit: (orderData: Record<string, unknown>) => void;
  className?: string;
  mainProductId: string;
  onAddToBundle: (productId: string, price: number) => void;
  selectedCourier?: CourierInfo;
  onCourierChange?: (courier: CourierInfo) => void;
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
  onCourierChange
}: CheckoutFormProps) {
  const t = useTranslations();
  const { formatPrice } = useCurrency();
  
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const fieldsToValidate = ['firstName', 'lastName', 'phone', 'address', 'city'];
    
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
      setIsSubmitting(false);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate order processing
    setTimeout(() => {
      onOrderSubmit({
        ...formData,
        variant: selectedVariant,
        bundleItems: bundleItems,
        country: countryConfig.code,
        orderTotal: finalTotal,
        subtotal: subtotal,
        shippingCost: shippingCost
      });
      setIsSubmitting(false);
    }, 2000);
  };

  const orderTotal = selectedVariant.discountPrice || selectedVariant.price;
  const bundleTotal = Object.values(bundleItems).reduce((sum, price) => sum + price, 0);
  const subtotal = orderTotal + bundleTotal;
  
  // Use selected courier or fallback to default
  const displayCourier = selectedCourier || getDefaultCourier(countryConfig);
  const availableCouriers = getAvailableCouriers(countryConfig);
  const showCourierSelection = availableCouriers.length > 1;
  
  // Calculate shipping cost using selected courier and country threshold
  const shippingCost = calculateShippingCost(subtotal, displayCourier, countryConfig);
  const finalTotal = subtotal + shippingCost;
  const hasFreeShipping = qualifiesForFreeShipping(subtotal, countryConfig);

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
                  required
                  className={`focus:ring-brand-orange focus:border-brand-orange ${
                    formErrors.firstName ? 'border-red-500' : ''
                  }`}
                />
                {formErrors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-700">{t('forms.surname')} *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                  className={`focus:ring-brand-orange focus:border-brand-orange ${
                    formErrors.lastName ? 'border-red-500' : ''
                  }`}
                />
                {formErrors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>
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
                  placeholder="Enter phone number"
                  className={`focus:ring-brand-orange focus:border-brand-orange ${
                    formErrors.phone ? 'border-red-500' : ''
                  }`}
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="text-gray-700">{t('forms.city')} *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  required
                  className={`focus:ring-brand-orange focus:border-brand-orange ${
                    formErrors.city ? 'border-red-500' : ''
                  }`}
                />
                {formErrors.city && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
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
                    required
                    placeholder={t('placeholders.address')}
                    className={`focus:ring-brand-orange focus:border-brand-orange ${
                      formErrors.address ? 'border-red-500' : ''
                    }`}
                  />
                  {formErrors.address && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode" className="text-gray-700">{t('forms.postal_code')}</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    className="focus:ring-brand-orange focus:border-brand-orange"
                  />
                </div>
              </div>
            </div>

            {/* Courier Selection */}
            {showCourierSelection && (
              <div className="space-y-3">
                <Label className="text-base font-semibold text-gray-900">{t('delivery.select_courier')}</Label>
                <div className="space-y-2">
                  {availableCouriers.map((courier) => {
                    const isSelected = displayCourier.id === courier.id;
                    
                    return (
                      <div
                        key={courier.id}
                        onClick={() => onCourierChange?.(courier)}
                        className={`
                          relative flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all
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
                            className={`absolute -top-2 -right-2 text-xs z-10 ${
                              isSelected ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-500 border-gray-200'
                            }`}
                          >
                            {t('delivery.recommended')}
                          </Badge>
                        )}
                        {/* Selection Indicator */}
                        <div className={`
                          w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                          ${isSelected 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-300 bg-white'
                          }
                        `}>
                          {isSelected && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        
                        {/* Courier Logo */}
                        <div className="w-8 h-8 bg-white rounded shadow-sm flex items-center justify-center">
                          <Image
                            src={courier.logo}
                            alt={courier.name}
                            width={24}
                            height={24}
                            className={`w-6 h-6 object-contain ${
                              isSelected ? 'opacity-100' : 'opacity-60'
                            }`}
                          />
                        </div>
                        
                        {/* Courier Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${
                              isSelected ? 'text-blue-900' : 'text-gray-600'
                            }`}>
                              {courier.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs ${
                              isSelected ? 'text-blue-600' : 'text-gray-400'
                            }`}>
                              {courier.deliveryTime}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
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
                        <Truck className={`h-4 w-4 ${
                          isSelected ? 'text-blue-500' : 'text-gray-300'
                        }`} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="space-y-4">
              <Label className="text-base font-semibold text-gray-900">{t('checkout.payment_method')}</Label>
              <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                <div className="flex items-center gap-3">
                  <Banknote className="h-6 w-6 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-green-800">{t('checkout.cod')}</p>
                    <p className="text-sm text-green-600">{t('payment_cod.description')}</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">{t('payment_cod.selected')}</Badge>
                </div>
              </div>
            </div>

            {/* Upsell/Cross-sell */}
            <UpsellCrossSell
              mainProductId={mainProductId}
              onAddToBundle={onAddToBundle}
              className="mb-6"
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
                    t('order_summary.place_order', { amount: formatPrice(finalTotal) })
                  )}
                </span>
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              {t('order_summary.secure_purchase_guarantee')}
            </p>
          </form>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card className="border-brand-orange/30 bg-gradient-to-br from-white to-orange-50/30 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-brand-orange text-lg">
            <Package className="h-5 w-5" />
            {t('order_summary.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Product Details */}
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
          <div className="space-y-3 p-4 bg-gray-50/50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">{t('order_summary.product')}</span>
              <span className="font-medium">{formatPrice(orderTotal)}</span>
            </div>
            
            {/* Bundle Items */}
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
          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
              <Shield className="h-5 w-5 mx-auto text-green-600 mb-1" />
              <p className="text-xs font-medium text-green-800">{t('order_summary.secure_purchase')}</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
              <Truck className="h-5 w-5 mx-auto text-blue-600 mb-1" />
              <p className="text-xs font-medium text-blue-800">{t('order_summary.fast_delivery')}</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-100">
              <Package className="h-5 w-5 mx-auto text-orange-600 mb-1" />
              <p className="text-xs font-medium text-orange-800">{t('order_summary.quality_guarantee')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
