import { geolocation, ipAddress } from '@vercel/functions';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    // Get geolocation data from Vercel headers
    const geo = geolocation(request);
    const ip = ipAddress(request);
    
    // Map Vercel country codes to our supported locales
    const countryToLocale: Record<string, string> = {
      'RS': 'rs', // Serbia
      'BA': 'ba', // Bosnia and Herzegovina
      'ME': 'me', // Montenegro
      'HR': 'hr', // Croatia
      'MK': 'rs', // North Macedonia (use Serbian locale)
      'SI': 'rs', // Slovenia (use Serbian locale)
      'AL': 'rs', // Albania (use Serbian locale)
    };

    // Default to Serbian if country not detected or not in our supported list
    const detectedLocale = geo.country ? countryToLocale[geo.country] || 'rs' : 'rs';
    
    // Log for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('🌍 Geo-detect API - Detected location:', {
        country: geo.country,
        city: geo.city,
        region: geo.countryRegion,
        detectedLocale,
        ip
      });
    }

    // Prepare response data
    const responseData = {
      // Geolocation data
      country: geo.country || null,
      countryRegion: geo.countryRegion || null,
      city: geo.city || null,
      latitude: geo.latitude || null,
      longitude: geo.longitude || null,
      region: geo.region || null, // Vercel Edge Network region
      
      // IP address
      ip: ip || null,
      
      // Our application-specific data
      detectedLocale,
      isSupported: geo.country ? Object.keys(countryToLocale).includes(geo.country) : false,
      
      // Additional metadata
      timestamp: new Date().toISOString(),
      
      // Development note
      isDevelopment: !geo.country,
    };

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Geolocation detection error:', error);
    
    // Return fallback data
    return NextResponse.json({
      country: null,
      countryRegion: null,
      city: null,
      latitude: null,
      longitude: null,
      region: null,
      ip: null,
      detectedLocale: 'rs', // Default to Serbian
      isSupported: false,
      timestamp: new Date().toISOString(),
      error: 'Failed to detect geolocation',
    }, {
      status: 200, // Still return 200 to avoid breaking the app
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  }
}

// Also support POST for more complex geolocation requests
export async function POST(request: NextRequest) {
  return GET(request);
}
