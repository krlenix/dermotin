import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  clearLoginFailures,
  createSessionToken,
  getAdminEmail,
  isLoginRateLimited,
  recordLoginFailure,
  verifyAdminCredentials,
} from '@/lib/admin/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  // Env mora biti podešen, inače odbij sve (fail-closed)
  if (!process.env.ADMIN_PASSWORD_HASH || !process.env.ADMIN_SESSION_SECRET || !process.env.ADMIN_EMAIL) {
    return NextResponse.json(
      { success: false, error: 'Admin panel nije konfigurisan (nedostaju ADMIN_* env promenljive).' },
      { status: 503 }
    );
  }

  const rateKey =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'local';

  if (isLoginRateLimited(rateKey)) {
    return NextResponse.json(
      { success: false, error: 'Previše neuspešnih pokušaja. Pokušaj ponovo za 15 minuta.' },
      { status: 429 }
    );
  }

  let email = '';
  let password = '';
  try {
    const body = await request.json();
    email = String(body.email || '');
    password = String(body.password || '');
  } catch {
    return NextResponse.json({ success: false, error: 'Neispravan zahtev.' }, { status: 400 });
  }

  if (!verifyAdminCredentials(email, password)) {
    recordLoginFailure(rateKey);
    return NextResponse.json({ success: false, error: 'Pogrešan email ili lozinka.' }, { status: 401 });
  }

  clearLoginFailures(rateKey);
  const { token, expiresAt } = createSessionToken(getAdminEmail());

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(expiresAt),
  });
  return response;
}
