'use client';

import { useState } from 'react';
import { CountryMismatchBanner } from '@/components/features/CountryMismatchBanner';
import { Button } from '@/components/ui/button';

export default function TestCountryModal() {
  const [forceShow, setForceShow] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('hr');

  const countries = [
    { code: 'rs', name: 'Serbia' },
    { code: 'ba', name: 'Bosnia and Herzegovina' },
    { code: 'hr', name: 'Croatia' },
    { code: 'me', name: 'Montenegro' },
  ];

  const handleShowModal = () => {
    // Clear localStorage to ensure modal shows
    if (typeof window !== 'undefined') {
      localStorage.removeItem('country-mismatch-dismissed');
    }
    // Toggle to force re-render
    setForceShow(false);
    setTimeout(() => {
      setForceShow(true);
    }, 50);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Country Modal Test Page
          </h1>
          
          <p className="text-gray-600 mb-6">
            This page allows you to test the country mismatch detection modal.
            Select a country to simulate detection and click the button to show the modal.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Simulated Detected Country:
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <Button
              onClick={handleShowModal}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              Show Country Modal
            </Button>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> The modal is set to show you&apos;re from{' '}
                <strong>{countries.find(c => c.code === selectedCountry)?.name}</strong>.
                You can switch countries or stay on the current site.
              </p>
              <p className="text-xs text-yellow-700 mt-2">
                ✅ Query parameters will be preserved when switching!
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-green-900 mb-2">Test with Query Parameters:</p>
              <p className="text-xs text-green-700 mb-2">
                Current URL: <code className="bg-green-100 px-1 rounded">{typeof window !== 'undefined' ? window.location.href : 'N/A'}</code>
              </p>
              <a 
                href="?utm_source=test&fbclid=12345&ref=demo"
                className="text-sm text-green-600 hover:text-green-800 underline"
              >
                Click here to add test parameters
              </a>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">How to clear localStorage:</h3>
              <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                <li>Open browser DevTools (F12)</li>
                <li>Go to Application/Storage tab</li>
                <li>Find Local Storage → your domain</li>
                <li>Delete the key: <code className="bg-gray-200 px-1 rounded">country-mismatch-dismissed</code></li>
                <li>Or just click the button above - it clears it automatically!</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* The modal component with test mode enabled */}
      <CountryMismatchBanner forceShow={forceShow} forcedCountry={selectedCountry} />
    </div>
  );
}

