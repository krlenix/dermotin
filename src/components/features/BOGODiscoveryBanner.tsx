'use client';

import { useState, useEffect } from 'react';
import { X, Gift, Sparkles, PartyPopper, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { markBOGOBannerSeen, wasBOGOBannerSeen, isBOGOExpired } from '@/utils/bogo-cookies';

interface BOGODiscoveryBannerProps {
  isVisible: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export function BOGODiscoveryBanner({ isVisible, onClose, onAccept }: BOGODiscoveryBannerProps) {
  const t = useTranslations();
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      // Small delay before starting animation
      setTimeout(() => setIsAnimating(true), 50);
    } else {
      setIsAnimating(false);
      // Wait for animation to complete before unmounting
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [isVisible]);

  const handleClose = () => {
    markBOGOBannerSeen();
    setIsAnimating(false);
    setTimeout(() => onClose(), 300);
  };

  const handleAccept = () => {
    markBOGOBannerSeen();
    onAccept();
  };

  if (!shouldRender || isBOGOExpired()) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Banner Modal */}
      <div 
        className={`fixed inset-x-4 top-1/2 -translate-y-1/2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-lg z-50 transition-all duration-300 ${
          isAnimating 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-95'
        }`}
      >
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 opacity-10" />
          
          {/* Confetti Effect (CSS) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'][i % 6],
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* Content */}
          <div className="relative p-6 sm:p-8 text-center">
            {/* Celebration Icons */}
            <div className="flex justify-center items-center gap-4 mb-4">
              <PartyPopper className="w-8 h-8 text-yellow-500 animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <PartyPopper className="w-8 h-8 text-yellow-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            
            {/* Title */}
            <div className="mb-2">
              <span className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
                {t('bogo.once_in_five_years')}
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
              🎉 {t('bogo.banner_title')} 🎉
            </h2>
            
            <p className="text-lg text-gray-700 font-semibold mb-1">
              {t('bogo.buy_one_get_one')}
            </p>
            
            <p className="text-sm text-gray-600 mb-4">
              {t('bogo.banner_description')}
            </p>
            
            {/* Urgency */}
            <div className="flex items-center justify-center gap-2 text-red-600 mb-6">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-bold">
                {t('bogo.ends_date', { date: '28.11' })}
              </span>
            </div>
            
            {/* CTA Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAccept}
                className="w-full py-4 px-6 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                {t('bogo.activate_offer')}
                <Sparkles className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleClose}
                className="w-full py-2 px-4 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
              >
                {t('bogo.maybe_later')}
              </button>
            </div>
          </div>
          
          {/* Bottom Decoration */}
          <div className="h-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500" />
        </div>
      </div>
      
      {/* Confetti Animation Keyframes */}
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(400px) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}

