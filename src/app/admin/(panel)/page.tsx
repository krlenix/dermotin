'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminFetch } from '@/components/admin/api';
import { AlertTriangle, Package, FlaskConical, MessageSquareQuote, BadgePercent } from 'lucide-react';

interface MetaResponse {
  success: boolean;
  locales: string[];
  perLocale: Record<string, { productCount: number; bundleCount: number; draftCount: number; testimonialCount: number }>;
  ingredientCount: number;
  fileSystemWritable: boolean;
}

const LOCALE_NAMES: Record<string, string> = {
  rs: 'Srbija',
  ba: 'Bosna i Hercegovina',
  me: 'Crna Gora',
  hr: 'Hrvatska',
};

export default function AdminDashboardPage() {
  const [meta, setMeta] = useState<MetaResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminFetch<MetaResponse>('/api/admin/meta')
      .then(setMeta)
      .catch((e) => setError(e instanceof Error ? e.message : 'Greška pri učitavanju.'));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dobrodošao/la u admin panel</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ovde uređuješ proizvode, sastojke, testimonijale i akcije. Izmene se odmah snimaju u config fajlove sajta.
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>
      )}

      {meta && !meta.fileSystemWritable && (
        <div className="flex items-start gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <p>
            Fajl-sistem nije upisiv na ovom okruženju (verovatno produkcijski hosting). Uređivanje radi samo na
            lokalnom okruženju — izmene se objavljuju deploy-em.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {meta &&
          meta.locales.map((locale) => {
            const stats = meta.perLocale[locale];
            return (
              <Card key={locale}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-muted-foreground uppercase">
                    {LOCALE_NAMES[locale] ?? locale}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p className="text-2xl font-bold">{stats.productCount} proizvoda</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.bundleCount} bundlova · {stats.draftCount} draftova · {stats.testimonialCount} testimonijala
                  </p>
                </CardContent>
              </Card>
            );
          })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/products" className="group">
          <Card className="h-full transition group-hover:border-brand-orange">
            <CardContent className="pt-6 flex items-center gap-3">
              <Package className="h-8 w-8 text-brand-orange" />
              <div>
                <p className="font-semibold">Proizvodi</p>
                <p className="text-xs text-muted-foreground">Opisi, cene, slike, SEO, FAQ</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/ingredients" className="group">
          <Card className="h-full transition group-hover:border-brand-orange">
            <CardContent className="pt-6 flex items-center gap-3">
              <FlaskConical className="h-8 w-8 text-brand-green" />
              <div>
                <p className="font-semibold">Sastojci</p>
                <p className="text-xs text-muted-foreground">
                  {meta ? `${meta.ingredientCount} u bazi` : 'INCI baza sastojaka'}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/testimonials" className="group">
          <Card className="h-full transition group-hover:border-brand-orange">
            <CardContent className="pt-6 flex items-center gap-3">
              <MessageSquareQuote className="h-8 w-8 text-brand-orange" />
              <div>
                <p className="font-semibold">Testimonijali</p>
                <p className="text-xs text-muted-foreground">Recenzije po proizvodu</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/akcije" className="group">
          <Card className="h-full transition group-hover:border-brand-orange">
            <CardContent className="pt-6 flex items-center gap-3">
              <BadgePercent className="h-8 w-8 text-brand-green" />
              <div>
                <p className="font-semibold">Akcije i bundlovi</p>
                <p className="text-xs text-muted-foreground">Upsell, cross-sell, setovi</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
