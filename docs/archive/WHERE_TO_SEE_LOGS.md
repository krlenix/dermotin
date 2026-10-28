# Where To See Marketing Cookie Logs

## IMPORTANT: Two Different Consoles!

### 1. Browser Console (F12) - Client-Side Logs
**When:** You visit the page with URL parameters  
**Where:** Chrome DevTools → Console tab  
**What you should see:**
```
📊 New marketing parameters detected in URL: {campaign_id: "TEST123", ...}
📊 Marketing cookies updated: {campaign_id: "TEST123", ...}
📊 Marketing tracking active: {campaign_id: "TEST123", ...}
```

### 2. Terminal/Server Console - Server-Side Logs  
**When:** You submit an order (API request)  
**Where:** The terminal where you ran `npm run dev`  
**What you should see:**
```
🍪 Cookie header present: true Length: 450
✅ Marketing cookies parsed from headers: {campaign_id: "TEST123", ...}
📊 Using source: COOKIES
```

## Step-by-Step Test

### Step 1: Open Browser Console
1. Press F12
2. Click "Console" tab
3. Clear it (click 🚫 icon)

### Step 2: Visit with Parameters
Go to:
```
http://localhost:3000/rs/checkouts/fungel?campaign_id=TEST123&adset_id=456&aff_id=55&medium=facebook
```

### Step 3: Check Browser Console IMMEDIATELY
You should see in **Browser Console** (F12):
```javascript
📊 New marketing parameters detected in URL: {campaign_id: "TEST123", adset_id: "456", aff_id: "55", medium: "facebook"}
📊 Marketing cookies updated: {campaign_id: "TEST123", adset_id: "456", ad_id: null, aff_id: "55", medium: "facebook"}
📊 Marketing tracking active: {campaign_id: "TEST123", adset_id: "456", ad_id: null, aff_id: "55", medium: "facebook"}
```

**If you DON'T see these logs:**
- The page might not have loaded yet (wait a few seconds)
- The component might not be mounted
- Check if there are any errors in the console

### Step 4: Verify Cookie Was Set
In **Browser Console** (F12), run:
```javascript
document.cookie.split(';').forEach(c => console.log(c.trim()))
```

Look for:
```
marketing-params=%7B%22campaign_id%22%3A%22TEST123%22...
```

### Step 5: Decode Cookie to Verify
In **Browser Console** (F12), run:
```javascript
const cookies = document.cookie.split(';').reduce((acc, c) => {
  const [k, v] = c.trim().split('=')
  acc[k] = v
  return acc
}, {})

if (cookies['marketing-params']) {
  console.log('✅ Cookie value:', JSON.parse(decodeURIComponent(cookies['marketing-params'])))
} else {
  console.log('❌ marketing-params cookie NOT FOUND')
}
```

Expected output:
```javascript
✅ Cookie value: {
  campaign_id: "TEST123",
  adset_id: "456",
  ad_id: null,
  aff_id: "55",
  medium: "facebook"
}
```

### Step 6: Look at Your Terminal
Switch to the **Terminal** where `npm run dev` is running. You should NOT see any logs yet (because we haven't submitted an order).

### Step 7: Fill Out Checkout Form
Fill in:
- Name: Test User
- Phone: +381111222333
- Address: Test Address 123
- City: Belgrade
- Email: test@test.com

### Step 8: Submit Order
Click the submit button.

### Step 9: Check Terminal (Server Console)
NOW look at your **Terminal** (NOT browser console). You should see:
```
🍪 Cookie header present: true Length: 450
✅ Marketing cookies parsed from headers: {
  campaign_id: 'TEST123',
  adset_id: '456',
  ad_id: null,
  aff_id: '55',
  medium: 'facebook'
}
📊 Marketing params from cookies: {
  campaign_id: 'TEST123',
  adset_id: '456',
  ad_id: null,
  aff_id: '55',
  medium: 'facebook'
}
📊 Final marketing parameters (from body or cookies): {
  campaign_id: 'TEST123',
  adset_id: '456',
  ad_id: null,
  aff_id: '55',
  medium: 'facebook'
}
📊 Using source: COOKIES
🚀 Attempting to send webhook for locale: rs
📤 Webhook payload for rs: {
  ...
  marketing: {
    campaign_id: 'TEST123',
    adset_id: '456',
    ad_id: null,
    aff_id: '55',
    medium: 'facebook'
  }
}
```

## Troubleshooting

### Issue: No logs in Browser Console at all

**Possible causes:**
1. JavaScript is disabled
2. Page didn't load properly
3. Console is filtered (check the filter dropdown)
4. You're on the wrong page (must be `/[locale]/checkouts/[slug]`)

**Solution:** Hard refresh (Ctrl+Shift+R) and try again

### Issue: No "📊 New marketing parameters detected" log

**Cause:** No URL parameters or parameters not recognized

**Check:**
```javascript
// Run in browser console
console.log('URL params:', new URLSearchParams(window.location.search).toString())
// Should show: campaign_id=TEST123&adset_id=456&aff_id=55&medium=facebook
```

### Issue: No "📊 Marketing cookies updated" log

**Cause:** `setMarketingCookies()` function had an error

**Check browser console for errors:**
```javascript
// Try manually
import { setMarketingCookies } from '@/utils/marketing-cookies'
setMarketingCookies({campaign_id: 'TEST', medium: 'test'})
```

### Issue: No logs in Terminal when submitting order

**Possible causes:**
1. Order submission failed before reaching the logs
2. API route not being called
3. Terminal not showing console.log output

**Check:**
1. Look for ANY logs in terminal when you submit
2. Check browser Network tab (F12 → Network) for `/api/orders` request
3. Check if request succeeded (status 200) or failed

### Issue: Terminal shows "⚠️ No cookie header found"

**Cause:** Cookies aren't being sent with the request

**Solutions:**
1. Check if cookie exists in browser (Step 5)
2. Check browser privacy settings
3. Make sure you're not in incognito mode
4. Check if SameSite or other cookie attributes are blocking it

### Issue: Terminal shows "⚠️ marketing-params cookie not found in header"

**Cause:** Cookie exists but has different name or wasn't sent

**Check:** Terminal will show "Available cookies: ..." - look at that list

## Quick Debug Script

Run this in **Browser Console** (F12) before submitting order:

```javascript
console.log('=== PRE-SUBMIT DEBUG ===')
console.log('1. Current URL:', window.location.href)
console.log('2. URL params:', new URLSearchParams(window.location.search).toString())

const cookies = document.cookie.split(';').reduce((acc, c) => {
  const [k, v] = c.trim().split('=')
  acc[k] = v
  return acc
}, {})

console.log('3. Has marketing-params cookie?', 'marketing-params' in cookies)

if (cookies['marketing-params']) {
  try {
    console.log('4. Cookie value:', JSON.parse(decodeURIComponent(cookies['marketing-params'])))
  } catch (e) {
    console.log('4. Cookie parse error:', e)
  }
} else {
  console.log('4. ❌ No marketing-params cookie found')
  console.log('   Available cookies:', Object.keys(cookies))
}

console.log('5. SessionStorage:', sessionStorage.getItem('temp-marketing-params'))
console.log('=== END DEBUG ===')
```

Expected good output:
```
1. Current URL: http://localhost:3000/rs/checkouts/fungel?campaign_id=TEST123...
2. URL params: campaign_id=TEST123&adset_id=456&aff_id=55&medium=facebook  
3. Has marketing-params cookie? true
4. Cookie value: {campaign_id: "TEST123", adset_id: "456", ...}
5. SessionStorage: {"campaign_id":"TEST123",...}
```

## Summary

✅ **Browser Console (F12)** = Client-side logs (setting cookies)  
✅ **Terminal** = Server-side logs (reading cookies)  
✅ Cookie is set in browser, sent to server, read from headers  
✅ Both places should show the same marketing data  
