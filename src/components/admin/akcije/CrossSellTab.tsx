'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Info } from 'lucide-react';
import type { Product } from '@/config/types';
import { adminFetch, AdminApiError } from '../api';
import { ProductMultiSelect } from '../ProductMultiSelect';
import { ProductSaveResponse, sameIds, sortedProducts } from './helpers';

interface CrossSellTabProps {
  locale: string;
  products: Record<string, Product>;
  onRefresh: () => Promise<void> | void;
}

/** Tab „Cross-sell" — po proizvodu bira koje proizvode nudimo uz njega */
export function CrossSellTab({ locale, products, onRefresh }: CrossSellTabProps) {
  // Neodrađene izmene po proizvodu; ključ postoji samo dok korisnik menja selekciju
  const [drafts, setDrafts] = useState<Record<string, string[]>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const list = sortedProducts(products);

  const save = async (product: Product) => {
    const selection = drafts[product.id] ?? product.crossSells ?? [];
    setSavingId(product.id);
    try {
      const body: Product = {
        ...product,
        crossSells: selection.length > 0 ? selection : undefined,
      };
      await adminFetch<ProductSaveResponse>(`/api/admin/products/${locale}/${product.id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      toast.success(`Cross-sell za „${product.name}" je sačuvan.`);
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[product.id];
        return next;
      });
      await onRefresh();
    } catch (error) {
      toast.error(error instanceof AdminApiError ? error.message : 'Snimanje nije uspelo.', {
        description:
          error instanceof AdminApiError && error.issues?.length ? error.issues.join('\n') : undefined,
      });
    } finally {
      setSavingId(null);
    }
  };

  if (list.length === 0) {
    return <p className="text-sm text-muted-foreground">Nema proizvoda u ovom lokalu.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 text-sm text-gray-700 bg-blue-50 border border-blue-200 rounded-md px-3 py-2">
        <Info className="h-4 w-4 mt-0.5 shrink-0 text-blue-600" />
        <p>Cross-sell proizvodi se prikazuju u korpi i na checkout stranici.</p>
      </div>

      {list.map((product) => {
        const original = product.crossSells ?? [];
        const selection = drafts[product.id] ?? original;
        const dirty = !sameIds(selection, original);
        return (
          <Card key={product.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-base">
                  {product.name}
                  <span className="text-muted-foreground text-sm font-normal"> — /{product.slug}</span>
                </CardTitle>
                <Button
                  size="sm"
                  className="bg-brand-orange hover:bg-brand-orange/90 text-white shrink-0"
                  disabled={!dirty || savingId === product.id}
                  onClick={() => save(product)}
                >
                  {savingId === product.id ? 'Snimanje…' : 'Sačuvaj'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ProductMultiSelect
                products={list}
                excludeId={product.id}
                selected={selection}
                onChange={(ids) => setDrafts((prev) => ({ ...prev, [product.id]: ids }))}
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
