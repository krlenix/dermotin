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
  contentName?: string;
  contentCategory?: string;
  contentIds?: string[];
  contents?: Array<{
    id: string;
    quantity: number;
    item_price?: number;
  }>;
  numItems?: number;
  orderId?: string;
  predictedLtv?: number;
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
  const pixelConfig = getPixelConfig(countryCode);
  
  // Check if CAPI is enabled for this country
  if (!pixelConfig.meta.capi || !pixelConfig.meta.capi.enabled) {
    console.log(`🔇 CAPI not enabled for country: ${countryCode}`);
    return { success: false, error: 'CAPI not configured for this country' };
  }
  
  const capiConfig = pixelConfig.meta.capi;
  
  // Generate event ID if not provided (for deduplication)
  const eventId = eventData.eventId || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
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
  
  // Meta CAPI endpoint
  const apiUrl = `https://graph.facebook.com/v21.0/${pixelConfig.meta.pixelId}/events`;
  
  try {
    console.log(`📤 Sending CAPI event to Meta for ${countryCode}:`, {
      eventName: eventData.eventName,
      eventId,
      pixelId: pixelConfig.meta.pixelId,
      testMode: !!capiConfig.testEventCode,
    });
    
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
    
    if (!response.ok) {
      console.error('❌ CAPI event failed:', result);
      return {
        success: false,
        error: result.error?.message || 'Unknown CAPI error',
        eventId,
      };
    }
    
    console.log('✅ CAPI event sent successfully:', result);
    
    return {
      success: true,
      eventId,
    };
  } catch (error) {
    console.error('❌ CAPI request error:', error);
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
  const eventTime = Math.floor(Date.now() / 1000);
  
  // Build custom data
  const customData: CapiCustomData = {
    currency: purchaseData.currency,
    value: purchaseData.totalPrice,
    orderId: purchaseData.orderId,
  };
  
  // Add line items if provided
  if (purchaseData.lineItems && purchaseData.lineItems.length > 0) {
    customData.contentIds = purchaseData.lineItems.map(item => item.sku);
    customData.contents = purchaseData.lineItems.map(item => ({
      id: item.sku,
      quantity: item.quantity,
      item_price: item.price,
    }));
    customData.numItems = purchaseData.lineItems.reduce((sum, item) => sum + item.quantity, 0);
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
      contentIds: checkoutData.contentIds,
      numItems: checkoutData.numItems,
    },
  });
}

