import { NextRequest, NextResponse } from 'next/server';
import { COUNTRIES } from '@/config/countries';
import { PRODUCT_CATEGORIES } from '@/config/types';
import { requireAdminApi, jsonError } from '@/lib/admin/api-guard';
import { isFileSystemWritable, readIngredients, readProducts, PRODUCT_LOCALES } from '@/lib/admin/config-io';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET /api/admin/meta → podaci za dashboard i zajednički šifarnici */
export async function GET(request: NextRequest) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  try {
    const perLocale: Record<
      string,
      { productCount: number; bundleCount: number; draftCount: number; testimonialCount: number }
    > = {};

    for (const locale of PRODUCT_LOCALES) {
      const products = await readProducts(locale);
      const list = Object.values(products);
      perLocale[locale] = {
        productCount: list.length,
        bundleCount: list.filter((p) => p.isBundle).length,
        draftCount: list.filter((p) => p.published === false).length,
        testimonialCount: list.reduce((sum, p) => sum + (p.testimonials?.length ?? 0), 0),
      };
    }

    const ingredients = await readIngredients();

    return NextResponse.json({
      success: true,
      locales: PRODUCT_LOCALES,
      perLocale,
      ingredientCount: Object.keys(ingredients).length,
      categories: Object.entries(PRODUCT_CATEGORIES).map(([id, value]) => ({ id, name: value.name })),
      countries: Object.values(COUNTRIES).map((c) => ({ code: c.code, currency: c.currency })),
      fileSystemWritable: await isFileSystemWritable(),
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Greška pri čitanju podataka.', 500);
  }
}
