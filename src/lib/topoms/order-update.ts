import { topomsConfig } from './config';
import { deliveryDatabase } from './outbox';
import { digest, type TopomsOrder } from './mapping';
import type { WebhookPayload } from '@/lib/supabase';

export async function enqueueOrderStatus(orderId: string, status: string, domain?: string) {
  const { storeId } = topomsConfig(domain?.toLowerCase());
  const db = deliveryDatabase();
  const { data: source, error } = await db.from('oms_deliveries').select('payload,context')
    .eq('store_id', storeId).eq('target', 'topoms').eq('kind', 'order').eq('payload->>id', orderId)
    .order('created_at', { ascending: false }).limit(1).maybeSingle();
  if (error) throw new Error('Unable to load OMS order snapshot');
  if (!source) return; // Orders predating the integration are not silently backfilled.
  if (!['pending', 'paid', 'cancelled'].includes(status)) throw new Error('OMS status updates support pending, paid or cancelled; partial payments/refunds need explicit amounts');
  const { data: legacySource, error: legacyError } = await db.from('oms_deliveries').select('payload,context')
    .eq('store_id', storeId).eq('target', 'legacy').eq('kind', 'order').eq('payload->>order_id', orderId)
    .order('created_at', { ascending: false }).limit(1).maybeSingle();
  if (legacyError || !legacySource) throw new Error('Missing legacy order snapshot');
  const timestamp = new Date().toISOString();
  const original = source.payload as TopomsOrder & { cancelled_at?: string };
  // Do not silently resurrect cancelled orders or invent refunds.
  if (original.cancelled_at && status !== 'cancelled') throw new Error('Cancelled OMS orders cannot be reopened from payment status');
  const payload = { ...original, updated_at: timestamp, financial_status: status,
    ...(status === 'cancelled' ? { cancelled_at: original.cancelled_at || timestamp } : {
      payment: { ...original.payment, received_amount: status === 'paid' ? original.totals.total : '0.00',
        outstanding_amount: status === 'paid' ? '0.00' : original.totals.total },
    }) };
  const legacy = { ...(legacySource.payload as WebhookPayload), financial_status: status, updated_at: timestamp,
    ...(status === 'cancelled' ? { cancelled_at: timestamp } : {}) };
  const jobs = [
    { id: digest([storeId, orderId, timestamp, 'topoms']), store_id: storeId, target: 'topoms', kind: 'order', payload, context: source.context },
    { id: digest([storeId, orderId, timestamp, 'legacy']), store_id: storeId, target: 'legacy', kind: 'order', payload: legacy, context: legacySource.context },
  ];
  const result = await db.from('oms_deliveries').insert(jobs);
  if (result.error) throw new Error('Unable to persist OMS status update');
}
