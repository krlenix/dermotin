import createMiddleware from 'next-intl/middleware';

const locales = ['rs', 'bg']; // Ready for: 'ba', 'me', 'eu'

export default createMiddleware({
  // A list of all locales that are supported
  locales,
  
  // Used when no locale matches
  defaultLocale: 'rs',
  
  // Always show locale prefix in URL
  localePrefix: 'always'
});

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',
    
    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(rs|bg|ba|me|eu)/:path*',
    
    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/rs/pathnames`)
    // But exclude API routes, static files, and Next.js internals
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
