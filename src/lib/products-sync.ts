import crypto from 'crypto';
import { Product, ProductVariant } from '@/config/types';

export interface ProductsSyncImage {
  src: string;
}

export interface ProductsSyncAttribute {
  name: string;
  option: string;
}

export interface ProductsSyncVariation {
  id: string;
  sku: string;
  price: string;
  attributes: ProductsSyncAttribute[];
}

export interface ProductsSyncProduct {
  id: string;
  name: string;
  type: 'simple' | 'variable';
  status: 'publish';
  sku: string;
  price: string;
  description: string;
  images: ProductsSyncImage[];
  product_variations?: ProductsSyncVariation[];
}

/**
 * Deterministic ~13 digit ID (Shopify-style) from any string identifier.
 */
export function stringToSyncId(value: string): string {
  const hex = crypto.createHash('sha256').update(value).digest('hex');
  const last44bits = hex.slice(-11);
  return BigInt(`0x${last44bits}`).toString();
}

function getAppUrlFromRequest(request: Request): string {
  const host = request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto') || 'https';

  if (host) {
    return `${protocol}://${host}`;
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }

  throw new Error('Unable to determine app URL for product image resolution.');
}

function toAbsoluteImageUrl(url: string, baseUrl: string): string | null {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  if (url.startsWith('/')) {
    return `${baseUrl}${url}`;
  }

  return null;
}

function collectProductImages(product: Product, baseUrl: string): ProductsSyncImage[] {
  const candidates = [
    product.images.main,
    product.images.thumbnail,
    product.images.fallback,
    ...product.images.gallery,
  ].filter(Boolean);

  const seen = new Set<string>();

  return candidates.reduce<ProductsSyncImage[]>((images, candidate) => {
    const absoluteUrl = toAbsoluteImageUrl(candidate, baseUrl);
    if (!absoluteUrl || seen.has(absoluteUrl)) {
      return images;
    }

    seen.add(absoluteUrl);
    images.push({ src: absoluteUrl });
    return images;
  }, []);
}

function formatDescription(description: string): string {
  const trimmed = description.trim();
  if (!trimmed) {
    return '';
  }

  if (trimmed.startsWith('<')) {
    return trimmed;
  }

  return `<p>${trimmed}</p>`;
}

function getVariantPrice(variant: ProductVariant): string {
  return String(variant.discountPrice ?? variant.price ?? 0);
}

function getVariationSku(variant: ProductVariant): string {
  return variant.id.toUpperCase();
}

function getVariationAttributes(variant: ProductVariant): ProductsSyncAttribute[] {
  const attributes: ProductsSyncAttribute[] = [];

  if (variant.name) {
    attributes.push({ name: 'Pakovanje', option: variant.name });
  }

  if (variant.quantity) {
    attributes.push({ name: 'Količina', option: String(variant.quantity) });
  }

  if (variant.size) {
    attributes.push({ name: 'Veličina', option: variant.size });
  }

  return attributes;
}

function mapVariableProduct(
  product: Product,
  images: ProductsSyncImage[],
  description: string,
  productId: string,
  variants: ProductVariant[],
  allVariationIds: string[],
): ProductsSyncProduct {
  const productVariations = variants.map((variant) => {
    const variantId = stringToSyncId(`${product.id}:${variant.id}`);
    allVariationIds.push(variantId);

    return {
      id: variantId,
      sku: getVariationSku(variant),
      price: getVariantPrice(variant),
      attributes: getVariationAttributes(variant),
    };
  });

  return {
    id: productId,
    name: product.name,
    type: 'variable',
    status: 'publish',
    sku: '',
    price: '',
    description,
    images,
    product_variations: productVariations,
  };
}

function mapSimpleProduct(
  product: Product,
  images: ProductsSyncImage[],
  description: string,
  productId: string,
  variant?: ProductVariant,
): ProductsSyncProduct {
  return {
    id: productId,
    name: product.name,
    type: 'simple',
    status: 'publish',
    sku: variant?.sku || `PROD-${productId}`,
    price: variant ? getVariantPrice(variant) : '0',
    description,
    images,
  };
}

export function mapProductsToSyncFormat(
  products: Record<string, Product>,
  request: Request,
): ProductsSyncProduct[] {
  const baseUrl = getAppUrlFromRequest(request);
  const allProductIds: string[] = [];
  const allVariationIds: string[] = [];

  const syncProducts = Object.values(products).map((product) => {
    const productId = stringToSyncId(product.id);
    allProductIds.push(productId);

    const images = collectProductImages(product, baseUrl);
    const description = formatDescription(product.description);
    const variants = product.variants ?? [];
    const isVariable = variants.length > 1;

    if (isVariable) {
      return mapVariableProduct(
        product,
        images,
        description,
        productId,
        variants,
        allVariationIds,
      );
    }

    return mapSimpleProduct(
      product,
      images,
      description,
      productId,
      variants[0],
    );
  });

  if (new Set(allProductIds).size !== allProductIds.length) {
    throw new Error('Product ID collision detected');
  }

  if (new Set(allVariationIds).size !== allVariationIds.length) {
    throw new Error('Variation ID collision detected');
  }

  return syncProducts;
}
