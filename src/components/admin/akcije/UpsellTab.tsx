'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Info } from 'lucide-react';
import type { Product } from '@/config/types';
import { adminFetch, AdminApiError } from '../api';
import { ProductMultiSelect } from '../ProductMultiSelect';
import { LOCALE_CURRENCY, ProductSaveResponse, sameIds, sortedProducts } from './helpers';

interface UpsellDraft {
  products: string[];
  discountPercentage: string;
  bundlePrice: string;
}

interface UpsellTabProps {
  locale: string;
  products: Record<string, Product>;
  onRefresh: () => Promise<void> | void;
}

/** Draft izveden iz snimljenog stanja proizvoda */
function draftFromProduct(product: Product): UpsellDraft {
  return {
    products: product.upsells?.products ?? [],
    discountPercentage:
      product.upsells?.discountPercentage !== undefined ? String(product.upsells.discountPercentage) : '',
    bundlePrice: product.upsells?.bundlePrice !== undefined ? String(product.upsells.bundlePrice) : '',
  };
}

/** Tab „Upsell" — po proizvodu bira upsell ponudu za checkout funel */
export function UpsellTab({ locale, products, onRefresh }: UpsellTabProps) {
  const [drafts, setDrafts] = useState<Record<string, UpsellDraft>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const list = sortedProducts(products);
  const currency = LOCALE_CURRENCY[locale] ?? 'RSD';

  const updateDraft = (product: Product, patch: Partial<UpsellDraft>) => {
    setDrafts((prev) => ({
      ...prev,
      [product.id]: { ...(prev[product.id] ?? draftFromProduct(product)), ...patch },
    }));
  };

  const save = async (product: Product) => {
    const draft = drafts[product.id] ?? draftFromProduct(product);
    let upsells: Product['upsells'];

    if (draft.products.length === 0) {
      upsells = undefined;
    } else {
      const discountText = draft.discountPercentage.trim();
      const bundleText = draft.bundlePrice.trim();
      const discount = discountText !== '' ? Number(discountText) : undefined;
      const bundlePrice = bundleText !== '' ? Number(bundleText) : undefined;

      if (discount !== undefined && (Number.isNaN(discount) || discount < 0 || discount > 100)) {
        toast.error('Popust mora biti broj između 0 i 100.');
        return;
      }
      if (bundlePrice !== undefined && (Number.isNaN(bundlePrice) || bundlePrice < 0)) {
        toast.error('Bundle cena mora biti pozitivan broj.');
        return;
      }
      upsells = { products: draft.products, discountPercentage: discount, bundlePrice };
    }

    setSavingId(product.id);
    try {
      const body: Product = { ...product, upsells };
      await adminFetch<ProductSaveResponse>(`/api/admin/products/${locale}/${product.id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      toast.success(`Upsell za „${product.name}" je sačuvan.`);
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
        <p>Upsell ponude se prikazuju na checkout funelu.</p>
      </div>

      {list.map((product) => {
        const original = draftFromProduct(product);
        const draft = drafts[product.id] ?? original;
        const dirty =
          !sameIds(draft.products, original.products) ||
          draft.discountPercentage.trim() !== original.discountPercentage ||
          draft.bundlePrice.trim() !== original.bundlePrice;
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
            <CardContent className="space-y-4">
              <ProductMultiSelect
                products={list}
                excludeId={product.id}
                selected={draft.products}
                onChange={(ids) => updateDraft(product, { products: ids })}
              />
              <div className="flex flex-wrap gap-4">
                <div className="space-y-1">
                  <Label htmlFor={`upsell-discount-${product.id}`} className="text-xs">
                    Popust %
                  </Label>
                  <Input
                    id={`upsell-discount-${product.id}`}
                    type="number"
                    min={0}
                    max={100}
                    className="h-9 w-28"
                    placeholder="npr. 20"
                    value={draft.discountPercentage}
                    disabled={draft.products.length === 0}
                    onChange={(e) => updateDraft(product, { discountPercentage: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`upsell-bundle-${product.id}`} className="text-xs">
                    Bundle cena ({currency}, opciono)
                  </Label>
                  <Input
                    id={`upsell-bundle-${product.id}`}
                    type="number"
                    min={0}
                    className="h-9 w-36"
                    placeholder="npr. 2990"
                    value={draft.bundlePrice}
                    disabled={draft.products.length === 0}
                    onChange={(e) => updateDraft(product, { bundlePrice: e.target.value })}
                  />
                </div>
              </div>
              {draft.products.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Bez izabranih proizvoda upsell ponuda se uklanja pri snimanju.
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
