export interface Testimonial {
  id: string;
  name: string;
  city: string;
  rating: number;
  text: string;
  verified: boolean;
  image?: string; // Customer photo
  beforeAfter?: {
    before: string;
    after: string;
  };
  productUsed: string;
  dateAdded: string;
  featured?: boolean;
  likes?: number; // Number of likes for this testimonial
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  size?: string;
  quantity?: number;
  price: number;
  currency: 'RSD' | 'BAM' | 'EUR' | 'BGN';
  discountPrice?: number;
  isDefault?: boolean;
}

export interface Ingredient {
  id: string;
  inciName: string;
  serbianName: string;
  bulgarianName?: string;
  description: string;
  bulgarianDescription?: string;
  category: 'herbal_extract' | 'essential_oil' | 'active_compound' | 'base_component' | 'preservative' | 'other';
}

export interface ProductFAQ {
  question: string;
  answer: string;
  category: 'usage' | 'ingredients' | 'effects' | 'safety' | 'storage' | 'general';
}

export interface ProductFAQByCountry {
  [countryCode: string]: ProductFAQ[];
}

export interface BundleItem {
  productId: string; // Product ID from the same locale catalog
  variantId?: string; // Specific variant included in the bundle (defaults to the default variant)
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  heroTitle: string;
  purpose: string; // What the product is created for
  category: string;
  images: {
    main: string;
    gallery: string[];
    thumbnail: string;
    fallback?: string;
  };
  variants: ProductVariant[];
  benefits: string[];
  ingredients: string[]; // Ingredient IDs referencing INGREDIENTS config
  usage: string;
  usageSteps?: string[]; // Step-by-step usage instructions
  warnings: string[];
  slug: string;
  alternativeSlugs: string[]; // For different landing pages
  availableCountries: string[];
  seoTitle: string;
  seoDescription: string;
  urgencyElements: {
    limitedStock?: number;
    limitedTime?: string;
    socialProof?: {
      recentPurchases: number;
      timeFrame: string;
    };
  };
  upsells?: {
    products: string[]; // Product IDs
    discountPercentage?: number;
    bundlePrice?: number;
  };
  crossSells?: string[]; // Product IDs
  productFAQ?: ProductFAQ[]; // Localized FAQs for this locale
  testimonials?: Testimonial[]; // Localized testimonials for this product
  published?: boolean; // false = draft, hidden from the storefront (default: true)
  isBundle?: boolean; // Bundle/set product composed of other products
  bundleItems?: BundleItem[]; // Components of the bundle (informational + admin)
  // Per-product override of ingredient descriptions (ingredient ID → text).
  // Shared INGREDIENTS descriptions are written for one product context (e.g. topical
  // skincare); oral products or products with different approved claims override here.
  ingredientDescriptions?: Record<string, string>;
}

export const PRODUCT_CATEGORIES = {
  sensitive: {
    name: 'Nega osetljive kože',
    description: 'Proizvodi za negu najdelikatnije kože'
  },
  skincare: {
    name: 'Nega kože',
    description: 'Proizvodi za svakodnevnu negu kože'
  },
  supplements: {
    name: 'Suplementi',
    description: 'Prirodni suplementi u vidu kapi za unutrašnju upotrebu'
  },
  haircare: {
    name: 'Nega kose',
    description: 'Proizvodi za negu kose i vlasišta'
  },
  bundle: {
    name: 'Setovi',
    description: 'Setovi više proizvoda po povoljnijoj ceni'
  }
} as const;
