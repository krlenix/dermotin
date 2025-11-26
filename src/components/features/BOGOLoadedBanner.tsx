'use client';

import { useState, useEffect } from 'react';
import { X, Gift, ArrowRight, Sparkles, PartyPopper } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { markBOGOBannerSeen } from '@/utils/bogo-cookies';

interface BOGOLoadedBannerProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectProduct?: () => void;
}

export function BOGOLoadedBanner({ isVisible, onClose, onSelectProduct }: BOGOLoadedBannerProps) {
  const t = useTranslations();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Wait for client-side mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isVisible) {
      // Small delay before starting animation
      setTimeout(() => setIsAnimating(true), 100);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      setIsAnimating(false);
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible, mounted]);

  const handleClose = () => {
    markBOGOBannerSeen();
    setIsAnimating(false);
    setTimeout(() => onClose(), 300);
  };

  const handleSelectProduct = () => {
    markBOGOBannerSeen();
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
      onSelectProduct?.();
    }, 300);
  };

  // Don't render anything on server or before mount
  if (!mounted || !isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className={`fixed inset-0 z-[101] flex items-center justify-center p-4 transition-all duration-300 ${
          isAnimating 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-95'
        }`}
      >
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Confetti decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-confetti-fall"
                style={{
                  left: `${10 + (i * 8)}%`,
                  backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'][i % 6],
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
          
          {/* Top gradient bar */}
          <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500" />
          
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
          
          {/* Content */}
          <div className="p-6 pt-8 text-center">
            {/* Celebration icons */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <PartyPopper className="w-8 h-8 text-yellow-500 animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <PartyPopper className="w-8 h-8 text-yellow-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold mb-3">
              <Sparkles className="w-3 h-3" />
              {t('bogo.exclusive_offer')}
            </div>
            
            {/* Title */}
            <h2 className="text-2xl font-black text-gray-900 mb-2">
              {t('bogo.coupon_loaded')}
            </h2>
            
            {/* Offer display */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-4 mb-4">
              <div className="text-4xl font-black text-emerald-600 mb-1">
                1+1 GRATIS
              </div>
              <p className="text-sm text-emerald-700">
                {t('bogo.buy_one_get_one')}
              </p>
            </div>
            
            {/* Description */}
            <p className="text-gray-600 text-sm mb-6">
              {t('bogo.coupon_loaded_description')}
            </p>
            
            {/* CTA Button */}
            <button
              onClick={handleSelectProduct}
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              {t('bogo.select_product')}
              <ArrowRight className="w-5 h-5" />
            </button>
            
            {/* Skip link */}
            <button
              onClick={handleClose}
              className="mt-3 text-gray-400 hover:text-gray-600 text-sm transition-colors"
            >
              {t('bogo.maybe_later')}
            </button>
          </div>
        </div>
      </div>
      
      {/* Animations */}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(400px) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti-fall {
          animation: confetti-fall 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}

