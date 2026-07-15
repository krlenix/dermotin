'use client';

import { cn } from '@/lib/utils';

interface StatusToggleProps {
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
  /** Tekst kada je uključeno (podrazumevano „Uključen") */
  onLabel?: string;
  /** Tekst kada je isključeno (podrazumevano „Isključen") */
  offLabel?: string;
  ariaLabel?: string;
}

/** Veliki, jasan prekidač statusa: zelen kada je uključen, siv kada je isključen. */
export function StatusToggle({
  enabled,
  onToggle,
  disabled,
  onLabel = 'Uključen',
  offLabel = 'Isključen',
  ariaLabel,
}: StatusToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors select-none whitespace-nowrap',
        'disabled:cursor-not-allowed disabled:opacity-60',
        enabled
          ? 'border-green-600 bg-green-600 text-white hover:bg-green-700'
          : 'border-gray-300 bg-gray-100 text-gray-500 hover:bg-gray-200'
      )}
    >
      <span
        aria-hidden
        className={cn('h-2.5 w-2.5 shrink-0 rounded-full', enabled ? 'bg-white' : 'bg-gray-400')}
      />
      {enabled ? onLabel : offLabel}
    </button>
  );
}
