
import { GeolocationDemo } from '@/components/features/GeolocationDemo';

export default function GeolocationTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Vercel Geolocation Test
          </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              This page demonstrates Vercel&apos;s geolocation capabilities using IP headers. 
              The information below is detected automatically based on your location.
            </p>
        </div>
        
        <GeolocationDemo />
        
        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div>
                <h3 className="font-medium text-blue-600 mb-2">1. Edge Detection</h3>
                <p className="text-sm text-gray-600">
                  Vercel&apos;s Edge Network automatically detects your location using IP geolocation
                </p>
              </div>
              <div>
                <h3 className="font-medium text-blue-600 mb-2">2. Header Extraction</h3>
                <p className="text-sm text-gray-600">
                  Our API routes read the X-Vercel-IP-* headers to get location data
                </p>
              </div>
              <div>
                <h3 className="font-medium text-blue-600 mb-2">3. Locale Mapping</h3>
                <p className="text-sm text-gray-600">
                  Country codes are mapped to supported locales for personalized content
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Geolocation Test - DERMOTIN',
  description: 'Test page for Vercel geolocation functionality',
};
