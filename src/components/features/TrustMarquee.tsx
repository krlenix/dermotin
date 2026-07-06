'use client';

import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface TrustMarqueeProps {
  className?: string;
}

export function TrustMarquee({ className = '' }: TrustMarqueeProps) {
  const t = useTranslations();

  const items = [
    t('homepage.trust_natural_ingredients'),
    t('homepage.trust_dermatologically_tested'),
    t('homepage.trust_no_parabens'),
    t('homepage.feature_shipping_title'),
    t('homepage.feature_guarantee_title'),
    t('homepage.trust_clinically_proven'),
  ];

  // Each strip repeats the items 3x so it is always wider than the viewport,
  // and the strip is rendered twice so the -50% animation loops seamlessly.
  const repeatedItems = [...items, ...items, ...items];

  const strip = (ariaHidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden}>
      {repeatedItems.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="inline-flex shrink-0 items-center gap-2 px-5 text-sm font-bold tracking-[0.02em] text-white md:px-7"
        >
          <Check className="h-4 w-4 shrink-0 text-white/90" strokeWidth={3} />
          {item}
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`relative overflow-hidden bg-[linear-gradient(90deg,#2f6f4a,#358055_50%,#2f6f4a)] py-3 ${className}`}
    >
      <div className="flex w-max animate-trust-marquee">
        {strip(false)}
        {strip(true)}
      </div>
    </div>
  );
}
