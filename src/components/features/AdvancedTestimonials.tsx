'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getTestimonialsForCountry, Testimonial } from '@/config/testimonials';
import { Star, Quote, Calendar, Package, ChevronLeft, ChevronRight, Heart, Share } from 'lucide-react';

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
  const [isLoaded, setIsLoaded] = useState(false);
  const [likedTestimonials, setLikedTestimonials] = useState<Set<string>>(new Set());
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

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -400,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 400,
        behavior: 'smooth'
      });
    }
  };

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

  // Prevent layout shifts by ensuring container loads properly
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={`py-16 bg-gradient-to-br from-gray-50 to-blue-50 w-full overflow-hidden ${className}`}>
      <div className="container mx-auto px-4 w-full overflow-hidden" style={{maxWidth: '100%'}}>
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
        {/* Social Media Style Feed */}
        <div className="relative w-full overflow-hidden" style={{maxWidth: '100%'}}>
          {/* Navigation Buttons - positioned safely within container */}
          <Button
            variant="outline"
            size="sm"
            onClick={scrollLeft}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white shadow-lg rounded-full w-10 h-10 p-0 border-2 hidden md:flex md:items-center md:justify-center"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={scrollRight}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white shadow-lg rounded-full w-10 h-10 p-0 border-2 hidden md:flex md:items-center md:justify-center"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          {/* Horizontal Scrolling Container */}
          <div 
            ref={scrollContainerRef}
            className={`flex gap-4 md:gap-6 pb-4 px-2 md:px-12 snap-x snap-mandatory transition-all duration-300 ${isLoaded ? 'overflow-x-auto scrollbar-hide' : 'overflow-hidden'}`}
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none', 
              maxWidth: '100vw',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            {testimonials.map((testimonial: Testimonial) => (
              <Card 
                key={testimonial.id} 
                className="flex-shrink-0 w-64 md:w-72 lg:w-80 bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-xl snap-start overflow-hidden" 
                style={{
                  maxWidth: 'calc(100vw - 32px)', 
                  minWidth: '250px',
                  boxSizing: 'border-box'
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
            ))}
          </div>
        </div>
        {/* Trust Indicators */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
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
