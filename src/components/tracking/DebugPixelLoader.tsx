'use client';

import { useEffect } from 'react';
import { debugPixelConfig } from '@/utils/debug-pixel-config';

/**
 * Client component to load the debug pixel utility
 * Makes debugPixelConfig() available in browser console
 */
export function DebugPixelLoader() {
  useEffect(() => {
    // Make debug function available globally
    if (typeof window !== 'undefined') {
      (window as unknown as { debugPixelConfig: () => void }).debugPixelConfig = debugPixelConfig;
      
      // Log to console so users know it's available
      console.log('%c🔍 Pixel Debug Utility Loaded!', 'color: #22c55e; font-weight: bold; font-size: 14px;');
      console.log('%cRun debugPixelConfig() in console to troubleshoot pixel configuration', 'color: #6b7280; font-size: 12px;');
    }
  }, []);

  return null;
}

