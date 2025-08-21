import { BehaviorConfig } from '@/types/wheel';

export const DEFAULT_BEHAVIOR_CONFIG: BehaviorConfig = {
  firstSpinOutcome: 'almost_win',
  secondSpinOutcome: 'fake_lose_then_win',
  tensionDelay: 1000, // ms to pause for tension
  suspenseRevolutions: 2, // extra revolutions for suspense
  almostWinMargin: 15, // degrees away from winning prize
};

// Behavior patterns for different scenarios
export const BEHAVIOR_PATTERNS = {
  // Default pattern: almost win, then fake lose but win
  default: DEFAULT_BEHAVIOR_CONFIG,
  
  // More aggressive: closer calls and longer suspense
  dramatic: {
    ...DEFAULT_BEHAVIOR_CONFIG,
    tensionDelay: 1500,
    suspenseRevolutions: 3,
    almostWinMargin: 8, // Even closer to winning
  },
  
  // Subtle: less obvious manipulation
  subtle: {
    ...DEFAULT_BEHAVIOR_CONFIG,
    tensionDelay: 500,
    suspenseRevolutions: 1,
    almostWinMargin: 25, // Further from winning
  },
  
  // Quick: faster paced for impatient users
  quick: {
    ...DEFAULT_BEHAVIOR_CONFIG,
    tensionDelay: 300,
    suspenseRevolutions: 1,
    almostWinMargin: 12,
  }
};

// Spin outcome calculation helpers
export const SPIN_LOGIC = {
  // Calculate angle for "almost win" - just missing the grand prize
  calculateAlmostWinAngle: (grandPrizeAngle: number, margin: number): number => {
    // Position just before or after the grand prize
    const direction = Math.random() > 0.5 ? 1 : -1;
    return grandPrizeAngle + (margin * direction);
  },
  
  // Calculate fake lose position - stops at "try again" segment
  calculateFakeLoseAngle: (tryAgainAngles: number[]): number => {
    // Pick a random "try again" segment
    return tryAgainAngles[Math.floor(Math.random() * tryAgainAngles.length)];
  },
  
  // Calculate final win angle - lands on predetermined winning prize
  calculateWinAngle: (winningPrizeAngle: number): number => {
    // Add small random offset within the segment for realism
    const segmentSize = 360 / 8; // Assuming 8 segments
    const offset = (Math.random() - 0.5) * (segmentSize * 0.3); // 30% of segment
    return winningPrizeAngle + offset;
  }
};

// Probability adjustments for realistic outcomes
export const PROBABILITY_ADJUSTMENTS = {
  // First spin probabilities (for almost win scenario)
  firstSpin: {
    grandPrize: 0, // Never actually win grand prize on first spin
    mediumPrizes: 0.3, // 30% chance of winning medium prizes
    smallPrizes: 0.5, // 50% chance of winning small prizes
    tryAgain: 0.2, // 20% chance of actually landing on try again
  },
  
  // Second spin probabilities (guaranteed win)
  secondSpin: {
    guaranteedWin: true,
    prizeDistribution: {
      grandPrize: 0.4, // 40% chance of grand prize
      mediumPrizes: 0.4, // 40% chance of medium prizes
      smallPrizes: 0.2, // 20% chance of small prizes
    }
  }
};

// User experience flow configuration
export const UX_FLOW = {
  // Timing between different stages
  timing: {
    wheelAppearDelay: 0,
    firstSpinButtonDelay: 1000,
    resultDisplayDelay: 500,
    secondSpinButtonDelay: 2000,
    confettiDelay: 200,
    congratulationsDelay: 1000,
    modalCloseDelay: 10000, // Auto-close after 10 seconds
  },
  
  // Messages for different states
  messages: {
    welcome: "Spin the wheel for a chance to win amazing prizes!",
    firstSpinAlmostWin: "So close! Try one more time!",
    firstSpinWin: "Congratulations! But wait, you can spin once more for an even bigger prize!",
    firstSpinLose: "Don't give up! You have one more chance!",
    secondSpinFakeStop: "Oh no...",
    secondSpinWin: "SURPRISE! You won anyway!",
    finalCongratulations: "🎉 Congratulations! You've won an amazing prize! 🎉"
  },
  
  // Button text for different states
  buttonText: {
    firstSpin: "Spin Now!",
    secondSpin: "Last Chance!",
    claim: "Claim Your Prize",
    close: "Close"
  }
};

// Analytics and tracking configuration
export const TRACKING_CONFIG = {
  events: {
    wheelShown: 'wheel_shown',
    firstSpin: 'wheel_first_spin',
    secondSpin: 'wheel_second_spin',
    prizeWon: 'wheel_prize_won',
    couponGenerated: 'wheel_coupon_generated',
    modalClosed: 'wheel_modal_closed'
  },
  
  // Data to track for each event
  eventData: {
    timestamp: true,
    userId: true,
    sessionId: true,
    prizeWon: true,
    couponCode: true,
    spinCount: true,
    timeToComplete: true
  }
};
