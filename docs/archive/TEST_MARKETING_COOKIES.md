# Quick Marketing Cookies Test

## The Issue
You're seeing default values (all `null`, medium: `"website"`) because no marketing parameters were captured from the URL.

## Simple Test Steps

### Step 1: Clear Everything
Open browser console and run:
```javascript
localStorage.clear()
sessionStorage.clear()
document.cookie.split(";").forEach(c => {
  document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/"
})
```

### Step 2: Visit with Marketing Parameters
**IMPORTANT: You must include URL parameters!**

```
http://localhost:3000/rs/checkouts/fungel?campaign_id=FB123&adset_id=AD456&ad_id=789&medium=facebook
```

### Step 3: Check Console Logs
You should see:
```
📊 New marketing parameters detected in URL: {campaign_id: "FB123", adset_id: "AD456", ad_id: "789", medium: "facebook"}
📊 Marketing cookies updated: {...}
```

### Step 4: Verify Cookie Was Set
In console, run:
```javascript
document.cookie.split(';').forEach(c => console.log(c.trim()))
```

Look for:
```
marketing-params=%7B%22campaign_id%22%3A%22FB123%22%2C%22adset_id%22%3A%22AD456%22...
```

### Step 5: Decode and Check Cookie Value
```javascript
const cookies = document.cookie.split(';').reduce((acc, c) => {
  const [k, v] = c.trim().split('=')
  acc[k] = v
  return acc
}, {})

if (cookies['marketing-params']) {
  console.log('Marketing cookie value:', JSON.parse(decodeURIComponent(cookies['marketing-params'])))
} else {
  console.log('❌ No marketing-params cookie found!')
}
```

### Step 6: Place Test Order
Fill out the form and submit. Then check the webhook payload in your terminal/logs.

## Common Issues

### Issue 1: No URL Parameters
❌ `http://localhost:3000/rs/checkouts/fungel`
✅ `http://localhost:3000/rs/checkouts/fungel?campaign_id=TEST123`

Without URL parameters, the default values are used.

### Issue 2: Wrong Page
Marketing tracking only works on pages that use `useMarketingTracking()` hook:
- ✅ `/[locale]/checkouts/[slug]` pages
- ❌ Home page, contact page, etc.

### Issue 3: Cookie Not Persisting
Check if cookies are blocked by:
1. Browser privacy settings
2. Incognito/Private mode
3. Third-party cookie blockers

## Debug: Check Everything
Run this complete debug script in console:

```javascript
console.log('=== MARKETING COOKIES DEBUG ===')
console.log('1. URL Parameters:', new URLSearchParams(window.location.search).toString())
console.log('2. Cookie Consent:', localStorage.getItem('cookie-consent'))
console.log('3. All Cookies:', document.cookie)
console.log('4. SessionStorage:', sessionStorage.getItem('temp-marketing-params'))

// Parse marketing cookie if exists
const cookies = document.cookie.split(';').reduce((acc, c) => {
  const [k, v] = c.trim().split('=')
  acc[k] = v
  return acc
}, {})

if (cookies['marketing-params']) {
  console.log('5. Marketing Cookie (parsed):', JSON.parse(decodeURIComponent(cookies['marketing-params'])))
} else {
  console.log('5. ❌ No marketing-params cookie found')
}

// Check if on correct page
console.log('6. Current Page:', window.location.pathname)
console.log('7. Is Checkout Page?', window.location.pathname.includes('/checkouts/'))
```

## Expected Result for Webhook

When you submit an order with marketing parameters in the URL, the webhook should receive:

```json
{
  "marketing": {
    "campaign_id": "FB123",
    "adset_id": "AD456", 
    "ad_id": "789",
    "aff_id": null,
    "medium": "facebook"
  }
}
```

If you're seeing all `null` values, it means:
1. You didn't visit with URL parameters, OR
2. The parameters weren't extracted, OR
3. The parameters weren't included in the order submission
