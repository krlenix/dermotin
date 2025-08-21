// Central configuration file that exports all wheel configurations

import { WheelConfig, WheelPopupConfig } from '@/types/wheel';
import { DEFAULT_PRIZES, PRIZE_THEMES } from './prizes';
import { DEFAULT_ANIMATION_CONFIG, ANIMATION_PRESETS } from './animations';
import { DEFAULT_BEHAVIOR_CONFIG, BEHAVIOR_PATTERNS } from './behavior';
import { DEFAULT_COLORS, COLOR_THEMES } from './colors';
import { getWheelEnvironmentConfig, isWheelEnabled } from './environment';

// Main wheel configuration - easily customizable
export const WHEEL_CONFIG: WheelConfig = {
  prizes: DEFAULT_PRIZES,
  animations: DEFAULT_ANIMATION_CONFIG,
  behavior: DEFAULT_BEHAVIOR_CONFIG,
  colors: DEFAULT_COLORS,
};

// Popup configuration - controls when and how the wheel appears
export const POPUP_CONFIG: WheelPopupConfig = {
  ...getWheelEnvironmentConfig(),
  enabled: isWheelEnabled(),
};

// Environment-based configuration
export const getWheelConfig = (
  theme: keyof typeof PRIZE_THEMES = 'ecommerce',
  animationSpeed: keyof typeof ANIMATION_PRESETS = 'normal',
  behaviorPattern: keyof typeof BEHAVIOR_PATTERNS = 'default',
  colorTheme: keyof typeof COLOR_THEMES = 'golden'
): WheelConfig => {
  return {
    prizes: PRIZE_THEMES[theme],
    animations: ANIMATION_PRESETS[animationSpeed],
    behavior: BEHAVIOR_PATTERNS[behaviorPattern],
    colors: COLOR_THEMES[colorTheme],
  };
};

// Quick configuration presets for different use cases
export const PRESET_CONFIGURATIONS = {
  // E-commerce store configuration
  ecommerce: getWheelConfig('ecommerce', 'normal', 'default', 'golden'),
  
  // Restaurant/food service configuration
  restaurant: getWheelConfig('restaurant', 'dramatic', 'default', 'vibrant'),
  
  // Service business configuration
  service: getWheelConfig('service', 'normal', 'subtle', 'modern'),
  
  // High-end/luxury configuration
  luxury: getWheelConfig('ecommerce', 'dramatic', 'dramatic', 'elegant'),
  
  // Casino/gaming style configuration
  casino: getWheelConfig('ecommerce', 'dramatic', 'default', 'casino'),
  
  // Quick/fast-paced configuration
  quickWin: getWheelConfig('ecommerce', 'quick', 'quick', 'modern'),
};

// Feature flags for easy enabling/disabling of features
export const FEATURE_FLAGS = {
  enableConfetti: true,
  enableSoundEffects: false, // Can be implemented later
  enableHapticFeedback: false, // For mobile devices
  enableAnalytics: true,
  enableLocalStorage: true,
  enableCookies: true,
  enableFullscreen: false, // For immersive experience
};

// Development/testing configuration
export const DEV_CONFIG = {
  // Force specific outcomes for testing
  forceFirstSpinOutcome: null as string | null, // Set to prize ID to force outcome
  forceSecondSpinOutcome: null as string | null,
  
  // Debug options
  showDebugInfo: false,
  logSpinResults: false,
  skipAnimations: false, // For faster testing
  
  // Testing utilities
  autoSpin: false, // Automatically spin for demo purposes
  autoSpinDelay: 2000,
};

// Accessibility configuration
export const A11Y_CONFIG = {
  enableScreenReaderSupport: true,
  enableKeyboardNavigation: true,
  enableHighContrast: false,
  enableReducedMotion: true, // Respect user's motion preferences
  announceSpinResults: true,
  focusTrapModal: true,
};

// Performance configuration
export const PERFORMANCE_CONFIG = {
  useHardwareAcceleration: true,
  enableWillChange: true,
  optimizeForMobile: true,
  lazyLoadConfetti: true,
  debounceSpinButton: 300, // Prevent rapid clicking
};

// Export all configurations
export * from './prizes';
export * from './animations';
export * from './behavior';
export * from './colors';
export * from './environment';

// Export the main configuration function
export { getWheelConfig as configureWheel };
