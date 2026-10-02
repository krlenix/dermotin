import { createClient } from '@supabase/supabase-js';
import { getProductsForLocale } from '@/config/locales';
import type { WebhookPayload } from '@/lib/supabase';
import type { Product } from '@/config/types';
import { topomsConfig, topomsConfigs } from './config';
import { digest, expandLegacyBundles, mapCatalog, type TopomsOrder, type TopomsProduct } from './mapping';
import { DeliveryError, pushTopoms, topomsRequest } from './client';
import { deliverLegacy } from './legacy';

export function deliveryDatabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('OMS outbox requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(10000) }) } });
}

type Context = { locale: string; domain: string; dependencies?: string[]; variants?: string[] };
type Job = { id: string; store_id: string; target: 'legacy' | 'topoms'; kind: 'product' | 'order'; payload: unknown; context: Context; attempts: number; claim_token: string };

export async function currentCatalog(products?: Record<string, Product>, updatedAt?: string, selector?: string) {
  const { locale, catalogUrl } = topomsConfig(selector);
  return mapCatalog(products || await getProductsForLocale(locale, true), updatedAt || process.env.TOPOMS_CATALOG_UPDATED_AT || '', catalogUrl);
}

function productJobs(catalog: TopomsProduct[], selector?: string) {
  const { storeId, locale } = topomsConfig(selector);
  return catalog.map(payload => ({ id: digest([storeId, 'product', payload]), store_id: storeId,
    target: 'topoms', kind: 'product', payload, context: { locale, domain: '' } }));
}

export async function enqueueCatalog(catalog: TopomsProduct[], selector?: string) {
  if (!catalog.length) return;
  const configs = selector ? [topomsConfig(selector)] : topomsConfigs();
  const { error } = await deliveryDatabase().from('oms_deliveries').upsert(configs.flatMap(config => productJobs(catalog, config.storeId)), { onConflict: 'id', ignoreDuplicates: true });
  if (error) throw new Error('Unable to persist OMS catalog jobs');
}

export async function enqueueOrder(legacy: WebhookPayload, order: TopomsOrder, context: Context) {
  const { storeId } = topomsConfig(context.domain.toLowerCase());
  const legacyPayload = expandLegacyBundles(legacy, await getProductsForLocale(context.locale, true));
  const products = productJobs(await currentCatalog(undefined, undefined, storeId), storeId);
  const variants = order.line_items.map(l => l.variant_id);
  const dependencies = products.filter(p => p.payload.variants.some(v => variants.includes(v.id))).map(p => p.id);
  const jobs = [ ...products,
    { id: digest([storeId, context.domain, order.id, 'legacy']), store_id: storeId, target: 'legacy', kind: 'order', payload: legacyPayload, context },
    { id: digest([storeId, context.domain, order.id, 'topoms']), store_id: storeId, target: 'topoms', kind: 'order', payload: order, context: { ...context, dependencies, variants } },
  ];
  // One atomic INSERT; a duplicate checkout never resets an already-delivered job.
  const { data, error } = await deliveryDatabase().from('oms_deliveries').upsert(jobs, { onConflict: 'id', ignoreDuplicates: true }).select('id,kind');
  if (error) throw new Error('Order could not be saved to the durable OMS outbox');
  return { duplicate: !data?.some(row => row.kind === 'order') };
}

async function assertCatalogImported(job: Job) {
  const { dependencies = [], variants = [] } = job.context;
  if (dependencies.length) {
    const { data, error } = await deliveryDatabase().from('oms_deliveries').select('id,state').in('id', dependencies).eq('store_id', job.store_id);
    if (error) throw new DeliveryError('Unable to read catalog prerequisites', true);
    if (data.some(row => row.state === 'blocked')) throw new DeliveryError('Catalog delivery is blocked; resolve catalog before replaying order', false);
    if (data.length !== dependencies.length || data.some(row => row.state !== 'delivered')) throw new DeliveryError('Waiting for catalog delivery', true);
  }
  // 202 means queued, NOT imported. Verify IDs through the read feed before orders.
  const found = new Set<string>();
  let cursor: string | null = null;
  for (let page = 0; page < 5; page++) {
    const query = new URLSearchParams({ limit: '100', ...(cursor ? { cursor } : {}) });
    const feed = await topomsRequest(`/products?${query}`, undefined, undefined, job.store_id) as { products?: TopomsProduct[]; has_next_page?: boolean; next_cursor?: string };
    if (!Array.isArray(feed?.products)) throw new DeliveryError('Invalid TopOMS product feed', true);
    feed.products.forEach(p => p.variants.forEach(v => found.add(String(v.id))));
    if (variants.every(id => found.has(id))) return;
    if (!feed.has_next_page) break;
    if (!feed.next_cursor || cursor === feed.next_cursor) throw new DeliveryError('Invalid TopOMS catalog cursor', true);
    cursor = feed.next_cursor;
  }
  throw new DeliveryError('Waiting for TopOMS to import catalog variants', true);
}

export async function drainDeliveries(budgetMs = 35_000, selector?: string) {
  if (process.env.WEBHOOK_DRY_RUN === 'true') return { processed: 0, dryRun: true };
  if (!selector) {
    const configs = topomsConfigs();
    let processed = 0;
    for (const config of configs) processed += (await drainDeliveries(budgetMs / configs.length, config.storeId)).processed;
    return { processed };
  }
  const { storeId } = topomsConfig(selector);
  const db = deliveryDatabase();
  const started = Date.now();
  let processed = 0;
  while (Date.now() - started < budgetMs) {
    const { data, error } = await db.rpc('claim_oms_delivery', { p_store_id: storeId });
    if (error) throw new Error('Unable to claim OMS delivery; apply migration first');
    const job = data?.[0] as Job | undefined;
    if (!job) break;
    let update: Record<string, unknown>;
    try {
      if (job.target === 'legacy') await deliverLegacy(job.payload as WebhookPayload, job.context.locale, job.context.domain);
      else {
        if (job.kind === 'order') await assertCatalogImported(job);
        await pushTopoms(job.kind, job.payload, job.id, job.store_id);
      }
      update = { state: 'delivered', delivered_at: new Date().toISOString(), last_error: null };
    } catch (error) {
      const failure = error instanceof DeliveryError ? error : new DeliveryError('Unexpected OMS worker error', true);
      const delay = Math.max(failure.delaySeconds, Math.min(3600, 60 * 2 ** Math.min(job.attempts - 1, 6)));
      update = { state: failure.retryable ? 'retry' : 'blocked', last_error: failure.message,
        next_attempt_at: new Date(Date.now() + delay * 1000).toISOString() };
      console.error('OMS delivery needs attention', { id: job.id, target: job.target, state: update.state, error: failure.message });
    }
    const result = await db.from('oms_deliveries').update({ ...update, locked_until: null, claim_token: null }).eq('id', job.id).eq('claim_token', job.claim_token);
    if (result.error) throw new Error('Unable to acknowledge OMS delivery; lease will recover automatically');
    processed++;
  }
  return { processed };
}

export async function replayBlocked(selector?: string) {
  const { storeId } = topomsConfig(selector);
  const { error } = await deliveryDatabase().from('oms_deliveries').update({ state: 'pending', next_attempt_at: new Date().toISOString(), last_error: null }).eq('store_id', storeId).eq('state', 'blocked');
  if (error) throw new Error('Unable to replay blocked deliveries');
}
