'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { isPackshot } from '@/config/store-content';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  alt: string;
  badge?: React.ReactNode;
}

/** Lagana galerija: scroll-snap na mobilnom (prevlačenje prstom), sličice na desktopu. */
export function ProductGallery({ images, alt, badge }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const goTo = (index: number) => {
    setActive(index);
    const track = trackRef.current;
    if (track) track.scrollTo({ left: index * track.clientWidth, behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-[28px]">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={(event) => {
            const el = event.currentTarget;
            const index = Math.round(el.scrollLeft / el.clientWidth);
            if (index !== active) setActive(index);
          }}
        >
          {images.map((src, index) => (
            <div key={src} className={cn('relative aspect-square w-full shrink-0 snap-center', isPackshot(src) ? 'store-stage' : 'bg-sand')}>
              <Image
                src={src}
                alt={`${alt} ${index + 1}`}
                fill
                priority={index === 0}
                sizes="(max-width: 1024px) 100vw, 55vw"
                className={isPackshot(src) ? 'object-contain' : 'object-cover'}
              />
            </div>
          ))}
        </div>
        {badge && <div className="pointer-events-none absolute left-5 top-5">{badge}</div>}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 md:hidden">
            {images.map((src, index) => (
              <button
                key={src}
                type="button"
                aria-label={`${index + 1}`}
                onClick={() => goTo(index)}
                className={cn('h-1.5 rounded-full transition-all', index === active ? 'w-6 bg-ink' : 'w-1.5 bg-ink/25')}
              />
            ))}
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 hidden grid-cols-5 gap-3 md:grid">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`${alt} ${index + 1}`}
              className={cn(
                'relative aspect-square overflow-hidden rounded-[16px] transition',
                isPackshot(src) ? 'store-stage' : 'bg-sand',
                index === active ? 'outline-2 outline-offset-2 outline-ink/70' : 'opacity-60 hover:opacity-100'
              )}
            >
              <Image src={src} alt="" fill sizes="120px" className={isPackshot(src) ? 'object-contain' : 'object-cover'} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
