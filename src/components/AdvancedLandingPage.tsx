'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Product } from '@/config/products';
import { CountryConfig, getDefaultCourier, CourierInfo } from '@/config/countries';


import { Button } from '@/components/ui/button';
import { BundleSelector } from '@/components/features/BundleSelector';
import { CheckoutForm } from '@/components/features/CheckoutForm';
import { UrgencyTimer } from '@/components/features/UrgencyTimer';
import { CookieConsent } from '@/components/features/CookieConsent';

import { AdvancedFAQ } from '@/components/features/AdvancedFAQ';
import { AdvancedTestimonials } from '@/components/features/AdvancedTestimonials';
// import { PurchaseNotifications } from '@/components/features/PurchaseNotifications';
import { RotatingReview } from '@/components/features/RotatingReview';
import { Footer } from '@/components/ui/footer';
import { ComparisonTable } from '@/components/features/ComparisonTable';

import { EnhancedImageGallery } from '@/components/features/EnhancedImageGallery';
import { ProductDetailsAccordion } from '@/components/features/ProductDetailsAccordion';

import { PixelTracker } from '@/components/tracking/PixelTracker';
import { 
  Star, 
  ShieldCheck,
  CheckCircle,
  Phone
} from 'lucide-react';

interface AdvancedLandingPageProps {
  product: Product;
  countryConfig: CountryConfig;
  slug: string;
}

export function AdvancedLandingPage({ product, countryConfig }: AdvancedLandingPageProps) {
  const t = useTranslations();

  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [bundleItems, setBundleItems] = useState<{[key: string]: number}>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDeliveryFormVisible, setIsDeliveryFormVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState<CourierInfo>(getDefaultCourier(countryConfig));
  const [isScrolled, setIsScrolled] = useState(false);

  // Apply global overflow fix and prevent layout shifts
  useEffect(() => {
    // Only set maxWidth to prevent horizontal scroll, but keep overflow visible for sticky positioning
    document.body.style.maxWidth = '100vw';
    document.documentElement.style.maxWidth = '100vw';
    
    // Prevent any horizontal scroll during animations
    document.body.style.position = 'relative';
    
    // Mark component as mounted after hydration
    setMounted(true);
    
    return () => {
      document.body.style.maxWidth = '';
      document.documentElement.style.maxWidth = '';
      document.body.style.position = '';
    };
  }, []);

  // Handle scroll for header transparency
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    // Don't check initial scroll position to avoid hydration mismatch
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // CTA Button text - configurable variable
  const ctaButtonText = t('common.order_now'); // "Naruči odmah" - can be changed to other translations

  // Smooth scroll to delivery form (Podaci za dostavu)
  const scrollToCheckout = () => {
    const deliverySection = document.getElementById('delivery-form');
    if (deliverySection) {
      // Calculate offset to show the entire form (scroll a bit above)
      const elementTop = deliverySection.getBoundingClientRect().top;
      const offsetPosition = elementTop + window.pageYOffset - 80; // 80px offset for better visibility
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Smooth scroll to quantity selection (Bundle Selector)
  const scrollToQuantitySelection = () => {
    // Use setTimeout to ensure DOM is ready and avoid any timing issues
    setTimeout(() => {
      // First try to scroll to the bundle title for precise positioning
      const bundleTitle = document.getElementById('bundle-title');
      if (bundleTitle) {
        // Calculate offset to show the title properly
        const elementTop = bundleTitle.getBoundingClientRect().top;
        const offsetPosition = elementTop + window.pageYOffset - 100; // 100px offset for better visibility
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else {
        // Fallback: scroll to the bundle selector container
        const bundleSelector = document.getElementById('bundle-selector');
        if (bundleSelector) {
          const elementTop = bundleSelector.getBoundingClientRect().top;
          const offsetPosition = elementTop + window.pageYOffset - 100;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        } else {
          // Final fallback: scroll to the order section
          const orderSection = document.getElementById('order');
          if (orderSection) {
            const elementTop = orderSection.getBoundingClientRect().top;
            const offsetPosition = elementTop + window.pageYOffset - 100;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      }
    }, 100); // Small delay to ensure DOM is ready
  };

  // Reusable CTA Button Component
  const CTAButton = ({ size = "lg", className = "", showPulse = false }: { size?: "sm" | "lg", className?: string, showPulse?: boolean }) => (
    <Button 
      onClick={scrollToCheckout}
      size={size}
      className={`bg-gradient-to-r from-brand-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${showPulse ? 'animate-pulse' : ''} ${className}`}
    >
      {ctaButtonText}
    </Button>
  );

  const handleOrderSubmit = (orderData: Record<string, unknown>) => {
    console.log('Order submitted:', orderData);
    console.log('Bundle items:', bundleItems);
    
    // Prepare order data for API
    const apiOrderData = {
      customerName: `${orderData.firstName} ${orderData.lastName}`,
      customerEmail: orderData.email as string,
      customerPhone: orderData.phone as string,
      customerAddress: orderData.address as string,
      customerCity: orderData.city as string,
      customerPostalCode: orderData.postalCode as string,
      productName: product.name,
      productVariant: selectedVariant.name,
      quantity: 1,
      totalPrice: orderData.orderTotal as number,
      currency: countryConfig.currencySymbol,
      courierName: selectedCourier.name,
      deliveryTime: selectedCourier.deliveryTime,
      paymentMethod: orderData.paymentMethod as string,
      bundleItems: bundleItems,
      locale: countryConfig.code
    };

    // Store order data in session storage immediately
    const orderForThankYou = {
      ...apiOrderData,
      orderId: `ORDER_${crypto.randomUUID().slice(0, 8).toUpperCase()}` // Generate temporary ID
    };
    
    sessionStorage.setItem('completedOrder', JSON.stringify(orderForThankYou));
    
    // INSTANT redirect using Next.js router for faster navigation
    window.location.replace(`/rs/thank-you`);
    
    // Submit order to API in the background (fire and forget)
    fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiOrderData),
    }).catch(error => {
      console.error('Order submission error (background):', error);
      // Error handling can be done on the thank you page if needed
    });
  };

  const handleAddToBundle = (productId: string, price: number) => {
    setBundleItems(prev => {
      const newItems = { ...prev };
      if (newItems[productId]) {
        delete newItems[productId];
      } else {
        newItems[productId] = price;
      }
      return newItems;
    });
  };

  // Floating elements animation
  useEffect(() => {
    const interval = setInterval(() => {
      // Add floating animation logic here if needed
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Track delivery form visibility for hiding floating button
  useEffect(() => {
    const deliverySection = document.getElementById('delivery-form');
    if (!deliverySection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsDeliveryFormVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.3 // Form is considered visible when 30% is in view
      }
    );

    observer.observe(deliverySection);

    return () => {
      observer.disconnect();
    };
  }, []);



  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white relative w-full" style={{maxWidth: '100vw'}}>
      {/* Pixel Tracking */}
      <PixelTracker countryCode={countryConfig.code} />
      
      {/* Top Bar Marquee - HIDDEN */}
      {/* <div className="fixed top-0 left-0 right-0 z-50">
        <MarqueeText 
          text={`🔥 ${t('offers.limited_offer')} • ✓ ${t('bundles.free_shipping')} preko 4000 RSD • 📞 Naručite odmah!`}
          className="border-0 px-0 py-2 text-sm font-bold"
          speed="slow"
          backgroundColor="bg-blue-100"
          textColor="text-blue-800"
          pauseOnHover={true}
        />
      </div> */}
      
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-20 w-80 h-80 bg-brand-orange/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-20 w-96 h-96 bg-brand-green/3 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-10 w-64 h-64 bg-brand-orange/2 rounded-full blur-3xl"></div>
      </div>
      {/* Header - Fixed on mobile, relative on desktop */}
      <header className={`md:relative fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b py-1.5 md:py-2' 
          : 'bg-transparent py-2 md:py-4'
      }`}>
        <div className="container mx-auto px-4">
          <div className="relative flex items-center">
            {/* Navigation Menu - Left side */}
            <nav className="hidden md:flex items-center space-x-6 flex-1">
              <a 
                href="#hero" 
                className={`text-sm font-medium transition-colors underline-animate ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-brand-orange' 
                    : 'text-gray-800 hover:text-brand-orange drop-shadow-sm'
                }`}
              >
                {t('navigation.home')}
              </a>
              <a 
                href="#benefits" 
                className={`text-sm font-medium transition-colors underline-animate ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-brand-orange' 
                    : 'text-gray-800 hover:text-brand-orange drop-shadow-sm'
                }`}
              >
                {t('navigation.benefits')}
              </a>
              <a 
                href="#testimonials" 
                className={`text-sm font-medium transition-colors underline-animate ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-brand-orange' 
                    : 'text-gray-800 hover:text-brand-orange drop-shadow-sm'
                }`}
              >
                {t('navigation.testimonials')}
              </a>
              <a 
                href="#faq" 
                className={`text-sm font-medium transition-colors underline-animate ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-brand-orange' 
                    : 'text-gray-800 hover:text-brand-orange drop-shadow-sm'
                }`}
              >
                {t('navigation.faq')}
              </a>
              <a 
                href="#order" 
                className="bg-brand-orange text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-brand-orange/90 transition-colors shadow-lg"
              >
                {t('navigation.order')}
              </a>
            </nav>

            {/* Mobile Menu Button - Left side on mobile */}
            <div className="md:hidden flex-1">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-1.5 transition-colors ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-brand-orange' 
                    : 'text-gray-800 hover:text-brand-orange drop-shadow-sm'
                }`}
                aria-label={t('ui.toggle_menu')}
              >
                {mobileMenuOpen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

            {/* Absolutely Centered Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Image
                src={countryConfig.logo}
                alt={t('ui.alt_logo')}
                width={150}
                height={40}
                className="h-7 md:h-10 w-auto"
                priority
              />
            </div>

            {/* Contact Info - Right side */}
            <div className="hidden md:flex items-center gap-1 text-sm flex-1 justify-end">
              <Phone className="h-4 w-4 text-brand-orange" />
              <a 
                href={`tel:${countryConfig.company.phone}`}
                className={`font-medium transition-colors ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-brand-orange' 
                    : 'text-gray-800 hover:text-brand-orange drop-shadow-sm'
                }`}
              >
                {countryConfig.company.phone}
              </a>
            </div>

            {/* Mobile phone - Right side on mobile */}
            <div className="md:hidden flex-1 flex justify-end">
              <a 
                href={`tel:${countryConfig.company.phone}`}
                className="p-1.5 text-brand-orange hover:text-brand-orange/80 transition-colors drop-shadow-sm"
                aria-label={t('ui.call_us')}
              >
                <Phone className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className={`md:hidden mt-2 pb-2 border-t border-gray-200 ${
              !isScrolled ? 'bg-white/95 backdrop-blur-md rounded-lg mx-2' : ''
            }`}>
              <nav className="flex flex-col space-y-2 pt-2">
                <a 
                  href="#hero" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-gray-700 hover:text-brand-orange transition-colors px-2 py-1"
                >
                  {t('navigation.home')}
                </a>
                <a 
                  href="#benefits" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-gray-700 hover:text-brand-orange transition-colors px-2 py-1"
                >
                  {t('navigation.benefits')}
                </a>
                <a 
                  href="#testimonials" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-gray-700 hover:text-brand-orange transition-colors px-2 py-1"
                >
                  {t('navigation.testimonials')}
                </a>
                <a 
                  href="#faq" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-gray-700 hover:text-brand-orange transition-colors px-2 py-1"
                >
                  {t('navigation.faq')}
                </a>
                <a 
                  href="#order" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-brand-orange text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-brand-orange/90 transition-colors text-center mx-2"
                >
                  {t('navigation.order')}
                </a>
                <div className="px-2 py-1 border-t border-gray-200 mt-2 pt-3">
                  <a 
                    href={`tel:${countryConfig.company.phone}`}
                    className="flex items-center gap-2 text-sm font-medium text-brand-orange hover:text-brand-orange/80 transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    {countryConfig.company.phone}
                  </a>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="pt-24 md:pt-8 pb-8 md:pb-12 relative overflow-hidden w-full">
        {/* Clean minimal background */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Product Images */}
            <div className="relative">
              <EnhancedImageGallery 
                images={product.images}
                productName={product.name}
                className="w-full"
              />
            </div>

            {/* Product Info */}
            <div className="space-y-6 py-6 lg:py-12">
              <div>

                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  {product.name}
                </h1>
                <p className="text-xl text-gray-600 mb-4">
                  {product.shortDescription}
                </p>
                
                {/* Star Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-medium">4.97/5</span>
                  <span className="text-sm text-gray-500">{t('sections.based_on_reviews', { count: 235 })}</span>
                </div>

                {/* Sand Timer Countdown */}
                <UrgencyTimer duration={24} />
              </div>

              {/* Key Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.benefits.slice(0, 4).map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Call to Action Button */}
              <div className="flex justify-center lg:justify-start">
                <CTAButton size="lg" className="py-4 px-8 text-lg" showPulse={true} />
              </div>

              {/* Trust Badges */}
              <div className="space-y-3">
                {/* Money Back Guarantee - Clean Design */}
                <div className="bg-white/70 p-5 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-8 w-8 text-brand-green flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-base mb-3">
                        {t('guarantee.title')}
                      </h3>
                      <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                        <p>
                          {t('guarantee.description')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                

              </div>



              {/* Rotating Testimonial */}
              <RotatingReview countryCode={countryConfig.locale} productId={product.id} />
            </div>
          </div>
        </div>
      </section>

      {/* Smooth Gradient Divider */}
      <div className="relative h-20 md:h-20 w-full overflow-hidden">
        {/* Gradient fade overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/30 to-white"></div>
        
        <svg 
          className="w-full h-full" 
          viewBox="0 0 1200 160" 
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Vertical gradient for smooth fade */}
            <linearGradient id="fadeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor: '#608E7E', stopOpacity: 0}} />
              <stop offset="30%" style={{stopColor: '#608E7E', stopOpacity: 0.08}} />
              <stop offset="70%" style={{stopColor: '#F3765D', stopOpacity: 0.12}} />
              <stop offset="100%" style={{stopColor: '#608E7E', stopOpacity: 0.03}} />
            </linearGradient>
            
            {/* Horizontal color gradient */}
            <linearGradient id="colorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{stopColor: '#608E7E', stopOpacity: 0.06}} />
              <stop offset="30%" style={{stopColor: '#F3765D', stopOpacity: 0.08}} />
              <stop offset="70%" style={{stopColor: '#608E7E', stopOpacity: 0.05}} />
              <stop offset="100%" style={{stopColor: '#F3765D', stopOpacity: 0.04}} />
            </linearGradient>
          </defs>
          
          {/* Smooth flowing wave with fade */}
          <path 
            d="M0,40 Q200,10 400,45 Q600,80 800,50 Q1000,20 1200,55 L1200,160 L0,160 Z" 
            fill="url(#fadeGradient)"
          />
          
          {/* Secondary gentle wave */}
          <path 
            d="M0,70 Q300,30 600,75 Q900,110 1200,80 L1200,160 L0,160 Z" 
            fill="url(#colorGradient)"
          />
          
          {/* Very subtle accent elements */}
          <circle cx="150" cy="35" r="1" fill="#F3765D" fillOpacity="0.15" />
          <circle cx="500" cy="55" r="1.5" fill="#608E7E" fillOpacity="0.12" />
          <circle cx="850" cy="40" r="1" fill="#F3765D" fillOpacity="0.1" />
          <circle cx="1050" cy="65" r="0.8" fill="#608E7E" fillOpacity="0.08" />
        </svg>
      </div>

      {/* Bundle Selection & Checkout */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div id="order" className="grid lg:grid-cols-2 gap-8">
              {/* Bundle Selection */}
              <div className="lg:sticky lg:top-12 lg:self-start">
                <BundleSelector
                  variants={product.variants}
                  selectedVariant={selectedVariant}
                  onVariantChange={setSelectedVariant}
                  countryConfig={countryConfig}
                  selectedCourier={selectedCourier}
                />
              </div>

              {/* Checkout Form */}
              <div id="delivery-form" className="space-y-6">
                <CheckoutForm
                  selectedVariant={selectedVariant}
                  countryConfig={countryConfig}
                  productName={product.name}
                  bundleItems={bundleItems}
                  onOrderSubmit={handleOrderSubmit}
                  mainProductId={product.id}
                  onAddToBundle={handleAddToBundle}
                  selectedCourier={selectedCourier}
                  onCourierChange={setSelectedCourier}
                  onReselect={scrollToQuantitySelection}
                />
                

              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Comparison Table */}
      <ComparisonTable countryConfig={countryConfig} />

      {/* CTA After Comparison */}
      <section className="py-8 bg-gradient-to-r from-orange-50 to-orange-100 w-full overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4 text-gray-900">
            {t('cta.ready_to_order') || "Spremni za naručivanje?"}
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {t('cta.comparison_subtitle') || "Videli ste prednosti - vreme je da napravite korak ka zdravijoj koži!"}
          </p>
          <CTAButton size="lg" className="py-3 px-6 text-lg" />
        </div>
      </section>

      {/* Advanced Testimonials */}
      <section id="testimonials">
        <AdvancedTestimonials countryCode={countryConfig.code} productId={product.id} />
      </section>

      {/* CTA After Testimonials */}
      <section className="py-10 bg-white border-t border-b border-gray-200 w-full overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4 text-gray-900">
            {t('cta.after_testimonials') || "Pridružite se zadovoljnim kupcima!"}
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {t('cta.testimonials_subtitle') || "Hiljade zadovoljnih kupaca već je iskusilo prednosti naših proizvoda. Budite sledeći!"}
          </p>
          <CTAButton size="lg" className="py-3 px-6 text-lg" showPulse={true} />
        </div>
      </section>

      {/* Product Details */}
      <section id="benefits" className="py-12 w-full overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto w-full">
            <h2 className="text-3xl font-bold text-center mb-12">{t('sections.detailed_information')}</h2>
            
            {/* Enhanced Product Details Accordion */}
            <ProductDetailsAccordion product={product} className="mb-12" />

            {/* Advanced FAQ */}
            <div id="faq" className="mt-16">
              <AdvancedFAQ countryCode={countryConfig.code} product={product} />
            </div>

            {/* Full Description Toggle */}
            {/* <Card className="p-6 mt-8">
              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="flex items-center gap-2"
                >
                  {showFullDescription ? t('details.hide') : t('details.show_hide')}
                  <ChevronDown className={`h-4 w-4 transition-transform ${showFullDescription ? 'rotate-180' : ''}`} />
                </Button>
              </div>
              
              {showFullDescription && (
                <div className="mt-6 space-y-4 text-sm text-gray-700">
                  <p>{product.description}</p>
                </div>
              )}
            </Card> */}
          </div>
        </div>
      </section>

      {/* Divider Shape */}
      <div className="relative w-full overflow-hidden">
        <svg className="w-full h-16 text-gray-50 rotate-180" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
        </svg>
      </div>

      {/* Final CTA Before Footer */}
      <section className="relative py-16 bg-gradient-to-br from-gray-50 to-green-50 overflow-hidden w-full">
        {/* Floating liquid bubbles */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large slow bubbles - positioned safely within viewport */}
          <div className={`absolute top-20 left-16 w-32 h-32 bg-brand-green/20 rounded-full blur-xl transition-all duration-1000 ${mounted ? 'animate-bounce' : 'opacity-50'}`} style={{animationDuration: '6s', animationDelay: '0s', maxWidth: 'calc(100vw - 200px)'}}></div>
          <div className={`absolute top-40 right-16 w-24 h-24 bg-brand-green/15 rounded-full blur-lg transition-all duration-1000 ${mounted ? 'animate-bounce' : 'opacity-50'}`} style={{animationDuration: '8s', animationDelay: '2s', maxWidth: 'calc(100vw - 150px)'}}></div>
          <div className={`absolute bottom-32 left-20 w-40 h-40 bg-brand-green/10 rounded-full blur-2xl transition-all duration-1000 ${mounted ? 'animate-bounce' : 'opacity-50'}`} style={{animationDuration: '10s', animationDelay: '1s', maxWidth: 'calc(100vw - 220px)'}}></div>
          
          {/* Medium bubbles - positioned safely within viewport */}
          <div className={`absolute top-32 right-20 w-20 h-20 bg-brand-green/25 rounded-full blur-lg transition-all duration-1000 ${mounted ? 'animate-pulse' : 'opacity-50'}`} style={{animationDuration: '4s', animationDelay: '0s', maxWidth: 'calc(100vw - 120px)'}}></div>
          <div className={`absolute bottom-40 right-12 w-16 h-16 bg-brand-green/20 rounded-full blur-md transition-all duration-1000 ${mounted ? 'animate-pulse' : 'opacity-50'}`} style={{animationDuration: '5s', animationDelay: '3s', maxWidth: 'calc(100vw - 80px)'}}></div>
          <div className={`absolute top-1/2 left-12 w-28 h-28 bg-brand-green/15 rounded-full blur-xl transition-all duration-1000 ${mounted ? 'animate-pulse' : 'opacity-50'}`} style={{animationDuration: '7s', animationDelay: '1.5s', maxWidth: 'calc(100vw - 140px)'}}></div>
          
          {/* Small fast bubbles - positioned safely within viewport */}
          <div className={`absolute top-16 left-1/2 w-12 h-12 bg-brand-green/30 rounded-full blur-sm transition-all duration-1000 ${mounted ? 'animate-ping' : 'opacity-50'}`} style={{animationDuration: '3s', animationDelay: '0s', transform: 'translateX(-50%)', maxWidth: '48px'}}></div>
          <div className={`absolute bottom-24 right-24 w-8 h-8 bg-brand-green/35 rounded-full blur-sm transition-all duration-1000 ${mounted ? 'animate-ping' : 'opacity-50'}`} style={{animationDuration: '2s', animationDelay: '1s', maxWidth: '32px'}}></div>
          <div className={`absolute top-2/3 right-16 w-10 h-10 bg-brand-green/25 rounded-full blur-sm transition-all duration-1000 ${mounted ? 'animate-ping' : 'opacity-50'}`} style={{animationDuration: '2.5s', animationDelay: '2s', maxWidth: '40px'}}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h3 className="text-4xl font-bold mb-6 text-gray-800">
            {t('cta.final_call')}
          </h3>
          <p className="text-xl mb-10 max-w-4xl mx-auto text-gray-600 leading-relaxed">
            {t('cta.final_subtitle')}
          </p>
          <CTAButton size="lg" className="py-5 px-10 text-xl shadow-2xl" />
        </div>

        {/* Bottom wave shape */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg className="w-full h-20 text-green-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* Footer */}
      <Footer countryConfig={countryConfig} locale="rs" />

      {/* Purchase Notifications - Removed */}
      {/* <PurchaseNotifications /> */}

      {/* GDPR Cookie Consent for EU */}
      <CookieConsent isEU={countryConfig.isEU} />

      {/* Floating Mobile CTA - Hidden when delivery form is visible */}
      {!isDeliveryFormVisible && (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {product.name}
                </p>
                <p className="text-xs text-gray-500">
                  {t('cta.mobile_floating') || "Naručite sada!"}
                </p>
              </div>
              <CTAButton size="sm" className="py-2 px-4 text-sm flex-shrink-0" showPulse={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
