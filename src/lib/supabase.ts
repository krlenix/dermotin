import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://obarfilhvxbkejrwothi.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iYXJmaWxodnhia2VqcndvdGhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNDUyMjAsImV4cCI6MjA3MjcyMTIyMH0.LnTbLzMD4F1FcXod-5IXyCKXRX8Es_AtBlihzg8ESMU';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export interface LineItem {
  sku: string;
  name: string;
  quantity: number;
  price: number;
  item_total_price: number;
  discount: number;
}

export interface DiscountCode {
  code: string;
  amount: number;
  type: 'percentage' | 'fixed';
}

export interface OrderRecord {
  id?: number;
  order_id: string;
  created_at?: string;
  updated_at?: string;
  currency: string;
  total_price: number;
  financial_status: string;
  customer_email?: string;
  customer_phone?: string;
  customer_note?: string;
  billing_name: string;
  billing_address1: string;
  billing_address2?: string;
  billing_city: string;
  billing_zip?: string;
  billing_country_code: string;
  billing_phone?: string;
  shipping_name: string;
  shipping_address1: string;
  shipping_address2?: string;
  shipping_city: string;
  shipping_zip?: string;
  shipping_country_code: string;
  shipping_phone?: string;
  shipping_price: number;
  shipping_method?: string;
  marketing_campaign_id?: string;
  marketing_adset_id?: string;
  marketing_ad_id?: string;
  marketing_medium?: string;
  line_items: LineItem[];
  discount_codes: DiscountCode[];
  locale: string;
  domain?: string;
  webhook_received_at?: string;
  raw_webhook_data?: Record<string, unknown>;
}

// Service class for order operations
export class OrderService {
  /**
   * Insert a new order into the database
   */
  static async insertOrder(orderData: Omit<OrderRecord, 'id' | 'created_at' | 'updated_at' | 'webhook_received_at'>): Promise<{ success: boolean; data?: OrderRecord; error?: string }> {
    try {
      console.log('📝 Inserting order into Supabase:', orderData.order_id);
      
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase insert error:', error);
        return { 
          success: false, 
          error: `Database error: ${error.message}` 
        };
      }

      console.log('✅ Order successfully inserted into Supabase:', data.id);
      return { 
        success: true, 
        data 
      };
    } catch (error) {
      console.error('❌ Unexpected error inserting order:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown database error' 
      };
    }
  }

  /**
   * Get an order by order_id
   */
  static async getOrderById(orderId: string): Promise<{ success: boolean; data?: OrderRecord; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_id', orderId)
        .single();

      if (error) {
        return { 
          success: false, 
          error: `Database error: ${error.message}` 
        };
      }

      return { 
        success: true, 
        data 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown database error' 
      };
    }
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(orderId: string, status: string): Promise<{ success: boolean; data?: OrderRecord; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ financial_status: status })
        .eq('order_id', orderId)
        .select()
        .single();

      if (error) {
        return { 
          success: false, 
          error: `Database error: ${error.message}` 
        };
      }

      return { 
        success: true, 
        data 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown database error' 
      };
    }
  }

  /**
   * Get orders with pagination
   */
  static async getOrders(
    page: number = 1, 
    limit: number = 50,
    filters?: {
      country?: string;
      status?: string;
      locale?: string;
      domain?: string;
      dateFrom?: string;
      dateTo?: string;
    }
  ): Promise<{ success: boolean; data?: OrderRecord[]; count?: number; error?: string }> {
    try {
      let query = supabase
        .from('orders')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters?.country) {
        query = query.eq('billing_country_code', filters.country.toUpperCase());
      }
      
      if (filters?.status) {
        query = query.eq('financial_status', filters.status);
      }
      
      if (filters?.locale) {
        query = query.eq('locale', filters.locale);
      }
      
      if (filters?.domain) {
        query = query.ilike('domain', `%${filters.domain}%`);
      }
      
      if (filters?.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      
      if (filters?.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      query = query
        .order('created_at', { ascending: false })
        .range(from, to);

      const { data, error, count } = await query;

      if (error) {
        return { 
          success: false, 
          error: `Database error: ${error.message}` 
        };
      }

      return { 
        success: true, 
        data: data || [], 
        count: count || 0 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown database error' 
      };
    }
  }
}

// Webhook payload interface
export interface WebhookPayload {
  order_id: string;
  created_at?: string;
  currency: string;
  total_price: number;
  financial_status: string;
  customer?: {
    email?: string;
    phone?: string;
    note?: string;
  };
  billing_address?: {
    name: string;
    address1: string;
    address2?: string;
    city: string;
    zip?: string;
    country_code: string;
    phone?: string;
  };
  shipping_address?: {
    name: string;
    address1: string;
    address2?: string;
    city: string;
    zip?: string;
    country_code: string;
    phone?: string;
  };
  line_items?: LineItem[];
  shipping?: {
    price: number;
    method?: string;
  };
  discount_codes?: DiscountCode[];
  marketing?: {
    campaign_id?: string | null;
    adset_id?: string | null;
    ad_id?: string | null;
    aff_id?: string | null;
    medium?: string;
  };
  locale?: string;
  domain?: string;
}

// Helper function to convert webhook payload to database record
export function webhookToOrderRecord(webhookPayload: WebhookPayload, locale?: string, domain?: string): Omit<OrderRecord, 'id' | 'created_at' | 'updated_at' | 'webhook_received_at'> {
  return {
    order_id: webhookPayload.order_id,
    currency: webhookPayload.currency,
    total_price: webhookPayload.total_price,
    financial_status: webhookPayload.financial_status || 'pending',
    
    // Customer info
    customer_email: webhookPayload.customer?.email,
    customer_phone: webhookPayload.customer?.phone,
    customer_note: webhookPayload.customer?.note,
    
    // Billing address
    billing_name: webhookPayload.billing_address?.name || '',
    billing_address1: webhookPayload.billing_address?.address1 || '',
    billing_address2: webhookPayload.billing_address?.address2,
    billing_city: webhookPayload.billing_address?.city || '',
    billing_zip: webhookPayload.billing_address?.zip,
    billing_country_code: webhookPayload.billing_address?.country_code || '',
    billing_phone: webhookPayload.billing_address?.phone,
    
    // Shipping address
    shipping_name: webhookPayload.shipping_address?.name || '',
    shipping_address1: webhookPayload.shipping_address?.address1 || '',
    shipping_address2: webhookPayload.shipping_address?.address2,
    shipping_city: webhookPayload.shipping_address?.city || '',
    shipping_zip: webhookPayload.shipping_address?.zip,
    shipping_country_code: webhookPayload.shipping_address?.country_code || '',
    shipping_phone: webhookPayload.shipping_address?.phone,
    
    // Shipping info
    shipping_price: webhookPayload.shipping?.price || 0,
    shipping_method: webhookPayload.shipping?.method,
    
    // Marketing data
    marketing_campaign_id: webhookPayload.marketing?.campaign_id || undefined,
    marketing_adset_id: webhookPayload.marketing?.adset_id || undefined,
    marketing_ad_id: webhookPayload.marketing?.ad_id || undefined,
    marketing_medium: webhookPayload.marketing?.medium,
    
    // JSON fields
    line_items: webhookPayload.line_items || [],
    discount_codes: webhookPayload.discount_codes || [],
    
    // Localization and domain
    locale: locale || webhookPayload.locale || 'rs',
    domain: domain || webhookPayload.domain,
    
    // Store raw webhook data for debugging
    raw_webhook_data: webhookPayload as unknown as Record<string, unknown>
  };
}
