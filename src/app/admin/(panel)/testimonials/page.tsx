'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LocaleTabs } from '@/components/admin/LocaleTabs';
import { adminFetch, AdminApiError } from '@/components/admin/api';
import { RatingStars } from '@/components/admin/testimonials/RatingStars';
import { TestimonialFormDialog } from '@/components/admin/testimonials/TestimonialFormDialog';
import type { Product, Testimonial } from '@/config/types';
import { toast } from 'sonner';
import { MessageSquareQuote, Pencil, Plus, ThumbsUp, Trash2 } from 'lucide-react';

const LOCALES = ['rs', 'ba', 'me', 'hr'] as const;

interface ProductsResponse {
  success: boolean;
  locale: string;
  products: Record<string, Product>;
}

interface ProductSaveResponse {
  success: boolean;
  product: Product;
  complianceWarnings: { field: string; match: string; excerpt: string }[];
}

interface FormTarget {
  productKey: string;
  product: Product;
  testimonial: Testimonial | null; // null = novi
}

interface DeleteTarget {
  productKey: string;
  product: Product;
  testimonial: Testimonial;
}

function formatDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return iso;
  return `${match[3]}.${match[2]}.${match[1]}.`;
}

function formatAverage(avg: number): string {
  return avg.toFixed(1).replace('.', ',');
}

export default function AdminTestimonialsPage() {
  const [locale, setLocale] = useState<string>('rs');
  const [products, setProducts] = useState<Record<string, Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formTarget, setFormTarget] = useState<FormTarget | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const loadProducts = useCallback(async (loc: string) => {
    setLoading(true);
    setError(null);
    setProducts(null);
    try {
      const data = await adminFetch<ProductsResponse>(`/api/admin/products?locale=${loc}`);
      setProducts(data.products);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Greška pri učitavanju proizvoda.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts(locale);
  }, [locale, loadProducts]);

  const stats = useMemo(() => {
    let count = 0;
    let sum = 0;
    for (const product of Object.values(products ?? {})) {
      for (const t of product.testimonials ?? []) {
        count += 1;
        sum += t.rating;
      }
    }
    return { count, average: count > 0 ? sum / count : 0 };
  }, [products]);

  const showSaveError = (e: unknown) => {
    if (e instanceof AdminApiError && e.issues && e.issues.length > 0) {
      toast.error(e.message, {
        description: (
          <ul className="list-disc pl-4 space-y-0.5">
            {e.issues.map((issue, i) => (
              <li key={i}>{issue}</li>
            ))}
          </ul>
        ),
      });
    } else {
      toast.error(e instanceof Error ? e.message : 'Snimanje nije uspelo.');
    }
  };

  /** PUT celog proizvoda sa izmenjenim testimonials nizom; vraća true ako je uspešno */
  const saveTestimonials = async (
    productKey: string,
    product: Product,
    testimonials: Testimonial[]
  ): Promise<boolean> => {
    setSaving(true);
    try {
      const body: Product = { ...product, testimonials };
      const data = await adminFetch<ProductSaveResponse>(
        `/api/admin/products/${locale}/${encodeURIComponent(product.id)}`,
        { method: 'PUT', body: JSON.stringify(body) }
      );
      setProducts((prev) => (prev ? { ...prev, [productKey]: data.product } : prev));
      if (data.complianceWarnings.length > 0) {
        toast.warning(
          `Upozorenja o usklađenosti (${data.complianceWarnings.length}) — proveri sporne izraze u tekstu.`
        );
      }
      return true;
    } catch (e) {
      showSaveError(e);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleFormSubmit = async (testimonial: Testimonial) => {
    if (!formTarget) return;
    const current = formTarget.product.testimonials ?? [];
    const isEdit = current.some((t) => t.id === testimonial.id);
    const next = isEdit
      ? current.map((t) => (t.id === testimonial.id ? testimonial : t))
      : [...current, testimonial];

    const ok = await saveTestimonials(formTarget.productKey, formTarget.product, next);
    if (ok) {
      setFormTarget(null);
      toast.success(isEdit ? 'Testimonijal je izmenjen.' : 'Testimonijal je dodat.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const current = deleteTarget.product.testimonials ?? [];
    const next = current.filter((t) => t.id !== deleteTarget.testimonial.id);

    const ok = await saveTestimonials(deleteTarget.productKey, deleteTarget.product, next);
    if (ok) {
      setDeleteTarget(null);
      toast.success('Testimonijal je obrisan.');
    }
  };

  const productEntries = Object.entries(products ?? {});

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Testimonijali</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading
              ? 'Učitavanje…'
              : `Ukupno ${stats.count} testimonijala u ovom lokalu` +
                (stats.count > 0 ? ` · prosečna ocena ${formatAverage(stats.average)}` : '')}
          </p>
          {!loading && stats.count > 0 && (
            <div className="flex items-center gap-1.5 mt-1">
              <RatingStars rating={stats.average} />
              <span className="text-sm font-semibold">{formatAverage(stats.average)}</span>
            </div>
          )}
        </div>
        <LocaleTabs locales={LOCALES} value={locale} onChange={setLocale} />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>
      )}

      {loading && <p className="text-sm text-muted-foreground">Učitavanje…</p>}

      {!loading && !error && productEntries.length === 0 && (
        <p className="text-sm text-muted-foreground">Nema proizvoda u ovom lokalu.</p>
      )}

      {!loading &&
        productEntries.map(([key, product]) => {
          const testimonials = product.testimonials ?? [];
          const average =
            testimonials.length > 0
              ? testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length
              : 0;

          return (
            <Card key={key}>
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-semibold text-base">{product.name}</h2>
                    <Badge variant="secondary" className="gap-1">
                      <MessageSquareQuote className="h-3 w-3" />
                      {testimonials.length}
                    </Badge>
                    {testimonials.length > 0 && (
                      <span className="flex items-center gap-1.5">
                        <RatingStars rating={average} />
                        <span className="text-sm text-muted-foreground">{formatAverage(average)}</span>
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="bg-brand-orange hover:bg-brand-orange/90 text-white gap-1.5"
                    disabled={saving}
                    onClick={() => setFormTarget({ productKey: key, product, testimonial: null })}
                  >
                    <Plus className="h-4 w-4" /> Dodaj testimonijal
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {testimonials.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">Ovaj proizvod još nema testimonijala.</p>
                ) : (
                  <div className="divide-y">
                    {testimonials.map((t) => (
                      <div key={t.id} className="flex items-start justify-between gap-3 py-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="font-medium text-sm">{t.name}</span>
                            <span className="text-xs text-muted-foreground">{t.city}</span>
                            <RatingStars rating={t.rating} />
                            <span className="text-xs text-muted-foreground">{formatDate(t.dateAdded)}</span>
                            {t.featured && (
                              <Badge className="bg-brand-orange text-white border-transparent">Izdvojen</Badge>
                            )}
                            {t.verified && (
                              <Badge className="bg-brand-green text-white border-transparent">Verifikovan</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{t.text}</p>
                          {typeof t.likes === 'number' && (
                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <ThumbsUp className="h-3 w-3" /> {t.likes}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            disabled={saving}
                            onClick={() => setFormTarget({ productKey: key, product, testimonial: t })}
                          >
                            <Pencil className="h-3.5 w-3.5" /> Uredi
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={saving}
                            onClick={() => setDeleteTarget({ productKey: key, product, testimonial: t })}
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Obriši
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

      <TestimonialFormDialog
        open={formTarget !== null}
        onClose={() => setFormTarget(null)}
        initial={formTarget?.testimonial ?? null}
        productName={formTarget?.product.name ?? ''}
        saving={saving}
        onSubmit={handleFormSubmit}
      />

      <Dialog open={deleteTarget !== null} onOpenChange={(isOpen) => !isOpen && !saving && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Obriši testimonijal</DialogTitle>
            <DialogDescription>
              Da li sigurno želiš da obrišeš testimonijal korisnika{' '}
              <span className="font-semibold">{deleteTarget?.testimonial.name}</span> za proizvod{' '}
              <span className="font-semibold">{deleteTarget?.product.name}</span>? Ova radnja se ne može poništiti.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteTarget(null)} disabled={saving}>
              Otkaži
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteConfirm} disabled={saving}>
              {saving ? 'Brisanje…' : 'Obriši'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
