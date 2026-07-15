'use client';

import { cn } from '@/lib/utils';

const LOCALE_LABELS: Record<string, string> = {
  rs: '🇷🇸 Srbija',
  ba: '🇧🇦 Bosna',
  me: '🇲🇪 Crna Gora',
  hr: '🇭🇷 Hrvatska',
};

interface LocaleTabsProps {
  locales: readonly string[];
  value: string;
  onChange: (locale: string) => void;
}

/** Tabovi za izbor lokala (rs/ba/me/hr) — koristi se na više admin stranica */
export function LocaleTabs({ locales, value, onChange }: LocaleTabsProps) {
  return (
    <div className="inline-flex rounded-lg border bg-white p-1 gap-1">
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => onChange(locale)}
          className={cn(
            'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
            value === locale ? 'bg-brand-green text-white' : 'text-gray-600 hover:bg-gray-100'
          )}
        >
          {LOCALE_LABELS[locale] ?? locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
