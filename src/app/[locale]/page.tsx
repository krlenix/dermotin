'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getProductsForCountry } from '@/config/products';
import { getCountryConfig } from '@/config/countries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CookieConsent } from '@/components/features/CookieConsent';
import { Footer } from '@/components/ui/footer';
import { AdvancedTestimonials } from '@/components/features/AdvancedTestimonials';
import { SocialProof } from '@/components/features/SocialProof';
import { MarqueeText } from '@/components/ui/marquee-text';
import { WheelPopup } from '@/components/wheel-of-fortune/WheelPopup';
import { WheelOfFortune } from '@/components/wheel-of-fortune/WheelOfFortune';
import { WHEEL_CONFIG, POPUP_CONFIG } from '@/config/wheel';
import { useParams } from 'next/navigation';
import { 
  Star, 
  Shield, 
  Truck, 
  Award, 
  Leaf, 
  Heart,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  Menu,
  X,
  Sparkles,
  Users,
  Clock,
  Zap,
  ShieldCheck,
  Play
} from 'lucide-react';

export default function HomePage() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations();
  const countryConfig = getCountryConfig(locale);
  const products = getProductsForCountry(locale);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [showWheelTest, setShowWheelTest] = useState(false);

  // Handle wheel of fortune prize won
  const handlePrizeWon = (couponCode: string) => {
    console.log('Prize won with coupon code:', couponCode);
    // Here you can implement logic to:
    // - Save coupon to local storage
    // - Send analytics event
    // - Show notification
    // - Apply coupon automatically to cart
    
    // For now, we'll just show an alert
    if (typeof window !== 'undefined') {
      localStorage.setItem('wheel_coupon', couponCode);
    }
  };

  const handleWheelClose = () => {
    console.log('Wheel popup closed');
    // Analytics or other cleanup logic can go here
  };

  // Debug wheel configuration
  useEffect(() => {
    console.log('🎡 HomePage: WHEEL_CONFIG:', WHEEL_CONFIG);
    console.log('🎡 HomePage: POPUP_CONFIG:', POPUP_CONFIG);
  }, []);

  // Handle scroll for header effects
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      {/* Elegant Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Image
                src={countryConfig.logo}
                alt="DERMOTIN"
                width={140}
                height={45}
                className="h-10 w-auto"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href={`/${locale}`} className="text-gray-800 hover:text-brand-green font-medium transition-colors relative group">
                Početna
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-green transition-all group-hover:w-full"></span>
              </Link>
              <Link href={`/${locale}/products`} className="text-gray-800 hover:text-brand-green font-medium transition-colors relative group">
                Proizvodi
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-green transition-all group-hover:w-full"></span>
              </Link>
              <Link href={`/${locale}/about`} className="text-gray-800 hover:text-brand-green font-medium transition-colors relative group">
                O nama
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-green transition-all group-hover:w-full"></span>
              </Link>
              <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white px-6 py-2">
                Kontakt
              </Button>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-800 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 py-4 mt-4 rounded-b-lg shadow-lg">
              <nav className="flex flex-col space-y-4">
                <Link href={`/${locale}`} className="text-gray-800 hover:text-brand-green font-medium transition-colors">
                  Početna
                </Link>
                <Link href={`/${locale}/products`} className="text-gray-800 hover:text-brand-green font-medium transition-colors">
                  Proizvodi
                </Link>
                <Link href={`/${locale}/about`} className="text-gray-800 hover:text-brand-green font-medium transition-colors">
                  O nama
                </Link>
                <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white w-full">
                  Kontakt
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section - Animated & Parallax */}
      <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-brand-green/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-brand-orange/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-200/20 rounded-full blur-xl animate-bounce delay-500"></div>
          <div className="absolute bottom-1/4 right-1/3 w-20 h-20 bg-green-300/20 rounded-full blur-lg animate-ping delay-700"></div>
        </div>
        
        <div className="container mx-auto px-4 pt-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Content - Fade in from left */}
            <div className="space-y-8 lg:pr-8 animate-fadeInLeft">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] animate-fadeInUp">
                  Bez hemikalija. Bez <br />
                  neželjenih efekata. Bez <br />
                  <span className="text-brand-orange animate-pulse">straha.</span>
                </h1>
                
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                  Naši prirodni dermokozmetički proizvodi pružaju sigurna rešenja za zdravu, 
                  lepu kožu bez kompromisa.
                </p>
              </div>
              
              <div className="animate-fadeInUp space-x-4" style={{animationDelay: '0.4s'}}>
                <Button size="lg" className="bg-brand-orange hover:bg-brand-orange/90 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                  PROIZVODI
                </Button>
                {/* Test button for wheel */}
                <Button 
                  onClick={() => setShowWheelTest(true)}
                  size="lg" 
                  variant="outline" 
                  className="border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                >
                  {t('wheel.debug.test_wheel')}
                </Button>
              </div>
              
                          </div>
            
            {/* Right Image - Fade in from right with floating effect */}
            <div className="relative lg:h-[600px] animate-fadeInRight">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-green-100/50 rounded-3xl animate-float"></div>
              <div className="relative h-full flex items-center justify-center p-8">
                <div className="relative group">
                  <Image
                    src="https://dermotin.shop/wp-content/uploads/2025/06/IMG_1585-1-qv31g6nybslcns2bzmoe8ky033v7opjd9wrqwip0cg.png"
                    alt="Prirodna lepota"
                    width={400}
                    height={500}
                    className="object-cover w-full h-full max-w-md rounded-2xl shadow-lg transition-all duration-500 group-hover:scale-105 group-hover:rotate-1"
                  />
                  <div className="absolute -inset-4 bg-gradient-to-r from-brand-green/20 to-brand-orange/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Trust Section */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <div className="flex items-center gap-3 text-gray-600">
              <Shield className="w-5 h-5 text-brand-green" />
              <span className="text-sm font-medium">Dermatološki testirani</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Leaf className="w-5 h-5 text-brand-green" />
              <span className="text-sm font-medium">100% prirodni sastojci</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Award className="w-5 h-5 text-brand-green" />
              <span className="text-sm font-medium">Klinički dokazano</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <ShieldCheck className="w-5 h-5 text-brand-green" />
              <span className="text-sm font-medium">Bez parabena i sulfata</span>
            </div>
          </div>
        </div>
      </section>

      <main className="bg-white">

        {/* Product Showcase - Animated */}
        <section className="py-20 animate-on-scroll">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 animate-fadeInUp">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Naši proizvodi za negu kože
              </h2>
              <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white px-6 py-2 rounded-full hover:scale-105 transition-all duration-300">
                POGLEDAJ SVE
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <Card 
                  key={product.id} 
                  className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group animate-slideInScale"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="aspect-square relative bg-gradient-to-br from-white to-gray-50 p-4">
                    <div className="w-full h-full flex items-center justify-center">
                      <Image
                        src={product.images.main}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="object-contain w-full h-full group-hover:scale-110 group-hover:rotate-2 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{product.shortDescription}</p>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div className="flex text-yellow-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-3 w-3 fill-current" />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">(4.8)</span>
                    </div>
                    <div className="text-lg font-bold text-brand-orange mb-3">
                      {product.variants[0].discountPrice || product.variants[0].price} {countryConfig.currencySymbol}
                    </div>
                    <Button asChild size="sm" className="bg-brand-orange hover:bg-brand-orange/90 text-white w-full rounded-lg">
                      <Link href={`/${locale}/checkouts/${product.slug}`}>
                        DODAJ U KORPU
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Before/After Section - Animated */}
        <section className="py-20 bg-gradient-to-r from-brand-green/10 to-brand-orange/10 w-full overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-on-scroll-left">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Pogledajte rezultate pre i posle
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Naši klijenti dele svoje neverovatne transformacije nakon korišćenja DERMOTIN proizvoda. 
                  Prirodni sastojci donose vidljive rezultate već posle nekoliko nedelja redovne upotrebe.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
                    <CheckCircle className="h-5 w-5 text-brand-green" />
                    <span className="text-gray-700">Vidljivi rezultati za 2-3 nedelje</span>
                  </div>
                  <div className="flex items-center gap-3 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                    <CheckCircle className="h-5 w-5 text-brand-green" />
                    <span className="text-gray-700">Sigurni za sve tipove kože</span>
                  </div>
                  <div className="flex items-center gap-3 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
                    <CheckCircle className="h-5 w-5 text-brand-green" />
                    <span className="text-gray-700">Bez neželjenih efekata</span>
                  </div>
                </div>
                
                <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white px-8 py-3 rounded-lg hover:scale-105 transition-all duration-300 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
                  SAZNAJTE VIŠE
                </Button>
              </div>
              
              <div className="relative animate-on-scroll-right w-full">
                <div className="w-full max-w-full aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl overflow-hidden group">
                  <Image
                    src="https://dermotin.shop/wp-content/uploads/2024/10/c2-vid-blg-2-opt.jpg"
                    alt="Pre i posle rezultati"
                    width={600}
                    height={400}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors duration-300">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:scale-110 transition-transform duration-300 cursor-pointer">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <AdvancedTestimonials countryCode={locale} />
          </div>
        </section>

        {/* Why Natural Section - Inspired by Reference */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl overflow-hidden">
                  <Image
                    src="https://dermotin.shop/wp-content/uploads/2025/06/462513468_17881674504134626_2080050215120435048_n.webp"
                    alt="Priroda i nauka"
                    width={500}
                    height={500}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="text-center text-white">
                      <Leaf className="w-20 h-20 mx-auto mb-4" />
                      <p className="text-xl font-bold">Priroda & Nauka</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="text-sm text-brand-orange font-semibold uppercase tracking-wide">
                  PROIZVODE SA DERMATOLOŠKI ODOBRENIM
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  PRIRODNO, A I <br />
                  JEDNAKO EFIKASNO
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  U DERMOTIN-u verujemo da prirodni sastojci mogu biti jednako efikasni kao sintetski, 
                  a pritom bezbedniji za vašu kožu i zdravlje. Naša formula kombinuje vekovima poznate 
                  prirodne lekovite sastojke sa najnovijim dermatološkim dostignućima.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-brand-orange mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Brza apsorbcija</h4>
                      <p className="text-sm text-gray-600">Ne ostavlja masne tragove</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-brand-green mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Bezbedna formula</h4>
                      <p className="text-sm text-gray-600">Testirana na osetljivoj koži</p>
                    </div>
                  </div>
                </div>
                
                <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white px-8 py-3 rounded-lg">
                  SAZNAJTE VIŠE O SASTOJCIMA
                </Button>
              </div>
            </div>
          </div>
        </section>


      </main>

      {/* Footer */}
      <Footer countryConfig={countryConfig} />

      {/* GDPR Cookie Consent for EU */}
      <CookieConsent isEU={countryConfig.isEU} />

      {/* Wheel of Fortune Popup */}
      <WheelPopup
        wheelConfig={WHEEL_CONFIG}
        popupConfig={POPUP_CONFIG}
        onPrizeWon={handlePrizeWon}
        onClose={handleWheelClose}
      />

      {/* Test Wheel Modal */}
      {showWheelTest && (
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
      )}
    </div>
  );
}
