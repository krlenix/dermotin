import { NextRequest, NextResponse } from 'next/server';
import { authorizeWorker, topomsConfig } from '@/lib/topoms/config';
import { assertTopomsActive, topomsRequest } from '@/lib/topoms/client';
import { currentCatalog, deliveryDatabase, drainDeliveries, enqueueCatalog, replayBlocked } from '@/lib/topoms/outbox';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;
const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export async function GET(request: NextRequest) {
  if (!authorizeWorker(request)) return json({ error: 'Unauthorized' }, 401);
  try {
    const { storeId } = topomsConfig(request.nextUrl.hostname);
    const orderId = request.nextUrl.searchParams.get('orderId');
    if (orderId) return json(await topomsRequest(`/orders/${encodeURIComponent(orderId)}`, undefined, undefined, storeId));
    const states = ['pending', 'processing', 'retry', 'blocked', 'delivered'];
    const counts: Record<string, number> = {};
    for (const state of states) {
      const { count, error } = await deliveryDatabase().from('oms_deliveries').select('id', { count: 'exact', head: true }).eq('store_id', storeId).eq('state', state);
      if (error) throw new Error('Outbox unavailable: check migration and service role');
      counts[state] = count || 0;
    }
    return json({ counts, ping: await topomsRequest('/ping', undefined, undefined, storeId) });
  } catch (error) { return json({ error: error instanceof Error ? error.message : 'OMS check failed' }, 503); }
}

export async function POST(request: NextRequest) {
  if (!authorizeWorker(request)) return json({ error: 'Unauthorized' }, 401);
  if (process.env.WEBHOOK_DRY_RUN === 'true') return json({ error: 'WEBHOOK_DRY_RUN is enabled' }, 409);
  let action: string;
  try { action = (await request.json()).action; } catch { return json({ error: 'Invalid JSON' }, 400); }
  try {
    const { storeId } = topomsConfig(request.nextUrl.hostname);
    if (action === 'sync-catalog') { await assertTopomsActive(storeId); await enqueueCatalog(await currentCatalog(undefined, undefined, storeId), storeId); }
    else if (action === 'replay-blocked') { await assertTopomsActive(storeId); await replayBlocked(storeId); }
    else if (action !== 'drain') return json({ error: 'Unknown action' }, 400);
    return json(await drainDeliveries(35_000, storeId));
  } catch (error) { return json({ error: error instanceof Error ? error.message : 'OMS worker failed' }, 503); }
}
