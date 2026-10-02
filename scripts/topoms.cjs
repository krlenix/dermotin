require('@next/env').loadEnvConfig(process.cwd());
require('./register-ts.cjs');
const { topomsConfig } = require('../src/lib/topoms/config');
const { topomsRequest, assertTopomsActive } = require('../src/lib/topoms/client');
const { currentCatalog, deliveryDatabase } = require('../src/lib/topoms/outbox');

async function run() {
  const action = process.argv[2] || 'check';
  if (action === 'check') {
    const config = topomsConfig();
    const ping = await topomsRequest('/ping');
    console.log('TopOMS connection:', JSON.stringify(ping));
    const catalog = await currentCatalog();
    console.log('Physical catalog:', catalog.length, 'products;', catalog.reduce((n, p) => n + p.variants.length, 0), 'variants');
    const { error } = await deliveryDatabase().from('oms_deliveries').select('id', { head: true, count: 'exact' }).eq('store_id', config.storeId);
    if (error) throw new Error('Outbox unavailable. Apply SQL migration and set SUPABASE_SERVICE_ROLE_KEY.');
    if (!process.env.OMS_WORKER_SECRET || process.env.OMS_WORKER_SECRET.length < 32) throw new Error('Set OMS_WORKER_SECRET (32+ characters).');
    if (!ping.accepting_deliveries) throw new Error('Store is inactive. Activate it in TopOMS before deployment.');
    if (process.env.WEBHOOK_DRY_RUN === 'true') throw new Error('WEBHOOK_DRY_RUN=true: no live delivery will occur.');
    if (process.env.TOPOMS_ENABLED !== 'true') throw new Error('TOPOMS_ENABLED is not true.');
    if (!(process.env.TOPOMS_ALLOWED_DOMAINS || '').split(',').map(s => s.trim()).includes(process.env.NEXT_PUBLIC_DOMAIN)) throw new Error('NEXT_PUBLIC_DOMAIN must be listed in TOPOMS_ALLOWED_DOMAINS.');
    console.log('Preflight passed. Verify the external once-per-minute worker before opening checkout.');
    return;
  }
  if (action === 'rehearsal' || action === 'connect') {
    // The connection wizard needs a first delivery before activation. This
    // explicit command sends ONLY a synthetic test:true probe, never real data.
    // Normal order/catalog delivery and the live rehearsal retain their gate.
    if (action === 'rehearsal') await assertTopomsActive();
    else {
      const ping = await topomsRequest('/ping');
      if (!ping?.ok) throw new Error('TopOMS credentials check failed');
    }
    const timestamp = new Date().toISOString();
    const id = `test-${Date.now()}`;
    // test:true is recorded by TopOMS but never becomes a real warehouse order.
    const response = await topomsRequest('/orders', { id, test: true, created_at: timestamp, updated_at: timestamp,
      currency: 'RSD', payment: { method: 'cash_on_delivery' },
      line_items: [{ id: 'l1', name: 'Integration rehearsal', quantity: 1, price: '100.00' }] }, id);
    console.log({ testOrderId: id, test: true, response });
    if (action === 'connect') {
      console.log('Connection probe sent; finish the wizard, then verify accepting_deliveries=true. An empty response is not proof of activation.');
      console.log('Store status:', await topomsRequest('/ping'));
    }
    return;
  }
  const base = process.env.OMS_WORKER_URL || new URL('/api/internal/oms', process.env.NEXT_PUBLIC_APP_URL).toString();
  const url = new URL(base);
  if (url.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(url.hostname)) throw new Error('Worker URL must use HTTPS');
  const headers = { Authorization: `Bearer ${process.env.OMS_WORKER_SECRET}`, 'Content-Type': 'application/json' };
  const status = action === 'status';
  if (!status && !['drain', 'sync-catalog', 'replay-blocked'].includes(action)) throw new Error('Unknown action');
  const response = await fetch(base, { method: status ? 'GET' : 'POST', headers,
    ...(status ? {} : { body: JSON.stringify({ action }) }), signal: AbortSignal.timeout(115000), redirect: 'error' });
  if (!response.ok) throw new Error(`Worker HTTP ${response.status}: check protected server logs and configuration`);
  console.log(await response.json());
}
run().catch(error => { console.error(error.message); process.exitCode = 1; });
