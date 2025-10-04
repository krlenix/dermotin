# Marketing Cookies Debug Mode

## Problem
Console logs for marketing cookies were not appearing on production site (dermotin.shop) even though they worked on localhost.

## Solution
Implemented a debug mode system that:
- ✅ Always shows logs in development (`localhost`)
- ✅ Can be enabled in production via localStorage
- ✅ Prevents unwanted console logs for end users
- ✅ Works across page reloads and sessions

## How to Enable Debug Mode in Production

### Step 1: Open Browser Console
On https://dermotin.shop, press `F12` or right-click → Inspect → Console

### Step 2: Enable Debug Mode
```javascript
localStorage.setItem('debug-marketing', 'true');
```

### Step 3: Reload the Page
Press `Ctrl+R` or `F5` to reload

### Step 4: Visit URL with Marketing Parameters
```
https://dermotin.shop/rs/checkouts/fungel?campaign_id=TEST123&adset_id=456&medium=facebook&aff_id=55
```

## What You Should See

With debug mode enabled, you'll see logs like:

```
📊 New marketing parameters detected in URL: {campaign_id: 'TEST123', adset_id: '456', ...}
📊 Marketing params stored in sessionStorage: {campaign_id: 'TEST123', ...}
📊 Marketing cookies updated: {campaign_id: 'TEST123', adset_id: '456', aff_id: '55', medium: 'facebook'}
```

Or if consent is pending:
```
⚠️ Waiting for cookie consent before storing in cookies
```

## To Disable Debug Mode

```javascript
localStorage.removeItem('debug-marketing');
```

Then reload the page.

## Server-Side Debug Mode

To enable debug logging for server-side functions (like webhook handlers), set this environment variable:

```bash
DEBUG_MARKETING=true
```

This will show logs like:
```
✅ Marketing cookies parsed from headers: {...}
⚠️ marketing-params cookie not found in header
```

## Testing Checklist

- [ ] Enable debug mode in production
- [ ] Visit URL with marketing parameters
- [ ] Verify console logs appear
- [ ] Check sessionStorage has `temp-marketing-params`
- [ ] Check cookies have `marketing-params`
- [ ] Test cookie consent flow
- [ ] Test without parameters (should show existing values)
- [ ] Disable debug mode (logs should stop)

## Files Modified

1. **src/utils/marketing-cookies.ts**
   - Added `debugLog()` function
   - All client-side console.logs now use `debugLog()`
   - Server-side logs check `DEBUG_MARKETING` env var

2. **src/hooks/useMarketingTracking.ts**
   - Added `debugLog()` function
   - All console.logs now use `debugLog()`

3. **VERIFY_COOKIE.md**
   - Added debug mode instructions at the top

## Why This Approach?

1. **Better UX**: End users don't see debug logs in production
2. **Better DX**: Developers can easily enable debugging when needed
3. **Persistent**: Debug mode stays enabled across page reloads
4. **Flexible**: Can be toggled on/off instantly without redeployment
5. **Secure**: Only logs data, doesn't expose sensitive information

## Quick Commands

```javascript
// Enable debug mode
localStorage.setItem('debug-marketing', 'true'); location.reload();

// Check if debug mode is enabled
localStorage.getItem('debug-marketing');

// Disable debug mode
localStorage.removeItem('debug-marketing'); location.reload();

// View current marketing cookies
JSON.parse(decodeURIComponent(document.cookie.split(';').find(c => c.includes('marketing-params'))?.split('=')[1] || '{}'));
```
