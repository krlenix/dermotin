'use client';

import { useState, useEffect } from 'react';

export interface GeolocationData {
  country: string | null;
  countryRegion: string | null;
  city: string | null;
  latitude: string | null;
  longitude: string | null;
  region: string | null;
  ip: string | null;
  detectedLocale: string;
  isSupported: boolean;
  timestamp: string;
  error?: string;
}

interface UseGeolocationReturn {
  data: GeolocationData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useGeolocation(): UseGeolocationReturn {
  const [data, setData] = useState<GeolocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGeolocation = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/geo-detect', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const geoData: GeolocationData = await response.json();
      setData(geoData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch geolocation';
      setError(errorMessage);
      console.error('Geolocation fetch error:', err);
      
      // Set fallback data
      setData({
        country: null,
        countryRegion: null,
        city: null,
        latitude: null,
        longitude: null,
        region: null,
        ip: null,
        detectedLocale: 'rs', // Default to Serbian
        isSupported: false,
        timestamp: new Date().toISOString(),
        error: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGeolocation();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchGeolocation,
  };
}

// Hook for getting just the detected locale
export function useDetectedLocale(): {
  locale: string;
  loading: boolean;
  error: string | null;
} {
  const { data, loading, error } = useGeolocation();
  
  return {
    locale: data?.detectedLocale || 'rs',
    loading,
    error,
  };
}

// Hook for checking if user is in a supported country
export function useIsSupportedCountry(): {
  isSupported: boolean;
  country: string | null;
  loading: boolean;
} {
  const { data, loading } = useGeolocation();
  
  return {
    isSupported: data?.isSupported || false,
    country: data?.country || null,
    loading,
  };
}
