'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { CURRENCIES, emptyVariantDraft, type Currency, type VariantDraft } from './draft';

interface VariantsSectionProps {
  variants: VariantDraft[];
  onChange: (variants: VariantDraft[]) => void;
  /** Podrazumevana valuta za nove varijante (prema lokalu) */
  defaultCurrency: Currency;
}

/** Sekcija VARIJANTE: red po varijanti, tačno jedna default (radio) */
export function VariantsSection({ variants, onChange, defaultCurrency }: VariantsSectionProps) {
  const update = (index: number, patch: Partial<VariantDraft>) => {
    onChange(variants.map((variant, i) => (i === index ? { ...variant, ...patch } : variant)));
  };

  const setDefault = (index: number) => {
    onChange(variants.map((variant, i) => ({ ...variant, isDefault: i === index })));
  };

  const add = () => {
    const currency = variants.length > 0 ? variants[variants.length - 1].currency : defaultCurrency;
    onChange([...variants, emptyVariantDraft(currency, variants.length + 1)]);
  };

  const remove = (index: number) => {
    if (variants.length <= 1) return;
    const next = variants.filter((_, i) => i !== index);
    if (!next.some((variant) => variant.isDefault) && next.length > 0) {
      next[0] = { ...next[0], isDefault: true };
    }
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {variants.map((variant, index) => (
        <div key={index} className="border rounded-lg p-3 bg-gray-50/60 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input
                type="radio"
                name="default-variant"
                checked={variant.isDefault}
                onChange={() => setDefault(index)}
                className="accent-[#FF6B35]"
              />
              Podrazumevana varijanta
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              onClick={() => remove(index)}
              disabled={variants.length <= 1}
              aria-label="Obriši varijantu"
              title={variants.length <= 1 ? 'Bar jedna varijanta je obavezna' : 'Obriši varijantu'}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">ID</Label>
              <Input value={variant.id} onChange={(e) => update(index, { id: e.target.value })} placeholder="npr. fungel-1" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">SKU</Label>
              <Input value={variant.sku} onChange={(e) => update(index, { sku: e.target.value })} placeholder="npr. FNG-50" />
            </div>
            <div className="space-y-1 col-span-2">
              <Label className="text-xs">Naziv</Label>
              <Input value={variant.name} onChange={(e) => update(index, { name: e.target.value })} placeholder="npr. 1x FUNGEL 50ml" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Veličina (opciono)</Label>
              <Input value={variant.size} onChange={(e) => update(index, { size: e.target.value })} placeholder="npr. 50ml" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Količina (opciono)</Label>
              <Input type="number" min={1} value={variant.quantity} onChange={(e) => update(index, { quantity: e.target.value })} placeholder="npr. 1" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Cena</Label>
              <Input type="number" min={0} step="0.01" value={variant.price} onChange={(e) => update(index, { price: e.target.value })} placeholder="0" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Akcijska cena (opciono)</Label>
              <Input type="number" min={0} step="0.01" value={variant.discountPrice} onChange={(e) => update(index, { discountPrice: e.target.value })} placeholder="—" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Valuta</Label>
              <Select value={variant.currency} onValueChange={(currency) => update(index, { currency: currency as Currency })}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" className="gap-1" onClick={add}>
        <Plus className="h-3.5 w-3.5" /> Dodaj varijantu
      </Button>
    </div>
  );
}
