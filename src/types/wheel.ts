export interface Prize {
  id: string;
  label: string;
  value: number;
  couponCode: string;
  probability: number;
  color: string;
  textColor: string;
  icon?: string;
  isWinning?: boolean;
}

export interface WheelSegment {
  id: string;
  prize: Prize;
  startAngle: number;
  endAngle: number;
  centerAngle: number;
}

export interface SpinResult {
  prize: Prize;
  finalAngle: number;
  revolutions: number;
  duration: number;
}

export interface AnimationConfig {
  spinDuration: number;
  easingFunction: string;
  revolutions: number;
  decelerationRate: number;
  suspenseDuration: number;
}

export interface BehaviorConfig {
  firstSpinOutcome: 'almost_win';
  secondSpinOutcome: 'fake_lose_then_win';
  tensionDelay: number;
  suspenseRevolutions: number;
  almostWinMargin: number; // degrees away from winning
}

export interface WheelConfig {
  prizes: Prize[];
  animations: AnimationConfig;
  behavior: BehaviorConfig;
  colors: {
    wheelBorder: string;
    wheelShadow: string;
    pointer: string;
    pointerShadow: string;
    background: string;
  };
}

export interface SpinState {
  isSpinning: boolean;
  spinCount: number;
  currentAngle: number;
  result: SpinResult | null;
  showConfetti: boolean;
  showCongratulations: boolean;
}

export interface WheelPopupConfig {
  enabled: boolean;
  delayMs: number;
  showOnlyOnce: boolean;
  cookieName: string;
}
