import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { WheelConfig } from '@/types/wheel';
import { useWheelSpin } from '@/hooks/useWheelSpin';
import { WheelSegment } from './WheelSegment';
import { ConfettiEffect } from './ConfettiEffect';
import { CongratulationsModal } from './CongratulationsModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WheelOfFortuneProps {
  config: WheelConfig;
  onPrizeWon?: (couponCode: string) => void;
  onClose?: () => void;
  className?: string;
}

export const WheelOfFortune: React.FC<WheelOfFortuneProps> = ({
  config,
  onPrizeWon,
  onClose,
  className = '',
}) => {
  const t = useTranslations();
  const {
    spinState,
    segments,
    wheelRef,
    spin,
    reset,
    hideConfetti,
    hideCongratulations,
    canSpin,
  } = useWheelSpin(config);

  const [isHovering, setIsHovering] = useState(false);
  const [highlightedSegment, setHighlightedSegment] = useState<string | null>(null);

  const wheelSize = 500;
  const radius = wheelSize / 2;

  // Calculate the winning segment based on current angle
  useEffect(() => {
    if (spinState.isSpinning) return;
    
    // The pointer is at 0° (right side), so we need to find which segment is at that position
    const currentAngle = (360 - (spinState.currentAngle % 360)) % 360;
    const segmentAngle = 360 / segments.length;
    const segmentIndex = Math.floor(currentAngle / segmentAngle);
    const winningSegment = segments[segmentIndex];
    
    if (winningSegment) {
      setHighlightedSegment(winningSegment.id);
    }
  }, [spinState.currentAngle, segments, spinState.isSpinning]);

  // CSS custom properties for animations
  const wheelStyles = {
    '--wheel-size': `${wheelSize}px`,
    '--final-rotation': '0deg',
  } as React.CSSProperties;

  const getSpinButtonText = () => {
    if (spinState.spinCount === 0) return t('wheel.spin_button');
    if (spinState.spinCount === 1 && !spinState.result?.prize.isWinning) return t('wheel.spin_again_button');
    if (spinState.spinCount === 1) return t('wheel.spin_again_button');
    return t('wheel.spinning');
  };

  const getStatusMessage = () => {
    if (spinState.isSpinning) {
      return t('wheel.spinning');
    }
    if (spinState.result) {
      if (spinState.result.prize.isWinning) {
        return t('wheel.you_won_message', { prize: t(spinState.result.prize.label) });
      } else {
        // Got "Try Again" - encourage for second spin
        return spinState.spinCount < 2 ? t('wheel.only_one_chance') : t('wheel.only_one_chance');
      }
    }
    return t('wheel.subtitle');
  };

  return (
    <div className={`relative ${className}`}>
      {/* Wheel Container */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 shadow-2xl">
        <CardContent className="p-4 sm:p-6">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              🎡 {t('wheel.title')}
            </h2>
            <p className="text-gray-600 mb-4">
              {getStatusMessage()}
            </p>
            {spinState.spinCount > 0 && (
              <Badge variant="secondary" className="mb-2">
                Spin {spinState.spinCount} of 2
              </Badge>
            )}
          </div>

          {/* Simple Clean Wheel */}
          <div className="relative flex items-center justify-center mb-4 sm:mb-6">
            <div className="relative wheel-container">
              {/* Simple wheel with clean design */}
              <div
                ref={wheelRef}
                className={`relative bg-white rounded-full shadow-2xl transition-all duration-200 ${
                  isHovering && !spinState.isSpinning ? 'scale-105' : 'scale-100'
                }`}
                style={{
                  width: wheelSize,
                  height: wheelSize,
                  ...wheelStyles
                }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <svg
                  width={wheelSize}
                  height={wheelSize}
                  viewBox={`0 0 ${wheelSize} ${wheelSize}`}
                  className="rounded-full"
                >
                  {/* Segments */}
                  {segments.map((segment, index) => (
                    <WheelSegment
                      key={segment.id}
                      segment={segment}
                      radius={radius}
                      isHighlighted={highlightedSegment === segment.id && !spinState.isSpinning}
                      index={index}
                      totalSegments={segments.length}
                    />
                  ))}

                  {/* Subtle center circle */}
                  <circle
                    cx={radius}
                    cy={radius}
                    r="35"
                    fill="#fafafa"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                    className="drop-shadow-sm"
                  />

                  {/* Simple center dot */}
                  <circle
                    cx={radius}
                    cy={radius}
                    r="8"
                    fill="#1f2937"
                  />
                </svg>


              </div>

              {/* Fixed pointer - stays in place while wheel rotates */}
              <div
                className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 z-20"
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
                }}
              >
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderTop: '12px solid transparent',
                    borderBottom: '12px solid transparent',
                    borderRight: '20px solid #000000',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="text-center space-y-4">
            {/* Spin Button */}
            <Button
              onClick={spin}
              disabled={!canSpin || spinState.isSpinning}
              size="lg"
              className={`px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform ${
                spinState.isSpinning
                  ? 'bg-gray-400 cursor-not-allowed'
                  : canSpin
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 hover:scale-105 shadow-lg hover:shadow-xl'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {spinState.isSpinning && (
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
              )}
              {getSpinButtonText()}
            </Button>

            {/* Close Button */}
            {onClose && (
              <div>
                <Button
                  onClick={onClose}
                  variant="outline"
                  size="sm"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Close
                </Button>
              </div>
            )}

            {/* Reset Button (for testing) */}
            {process.env.NODE_ENV === 'development' && (
              <div>
                <Button
                  onClick={reset}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Reset (Dev)
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Confetti Effect */}
      <ConfettiEffect
        isActive={spinState.showConfetti}
        onComplete={hideConfetti}
        duration={3000}
        particleCount={150}
      />

      {/* Congratulations Modal */}
      <CongratulationsModal
        isVisible={spinState.showCongratulations}
        prize={spinState.result?.prize || null}
        onClose={() => {
          hideCongratulations();
          onClose?.(); // Close the entire wheel modal
        }}
        onClaim={onPrizeWon}
      />

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes wheelSpin {
          from {
            transform: perspective(1000px) rotateX(15deg) rotate(0deg);
          }
          to {
            transform: perspective(1000px) rotateX(15deg) rotate(var(--final-rotation));
          }
        }
      `}</style>
    </div>
  );
};
