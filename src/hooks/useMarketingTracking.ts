'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  MarketingParams, 
  getMarketingCookies, 
  setMarketingCookies, 
  extractMarketingParamsFromURL 
} from '@/utils/marketing-cookies';

export function useMarketingTracking() {
  const searchParams = useSearchParams();
  const [marketingParams, setMarketingParams] = useState<MarketingParams>({
    campaign_id: null,
    adset_id: null,
    ad_id: null,
    aff_id: null,
    medium: 'website'
  });

  useEffect(() => {
    // Get existing marketing parameters from cookies or sessionStorage
    const existingParams = getMarketingCookies();
    setMarketingParams(existingParams);

    // Extract new parameters from URL
    const urlParams = extractMarketingParamsFromURL(searchParams);
    
    // If we have new parameters from URL, store them (respecting consent)
    if (Object.keys(urlParams).length > 0) {
      setMarketingCookies(urlParams);
      
      // Update state with merged parameters
      const updatedParams = {
        campaign_id: urlParams.campaign_id !== undefined ? urlParams.campaign_id : existingParams.campaign_id,
        adset_id: urlParams.adset_id !== undefined ? urlParams.adset_id : existingParams.adset_id,
        ad_id: urlParams.ad_id !== undefined ? urlParams.ad_id : existingParams.ad_id,
        aff_id: urlParams.aff_id !== undefined ? urlParams.aff_id : existingParams.aff_id,
        medium: urlParams.medium !== undefined ? urlParams.medium : existingParams.medium,
      };
      
      setMarketingParams(updatedParams);
    }
  }, [searchParams]);

  // Listen for cookie consent changes to update marketing params
  useEffect(() => {
    const handleConsentUpdate = () => {
      // Refresh marketing params when consent changes
      const updatedParams = getMarketingCookies();
      setMarketingParams(updatedParams);
    };

    window.addEventListener('cookieConsentUpdated', handleConsentUpdate);
    
    return () => {
      window.removeEventListener('cookieConsentUpdated', handleConsentUpdate);
    };
  }, []);

  return {
    marketingParams,
    hasMarketingData: !!(
      marketingParams.campaign_id || 
      marketingParams.adset_id || 
      marketingParams.ad_id || 
      (marketingParams.medium && marketingParams.medium !== 'website')
    )
  };
}
