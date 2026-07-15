'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import type { Product } from '@/config/types';
import type { BundleItemDraft } from './draft';

const DEFAULT_VARIANT_VALUE = '__default__';

interface BundleSectionProps {
  isBundle: boolean;
  onToggleBundle: (isBundle: boolean) => void;
  items: BundleItemDraft[];
  onChangeItems: (items: BundleItemDraft[]) => void;
  /** Svi proizvodi lokala iz kojih se biraju komponente seta */
  products: Product[];
  /** ID proizvoda koji se uređuje — isključen iz izbora */
  excludeId?: string;
}

/** Sekcija BUNDLE: checkbox „Ovo je bundle/set" + editor stavki seta */
export function BundleSection({ isBundle, onToggleBundle, items, onChangeItems, products, excludeId }: BundleSectionProps) {
  const available = products.filter((product) => product.id !== excludeId);

  const update = (index: number, patch: Partial<BundleItemDraft>) => {
    onChangeItems(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
        <Checkbox checked={isBundle} onCheckedChange={(checked) => onToggleBundle(checked === true)} />
        Ovo je bundle/set (sastoji se od drugih proizvoda)
      </label>

      {isBundle && (
        <div className="space-y-3">
          {items.length === 0 && <p className="text-sm text-muted-foreground">Set još nema stavki.</p>}
          {items.map((item, index) => {
            const selectedProduct = available.find((product) => product.id === item.productId);
            return (
              <div key={index} className="border rounded-lg p-3 bg-gray-50/60 grid grid-cols-1 md:grid-cols-[1fr_1fr_120px_auto] gap-2 items-end">
                <div className="space-y-1">
                  <Label className="text-xs">Proizvod</Label>
                  <Select
                    value={item.productId || undefined}
                    onValueChange={(productId) => update(index, { productId, variantId: '' })}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Izaberi proizvod…" />
                    </SelectTrigger>
                    <SelectContent>
                      {available.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Varijanta (opciono)</Label>
                  <Select
                    value={item.variantId || DEFAULT_VARIANT_VALUE}
                    onValueChange={(variantId) => update(index, { variantId: variantId === DEFAULT_VARIANT_VALUE ? '' : variantId })}
                    disabled={!selectedProduct}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Podrazumevana" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={DEFAULT_VARIANT_VALUE}>Podrazumevana varijanta</SelectItem>
                      {(selectedProduct?.variants ?? []).map((variant) => (
                        <SelectItem key={variant.id} value={variant.id}>
                          {variant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Količina</Label>
                  <Input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => update(index, { quantity: e.target.value })}
                    className="bg-white"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 text-red-600 hover:text-red-700 justify-self-start md:justify-self-auto"
                  onClick={() => onChangeItems(items.filter((_, i) => i !== index))}
                  aria-label="Ukloni stavku"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => onChangeItems([...items, { productId: '', variantId: '', quantity: '1' }])}
          >
            <Plus className="h-3.5 w-3.5" /> Dodaj stavku seta
          </Button>
        </div>
      )}
    </div>
  );
}
