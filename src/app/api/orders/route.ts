import crypto from 'crypto';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { NextRequest, NextResponse } from 'next/server';
import { getCountryConfig } from '@/config/countries';
import { getMarketingCookiesFromHeaders } from '@/utils/marketing-cookies';
import { OrderService, webhookToOrderRecord } from '@/lib/supabase';

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
    price: number; // per unit price
    item_total_price: number; // total price for this line item (price * quantity)
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

// Function to get domain for X-Shop-Domain header (prioritize dynamic URL detection)
function getCurrentDomain(req: NextRequest): string {
  const host = req.headers.get('host');
  const envDomain = process.env.NEXT_PUBLIC_DOMAIN;
  
  console.log(`🌐 Host header from request: "${host}"`);
  console.log(`🌐 NEXT_PUBLIC_DOMAIN env var: "${envDomain}"`);
  
  // Prioritize host header from request (dynamic URL detection)
  if (host) {
    console.log(`🌐 Using dynamic host header: "${host}"`);
    return host;
  }
  
  // Fallback to environment variable if no host header
  if (envDomain) {
    console.log(`🌐 Fallback to NEXT_PUBLIC_DOMAIN: "${envDomain}"`);
    return envDomain;
  }
  
  // Last resort fallback
  console.log(`🌐 Using last resort fallback: "localhost"`);
  return 'localhost';
}

async function sendToWebhook(webhookData: WebhookPayload, countryCode: string, currentDomain: string) {

  const countryConfig = getCountryConfig(countryCode);
  

  
  // Check if webhooks are configured for this country
  if (!countryConfig.webhooks || !countryConfig.webhooks.orders) {
    
    return null;
  }
  
  const webhookConfig = countryConfig.webhooks.orders;

  
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
    console.log(`📤 Webhook URL for ${countryCode}:`, webhookConfig.url);
    console.log(`📤 Webhook headers for ${countryCode}:`, JSON.stringify(headers, null, 2));
    console.log(`📤 Webhook payload for ${countryCode}:`, JSON.stringify(webhookData, null, 2));
    

    
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

    // Get marketing parameters from cookies
    const cookieHeader = request.headers.get('cookie');
    const marketingParams = getMarketingCookiesFromHeaders(cookieHeader);
    console.log('📊 Marketing parameters from cookies:', marketingParams);

    const orderData: Omit<OrderData, 'orderId'> = await request.json();
    
    // Generate order ID
    const orderId = `WEB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Get country configuration
    const countryConfig = getCountryConfig(orderData.locale);

    // Calculate individual product price (subtotal minus bundle items)
    const bundleTotal = orderData.bundleItems ? Object.values(orderData.bundleItems).reduce((sum, price) => sum + price, 0) : 0;
    const mainProductPrice = orderData.subtotal - bundleTotal;
    
    // Prepare webhook payload to match Laravel controller validation
    const currentDate = dayjs().tz(countryConfig.timezone);
    const formattedDate = currentDate.format('YYYY-MM-DD HH:mm:ss');
    
    const webhookPayload: WebhookPayload = {
      order_id: orderId,
      created_at: formattedDate, // Laravel date format
      currency: countryConfig.currency, // Should be RSD or BAM (3 chars)
      total_price: orderData.totalPrice,
      financial_status: 'pending', // Laravel expects 'pending' or 'paid'
      customer: {
        email: orderData.customerEmail || 'noreply@example.com', // Ensure email is not empty
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
          price: mainProductPrice / orderData.quantity, // per unit price
          item_total_price: mainProductPrice, // total price for this line item
          discount: 0 // Use 0 instead of null for Laravel validation
        }
      ],
      shipping: {
        price: orderData.shippingCost,
        method: orderData.courierName
      },
      discount_codes: [],
      marketing: {
        campaign_id: marketingParams.campaign_id,
        adset_id: marketingParams.adset_id,
        ad_id: marketingParams.ad_id,
        medium: marketingParams.medium
      }
    };

    // Add bundle items if present
    if (orderData.bundleItems && Object.keys(orderData.bundleItems).length > 0) {
      Object.entries(orderData.bundleItems).forEach(([productId, totalPrice]) => {
        const bundleQuantity = 1; // Bundle items typically have quantity 1
        webhookPayload.line_items.push({
          sku: productId,
          name: `Bundle Item - ${productId}`,
          quantity: bundleQuantity,
          price: totalPrice / bundleQuantity, // per unit price (same as total since qty=1)
          item_total_price: totalPrice, // total price for this line item
          discount: 0
        });
      });
    }

    // Initialize webhook status variables
    let webhookStatus = 'pending';
    let webhookError = '';
    let webhookResult = null;
    let supabaseStatus = 'pending';
    let supabaseError = '';

    // First, insert order into Supabase database
    try {
      console.log('💾 Inserting order into Supabase database:', orderId);
      const orderRecord = webhookToOrderRecord(webhookPayload, orderData.locale, currentDomain);
      const supabaseResult = await OrderService.insertOrder(orderRecord);
      
      if (supabaseResult.success) {
        supabaseStatus = 'success';
        console.log('✅ Order successfully saved to Supabase:', supabaseResult.data?.id);
      } else {
        supabaseStatus = 'failed';
        supabaseError = supabaseResult.error || 'Unknown Supabase error';
        console.error('❌ Failed to save order to Supabase:', supabaseError);
        
        // Continue with webhook even if Supabase fails (for now)
        // You can change this behavior based on your requirements
      }
    } catch (supabaseErr) {
      supabaseStatus = 'failed';
      supabaseError = supabaseErr instanceof Error ? supabaseErr.message : 'Unknown Supabase error';
      console.error('❌ Unexpected error saving to Supabase:', supabaseErr);
    }

    // Send to webhook
    try {
      console.log('🚀 Attempting to send webhook for locale:', orderData.locale);
      console.log('🚀 Using domain:', currentDomain);
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
          error: 'Processing error',
          details: webhookError,
          webhookStatus,
          supabaseStatus,
          supabaseError: supabaseError || undefined,
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
    
    // Return success response with order ID, webhook info, and Supabase status
    return NextResponse.json({
      success: true,
      orderId,
      message: 'Order placed successfully',
      webhookStatus,
      webhookResult,
      supabaseStatus,
      supabaseError: supabaseError || undefined,
      domain: currentDomain,
      timestamp: webhookPayload.created_at
    });
    
  } catch (error) {
    console.error('❌ Order processing error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Order processing error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}