export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  currency: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  currency: string;
  discountCode?: string;
  discountAmount?: number;
}

export interface Customer {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface Order {
  id: string;
  customerId?: string;
  items: CartItem[];
  customer: Customer;
  total: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'card' | 'bank_transfer';
  createdAt: Date;
  updatedAt: Date;
  trackingNumber?: string;
}

export interface UrgencyTimer {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface SocialProofEvent {
  id: string;
  productName: string;
  customerName: string;
  city: string;
  timestamp: Date;
  type: 'purchase' | 'review' | 'view';
}

export interface LandingPageConfig {
  heroSection: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    ctaText: string;
  };
  urgencyElements: {
    showTimer: boolean;
    showStock: boolean;
    showRecentPurchases: boolean;
    timerDuration: number; // in hours
  };
  socialProof: {
    showTestimonials: boolean;
    showRatings: boolean;
    showRecentActivity: boolean;
    showTrustBadges: boolean;
  };
  layout: 'single-product' | 'comparison' | 'bundle';
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
}
