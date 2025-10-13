import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { geolocation } from '@vercel/functions';

const locales = ['rs', 'ba', 'hr', 'me']; // Serbia, Bosnia, Croatia, and Montenegro

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,
  
  // Used when no locale matches
  defaultLocale: 'rs',
  
  // Always show locale prefix in URL
  localePrefix: 'always'
});

// Country to locale mapping for geolocation-based routing
const countryToLocale: Record<string, string> = {
  'RS': 'rs', // Serbia
  'BA': 'ba', // Bosnia and Herzegovina
  'HR': 'hr', // Croatia
  'ME': 'me', // Montenegro
  'MK': 'rs', // North Macedonia (use Serbian locale)
  'SI': 'rs', // Slovenia (use Serbian locale)
  'AL': 'rs', // Albania (use Serbian locale)
};

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for API routes, static files, and Next.js internals
  if (pathname.startsWith('/api') || 
      pathname.startsWith('/_next') || 
      pathname.startsWith('/_vercel') ||
      pathname.includes('.')) {
    return NextResponse.next();
  }

  // Handle geolocation-based routing for root path
  if (pathname === '/') {
    try {
      const geo = geolocation(request);
      const detectedLocale = geo.country ? countryToLocale[geo.country] : null;
      
      // If we detect a supported country, redirect to that locale
      if (detectedLocale && locales.includes(detectedLocale)) {
        const url = request.nextUrl.clone();
        url.pathname = `/${detectedLocale}`;
        
        // Add a header to indicate this was a geo-redirect
        const response = NextResponse.redirect(url);
        response.headers.set('X-Geo-Redirect', 'true');
        response.headers.set('X-Detected-Country', geo.country || 'unknown');
        response.headers.set('X-Detected-Locale', detectedLocale);
        
        return response;
      }
    } catch (error) {
      // If geolocation fails, continue with normal middleware
      console.warn('Geolocation middleware error:', error);
    }
  }

  // Continue with normal internationalization middleware
  const response = intlMiddleware(request);
  
  // Add geolocation headers to all responses for debugging
  try {
    const geo = geolocation(request);
    if (geo.country) {
      response.headers.set('X-User-Country', geo.country);
      response.headers.set('X-User-City', geo.city || 'unknown');
      response.headers.set('X-User-Region', geo.region || 'unknown');
    }
  } catch {
    // Silently fail if geolocation is not available
  }
  
  // Add security and performance headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Add caching headers for static assets
  if (request.nextUrl.pathname.startsWith('/images/') || 
      request.nextUrl.pathname.startsWith('/_next/static/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',
    
    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(rs|ba|hr|me)/:path*',
    
    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/rs/pathnames`)
    // But exclude API routes, static files, and Next.js internals
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
