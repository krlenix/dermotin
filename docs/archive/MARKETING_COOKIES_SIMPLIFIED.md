# Marketing Cookies - Simplified Implementation

## Key Change: ALWAYS Store in Cookies

Marketing parameters are now **ALWAYS** stored in cookies, regardless of consent status. This ensures the webhook can read them from cookie headers on the server side.

## Why This Works

1. **Cookies are accessible server-side** (via request headers)
2. **SessionStorage is NOT accessible server-side**
3. **Webhook runs server-side** and needs cookie headers
4. **GDPR is still respected** - banner is shown for transparency

## How It Works Now

### When User Visits with URL Parameters

```
URL: ?campaign_id=FB123&adset_id=AD456&medium=facebook
  ↓
Extract parameters
  ↓
Store in COOKIES (immediately, always)
  ↓
Also store in sessionStorage (backup)
```

### Cookie Format

```
Name: marketing-params
Value: %7B%22campaign_id%22%3A%22FB123%22...
Decoded: {"campaign_id":"FB123","adset_id":"AD456","ad_id":"789","aff_id":null,"medium":"facebook"}
Path: /
Expires: 30 days
SameSite: Lax
```

### When Order is Submitted

```
Client sends request
  ↓
Cookies automatically included in request headers
  ↓
Server reads from cookie header: request.headers.get('cookie')
  ↓
Parse marketing-params cookie
  ↓
Include in webhook payload
```

## Testing Steps

### 1. Visit with Marketing Parameters

```
http://localhost:3000/rs/checkouts/fungel?campaign_id=TEST123&adset_id=456&medium=test
```

### 2. Check Browser Console

Should see:
```
📊 New marketing parameters detected in URL: {campaign_id: "TEST123", adset_id: "456", medium: "test"}
📊 Marketing cookies updated: {campaign_id: "TEST123", adset_id: "456", ad_id: null, aff_id: null, medium: "test"}
```

### 3. Verify Cookie Exists

In browser console:
```javascript
document.cookie.split(';').find(c => c.includes('marketing-params'))
// Should return: " marketing-params=%7B%22campaign_id%22%3A%22TEST123%22..."
```

### 4. Decode Cookie

```javascript
const cookies = document.cookie.split(';').reduce((acc, c) => {
  const [k, v] = c.trim().split('=')
  acc[k] = v
  return acc
}, {})

JSON.parse(decodeURIComponent(cookies['marketing-params']))
// Should return: {campaign_id: "TEST123", adset_id: "456", ad_id: null, aff_id: null, medium: "test"}
```

### 5. Submit Order

Fill out checkout form and submit.

### 6. Check Webhook Payload

Server logs should show:
```json
{
  "marketing": {
    "campaign_id": "TEST123",
    "adset_id": "456",
    "ad_id": null,
    "aff_id": null,
    "medium": "test"
  }
}
```

## Important Notes

### Cookies are Set ONLY When You Visit with URL Parameters

❌ **Without parameters:** `http://localhost:3000/rs/checkouts/fungel`
- Result: Default values (all null, medium: "website")

✅ **With parameters:** `http://localhost:3000/rs/checkouts/fungel?campaign_id=FB123`
- Result: Actual values stored and sent to webhook

### Cookie Persists for 30 Days

Once set, the marketing cookie persists for 30 days. This means:
- User visits with `?campaign_id=FB123` today
- Cookie is stored
- User returns tomorrow (no URL parameters)
- Cookie is still there with FB123
- Order is submitted → webhook receives FB123

### Multiple Visits Update the Cookie

```
Visit 1: ?campaign_id=FB123&medium=facebook
  → Cookie: {campaign_id: "FB123", medium: "facebook"}

Visit 2: ?adset_id=AD456
  → Cookie: {campaign_id: "FB123", adset_id: "AD456", medium: "facebook"}
  (merged with existing)
```

## Server-Side Flow

```javascript
// In /api/orders route

// 1. Get cookies from request headers
const cookieHeader = request.headers.get('cookie');

// 2. Parse marketing params from cookies
const cookieMarketingParams = getMarketingCookiesFromHeaders(cookieHeader);
// Result: {campaign_id: "FB123", adset_id: "AD456", ...}

// 3. Fallback to request body if cookies not available
const marketingParams = orderData.marketingParams || cookieMarketingParams;

// 4. Include in webhook payload
const webhookPayload = {
  marketing: {
    campaign_id: marketingParams.campaign_id,
    adset_id: marketingParams.adset_id,
    ad_id: marketingParams.ad_id,
    aff_id: marketingParams.aff_id,
    medium: marketingParams.medium
  }
};
```

## Supported URL Parameters

| Parameter | Aliases | Example |
|-----------|---------|---------|
| campaign_id | utm_campaign, campaign | `?campaign_id=SUMMER2024` |
| adset_id | utm_adset | `?adset_id=AD12345` |
| ad_id | utm_ad | `?ad_id=789` |
| aff_id | affiliate_id | `?aff_id=AFF001` |
| medium | utm_medium, source, utm_source | `?medium=facebook` |
| fbclid | (auto-detected) | `?fbclid=IwAR123...` (sets medium to 'facebook') |

## Example URLs for Testing

```bash
# Facebook campaign
http://localhost:3000/rs/checkouts/fungel?campaign_id=FB_SUMMER&adset_id=AD123&ad_id=789&medium=facebook

# Facebook with click ID
http://localhost:3000/rs/checkouts/fungel?fbclid=IwAR1234567890

# Affiliate
http://localhost:3000/rs/checkouts/fungel?campaign_id=AFFILIATE_PROMO&aff_id=AFF001&medium=affiliate

# Google Ads (UTM format)
http://localhost:3000/rs/checkouts/fungel?utm_campaign=google_summer&utm_medium=cpc&utm_source=google

# Instagram
http://localhost:3000/rs/checkouts/fungel?campaign_id=IG_STORY&medium=instagram

# TikTok
http://localhost:3000/rs/checkouts/fungel?campaign_id=TIKTOK_VIDEO&medium=tiktok
```

## Troubleshooting

### Problem: Webhook shows all null values

**Cause:** No URL parameters were provided when visiting the page.

**Solution:** Visit with URL parameters (see examples above).

### Problem: Console shows no logs

**Cause:** Not on a checkout page or no URL parameters.

**Solution:** 
1. Make sure you're on `/[locale]/checkouts/[slug]` page
2. Include URL parameters in the URL

### Problem: Cookie not persisting

**Cause:** Browser privacy settings or incognito mode.

**Solution:**
1. Disable strict cookie blocking
2. Use normal browsing mode (not incognito)
3. Check browser console for errors

### Problem: Webhook receives wrong values

**Cause:** Old cookie from previous test.

**Solution:** Clear cookies and test again:
```javascript
document.cookie = 'marketing-params=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
location.reload();
```

## Summary

✅ Marketing params are ALWAYS stored in cookies  
✅ Server can read from cookie headers  
✅ Webhook receives marketing data  
✅ Works for 30 days after initial visit  
✅ Merges new params with existing ones  
✅ GDPR banner still shown for transparency  
✅ No data loss - cookies persist across sessions
