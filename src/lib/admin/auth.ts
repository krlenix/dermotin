import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

/**
 * Autentikacija za admin panel (/admin).
 *
 * - Jedini dozvoljeni nalog je ADMIN_EMAIL iz env-a (clickydoo@gmail.com).
 * - Lozinka se čuva kao scrypt hash u ADMIN_PASSWORD_HASH ("saltHex:hashHex").
 * - Sesija je HMAC-potpisan token u httpOnly kolačiću — nema baze ni
 *   spoljnih servisa, radi i lokalno i na hostingu.
 */

export const ADMIN_SESSION_COOKIE = 'dermotin_admin_session';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 dana

export interface AdminSession {
  email: string;
  expiresAt: number;
}

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('ADMIN_SESSION_SECRET nije podešen (min 32 karaktera). Dodaj ga u .env.local.');
  }
  return secret;
}

export function getAdminEmail(): string {
  const email = process.env.ADMIN_EMAIL;
  if (!email) {
    throw new Error('ADMIN_EMAIL nije podešen u .env.local.');
  }
  return email.trim().toLowerCase();
}

// ---------------------------------------------------------------------------
// Lozinka (scrypt)
// ---------------------------------------------------------------------------

/** Generiše scrypt hash u formatu "saltHex:hashHex" (koristi se u skriptama). */
export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password.normalize('NFKC'), salt, 64);
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(':');
  if (!saltHex || !hashHex) return false;
  try {
    const expected = Buffer.from(hashHex, 'hex');
    const actual = scryptSync(password.normalize('NFKC'), Buffer.from(saltHex, 'hex'), expected.length);
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

export function verifyAdminCredentials(email: string, password: string): boolean {
  const storedHash = process.env.ADMIN_PASSWORD_HASH;
  if (!storedHash) return false;
  const emailOk = email.trim().toLowerCase() === getAdminEmail();
  // Uvek izvrši i proveru lozinke da dužina odgovora ne otkriva da li je email pogođen
  const passwordOk = verifyPassword(password, storedHash);
  return emailOk && passwordOk;
}

// ---------------------------------------------------------------------------
// Sesijski token: base64url(JSON payload) + "." + HMAC-SHA256 potpis
// ---------------------------------------------------------------------------

function sign(payload: string): string {
  return createHmac('sha256', getSessionSecret()).update(payload).digest('base64url');
}

export function createSessionToken(email: string): { token: string; expiresAt: number } {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const payload = Buffer.from(JSON.stringify({ email, expiresAt }), 'utf8').toString('base64url');
  return { token: `${payload}.${sign(payload)}`, expiresAt };
}

export function verifySessionToken(token: string | undefined | null): AdminSession | null {
  if (!token) return null;
  const dotIndex = token.lastIndexOf('.');
  if (dotIndex <= 0) return null;
  const payload = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);
  try {
    const expectedSig = Buffer.from(sign(payload));
    const actualSig = Buffer.from(signature);
    if (expectedSig.length !== actualSig.length || !timingSafeEqual(expectedSig, actualSig)) {
      return null;
    }
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as AdminSession;
    if (typeof session.email !== 'string' || typeof session.expiresAt !== 'number') return null;
    if (session.expiresAt < Date.now()) return null;
    if (session.email.toLowerCase() !== getAdminEmail()) return null;
    return session;
  } catch {
    return null;
  }
}

/** Za server komponente (admin layout). */
export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    return verifySessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
  } catch {
    return null;
  }
}

/** Za API route handlere. Vraća sesiju ili null (handler treba da vrati 401). */
export function getAdminSessionFromRequest(request: NextRequest): AdminSession | null {
  return verifySessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}

// ---------------------------------------------------------------------------
// Rate limiting za login (in-memory, dovoljno za jednog korisnika)
// ---------------------------------------------------------------------------

const loginAttempts = new Map<string, { count: number; firstAttemptAt: number }>();
const MAX_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minuta

export function isLoginRateLimited(key: string): boolean {
  const entry = loginAttempts.get(key);
  if (!entry) return false;
  if (Date.now() - entry.firstAttemptAt > ATTEMPT_WINDOW_MS) {
    loginAttempts.delete(key);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

export function recordLoginFailure(key: string): void {
  const entry = loginAttempts.get(key);
  if (!entry || Date.now() - entry.firstAttemptAt > ATTEMPT_WINDOW_MS) {
    loginAttempts.set(key, { count: 1, firstAttemptAt: Date.now() });
  } else {
    entry.count += 1;
  }
}

export function clearLoginFailures(key: string): void {
  loginAttempts.delete(key);
}
