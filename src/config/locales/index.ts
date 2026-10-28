import { Product, ProductFAQ, ProductVariant } from '../types';
import { getCountryConfig, convertCurrency, SupportedCurrency } from '../countries';

// Draft proizvodi (published: false) su vidljivi samo u admin panelu,
// nikada na javnom sajtu (stranice, sitemap, feed-ovi, korpa).
function onlyPublished(products: Record<string, Product>): Record<string, Product> {
  const published: Record<string, Product> = {};
  for (const [key, product] of Object.entries(products)) {
    if (product.published !== false) {
      published[key] = product;
    }
  }
  return published;
}

// Dynamic imports for locale-specific products
export async function getProductsForLocale(locale: string, includeDrafts = false): Promise<Record<string, Product>> {
  try {
    switch (locale) {
      case 'rs':
        const { PRODUCTS: rsProducts } = await import('./rs/products');
        return includeDrafts ? rsProducts : onlyPublished(rsProducts);
      case 'ba':
        const { PRODUCTS: baProducts } = await import('./ba/products');
        return includeDrafts ? baProducts : onlyPublished(baProducts);
      case 'me':
        const { PRODUCTS: meProducts } = await import('./me/products');
        return includeDrafts ? meProducts : onlyPublished(meProducts);
      default:
        // Fallback to Serbian
        const { PRODUCTS: defaultProducts } = await import('./rs/products');
        return includeDrafts ? defaultProducts : onlyPublished(defaultProducts);
    }
  } catch (error) {
    console.error(`Failed to load products for locale ${locale}:`, error);
    // Fallback to Serbian products
    const { PRODUCTS: fallbackProducts } = await import('./rs/products');
    return includeDrafts ? fallbackProducts : onlyPublished(fallbackProducts);
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

/** Proizvod se prikazuje u izlogu (liste, sitemap, feed-ovi, preporuke). */
export function isStorefrontProduct(product: Product): boolean {
  return product.hidden !== true && !product.salesChannel;
}

export async function getProductsForCountry(countryCode: string, locale: string = 'rs'): Promise<Product[]> {
  const products = await getProductsForLocale(locale);
  return Object.values(products).filter(
    product => product.availableCountries.includes(countryCode) && isStorefrontProduct(product)
  );
}

export type StorefrontProductResolution =
  | { kind: 'product'; product: Product }
  | { kind: 'redirect'; slug: string }
  | { kind: 'missing' };

/**
 * Javne stranice proizvoda: skriveni proizvodi (npr. BIOROID pojedinačno, FUNGOMAX)
 * preusmeravaju na zamenski set da stari oglasi i linkovi i dalje prodaju.
 * Kanalske ponude (Viber) ne postoje na /products i /checkouts rutama.
 */
export async function resolveStorefrontProduct(slug: string, locale: string): Promise<StorefrontProductResolution> {
  const product = await getProductBySlug(slug, locale);
  if (!product || !product.availableCountries.includes(locale)) return { kind: 'missing' };
  if (isStorefrontProduct(product)) return { kind: 'product', product };
  if (product.replacedBy) {
    const products = await getProductsForLocale(locale);
    const replacement = products[product.replacedBy];
    if (replacement && isStorefrontProduct(replacement) && replacement.availableCountries.includes(locale)) {
      return { kind: 'redirect', slug: replacement.slug };
    }
  }
  return { kind: 'missing' };
}

export function getProductFAQ(product: Product): ProductFAQ[] {
  return product.productFAQ || [];
}

export function getProductFAQByCategory(product: Product, category: string): ProductFAQ[] {
  const faqs = product.productFAQ || [];
  return faqs.filter((item: ProductFAQ) => item.category === category);
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
      price: Math.round(convertedPrice * 10) / 10, // Round to 1 decimal place
      discountPrice: convertedDiscountPrice ? Math.round(convertedDiscountPrice * 10) / 10 : undefined,
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
