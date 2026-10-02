const { test, afterEach, mock } = require('node:test');
const assert = require('node:assert/strict');

// Tests never load .env.local and never contact a live service.
process.env.TOPOMS_API_BASE_URL = 'https://app.topoms.com/custom-api/v1/teststore';
process.env.TOPOMS_API_KEY = 'test-key';
process.env.TOPOMS_CATALOG_UPDATED_AT = '2026-08-29T00:00:00+02:00';
process.env.TOPOMS_ENABLED = 'true';
process.env.TOPOMS_LOCALE = 'rs';
process.env.TOPOMS_ALLOWED_DOMAINS = 'dermotin.rs,dermotin.shop';
process.env.WEBHOOK_DRY_RUN = 'false';
process.env.SUPABASE_URL = 'https://database.example';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role';
process.env.OMS_WORKER_SECRET = 'a'.repeat(32);
process.env.NEXT_PUBLIC_RS_ORDER_WEBHOOK_URL = 'https://legacy.example/orders';
process.env.RS_ORDER_WEBHOOK_SECRET = 'test-signature';
process.env.NEXT_PUBLIC_APP_URL = 'https://dermotin.rs';

const { getProductsForLocale } = require('../src/config/locales');
const { mapOrder, mapCatalog, expandLegacyBundles } = require('../src/lib/topoms/mapping');
const { topomsEnabledFor, authorizeWorker } = require('../src/lib/topoms/config');
const { pushTopoms, topomsRequest } = require('../src/lib/topoms/client');
const { enqueueOrder, drainDeliveries, replayBlocked } = require('../src/lib/topoms/outbox');
const { deliverLegacy, legacyOrderId } = require('../src/lib/topoms/legacy');
const stamp = '2026-09-03T12:00:00Z';
const context = { timestamp: stamp, domain: 'dermotin.rs', locale: 'rs' };
const address = { name: 'Test Kupac', address1: 'Test 1', city: 'Beograd', zip: '11000', country_code: 'RS', phone: '+38160000000' };
const line = (sku = 'FUNGEL', quantity = 1, total = 1990, discount = 0) => ({ sku, name: sku, quantity, price: Math.round(total / quantity * 100) / 100, item_total_price: total, discount });
function legacy(lines = [line()], shipping = 390) {
  return { order_id: 'WEB-test', created_at: '2026-09-03 14:00:00', currency: 'RSD', financial_status: 'pending',
    total_price: Math.round((lines.reduce((n, l) => n + l.item_total_price - l.discount, 0) + shipping) * 100) / 100,
    customer: { phone: address.phone }, billing_address: address, shipping_address: address, line_items: lines,
    shipping: { price: shipping, method: 'Post Express' }, discount_codes: ['TEST'], marketing: { campaign_id: '123', adset_id: null, medium: 'facebook' } };
}
afterEach(() => { mock.restoreAll(); process.env.WEBHOOK_DRY_RUN = 'false'; });

test('catalog exports stable, distinct physical IDs and unique SKUs, not multipack stock', async () => {
  const products = await getProductsForLocale('rs');
  const catalog = mapCatalog(products, stamp, 'https://dermotin.rs');
  assert.equal(catalog.length, 8);
  assert.equal(catalog.flatMap(p => p.variants).length, 8);
  assert.ok(!catalog.some(p => p.id === 'p-bioroid_set'));
  assert.deepEqual(catalog, mapCatalog(products, stamp, 'https://dermotin.rs'));
  for (const p of catalog) {
    assert.ok(p.variants.every(v => v.id !== p.id));
    assert.equal('inventory_quantity' in p.variants[0], false);
    assert.equal('manage_stock' in p.variants[0], false);
  }
  assert.throws(() => mapCatalog(products, '2026-09-03 12:00:00', 'https://dermotin.rs'), /timestamp/);
});

test('single checkout sends COD totals, addresses, attribution and immutable timestamps', async () => {
  const input = legacy();
  const before = structuredClone(input);
  const mapped = mapOrder(input, await getProductsForLocale('rs'), { ...context, landingUrl: 'https://dermotin.rs/?utm_source=test' });
  assert.deepEqual(input, before);
  assert.equal(mapped.payment.method, 'cash_on_delivery');
  assert.equal(mapped.payment.outstanding_amount, '2380.00');
  assert.equal(mapped.created_at, stamp);
  assert.equal(mapped.shipping_address.first_name, 'Test');
  assert.equal(mapped.shipping_address.last_name, 'Kupac');
  assert.equal(mapped.attribution.params.campaign_id, '123');
  assert.equal('adset_id' in mapped.attribution.params, false);
  assert.equal(mapped.taxes_included, true);
  assert.equal(mapped.shipping.tax, '0.00');
  assert.equal(mapped.shipping.is_taxable, false);
  assert.equal(mapped.shipping.tax_rate, null);
});

test('3-pack keeps 4790 exactly despite cent rounding; funnel quantity already means units', async () => {
  const result = mapOrder(legacy([line('FUNGEL', 3, 4790)], 0), await getProductsForLocale('rs'), context);
  assert.equal(result.line_items[0].quantity, 3);
  assert.equal(result.line_items[0].price, '1596.67');
  assert.equal(result.line_items[0].total_discount, '0.01');
  assert.equal(result.totals.total, '4790.00');
});

test('cart pack IDs expand quantity, distinct from funnel unit quantities', async () => {
  const result = mapOrder(legacy([line('FUNGEL', 2, 9580)], 0), await getProductsForLocale('rs'), {
    ...context, cartItems: [{ sku: 'FUNGEL', productId: 'fungel', variantId: 'fungel-3pak' }],
  });
  assert.equal(result.line_items[0].quantity, 6);
  assert.equal(result.totals.total, '9580.00');
});

test('BOGO preserves paid and free quantities and full discount', async () => {
  const result = mapOrder(legacy([line('FUNGEL', 2, 3980), line('FUNGEL', 2, 3980, 3980)]), await getProductsForLocale('rs'), context);
  assert.deepEqual(result.line_items.map(l => l.quantity), [2, 2]);
  assert.equal(result.line_items[1].total_discount, '3980.00');
  assert.equal(result.totals.total, '4370.00');
});

test('mixed-SKU 1+1 cart and free shipping retain collected total', async () => {
  const result = mapOrder(legacy([line('FUNGEL', 1, 995), line('BIOMELIS', 1, 995)], 0), await getProductsForLocale('rs'), context);
  assert.equal(result.totals.total, '1990.00');
  assert.equal(result.shipping.price, '0.00');
  assert.equal(new Set(result.line_items.map(l => l.variant_id)).size, 2);
});

test('BIOROID SET becomes its two physical components and preserves discounts', async () => {
  const result = mapOrder(legacy([line('BIOROID-SET', 2, 5580, 580)], 0), await getProductsForLocale('rs'), context);
  assert.deepEqual(result.line_items.map(l => l.sku), ['BIOROID', 'BIOROID-KAPI']);
  assert.deepEqual(result.line_items.map(l => l.quantity), [2, 2]);
  assert.equal(result.totals.total, '5000.00');
});

test('legacy BIOROID sets preserve totals, discounts and quantities in mixed carts', async () => {
  const products = await getProductsForLocale('rs');
  for (const count of [1, 3, 4]) {
    for (const discount of [0, 199, count * 1990]) {
      const input = legacy([line('BIOROID-SET', count, count * 1990, discount), line('FUNGEL')], 400);
      const before = structuredClone(input);
      const mapped = expandLegacyBundles(input, products);
      assert.deepEqual(input, before);
      assert.deepEqual(mapped.line_items.map(l => l.sku), ['BIOROID', 'BIOROID-KAPI', 'FUNGEL']);
      assert.deepEqual(mapped.line_items.map(l => l.quantity), [count, count, 1]);
      assert.deepEqual(mapped.line_items[2], input.line_items[1]);
      const netCents = mapped.line_items.reduce((sum, l) => sum + Math.round(l.price * 100) * l.quantity - Math.round(l.discount * 100), 0);
      assert.equal(netCents + 40000, Math.round(input.total_price * 100));
      assert.deepEqual(expandLegacyBundles(mapped, products), mapped);
      assert.equal(mapped.order_id, input.order_id);
    }
  }
});

test('legacy delivery sends and signs component SKUs instead of BIOROID-SET', async () => {
  const input = legacy([line('BIOROID-SET', 4, 7960)], 0);
  let sent;
  mock.method(global, 'fetch', async (url, init) => {
    sent = JSON.parse(init.body);
    const expected = require('node:crypto').createHmac('sha256', process.env.RS_ORDER_WEBHOOK_SECRET)
      .update(`${init.headers['X-Webhook-Timestamp']}.${init.body}`).digest('hex');
    assert.equal(init.headers['X-Webhook-Signature'], expected);
    return new Response('', { status: 200 });
  });
  await deliverLegacy(input, 'rs', 'dermotin.shop');
  assert.deepEqual(sent.line_items.map(l => l.sku), ['BIOROID', 'BIOROID-KAPI']);
  assert.deepEqual(sent.line_items.map(l => l.quantity), [4, 4]);
  assert.equal(sent.total_price, 7960);
});

test('legacy upsell product IDs map to actual SKUs', async () => {
  const result = mapOrder(legacy([line('FUNGEL'), line('biomelis_kapi', 1, 500)]), await getProductsForLocale('rs'), context);
  assert.equal(result.line_items[1].sku, 'BIOMELIS-KAPI');
});

test('unknown SKU, inconsistent amounts, negative/decimal quantities fail before enqueue', async () => {
  const products = await getProductsForLocale('rs');
  assert.throws(() => mapOrder(legacy([line('UNKNOWN')]), products, context), /Unknown/);
  assert.throws(() => mapOrder({ ...legacy(), total_price: 1 }, products, context), /total/);
  assert.throws(() => mapOrder(legacy([line('FUNGEL', -1)]), products, context), /quantity/);
  assert.throws(() => mapOrder(legacy([line('FUNGEL', 1.5)]), products, context), /quantity/);
  assert.throws(() => mapOrder(legacy([line('FUNGEL', 1, 10, 20)]), products, context), /discount/);
});

test('explicit domain/locale scope and dry run isolate the new integration', () => {
  assert.equal(topomsEnabledFor('rs', 'dermotin.rs'), true);
  assert.equal(topomsEnabledFor('ba', 'dermotin.rs'), false);
  assert.equal(topomsEnabledFor('rs', 'another.shop'), false);
  process.env.WEBHOOK_DRY_RUN = 'true';
  assert.equal(topomsEnabledFor('rs', 'dermotin.rs'), false);
});

test('worker authentication is fail-closed, including multibyte invalid tokens', () => {
  assert.equal(authorizeWorker(new Request('https://test')), false);
  assert.equal(authorizeWorker(new Request('https://test', { headers: { Authorization: `Bearer ${'a'.repeat(32)}` } })), true);
  assert.equal(authorizeWorker(new Request('https://test', { headers: { Authorization: `Bearer ${'é'.repeat(32)}` } })), false);
});

test('inactive TopOMS is blocked before POST; empty 200 is rechecked', async () => {
  let calls = 0;
  mock.method(globalThis, 'fetch', async () => { calls++; return Response.json({ ok: true, accepting_deliveries: false }); });
  await assert.rejects(() => pushTopoms('order', {}, 'stable'), e => !e.retryable);
  assert.equal(calls, 1);
  mock.restoreAll();
  const seen = [];
  mock.method(globalThis, 'fetch', async (url, init) => {
    seen.push([url, init]);
    return url.endsWith('/ping') ? Response.json({ ok: true, accepting_deliveries: true }) : new Response(null, { status: 200 });
  });
  await pushTopoms('order', { id: '1' }, 'stable');
  assert.equal(seen.length, 3);
  assert.equal(seen[1][1].headers['X-Event-Id'], 'stable');
  assert.equal(seen[1][1].headers['X-API-Key'], 'test-key');
});

test('429 HTML retries after >=60 seconds, 422 is blocked and does not expose body', async () => {
  mock.method(globalThis, 'fetch', async () => new Response('<html>too many</html>', { status: 429, headers: { 'Retry-After': '120' } }));
  await assert.rejects(() => topomsRequest('/orders', {}), e => e.retryable && e.delaySeconds >= 120);
  mock.restoreAll();
  mock.method(globalThis, 'fetch', async () => Response.json({ message: 'private customer data' }, { status: 422 }));
  await assert.rejects(() => topomsRequest('/orders', {}), e => !e.retryable && !e.message.includes('private'));
});

test('legacy destination retains its body and HMAC headers', async () => {
  const body = legacy();
  let sent;
  mock.method(globalThis, 'fetch', async (url, init) => { sent = { url, ...init }; return new Response(null, { status: 200 }); });
  await deliverLegacy(body, 'rs', 'dermotin.rs');
  assert.equal(sent.url, 'https://legacy.example/orders');
  assert.equal(sent.body, JSON.stringify(body));
  assert.ok(sent.headers['X-Webhook-Signature']);
  assert.equal(sent.headers['X-Shop-Domain'], 'dermotin.rs');
});

test('shipping declares the required tax fields for both free and charged delivery', async () => {
  for (const price of [0, 390]) {
    const order = mapOrder(legacy([line()], price), await getProductsForLocale('rs'), context);
    assert.deepEqual(order.shipping, { price: price.toFixed(2), tax: '0.00', is_taxable: false,
      tax_rate: null, method: 'Post Express' });
    assert.equal(order.totals.total, (1990 + price).toFixed(2));
    assert.equal(order.payment.outstanding_amount, order.totals.total);
  }
});

test('legacy wire IDs stay within 40 characters and remain stable on retry/status updates', async () => {
  const input = legacy();
  input.order_id = `WEB-${'1'.repeat(40)}`;
  const original = structuredClone(input);
  const sent = [];
  mock.method(globalThis, 'fetch', async (url, init) => { sent.push(init); return new Response(null, { status: 200 }); });
  await deliverLegacy(input, 'rs', 'dermotin.rs');
  await deliverLegacy(input, 'rs', 'dermotin.rs');
  await deliverLegacy({ ...input, financial_status: 'paid' }, 'rs', 'dermotin.rs');
  const expectedId = legacyOrderId(input.order_id);
  assert.equal(expectedId.length, 40);
  assert.equal(legacyOrderId('x'.repeat(40)), 'x'.repeat(40));
  assert.notEqual(legacyOrderId(`WEB-${'2'.repeat(40)}`), expectedId);
  assert.deepEqual(input, original);
  for (const request of sent) {
    assert.equal(JSON.parse(request.body).order_id, expectedId);
    const timestamp = request.headers['X-Webhook-Timestamp'];
    const expected = require('node:crypto').createHmac('sha256', process.env.RS_ORDER_WEBHOOK_SECRET)
      .update(`${timestamp}.${request.body}`).digest('hex');
    assert.equal(request.headers['X-Webhook-Signature'], expected);
  }
  assert.deepEqual(JSON.parse(sent[0].body), { ...original, order_id: expectedId });
});

test('422 diagnostics retain safe field names but never response messages or values', async () => {
  const body = { message: 'private customer data', errors: {
    'shipping.tax': ['private customer data'], 'shipping.is_taxable': ['private customer data'],
    'customer.email': ['buyer@example.invalid'], 'buyer@example.invalid': ['sensitive'],
  } };
  mock.method(globalThis, 'fetch', async () => Response.json(body, { status: 422 }));
  await assert.rejects(() => topomsRequest('/orders', {}), e => !e.retryable &&
    e.message.includes('shipping.tax') && e.message.includes('shipping.is_taxable') &&
    !e.message.includes('private') && !e.message.includes('buyer@'));
  await assert.rejects(() => deliverLegacy(legacy(), 'rs', 'dermotin.rs'), e => !e.retryable &&
    e.message.includes('customer.email') && !e.message.includes('private') && !e.message.includes('buyer@'));
});

async function fakeServices({ legacyStatus = 200, accepting = true, catalogReady = true, orderStatus = 202 } = {}) {
  const rows = new Map();
  const numbers = new Map();
  const posts = [];
  const catalog = mapCatalog(await getProductsForLocale('rs'), stamp, 'https://dermotin.rs');
  mock.method(globalThis, 'fetch', async (input, init = {}) => {
    const url = new URL(input);
    const method = init.method || 'GET';
    if (url.hostname === 'database.example') {
      if (url.pathname.endsWith('/rpc/reserve_checkout_order_number')) {
        const { p_event_key } = JSON.parse(init.body);
        if (!numbers.has(p_event_key)) numbers.set(p_event_key, String(100001 + numbers.size));
        return Response.json(numbers.get(p_event_key));
      }
      if (url.pathname.endsWith('/rpc/claim_oms_delivery')) {
        const { p_store_id } = JSON.parse(init.body);
        const pending = [...rows.values()].filter(r => r.store_id === p_store_id && (r.state === 'pending' || (r.state === 'retry' && Date.parse(r.next_attempt_at) <= Date.now())));
        pending.sort((a, b) => (a.target === 'legacy' ? 0 : a.kind === 'product' ? 1 : 2) - (b.target === 'legacy' ? 0 : b.kind === 'product' ? 1 : 2));
        const row = pending[0];
        if (!row) return Response.json([]);
        row.state = 'processing'; row.attempts++; row.claim_token = `claim-${row.id}`;
        return Response.json([row]);
      }
      if (method === 'POST') {
        const inserted = [];
        for (const row of JSON.parse(init.body)) {
          if (!rows.has(row.id)) { rows.set(row.id, { ...row, state: 'pending', attempts: 0 }); inserted.push(row); }
        }
        return Response.json(inserted, { status: 201 });
      }
      if (method === 'PATCH') {
        const id = url.searchParams.get('id')?.slice(3);
        const patch = JSON.parse(init.body);
        if (id) Object.assign(rows.get(id), patch);
        else for (const row of rows.values()) if (row.state === 'blocked') Object.assign(row, patch);
        return new Response(null, { status: 204 });
      }
      const ids = url.searchParams.get('id');
      return Response.json([...rows.values()].filter(r => !ids || ids.includes(r.id)));
    }
    if (url.hostname === 'legacy.example') { posts.push({ target: 'legacy', body: JSON.parse(init.body) }); return new Response(null, { status: legacyStatus }); }
    if (url.hostname === 'app.topoms.com') {
      if (url.pathname.endsWith('/ping')) return Response.json({ ok: true, accepting_deliveries: accepting });
      if (method === 'GET' && url.pathname.endsWith('/products')) return Response.json({ products: catalogReady ? catalog : [], has_next_page: false, next_cursor: null });
      if (method === 'POST') {
        posts.push({ target: url.pathname.endsWith('/products') ? 'product' : 'topoms', body: JSON.parse(init.body), eventId: init.headers['X-Event-Id'], path: url.pathname, apiKey: init.headers['X-API-Key'] });
        return Response.json({ status: 'queued' }, { status: url.pathname.endsWith('/products') ? 202 : orderStatus });
      }
    }
    throw new Error(`Unexpected network request: ${url.origin}${url.pathname}`);
  });
  return { rows, posts };
}

async function withComStore(run) {
  process.env.TOPOMS_COM_API_BASE_URL = 'https://app.topoms.com/custom-api/v1/comstore';
  process.env.TOPOMS_COM_API_KEY = 'com-test-key';
  try { await run(); }
  finally { delete process.env.TOPOMS_COM_API_BASE_URL; delete process.env.TOPOMS_COM_API_KEY; }
}

test('COM orders, dependencies and retry deliveries stay in their own store', async () => withComStore(async () => {
  const services = await fakeServices({ orderStatus: 503 });
  const input = legacy();
  const products = await getProductsForLocale('rs');
  for (const domain of ['dermotin.shop', 'dermotin.com']) {
    const ctx = { ...context, domain };
    await enqueueOrder(input, mapOrder(input, products, ctx), ctx);
    assert.equal((await enqueueOrder(input, mapOrder(input, products, ctx), ctx)).duplicate, true);
  }
  await drainDeliveries();
  for (const job of services.rows.values()) {
    if (job.target !== 'topoms') continue;
    const sent = services.posts.find(p => p.eventId === job.id);
    assert.ok(sent.path.includes('/' + job.store_id + '/'));
    assert.equal(sent.apiKey, job.store_id === 'comstore' ? 'com-test-key' : 'test-key');
    if (job.kind === 'order') {
      assert.equal(job.state, 'retry');
      assert.ok(job.context.dependencies.every(id => services.rows.get(id).store_id === job.store_id));
      job.next_attempt_at = '2020-01-01T00:00:00Z';
    }
  }
  await drainDeliveries();
  assert.equal(services.posts.filter(p => p.target === 'topoms').length, 4);
  assert.equal(services.posts.filter(p => p.target === 'legacy').length, 2);
}));

test('COM pull only accepts COM credentials; store lookup fails closed', async () => withComStore(async () => {
  const { topomsConfig } = require('../src/lib/topoms/config');
  const { handleProductPull } = require('../src/lib/topoms/pull');
  assert.equal(topomsEnabledFor('rs', 'www.dermotin.com'), true);
  assert.equal(topomsEnabledFor('ba', 'dermotin.com'), false);
  assert.equal(topomsConfig('www.dermotin.com').storeId, 'comstore');
  assert.throws(() => topomsConfig('unknownstore'), /Unknown/);
  for (const [domain, key, status] of [
    ['dermotin.com', 'com-test-key', 200], ['www.dermotin.com', 'com-test-key', 200],
    ['dermotin.com', 'test-key', 401], ['dermotin.shop', 'com-test-key', 401],
    ['dermotin.shop', 'test-key', 200],
  ]) {
    const result = await handleProductPull(new Request(`https://${domain}/api/topoms/products`, { headers: { 'X-API-Key': key } }), 'products');
    assert.equal(result.status, status);
    if (status === 200 && domain.includes('.com')) {
      const feed = await result.json();
      assert.equal(feed.products.length, 8);
      assert.ok(feed.products.every(p => p.images.every(url => new URL(url).hostname === 'dermotin.com')));
    }
  }
  delete process.env.TOPOMS_COM_API_KEY;
  assert.throws(() => topomsConfig('dermotin.com'), /Missing/);
}));

test('atomic outbox deduplicates checkout, preserves snapshots and independently retries legacy failures', async () => {
  const services = await fakeServices({ legacyStatus: 503 });
  const input = legacy();
  const order = mapOrder(input, await getProductsForLocale('rs'), context);
  assert.equal((await enqueueOrder(input, order, context)).duplicate, false);
  assert.equal((await enqueueOrder(input, { ...order, updated_at: '2026-10-01T00:00:00Z' }, context)).duplicate, true);
  await drainDeliveries();
  const orderJobs = [...services.rows.values()].filter(r => r.kind === 'order');
  assert.equal(orderJobs.find(r => r.target === 'legacy').state, 'retry');
  assert.equal(orderJobs.find(r => r.target === 'topoms').state, 'delivered');
  assert.equal(services.posts.find(p => p.target === 'topoms').body.updated_at, stamp);
  const posted = services.posts.length;
  await drainDeliveries();
  assert.equal(services.posts.length, posted);
});

test('202 catalog acceptance is not import; order waits until variants appear', async () => {
  const services = await fakeServices({ catalogReady: false });
  const input = legacy();
  await enqueueOrder(input, mapOrder(input, await getProductsForLocale('rs'), context), context);
  await drainDeliveries();
  assert.equal(services.posts.filter(p => p.target === 'product').length, 8);
  assert.equal(services.posts.filter(p => p.target === 'topoms').length, 0);
  assert.equal([...services.rows.values()].find(r => r.target === 'topoms' && r.kind === 'order').state, 'retry');
});

test('inactive TopOMS never blocks old OMS, and blocked jobs require explicit replay', async () => {
  const services = await fakeServices({ accepting: false });
  const input = legacy();
  await enqueueOrder(input, mapOrder(input, await getProductsForLocale('rs'), context), context);
  await drainDeliveries();
  assert.equal(services.posts.filter(p => p.target === 'legacy').length, 1);
  assert.equal(services.posts.filter(p => p.target === 'product' || p.target === 'topoms').length, 0);
  assert.ok([...services.rows.values()].some(r => r.state === 'blocked'));
  await replayBlocked();
  assert.ok([...services.rows.values()].every(r => r.state !== 'blocked'));
});

test('dry-run worker never touches database or HTTP', async () => {
  process.env.WEBHOOK_DRY_RUN = 'true';
  mock.method(globalThis, 'fetch', async () => { throw new Error('Must not call HTTP'); });
  assert.deepEqual(await drainDeliveries(), { processed: 0, dryRun: true });
});

test('shop-only production allowlist excludes the other domains and markets', () => {
  const before = process.env.TOPOMS_ALLOWED_DOMAINS;
  try {
    process.env.TOPOMS_ALLOWED_DOMAINS = 'dermotin.shop,www.dermotin.shop';
    assert.equal(topomsEnabledFor('rs', 'dermotin.shop'), true);
    assert.equal(topomsEnabledFor('rs', 'www.dermotin.shop'), true);
    assert.equal(topomsEnabledFor('rs', 'dermotin.rs'), false);
    assert.equal(topomsEnabledFor('rs', 'dermotin.co'), false);
    assert.equal(topomsEnabledFor('ba', 'dermotin.shop'), false);
  } finally { process.env.TOPOMS_ALLOWED_DOMAINS = before; }
});

test('Vercel cron uses a separate secret, rejects dry-run, and drains only when authenticated', async () => {
  const { GET } = require('../src/app/api/internal/oms/cron/route');
  const before = process.env.CRON_SECRET;
  const request = token => new Request('https://dermotin.shop/api/internal/oms/cron', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const outbox = require('../src/lib/topoms/outbox');
  const drain = mock.method(outbox, 'drainDeliveries', async () => ({ processed: 2 }));
  try {
    delete process.env.CRON_SECRET;
    assert.equal((await GET(request())).status, 401);
    process.env.CRON_SECRET = 'c'.repeat(32);
    assert.equal((await GET(request(process.env.OMS_WORKER_SECRET))).status, 401);
    assert.equal((await GET(request('é'.repeat(32)))).status, 401);
    process.env.WEBHOOK_DRY_RUN = 'true';
    assert.equal((await GET(request(process.env.CRON_SECRET))).status, 409);
    assert.equal(drain.mock.callCount(), 0);
    process.env.WEBHOOK_DRY_RUN = 'false';
    const response = await GET(request(process.env.CRON_SECRET));
    assert.equal(response.status, 200);
    assert.match(response.headers.get('cache-control'), /no-store/);
    assert.deepEqual(await response.json(), { processed: 2 });
    assert.equal(drain.mock.callCount(), 1);
    drain.mock.mockImplementation(async () => { throw new Error('private backend detail'); });
    const failure = await GET(request(process.env.CRON_SECRET));
    assert.equal(failure.status, 503);
    assert.equal((await failure.text()).includes('private backend detail'), false);
  } finally {
    if (before === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = before;
  }
});

test('checkout endpoint durably queues BOTH destinations before accepting; duplicate does not refire CAPI', async () => {
  const services = await fakeServices();
  const { OrderService } = require('../src/lib/supabase');
  const capi = require('../src/lib/capi');
  mock.method(OrderService, 'insertOrder', async () => ({ success: true, data: { id: 1 } }));
  const purchase = mock.method(capi, 'sendCapiPurchaseEvent', async () => ({ success: true, eventId: 'test-purchase' }));
  mock.method(console, 'log', () => {});
  mock.method(console, 'warn', () => {});
  const nextPath = require.resolve('next/server');
  const actual = require(nextPath);
  const callbacks = [];
  require.cache[nextPath].exports = { ...actual, after: callback => callbacks.push(callback) };
  const { POST } = require('../src/app/api/orders/route');
  require.cache[nextPath].exports = actual;
  const body = { customerName: 'Test Kupac', customerPhone: address.phone, customerAddress: address.address1,
    customerCity: address.city, customerPostalCode: address.zip, productName: 'FUNGEL', productVariant: '1', productSku: 'FUNGEL',
    quantity: 1, totalPrice: 2380, subtotal: 1990, shippingCost: 390, currency: 'RSD', courierName: 'Post Express',
    paymentMethod: 'cod', locale: 'rs', eventId: 'endpoint-test' };
  const request = () => new actual.NextRequest('https://dermotin.shop/api/orders', { method: 'POST',
    headers: { host: 'dermotin.shop', 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const response = await POST(request());
  const data = await response.json();
  assert.equal(response.status, 200);
  assert.equal(data.success, true);
  assert.equal(data.orderId, '100001');
  assert.equal(data.topomsStatus, 'queued');
  assert.equal(callbacks.length, 1);
  assert.equal(services.posts.length, 0); // All external delivery is after durable acceptance.
  assert.equal([...services.rows.values()].filter(r => r.kind === 'order').length, 2);
  const orderJobs = [...services.rows.values()].filter(r => r.kind === 'order');
  assert.equal(orderJobs.find(r => r.target === 'legacy').payload.order_id, '100001');
  assert.equal(orderJobs.find(r => r.target === 'topoms').payload.number, '100001');
  const second = await (await POST(request())).json();
  assert.equal(second.orderId, data.orderId);
  assert.equal(second.duplicate, true);
  assert.equal(purchase.mock.callCount(), 1);
});

test('database outage rejects checkout before either OMS or CAPI is contacted', async () => {
  const { NextRequest } = require('next/server');
  const { POST } = require('../src/app/api/orders/route');
  const { OrderService } = require('../src/lib/supabase');
  const capi = require('../src/lib/capi');
  mock.method(console, 'log', () => {});
  const snapshot = mock.method(OrderService, 'insertOrder', async () => { throw new Error('Not reached'); });
  const purchase = mock.method(capi, 'sendCapiPurchaseEvent', async () => { throw new Error('Not reached'); });
  const requests = [];
  mock.method(globalThis, 'fetch', async url => { requests.push(String(url)); return Response.json({ message: 'unavailable' }, { status: 503 }); });
  const response = await POST(new NextRequest('https://dermotin.shop/api/orders', { method: 'POST',
    headers: { host: 'dermotin.shop', 'Content-Type': 'application/json' }, body: JSON.stringify({
      customerName: 'Test Kupac', customerPhone: address.phone, customerAddress: address.address1, customerCity: address.city,
      customerPostalCode: address.zip, productName: 'FUNGEL', productSku: 'FUNGEL', quantity: 1, totalPrice: 2380,
      subtotal: 1990, shippingCost: 390, courierName: 'Post Express', locale: 'rs', eventId: 'db-down-test',
    }) }));
  assert.equal(response.status, 503);
  assert.ok(requests.every(url => url.startsWith('https://database.example/')));
  assert.equal(snapshot.mock.callCount(), 0);
  assert.equal(purchase.mock.callCount(), 0);
});

test('connection command can send only a synthetic test probe before activation', () => {
  const { spawnSync } = require('node:child_process');
  const code = `
    const assert = require('node:assert/strict');
    const client = require('./src/lib/topoms/client');
    let probes = 0;
    client.assertTopomsActive = async () => { throw new Error('Connection probe must not require activation'); };
    client.topomsRequest = async (path, body, eventId) => {
      if (path === '/ping') return { ok: true, accepting_deliveries: false };
      assert.equal(path, '/orders');
      assert.equal(body.test, true);
      assert.equal(body.id, eventId);
      assert.equal(body.customer, undefined);
      assert.equal(body.shipping_address, undefined);
      probes++;
      return null;
    };
    process.argv[2] = 'connect';
    require('./scripts/topoms.cjs');
    process.on('beforeExit', () => assert.equal(probes, 1));
  `;
  const result = spawnSync(process.execPath, ['-r', './scripts/register-ts.cjs', '-e', code], { encoding: 'utf8', windowsHide: true });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /not proof of activation/);
});

const pullRoutes = {
  ping: require('../src/app/api/topoms/ping/route').GET,
  count: require('../src/app/api/topoms/products/count/route').GET,
  products: require('../src/app/api/topoms/products/route').GET,
};
const pullRequest = (query = '', headers = { 'X-API-Key': 'test-key' }) => new Request(`https://dermotin.rs/api/topoms/products${query}`, { headers });

test('product pull authenticates with the store API key, not worker secrets or query parameters', async () => {
  for (const headers of [{}, { 'X-API-Key': 'wrong' }, { Authorization: `Bearer ${process.env.OMS_WORKER_SECRET}` },
    { 'X-API-Key': 'test-key', Authorization: 'Bearer wrong' }]) {
    assert.equal((await pullRoutes.ping(pullRequest('?api_key=test-key', headers))).status, 401);
  }
  for (const headers of [{ 'X-API-Key': 'test-key' }, { Authorization: 'Bearer test-key' },
    { 'X-API-Key': 'test-key', Authorization: 'Bearer test-key' }]) {
    const response = await pullRoutes.ping(pullRequest('', headers));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true });
    assert.match(response.headers.get('cache-control'), /no-store/);
  }
});

test('product pull works while push is disabled and never calls Supabase or any webhook', async () => {
  process.env.WEBHOOK_DRY_RUN = 'true';
  process.env.TOPOMS_ENABLED = 'false';
  const network = mock.method(globalThis, 'fetch', async () => { throw new Error('Read-only product pull must not call a remote service'); });
  try {
    const response = await pullRoutes.count(pullRequest());
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { count: 8 });
    assert.equal(network.mock.callCount(), 0);
  } finally { process.env.TOPOMS_ENABLED = 'true'; }
});

test('product pull paginates every full-state product once with the same IDs and payload as push', async () => {
  const expected = await require('../src/lib/topoms/outbox').currentCatalog();
  const received = [];
  let cursor = null;
  for (let n = 0; n < 3; n++) {
    const query = new URLSearchParams({ limit: '3', ...(cursor ? { cursor } : {}) });
    const response = await pullRoutes.products(pullRequest(`?${query}`));
    assert.equal(response.status, 200);
    const data = await response.json();
    assert.equal(data.products.length, n === 2 ? 2 : 3);
    assert.equal(data.has_next_page, n !== 2);
    received.push(...data.products);
    cursor = data.next_cursor;
  }
  assert.equal(cursor, null);
  assert.equal(new Set(received.map(p => p.id)).size, 8);
  for (const product of received) assert.deepEqual(product, expected.find(p => p.id === product.id));
});

test('updated_since filtering agrees between product count and list and is preserved in cursor', async () => {
  const since = process.env.TOPOMS_CATALOG_UPDATED_AT;
  const query = new URLSearchParams({ updated_since: since, limit: '2' });
  const first = await (await pullRoutes.products(pullRequest(`?${query}`))).json();
  assert.deepEqual(await (await pullRoutes.count(pullRequest(`?${query}`))).json(), { count: 8 });
  const second = await (await pullRoutes.products(pullRequest(`?cursor=${encodeURIComponent(first.next_cursor)}&limit=2`))).json();
  assert.equal(second.products.length, 2);
  assert.notEqual(first.products[0].id, second.products[0].id);
  assert.equal((await pullRoutes.products(pullRequest(`?cursor=${encodeURIComponent(first.next_cursor)}&updated_since=2020-01-01T00:00:00Z`))).status, 400);
  const future = '?updated_since=2099-01-01T00:00:00Z';
  assert.deepEqual(await (await pullRoutes.count(pullRequest(future))).json(), { count: 0 });
  assert.deepEqual(await (await pullRoutes.products(pullRequest(future))).json(), { products: [], next_cursor: null, has_next_page: false });
});

test('product pull rejects malformed pagination and tampered cursors', async () => {
  for (const query of ['?limit=-1', '?limit=0', '?limit=201', '?limit=2.5', '?limit=NaN', '?cursor=invalid',
    '?limit=1&limit=2', '?updated_since=not-a-date', '?updated_since=2026-09-03']) {
    assert.equal((await pullRoutes.products(pullRequest(query))).status, 400, query);
  }
  const first = await (await pullRoutes.products(pullRequest('?limit=1'))).json();
  const [value, signature] = first.next_cursor.split('.');
  const tampered = `${value}.${signature.startsWith('a') ? 'b' : 'a'}${signature.slice(1)}`;
  assert.equal((await pullRoutes.products(pullRequest(`?cursor=${tampered}`))).status, 400);
});

test('TopOMS SyncStoreProducts first-page request accepts limit=200 with both auth headers', async () => {
  const headers = { 'X-API-Key': 'test-key', Authorization: 'Bearer test-key' };
  for (const suffix of ['', '&updated_since=2026-08-28T00:00:00Z']) {
    const response = await pullRoutes.products(pullRequest(`?limit=200${suffix}`, headers));
    assert.equal(response.status, 200);
    const data = await response.json();
    assert.equal(data.products.length, 8);
    assert.equal(data.has_next_page, false);
    assert.equal(data.next_cursor, null);
    const count = await pullRoutes.count(pullRequest(`?limit=200${suffix}`, headers));
    assert.equal((await count.json()).count, data.products.length);
  }
});

test('200-product pull pages preserve the opaque cursor across the final page', async () => {
  const outbox = require('../src/lib/topoms/outbox');
  const template = (await outbox.currentCatalog())[0];
  const catalog = Array.from({ length: 205 }, (_, index) => ({
    ...structuredClone(template), id: `product-${String(index).padStart(3, '0')}`,
  }));
  mock.method(outbox, 'currentCatalog', async () => structuredClone(catalog));
  const firstResponse = await pullRoutes.products(pullRequest('?limit=200'));
  assert.equal(firstResponse.status, 200);
  const first = await firstResponse.json();
  assert.equal(first.products.length, 200);
  assert.equal(first.has_next_page, true);
  assert.ok(first.next_cursor);
  const lastResponse = await pullRoutes.products(pullRequest(`?limit=200&cursor=${encodeURIComponent(first.next_cursor)}`));
  assert.equal(lastResponse.status, 200);
  const last = await lastResponse.json();
  assert.equal(last.products.length, 5);
  assert.equal(last.has_next_page, false);
  assert.equal(last.next_cursor, null);
  assert.equal(new Set([...first.products, ...last.products].map(p => p.id)).size, 205);
});

test('catalog changes during pagination require an explicit restart instead of skipping products', async () => {
  const first = await (await pullRoutes.products(pullRequest('?limit=1'))).json();
  const outbox = require('../src/lib/topoms/outbox');
  const changed = structuredClone(await outbox.currentCatalog());
  changed[0].title += ' updated';
  mock.method(outbox, 'currentCatalog', async () => changed);
  const response = await pullRoutes.products(pullRequest(`?cursor=${encodeURIComponent(first.next_cursor)}`));
  assert.equal(response.status, 409);
  assert.match((await response.json()).error, /restart/);
});

test('product pull ignores caller locale and host and fails closed without configured key', async () => {
  const response = await pullRoutes.products(pullRequest('?locale=ba', { 'X-API-Key': 'test-key', host: 'untrusted.example' }));
  const data = await response.json();
  assert.ok(data.products.every(p => p.images.every(url => url.startsWith('https://dermotin.rs/'))));
  const key = process.env.TOPOMS_API_KEY;
  delete process.env.TOPOMS_API_KEY;
  try {
    const unavailable = await pullRoutes.ping(pullRequest());
    assert.equal(unavailable.status, 503);
    assert.ok(!(await unavailable.text()).includes(key));
  } finally { process.env.TOPOMS_API_KEY = key; }
});
