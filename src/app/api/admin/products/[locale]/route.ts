import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/config/types';
import { requireAdminApi, jsonError } from '@/lib/admin/api-guard';
import { checkProductCompliance } from '@/lib/admin/compliance';
import { isProductLocale, readProducts, writeProducts } from '@/lib/admin/config-io';
import { productSchema } from '@/lib/admin/schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** POST /api/admin/products/{locale} → kreira nov proizvod (ili bundle) u katalogu lokala */
export async function POST(request: NextRequest, context: { params: Promise<{ locale: string }> }) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  const { locale } = await context.params;
  if (!isProductLocale(locale)) return jsonError(`Nepoznat lokal "${locale}".`);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError('Telo zahteva nije validan JSON.');
  }

  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
    return NextResponse.json({ success: false, error: 'Proizvod nije validan.', issues }, { status: 422 });
  }
  const product = parsed.data as Product;

  try {
    const products = await readProducts(locale);
    if (products[product.id]) {
      return jsonError(`Proizvod sa ID "${product.id}" već postoji u lokalu ${locale}.`, 409);
    }
    const slugTaken = Object.values(products).some(
      (existing) => existing.slug === product.slug || existing.alternativeSlugs.includes(product.slug)
    );
    if (slugTaken) {
      return jsonError(`Slug "${product.slug}" je već zauzet u lokalu ${locale}.`, 409);
    }

    await writeProducts(locale, { ...products, [product.id]: product });
    return NextResponse.json({
      success: true,
      product,
      complianceWarnings: checkProductCompliance(product),
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Greška pri snimanju proizvoda.', 500);
  }
}
