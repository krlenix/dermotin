// Re-export types and utilities from the new localized structure
export type { Product, ProductVariant, ProductFAQ } from './types';
export { PRODUCT_CATEGORIES } from './types';
export { INGREDIENTS } from './ingredients';

// Re-export localized functions
export {
  getProductsForLocale,
  getProduct,
  getProductBySlug,
  getProductsForCountry,
  getProductFAQ,
  getProductFAQByCategory,
  getProductPrice,
  getProductVariantsForCountry,
  getProductVariantForCountry
} from './locales';