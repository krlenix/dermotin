# Meta Conversion API (CAPI) Setup Guide

This guide explains how to configure and use Meta's Conversion API for server-side event tracking in your application.

## Overview

The Meta Conversion API (CAPI) allows you to send conversion events directly from your server to Meta, providing:

- **Better tracking accuracy**: Not affected by ad blockers or browser restrictions
- **Event deduplication**: Coordinates with browser pixel to avoid double-counting
- **Enhanced data**: Can send server-side customer information that browsers can't access
- **iOS 14+ compliance**: Works around iOS tracking limitations

## Architecture

The CAPI implementation consists of:

1. **Configuration** (`src/config/pixels.ts`): Country-specific pixel IDs and CAPI tokens
2. **CAPI Service** (`src/lib/capi.ts`): Core CAPI event sending logic
3. **Facebook Cookies** (`src/utils/facebook-cookies.ts`): Extract `_fbp` and `_fbc` cookies for deduplication
4. **Orders API** (`src/app/api/orders/route.ts`): Server-side Purchase event tracking
5. **Checkout Form** (`src/components/features/CheckoutForm.tsx`): Captures Facebook tracking data

## Environment Variables

For each country you want to track, add these environment variables:

```bash
# Meta Pixel ID (same as browser pixel)
NEXT_PUBLIC_META_PIXEL_RS=804157495892896

# Meta CAPI Access Token (server-side only, not exposed to client)
META_CAPI_TOKEN_RS=your_capi_access_token_here

# Optional: Test Event Code for testing (recommended for development)
META_CAPI_TEST_CODE_RS=TEST91894
```

### Supported Country Codes

The system supports country-specific configuration for:
- `RS` - Serbia
- `BA` - Bosnia and Herzegovina
- `BG` - Bulgaria
- `HR` - Croatia
- `ME` - Montenegro
- `RO` - Romania
- `EU` - European Union (fallback)

### Example Configuration

```bash
# Serbia Configuration
NEXT_PUBLIC_META_PIXEL_RS=804157495892896
META_CAPI_TOKEN_RS=EAAxxxxxxxxxxxxxxxxxxxxxx
META_CAPI_TEST_CODE_RS=TEST91894

# Bosnia Configuration
NEXT_PUBLIC_META_PIXEL_BA=123456789012345
META_CAPI_TOKEN_BA=EAAyyyyyyyyyyyyyyyyyyyyyy
META_CAPI_TEST_CODE_BA=TEST12345
```

## How to Get Your CAPI Access Token

1. Go to [Meta Events Manager](https://business.facebook.com/events_manager2/)
2. Select your pixel
3. Click **Settings** → **Conversions API**
4. Under **Access Token**, click **Generate Access Token**
5. Copy the token and add it to your `.env` file as `META_CAPI_TOKEN_XX`

## How to Get Your Test Event Code

Test Event Codes allow you to test CAPI events without affecting your live data:

1. In Meta Events Manager, go to your pixel
2. Click **Test Events** tab
3. Create a new test (or use existing)
4. Copy the Test Event Code (e.g., `TEST91894`)
5. Add it to your `.env` file as `META_CAPI_TEST_CODE_XX`

**Note**: Remove or leave empty the test code in production!

## Event Deduplication

To prevent double-counting when both browser pixel and CAPI fire, the system uses:

1. **Event ID**: Same unique ID sent from browser and server
2. **_fbp Cookie**: Facebook Browser ID for user matching (set by Meta Pixel)
3. **_fbc Cookie**: Facebook Click ID from ad clicks (captured from URL)

### How It Works

The system automatically captures and stores Facebook tracking cookies according to Meta's official specification:

**_fbp Cookie (Facebook Browser ID)**
- Automatically set by Meta Pixel when user visits your site
- Format: `fb.{domain}.{timestamp}.{random}`
- Example: `fb.1.1554763741205.1098115397`
- Persists for 90 days

**_fbc Cookie (Facebook Click ID)**
- Automatically captured from `fbclid` URL parameter when user clicks Facebook ad
- Format: `fb.{subdomain_index}.{creation_time}.{fbclid}`
- Example: `fb.1.1554763741205.IwAR2F4-dbP0l7Mn1IawQQGCINEz7PYXQvwjNwB_qa2ofrHyiLjcbCRxTDGrc`
- Stored on first observation, persists for 90 days
- Automatically initialized by `FacebookCookieInitializer` component

```typescript
// Automatic initialization on page load (layout.tsx)
<FacebookCookieInitializer />

// Client-side (CheckoutForm.tsx)
const eventId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const fbTrackingData = getFacebookTrackingData(); // Gets _fbp and _fbc

// Send to pixel
window.fbq('track', 'Purchase', { ...data, eventID: eventId });

// Send to server with same eventId
await fetch('/api/orders', {
  body: JSON.stringify({ ...orderData, eventId, fbp, fbc })
});

// Server-side (orders API)
await sendCapiPurchaseEvent(locale, {
  ...purchaseData,
  eventId, // Same event ID for deduplication
  fbp,     // Browser ID from _fbp cookie
  fbc      // Click ID from _fbc cookie
});
```

**Based on Meta's Official Documentation:**
- https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/fbp-and-fbc

## Tracked Events

Currently, the system tracks:

### Purchase Event
- **Trigger**: When an order is successfully placed
- **Location**: `/api/orders` endpoint
- **Data Sent**:
  - Order ID and total price
  - Customer information (hashed)
  - Line items (products, quantities, prices)
  - Currency
  - Facebook tracking cookies

### Future Events (Ready to Implement)

The system supports these additional events:

- `InitiateCheckout`: When user starts checkout
- `ViewContent`: When user views product page
- `AddToCart`: When user adds item to cart
- `Lead`: When user submits contact form

## Data Hashing

All customer PII is automatically hashed using SHA-256 before sending to Meta:

- Email addresses
- Phone numbers
- First and last names
- City, state, zip code
- Country

## Testing Your CAPI Integration

### 1. Using Test Events

When `META_CAPI_TEST_CODE_XX` is set, events appear in the Test Events tab:

1. Go to Events Manager → Your Pixel → Test Events
2. Place a test order
3. You should see the Purchase event appear with all data
4. Verify the event details are correct

### 2. Check Server Logs

The system logs CAPI activity:

```
📤 Sending CAPI Purchase event for locale: rs
✅ CAPI Purchase event sent successfully: 1234567890-abc123
```

### 3. Check Order API Response

The order API returns CAPI status:

```json
{
  "success": true,
  "orderId": "WEB-1234567890-abc123",
  "capiStatus": "success",
  "capiEventId": "1234567890-abc123",
  "webhookStatus": "success",
  "supabaseStatus": "success"
}
```

## Country-Specific Configuration

Each country can have its own:
- Meta Pixel ID
- CAPI Access Token
- Test Event Code

This allows you to:
- Use different ad accounts per country
- Track conversions separately
- Comply with regional data regulations

## Troubleshooting

### CAPI Events Not Appearing

1. **Check Environment Variables**:
   - Verify `META_CAPI_TOKEN_XX` is set correctly
   - Make sure it doesn't start with `your_`

2. **Check Server Logs**:
   - Look for `🔇 CAPI not enabled for country: XX`
   - This means the token is not configured

3. **Verify Pixel ID**:
   - Must match the browser pixel ID
   - Check `NEXT_PUBLIC_META_PIXEL_XX`

### Events Are Double-Counted

1. **Verify Event ID**:
   - Check browser console for `eventID` parameter
   - Check server logs for matching event ID

2. **Check Facebook Cookies**:
   - Open DevTools → Application → Cookies
   - Verify `_fbp` cookie exists
   - Check if `_fbc` exists (only if user came from ad)

### CAPI Returns Error

Common errors:

- **Invalid Access Token**: Token expired or incorrect
- **Invalid Pixel ID**: Doesn't match your Meta Business account
- **Missing Required Fields**: Check user data is being sent

Check the API response:

```json
{
  "capiStatus": "failed",
  "capiError": "Error message here"
}
```

## Security Considerations

1. **Never expose CAPI tokens to client**: Use `META_CAPI_TOKEN_XX` (not `NEXT_PUBLIC_`)
2. **Hash all PII**: The system automatically hashes customer data
3. **Use HTTPS**: Required for CAPI
4. **Secure environment variables**: Use proper environment variable management

## Performance

- CAPI calls are non-blocking
- Order processing continues even if CAPI fails
- Events are cached by Meta's CDN
- Typical response time: 100-300ms

## Compliance

The CAPI implementation:
- ✅ Hashes all customer PII per Meta requirements
- ✅ Supports country-specific data residency
- ✅ Includes opt-out mechanism (can be enabled)
- ✅ Sends minimal required data
- ✅ Compatible with GDPR, CCPA requirements

## Example: Complete Flow

1. **User clicks Facebook ad** → `_fbc` cookie is set
2. **User visits your site** → Facebook Pixel loads, sets `_fbp` cookie
3. **User completes checkout** → CheckoutForm captures:
   - Generates unique `eventId`
   - Reads `_fbp` and `_fbc` cookies
   - Sends browser pixel event with `eventID`
4. **Server receives order** → Orders API:
   - Sends CAPI event with same `eventId`, `fbp`, `fbc`
   - Meta deduplicates based on `eventId`
5. **Meta receives both events** → Counts as 1 conversion

## Additional Resources

- [Meta Conversions API Documentation](https://developers.facebook.com/docs/marketing-api/conversions-api/)
- [Event Deduplication Guide](https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events/)
- [Server Events Test Tool](https://developers.facebook.com/docs/marketing-api/conversions-api/using-the-api#test-events)

## Support

If you encounter issues:
1. Check server logs for detailed error messages
2. Verify environment variables are set correctly
3. Test with Test Event Code first
4. Review Meta Events Manager for diagnostics

