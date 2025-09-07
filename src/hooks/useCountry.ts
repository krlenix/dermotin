'use client';

import { useState, useEffect } from 'react';
import { CountryConfig, getCountryConfig, DEFAULT_COUNTRY } from '@/config/countries';
import { useDetectedLocale } from './useGeolocation';

export function useCountry(initialCountry: string = DEFAULT_COUNTRY, useGeolocation: boolean = false) {
  const [countryCode, setCountryCode] = useState(initialCountry);
  const [countryConfig, setCountryConfig] = useState<CountryConfig>(getCountryConfig(initialCountry));
  
  // Get geolocation-detected locale
  const { locale: detectedLocale, loading: geoLoading } = useDetectedLocale();

  useEffect(() => {
    // If geolocation is enabled and we have a detected locale, use it
    if (useGeolocation && !geoLoading && detectedLocale) {
      const preferredCountry = localStorage.getItem('preferred-country');
      
      // Only use geolocation if user hasn't manually selected a country
      if (!preferredCountry) {
        setCountryCode(detectedLocale);
      }
    }
  }, [useGeolocation, geoLoading, detectedLocale]);

  useEffect(() => {
    const config = getCountryConfig(countryCode);
    setCountryConfig(config);
  }, [countryCode]);

  const changeCountry = (newCountryCode: string) => {
    setCountryCode(newCountryCode);
    // Save to localStorage for user preference
    localStorage.setItem('preferred-country', newCountryCode);
  };

  return {
    countryCode,
    countryConfig,
    changeCountry,
    companyInfo: countryConfig.company,
    isEU: countryConfig.isEU,
    currency: countryConfig.currency,
    locale: countryConfig.locale,
    // Additional geolocation info
    isGeoDetected: useGeolocation && !geoLoading && detectedLocale === countryCode,
    geoLoading: useGeolocation ? geoLoading : false,
  };
}
