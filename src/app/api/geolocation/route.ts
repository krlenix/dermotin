import { geolocation, ipAddress } from '@vercel/functions';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// Extended geolocation data with more details
interface ExtendedGeolocationData {
  // Basic geolocation
  country: string | null;
  countryRegion: string | null;
  city: string | null;
  latitude: string | null;
  longitude: string | null;
  region: string | null;
  ip: string | null;
  
  // Application-specific
  detectedLocale: string;
  isSupported: boolean;
  supportedCountries: string[];
  
  // Enhanced data
  countryName: string | null;
  regionName: string | null;
  timezone: string | null;
  
  // Headers for debugging
  headers: {
    'x-vercel-ip-country'?: string;
    'x-vercel-ip-country-region'?: string;
    'x-vercel-ip-city'?: string;
  };
  
  // Metadata
  timestamp: string;
  error?: string;
}

export async function GET(request: NextRequest) {
  try {
    // Get geolocation data from Vercel headers
    const geo = geolocation(request);
    const ip = ipAddress(request);
    
    // Country mapping with names
    const countryMapping: Record<string, { locale: string; name: string; timezone?: string }> = {
      'RS': { locale: 'rs', name: 'Serbia', timezone: 'Europe/Belgrade' },
      'BA': { locale: 'ba', name: 'Bosnia and Herzegovina', timezone: 'Europe/Sarajevo' },
      'ME': { locale: 'rs', name: 'Montenegro', timezone: 'Europe/Podgorica' },
      'HR': { locale: 'rs', name: 'Croatia', timezone: 'Europe/Zagreb' },
      'MK': { locale: 'rs', name: 'North Macedonia', timezone: 'Europe/Skopje' },
      'SI': { locale: 'rs', name: 'Slovenia', timezone: 'Europe/Ljubljana' },
      'AL': { locale: 'rs', name: 'Albania', timezone: 'Europe/Tirane' },
    };

    // Get country info
    const countryInfo = geo.country ? countryMapping[geo.country] : null;
    const detectedLocale = countryInfo?.locale || 'rs';
    const isSupported = geo.country ? Object.keys(countryMapping).includes(geo.country) : false;
    
    // Get region name mapping (simplified)
    const regionNames: Record<string, string> = {
      'arn1': 'Europe (Stockholm)',
      'cdg1': 'Europe (Paris)',
      'fra1': 'Europe (Frankfurt)',
      'lhr1': 'Europe (London)',
      'iad1': 'US East (Virginia)',
      'sfo1': 'US West (San Francisco)',
    };

    // Extract headers for debugging
    const headers = {
      'x-vercel-ip-country': request.headers.get('x-vercel-ip-country') || undefined,
      'x-vercel-ip-country-region': request.headers.get('x-vercel-ip-country-region') || undefined,
      'x-vercel-ip-city': request.headers.get('x-vercel-ip-city') || undefined,
    };
    
    // Prepare extended response data
    const responseData: ExtendedGeolocationData = {
      // Basic geolocation data
      country: geo.country || null,
      countryRegion: geo.countryRegion || null,
      city: geo.city || null,
      latitude: geo.latitude || null,
      longitude: geo.longitude || null,
      region: geo.region || null,
      ip: ip || null,
      
      // Application-specific data
      detectedLocale,
      isSupported,
      supportedCountries: Object.keys(countryMapping),
      
      // Enhanced data
      countryName: countryInfo?.name || null,
      regionName: geo.region ? regionNames[geo.region] || geo.region : null,
      timezone: countryInfo?.timezone || null,
      
      // Headers for debugging
      headers,
      
      // Metadata
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Extended geolocation detection error:', error);
    
    // Return fallback data
    const fallbackData: ExtendedGeolocationData = {
      country: null,
      countryRegion: null,
      city: null,
      latitude: null,
      longitude: null,
      region: null,
      ip: null,
      detectedLocale: 'rs',
      isSupported: false,
      supportedCountries: ['RS', 'BA', 'ME', 'HR', 'MK', 'SI', 'AL'],
      countryName: null,
      regionName: null,
      timezone: null,
      headers: {},
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Failed to detect geolocation',
    };

    return NextResponse.json(fallbackData, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// Also support POST
export async function POST(request: NextRequest) {
  return GET(request);
}
