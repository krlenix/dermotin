// Serverska provera porudžbine: obavezna polja i cene iz kataloga, a ne iz browsera.
// Browser i server računaju istim funkcijama (variant cena, dostava, kupon), pa se
// ispravne porudžbine poklapaju; odbija se samo porudžbina jeftinija od kataloga.

import { z } from 'zod';
import { getCountryConfig, getDefaultCourier } from '@/config/countries';
import { getProductsForLocale, getProductVariantsForCountry } from '@/config/locales';
import { BOGO_CONFIG, calculateCouponDiscount } from '@/config/coupons';
import { isBOGOActive } from '@/utils/bogo-cookies';
import { calculateShippingCost } from '@/utils/shipping';
import { resolveCoupon } from '@/lib/coupons-server';

const money = z.number().finite().min(0).max(10_000_000);
const text = (max: number) => z.string().trim().max(max);

export const orderInputSchema = z
  .object({
    customerName: text(120).pipe(z.string().min(3)),
    customerEmail: text(200).optional(),
    customerPhone: text(30).pipe(z.string().regex(/^\+?[\d\s()/.-]{6,}$/)),
    customerAddress: text(200).pipe(z.string().min(3)),
    customerCity: text(100).pipe(z.string().min(2)),
    customerPostalCode: text(12).optional(),
    locale: z.enum(['rs', 'ba', 'me']),
    productName: text(500),
    productVariant: text(2000).optional(),
    productSku: text(100).optional(),
    quantity: z.number().int().min(1).max(200),
    subtotal: money,
    shippingCost: money,
    totalPrice: money,
    courierName: text(100).optional(),
    eventId: text(200).optional(),
    pageUrl: text(2048).optional(),
    channel: z.literal('viber').optional(),
    coupon: z
      .object({
        code: text(60),
        type: text(30),
        productDiscount: money,
        shippingDiscount: money,
        totalDiscount: money,
      })
      .optional(),
    cartItems: z
      .array(
        z.object({
          productId: text(100),
          variantId: text(100),
          sku: text(100),
          name: text(300),
          quantity: z.number().int().min(1).max(50),
          price: money,
        })
      )
      .min(1)
      .max(30)
      .optional(),
  })
  .passthrough();

export type OrderInput = z.infer<typeof orderInputSchema>;

export type PricingCheck = { ok: true } | { ok: false; reason: string };

// Zaokruživanje cena na 2 decimale u browseru (BAM ima decimale)
const TOLERANCE = 0.02;
const round = (value: number) => Math.round(value * 100) / 100;
const fail = (reason: string): PricingCheck => ({ ok: false, reason });

export async function verifyOrderPricing(order: OrderInput): Promise<PricingCheck> {
  const country = getCountryConfig(order.locale);
  const products = await getProductsForLocale(order.locale);
  const bogoOrder = isBOGOActive() && order.coupon?.code?.toUpperCase() === BOGO_CONFIG.couponCode;

  if (order.cartItems?.length) {
    let catalogSubtotal = 0;
    let clientSubtotal = 0;
    for (const item of order.cartItems) {
      const product = products[item.productId];
      if (!product || !product.availableCountries.includes(order.locale)) return fail(`unknown product ${item.productId}`);
      const variant = getProductVariantsForCountry(product, order.locale).find((v) => v.id === item.variantId);
      if (!variant || variant.sku !== item.sku) return fail(`unknown variant ${item.variantId}`);
      const unit = variant.discountPrice ?? variant.price;
      // 1+1: obe stavke para nose pola cene, proverava se zbir ispod
      if (!bogoOrder && item.price + TOLERANCE < unit) return fail(`price below catalog for ${item.sku}`);
      catalogSubtotal += unit * item.quantity;
      clientSubtotal += item.price * item.quantity;
    }
    if (bogoOrder && clientSubtotal + TOLERANCE < catalogSubtotal / 2) return fail('1+1 subtotal below half of catalog');
    if (Math.abs(round(clientSubtotal) - order.subtotal) > TOLERANCE * order.cartItems.length) return fail('subtotal does not match lines');
  } else {
    // Stari oblik porudžbine (jedan proizvod bez cartItems): bar cena jednog pakovanja tog SKU-a
    const prices = Object.values(products)
      .filter((p) => p.availableCountries.includes(order.locale))
      .flatMap((p) => getProductVariantsForCountry(p, order.locale))
      .filter((v) => v.sku === order.productSku)
      .map((v) => v.discountPrice ?? v.price);
    if (!prices.length) return fail(`unknown sku ${order.productSku}`);
    if (order.subtotal + TOLERANCE < Math.min(...prices)) return fail('legacy subtotal below catalog');
  }

  const baseShipping = round(calculateShippingCost(order.subtotal, getDefaultCourier(country), country));
  const coupon = order.coupon;
  let maxProductDiscount = 0;
  let maxShippingDiscount = 0;

  if (coupon && coupon.totalDiscount > 0) {
    if (order.channel === 'viber') return fail('coupon on viber order');
    const resolved = await resolveCoupon(coupon.code, order.subtotal, order.locale);
    if (resolved.valid) {
      const expected = calculateCouponDiscount(resolved.coupon, order.subtotal, baseShipping);
      maxProductDiscount = expected.productDiscount;
      maxShippingDiscount = expected.shippingDiscount;
    } else if (resolved.error === 'unavailable') {
      // OMS nedostupan: afilijacijski kodovi su uvek 10%, ne odbijamo kupca zbog toga
      maxProductDiscount = round(order.subtotal * 0.1);
    } else {
      return fail(`coupon ${resolved.error}`);
    }
  }

  const productDiscount = coupon?.productDiscount ?? 0;
  const shippingDiscount = coupon?.shippingDiscount ?? 0;
  if (productDiscount > maxProductDiscount + TOLERANCE) return fail('product discount above coupon');
  if (shippingDiscount > maxShippingDiscount + TOLERANCE) return fail('shipping discount above coupon');
  if (order.shippingCost + TOLERANCE < baseShipping - shippingDiscount) return fail('shipping below tariff');

  const expectedTotal = Math.max(0, order.subtotal - productDiscount) + order.shippingCost;
  if (Math.abs(order.totalPrice - expectedTotal) > TOLERANCE) return fail('total does not match');

  return { ok: true };
}
