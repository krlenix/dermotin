'use client';

import { useEffect } from 'react';
import { initializeFacebookClickId } from '@/utils/facebook-cookies';

/**
 * FacebookCookieInitializer Component
 * 
 * This component should be placed in your root layout to ensure that
 * Facebook Click IDs (fbclid) from URLs are captured and stored as _fbc cookies.
 * 
 * This is critical for:
 * - Proper attribution of Facebook ad clicks
 * - Event deduplication between browser pixel and CAPI
 * - Accurate conversion tracking
 * 
 * The component runs once on mount to check for fbclid in the URL
 * and stores it according to Meta's specification.
 */
export function FacebookCookieInitializer() {
  useEffect(() => {
    // Initialize _fbc cookie if fbclid is present in URL
    // This runs client-side only, as cookies can only be set in the browser
    initializeFacebookClickId();
  }, []);

  // This component doesn't render anything
  return null;
}

