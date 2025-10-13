import { geolocation } from '@vercel/functions';
import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';

export const runtime = 'edge';

export default async function GeolocationDemo() {
  const headersList = await headers();
  
  // Create a mock Request object with headers for geolocation
  const request = new Request('https://example.com', {
    headers: headersList
  });
  
  const geo = geolocation(request);

  // Get country flag
  const countryCode = geo.country?.toLowerCase() || 'unknown';
  const flagUrl = geo.country ? `https://flagcdn.com/w80/${countryCode}.png` : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <div className="text-brand-orange hover:text-orange-600 transition-colors">
              ← Back to Home
            </div>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Geolocation
          </h1>
          <p className="text-lg text-gray-600">
            Show localized content based on headers
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Country/City Banner */}
          <div className="bg-gradient-to-r from-brand-orange to-orange-600 p-6 text-white">
            <div className="flex items-center gap-4">
              {flagUrl && (
                <div className="flex-shrink-0">
                  <Image
                    src={flagUrl}
                    alt={geo.country || 'Country'}
                    width={64}
                    height={48}
                    className="rounded-lg shadow-lg"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="text-sm opacity-90 mb-1">
                  {geo.city || 'Unknown City'}
                </div>
                <div className="text-2xl font-bold">
                  {geo.country || 'Unknown'}
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6 space-y-4">
            <DetailRow label="Languages" value="Serbian" />
            <DetailRow label="Currency" value="RSD дин." />
            
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Geolocation Headers
              </h3>
              <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono space-y-1">
                <HeaderLine name="x-vercel-ip-city" value={geo.city} />
                <HeaderLine name="x-vercel-ip-country-region" value={geo.countryRegion} />
                <HeaderLine name="x-vercel-ip-country" value={geo.country} />
                <HeaderLine name="x-vercel-ip-latitude" value={geo.latitude} />
                <HeaderLine name="x-vercel-ip-longitude" value={geo.longitude} />
              </div>
            </div>

            {/* Additional Info */}
            <div className="pt-4 space-y-2 text-sm text-gray-600">
              <InfoItem icon="🌐" label="Region" value={geo.region || 'Unknown'} />
              <InfoItem icon="📍" label="Coordinates" value={geo.latitude && geo.longitude ? `${geo.latitude}, ${geo.longitude}` : 'Unknown'} />
              <InfoItem icon="🗺️" label="Country Region" value={geo.countryRegion || 'Unknown'} />
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            💡 This uses Vercel Edge Functions with geolocation headers
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Note: Geolocation only works in production on Vercel, not on localhost
          </p>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600 font-medium">{label}</span>
      <span className="text-gray-900 font-semibold">{value}</span>
    </div>
  );
}

function HeaderLine({ name, value }: { name: string; value?: string | null }) {
  return (
    <div className="flex gap-2">
      <span className="text-emerald-400">{name}:</span>
      <span className="text-white">{value || 'null'}</span>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg">{icon}</span>
      <span className="font-medium text-gray-700">{label}:</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );
}

