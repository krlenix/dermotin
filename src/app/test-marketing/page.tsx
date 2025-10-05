'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  getMarketingCookies,
  setMarketingCookies,
  extractMarketingParamsFromURL,
  type MarketingParams 
} from '@/utils/marketing-cookies';

export default function TestMarketingPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string[]>([]);
  const [cookies, setCookies] = useState<MarketingParams | null>(null);
  const [sessionData, setSessionData] = useState<string | null>(null);
  const [urlParams, setUrlParams] = useState<Partial<MarketingParams>>({});

  const addStatus = (msg: string) => {
    setStatus(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  useEffect(() => {
    addStatus('🚀 Page loaded');
    addStatus(`Environment: ${process.env.NODE_ENV}`);
    addStatus(`Domain: ${window.location.hostname}`);
    
    // Check URL parameters
    const extracted = extractMarketingParamsFromURL(searchParams);
    setUrlParams(extracted);
    addStatus(`URL params found: ${JSON.stringify(extracted)}`);
    
    // If we have URL params, try to set them
    if (Object.keys(extracted).length > 0) {
      addStatus('⚡ Setting marketing cookies...');
      try {
        setMarketingCookies(extracted);
        addStatus('✅ setMarketingCookies() called successfully');
      } catch (error) {
        addStatus(`❌ Error calling setMarketingCookies: ${error}`);
      }
    }
    
    // Check what's in sessionStorage
    const sessionStr = sessionStorage.getItem('temp-marketing-params');
    setSessionData(sessionStr);
    addStatus(`SessionStorage: ${sessionStr || 'EMPTY'}`);
    
    // Check what's in cookies
    const cookieData = getMarketingCookies();
    setCookies(cookieData);
    addStatus(`Cookies retrieved: ${JSON.stringify(cookieData)}`);
    
    // Check raw cookie string
    addStatus(`Raw cookies: ${document.cookie || 'EMPTY'}`);
    
    // Check consent
    const consent = localStorage.getItem('cookie-consent');
    addStatus(`Cookie consent: ${consent || 'NOT SET'}`);
  }, [searchParams]);

  const testSetCookie = () => {
    const testData = {
      campaign_id: 'MANUAL_TEST',
      adset_id: '999',
      medium: 'test',
      aff_id: '123'
    };
    
    addStatus('🧪 Manual test: Setting cookie...');
    setMarketingCookies(testData);
    
    setTimeout(() => {
      const result = getMarketingCookies();
      addStatus(`🧪 Manual test result: ${JSON.stringify(result)}`);
      setCookies(result);
      setSessionData(sessionStorage.getItem('temp-marketing-params'));
    }, 100);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '900px', margin: '0 auto' }}>
      <h1>🧪 Marketing Cookies Test Page</h1>
      <p style={{ background: '#f0f0f0', padding: '10px' }}>
        Test URL: <code>{window.location.href}</code>
      </p>
      
      <h2>📊 Status Log</h2>
      <div style={{ background: '#1e1e1e', color: '#00ff00', padding: '15px', borderRadius: '5px', maxHeight: '300px', overflow: 'auto' }}>
        {status.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>
      
      <h2>📋 Current Data</h2>
      <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '5px' }}>
        <h3>URL Parameters:</h3>
        <pre>{JSON.stringify(urlParams, null, 2)}</pre>
        
        <h3>SessionStorage:</h3>
        <pre>{sessionData || 'EMPTY'}</pre>
        
        <h3>Cookies (via getMarketingCookies):</h3>
        <pre>{JSON.stringify(cookies, null, 2)}</pre>
        
        <h3>Raw document.cookie:</h3>
        <pre>{document.cookie || 'EMPTY'}</pre>
      </div>
      
      <h2>🧪 Manual Tests</h2>
      <button 
        onClick={testSetCookie}
        style={{ 
          padding: '10px 20px', 
          background: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Test Set Cookie Manually
      </button>
      
      <h2>📝Test URLs</h2>
      <ul>
        <li><a href="?campaign_id=TEST123&adset_id=456&medium=facebook&aff_id=55" onClick={(e) => { e.preventDefault(); window.location.href = '?campaign_id=TEST123&adset_id=456&medium=facebook&aff_id=55'; }}>Test with parameters</a></li>
        <li><button onClick={() => window.location.href = '/test-marketing'} style={{ background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Clear parameters</button></li>
      </ul>
      <h2>✅ What Should Happen</h2>
      <ol>
        <li>URL parameters should be extracted</li>
        <li>SessionStorage should be set (always)</li>
        <li>Cookies should be set (if consent given or not set)</li>
        <li>getMarketingCookies() should return the data</li>
      </ol>
    </div>
  );
}
