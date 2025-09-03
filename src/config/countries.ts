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
  webhooks: WebhookConfig;
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
  // FAQ configuration - defines which FAQ items to show
  faqItems: string[]; // Array of FAQ keys that should be displayed for this country
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

export interface WebhookConfig {
  orders: {
    url: string;
    authMethod: 'signature' | 'api-key';
    apiKey?: string;
    webhookSecret?: string;
  };
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
      email: 'support@dermotin.com',
      registrationNumber: '21980218',
      bankAccount: '265-1234567890123456-78',
      activityCode: '47.91',
      activityDescription: 'Trgovina na malo posredstvom pošte ili preko interneta',
      website: 'dermotin.com' // Will be dynamically replaced in getCountryConfig
    },
    couriers: [
      {
        id: 'post-express',
        name: 'PostExpress',
        displayName: 'kurirske službe PostExpress',
        logo: '/images/couriers/postexpress.png',
        deliveryTime: '1-2 radna dana',
        trackingUrl: 'https://postexpress.rs/tracking',
        isDefault: true,
        enabled: true,
        shipping: {
          cost: 400,
          currency: 'dinara'
        }
      }
    ],
    business: {
      deliveryArea: 'teritoriji Republike Srbije',
      freeShippingThreshold: 4700, // Free shipping for orders over 4700 dinara
      deliveryTimeMin: 1,
      deliveryTimeMax: 2,
      deliveryTimeUnit: 'radnih dana',
      paymentMethods: ['gotovinom prilikom dostave (pouzećem)'],
      returnPeriodDays: 14,
      warrantyPeriodYears: 2,
      complaintResponseDays: 8,
      complaintResolutionDays: 15,
      technicalComplaintResolutionDays: 30,
      faqItems: ['delivery_time', 'delivery_cost', 'cash_on_delivery', 'payment_methods', 'returns', 'support', 'tracking', 'safety', 'warranty']
    },
    legal: {
      lastUpdated: '2025-01-01',
      copyrightLaw: 'Zakona o autorskom i srodnim pravima ("Sl. glasnik RS", br. 104/2009, 99/2011, 119/2012, 29/2016 – odluka US i 66/2019)',
      criminalCode: 'Krivičnog zakonika Republike Srbije ("Sl. glasnik RS", br. 85/2005, 88/2005 – ispr., 107/2005 – ispr., 72/2009, 111/2009, 121/2012, 104/2013, 108/2014, 94/2016 i 35/2019)',
      consumerProtectionLaw: 'Zakona o zaštiti potrošača Republike Srbije',
      dataProtectionLaw: 'Zakona o zaštiti podataka o ličnosti',
      obligationsLaw: 'Zakona o obligacionim odnosima',
      ministryWebsite: 'https://mtt.gov.rs/tekst/2306/zastita-potrosaca.php',
      disputeResolutionListUrl: 'https://mtt.gov.rs/extfile/sr/33309/ha12.pdf'
    },
    webhooks: {
      orders: {
        url: process.env.NEXT_PUBLIC_RS_ORDER_WEBHOOK_URL || '',
        authMethod: 'signature',
        webhookSecret: process.env.RS_ORDER_WEBHOOK_SECRET || ''
      }
    }
  },

  // Ready for future expansion:
  ba: {
    code: 'ba',
    name: 'Bosnia and Herzegovina',
    locale: 'bs-BA',
    currency: 'BAM',
    currencySymbol: 'KM',
    region: 'Balkans',
    isEU: false,
    timezone: 'Europe/Sarajevo',
    logo: '/images/main/logo.png',
    company: {
      name: 'Dermotin',
      legalName: 'Dermotin d.o.o.',
      address: 'Majevička 133',
      city: 'Bijeljina',
      postalCode: '76300',
      country: 'Bosna i Hercegovina',
      taxNumber: '4405305760000 ',
      phone: '+387 66 063 133',
      email: 'support@dermotin.com',
      registrationNumber: '11666779',
      activityCode: '47.91',
      activityDescription: 'Trgovina na malo posredstvom pošte ili preko interneta',
      website: 'dermotin.com'
    },
    couriers: [
      {
        id: 'poste-srpske',
        name: 'Pošte Srpske',
        displayName: 'kurirske službe Pošte Srpske',
        logo: '/images/couriers/postexpress.png',
        deliveryTime: '1-2 radna dana',
        trackingUrl: 'https://postesrpske.com/tracking',
        isDefault: true,
        enabled: true,
        shipping: {
          cost: 9,
          currency: 'KM'
        }
      }
    ],
    business: {
      deliveryArea: 'teritoriji Bosne i Hercegovine',
      freeShippingThreshold: 79,
      deliveryTimeMin: 1,
      deliveryTimeMax: 2,
      deliveryTimeUnit: 'radnih dana',
      paymentMethods: ['gotovinom prilikom dostave (pouzećem)'],
      returnPeriodDays: 14,
      warrantyPeriodYears: 2,
      complaintResponseDays: 8,
      complaintResolutionDays: 15,
      technicalComplaintResolutionDays: 30,
      faqItems: ['delivery_time', 'delivery_cost', 'cash_on_delivery', 'payment_methods', 'returns', 'support', 'tracking', 'safety', 'warranty']
    },
    legal: {
      lastUpdated: '2025-01-01',
      copyrightLaw: 'Zakona o autorskom pravu',
      criminalCode: 'Krivičnog zakonika BiH',
      consumerProtectionLaw: 'Zakona o zaštiti potrošača BiH',
      dataProtectionLaw: 'Zakona o zaštiti ličnih podataka BiH',
      obligationsLaw: 'Zakona o obligacionim odnosima BiH',
      ministryWebsite: 'https://www.vijeceministara.gov.ba',
      disputeResolutionListUrl: 'https://www.parlament.ba'
    },
    webhooks: {
      orders: {
        url: process.env.NEXT_PUBLIC_BA_ORDER_WEBHOOK_URL || '',
        authMethod: 'signature',
        webhookSecret: process.env.BA_ORDER_WEBHOOK_SECRET || ''
      }
    }
  }
};

export const DEFAULT_COUNTRY = 'rs';

export const SUPPORTED_CURRENCIES = ['RSD', 'BAM'] as const;
export type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number];

export const CURRENCY_RATES: Record<SupportedCurrency, number> = {
  RSD: 1, // Base currency
  BAM: 0.5 // Approximate rate - will be updated when adding Bosnia
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