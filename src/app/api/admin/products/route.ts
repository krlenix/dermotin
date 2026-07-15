import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi, jsonError } from '@/lib/admin/api-guard';
import { isProductLocale, readProducts, PRODUCT_LOCALES } from '@/lib/admin/config-io';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET /api/admin/products?locale=rs → kompletan katalog za lokal */
export async function GET(request: NextRequest) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  const locale = request.nextUrl.searchParams.get('locale') ?? 'rs';
  if (!isProductLocale(locale)) {
    return jsonError(`Nepoznat lokal "${locale}". Podržani: ${PRODUCT_LOCALES.join(', ')}.`);
  }

  try {
    const products = await readProducts(locale);
    return NextResponse.json({ success: true, locale, products });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Greška pri čitanju proizvoda.', 500);
  }
}
