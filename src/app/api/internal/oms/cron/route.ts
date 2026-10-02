import { NextResponse } from 'next/server';
import { authorizeCron } from '@/lib/topoms/config';
import { drainDeliveries } from '@/lib/topoms/outbox';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

const json = (body: unknown, status = 200) => NextResponse.json(body, {
  status, headers: { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow' },
});

// Vercel Cron invokes GET with Authorization: Bearer CRON_SECRET.
// Separate from the read-only status endpoint and the operator's worker secret.
export async function GET(request: Request) {
  if (!authorizeCron(request)) return json({ error: 'Unauthorized' }, 401);
  if (process.env.WEBHOOK_DRY_RUN === 'true') return json({ error: 'WEBHOOK_DRY_RUN is enabled' }, 409);
  try { return json(await drainDeliveries()); }
  catch { return json({ error: 'OMS worker failed; check protected server logs' }, 503); }
}
