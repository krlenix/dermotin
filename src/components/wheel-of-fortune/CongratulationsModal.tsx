import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Prize } from '@/types/wheel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CongratulationsModalProps {
  isVisible: boolean;
  prize: Prize | null;
  onClose: () => void;
  onClaim?: (couponCode: string) => void;
}

export const CongratulationsModal: React.FC<CongratulationsModalProps> = ({
  isVisible,
  prize,
  onClose,
  onClaim,
}) => {
  const t = useTranslations();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [autoCloseCountdown, setAutoCloseCountdown] = useState<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const detailsTimer = setTimeout(() => setShowDetails(true), 600);
      return () => clearTimeout(detailsTimer);
    } else {
      setIsAnimating(false);
      setShowDetails(false);
      setCopied(false);
    }
  }, [isVisible]);

  const handleCopy = async () => {
    if (!prize?.couponCode) return;
    
    try {
      await navigator.clipboard.writeText(prize.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy coupon code:', error);
    }
  };

  const handleClaim = () => {
    if (prize?.couponCode && onClaim) {
      onClaim(prize.couponCode);
    }
    
    // Start auto-close countdown after claiming
    setAutoCloseCountdown(3);
  };

  // Auto-close countdown effect
  useEffect(() => {
    if (autoCloseCountdown === null) return;

    if (autoCloseCountdown === 0) {
      // Start closing animation
      setIsClosing(true);
      setIsAnimating(false);
      
      // Close the modal after animation
      const closeTimer = setTimeout(() => {
        onClose();
        setAutoCloseCountdown(null);
        setIsClosing(false);
      }, 500);
      
      return () => clearTimeout(closeTimer);
    }

    // Countdown timer
    const countdownTimer = setTimeout(() => {
      setAutoCloseCountdown(autoCloseCountdown - 1);
    }, 1000);

    return () => clearTimeout(countdownTimer);
  }, [autoCloseCountdown, onClose]);

  if (!isVisible || !prize) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative z-10 w-full max-w-md mx-4 transition-all duration-700 ease-out ${
          isAnimating && !isClosing
            ? 'translate-y-0 opacity-100 scale-100'
            : isClosing
            ? 'translate-y-8 opacity-0 scale-95'
            : '-translate-y-full opacity-0 scale-95'
        }`}
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 shadow-2xl">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-200 rounded-full opacity-20 animate-pulse" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-orange-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-yellow-100 rounded-full opacity-30 animate-ping" style={{ animationDelay: '0.5s' }} />
          </div>

          <CardContent className="relative p-8 text-center">
            {/* Header */}
            <div className="mb-6">
              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {t('wheel.congratulations')}
              </h2>
              <p className="text-gray-600">
                {t('wheel.you_won')}
              </p>
            </div>

            {/* Prize Details */}
            <div
              className={`transition-all duration-500 ${
                showDetails
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0'
              }`}
            >
              {/* Prize Icon */}
              <div className="text-5xl mb-4 animate-pulse">
                {prize.icon}
              </div>

              {/* Prize Value */}
              <div className="mb-6">
                <div className="text-4xl font-bold text-gradient bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
                  {t(prize.label)}
                </div>
                {prize.value > 0 && (
                  <p className="text-gray-600">
                    {t('wheel.save_percentage', { percentage: prize.value })}
                  </p>
                )}
              </div>

              {/* Coupon Code */}
              {prize.couponCode && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">{t('wheel.copy_code')}:</p>
                  <div className="flex items-center justify-center gap-2">
                    <Badge
                      variant="secondary"
                      className="px-4 py-2 text-lg font-mono bg-gray-100 text-gray-800 border-2 border-dashed border-gray-300"
                    >
                      {prize.couponCode.startsWith('wheel.coupon_codes.') ? t(prize.couponCode) : prize.couponCode}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopy}
                      className="transition-all duration-200"
                    >
                      {copied ? '✅' : '📋'}
                    </Button>
                  </div>
                  {copied && (
                    <p className="text-sm text-green-600 mt-1">
                      {t('wheel.copied')}
                    </p>
                  )}
                </div>
              )}

              {/* Usage Instructions */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  💡 <strong>{t('wheel.how_to_use')}</strong> {t('wheel.copy_coupon_instructions')}
                </p>
              </div>

              {/* Auto-close countdown */}
              {autoCloseCountdown !== null && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">
                    {t('wheel.prize_claimed', { 
                      countdown: autoCloseCountdown, 
                      plural: autoCloseCountdown !== 1 ? 'i' : '' 
                    })}
                  </p>
                  <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-linear"
                      style={{ width: `${((3 - autoCloseCountdown) / 3) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {autoCloseCountdown === null ? (
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={handleClaim}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    {t('wheel.claim_prize')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="px-6 py-2"
                  >
                    {t('wheel.close')}
                  </Button>
                </div>
              ) : (
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setAutoCloseCountdown(null);
                      onClose();
                    }}
                    className="px-6 py-2"
                  >
                    {t('wheel.close_now')}
                  </Button>
                </div>
              )}

              {/* Fine Print */}
              <p className="text-xs text-gray-500 mt-4">
                * Offer valid for limited time. Terms and conditions apply.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
