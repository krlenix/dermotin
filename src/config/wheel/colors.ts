// Color scheme configurations for the wheel of fortune

export const DEFAULT_COLORS = {
  wheelBorder: '#2D3748',
  wheelShadow: 'rgba(0, 0, 0, 0.3)',
  pointer: '#FFD700',
  pointerShadow: 'rgba(255, 215, 0, 0.5)',
  background: 'rgba(0, 0, 0, 0.8)',
};

// Predefined color themes
export const COLOR_THEMES = {
  golden: {
    wheelBorder: '#B8860B',
    wheelShadow: 'rgba(184, 134, 11, 0.4)',
    pointer: '#FFD700',
    pointerShadow: 'rgba(255, 215, 0, 0.6)',
    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(184, 134, 11, 0.1))',
  },
  
  modern: {
    wheelBorder: '#374151',
    wheelShadow: 'rgba(55, 65, 81, 0.5)',
    pointer: '#10B981',
    pointerShadow: 'rgba(16, 185, 129, 0.5)',
    background: 'rgba(17, 24, 39, 0.9)',
  },
  
  vibrant: {
    wheelBorder: '#7C3AED',
    wheelShadow: 'rgba(124, 58, 237, 0.4)',
    pointer: '#F59E0B',
    pointerShadow: 'rgba(245, 158, 11, 0.5)',
    background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(245, 158, 11, 0.1))',
  },
  
  elegant: {
    wheelBorder: '#1F2937',
    wheelShadow: 'rgba(31, 41, 55, 0.6)',
    pointer: '#EF4444',
    pointerShadow: 'rgba(239, 68, 68, 0.5)',
    background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.95))',
  },
  
  casino: {
    wheelBorder: '#7F1D1D',
    wheelShadow: 'rgba(127, 29, 29, 0.6)',
    pointer: '#FBBF24',
    pointerShadow: 'rgba(251, 191, 36, 0.6)',
    background: 'linear-gradient(135deg, rgba(127, 29, 29, 0.9), rgba(153, 27, 27, 0.9))',
  }
};

// Gradient configurations for wheel segments
export const SEGMENT_GRADIENTS = {
  metallic: (baseColor: string) => `
    linear-gradient(135deg, 
      ${baseColor} 0%, 
      ${adjustBrightness(baseColor, 20)} 50%, 
      ${adjustBrightness(baseColor, -10)} 100%
    )
  `,
  
  glossy: (baseColor: string) => `
    linear-gradient(to bottom, 
      ${adjustBrightness(baseColor, 30)} 0%, 
      ${baseColor} 50%, 
      ${adjustBrightness(baseColor, -20)} 100%
    )
  `,
  
  matte: (baseColor: string) => baseColor,
  
  neon: (baseColor: string) => `
    linear-gradient(135deg, 
      ${baseColor} 0%, 
      ${adjustBrightness(baseColor, 40)} 50%, 
      ${baseColor} 100%
    )
  `
};

// Utility function to adjust color brightness
function adjustBrightness(hex: string, percent: number): string {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse RGB values
  const num = parseInt(hex, 16);
  const r = (num >> 16) + percent;
  const g = (num >> 8 & 0x00FF) + percent;
  const b = (num & 0x0000FF) + percent;
  
  // Ensure values stay within 0-255 range
  const newR = Math.max(0, Math.min(255, r));
  const newG = Math.max(0, Math.min(255, g));
  const newB = Math.max(0, Math.min(255, b));
  
  return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`;
}

// Shadow configurations
export const SHADOW_STYLES = {
  soft: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  medium: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  hard: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  dramatic: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  glow: '0 0 20px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.3)',
  neon: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor'
};

// Animation color effects
export const ANIMATION_COLORS = {
  winGlow: {
    from: 'rgba(255, 215, 0, 0)',
    to: 'rgba(255, 215, 0, 0.8)'
  },
  
  pulseColors: [
    '#FFD700', // Gold
    '#FF6B6B', // Red
    '#4ECDC4', // Turquoise
    '#45B7D1', // Blue
    '#96CEB4'  // Green
  ],
  
  confettiColors: [
    '#FFD700', // Gold
    '#FF6B6B', // Red
    '#4ECDC4', // Turquoise
    '#45B7D1', // Blue
    '#E74C3C', // Crimson
    '#9B59B6', // Purple
    '#F39C12', // Orange
    '#2ECC71'  // Emerald
  ]
};

// CSS custom properties for theming
export const CSS_VARIABLES = (theme: keyof typeof COLOR_THEMES = 'golden') => {
  const colors = COLOR_THEMES[theme];
  
  return {
    '--wheel-border-color': colors.wheelBorder,
    '--wheel-shadow': colors.wheelShadow,
    '--pointer-color': colors.pointer,
    '--pointer-shadow': colors.pointerShadow,
    '--background': colors.background,
    '--shadow-soft': SHADOW_STYLES.soft,
    '--shadow-medium': SHADOW_STYLES.medium,
    '--shadow-hard': SHADOW_STYLES.hard,
    '--shadow-dramatic': SHADOW_STYLES.dramatic,
    '--glow-animation': `0 0 20px ${colors.pointer}40, 0 0 40px ${colors.pointer}20`
  };
};

// Responsive color adjustments
export const RESPONSIVE_COLORS = {
  mobile: {
    reducedOpacity: 0.95,
    lighterShadows: true,
    simplifiedGradients: true
  },
  
  desktop: {
    fullOpacity: 1,
    enhancedShadows: true,
    complexGradients: true
  }
};
