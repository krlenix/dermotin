'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { getPixelConfig, META_EVENTS, TIKTOK_EVENTS } from '@/config/pixels';

interface PixelTrackerProps {
  countryCode: string;
}

// Declare global types for pixel functions
declare global {
  interface Window {
    fbq: any;
    ttq: any;
  }
}

/**
 * PixelTracker component that loads Meta and TikTok pixels based on country configuration
 */
export function PixelTracker({ countryCode }: PixelTrackerProps) {
  const pixelConfig = getPixelConfig(countryCode);

  useEffect(() => {
    // Initialize Meta Pixel
    if (pixelConfig.meta.enabled && pixelConfig.meta.pixelId !== 'YOUR_META_PIXEL_ID_RS') {
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('init', pixelConfig.meta.pixelId);
        window.fbq('track', META_EVENTS.PAGE_VIEW);
      }
    }

    // Initialize TikTok Pixel
    if (pixelConfig.tiktok.enabled && pixelConfig.tiktok.pixelId !== 'YOUR_TIKTOK_PIXEL_ID_RS') {
      if (typeof window !== 'undefined' && window.ttq) {
        window.ttq.load(pixelConfig.tiktok.pixelId);
        window.ttq.page();
      }
    }
  }, [pixelConfig, countryCode]);

  return (
    <>
      {/* Meta Pixel Script */}
      {pixelConfig.meta.enabled && pixelConfig.meta.pixelId !== 'YOUR_META_PIXEL_ID_RS' && (
        <>
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
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
      {pixelConfig.tiktok.enabled && pixelConfig.tiktok.pixelId !== 'YOUR_TIKTOK_PIXEL_ID_RS' && (
        <Script
          id="tiktok-pixel"
          strategy="afterInteractive"
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

/**
 * Hook to track events on both Meta and TikTok pixels
 */
export function usePixelTracking(countryCode: string) {
  const pixelConfig = getPixelConfig(countryCode);

  const trackEvent = (eventType: 'initiate_checkout' | 'purchase' | 'view_content' | 'add_to_cart', eventData?: any) => {
    if (typeof window === 'undefined') return;

    // Track Meta Pixel event
    if (pixelConfig.meta.enabled && window.fbq && pixelConfig.meta.pixelId !== 'YOUR_META_PIXEL_ID_RS') {
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
        default:
          return;
      }

      if (eventData) {
        window.fbq('track', metaEvent, eventData);
      } else {
        window.fbq('track', metaEvent);
      }
    }

    // Track TikTok Pixel event
    if (pixelConfig.tiktok.enabled && window.ttq && pixelConfig.tiktok.pixelId !== 'YOUR_TIKTOK_PIXEL_ID_RS') {
      let tiktokEvent: string;
      
      switch (eventType) {
        case 'initiate_checkout':
          tiktokEvent = TIKTOK_EVENTS.INITIATE_CHECKOUT;
          break;
        case 'purchase':
          tiktokEvent = TIKTOK_EVENTS.PURCHASE;
          break;
        case 'view_content':
          tiktokEvent = TIKTOK_EVENTS.VIEW_CONTENT;
          break;
        case 'add_to_cart':
          tiktokEvent = TIKTOK_EVENTS.ADD_TO_CART;
          break;
        default:
          return;
      }

      if (eventData) {
        window.ttq.track(tiktokEvent, eventData);
      } else {
        window.ttq.track(tiktokEvent);
      }
    }
  };

  return { trackEvent };
}
