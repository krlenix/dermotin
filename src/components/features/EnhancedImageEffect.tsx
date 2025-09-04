'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface EnhancedImageEffectProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  overlayContent?: React.ReactNode;
  effectType?: 'zoom' | 'scale' | 'rotate' | 'parallax';
  scrollEffect?: boolean;
  hoverEffect?: boolean;
  quality?: number;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export default function EnhancedImageEffect({
  src,
  alt,
  width,
  height,
  className,
  overlayContent,
  effectType = 'scale',
  scrollEffect = true,
  hoverEffect = true,
  quality = 80,
  sizes,
  placeholder,
  blurDataURL
}: EnhancedImageEffectProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollEffect) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.2,
        rootMargin: '50px'
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => observer.disconnect();
  }, [scrollEffect]);

  const getEffectClasses = () => {
    const baseClasses = 'transition-all duration-700 ease-out';
    
    if (!scrollEffect && !hoverEffect) return baseClasses;

    let effectClasses = '';

    // Scroll effects
    if (scrollEffect) {
      switch (effectType) {
        case 'zoom':
          effectClasses += isVisible 
            ? 'transform scale-100 opacity-100' 
            : 'transform scale-90 opacity-0';
          break;
        case 'scale':
          effectClasses += isVisible 
            ? 'transform scale-100 opacity-100' 
            : 'transform scale-95 opacity-0';
          break;
        case 'rotate':
          effectClasses += isVisible 
            ? 'transform rotate-0 scale-100 opacity-100' 
            : 'transform -rotate-3 scale-95 opacity-0';
          break;
        case 'parallax':
          effectClasses += isVisible 
            ? 'transform translateY-0 opacity-100' 
            : 'transform translateY-8 opacity-0';
          break;
        default:
          effectClasses += isVisible 
            ? 'transform scale-100 opacity-100' 
            : 'transform scale-95 opacity-0';
      }
    }

    // Hover effects
    if (hoverEffect) {
      switch (effectType) {
        case 'zoom':
          effectClasses += isHovered ? ' scale-110' : '';
          break;
        case 'scale':
          effectClasses += isHovered ? ' scale-105' : '';
          break;
        case 'rotate':
          effectClasses += isHovered ? ' rotate-2 scale-105' : '';
          break;
        case 'parallax':
          effectClasses += isHovered ? ' -translate-y-2 scale-105' : '';
          break;
        default:
          effectClasses += isHovered ? ' scale-105' : '';
      }
    }

    return `${baseClasses} ${effectClasses}`;
  };

  return (
    <div
      ref={imageRef}
      className={cn("relative overflow-hidden", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={getEffectClasses()}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="object-cover w-full h-full"
          loading="lazy"
          quality={quality}
          sizes={sizes}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
        />
      </div>
      
      {overlayContent && (
        <div className={cn(
          "absolute inset-0 transition-all duration-300",
          isHovered ? "bg-black/30" : "bg-black/20"
        )}>
          {overlayContent}
        </div>
      )}
      
      {/* Subtle glow effect on hover */}
      {hoverEffect && (
        <div className={cn(
          "absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none",
          isHovered 
            ? "shadow-2xl shadow-brand-orange/20 ring-2 ring-brand-orange/10" 
            : "shadow-lg"
        )} />
      )}
    </div>
  );
}
