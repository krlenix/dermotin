import type { BundleItem, Product, ProductFAQ, ProductVariant, Testimonial } from '@/config/types';

/**
 * Draft reprezentacija proizvoda za editor formu: sva brojevna polja su stringovi
 * (radi kontrolisanih inputa), opciona polja su prazni stringovi/nizovi.
 * `draftToProduct` čisti podatke pre slanja na server (trim, prazno → undefined,
 * Number() konverzije) tako da prođu zod .strict() validaciju.
 */

export type Currency = ProductVariant['currency'];

export const CURRENCIES: Currency[] = ['RSD', 'BAM', 'EUR', 'BGN'];

export const LOCALE_DEFAULT_CURRENCY: Record<string, Currency> = {
  rs: 'RSD',
  ba: 'BAM',
  me: 'EUR',
  hr: 'EUR',
};

export const COUNTRY_LABELS: Record<string, string> = {
  rs: 'Srbija',
  ba: 'Bosna i Hercegovina',
  me: 'Crna Gora',
  hr: 'Hrvatska',
};

export const FAQ_CATEGORY_LABELS: Record<ProductFAQ['category'], string> = {
  usage: 'Upotreba',
  ingredients: 'Sastojci',
  effects: 'Dejstvo',
  safety: 'Bezbednost',
  storage: 'Čuvanje',
  general: 'Opšte',
};

export interface VariantDraft {
  id: string;
  sku: string;
  name: string;
  size: string;
  quantity: string;
  price: string;
  discountPrice: string;
  currency: Currency;
  isDefault: boolean;
}

export interface TestimonialDraft {
  id: string;
  name: string;
  city: string;
  rating: number;
  text: string;
  verified: boolean;
  productUsed: string;
  dateAdded: string;
  featured: boolean;
  likes: string;
  /** Polja koja editor ne uređuje ali ih čuva pri round-trip-u */
  image?: string;
  beforeAfter?: { before: string; after: string };
}

export interface FAQDraft {
  question: string;
  answer: string;
  category: ProductFAQ['category'];
}

export interface BundleItemDraft {
  productId: string;
  /** '' = podrazumevana varijanta proizvoda */
  variantId: string;
  quantity: string;
}

export interface ProductDraft {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  heroTitle: string;
  purpose: string;
  category: string;
  images: { main: string; gallery: string[]; thumbnail: string; fallback: string };
  variants: VariantDraft[];
  benefits: string[];
  ingredients: string[];
  ingredientDescriptions: Record<string, string>;
  usage: string;
  usageSteps: string[];
  warnings: string[];
  slug: string;
  alternativeSlugs: string[];
  availableCountries: string[];
  seoTitle: string;
  seoDescription: string;
  urgency: { limitedStock: string; limitedTime: string; recentPurchases: string; timeFrame: string };
  upsellProducts: string[];
  upsellDiscountPercentage: string;
  upsellBundlePrice: string;
  crossSells: string[];
  productFAQ: FAQDraft[];
  testimonials: TestimonialDraft[];
  published: boolean;
  isBundle: boolean;
  bundleItems: BundleItemDraft[];
}

/* ── mali helperi ─────────────────────────────────────────────────────── */

const numToStr = (value: number | undefined): string => (value === undefined || value === null ? '' : String(value));

/** '' → undefined, inače Number() (NaN → undefined da server prijavi grešku tipa umesto NaN u JSON-u) */
const optNum = (value: string): number | undefined => {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const reqNum = (value: string): number => {
  const parsed = Number(value.trim());
  return Number.isFinite(parsed) ? parsed : 0;
};

const optStr = (value: string): string | undefined => {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

/** Trim svake stavke + izbacivanje praznih */
const cleanList = (list: string[]): string[] => list.map((item) => item.trim()).filter((item) => item.length > 0);

/* ── prazni šabloni ───────────────────────────────────────────────────── */

export function emptyVariantDraft(currency: Currency, index: number): VariantDraft {
  return {
    id: `variant-${index}`,
    sku: '',
    name: '',
    size: '',
    quantity: '',
    price: '',
    discountPrice: '',
    currency,
    isDefault: false,
  };
}

export function emptyDraft(locale: string): ProductDraft {
  const currency = LOCALE_DEFAULT_CURRENCY[locale] ?? 'RSD';
  return {
    id: '',
    name: '',
    description: '',
    shortDescription: '',
    heroTitle: '',
    purpose: '',
    category: '',
    images: { main: '', gallery: [], thumbnail: '', fallback: '' },
    variants: [{ ...emptyVariantDraft(currency, 1), isDefault: true }],
    benefits: [],
    ingredients: [],
    ingredientDescriptions: {},
    usage: '',
    usageSteps: [],
    warnings: [],
    slug: '',
    alternativeSlugs: [],
    availableCountries: [locale],
    seoTitle: '',
    seoDescription: '',
    urgency: { limitedStock: '', limitedTime: '', recentPurchases: '', timeFrame: '' },
    upsellProducts: [],
    upsellDiscountPercentage: '',
    upsellBundlePrice: '',
    crossSells: [],
    productFAQ: [],
    testimonials: [],
    published: false,
    isBundle: false,
    bundleItems: [],
  };
}

export function emptyTestimonialDraft(productName: string): TestimonialDraft {
  return {
    id: `t${Date.now()}`,
    name: '',
    city: '',
    rating: 5,
    text: '',
    verified: false,
    productUsed: productName,
    dateAdded: new Date().toISOString().slice(0, 10),
    featured: false,
    likes: '',
  };
}

/* ── Product → Draft ──────────────────────────────────────────────────── */

export function productToDraft(product: Product): ProductDraft {
  // Normalizuj default varijantu: tačno jedna (prva označena, inače prva u nizu)
  const defaultIndex = Math.max(
    0,
    product.variants.findIndex((variant) => variant.isDefault === true)
  );

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    shortDescription: product.shortDescription,
    heroTitle: product.heroTitle,
    purpose: product.purpose,
    category: product.category,
    images: {
      main: product.images.main,
      gallery: [...product.images.gallery],
      thumbnail: product.images.thumbnail,
      fallback: product.images.fallback ?? '',
    },
    variants: product.variants.map((variant, index) => ({
      id: variant.id,
      sku: variant.sku,
      name: variant.name,
      size: variant.size ?? '',
      quantity: numToStr(variant.quantity),
      price: numToStr(variant.price),
      discountPrice: numToStr(variant.discountPrice),
      currency: variant.currency,
      isDefault: index === defaultIndex,
    })),
    benefits: [...product.benefits],
    ingredients: [...product.ingredients],
    ingredientDescriptions: { ...(product.ingredientDescriptions ?? {}) },
    usage: product.usage,
    usageSteps: [...(product.usageSteps ?? [])],
    warnings: [...product.warnings],
    slug: product.slug,
    alternativeSlugs: [...product.alternativeSlugs],
    availableCountries: [...product.availableCountries],
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    urgency: {
      limitedStock: numToStr(product.urgencyElements.limitedStock),
      limitedTime: product.urgencyElements.limitedTime ?? '',
      recentPurchases: numToStr(product.urgencyElements.socialProof?.recentPurchases),
      timeFrame: product.urgencyElements.socialProof?.timeFrame ?? '',
    },
    upsellProducts: [...(product.upsells?.products ?? [])],
    upsellDiscountPercentage: numToStr(product.upsells?.discountPercentage),
    upsellBundlePrice: numToStr(product.upsells?.bundlePrice),
    crossSells: [...(product.crossSells ?? [])],
    productFAQ: (product.productFAQ ?? []).map((faq) => ({ ...faq })),
    testimonials: (product.testimonials ?? []).map((testimonial) => ({
      id: testimonial.id,
      name: testimonial.name,
      city: testimonial.city,
      rating: testimonial.rating,
      text: testimonial.text,
      verified: testimonial.verified,
      productUsed: testimonial.productUsed,
      dateAdded: testimonial.dateAdded,
      featured: testimonial.featured === true,
      likes: numToStr(testimonial.likes),
      ...(testimonial.image ? { image: testimonial.image } : {}),
      ...(testimonial.beforeAfter ? { beforeAfter: { ...testimonial.beforeAfter } } : {}),
    })),
    published: product.published !== false,
    isBundle: product.isBundle === true,
    bundleItems: (product.bundleItems ?? []).map((item) => ({
      productId: item.productId,
      variantId: item.variantId ?? '',
      quantity: numToStr(item.quantity),
    })),
  };
}

/* ── Draft → Product (čišćenje pre slanja) ────────────────────────────── */

export function draftToProduct(draft: ProductDraft): Product {
  // Override opisi sastojaka: samo neprazne vrednosti i samo za selektovane sastojke
  const ingredientDescriptions: Record<string, string> = {};
  for (const [ingredientId, text] of Object.entries(draft.ingredientDescriptions)) {
    const trimmed = text.trim();
    if (trimmed && draft.ingredients.includes(ingredientId)) {
      ingredientDescriptions[ingredientId] = trimmed;
    }
  }

  const recentPurchases = optNum(draft.urgency.recentPurchases);
  const timeFrame = optStr(draft.urgency.timeFrame);
  const hasSocialProof = recentPurchases !== undefined && timeFrame !== undefined;

  const upsellProducts = cleanList(draft.upsellProducts);

  const productFAQ: ProductFAQ[] = draft.productFAQ
    .map((faq) => ({ question: faq.question.trim(), answer: faq.answer.trim(), category: faq.category }))
    .filter((faq) => faq.question.length > 0 || faq.answer.length > 0);

  const testimonials: Testimonial[] = draft.testimonials.map((testimonial) => {
    const likes = optNum(testimonial.likes);
    return {
      id: testimonial.id.trim(),
      name: testimonial.name.trim(),
      city: testimonial.city.trim(),
      rating: testimonial.rating,
      text: testimonial.text.trim(),
      verified: testimonial.verified,
      ...(testimonial.image ? { image: testimonial.image } : {}),
      ...(testimonial.beforeAfter ? { beforeAfter: testimonial.beforeAfter } : {}),
      productUsed: testimonial.productUsed.trim(),
      dateAdded: testimonial.dateAdded.trim(),
      ...(testimonial.featured ? { featured: true } : {}),
      ...(likes !== undefined ? { likes } : {}),
    };
  });

  const bundleItems: BundleItem[] = draft.bundleItems
    .filter((item) => item.productId.trim().length > 0)
    .map((item) => {
      const variantId = optStr(item.variantId);
      return {
        productId: item.productId.trim(),
        ...(variantId !== undefined ? { variantId } : {}),
        quantity: optNum(item.quantity) ?? 1,
      };
    });

  const usageSteps = cleanList(draft.usageSteps);
  const crossSells = cleanList(draft.crossSells);
  const limitedStock = optNum(draft.urgency.limitedStock);
  const limitedTime = optStr(draft.urgency.limitedTime);
  const upsellDiscountPercentage = optNum(draft.upsellDiscountPercentage);
  const upsellBundlePrice = optNum(draft.upsellBundlePrice);

  return {
    id: draft.id.trim(),
    name: draft.name.trim(),
    description: draft.description.trim(),
    shortDescription: draft.shortDescription.trim(),
    heroTitle: draft.heroTitle.trim(),
    purpose: draft.purpose.trim(),
    category: draft.category.trim(),
    images: {
      main: draft.images.main.trim(),
      gallery: cleanList(draft.images.gallery),
      thumbnail: draft.images.thumbnail.trim(),
      ...(optStr(draft.images.fallback) !== undefined ? { fallback: draft.images.fallback.trim() } : {}),
    },
    variants: draft.variants.map((variant) => {
      const size = optStr(variant.size);
      const quantity = optNum(variant.quantity);
      const discountPrice = optNum(variant.discountPrice);
      return {
        id: variant.id.trim(),
        sku: variant.sku.trim(),
        name: variant.name.trim(),
        ...(size !== undefined ? { size } : {}),
        ...(quantity !== undefined ? { quantity } : {}),
        price: reqNum(variant.price),
        currency: variant.currency,
        ...(discountPrice !== undefined ? { discountPrice } : {}),
        ...(variant.isDefault ? { isDefault: true } : {}),
      };
    }),
    benefits: cleanList(draft.benefits),
    ingredients: cleanList(draft.ingredients),
    usage: draft.usage.trim(),
    ...(usageSteps.length > 0 ? { usageSteps } : {}),
    warnings: cleanList(draft.warnings),
    slug: draft.slug.trim(),
    // alternativeSlugs je obavezno polje u tipu — sme da bude prazan niz
    alternativeSlugs: cleanList(draft.alternativeSlugs),
    availableCountries: [...draft.availableCountries],
    seoTitle: draft.seoTitle.trim(),
    seoDescription: draft.seoDescription.trim(),
    urgencyElements: {
      ...(limitedStock !== undefined ? { limitedStock } : {}),
      ...(limitedTime !== undefined ? { limitedTime } : {}),
      ...(hasSocialProof ? { socialProof: { recentPurchases, timeFrame } } : {}),
    },
    ...(upsellProducts.length > 0
      ? {
          upsells: {
            products: upsellProducts,
            ...(upsellDiscountPercentage !== undefined ? { discountPercentage: upsellDiscountPercentage } : {}),
            ...(upsellBundlePrice !== undefined ? { bundlePrice: upsellBundlePrice } : {}),
          },
        }
      : {}),
    ...(crossSells.length > 0 ? { crossSells } : {}),
    ...(productFAQ.length > 0 ? { productFAQ } : {}),
    ...(testimonials.length > 0 ? { testimonials } : {}),
    published: draft.published,
    ...(draft.isBundle ? { isBundle: true } : {}),
    ...(draft.isBundle && bundleItems.length > 0 ? { bundleItems } : {}),
    ...(Object.keys(ingredientDescriptions).length > 0 ? { ingredientDescriptions } : {}),
  };
}
