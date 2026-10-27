'use client';

import { useTranslations } from 'next-intl';
import { Gift, Plus } from 'lucide-react';
import type { CountryConfig } from '@/config/countries';
import type { Product, ProductVariant } from '@/config/products';
import { getStoreVisual } from '@/config/store-content';
import { cn } from '@/lib/utils';
import { ProductStage } from './ProductCard';
import { formatMoney } from './format';

export interface BundlePart {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  gratis: boolean;
}

/** „U paketu dobijate“: svaki proizvod sa velikom fotografijom, pakovanjem i vrednošću. */
export function BundleContents({ parts, countryConfig, className }: { parts: BundlePart[]; countryConfig: CountryConfig; className?: string }) {
  const t = useTranslations('store');
  if (parts.length === 0) return null;
  const total = parts.reduce((sum, part) => sum + (part.variant ? part.variant.price * part.quantity : 0), 0);

  return (
    <div className={className}>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.2em] text-ink/70">{t('pdp.in_the_set')}</p>
        {total > 0 && <p className="text-[12.5px] text-ink/65">{t('pdp.set_value', { amount: formatMoney(total, countryConfig) })}</p>}
      </div>
      <div className={cn('relative grid gap-3', parts.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3')}>
        {parts.map((part) => {
          const value = part.variant ? part.variant.price * part.quantity : 0;
          return (
            <div key={part.product.id} className={cn('overflow-hidden rounded-[20px] border bg-white', part.gratis ? 'border-coral/40' : 'border-line')}>
              <ProductStage src={getStoreVisual(part.product).packshot} alt={part.product.name} sizes="(max-width: 768px) 50vw, 300px" className="aspect-[4/3]">
                {part.gratis && (
                  <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-coral px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-white">
                    <Gift className="h-3 w-3" />
                    {t('pdp.gratis')}
                  </span>
                )}
                {part.quantity > 1 && (
                  <span className="absolute right-2.5 top-2.5 rounded-full bg-forest px-2.5 py-1 text-[11px] font-semibold text-paper">× {part.quantity}</span>
                )}
              </ProductStage>
              <div className="p-3.5 sm:p-4">
                <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-ink sm:text-[14px]">{part.product.name}</p>
                {part.variant?.size && <p className="mt-0.5 text-[12px] font-medium text-moss">{part.variant.size}</p>}
                <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-snug text-ink/75 sm:text-[13px]">{part.product.shortDescription}</p>
                {value > 0 && (
                  <p className="mt-2.5 border-t border-line pt-2.5 text-[12.5px] text-ink/65">
                    {part.gratis ? (
                      <>
                        <span className="line-through">{formatMoney(value, countryConfig)}</span>{' '}
                        <span className="font-semibold text-coral">→ {formatMoney(0, countryConfig)}</span>
                      </>
                    ) : (
                      t('pdp.single_value', { amount: formatMoney(value, countryConfig) })
                    )}
                  </p>
                )}
              </div>
            </div>
          );
        })}
        {parts.length === 2 && (
          // Plus na sredini između fotografija (visina fotografije ≈ 3/8 širine reda)
          <div className="pointer-events-none absolute inset-x-0 top-0 flex aspect-[8/3] items-center justify-center">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-coral text-white shadow-[0_8px_20px_-8px_rgba(201,83,58,0.8)] ring-4 ring-paper">
              <Plus className="h-4 w-4" strokeWidth={2.5} />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
