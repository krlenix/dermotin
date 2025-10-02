# GDPR Cookie Consent Setup

## Overview
The application now includes GDPR-compliant cookie consent functionality that:
- Shows consent banner **only for EU countries**
- **Marketing cookies are enabled by default** for better user experience
- Blocks pixel tracking until consent is granted (for EU users)
- Automatically initializes tracking when consent is given

## Changes Made

### 1. Marketing Cookies Enabled by Default ✅
**File:** `src/components/features/CookieConsent.tsx`
- Default `marketing` state changed from `false` to `true` (line 19)
- When users open settings, marketing is pre-checked
- Users can still opt-out if they prefer

### 2. Consent Integration with Pixel Tracking ✅
**File:** `src/components/tracking/PixelTracker.tsx`
- Added `hasMarketingConsent()` function to check consent status
- Pixel initialization is **blocked** for EU users without consent
- Event tracking is **blocked** for EU users without consent
- Listens for consent changes and auto-initializes pixels when granted

### 3. Fixed Marketing Cookie Classification ✅
**File:** `src/utils/marketing-cookies.ts`
- Fixed bug where `fbclid` was incorrectly treated as `campaign_id`
- `fbclid` is now properly handled as a Facebook Click ID (for attribution only)
- Added support for `utm_campaign`, `utm_adset`, `utm_ad` parameters
- Sets `medium: 'facebook'` when `fbclid` is present

## EU Country Configuration

Currently, the following countries are marked as EU:
- **Croatia (hr)** - `isEU: true`

Non-EU countries (no consent banner):
- **Serbia (rs)** - `isEU: false`
- **Bosnia (ba)** - `isEU: false`

### To Add More EU Countries:
Edit `src/config/countries.ts` and set `isEU: true`:

```typescript
export const COUNTRIES: Record<string, CountryConfig> = {
  'country-code': {
    // ... other config
    isEU: true,  // ✅ Set this to true for EU countries
  }
};
```

## How It Works

### For Non-EU Users (e.g., Serbia, Bosnia):
1. ✅ No consent banner appears
2. ✅ All tracking is enabled immediately
3. ✅ Full pixel functionality from page load

### For EU Users (e.g., Croatia):
1. ⚠️ Consent banner appears on first visit
2. ✅ Marketing checkbox is **pre-checked** (enabled by default)
3. ✅ User can accept all, accept necessary only, or customize settings
4. ✅ Pixels initialize **immediately** when consent is granted
5. ✅ Consent is saved in `localStorage` for 30 days

## Testing GDPR Consent for EU

### Option 1: Test with Croatia (hr)
1. Navigate to the Croatian version of the site:
   ```
   http://localhost:3000/hr
   or
   http://localhost:3000/hr/checkouts/[product-slug]
   ```

2. **First Visit** (no consent yet):
   - ⚠️ Consent banner should appear
   - ✅ Marketing cookies checkbox is **pre-checked**
   - ❌ Pixel tracking is **blocked** until consent given

3. **Click "Accept All"**:
   - ✅ Banner closes
   - ✅ `cookie-consent` saved in localStorage
   - ✅ Pixels initialize automatically
   - ✅ All tracking events fire

4. **Test Opt-Out**:
   - Clear localStorage: `localStorage.clear()`
   - Refresh page
   - Click "Cookie Settings"
   - Uncheck "Marketing Cookies"
   - Click "Save Preferences"
   - ✅ Tracking should be blocked

### Option 2: Temporarily Mark Serbia as EU (for testing)
```typescript
// src/config/countries.ts
export const COUNTRIES: Record<string, CountryConfig> = {
  rs: {
    // ... other config
    isEU: true, // ✅ Temporarily set to true for testing
  }
};
```

Then test on `http://localhost:3000/rs`

**⚠️ Remember to set it back to `false` after testing!**

### Option 3: Use Browser DevTools
1. Open DevTools → Application → Local Storage
2. Check for `cookie-consent` key
3. Manually edit/delete to simulate different states

## Verifying Consent Works

### Check Console (in development):
```javascript
// The commented logs can be temporarily uncommented for debugging:
// - "⚠️ Marketing consent not granted - skipping..."
// - "✅ Meta Pixel initialized with ID: ..."
```

### Check Meta Events Manager:
1. Go to Meta Events Manager
2. Test Events → Use your test event code
3. Verify events appear **only after** consent is granted

### Check localStorage:
```javascript
// In browser console:
localStorage.getItem('cookie-consent')
// Should return: {"necessary":true,"marketing":true}
```

### Check Cookies:
Look for these cookies after consent:
- `marketing-params` - Marketing attribution data
- `_fbp` - Facebook Browser ID
- `_fbc` - Facebook Click ID (if `fbclid` in URL)

## Privacy & Compliance

### What's Tracked:
- ✅ **Necessary cookies**: Always allowed (session, preferences)
- ⚠️ **Marketing cookies**: Require consent for EU users
  - Meta (Facebook) Pixel
  - TikTok Pixel
  - Campaign parameters (campaign_id, adset_id, ad_id, medium)
  - Facebook attribution (_fbp, _fbc)

### GDPR Compliance Features:
- ✅ Consent banner for EU users
- ✅ Clear opt-out mechanism
- ✅ Tracking blocked until consent
- ✅ Cookie details displayed in settings
- ✅ Link to privacy policy
- ✅ Persistent consent storage (30 days)
- ✅ Real-time consent enforcement

## Troubleshooting

### Consent Banner Not Appearing:
- Check if country has `isEU: true` in `src/config/countries.ts`
- Clear localStorage and refresh
- Check browser console for errors

### Pixels Not Firing After Consent:
- Check if `META_CAPI_TOKEN_[COUNTRY]` is set in `.env.local`
- Verify pixel IDs are configured in `src/config/pixels.ts`
- Check browser console for initialization logs
- Verify consent is saved: `localStorage.getItem('cookie-consent')`

### Marketing Cookies Not Blocking:
- Ensure `isEU: true` for the country
- Clear localStorage before testing
- Check `hasMarketingConsent()` function logic

## Related Files

### Core Implementation:
- `src/components/features/CookieConsent.tsx` - Consent UI
- `src/components/tracking/PixelTracker.tsx` - Pixel initialization & tracking
- `src/utils/marketing-cookies.ts` - Marketing parameter handling
- `src/config/countries.ts` - Country EU status

### Translation Files:
- `src/messages/hr.json` - Croatian translations
- `src/messages/rs.json` - Serbian translations
- `src/messages/ba.json` - Bosnian translations

Under the `gdpr` key in each translation file.

## Best Practices

1. **Always test EU consent** before deploying to production
2. **Keep privacy policy up to date** with tracked data
3. **Monitor Meta Events Manager** for proper deduplication
4. **Clear localStorage** when testing different consent states
5. **Document any new tracking** in the consent UI

## Support

For issues or questions about GDPR consent:
1. Check this documentation first
2. Review browser console for errors
3. Test in incognito mode to simulate first visit
4. Verify country configuration and environment variables

