/**
 * Meta Conversion API (CAPI) Service
 * Handles server-side event tracking to Meta's Conversion API
 */

import crypto from 'crypto';
import { getPixelConfig } from '@/config/pixels';

export const CAPI_EVENTS = {
  PAGE_VIEW: 'PageView',
  VIEW_CONTENT: 'ViewContent',
  INITIATE_CHECKOUT: 'InitiateCheckout',
  PURCHASE: 'Purchase',
  ADD_TO_CART: 'AddToCart',
  LEAD: 'Lead',
  COMPLETE_REGISTRATION: 'CompleteRegistration',
} as const;

/**
 * Hash a value using SHA-256 (required by Meta CAPI)
 */
function hashValue(value: string | null | undefined): string | null {
  if (!value || value.trim() === '') return null;
  
  // Normalize the value (lowercase, trim whitespace)
  const normalized = value.toLowerCase().trim();
  
  // Return SHA-256 hash
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

/**
 * Normalize phone number (remove spaces, dashes, etc.)
 */
function normalizePhone(phone: string | null | undefined): string | null {
  if (!phone) return null;
  
  // Remove all non-digit characters except the leading +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  return cleaned || null;
}

/**
 * User data for CAPI events (will be hashed automatically)
 */
export interface CapiUserData {
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
  externalId?: string | null;
  clientIpAddress?: string | null;
  clientUserAgent?: string | null;
  fbp?: string | null; // Facebook browser ID (_fbp cookie)
  fbc?: string | null; // Facebook click ID (_fbc cookie)
}

/**
 * Custom data for CAPI events
 */
export interface CapiCustomData {
  currency?: string;
  value?: number;
  content_type?: string;
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  contents?: Array<{
    id: string;
    quantity: number;
    item_price?: number;
  }>;
  num_items?: number;
  order_id?: string;
  predicted_ltv?: number;
}

/**
 * Complete CAPI event data
 */
export interface CapiEventData {
  eventName: string;
  eventTime: number;
  eventId?: string; // For deduplication with browser pixel
  eventSourceUrl?: string;
  actionSource: 'website' | 'email' | 'app' | 'phone_call' | 'chat' | 'physical_store' | 'system_generated' | 'other';
  userData: CapiUserData;
  customData?: CapiCustomData;
  optOut?: boolean;
}

/**
 * CAPI API request payload
 */
interface CapiRequestPayload {
  data: Array<{
    event_name: string;
    event_time: number;
    event_id?: string;
    event_source_url?: string;
    action_source: string;
    user_data: {
      em?: string[] | null[];
      ph?: string[] | null[];
      fn?: string[] | null[];
      ln?: string[] | null[];
      ct?: string[] | null[];
      st?: string[] | null[];
      zp?: string[] | null[];
      country?: string[] | null[];
      external_id?: string[] | null[];
      client_ip_address?: string;
      client_user_agent?: string;
      fbp?: string;
      fbc?: string;
    };
    custom_data?: {
      currency?: string;
      value?: string | number;
      content_type?: string;
      content_name?: string;
      content_category?: string;
      content_ids?: string[];
      contents?: Array<{
        id: string;
        quantity: number;
        item_price?: number;
      }>;
      num_items?: number;
      order_id?: string;
      predicted_ltv?: number;
    };
    opt_out?: boolean;
  }>;
  test_event_code?: string;
}

/**
 * Send event to Meta Conversion API
 */
export async function sendCapiEvent(
  countryCode: string,
  eventData: CapiEventData
): Promise<{ success: boolean; error?: string; eventId?: string }> {
  // console.log('\n' + '='.repeat(80));
  // console.log('🚀 CAPI EVENT TRIGGERED');
  // console.log('='.repeat(80));
  
  const pixelConfig = getPixelConfig(countryCode);
  
  // Check if CAPI is enabled for this country
  if (!pixelConfig.meta.capi || !pixelConfig.meta.capi.enabled) {
    // console.log(`🔇 CAPI not enabled for country: ${countryCode}`);
    // console.log('='.repeat(80) + '\n');
    return { success: false, error: 'CAPI not configured for this country' };
  }
  
  const capiConfig = pixelConfig.meta.capi;
  
  // Generate event ID if not provided (for deduplication)
  const eventId = eventData.eventId || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // console.log('📊 Event Details:');
  // console.log('  Event Name:', eventData.eventName);
  // console.log('  Event ID:', eventId);
  // console.log('  Country:', countryCode);
  // console.log('  Pixel ID:', pixelConfig.meta.pixelId);
  // console.log('  Test Mode:', !!capiConfig.testEventCode);
  // console.log('  Event Source URL:', eventData.eventSourceUrl || 'N/A');
  // console.log('  Action Source:', eventData.actionSource);
  
  // console.log('\n👤 Raw User Data (before hashing):');
  // console.log('  Email:', eventData.userData.email || 'N/A');
  // console.log('  Phone:', eventData.userData.phone || 'N/A');
  // console.log('  First Name:', eventData.userData.firstName || 'N/A');
  // console.log('  Last Name:', eventData.userData.lastName || 'N/A');
  // console.log('  City:', eventData.userData.city || 'N/A');
  // console.log('  State:', eventData.userData.state || 'N/A');
  // console.log('  ZIP:', eventData.userData.zip || 'N/A');
  // console.log('  Country:', eventData.userData.country || 'N/A');
  // console.log('  External ID:', eventData.userData.externalId || 'N/A');
  // console.log('  Client IP:', eventData.userData.clientIpAddress || 'N/A');
  // console.log('  User Agent:', eventData.userData.clientUserAgent ? eventData.userData.clientUserAgent.substring(0, 50) + '...' : 'N/A');
  // console.log('  FBP Cookie:', eventData.userData.fbp || 'N/A');
  // console.log('  FBC Cookie:', eventData.userData.fbc || 'N/A');
  
  // Hash user data according to Meta requirements
  // Helper function to ensure proper array type
  const toStringArray = (value: string | null): string[] | [null] => {
    return value !== null ? [value] : [null];
  };
  
  const hashedEmail = eventData.userData.email ? hashValue(eventData.userData.email) : null;
  const hashedPhone = eventData.userData.phone ? hashValue(normalizePhone(eventData.userData.phone)) : null;
  const hashedFirstName = eventData.userData.firstName ? hashValue(eventData.userData.firstName) : null;
  const hashedLastName = eventData.userData.lastName ? hashValue(eventData.userData.lastName) : null;
  const hashedCity = eventData.userData.city ? hashValue(eventData.userData.city) : null;
  const hashedState = eventData.userData.state ? hashValue(eventData.userData.state) : null;
  const hashedZip = eventData.userData.zip ? hashValue(eventData.userData.zip) : null;
  const hashedCountry = eventData.userData.country ? hashValue(eventData.userData.country) : null;
  
  // console.log('\n🔐 Hashed User Data (what gets sent to Meta):');
  // console.log('  Email (em):', hashedEmail || 'N/A');
  // console.log('  Phone (ph):', hashedPhone || 'N/A');
  // console.log('  First Name (fn):', hashedFirstName || 'N/A');
  // console.log('  Last Name (ln):', hashedLastName || 'N/A');
  // console.log('  City (ct):', hashedCity || 'N/A');
  // console.log('  State (st):', hashedState || 'N/A');
  // console.log('  ZIP (zp):', hashedZip || 'N/A');
  // console.log('  Country (country):', hashedCountry || 'N/A');
  
  const hashedUserData: CapiRequestPayload['data'][0]['user_data'] = {
    em: toStringArray(hashedEmail),
    ph: toStringArray(hashedPhone),
    fn: hashedFirstName ? [hashedFirstName] : undefined,
    ln: hashedLastName ? [hashedLastName] : undefined,
    ct: hashedCity ? [hashedCity] : undefined,
    st: hashedState ? [hashedState] : undefined,
    zp: hashedZip ? [hashedZip] : undefined,
    country: hashedCountry ? [hashedCountry] : undefined,
    external_id: eventData.userData.externalId ? [eventData.userData.externalId] : undefined,
    client_ip_address: eventData.userData.clientIpAddress ? eventData.userData.clientIpAddress : undefined,
    client_user_agent: eventData.userData.clientUserAgent ? eventData.userData.clientUserAgent : undefined,
    fbp: eventData.userData.fbp ? eventData.userData.fbp : undefined,
    fbc: eventData.userData.fbc ? eventData.userData.fbc : undefined,
  };
  
  // Build the request payload
  const payload: CapiRequestPayload = {
    data: [
      {
        event_name: eventData.eventName,
        event_time: eventData.eventTime,
        event_id: eventId,
        event_source_url: eventData.eventSourceUrl,
        action_source: eventData.actionSource,
        user_data: hashedUserData,
        custom_data: eventData.customData,
        opt_out: eventData.optOut,
      },
    ],
  };
  
  // Add test event code if configured
  if (capiConfig.testEventCode) {
    payload.test_event_code = capiConfig.testEventCode;
  }
  
  // if (eventData.customData) {
  //   console.log('\n💰 Custom Data:');
  //   console.log('  Currency:', eventData.customData.currency || 'N/A');
  //   console.log('  Value:', eventData.customData.value || 'N/A');
  //   console.log('  Content Type:', eventData.customData.content_type || 'N/A');
  //   console.log('  Content Name:', eventData.customData.content_name || 'N/A');
  //   console.log('  Content Category:', eventData.customData.content_category || 'N/A');
  //   console.log('  Content IDs:', eventData.customData.content_ids || 'N/A');
  //   console.log('  Num Items:', eventData.customData.num_items || 'N/A');
  //   console.log('  Order ID:', eventData.customData.order_id || 'N/A');
  //   if (eventData.customData.contents) {
  //     console.log('  Contents:', JSON.stringify(eventData.customData.contents, null, 2));
  //   }
  // }
  
  // console.log('\n📦 Complete Payload Structure:');
  // console.log(JSON.stringify(payload, null, 2));
  
  // Meta CAPI endpoint
  const apiUrl = `https://graph.facebook.com/v21.0/${pixelConfig.meta.pixelId}/events`;
  
  // console.log('\n🌐 API Request:');
  // console.log('  URL:', apiUrl);
  // console.log('  Method: POST');
  // console.log('  Has Access Token:', !!capiConfig.accessToken);
  
  try {
    // console.log('\n📤 Sending request to Meta...');
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        access_token: capiConfig.accessToken,
      }),
    });
    
    const result = await response.json();
    
    // console.log('\n📥 Response from Meta:');
    // console.log('  Status:', response.status);
    // console.log('  OK:', response.ok);
    // console.log('  Result:', JSON.stringify(result, null, 2));
    
    if (!response.ok) {
      // console.error('\n❌ CAPI EVENT FAILED');
      // console.error('Error details:', result);
      // console.log('='.repeat(80) + '\n');
      return {
        success: false,
        error: result.error?.message || 'Unknown CAPI error',
        eventId,
      };
    }
    
    // console.log('\n✅ CAPI EVENT SENT SUCCESSFULLY');
    // console.log('  Events Received:', result.events_received || 'N/A');
    // console.log('  Messages:', result.messages || 'None');
    // console.log('='.repeat(80) + '\n');
    
    return {
      success: true,
      eventId,
    };
  } catch (error) {
    // console.error('\n❌ CAPI REQUEST ERROR');
    // console.error('Error:', error);
    // console.error('Stack:', error instanceof Error ? error.stack : 'N/A');
    // console.log('='.repeat(80) + '\n');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      eventId,
    };
  }
}

/**
 * Send a Purchase event to CAPI
 */
export async function sendCapiPurchaseEvent(
  countryCode: string,
  purchaseData: {
    orderId: string;
    currency: string;
    totalPrice: number;
    customerEmail?: string;
    customerPhone?: string;
    customerFirstName?: string;
    customerLastName?: string;
    customerCity?: string;
    customerZip?: string;
    customerCountry?: string;
    clientIp?: string;
    clientUserAgent?: string;
    fbp?: string;
    fbc?: string;
    eventSourceUrl?: string;
    eventId?: string; // For deduplication with browser pixel
    lineItems?: Array<{
      sku: string;
      name: string;
      quantity: number;
      price: number;
    }>;
  }
): Promise<{ success: boolean; error?: string; eventId?: string }> {
  // console.log('\n' + '💰'.repeat(40));
  // console.log('🛒 CAPI PURCHASE EVENT HELPER CALLED');
  // console.log('  Order ID:', purchaseData.orderId);
  // console.log('  Total Price:', purchaseData.totalPrice, purchaseData.currency);
  // console.log('  Line Items:', purchaseData.lineItems?.length || 0);
  // console.log('💰'.repeat(40));
  
  const eventTime = Math.floor(Date.now() / 1000);
  
  // Build custom data
  const customData: CapiCustomData = {
    currency: purchaseData.currency,
    value: purchaseData.totalPrice,
    order_id: purchaseData.orderId,
  };
  
  // Add line items if provided
  if (purchaseData.lineItems && purchaseData.lineItems.length > 0) {
    customData.content_ids = purchaseData.lineItems.map(item => item.sku);
    customData.contents = purchaseData.lineItems.map(item => ({
      id: item.sku,
      quantity: item.quantity,
      item_price: item.price,
    }));
    customData.num_items = purchaseData.lineItems.reduce((sum, item) => sum + item.quantity, 0);
  }
  
  // Build user data
  const userData: CapiUserData = {
    email: purchaseData.customerEmail,
    phone: purchaseData.customerPhone,
    firstName: purchaseData.customerFirstName,
    lastName: purchaseData.customerLastName,
    city: purchaseData.customerCity,
    zip: purchaseData.customerZip,
    country: purchaseData.customerCountry,
    clientIpAddress: purchaseData.clientIp,
    clientUserAgent: purchaseData.clientUserAgent,
    fbp: purchaseData.fbp,
    fbc: purchaseData.fbc,
  };
  
  return sendCapiEvent(countryCode, {
    eventName: CAPI_EVENTS.PURCHASE,
    eventTime,
    eventId: purchaseData.eventId, // Use provided eventId for deduplication
    eventSourceUrl: purchaseData.eventSourceUrl,
    actionSource: 'website',
    userData,
    customData,
  });
}

/**
 * Send an InitiateCheckout event to CAPI
 */
export async function sendCapiInitiateCheckoutEvent(
  countryCode: string,
  checkoutData: {
    currency: string;
    value: number;
    customerEmail?: string;
    customerPhone?: string;
    clientIp?: string;
    clientUserAgent?: string;
    fbp?: string;
    fbc?: string;
    eventSourceUrl?: string;
    contentIds?: string[];
    numItems?: number;
  }
): Promise<{ success: boolean; error?: string; eventId?: string }> {
  // console.log('\n' + '🛍️'.repeat(40));
  // console.log('🔔 CAPI INITIATE CHECKOUT EVENT HELPER CALLED');
  // console.log('  Value:', checkoutData.value, checkoutData.currency);
  // console.log('  Items:', checkoutData.numItems || 0);
  // console.log('  Content IDs:', checkoutData.contentIds || []);
  // console.log('🛍️'.repeat(40));
  
  const eventTime = Math.floor(Date.now() / 1000);
  
  return sendCapiEvent(countryCode, {
    eventName: CAPI_EVENTS.INITIATE_CHECKOUT,
    eventTime,
    eventSourceUrl: checkoutData.eventSourceUrl,
    actionSource: 'website',
    userData: {
      email: checkoutData.customerEmail,
      phone: checkoutData.customerPhone,
      clientIpAddress: checkoutData.clientIp,
      clientUserAgent: checkoutData.clientUserAgent,
      fbp: checkoutData.fbp,
      fbc: checkoutData.fbc,
    },
    customData: {
      currency: checkoutData.currency,
      value: checkoutData.value,
      content_ids: checkoutData.contentIds,
      num_items: checkoutData.numItems,
    },
  });
}

