import { createHash } from 'node:crypto';
import type { Product, ProductVariant } from '../../config/types';
import type { LineItem, WebhookPayload } from '../supabase';

export const digest = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const cents = (value: number) => {
  if (!Number.isFinite(value) || value < 0) throw new Error('Invalid non-negative order amount');
  return Math.round(value * 100);
};
const money = (value: number) => (value / 100).toFixed(2);
const variantId = (productId: string, sku: string) => `v-${digest([productId, sku]).slice(0, 32)}`;
const quantity = (value: number) => {
  if (!Number.isSafeInteger(value) || value < 1 || value > 10000) throw new Error('Invalid quantity');
  return value;
};

export function mapCatalog(products: Record<string, Product>, updatedAt: string, appUrl: string) {
  if (!/^\d{4}-\d\d-\d\dT.*(?:Z|[+-]\d\d:\d\d)$/.test(updatedAt) || !Number.isFinite(Date.parse(updatedAt))) {
    throw new Error('TOPOMS_CATALOG_UPDATED_AT must be the actual catalog revision timestamp with timezone');
  }
  const usedSkus = new Set<string>();
  return Object.values(products).filter(p => !p.isBundle).map(product => {
    if (`p-${product.id}`.length > 64) throw new Error(`TopOMS product ID is too long: ${product.id}`);
    // The shop sells quantity deals sharing a SKU, not separate warehouse stock.
    // Export ONE physical variant per SKU and expand packs to units in orders.
    const groups = new Map<string, ProductVariant[]>();
    for (const v of product.variants) {
      if (!v.sku) throw new Error(`Missing SKU on product ${product.id}`);
      groups.set(v.sku, [...(groups.get(v.sku) || []), v]);
    }
    const variants = [...groups].map(([sku, group]) => {
      if (usedSkus.has(sku)) throw new Error(`Duplicate catalog SKU: ${sku}`);
      usedSkus.add(sku);
      const unit = group.find(v => (v.quantity || 1) === 1);
      if (!unit) throw new Error(`SKU ${sku} requires a single-unit variant`);
      return { id: variantId(product.id, sku), sku, title: unit.name,
        price: money(cents(unit.discountPrice ?? unit.price)), requires_shipping: true };
    });
    if (!variants.length) throw new Error(`Product ${product.id} has no variants`);
    return { id: `p-${product.id}`, title: product.name, handle: product.slug, description: product.description,
      updated_at: updatedAt, status: product.published === false ? 'draft' : 'active',
      variants, images: [new URL(product.images.main, appUrl).toString()] };
  });
}

type CartSource = { sku: string; variantId?: string; productId?: string };
type MappingContext = { timestamp: string; locale: string; domain: string; landingUrl?: string; cartItems?: CartSource[] };
type Unit = { product: Product; sku: string; quantity: number; weight: number };

function resolveUnits(products: Record<string, Product>, sku: string, count: number, variant?: string, productId?: string, seen = new Set<string>()): Unit[] {
  const product = productId ? products[productId] : Object.values(products).find(p => p.id === sku || p.variants.some(v => v.sku === sku));
  if (!product || seen.has(product.id)) throw new Error(`Unknown or circular product: ${sku}`);
  const selected = variant ? product.variants.find(v => v.id === variant) : product.variants.find(v => v.sku === sku) || product.variants.find(v => v.isDefault) || product.variants[0];
  if (!selected || (productId && !product.variants.some(v => v.sku === sku))) throw new Error(`Unknown variant: ${variant || sku}`);
  if (variant && selected.sku !== sku) throw new Error(`Variant does not match SKU: ${sku}`);
  const units = quantity(count) * (variant ? quantity(selected.quantity || 1) : 1);
  if (product.isBundle) {
    if (!product.bundleItems?.length) throw new Error(`Empty bundle: ${product.id}`);
    const path = new Set(seen).add(product.id);
    const components = product.bundleItems.flatMap(item => {
      const component = products[item.productId];
      const v = component?.variants.find(v => v.id === item.variantId) || component?.variants.find(v => v.isDefault) || component?.variants[0];
      if (!v) throw new Error(`Unknown bundle component: ${item.productId}`);
      return resolveUnits(products, v.sku, units * quantity(item.quantity), v.id, item.productId, path);
    });
    // BIOROID promotion splits the set equally: cream 995 RSD + drops 995 RSD.
    return product.id === 'bioroid_set'
      ? components.map(component => ({ ...component, weight: component.quantity }))
      : components;
  }
  const unit = product.variants.find(v => v.sku === selected.sku && (v.quantity || 1) === 1);
  if (!unit) throw new Error(`No physical unit for SKU ${selected.sku}`);
  return [{ product, sku: unit.sku, quantity: quantity(units), weight: cents(unit.discountPrice ?? unit.price) * units }];
}

function mapPhysicalLines(items: LineItem[], products: Record<string, Product>, cartItems?: CartSource[]) {
  const lines: { id: string; variant_id: string; sku: string; name: string; quantity: number; price: string; total_discount: string }[] = [];
  for (const [index, line] of items.entries()) {
    if (line.quantity === 0) continue; // BOGO free row can legitimately be empty.
    const source = cartItems?.[index];
    if (source && (!source.productId || !source.variantId)) throw new Error('Cart checkout must include product and variant IDs');
    const units = resolveUnits(products, line.sku, line.quantity, source?.variantId, source?.productId);
    const gross = cents(line.item_total_price);
    const discount = cents(line.discount);
    if (discount > gross) throw new Error('Line discount exceeds line amount');
    const totalWeight = units.reduce((sum, unit) => sum + unit.weight, 0);
    let remainingGross = gross;
    let remainingDiscount = discount;
    let remainingWeight = totalWeight;
    units.forEach((unit, n) => {
      // Allocate bundles proportionally in integer cents. Last component gets remainder.
      const share = remainingWeight ? unit.weight / remainingWeight : 1 / (units.length - n);
      const componentGross = n === units.length - 1 ? remainingGross : Math.floor(remainingGross * share);
      const componentDiscount = n === units.length - 1 ? remainingDiscount :
        (remainingGross ? Math.floor(remainingDiscount * componentGross / remainingGross) : 0);
      const componentNet = componentGross - componentDiscount;
      remainingGross -= componentGross;
      remainingDiscount -= componentDiscount;
      remainingWeight -= unit.weight;
      // Ceil unit price and allocate cent rounding as line discount: e.g. 4790 / 3.
      const unitPrice = Math.ceil(componentGross / unit.quantity);
      lines.push({ id: `l${index + 1}-${n + 1}`, variant_id: variantId(unit.product.id, unit.sku), sku: unit.sku,
        name: unit.product.name, quantity: unit.quantity, price: money(unitPrice),
        total_discount: money(unitPrice * unit.quantity - componentNet) });
    });
  }
  return lines;
}

/** Legacy OMS stocks the components of a set, never the storefront bundle SKU. */
export function expandLegacyBundles(payload: WebhookPayload, products: Record<string, Product>): WebhookPayload {
  const lineItems = payload.line_items?.flatMap(line => {
    const product = Object.values(products).find(p => p.id === line.sku || p.variants.some(v => v.sku === line.sku));
    if (!product?.isBundle) return [line];
    return mapPhysicalLines([line], products).map(component => ({
      sku: component.sku, name: component.name, quantity: component.quantity,
      price: Number(component.price),
      item_total_price: Number(money(cents(Number(component.price)) * component.quantity)),
      discount: Number(component.total_discount),
    }));
  });
  return { ...payload, line_items: lineItems };
}

export function mapOrder(legacy: WebhookPayload, products: Record<string, Product>, context: MappingContext) {
  if (!legacy.line_items?.length || !legacy.shipping || !legacy.shipping_address || !legacy.billing_address) throw new Error('Incomplete order');
  const lines = mapPhysicalLines(legacy.line_items, products, context.cartItems);
  if (!lines.length) throw new Error('Order has no physical lines');
  const subtotal = lines.reduce((sum, l) => sum + cents(Number(l.price)) * l.quantity, 0);
  const discount = lines.reduce((sum, l) => sum + cents(Number(l.total_discount)), 0);
  const total = subtotal - discount + cents(legacy.shipping.price);
  if (total !== cents(legacy.total_price)) throw new Error('Order total does not match lines, discounts and shipping');
  const address = (input: NonNullable<WebhookPayload['shipping_address']>) => {
    const [first_name, ...last] = input.name.trim().split(/\s+/);
    return { ...input, first_name, last_name: last.join(' ') };
  };
  const marketing = Object.fromEntries(Object.entries(legacy.marketing || {}).filter(([,v]) => v !== null && v !== undefined));
  return {
    id: legacy.order_id, number: legacy.order_id, created_at: context.timestamp, updated_at: context.timestamp,
    currency: legacy.currency, taxes_included: true, financial_status: 'pending',
    payment: { method: 'cash_on_delivery', gateway: 'cod', received_amount: '0.00', refunded_amount: '0.00', outstanding_amount: money(total) },
    payments: [], note: legacy.customer?.note || '', customer: legacy.customer, billing_address: address(legacy.billing_address), shipping_address: address(legacy.shipping_address),
    // This checkout does not compute tax separately. Declare the contract's
    // explicit zero/unconfigured-tax case; TopOMS applies the seller's tax rules.
    // Never invent a VAT rate or change the gross shipping charge.
    line_items: lines, shipping: { price: money(cents(legacy.shipping.price)), tax: '0.00',
      is_taxable: false, tax_rate: null, method: legacy.shipping.method },
    discounts: { total: money(discount), codes: legacy.discount_codes || [] },
    totals: { subtotal: money(subtotal), total: money(total) },
    attribution: { medium: legacy.marketing?.medium || 'website', ...(context.landingUrl ? { landing_url: context.landingUrl.slice(0, 2048) } : {}), params: marketing },
    meta: { _locale: context.locale, _domain: context.domain },
  };
}

export type TopomsProduct = ReturnType<typeof mapCatalog>[number];
export type TopomsOrder = ReturnType<typeof mapOrder>;
