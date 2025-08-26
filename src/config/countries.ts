import { getWebsiteDomain } from '@/lib/utils';

export interface CountryConfig {
  code: string;
  name: string;
  locale: string;
  currency: string;
  currencySymbol: string;
  region: string;
  isEU: boolean;
  company: CompanyInfo;
  couriers: CourierInfo[]; // Array of available couriers
  fulfillmentCenter?: FulfillmentCenterInfo;
  logo: string;
  domain?: string;
  timezone: string;
  business: BusinessInfo;
  legal: LegalInfo;
}

export interface CompanyInfo {
  name: string;
  legalName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  taxNumber: string; // PIB/Tax ID
  vatNumber?: string;
  phone: string;
  email: string;
  bankAccount?: string;
  registrationNumber: string; // MB
  activityCode: string;
  activityDescription: string;
  website: string;
}

export interface BusinessInfo {
  deliveryArea: string;
  freeShippingThreshold: number; // Order value threshold for free shipping (applies to all couriers)
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  deliveryTimeUnit: string;
  paymentMethods: string[];
  returnPeriodDays: number;
  warrantyPeriodYears: number;
  complaintResponseDays: number;
  complaintResolutionDays: number;
  technicalComplaintResolutionDays: number;
}

export interface LegalInfo {
  lastUpdated: string;
  copyrightLaw: string;
  criminalCode: string;
  consumerProtectionLaw: string;
  dataProtectionLaw: string;
  obligationsLaw: string;
  ministryWebsite: string;
  disputeResolutionListUrl: string;
}

export interface CourierInfo {
  id: string;
  name: string;
  displayName: string; // Full name for legal documents
  logo: string;
  deliveryTime: string;
  trackingUrl?: string;
  isDefault?: boolean;
  enabled: boolean; // Whether this courier is currently available
  shipping: {
    cost: number; // Shipping cost for this courier
    currency: string; // Currency for the shipping cost
  };
}

export interface FulfillmentCenterInfo {
  name: string;
  legalName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  // Privacy and data protection information
  dataProcessingAgreement: boolean; // Whether DPA is in place
  gdprCompliant: boolean; // Whether fulfillment center is GDPR compliant
  dataRetentionPeriod: number; // Data retention period in days
  dataProcessingPurpose: string; // Purpose of data processing
  // Operational information
  operatingHours: string;
  supportedCountries: string[]; // Countries this fulfillment center serves
  // Legal information for privacy notices
  privacyPolicyUrl?: string;
  dataProtectionOfficer?: {
    name: string;
    email: string;
    phone?: string;
  };
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
      name: 'Dermotin',
      legalName: 'Clicky Doo',
      address: 'ul. Zvezdarskih Jelki 3/2',
      city: 'Beograd',
      postalCode: '11050',
      country: 'Republika Srbija',
      taxNumber: '114158912',
      phone: '011/44-100-22',
      email: 'info@dermotin.com',
      registrationNumber: '21980218',
      bankAccount: '265-1234567890123456-78',
      activityCode: '47.91',
      activityDescription: 'Trgovina na malo posredstvom pošte ili preko interneta',
      website: 'dermotin.com' // Will be dynamically replaced in getCountryConfig
    },
    couriers: [
      {
        id: 'post-express',
        name: 'Post Express',
        displayName: 'kurirske službe Post Express',
        logo: '/images/couriers/postexpress.png',
        deliveryTime: '1-2 radna dana',
        trackingUrl: 'https://postexpress.rs/tracking',
        isDefault: true,
        enabled: true,
        shipping: {
          cost: 280,
          currency: 'dinara'
        }
      },
      {
        id: 'bex',
        name: 'BEX',
        displayName: 'kurirske službe BEX',
        logo: '/images/couriers/bex.png',
        deliveryTime: '1-3 radna dana',
        trackingUrl: 'https://bex.rs/tracking',
        enabled: true,
        shipping: {
          cost: 350,
          currency: 'dinara'
        }
      },
      {
        id: 'aks',
        name: 'AKS',
        displayName: 'kurirske službe AKS',
        logo: '/images/couriers/aks.png',
        deliveryTime: '2-4 radna dana',
        trackingUrl: 'https://aks.rs/tracking',
        enabled: false, // Currently disabled for testing
        shipping: {
          cost: 400,
          currency: 'dinara'
        }
      }
    ],
    business: {
      deliveryArea: 'teritoriji Republike Srbije',
      freeShippingThreshold: 3000, // Free shipping for orders over 3000 dinara
      deliveryTimeMin: 3,
      deliveryTimeMax: 5,
      deliveryTimeUnit: 'radnih dana',
      paymentMethods: ['platnim karticama', 'gotovinom prilikom dostave', 'poštanskim uplatnicama'],
      returnPeriodDays: 14,
      warrantyPeriodYears: 2,
      complaintResponseDays: 8,
      complaintResolutionDays: 15,
      technicalComplaintResolutionDays: 30
    },
    legal: {
      lastUpdated: '2024-01-01',
      copyrightLaw: 'Zakona o autorskom i srodnim pravima ("Sl. glasnik RS", br. 104/2009, 99/2011, 119/2012, 29/2016 – odluka US i 66/2019)',
      criminalCode: 'Krivičnog zakonika Republike Srbije ("Sl. glasnik RS", br. 85/2005, 88/2005 – ispr., 107/2005 – ispr., 72/2009, 111/2009, 121/2012, 104/2013, 108/2014, 94/2016 i 35/2019)',
      consumerProtectionLaw: 'Zakona o zaštiti potrošača Republike Srbije',
      dataProtectionLaw: 'Zakona o zaštiti podataka o ličnosti',
      obligationsLaw: 'Zakona o obligacionim odnosima',
      ministryWebsite: 'https://mtt.gov.rs/tekst/2306/zastita-potrosaca.php',
      disputeResolutionListUrl: 'https://mtt.gov.rs/extfile/sr/33309/ha12.pdf'
    }
  },
  bg: {
    code: 'bg',
    name: 'Bulgaria',
    locale: 'bg-BG',
    currency: 'BGN',
    currencySymbol: 'лв',
    region: 'Balkans',
    isEU: true,
    timezone: 'Europe/Sofia',
    logo: '/images/main/logo.png',
    company: {
      name: 'Dermotin',
      legalName: 'DERMOTIN Bulgaria EOOD',
      address: 'ул. Витоша 15',
      city: 'София',
      postalCode: '1000',
      country: 'България',
      taxNumber: 'BG123456789',
      phone: '+359 2 123 4567',
      email: 'support@dermotin.bg',
      registrationNumber: '12345678',
      activityCode: '47.91',
      activityDescription: 'Търговия на дребно чрез пощата или интернет',
      website: 'dermotin.bg' // Will be dynamically replaced in getCountryConfig
    },
    couriers: [
      {
        id: 'econt',
        name: 'Econt Express',
        displayName: 'куриерската служба Econt',
        logo: '/images/couriers/econt.png',
        deliveryTime: '1-2 работни дни',
        trackingUrl: 'https://econt.com/tracking',
        isDefault: true,
        enabled: true,
        shipping: {
          cost: 5,
          currency: 'лева'
        }
      }
    ],
    fulfillmentCenter: {
      name: 'EU Fulfillment Center',
      legalName: 'European Logistics Solutions EOOD',
      address: 'бул. Черни връх 47',
      city: 'София',
      postalCode: '1407',
      country: 'България',
      phone: '+359 2 987 6543',
      email: 'fulfillment@eu-logistics.bg',
      website: 'https://eu-logistics.bg',
      dataProcessingAgreement: true,
      gdprCompliant: true,
      dataRetentionPeriod: 730, // 2 years
      dataProcessingPurpose: 'Order fulfillment, inventory management, and customer service',
      operatingHours: 'Monday-Friday 8:00-18:00 EET',
      supportedCountries: ['BG', 'RO', 'GR', 'HR', 'SI'],
      privacyPolicyUrl: 'https://eu-logistics.bg/privacy-policy',
      dataProtectionOfficer: {
        name: 'Maria Petrova',
        email: 'dpo@eu-logistics.bg',
        phone: '+359 2 987 6544'
      }
    },
    business: {
      deliveryArea: 'територията на Република България',
      freeShippingThreshold: 50, // Free shipping for orders over 50 лева
      deliveryTimeMin: 2,
      deliveryTimeMax: 4,
      deliveryTimeUnit: 'работни дни',
      paymentMethods: ['платежни карти', 'наложен платеж', 'банков превод'],
      returnPeriodDays: 14,
      warrantyPeriodYears: 2,
      complaintResponseDays: 8,
      complaintResolutionDays: 15,
      technicalComplaintResolutionDays: 30
    },
    legal: {
      lastUpdated: '2024-01-01',
      copyrightLaw: 'Закона за авторското право и сродните му права',
      criminalCode: 'Наказателния кодекс на Република България',
      consumerProtectionLaw: 'Закона за защита на потребителите',
      dataProtectionLaw: 'Закона за защита на личните данни',
      obligationsLaw: 'Закона за задълженията и договорите',
      ministryWebsite: 'https://www.mi.government.bg/bg/',
      disputeResolutionListUrl: 'https://www.mi.government.bg/bg/'
    }
  },
  // Ready for future expansion:
  // ba: { /* Bosnia configuration */ },
  // me: { /* Montenegro configuration */ },
  // eu: { /* EU configuration */ }
};

export const DEFAULT_COUNTRY = 'rs';

export const SUPPORTED_CURRENCIES = ['RSD', 'BAM', 'EUR', 'BGN'] as const;
export type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number];

export const CURRENCY_RATES: Record<SupportedCurrency, number> = {
  RSD: 1, // Base currency
  BAM: 0.5, // Approximate rate - will be updated when adding Bosnia
  EUR: 0.0085, // Approximate rate - will be updated when adding EU/Montenegro
  BGN: 0.017 // Approximate rate - will be updated when adding Bulgaria
};

export function getCountryConfig(countryCode: string): CountryConfig {
  const config = COUNTRIES[countryCode] || COUNTRIES[DEFAULT_COUNTRY];
  
  // Create a copy with dynamic website URL
  return {
    ...config,
    company: {
      ...config.company,
      website: getWebsiteDomain()
    }
  };
}

export function getDefaultCourier(countryConfig: CountryConfig): CourierInfo {
  // First try to find enabled default courier
  const enabledDefault = countryConfig.couriers.find(courier => courier.isDefault && courier.enabled);
  if (enabledDefault) return enabledDefault;
  
  // Fallback to first enabled courier
  const firstEnabled = countryConfig.couriers.find(courier => courier.enabled);
  if (firstEnabled) return firstEnabled;
  
  // Last resort: return first courier (even if disabled)
  return countryConfig.couriers[0];
}

export function getCourierById(countryConfig: CountryConfig, courierId: string): CourierInfo | undefined {
  return countryConfig.couriers.find(courier => courier.id === courierId);
}

export function getAvailableCouriers(countryConfig: CountryConfig): CourierInfo[] {
  return countryConfig.couriers.filter(courier => courier.enabled);
}

export function getAllCouriers(countryConfig: CountryConfig): CourierInfo[] {
  return countryConfig.couriers;
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
