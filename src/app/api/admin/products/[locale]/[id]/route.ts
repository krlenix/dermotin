import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/config/types';
import { requireAdminApi, jsonError } from '@/lib/admin/api-guard';
import { checkProductCompliance } from '@/lib/admin/compliance';
import { isProductLocale, readProducts, writeProducts } from '@/lib/admin/config-io';
import { productSchema } from '@/lib/admin/schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteContext = { params: Promise<{ locale: string; id: string }> };

/** GET /api/admin/products/{locale}/{id} → jedan proizvod + compliance upozorenja */
export async function GET(request: NextRequest, context: RouteContext) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  const { locale, id } = await context.params;
  if (!isProductLocale(locale)) return jsonError(`Nepoznat lokal "${locale}".`);

  try {
    const products = await readProducts(locale);
    const product = products[id];
    if (!product) return jsonError(`Proizvod "${id}" ne postoji u lokalu ${locale}.`, 404);
    return NextResponse.json({
      success: true,
      product,
      complianceWarnings: checkProductCompliance(product),
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Greška pri čitanju proizvoda.', 500);
  }
}

/** PUT /api/admin/products/{locale}/{id} → snima izmene proizvoda */
export async function PUT(request: NextRequest, context: RouteContext) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  const { locale, id } = await context.params;
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
  if (product.id !== id) {
    return jsonError(`ID proizvoda ne može da se menja ("${product.id}" ≠ "${id}").`);
  }

  try {
    const products = await readProducts(locale);
    if (!products[id]) return jsonError(`Proizvod "${id}" ne postoji u lokalu ${locale}.`, 404);

    const slugTaken = Object.values(products).some(
      (existing) =>
        existing.id !== id && (existing.slug === product.slug || existing.alternativeSlugs.includes(product.slug))
    );
    if (slugTaken) {
      return jsonError(`Slug "${product.slug}" je već zauzet drugim proizvodom u lokalu ${locale}.`, 409);
    }

    const updated = { ...products, [id]: product };
    await writeProducts(locale, updated);
    return NextResponse.json({
      success: true,
      product,
      complianceWarnings: checkProductCompliance(product),
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Greška pri snimanju proizvoda.', 500);
  }
}

/** DELETE /api/admin/products/{locale}/{id} → briše proizvod iz kataloga lokala */
export async function DELETE(request: NextRequest, context: RouteContext) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  const { locale, id } = await context.params;
  if (!isProductLocale(locale)) return jsonError(`Nepoznat lokal "${locale}".`);

  try {
    const products = await readProducts(locale);
    if (!products[id]) return jsonError(`Proizvod "${id}" ne postoji u lokalu ${locale}.`, 404);

    // Ne dozvoli brisanje ako ga drugi proizvodi referenciraju
    const referencedBy = Object.values(products).filter(
      (p) =>
        p.id !== id &&
        (p.crossSells?.includes(id) ||
          p.upsells?.products.includes(id) ||
          p.bundleItems?.some((item) => item.productId === id))
    );
    if (referencedBy.length > 0) {
      return jsonError(
        `Proizvod "${id}" referenciraju: ${referencedBy.map((p) => p.id).join(', ')}. Prvo ukloni te veze.`,
        409
      );
    }

    const remaining: Record<string, Product> = {};
    for (const [key, value] of Object.entries(products)) {
      if (key !== id) remaining[key] = value;
    }
    await writeProducts(locale, remaining);
    return NextResponse.json({ success: true });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Greška pri brisanju proizvoda.', 500);
  }
}
