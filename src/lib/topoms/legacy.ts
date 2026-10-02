import crypto from 'node:crypto';
import { getCountryConfig } from '@/config/countries';
import { getTrackingSite } from '@/config/pixels';
import type { WebhookPayload } from '@/lib/supabase';
import { DeliveryError, validationFieldSummary } from './client';
import { getProductsForLocale } from '@/config/locales';
import { expandLegacyBundles } from './mapping';

/** Legacy brandOrderId is limited to 40 characters. Preserve existing valid IDs. */
export function legacyOrderId(orderId: string): string {
  return orderId.length <= 40 ? orderId : `WEB-${crypto.createHash('sha256').update(orderId).digest('hex').slice(0, 36)}`;
}

// The original destination, body and authentication are retained. Never persist keys.
export async function deliverLegacy(payload: WebhookPayload, locale: string, domain: string) {
  const configured = getCountryConfig(locale).webhooks.orders;
  const site = getTrackingSite(domain);
  const domainKey = site === 'dermotin_rs' ? process.env.RS_ORDER_API_KEY_SITE_RS : site === 'dermotin_co' ? process.env.RS_ORDER_API_KEY_SITE_CO : undefined;
  const config = domainKey ? { ...configured, authMethod: 'api-key', apiKey: domainKey } : configured;
  if (!config.url) throw new DeliveryError('Legacy webhook URL is not configured', false);
  // Adapt only the legacy wire identifier. The original shop ID stays in the
  // durable snapshot for checkout deduplication and subsequent status updates.
  const wireOrderId = legacyOrderId(payload.order_id);
  const expanded = expandLegacyBundles(payload, await getProductsForLocale(locale, true));
  const body = JSON.stringify({ ...expanded, order_id: wireOrderId });
  const headers: Record<string, string> = { 'Content-Type': 'application/json', 'X-Shop-Domain': domain,
    'X-Country-Code': locale.toUpperCase(), 'X-Auth-Method': config.authMethod, 'X-Webhook-Type': 'order' };
  if (config.authMethod === 'api-key' && config.apiKey) headers['X-API-Key'] = config.apiKey;
  else if (config.authMethod === 'signature' && config.webhookSecret) {
    const timestamp = String(Math.floor(Date.now() / 1000));
    headers['X-Webhook-Timestamp'] = timestamp;
    headers['X-Webhook-Signature'] = crypto.createHmac('sha256', config.webhookSecret).update(`${timestamp}.${body}`).digest('hex');
  } else throw new DeliveryError('Legacy webhook authentication is not configured', false);
  let response: Response;
  try { response = await fetch(config.url, { method: 'POST', headers, body, signal: AbortSignal.timeout(10000), redirect: 'error' }); }
  catch { throw new DeliveryError('Legacy webhook network error or timeout', true); }
  if (!response.ok) throw new DeliveryError(`Legacy webhook HTTP ${response.status}${await validationFieldSummary(response)}`, response.status === 429 || response.status >= 500);
  // Log only the explicit receipt, not the returned body or any customer data.
  // Some older endpoints return empty 200, which remains backward-compatible.
  try {
    const receipt = await response.json();
    if (receipt?.success === true && receipt.order?.brand_order_id === wireOrderId &&
        /^(?:\d+|[a-zA-Z0-9-]{1,64})$/.test(String(receipt.order?.id || ''))) {
      console.info('Legacy OMS order receipt', { externalId: wireOrderId, orderId: String(receipt.order.id) });
    }
  } catch { /* Empty/non-JSON success responses retain the legacy contract. */ }
}
