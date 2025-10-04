# Debug Marketing Cookies in Webhook

## Changes Made

I've added comprehensive debug logging to track exactly what's happening with marketing cookies when orders are submitted.

## Test Now

### Step 1: Make sure you have the marketing cookie

Visit with parameters:
```
http://localhost:3000/rs/checkouts/fungel?campaign_id=TEST123&adset_id=456&aff_id=55&medium=facebook
```

Verify cookie exists in browser console:
```javascript
document.cookie.includes('marketing-params')  // Should be true
```

### Step 2: Submit a Test Order

Fill out the checkout form with test data and submit.

### Step 3: Check Server Logs

Look at your terminal/console where the Next.js dev server is running. You should see detailed logs:

#### Expected Logs (Success Path):

```
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
✅ Marketing cookies parsed from headers: {
  campaign_id: 'TEST123',
  adset_id: '456',
  ad_id: null,
  aff_id: '55',
  medium: 'facebook'
}
```

#### If Cookie Not Found:

```
⚠️ marketing-params cookie not found in header. Available cookies: _fbp, _fbc, NEXT_LOCALE
```

This means the cookie wasn't sent with the request (browser issue or cookie was cleared).

#### If No Cookie Header:

```
⚠️ No cookie header found in request
```

This means NO cookies were sent at all (very unusual).

#### If Using Request Body (Fallback):

```
📊 Marketing params from cookies: {
  campaign_id: null,
  adset_id: null,
  ad_id: null,
  aff_id: null,
  medium: 'website'
}
📊 Final marketing parameters (from body or cookies): {
  campaign_id: 'TEST123',
  adset_id: '456',
  ad_id: null,
  aff_id: '55',
  medium: 'facebook'
}
📊 Using source: REQUEST BODY
```

This means cookies weren't available, but the data was sent in the request body (still works!).

### Step 4: Check Webhook Payload

After you see the logs above, the webhook will be sent. Check your webhook endpoint logs. The payload should include:

```json
{
  "marketing": {
    "campaign_id": "TEST123",
    "adset_id": "456",
    "ad_id": null,
    "aff_id": "55",
    "medium": "facebook"
  }
}
```

## Troubleshooting

### If you see all null values in webhook:

1. **Check the logs** - Look for which path was taken:
   - If "Using source: COOKIES" → Cookie was parsed correctly
   - If "Using source: REQUEST BODY" → Cookie missing, using fallback
   - If neither → Something went wrong

2. **Check if cookie header exists:**
   ```
   🍪 Cookie header present: true Length: 450
   ```
   If false or length is 0, cookies aren't being sent.

3. **Check what cookies are available:**
   Look for the log that lists available cookies:
   ```
   ⚠️ marketing-params cookie not found in header. Available cookies: _fbp, _fbc, NEXT_LOCALE
   ```

4. **Verify cookie in browser before submitting:**
   ```javascript
   // Run this BEFORE clicking submit
   const cookies = document.cookie.split(';').reduce((acc, c) => {
     const [k, v] = c.trim().split('=')
     acc[k] = v
     return acc
   }, {})
   
   console.log('marketing-params cookie:', 
     cookies['marketing-params'] 
       ? JSON.parse(decodeURIComponent(cookies['marketing-params'])) 
       : 'NOT FOUND'
   )
   ```

### Common Issues and Solutions

#### Issue: Cookie exists in browser but not in server logs

**Cause:** Cookie path or SameSite issues

**Solution:** Check that the cookie has:
- Path: `/`
- SameSite: `Lax`
- Not HttpOnly (should be accessible via JavaScript)

#### Issue: Cookie value is being truncated

**Cause:** Cookie splitting on '=' breaking URL-encoded values

**Solution:** Already fixed! We now use `substring(indexOf('=') + 1)` instead of `split('=')[1]`

#### Issue: "Using source: REQUEST BODY" instead of cookies

**Cause:** Cookie header not present or marketing-params cookie not found

**Solution:** This is actually fine! The fallback to request body works, but ideally cookies should work for better server-side tracking.

## Test Different Scenarios

### Test 1: Fresh visit with parameters
```bash
# Clear everything
localStorage.clear()
sessionStorage.clear()
document.cookie.split(";").forEach(c => document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/")

# Visit
http://localhost:3000/rs/checkouts/fungel?campaign_id=FRESH&medium=test

# Submit order
# Expected: Cookie set and sent to webhook
```

### Test 2: Returning visitor (cookie already set)
```bash
# Don't clear cookies
# Visit without parameters
http://localhost:3000/rs/checkouts/fungel

# Submit order
# Expected: Old cookie values sent to webhook
```

### Test 3: Update existing cookie
```bash
# First visit
http://localhost:3000/rs/checkouts/fungel?campaign_id=FIRST&medium=facebook

# Second visit with new params
http://localhost:3000/rs/checkouts/fungel?adset_id=NEW123

# Submit order
# Expected: Merged values (campaign_id=FIRST, adset_id=NEW123, medium=facebook)
```

## Success Criteria

✅ Server logs show "✅ Marketing cookies parsed from headers"  
✅ Server logs show actual values (not all null)  
✅ Server logs show "Using source: COOKIES"  
✅ Webhook receives the correct marketing data  

If all these pass, the implementation is working correctly!
