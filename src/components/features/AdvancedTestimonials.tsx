'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTestimonialsForCountry, Testimonial } from '@/config/testimonials';
import { Star, Package, Heart, Share } from 'lucide-react';

interface AdvancedTestimonialsProps {
  countryCode: string;
  className?: string;
}

// Business metrics - easy to update
const BUSINESS_METRICS = {
  SATISFIED_CUSTOMERS: 20000,
  AVERAGE_RATING: 4.8,
  RECOMMENDATION_RATE: 98
};

export function AdvancedTestimonials({ countryCode, className }: AdvancedTestimonialsProps) {
  const t = useTranslations();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const testimonials = getTestimonialsForCountry(countryCode);
  
  // Create infinite loop by duplicating testimonials
  const infiniteTestimonials = [...testimonials, ...testimonials, ...testimonials];
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSwipeIndicator, setShowSwipeIndicator] = useState(true);
  const [likedTestimonials, setLikedTestimonials] = useState<Set<string>>(new Set());
  const [cardScales, setCardScales] = useState<Record<string, number>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>(() => {
    const initialCounts: Record<string, number> = {};
    testimonials.forEach(testimonial => {
      // Generate consistent like count based on testimonial content
      let hash = 0;
      const str = testimonial.id + testimonial.name + testimonial.text;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash + str.charCodeAt(i)) & 0xffffffff;
      }
      // Convert hash to a number between 15-45
      initialCounts[testimonial.id] = Math.abs(hash % 31) + 15;
    });
    return initialCounts;
  });



  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return t('testimonials_ui.today');
    if (diffInDays === 1) return t('testimonials_ui.yesterday');
    if (diffInDays < 7) return `${diffInDays} ${t('testimonials_ui.days_ago')}`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} ${t('testimonials_ui.weeks_ago')}`;
    return `${Math.floor(diffInDays / 30)} ${t('testimonials_ui.months_ago')}`;
  };

  // Calculate responsive scale effect based on scroll position
  const updateCardScales = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    const cards = container.querySelectorAll('[data-testimonial-id]');
    
    const newScales: Record<string, number> = {};
    const visibleCards: Array<{ element: HTMLElement; rect: DOMRect; center: number }> = [];
    
    // First, collect only visible cards
    cards.forEach((card) => {
      const cardElement = card as HTMLElement;
      const cardRect = cardElement.getBoundingClientRect();
      
      // Check if card is visible in the container viewport
      const isVisible = cardRect.right > containerRect.left && 
                       cardRect.left < containerRect.right;
      
      if (isVisible) {
        const cardCenter = cardRect.left + cardRect.width / 2;
        visibleCards.push({
          element: cardElement,
          rect: cardRect,
          center: cardCenter
        });
      }
    });
    
    // Calculate scales based only on visible cards
    visibleCards.forEach(({ element, center }) => {
      const testimonialId = element.dataset.testimonialId;
      if (!testimonialId) return;
      
      const distanceFromCenter = Math.abs(center - containerCenter);
      
      if (isMobile) {
        // Mobile: Gentler centering to prevent content cutoff
        const threshold = 80; // More lenient threshold for mobile
        const scale = distanceFromCenter <= threshold ? 1.0 : 0.95;
        newScales[testimonialId] = scale;
      } else {
        // Desktop: Original 3D effect
        const maxDistance = containerRect.width / 2 + 160;
        const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1);
        const scale = 1.0 - (normalizedDistance * 0.3);
        const clampedScale = Math.max(0.7, Math.min(1.0, scale));
        newScales[testimonialId] = clampedScale;
      }
    });
    
    setCardScales(newScales);
  }, [isMobile]);

  const toggleLike = (testimonialId: string) => {
    const isCurrentlyLiked = likedTestimonials.has(testimonialId);
    
    setLikedTestimonials(prev => {
      const newLiked = new Set(prev);
      if (isCurrentlyLiked) {
        newLiked.delete(testimonialId);
      } else {
        newLiked.add(testimonialId);
      }
      return newLiked;
    });

    setLikeCounts(prevCounts => ({
      ...prevCounts,
      [testimonialId]: isCurrentlyLiked 
        ? prevCounts[testimonialId] - 1 
        : prevCounts[testimonialId] + 1
    }));
  };

  // Handle responsive design and prevent layout shifts
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Auto-hide swipe indicator after 5 seconds only on mobile
      if (mobile && showSwipeIndicator) {
        setTimeout(() => {
          setShowSwipeIndicator(false);
        }, 5000);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const timer = setTimeout(() => {
      setIsLoaded(true);
      updateCardScales();
    }, 50);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, [updateCardScales, showSwipeIndicator]);

  // Add scroll and resize listeners for 3D effect and infinite scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isTransitioning) return;
      
      // Hide swipe indicator on any scroll interaction
      if (isMobile && showSwipeIndicator) {
        setShowSwipeIndicator(false);
      }
      
      requestAnimationFrame(() => {
        updateCardScales();
        
        const containerWidth = container.scrollWidth;
        const scrollLeft = container.scrollLeft;
        const singleSetWidth = containerWidth / 3; // Since we have 3 sets of testimonials
        
        // Check if we need to reset position for infinite loop
        if (scrollLeft >= singleSetWidth * 2) {
          // We're at the end of the second set, jump to the middle set
          setIsTransitioning(true);
          container.scrollLeft = singleSetWidth;
          setIsTransitioning(false);
        } else if (scrollLeft <= 0) {
          // We're at the start, jump to the middle set
          setIsTransitioning(true);
          container.scrollLeft = singleSetWidth;
          setIsTransitioning(false);
        }
        
        // Infinite scroll is always enabled
      });
    };

    const handleResize = () => {
      requestAnimationFrame(updateCardScales);
    };

    // Add touch/swipe support for mobile
    let startX = 0;
    let startY = 0;
    let isScrolling = false;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isScrolling = false;
      
      // Hide swipe indicator on touch
      if (isMobile && showSwipeIndicator) {
        setShowSwipeIndicator(false);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isScrolling) {
        const deltaX = Math.abs(e.touches[0].clientX - startX);
        const deltaY = Math.abs(e.touches[0].clientY - startY);
        
        if (deltaX > deltaY && deltaX > 10) {
          isScrolling = true;
        }
      }
    };

         const handleTouchEnd = (e: TouchEvent) => {
       if (isScrolling) {
         const deltaX = e.changedTouches[0].clientX - startX;
         const threshold = 50;
         
         if (Math.abs(deltaX) > threshold) {
           // Hide swipe indicator on touch interaction
           if (isMobile && showSwipeIndicator) {
             setShowSwipeIndicator(false);
           }
         }
       }
     };

    container.addEventListener('scroll', handleScroll, { passive: true });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('resize', handleResize);

    // Initial calculation and position
    updateCardScales();
    
    // Start in the middle set for infinite scroll
    setTimeout(() => {
      if (container && container.scrollWidth > 0) {
        const singleSetWidth = container.scrollWidth / 3;
        container.scrollLeft = singleSetWidth;
      }
    }, 100);

         return () => {
       container.removeEventListener('scroll', handleScroll);
       container.removeEventListener('touchstart', handleTouchStart);
       container.removeEventListener('touchmove', handleTouchMove);
       container.removeEventListener('touchend', handleTouchEnd);
       window.removeEventListener('resize', handleResize);
     };
   }, [updateCardScales, isTransitioning, isMobile, showSwipeIndicator]);

  return (
    <section className={`py-16 bg-gradient-to-br from-gray-50 to-blue-50 w-full overflow-hidden ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {t('testimonials.section_title')}
          </h2>
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="flex text-yellow-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-6 w-6 fill-current" />
              ))}
            </div>
            <span className="text-lg font-medium">4.8/5</span>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('testimonials.social_media_subtitle')}
          </p>
        </div>
        {/* 3D Testimonials Container */}
        <div className="relative w-full testimonials-3d-container overflow-visible">
          
          {/* Mobile Swipe Indicator */}
          {isMobile && showSwipeIndicator && (
            <div className="absolute inset-0 z-30 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-brand-orange/90 to-brand-green/90 backdrop-blur-sm text-white px-6 py-3 rounded-2xl text-sm font-medium shadow-2xl border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="font-semibold">Swipe to browse testimonials</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Mobile-First Responsive Scrolling Container */}
          <div 
            ref={scrollContainerRef}
            className={`flex scrollbar-hide testimonials-scroll-container transition-all duration-300 ${isLoaded ? 'overflow-x-auto' : 'overflow-hidden'} 
              /* Mobile: Center one card with partial adjacent cards visible */
              ${isMobile 
                ? 'gap-4 px-[calc(50vw-140px)] scroll-smooth snap-x snap-mandatory py-4' 
                : 'gap-8 px-28 py-8'
              }
            `}
          >
            {infiniteTestimonials.map((testimonial: Testimonial, index: number) => {
              const scale = cardScales[testimonial.id] || 0.8;
              const zIndex = Math.round(scale * 10);
              
              return (
                <Card 
                  key={`${testimonial.id}-${index}`}
                  data-testimonial-id={testimonial.id}
                  className={`flex-shrink-0 bg-white testimonial-card-3d border-0 rounded-xl overflow-hidden transition-all duration-300
                    ${isMobile 
                      ? `w-[280px] snap-center ${scale > 0.98 ? 'shadow-2xl ring-2 ring-brand-orange/20' : 'shadow-md'}` 
                      : 'w-80 shadow-lg hover:shadow-2xl'
                    }
                  `}
                  style={{
                    // Responsive scaling and effects - prevent content cutoff
                    transform: !isMobile 
                      ? `scale(${scale}) translateZ(${(scale - 0.7) * 100}px)` 
                      : `scale(${scale === 1.0 ? 1.02 : 0.95})`,
                    zIndex: scale > 0.9 ? 10 : (isMobile ? 1 : zIndex),
                    minWidth: isMobile ? '280px' : '320px',
                    maxWidth: isMobile ? '280px' : '320px',
                    opacity: isMobile 
                      ? (scale > 0.98 ? 1 : 0.8) 
                      : (0.4 + (scale * 0.6)),
                    transformOrigin: 'center center'
                  }}
                >
                  <CardContent className="p-0 w-full overflow-hidden">
                    {/* Post Header */}
                    <div className="p-4 border-b border-gray-100 w-full">
                      <div className="flex items-center gap-3 w-full">
                        {/* Avatar */}
                        <div className="w-12 h-12 bg-gradient-to-br from-brand-green to-brand-orange rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {testimonial.name[0]}
                        </div>
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <div className="flex items-center gap-2 w-full">
                            <h3 className="font-semibold text-gray-900 truncate">{testimonial.name}</h3>
                            {testimonial.verified && (
                              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 border-blue-200 flex-shrink-0">
                                ✓ {t('testimonials_ui.verified')}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate">{testimonial.city} • {getTimeAgo(testimonial.dateAdded)}</p>
                        </div>
                      </div>
                    </div>
                    {/* Post Content */}
                    <div className="p-4 w-full overflow-hidden">
                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3 w-full">
                        <div className="flex text-yellow-400 flex-shrink-0">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={`h-4 w-4 ${star <= testimonial.rating ? 'fill-current' : ''}`} />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-600 flex-shrink-0">{testimonial.rating}/5</span>
                      </div>
                      {/* Review Text */}
                      <p className="text-gray-800 leading-relaxed mb-4 text-sm w-full overflow-hidden">
                        {testimonial.text}
                      </p>
                      {/* Product Tag */}
                      <div className="flex items-center gap-2 mb-4 w-full overflow-hidden">
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 flex-shrink-0">
                          <Package className="h-3 w-3 mr-1" />
                          <span className="truncate">{testimonial.productUsed}</span>
                        </Badge>
                      </div>
                      {/* Social Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 w-full">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => toggleLike(testimonial.id)}
                            className={`flex items-center gap-2 transition-colors flex-shrink-0 ${
                              likedTestimonials.has(testimonial.id) 
                                ? 'text-red-500' 
                                : 'text-gray-500 hover:text-red-500'
                            }`}
                          >
                            <Heart className={`h-4 w-4 ${
                              likedTestimonials.has(testimonial.id) ? 'fill-current' : ''
                            }`} />
                            <span className="text-sm">{likeCounts[testimonial.id] || 0}</span>
                          </button>
                          <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors flex-shrink-0">
                            <Share className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
                     {/* Dot Indicators - Positioned below testimonials */}
           <div className="flex justify-center items-center gap-2 mt-6 z-20">
             {testimonials.map((testimonial, index) => {
               // Calculate which testimonial is currently centered
               const isActive = cardScales[testimonial.id] === 1.0 || 
                               (isMobile && cardScales[testimonial.id] > 0.98);
               
               return (
                 <button
                   key={testimonial.id}
                   onClick={() => {
                     if (scrollContainerRef.current) {
                       const container = scrollContainerRef.current;
                       const cardWidth = isMobile ? 280 + 16 : 320 + 32; // card width + gap
                       const targetScroll = index * cardWidth;
                       
                       container.scrollTo({
                         left: targetScroll,
                         behavior: 'smooth'
                       });
                       
                       // Hide swipe indicator after user interaction
                       if (isMobile && showSwipeIndicator) {
                         setShowSwipeIndicator(false);
                       }
                     }
                   }}
                   className={`w-3 h-3 rounded-full transition-all duration-300 ${
                     isActive 
                       ? 'bg-brand-orange scale-110 shadow-lg' 
                       : 'bg-gray-300 hover:bg-gray-400'
                   }`}
                   aria-label={`Go to testimonial ${index + 1}`}
                 />
               );
             })}
           </div>
        </div>
        
        {/* Trust Indicators */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-orange-100">
            <div className="text-4xl font-bold text-brand-orange mb-2">
              {BUSINESS_METRICS.SATISFIED_CUSTOMERS.toLocaleString('sr')}+
            </div>
            <p className="text-gray-700 font-medium">{t('testimonials_ui.satisfied_customers')}</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-green-100">
            <div className="text-4xl font-bold text-brand-green mb-2">
              {BUSINESS_METRICS.AVERAGE_RATING}/5
            </div>
            <p className="text-gray-700 font-medium">{t('testimonials_ui.average_rating')}</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-blue-100">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {BUSINESS_METRICS.RECOMMENDATION_RATE}%
            </div>
            <p className="text-gray-700 font-medium">{t('testimonials_ui.recommends_friends')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
