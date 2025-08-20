'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { CountryConfig } from '@/config/countries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Truck, MapPin, Phone, Mail, User, CreditCard, Star, Award, Shield } from 'lucide-react';
import { CookieConsent } from '@/components/features/CookieConsent';
import { Footer } from '@/components/ui/footer';
import { OrderData } from '@/app/api/orders/route';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ThankYouPageProps {
  countryConfig: CountryConfig;
}

export function ThankYouPage({ countryConfig }: ThankYouPageProps) {
  const t = useTranslations();
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    // Get order data from session storage
    const storedOrder = sessionStorage.getItem('completedOrder');
    if (storedOrder) {
      try {
        const order = JSON.parse(storedOrder);
        setOrderData(order);
      } catch (error) {
        console.error('Error parsing order data:', error);
        router.push('/rs');
      }
    } else {
      // No order data found, redirect to homepage
      router.push('/rs');
    }
    setLoading(false);
  }, [router]);

  // Animated progress steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3000); // Change step every 3 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-orange mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Same as AdvancedLandingPage */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Image
                src={countryConfig.logo}
                alt={t('ui.alt_logo')}
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>{t('thank_you.order_completed')}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Similar to AdvancedLandingPage structure */}
      <section className="pt-32 md:pt-24 pb-8 md:pb-12 relative overflow-hidden bg-gradient-to-br from-green-50 to-white">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-32 h-32 bg-green-200/30 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-1/4 w-24 h-24 bg-brand-orange/20 rounded-full blur-lg animate-pulse"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-14 h-14 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              {t('thank_you.success_title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-2xl mx-auto">
              {t('thank_you.order_confirmation')}
            </p>
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <Badge variant="secondary" className="ml-2">
                #{orderData.orderId}
              </Badge>
            </div>
            <p className="text-lg text-gray-500">
              {t('thank_you.contact_soon')}
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">{/* Order Details Section - Using Card components like AdvancedLandingPage */}

        {/* Delivery Info Box - Right After Thank You Message */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between gap-4">
              {/* Left: Courier Info */}
              <div className="flex items-center gap-3">
                <Image
                  src={countryConfig.courier.logo}
                  alt={countryConfig.courier.name}
                  width={80}
                  height={28}
                  className="object-contain"
                />
                <div className="text-sm">
                  <p className="font-semibold text-green-800">{countryConfig.courier.name}</p>
                  <p className="text-green-600 text-xs">{t('thank_you.courier_delivery')}</p>
                </div>
              </div>
              
              {/* Right: Delivery Time */}
              <div className="text-right">
                <div className="flex items-center justify-end gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-800 text-sm">{t('thank_you.expected_delivery')}</span>
                </div>
                <p className="text-green-700 font-bold text-lg">{orderData.deliveryTime}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Order Details */}
          <Card className="shadow-lg overflow-hidden py-0">
            <CardHeader className="bg-brand-green text-white px-6 py-3 m-0 border-0">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold m-0 p-0">
                <Package className="w-5 h-5" />
                {t('thank_you.order_details')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">{t('thank_you.order_number')}:</span>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  #{orderData.orderId}
                </Badge>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3 text-brand-green">{t('thank_you.product_info')}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{t('thank_you.product')}:</span>
                    <span className="font-medium">{orderData.productName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('thank_you.variant')}:</span>
                    <span>{orderData.productVariant}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('thank_you.quantity')}:</span>
                    <span>{orderData.quantity} {t('thank_you.pieces')}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2 text-brand-orange">
                    <span>{t('thank_you.total_paid')}:</span>
                    <span>{orderData.totalPrice} {orderData.currency}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card className="shadow-lg overflow-hidden py-0">
            <CardHeader className="bg-brand-orange text-white px-6 py-3 m-0 border-0">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold m-0 p-0">
                <User className="w-5 h-5" />
                {t('thank_you.customer_info')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                {orderData.customerName && (
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{orderData.customerName}</span>
                  </div>
                )}
                {orderData.customerEmail && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{orderData.customerEmail}</span>
                  </div>
                )}
                {orderData.customerPhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{orderData.customerPhone}</span>
                  </div>
                )}
                {(orderData.customerAddress || orderData.customerCity) && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                    <div>
                      {orderData.customerAddress && <div>{orderData.customerAddress}</div>}
                      {orderData.customerCity && <div className="text-gray-600">{orderData.customerCity}</div>}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{t('thank_you.payment_method')}: {t('thank_you.cod')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>



        {/* Progress Steps - Full Width Section */}
        <Card className="shadow-lg max-w-6xl mx-auto mt-8 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 m-0 border-0">
            <CardTitle className="text-center text-xl font-bold m-0 p-0">{t('thank_you.what_happens_next')}</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {/* Responsive Progress Steps - Vertical on Mobile, Horizontal on Desktop */}
            <div className="flex flex-col md:grid md:grid-cols-4 gap-4 mb-8">
              {/* Step 1 */}
              <div className={`flex md:flex-col items-center md:text-center p-4 rounded-xl transition-all duration-500 ${
                activeStep === 0 ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-blue-50 text-blue-700'
              }`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl md:mb-3 mr-4 md:mr-0 transition-all duration-500 ${
                  activeStep === 0 ? 'bg-white text-blue-600 animate-pulse' : 'bg-blue-200 text-blue-600'
                }`}>
                  1
                </div>
                <span className="font-semibold text-sm leading-tight">{t('thank_you.step_1')}</span>
              </div>

              {/* Step 2 */}
              <div className={`flex md:flex-col items-center md:text-center p-4 rounded-xl transition-all duration-500 ${
                activeStep === 1 ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-blue-50 text-blue-700'
              }`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl md:mb-3 mr-4 md:mr-0 transition-all duration-500 ${
                  activeStep === 1 ? 'bg-white text-blue-600 animate-pulse' : 'bg-blue-200 text-blue-600'
                }`}>
                  2
                </div>
                <span className="font-semibold text-sm leading-tight">{t('thank_you.step_2')}</span>
              </div>

              {/* Step 3 */}
              <div className={`flex md:flex-col items-center md:text-center p-4 rounded-xl transition-all duration-500 ${
                activeStep === 2 ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-blue-50 text-blue-700'
              }`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl md:mb-3 mr-4 md:mr-0 transition-all duration-500 ${
                  activeStep === 2 ? 'bg-white text-blue-600 animate-pulse' : 'bg-blue-200 text-blue-600'
                }`}>
                  3
                </div>
                <span className="font-semibold text-sm leading-tight">{t('thank_you.step_3')}</span>
              </div>

              {/* Step 4 */}
              <div className={`flex md:flex-col items-center md:text-center p-4 rounded-xl transition-all duration-500 ${
                activeStep === 3 ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-blue-50 text-blue-700'
              }`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl md:mb-3 mr-4 md:mr-0 transition-all duration-500 ${
                  activeStep === 3 ? 'bg-white text-blue-600 animate-pulse' : 'bg-blue-200 text-blue-600'
                }`}>
                  4
                </div>
                <span className="font-semibold text-sm leading-tight">{t('thank_you.step_4')}</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div>
              <div className="w-full bg-blue-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-1000 ease-in-out shadow-sm"
                  style={{ width: `${((activeStep + 1) / 4) * 100}%` }}
                ></div>
              </div>
              <p className="text-center text-blue-600 text-sm mt-3 font-semibold">
                Korak {activeStep + 1} od 4
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="shadow-lg max-w-2xl mx-auto mt-8">
          <CardHeader>
            <CardTitle className="text-center text-brand-green">{t('thank_you.need_help')}</CardTitle>
          </CardHeader>
          <CardContent className="text-center p-6">
            <p className="text-gray-600 mb-4">{t('thank_you.contact_support')}</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center justify-center gap-2">
                <Phone className="w-4 h-4 text-brand-orange" />
                <span className="font-medium">{countryConfig.company.phone}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Mail className="w-4 h-4 text-brand-orange" />
                <span className="font-medium">{countryConfig.company.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <Footer countryConfig={countryConfig} />

      {/* GDPR Cookie Consent for EU */}
      <CookieConsent isEU={countryConfig.isEU} />
    </div>
  );
}
