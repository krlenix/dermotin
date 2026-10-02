const { test, afterEach, mock } = require('node:test');
const assert = require('node:assert/strict');

// Offline tests: never load production env or contact a live system.
process.env.SUPABASE_URL = 'https://database.example';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role';
const { digest, mapOrder } = require('../src/lib/topoms/mapping');
const { reserveOrderNumber, usesShortOrderNumbers } = require('../src/lib/topoms/order-number');
const { legacyOrderId } = require('../src/lib/topoms/legacy');
afterEach(() => mock.restoreAll());

test('short numbering is restricted to the custom shop, not separate WP sites', () => {
  assert.equal(usesShortOrderNumbers('dermotin.shop'), true);
  assert.equal(usesShortOrderNumbers('www.dermotin.shop'), true);
  for (const domain of ['dermotin.rs', 'dermotin.com', 'dermotin.co', 'localhost']) {
    assert.equal(usesShortOrderNumbers(domain), false);
  }
});

test('retries use the same durable reservation and return a six-digit number without WEB', async () => {
  const requests = [];
  mock.method(global, 'fetch', async (url, init) => {
    assert.equal(String(url), 'https://database.example/rest/v1/rpc/reserve_checkout_order_number');
    requests.push(JSON.parse(init.body));
    return new Response(JSON.stringify('100001'), { status: 200 });
  });
  assert.equal(await reserveOrderNumber('dermotin.shop', 'checkout-1'), '100001');
  assert.equal(await reserveOrderNumber('dermotin.shop', 'checkout-1'), '100001');
  assert.deepEqual(requests[0], { p_domain: 'dermotin.shop', p_event_key: digest(['dermotin.shop', 'checkout-1']) });
  assert.deepEqual(requests[1], requests[0]);
  assert.equal(legacyOrderId('100001'), '100001');
});

test('independent checkouts and domains have different keys; no-event callers get fresh keys', async () => {
  const keys = new Set();
  mock.method(global, 'fetch', async (_url, init) => {
    const key = JSON.parse(init.body).p_event_key;
    assert.equal(keys.has(key), false);
    keys.add(key);
    return new Response(JSON.stringify(String(100000 + keys.size)), { status: 200 });
  });
  await reserveOrderNumber('dermotin.shop', 'one');
  await reserveOrderNumber('dermotin.shop', 'two');
  await reserveOrderNumber('www.dermotin.shop', 'one');
  await reserveOrderNumber('dermotin.shop');
  await reserveOrderNumber('dermotin.shop');
  assert.equal(keys.size, 5);
});

test('an old accepted checkout keeps exactly its original ID', async () => {
  const previous = `WEB-${digest(['dermotin.shop', 'previous-checkout']).slice(0, 40)}`;
  mock.method(global, 'fetch', async () => new Response(JSON.stringify(previous), { status: 200 }));
  assert.equal(await reserveOrderNumber('dermotin.shop', 'previous-checkout'), previous);
});

test('database errors and invalid reservation results fail closed, with no random fallback', async () => {
  for (const result of [null, 100001, '', '123', 'WEB-unrelated', {}, '0100001']) {
    mock.method(global, 'fetch', async () => new Response(JSON.stringify(result), { status: 200 }));
    await assert.rejects(reserveOrderNumber('dermotin.shop', 'one'), /Unable to reserve/);
    mock.restoreAll();
  }
  mock.method(global, 'fetch', async () => new Response(JSON.stringify({ message: 'unavailable' }), { status: 503 }));
  await assert.rejects(reserveOrderNumber('dermotin.shop', 'one'), /Unable to reserve/);
});

test('no request is made for an unsupported shop domain', async () => {
  mock.method(global, 'fetch', async () => assert.fail('Unexpected network request'));
  await assert.rejects(reserveOrderNumber('dermotin.rs', 'one'), /not supported/);
});

test('short external number is identical in both OMS payloads', async () => {
  const { getProductsForLocale } = require('../src/config/locales');
  const payload = {
    order_id: '100001', created_at: '2026-09-03 20:00:00', currency: 'RSD', financial_status: 'pending', total_price: 2380,
    customer: { phone: '+38160000000' },
    billing_address: { name: 'Test', address1: 'Test 1', city: 'Beograd', zip: '11000', country_code: 'RS' },
    shipping_address: { name: 'Test', address1: 'Test 1', city: 'Beograd', zip: '11000', country_code: 'RS' },
    line_items: [{ sku: 'FUNGEL', name: 'FUNGEL', quantity: 1, price: 1990, item_total_price: 1990, discount: 0 }],
    shipping: { price: 390, method: 'Post Express' }, discount_codes: [], marketing: {},
  };
  const mapped = mapOrder(payload, await getProductsForLocale('rs'), { domain: 'dermotin.shop', locale: 'rs', timestamp: '2026-09-03T18:00:00Z' });
  assert.equal(mapped.id, '100001');
  assert.equal(mapped.number, '100001');
  assert.equal(legacyOrderId(payload.order_id), mapped.id);
});
