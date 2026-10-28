// Afilijacijski kodovi iz OMS-a. SAMO serverski kod: ključ se nikada ne šalje u browser,
// a spisak kodova ne napušta server (browser dobija samo odgovor za jedan kod).

import { getCountryConfig } from '@/config/countries';
import type { Coupon } from '@/config/coupons';

interface AffiliateCodeResponse {
  success: boolean;
  codes?: string[];
  error?: string;
}

export type AffiliateLookup =
  | { status: 'found'; coupon: Coupon }
  | { status: 'not_found' }
  | { status: 'unavailable' };

const CACHE_MS = 5 * 60 * 1000;
const cache = new Map<string, { codes: string[]; at: number }>();

function affiliateApiKey(): string | undefined {
  // NEXT_PUBLIC_ ime je zadržano samo radi prelaza: postaviti AFFILIATE_API_KEY na Vercelu.
  return process.env.AFFILIATE_API_KEY || process.env.NEXT_PUBLIC_AFFILIATE_API_KEY || undefined;
}

async function fetchCodes(countryCode: string): Promise<string[] | null> {
  const cached = cache.get(countryCode);
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.codes;

  const url = getCountryConfig(countryCode).webhooks.affiliateCodes?.url;
  const apiKey = affiliateApiKey();
  if (!url || !apiKey) return null;

  try {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey },
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      console.error(`Affiliate codes API: HTTP ${response.status}`);
      return null;
    }
    const result: AffiliateCodeResponse = await response.json();
    if (!result.success || !Array.isArray(result.codes)) return null;
    const codes = result.codes.map((code) => String(code).trim().toUpperCase());
    cache.set(countryCode, { codes, at: Date.now() });
    return codes;
  } catch (error) {
    console.error('Affiliate codes API unavailable:', error instanceof Error ? error.message : error);
    return null;
  }
}

/** OMS vraća samo nazive kodova; svi afilijacijski kodovi su 10% popusta. */
export async function lookupAffiliateCode(code: string, countryCode: string): Promise<AffiliateLookup> {
  const codes = await fetchCodes(countryCode);
  if (!codes) return { status: 'unavailable' };
  const normalized = code.trim().toUpperCase();
  if (!codes.includes(normalized)) return { status: 'not_found' };
  return {
    status: 'found',
    coupon: {
      code: normalized,
      type: 'percentage',
      value: 10,
      description: `Affiliate discount - ${normalized}`,
      minOrderValue: 0,
      enabled: true,
    },
  };
}
