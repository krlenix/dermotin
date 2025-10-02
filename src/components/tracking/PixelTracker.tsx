'use client';

import { useEffect, useState, useRef } from 'react';
import Script from 'next/script';
import { getPixelConfig, META_EVENTS, TIKTOK_EVENTS } from '@/config/pixels';
import { initializeFacebookTracking } from '@/utils/facebook-cookies';
import { COUNTRIES } from '@/config/countries';

interface PixelTrackerProps {
  countryCode: string;
}

// Helper function to check if marketing cookies are allowed
function hasMarketingConsent(countryCode: string): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check if country is in EU
  const country = COUNTRIES[countryCode];
  const isEU = country?.isEU || false;
  
  // If not EU, allow by default
  if (!isEU) return true;
  
  // If EU, check localStorage for consent
  try {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) return false; // No consent given yet
    
    const preferences = JSON.parse(consent);
    return preferences.marketing === true;
  } catch (error) {
    // console.error('Failed to parse cookie consent:', error);
    return false;
  }
}

export function PixelTracker({ countryCode }: PixelTrackerProps) {
  const [isClient, setIsClient] = useState(false);
  const initializedRef = useRef(false);
  const pixelConfig = getPixelConfig(countryCode);

  useEffect(() => {
    setIsClient(true);
    
    // Initialize Facebook tracking as fallback (captures fbclid and creates cookies)
    // This runs even if Meta Pixel is blocked by ad blockers
    if (typeof window !== 'undefined') {
      const fbData = initializeFacebookTracking();
      // console.log('📊 Facebook tracking initialized:', {
      //   hasFbp: !!fbData.fbp,
      //   hasFbc: !!fbData.fbc,
      // });
    }
  }, []);

  useEffect(() => {
    // Only initialize on client side and when pixel config is available
    if (!isClient) return;
    
    let metaInitialized = initializedRef.current;
    let tiktokInitialized = false;
    
    // Initialize Meta Pixel
    const initMetaPixel = () => {
      if (metaInitialized || !pixelConfig.meta.enabled || !pixelConfig.meta.pixelId) return;
      
      // Check for marketing consent
      if (!hasMarketingConsent(countryCode)) {
        // console.log('⚠️ Marketing consent not granted - skipping Meta Pixel initialization');
        return;
      }
      
      if (typeof window !== 'undefined' && window.fbq) {
        // console.log('✅ Meta Pixel (fbq) is loaded! Initializing...');
        window.fbq('init', pixelConfig.meta.pixelId);
        // console.log('✅ Meta Pixel initialized with ID:', pixelConfig.meta.pixelId);
        
        // Generate event ID for PageView
        const pageViewEventId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Track PageView with event ID
        // console.log('📊 Firing browser PageView with event ID:', pageViewEventId);
        window.fbq('track', META_EVENTS.PAGE_VIEW, { eventID: pageViewEventId });
        
        // Always send PageView to CAPI - let the server decide if it's enabled
        // (Browser can't check CAPI config because access tokens are server-only env vars)
        // console.log('🚀 Sending PageView to CAPI...', {
        //   countryCode,
        //   eventId: pageViewEventId,
        // });
        
        fetch('/api/capi', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventType: 'page_view',
            eventData: {},
            countryCode,
            eventId: pageViewEventId,
          }),
          keepalive: true,
        })
        .then(response => response.json())
        .then(data => {
          // console.log('✅ CAPI PageView response:', data);
        })
        .catch((error) => {
          // console.warn('❌ CAPI PageView tracking failed:', error);
        });
        
        metaInitialized = true;
      }
    };
    
    // Initialize TikTok Pixel
    const initTikTokPixel = () => {
      if (tiktokInitialized || !pixelConfig.tiktok.enabled || !pixelConfig.tiktok.pixelId) return;
      
      // Check for marketing consent
      if (!hasMarketingConsent(countryCode)) {
        // console.log('⚠️ Marketing consent not granted - skipping TikTok Pixel initialization');
        return;
      }
      
      if (typeof window !== 'undefined' && window.ttq) {
        window.ttq.load(pixelConfig.tiktok.pixelId);
        window.ttq.page();
        tiktokInitialized = true;
      }
    };
    
    // Event listeners for script load events
    const handleMetaPixelLoaded = () => {
      setTimeout(initMetaPixel, 100); // Small delay to ensure script is fully ready
    };
    
    const handleTikTokPixelLoaded = () => {
      setTimeout(initTikTokPixel, 100); // Small delay to ensure script is fully ready
    };
    
    // Add event listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('metaPixelLoaded', handleMetaPixelLoaded);
      window.addEventListener('tiktokPixelLoaded', handleTikTokPixelLoaded);
    }
    
    // Try immediate initialization (in case scripts are already loaded)
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        // if (window.fbq) {
        //   console.log('✅ Facebook Pixel (fbq) detected in window');
        // } else {
        //   console.warn('⚠️ Facebook Pixel (fbq) NOT found in window - script may not have loaded');
        // }
      }
      initMetaPixel();
      initTikTokPixel();
    }, 500);
    
    // Listen for storage changes (when consent is granted/changed)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cookie-consent' && e.newValue) {
        try {
          const preferences = JSON.parse(e.newValue);
          if (preferences.marketing === true) {
            // Consent granted - reinitialize pixels
            metaInitialized = false;
            tiktokInitialized = false;
            setTimeout(() => {
              initMetaPixel();
              initTikTokPixel();
            }, 100);
          }
        } catch (error) {
          // console.error('Failed to parse consent change:', error);
        }
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      
      // Also listen for a custom event for same-window updates
      const handleConsentChange = () => {
        if (hasMarketingConsent(countryCode)) {
          metaInitialized = false;
          tiktokInitialized = false;
          setTimeout(() => {
            initMetaPixel();
            initTikTokPixel();
          }, 100);
        }
      };
      window.addEventListener('cookieConsentUpdated', handleConsentChange);
    }
    
    // Cleanup function
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('metaPixelLoaded', handleMetaPixelLoaded);
        window.removeEventListener('tiktokPixelLoaded', handleTikTokPixelLoaded);
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('cookieConsentUpdated', handleConsentChange);
      }
    };
  }, [isClient, pixelConfig.meta.enabled, pixelConfig.meta.pixelId, pixelConfig.tiktok.enabled, pixelConfig.tiktok.pixelId, countryCode]);
  
  // Mark as initialized after first render
  useEffect(() => {
    if (isClient) {
      initializedRef.current = true;
    }
  }, [isClient]);

  // Don't render anything on server side to prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  return (
    <>
      {/* Meta Pixel Script */}
      {pixelConfig.meta.enabled && pixelConfig.meta.pixelId && (
        <>
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
            onLoad={() => {
              // Trigger a custom event to notify that the script is ready
              window.dispatchEvent(new CustomEvent('metaPixelLoaded'));
            }}
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
              `,
            }}
          />
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${pixelConfig.meta.pixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {/* TikTok Pixel Script */}
      {pixelConfig.tiktok.enabled && pixelConfig.tiktok.pixelId && (
        <Script
          id="tiktok-pixel"
          strategy="afterInteractive"
          onLoad={() => {
            // Trigger a custom event to notify that the script is ready
            window.dispatchEvent(new CustomEvent('tiktokPixelLoaded'));
          }}
          dangerouslySetInnerHTML={{
            __html: `
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
              }(window, document, 'ttq');
            `,
          }}
        />
      )}
    </>
  );
}

// Hook for tracking events
export function usePixelTracking(countryCode: string) {
  const pixelConfig = getPixelConfig(countryCode);

  const trackEvent = (eventType: 'initiate_checkout' | 'purchase' | 'view_content' | 'add_to_cart' | 'page_view' | 'lead', eventData?: Record<string, unknown>, eventId?: string) => {
    if (typeof window === 'undefined') return;

    // Check for marketing consent
    if (!hasMarketingConsent(countryCode)) {
      // console.log('⚠️ Marketing consent not granted - skipping event tracking:', eventType);
      return;
    }

    // Generate event ID if not provided (for deduplication between browser pixel and CAPI)
    const finalEventId = eventId || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Track Meta Pixel event (Browser-side)
    if (pixelConfig.meta.enabled && window.fbq && pixelConfig.meta.pixelId) {
      let metaEvent: string;
      
      switch (eventType) {
        case 'initiate_checkout':
          metaEvent = META_EVENTS.INITIATE_CHECKOUT;
          break;
        case 'purchase':
          metaEvent = META_EVENTS.PURCHASE;
          break;
        case 'view_content':
          metaEvent = META_EVENTS.VIEW_CONTENT;
          break;
        case 'add_to_cart':
          metaEvent = META_EVENTS.ADD_TO_CART;
          break;
        case 'lead':
          metaEvent = META_EVENTS.LEAD;
          break;
        case 'page_view':
          metaEvent = META_EVENTS.PAGE_VIEW;
          break;
        default:
          metaEvent = META_EVENTS.PAGE_VIEW;
      }
      
      // Prepare event data with event ID for deduplication
      const fullEventData = eventData ? { ...eventData } : {};
      if (finalEventId) {
        fullEventData.eventID = finalEventId; // Meta uses eventID (camelCase) for deduplication
      }
      
      // console.log(`📊 Firing browser ${metaEvent} with event ID:`, finalEventId);
      
      if (Object.keys(fullEventData).length > 0) {
        window.fbq('track', metaEvent, fullEventData);
        // console.log(`✅ Browser ${metaEvent} fired with data:`, fullEventData);
      } else {
        window.fbq('track', metaEvent);
        // console.log(`✅ Browser ${metaEvent} fired (no data)`);
      }
    }

    // Track TikTok Pixel event
    if (pixelConfig.tiktok.enabled && window.ttq && pixelConfig.tiktok.pixelId) {
      let tiktokEvent: string;
      
      switch (eventType) {
        case 'initiate_checkout':
          tiktokEvent = TIKTOK_EVENTS.INITIATE_CHECKOUT;
          break;
        case 'purchase':
          tiktokEvent = TIKTOK_EVENTS.PURCHASE; // This is 'CompletePayment' for TikTok
          break;
        case 'view_content':
          tiktokEvent = TIKTOK_EVENTS.VIEW_CONTENT;
          break;
        case 'add_to_cart':
          tiktokEvent = TIKTOK_EVENTS.ADD_TO_CART;
          break;
        case 'lead':
          tiktokEvent = TIKTOK_EVENTS.LEAD;
          break;
        case 'page_view':
          tiktokEvent = TIKTOK_EVENTS.PAGE_VIEW;
          break;
        default:
          tiktokEvent = TIKTOK_EVENTS.PAGE_VIEW;
      }
      
      if (eventData) {
        window.ttq.track(tiktokEvent, eventData);
      } else {
        window.ttq.track(tiktokEvent);
      }
    }

    // Always send to CAPI (Server-side) - let the server decide if it's enabled
    // (Browser can't check CAPI config because access tokens are server-only env vars)
    // console.log(`🚀 Sending ${eventType} to CAPI...`, {
    //   countryCode,
    //   eventId: finalEventId,
    //   hasData: !!eventData,
    // });
    
    fetch('/api/capi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType,
        eventData: eventData || {},
        countryCode,
        eventId: finalEventId,
      }),
      // Use keepalive to ensure the request completes even if the page is closed
      keepalive: true,
    })
    .then(response => response.json())
    .then(data => {
      // console.log(`✅ CAPI ${eventType} response:`, data);
    })
    .catch((error) => {
      // Silently fail - don't block user experience
      // console.warn(`❌ CAPI ${eventType} tracking failed:`, error);
    });
  };

  return { trackEvent };
}

// Global window interface extensions
interface FacebookPixel {
  (command: 'init', pixelId: string): void;
  (command: 'track', eventName: string, eventData?: Record<string, unknown>): void;
  (command: 'trackCustom', eventName: string, eventData?: Record<string, unknown>): void;
  loaded?: boolean;
  queue?: unknown[];
}

interface TikTokPixel {
  load: (pixelId: string) => void;
  page: () => void;
  track: (eventName: string, eventData?: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    fbq: FacebookPixel;
    ttq: TikTokPixel;
  }
  
  interface WindowEventMap {
    cookieConsentUpdated: CustomEvent;
  }
}