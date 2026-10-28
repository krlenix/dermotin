'use client';

import { useEffect } from 'react';

/**
 * Preusmerenje koje čuva query string (utm_*, fbclid, coupon_code…) i radi i na
 * statički generisanim stranicama. Koristi se za proizvode koji se više ne prodaju
 * pojedinačno (npr. BIOROID → BIOROID SET), da stari oglasi i linkovi i dalje prodaju.
 */
export function ClientRedirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.replace(`${to}${window.location.search}${window.location.hash}`);
  }, [to]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper">
      <a href={to} className="text-sm font-semibold text-green underline">
        {to}
      </a>
      <noscript>
        <meta httpEquiv="refresh" content={`0;url=${to}`} />
      </noscript>
    </div>
  );
}
