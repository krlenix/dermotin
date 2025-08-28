// Import the Testimonial interface from types
import type { Testimonial } from './types';
export type { Testimonial } from './types';
import { getProductsForLocale } from './locales';

// Utility functions for working with testimonials
// Note: Testimonials are now stored in localized product files

export function getTestimonialsForProduct(productTestimonials: Testimonial[]): Testimonial[] {
  return productTestimonials || [];
}

export function getFeaturedTestimonials(productTestimonials: Testimonial[]): Testimonial[] {
  return getTestimonialsForProduct(productTestimonials).filter(t => t.featured);
}

// Get all testimonials for a country from all products
export async function getTestimonialsForCountry(countryCode: string): Promise<Testimonial[]> {
  try {
    const products = await getProductsForLocale(countryCode);
    const allTestimonials: Testimonial[] = [];
    
    Object.values(products).forEach(product => {
      if (product.testimonials) {
        allTestimonials.push(...product.testimonials);
      }
    });
    
    return allTestimonials;
  } catch (error) {
    console.error(`Failed to load testimonials for country ${countryCode}:`, error);
    return [];
  }
}

// Get featured testimonials for a country from all products
export async function getFeaturedTestimonialsForCountry(countryCode: string): Promise<Testimonial[]> {
  const testimonials = await getTestimonialsForCountry(countryCode);
  return testimonials.filter(t => t.featured);
}

// Utility function to shuffle an array (Fisher-Yates shuffle)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get random testimonials for a country from all products
export async function getRandomTestimonialsForCountry(countryCode: string, count?: number): Promise<Testimonial[]> {
  const testimonials = await getTestimonialsForCountry(countryCode);
  const shuffled = shuffleArray(testimonials);
  return count ? shuffled.slice(0, count) : shuffled;
}

// Get random featured testimonials for a country from all products
export async function getRandomFeaturedTestimonialsForCountry(countryCode: string, count?: number): Promise<Testimonial[]> {
  const testimonials = await getFeaturedTestimonialsForCountry(countryCode);
  const shuffled = shuffleArray(testimonials);
  return count ? shuffled.slice(0, count) : shuffled;
}

// Get testimonials for a specific product
export async function getTestimonialsForProductById(productId: string, countryCode: string): Promise<Testimonial[]> {
  try {
    const products = await getProductsForLocale(countryCode);
    const product = products[productId];
    return product?.testimonials || [];
  } catch (error) {
    console.error(`Failed to load testimonials for product ${productId} in country ${countryCode}:`, error);
    return [];
  }
}

// Get random testimonials for a specific product
export async function getRandomTestimonialsForProductById(productId: string, countryCode: string, count?: number): Promise<Testimonial[]> {
  const testimonials = await getTestimonialsForProductById(productId, countryCode);
  const shuffled = shuffleArray(testimonials);
  return count ? shuffled.slice(0, count) : shuffled;
}

// Get featured testimonials for a specific product
export async function getFeaturedTestimonialsForProductById(productId: string, countryCode: string): Promise<Testimonial[]> {
  const testimonials = await getTestimonialsForProductById(productId, countryCode);
  return testimonials.filter(t => t.featured);
}

// Get random featured testimonials for a specific product
export async function getRandomFeaturedTestimonialsForProductById(productId: string, countryCode: string, count?: number): Promise<Testimonial[]> {
  const testimonials = await getFeaturedTestimonialsForProductById(productId, countryCode);
  const shuffled = shuffleArray(testimonials);
  return count ? shuffled.slice(0, count) : shuffled;
}
