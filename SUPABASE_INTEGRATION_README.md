# Supabase Order Integration

This integration allows you to store order data in Supabase database when orders are submitted through your webhook system.

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=https://obarfilhvxbkejrwothi.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iYXJmaWxodnhia2VqcndvdGhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNDUyMjAsImV4cCI6MjA3MjcyMTIyMH0.LnTbLzMD4F1FcXod-5IXyCKXRX8Es_AtBlihzg8ESMU
```

### 2. Database Setup

#### For New Installations:
Run the SQL schema in your Supabase SQL Editor:

```sql
-- Copy and paste the contents of supabase-schema.sql into your Supabase SQL Editor
```

#### For Existing Installations:
If you already have the orders table, run the migration script:

```sql
-- Copy and paste the contents of supabase-migration-localization.sql into your Supabase SQL Editor
```

The schema creates:
- `orders` table with all necessary fields
- Indexes for performance
- Row Level Security (RLS) policies
- Automatic `updated_at` trigger

### 3. Install Dependencies

The required Supabase client is already installed:

```bash
npm install @supabase/supabase-js
```

## How It Works

### Order Flow

1. **User submits order** → CheckoutForm component
2. **Order API processes** → `/api/orders/route.ts`
3. **Data is saved to Supabase** → Before webhook is sent
4. **External webhook is called** → Your existing webhook system
5. **Response includes both statuses** → Supabase and webhook results

### Database Structure

The `orders` table stores:

- **Order Information**: ID, total price, currency, status
- **Customer Data**: Email, phone, billing/shipping addresses
- **Product Details**: Line items as JSON, discount codes
- **Marketing Data**: Campaign IDs, ad tracking information
- **Localization**: Locale (rs, ba) and domain information
- **Metadata**: Webhook timestamps, raw webhook data

### API Integration

The integration is added to your existing `/api/orders/route.ts` endpoint:

```typescript
// Before sending to external webhook
const orderRecord = webhookToOrderRecord(webhookPayload);
const supabaseResult = await OrderService.insertOrder(orderRecord);
```

## API Endpoints

### 1. Order Submission (Existing)
- **Endpoint**: `POST /api/orders`
- **Purpose**: Submit new orders (now saves to Supabase + webhook)
- **Response**: Includes both `webhookStatus` and `supabaseStatus`

### 2. Admin Orders API (New)
- **Endpoint**: `GET /api/admin/orders`
- **Purpose**: Retrieve orders with filtering and pagination

#### Query Parameters:
- `page` (default: 1) - Page number
- `limit` (default: 50, max: 100) - Items per page
- `country` - Filter by country code (RS, BA)
- `status` - Filter by order status (pending, paid, etc.)
- `locale` - Filter by locale (rs, ba)
- `domain` - Filter by domain (partial match)
- `dateFrom` - Filter orders from date (ISO format)
- `dateTo` - Filter orders to date (ISO format)

#### Example Requests:

```bash
# Get all orders (first page)
GET /api/admin/orders

# Get orders with pagination
GET /api/admin/orders?page=2&limit=25

# Filter by country and status
GET /api/admin/orders?country=RS&status=paid

# Filter by locale and domain
GET /api/admin/orders?locale=rs&domain=example.com

# Filter by date range
GET /api/admin/orders?dateFrom=2024-01-01&dateTo=2024-01-31

# Combined filters
GET /api/admin/orders?country=RS&locale=rs&status=paid&domain=shop.example.com
```

### 3. Single Order Operations
- **Endpoint**: `POST /api/admin/orders`
- **Purpose**: Get single order or update order status

#### Get Single Order:
```json
{
  "orderId": "WEB-1234567890-abc123def",
  "action": "get"
}
```

#### Update Order Status:
```json
{
  "orderId": "WEB-1234567890-abc123def", 
  "action": "updateStatus",
  "status": "paid"
}
```

## Usage Examples

### Frontend Integration

```typescript
// Get orders for admin dashboard
const fetchOrders = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`/api/admin/orders?${params}`);
  const data = await response.json();
  
  if (data.success) {
    return {
      orders: data.data,
      pagination: data.pagination
    };
  }
  throw new Error(data.error);
};

// Update order status
const updateOrderStatus = async (orderId: string, status: string) => {
  const response = await fetch('/api/admin/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId,
      action: 'updateStatus',
      status
    })
  });
  
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error);
  }
  return data.data;
};
```

### Direct Supabase Service Usage

```typescript
import { OrderService } from '@/lib/supabase';

// Get orders with custom logic
const orders = await OrderService.getOrders(1, 10, {
  country: 'RS',
  status: 'pending',
  locale: 'rs',
  domain: 'shop.example.com'
});

// Get single order
const order = await OrderService.getOrderById('WEB-1234567890-abc123def');

// Update order status
const updated = await OrderService.updateOrderStatus('WEB-1234567890-abc123def', 'paid');
```

## Error Handling

The integration includes comprehensive error handling:

1. **Supabase Failures**: Orders continue to external webhook even if Supabase fails
2. **Webhook Failures**: Orders are still saved to Supabase for recovery
3. **Validation Errors**: Proper error messages for invalid data
4. **Network Issues**: Retry logic and timeout handling

## Monitoring

Check the console logs for integration status:

- `💾 Inserting order into Supabase database: [orderId]`
- `✅ Order successfully saved to Supabase: [id]`
- `❌ Failed to save order to Supabase: [error]`

## Security Notes

1. **Environment Variables**: Keep your Supabase keys secure
2. **RLS Policies**: The schema includes Row Level Security
3. **API Keys**: Use service role key for server-side operations
4. **Validation**: All inputs are validated before database insertion

## Troubleshooting

### Common Issues:

1. **Environment Variables Not Found**
   - Ensure `.env.local` exists and contains correct values
   - Restart your development server after adding variables

2. **Database Connection Errors**
   - Verify Supabase URL and API key are correct
   - Check if your Supabase project is active

3. **Schema Errors**
   - Ensure the SQL schema was executed successfully
   - Check if all tables and indexes were created

4. **Permission Errors**
   - Verify RLS policies are configured correctly
   - Check if anon key has necessary permissions

### Debug Mode:

Enable detailed logging by checking the console output when orders are processed. All database operations are logged with status indicators.

## Localization Features

### Automatic Locale Detection
The system automatically captures:
- **Locale**: From the order submission (rs, ba)
- **Domain**: From the request headers (e.g., shop.example.com, rs.example.com)

### Multi-Language Support
Orders are tagged with locale information allowing you to:
- Filter orders by language/country
- Generate localized reports
- Track performance by market
- Customize communication by locale

### Domain Tracking
Track which domain/subdomain orders come from:
- Main site vs. country-specific domains
- A/B testing different domains
- Multi-brand tracking
- Affiliate domain attribution

## Future Enhancements

Potential improvements you can add:

1. **Order Analytics**: Aggregate order data for reporting by locale/domain
2. **Customer Management**: Link orders to customer profiles with locale preferences
3. **Inventory Tracking**: Update product stock levels by market
4. **Email Notifications**: Send localized order confirmations via Supabase Edge Functions
5. **Webhook Retry Logic**: Retry failed webhook calls with exponential backoff
6. **Order Status Webhooks**: Notify external systems when order status changes
7. **Multi-Currency Support**: Store original and converted currency amounts
8. **Geo-Analytics**: Combine locale data with geographic analytics
