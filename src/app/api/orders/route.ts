import crypto from 'crypto';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { after, NextRequest, NextResponse } from 'next/server';
import { getCountryConfig } from '@/config/countries';
import { getTrackingSite } from '@/config/pixels';
import { getMarketingCookiesFromHeaders, MarketingParams } from '@/utils/marketing-cookies';
import { OrderService, webhookToOrderRecord, WebhookPayload, LineItem } from '@/lib/supabase';
import { sendCapiPurchaseEvent } from '@/lib/capi';
import { getProductsForLocale } from '@/config/locales';
import { topomsEnabledFor } from '@/lib/topoms/config';
import { digest, expandLegacyBundles, mapOrder } from '@/lib/topoms/mapping';
import { enqueueOrder, drainDeliveries } from '@/lib/topoms/outbox';
import { reserveOrderNumber, usesShortOrderNumbers } from '@/lib/topoms/order-number';
import { orderInputSchema, verifyOrderPricing } from '@/lib/order-guard';
import { allowRequest, clientIp as requestIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const maxDuration = 120;

// Configure dayjs with timezone support
dayjs.extend(utc);
dayjs.extend(timezone);

// Helper function to round prices to 2 decimal places
function roundPrice(price: number): number {
  return Math.round(price * 100) / 100;
}

// Idempotency cache: prevents duplicate CAPI Purchase events when the same
// browser-generated eventId is submitted more than once (e.g. user double-clicks,
// browser auto-retry, network jitter). Lives only in-memory per server instance —
// fine for single-instance Next.js dev/prod, swap for Redis if you go multi-instance.
const RECENT_EVENT_IDS = new Map<string, { orderId: string; timestamp: number }>();
const IDEMPOTENCY_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

function pruneExpiredEventIds(): void {
  const now = Date.now();
  for (const [key, value] of RECENT_EVENT_IDS.entries()) {
    if (now - value.timestamp > IDEMPOTENCY_WINDOW_MS) {
      RECENT_EVENT_IDS.delete(key);
    }
  }
}

export interface CouponData {
  code: string;
  type: 'absolute' | 'percentage' | 'free_shipping' | 'bogo';
  productDiscount: number;
  shippingDiscount: number;
  totalDiscount: number;
  // BOGO-specific fields
  isBOGO?: boolean;
  bogoQuantity?: number;
  bogoFreeItems?: number;
  bogoFreeValue?: number;
  bogoTotalItems?: number;
}

export interface CartOrderItem {
  productId?: string;
  variantId?: string;
  sku: string;
  name: string;
  quantity: number;
  price: number;
}

export interface OrderData {
  orderId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  customerPostalCode: string;
  productName: string;
  productVariant: string;
  productSku?: string;
  quantity: number;
  paidQuantity?: number; // For BOGO: number of items paid for
  freeQuantity?: number; // For BOGO: number of free items
  totalPrice: number;
  subtotal: number;
  shippingCost: number;
  currency: string;
  courierName: string;
  deliveryTime: string;
  paymentMethod: string;
  bundleItems?: Record<string, number>;
  locale: string;
  coupon?: CouponData;
  // Multi-item cart orders (classic shop checkout). When present, line items
  // are built directly from this array instead of the single-product fields.
  cartItems?: CartOrderItem[];
  // BOGO-specific fields
  isBOGO?: boolean;
  bogoDetails?: {
    unitPrice: number;
    paidQuantity: number;
    freeQuantity: number;
    totalQuantity: number;
  };
}

// WebhookPayload interface is now imported from supabase.ts

// Function to get domain for X-Shop-Domain header (prioritize dynamic URL detection)
function getCurrentDomain(req: NextRequest): string {
  return req.headers.get('host') || process.env.NEXT_PUBLIC_DOMAIN || 'localhost';
}

async function sendToWebhook(webhookData: WebhookPayload, countryCode: string, currentDomain: string) {

  webhookData = expandLegacyBundles(webhookData, await getProductsForLocale(countryCode, true));

  const countryConfig = getCountryConfig(countryCode);
  

  
  // Check if webhooks are configured for this country
  if (!countryConfig.webhooks || !countryConfig.webhooks.orders) {
    
    return null;
  }
  
  const configuredWebhook = countryConfig.webhooks.orders;
  const trackingSite = getTrackingSite(currentDomain);
  const domainApiKey = trackingSite === 'dermotin_rs'
    ? process.env.RS_ORDER_API_KEY_SITE_RS
    : trackingSite === 'dermotin_co'
      ? process.env.RS_ORDER_API_KEY_SITE_CO
      : undefined;
  const webhookConfig = domainApiKey
    ? { ...configuredWebhook, authMethod: 'api-key' as const, apiKey: domainApiKey }
    : configuredWebhook;

  
  // Skip if webhook URL is not configured
  if (!webhookConfig.url) {
    return null;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Shop-Domain': currentDomain,
    'X-Country-Code': countryCode.toUpperCase(),
    'X-Auth-Method': webhookConfig.authMethod,
    'X-Webhook-Type': 'order'
  };
  


  if (webhookConfig.authMethod === 'signature' && webhookConfig.webhookSecret) {
    // Create HMAC signature
    const timestamp = Math.floor(Date.now() / 1000);
    const signatureData = `${timestamp}.${JSON.stringify(webhookData)}`;
    const signature = crypto
      .createHmac('sha256', webhookConfig.webhookSecret)
      .update(signatureData)
      .digest('hex');

    headers['X-Webhook-Signature'] = signature;
    headers['X-Webhook-Timestamp'] = timestamp.toString();
    
    // Using signature authentication
  } else if (webhookConfig.authMethod === 'api-key' && webhookConfig.apiKey) {
    // Use API key
    headers['X-API-Key'] = webhookConfig.apiKey;
    // Using API key authentication
  }

  try {
    // Bez ispisa payload-a: sadrži ime, telefon i adresu kupca
    const response = await fetch(webhookConfig.url, {
      method: 'POST',
      headers,
      body: JSON.stringify(webhookData)
    });

    let result;
    const responseText = await response.text();
    
    try {
      result = JSON.parse(responseText);
    } catch {
      result = { error: 'Invalid JSON response', raw: responseText };
    }

    if (!response.ok) {
      throw new Error(result.error || result.message || `Webhook failed with status ${response.status}`);
    }

    return result;
  } catch (error) {
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get current domain early in the handler
    const currentDomain = getCurrentDomain(request);

    // Zaštita od skripti koje šalju lažne porudžbine pouzećem (dostava se plaća)
    if (!allowRequest(`order:${requestIp(request)}`, 20, 10 * 60 * 1000)) {
      return NextResponse.json(
        { success: false, error: 'Previše pokušaja za kratko vreme. Sačekajte nekoliko minuta ili nas pozovite.' },
        { status: 429 }
      );
    }

    let rawOrder: unknown;
    try {
      rawOrder = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Neispravan zahtev.' }, { status: 400 });
    }
    const parsed = orderInputSchema.safeParse(rawOrder);
    if (!parsed.success) {
      console.warn('Order rejected: invalid fields', parsed.error.issues.map((issue) => issue.path.join('.')).join(', '));
      return NextResponse.json(
        { success: false, error: 'Proverite podatke za isporuku i pokušajte ponovo.' },
        { status: 400 }
      );
    }
    const pricing = await verifyOrderPricing(parsed.data);
    if (!pricing.ok) {
      console.warn('Order rejected: pricing', pricing.reason);
      return NextResponse.json(
        { success: false, error: 'Cene su se u međuvremenu promenile. Osvežite stranicu i pokušajte ponovo.' },
        { status: 422 }
      );
    }

    const orderData = parsed.data as unknown as Omit<OrderData, 'orderId'> & {
      fbp?: string;
      fbc?: string;
      eventId?: string;
      pageUrl?: string;
      marketingParams?: MarketingParams;
      coupon?: CouponData;
      // Campaign channel outside paid social (e.g. Viber). Such orders never
      // emit a Meta CAPI Purchase, so they cannot touch ad optimization.
      channel?: 'viber';
    };
    const isOfflineChannel = orderData.channel === 'viber';
    if (isOfflineChannel) {
      orderData.marketingParams = { ...(orderData.marketingParams || {}), medium: 'viber' } as MarketingParams;
    }

    const customerEmail = orderData.customerEmail?.trim() || undefined;
    if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Get marketing parameters from cookies first, then fall back to request body
    const cookieHeader = request.headers.get('cookie');
    const cookieMarketingParams = getMarketingCookiesFromHeaders(cookieHeader);

    // Prefer request body (always fresh, includes sessionStorage data)
    // Fall back to cookies if request body doesn't have data
    const hasBodyData = orderData.marketingParams && (
      orderData.marketingParams.campaign_id || 
      orderData.marketingParams.adset_id || 
      orderData.marketingParams.ad_id ||
      orderData.marketingParams.aff_id ||
      (orderData.marketingParams.medium && orderData.marketingParams.medium !== 'website')
    );
    
    const marketingParams = hasBodyData ? orderData.marketingParams : cookieMarketingParams;

    // Idempotency guard — if the browser submits the same eventId twice, return
    // the original orderId without re-running the webhook or re-firing CAPI Purchase.
    pruneExpiredEventIds();
    if (orderData.eventId) {
      const existing = RECENT_EVENT_IDS.get(`${currentDomain}:${orderData.eventId}`);
      if (existing) {
        console.warn('⚠️ Duplicate submit detected for eventId', orderData.eventId, '— returning cached orderId', existing.orderId);
        return NextResponse.json({
          success: true,
          orderId: existing.orderId,
          message: 'Duplicate request — returning original order',
          duplicate: true,
        });
      }
    }

    const dualDelivery = topomsEnabledFor(orderData.locale, currentDomain);
    if (orderData.eventId && (typeof orderData.eventId !== 'string' || orderData.eventId.length > 200)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }
    // Shop numbers are allocated in Postgres, not shortened random hashes.
    // The reservation also recognizes pre-migration retries and preserves their IDs.
    let orderId: string;
    if (usesShortOrderNumbers(currentDomain)) {
      try {
        orderId = await reserveOrderNumber(currentDomain, orderData.eventId);
      } catch {
        // No order, webhook or purchase event is emitted without a stable number.
        return NextResponse.json({ success: false, error: 'Porudžbinu trenutno nije moguće sačuvati. Pokušajte ponovo.' }, { status: 503 });
      }
    } else {
      orderId = dualDelivery && orderData.eventId
        ? `WEB-${digest([currentDomain, orderData.eventId]).slice(0, 40)}`
        : `WEB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Get country configuration
    const countryConfig = getCountryConfig(orderData.locale);
    
    // Get client IP and user agent for CAPI
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const clientUserAgent = request.headers.get('user-agent') || undefined;
    const referer = request.headers.get('referer') || undefined;
    const eventSourceUrl = orderData.pageUrl || referer;

    // Check if this is a BOGO order
    const isBOGOOrder = orderData.isBOGO && orderData.bogoDetails;
    
    // Calculate individual product price (subtotal minus bundle items)
    const bundleTotal = orderData.bundleItems ? Object.values(orderData.bundleItems).reduce((sum, price) => sum + price, 0) : 0;
    const mainProductPrice = orderData.subtotal - bundleTotal;
    
    // Get product discount amount (excluding shipping discount)
    const totalProductDiscount = orderData.coupon?.productDiscount || 0;

    // Check if this is a multi-item cart order (classic shop checkout)
    const isCartOrder = Array.isArray(orderData.cartItems) && orderData.cartItems.length > 0;

    // Build line items based on order type
    const lineItems: LineItem[] = [];
    
    if (isCartOrder && orderData.cartItems) {
      // Cart order: one line item per cart line
      orderData.cartItems.forEach((item) => {
        lineItems.push({
          sku: item.sku || 'UNKNOWN',
          name: item.name,
          quantity: item.quantity,
          price: roundPrice(item.price),
          item_total_price: roundPrice(item.price * item.quantity),
          discount: 0
        });
      });
    } else if (isBOGOOrder && orderData.bogoDetails) {
      // BOGO order: create separate line items for paid and free items
      const { unitPrice, paidQuantity, freeQuantity } = orderData.bogoDetails;
      
      // Paid items line
      lineItems.push({
        sku: orderData.productSku || 'UNKNOWN',
        name: `${orderData.productName} (Paid)`,
        quantity: paidQuantity,
        price: roundPrice(unitPrice),
        item_total_price: roundPrice(unitPrice * paidQuantity),
        discount: 0
      });
      
      // Free items line (price is unit price but with 100% discount)
      lineItems.push({
        sku: orderData.productSku || 'UNKNOWN',
        name: `${orderData.productName} (FREE - BOGO)`,
        quantity: freeQuantity,
        price: roundPrice(unitPrice),
        item_total_price: roundPrice(unitPrice * freeQuantity),
        discount: roundPrice(unitPrice * freeQuantity) // Full discount = free
      });
      
    } else {
      // Regular order
      lineItems.push({
        sku: orderData.productSku || 'UNKNOWN',
        name: orderData.productName,
        quantity: orderData.quantity,
        price: roundPrice(mainProductPrice / orderData.quantity),
        item_total_price: roundPrice(mainProductPrice),
        discount: 0 // Will be calculated below
      });
      
      // Add bundle items if present
      if (orderData.bundleItems && Object.keys(orderData.bundleItems).length > 0) {
        Object.entries(orderData.bundleItems).forEach(([productId, totalPrice]) => {
          const bundleQuantity = 1;
          lineItems.push({
            sku: productId,
            name: `Bundle Item - ${productId}`,
            quantity: bundleQuantity,
            price: roundPrice(totalPrice / bundleQuantity),
            item_total_price: roundPrice(totalPrice),
            discount: 0 // Will be calculated below
          });
        });
      }
    }

    // Distribute product discounts for both single-product and classic cart orders.
    // BOGO line items already carry their own full discount on the free item.
    if (!isBOGOOrder && totalProductDiscount > 0 && lineItems.length > 0) {
      const totalOrderValue = lineItems.reduce((sum, item) => sum + item.item_total_price, 0);
      const distributableDiscount = Math.min(totalProductDiscount, totalOrderValue);
      let remainingDiscount = distributableDiscount;


      lineItems.forEach((item, index) => {
        if (index === lineItems.length - 1) {
          // Last item gets the remainder so rounded line discounts match the order discount.
          item.discount = roundPrice(remainingDiscount);
        } else {
          const itemProportion = item.item_total_price / totalOrderValue;
          item.discount = roundPrice(distributableDiscount * itemProportion);
          remainingDiscount -= item.discount;
        }
      });
    }
    
    // Prepare webhook payload to match Laravel controller validation
    const currentDate = dayjs().tz(countryConfig.timezone);
    const formattedDate = currentDate.format('YYYY-MM-DD HH:mm:ss');
    
    const webhookPayload: WebhookPayload = {
      order_id: orderId,
      created_at: formattedDate, // Laravel date format
      currency: countryConfig.currency, // Should be RSD or BAM (3 chars)
      total_price: roundPrice(orderData.totalPrice),
      financial_status: 'pending', // Laravel expects 'pending' or 'paid'
      customer: {
        ...(customerEmail ? { email: customerEmail } : {}),
        phone: orderData.customerPhone,
        note: ''
      },
      billing_address: {
        name: orderData.customerName, // Required by Laravel validation
        address1: orderData.customerAddress, // Required by Laravel validation
        address2: '',
        city: orderData.customerCity, // Required by Laravel validation
        zip: orderData.customerPostalCode || '',
        country_code: countryConfig.code.toUpperCase(), // Should be RS or BA (2 chars)
        phone: orderData.customerPhone
      },
      shipping_address: {
        name: orderData.customerName,
        address1: orderData.customerAddress,
        address2: '',
        city: orderData.customerCity,
        zip: orderData.customerPostalCode || '',
        country_code: countryConfig.code.toUpperCase(),
        phone: orderData.customerPhone
      },
      line_items: lineItems, // Use the line items with distributed discounts
      shipping: {
        price: roundPrice(orderData.shippingCost),
        method: orderData.courierName
      },
      discount_codes: orderData.coupon ? [orderData.coupon.code] : [],
      marketing: {
        campaign_id: marketingParams?.campaign_id || null,
        adset_id: marketingParams?.adset_id || null,
        ad_id: marketingParams?.ad_id || null,
        aff_id: marketingParams?.aff_id || null,
        medium: marketingParams?.medium || 'website'
      }
    };

    if (dualDelivery) {
      let topomsOrder;
      try {
        topomsOrder = mapOrder(webhookPayload, await getProductsForLocale(orderData.locale), {
          timestamp: currentDate.toISOString(), locale: orderData.locale, domain: currentDomain,
          landingUrl: eventSourceUrl, cartItems: orderData.cartItems,
        });
      } catch {
        return NextResponse.json({ success: false, error: 'Porudžbina nema ispravne proizvode, količine ili iznose.' }, { status: 422 });
      }
      try {
        const queued = await enqueueOrder(webhookPayload, topomsOrder, { locale: orderData.locale, domain: currentDomain });
        after(async () => {
          try { await drainDeliveries(35_000, currentDomain.toLowerCase()); } catch { console.error('OMS worker unavailable; scheduled worker must resume delivery'); }
        });
        if (queued.duplicate) {
          return NextResponse.json({ success: true, orderId, duplicate: true, webhookStatus: 'queued', topomsStatus: 'queued' });
        }
      } catch {
        // Nothing was sent to either OMS. Never accept an order that is not durable.
        return NextResponse.json({ success: false, error: 'Porudžbinu trenutno nije moguće sačuvati. Pokušajte ponovo.' }, { status: 503 });
      }
    }

    // Statusi se beleže u log (bez podataka kupca), a ne vraćaju browseru
    let webhookStatus = 'pending';
    let supabaseStatus = 'pending';
    let capiStatus = 'pending';

    // First, insert order into Supabase database
    try {
      const orderRecord = webhookToOrderRecord(webhookPayload, orderData.locale, currentDomain);
      const supabaseResult = await OrderService.insertOrder(orderRecord);

      if (supabaseResult.success) {
        supabaseStatus = 'success';
      } else {
        supabaseStatus = 'failed';
        console.error('❌ Failed to save order to Supabase:', orderId, supabaseResult.error || 'Unknown Supabase error');
        // Continue with webhook even if Supabase fails
      }
    } catch (supabaseErr) {
      supabaseStatus = 'failed';
      console.error('❌ Unexpected error saving to Supabase:', orderId, supabaseErr instanceof Error ? supabaseErr.message : supabaseErr);
    }

    // Send to webhook (skipped on local dev when WEBHOOK_DRY_RUN=true so the
    // full success path — including CAPI Purchase + browser Pixel Purchase —
    // can be verified end-to-end without hitting the production endpoint).
    const webhookDryRun = process.env.WEBHOOK_DRY_RUN === 'true';
    if (dualDelivery) {
      webhookStatus = 'queued';
    } else if (webhookDryRun) {
      webhookStatus = 'skipped';
    } else {
      try {
        await sendToWebhook(webhookPayload, orderData.locale, currentDomain);
        webhookStatus = 'success';
      } catch (webhookErr) {
        console.error('❌ Failed to send order to webhook:', orderId, webhookErr instanceof Error ? webhookErr.message : webhookErr);

        // Return error if webhook fails — do NOT fire CAPI Purchase for a failed order.
        // This is what prevents phantom Purchase events being recorded in Meta when the
        // backend webhook fails (and prevents duplicates when the user retries).
        return NextResponse.json(
          { success: false, error: 'Porudžbinu trenutno nije moguće poslati. Pokušajte ponovo ili nas pozovite.' },
          { status: 502 }
        );
      }
    }

    // Order is confirmed at this point. Now (and only now) fire the CAPI Purchase.
    // The same eventId was generated in the browser and will also be used by the
    // browser-side fbq Purchase call → Meta deduplicates them as a single event.
    if (isOfflineChannel) {
      capiStatus = 'skipped';
    } else try {
      
      // Split customer name into first and last name
      const nameParts = orderData.customerName.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const capiResult = await sendCapiPurchaseEvent(orderData.locale, {
        orderId,
        currency: countryConfig.currency,
        totalPrice: roundPrice(orderData.totalPrice),
        customerEmail,
        customerPhone: orderData.customerPhone || undefined,
        customerFirstName: firstName,
        customerLastName: lastName,
        customerCity: orderData.customerCity || undefined,
        customerZip: orderData.customerPostalCode || undefined,
        customerCountry: countryConfig.code.toUpperCase(),
        clientIp,
        clientUserAgent,
        fbp: orderData.fbp,
        fbc: orderData.fbc,
        eventSourceUrl,
        eventId: orderData.eventId, // Use the same event ID from the browser pixel for deduplication
        lineItems: webhookPayload.line_items?.map(item => ({
          sku: item.sku,
          name: item.name,
          quantity: item.quantity,
          price: item.price, // Already rounded in webhookPayload
        })),
      }, request.headers.get('x-forwarded-host')?.split(',')[0]?.trim() || currentDomain);
      
      if (capiResult.success) {
        capiStatus = 'success';
      } else {
        capiStatus = 'failed';
        console.error('❌ Failed to send CAPI event:', orderId, capiResult.error || 'Unknown CAPI error');
        // Continue — order itself is already accepted, CAPI failure is non-fatal
      }
    } catch (capiErr) {
      capiStatus = 'failed';
      console.error('❌ Unexpected CAPI error:', orderId, capiErr instanceof Error ? capiErr.message : capiErr);
    }

    // Record the eventId so duplicate submits in the next 5min are short-circuited
    if (orderData.eventId) {
      RECENT_EVENT_IDS.set(`${currentDomain}:${orderData.eventId}`, { orderId, timestamp: Date.now() });
    }

    console.log('✅ Order accepted:', orderId, { locale: orderData.locale, webhookStatus, supabaseStatus, capiStatus });
    return NextResponse.json({ success: true, orderId, topomsStatus: dualDelivery ? 'queued' : 'disabled' });

  } catch (error) {
    console.error('❌ Order processing error:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { success: false, error: 'Porudžbinu trenutno nije moguće poslati. Pokušajte ponovo ili nas pozovite.' },
      { status: 500 }
    );
  }
}
