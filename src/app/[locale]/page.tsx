'use client';

import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  ArrowRight,
  Award,
  Check,
  Leaf,
  Mail,
  Menu,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  X,
} from 'lucide-react';
import { getProductsForCountry, type Product } from '@/config/products';
import { getCountryConfig } from '@/config/countries';
import { HOMEPAGE_IMAGES } from '@/config/images';
import { CookieConsent } from '@/components/features/CookieConsent';
import { CountriesHeader } from '@/components/features/CountriesHeader';
import { CountryMismatchBanner } from '@/components/features/CountryMismatchBanner';
import { CountrySwitcher } from '@/components/features/CountrySwitcher';
import { ProductImageHover } from '@/components/features/ProductImageHover';
import { BOGOLoadedBanner } from '@/components/features/BOGOLoadedBanner';
import { Footer } from '@/components/ui/footer';
import { PixelTracker, usePixelTracking } from '@/components/tracking/PixelTracker';
import { useMarketingTracking } from '@/hooks/useMarketingTracking';
import { storeBOGOCookie, BOGO_CONFIG, initializeBOGO } from '@/utils/bogo-cookies';

const AdvancedFAQ = dynamic(
  () => import('@/components/features/AdvancedFAQ').then((mod) => ({ default: mod.AdvancedFAQ })),
  {
    loading: () => <div className="h-96 animate-pulse rounded-[1.75rem] bg-white/80" />,
    ssr: false,
  }
);

const HERO_IMAGES = {
  mobile: HOMEPAGE_IMAGES.hero.mobile,
  desktop: HOMEPAGE_IMAGES.hero.main,
};

export default function HomePage() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations();
  const countryConfig = getCountryConfig(locale);
  const { trackEvent } = usePixelTracking(countryConfig.code);

  const [products, setProducts] = useState<Product[]>([]);
  const headerProgressRef = useRef(0);
  const headerAnimationFrameRef = useRef<number | null>(null);
  const headerFrameRef = useRef<HTMLDivElement | null>(null);
  const headerSeamRef = useRef<HTMLDivElement | null>(null);
  const headerMembranePathRef = useRef<SVGPathElement | null>(null);
  const headerSeamBasePathRef = useRef<SVGPathElement | null>(null);
  const headerSeamGlowPathRef = useRef<SVGPathElement | null>(null);
  const headerShadowRef = useRef<HTMLDivElement | null>(null);
  const headerShellRef = useRef<HTMLDivElement | null>(null);
  const headerSurfaceRef = useRef<HTMLDivElement | null>(null);
  const headerHighlightRef = useRef<HTMLDivElement | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBOGOBanner, setShowBOGOBanner] = useState(false);
  const [isBOGOActive, setIsBOGOActive] = useState(false);

  useMarketingTracking();

  useEffect(() => {
    setIsClient(true);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const { isActive: bogoIsActive } = initializeBOGO();

    if (bogoIsActive) {
      const searchParams = new URLSearchParams(window.location.search);
      const urlCoupon = searchParams.get('coupon');

      if (urlCoupon && urlCoupon.toUpperCase() === BOGO_CONFIG.couponCode) {
        storeBOGOCookie(urlCoupon, 'url');
        setShowBOGOBanner(true);
        setIsBOGOActive(true);
      } else {
        const cookies = document.cookie.split(';');
        const hasBOGOCookie = cookies.some((cookie) => cookie.trim().startsWith('bogo_offer='));

        if (hasBOGOCookie) {
          setIsBOGOActive(true);
        }
      }
    }

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  useEffect(() => {
    if (!isClient || products.length === 0) {
      return;
    }

    const featuredProducts = products.slice(0, 3);
    const totalValue = featuredProducts.reduce((sum, product) => sum + (product.variants[0]?.price || 0), 0);

    trackEvent('view_content', {
      content_type: 'product',
      content_ids: featuredProducts.map((product) => product.id),
      contents: featuredProducts.map((product) => ({
        id: product.id,
        quantity: 1,
        item_price: product.variants[0]?.price || 0,
      })),
      currency: countryConfig.currency,
      value: totalValue,
    });
  }, [countryConfig.currency, isClient, products, trackEvent]);

  useEffect(() => {
    const frame = headerFrameRef.current;
    const seam = headerSeamRef.current;
    const membranePath = headerMembranePathRef.current;
    const seamBasePath = headerSeamBasePathRef.current;
    const seamGlowPath = headerSeamGlowPathRef.current;
    const shadow = headerShadowRef.current;
    const shell = headerShellRef.current;
    const surface = headerSurfaceRef.current;
    const highlight = headerHighlightRef.current;

    if (!frame || !seam || !membranePath || !seamBasePath || !seamGlowPath || !shadow || !shell || !surface || !highlight) {
      return;
    }

    frame.style.transform = 'translateZ(0)';
    seam.style.transform = 'translateZ(0)';
    shadow.style.transform = 'translate3d(-50%, 2px, 0) scaleX(0.985)';
    shell.style.transform = 'translateZ(0)';
    surface.style.transform = 'translate3d(0, 0, 0) scale(1)';
    highlight.style.transform = 'translate3d(0, -10px, 0) scale(1)';

    const applyHeaderProgress = (progress: number) => {
      const easedHeaderProgress = 1 - Math.pow(1 - progress, 2.35);
      const squeezeProgress = Math.min(easedHeaderProgress / 0.52, 1);
      const bubbleProgress = Math.min(Math.max((easedHeaderProgress - 0.26) / 0.74, 0), 1);
      const shadowProgress = Math.min(Math.max((bubbleProgress - 0.72) / 0.28, 0), 1);
      const tearProgress = Math.min(Math.max((easedHeaderProgress - 0.06) / 0.34, 0), 1) * (1 - bubbleProgress * 0.72);
      const seamDepth = 8 + squeezeProgress * 22;
      const membranePathValue = `M 0 0 L 100 0 L 100 6 C 90 6 79 ${Math.round(8 + seamDepth * 0.16)} 67 ${Math.round(10 + seamDepth * 0.34)} C 58 ${Math.round(12 + seamDepth * 0.48)} 42 ${Math.round(12 + seamDepth * 0.48)} 33 ${Math.round(10 + seamDepth * 0.34)} C 21 ${Math.round(8 + seamDepth * 0.16)} 10 6 0 6 Z`;
      const seamPathValue = `M 0 6 C 10 6 21 ${Math.round(8 + seamDepth * 0.16)} 33 ${Math.round(10 + seamDepth * 0.34)} C 42 ${Math.round(12 + seamDepth * 0.48)} 58 ${Math.round(12 + seamDepth * 0.48)} 67 ${Math.round(10 + seamDepth * 0.34)} C 79 ${Math.round(8 + seamDepth * 0.16)} 90 6 100 6`;

      frame.style.paddingTop = `${Math.round(bubbleProgress * 9)}px`;
      frame.style.paddingLeft = `${Math.round(bubbleProgress * 14)}px`;
      frame.style.paddingRight = `${Math.round(bubbleProgress * 14)}px`;

      seam.style.height = `${Math.round(20 + seamDepth * 0.82)}px`;
      seam.style.opacity = `${tearProgress * 0.22}`;

      membranePath.setAttribute('d', membranePathValue);
      membranePath.setAttribute('fill', `rgba(255,255,255,${0.015 + tearProgress * 0.035})`);
      seamBasePath.setAttribute('d', seamPathValue);
      seamGlowPath.setAttribute('d', seamPathValue);

      shadow.style.opacity = `${shadowProgress * 0.28}`;
      shadow.style.transform = `translate3d(-50%, ${2 + bubbleProgress * 4}px, 0) scaleX(${0.985 - bubbleProgress * 0.11})`;

      shell.style.width = `calc(100% - ${Math.round(squeezeProgress * 10 + bubbleProgress * 28)}px)`;
      shell.style.maxWidth = `${Math.round(2200 - bubbleProgress * 920)}px`;

      surface.style.borderRadius = `${Math.round(easedHeaderProgress * 26)}px`;
      surface.style.background = `linear-gradient(135deg, rgba(255, 255, 255, ${easedHeaderProgress * 0.76}), rgba(255, 255, 255, ${easedHeaderProgress * 0.3}))`;
      surface.style.backdropFilter = `blur(${Math.round(easedHeaderProgress * 24)}px) saturate(${Math.round(100 + easedHeaderProgress * 95)}%)`;
      surface.style.setProperty('-webkit-backdrop-filter', `blur(${Math.round(easedHeaderProgress * 24)}px) saturate(${Math.round(100 + easedHeaderProgress * 95)}%)`);
      surface.style.border = `1px solid rgba(255, 255, 255, ${easedHeaderProgress * 0.6})`;
      surface.style.boxShadow = `inset 0 1px 0 rgba(255, 255, 255, ${0.18 + easedHeaderProgress * 0.66}), inset 0 -1px 0 rgba(255, 255, 255, ${easedHeaderProgress * 0.2})`;
      surface.style.transform = `translate3d(0, ${easedHeaderProgress * 7}px, 0) scale(${1 - easedHeaderProgress * 0.02})`;

      highlight.style.opacity = `${0.12 + easedHeaderProgress * 0.72}`;
      highlight.style.background = `linear-gradient(180deg, rgba(255,255,255,${0.08 + easedHeaderProgress * 0.24}) 0%, rgba(255,255,255,0) 52%), radial-gradient(120% 100% at 0% 0%, rgba(255,255,255,${easedHeaderProgress * 0.24}) 0%, rgba(255,255,255,0) 58%)`;
      highlight.style.transform = `translate3d(0, ${(1 - easedHeaderProgress) * -10}px, 0) scale(${1 + easedHeaderProgress * 0.02})`;
    };

    const animateHeader = () => {
      const targetProgress = Math.min(window.scrollY / 170, 1);
      const currentProgress = headerProgressRef.current;
      const nextProgress = currentProgress + (targetProgress - currentProgress) * 0.12;

      if (Math.abs(targetProgress - nextProgress) < 0.0025) {
        headerProgressRef.current = targetProgress;
        applyHeaderProgress(targetProgress);
        headerAnimationFrameRef.current = null;
        return;
      }

      headerProgressRef.current = nextProgress;
      applyHeaderProgress(nextProgress);
      headerAnimationFrameRef.current = window.requestAnimationFrame(animateHeader);
    };

    const handleScroll = () => {
      if (headerAnimationFrameRef.current === null) {
        headerAnimationFrameRef.current = window.requestAnimationFrame(animateHeader);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    applyHeaderProgress(0);

    let prewarmFrameOne = 0;
    let prewarmFrameTwo = 0;
    let prewarmFrameThree = 0;

    prewarmFrameOne = window.requestAnimationFrame(() => {
      applyHeaderProgress(0.035);
      prewarmFrameTwo = window.requestAnimationFrame(() => {
        applyHeaderProgress(0);
        prewarmFrameThree = window.requestAnimationFrame(() => {
          shadow.style.opacity = '0';
          seam.style.opacity = '0';
        });
      });
    });

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (headerAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(headerAnimationFrameRef.current);
      }
      window.cancelAnimationFrame(prewarmFrameOne);
      window.cancelAnimationFrame(prewarmFrameTwo);
      window.cancelAnimationFrame(prewarmFrameThree);
    };
  }, []);

  const currentImageSrc = isClient && isMobile ? HERO_IMAGES.mobile : HERO_IMAGES.desktop;

  const featureCards = useMemo(
    () => [
      {
        icon: Leaf,
        title: t('homepage.feature_natural_title'),
        description: t('homepage.feature_natural_desc'),
        details: t('homepage.feature_natural_details'),
      },
      {
        icon: ShieldCheck,
        title: t('homepage.feature_tested_title'),
        description: t('homepage.feature_tested_desc'),
        details: t('homepage.feature_tested_details'),
      },
      {
        icon: Sparkles,
        title: t('homepage.feature_results_title'),
        description: t('homepage.feature_results_desc'),
        details: t('homepage.feature_results_details'),
      },
      {
        icon: Star,
        title: t('homepage.feature_trusted_title'),
        description: t('homepage.feature_trusted_desc'),
        details: t('homepage.feature_trusted_details'),
      },
      {
        icon: Truck,
        title: t('homepage.feature_shipping_title'),
        description: t('homepage.feature_shipping_desc'),
        details: t('homepage.feature_shipping_details'),
      },
      {
        icon: Award,
        title: t('homepage.feature_guarantee_title'),
        description: t('homepage.feature_guarantee_desc'),
        details: t('homepage.feature_guarantee_details'),
      },
    ],
    [t]
  );

  const supportHref = countryConfig.company.phone
    ? `tel:${countryConfig.company.phone}`
    : `mailto:${countryConfig.company.email}`;
  const supportLabel = countryConfig.company.phone || countryConfig.company.email;

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMenuOpen(false);
    }
  };

  const handleMenuScroll = (event: MouseEvent<HTMLButtonElement>, id: string) => {
    event.preventDefault();
    scrollToSection(id);
  };

  const handleBOGOSelectProduct = () => {
    setShowBOGOBanner(false);
    scrollToSection('products');
  };

  const SupportIcon = countryConfig.company.phone ? Phone : Mail;

  return (
    <>
      <BOGOLoadedBanner
        isVisible={showBOGOBanner}
        onClose={() => setShowBOGOBanner(false)}
        onSelectProduct={handleBOGOSelectProduct}
      />

      <CountryMismatchBanner />

      <div
        className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#f6f8f6_0%,#ffffff_28%,#f8fbf9_62%,#ffffff_100%)]"
        style={{ maxWidth: '100vw' }}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-28 right-0 h-96 w-96 rounded-full bg-[#358055]/8 blur-3xl" />
          <div className="absolute top-[32rem] -left-20 h-80 w-80 rounded-full bg-[#F3765D]/8 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-[#358055]/7 blur-3xl" />
        </div>

        <header className="fixed inset-x-0 top-0 z-40">
          <div ref={headerFrameRef} className="relative" style={{ paddingTop: 0, paddingLeft: 0, paddingRight: 0 }}>
            <div ref={headerSeamRef} className="pointer-events-none absolute inset-x-0 top-full overflow-hidden" style={{ height: '32px', opacity: 0, willChange: 'height, opacity, transform', contain: 'paint' }}>
              <svg className="h-full w-full" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="homepage-header-seam" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                    <stop offset="18%" stopColor="rgba(255,255,255,0.18)" />
                    <stop offset="50%" stopColor="rgba(255,255,255,0.32)" />
                    <stop offset="82%" stopColor="rgba(255,255,255,0.18)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </linearGradient>
                </defs>
                <path ref={headerMembranePathRef} d="M 0 0 L 100 0 L 100 6 C 90 6 79 9 67 13 C 58 16 42 16 33 13 C 21 9 10 6 0 6 Z" fill="rgba(255,255,255,0.015)" />
                <path ref={headerSeamBasePathRef} d="M 0 6 C 10 6 21 9 33 13 C 42 16 58 16 67 13 C 79 9 90 6 100 6" stroke="rgba(53,128,85,0.025)" strokeWidth="2.2" fill="none" />
                <path ref={headerSeamGlowPathRef} d="M 0 6 C 10 6 21 9 33 13 C 42 16 58 16 67 13 C 79 9 90 6 100 6" stroke="url(#homepage-header-seam)" strokeWidth="0.85" fill="none" />
              </svg>
            </div>
            <div ref={headerShadowRef} className="pointer-events-none absolute left-1/2 top-full h-10 w-[74%] -translate-x-1/2 rounded-full bg-[#1a362a]/14 blur-3xl" style={{ opacity: 0, transform: 'translate3d(-50%, 4px, 0) scaleX(0.92)', willChange: 'transform, opacity', contain: 'paint' }} />
            <div
              ref={headerShellRef}
              className="mx-auto w-full"
              style={{ width: 'calc(100% - 0px)', maxWidth: '2200px', willChange: 'width, max-width, transform', contain: 'layout paint style' }}
            >
              <div
                ref={headerSurfaceRef}
                className="relative overflow-hidden px-4 py-3 md:px-6"
                style={{ borderRadius: 0, background: 'linear-gradient(135deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0))', border: '1px solid rgba(255,255,255,0)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0), inset 0 -1px 0 rgba(255,255,255,0)', transform: 'translate3d(0, 0, 0) scale(1)', willChange: 'transform, border-radius, backdrop-filter, box-shadow, background, border', contain: 'paint' }}
              >
              <div ref={headerHighlightRef} className="pointer-events-none absolute inset-0" style={{ opacity: 0.12, background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 52%), radial-gradient(120% 100% at 0% 0%, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 58%)', transform: 'translate3d(0, -10px, 0) scale(1)', willChange: 'transform, opacity', contain: 'paint' }} />
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 md:gap-5">
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen((open) => !open)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#358055]/15 bg-white/80 text-slate-700 md:hidden"
                    aria-label={t('ui.toggle_menu')}
                  >
                    {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </button>

                  <Link href={`/${locale}`} className="inline-flex items-center">
                    <Image
                      src={countryConfig.logo}
                      alt={t('ui.alt_logo')}
                      width={150}
                      height={40}
                      className="h-8 w-auto md:h-10"
                      priority
                    />
                  </Link>
                </div>

                <nav className="hidden items-center gap-5 text-sm font-semibold text-slate-700 md:flex">
                  <button type="button" onClick={(event) => handleMenuScroll(event, 'products')} className="transition-colors hover:text-[#F3765D]">
                    {t('navigation.products')}
                  </button>
                  <button type="button" onClick={(event) => handleMenuScroll(event, 'story')} className="transition-colors hover:text-[#F3765D]">
                    {t('homepage.features_title')}
                  </button>
                  <button type="button" onClick={(event) => handleMenuScroll(event, 'faq')} className="transition-colors hover:text-[#F3765D]">
                    {t('navigation.faq')}
                  </button>
                </nav>

                <div className="flex items-center gap-2 md:gap-3">
                  <CountrySwitcher variant="ghost" />
                  <a
                    href={supportHref}
                    className="liquid-glass-soft hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 md:inline-flex"
                  >
                    {countryConfig.company.phone ? (
                      <Phone className="h-4 w-4 text-[#F3765D]" />
                    ) : (
                      <Mail className="h-4 w-4 text-[#F3765D]" />
                    )}
                    {supportLabel}
                  </a>
                  <Link
                    href={`/${locale}/contact`}
                    className="inline-flex items-center justify-center rounded-full bg-[#F3765D] px-4 py-2 text-sm font-extrabold text-white shadow-lg transition-colors hover:bg-[#e0654d]"
                  >
                    {t('navigation.contact')}
                  </Link>
                </div>
              </div>

              {isMenuOpen && (
                <div className="mt-3 rounded-[1.3rem] border border-white/60 bg-white/75 p-4 md:hidden">
                  <nav className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    <button
                      type="button"
                      onClick={(event) => handleMenuScroll(event, 'products')}
                      className="rounded-xl px-3 py-2 text-left hover:bg-[#358055]/5"
                    >
                      {t('navigation.products')}
                    </button>
                    <button
                      type="button"
                      onClick={(event) => handleMenuScroll(event, 'story')}
                      className="rounded-xl px-3 py-2 text-left hover:bg-[#358055]/5"
                    >
                      {t('homepage.features_title')}
                    </button>
                    <button
                      type="button"
                      onClick={(event) => handleMenuScroll(event, 'faq')}
                      className="rounded-xl px-3 py-2 text-left hover:bg-[#358055]/5"
                    >
                      {t('navigation.faq')}
                    </button>
                    <Link
                      href={`/${locale}/contact`}
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded-xl px-3 py-2 hover:bg-[#358055]/5"
                    >
                      {t('navigation.contact')}
                    </Link>
                  </nav>
                </div>
              )}
              </div>
            </div>
          </div>
        </header>

        <main className="relative pb-16 pt-28 md:pb-20 md:pt-34">
          <section className="relative">
            <div className="container mx-auto px-4">
              <div className="section-card-strong overflow-hidden px-5 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10">
                <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center rounded-full border border-[#358055]/20 bg-[#358055]/10 px-3 py-1 text-[13px] font-extrabold tracking-[0.01em] text-[#2f6f4a]">
                        <Sparkles className="mr-2 h-4 w-4" />
                        {t('homepage.trusted_by_thousands')}
                      </span>
                      <span className="inline-flex items-center rounded-full border border-[#F3765D]/20 bg-[#F3765D]/10 px-3 py-1 text-[13px] font-extrabold tracking-[0.01em] text-[#ba5a47]">
                        {t('homepage.most_popular')}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <h1 className="max-w-3xl text-4xl font-black leading-[1.12] tracking-[-0.02em] text-slate-900 sm:text-5xl lg:text-6xl">
                        {t('homepage.hero_title')}
                      </h1>
                      <p className="max-w-2xl text-lg leading-relaxed text-slate-700 md:text-xl">
                        {t('homepage.hero_subtitle')}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
                      <div className="liquid-glass-soft inline-flex items-center gap-2 rounded-full px-4 py-2">
                        <div className="flex text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                        <span className="font-semibold">4.97/5</span>
                      </div>
                      <div className="liquid-glass-soft inline-flex items-center gap-2 rounded-full px-4 py-2">
                        <ShieldCheck className="h-4 w-4 text-[#358055]" />
                        <span className="font-medium">{t('homepage.trust_dermatologically_tested')}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <button
                        type="button"
                        onClick={() => scrollToSection('products')}
                        className="inline-flex items-center justify-center rounded-full bg-[#F3765D] px-8 py-4 text-base font-extrabold text-white shadow-[0_18px_36px_rgba(243,118,93,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e0654d]"
                      >
                        {t('homepage.products_button')}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </button>
                      <Link
                        href={`/${locale}/contact`}
                        className="inline-flex items-center justify-center rounded-full border border-[#358055]/15 bg-white px-8 py-4 text-base font-bold text-slate-800 transition-colors hover:border-[#F3765D]/30 hover:text-[#F3765D]"
                      >
                        {t('navigation.contact')}
                      </Link>
                    </div>

                    <div className="overflow-hidden rounded-[1.5rem] border border-[#358055]/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(248,250,248,0.94))] shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
                      {[
                        t('homepage.trust_dermatologically_tested'),
                        t('homepage.trust_natural_ingredients'),
                        t('homepage.trust_clinically_proven'),
                      ].map((item, index) => (
                        <div
                          key={item}
                          className={`flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-slate-700 md:px-5 ${
                            index > 0 ? 'border-t border-[#358055]/10' : ''
                          }`}
                        >
                          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#358055]/18 bg-[#358055]/8">
                            <Check className="h-3.5 w-3.5 text-[#358055]" />
                          </span>
                          <span className="leading-6">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(242,247,244,0.94))] p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
                      <div className="absolute -left-6 top-10 hidden h-24 w-24 rounded-full bg-[#F3765D]/15 blur-2xl md:block" />
                      <div className="absolute -right-6 bottom-10 hidden h-28 w-28 rounded-full bg-[#358055]/15 blur-2xl md:block" />
                      <div className="relative overflow-hidden rounded-[1.6rem] bg-[radial-gradient(circle_at_top_left,rgba(53,128,85,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(243,118,93,0.12),transparent_24%),linear-gradient(180deg,rgba(248,251,249,1),rgba(255,255,255,1))] p-4">
                        <Image
                          src={currentImageSrc}
                          alt={t('homepage.natural_beauty_alt')}
                          width={1200}
                          height={1400}
                          className="h-auto w-full rounded-[1.3rem] object-contain"
                          priority
                          quality={95}
                          sizes="(max-width: 1024px) 100vw, 42vw"
                        />
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </section>

          <CountriesHeader />

          <section id="products" className="scroll-mt-28 py-8 md:py-10">
            <div className="container mx-auto px-4">
              <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="max-w-3xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#358055]">{t('homepage.featured_products')}</p>
                  <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950 md:text-5xl">
                    <span className="highlight-block-orange">{t('homepage.products_section_title')}</span>
                  </h2>
                  <p className="mt-4 text-lg leading-relaxed text-slate-600">{t('homepage.product_showcase_subtitle')}</p>
                </div>
                <button
                  type="button"
                  onClick={() => scrollToSection('faq')}
                  className="inline-flex items-center text-sm font-semibold text-[#F3765D] transition-colors hover:text-[#e0654d]"
                >
                  {t('homepage.learn_more_button')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>

              {products.length > 0 && (
                <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                  {products.map((product, index) => (
                    <Link
                      key={product.id}
                      href={`/${locale}/checkouts/${product.slug}`}
                      className="group relative overflow-hidden rounded-[1.35rem] border border-[#d7e6de] bg-[linear-gradient(180deg,#f7faf8_0%,#eef4f0_100%)] shadow-[0_14px_34px_rgba(15,23,42,0.05)] transition-transform duration-300 hover:-translate-y-1 md:rounded-[1.65rem]"
                    >
                      <div className="relative aspect-square overflow-hidden bg-[linear-gradient(180deg,#fafafa_0%,#ececec_100%)]">
                        {isBOGOActive && index === 0 && (
                          <div className="absolute left-3 top-3 z-10 rounded-full bg-[#358055] px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-white">
                            1+1 GRATIS
                          </div>
                        )}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.45),rgba(255,255,255,0.12)_34%,transparent_62%)]" />
                        <ProductImageHover
                          mainImage={product.images.main}
                          hoverImage={
                            product.images.gallery && product.images.gallery.length > 0
                              ? product.images.gallery[product.images.gallery.length - 1] || product.images.main
                              : product.images.main
                          }
                          productName={product.name}
                          width={520}
                          height={520}
                          className="h-full w-full transition-transform duration-500 group-hover:scale-[1.01]"
                          imageClassName="object-contain object-center"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
                          <div className="w-full rounded-[1rem] border border-white/38 bg-[linear-gradient(180deg,rgba(255,255,255,0.52),rgba(255,255,255,0.3))] px-3 py-2.5 shadow-[0_10px_22px_rgba(15,23,42,0.07)] backdrop-blur-lg md:rounded-[1.15rem] md:px-4 md:py-3">
                            <p className="text-base font-black uppercase tracking-[0.02em] text-slate-950 md:text-lg">{product.name}</p>
                            <p className="mt-1 line-clamp-2 text-xs font-medium leading-5 text-slate-700 md:text-sm">{product.shortDescription}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section id="story" className="scroll-mt-28 py-8 md:py-10">
            <div className="container mx-auto px-4">
              <div className="section-card overflow-hidden">
                <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
                  <div className="relative overflow-hidden px-6 py-6 md:px-8 md:py-8">
                    <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(250,252,251,0.98)_0%,rgba(241,247,244,0.96)_36%,rgba(252,247,243,0.95)_100%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,142,126,0.24),transparent_34%),radial-gradient(circle_at_85%_18%,rgba(255,107,53,0.14),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.18),transparent_58%)]" />
                    <div className="relative h-full">
                      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#358055]">{t('homepage.proven_results')}</p>
                      <h2 className="mt-4 text-3xl font-black leading-tight text-slate-950 md:text-5xl">
                        {t('homepage.before_after_title')}
                      </h2>
                      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
                        {t('homepage.before_after_subtitle')}
                      </p>

                      <div className="mt-6 grid gap-3">
                        {[
                          {
                            title: t('homepage.visible_results'),
                            description: t('homepage.visible_results_desc'),
                          },
                          {
                            title: t('homepage.safe_all_skin'),
                            description: t('homepage.safe_all_skin_desc'),
                          },
                          {
                            title: t('homepage.no_side_effects'),
                            description: t('homepage.no_side_effects_desc'),
                          },
                        ].map((item) => (
                          <div
                            key={item.title}
                            className="rounded-2xl border border-white/70 bg-white/82 px-4 py-4 shadow-[0_10px_24px_rgba(53,128,85,0.05)]"
                          >
                            <div className="flex items-start gap-3">
                              <div className="rounded-full bg-[#358055]/10 p-1.5">
                                <Check className="h-4 w-4 text-[#358055]" />
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900">{item.title}</p>
                                <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-6 md:px-8 md:py-8">
                    <div className="relative h-full overflow-hidden rounded-[1.8rem] bg-[linear-gradient(180deg,#f8fbf9,#ffffff)] p-4">
                      <Image
                        src={HOMEPAGE_IMAGES.beforeAfter.main}
                        alt={t('homepage.before_after_alt')}
                        width={900}
                        height={720}
                        className="h-full w-full rounded-[1.4rem] object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-8 md:py-10">
            <div className="container mx-auto px-4">
              <div className="mb-8 max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#358055]">{t('homepage.dermatologically_approved')}</p>
                <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950 md:text-5xl">
                  {t('homepage.features_title')}
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-slate-600">{t('homepage.features_subtitle')}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {featureCards.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div key={feature.title} className="section-card px-5 py-6">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-[#358055]/10 p-3">
                          <Icon className="h-6 w-6 text-[#358055]" />
                        </div>
                        <p className="text-lg font-black text-slate-950">{feature.title}</p>
                      </div>
                      <p className="mt-4 text-sm leading-6 text-slate-600">{feature.description}</p>
                      <p className="mt-4 text-sm font-semibold text-[#F3765D]">{feature.details}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="py-8 md:py-10">
            <div className="container mx-auto px-4">
              <div className="section-card-strong overflow-hidden px-5 py-6 md:px-8 md:py-8 lg:px-10 lg:py-9">
                <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
                  <div className="relative">
                    <div className="absolute -left-4 top-8 hidden h-24 w-24 rounded-full bg-[#F3765D]/15 blur-2xl md:block" />
                    <div className="absolute -right-4 bottom-8 hidden h-28 w-28 rounded-full bg-[#358055]/15 blur-2xl md:block" />
                    <div className="relative overflow-hidden rounded-[1.8rem] bg-[linear-gradient(180deg,#f8fbf9,#ffffff)] p-4">
                      <Image
                        src={HOMEPAGE_IMAGES.naturalScience.main}
                        alt={t('homepage.nature_science_alt')}
                        width={900}
                        height={900}
                        className="aspect-square w-full rounded-[1.4rem] object-cover"
                        sizes="(max-width: 1024px) 100vw, 45vw"
                      />
                    </div>
                  </div>

                  <div className="space-y-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#358055]">{t('homepage.dermatologically_approved')}</p>
                    <h2 className="text-3xl font-black leading-tight text-slate-950 md:text-5xl">
                      {t('homepage.natural_science_title')}
                    </h2>
                    <p className="text-lg leading-relaxed text-slate-600">{t('homepage.natural_science_subtitle')}</p>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="section-card px-4 py-4">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#358055]">
                          {t('homepage.fast_absorption')}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{t('homepage.fast_absorption_desc')}</p>
                      </div>
                      <div className="section-card px-4 py-4">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#358055]">
                          {t('homepage.safe_formula')}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{t('homepage.safe_formula_desc')}</p>
                      </div>
                    </div>

                    <div className="rounded-[1.6rem] bg-[#358055] px-5 py-5 text-white shadow-[0_20px_45px_rgba(53,128,85,0.22)]">
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-white/15 p-2">
                          <SupportIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-base font-black">{t('homepage.testimonials_cta')}</p>
                          <p className="mt-1 text-sm leading-6 text-white/80">{supportLabel}</p>
                          <a href={supportHref} className="mt-3 inline-flex items-center text-sm font-bold text-white">
                            {t('navigation.contact')}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="faq" className="scroll-mt-28 py-8 md:py-10">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <AdvancedFAQ countryCode={locale} className="section-card-strong p-4 md:p-8" />
              </div>
            </div>
          </section>
        </main>

        <Footer countryConfig={countryConfig} locale={locale} />
        <PixelTracker countryCode={countryConfig.code} />
        <CookieConsent isEU={countryConfig.isEU} />
      </div>
    </>
  );
}
