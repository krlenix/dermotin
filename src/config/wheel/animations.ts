import { AnimationConfig } from '@/types/wheel';

export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  spinDuration: 4000, // 4 seconds
  easingFunction: 'cubic-bezier(0.23, 1, 0.320, 1)', // easeOutQuart
  revolutions: 5, // Base number of full rotations
  decelerationRate: 0.96, // How quickly the wheel slows down
  suspenseDuration: 1500, // Extra time for suspense before final result
};

export const ANIMATION_PRESETS = {
  fast: {
    ...DEFAULT_ANIMATION_CONFIG,
    spinDuration: 2500,
    revolutions: 3,
    suspenseDuration: 1000,
  },
  
  normal: DEFAULT_ANIMATION_CONFIG,
  
  dramatic: {
    ...DEFAULT_ANIMATION_CONFIG,
    spinDuration: 6000,
    revolutions: 8,
    suspenseDuration: 2500,
    easingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // easeOutBack
  },
  
  quick: {
    ...DEFAULT_ANIMATION_CONFIG,
    spinDuration: 1500,
    revolutions: 2,
    suspenseDuration: 500,
  }
};

// Easing functions for different animation effects
export const EASING_FUNCTIONS = {
  easeOutQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
  easeOutBack: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  easeOutBounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  easeOutElastic: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
  easeInOutQuint: 'cubic-bezier(0.86, 0, 0.07, 1)',
  easeOutExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
};

// CSS animation keyframes
export const WHEEL_ANIMATIONS = {
  spin: `
    @keyframes wheelSpin {
      0% {
        transform: perspective(1000px) rotateX(15deg) rotateZ(0deg);
      }
      100% {
        transform: perspective(1000px) rotateX(15deg) rotateZ(var(--final-rotation));
      }
    }
  `,
  
  bounce: `
    @keyframes wheelBounce {
      0%, 100% {
        transform: perspective(1000px) rotateX(15deg) rotateZ(var(--final-rotation)) scale(1);
      }
      50% {
        transform: perspective(1000px) rotateX(15deg) rotateZ(var(--final-rotation)) scale(1.05);
      }
    }
  `,
  
  glow: `
    @keyframes wheelGlow {
      0%, 100% {
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
      }
      50% {
        box-shadow: 0 0 40px rgba(255, 215, 0, 0.8);
      }
    }
  `,
  
  pointer: `
    @keyframes pointerBounce {
      0%, 100% {
        transform: translateY(0px) scale(1);
      }
      50% {
        transform: translateY(-5px) scale(1.1);
      }
    }
  `
};

// Animation timing configurations
export const ANIMATION_TIMINGS = {
  // First spin: almost win scenario
  firstSpin: {
    duration: 4500,
    revolutions: 6,
    easingStages: [
      { percent: 0, easing: 'ease-out' },
      { percent: 70, easing: 'ease-out' },
      { percent: 85, easing: 'ease-in-out' },
      { percent: 100, easing: 'ease-out' }
    ]
  },
  
  // Second spin: fake lose then win
  secondSpin: {
    duration: 5500,
    revolutions: 7,
    fakeStopDuration: 800, // How long to pause at fake losing position
    finalMoveDuration: 1200, // Time to move from fake stop to win
    easingStages: [
      { percent: 0, easing: 'ease-out' },
      { percent: 60, easing: 'ease-out' },
      { percent: 75, easing: 'ease-in' }, // Fake stop
      { percent: 80, easing: 'ease-out' }, // Resume to win
      { percent: 100, easing: 'ease-out' }
    ]
  }
};

// Confetti animation settings
export const CONFETTI_CONFIG = {
  particleCount: 150,
  spread: 70,
  origin: { y: 0.6 },
  colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#E74C3C'],
  duration: 3000,
  gravity: 0.8,
  drift: 0.1,
  scalar: 1.2
};
