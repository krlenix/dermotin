'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Globe, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useGeolocation } from '@/hooks/useGeolocation';
import { COUNTRIES } from '@/config/countries';
import Image from 'next/image';

// Import all message files
import rsMessages from '@/messages/rs.json';
import hrMessages from '@/messages/hr.json';
import baMessages from '@/messages/ba.json';
import meMessages from '@/messages/me.json';

const messages: Record<string, any> = {
  rs: rsMessages,
  hr: hrMessages,
  ba: baMessages,
  me: meMessages,
};

const DISMISSED_KEY = 'country-mismatch-dismissed';

// Country code mapping (ISO to locale) with fallback logic
const countryToLocale: Record<string, string> = {
  RS: 'rs', // Serbia
  BA: 'ba', // Bosnia and Herzegovina
  HR: 'hr', // Croatia
  ME: 'me', // Montenegro
  // Fallback to closest locale for neighboring countries
  MK: 'rs', // North Macedonia -> Serbian
  SI: 'hr', // Slovenia -> Croatian (closer geographically and linguistically to EU standards)
  AL: 'rs', // Albania -> Serbian
  XK: 'rs', // Kosovo -> Serbian
  BG: 'rs', // Bulgaria -> Serbian
  RO: 'rs', // Romania -> Serbian
  HU: 'hr', // Hungary -> Croatian (EU member)
  AT: 'hr', // Austria -> Croatian (EU member)
  IT: 'hr', // Italy -> Croatian (EU member)
  GR: 'rs', // Greece -> Serbian
};

// Flag code mapping (locale to ISO)
const localeToFlagCode: Record<string, string> = {
  rs: 'RS',
  ba: 'BA',
  hr: 'HR',
  me: 'ME',
};

interface CountryMismatchBannerProps {
  forceShow?: boolean; // For testing purposes
  forcedCountry?: string; // Force a specific country for testing
}

export function CountryMismatchBanner({ forceShow = false, forcedCountry }: CountryMismatchBannerProps = {}) {
  const t = useTranslations('country_mismatch_banner');
  const locale = useLocale();
  const router = useRouter();
  const { data: geoData, loading } = useGeolocation();
  const [isOpen, setIsOpen] = useState(forceShow);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isDevMode] = useState(typeof window !== 'undefined' && window.location.hostname === 'localhost');
  const [showTestModal, setShowTestModal] = useState(false);

  // Log on component mount
  useEffect(() => {
    console.log('🚀 CountryMismatchBanner mounted', {
      isLocalhost: isDevMode,
      forceShow,
      locale
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // If forceShow is enabled for testing, show immediately
    if (forceShow) {
      setIsOpen(true);
      return;
    }

    // DEBUG: Force show on localhost for HR locale to test GDPR coordination
    if (isDevMode && locale === 'hr') {
      console.log('🧪 DEBUG MODE: Forcing geo modal for HR locale on localhost (ignoring dismissed state)');
      // Clear dismissed state and force show every time on HR locale
      if (typeof window !== 'undefined') {
        localStorage.removeItem(DISMISSED_KEY);
      }
      setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return;
    }

    // Check if already dismissed (for non-HR locales)
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem(DISMISSED_KEY);
      if (dismissed === 'true') {
        setIsDismissed(true);
        console.log('🚫 Modal dismissed previously - not showing');
        return;
      }
    }

    // Log initial state
    console.log('🌍 Country Detection Status:', {
      loading,
      hasGeoData: !!geoData,
      country: geoData?.country,
      isLocalhost: isDevMode,
      currentLocale: locale
    });

    // Check for country mismatch
    if (!loading && geoData && geoData.country) {
      const detectedLocale = countryToLocale[geoData.country];
      
      // Debug logging (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.log('🌍 Geolocation Debug:', {
          detectedCountryCode: geoData.country,
          detectedLocale,
          currentLocale: locale,
          city: geoData.city,
          region: geoData.region,
          ip: geoData.ip,
          isSupported: geoData.isSupported,
          isDevelopment: (geoData as unknown as Record<string, unknown>).isDevelopment
        });
        
        // Show development notice
        if ((geoData as unknown as Record<string, unknown>).isDevelopment) {
          console.log('⚠️ Running in development mode - geolocation only works in production on Vercel');
        }
      }
      
      // Only show if:
      // 1. We detected a supported country
      // 2. Detected locale is different from current locale
      // 3. Not already dismissed
      if (detectedLocale && detectedLocale !== locale && !isDismissed) {
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Showing country mismatch modal');
        }
        // Small delay to ensure page has loaded
        setTimeout(() => {
          setIsOpen(true);
        }, 500);
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.log('ℹ️ Not showing modal:', {
            hasDetectedLocale: !!detectedLocale,
            localeMatches: detectedLocale === locale,
            isDismissed
          });
        }
      }
    } else if (!loading && (!geoData || !geoData.country)) {
      // No geolocation data available
      console.log('⚠️ No geolocation data available:', {
        isLocalhost: isDevMode,
        reason: isDevMode ? 'Geolocation only works in production on Vercel' : 'Geolocation service unavailable',
        solution: isDevMode ? 'Deploy to Vercel to test geolocation' : 'Check Vercel deployment'
      });
      
      // If no exact match found, try to use fallback for neighboring countries
      if (geoData && geoData.country && !countryToLocale[geoData.country]) {
        console.log('⚠️ No exact locale match for country:', geoData.country, '- using default fallback');
      }
    }
  }, [geoData, loading, locale, isDismissed, forceShow, isDevMode]);

  const handleSwitch = () => {
    // Determine the target locale
    let targetLocale: string | undefined;
    
    if (forcedCountry) {
      // Use forced country for testing
      targetLocale = forcedCountry;
    } else if (geoData && geoData.country) {
      // Use detected country
      targetLocale = countryToLocale[geoData.country];
    } else if (showTestModal && isDevMode) {
      // Use test locale (different from current)
      const testCountries = ['rs', 'hr', 'ba', 'me'];
      targetLocale = testCountries.find(c => c !== locale) || 'rs';
    }
    
    if (targetLocale) {
      setIsOpen(false);
      setShowTestModal(false);
      
      // Mark as dismissed and notify other components
      if (typeof window !== 'undefined') {
        localStorage.setItem(DISMISSED_KEY, 'true');
        window.dispatchEvent(new CustomEvent('geoModalDismissed'));
      }
      
      // Get current pathname without locale
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      const pathWithoutLocale = currentPath.replace(`/${locale}`, '');
      
      // Preserve query parameters and hash
      const searchParams = typeof window !== 'undefined' ? window.location.search : '';
      const hash = typeof window !== 'undefined' ? window.location.hash : '';
      
      const newPath = `/${targetLocale}${pathWithoutLocale || ''}${searchParams}${hash}`;
      
      router.push(newPath);
    }
  };

  const handleDismiss = () => {
    setIsOpen(false);
    setShowTestModal(false);
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem(DISMISSED_KEY, 'true');
      // Dispatch event to notify other components (like cookie consent) that geo modal is closed
      window.dispatchEvent(new CustomEvent('geoModalDismissed'));
    }
  };

  // Handle testing mode with forced country
  let detectedLocale: string | undefined;
  
  if (forcedCountry) {
    // Use forced country for testing
    detectedLocale = forcedCountry;
  } else if (isDevMode && locale === 'hr' && isOpen) {
    // DEBUG: When on localhost with HR locale, show RS as detected
    detectedLocale = 'rs';
  } else if (geoData && geoData.country) {
    // Use real detected country
    detectedLocale = countryToLocale[geoData.country];
  } else if (showTestModal && isDevMode) {
    // For localhost testing, use a different country than current
    const testCountries = ['rs', 'hr', 'ba', 'me'];
    detectedLocale = testCountries.find(c => c !== locale) || 'rs';
  }

  // If no country detected and not in force mode or test mode, don't show
  if (!detectedLocale || !COUNTRIES[detectedLocale]) {
    if (!forceShow && !showTestModal && !(isDevMode && locale === 'hr')) return null;
    // For forceShow without country, default to 'rs' as an example
    detectedLocale = 'rs';
  }

  const detectedCountry = COUNTRIES[detectedLocale];
  
  // Helper function to get translations in the detected locale
  const getDetectedLocaleTranslation = (key: string, defaultValue?: string): string => {
    const detectedMessages = messages[detectedLocale] || messages['rs'];
    // All keys are under 'country_mismatch_banner'
    const fullKey = `country_mismatch_banner.${key}`;
    const keys = fullKey.split('.');
    let value: any = detectedMessages;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    
    return value || defaultValue || key;
  };
  
  const detectedCountryName = getDetectedLocaleTranslation(`countries_nominative.${detectedLocale}`);
  const currentCountryName = getDetectedLocaleTranslation(`countries_nominative.${locale}`);
  const detectedFlagCode = localeToFlagCode[detectedLocale];
  const currentFlagCode = localeToFlagCode[locale];

  // Show development notice on localhost (but not for HR locale - it auto-shows the modal)
  if (isDevMode && !forceShow && !showTestModal && locale !== 'hr') {
    const handleClearDismissed = () => {
      localStorage.removeItem(DISMISSED_KEY);
      console.log('✅ Cleared dismissed state - refresh page to test modal');
      alert('Cleared dismissed state! Refresh the page to test the modal again.');
    };

    const handleTestModal = () => {
      console.log('🧪 Testing modal from dev notice');
      setShowTestModal(true);
      setIsOpen(true);
    };

    return (
      <div className="fixed bottom-4 left-4 z-[999] max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 shadow-2xl">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <h4 className="font-bold text-yellow-900 mb-1">
                🧪 Geolocation Testing (Localhost)
              </h4>
              <p className="text-sm text-yellow-800 mb-2">
                Country detection only works on <strong>Vercel production</strong>, not localhost.
              </p>
              <div className="space-y-2">
                <p className="text-xs text-yellow-700">
                  <strong>Current Locale:</strong> {locale} | <strong>Status:</strong> {isDismissed ? '🚫 Dismissed' : '✅ Ready'}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleTestModal}
                    className="text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1.5 rounded font-medium transition-colors"
                  >
                    Test Modal Now
                  </button>
                  {isDismissed && (
                    <button
                      onClick={handleClearDismissed}
                      className="text-xs bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded font-medium transition-colors"
                    >
                      Clear Dismissed
                    </button>
                  )}
                </div>
                <p className="text-xs text-yellow-700 mt-2">
                  Or visit: <code className="bg-yellow-100 px-1 rounded">/{locale}/test-country-modal</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        handleDismiss();
      }
    }} modal>
      <DialogContent className="sm:max-w-md !bg-white !border !border-gray-200 !shadow-xl z-[100]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-gray-900 justify-center">
            <Globe className="h-6 w-6 text-brand-orange" />
            {getDetectedLocaleTranslation('modal_title', 'Detektirali smo vašu lokaciju')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center pt-4">
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-3 !bg-orange-50 rounded-lg border border-orange-200">
              <MapPin className="h-5 w-5 text-brand-orange flex-shrink-0" />
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-orange-900">
                  {getDetectedLocaleTranslation('detected_location', 'Vaša detektovana lokacija')}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {detectedFlagCode && (
                    <Image
                      src={`https://flagcdn.com/w40/${detectedFlagCode.toLowerCase()}.png`}
                      alt={detectedCountryName}
                      width={24}
                      height={18}
                      className="rounded-sm"
                    />
                  )}
                  <span className="font-semibold text-orange-900">{detectedCountryName}</span>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <div className="mb-4">{getDetectedLocaleTranslation('choose_version', 'Odaberite željenu verziju stranice:')}</div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="!flex !flex-row !justify-center items-center gap-8 sm:gap-12 pb-4 w-full">
          {/* Current Country Flag */}
          <button
            onClick={handleDismiss}
            className="flex flex-col items-center justify-center gap-3 group hover:scale-105 transition-transform duration-200 outline-none focus:outline-none"
          >
            <div className="relative w-24 h-24 sm:w-28 sm:h-28">
              {currentFlagCode && (
                <Image
                  src={`https://flagcdn.com/w160/${currentFlagCode.toLowerCase()}.png`}
                  alt={currentCountryName}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover rounded-lg shadow-lg group-hover:shadow-xl transition-shadow"
                />
              )}
            </div>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 text-center">
              {currentCountryName}
            </span>
          </button>

          {/* Detected Country Flag */}
          <button
            onClick={handleSwitch}
            className="flex flex-col items-center justify-center gap-3 group hover:scale-105 transition-transform duration-200 outline-none focus:outline-none"
          >
            <div className="relative w-24 h-24 sm:w-28 sm:h-28">
              {detectedFlagCode && (
                <Image
                  src={`https://flagcdn.com/w160/${detectedFlagCode.toLowerCase()}.png`}
                  alt={detectedCountryName}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover rounded-lg shadow-lg group-hover:shadow-xl transition-shadow"
                />
              )}
              {/* Recommended badge */}
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-brand-orange to-orange-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                ✓
              </div>
            </div>
            <span className="text-sm font-semibold text-brand-orange group-hover:text-orange-600 text-center">
              {detectedCountryName}
            </span>
          </button>
        </DialogFooter>
        
        <div className="text-center pb-4 px-6">
          <div className="text-xs text-orange-600 italic">
            {getDetectedLocaleTranslation('detection_note', '* Lokacija detektovana putem IP adrese. Možda nije uvek tačna.')}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
