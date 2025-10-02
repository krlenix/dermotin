'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Globe } from 'lucide-react';
import Image from 'next/image';

interface CountryInfo {
  code: string;
  name: string;
  flagCode: string;
}

export function CountriesHeader() {
  const t = useTranslations('countries_header');
  const locale = useLocale();
  const [currentCountryIndex, setCurrentCountryIndex] = useState(0);
  
  const allCountries: CountryInfo[] = [
    { code: 'SRB', name: t('serbia'), flagCode: 'RS' },
    { code: 'BiH', name: t('bosnia'), flagCode: 'BA' },
    { code: 'HR', name: t('croatia'), flagCode: 'HR' },
    { code: 'ME', name: t('montenegro'), flagCode: 'ME' },
    { code: 'EU', name: t('eu'), flagCode: 'EU' }
  ];

  // Reorder countries based on locale
  const getOrderedCountries = () => {
    if (locale === 'rs') {
      // For Serbian locale, show Serbia first
      return [
        allCountries[0], // Serbia
        ...allCountries.slice(1) // Rest of countries
      ];
    } else if (locale === 'ba') {
      // For Bosnian locale, show Bosnia first
      return [
        allCountries[1], // Bosnia
        allCountries[0], // Serbia
        ...allCountries.slice(2) // Rest of countries
      ];
    } else if (locale === 'hr') {
      // For Croatian locale, show Croatia first
      return [
        allCountries[2], // Croatia
        allCountries[0], // Serbia
        allCountries[1], // Bosnia
        ...allCountries.slice(3) // Rest of countries
      ];
    }
    // Default order for other locales
    return allCountries;
  };

  const countries = getOrderedCountries();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCountryIndex((prev) => (prev + 1) % countries.length);
    }, 2500); // Change every 2.5 seconds

    return () => clearInterval(interval);
  }, [countries.length]);

  return (
    <section className="sm:mt-0 py-6 bg-gradient-to-r from-brand-green/5 to-emerald-50 border-y border-brand-green/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2 text-brand-green">
            <Globe className="w-5 h-5" />
            <span className="text-sm font-semibold">{t('we_operate_in')}:</span>
          </div>
          
          <div className="flex items-center gap-4">
            {countries.map((country, index) => (
              <div
                key={country.code}
                className="relative transition-all duration-500"
              >
                <div 
                  className={`relative w-8 h-6 transition-all duration-500 ${
                    index === currentCountryIndex ? 'scale-125' : ''
                  }`}
                  style={{
                    filter: index === currentCountryIndex ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }}
                >
                  <Image
                    src={`https://flagcdn.com/w80/${country.flagCode.toLowerCase()}.png`}
                    alt={`${country.name} flag`}
                    width={64}
                    height={48}
                    className="rounded-sm object-cover w-full h-full"
                    loading="lazy"
                    quality={95}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
