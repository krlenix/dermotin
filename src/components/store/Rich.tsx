import { Fragment } from 'react';
import type { ProductFact } from '@/config/store-content';
import { cn } from '@/lib/utils';

/** Tekst iz store-content.ts: **fraza** se ističe (podebljano, tamnije). */
export function Rich({ text, strongClassName }: { text: string; strongClassName?: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={index} className={cn('font-semibold text-ink', strongClassName)}>
            {part.slice(2, -2)}
          </strong>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        )
      )}
    </>
  );
}

/** Uklanja oznake za isticanje (za mesta gde ide običan tekst). */
export function plain(text: string): string {
  return text.replace(/\*\*/g, '');
}

/** Naslov sa „ — “: deo posle crte ide u kurzivu i boji (ritam i karakter). */
export function DashTitle({ text, accentClassName = 'text-coral' }: { text: string; accentClassName?: string }) {
  const index = text.indexOf(' — ');
  if (index < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)} <em className={cn('italic', accentClassName)}>{text.slice(index + 3)}</em>
    </>
  );
}

/** Karakteristike u brojkama: velika serif cifra + kratka oznaka. */
export function FactRow({
  facts,
  variant = 'tiles',
  className,
}: {
  facts: ProductFact[];
  variant?: 'tiles' | 'chips' | 'dark';
  className?: string;
}) {
  if (facts.length === 0) return null;
  if (variant === 'chips') {
    return (
      <ul className={cn('flex flex-wrap gap-1.5', className)}>
        {facts.map((fact) => (
          <li key={fact.label} className="inline-flex items-baseline gap-1 rounded-full bg-sand px-2.5 py-1 text-[12px] leading-none text-ink/75">
            <span className="font-semibold text-coral">{fact.value}</span>
            {fact.label}
          </li>
        ))}
      </ul>
    );
  }
  const dark = variant === 'dark';
  return (
    <ul className={cn('grid grid-cols-3 overflow-hidden rounded-[20px] border', dark ? 'border-paper/15' : 'border-line bg-white', className)}>
      {facts.map((fact, index) => (
        <li key={fact.label} className={cn('px-3 py-4 text-center sm:px-4 sm:py-5', index > 0 && (dark ? 'border-l border-paper/15' : 'border-l border-line'))}>
          <span className={cn('block font-display text-[34px] leading-none sm:text-[42px]', dark ? 'text-[#F2A08C]' : 'text-coral')}>{fact.value}</span>
          <span className={cn('mt-2 block text-[12px] leading-tight sm:text-[13px]', dark ? 'text-paper/70' : 'text-ink/70')}>{fact.label}</span>
        </li>
      ))}
    </ul>
  );
}
