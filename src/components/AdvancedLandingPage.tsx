'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Product } from '@/config/products';
import { CountryConfig, getDefaultCourier, CourierInfo } from '@/config/countries';


import { CheckoutFormV2 } from '@/components/features/CheckoutFormV2';
import { CookieConsent } from '@/components/features/CookieConsent';
import { type Coupon, getBOGOCoupon } from '@/config/coupons';
import { BOGODiscoveryBanner } from '@/components/features/BOGODiscoveryBanner';
import { storeBOGOCookie, getBOGOCookie, wasBOGOBannerSeen, initializeBOGO } from '@/utils/bogo-cookies';

import { Footer } from '@/components/ui/footer';

import { CountrySwitcher } from '@/components/features/CountrySwitcher';
import { HeroSection } from '@/components/product-page/HeroSection';
import { ProofSection } from '@/components/product-page/ProofSection';
import { BenefitsSection } from '@/components/product-page/BenefitsSection';
import { CtaDivider } from '@/components/product-page/CtaDivider';
import { IngredientsShowcase } from '@/components/product-page/IngredientsShowcase';
import { RegulatoryBadge } from '@/components/product-page/RegulatoryBadge';

import { PixelTracker } from '@/components/tracking/PixelTracker';
import { useMarketingTracking } from '@/hooks/useMarketingTracking';
import { MarketingDebug } from '@/components/features/MarketingDebug';
import { toast } from 'sonner';
import { 
  Phone,
  Mail,
  Zap
} from 'lucide-react';

interface AdvancedLandingPageProps {
  product: Product;
  countryConfig: CountryConfig;
  slug: string;
}

export function AdvancedLandingPage({ product, countryConfig }: AdvancedLandingPageProps) {
  const t = useTranslations();
  const locale = useLocale();

  // Initialize marketing tracking
  useMarketingTracking();

  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [bundleItems, setBundleItems] = useState<{[key: string]: number}>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDeliveryFormVisible, setIsDeliveryFormVisible] = useState(false);
  // Removed mounted state for immediate rendering
  const [selectedCourier, setSelectedCourier] = useState<CourierInfo>(getDefaultCourier(countryConfig));
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
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [buttonHasAppeared, setButtonHasAppeared] = useState(false);
  
  // BOGO state
  const [isBogoActive, setIsBogoActive] = useState(false);
  const [, setBogoCoupon] = useState<Coupon | null>(null);
  const [bogoQuantity, setBogoQuantity] = useState(1);
  const [showBOGOBanner, setShowBOGOBanner] = useState(false);
  
  // Get the base (single unit) variant for BOGO calculations
  // This is the variant with quantity=1 or the first variant
  const baseVariant = product.variants.find(v => v.quantity === 1) || product.variants[0];
  // Use discount price (1990) for BOGO - the "regular" shown strikethrough price is inflated/fake
  const bogoUnitPrice = baseVariant.discountPrice || baseVariant.price;

  // Helper function to round prices to 2 decimal places (avoid floating-point errors)
  const roundPrice = (price: number): number => {
    return Math.round(price * 100) / 100;
  };

  const formatOfferPrice = (amount: number) => {
    const useDecimals = countryConfig.currency !== 'RSD';

    return new Intl.NumberFormat('sr-RS', {
      minimumFractionDigits: useDecimals ? 2 : 0,
      maximumFractionDigits: useDecimals ? 2 : 0,
    }).format(amount);
  };

  // Apply global overflow fix and prevent layout shifts
  useEffect(() => {
    // Only set maxWidth to prevent horizontal scroll, but keep overflow visible for sticky positioning
    document.body.style.maxWidth = '100vw';
    document.documentElement.style.maxWidth = '100vw';
    
    // Prevent any horizontal scroll during animations
    document.body.style.position = 'relative';
    
    // Removed mounted state for immediate rendering
    
    return () => {
      document.body.style.maxWidth = '';
      document.documentElement.style.maxWidth = '';
      document.body.style.position = '';
    };
  }, []);

  // Add preload links for critical images with high priority
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Preload main product image with highest priority
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'image';
      preloadLink.href = product.images.main;
      preloadLink.type = 'image/webp';
      preloadLink.fetchPriority = 'high';
      document.head.appendChild(preloadLink);

      // Preload logo with high priority
      const logoPreloadLink = document.createElement('link');
      logoPreloadLink.rel = 'preload';
      logoPreloadLink.as = 'image';
      logoPreloadLink.href = countryConfig.logo;
      logoPreloadLink.fetchPriority = 'high';
      document.head.appendChild(logoPreloadLink);

      // Preload first gallery image if available
      if (product.images.gallery && product.images.gallery.length > 0) {
        const galleryPreloadLink = document.createElement('link');
        galleryPreloadLink.rel = 'preload';
        galleryPreloadLink.as = 'image';
        galleryPreloadLink.href = product.images.gallery[0];
        galleryPreloadLink.type = 'image/webp';
        galleryPreloadLink.fetchPriority = 'high';
        document.head.appendChild(galleryPreloadLink);
      }

      return () => {
        // Clean up preload links
        if (preloadLink.parentNode) {
          preloadLink.parentNode.removeChild(preloadLink);
        }
        if (logoPreloadLink.parentNode) {
          logoPreloadLink.parentNode.removeChild(logoPreloadLink);
        }
      };
    }
  }, [product.images.main, product.images.gallery, countryConfig.logo]);

  // Check for BOGO coupon from URL or cookie on mount and show banner
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Initialize BOGO system - clears stale cookies if expired or config changed
    const { isActive: bogoIsActive } = initializeBOGO();
    
    if (!bogoIsActive) return;
    
    const searchParams = new URLSearchParams(window.location.search);
    const urlCoupon = searchParams.get('coupon');
    const urlMedium = searchParams.get('medium');
    
    // Check if BOGO coupon is in URL
    if (urlCoupon && urlCoupon.toUpperCase() === '1PLUS1' && !urlMedium) {
      // Store in cookie
      storeBOGOCookie(urlCoupon, 'url');
      
      // Show banner if not seen before
      if (!wasBOGOBannerSeen()) {
        setShowBOGOBanner(true);
      }
    }
    // Check for stored BOGO cookie (returning visitor)
    else if (!urlMedium) {
      const storedBOGO = getBOGOCookie();
      if (storedBOGO && storedBOGO.couponCode === '1PLUS1') {
        // Auto-activate BOGO for returning visitors (no banner needed)
        const bogoCouponData = getBOGOCoupon('1PLUS1');
        if (bogoCouponData) {
          setIsBogoActive(true);
          setBogoCoupon(bogoCouponData);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  // Animate the header from a flush, transparent bar into a detached glass pill.
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
      const isMobileViewport = window.innerWidth < 768;
      const easedHeaderProgress = 1 - Math.pow(1 - progress, 2.35);
      const squeezeProgress = Math.min(easedHeaderProgress / 0.52, 1);
      const bubbleProgress = Math.min(Math.max((easedHeaderProgress - 0.26) / 0.74, 0), 1);
      const shadowProgress = Math.min(Math.max((bubbleProgress - 0.72) / 0.28, 0), 1);
      const tearProgress = Math.min(Math.max((easedHeaderProgress - 0.06) / 0.34, 0), 1) * (1 - bubbleProgress * 0.72);
      const seamDepth = 8 + squeezeProgress * 22;
      const membranePathValue = `M 0 0 L 100 0 L 100 6 C 90 6 79 ${Math.round(8 + seamDepth * 0.16)} 67 ${Math.round(10 + seamDepth * 0.34)} C 58 ${Math.round(12 + seamDepth * 0.48)} 42 ${Math.round(12 + seamDepth * 0.48)} 33 ${Math.round(10 + seamDepth * 0.34)} C 21 ${Math.round(8 + seamDepth * 0.16)} 10 6 0 6 Z`;
      const seamPathValue = `M 0 6 C 10 6 21 ${Math.round(8 + seamDepth * 0.16)} 33 ${Math.round(10 + seamDepth * 0.34)} C 42 ${Math.round(12 + seamDepth * 0.48)} 58 ${Math.round(12 + seamDepth * 0.48)} 67 ${Math.round(10 + seamDepth * 0.34)} C 79 ${Math.round(8 + seamDepth * 0.16)} 90 6 100 6`;

      const horizontalFrameInset = isMobileViewport ? 4 : 14;
      frame.style.paddingTop = `${Math.round(bubbleProgress * 9)}px`;
      frame.style.paddingLeft = `${Math.round(bubbleProgress * horizontalFrameInset)}px`;
      frame.style.paddingRight = `${Math.round(bubbleProgress * horizontalFrameInset)}px`;

      seam.style.height = `${Math.round(20 + seamDepth * 0.82)}px`;
      seam.style.opacity = `${tearProgress * 0.22}`;

      membranePath.setAttribute('d', membranePathValue);
      membranePath.setAttribute('fill', `rgba(255,255,255,${0.015 + tearProgress * 0.035})`);
      seamBasePath.setAttribute('d', seamPathValue);
      seamGlowPath.setAttribute('d', seamPathValue);

      shadow.style.opacity = `${shadowProgress * 0.28}`;
      shadow.style.transform = `translate3d(-50%, ${2 + bubbleProgress * 4}px, 0) scaleX(${0.985 - bubbleProgress * 0.11})`;

      const shellInset = isMobileViewport ? 16 : 28;
      shell.style.width = `calc(100% - ${Math.round(squeezeProgress * 8 + bubbleProgress * shellInset)}px)`;
      shell.style.maxWidth = `${Math.round(2200 - bubbleProgress * (isMobileViewport ? 760 : 920))}px`;

      surface.style.borderRadius = `${Math.round(easedHeaderProgress * 26)}px`;
      surface.style.background = `linear-gradient(135deg, rgba(255, 255, 255, ${easedHeaderProgress * 0.76}), rgba(255, 255, 255, ${easedHeaderProgress * 0.3}))`;
      surface.style.backdropFilter = `blur(${Math.round(easedHeaderProgress * 24)}px) saturate(${Math.round(100 + easedHeaderProgress * 95)}%)`;
      surface.style.setProperty('-webkit-backdrop-filter', `blur(${Math.round(easedHeaderProgress * 24)}px) saturate(${Math.round(100 + easedHeaderProgress * 95)}%)`);
      surface.style.border = `1px solid rgba(255, 255, 255, ${easedHeaderProgress * 0.6})`;
      surface.style.boxShadow = `inset 0 1px 0 rgba(255, 255, 255, ${easedHeaderProgress * 0.84}), inset 0 -1px 0 rgba(255, 255, 255, ${easedHeaderProgress * 0.2})`;
      surface.style.transform = `translate3d(0, ${easedHeaderProgress * 7}px, 0) scale(${1 - easedHeaderProgress * 0.02})`;

      highlight.style.opacity = `${easedHeaderProgress * 0.84}`;
      highlight.style.background = `linear-gradient(180deg, rgba(255,255,255,${easedHeaderProgress * 0.32}) 0%, rgba(255,255,255,0) 52%), radial-gradient(120% 100% at 0% 0%, rgba(255,255,255,${easedHeaderProgress * 0.24}) 0%, rgba(255,255,255,0) 58%)`;
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

    const syncHeaderToScrollPosition = () => {
      const targetProgress = Math.min(window.scrollY / 170, 1);

      if (headerAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(headerAnimationFrameRef.current);
        headerAnimationFrameRef.current = null;
      }

      headerProgressRef.current = targetProgress;
      applyHeaderProgress(targetProgress);
    };

    const handleScroll = () => {
      if (headerAnimationFrameRef.current === null) {
        headerAnimationFrameRef.current = window.requestAnimationFrame(animateHeader);
      }
    };

    const handleViewportSync = () => {
      syncHeaderToScrollPosition();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleViewportSync);
    window.addEventListener('pageshow', handleViewportSync);
    applyHeaderProgress(0);

    let prewarmFrameOne = 0;
    let prewarmFrameTwo = 0;
    let prewarmFrameThree = 0;
    let syncFrameOne = 0;
    let syncFrameTwo = 0;
    const syncTimeouts: number[] = [];

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

    syncHeaderToScrollPosition();
    syncFrameOne = window.requestAnimationFrame(() => {
      syncHeaderToScrollPosition();
      syncFrameTwo = window.requestAnimationFrame(() => {
        syncHeaderToScrollPosition();
      });
    });
    syncTimeouts.push(
      window.setTimeout(syncHeaderToScrollPosition, 0),
      window.setTimeout(syncHeaderToScrollPosition, 140),
      window.setTimeout(syncHeaderToScrollPosition, 320)
    );

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleViewportSync);
      window.removeEventListener('pageshow', handleViewportSync);
      if (headerAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(headerAnimationFrameRef.current);
      }
      window.cancelAnimationFrame(prewarmFrameOne);
      window.cancelAnimationFrame(prewarmFrameTwo);
      window.cancelAnimationFrame(prewarmFrameThree);
      window.cancelAnimationFrame(syncFrameOne);
      window.cancelAnimationFrame(syncFrameTwo);
      syncTimeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, []);

  // Show floating button after 20 seconds or 1/3 page scroll
  useEffect(() => {
    let hasTriggered = false;
    
    // Set timeout for 20 seconds
    const timeoutId = setTimeout(() => {
      if (!hasTriggered) {
        setShowFloatingButton(true);
        hasTriggered = true;
        // Set buttonHasAppeared after animation completes
        setTimeout(() => setButtonHasAppeared(true), 600);
      }
    }, 20000);

    // Handle scroll to check if user scrolled 1/3 of page
    const handleScroll = () => {
      if (hasTriggered) return;
      
      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrollTop / documentHeight) * 100;
      
      // Show button if scrolled past 33% (1/3) of page
      if (scrollPercentage >= 33) {
        setShowFloatingButton(true);
        hasTriggered = true;
        clearTimeout(timeoutId);
        // Set buttonHasAppeared after animation completes
        setTimeout(() => setButtonHasAppeared(true), 600);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // CTA Button text - configurable variable
  const ctaButtonText = t('common.order_now');

  // Smooth scroll to the beginning of the order block
  const scrollToCheckout = () => {
    const orderSection = document.getElementById('order');
    if (orderSection) {
      const elementTop = orderSection.getBoundingClientRect().top;
      const offsetPosition = elementTop + window.pageYOffset - 24;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleOrderSubmit = async (orderData: Record<string, unknown>) => {
    console.log('Order submitted:', orderData);
    console.log('Bundle items:', bundleItems);
    if (orderData.coupon) {
      console.log('🎟️ Coupon data from CheckoutForm:', orderData.coupon);
    }
    
    // Prepare order data for API
    // Determine variant and quantity based on BOGO mode
    const currentVariant = isBogoActive ? baseVariant : selectedVariant;
    const totalQuantity = isBogoActive ? bogoQuantity * 2 : (selectedVariant.quantity || 1); // BOGO: paid + free
    const paidQuantity = isBogoActive ? bogoQuantity : totalQuantity;
    
    const apiOrderData = {
      customerName: `${orderData.firstName} ${orderData.lastName}`,
      customerEmail: orderData.email as string,
      customerPhone: orderData.phone as string,
      customerAddress: orderData.address as string,
      customerCity: orderData.city as string,
      customerPostalCode: orderData.postalCode as string,
      productName: product.name,
      productVariant: isBogoActive 
        ? `BOGO ${bogoQuantity}+${bogoQuantity} (${baseVariant.name})`
        : selectedVariant.name,
      productSku: currentVariant.sku,
      quantity: totalQuantity,
      paidQuantity: paidQuantity,
      freeQuantity: isBogoActive ? bogoQuantity : 0,
      totalPrice: roundPrice(orderData.orderTotal as number),
      subtotal: roundPrice(orderData.subtotal as number),
      shippingCost: roundPrice(orderData.shippingCost as number),
      currency: countryConfig.currencySymbol,
      courierName: selectedCourier.name,
      deliveryTime: selectedCourier.deliveryTime,
      paymentMethod: orderData.paymentMethod as string,
      bundleItems: isBogoActive ? {} : bundleItems,
      locale: countryConfig.code,
      fbp: orderData.fbp as string | undefined,
      fbc: orderData.fbc as string | undefined,
      eventId: orderData.eventId as string | undefined,
      marketingParams: orderData.marketingParams,
      coupon: orderData.coupon,
      // BOGO-specific data
      isBOGO: isBogoActive,
      bogoDetails: isBogoActive ? {
        unitPrice: bogoUnitPrice,
        paidQuantity: bogoQuantity,
        freeQuantity: bogoQuantity,
        totalQuantity: bogoQuantity * 2
      } : undefined
    };

    try {
      console.log('🚀 Submitting order to API...');
      
      // Submit order to API and WAIT for response
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiOrderData),
      });

      const result = await response.json();
      console.log('📥 Order API response:', result);

      if (!response.ok || !result.success) {
        // Show error to user - don't redirect
        console.error('❌ Order submission failed:', result);
        toast.error(`${t('validation.order_submission_failed') || 'Order submission failed'}: ${result.error || 'Unknown error'}`);
        throw new Error(result.error || 'Order submission failed');
      }

      console.log('✅ Order submitted successfully, webhook status:', result.webhookStatus);

      // Store order data in session storage with the real order ID
      const orderForThankYou = {
        ...apiOrderData,
        orderId: result.orderId
      };
      
      sessionStorage.setItem('completedOrder', JSON.stringify(orderForThankYou));
      
      // Return success result
      return { success: true, orderId: result.orderId };
      
    } catch (error) {
      console.error('❌ Order submission error:', error);
      toast.error(t('validation.order_submission_failed') || 'Order submission failed. Please try again.');
      throw error; // Re-throw to let CheckoutForm handle the loading state
    }
  };

  const handleAddToBundle = (productId: string, price: number) => {
    setBundleItems(prev => {
      const newItems = { ...prev };
      if (newItems[productId]) {
        delete newItems[productId];
      } else {
        newItems[productId] = roundPrice(price);
      }
      return newItems;
    });
  };
  
  // Handle BOGO coupon activation/deactivation
  const handleBOGOChange = (isActive: boolean, coupon: Coupon | null) => {
    setIsBogoActive(isActive);
    setBogoCoupon(coupon);
    
    if (isActive) {
      // When BOGO is activated, reset to quantity 1 and clear bundle items
      setBogoQuantity(1);
      setBundleItems({});
      // Set the selected variant to the base variant for proper display
      setSelectedVariant(baseVariant);
    } else {
      // When BOGO is deactivated, reset to default variant
      setSelectedVariant(product.variants[0]);
    }
  };
  
  // Handle BOGO banner acceptance
  const handleBOGOBannerAccept = () => {
    setShowBOGOBanner(false);
    
    // Activate BOGO
    const bogoCouponData = getBOGOCoupon('1PLUS1');
    if (bogoCouponData) {
      handleBOGOChange(true, bogoCouponData);
      
      // Scroll to the order section
      setTimeout(() => {
        scrollToCheckout();
      }, 300);
    }
  };

  // Handle BOGO banner close
  const handleBOGOBannerClose = () => {
    setShowBOGOBanner(false);
  };

  // Handle BOGO discovered via manual entry in coupon field
  const handleBOGODiscovered = (coupon: Coupon) => {
    setBogoCoupon(coupon);
    setShowBOGOBanner(true);
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
  // Remove loading state for immediate page render - better LCP

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#f6f8f6_0%,#ffffff_30%,#f8fbf9_65%,#ffffff_100%)]" style={{ maxWidth: '100vw' }}>
      <PixelTracker countryCode={countryConfig.code} />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-[#358055]/8 blur-3xl" />
        <div className="absolute top-[24rem] -left-20 h-80 w-80 rounded-full bg-[#F3765D]/8 blur-3xl" />
      </div>

      <header className="absolute inset-x-0 top-0 z-[140] md:fixed">
          <div ref={headerFrameRef} className="relative" style={{ paddingTop: 0, paddingLeft: 0, paddingRight: 0, paddingBottom: '8px' }}>
          <div ref={headerSeamRef} className="pointer-events-none absolute inset-x-0 top-full overflow-hidden" style={{ height: '32px', opacity: 0, willChange: 'height, opacity, transform', contain: 'paint' }}>
            <svg className="h-full w-full" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="advanced-header-seam" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                  <stop offset="18%" stopColor="rgba(255,255,255,0.18)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.32)" />
                  <stop offset="82%" stopColor="rgba(255,255,255,0.18)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
              </defs>
              <path ref={headerMembranePathRef} d="M 0 0 L 100 0 L 100 6 C 90 6 79 9 67 13 C 58 16 42 16 33 13 C 21 9 10 6 0 6 Z" fill="rgba(255,255,255,0.015)" />
              <path ref={headerSeamBasePathRef} d="M 0 6 C 10 6 21 9 33 13 C 42 16 58 16 67 13 C 79 9 90 6 100 6" stroke="rgba(53,128,85,0.025)" strokeWidth="2.2" fill="none" />
              <path ref={headerSeamGlowPathRef} d="M 0 6 C 10 6 21 9 33 13 C 42 16 58 16 67 13 C 79 9 90 6 100 6" stroke="url(#advanced-header-seam)" strokeWidth="0.85" fill="none" />
            </svg>
          </div>
          <div ref={headerShadowRef} className="pointer-events-none absolute left-1/2 top-full h-10 w-[74%] -translate-x-1/2 rounded-full bg-[#1a362a]/14 blur-3xl" style={{ opacity: 0, transform: 'translate3d(-50%, 4px, 0) scaleX(0.92)', willChange: 'transform, opacity', contain: 'paint' }} />
          <div
            ref={headerShellRef}
            className="mx-auto w-full"
            style={{ width: 'calc(100% - 0px)', maxWidth: '2200px', willChange: 'width, max-width, transform', contain: 'layout style' }}
          >
            <div
              ref={headerSurfaceRef}
              className="relative overflow-hidden flex items-center justify-between gap-3 px-4 py-3 md:px-6"
              style={{ borderRadius: 0, background: 'linear-gradient(135deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0))', border: '1px solid rgba(255,255,255,0)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0), inset 0 -1px 0 rgba(255,255,255,0)', transform: 'translate3d(0, 0, 0) scale(1)', willChange: 'transform, border-radius, backdrop-filter, box-shadow, background, border' }}
            >
            <div ref={headerHighlightRef} className="pointer-events-none absolute inset-0" style={{ opacity: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 52%), radial-gradient(120% 100% at 0% 0%, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 58%)', transform: 'translate3d(0, -10px, 0) scale(1)', willChange: 'transform, opacity' }} />
            <div className="flex items-center gap-3 md:gap-5">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/55 bg-white/92 text-slate-700 backdrop-blur-md md:hidden"
                aria-label={t('ui.toggle_menu')}
              >
                {mobileMenuOpen ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>

              <Link href="/" className="inline-flex items-center">
                <Image
                  src={countryConfig.logo}
                  alt={t('ui.alt_logo')}
                  width={150}
                  height={40}
                  className="h-8 w-auto md:h-10"
                  priority
                  loading="eager"
                  fetchPriority="high"
                  quality={95}
                  sizes="150px"
                />
              </Link>
            </div>

            <nav className="hidden items-center gap-5 text-sm font-semibold text-slate-700 md:flex">
              <a href="#benefits" className="transition-colors hover:text-[#F3765D]">{t('navigation.benefits')}</a>
              <a href="#order" className="transition-colors hover:text-[#F3765D]">{t('navigation.order')}</a>
              <a href="#testimonials" className="transition-colors hover:text-[#F3765D]">{t('navigation.testimonials')}</a>
            </nav>

            <div className="flex items-center gap-2 md:gap-3">
              <CountrySwitcher variant="ghost" />
              {countryConfig.company.phone ? (
                <a
                  href={`tel:${countryConfig.company.phone}`}
                  className="liquid-glass-soft hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 md:inline-flex"
                >
                  <Phone className="h-4 w-4 text-[#F3765D]" />
                  {countryConfig.company.phone}
                </a>
              ) : (
                <a
                  href={`mailto:${countryConfig.company.email}`}
                  className="liquid-glass-soft hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 md:inline-flex"
                >
                  <Mail className="h-4 w-4 text-[#F3765D]" />
                  {countryConfig.company.email}
                </a>
              )}
              <button
                type="button"
                onClick={scrollToCheckout}
                className="inline-flex items-center justify-center rounded-full bg-[#F3765D] px-4 py-2 text-sm font-extrabold text-white shadow-lg transition-colors hover:bg-[#e0654d]"
              >
                {t('navigation.order')}
              </button>
            </div>
            </div>

          </div>
        </div>
        {mobileMenuOpen && (
          <>
            <div className="fixed inset-0 z-[180] bg-[rgba(15,23,42,0.18)] backdrop-blur-[2px] md:hidden" onClick={() => setMobileMenuOpen(false)} />
            <div className="fixed inset-x-3 top-[4.7rem] bottom-3 z-[190] overflow-hidden rounded-[2rem] border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,248,246,0.94))] shadow-[0_24px_70px_rgba(15,23,42,0.18)] backdrop-blur-xl md:hidden">
              <div className="flex h-full flex-col p-4">
                <nav className="flex flex-1 flex-col gap-2 text-base font-semibold text-slate-800">
                  <Link href="/" onClick={() => setMobileMenuOpen(false)} className="rounded-[1.2rem] border border-transparent bg-white/66 px-4 py-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] transition-colors hover:border-[#358055]/12 hover:bg-[#358055]/6">
                    {t('navigation.home')}
                  </Link>
                  <a href="#benefits" onClick={() => setMobileMenuOpen(false)} className="rounded-[1.2rem] border border-transparent bg-white/66 px-4 py-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] transition-colors hover:border-[#358055]/12 hover:bg-[#358055]/6">
                    {t('navigation.benefits')}
                  </a>
                  <a href="#order" onClick={() => setMobileMenuOpen(false)} className="rounded-[1.2rem] border border-transparent bg-white/66 px-4 py-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] transition-colors hover:border-[#358055]/12 hover:bg-[#358055]/6">
                    {t('navigation.order')}
                  </a>
                  <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="rounded-[1.2rem] border border-transparent bg-white/66 px-4 py-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] transition-colors hover:border-[#358055]/12 hover:bg-[#358055]/6">
                    {t('navigation.testimonials')}
                  </a>
                </nav>
                <div className="mt-4 rounded-[1.4rem] border border-[#358055]/10 bg-[linear-gradient(135deg,rgba(53,128,85,0.08),rgba(243,118,93,0.08))] p-4">
                  <p className="text-sm font-semibold text-slate-800">{countryConfig.company.phone || countryConfig.company.email}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{t('common.order_now')}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </header>

      <HeroSection product={product} countryConfig={countryConfig} onOrderClick={scrollToCheckout} ctaText={ctaButtonText} />

      <ProofSection product={product} />

      <IngredientsShowcase product={product} />

      {/* Checkout */}
      <section className="py-8 md:py-10">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
              <div id="order" className="space-y-4">
                <div className="overflow-visible rounded-[2rem] border border-[#358055]/15 bg-white/90 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)] md:p-5">
                  <div className="mb-4 overflow-visible px-1 pt-1">
                    <div className="mt-4">
                      <RegulatoryBadge product={product} locale={locale} />
                    </div>

                    <div className="mt-5 text-center">
                      <p className="inline-block border-b-[3px] border-[#358055] px-1 text-[2.05rem] font-black leading-none text-slate-950 md:text-[2.6rem]">
                        {t('checkout_v2.priceTitle')}
                      </p>
                      <div className="mt-1.5 inline-block bg-[#358055] px-4 py-2 shadow-[0_10px_24px_rgba(53,128,85,0.25)]">
                        <p className="text-[3.1rem] font-black leading-none tracking-tight text-white [text-shadow:0_2px_0_rgba(0,0,0,0.18)] md:text-[4.1rem]">
                          {formatOfferPrice((isBogoActive ? baseVariant : selectedVariant).discountPrice ?? (isBogoActive ? baseVariant : selectedVariant).price)} {countryConfig.currencySymbol}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div id="delivery-form" className="mt-4">
                    <CheckoutFormV2
                      selectedVariant={isBogoActive ? baseVariant : selectedVariant}
                      countryConfig={countryConfig}
                      productName={product.name}
                      bundleItems={isBogoActive ? {} : bundleItems}
                      onOrderSubmit={handleOrderSubmit}
                      mainProductId={product.id}
                      onAddToBundle={handleAddToBundle}
                      selectedCourier={selectedCourier}
                      onCourierChange={setSelectedCourier}
                      onBOGOChange={handleBOGOChange}
                      onBOGODiscovered={handleBOGODiscovered}
                      bogoQuantity={bogoQuantity}
                      bogoUnitPrice={bogoUnitPrice}
                    />
                  </div>
                </div>
              </div>
          </div>
        </div>
      </section>

      <BenefitsSection product={product} />

      <CtaDivider
        title="Porucite dok traje akcijska ponuda"
        subtitle="Iskoristite snizenu cenu i porucite odmah pre nego sto se aktuelna ponuda zavrsi."
        buttonLabel="Poruci po snizenoj ceni"
        onClick={scrollToCheckout}
      />

      <Footer countryConfig={countryConfig} locale={locale} />

      {/* Purchase Notifications - Removed */}
      {/* <PurchaseNotifications /> */}

      {/* GDPR Cookie Consent for EU */}
      <CookieConsent isEU={countryConfig.isEU} />

      {/* Floating Mobile CTA - Show after 20s or 1/3 scroll, hide when delivery form is visible */}
      {showFloatingButton && (
        <div 
          className={`fixed bottom-0 left-0 right-0 z-50 md:hidden ${
            buttonHasAppeared && isDeliveryFormVisible 
              ? 'translate-y-full opacity-0 pointer-events-none transition-all duration-400' 
              : buttonHasAppeared 
                ? 'translate-y-0 opacity-100 transition-all duration-400'
                : 'animate-slide-up-fade'
          }`}
        >
          <div className="relative overflow-hidden bg-gradient-to-r from-[#F3765D] to-[#e0654d]">
            {/* Countdown progress bar - continues running even when hidden */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-orange-200">
              <div className="countdown-bar h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500"></div>
            </div>
            <button 
              onClick={scrollToCheckout}
              className="w-full flex items-center justify-center gap-2 py-4 text-white font-semibold text-base hover:opacity-90 transition-opacity"
            >
              <Zap className="w-5 h-5 animate-periodic-shake" />
              <span>{t('cta.mobile_floating') || "Narucite sada!"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Marketing Debug Component (development only) */}
      <MarketingDebug isDevelopment={process.env.NODE_ENV === 'development'} />

      {/* BOGO Discovery Banner */}
      <BOGODiscoveryBanner
        isVisible={showBOGOBanner}
        onClose={handleBOGOBannerClose}
        onAccept={handleBOGOBannerAccept}
      />
    </div>
  );
}
