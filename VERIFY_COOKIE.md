# Verify Marketing Cookie

## Your Cookie IS Set! ✅

In your screenshot, I can see:
```
Name: marketing-params
Value: %7B%22campaign_id%22%2...
Path: /
Size: 163
```

This is the marketing cookie - it's URL encoded JSON.

## Decode Your Cookie

Run this in the browser console to see the actual value:

```javascript
// Method 1: Direct decode
const cookies = document.cookie.split(';').reduce((acc, c) => {
  const [k, v] = c.trim().split('=')
  acc[k] = v
  return acc
}, {})

if (cookies['marketing-params']) {
  console.log('📊 Decoded marketing cookie:', JSON.parse(decodeURIComponent(cookies['marketing-params'])))
} else {
  console.log('❌ Cookie not found')
}

// Method 2: Check all cookies
console.log('All cookies:', document.cookie)

// Method 3: Verify the specific cookie exists
console.log('Has marketing-params?', document.cookie.includes('marketing-params'))
```

## Expected Output

You should see:
```javascript
{
  campaign_id: "TEST123",
  adset_id: "456", 
  ad_id: null,
  aff_id: "55",
  medium: "facebook"
}
```

## Why You Might Not See the "📊 Marketing cookies updated:" Log

The log "📊 Marketing cookies updated:" only appears when:
1. You visit the page WITH new URL parameters
2. The `setMarketingCookies()` function is called

The log "📊 Marketing tracking active:" appears every time the page loads and shows the CURRENT values (from existing cookies).

## Test: Force Cookie Update

To see the "📊 Marketing cookies updated:" log:

1. **Clear the cookie:**
```javascript
document.cookie = 'marketing-params=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
```

2. **Reload with parameters:**
```
http://localhost:3000/rs/checkouts/fungel?campaign_id=NEW123&adset_id=789&aff_id=99&medium=test
```

3. **Now you should see:**
```
📊 New marketing parameters detected in URL: {...}
📊 Marketing cookies updated: {...}
📊 Marketing tracking active: {...}
```

## Verify Cookie in DevTools

In your Application tab (where you took the screenshot):

1. Click on the `marketing-params` cookie
2. Look at the "Value" field
3. Copy the value and decode it manually:

```javascript
// Paste your cookie value here
const cookieValue = "%7B%22campaign_id%22%3A%22TEST123%22%2C%22adset_id%22%3A%22456%22%2C%22ad_id%22%3Anull%2C%22aff_id%22%3A%2255%22%2C%22medium%22%3A%22facebook%22%7D"

console.log('Decoded:', JSON.parse(decodeURIComponent(cookieValue)))
```

## The Cookie IS Working!

Based on your screenshot:
- ✅ Cookie exists: `marketing-params`
- ✅ Cookie has a value (163 bytes)
- ✅ Cookie path is correct: `/`
- ✅ Console shows correct data: `{campaign_id: 'TEST123', adset_id: '456', aff_id: '55', medium: 'facebook'}`

**The cookie IS being stored and IS working!**

When you submit an order, this cookie will be sent with the request headers and your webhook will receive these values.
