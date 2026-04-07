'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type AnimatedHighlightProps = {
  children: ReactNode;
  variant?: 'green' | 'orange';
  className?: string;
  delayMs?: number;
};

export function AnimatedHighlight({
  children,
  variant = 'green',
  className = '',
  delayMs = 0,
}: AnimatedHighlightProps) {
  const [isVisible, setIsVisible] = useState(false);
  const highlightRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const node = highlightRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          window.setTimeout(() => {
            setIsVisible(true);
          }, delayMs);
          observer.disconnect();
        }
      },
      {
        threshold: 0.35,
        rootMargin: '0px 0px -8% 0px',
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [delayMs]);

  return (
    <span
      ref={highlightRef}
      className={`highlight-reveal highlight-reveal--${variant} ${isVisible ? 'is-visible' : ''} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
