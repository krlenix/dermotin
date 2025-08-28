'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getRandomTestimonialsForCountry, getRandomTestimonialsForProductById, Testimonial } from '@/config/testimonials';

interface RotatingReviewProps {
  countryCode: string;
  className?: string;
  interval?: number; // in milliseconds
  productId?: string; // Optional: if provided, show only testimonials for this product
}

export function RotatingReview({ countryCode, className, interval = 5000, productId }: RotatingReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'next' | 'prev'>('next');
  const containerRef = useRef<HTMLDivElement>(null);
  const [countryTestimonials, setCountryTestimonials] = useState<Testimonial[]>([]);

  // Load random testimonials for the country or specific product
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        let testimonials: Testimonial[];
        
        if (productId) {
          // Load testimonials for specific product
          testimonials = await getRandomTestimonialsForProductById(productId, countryCode);
        } else {
          // Load testimonials from all products
          testimonials = await getRandomTestimonialsForCountry(countryCode);
        }
        
        setCountryTestimonials(testimonials);
      } catch (error) {
        console.error('Failed to load testimonials:', error);
        setCountryTestimonials([]);
      }
    };
    
    loadTestimonials();
  }, [countryCode, productId]);
  
  const changeReview = useCallback((newIndex: number, direction: 'next' | 'prev' = 'next') => {
    if (isTransitioning) return;
    
    setAnimationDirection(direction);
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50); // Small delay to ensure smooth transition
    }, 350); // Duration of exit animation
  }, [isTransitioning]);

  const goToNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % countryTestimonials.length;
    changeReview(nextIndex, 'next');
  }, [currentIndex, countryTestimonials.length, changeReview]);

  const goToPrev = useCallback(() => {
    const prevIndex = currentIndex === 0 ? countryTestimonials.length - 1 : currentIndex - 1;
    changeReview(prevIndex, 'prev');
  }, [currentIndex, countryTestimonials.length, changeReview]);
  
  // Auto-rotation effect
  useEffect(() => {
    if (countryTestimonials.length <= 1) return;

    const timer = setInterval(() => {
      goToNext();
    }, interval);

    return () => clearInterval(timer);
  }, [countryTestimonials.length, interval, currentIndex, goToNext]);

  // Touch/swipe support for mobile
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

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
          e.preventDefault(); // Prevent page scroll
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling && !isTransitioning) {
        const deltaX = e.changedTouches[0].clientX - startX;
        const threshold = 50;
        
        if (Math.abs(deltaX) > threshold) {
          if (deltaX > 0) {
            goToPrev();
          } else {
            goToNext();
          }
        }
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [goToNext, goToPrev, isTransitioning]);

  if (!countryTestimonials.length) return null;

  const currentReview = countryTestimonials[currentIndex];

  // Animation classes based on transition state and direction
  const getAnimationClasses = () => {
    if (!isTransitioning) {
      return 'opacity-100 translate-x-0 scale-100 rotate-0';
    }
    
    if (animationDirection === 'next') {
      return 'opacity-0 -translate-x-8 scale-95 -rotate-1';
    } else {
      return 'opacity-0 translate-x-8 scale-95 rotate-1';
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`bg-white/70 p-4 rounded-lg border border-gray-200 overflow-hidden cursor-pointer select-none touch-pan-y ${className}`}
      style={{ touchAction: 'pan-y' }}
    >
      <div 
        className={`transition-all duration-350 ease-in-out transform ${getAnimationClasses()}`}
        style={{
          filter: isTransitioning ? 'blur(2px)' : 'blur(0px)',
        }}
      >
        {/* Stars with staggered animation */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex text-yellow-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`h-4 w-4 transition-all duration-300 ${
                  star <= currentReview.rating ? 'fill-current scale-110' : 'scale-90'
                } ${isTransitioning ? 'animate-pulse' : ''}`}
                style={{
                  animationDelay: `${star * 50}ms`,
                  filter: star <= currentReview.rating ? 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.5))' : 'none'
                }}
              />
            ))}
          </div>
          {currentReview.verified && (
            <Badge 
              variant="secondary" 
              className={`text-xs transition-all duration-300 ${
                isTransitioning ? 'scale-90 opacity-70' : 'scale-100 opacity-100'
              }`}
            >
              ✓ Verifikovano
            </Badge>
          )}
        </div>
        
        {/* Review text with typing effect */}
        <p className={`text-sm text-gray-700 italic mb-2 transition-all duration-300 ${
          isTransitioning ? 'tracking-wider' : 'tracking-normal'
        }`}>
          &ldquo;{currentReview.text}&rdquo;
        </p>
        
        {/* User info with enhanced avatar */}
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 bg-gradient-to-br from-brand-green to-brand-orange rounded-full flex items-center justify-center text-white font-bold text-xs transition-all duration-300 ${
            isTransitioning 
              ? 'scale-90 shadow-none' 
              : 'scale-100 shadow-lg shadow-brand-orange/30'
          }`}>
            {currentReview.name[0]}
          </div>
          <div className={`transition-all duration-300 ${
            isTransitioning ? 'translate-x-1 opacity-80' : 'translate-x-0 opacity-100'
          }`}>
            <p className="text-xs font-semibold">{currentReview.name}</p>
            <p className="text-xs text-gray-500">{currentReview.city}</p>
          </div>
        </div>
      </div>

      {/* Enhanced indicator dots */}
      {countryTestimonials.length > 1 && (
        <div className="flex justify-center gap-1 mt-3">
          {countryTestimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                const direction = index > currentIndex ? 'next' : 'prev';
                changeReview(index, direction);
              }}
              disabled={isTransitioning}
              className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-125 disabled:cursor-not-allowed ${
                index === currentIndex 
                  ? 'bg-brand-orange scale-125 shadow-lg shadow-brand-orange/50' 
                  : 'bg-gray-300 hover:bg-gray-400 scale-100'
              } ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
