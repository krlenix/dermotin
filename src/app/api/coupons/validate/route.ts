import { NextRequest, NextResponse } from 'next/server';
import { resolveCoupon } from '@/lib/coupons-server';
import { allowRequest, clientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const LOCALES = new Set(['rs', 'ba', 'me']);

// Browser proverava jedan kod; spisak afilijacijskih kodova i OMS ključ ostaju na serveru.
export async function POST(request: NextRequest) {
  if (!allowRequest(`coupon:${clientIp(request)}`, 100, 60_000)) {
    return NextResponse.json({ valid: false, error: 'invalid_code' }, { status: 429 });
  }

  let body: { code?: unknown; subtotal?: unknown; locale?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ valid: false, error: 'invalid_code' }, { status: 400 });
  }

  const locale = typeof body.locale === 'string' && LOCALES.has(body.locale) ? body.locale : null;
  const subtotal = typeof body.subtotal === 'number' && Number.isFinite(body.subtotal) ? body.subtotal : null;
  if (!locale || subtotal === null || typeof body.code !== 'string') {
    return NextResponse.json({ valid: false, error: 'invalid_code' }, { status: 400 });
  }

  const result = await resolveCoupon(body.code, subtotal, locale);
  if (result.valid) return NextResponse.json({ valid: true, coupon: result.coupon });
  // OMS nedostupan: kupcu isto kao nevažeći kod, porudžbina bez kupona i dalje prolazi.
  const error = result.error === 'unavailable' ? 'invalid_code' : result.error;
  return NextResponse.json({ valid: false, error, ...(result.coupon ? { coupon: result.coupon } : {}) });
}
