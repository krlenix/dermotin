'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { Testimonial } from '@/config/types';

interface TestimonialFormDialogProps {
  open: boolean;
  onClose: () => void;
  /** null = dodavanje novog testimonijala */
  initial: Testimonial | null;
  /** Naziv proizvoda — default za polje „Korišćen proizvod" */
  productName: string;
  saving: boolean;
  onSubmit: (testimonial: Testimonial) => void;
}

interface FormState {
  name: string;
  city: string;
  rating: string;
  text: string;
  verified: boolean;
  featured: boolean;
  likes: string;
  dateAdded: string;
  productUsed: string;
  image: string;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function buildFormState(initial: Testimonial | null, productName: string): FormState {
  if (!initial) {
    return {
      name: '',
      city: '',
      rating: '5',
      text: '',
      verified: false,
      featured: false,
      likes: '',
      dateAdded: todayIso(),
      productUsed: productName,
      image: '',
    };
  }
  return {
    name: initial.name,
    city: initial.city,
    rating: String(initial.rating),
    text: initial.text,
    verified: initial.verified,
    featured: initial.featured === true,
    likes: typeof initial.likes === 'number' ? String(initial.likes) : '',
    dateAdded: initial.dateAdded,
    productUsed: initial.productUsed,
    image: initial.image ?? '',
  };
}

/** Dijalog za dodavanje / uređivanje jednog testimonijala */
export function TestimonialFormDialog({ open, onClose, initial, productName, saving, onSubmit }: TestimonialFormDialogProps) {
  const [form, setForm] = useState<FormState>(() => buildFormState(initial, productName));

  useEffect(() => {
    if (open) setForm(buildFormState(initial, productName));
  }, [open, initial, productName]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    const name = form.name.trim();
    const city = form.city.trim();
    const text = form.text.trim();
    const dateAdded = form.dateAdded.trim();

    if (!name || !city || !text || !dateAdded) {
      toast.error('Popuni obavezna polja: ime, grad, tekst i datum.');
      return;
    }

    let likes: number | undefined;
    if (form.likes.trim() !== '') {
      likes = Number(form.likes);
      if (!Number.isFinite(likes) || likes < 0) {
        toast.error('Broj lajkova mora biti pozitivan broj.');
        return;
      }
    }

    const image = form.image.trim();
    const testimonial: Testimonial = {
      ...(initial ?? {}),
      id: initial?.id ?? `t${Date.now()}`,
      name,
      city,
      rating: Number(form.rating),
      text,
      verified: form.verified,
      featured: form.featured ? true : undefined,
      likes,
      dateAdded,
      productUsed: form.productUsed.trim() || productName,
      image: image !== '' ? image : undefined,
    };

    onSubmit(testimonial);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && !saving && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? 'Uredi testimonijal' : 'Dodaj testimonijal'}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="t-name">Ime i prezime *</Label>
            <Input id="t-name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="npr. Milica J." />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="t-city">Grad *</Label>
            <Input id="t-city" value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="npr. Beograd" />
          </div>

          <div className="space-y-1.5">
            <Label>Ocena *</Label>
            <Select value={form.rating} onValueChange={(value) => set('rating', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Izaberi ocenu" />
              </SelectTrigger>
              <SelectContent>
                {[5, 4, 3, 2, 1].map((r) => (
                  <SelectItem key={r} value={String(r)}>
                    {r} {'★'.repeat(r)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="t-date">Datum *</Label>
            <Input id="t-date" type="date" value={form.dateAdded} onChange={(e) => set('dateAdded', e.target.value)} />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="t-text">Tekst testimonijala *</Label>
            <Textarea
              id="t-text"
              value={form.text}
              onChange={(e) => set('text', e.target.value)}
              rows={4}
              placeholder="Iskustvo kupca sa proizvodom…"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="t-product">Korišćen proizvod</Label>
            <Input id="t-product" value={form.productUsed} onChange={(e) => set('productUsed', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="t-likes">Broj lajkova (opciono)</Label>
            <Input
              id="t-likes"
              type="number"
              min={0}
              value={form.likes}
              onChange={(e) => set('likes', e.target.value)}
              placeholder="npr. 12"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="t-image">Slika kupca — URL (opciono)</Label>
            <Input
              id="t-image"
              value={form.image}
              onChange={(e) => set('image', e.target.value)}
              placeholder="/images/testimonials/kupac.jpg"
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="t-verified"
              checked={form.verified}
              onCheckedChange={(checked) => set('verified', checked === true)}
            />
            <Label htmlFor="t-verified" className="cursor-pointer">Verifikovan kupac</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="t-featured"
              checked={form.featured}
              onCheckedChange={(checked) => set('featured', checked === true)}
            />
            <Label htmlFor="t-featured" className="cursor-pointer">Izdvojen (featured)</Label>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Otkaži
          </Button>
          <Button
            type="button"
            className="bg-brand-orange hover:bg-brand-orange/90 text-white"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? 'Snimanje…' : 'Sačuvaj'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
