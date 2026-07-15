'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { Product } from '@/config/types';

interface ProductMultiSelectProps {
  /** Svi proizvodi lokala iz kojih se bira */
  products: Product[];
  /** Selektovani ID-jevi */
  selected: string[];
  onChange: (ids: string[]) => void;
  /** ID proizvoda koji se isključuje iz liste (proizvod koji se upravo uređuje) */
  excludeId?: string;
}

/** Checkbox lista proizvoda — za crossSells / upsells / bundle stavke */
export function ProductMultiSelect({ products, selected, onChange, excludeId }: ProductMultiSelectProps) {
  const available = products.filter((p) => p.id !== excludeId);

  const toggle = (id: string, checked: boolean) => {
    if (checked) {
      onChange([...selected, id]);
    } else {
      onChange(selected.filter((existing) => existing !== id));
    }
  };

  if (available.length === 0) {
    return <p className="text-sm text-muted-foreground">Nema drugih proizvoda u ovom lokalu.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {available.map((product) => (
        <div key={product.id} className="flex items-center gap-2 border rounded-md px-3 py-2 bg-white">
          <Checkbox
            id={`pms-${product.id}`}
            checked={selected.includes(product.id)}
            onCheckedChange={(checked) => toggle(product.id, checked === true)}
          />
          <Label htmlFor={`pms-${product.id}`} className="text-sm cursor-pointer flex-1">
            {product.name}
            <span className="text-muted-foreground font-normal"> — {product.slug}</span>
            {product.isBundle && <span className="ml-1 text-xs text-brand-orange font-semibold">(bundle)</span>}
            {product.published === false && <span className="ml-1 text-xs text-amber-600 font-semibold">(draft)</span>}
          </Label>
        </div>
      ))}
    </div>
  );
}
