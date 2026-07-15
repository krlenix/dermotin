'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
import { toast } from 'sonner';
import { Boxes, Eye, EyeOff, Pencil, Plus, Trash2 } from 'lucide-react';
import type { Product } from '@/config/types';
import { adminFetch, AdminApiError } from '../api';
import { BundleWizard } from '../BundleWizard';
import { formatPrice, getDefaultVariant, ProductSaveResponse, sortedProducts } from './helpers';

interface BundlesTabProps {
  locale: string;
  products: Record<string, Product>;
  onRefresh: () => Promise<void> | void;
}

/** Tab „Bundlovi" — lista set-proizvoda sa objavom, izmenom i brisanjem */
export function BundlesTab({ locale, products, onRefresh }: BundlesTabProps) {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const bundles = sortedProducts(products).filter((product) => product.isBundle === true);

  const togglePublish = async (product: Product) => {
    const isPublished = product.published !== false;
    setTogglingId(product.id);
    try {
      await adminFetch<ProductSaveResponse>(`/api/admin/products/${locale}/${product.id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...product, published: !isPublished }),
      });
      toast.success(
        isPublished
          ? `Bundle „${product.name}" je skinut sa sajta (draft).`
          : `Bundle „${product.name}" je objavljen na sajtu.`
      );
      await onRefresh();
    } catch (error) {
      toast.error(error instanceof AdminApiError ? error.message : 'Snimanje nije uspelo.', {
        description:
          error instanceof AdminApiError && error.issues?.length ? error.issues.join('\n') : undefined,
      });
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminFetch(`/api/admin/products/${locale}/${deleteTarget.id}`, { method: 'DELETE' });
      toast.success(`Bundle „${deleteTarget.name}" je obrisan.`);
      setDeleteTarget(null);
      await onRefresh();
    } catch (error) {
      toast.error(error instanceof AdminApiError ? error.message : 'Brisanje nije uspelo.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Bundle (set) je proizvod sastavljen od više postojećih proizvoda po povoljnijoj ceni.
        </p>
        <Button
          className="bg-brand-orange hover:bg-brand-orange/90 text-white gap-1.5 shrink-0"
          onClick={() => setWizardOpen(true)}
        >
          <Plus className="h-4 w-4" /> Novi bundle
        </Button>
      </div>

      {bundles.length === 0 ? (
        <Card>
          <CardContent className="py-12 flex flex-col items-center text-center gap-3">
            <Boxes className="h-10 w-10 text-brand-green" />
            <div className="max-w-md space-y-1">
              <p className="font-semibold">Još nema nijednog bundla u ovom lokalu</p>
              <p className="text-sm text-muted-foreground">
                Bundle (set) kombinuje dva ili više proizvoda u jednu ponudu sa zajedničkom cenom — npr. melem +
                kapi. Kreira se kao draft, pa ga doradiš i objaviš kada je spreman.
              </p>
            </div>
            <Button
              className="bg-brand-orange hover:bg-brand-orange/90 text-white gap-1.5"
              onClick={() => setWizardOpen(true)}
            >
              <Plus className="h-4 w-4" /> Napravi prvi bundle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {bundles.map((bundle) => {
            const variant = getDefaultVariant(bundle);
            const isPublished = bundle.published !== false;
            const componentsLabel = (bundle.bundleItems ?? [])
              .map((item) => `${products[item.productId]?.name ?? item.productId} × ${item.quantity}`)
              .join(', ');
            return (
              <Card key={bundle.id}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 bg-gray-50 border rounded-md shrink-0 overflow-hidden">
                      {bundle.images.thumbnail ? (
                        <Image
                          src={bundle.images.thumbnail}
                          alt={bundle.name}
                          fill
                          sizes="80px"
                          className="object-contain p-1"
                        />
                      ) : (
                        <Boxes className="h-8 w-8 text-gray-300 absolute inset-0 m-auto" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold leading-tight">{bundle.name}</p>
                        {isPublished ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 shrink-0">
                            Objavljen
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 shrink-0">
                            Draft
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">/{bundle.slug}</p>
                      {variant && (
                        <p className="text-sm">
                          {variant.discountPrice !== undefined ? (
                            <>
                              <span className="font-bold text-brand-orange">
                                {formatPrice(variant.discountPrice, variant.currency)}
                              </span>{' '}
                              <span className="text-muted-foreground line-through text-xs">
                                {formatPrice(variant.price, variant.currency)}
                              </span>
                            </>
                          ) : (
                            <span className="font-bold">{formatPrice(variant.price, variant.currency)}</span>
                          )}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-gray-700">Komponente:</span>{' '}
                        {componentsLabel || '— nema definisanih komponenti —'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {isPublished ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        disabled={togglingId === bundle.id}
                        onClick={() => togglePublish(bundle)}
                      >
                        <EyeOff className="h-3.5 w-3.5" />
                        {togglingId === bundle.id ? 'Snimanje…' : 'Skini sa sajta'}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="bg-brand-green hover:bg-brand-green/90 text-white gap-1.5"
                        disabled={togglingId === bundle.id}
                        onClick={() => togglePublish(bundle)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        {togglingId === bundle.id ? 'Snimanje…' : 'Objavi'}
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="gap-1.5" asChild>
                      <Link href={`/admin/products/${locale}/${bundle.id}`}>
                        <Pencil className="h-3.5 w-3.5" /> Uredi
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setDeleteTarget(bundle)}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Obriši
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialog potvrde brisanja */}
      <Dialog open={deleteTarget !== null} onOpenChange={(isOpen) => !isOpen && !deleting && setDeleteTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Obriši bundle?</DialogTitle>
            <DialogDescription>
              Bundle „{deleteTarget?.name}&ldquo; biće trajno obrisan iz kataloga lokala {locale.toUpperCase()}. Ova akcija
              ne može da se opozove.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" disabled={deleting} onClick={() => setDeleteTarget(null)}>
              Otkaži
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" disabled={deleting} onClick={handleDelete}>
              {deleting ? 'Brisanje…' : 'Obriši'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {wizardOpen && (
        <BundleWizard
          open
          locale={locale}
          products={products}
          onClose={() => setWizardOpen(false)}
          onCreated={onRefresh}
        />
      )}
    </div>
  );
}
