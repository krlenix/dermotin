/**
 * Cookie Consent Utilities
 * Helper functions to check and manage cookie consent preferences
 */

export interface CookieConsent {
  necessary: boolean;
  marketing: boolean;
}

/**
 * Check if marketing cookies are allowed
 * For non-EU users, always return true (implied consent)
 * For EU users, check their explicit consent
 */
export function hasMarketingConsent(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const consent = localStorage.getItem('cookie-consent');
    
    // If no consent recorded, assume implied consent (for non-EU or before banner interaction)
    if (!consent) {
      return true;
    }

    const preferences: CookieConsent = JSON.parse(consent);
    return preferences.marketing === true;
  } catch (error) {
    console.error('Error reading cookie consent:', error);
    return false;
  }
}

/**
 * Get current cookie consent preferences
 */
export function getCookieConsent(): CookieConsent | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      return null;
    }
    return JSON.parse(consent) as CookieConsent;
  } catch (error) {
    console.error('Error reading cookie consent:', error);
    return null;
  }
}

/**
 * Set cookie consent preferences
 */
export function setCookieConsent(preferences: CookieConsent): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    
    // Dispatch custom event to notify components
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', {
      detail: preferences
    }));
  } catch (error) {
    console.error('Error setting cookie consent:', error);
  }
}

/**
 * Check if user is from EU and needs explicit consent
 */
export function needsExplicitConsent(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    // Check if consent banner was shown (stored in localStorage)
    const consent = localStorage.getItem('cookie-consent');
    return consent !== null; // If consent is stored, user needed explicit consent
  } catch {
    return false;
  }
}
