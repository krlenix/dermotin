'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { FlaskConical, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import type { Ingredient } from '@/config/types';
import { adminFetch } from '@/components/admin/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IngredientFormDialog } from '@/components/admin/ingredients/IngredientFormDialog';
import {
  INGREDIENT_CATEGORIES,
  INGREDIENT_CATEGORY_BADGE_CLASSES,
  INGREDIENT_CATEGORY_LABELS,
  type IngredientCategory,
} from '@/components/admin/ingredients/ingredient-categories';

interface IngredientsResponse {
  success: boolean;
  ingredients: Record<string, Ingredient>;
  usage: Record<string, string[]>;
}

/** Srpska množina za „sastojak" (1 sastojak, 2 sastojka, 5 sastojaka). */
function pluralSastojak(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return 'sastojak';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'sastojka';
  return 'sastojaka';
}

export default function AdminIngredientsPage() {
  const [data, setData] = useState<IngredientsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | IngredientCategory>('all');

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Ingredient | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Ingredient | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      const response = await adminFetch<IngredientsResponse>('/api/admin/ingredients');
      setData(response);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Greška pri učitavanju sastojaka.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const allIngredients = useMemo(() => {
    if (!data) return [];
    return Object.values(data.ingredients).sort((a, b) => a.id.localeCompare(b.id));
  }, [data]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return allIngredients.filter((ingredient) => {
      if (categoryFilter !== 'all' && ingredient.category !== categoryFilter) return false;
      if (!query) return true;
      return (
        ingredient.id.toLowerCase().includes(query) ||
        ingredient.inciName.toLowerCase().includes(query) ||
        ingredient.serbianName.toLowerCase().includes(query)
      );
    });
  }, [allIngredients, search, categoryFilter]);

  const inUseCount = useMemo(() => {
    if (!data) return 0;
    return allIngredients.filter((ingredient) => (data.usage[ingredient.id]?.length ?? 0) > 0).length;
  }, [data, allIngredients]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (ingredient: Ingredient) => {
    setEditing(ingredient);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminFetch(`/api/admin/ingredients/${encodeURIComponent(deleteTarget.id)}`, {
        method: 'DELETE',
      });
      toast.success(`Sastojak „${deleteTarget.serbianName}" je obrisan.`);
      setDeleteTarget(null);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Greška pri brisanju sastojka.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FlaskConical className="h-6 w-6 text-brand-green" />
            Sastojci
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            INCI baza sastojaka koju dele svi proizvodi i lokali. Izmene se odmah snimaju u config.
          </p>
        </div>
        <Button onClick={openCreate} className="bg-brand-orange hover:bg-brand-orange/90 text-white shrink-0">
          <Plus className="h-4 w-4" />
          Nov sastojak
        </Button>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 flex items-center justify-between gap-3">
          <span>{error}</span>
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

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pretraga po ID, INCI ili srpskom nazivu…"
            className="pl-9"
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value as 'all' | IngredientCategory)}
        >
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Sve kategorije</SelectItem>
            {INGREDIENT_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {INGREDIENT_CATEGORY_LABELS[category]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {data && (
          <p className="text-sm text-muted-foreground sm:ml-auto whitespace-nowrap">
            {allIngredients.length} {pluralSastojak(allIngredients.length)} · {inUseCount} u upotrebi
          </p>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <p className="text-sm text-muted-foreground px-4 py-8 text-center">Učitavanje…</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground px-4 py-8 text-center">
              {allIngredients.length === 0
                ? 'Baza sastojaka je prazna.'
                : 'Nema sastojaka koji odgovaraju zadatoj pretrazi.'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50/70 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3 font-medium">ID</th>
                    <th className="px-4 py-3 font-medium">INCI naziv</th>
                    <th className="px-4 py-3 font-medium">Srpski naziv</th>
                    <th className="px-4 py-3 font-medium">Kategorija</th>
                    <th className="px-4 py-3 font-medium text-center">Upotreba</th>
                    <th className="px-4 py-3 font-medium text-right">Akcije</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((ingredient) => {
                    const usageList = data?.usage[ingredient.id] ?? [];
                    return (
                      <tr key={ingredient.id} className="border-b last:border-b-0 hover:bg-gray-50/60">
                        <td className="px-4 py-2.5 font-mono text-xs text-gray-700 whitespace-nowrap">
                          {ingredient.id}
                        </td>
                        <td className="px-4 py-2.5">{ingredient.inciName}</td>
                        <td className="px-4 py-2.5">{ingredient.serbianName}</td>
                        <td className="px-4 py-2.5">
                          <Badge
                            variant="outline"
                            className={INGREDIENT_CATEGORY_BADGE_CLASSES[ingredient.category]}
                          >
                            {INGREDIENT_CATEGORY_LABELS[ingredient.category]}
                          </Badge>
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          {usageList.length > 0 ? (
                            <span
                              title={usageList.join(', ')}
                              className="cursor-help font-medium text-gray-900 underline decoration-dotted underline-offset-2"
                            >
                              {usageList.length}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">0</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEdit(ingredient)}
                              aria-label={`Uredi sastojak ${ingredient.serbianName}`}
                            >
                              <Pencil className="h-4 w-4" />
                              Uredi
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteTarget(ingredient)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              aria-label={`Obriši sastojak ${ingredient.serbianName}`}
                            >
                              <Trash2 className="h-4 w-4" />
                              Obriši
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <IngredientFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        ingredient={editing}
        existingIds={allIngredients.map((ingredient) => ingredient.id)}
        onSaved={load}
      />

      <Dialog open={deleteTarget !== null} onOpenChange={(open) => !open && !deleting && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Brisanje sastojka</DialogTitle>
            <DialogDescription>
              Da li sigurno želiš da obrišeš sastojak{' '}
              <span className="font-medium text-foreground">{deleteTarget?.serbianName}</span>{' '}
              (<span className="font-mono text-xs">{deleteTarget?.id}</span>)? Ova akcija je nepovratna.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Otkaži
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Brisanje…' : 'Obriši'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
