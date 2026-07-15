'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, Plus, Star, Trash2 } from 'lucide-react';
import { emptyTestimonialDraft, type TestimonialDraft } from './draft';

interface TestimonialsSectionProps {
  items: TestimonialDraft[];
  onChange: (items: TestimonialDraft[]) => void;
  /** Naziv proizvoda — predlog za polje productUsed kod novih testimonijala */
  productName: string;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Ocena ${rating} od 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className={star <= rating ? 'h-3.5 w-3.5 fill-amber-400 text-amber-400' : 'h-3.5 w-3.5 text-gray-300'} />
      ))}
    </span>
  );
}

/** Sekcija TESTIMONIJALI: lista + Dialog forma za uređivanje/dodavanje */
export function TestimonialsSection({ items, onChange, productName }: TestimonialsSectionProps) {
  // editing: null = dialog zatvoren; { index: -1 } = novi testimonijal
  const [editing, setEditing] = useState<{ index: number; draft: TestimonialDraft } | null>(null);

  const openNew = () => {
    setEditing({ index: -1, draft: emptyTestimonialDraft(productName) });
  };

  const openEdit = (index: number) => {
    setEditing({ index, draft: { ...items[index] } });
  };

  const applyEditing = () => {
    if (!editing) return;
    if (editing.index === -1) {
      onChange([...items, editing.draft]);
    } else {
      onChange(items.map((item, i) => (i === editing.index ? editing.draft : item)));
    }
    setEditing(null);
  };

  const updateDraft = (patch: Partial<TestimonialDraft>) => {
    setEditing((current) => (current ? { ...current, draft: { ...current.draft, ...patch } } : current));
  };

  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="text-sm text-muted-foreground">Nema testimonijala za ovaj proizvod.</p>}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={`${item.id}-${index}`} className="border rounded-lg px-3 py-2 bg-gray-50/60 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-medium">{item.name}</p>
                <span className="text-xs text-muted-foreground">{item.city}</span>
                <Stars rating={item.rating} />
                <span className="text-xs text-muted-foreground">{item.dateAdded}</span>
                {item.featured && <span className="text-[10px] font-semibold uppercase text-brand-orange">Istaknut</span>}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {item.text.length > 140 ? item.text.slice(0, 140) + '…' : item.text}
              </p>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEdit(index)} aria-label="Uredi testimonijal">
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                onClick={() => onChange(items.filter((_, i) => i !== index))}
                aria-label="Obriši testimonijal"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" className="gap-1" onClick={openNew}>
        <Plus className="h-3.5 w-3.5" /> Dodaj testimonijal
      </Button>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.index === -1 ? 'Novi testimonijal' : 'Uredi testimonijal'}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">ID</Label>
                  <Input value={editing.draft.id} onChange={(e) => updateDraft({ id: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Ocena</Label>
                  <Select value={String(editing.draft.rating)} onValueChange={(rating) => updateDraft({ rating: Number(rating) })}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <SelectItem key={rating} value={String(rating)}>
                          {rating} {rating === 1 ? 'zvezdica' : 'zvezdice'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Ime</Label>
                  <Input value={editing.draft.name} onChange={(e) => updateDraft({ name: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Grad</Label>
                  <Input value={editing.draft.city} onChange={(e) => updateDraft({ city: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Tekst</Label>
                <Textarea value={editing.draft.text} onChange={(e) => updateDraft({ text: e.target.value })} rows={4} className="resize-y" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Korišćen proizvod</Label>
                  <Input value={editing.draft.productUsed} onChange={(e) => updateDraft({ productUsed: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Datum</Label>
                  <Input type="date" value={editing.draft.dateAdded} onChange={(e) => updateDraft({ dateAdded: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Broj lajkova (opciono)</Label>
                  <Input type="number" min={0} value={editing.draft.likes} onChange={(e) => updateDraft({ likes: e.target.value })} placeholder="—" />
                </div>
              </div>
              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={editing.draft.verified} onCheckedChange={(checked) => updateDraft({ verified: checked === true })} />
                  Verifikovana kupovina
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={editing.draft.featured} onCheckedChange={(checked) => updateDraft({ featured: checked === true })} />
                  Istaknut (featured)
                </label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditing(null)}>
              Otkaži
            </Button>
            <Button type="button" className="bg-brand-orange hover:bg-brand-orange/90 text-white" onClick={applyEditing}>
              Primeni
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
