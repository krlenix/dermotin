'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { adminFetch } from '@/components/admin/api';
import { LocaleTabs } from '@/components/admin/LocaleTabs';
import { PRODUCT_CATEGORIES, type Product } from '@/config/types';
import { ImageIcon, Pencil, Plus } from 'lucide-react';

const PRODUCT_LOCALES = ['rs', 'ba', 'me', 'hr'] as const;

interface ProductsResponse {
  success: boolean;
  locale: string;
  products: Record<string, Product>;
}

const CATEGORY_NAMES = PRODUCT_CATEGORIES as Record<string, { name: string; description: string }>;

function formatPrice(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function priceRange(product: Product): string {
  if (product.variants.length === 0) return '—';
  const prices = product.variants.map((variant) => variant.discountPrice ?? variant.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const currency = product.variants[0].currency;
  return min === max ? `${formatPrice(min)} ${currency}` : `${formatPrice(min)}–${formatPrice(max)} ${currency}`;
}

export default function AdminProductsPage() {
  const [locale, setLocale] = useState<string>('rs');
  const [products, setProducts] = useState<Record<string, Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    adminFetch<ProductsResponse>(`/api/admin/products?locale=${locale}`)
      .then((data) => {
        if (!cancelled) setProducts(data.products);
      })
      .catch((e) => {
        if (!cancelled) {
          setProducts(null);
          setError(e instanceof Error ? e.message : 'Greška pri učitavanju proizvoda.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const list = useMemo(
    () => (products ? Object.values(products).sort((a, b) => a.name.localeCompare(b.name, 'sr')) : []),
    [products]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Proizvodi</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? 'Učitavanje…' : `${list.length} proizvoda u lokalu ${locale.toUpperCase()}`}
          </p>
        </div>
        <Button asChild className="bg-brand-orange hover:bg-brand-orange/90 text-white gap-2">
          <Link href={`/admin/products/${locale}/new`}>
            <Plus className="h-4 w-4" /> Novi proizvod
          </Link>
        </Button>
      </div>

      <LocaleTabs locales={PRODUCT_LOCALES} value={locale} onChange={setLocale} />

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>
      )}

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <p className="text-sm text-muted-foreground p-6">Učitavanje…</p>
          ) : list.length === 0 ? (
            <p className="text-sm text-muted-foreground p-6">Nema proizvoda u ovom lokalu.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Slika</th>
                    <th className="px-4 py-3 font-medium">Naziv</th>
                    <th className="px-4 py-3 font-medium">Slug</th>
                    <th className="px-4 py-3 font-medium">Kategorija</th>
                    <th className="px-4 py-3 font-medium text-center">Varijante</th>
                    <th className="px-4 py-3 font-medium">Cena</th>
                    <th className="px-4 py-3 font-medium">Zemlje</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {list.map((product) => (
                    <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50/70">
                      <td className="px-4 py-2">
                        {product.images.thumbnail ? (
                          <div className="relative h-12 w-12 rounded-md border bg-gray-50 overflow-hidden">
                            <Image
                              src={product.images.thumbnail}
                              alt={product.name}
                              fill
                              sizes="48px"
                              className="object-contain p-0.5"
                            />
                          </div>
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-md border bg-gray-50 text-gray-300">
                            <ImageIcon className="h-5 w-5" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">{product.name}</span>
                          {product.published === false && (
                            <Badge className="bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-100">Draft</Badge>
                          )}
                          {product.isBundle && (
                            <Badge className="bg-brand-orange text-white hover:bg-brand-orange">Bundle</Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-muted-foreground font-mono text-xs">{product.slug}</td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {CATEGORY_NAMES[product.category]?.name ?? product.category}
                      </td>
                      <td className="px-4 py-2 text-center">{product.variants.length}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{priceRange(product)}</td>
                      <td className="px-4 py-2">
                        <div className="flex gap-1 flex-wrap">
                          {product.availableCountries.map((country) => (
                            <Badge key={country} variant="outline" className="uppercase text-[10px] px-1.5">
                              {country}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <Button asChild variant="outline" size="sm" className="gap-1">
                          <Link href={`/admin/products/${locale}/${product.id}`}>
                            <Pencil className="h-3.5 w-3.5" /> Uredi
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
