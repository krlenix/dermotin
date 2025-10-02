'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, Loader2, Radio, Sparkles } from 'lucide-react';

interface TestResult {
  success: boolean;
  message?: string;
  error?: string;
  result?: {
    success: boolean;
    eventId?: string;
    error?: string;
  };
}

export default function CapiTestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [selectedCountry, setSelectedCountry] = useState('rs');
  const [selectedEvent, setSelectedEvent] = useState('purchase');

  const testCapi = async () => {
    setLoading(true);
    setResult(null);

    console.log('🧪 Triggering CAPI test...');
    console.log('⚠️ NOTE: Detailed CAPI logs will appear in your TERMINAL (server console), not here!');

    try {
      const response = await fetch(`/api/test-capi?country=${selectedCountry}&event=${selectedEvent}`);
      const data = await response.json();
      
      console.log('📥 Test API Response:', data);
      console.log('👀 Check your TERMINAL for detailed CAPI logs!');
      
      setResult(data);
    } catch (error) {
      console.error('Test error:', error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6" />
              CAPI Test Console
            </CardTitle>
            <p className="text-blue-100 text-sm mt-2">
              Test Meta Conversion API events and see detailed logs in your terminal
            </p>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Important Notice */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <div className="flex items-start">
                <Radio className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-800 mb-1">
                    ⚠️ Check Your Terminal!
                  </p>
                  <p className="text-sm text-yellow-700">
                    CAPI runs on the <strong>server-side</strong>. Detailed logs will appear in your 
                    <strong> terminal/console</strong> where you run <code className="bg-yellow-100 px-1 py-0.5 rounded">npm run dev</code>, 
                    not in the browser console.
                  </p>
                </div>
              </div>
            </div>

            {/* Country Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Country
              </label>
              <div className="flex gap-2">
                {['rs', 'ba', 'hr'].map((country) => (
                  <Button
                    key={country}
                    variant={selectedCountry === country ? 'default' : 'outline'}
                    onClick={() => setSelectedCountry(country)}
                    className="flex-1"
                  >
                    {country.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            {/* Event Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Event Type
              </label>
              <div className="flex gap-2">
                <Button
                  variant={selectedEvent === 'purchase' ? 'default' : 'outline'}
                  onClick={() => setSelectedEvent('purchase')}
                  className="flex-1"
                >
                  Purchase
                </Button>
                <Button
                  variant={selectedEvent === 'checkout' ? 'default' : 'outline'}
                  onClick={() => setSelectedEvent('checkout')}
                  className="flex-1"
                >
                  InitiateCheckout
                </Button>
              </div>
            </div>

            {/* Test Button */}
            <Button
              onClick={testCapi}
              disabled={loading}
              className="w-full h-12 text-lg"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending CAPI Event...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Fire Test CAPI Event
                </>
              )}
            </Button>

            {/* Result Display */}
            {result && (
              <div className={`mt-6 p-4 rounded-lg border-2 ${
                result.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {result.success ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <X className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`font-semibold ${
                    result.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {result.success ? 'Success!' : 'Failed'}
                  </span>
                  {result.success && result.result?.success && (
                    <Badge variant="secondary" className="ml-auto">
                      Event ID: {result.result.eventId}
                    </Badge>
                  )}
                </div>
                
                <p className={`text-sm ${
                  result.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {result.message || result.error || 'Unknown response'}
                </p>

                {result.success && (
                  <div className="mt-3 p-3 bg-white rounded border border-green-200">
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      ✅ What to check in your terminal:
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                      <li>🚀 CAPI EVENT TRIGGERED banner</li>
                      <li>📊 Event Details (name, ID, country, pixel ID)</li>
                      <li>👤 Raw User Data (before hashing)</li>
                      <li>🔐 Hashed User Data (what gets sent to Meta)</li>
                      <li>💰 Custom Data (currency, value, items)</li>
                      <li>📦 Complete Payload Structure</li>
                      <li>📥 Response from Meta</li>
                      <li>✅ Success confirmation</li>
                    </ul>
                  </div>
                )}

                {!result.success && result.result?.error && (
                  <div className="mt-2 p-2 bg-red-100 rounded">
                    <p className="text-xs text-red-700">
                      Error: {result.result.error}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Radio className="h-4 w-4" />
                How to Use:
              </h3>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Select a country and event type</li>
                <li>Click &quot;Fire Test CAPI Event&quot;</li>
                <li>
                  <strong>Check your terminal</strong> (where <code className="bg-blue-100 px-1 py-0.5 rounded">npm run dev</code> is running)
                </li>
                <li>Look for detailed logs with banners and emoji indicators</li>
                <li>Verify the event was sent successfully to Meta</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

