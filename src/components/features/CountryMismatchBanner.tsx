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

const DISMISSED_KEY = 'country-mismatch-dismissed';

// Country code mapping (ISO to locale)
const countryToLocale: Record<string, string> = {
  RS: 'rs', // Serbia
  BA: 'ba', // Bosnia and Herzegovina
  HR: 'hr', // Croatia
  ME: 'me', // Montenegro
  MK: 'rs', // North Macedonia (use Serbian)
  SI: 'rs', // Slovenia (use Serbian)
  AL: 'rs', // Albania (use Serbian)
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

    // Check if already dismissed
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
    }
  };

  // Handle testing mode with forced country
  let detectedLocale: string | undefined;
  
  if (forcedCountry) {
    // Use forced country for testing
    detectedLocale = forcedCountry;
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
    if (!forceShow && !showTestModal) return null;
    // For forceShow without country, default to 'hr' as an example
    detectedLocale = 'hr';
  }

  const detectedCountry = COUNTRIES[detectedLocale];
  const detectedCountryName = t(`countries.${detectedLocale}`);
  const currentCountryName = t(`countries.${locale}`);
  const detectedFlagCode = localeToFlagCode[detectedLocale];
  const currentFlagCode = localeToFlagCode[locale];

  // Show development notice on localhost
  if (isDevMode && !forceShow && !showTestModal) {
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
          <DialogTitle className="flex items-center gap-2 text-xl text-gray-900">
            <Globe className="h-6 w-6 text-brand-orange" />
            {t('modal_title', { default: 'Country Detection' })}
          </DialogTitle>
          <DialogDescription className="text-left pt-2">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 !bg-orange-50 rounded-lg border border-orange-200">
                <MapPin className="h-5 w-5 text-brand-orange flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-orange-900">
                    {t('detected_location', { default: 'Your detected location' })}
                  </p>
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
                <p>{t('suggestion', { suggestedCountry: detectedCountryName })}</p>
                <p className="mt-2 text-xs text-gray-500">
                  {t('current_viewing', { 
                    default: `You are currently viewing the ${currentCountryName} version.`,
                    currentCountry: currentCountryName 
                  })}
                </p>
                <p className="mt-2 text-xs text-orange-600 italic">
                  {t('detection_note', { 
                    default: '* Location detected via IP address. May not always be accurate.'
                  })}
                </p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            onClick={handleDismiss}
            variant="outline"
            className="w-full sm:w-auto !bg-white hover:!bg-gray-50"
          >
            {currentFlagCode && (
              <Image
                src={`https://flagcdn.com/w40/${currentFlagCode.toLowerCase()}.png`}
                alt={currentCountryName}
                width={20}
                height={15}
                className="rounded-sm mr-2"
              />
            )}
            {t('stay_button', { default: `Stay on ${currentCountryName}`, country: currentCountryName })}
          </Button>
          <Button
            onClick={handleSwitch}
            className="w-full sm:w-auto !bg-gradient-to-r !from-brand-orange !to-orange-600 hover:!from-orange-600 hover:!to-orange-700 !text-white shadow-lg"
          >
            {detectedFlagCode && (
              <Image
                src={`https://flagcdn.com/w40/${detectedFlagCode.toLowerCase()}.png`}
                alt={detectedCountryName}
                width={20}
                height={15}
                className="rounded-sm mr-2"
              />
            )}
            {t('switch_button', { country: detectedCountryName })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
