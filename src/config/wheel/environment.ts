// Environment-based configuration for the wheel of fortune
// This file makes it easy to enable/disable the wheel across different environments

export const WHEEL_ENVIRONMENT_CONFIG = {
  // Master toggle - set to false to completely disable the wheel
  ENABLED: process.env.NEXT_PUBLIC_WHEEL_ENABLED !== 'false',
  
  // Delay before showing the wheel (in milliseconds)
  POPUP_DELAY: parseInt(process.env.NEXT_PUBLIC_WHEEL_DELAY || '1000'), // Reduced to 1 second for testing
  
  // Whether to show only once per session
  SHOW_ONCE: process.env.NEXT_PUBLIC_WHEEL_SHOW_ONCE === 'true', // Changed to default false for testing
  
  // Theme configuration
  THEME: process.env.NEXT_PUBLIC_WHEEL_THEME || 'ecommerce',
  ANIMATION_SPEED: process.env.NEXT_PUBLIC_WHEEL_ANIMATION || 'normal',
  COLOR_THEME: process.env.NEXT_PUBLIC_WHEEL_COLOR_THEME || 'golden',
  
  // Development settings
  DEV_MODE: process.env.NODE_ENV === 'development',
  FORCE_SHOW: process.env.NEXT_PUBLIC_WHEEL_FORCE_SHOW === 'true',
  SKIP_DELAY: process.env.NEXT_PUBLIC_WHEEL_SKIP_DELAY === 'true',
};

// Quick configuration presets
export const getWheelEnvironmentConfig = () => {
  return {
    enabled: WHEEL_ENVIRONMENT_CONFIG.ENABLED,
    delayMs: WHEEL_ENVIRONMENT_CONFIG.SKIP_DELAY ? 1000 : WHEEL_ENVIRONMENT_CONFIG.POPUP_DELAY,
    showOnlyOnce: WHEEL_ENVIRONMENT_CONFIG.SHOW_ONCE,
    cookieName: 'wheel_of_fortune_shown',
  };
};

// Development helpers
export const DEV_HELPERS = {
  // Force show wheel regardless of storage
  forceShow: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('wheel_of_fortune_shown');
      document.cookie = 'wheel_of_fortune_shown=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    }
  },
  
  // Disable wheel for current session
  disable: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('wheel_disabled_dev', 'true');
    }
  },
  
  // Enable wheel for current session
  enable: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('wheel_disabled_dev');
    }
  },
  
  // Check if disabled by dev
  isDisabledByDev: () => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('wheel_disabled_dev') === 'true';
    }
    return false;
  }
};

// Export for easy access in components
export const isWheelEnabled = () => {
  if (!WHEEL_ENVIRONMENT_CONFIG.ENABLED) return false;
  if (WHEEL_ENVIRONMENT_CONFIG.DEV_MODE && DEV_HELPERS.isDisabledByDev()) return false;
  return true;
};
