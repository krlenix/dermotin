const { test } = require('node:test');
const assert = require('node:assert/strict');

// Bez mreže: afilijacijski endpoint nije podešen, pa je OMS "nedostupan".
delete process.env.NEXT_PUBLIC_RS_ORDER_WEBHOOK_URL;
delete process.env.NEXT_PUBLIC_BA_ORDER_WEBHOOK_URL;
delete process.env.NEXT_PUBLIC_ME_ORDER_WEBHOOK_URL;

const { getProductsForLocale, getProductVariantsForCountry } = require('../src/config/locales');
const { getCountryConfig, getDefaultCourier } = require('../src/config/countries');
const { calculateCouponDiscount, COUPONS } = require('../src/config/coupons');
const { calculateShippingCost } = require('../src/utils/shipping');
const { orderInputSchema, verifyOrderPricing } = require('../src/lib/order-guard');

const round = (n) => Math.round(n * 100) / 100;

// Isti račun kao QuickOrderForm / CartCheckoutPage u browseru
function browserOrder(locale, lines, { coupon, channel } = {}) {
  const country = getCountryConfig(locale);
  const subtotal = round(lines.reduce((sum, l) => sum + l.price * l.quantity, 0));
  const baseShipping = round(calculateShippingCost(subtotal, getDefaultCourier(country), country));
  const amounts = coupon ? calculateCouponDiscount(coupon, subtotal, baseShipping) : { productDiscount: 0, shippingDiscount: 0, totalDiscount: 0 };
  const shippingCost = round(Math.max(0, baseShipping - amounts.shippingDiscount));
  return {
    customerName: 'Test Kupac',
    customerEmail: '',
    customerPhone: '+381601234567',
    customerAddress: 'Test 1',
    customerCity: 'Beograd',
    customerPostalCode: '11000',
    productName: lines[0].name,
    productVariant: 'test',
    productSku: lines[0].sku,
    quantity: lines.reduce((sum, l) => sum + l.quantity, 0),
    subtotal,
    shippingCost,
    totalPrice: round(Math.max(0, subtotal - amounts.productDiscount) + shippingCost),
    currency: country.currencySymbol,
    courierName: getDefaultCourier(country).name,
    paymentMethod: 'cod',
    bundleItems: {},
    locale,
    eventId: 'evt-test',
    ...(channel ? { channel } : {}),
    ...(coupon && amounts.totalDiscount > 0 ? { coupon: { code: coupon.code, type: coupon.type, ...amounts } } : {}),
    cartItems: lines,
  };
}

async function check(order) {
  const parsed = orderInputSchema.safeParse(order);
  assert.ok(parsed.success, parsed.success ? '' : JSON.stringify(parsed.error.issues));
  return verifyOrderPricing(parsed.data);
}

async function catalogLines(locale) {
  const products = await getProductsForLocale(locale);
  return Object.values(products)
    .filter((p) => p.availableCountries.includes(locale))
    .flatMap((p) => getProductVariantsForCountry(p, locale).map((v) => ({
      productId: p.id, variantId: v.id, sku: v.sku, name: `${p.name} - ${v.name}`, quantity: 1,
      price: round(v.discountPrice ?? v.price), salesChannel: p.salesChannel,
    })));
}

for (const locale of ['rs', 'ba', 'me']) {
  test(`${locale}: svaka varijanta svakog proizvoda prolazi kao u browseru`, async () => {
    const lines = await catalogLines(locale);
    assert.ok(lines.length > 0);
    for (const { salesChannel, ...line } of lines) {
      const result = await check(browserOrder(locale, [line], { channel: salesChannel === 'viber' ? 'viber' : undefined }));
      assert.deepEqual(result, { ok: true }, `${locale} ${line.productId}/${line.variantId}`);
    }
  });

  test(`${locale}: korpa sa više proizvoda (i preko praga besplatne dostave) prolazi`, async () => {
    const lines = (await catalogLines(locale)).filter((l) => !l.salesChannel).slice(0, 4).map(({ salesChannel, ...l }) => ({ ...l, quantity: 3 }));
    assert.deepEqual(await check(browserOrder(locale, lines)), { ok: true });
  });
}

test('rs: reklamni kupon POPUST20 prolazi sa tačnim popustom', async () => {
  const [line] = (await catalogLines('rs')).filter((l) => !l.salesChannel).map(({ salesChannel, ...l }) => l);
  assert.deepEqual(await check(browserOrder('rs', [line], { coupon: COUPONS.POPUST20 })), { ok: true });
});

test('odbija nižu cenu od kataloga', async () => {
  const [line] = (await catalogLines('rs')).filter((l) => !l.salesChannel).map(({ salesChannel, ...l }) => l);
  const result = await check(browserOrder('rs', [{ ...line, price: line.price - 500 }]));
  assert.equal(result.ok, false);
});

test('odbija ukupan iznos koji se ne slaže', async () => {
  const [line] = (await catalogLines('rs')).filter((l) => !l.salesChannel).map(({ salesChannel, ...l }) => l);
  const order = browserOrder('rs', [line]);
  assert.equal((await check({ ...order, totalPrice: order.totalPrice - 300 })).ok, false);
});

test('odbija besplatnu dostavu ispod praga', async () => {
  const [line] = (await catalogLines('rs')).filter((l) => !l.salesChannel && l.price < 3000).map(({ salesChannel, ...l }) => l);
  const order = browserOrder('rs', [line]);
  assert.ok(order.shippingCost > 0);
  assert.equal((await check({ ...order, shippingCost: 0, totalPrice: order.subtotal })).ok, false);
});

test('odbija popust veći od kupona i nepoznat kupon preko 10% kad je OMS nedostupan', async () => {
  const [line] = (await catalogLines('rs')).filter((l) => !l.salesChannel).map(({ salesChannel, ...l }) => l);
  const order = browserOrder('rs', [line], { coupon: COUPONS.POPUST20 });
  const inflated = { ...order, coupon: { ...order.coupon, productDiscount: order.coupon.productDiscount + 200, totalDiscount: order.coupon.totalDiscount + 200 }, totalPrice: order.totalPrice - 200 };
  assert.equal((await check(inflated)).ok, false);

  const fake = browserOrder('rs', [line], { coupon: { code: 'NEKIKOD', type: 'percentage', value: 30, enabled: true } });
  assert.equal((await check(fake)).ok, false);
  const affiliate = browserOrder('rs', [line], { coupon: { code: 'NEKIKOD', type: 'percentage', value: 10, enabled: true } });
  assert.deepEqual(await check(affiliate), { ok: true });
});

test('odbija nepoznat proizvod i kupon na Viber porudžbini', async () => {
  const [line] = (await catalogLines('rs')).filter((l) => !l.salesChannel).map(({ salesChannel, ...l }) => l);
  assert.equal((await check(browserOrder('rs', [{ ...line, productId: 'ne-postoji' }]))).ok, false);
  assert.equal((await check(browserOrder('rs', [line], { channel: 'viber', coupon: COUPONS.POPUST20 }))).ok, false);
});

test('odbija porudžbinu bez telefona ili adrese', () => {
  assert.equal(orderInputSchema.safeParse({ locale: 'rs', customerName: 'Test Kupac' }).success, false);
});
