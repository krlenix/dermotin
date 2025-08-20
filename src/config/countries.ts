export interface CountryConfig {
  code: string;
  name: string;
  locale: string;
  currency: string;
  currencySymbol: string;
  region: string;
  isEU: boolean;
  company: CompanyInfo;
  courier: CourierInfo;
  logo: string;
  domain?: string;
  timezone: string;
}

export interface CompanyInfo {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  taxNumber: string;
  vatNumber?: string;
  phone: string;
  email: string;
  bankAccount?: string;
  registrationNumber: string;
}

export interface CourierInfo {
  name: string;
  logo: string;
  deliveryTime: string;
  trackingUrl?: string;
}

export const COUNTRIES: Record<string, CountryConfig> = {
  rs: {
    code: 'rs',
    name: 'Serbia',
    locale: 'sr-RS',
    currency: 'RSD',
    currencySymbol: 'din',
    region: 'Balkans',
    isEU: false,
    timezone: 'Europe/Belgrade',
    logo: '/images/main/logo.png',
    company: {
      name: 'DERMOTIN Serbia DOO',
      address: 'Zvezdarskih jelki 3/2',
      city: 'Beograd',
      postalCode: '11050',
      country: 'Srbija',
      taxNumber: '114158912',
      phone: '+381 11 44 100 22',
      email: 'support@dermotin.com',
      registrationNumber: '21980218',
      bankAccount: '265-1234567890123456-78'
    },
    courier: {
      name: 'Post Express',
      logo: '/images/couriers/postexpress.png',
      deliveryTime: '1-2 radna dana',
      trackingUrl: 'https://postexpress.rs/tracking'
    }
  },
  // Ready for future expansion:
  // ba: { /* Bosnia configuration */ },
  // me: { /* Montenegro configuration */ },
  // eu: { /* EU configuration */ }
};

export const DEFAULT_COUNTRY = 'rs';

export const SUPPORTED_CURRENCIES = ['RSD', 'BAM', 'EUR'] as const;
export type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number];

export const CURRENCY_RATES: Record<SupportedCurrency, number> = {
  RSD: 1, // Base currency
  BAM: 0.5, // Approximate rate - will be updated when adding Bosnia
  EUR: 0.0085 // Approximate rate - will be updated when adding EU/Montenegro
};

export function getCountryConfig(countryCode: string): CountryConfig {
  return COUNTRIES[countryCode] || COUNTRIES[DEFAULT_COUNTRY];
}

export function getCurrencySymbol(currency: SupportedCurrency): string {
  const country = Object.values(COUNTRIES).find(c => c.currency === currency);
  return country?.currencySymbol || '€';
}

export function convertCurrency(
  amount: number,
  fromCurrency: SupportedCurrency,
  toCurrency: SupportedCurrency
): number {
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to base currency (RSD) first
  const baseAmount = amount / CURRENCY_RATES[fromCurrency];
  // Convert to target currency
  return baseAmount * CURRENCY_RATES[toCurrency];
}
