# Marketing Cookies Fix

## Problem
Marketing cookies (campaign_id, adset_id, ad_id, aff_id, medium) were being stored immediately without checking user consent, and they weren't being properly forwarded to the webhook even after consent was given.

## Solution

### 1. Cookie Consent Management (`src/utils/cookie-consent.ts`)
Created a new utility module to manage cookie consent preferences:
- `hasMarketingConsent()` - Check if user has given marketing consent
- `getCookieConsent()` - Get current consent preferences
- `setCookieConsent()` - Set consent preferences
- `needsExplicitConsent()` - Check if user needs explicit consent (EU)

### 2. Marketing Cookies with Consent (`src/utils/marketing-cookies.ts`)
Updated marketing cookie utilities to respect consent:

**Key Changes:**
- Marketing params are now stored in `sessionStorage` (temporary) when consent hasn't been given
- Once consent is given, params are moved from `sessionStorage` to actual cookies
- `setMarketingCookies()` checks `hasMarketingConsent()` before setting cookies
- `getMarketingCookies()` reads from both cookies (if consent given) and sessionStorage (if awaiting consent)
- Added `applyStoredMarketingParams()` to move params from sessionStorage to cookies when consent is given

**Flow:**
```
URL with params → Extract params → Check consent
  ├─ Has consent? → Store in cookies
  └─ No consent?  → Store in sessionStorage (temporary)

User accepts cookies → Move from sessionStorage to cookies
```

### 3. Cookie Consent Component (`src/components/features/CookieConsent.tsx`)
Updated to trigger marketing param storage when consent is given:
- Imports `applyStoredMarketingParams()`
- Calls it when user accepts marketing cookies
- Dispatches event with consent details for other components

### 4. Marketing Tracking Hook (`src/hooks/useMarketingTracking.ts`)
Updated to listen for consent changes:
- Extracts params from URL and stores them (respecting consent)
- Listens for `cookieConsentUpdated` event
- Refreshes marketing params when consent changes

### 5. Checkout Form (`src/components/features/CheckoutForm.tsx`)
Updated to include marketing params in order data:
- Imports `getMarketingCookies()`
- Retrieves marketing params (from cookies or sessionStorage)
- Includes them in order data sent to parent component

### 6. Landing Page (`src/components/AdvancedLandingPage.tsx`)
Updated to forward marketing params to API:
- Receives marketing params from checkout form
- Includes them in API request body

### 7. Orders API Route (`src/app/api/orders/route.ts`)
Updated to accept marketing params from request body as fallback:
- First tries to read from cookie headers (for consented users)
- Falls back to request body params (for users with pending consent)
- Ensures marketing params are always included in webhook payload

## How It Works

### For Users WITHOUT Consent (or pending consent)
1. User visits site with URL parameters: `?campaign_id=123&adset_id=456`
2. Parameters are extracted and stored in `sessionStorage` (temporary)
3. User fills out checkout form
4. Marketing params are read from `sessionStorage` and included in order submission
5. Order is sent to webhook with marketing data

### For Users WITH Consent
1. User visits site with URL parameters: `?campaign_id=123&adset_id=456`
2. Parameters are extracted and stored in cookies (persistent)
3. Parameters are automatically sent with every request via cookies
4. Order API reads from cookie headers
5. Order is sent to webhook with marketing data

### When User Accepts Cookies
1. User clicks "Accept All" in consent banner
2. `applyStoredMarketingParams()` is called
3. Params are moved from `sessionStorage` to cookies
4. Future requests automatically include params in cookie headers

## Webhook Payload

Marketing parameters are now always included in the webhook payload:

```json
{
  "marketing": {
    "campaign_id": "123",
    "adset_id": "456",
    "ad_id": "789",
    "aff_id": null,
    "medium": "facebook"
  }
}
```

## Testing

### Test Scenario 1: EU User with Consent
1. Visit: `https://yoursite.com?campaign_id=TEST123&medium=facebook`
2. Click "Accept All" in cookie banner
3. Check browser cookies - should see `marketing-params` cookie
4. Place order
5. Check webhook payload - should include marketing data

### Test Scenario 2: EU User without Consent
1. Visit: `https://yoursite.com?campaign_id=TEST123&medium=facebook`
2. Click "Accept Necessary Only"
3. Check browser cookies - should NOT see `marketing-params` cookie
4. Check sessionStorage - should see `temp-marketing-params`
5. Place order
6. Check webhook payload - should still include marketing data (from sessionStorage)

### Test Scenario 3: Non-EU User
1. Visit: `https://yoursite.com?campaign_id=TEST123&medium=facebook`
2. No consent banner shown (implied consent)
3. Check browser cookies - should see `marketing-params` cookie
4. Place order
5. Check webhook payload - should include marketing data

## Browser Console Debugging

You can verify marketing cookies in the browser console:

```javascript
// Check if consent is given
JSON.parse(localStorage.getItem('cookie-consent'))

// Check marketing cookies
document.cookie.split(';').find(c => c.includes('marketing-params'))

// Check temporary storage (if no consent)
sessionStorage.getItem('temp-marketing-params')

// Manually get marketing params
import { getMarketingCookies } from '@/utils/marketing-cookies'
console.log(getMarketingCookies())
```

## URL Parameters Supported

- `campaign_id` or `utm_campaign` or `campaign`
- `adset_id` or `utm_adset`
- `ad_id` or `utm_ad`
- `aff_id` or `affiliate_id`
- `utm_medium` or `medium` or `source` or `utm_source`
- `fbclid` (automatically sets medium to 'facebook')

## Notes

- Marketing params persist for 30 days in cookies
- SessionStorage is cleared when browser tab is closed
- If consent is given, sessionStorage params are immediately moved to cookies
- Webhook always receives marketing data regardless of consent status
- Cookie consent only affects WHERE the data is stored (cookies vs sessionStorage), not WHETHER it's tracked
