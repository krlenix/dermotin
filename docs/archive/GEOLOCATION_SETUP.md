# Vercel Geolocation Integration

This document explains how to use Vercel's geolocation features in your DERMOTIN application.

## Overview

The geolocation system uses Vercel's Edge Network to automatically detect user location based on IP addresses. This enables:

- Automatic locale detection and routing
- Country-specific content personalization
- Regional feature availability
- Enhanced user experience through location-aware functionality

## Features Implemented

### 1. API Routes

#### `/api/geo-detect`
Basic geolocation detection endpoint that returns:
- Country code, region, and city
- Detected locale for the application
- Support status for the detected region
- IP address and timestamp

#### `/api/geolocation`
Extended geolocation endpoint with additional features:
- All basic geolocation data
- Country names and timezone information
- Vercel Edge Network region details
- Debug headers for development
- CORS support for external requests

### 2. React Hooks

#### `useGeolocation()`
Main hook for accessing geolocation data:
```typescript
const { data, loading, error, refetch } = useGeolocation();
```

#### `useDetectedLocale()`
Simplified hook for getting just the detected locale:
```typescript
const { locale, loading, error } = useDetectedLocale();
```

#### `useIsSupportedCountry()`
Hook for checking if user is in a supported region:
```typescript
const { isSupported, country, loading } = useIsSupportedCountry();
```

#### Enhanced `useCountry()`
Updated to support geolocation-based country detection:
```typescript
const countryData = useCountry('rs', true); // Enable geolocation
```

### 3. Middleware Integration

The middleware now includes:
- Automatic geolocation-based routing for root path visits
- Country detection headers added to all responses
- Fallback to default locale if geolocation fails

### 4. Components

#### `GeolocationDemo`
A comprehensive demo component showing all geolocation features:
- Real-time location display
- Technical details and debug information
- Application integration status
- Refresh functionality

## Usage Examples

### Basic Geolocation Detection

```typescript
'use client';

import { useGeolocation } from '@/hooks/useGeolocation';

export function LocationAwareComponent() {
  const { data, loading } = useGeolocation();
  
  if (loading) return <div>Detecting location...</div>;
  
  return (
    <div>
      <h2>Welcome from {data?.city || 'Unknown'}, {data?.country || 'Unknown'}!</h2>
      <p>Detected locale: {data?.detectedLocale}</p>
    </div>
  );
}
```

### Country-Specific Content

```typescript
'use client';

import { useIsSupportedCountry } from '@/hooks/useGeolocation';

export function RegionalContent() {
  const { isSupported, country } = useIsSupportedCountry();
  
  return (
    <div>
      {isSupported ? (
        <div>
          <h2>Welcome! We deliver to {country}</h2>
          <button>Shop Now</button>
        </div>
      ) : (
        <div>
          <h2>International Shipping Available</h2>
          <p>We're expanding to your region soon!</p>
        </div>
      )}
    </div>
  );
}
```

### Automatic Locale Detection

```typescript
'use client';

import { useCountry } from '@/hooks/useCountry';

export function LocalizedComponent() {
  // Enable geolocation-based country detection
  const { countryCode, isGeoDetected, geoLoading } = useCountry('rs', true);
  
  return (
    <div>
      <p>Current locale: {countryCode}</p>
      {isGeoDetected && (
        <small>✓ Automatically detected from your location</small>
      )}
      {geoLoading && <small>Detecting location...</small>}
    </div>
  );
}
```

## Supported Countries

The system currently supports the following countries with automatic locale mapping:

| Country | Code | Locale | Notes |
|---------|------|--------|-------|
| Serbia | RS | rs | Primary market |
| Bosnia and Herzegovina | BA | ba | Primary market |
| Montenegro | ME | rs | Uses Serbian locale |
| Croatia | HR | rs | Uses Serbian locale |
| North Macedonia | MK | rs | Uses Serbian locale |
| Slovenia | SI | rs | Uses Serbian locale |
| Albania | AL | rs | Uses Serbian locale |

## Configuration

### Environment Variables

No additional environment variables are required. The system uses Vercel's built-in geolocation headers.

### Middleware Configuration

The middleware is configured to:
- Redirect root path visits to detected locale
- Add geolocation headers to all responses
- Fallback gracefully if geolocation fails

### Edge Runtime

All geolocation API routes use the Edge Runtime for optimal performance:
```typescript
export const runtime = 'edge';
```

## Testing

### Local Development

Geolocation headers are not available in local development. To test:

1. Deploy to Vercel (preview or production)
2. Visit the deployed URL
3. Check the `/geolocation-test` page for full functionality

### Test Page

Visit `/geolocation-test` to see a comprehensive demo of all geolocation features.

### API Testing

Test the API endpoints directly:
```bash
# Basic geolocation
curl https://your-domain.com/api/geo-detect

# Extended geolocation
curl https://your-domain.com/api/geolocation
```

## Error Handling

The system includes comprehensive error handling:

- **API Routes**: Return fallback data with error messages
- **Hooks**: Provide error states and retry functionality
- **Middleware**: Continues normal operation if geolocation fails
- **Components**: Show loading states and error messages

## Performance Considerations

- All geolocation API routes use Edge Runtime for minimal latency
- Responses include appropriate cache headers
- Middleware adds minimal overhead to requests
- Client-side hooks include loading states for better UX

## Security

- IP addresses are handled securely and not logged permanently
- Geolocation data is not stored server-side
- CORS headers are configured for API routes
- No sensitive location data is exposed to client-side

## Troubleshooting

### Common Issues

1. **No geolocation data in development**
   - Solution: Deploy to Vercel to test geolocation features

2. **Incorrect locale detection**
   - Check if country is in supported list
   - Verify middleware configuration
   - Test with different IP addresses

3. **API routes returning errors**
   - Ensure `@vercel/functions` is installed
   - Check Edge Runtime configuration
   - Verify import statements

### Debug Information

Enable debug mode by:
1. Setting `NODE_ENV=development`
2. Checking browser console for geolocation logs
3. Using the debug section in `GeolocationDemo` component
4. Inspecting response headers for geolocation data

## Future Enhancements

Potential improvements:
- Add more supported countries
- Implement user preference storage
- Add geolocation-based pricing
- Include weather-based content personalization
- Add analytics for geolocation usage

## References

- [Vercel Geolocation Documentation](https://vercel.com/docs/functions/edge-functions/geolocation)
- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [@vercel/functions Package](https://www.npmjs.com/package/@vercel/functions)
