import { topomsConfig } from './config';

export class DeliveryError extends Error {
  constructor(message: string, public retryable: boolean, public delaySeconds = 60) { super(message); }
}

/** Keep validation FIELD NAMES, never server messages, echoed values or bodies. */
export async function validationFieldSummary(response: Response): Promise<string> {
  if (response.status !== 400 && response.status !== 422) return '';
  try {
    const data = await response.json();
    if (!data?.errors || typeof data.errors !== 'object' || Array.isArray(data.errors)) return '';
    const allowedRoots = new Set(['id', 'order_id', 'created_at', 'updated_at', 'currency',
      'customer', 'billing_address', 'shipping_address', 'line_items', 'shipping', 'totals',
      'total_price', 'payment', 'payments', 'discounts', 'discount_codes', 'financial_status',
      'taxes_included', 'attribution', 'marketing', 'note', 'meta', 'refunds', 'tags']);
    const fields = Object.keys(data.errors).filter(key => key.length <= 100 &&
      /^[a-z_][a-z0-9_]*(?:\.(?:[a-z_][a-z0-9_]*|\d+))*$/.test(key) && allowedRoots.has(key.split('.')[0])).slice(0, 10);
    return fields.length ? `; fields: ${fields.join(', ')}` : '';
  } catch { return ''; }
}

export async function topomsRequest(path: string, payload?: unknown, eventId?: string, storeId?: string): Promise<unknown> {
  const { baseUrl, apiKey } = topomsConfig(storeId);
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method: payload === undefined ? 'GET' : 'POST',
      headers: { 'X-API-Key': apiKey, 'Content-Type': 'application/json', ...(eventId ? { 'X-Event-Id': eventId } : {}) },
      ...(payload === undefined ? {} : { body: JSON.stringify(payload) }),
      signal: AbortSignal.timeout(10_000), cache: 'no-store', redirect: 'error',
    });
  } catch { throw new DeliveryError('TopOMS network error or timeout', true); }
  if (!response.ok) {
    // Do not log response bodies: validation errors can echo PII or credentials.
    const delay = Math.max(60, Number(response.headers.get('retry-after')) || 60);
    const fields = await validationFieldSummary(response);
    throw new DeliveryError(`TopOMS HTTP ${response.status}${fields}`, response.status === 429 || response.status === 423 || response.status >= 500, delay);
  }
  const body = await response.text();
  if (!body) return null; // Duplicate pushes legitimately return empty 200.
  try { return JSON.parse(body); }
  catch { throw new DeliveryError('TopOMS returned invalid JSON', true); }
}

export async function assertTopomsActive(storeId?: string) {
  const ping = await topomsRequest('/ping', undefined, undefined, storeId) as { ok?: boolean; accepting_deliveries?: boolean };
  if (!ping?.ok || ping.accepting_deliveries !== true) {
    // Block and alert. An operator must explicitly replay after activation.
    throw new DeliveryError('TopOMS store is not accepting deliveries; activate it, then replay blocked jobs', false);
  }
  return ping;
}

export async function pushTopoms(kind: 'order' | 'product', payload: unknown, eventId: string, storeId?: string) {
  await assertTopomsActive(storeId);
  const result = await topomsRequest(kind === 'order' ? '/orders' : '/products', payload, eventId, storeId);
  if (result === null) await assertTopomsActive(storeId); // A paused store also answers empty 200.
  return result;
}
