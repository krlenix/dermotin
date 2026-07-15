import { NextRequest, NextResponse } from 'next/server';
import type { Coupon } from '@/config/coupons';
import { requireAdminApi, jsonError } from '@/lib/admin/api-guard';
import { readBogoConfig, readCoupons, writeCoupons } from '@/lib/admin/config-io';
import { couponSchema } from '@/lib/admin/schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteContext = { params: Promise<{ code: string }> };

/** PUT /api/admin/coupons/{code} → snima izmene kupona (uklj. enable/disable) */
export async function PUT(request: NextRequest, context: RouteContext) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  const { code } = await context.params;

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
  if (coupon.code !== code) {
    return jsonError(`Kod kupona ne može da se menja ("${coupon.code}" ≠ "${code}").`);
  }

  try {
    const coupons = await readCoupons();
    if (!coupons[code]) return jsonError(`Kupon "${code}" ne postoji.`, 404);
    await writeCoupons({ ...coupons, [code]: coupon });
    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Greška pri snimanju kupona.', 500);
  }
}

/** DELETE /api/admin/coupons/{code} → briše kupon */
export async function DELETE(request: NextRequest, context: RouteContext) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  const { code } = await context.params;

  try {
    const coupons = await readCoupons();
    if (!coupons[code]) return jsonError(`Kupon "${code}" ne postoji.`, 404);

    const bogo = await readBogoConfig();
    if (bogo.couponCode === code) {
      return jsonError(
        `Kupon "${code}" je vezan za BOGO (1+1) ponudu — prvo promeni BOGO kod ili isključi ponudu.`,
        409
      );
    }

    const remaining: Record<string, Coupon> = {};
    for (const [key, value] of Object.entries(coupons)) {
      if (key !== code) remaining[key] = value;
    }
    await writeCoupons(remaining);
    return NextResponse.json({ success: true });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Greška pri brisanju kupona.', 500);
  }
}
