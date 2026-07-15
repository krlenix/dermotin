import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from './auth';

/**
 * Guard za /api/admin/* rute admin panela (session kolačić).
 * Vraća null ako je sesija validna, u suprotnom gotov 401 odgovor.
 */
export function requireAdminApi(request: NextRequest): NextResponse | null {
  try {
    const session = getAdminSessionFromRequest(request);
    if (session) return null;
  } catch {
    // env nije podešen → tretiraj kao neautorizovano (fail-closed)
  }
  return NextResponse.json({ success: false, error: 'Nisi prijavljen/a.' }, { status: 401 });
}

export function jsonError(message: string, status = 400): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status });
}
