import { Prize } from '@/types/wheel';

export const DEFAULT_PRIZES: Prize[] = [
  {
    id: 'third_prize',
    label: 'wheel.prizes.20_off', // Translation key
    value: 20,
    couponCode: 'wheel.coupon_codes.DEAL20', // Translation key
    probability: 0.2,
    color: '#8B5CF6',
    textColor: '#FFFFFF',
    isWinning: true,
  },
  {
    id: 'free_shipping',
    label: 'wheel.prizes.free_shipping', // Translation key
    value: 5, // Low value for color coding
    couponCode: 'wheel.coupon_codes.FREESHIP', // Translation key
    probability: 0.1,
    color: '#EC4899',
    textColor: '#FFFFFF',
    isWinning: true,
  },
  {
    id: 'grand_prize',
    label: 'wheel.prizes.50_off', // Translation key
    value: 50,
    couponCode: 'wheel.coupon_codes.LUCKY50', // Translation key
    probability: 0.15,
    color: '#10B981', // Will be overridden by component
    textColor: '#FFFFFF',
    isWinning: true,
  },
  {
    id: 'fifth_prize',
    label: 'wheel.prizes.10_off', // Translation key
    value: 10,
    couponCode: 'wheel.coupon_codes.SAVE10', // Translation key
    probability: 0.15,
    color: '#F97316',
    textColor: '#FFFFFF',
    isWinning: true,
  },
  {
    id: 'try_again',
    label: 'wheel.prizes.try_again', // Translation key
    value: 0,
    couponCode: '',
    probability: 0.05,
    color: '#6B7280',
    textColor: '#FFFFFF',
    isWinning: false,
  },
  {
    id: 'second_prize',
    label: 'wheel.prizes.30_off', // Translation key
    value: 30,
    couponCode: 'wheel.coupon_codes.SAVE30', // Translation key
    probability: 0.2,
    color: '#3B82F6',
    textColor: '#FFFFFF',
    isWinning: true,
  },
  {
    id: 'fourth_prize',
    label: 'wheel.prizes.15_off', // Translation key
    value: 15,
    couponCode: 'wheel.coupon_codes.SAVE15', // Translation key
    probability: 0.15,
    color: '#F97316',
    textColor: '#FFFFFF',
    isWinning: true,
  }
];

// Function to get winning prizes only
export const getWinningPrizes = (): Prize[] => {
  return DEFAULT_PRIZES.filter(prize => prize.isWinning);
};

// Function to get the grand prize
export const getGrandPrize = (): Prize => {
  return DEFAULT_PRIZES.find(prize => prize.id === 'grand_prize')!;
};

// Function to get a random losing prize (Try Again)
export const getLosingPrize = (): Prize => {
  const losingPrizes = DEFAULT_PRIZES.filter(prize => !prize.isWinning);
  return losingPrizes[Math.floor(Math.random() * losingPrizes.length)];
};

// Customizable prize configurations for different sites
export const PRIZE_THEMES = {
  ecommerce: DEFAULT_PRIZES,
  
  restaurant: [
    {
      id: 'free_meal',
      label: 'Free Meal',
      value: 100,
      couponCode: 'FREEMEAL',
      probability: 0.1,
      color: '#FFD700',
      textColor: '#000000',
      icon: '🍽️',
      isWinning: true,
    },
    {
      id: 'appetizer',
      label: 'Free Appetizer',
      value: 15,
      couponCode: 'FREEAPP',
      probability: 0.2,
      color: '#FF6B6B',
      textColor: '#FFFFFF',
      icon: '🥗',
      isWinning: true,
    },
    {
      id: 'dessert',
      label: 'Free Dessert',
      value: 8,
      couponCode: 'SWEETTREAT',
      probability: 0.25,
      color: '#4ECDC4',
      textColor: '#FFFFFF',
      icon: '🍰',
      isWinning: true,
    },
    {
      id: 'drink',
      label: 'Free Drink',
      value: 5,
      couponCode: 'FREEDRINK',
      probability: 0.3,
      color: '#45B7D1',
      textColor: '#FFFFFF',
      icon: '🥤',
      isWinning: true,
    },
    {
      id: 'try_again',
      label: 'Try Again',
      value: 0,
      couponCode: '',
      probability: 0.15,
      color: '#95A5A6',
      textColor: '#FFFFFF',
      icon: '🔄',
      isWinning: false,
    }
  ] as Prize[],

  service: [
    {
      id: 'full_service',
      label: '100% OFF',
      value: 100,
      couponCode: 'FULLSERVICE',
      probability: 0.05,
      color: '#FFD700',
      textColor: '#000000',
      icon: '🏆',
      isWinning: true,
    },
    {
      id: 'half_service',
      label: '50% OFF',
      value: 50,
      couponCode: 'HALF50',
      probability: 0.15,
      color: '#FF6B6B',
      textColor: '#FFFFFF',
      icon: '⚡',
      isWinning: true,
    },
    {
      id: 'consultation',
      label: 'Free Consultation',
      value: 0,
      couponCode: 'CONSULT',
      probability: 0.3,
      color: '#4ECDC4',
      textColor: '#FFFFFF',
      icon: '💬',
      isWinning: true,
    },
    {
      id: 'discount_25',
      label: '25% OFF',
      value: 25,
      couponCode: 'SAVE25',
      probability: 0.25,
      color: '#45B7D1',
      textColor: '#FFFFFF',
      icon: '💼',
      isWinning: true,
    },
    {
      id: 'try_again',
      label: 'Try Again',
      value: 0,
      couponCode: '',
      probability: 0.25,
      color: '#95A5A6',
      textColor: '#FFFFFF',
      icon: '🔄',
      isWinning: false,
    }
  ] as Prize[]
};
