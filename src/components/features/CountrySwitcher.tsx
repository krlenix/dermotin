'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Globe, Check } from 'lucide-react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { COUNTRIES } from '@/config/countries';
import { cn } from '@/lib/utils';

interface CountryOption {
  code: string;
  name: string;
  flag: string;
}

// Country code to flag code mapping (ISO country codes)
const countryToFlagCode: Record<string, string> = {
  rs: 'RS', // Serbia
  ba: 'BA', // Bosnia and Herzegovina
  hr: 'HR', // Croatia
  me: 'ME', // Montenegro
};

export function CountrySwitcher({ 
  variant = 'default', 
  className 
}: { 
  variant?: 'default' | 'ghost' | 'outline';
  className?: string;
}) {
  const t = useTranslations('country_switcher');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  // Dynamically build countries list from config
  const countries: CountryOption[] = Object.keys(COUNTRIES).map((code) => ({
    code,
    name: t(`countries.${code}`),
    flag: countryToFlagCode[code] || code.toUpperCase(),
  }));

  const currentCountry = countries.find((c) => c.code === locale) || countries[0];

  const handleCountryChange = (countryCode: string) => {
    // Remove the current locale from pathname and add the new one
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    
    // Preserve query parameters
    const searchParams = typeof window !== 'undefined' ? window.location.search : '';
    const newPath = `/${countryCode}${pathWithoutLocale || ''}${searchParams}`;
    
    router.push(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size="sm" 
          className={cn(
            "gap-2 shadow-sm",
            !className && "bg-white/90 hover:bg-white border border-gray-200",
            className
          )}
        >
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline">{currentCountry.name}</span>
          <Image
            src={`https://flagcdn.com/w40/${currentCountry.flag.toLowerCase()}.png`}
            alt={currentCountry.name}
            width={20}
            height={15}
            className="rounded-sm"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 !bg-white border border-gray-200 shadow-lg">
        {countries.map((country) => (
          <DropdownMenuItem
            key={country.code}
            onClick={() => handleCountryChange(country.code)}
            className="cursor-pointer gap-2 !bg-white hover:!bg-gray-100 !text-gray-900"
          >
            <Image
              src={`https://flagcdn.com/w40/${country.flag.toLowerCase()}.png`}
              alt={country.name}
              width={20}
              height={15}
              className="rounded-sm"
            />
            <span className="flex-1">{country.name}</span>
            {locale === country.code && <Check className="h-4 w-4 text-brand-green" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

