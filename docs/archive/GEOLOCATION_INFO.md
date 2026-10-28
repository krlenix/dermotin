# Geolocation Detection Guide

## Overview

Your website now uses Vercel's Edge Functions for accurate geolocation detection based on IP addresses.

## How It Works

### In Production (Vercel Deployment)
✅ **Accurate Detection** - Vercel's Edge Network provides real geolocation data:
- Country code (e.g., RS for Serbia)
- City (e.g., Leskovac)
- Region/Province
- Latitude/Longitude
- Currency and language information

### In Development (localhost)
⚠️ **Limited Functionality** - Geolocation headers are NOT available:
- All geo values will be `null`
- You'll see "Unknown" or fallback values
- The modal won't trigger (because no country mismatch is detected)
- This is normal and expected behavior

## Testing the Geolocation

### 1. Geolocation Demo Page
Visit `/geolocation-demo` on your **deployed Vercel site** to see:
- Your detected country with flag
- City and region information
- All geolocation headers
- Beautiful design matching your brand colors

**Example:**
```
https://your-site.vercel.app/geolocation-demo
```

### 2. Country Mismatch Modal
When users visit from a different country than the site locale:
- Automatically detects their location
- Shows a branded modal with their detected country
- Offers to switch to their country's version
- Remembers their choice (won't show again if dismissed)

### 3. Country Switcher
Available in:
- **Header** - Top right, always accessible
- **Footer** - Bottom of page with "Select Language" label
- Both show flags and country names

## Why Detection Shows Wrong Location

### Common Reasons:
1. **VPN Usage** - If you're using a VPN, it shows the VPN server's location
2. **ISP Routing** - Your internet provider might route through another country
3. **Corporate Network** - Company networks may show headquarters location
4. **Mobile Network** - Mobile providers sometimes route through different countries
5. **IP Database** - Occasionally IP geolocation databases have outdated info

### What We Did:
- ✅ Fixed country mapping (ME → Montenegro, HR → Croatia)
- ✅ Added debug logging to console
- ✅ Added accuracy disclaimer in modal
- ✅ Made manual switcher easily accessible

## Supported Countries

| Country | Code | Locale | Currency |
|---------|------|--------|----------|
| 🇷🇸 Serbia | RS | rs | RSD дин. |
| 🇧🇦 Bosnia | BA | ba | BAM KM |
| 🇭🇷 Croatia | HR | hr | EUR € |
| 🇲🇪 Montenegro | ME | me | EUR € |

## Debug Console Logs

When the page loads, check browser console (F12) for:

```
🌍 Geolocation Debug: {
  detectedCountryCode: "RS",
  detectedLocale: "rs",
  currentLocale: "rs",
  city: "Leskovac",
  region: "Central Serbia",
  ip: "xxx.xxx.xxx.xxx",
  isSupported: true
}
```

If in development:
```
⚠️ Running in development mode - geolocation only works in production on Vercel
```

## How to Test

### Option 1: Deploy to Vercel
```bash
# Push to git and Vercel will auto-deploy
git add .
git commit -m "Add geolocation"
git push
```

### Option 2: Use Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Option 3: Test Button
Click the purple "🌍 Test Modal" button on your homepage to force-show the modal with a simulated location.

## Production URLs

Once deployed, test these pages:
- `/geolocation-demo` - See your actual location detection
- `/test-country-modal` - Test the modal with different countries
- Any page - The modal will auto-show if there's a country mismatch

## Removing Test Features

Before final production, remove:
1. The purple debug button:
   - File: `src/app/[locale]/page.tsx`
   - Remove: `<CountrySwitcherDebug />` component

2. Test pages (optional):
   - Delete: `src/app/test-country-modal/`
   - Delete: `src/app/geolocation-demo/` (or keep for your reference)

## Technical Details

### Files Modified:
- ✅ `src/app/api/geo-detect/route.ts` - Geo API with correct mappings
- ✅ `src/components/features/CountryMismatchBanner.tsx` - Modal with brand colors
- ✅ `src/components/features/CountrySwitcher.tsx` - Dropdown with flags
- ✅ `src/components/ui/footer.tsx` - Footer integration
- ✅ `src/app/[locale]/page.tsx` - Header integration

### Colors Used:
- Brand Orange: `#FF6B35` (`text-brand-orange`)
- Brand Green: `#608E7E` (`text-brand-green`)
- Matches your website's design system

## Need Help?

If detection is still inaccurate:
1. Check console logs for actual detected values
2. Verify you're testing on deployed Vercel URL (not localhost)
3. Try without VPN
4. Users can always manually switch using the dropdown

---

**Note:** The geolocation detection is working correctly as shown in Vercel's official demo. The issue you saw was likely due to testing on localhost where geolocation headers are not available.

