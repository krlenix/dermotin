import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getProductsForLocale, getProductVariantsForCountry } from '@/config/locales';
import { getCountryConfig } from '@/config/countries';
import type { Product } from '@/config/types';

/**
 * Meta (Facebook/Instagram) product catalog data feed.
 *
 * CSV format per Meta Commerce Manager spec:
 * https://www.facebook.com/business/help/120325381656392
 *
 * Usage: GET /api/meta-catalog?country=rs|ba|me (defaults to rs)
 * Item `id` equals the variant SKU so catalog items match the
 * content_ids sent by the Meta Pixel / CAPI events (required for
 * Advantage+ catalog ads attribution).
 */

const SUPPORTED_COUNTRIES = ['rs', 'ba', 'me'] as const;

const GOOGLE_PRODUCT_CATEGORY: Record<string, string> = {
  skincare: 'Health & Beauty > Personal Care > Cosmetics > Skin Care',
  supplements: 'Health & Beauty > Health Care > Fitness & Nutrition > Vitamins & Supplements',
};

const FB_PRODUCT_CATEGORY: Record<string, string> = {
  skincare: 'health & beauty > skin care',
  supplements: 'health & beauty > vitamins & supplements',
};

function getBaseUrl(request: NextRequest): string {
  const host = request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto') || 'https';
  if (host) return `${protocol}://${host}`;
  return process.env.NEXT_PUBLIC_APP_URL || 'https://dermotin.com';
}

function csvField(value: string): string {
  const clean = value.replace(/\r?\n+/g, ' ').trim();
  return `"${clean.replace(/"/g, '""')}"`;
}

function formatPrice(amount: number, currency: string): string {
  return `${amount.toFixed(2)} ${currency}`;
}

function metaCatalogImage(product: Product, baseUrl: string): string {
  const catalogPath = `/images/meta-catalog/${product.slug}.jpg`;
  try {
    if (fs.existsSync(path.join(process.cwd(), 'public', catalogPath))) {
      return `${baseUrl}${catalogPath}`;
    }
  } catch {
    // fs may be unavailable in some runtimes — fall through to main image
  }
  const main = product.images.main;
  return main.startsWith('http') ? main : `${baseUrl}${main}`;
}

function additionalImages(product: Product, baseUrl: string, mainImage: string): string {
  const urls = [product.images.main, ...product.images.gallery]
    .filter(Boolean)
    .map((img) => (img.startsWith('http') ? img : `${baseUrl}${img}`))
    .filter((url, i, arr) => url !== mainImage && arr.indexOf(url) === i)
    .slice(0, 10); // Meta allows up to 20; keep the feed lean
  return urls.join(',');
}

export async function GET(request: NextRequest) {
  const countryParam = request.nextUrl.searchParams.get('country') || 'rs';
  const country = (SUPPORTED_COUNTRIES as readonly string[]).includes(countryParam)
    ? countryParam
    : null;

  if (!country) {
    return NextResponse.json(
      { error: `Unsupported country "${countryParam}". Use one of: ${SUPPORTED_COUNTRIES.join(', ')}` },
      { status: 400 }
    );
  }

  const baseUrl = getBaseUrl(request);
  const countryConfig = getCountryConfig(country);
  const products = await getProductsForLocale(country);

  const header = [
    'id',
    'title',
    'description',
    'availability',
    'condition',
    'price',
    'sale_price',
    'link',
    'image_link',
    'additional_image_link',
    'brand',
    'google_product_category',
    'fb_product_category',
    'custom_label_0',
  ];

  const rows: string[] = [header.join(',')];

  for (const product of Object.values(products)) {
    if (!product.availableCountries.includes(country)) continue;

    const variants = getProductVariantsForCountry(product, country);
    const defaultVariant = variants.find((v) => v.isDefault) || variants[0];
    if (!defaultVariant) continue;

    const imageLink = metaCatalogImage(product, baseUrl);
    const link = `${baseUrl}/${country}/checkouts/${product.slug}`;
    const title = `${product.name} – ${product.shortDescription}`.slice(0, 150);
    const description = (product.seoDescription || product.description).slice(0, 4999);

    const row = [
      csvField(defaultVariant.sku), // matches pixel/CAPI content_ids
      csvField(title),
      csvField(description),
      csvField('in stock'),
      csvField('new'),
      csvField(formatPrice(defaultVariant.price, countryConfig.currency)),
      defaultVariant.discountPrice
        ? csvField(formatPrice(defaultVariant.discountPrice, countryConfig.currency))
        : csvField(''),
      csvField(link),
      csvField(imageLink),
      csvField(additionalImages(product, baseUrl, imageLink)),
      csvField('DERMOTIN'),
      csvField(GOOGLE_PRODUCT_CATEGORY[product.category] || GOOGLE_PRODUCT_CATEGORY.skincare),
      csvField(FB_PRODUCT_CATEGORY[product.category] || FB_PRODUCT_CATEGORY.skincare),
      csvField(product.category),
    ];

    rows.push(row.join(','));
  }

  return new NextResponse(rows.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `inline; filename="dermotin-meta-catalog-${country}.csv"`,
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
