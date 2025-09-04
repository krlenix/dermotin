'use client';

import { useState } from 'react';
import { useMarketingTracking } from '@/hooks/useMarketingTracking';
import { clearMarketingCookies } from '@/utils/marketing-cookies';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Trash2 } from 'lucide-react';

interface MarketingDebugProps {
  isDevelopment?: boolean;
}

export function MarketingDebug({ isDevelopment = false }: MarketingDebugProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { marketingParams, hasMarketingData } = useMarketingTracking();

  // Only show in development or when explicitly enabled
  if (!isDevelopment && process.env.NODE_ENV === 'production') {
    return null;
  }

  const handleClearCookies = () => {
    clearMarketingCookies();
    window.location.reload(); // Refresh to see the changes
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
        >
          <Eye className="h-4 w-4 mr-1" />
          Marketing Debug
          {hasMarketingData && (
            <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
              Active
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Marketing Parameters</h3>
        <div className="flex gap-1">
          <Button
            onClick={handleClearCookies}
            variant="outline"
            size="sm"
            className="h-6 w-6 p-0"
            title="Clear marketing cookies"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
          <Button
            onClick={() => setIsVisible(false)}
            variant="outline"
            size="sm"
            className="h-6 w-6 p-0"
          >
            <EyeOff className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-600">Campaign ID:</span>
          <span className="font-mono bg-gray-100 px-1 rounded">
            {marketingParams.campaign_id || 'null'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Adset ID:</span>
          <span className="font-mono bg-gray-100 px-1 rounded">
            {marketingParams.adset_id || 'null'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Ad ID:</span>
          <span className="font-mono bg-gray-100 px-1 rounded">
            {marketingParams.ad_id || 'null'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Medium:</span>
          <span className="font-mono bg-gray-100 px-1 rounded">
            {marketingParams.medium}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t">
        <div className="text-xs text-gray-500">
          Status: {hasMarketingData ? (
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Tracking Active
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-gray-100 text-gray-600">
              No Data
            </Badge>
          )}
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-400">
        Test URLs:
        <div className="mt-1 space-y-1">
          <div className="font-mono bg-gray-50 p-1 rounded text-[10px]">
            ?campaign_id=123&medium=facebook
          </div>
          <div className="font-mono bg-gray-50 p-1 rounded text-[10px]">
            ?adset_id=456&ad_id=789
          </div>
        </div>
      </div>
    </div>
  );
}
