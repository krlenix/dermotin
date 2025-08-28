'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getRandomTestimonialsForCountry, getRandomTestimonialsForProductById, Testimonial } from '@/config/testimonials';
import { Star, Package, Heart, Share } from 'lucide-react';

interface AdvancedTestimonialsProps {
  countryCode: string;
  className?: string;
  productId?: string; // Optional: if provided, show only testimonials for this product
}

// Business metrics - easy to update
const BUSINESS_METRICS = {
  SATISFIED_CUSTOMERS: 20000,
  AVERAGE_RATING: 4.97,
  RECOMMENDATION_RATE: 98
};

export function AdvancedTestimonials({ countryCode, className, productId }: AdvancedTestimonialsProps) {
  const t = useTranslations();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Load random testimonials for the country or specific product
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        let countryTestimonials: Testimonial[];
        
        if (productId) {
          // Load testimonials for specific product
          countryTestimonials = await getRandomTestimonialsForProductById(productId, countryCode);
        } else {
          // Load testimonials from all products
          countryTestimonials = await getRandomTestimonialsForCountry(countryCode);
        }
        
        setTestimonials(countryTestimonials);
      } catch (error) {
        console.error('Failed to load testimonials:', error);
        setTestimonials([]);
      }
    };
    
    loadTestimonials();
  }, [countryCode, productId]);
  
  // Create infinite loop by duplicating testimonials
  const infiniteTestimonials = [...testimonials, ...testimonials, ...testimonials];
  const [likedTestimonials, setLikedTestimonials] = useState<Set<string>>(new Set());
  const [cardScales, setCardScales] = useState<Record<string, number>>(() => {
    // Initialize with middle testimonial focused
    const initialScales: Record<string, number> = {};
    const middleIndex = Math.floor(testimonials.length / 2);
    testimonials.forEach((testimonial, index) => {
      initialScales[testimonial.id] = index === middleIndex ? 1.0 : 0.6;
    });
    return initialScales;
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});

  // Update like counts when testimonials are loaded
  useEffect(() => {
    const initialCounts: Record<string, number> = {};
    testimonials.forEach(testimonial => {
      // Use the likes from testimonial data, or generate a fallback if not available
      if (testimonial.likes !== undefined) {
        initialCounts[testimonial.id] = testimonial.likes;
      } else {
        // Fallback: Generate consistent like count based on testimonial content
        let hash = 0;
        const str = testimonial.id + testimonial.name + testimonial.text;
        for (let i = 0; i < str.length; i++) {
          hash = ((hash << 5) - hash + str.charCodeAt(i)) & 0xffffffff;
        }
        // Convert hash to a number between 15-45
        initialCounts[testimonial.id] = Math.abs(hash % 31) + 15;
      }
    });
    setLikeCounts(initialCounts);
  }, [testimonials]);



  const getTimeAgo = (dateString: string) => {
    if (typeof window === 'undefined') {
      // Server-side: return a static value to prevent hydration mismatch
      return t('testimonials_ui.recently');
    }
    
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
    let closestCard: { element: HTMLElement; distance: number; testimonialId: string } | null = null;
    
    // Find the card closest to center
    cards.forEach((card) => {
      const cardElement = card as HTMLElement;
      const cardRect = cardElement.getBoundingClientRect();
      const testimonialId = cardElement.dataset.testimonialId;
      
      if (!testimonialId) return;
      
      // Check if card is visible in the container viewport
      const isVisible = cardRect.right > containerRect.left && 
                       cardRect.left < containerRect.right;
      
      if (isVisible) {
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distanceFromCenter = Math.abs(cardCenter - containerCenter);
        
        if (!closestCard || distanceFromCenter < closestCard.distance) {
          closestCard = { element: cardElement, distance: distanceFromCenter, testimonialId: testimonialId as string };
        }
      }
    });
    
    // Set all cards to minimum scale first
    testimonials.forEach(testimonial => {
      newScales[testimonial.id] = 0.5;
    });
    
    // Only the closest card gets full scale, others get reduced scale
    if (closestCard) {
      newScales[(closestCard as { element: HTMLElement; distance: number; testimonialId: string }).testimonialId] = 1.0;
      
      // Calculate scales for other visible cards based on distance from the focused one
      cards.forEach((card) => {
        const cardElement = card as HTMLElement;
        const cardRect = cardElement.getBoundingClientRect();
        const testimonialId = cardElement.dataset.testimonialId;
        
        if (!testimonialId || !closestCard || testimonialId === closestCard.testimonialId) return;
        
        // Check if card is visible
        const isVisible = cardRect.right > containerRect.left && 
                         cardRect.left < containerRect.right;
        
        if (isVisible) {
          const cardCenter = cardRect.left + cardRect.width / 2;
          const distanceFromCenter = Math.abs(cardCenter - containerCenter);
          
          if (isMobile) {
            // Mobile: Binary scaling for cleaner look
            newScales[testimonialId] = 0.6;
          } else {
            // Desktop: Gradual scaling based on distance
            const maxDistance = containerRect.width / 2 + 200;
            const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1);
            const scale = 0.8 - (normalizedDistance * 0.3);
            newScales[testimonialId] = Math.max(0.5, Math.min(0.7, scale));
          }
        }
      });
    }
    
    setCardScales(newScales);
  }, [isMobile, testimonials]);

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
   }, [updateCardScales]);

  // Add scroll and resize listeners for 3D effect and infinite scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

         const handleScroll = () => {
       if (isTransitioning) return;
       
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
           // Touch interaction detected
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
     
     // Start in the middle set for infinite scroll with proper centering
     setTimeout(() => {
       if (container && container.scrollWidth > 0) {
         const singleSetWidth = container.scrollWidth / 3;
         const cardWidth = isMobile ? 280 + 16 : 320 + 32; // card width + gap
         const containerWidth = container.clientWidth;
         const middleIndex = Math.floor(testimonials.length / 2);
         
         // Calculate the exact center position for the middle testimonial
         const containerCenter = containerWidth / 2;
         const cardCenter = cardWidth / 2;
         
         // Position to center the middle testimonial of the middle set
         const targetScrollPosition = singleSetWidth + (middleIndex * cardWidth) + cardCenter - containerCenter;
         container.scrollLeft = Math.max(0, targetScrollPosition);
         
         // Trigger scale calculation after positioning
         setTimeout(() => {
           updateCardScales();
           // Ensure middle testimonial is marked as focused
           const middleTestimonialId = testimonials[middleIndex]?.id;
           if (middleTestimonialId) {
             setCardScales(prev => ({ ...prev, [middleTestimonialId]: 1.0 }));
           }
         }, 100);
       }
     }, 150);

         return () => {
       container.removeEventListener('scroll', handleScroll);
       container.removeEventListener('touchstart', handleTouchStart);
       container.removeEventListener('touchmove', handleTouchMove);
       container.removeEventListener('touchend', handleTouchEnd);
       window.removeEventListener('resize', handleResize);
     };
        }, [updateCardScales, isTransitioning, isMobile, testimonials]);

  // Show loading state or empty state
  if (testimonials.length === 0) {
    return (
      <section className={`py-16 bg-gradient-to-br from-gray-50 to-blue-50 w-full overflow-hidden ${className}`}>
        <div className="w-full">
          <div className="text-center mb-8 px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {t('testimonials.section_title')}
              </h2>
              <p className="text-gray-600">
                {t('testimonials.loading')}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 bg-gradient-to-br from-gray-50 to-blue-50 w-full overflow-hidden ${className}`}>
      <div className="w-full">
        {/* Header - Centered content */}
        <div className="text-center mb-8 px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {t('testimonials.section_title')}
            </h2>
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-6 w-6 fill-current" />
                ))}
              </div>
              <span className="text-lg font-medium">{BUSINESS_METRICS.AVERAGE_RATING}/5</span>
            </div>
            <p className="text-gray-600">
              {t('testimonials.social_media_subtitle')}
            </p>
          </div>
        </div>
        {/* 3D Testimonials Container */}
        <div className="relative w-full testimonials-3d-container overflow-visible">
          
          
          
                     {/* Mobile-First Responsive Scrolling Container */}
           <div 
             ref={scrollContainerRef}
             className={`scrollbar-hide testimonials-scroll-container transition-all duration-300 ${isLoaded ? 'overflow-x-auto' : 'overflow-hidden'} 
                             /* Mobile: Horizontal scroll with featured at top, others below */
              ${isMobile 
                ? 'flex gap-4 px-[calc(50vw-140px)] scroll-smooth snap-x snap-mandatory py-4' 
                : 'flex gap-8 px-[calc(50vw-160px)] py-8'
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
                   data-index={index}
                                     className={`transition-all duration-500 border-0 rounded-xl overflow-hidden
                    ${isMobile 
                      ? `w-[280px] snap-center ${scale === 1.0 ? 'shadow-2xl ring-4 ring-brand-orange/30 bg-white border-2 border-brand-orange/20' : 'shadow-sm bg-white/40 backdrop-blur-sm'}` 
                      : `flex-shrink-0 w-80 ${scale === 1.0 ? 'shadow-2xl ring-4 ring-brand-orange/30 bg-white border-2 border-brand-orange/20' : 'shadow-md bg-white/70'} hover:shadow-xl`
                    }
                  `}
                                        style={{
                       // Responsive scaling and effects
                       transform: !isMobile 
                         ? `scale(${scale}) translateZ(${(scale - 0.5) * 150}px)` 
                         : `scale(${scale === 1.0 ? 1.05 : 0.85})`,
                       zIndex: scale === 1.0 ? 20 : (scale > 0.8 ? 10 : (isMobile ? 1 : zIndex)),
                       minWidth: isMobile ? '280px' : '320px',
                       maxWidth: isMobile ? '280px' : '320px',
                       opacity: isMobile 
                         ? (scale === 1.0 ? 1 : 0.3) 
                         : (scale === 1.0 ? 1 : 0.2 + (scale * 0.5)),
                       transformOrigin: 'center center',
                       filter: scale < 1.0 ? 'blur(1px)' : 'none'
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
          
                     {/* Dot Indicators - All devices */}
           {(
                            <div className="flex justify-center items-center gap-2 mt-6 z-20">
                 {testimonials.map((testimonial, index) => {
                   // Calculate which testimonial is currently centered
                   const middleIndex = Math.floor(testimonials.length / 2);
                   const isActive = cardScales[testimonial.id] === 1.0 || (index === middleIndex && Object.keys(cardScales).length === 0);
                   
                   return (
                     <button
                       key={testimonial.id}
                       onClick={() => {
                         if (scrollContainerRef.current) {
                           const container = scrollContainerRef.current;
                           const cardWidth = isMobile ? 280 + 16 : 320 + 32; // card width + gap
                           const singleSetWidth = container.scrollWidth / 3;
                           const containerWidth = container.clientWidth;
                           
                           // Calculate the exact center position for the clicked testimonial
                           const containerCenter = containerWidth / 2;
                           const cardCenter = cardWidth / 2;
                           
                           // Position to center the clicked testimonial of the middle set
                           const targetScrollPosition = singleSetWidth + (index * cardWidth) + cardCenter - containerCenter;
                           
                           container.scrollTo({
                             left: Math.max(0, targetScrollPosition),
                             behavior: 'smooth'
                           });
                           
                           // Update scales immediately for better UX
                           setTimeout(() => updateCardScales(), 300);
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
             )}
        </div>
        
        {/* Trust Indicators */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto px-4">
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

