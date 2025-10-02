# Meta Conversion API (CAPI) Implementation Summary

## ✅ What's Been Implemented

A complete, production-ready Meta Conversion API integration that:

1. **Tracks server-side Purchase events** with full customer and order data
2. **Automatically deduplicates events** between browser pixel and CAPI  
3. **Supports country-specific configuration** - each country gets its own pixel ID and CAPI token
4. **Hashes all customer PII** per Meta's security requirements
5. **Works alongside existing browser pixel** tracking

## 📁 Files Created/Modified

### New Files
- `src/lib/capi.ts` - Core CAPI service (event sending, data hashing)
- `src/utils/facebook-cookies.ts` - Manages _fbp and _fbc cookies per Meta spec
- `src/components/tracking/FacebookCookieInitializer.tsx` - Auto-captures fbclid from URL
- `META_CAPI_SETUP.md` - Complete setup and usage documentation

### Modified Files
- `src/config/pixels.ts` - Added CAPI configuration (token, test code) per country
- `src/app/api/orders/route.ts` - Sends CAPI Purchase event on order creation
- `src/components/features/CheckoutForm.tsx` - Captures Facebook tracking data
- `src/components/tracking/PixelTracker.tsx` - Added eventID for deduplication
- `src/app/layout.tsx` - Added FacebookCookieInitializer to capture fbclid

## 🔧 How It Works

### Flow Diagram
```
User Clicks Facebook Ad → URL has ?fbclid=xxx
       ↓
User Visits Site → FacebookCookieInitializer captures fbclid
       ↓              → Stores _fbc cookie (fb.1.{timestamp}.{fbclid})
       ↓              → Facebook Pixel loads and sets _fbp cookie
       ↓
User Completes Order
       ↓
       ├─→ Browser: Send Pixel Event (with eventID + _fbp + _fbc)
       │
       └─→ Server: Send CAPI Event (with same eventID + _fbp + _fbc)
              ↓
       Meta matches and deduplicates → Counted as 1 conversion ✅
```

### Event Deduplication

Both browser and server send the same event with identical `eventID`:

**Client-side** (CheckoutForm.tsx):
```typescript
const eventId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
window.fbq('track', 'Purchase', { ...data, eventID: eventId });
```

**Server-side** (orders API):
```typescript
await sendCapiPurchaseEvent(locale, {
  ...purchaseData,
  eventId, // Same ID for deduplication
  fbp,     // _fbp cookie
  fbc      // _fbc cookie
});
```

## 🔐 Security Features

✅ **Server-side tokens** - CAPI tokens never exposed to browser  
✅ **PII hashing** - All customer data SHA-256 hashed before sending  
✅ **HTTPS required** - Meta enforces secure connections  
✅ **Country isolation** - Each country uses separate pixel/token  

## 🌍 Country Configuration

Each country gets its own environment variables:

```bash
# Pixel ID (public - used by browser)
NEXT_PUBLIC_META_PIXEL_RS=804157495892896

# CAPI Token (private - server-side only)
META_CAPI_TOKEN_RS=EAAxxxxxxxxxxxxxxxxxxxxxx

# Test Code (optional - for testing)
META_CAPI_TEST_CODE_RS=TEST91894
```

Supported countries: RS, BA, BG, HR, ME, RO, EU

## 📊 What Data is Sent

### Customer Data (Hashed)
- Email address
- Phone number
- First and last name
- City, postal code, country

### Order Data (Plain)
- Order ID
- Currency and total price
- Line items (SKU, name, quantity, price)

### Tracking Data
- _fbp cookie (Facebook Browser ID)
- _fbc cookie (Facebook Click ID)  
- Client IP address
- User agent
- Event source URL

## 🧪 Testing

### Using Test Event Code

1. Set `META_CAPI_TEST_CODE_RS=TEST91894` in `.env`
2. Place a test order
3. Go to Meta Events Manager → Test Events tab
4. See your event appear with all data

### Verify in Console

Server logs show CAPI activity:
```
📤 Sending CAPI Purchase event for locale: rs
✅ CAPI Purchase event sent successfully: 1234567890-abc123
```

### Check API Response

```json
{
  "success": true,
  "orderId": "WEB-1234567890-abc123",
  "capiStatus": "success",
  "capiEventId": "1234567890-abc123",
  "webhookStatus": "success"
}
```

## 🚀 Setup Steps

1. **Get your CAPI Access Token** from Meta Events Manager
2. **Add to environment variables**:
   ```bash
   NEXT_PUBLIC_META_PIXEL_RS=804157495892896
   META_CAPI_TOKEN_RS=your_actual_token_here
   META_CAPI_TEST_CODE_RS=TEST91894  # For testing
   ```
3. **Restart your server** to load new environment variables
4. **Place a test order** and check the Test Events tab in Meta

## 📈 Benefits

### Accuracy
- ✅ Not blocked by ad blockers
- ✅ Not affected by iOS 14+ restrictions
- ✅ Works even if browser pixel fails

### Data Quality
- ✅ More customer data (server-side info)
- ✅ Better attribution matching
- ✅ Reduced event loss

### Compliance
- ✅ GDPR/CCPA friendly (hashed PII)
- ✅ Country-specific data residency
- ✅ Transparent data handling

## 🔄 Failover Behavior

The system is resilient:

- ✅ **CAPI fails** → Order still processes (logged but non-blocking)
- ✅ **Pixel fails** → CAPI still sends event
- ✅ **Both fail** → Order completes, events logged for retry

## 📚 Additional Resources

- Full setup guide: `META_CAPI_SETUP.md`
- Meta CAPI docs: https://developers.facebook.com/docs/marketing-api/conversions-api/
- Event deduplication: https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events/

## 🎯 Next Steps

1. Add your CAPI token to environment variables
2. Test with `META_CAPI_TEST_CODE`
3. Verify events in Meta Events Manager
4. Remove test code and deploy to production
5. Monitor CAPI status in order API responses

---

**Questions?** Check `META_CAPI_SETUP.md` for detailed troubleshooting and configuration options.

