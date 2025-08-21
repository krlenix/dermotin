import { useState, useCallback, useRef } from 'react';
import { SpinState, SpinResult, Prize, WheelConfig, WheelSegment } from '@/types/wheel';
import { SPIN_LOGIC } from '@/config/wheel/behavior';
import { getGrandPrize, getLosingPrize, getWinningPrizes } from '@/config/wheel/prizes';

export const useWheelSpin = (config: WheelConfig) => {
  const [spinState, setSpinState] = useState<SpinState>({
    isSpinning: false,
    spinCount: 0,
    currentAngle: 0,
    result: null,
    showConfetti: false,
    showCongratulations: false,
  });

  const wheelRef = useRef<HTMLDivElement>(null);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  // Calculate wheel segments based on prizes
  const calculateSegments = useCallback((): WheelSegment[] => {
    const segments: WheelSegment[] = [];
    const segmentAngle = 360 / config.prizes.length;
    
    config.prizes.forEach((prize, index) => {
      const startAngle = index * segmentAngle;
      const endAngle = (index + 1) * segmentAngle;
      const centerAngle = startAngle + segmentAngle / 2;
      
      segments.push({
        id: prize.id,
        prize,
        startAngle,
        endAngle,
        centerAngle,
      });
    });
    
    return segments;
  }, [config.prizes]);

  const segments = calculateSegments();

  // Get predetermined outcome based on spin count
  const getPredeterminedOutcome = useCallback((spinCount: number): Prize => {
    if (spinCount === 1) {
      // First spin: ALWAYS go to "Try Again"
      return getLosingPrize();
    } else {
      // Second spin: ALWAYS win the highest prize (50% OFF)
      return getGrandPrize();
    }
  }, []);

  // Calculate angle for specific outcome
  const calculateTargetAngle = useCallback((targetPrize: Prize, spinCount: number): number => {
    const targetSegment = segments.find(s => s.prize.id === targetPrize.id);
    if (!targetSegment) return 0;

    console.log('🎡 Target prize:', targetPrize.label, 'ID:', targetPrize.id);
    console.log('🎡 Current wheel angle:', spinState.currentAngle);
    console.log('🎡 Target segment center angle:', targetSegment.centerAngle);

    // Calculate the target position for the segment to be at the pointer (0°)
    let targetAngle = 360 - targetSegment.centerAngle;
    
    // For second spin, start from current position and add rotation to target
    if (spinCount === 2) {
      // Start from current position and rotate to target
      const currentPosition = spinState.currentAngle % 360;
      const targetPosition = targetAngle % 360;
      
      // Calculate shortest rotation to target (could be forward or backward)
      let rotationNeeded = targetPosition - currentPosition;
      
      // Ensure we always rotate forward and add extra revolutions
      if (rotationNeeded <= 0) {
        rotationNeeded += 360;
      }
      
             // Add more revolutions for dramatic effect on second spin
       const revolutions = config.animations.revolutions + 3; // Extra revolution for suspense
       targetAngle = spinState.currentAngle + rotationNeeded + (revolutions * 360);
      
    } else {
      // First spin: normal calculation
      // Add small random offset within the segment for realism
      const segmentSize = 360 / config.prizes.length;
      const offset = (Math.random() - 0.5) * (segmentSize * 0.3);
      targetAngle += offset;

      // Add multiple revolutions for spinning effect
      const revolutions = config.animations.revolutions + Math.floor(Math.random() * 2);
      targetAngle = targetAngle + (revolutions * 360);
    }
    
    console.log('🎡 Final rotation angle:', targetAngle);
    return targetAngle;
  }, [segments, config, spinState.currentAngle]);

  // Clear all timeouts
  const clearTimeouts = useCallback(() => {
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current = [];
  }, []);

  // Spin the wheel
  const spin = useCallback(async () => {
    if (spinState.isSpinning) return;

    clearTimeouts();
    
    const newSpinCount = spinState.spinCount + 1;
    const targetPrize = getPredeterminedOutcome(newSpinCount);
    const targetAngle = calculateTargetAngle(targetPrize, newSpinCount);
    
    setSpinState(prev => ({
      ...prev,
      isSpinning: true,
      spinCount: newSpinCount,
      showConfetti: false,
      showCongratulations: false,
    }));

    // Apply rotation animation
    if (wheelRef.current) {
      // Set the current position as the starting point for the animation
      wheelRef.current.style.setProperty('--start-rotation', `${spinState.currentAngle}deg`);
      wheelRef.current.style.setProperty('--final-rotation', `${targetAngle}deg`);
      
      // Calculate duration for this spin
      const spinDuration = newSpinCount === 2 
        ? config.animations.spinDuration * 1.5  // 50% longer for second spin drama
        : config.animations.spinDuration;
      
      // Reset animation to ensure it starts fresh
      wheelRef.current.style.animation = 'none';
      wheelRef.current.offsetHeight; // Force reflow
      wheelRef.current.style.animation = `wheelSpin ${spinDuration}ms ${config.animations.easingFunction} forwards`;
    }

    return new Promise<SpinResult>((resolve) => {
      // For second spin, use longer duration for dramatic effect but single animation
      const totalDuration = newSpinCount === 2 
        ? config.animations.spinDuration * 1.5  // 50% longer for drama
        : config.animations.spinDuration;

      const resultTimeout = setTimeout(() => {
        const result: SpinResult = {
          prize: targetPrize,
          finalAngle: targetAngle,
          revolutions: Math.floor(targetAngle / 360),
          duration: totalDuration,
        };

        // Set the final position and remove animation
        if (wheelRef.current) {
          wheelRef.current.style.animation = 'none';
          wheelRef.current.style.transform = `rotate(${targetAngle}deg)`;
        }

        setSpinState(prev => ({
          ...prev,
          isSpinning: false,
          currentAngle: targetAngle,
          result,
          showConfetti: Boolean(targetPrize.isWinning),
          showCongratulations: Boolean(targetPrize.isWinning),
        }));

        resolve(result);
      }, totalDuration);

      timeoutRefs.current.push(resultTimeout);
    });
  }, [spinState, config, segments, getPredeterminedOutcome, calculateTargetAngle, clearTimeouts]);

  // Reset wheel state
  const reset = useCallback(() => {
    clearTimeouts();
    setSpinState({
      isSpinning: false,
      spinCount: 0,
      currentAngle: 0,
      result: null,
      showConfetti: false,
      showCongratulations: false,
    });

    if (wheelRef.current) {
      wheelRef.current.style.animation = 'none';
      wheelRef.current.style.transform = 'rotate(0deg)';
      wheelRef.current.style.setProperty('--start-rotation', '0deg');
      wheelRef.current.style.setProperty('--final-rotation', '0deg');
    }
  }, [clearTimeouts]);

  // Hide confetti
  const hideConfetti = useCallback(() => {
    setSpinState(prev => ({ ...prev, showConfetti: false }));
  }, []);

  // Hide congratulations
  const hideCongratulations = useCallback(() => {
    setSpinState(prev => ({ ...prev, showCongratulations: false }));
  }, []);

  // Can spin again?
  const canSpin = !spinState.isSpinning && spinState.spinCount < 2;

  return {
    spinState,
    segments,
    wheelRef,
    spin,
    reset,
    hideConfetti,
    hideCongratulations,
    canSpin,
  };
};
