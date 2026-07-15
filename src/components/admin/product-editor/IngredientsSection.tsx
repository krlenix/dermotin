'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { adminFetch } from '@/components/admin/api';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import type { Ingredient } from '@/config/types';

interface IngredientsSectionProps {
  /** Selektovani ID-jevi sastojaka — redosled je bitan */
  selected: string[];
  onChangeSelected: (ids: string[]) => void;
  /** Mapa override opisa po sastojku (prazna vrednost = koristi zajednički opis) */
  descriptions: Record<string, string>;
  onChangeDescriptions: (descriptions: Record<string, string>) => void;
}

interface IngredientsResponse {
  success: boolean;
  ingredients: Record<string, Ingredient>;
  usage: Record<string, string[]>;
}

/** Sekcija SASTOJCI: uređena lista selektovanih + pretraga/dodavanje iz baze */
export function IngredientsSection({ selected, onChangeSelected, descriptions, onChangeDescriptions }: IngredientsSectionProps) {
  const [ingredients, setIngredients] = useState<Record<string, Ingredient> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminFetch<IngredientsResponse>('/api/admin/ingredients')
      .then((data) => setIngredients(data.ingredients))
      .catch((e) => setError(e instanceof Error ? e.message : 'Greška pri učitavanju sastojaka.'));
  }, []);

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= selected.length) return;
    const next = [...selected];
    [next[index], next[target]] = [next[target], next[index]];
    onChangeSelected(next);
  };

  const remove = (id: string) => {
    onChangeSelected(selected.filter((existing) => existing !== id));
  };

  const setDescription = (id: string, text: string) => {
    onChangeDescriptions({ ...descriptions, [id]: text });
  };

  const unselected = useMemo(() => {
    if (!ingredients) return [];
    const query = search.trim().toLowerCase();
    return Object.values(ingredients)
      .filter((ingredient) => !selected.includes(ingredient.id))
      .filter(
        (ingredient) =>
          !query ||
          ingredient.serbianName.toLowerCase().includes(query) ||
          ingredient.inciName.toLowerCase().includes(query) ||
          ingredient.id.toLowerCase().includes(query)
      )
      .sort((a, b) => a.serbianName.localeCompare(b.serbianName, 'sr'));
  }, [ingredients, selected, search]);

  if (error) {
    return <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>;
  }
  if (!ingredients) {
    return <p className="text-sm text-muted-foreground">Učitavanje…</p>;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">Selektovani sastojci ({selected.length}) — redosled je bitan</p>
        {selected.length === 0 && <p className="text-sm text-muted-foreground">Nijedan sastojak nije izabran.</p>}
        {selected.map((id, index) => {
          const ingredient = ingredients[id];
          return (
            <div key={id} className="border rounded-lg p-3 bg-gray-50/60 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{ingredient ? ingredient.serbianName : id}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {ingredient ? ingredient.inciName : 'Sastojak nije pronađen u bazi'}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={index === 0} onClick={() => move(index, -1)} aria-label="Pomeri gore">
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={index === selected.length - 1} onClick={() => move(index, 1)} aria-label="Pomeri dole">
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700" onClick={() => remove(id)} aria-label="Ukloni sastojak">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Opis za ovaj proizvod (override) — prazno = koristi zajednički opis iz baze</p>
                <Textarea
                  value={descriptions[id] ?? ''}
                  onChange={(e) => setDescription(id, e.target.value)}
                  rows={2}
                  placeholder={ingredient ? ingredient.description.slice(0, 140) + (ingredient.description.length > 140 ? '…' : '') : ''}
                  className="resize-y bg-white"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-2 border-t pt-3">
        <p className="text-sm font-medium">Dodaj sastojak iz baze</p>
        <Input placeholder="Pretraga po nazivu ili INCI imenu…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="max-h-56 overflow-y-auto border rounded-md divide-y">
          {unselected.map((ingredient) => (
            <div key={ingredient.id} className="flex items-center justify-between gap-2 px-3 py-2 bg-white">
              <div className="min-w-0">
                <p className="text-sm">{ingredient.serbianName}</p>
                <p className="text-xs text-muted-foreground truncate">{ingredient.inciName}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1 shrink-0"
                onClick={() => onChangeSelected([...selected, ingredient.id])}
              >
                <Plus className="h-3.5 w-3.5" /> Dodaj
              </Button>
            </div>
          ))}
          {unselected.length === 0 && (
            <p className="text-sm text-muted-foreground px-3 py-2">Nema sastojaka za dati filter.</p>
          )}
        </div>
      </div>
    </div>
  );
}
