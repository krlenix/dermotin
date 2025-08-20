import React from 'react';
import { cn } from '@/lib/utils';

interface MarqueeTextProps {
  text: string;
  className?: string;
  speed?: 'slow' | 'medium' | 'fast';
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  backgroundColor?: string;
  textColor?: string;
}

export function MarqueeText({
  text,
  className,
  speed = 'medium',
  direction = 'left',
  pauseOnHover = true,
  backgroundColor = 'bg-red-500',
  textColor = 'text-white'
}: MarqueeTextProps) {
  const speedClasses = {
    slow: 'animate-marquee-slow',
    medium: 'animate-marquee-medium', 
    fast: 'animate-marquee-fast'
  };

  const directionClass = direction === 'right' ? 'animate-marquee-reverse' : '';

  return (
    <div 
      className={cn(
        'relative overflow-hidden whitespace-nowrap',
        'inline-flex items-center justify-center w-fit shrink-0',
        'transition-[color,box-shadow]',
        backgroundColor,
        textColor,
        'py-2 px-4 text-sm font-medium',
        className
      )}
    >
      <div 
        className={cn(
          'inline-block',
          speedClasses[speed],
          directionClass,
          pauseOnHover && 'hover:animation-paused'
        )}
      >
        {/* Repeat text multiple times to ensure continuous scroll */}
        <span className="mr-8">{text}</span>
        <span className="mr-8">{text}</span>
        <span className="mr-8">{text}</span>
        <span className="mr-8">{text}</span>
        <span className="mr-8">{text}</span>
      </div>
    </div>
  );
}
