'use client';

import { useState, useEffect } from 'react';
import { CountryConfig, getCountryConfig, DEFAULT_COUNTRY } from '@/config/countries';

export function useCountry(initialCountry: string = DEFAULT_COUNTRY) {
  const [countryCode, setCountryCode] = useState(initialCountry);
  const [countryConfig, setCountryConfig] = useState<CountryConfig>(getCountryConfig(initialCountry));

  useEffect(() => {
    const config = getCountryConfig(countryCode);
    setCountryConfig(config);
  }, [countryCode]);

  const changeCountry = (newCountryCode: string) => {
    setCountryCode(newCountryCode);
    // Optionally save to localStorage for user preference
    localStorage.setItem('preferred-country', newCountryCode);
  };

  return {
    countryCode,
    countryConfig,
    changeCountry,
    companyInfo: countryConfig.company,
    isEU: countryConfig.isEU,
    currency: countryConfig.currency,
    locale: countryConfig.locale
  };
}
