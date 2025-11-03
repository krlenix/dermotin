# Affiliate Codes API Integration

This document explains how the coupon/discount code system integrates with your Order Management System (OMS) API.

## Overview

The system uses **API-only validation** for discount codes:
- **API codes** - Fetched from your OMS at `https://[your-oms]/api/affiliate/codes`

**Note:** Static fallback codes are currently disabled. All coupon validation goes through your OMS API.
Static coupons are preserved in `src/config/coupons.ts` (commented out) for future use if needed.

## Configuration

### 1. Environment Variables

The affiliate codes endpoint is **automatically derived** from your webhook URL:

```env
# Your existing webhook URL (per country)
NEXT_PUBLIC_RS_ORDER_WEBHOOK_URL=https://clicky.topoms.com/api/webhook/custom/orders
NEXT_PUBLIC_BA_ORDER_WEBHOOK_URL=https://bosna.topoms.com/api/webhook/custom/orders
NEXT_PUBLIC_HR_ORDER_WEBHOOK_URL=https://hrvatska.topoms.com/api/webhook/custom/orders
NEXT_PUBLIC_ME_ORDER_WEBHOOK_URL=https://crna-gora.topoms.com/api/webhook/custom/orders

# Optional: Override the default API key
NEXT_PUBLIC_AFFILIATE_API_KEY=mB1pHWfEli7YjpwY0eyQp0nfmbz
```

### 2. Automatic URL Derivation

The system automatically converts:
- `https://clicky.topoms.com/api/webhook/custom/orders` 
- → `https://clicky.topoms.com/api/affiliate/codes`

## API Authentication

### Request Headers
```http
GET https://clicky.topoms.com/api/affiliate/codes HTTP/1.1
Content-Type: application/json
X-API-Key: mB1pHWfEli7YjpwY0eyQp0nfmbz
```

### Expected Response Format

Your OMS API returns a simple list of valid coupon codes:

```json
{
  "success": true,
  "codes": [
    "AFF",
    "PARTNER",
    "PROMO2024"
  ],
  "total": 3
}
```

**Important:** All codes returned by the API are automatically treated as **10% percentage discount** codes.

The system transforms this into:
```javascript
// Each code becomes:
{
  code: "AFF",
  type: "percentage",
  value: 10,              // Always 10%
  minOrderValue: 0,       // No minimum
  maxDiscount: undefined, // No cap
  enabled: true
}
```

## Coupon Behavior

### Default 10% Discount
All coupon codes returned by your OMS API are automatically configured as:
- **Type:** Percentage discount
- **Value:** 10% off
- **Minimum order:** None (0)
- **Maximum discount:** Unlimited
- **Countries:** Valid for all countries
- **Expiration:** None

### Example
If your API returns:
```json
{
  "success": true,
  "codes": ["AFF", "PARTNER"],
  "total": 2
}
```

Both `AFF` and `PARTNER` will give customers **10% off** their order total (before shipping).

### Customizing the Discount Percentage

To change the default 10% discount to a different value:

1. Open `src/utils/affiliate-codes.ts`
2. Find line 58: `value: 10, // Default 10% discount for all affiliate codes`
3. Change `10` to your desired percentage (e.g., `15` for 15% off)

```typescript
const coupons: Coupon[] = result.codes.map(code => ({
  code: code,
  type: 'percentage' as const,
  value: 15, // Changed to 15% discount
  // ...
}));
```

**Note:** This applies to ALL coupon codes returned by your API. If you need different discount amounts per code, you'll need to modify your OMS API to return detailed discount information.

## Features

### ✅ Implemented Features

1. **Country-Specific Endpoints** - Each country (RS, BA, HR, ME) has its own OMS endpoint
2. **API-First Strategy** - Checks API codes before falling back to static codes
3. **Caching** - API responses are cached for 5 minutes to reduce requests
4. **Fallback** - If API fails, system uses static codes from `src/config/coupons.ts`
5. **Real-time Validation** - Validates codes against:
   - Expiration dates
   - Country restrictions
   - Minimum order values
   - Maximum discount caps
   - Enabled/disabled status

### 🔧 Implementation Files

- `src/config/countries.ts` - Webhook configuration per country
- `src/utils/affiliate-codes.ts` - API fetching utilities
- `src/config/coupons.ts` - Coupon validation and calculation logic
- `src/components/features/CheckoutForm.tsx` - UI integration

## Testing

### Test with API (Required)
1. Ensure your OMS endpoint returns the expected JSON format
2. Set the correct API key in your environment
3. The coupon field will automatically fetch from API when validating codes

### Test URL Auto-Apply
Visit checkout page with coupon parameter:
```
/rs/checkouts/fungel?coupon=WELCOME10
```

**What happens:**
1. ⏳ Page loads immediately (non-blocking)
2. 🔄 Blue loading indicator appears: "Proveravamo vaš kupon... Proveravamo kod 'WELCOME10'..."
3. 🔍 System checks API asynchronously (with 5-minute cache)
4. ✅ On success: Green border with checkmark, shows savings
5. ❌ On error: Red error message below coupon field

**User Experience:**
- Page renders instantly
- Coupon validation happens in background
- Visual feedback throughout process
- No blocking or frozen UI

## Error Handling

The system gracefully handles:
- ❌ API endpoint not configured → Shows "invalid code" error
- ❌ API request fails → Shows "invalid code" error
- ❌ Invalid API response → Shows "invalid code" error
- ❌ Network timeout → Shows "invalid code" error
- ✅ All errors are logged to console for debugging

**Note:** Static coupon fallback is currently disabled. To re-enable:
1. Uncomment coupons in `src/config/coupons.ts`
2. Uncomment fallback logic in `getCouponWithAPI()` function

## Monitoring

Check browser console for:
```
🔍 Fetching affiliate codes from: https://clicky.topoms.com/api/affiliate/codes
✅ Successfully fetched 2 affiliate codes for rs: ["AFF", "PARTNER"]
✅ Using coupon "AFF" from API
❌ Coupon "INVALID" not found in API
```

## Adding New Static Codes

Edit `src/config/coupons.ts`:
```typescript
export const COUPONS: Record<string, Coupon> = {
  'NEWCODE': {
    code: 'NEWCODE',
    type: 'percentage',
    value: 15,
    description: 'New promotion',
    minOrderValue: 1000,
    enabled: true,
  },
};
```

## Security Notes

- API key is exposed to client-side (stored in `NEXT_PUBLIC_*` variable)
- OMS should rate-limit the affiliate codes endpoint
- Consider implementing IP-based access control on your OMS
- The 5-minute cache helps reduce API load

## Troubleshooting

### Coupons not working?
1. Check browser console for API errors
2. Verify API key matches your OMS configuration
3. Confirm webhook URL is correct in environment variables
4. Test the API endpoint directly with curl:
   ```bash
   curl -H "X-API-Key: mB1pHWfEli7YjpwY0eyQp0nfmbz" \
        https://clicky.topoms.com/api/affiliate/codes
   ```

### API returning 401/403?
- Check API key value
- Verify `X-API-Key` header format matches your OMS expectations

### No coupons working at all?
- Verify your OMS API endpoint is returning codes
- Check if `NEXT_PUBLIC_*_ORDER_WEBHOOK_URL` environment variable is set
- Verify the URL string replacement logic matches your endpoint structure
- Ensure API is returning `success: true` and valid `data` array

### Need static fallback codes?
Currently disabled. To re-enable:
1. Edit `src/config/coupons.ts`
2. Uncomment the coupon definitions in `COUPONS` object
3. Uncomment the fallback logic in `getCouponWithAPI()` function (lines marked with NOTE comments)

