import { randomUUID } from 'node:crypto';
import { digest } from './mapping';
import { deliveryDatabase } from './outbox';

export function usesShortOrderNumbers(domain: string): boolean {
  return domain === 'dermotin.shop' || domain === 'www.dermotin.shop';
}

/** Durable allocation: one checkout keeps its number across retries and instances. */
export async function reserveOrderNumber(domain: string, eventId?: string): Promise<string> {
  if (!usesShortOrderNumbers(domain)) throw new Error('Order numbering domain is not supported');
  const eventKey = digest([domain, eventId || randomUUID()]);
  const { data, error } = await deliveryDatabase().rpc('reserve_checkout_order_number', {
    p_domain: domain, p_event_key: eventKey,
  });
  // The RPC may return an existing pre-migration ID. Never rename an old checkout.
  const previousId = `WEB-${eventKey.slice(0, 40)}`;
  if (error || typeof data !== 'string' || (!/^[1-9]\d{5,18}$/.test(data) && data !== previousId)) {
    throw new Error('Unable to reserve a durable order number');
  }
  return data;
}
