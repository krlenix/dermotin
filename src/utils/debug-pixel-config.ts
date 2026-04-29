/**
 * Debug utility to check pixel configuration
 * Use this in the browser console to troubleshoot pixel issues
 */

/**
 * Log the current pixel configuration for debugging
 * Call this from browser console: debugPixelConfig()
 */
export function debugPixelConfig() {
  if (typeof window === 'undefined') {
    console.log('❌ This function must be called from browser console');
    return;
  }

  console.group('🔍 Pixel Configuration Debug');
  
  // Check domain
  const hostname = window.location.hostname;
  console.log('📍 Current domain:', hostname);
  
  // Simple country-based configuration (no domain-specific logic)
  console.log('\n📋 Configuration Type: Country-based only');
  const globalGoogleTag = process.env.NEXT_PUBLIC_GOOGLE_TAG;
  console.log('  NEXT_PUBLIC_GOOGLE_TAG:', globalGoogleTag || '❌ Not set');
  
  // Check RS (Serbia)
  console.log('\n🇷🇸 Serbia (RS) Configuration:');
  const rsPixel = process.env.NEXT_PUBLIC_META_PIXEL_RS;
  const rsGoogleTag = process.env.NEXT_PUBLIC_GOOGLE_TAG_RS;
  console.log('  NEXT_PUBLIC_META_PIXEL_RS:', rsPixel || '❌ Not set');
  console.log('  NEXT_PUBLIC_GOOGLE_TAG_RS:', rsGoogleTag || '❌ Not set');
  console.log('  ✅ Using:', rsPixel || rsGoogleTag || globalGoogleTag || '❌ None found');
  
  // Check BA (Bosnia)
  console.log('\n🇧🇦 Bosnia (BA) Configuration:');
  const baPixel = process.env.NEXT_PUBLIC_META_PIXEL_BA;
  const baGoogleTag = process.env.NEXT_PUBLIC_GOOGLE_TAG_BA;
  console.log('  NEXT_PUBLIC_META_PIXEL_BA:', baPixel || '❌ Not set');
  console.log('  NEXT_PUBLIC_GOOGLE_TAG_BA:', baGoogleTag || '❌ Not set');
  console.log('  ✅ Using:', baPixel || baGoogleTag || globalGoogleTag || '❌ None found');
  
  // Check if Meta Pixel is loaded
  console.log('\n📡 Meta Pixel Status:');
  if (typeof window.fbq !== 'undefined') {
    console.log('  ✅ Meta Pixel (fbq) is loaded');
    console.log('  Pixel queue length:', window.fbq.queue?.length || 0);
  } else {
    console.log('  ❌ Meta Pixel (fbq) is NOT loaded');
  }

  // Check if Google tag is loaded
  console.log('\n📡 Google Tag Status:');
  if (typeof window.gtag !== 'undefined') {
    console.log('  ✅ Google tag (gtag) is loaded');
    console.log('  Data layer length:', window.dataLayer?.length || 0);
  } else {
    console.log('  ❌ Google tag (gtag) is NOT loaded');
  }
  
  // Check cookies
  console.log('\n🍪 Facebook Cookies:');
  const fbp = document.cookie.match(/_fbp=([^;]+)/)?.[1];
  const fbc = document.cookie.match(/_fbc=([^;]+)/)?.[1];
  console.log('  _fbp:', fbp || '❌ Not set');
  console.log('  _fbc:', fbc || '❌ Not set');
  
  // Check URL parameters
  console.log('\n🔗 URL Parameters:');
  const urlParams = new URLSearchParams(window.location.search);
  const fbclid = urlParams.get('fbclid');
  console.log('  fbclid:', fbclid || '❌ Not in URL');
  
  console.groupEnd();
  
  // Summary
  console.log('\n📊 Summary:');
  const pixelConfigured = !!(rsPixel || baPixel || rsGoogleTag || baGoogleTag || globalGoogleTag);
  const pixelLoaded = typeof window.fbq !== 'undefined' || typeof window.gtag !== 'undefined';
  
  if (pixelConfigured && pixelLoaded) {
    console.log('✅ Pixel is configured and loaded correctly');
  } else if (pixelConfigured && !pixelLoaded) {
    console.log('⚠️ Pixel is configured but NOT loaded - check PixelTracker component');
  } else if (!pixelConfigured && pixelLoaded) {
    console.log('⚠️ Pixel is loaded but NOT configured - check environment variables');
  } else {
    console.log('❌ Pixel is NOT configured and NOT loaded');
    console.log('   1. Check your .env.local file');
    console.log('   2. Restart your development server');
    console.log('   3. Make sure you have: NEXT_PUBLIC_META_PIXEL_RS or NEXT_PUBLIC_GOOGLE_TAG');
  }
}

// Make it available globally in browser
if (typeof window !== 'undefined') {
  (window as unknown as { debugPixelConfig: () => void }).debugPixelConfig = debugPixelConfig;
  console.log('✅ Debug utility loaded! Run debugPixelConfig() in console to troubleshoot.');
}

