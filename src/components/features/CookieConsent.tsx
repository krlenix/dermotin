'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Settings, Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface CookieConsentProps {
  isEU: boolean;
}

export function CookieConsent({ isEU }: CookieConsentProps) {
  const t = useTranslations('gdpr');
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    if (!isEU) return;
    
    const hasConsent = localStorage.getItem('cookie-consent');
    if (!hasConsent) {
      setShowBanner(true);
    } else {
      const savedPreferences = JSON.parse(hasConsent);
      setPreferences(savedPreferences);
    }
  }, [isEU]);

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    setPreferences(necessaryOnly);
    localStorage.setItem('cookie-consent', JSON.stringify(necessaryOnly));
    setShowBanner(false);
    setShowSettings(false);
  };

  const savePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    setShowBanner(false);
    setShowSettings(false);
  };

  if (!isEU || !showBanner) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <Card className="w-full m-4 p-6 max-w-2xl mx-auto">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">{t('ui.cookie_preferences')}</h3>
            <Badge variant="secondary" className="text-xs">{t('ui.gdpr_required')}</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBanner(false)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {!showSettings ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              {t('cookie_notice')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={acceptAll} className="flex-1">
                {t('accept_all')}
              </Button>
              <Button onClick={acceptNecessary} variant="outline" className="flex-1">
                {t('accept_necessary')}
              </Button>
              <Button 
                onClick={() => setShowSettings(true)} 
                variant="ghost" 
                className="flex-1"
              >
                <Settings className="mr-2 h-4 w-4" />
                {t('cookie_settings')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Necessary Cookies</h4>
                  <p className="text-sm text-gray-600">Required for basic website functionality</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={preferences.necessary} 
                  disabled 
                  className="h-4 w-4"
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Analytics Cookies</h4>
                  <p className="text-sm text-gray-600">Help us understand website usage</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={preferences.analytics} 
                  onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                  className="h-4 w-4"
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Marketing Cookies</h4>
                  <p className="text-sm text-gray-600">Used for targeted advertising</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={preferences.marketing} 
                  onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                  className="h-4 w-4"
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Functional Cookies</h4>
                  <p className="text-sm text-gray-600">Enable enhanced features</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={preferences.functional} 
                  onChange={(e) => setPreferences(prev => ({ ...prev, functional: e.target.checked }))}
                  className="h-4 w-4"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={savePreferences} className="flex-1">
                Save Preferences
              </Button>
              <Button onClick={() => setShowSettings(false)} variant="outline">
                Back
              </Button>
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-gray-500">
            Read our{' '}
            <button 
              onClick={() => window.open('/privacy-policy', '_blank')}
              className="text-blue-600 underline bg-transparent border-none cursor-pointer"
            >
              {t('privacy_policy')}
            </button>{' '}
            for more information.
          </p>
        </div>
      </Card>
    </div>
  );
}
