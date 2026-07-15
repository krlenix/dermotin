'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  className?: string;
}

/** Prikaz ocene 1–5 zvezdicama (popunjene do zaokružene ocene) */
export function RatingStars({ rating, className }: RatingStarsProps) {
  const rounded = Math.round(rating);
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} aria-label={`Ocena ${rating} od 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn('h-3.5 w-3.5', i <= rounded ? 'fill-amber-400 text-amber-400' : 'text-gray-300')}
        />
      ))}
    </span>
  );
}
