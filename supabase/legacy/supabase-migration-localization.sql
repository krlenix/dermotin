-- Migration script to add localization and domain fields to existing orders table
-- Run this if you already have the orders table created without these fields

-- Add new columns
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS locale VARCHAR(10) NOT NULL DEFAULT 'rs',
ADD COLUMN IF NOT EXISTS domain VARCHAR(255);

-- Create new indexes
CREATE INDEX IF NOT EXISTS idx_orders_locale ON orders(locale);
CREATE INDEX IF NOT EXISTS idx_orders_domain ON orders(domain);

-- Update existing records to set locale based on country code (if needed)
UPDATE orders 
SET locale = CASE 
  WHEN billing_country_code = 'RS' THEN 'rs'
  WHEN billing_country_code = 'BA' THEN 'ba'
  ELSE 'rs'
END
WHERE locale = 'rs' AND billing_country_code IS NOT NULL;

-- Optional: Update domain for existing records if you have a default domain
-- UPDATE orders SET domain = 'your-domain.com' WHERE domain IS NULL;
