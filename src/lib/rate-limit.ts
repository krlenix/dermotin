import type { NextRequest } from 'next/server';

// Jednostavno ograničenje broja zahteva po ključu (IP + ruta) u memoriji instance.
// Zaustavlja naivne skripte i dupli spam; za pravu zaštitu preko više Vercel
// instanci uključiti Vercel Firewall rate limit ili Upstash.
const buckets = new Map<string, number[]>();
let lastSweep = Date.now();

export function clientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
}

/** Vraća true kada je zahtev dozvoljen, false kada je limit prekoračen. */
export function allowRequest(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  if (now - lastSweep > windowMs) {
    for (const [k, hits] of buckets) {
      if (!hits.length || now - hits[hits.length - 1] > windowMs) buckets.delete(k);
    }
    lastSweep = now;
  }
  const hits = (buckets.get(key) || []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return false;
  }
  hits.push(now);
  buckets.set(key, hits);
  return true;
}
