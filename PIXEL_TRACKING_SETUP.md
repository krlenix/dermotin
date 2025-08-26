# Pixel Tracking Setup Guide

This guide explains how to configure and use Meta (Facebook) and TikTok pixel tracking in your application.

## 🎯 Features Implemented

✅ **Meta Pixel Integration** with latest 2024 events  
✅ **TikTok Pixel Integration** with latest 2024 events  
✅ **Country-based Pixel Configuration** - Different pixels per country  
✅ **InitiateCheckout Event** - Triggers when user starts filling COD form  
✅ **Purchase Event** - Triggers on thank you page with order details  
✅ **Easy Configuration** - All pixel IDs in one file  

## 📁 Files Added/Modified

### New Files Created:
- `src/config/pixels.ts` - Pixel configuration by country
- `src/components/tracking/PixelTracker.tsx` - Pixel tracking component and hook
- `PIXEL_TRACKING_SETUP.md` - This documentation

### Modified Files:
- `src/components/AdvancedLandingPage.tsx` - Added pixel tracker
- `src/components/features/CheckoutForm.tsx` - Added InitiateCheckout tracking
- `src/components/ThankYouPage.tsx` - Added Purchase tracking

## 🔧 Configuration

### 1. Update Pixel IDs

Edit `src/config/pixels.ts` and replace placeholder pixel IDs with your actual IDs:

```typescript
export const PIXEL_CONFIG: CountryPixelConfig = {
  // Serbia
  rs: {
    meta: {
      pixelId: 'YOUR_ACTUAL_META_PIXEL_ID_FOR_SERBIA', // ← Replace this
      enabled: true,
    },
    tiktok: {
      pixelId: 'YOUR_ACTUAL_TIKTOK_PIXEL_ID_FOR_SERBIA', // ← Replace this
      enabled: true,
    },
  },
  
  // Add more countries as needed...
};
```

### 2. Enable/Disable Tracking

You can enable or disable tracking per platform and per country:

```typescript
rs: {
  meta: {
    pixelId: 'YOUR_PIXEL_ID',
    enabled: false, // ← Disable Meta tracking for Serbia
  },
  tiktok: {
    pixelId: 'YOUR_PIXEL_ID',
    enabled: true,  // ← Keep TikTok tracking enabled
  },
},
```

## 📊 Events Tracked

### 1. Page View
- **When**: Automatically when pixel loads
- **Where**: All pages with PixelTracker component
- **Meta Event**: `PageView`
- **TikTok Event**: `ViewContent`

### 2. InitiateCheckout
- **When**: User starts filling the checkout form (first input with content)
- **Where**: CheckoutForm component
- **Meta Event**: `InitiateCheckout`
- **TikTok Event**: `InitiateCheckout`
- **Data Sent**:
  ```javascript
  {
    content_name: "Product Name",
    content_category: "Product",
    content_ids: ["product-variant-id"],
    contents: [{
      id: "product-variant-id",
      quantity: 1,
      item_price: 2999
    }],
    currency: "RSD",
    value: 2999,
    num_items: 1
  }
  ```

### 3. Purchase
- **When**: Thank you page loads with order data
- **Where**: ThankYouPage component
- **Meta Event**: `Purchase`
- **TikTok Event**: `CompletePayment`
- **Data Sent**:
  ```javascript
  {
    content_name: "Product Name",
    content_category: "Product",
    content_ids: ["product-variant"],
    contents: [{
      id: "product-variant",
      quantity: 1,
      item_price: 2999
    }],
    currency: "RSD",
    value: 2999,
    order_id: "ORDER_1234567890",
    num_items: 1
  }
  ```

## 🚀 Usage

### Adding Pixel Tracking to New Pages

1. Import the PixelTracker component:
```typescript
import { PixelTracker } from '@/components/tracking/PixelTracker';
```

2. Add it to your page component:
```typescript
export function MyPage({ countryConfig }: { countryConfig: CountryConfig }) {
  return (
    <div>
      <PixelTracker countryCode={countryConfig.code} />
      {/* Your page content */}
    </div>
  );
}
```

### Tracking Custom Events

1. Import the tracking hook:
```typescript
import { usePixelTracking } from '@/components/tracking/PixelTracker';
```

2. Use the hook in your component:
```typescript
export function MyComponent({ countryConfig }: { countryConfig: CountryConfig }) {
  const { trackEvent } = usePixelTracking(countryConfig.code);
  
  const handleCustomAction = () => {
    trackEvent('add_to_cart', {
      content_name: 'Product Name',
      currency: 'RSD',
      value: 2999
    });
  };
  
  return <button onClick={handleCustomAction}>Add to Cart</button>;
}
```

## 🔍 Testing

### 1. Meta Pixel Testing
- Install [Meta Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) Chrome extension
- Visit your pages and check if events are firing
- Look for green checkmarks in the extension

### 2. TikTok Pixel Testing
- Use TikTok Events Manager to verify events
- Check browser console for `ttq` object
- Use TikTok Pixel Helper if available

### 3. Manual Testing
Open browser console and check for:
```javascript
// Meta Pixel
window.fbq // Should be defined
fbq('track', 'PageView') // Test manual event

// TikTok Pixel  
window.ttq // Should be defined
ttq.track('ViewContent') // Test manual event
```

## 🛠 Troubleshooting

### Pixels Not Loading
1. Check if pixel IDs are correctly set in `src/config/pixels.ts`
2. Ensure pixel IDs don't contain placeholder text
3. Verify `enabled: true` for the country/platform
4. Check browser console for JavaScript errors

### Events Not Firing
1. Verify the component has access to `countryConfig.code`
2. Check if `usePixelTracking` hook is properly imported
3. Ensure event data structure matches expected format
4. Test with browser developer tools

### Country-Specific Issues
1. Verify country code matches the keys in `PIXEL_CONFIG`
2. Check if fallback to `default` configuration is working
3. Ensure country configuration is passed correctly to components

## 📝 Event Data Structure

### Meta Pixel Standard Events
- Uses Facebook's Conversions API standard parameters
- Supports `content_ids`, `contents`, `currency`, `value`
- Compatible with Facebook Ads optimization

### TikTok Pixel Events
- Uses TikTok's standard event parameters
- Maps to TikTok's commerce events for optimization
- Supports TikTok Ads conversion tracking

## 🔒 Privacy & GDPR

The pixel tracking system:
- Only loads when pixels are enabled in configuration
- Respects existing cookie consent implementation
- Can be disabled per country for compliance
- Uses standard tracking parameters (no PII in events)

## 📞 Support

For issues with pixel tracking:
1. Check this documentation first
2. Verify configuration in `src/config/pixels.ts`
3. Test with browser developer tools
4. Check platform-specific documentation:
   - [Meta Pixel Documentation](https://developers.facebook.com/docs/facebook-pixel)
   - [TikTok Pixel Documentation](https://ads.tiktok.com/help/article/standard-events-parameters)
