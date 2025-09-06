-- Orders table schema for Supabase
-- This table stores all order data submitted via webhooks

CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  order_id VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Order details
  currency VARCHAR(10) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  financial_status VARCHAR(50) DEFAULT 'pending',
  
  -- Customer information
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),
  customer_note TEXT,
  
  -- Billing address
  billing_name VARCHAR(255) NOT NULL,
  billing_address1 VARCHAR(255) NOT NULL,
  billing_address2 VARCHAR(255),
  billing_city VARCHAR(100) NOT NULL,
  billing_zip VARCHAR(20),
  billing_country_code VARCHAR(2) NOT NULL,
  billing_phone VARCHAR(50),
  
  -- Shipping address
  shipping_name VARCHAR(255) NOT NULL,
  shipping_address1 VARCHAR(255) NOT NULL,
  shipping_address2 VARCHAR(255),
  shipping_city VARCHAR(100) NOT NULL,
  shipping_zip VARCHAR(20),
  shipping_country_code VARCHAR(2) NOT NULL,
  shipping_phone VARCHAR(50),
  
  -- Shipping information
  shipping_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  shipping_method VARCHAR(100),
  
  -- Marketing data
  marketing_campaign_id VARCHAR(255),
  marketing_adset_id VARCHAR(255),
  marketing_ad_id VARCHAR(255),
  marketing_medium VARCHAR(100),
  
  -- JSON fields for complex data
  line_items JSONB NOT NULL,
  discount_codes JSONB DEFAULT '[]'::jsonb,
  
  -- Localization and domain tracking
  locale VARCHAR(10) NOT NULL DEFAULT 'rs',
  domain VARCHAR(255),
  
  -- Metadata
  webhook_received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  raw_webhook_data JSONB
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_financial_status ON orders(financial_status);
CREATE INDEX IF NOT EXISTS idx_orders_country_code ON orders(billing_country_code);
CREATE INDEX IF NOT EXISTS idx_orders_locale ON orders(locale);
CREATE INDEX IF NOT EXISTS idx_orders_domain ON orders(domain);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
-- You can modify this based on your security requirements
CREATE POLICY "Allow all operations for service role" ON orders
    FOR ALL USING (true);

-- Optional: Create a policy for anon users (if needed)
-- CREATE POLICY "Allow insert for anon users" ON orders
--     FOR INSERT WITH CHECK (true);
