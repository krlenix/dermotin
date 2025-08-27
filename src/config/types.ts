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

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
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
}

export const PRODUCT_CATEGORIES = {
  antifungal: {
    name: 'Antifungalni proizvodi',
    description: 'Proizvodi za lečenje gljivičnih infekcija'
  },
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
  }
} as const;
