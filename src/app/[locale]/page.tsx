'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getProductsForCountry, Product } from '@/config/products';
import { getCountryConfig } from '@/config/countries';
import { HOMEPAGE_IMAGES } from '@/config/images';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { CookieConsent } from '@/components/features/CookieConsent';
import { Footer } from '@/components/ui/footer';
import { AdvancedTestimonials } from '@/components/features/AdvancedTestimonials';
import { ProductImageHover } from '@/components/features/ProductImageHover';


import { AdvancedFAQ } from '@/components/features/AdvancedFAQ';
// import { WheelPopup } from '@/components/wheel-of-fortune/WheelPopup';
// import { WheelOfFortune } from '@/components/wheel-of-fortune/WheelOfFortune';
// import { WHEEL_CONFIG, POPUP_CONFIG } from '@/config/wheel';
import { useParams } from 'next/navigation';
import { 
  Shield, 
  Truck, 
  Award, 
  Leaf, 
  CheckCircle,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Phone
} from 'lucide-react';

// Homepage statistics are now available through translations
// Access via: t('homepage.stats_customers'), t('homepage.stats_rating'), etc.

export default function HomePage() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations();
  const countryConfig = getCountryConfig(locale);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Load products for the current locale
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const loadedProducts = await getProductsForCountry(locale, locale);
        setProducts(loadedProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
        setProducts([]);
      }
    };
    
    loadProducts();
  }, [locale]);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Smooth scroll functions
  const scrollToProducts = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const scrollToTestimonials = (e: React.MouseEvent) => {
    e.preventDefault();
    const testimonialsSection = document.querySelector('[data-section="testimonials"]');
    if (testimonialsSection) {
      testimonialsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  // const [showWheelTest, setShowWheelTest] = useState(false);

  // Handle wheel of fortune prize won
  // const handlePrizeWon = (couponCode: string) => {
  //   console.log('Prize won with coupon code:', couponCode);
  //   // Here you can implement logic to:
  //   // - Save coupon to local storage
  //   // - Send analytics event
  //   // - Show notification
  //   // - Apply coupon automatically to cart
  //   
  //   // For now, we'll just show an alert
  //   if (typeof window !== 'undefined') {
  //     localStorage.setItem('wheel_coupon', couponCode);
  //   }
  // };

  // const handleWheelClose = () => {
  //   console.log('Wheel popup closed');
  //   // Analytics or other cleanup logic can go here
  // };

  // Debug wheel configuration
  // useEffect(() => {
  //   console.log('🎡 HomePage: WHEEL_CONFIG:', WHEEL_CONFIG);
  //   console.log('🎡 HomePage: POPUP_CONFIG:', POPUP_CONFIG);
  // }, []);



  // Handle scroll animations
  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll, .animate-on-scroll-left, .animate-on-scroll-right');
      elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('animate');
        }
      });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on mount
    
    return () => window.removeEventListener('scroll', animateOnScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm border-b z-40">
        <div className="container mx-auto px-4 py-1.5 md:py-3">
          <div className="flex items-center justify-between">
            {/* Navigation Menu - Left side */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                href={`/${locale}`} 
                className="text-sm font-medium text-gray-700 hover:text-brand-orange transition-colors underline-animate"
              >
                {t('navigation.home')}
              </Link>
              <button 
                onClick={scrollToProducts}
                className="text-sm font-medium text-gray-700 hover:text-brand-orange transition-colors underline-animate"
              >
                {t('navigation.products')}
              </button>
              <button 
                onClick={scrollToTestimonials}
                className="text-sm font-medium text-gray-700 hover:text-brand-orange transition-colors underline-animate"
              >
                {t('navigation.testimonials')}
              </button>
              <Link 
                href="#faq" 
                className="text-sm font-medium text-gray-700 hover:text-brand-orange transition-colors underline-animate"
              >
                {t('navigation.faq')}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="bg-brand-orange text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-brand-orange/90 transition-colors"
              >
                {t('navigation.contact')}
              </Link>
            </nav>

            {/* Mobile Menu Button - Left side on mobile */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1.5 text-gray-700 hover:text-brand-orange transition-colors"
                aria-label={t('ui.toggle_menu')}
              >
                {isMenuOpen ? (
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

            {/* Centered Logo */}
            <div className="flex-1 md:flex-none flex justify-center md:justify-center">
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
            <div className="hidden md:flex items-center gap-1 text-sm">
              <Phone className="h-4 w-4 text-brand-orange" />
              <a 
                href={`tel:${countryConfig.company.phone}`}
                className="font-medium text-gray-700 hover:text-brand-orange transition-colors"
              >
                {countryConfig.company.phone}
              </a>
            </div>

            {/* Mobile phone - Right side on mobile */}
            <div className="md:hidden">
              <a 
                href={`tel:${countryConfig.company.phone}`}
                className="p-1.5 text-brand-orange hover:text-brand-orange/80 transition-colors"
                aria-label={t('ui.call_us')}
              >
                <Phone className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMenuOpen && (
            <div className="md:hidden mt-2 pb-2 border-t border-gray-200">
              <nav className="flex flex-col space-y-2 pt-2">
                <Link 
                  href={`/${locale}`} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-medium text-gray-700 hover:text-brand-orange transition-colors px-2 py-1"
                >
                  {t('navigation.home')}
                </Link>
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    scrollToProducts();
                  }}
                  className="text-sm font-medium text-gray-700 hover:text-brand-orange transition-colors px-2 py-1 text-left"
                >
                  {t('navigation.products')}
                </button>
                <button 
                  onClick={(e) => {
                    setIsMenuOpen(false);
                    scrollToTestimonials(e);
                  }}
                  className="text-sm font-medium text-gray-700 hover:text-brand-orange transition-colors px-2 py-1 text-left"
                >
                  {t('navigation.testimonials')}
                </button>
                <a 
                  href="#faq" 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-medium text-gray-700 hover:text-brand-orange transition-colors px-2 py-1"
                >
                  {t('navigation.faq')}
                </a>
                <Link
                  href={`/${locale}/contact`}
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-brand-orange text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-brand-orange/90 transition-colors text-center mx-2"
                >
                  {t('navigation.contact')}
                </Link>
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

      {/* Hero Section - Enhanced with Modern Design */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 overflow-hidden">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-brand-green/15 to-emerald-300/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-56 h-56 bg-gradient-to-r from-brand-orange/15 to-orange-300/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-gradient-to-r from-blue-200/20 to-cyan-200/15 rounded-full blur-xl animate-bounce delay-500"></div>
          <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-gradient-to-r from-green-300/20 to-emerald-300/15 rounded-full blur-lg animate-ping delay-700"></div>
          
          {/* Floating particles */}
          <div className="absolute top-1/3 left-1/2 w-2 h-2 bg-brand-orange/30 rounded-full animate-float delay-200"></div>
          <div className="absolute top-2/3 right-1/4 w-3 h-3 bg-brand-green/25 rounded-full animate-float delay-1500"></div>
          <div className="absolute top-1/4 right-1/2 w-1 h-1 bg-emerald-400/40 rounded-full animate-ping delay-800"></div>
        </div>
        
        <div className="container mx-auto px-4 pt-20 md:pt-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Content - Enhanced with better animations */}
            <div className="space-y-8 lg:pr-8 animate-fadeInLeft">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-brand-green/10 to-emerald-100/50 border border-brand-green/20 rounded-full text-sm font-medium text-brand-green animate-fadeInUp">
                <Sparkles className="w-4 h-4 mr-2" />
                {t('homepage.trusted_by_thousands')}
              </div>

              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-[1.1] animate-fadeInUp">
                  {t('homepage.hero_title')}
                </h1>
                
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                  {t('homepage.hero_subtitle')}
                </p>

              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
                <Button 
                  size="lg" 
                  onClick={scrollToProducts}
                  className="bg-gradient-to-r from-brand-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-102 hover:-translate-y-0.5 group cursor-pointer relative overflow-hidden"
                >
                  {/* Subtle background glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 -translate-x-full group-hover:translate-x-full"></div>
                  
                  {/* Button content */}
                  <span className="relative z-10 flex items-center">
                    {t('homepage.products_button')}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-4 animate-fadeInUp" style={{animationDelay: '0.5s'}}>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-brand-green" />
                  <span className="text-sm text-gray-600">{t('homepage.trust_dermatologically_tested')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-brand-green" />
                  <span className="text-sm text-gray-600">{t('homepage.trust_natural_ingredients')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-brand-green" />
                  <span className="text-sm text-gray-600">{t('homepage.trust_clinically_proven')}</span>
                </div>
              </div>
            </div>
            
            {/* Right Image - Enhanced with better effects */}
            <div className="relative lg:h-[700px] animate-fadeInRight">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-green-100/30 rounded-3xl animate-float"></div>
              <div className="relative h-full flex items-center justify-center p-6">
                <div className="relative group">
                  {/* Enhanced background glow effect */}
                  <div className="absolute -inset-8 bg-gradient-to-r from-brand-green/20 via-transparent to-brand-orange/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
                  
                  {/* Additional floating particles */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-brand-green/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000 animate-float" style={{animationDelay: '0.2s'}}></div>
                  <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-brand-orange/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000 animate-float" style={{animationDelay: '0.4s'}}></div>
                  <div className="absolute top-1/2 -right-6 w-4 h-4 bg-brand-green/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000 animate-float" style={{animationDelay: '0.6s'}}></div>
                  
                  {/* Main image with enhanced hover effects */}
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl group-hover:shadow-3xl transition-all duration-700">
                    <Image
                      src={HOMEPAGE_IMAGES.hero.main}
                      alt={t('homepage.natural_beauty_alt')}
                      width={600}
                      height={700}
                      className="object-cover w-full h-full max-w-xl transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
                    />
                    
                    {/* Overlay effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Sparkle effect */}
                    <div className="absolute top-4 right-4 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-0 group-hover:scale-100">
                      <Sparkles className="w-3 h-3 text-brand-orange" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="bg-white">

        {/* Enhanced Product Showcase */}
        <section id="products" className="py-20 bg-gradient-to-b from-white to-gray-50 scroll-mt-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-fadeInUp">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-brand-orange/10 to-orange-100/50 border border-brand-orange/20 rounded-full text-sm font-medium text-brand-orange mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                {t('homepage.most_popular')}
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                {t('homepage.products_section_title')}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                {t('homepage.product_showcase_subtitle')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <Card 
                  key={product.id} 
                  className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group animate-slideInScale bg-white relative"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  {/* Bestseller Badge */}
                  {index === 0 && (
                    <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-brand-orange to-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {t('homepage.bestseller')}
                    </div>
                  )}
                  
                  <div className="aspect-square relative bg-gradient-to-br from-gray-50 to-white p-6 overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-green/5 to-brand-orange/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative w-full h-full flex items-center justify-center">
                      <ProductImageHover
                        mainImage={product.images.main}
                        hoverImage={product.images.gallery[product.images.gallery.length - 1] || product.images.main}
                        productName={product.name}
                        width={300}
                        height={300}
                        className="w-full h-full"
                      />
                    </div>
                    

                  </div>
                  
                  <CardContent className="p-6 text-center relative">
                    <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-brand-green transition-colors duration-300">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">{product.shortDescription}</p>
                    
                    {/* Product Purpose */}
                    <p className="text-xs text-gray-500 mb-6 leading-relaxed italic">{product.purpose}</p>
                    
                    {/* Rating - Commented Out */}
                    {/* <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="flex text-yellow-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 font-medium">(4.8)</span>
                      <span className="text-xs text-gray-400">• 127 {t('homepage.reviews_count')}</span>
                    </div> */}
                    
                    {/* Price - Commented Out */}
                    {/* <div className="mb-6">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl font-bold text-brand-orange">
                          {product.variants[0].discountPrice || product.variants[0].price} {countryConfig.currencySymbol}
                        </span>
                        {product.variants[0].discountPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            {product.variants[0].price} {countryConfig.currencySymbol}
                          </span>
                        )}
                      </div>
                      {product.variants[0].discountPrice && (
                        <div className="text-sm text-green-600 font-medium mt-1">
                          {t('homepage.savings')}: {product.variants[0].price - product.variants[0].discountPrice} {countryConfig.currencySymbol}
                        </div>
                      )}
                    </div> */}
                    
                    {/* CTA Button */}
                    <Button asChild size="lg" className="bg-gradient-to-r from-brand-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white w-full rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group/btn">
                      <Link href={`/${locale}/checkouts/${product.slug}`}>
                        {t('homepage.more_info')}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    
                    {/* Trust indicators */}
                    <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        <span>{t('homepage.fast_delivery')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        <span>{t('homepage.guarantee')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            

          </div>
        </section>

        {/* Trust Badges Section */}
        <section className="py-8 bg-gradient-to-r from-gray-50 to-white border-y border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              <div className="flex items-center gap-3 text-gray-600 hover:text-brand-green transition-colors duration-300 group">
                <div className="p-2 bg-brand-green/10 rounded-full group-hover:bg-brand-green/20 transition-colors">
                  <Shield className="w-5 h-5 text-brand-green" />
                </div>
                <span className="text-sm font-medium">{t('homepage.trust_dermatologically_tested')}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 hover:text-brand-green transition-colors duration-300 group">
                <div className="p-2 bg-brand-green/10 rounded-full group-hover:bg-brand-green/20 transition-colors">
                  <Leaf className="w-5 h-5 text-brand-green" />
                </div>
                <span className="text-sm font-medium">{t('homepage.trust_natural_ingredients')}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 hover:text-brand-green transition-colors duration-300 group">
                <div className="p-2 bg-brand-green/10 rounded-full group-hover:bg-brand-green/20 transition-colors">
                  <Award className="w-5 h-5 text-brand-green" />
                </div>
                <span className="text-sm font-medium">{t('homepage.trust_clinically_proven')}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 hover:text-brand-green transition-colors duration-300 group">
                <div className="p-2 bg-brand-green/10 rounded-full group-hover:bg-brand-green/20 transition-colors">
                  <ShieldCheck className="w-5 h-5 text-brand-green" />
                </div>
                <span className="text-sm font-medium">{t('homepage.trust_no_parabens')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Before/After Section */}
        <section className="py-20 bg-gradient-to-br from-emerald-50 via-white to-orange-50 w-full overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 animate-on-scroll-left">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-brand-green/10 to-emerald-100/50 border border-brand-green/20 rounded-full text-sm font-medium text-brand-green">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {t('homepage.proven_results')}
                </div>
                
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
                  {t('homepage.before_after_title')}
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {t('homepage.before_after_subtitle')}
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-white/70 rounded-xl shadow-sm animate-fadeInUp" style={{animationDelay: '0.1s'}}>
                    <div className="w-10 h-10 bg-brand-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-brand-green" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{t('homepage.visible_results')}</h4>
                      <p className="text-sm text-gray-600">{t('homepage.visible_results_desc')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-white/70 rounded-xl shadow-sm animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                    <div className="w-10 h-10 bg-brand-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-brand-green" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{t('homepage.safe_all_skin')}</h4>
                      <p className="text-sm text-gray-600">{t('homepage.safe_all_skin_desc')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-white/70 rounded-xl shadow-sm animate-fadeInUp" style={{animationDelay: '0.3s'}}>
                    <div className="w-10 h-10 bg-brand-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-brand-green" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{t('homepage.no_side_effects')}</h4>
                      <p className="text-sm text-gray-600">{t('homepage.no_side_effects_desc')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
                  <Button 
                    onClick={scrollToProducts}
                    className="bg-gradient-to-r from-brand-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-pointer"
                  >
                    {t('homepage.view_all_products')}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
              
              <div className="relative animate-on-scroll-right w-full">
                <div className="w-full max-w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden group shadow-2xl">
                  <Image
                    src={HOMEPAGE_IMAGES.beforeAfter.main}
                    alt={t('homepage.before_after_alt')}
                    width={600}
                    height={400}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                  />

                </div>
                

              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <div data-section="testimonials">
          <AdvancedTestimonials countryCode={locale} />
        </div>

        {/* Why Natural Section - Inspired by Reference */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl overflow-hidden">
                                     <Image
                     src={HOMEPAGE_IMAGES.naturalScience.main}
                     alt={t('homepage.nature_science_alt')}
                     width={500}
                     height={500}
                     className="object-cover w-full h-full"
                   />
                   <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                     <div className="text-center text-white">
                       <Leaf className="w-20 h-20 mx-auto mb-4" />
                       <p className="text-xl font-bold">{t('homepage.nature_science_text')}</p>
                     </div>
                   </div>
                </div>
              </div>
              
              <div className="space-y-6">
                                 <div className="text-sm text-brand-orange font-semibold uppercase tracking-wide">
                   {t('homepage.dermatologically_approved')}
                 </div>
                 <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                   {t('homepage.natural_science_title')}
                 </h2>
                 <p className="text-lg text-gray-600 leading-relaxed">
                   {t('homepage.natural_science_subtitle')}
                 </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                                     <div className="flex items-start gap-3">
                     <Zap className="h-5 w-5 text-brand-orange mt-1" />
                     <div>
                       <h4 className="font-semibold text-gray-900">{t('homepage.fast_absorption')}</h4>
                       <p className="text-sm text-gray-600">{t('homepage.fast_absorption_desc')}</p>
                     </div>
                   </div>
                   <div className="flex items-start gap-3">
                     <ShieldCheck className="h-5 w-5 text-brand-green mt-1" />
                     <div>
                       <h4 className="font-semibold text-gray-900">{t('homepage.safe_formula')}</h4>
                       <p className="text-sm text-gray-600">{t('homepage.safe_formula_desc')}</p>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-white scroll-mt-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <AdvancedFAQ countryCode={locale} className="bg-gray-50 rounded-2xl p-8 shadow-sm" />
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer countryConfig={countryConfig} locale={locale} />

      {/* GDPR Cookie Consent for EU */}
      <CookieConsent isEU={countryConfig.isEU} />

      {/* Wheel of Fortune Popup */}
      {/* <WheelPopup
        wheelConfig={WHEEL_CONFIG}
        popupConfig={POPUP_CONFIG}
        onPrizeWon={handlePrizeWon}
        onClose={handleWheelClose}
      /> */}

      {/* Test Wheel Modal */}
      {/* {showWheelTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowWheelTest(false)}
          />
          <div className="relative z-10 w-full max-w-[95vw] sm:max-w-2xl">
            <div className="absolute -top-4 -right-4 z-20">
              <Button
                onClick={() => setShowWheelTest(false)}
                size="sm"
                variant="outline"
                className="rounded-full w-10 h-10 p-0 bg-white/90 hover:bg-white border-2 border-gray-300 shadow-lg"
              >
                ✕
              </Button>
            </div>
            <WheelOfFortune
              config={WHEEL_CONFIG}
              onPrizeWon={handlePrizeWon}
              onClose={() => setShowWheelTest(false)}
            />
          </div>
        </div>
      )} */}
    </div>
  );
}
