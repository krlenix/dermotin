import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

const locales = ['rs', 'ba']; // Serbia and Bosnia only

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,
  
  // Used when no locale matches
  defaultLocale: 'rs',
  
  // Always show locale prefix in URL
  localePrefix: 'always'
});

export default function middleware(request: NextRequest) {
  // Add performance headers
  const response = intlMiddleware(request);
  
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
    '/(rs|ba)/:path*',
    
    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/rs/pathnames`)
    // But exclude API routes, static files, and Next.js internals
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
