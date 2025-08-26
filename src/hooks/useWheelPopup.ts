import { useState, useEffect, useCallback } from 'react';
import { WheelPopupConfig } from '@/types/wheel';

export const useWheelPopup = (config: WheelPopupConfig) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  // Check if popup has been shown before
  const checkIfShownBefore = useCallback((): boolean => {
    if (!config.showOnlyOnce) return false;
    
    try {
      // Check localStorage first
      const localStorage = window.localStorage.getItem(config.cookieName);
      if (localStorage) return true;
      
      // Check cookies as fallback
      const cookies = document.cookie.split(';');
      return cookies.some(cookie => 
        cookie.trim().startsWith(`${config.cookieName}=`)
      );
    } catch (error) {
      console.warn('Failed to check popup storage:', error);
      return false;
    }
  }, [config.cookieName, config.showOnlyOnce]);

  // Mark popup as shown
  const markAsShown = useCallback(() => {
    if (!config.showOnlyOnce) return;
    
    try {
      // Set localStorage
      window.localStorage.setItem(config.cookieName, 'true');
      
      // Set cookie as fallback (30 days)
      const expires = new Date();
      expires.setDate(expires.getDate() + 30);
      document.cookie = `${config.cookieName}=true; expires=${expires.toUTCString()}; path=/`;
      
      setHasShown(true);
    } catch (error) {
      console.warn('Failed to save popup state:', error);
    }
  }, [config.cookieName, config.showOnlyOnce]);

  // Show the popup
  const showPopup = useCallback(() => {
    console.log('🎡 showPopup called');
    console.log('🎡 config.enabled:', config.enabled);
    console.log('🎡 config.showOnlyOnce:', config.showOnlyOnce);
    console.log('🎡 hasShown:', hasShown);
    
    if (!config.enabled) {
      console.log('🎡 showPopup: Not enabled');
      return;
    }
    if (config.showOnlyOnce && hasShown) {
      console.log('🎡 showPopup: Already shown this session');
      return;
    }
    if (config.showOnlyOnce && checkIfShownBefore()) {
      console.log('🎡 showPopup: Already shown before (storage)');
      setHasShown(true);
      return;
    }
    
    console.log('🎡 showPopup: Setting visible to true');
    setIsVisible(true);
    markAsShown();
  }, [config.enabled, config.showOnlyOnce, hasShown, checkIfShownBefore, markAsShown]);

  // Hide the popup
  const hidePopup = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Force show (for testing)
  const forceShow = useCallback(() => {
    setIsVisible(true);
  }, []);

  // Reset (clear storage and allow showing again)
  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(config.cookieName);
      
      // Clear cookie
      document.cookie = `${config.cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
      
      setHasShown(false);
    } catch (error) {
      console.warn('Failed to reset popup state:', error);
    }
  }, [config.cookieName]);

  // Initialize popup timer
  useEffect(() => {
    console.log('🎡 useWheelPopup: Initializing with config:', config);
    
    if (!config.enabled) {
      console.log('🎡 useWheelPopup: Disabled by config');
      return;
    }
    
    const alreadyShown = config.showOnlyOnce && checkIfShownBefore();
    if (alreadyShown) {
      console.log('🎡 useWheelPopup: Already shown before');
      setHasShown(true);
      return;
    }

    console.log(`🎡 useWheelPopup: Setting timer for ${config.delayMs}ms`);
    const timer = setTimeout(() => {
      console.log('🎡 useWheelPopup: Timer fired, showing popup');
      showPopup();
    }, config.delayMs);

    return () => {
      console.log('🎡 useWheelPopup: Cleaning up timer');
      clearTimeout(timer);
    };
  }, [config, checkIfShownBefore, showPopup]);

  // Keyboard event handling
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        hidePopup();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Focus trap for accessibility
    const popup = document.querySelector('[data-wheel-popup]');
    if (popup) {
      const focusableElements = popup.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, hidePopup]);

  // Prevent body scroll when popup is visible
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  return {
    isVisible,
    hasShown,
    showPopup,
    hidePopup,
    forceShow,
    reset,
  };
};
