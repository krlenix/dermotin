import { NextRequest, NextResponse } from 'next/server';
import { getProductsForLocale } from '@/config/locales';
import { mapProductsToSyncFormat } from '@/lib/products-sync';

const SUPPORTED_LOCALES = new Set(['rs', 'ba', 'me']);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'rs';

  if (!SUPPORTED_LOCALES.has(locale)) {
    return NextResponse.json({ error: 'Unsupported locale' }, { status: 400 });
  }

  try {
    const products = await getProductsForLocale(locale);
    const syncProducts = mapProductsToSyncFormat(products, request);

    return NextResponse.json(syncProducts, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Products sync error:', error);

    const message = error instanceof Error ? error.message : 'Failed to sync products';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
