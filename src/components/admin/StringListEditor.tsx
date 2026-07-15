'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';

interface StringListEditorProps {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  addLabel?: string;
  /** Kompaktan red (input umesto textarea) za kratke vrednosti poput slugova */
  compact?: boolean;
}

/** Editor liste tekstova (benefiti, upozorenja, koraci upotrebe, slugovi…) */
export function StringListEditor({ values, onChange, placeholder, addLabel = 'Dodaj stavku', compact }: StringListEditorProps) {
  const update = (index: number, value: string) => {
    const next = [...values];
    next[index] = value;
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= values.length) return;
    const next = [...values];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {values.map((value, index) => (
        <div key={index} className="flex items-start gap-2">
          <Textarea
            value={value}
            onChange={(e) => update(index, e.target.value)}
            placeholder={placeholder}
            rows={compact ? 1 : 2}
            className="flex-1 min-h-0 resize-y"
          />
          <div className="flex flex-col gap-1 shrink-0">
            <div className="flex gap-1">
              <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Pomeri gore">
                <ArrowUp className="h-3.5 w-3.5" />
              </Button>
              <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => move(index, 1)} disabled={index === values.length - 1} aria-label="Pomeri dole">
                <ArrowDown className="h-3.5 w-3.5" />
              </Button>
              <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-600 hover:text-red-700" onClick={() => remove(index)} aria-label="Obriši">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => onChange([...values, ''])}>
        <Plus className="h-3.5 w-3.5" /> {addLabel}
      </Button>
    </div>
  );
}
