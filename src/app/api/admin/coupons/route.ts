import { NextRequest, NextResponse } from 'next/server';
import type { Coupon } from '@/config/coupons';
import { requireAdminApi, jsonError } from '@/lib/admin/api-guard';
import { readBogoConfig, readCoupons, writeCoupons } from '@/lib/admin/config-io';
import { couponSchema } from '@/lib/admin/schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET /api/admin/coupons → svi statički kuponi + BOGO konfiguracija */
export async function GET(request: NextRequest) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  try {
    const [coupons, bogo] = await Promise.all([readCoupons(), readBogoConfig()]);
    return NextResponse.json({ success: true, coupons, bogo });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Greška pri čitanju kupona.', 500);
  }
}

/** POST /api/admin/coupons → kreira nov kupon */
export async function POST(request: NextRequest) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError('Telo zahteva nije validan JSON.');
  }

  const parsed = couponSchema.safeParse(body);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
    return NextResponse.json({ success: false, error: 'Kupon nije validan.', issues }, { status: 422 });
  }
  const coupon = parsed.data as Coupon;

  try {
    const coupons = await readCoupons();
    if (coupons[coupon.code]) {
      return jsonError(`Kupon "${coupon.code}" već postoji.`, 409);
    }
    await writeCoupons({ ...coupons, [coupon.code]: coupon });
    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Greška pri snimanju kupona.', 500);
  }
}
