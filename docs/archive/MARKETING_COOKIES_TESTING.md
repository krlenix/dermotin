# Marketing Cookies Testing Guide

## Quick Test Instructions

### Step 1: Open Browser Console
1. Open your browser's Developer Tools (F12)
2. Go to the **Console** tab

### Step 2: Visit Page with Marketing Parameters

Try these test URLs (replace `localhost:3000` with your domain):

#### Test URL 1: Facebook Campaign
```
http://localhost:3000/rs/checkouts/fungel?campaign_id=FB123&adset_id=AD456&ad_id=789&medium=facebook
```

#### Test URL 2: With fbclid (Facebook Click ID)
```
http://localhost:3000/rs/checkouts/fungel?fbclid=IwAR1234567890abcdef
```

#### Test URL 3: Affiliate Campaign
```
http://localhost:3000/rs/checkouts/fungel?campaign_id=AFFILIATE&aff_id=AFF123&medium=affiliate
```

#### Test URL 4: UTM Parameters
```
http://localhost:3000/rs/checkouts/fungel?utm_campaign=summer_sale&utm_medium=social&utm_source=instagram
```

### Step 3: Expected Console Logs

When you visit a page with marketing parameters, you should see:

#### If Marketing Consent is GIVEN (or no consent required):
```
📊 New marketing parameters detected in URL: { campaign_id: 'FB123', adset_id: 'AD456', ad_id: '789', medium: 'facebook' }
📊 Marketing cookies updated: { campaign_id: 'FB123', adset_id: 'AD456', ad_id: '789', aff_id: null, medium: 'facebook' }
```

#### If Marketing Consent is NOT GIVEN (EU user, declined):
```
📊 New marketing parameters detected in URL: { campaign_id: 'FB123', adset_id: 'AD456', ad_id: '789', medium: 'facebook' }
📊 Marketing params stored temporarily (awaiting consent): { campaign_id: 'FB123', adset_id: 'AD456', ad_id: '789', aff_id: null, medium: 'facebook' }
```

#### When User Accepts Cookies:
```
✅ Marketing params moved from temporary storage to cookies: { campaign_id: 'FB123', adset_id: 'AD456', ad_id: '789', aff_id: null, medium: 'facebook' }
📊 Marketing params updated after consent change: { campaign_id: 'FB123', adset_id: 'AD456', ad_id: '789', aff_id: null, medium: 'facebook' }
```

### Step 4: Verify Storage

#### Check Cookies (if consent given):
In the Console, run:
```javascript
document.cookie.split(';').forEach(c => console.log(c.trim()))
```
Look for: `marketing-params=...`

#### Check SessionStorage (if consent NOT given):
In the Console, run:
```javascript
console.log('Temp params:', sessionStorage.getItem('temp-marketing-params'))
```

#### Check Consent Status:
In the Console, run:
```javascript
console.log('Consent:', localStorage.getItem('cookie-consent'))
```

### Step 5: Test Cookie Acceptance Flow

1. **Clear everything first:**
```javascript
// Run in console
localStorage.clear()
sessionStorage.clear()
document.cookie.split(";").forEach(c => document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/")
location.reload()
```

2. **Visit with marketing params:**
```
http://localhost:3000/rs/checkouts/fungel?campaign_id=TEST123&medium=test
```

3. **Should see in console:**
```
📊 New marketing parameters detected in URL: { campaign_id: 'TEST123', medium: 'test' }
📊 Marketing params stored temporarily (awaiting consent): { ... }
```

4. **Accept cookies in the banner**

5. **Should see in console:**
```
✅ Marketing params moved from temporary storage to cookies: { ... }
📊 Marketing params updated after consent change: { ... }
```

6. **Verify cookie was set:**
```javascript
document.cookie.includes('marketing-params')  // Should be true
```

## Troubleshooting

### Not seeing any logs?

1. **Check if you're on the right page:**
   - Logs only appear on pages that use `useMarketingTracking()` hook
   - This is: `/[locale]/checkouts/[slug]` pages (AdvancedLandingPage)

2. **Check if URL has parameters:**
   - Logs only appear when URL has marketing parameters
   - Without parameters, no logs will show

3. **Check Console tab:**
   - Make sure you're on the "Console" tab, not "Network" or others
   - Check filter settings (should not be filtering out logs)

4. **Hard refresh the page:**
   - Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - This clears cache and reloads

### Not seeing cookies?

1. **Check if consent was given:**
```javascript
JSON.parse(localStorage.getItem('cookie-consent'))?.marketing
// Should be true
```

2. **Check if in sessionStorage instead:**
```javascript
sessionStorage.getItem('temp-marketing-params')
// Should have data if no consent
```

### Testing on Production

If testing on your live site:
```
https://yoursite.com/rs/checkouts/fungel?campaign_id=TEST&medium=test&ad_id=123
```

## Debug Commands

Run these in browser console to debug:

```javascript
// 1. Check current consent
console.log('Consent:', JSON.parse(localStorage.getItem('cookie-consent')))

// 2. Check cookies
console.log('Cookies:', document.cookie)

// 3. Check sessionStorage
console.log('Temp params:', sessionStorage.getItem('temp-marketing-params'))

// 4. Check URL params
console.log('URL params:', new URLSearchParams(window.location.search).toString())

// 5. Force check if marketing cookies exist
const cookies = document.cookie.split(';').reduce((acc, cookie) => {
  const [key, value] = cookie.trim().split('=')
  acc[key] = value
  return acc
}, {})
console.log('Marketing cookie:', cookies['marketing-params'])

// 6. Parse marketing cookie if exists
if (cookies['marketing-params']) {
  console.log('Parsed:', JSON.parse(decodeURIComponent(cookies['marketing-params'])))
}
```

## Video Recording Tip

If you want to record the test:
1. Start screen recording
2. Open Console
3. Visit URL with params
4. Show the console logs
5. Accept cookies
6. Show console logs again
7. Run debug commands to verify storage

This will help demonstrate that the feature is working correctly!
