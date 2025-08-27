import { Product, ProductFAQ, ProductVariant } from '../types';
import { getCountryConfig, convertCurrency, SupportedCurrency } from '../countries';

// Dynamic imports for locale-specific products
export async function getProductsForLocale(locale: string): Promise<Record<string, Product>> {
  try {
    switch (locale) {
      case 'rs':
        const { PRODUCTS: rsProducts } = await import('./rs/products');
        return rsProducts;
      case 'ba':
        const { PRODUCTS: baProducts } = await import('./ba/products');
        return baProducts;
      default:
        // Fallback to Serbian
        const { PRODUCTS: defaultProducts } = await import('./rs/products');
        return defaultProducts;
    }
  } catch (error) {
    console.error(`Failed to load products for locale ${locale}:`, error);
    // Fallback to Serbian products
    const { PRODUCTS: fallbackProducts } = await import('./rs/products');
    return fallbackProducts;
  }
}

// Utility functions
export async function getProduct(id: string, locale: string = 'rs'): Promise<Product | undefined> {
  const products = await getProductsForLocale(locale);
  return products[id];
}

export async function getProductBySlug(slug: string, locale: string = 'rs'): Promise<Product | undefined> {
  const products = await getProductsForLocale(locale);
  return Object.values(products).find(
    product => product.slug === slug || product.alternativeSlugs.includes(slug)
  );
}

export async function getProductsForCountry(countryCode: string, locale: string = 'rs'): Promise<Product[]> {
  const products = await getProductsForLocale(locale);
  return Object.values(products).filter(
    product => product.availableCountries.includes(countryCode)
  );
}

export function getProductFAQ(product: Product): ProductFAQ[] {
  return product.productFAQ || [];
}

export function getProductFAQByCategory(product: Product, category: string): ProductFAQ[] {
  const faqs = product.productFAQ || [];
  return faqs.filter((item: ProductFAQ) => item.category === category);
}

export function getProductPrice(product: Product, currency: 'RSD' | 'BAM' | 'EUR' | 'BGN', variantId?: string): number {
  const variant = variantId 
    ? product.variants.find(v => v.id === variantId)
    : product.variants.find(v => v.isDefault) || product.variants[0];
    
  if (!variant) return 0;
  
  // Convert price based on currency
  let price = variant.discountPrice || variant.price;
  
  // Apply currency conversion
  if (variant.currency !== currency) {
    switch (currency) {
      case 'BAM':
        if (variant.currency === 'RSD') {
          price = Math.round(price * 0.5); // RSD to BAM conversion
        }
        break;
      case 'EUR':
        if (variant.currency === 'RSD') {
          price = Math.round(price * 0.0085); // RSD to EUR conversion
        } else if (variant.currency === 'BAM') {
          price = Math.round(price * 0.51); // BAM to EUR conversion
        }
        break;
      case 'RSD':
        if (variant.currency === 'BAM') {
          price = Math.round(price * 2); // BAM to RSD conversion
        }
        break;
      default:
        // Keep original price if no conversion available
        break;
    }
  }
  
  return price;
}

// Get product variants with country-specific pricing
export function getProductVariantsForCountry(product: Product, countryCode: string): ProductVariant[] {
  const countryConfig = getCountryConfig(countryCode);
  
  return product.variants.map(variant => {
    // Convert prices to country currency
    let convertedPrice = variant.price;
    let convertedDiscountPrice = variant.discountPrice;
    
    if (variant.currency !== countryConfig.currency) {
      convertedPrice = convertCurrency(variant.price, variant.currency as SupportedCurrency, countryConfig.currency as SupportedCurrency);
      if (variant.discountPrice) {
        convertedDiscountPrice = convertCurrency(variant.discountPrice, variant.currency as SupportedCurrency, countryConfig.currency as SupportedCurrency);
      }
    }
    
    return {
      ...variant,
      price: Math.round(convertedPrice),
      discountPrice: convertedDiscountPrice ? Math.round(convertedDiscountPrice) : undefined,
      currency: countryConfig.currency as 'RSD' | 'BAM' | 'EUR' | 'BGN'
    };
  });
}

// Get a specific variant for a country
export function getProductVariantForCountry(product: Product, countryCode: string, variantId?: string): Product['variants'][0] | undefined {
  const variants = getProductVariantsForCountry(product, countryCode);
  
  if (variantId) {
    return variants.find(v => v.id === variantId);
  }
  
  return variants.find(v => v.isDefault) || variants[0];
}
