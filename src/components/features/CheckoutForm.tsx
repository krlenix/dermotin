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
import { CountryConfig } from '@/config/countries';
import { useCurrency } from '@/hooks/useCurrency';
import { useTranslations } from 'next-intl';
import { Package, Truck, CreditCard, Banknote, Shield, Phone, MapPin, User } from 'lucide-react';
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
}

export function CheckoutForm({ 
  selectedVariant, 
  countryConfig, 
  productName,
  bundleItems = {},
  onOrderSubmit,
  className,
  mainProductId,
  onAddToBundle
}: CheckoutFormProps) {
  const t = useTranslations();
  const { formatPrice } = useCurrency();
  
  // Form validation function
  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'firstName':
        return value.length < 2 ? 'Ime mora imati najmanje 2 karaktera' : '';
      case 'lastName':
        return value.length < 2 ? 'Prezime mora imati najmanje 2 karaktera' : '';
      case 'phone':
        return !isValidPhoneNumber(value) ? 'Neispravna format telefona' : '';
      case 'address':
        return value.length < 5 ? 'Adresa mora imati najmanje 5 karaktera' : '';
      case 'city':
        return value.length < 2 ? 'Mesto mora imati najmanje 2 karaktera' : '';
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
  const shippingCost = selectedVariant.id === 'fungel-1pak' && bundleTotal === 0 ? 280 : 0;
  const finalTotal = subtotal + shippingCost;

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

            {/* Courier Information */}
            <div className="space-y-4">
              <Label className="text-base font-semibold text-gray-900">{t('delivery.courier_title')}</Label>
              <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center">
                    <Image
                      src={countryConfig.courier.logo}
                      alt={countryConfig.courier.name}
                      width={40}
                      height={40}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-blue-800">{t('delivery.delivery_by')} {countryConfig.courier.name}</p>
                    <p className="text-sm text-blue-600">{t('delivery.delivery_time')}: {countryConfig.courier.deliveryTime}</p>
                    <p className="text-xs text-blue-500">{t('delivery.reliable_delivery')}</p>
                  </div>
                  <Truck className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

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
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-bold py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  {t('order_summary.processing_order')}
                </div>
              ) : (
                t('order_summary.place_order', { amount: formatPrice(finalTotal) })
              )}
            </Button>

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
