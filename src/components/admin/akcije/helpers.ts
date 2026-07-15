'use client';

import type { Product, ProductVariant } from '@/config/types';

/** Odgovor GET /api/admin/products?locale=... */
export interface ProductsResponse {
  success: boolean;
  locale: string;
  products: Record<string, Product>;
}

/** Odgovor PUT/POST na /api/admin/products rutama */
export interface ProductSaveResponse {
  success: boolean;
  product: Product;
  complianceWarnings: { field: string; match: string; excerpt: string }[];
}

/** Valuta koja se automatski dodeljuje bundlu po lokalu */
export const LOCALE_CURRENCY: Record<string, ProductVariant['currency']> = {
  rs: 'RSD',
  ba: 'BAM',
  me: 'EUR',
  hr: 'EUR',
};

/** Default varijanta proizvoda (isDefault ili prva) */
export function getDefaultVariant(product: Product): ProductVariant | undefined {
  return product.variants.find((variant) => variant.isDefault) ?? product.variants[0];
}

/** Formatiranje cene za prikaz, npr. „2.390 RSD" */
export function formatPrice(value: number, currency: string): string {
  return `${value.toLocaleString('sr-RS')} ${currency}`;
}

/** kebab-case od naziva, sa transliteracijom srpskih dijakritika (đ → dj, č/ć → c…) */
export function kebabCase(value: string): string {
  return value
    .toLowerCase()
    .replace(/đ/g, 'dj')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Da li string zadovoljava serverski slug regex */
export function isValidSlug(value: string): boolean {
  return SLUG_PATTERN.test(value);
}

/** Poređenje dve liste ID-jeva bez obzira na redosled */
export function sameIds(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const set = new Set(b);
  return a.every((id) => set.has(id));
}

/** Skraćivanje teksta za SEO opis (~150 karaktera, na granici reči) */
export function truncateSeo(text: string, max = 150): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 60 ? lastSpace : max).trimEnd()}…`;
}

/** Proizvodi lokala sortirani po nazivu */
export function sortedProducts(products: Record<string, Product>): Product[] {
  return Object.values(products).sort((a, b) => a.name.localeCompare(b.name, 'sr'));
}
