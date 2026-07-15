'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Product } from '@/config/types';
import { adminFetch } from '@/components/admin/api';
import { LocaleTabs } from '@/components/admin/LocaleTabs';
import { BundlesTab } from '@/components/admin/akcije/BundlesTab';
import { CrossSellTab } from '@/components/admin/akcije/CrossSellTab';
import { UpsellTab } from '@/components/admin/akcije/UpsellTab';
import type { ProductsResponse } from '@/components/admin/akcije/helpers';

const LOCALES = ['rs', 'ba', 'me', 'hr'] as const;

type InnerTab = 'bundles' | 'cross-sell' | 'upsell';

const INNER_TABS: { id: InnerTab; label: string }[] = [
  { id: 'bundles', label: 'Bundlovi' },
  { id: 'cross-sell', label: 'Cross-sell' },
  { id: 'upsell', label: 'Upsell' },
];

export default function AkcijePage() {
  const [locale, setLocale] = useState<string>('rs');
  const [tab, setTab] = useState<InnerTab>('bundles');
  const [products, setProducts] = useState<Record<string, Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await adminFetch<ProductsResponse>(`/api/admin/products?locale=${locale}`);
      setProducts(data.products);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Greška pri učitavanju proizvoda.');
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    setLoading(true);
    setProducts(null);
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Akcije i bundlovi</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upravljanje setovima proizvoda (bundlovima), cross-sell i upsell ponudama po lokalu.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <LocaleTabs locales={LOCALES} value={locale} onChange={setLocale} />
        <div className="inline-flex rounded-lg border bg-white p-1 gap-1">
          {INNER_TABS.map((innerTab) => (
            <button
              key={innerTab.id}
              type="button"
              onClick={() => setTab(innerTab.id)}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                tab === innerTab.id ? 'bg-brand-green text-white' : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              {innerTab.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 flex items-center justify-between gap-3">
          <p>{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setLoading(true);
              load();
            }}
          >
            Pokušaj ponovo
          </Button>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Učitavanje…</p>
      ) : (
        products && (
          <>
            {tab === 'bundles' && (
              <BundlesTab key={`bundles-${locale}`} locale={locale} products={products} onRefresh={load} />
            )}
            {tab === 'cross-sell' && (
              <CrossSellTab key={`cross-${locale}`} locale={locale} products={products} onRefresh={load} />
            )}
            {tab === 'upsell' && (
              <UpsellTab key={`upsell-${locale}`} locale={locale} products={products} onRefresh={load} />
            )}
          </>
        )
      )}
    </div>
  );
}
