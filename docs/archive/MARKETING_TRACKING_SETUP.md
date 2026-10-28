# Marketing Parameter Tracking Setup

This document describes the marketing parameter tracking system that captures campaign data from URL parameters, stores them in cookies, and includes them in order webhooks.

## Overview

The system tracks the following marketing parameters:
- `campaign_id` - Campaign identifier (Facebook/Meta ads, Google Ads, etc.)
- `adset_id` - Ad set identifier
- `ad_id` - Individual ad identifier
- `aff_id` - Affiliate identifier
- `medium` - Traffic source/medium (facebook, google, email, etc.)

## How It Works

1. **URL Parameter Capture**: When users visit with marketing parameters in the URL, they are automatically captured
2. **Cookie Storage**: Parameters are stored in cookies for 30 days
3. **Override Behavior**: New parameters override existing ones
4. **API Integration**: When orders are placed, marketing data is included in webhook payloads

## URL Parameter Mapping

The system recognizes these URL parameters:

| Parameter | Maps To | Alternative Names |
|-----------|---------|-------------------|
| `campaign_id` | campaign_id | `utm_campaign`, `campaign` |
| `adset_id` | adset_id | `utm_adset` |
| `ad_id` | ad_id | `utm_ad` |
| `aff_id` | aff_id | `affiliate_id` |
| `utm_medium` | medium | `medium`, `source`, `utm_source` |

## Example URLs

```
# Facebook/Meta Ads
https://dermotin.com/rs/checkouts/fungel/?campaign_id=123456&adset_id=789&ad_id=101112&utm_medium=facebook

# Google Ads
https://dermotin.com/rs/checkouts/fungel/?campaign_id=google_123&utm_medium=google&utm_source=search

# Affiliate Campaign
https://dermotin.com/rs/checkouts/fungel/?campaign_id=aff_promo&aff_id=affiliate123&medium=affiliate

# Email Campaign
https://dermotin.com/rs/checkouts/fungel/?campaign_id=newsletter_2024&medium=email

# Organic with override
https://dermotin.com/rs/checkouts/fungel/?medium=organic
```

## Cookie Details

- **Cookie Name**: `marketing-params`
- **Expiry**: 30 days
- **Path**: `/` (site-wide)
- **SameSite**: `Lax`
- **Format**: JSON encoded

Example cookie value:
```json
{
  "campaign_id": "123456",
  "adset_id": "789", 
  "ad_id": "101112",
  "aff_id": "affiliate123",
  "medium": "facebook"
}
```

## API Integration

Marketing parameters are automatically included in order webhook payloads:

```json
{
  "order_id": "WEB-1234567890-abc123",
  "marketing": {
    "campaign_id": "123456",
    "adset_id": "789",
    "ad_id": "101112",
    "aff_id": "affiliate123",
    "medium": "facebook"
  }
}
```

## Development & Testing

### Debug Component

In development mode, a debug component is available that shows:
- Current marketing parameters
- Cookie status
- Test URLs
- Clear cookies functionality

### Testing Flow

1. Visit a product page with marketing parameters:
   ```
   http://localhost:3000/rs/checkouts/fungel/?campaign_id=test123&aff_id=aff001&medium=facebook
   ```

2. Check the debug component (bottom-right corner in development)

3. Place a test order and verify the webhook payload includes marketing data

4. Test parameter override by visiting with new parameters:
   ```
   http://localhost:3000/rs/checkouts/fungel/?campaign_id=new456&aff_id=aff002&medium=google
   ```

### Manual Testing

```javascript
// Check current marketing cookies (browser console)
document.cookie.split(';').find(c => c.includes('marketing-params'))

// Clear marketing cookies
document.cookie = 'marketing-params=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
```

## Implementation Files

- `src/utils/marketing-cookies.ts` - Cookie management utilities
- `src/hooks/useMarketingTracking.ts` - React hook for parameter capture
- `src/app/api/orders/route.ts` - API integration
- `src/components/features/MarketingDebug.tsx` - Debug component
- `src/components/AdvancedLandingPage.tsx` - Landing page integration
- `src/components/LandingPage.tsx` - Simple landing page integration

## GDPR Compliance

Marketing parameters are only stored when users consent to marketing cookies through the GDPR cookie consent banner. The system respects user privacy preferences.

## Troubleshooting

### Parameters Not Captured
- Check if JavaScript is enabled
- Verify URL parameters are correctly formatted
- Check browser console for errors

### Cookies Not Set
- Ensure the domain allows cookies
- Check for GDPR consent (EU users)
- Verify no ad blockers are interfering

### API Not Receiving Data
- Check server-side cookie parsing
- Verify webhook payload structure
- Check API logs for marketing parameter data

## Future Enhancements

- Support for additional UTM parameters
- Integration with Google Analytics
- Custom parameter mapping
- Advanced attribution models
- Real-time parameter validation
