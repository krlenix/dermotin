import { z } from 'zod';

/**
 * Zod šeme za validaciju podataka koje admin panel upisuje u config fajlove.
 * Moraju da prate interfejse iz src/config/types.ts — .strict() hvata
 * greške u kucanju polja pre nego što pokvare TypeScript build.
 */

export const testimonialSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    city: z.string().min(1),
    rating: z.number().min(1).max(5),
    text: z.string().min(1),
    verified: z.boolean(),
    image: z.string().optional(),
    beforeAfter: z.object({ before: z.string(), after: z.string() }).strict().optional(),
    productUsed: z.string().min(1),
    dateAdded: z.string().min(1),
    featured: z.boolean().optional(),
    likes: z.number().int().nonnegative().optional(),
  })
  .strict();

export const productVariantSchema = z
  .object({
    id: z.string().min(1),
    sku: z.string().min(1),
    name: z.string().min(1),
    size: z.string().optional(),
    quantity: z.number().int().positive().optional(),
    price: z.number().nonnegative(),
    currency: z.enum(['RSD', 'BAM', 'EUR', 'BGN']),
    discountPrice: z.number().nonnegative().optional(),
    isDefault: z.boolean().optional(),
  })
  .strict();

export const productFAQSchema = z
  .object({
    question: z.string().min(1),
    answer: z.string().min(1),
    category: z.enum(['usage', 'ingredients', 'effects', 'safety', 'storage', 'general']),
  })
  .strict();

export const bundleItemSchema = z
  .object({
    productId: z.string().min(1),
    variantId: z.string().optional(),
    quantity: z.number().int().positive(),
  })
  .strict();

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const productSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    description: z.string().min(1),
    shortDescription: z.string().min(1),
    heroTitle: z.string().min(1),
    purpose: z.string().min(1),
    category: z.string().min(1),
    images: z
      .object({
        main: z.string().min(1),
        gallery: z.array(z.string().min(1)),
        thumbnail: z.string().min(1),
        fallback: z.string().optional(),
      })
      .strict(),
    variants: z.array(productVariantSchema).min(1),
    benefits: z.array(z.string().min(1)),
    ingredients: z.array(z.string().min(1)),
    usage: z.string().min(1),
    usageSteps: z.array(z.string().min(1)).optional(),
    warnings: z.array(z.string().min(1)),
    slug: z.string().regex(slugPattern, 'Slug sme da sadrži samo mala slova, brojeve i crtice'),
    alternativeSlugs: z.array(z.string().regex(slugPattern, 'Slug sme da sadrži samo mala slova, brojeve i crtice')),
    availableCountries: z.array(z.enum(['rs', 'ba', 'me', 'hr'])),
    seoTitle: z.string().min(1),
    seoDescription: z.string().min(1),
    urgencyElements: z
      .object({
        limitedStock: z.number().int().nonnegative().optional(),
        limitedTime: z.string().optional(),
        socialProof: z
          .object({
            recentPurchases: z.number().int().nonnegative(),
            timeFrame: z.string().min(1),
          })
          .strict()
          .optional(),
      })
      .strict(),
    upsells: z
      .object({
        products: z.array(z.string().min(1)),
        discountPercentage: z.number().nonnegative().optional(),
        bundlePrice: z.number().nonnegative().optional(),
      })
      .strict()
      .optional(),
    crossSells: z.array(z.string().min(1)).optional(),
    productFAQ: z.array(productFAQSchema).optional(),
    testimonials: z.array(testimonialSchema).optional(),
    published: z.boolean().optional(),
    isBundle: z.boolean().optional(),
    bundleItems: z.array(bundleItemSchema).optional(),
    ingredientDescriptions: z.record(z.string(), z.string().min(1)).optional(),
  })
  .strict();

export const ingredientSchema = z
  .object({
    id: z.string().min(1),
    inciName: z.string().min(1),
    serbianName: z.string().min(1),
    bulgarianName: z.string().optional(),
    description: z.string().min(1),
    bulgarianDescription: z.string().optional(),
    category: z.enum(['herbal_extract', 'essential_oil', 'active_compound', 'base_component', 'preservative', 'other']),
  })
  .strict();

export const couponSchema = z
  .object({
    code: z.string().regex(/^[A-Z0-9_-]+$/, 'Kod sme da sadrži samo velika slova, brojeve, crtice i donje crte'),
    type: z.enum(['absolute', 'percentage', 'free_shipping', 'bogo']),
    value: z.number().nonnegative(),
    description: z.string().optional(),
    minOrderValue: z.number().nonnegative().optional(),
    maxDiscount: z.number().nonnegative().optional(),
    validUntil: z.string().optional(),
    countries: z.array(z.enum(['rs', 'ba', 'me', 'hr'])).optional(),
    enabled: z.boolean(),
  })
  .strict();

export const bogoConfigSchema = z
  .object({
    enabled: z.boolean(),
    couponCode: z.string().min(1),
    expirationDate: z.string().min(1),
    maxQuantity: z.number().int().positive(),
    configVersion: z.number().int().positive(),
  })
  .strict();

export type ProductInput = z.infer<typeof productSchema>;
export type IngredientInput = z.infer<typeof ingredientSchema>;
export type CouponInput = z.infer<typeof couponSchema>;
