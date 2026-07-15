'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import type { ProductFAQ } from '@/config/types';
import { FAQ_CATEGORY_LABELS, type FAQDraft } from './draft';

interface FaqSectionProps {
  items: FAQDraft[];
  onChange: (items: FAQDraft[]) => void;
}

const CATEGORY_ENTRIES = Object.entries(FAQ_CATEGORY_LABELS) as [ProductFAQ['category'], string][];

/** Sekcija FAQ: pitanje + odgovor + kategorija, sa add/remove/reorder */
export function FaqSection({ items, onChange }: FaqSectionProps) {
  const update = (index: number, patch: Partial<FAQDraft>) => {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="text-sm text-muted-foreground">Nema FAQ stavki.</p>}
      {items.map((item, index) => (
        <div key={index} className="border rounded-lg p-3 bg-gray-50/60 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-muted-foreground">Pitanje #{index + 1}</p>
            <div className="flex gap-1">
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={index === 0} onClick={() => move(index, -1)} aria-label="Pomeri gore">
                <ArrowUp className="h-3.5 w-3.5" />
              </Button>
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={index === items.length - 1} onClick={() => move(index, 1)} aria-label="Pomeri dole">
                <ArrowDown className="h-3.5 w-3.5" />
              </Button>
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700" onClick={() => onChange(items.filter((_, i) => i !== index))} aria-label="Obriši pitanje">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Pitanje</Label>
              <Input value={item.question} onChange={(e) => update(index, { question: e.target.value })} placeholder="npr. Kako se koristi proizvod?" className="bg-white" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Kategorija</Label>
              <Select value={item.category} onValueChange={(category) => update(index, { category: category as ProductFAQ['category'] })}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_ENTRIES.map(([id, label]) => (
                    <SelectItem key={id} value={id}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Odgovor</Label>
            <Textarea value={item.answer} onChange={(e) => update(index, { answer: e.target.value })} rows={3} className="resize-y bg-white" />
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1"
        onClick={() => onChange([...items, { question: '', answer: '', category: 'general' }])}
      >
        <Plus className="h-3.5 w-3.5" /> Dodaj pitanje
      </Button>
    </div>
  );
}
