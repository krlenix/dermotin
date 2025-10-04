'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Settings, Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { applyStoredMarketingParams } from '@/utils/marketing-cookies';

interface CookieConsentProps {
  isEU: boolean;
}

export function CookieConsent({ isEU }: CookieConsentProps) {
  const t = useTranslations('gdpr');
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    marketing: true // Default to enabled for better user experience
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
      marketing: true
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    
    // Apply any stored marketing parameters from sessionStorage to cookies
    applyStoredMarketingParams();
    
    // Dispatch custom event to notify pixel trackers
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cookieConsentUpdated', {
        detail: allAccepted
      }));
    }
    
    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      marketing: false
    };
    setPreferences(necessaryOnly);
    localStorage.setItem('cookie-consent', JSON.stringify(necessaryOnly));
    
    // Dispatch custom event (marketing params will stay in sessionStorage)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cookieConsentUpdated', {
        detail: necessaryOnly
      }));
    }
    
    setShowBanner(false);
    setShowSettings(false);
  };

  const savePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    
    // If marketing consent is given, apply stored marketing params
    if (preferences.marketing) {
      applyStoredMarketingParams();
    }
    
    // Dispatch custom event to notify pixel trackers
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cookieConsentUpdated', {
        detail: preferences
      }));
    }
    
    setShowBanner(false);
    setShowSettings(false);
  };

  if (!isEU || !showBanner) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-end justify-center p-4">
      <div className="w-full max-w-2xl bg-white border border-gray-300 shadow-2xl rounded-lg p-6 text-gray-900">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">{t('cookie_settings')}</h3>
            <Badge variant="secondary" className="text-xs">GDPR</Badge>
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
            <p className="text-sm text-gray-700">
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
                  <h4 className="font-medium">{t('necessary_cookies')}</h4>
                  <p className="text-sm text-gray-700">{t('necessary_cookies_desc')}</p>
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
                  <h4 className="font-medium">{t('marketing_cookies')}</h4>
                  <p className="text-sm text-gray-700">{t('marketing_cookies_desc')}</p>
                  <div className="mt-2 text-xs text-gray-600">
                    <div className="font-medium mb-1">Tracking parameters:</div>
                    <div>• campaign_id, adset_id, ad_id, aff_id, medium</div>
                    <div>• Meta (Facebook) Pixel</div>
                    <div>• TikTok Pixel</div>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={preferences.marketing} 
                  onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                  className="h-4 w-4"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={savePreferences} className="flex-1">
                {t('save_preferences')}
              </Button>
              <Button onClick={() => setShowSettings(false)} variant="outline">
                {t('back')}
              </Button>
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-gray-600">
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
      </div>
    </div>
  );
}
