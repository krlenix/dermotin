import crypto from 'crypto';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { NextRequest, NextResponse } from 'next/server';
import { getCountryConfig } from '@/config/countries';

// Configure dayjs with timezone support
dayjs.extend(utc);
dayjs.extend(timezone);

export interface OrderData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  customerPostalCode: string;
  productName: string;
  productVariant: string;
  productSku?: string;
  quantity: number;
  totalPrice: number;
  subtotal: number;
  shippingCost: number;
  currency: string;
  courierName: string;
  deliveryTime: string;
  paymentMethod: string;
  bundleItems?: Record<string, number>;
  locale: string;
}

interface WebhookPayload {
  order_id: string;
  created_at: string;
  currency: string;
  total_price: number;
  financial_status: string;
  customer: {
    email: string;
    phone: string;
    note: string;
  };
  billing_address: {
    name: string;
    address1: string;
    address2: string;
    city: string;
    zip: string;
    country_code: string;
    phone: string;
  };
  shipping_address: {
    name: string;
    address1: string;
    address2: string;
    city: string;
    zip: string;
    country_code: string;
    phone: string;
  };
  line_items: Array<{
    sku: string;
    name: string;
    quantity: number;
    price: number;
    discount: number;
  }>;
  shipping: {
    price: number;
    method: string;
  };
  discount_codes: Array<unknown>;
  marketing: {
    campaign_id: string | null;
    adset_id: string | null;
    ad_id: string | null;
    medium: string;
  };
}

// Function to get current domain from request
function getCurrentDomain(req: NextRequest): string {
  const host = req.headers.get('host');
  if (host) {
    return host;
  }
  
  // Fallback to environment variable or localhost
  return process.env.NEXT_PUBLIC_DOMAIN || 'localhost';
}

async function sendToWebhook(webhookData: WebhookPayload, countryCode: string, currentDomain: string) {
  console.log(`🔧 Loading webhook config for country: ${countryCode}`);
  const countryConfig = getCountryConfig(countryCode);
  
  // Check if webhooks are configured for this country
  if (!countryConfig.webhooks || !countryConfig.webhooks.orders) {
    console.log(`❌ No webhook configuration found for country ${countryCode}`);
    return null;
  }
  
  const webhookConfig = countryConfig.webhooks.orders;
  console.log(`🔧 Webhook config loaded:`, {
    url: webhookConfig.url ? `${webhookConfig.url.substring(0, 50)}...` : 'NOT SET',
    authMethod: webhookConfig.authMethod,
    hasSecret: !!webhookConfig.webhookSecret,
    hasApiKey: !!webhookConfig.apiKey
  });
  
  // Skip if webhook URL is not configured
  if (!webhookConfig.url) {
    console.log(`❌ Order webhook URL not configured for country ${countryCode}, skipping...`);
    return null;
  }

  console.log(`🚀 Sending order webhook for country ${countryCode} to: ${webhookConfig.url}`);

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
    
    console.log(`🔐 Using signature authentication for ${countryCode}`);
  } else if (webhookConfig.authMethod === 'api-key' && webhookConfig.apiKey) {
    // Use API key
    headers['X-API-Key'] = webhookConfig.apiKey;
    console.log(`🔑 Using API key authentication for ${countryCode}`);
  }

  try {
    console.log(`📤 Webhook URL for ${countryCode}:`, webhookConfig.url);
    console.log(`📤 Webhook headers for ${countryCode}:`, JSON.stringify(headers, null, 2));
    console.log(`📤 Webhook payload for ${countryCode}:`, JSON.stringify(webhookData, null, 2));
    
    // Validate payload structure before sending
    console.log(`🔍 Payload validation check for ${countryCode}:`);
    console.log(`  - order_id: ${webhookData.order_id} (length: ${webhookData.order_id?.length})`);
    console.log(`  - currency: ${webhookData.currency} (length: ${webhookData.currency?.length})`);
    console.log(`  - financial_status: ${webhookData.financial_status}`);
    console.log(`  - customer.email: ${webhookData.customer?.email}`);
    console.log(`  - billing_address.name: ${webhookData.billing_address?.name}`);
    console.log(`  - billing_address.address1: ${webhookData.billing_address?.address1}`);
    console.log(`  - billing_address.city: ${webhookData.billing_address?.city}`);
    console.log(`  - billing_address.country_code: ${webhookData.billing_address?.country_code} (length: ${webhookData.billing_address?.country_code?.length})`);
    console.log(`  - line_items count: ${webhookData.line_items?.length}`);
    
    const response = await fetch(webhookConfig.url, {
      method: 'POST',
      headers,
      body: JSON.stringify(webhookData)
    });

    console.log(`📥 Webhook response status for ${countryCode}: ${response.status}`);
    console.log(`📥 Webhook response headers for ${countryCode}:`, JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));

    let result;
    const responseText = await response.text();
    console.log(`📥 Webhook raw response for ${countryCode}:`, responseText);
    
    try {
      result = JSON.parse(responseText);
      console.log(`📥 Webhook parsed response for ${countryCode}:`, result);
    } catch (parseError) {
      console.log(`⚠️ Webhook response is not valid JSON for ${countryCode}:`, parseError);
      result = { error: 'Invalid JSON response', raw: responseText };
    }

    if (!response.ok) {
      console.error(`❌ Webhook failed with status ${response.status} for ${countryCode}. Response:`, result);
      
      // Log specific validation errors if it's a 422
      if (response.status === 422 && result.errors) {
        console.error(`🚨 Laravel validation errors for ${countryCode}:`);
        Object.entries(result.errors).forEach(([field, messages]) => {
          console.error(`  - ${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`);
        });
      }
      
      throw new Error(result.error || result.message || `Webhook failed with status ${response.status}`);
    }

    console.log(`✅ Order webhook sent successfully for ${countryCode}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to send order webhook for ${countryCode}:`, error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error(`🌐 Network error - check if webhook URL is accessible: ${webhookConfig.url}`);
    }
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📦 Order API called');
    
    // Get current domain early in the handler
    const currentDomain = getCurrentDomain(request);

    const orderData: Omit<OrderData, 'orderId'> = await request.json();
    console.log('📦 Received order data:', orderData);
    
    // Generate order ID
    const orderId = `WEB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log('🆔 Generated order ID:', orderId);
    
    // Get country configuration
    const countryConfig = getCountryConfig(orderData.locale);
    console.log('🌍 Country config loaded for:', orderData.locale);

    // Calculate individual product price (subtotal minus bundle items)
    const bundleTotal = orderData.bundleItems ? Object.values(orderData.bundleItems).reduce((sum, price) => sum + price, 0) : 0;
    const mainProductPrice = orderData.subtotal - bundleTotal;
    
    // Prepare webhook payload to match Laravel controller validation
    const webhookPayload: WebhookPayload = {
      order_id: orderId,
      created_at: dayjs().tz(countryConfig.timezone).toISOString(),
      currency: countryConfig.currency, // Should be RSD or BAM (3 chars)
      total_price: orderData.totalPrice,
      financial_status: 'pending', // Laravel expects 'pending' or 'paid'
      customer: {
        email: orderData.customerEmail,
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
      line_items: [
        {
          sku: orderData.productSku || 'UNKNOWN',
          name: orderData.productName,
          quantity: orderData.quantity,
          price: mainProductPrice,
          discount: 0
        }
      ],
      shipping: {
        price: orderData.shippingCost,
        method: orderData.courierName
      },
      discount_codes: [],
      marketing: {
        campaign_id: null,
        adset_id: null,
        ad_id: null,
        medium: 'website'
      }
    };

    // Add bundle items if present
    if (orderData.bundleItems && Object.keys(orderData.bundleItems).length > 0) {
      Object.entries(orderData.bundleItems).forEach(([productId, price]) => {
        webhookPayload.line_items.push({
          sku: productId,
          name: `Bundle Item - ${productId}`,
          quantity: 1,
          price: price,
          discount: 0
        });
      });
    }

    // Initialize webhook status variables
    let webhookStatus = 'pending';
    let webhookError = '';
    let webhookResult = null;

    // Send to webhook
    try {
      webhookResult = await sendToWebhook(webhookPayload, orderData.locale, currentDomain);
      webhookStatus = 'success';
      console.log('✅ Order sent to webhook successfully:', webhookResult);
    } catch (webhookErr) {
      webhookStatus = 'failed';
      webhookError = webhookErr instanceof Error ? webhookErr.message : 'Unknown webhook error';
      console.error('❌ Failed to send order to webhook:', webhookErr);
      
      // Return error if webhook fails - don't allow order to proceed
      return NextResponse.json(
        { 
          success: false, 
          error: 'Order processing failed - webhook error',
          details: webhookError,
          webhookStatus,
          orderId
        },
        { status: 500 }
      );
    }

    // Create complete order object
    const completeOrder: OrderData = {
      orderId,
      ...orderData
    };
    
    console.log('✅ Order processed successfully:', completeOrder);
    
    // Return success response with order ID and webhook info
    return NextResponse.json({
      success: true,
      orderId,
      message: 'Order placed successfully',
      webhookStatus,
      webhookResult,
      domain: currentDomain,
      timestamp: webhookPayload.created_at
    });
    
  } catch (error) {
    console.error('❌ Order processing error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}