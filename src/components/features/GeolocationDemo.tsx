'use client';

import { useGeolocation, useIsSupportedCountry } from '@/hooks/useGeolocation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Globe, Clock, Wifi, RefreshCw } from 'lucide-react';

export function GeolocationDemo() {
  const { data, loading, error, refetch } = useGeolocation();
  const { isSupported } = useIsSupportedCountry();

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 animate-spin" />
            Detecting Location...
          </CardTitle>
          <CardDescription>
            Getting your geolocation information using Vercel Edge Network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse text-muted-foreground">
              Loading geolocation data...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Your Location Information
        </CardTitle>
        <CardDescription>
          Detected using Vercel geolocation headers
        </CardDescription>
        <div className="flex gap-2">
          <Badge variant={isSupported ? "default" : "secondary"}>
            {isSupported ? "Supported Region" : "Unsupported Region"}
          </Badge>
          {data?.detectedLocale && (
            <Badge variant="outline">
              Locale: {data.detectedLocale.toUpperCase()}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Location Info */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Location Details
            </h4>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Country:</span>
                <span className="text-sm font-medium">
                  {data?.country || 'Unknown'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Region:</span>
                <span className="text-sm font-medium">
                  {data?.countryRegion || 'Unknown'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">City:</span>
                <span className="text-sm font-medium">
                  {data?.city || 'Unknown'}
                </span>
              </div>
              
              {data?.latitude && data?.longitude && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Coordinates:</span>
                  <span className="text-sm font-medium">
                    {data.latitude}, {data.longitude}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Technical Info */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Technical Details
            </h4>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">IP Address:</span>
                <span className="text-sm font-medium font-mono">
                  {data?.ip || 'Hidden'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Edge Region:</span>
                <span className="text-sm font-medium">
                  {data?.region || 'Unknown'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Detected:</span>
                <span className="text-sm font-medium">
                  {data?.timestamp ? new Date(data.timestamp).toLocaleTimeString() : 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Application Integration */}
        <div className="pt-4 border-t">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
            Application Integration
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-muted/50 rounded-lg">
              <Globe className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <div className="text-sm font-medium">Detected Locale</div>
              <div className="text-xs text-muted-foreground mt-1">
                {data?.detectedLocale?.toUpperCase() || 'RS'}
              </div>
            </div>
            
            <div className="p-3 bg-muted/50 rounded-lg">
              <Wifi className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <div className="text-sm font-medium">Region Support</div>
              <div className="text-xs text-muted-foreground mt-1">
                {isSupported ? 'Supported' : 'Fallback'}
              </div>
            </div>
            
            <div className="p-3 bg-muted/50 rounded-lg">
              <Clock className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <div className="text-sm font-medium">Detection Time</div>
              <div className="text-xs text-muted-foreground mt-1">
                {data?.timestamp ? 'Real-time' : 'Cached'}
              </div>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="pt-4 border-t">
          <Button 
            onClick={refetch} 
            variant="outline" 
            size="sm"
            className="w-full"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Location Data
          </Button>
        </div>

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && data && (
          <details className="pt-4 border-t">
            <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
              Debug Information
            </summary>
            <pre className="mt-2 p-3 bg-muted rounded-md text-xs overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>
        )}
      </CardContent>
    </Card>
  );
}
