'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { Ingredient } from '@/config/types';
import { adminFetch, AdminApiError } from '@/components/admin/api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  INGREDIENT_CATEGORIES,
  INGREDIENT_CATEGORY_LABELS,
  type IngredientCategory,
} from './ingredient-categories';

const ID_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

interface IngredientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** null → kreiranje novog sastojka */
  ingredient: Ingredient | null;
  /** postojeći ID-jevi za lokalnu proveru duplikata pri kreiranju */
  existingIds: string[];
  /** poziva se posle uspešnog snimanja (osvežavanje liste) */
  onSaved: () => void;
}

export function IngredientFormDialog({
  open,
  onOpenChange,
  ingredient,
  existingIds,
  onSaved,
}: IngredientFormDialogProps) {
  const isNew = ingredient === null;

  const [id, setId] = useState('');
  const [inciName, setInciName] = useState('');
  const [serbianName, setSerbianName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IngredientCategory>('other');
  const [bulgarianName, setBulgarianName] = useState('');
  const [bulgarianDescription, setBulgarianDescription] = useState('');
  const [bulgarianOpen, setBulgarianOpen] = useState(false);
  const [issues, setIssues] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Pri svakom otvaranju napuni formu podacima (ili je isprazni za nov sastojak)
  useEffect(() => {
    if (!open) return;
    setId(ingredient?.id ?? '');
    setInciName(ingredient?.inciName ?? '');
    setSerbianName(ingredient?.serbianName ?? '');
    setDescription(ingredient?.description ?? '');
    setCategory(ingredient?.category ?? 'other');
    setBulgarianName(ingredient?.bulgarianName ?? '');
    setBulgarianDescription(ingredient?.bulgarianDescription ?? '');
    setBulgarianOpen(Boolean(ingredient?.bulgarianName || ingredient?.bulgarianDescription));
    setIssues([]);
    setSaving(false);
  }, [open, ingredient]);

  const validate = (): string[] => {
    const errors: string[] = [];
    if (isNew) {
      const trimmedId = id.trim();
      if (!ID_REGEX.test(trimmedId)) {
        errors.push('id: mora biti u kebab-case formatu (mala slova, brojevi i crtice, npr. „tea-tree-oil").');
      } else if (existingIds.includes(trimmedId)) {
        errors.push(`id: sastojak sa ID „${trimmedId}" već postoji.`);
      }
    }
    if (!inciName.trim()) errors.push('inciName: INCI naziv je obavezan.');
    if (!serbianName.trim()) errors.push('serbianName: srpski naziv je obavezan.');
    if (!description.trim()) errors.push('description: opis je obavezan.');
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validate();
    if (errors.length > 0) {
      setIssues(errors);
      return;
    }

    // Očisti podatke: trim + opciona prazna polja se izostavljaju (server ne prima '')
    const trimmedBulgarianName = bulgarianName.trim();
    const trimmedBulgarianDescription = bulgarianDescription.trim();
    const payload: Ingredient = {
      id: isNew ? id.trim() : ingredient.id,
      inciName: inciName.trim(),
      serbianName: serbianName.trim(),
      description: description.trim(),
      category,
      ...(trimmedBulgarianName ? { bulgarianName: trimmedBulgarianName } : {}),
      ...(trimmedBulgarianDescription ? { bulgarianDescription: trimmedBulgarianDescription } : {}),
    };

    setSaving(true);
    setIssues([]);
    try {
      await adminFetch(
        isNew ? '/api/admin/ingredients' : `/api/admin/ingredients/${encodeURIComponent(ingredient.id)}`,
        {
          method: isNew ? 'POST' : 'PUT',
          body: JSON.stringify(payload),
        }
      );
      toast.success(isNew ? `Sastojak „${payload.serbianName}" je kreiran.` : 'Izmene su sačuvane.');
      onOpenChange(false);
      onSaved();
    } catch (error) {
      if (error instanceof AdminApiError) {
        if (error.issues?.length) setIssues(error.issues);
        toast.error(error.message);
      } else {
        toast.error('Greška pri snimanju sastojka.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !saving && onOpenChange(next)}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNew ? 'Nov sastojak' : `Uredi sastojak: ${ingredient.serbianName}`}</DialogTitle>
          <DialogDescription>
            {isNew
              ? 'Unesi podatke o novom sastojku. ID mora biti jedinstven i u kebab-case formatu.'
              : 'Izmeni podatke o sastojku. ID nije moguće menjati.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ingredient-id">ID</Label>
            <Input
              id="ingredient-id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              disabled={!isNew}
              placeholder="npr. tea-tree-oil"
              className="font-mono"
            />
            {isNew && (
              <p className="text-xs text-muted-foreground">
                Mala slova, brojevi i crtice (kebab-case). Posle kreiranja se ne može menjati.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ingredient-inci">INCI naziv</Label>
              <Input
                id="ingredient-inci"
                value={inciName}
                onChange={(e) => setInciName(e.target.value)}
                placeholder="npr. Melaleuca Alternifolia Leaf Oil"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ingredient-serbian">Srpski naziv</Label>
              <Input
                id="ingredient-serbian"
                value={serbianName}
                onChange={(e) => setSerbianName(e.target.value)}
                placeholder="npr. Ulje čajevca"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ingredient-category">Kategorija</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as IngredientCategory)}>
              <SelectTrigger id="ingredient-category" className="w-full">
                <SelectValue placeholder="Izaberi kategoriju" />
              </SelectTrigger>
              <SelectContent>
                {INGREDIENT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {INGREDIENT_CATEGORY_LABELS[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ingredient-description">Opis</Label>
            <Textarea
              id="ingredient-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Opis sastojka i njegovog dejstva…"
            />
          </div>

          <div className="border rounded-md">
            <button
              type="button"
              onClick={() => setBulgarianOpen((prev) => !prev)}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-gray-50 rounded-md"
            >
              {bulgarianOpen ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              Bugarski (opciono)
            </button>
            {bulgarianOpen && (
              <div className="space-y-4 px-3 pb-3 pt-1">
                <div className="space-y-1.5">
                  <Label htmlFor="ingredient-bg-name">Bugarski naziv</Label>
                  <Input
                    id="ingredient-bg-name"
                    value={bulgarianName}
                    onChange={(e) => setBulgarianName(e.target.value)}
                    placeholder="npr. Масло от чаено дърво"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ingredient-bg-description">Bugarski opis</Label>
                  <Textarea
                    id="ingredient-bg-description"
                    value={bulgarianDescription}
                    onChange={(e) => setBulgarianDescription(e.target.value)}
                    rows={3}
                    placeholder="Opis na bugarskom…"
                  />
                </div>
              </div>
            )}
          </div>

          {issues.length > 0 && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              <p className="font-medium mb-1">Podaci nisu validni:</p>
              <ul className="list-disc pl-5 space-y-0.5">
                {issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Otkaži
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-brand-orange hover:bg-brand-orange/90 text-white"
          >
            {saving ? 'Snimanje…' : isNew ? 'Kreiraj sastojak' : 'Sačuvaj izmene'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
