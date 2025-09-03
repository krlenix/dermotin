'use client';

import { useEffect } from 'react';

export function PerformanceOptimizer() {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload critical images
      const criticalImages = [
        '/images/main/hero-image.webp',
        '/images/main/logo.png'
      ];
      
      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    // Optimize scroll performance
    const optimizeScrollPerformance = () => {
      let ticking = false;
      
      const handleScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            // Handle scroll animations efficiently
            const elements = document.querySelectorAll('.animate-on-scroll');
            elements.forEach(element => {
              const rect = element.getBoundingClientRect();
              if (rect.top < window.innerHeight && rect.bottom > 0) {
                element.classList.add('animate');
              }
            });
            ticking = false;
          });
          ticking = true;
        }
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    };

    // Initialize optimizations
    preloadCriticalResources();
    const cleanupScroll = optimizeScrollPerformance();
    
    return cleanupScroll;
  }, []);

  return null;
}
