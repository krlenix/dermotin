'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { adminFetch, AdminApiError } from '@/components/admin/api';
import { StringListEditor } from '@/components/admin/StringListEditor';
import { ProductMultiSelect } from '@/components/admin/ProductMultiSelect';
import { ImagesSection } from '@/components/admin/product-editor/ImagesSection';
import { VariantsSection } from '@/components/admin/product-editor/VariantsSection';
import { IngredientsSection } from '@/components/admin/product-editor/IngredientsSection';
import { FaqSection } from '@/components/admin/product-editor/FaqSection';
import { TestimonialsSection } from '@/components/admin/product-editor/TestimonialsSection';
import { BundleSection } from '@/components/admin/product-editor/BundleSection';
import {
  COUNTRY_LABELS,
  LOCALE_DEFAULT_CURRENCY,
  draftToProduct,
  emptyDraft,
  productToDraft,
  type ProductDraft,
} from '@/components/admin/product-editor/draft';
import { cn } from '@/lib/utils';
import type { Product } from '@/config/types';
import { AlertTriangle, ArrowLeft, ExternalLink, Trash2 } from 'lucide-react';

const VALID_LOCALES = ['rs', 'ba', 'me', 'hr'];

type TabId = 'osnovno' | 'slike' | 'cene' | 'sadrzaj' | 'sastojci' | 'faq' | 'testimonijali' | 'seo' | 'marketing';

const TABS: { id: TabId; label: string }[] = [
  { id: 'osnovno', label: 'Osnovno' },
  { id: 'slike', label: 'Slike' },
  { id: 'cene', label: 'Cene i varijante' },
  { id: 'sadrzaj', label: 'Sadržaj' },
  { id: 'sastojci', label: 'Sastojci' },
  { id: 'faq', label: 'FAQ' },
  { id: 'testimonijali', label: 'Testimonijali' },
  { id: 'seo', label: 'SEO' },
  { id: 'marketing', label: 'Marketing' },
];

interface ComplianceWarning {
  field: string;
  match: string;
  excerpt: string;
}

interface ProductResponse {
  success: boolean;
  product: Product;
  complianceWarnings?: ComplianceWarning[];
}

interface ProductsResponse {
  success: boolean;
  products: Record<string, Product>;
}

interface MetaResponse {
  success: boolean;
  categories: { id: string; name: string }[];
}

/** Labela + sadržaj polja */
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/** Kartica sekcije editora */
function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <p className="text-xs text-muted-foreground font-normal">{description}</p>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default function AdminProductEditorPage() {
  const params = useParams<{ locale: string; id: string }>();
  const router = useRouter();
  const locale = params.locale;
  const id = params.id;
  const isNew = id === 'new';

  const [draft, setDraft] = useState<ProductDraft | null>(null);
  // Snapshot poslednjeg učitanog/sačuvanog drafta — za indikator nesnimljenih izmena
  const [baseline, setBaseline] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [localeProducts, setLocaleProducts] = useState<Product[]>([]);
  const [complianceWarnings, setComplianceWarnings] = useState<ComplianceWarning[]>([]);
  const [issues, setIssues] = useState<string[]>([]);
  const [tab, setTab] = useState<TabId>('osnovno');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (!VALID_LOCALES.includes(locale)) {
      setLoadError(`Nepoznat lokal „${locale}".`);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    setIssues([]);

    const load = async () => {
      try {
        const [metaData, productsData] = await Promise.all([
          adminFetch<MetaResponse>('/api/admin/meta'),
          adminFetch<ProductsResponse>(`/api/admin/products?locale=${locale}`),
        ]);
        if (cancelled) return;
        setCategories(metaData.categories);
        setLocaleProducts(Object.values(productsData.products).sort((a, b) => a.name.localeCompare(b.name, 'sr')));

        if (isNew) {
          const empty = emptyDraft(locale);
          setDraft(empty);
          setBaseline(JSON.stringify(empty));
          setComplianceWarnings([]);
        } else {
          const data = await adminFetch<ProductResponse>(`/api/admin/products/${locale}/${id}`);
          if (cancelled) return;
          const loaded = productToDraft(data.product);
          setDraft(loaded);
          setBaseline(JSON.stringify(loaded));
          setComplianceWarnings(data.complianceWarnings ?? []);
        }
      } catch (e) {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : 'Greška pri učitavanju.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [locale, id, isNew]);

  const update = useCallback(<K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) => {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  }, []);

  const dirty = useMemo(() => {
    if (!draft || baseline === null) return false;
    return JSON.stringify(draft) !== baseline;
  }, [draft, baseline]);

  const handleSave = async () => {
    if (!draft) return;
    const product = draftToProduct(draft);
    if (!product.id) {
      toast.error('Unesi ID proizvoda (npr. „novi-proizvod").');
      return;
    }
    setSaving(true);
    setIssues([]);
    try {
      const url = isNew ? `/api/admin/products/${locale}` : `/api/admin/products/${locale}/${id}`;
      const data = await adminFetch<ProductResponse>(url, {
        method: isNew ? 'POST' : 'PUT',
        body: JSON.stringify(product),
      });
      setComplianceWarnings(data.complianceWarnings ?? []);
      const saved = productToDraft(data.product);
      setDraft(saved);
      setBaseline(JSON.stringify(saved));
      toast.success('Proizvod je sačuvan.');
      if ((data.complianceWarnings ?? []).length > 0) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (isNew) {
        router.replace(`/admin/products/${locale}/${product.id}`);
      }
    } catch (e) {
      if (e instanceof AdminApiError && e.issues && e.issues.length > 0) {
        setIssues(e.issues);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      toast.error(e instanceof Error ? e.message : 'Greška pri snimanju proizvoda.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminFetch(`/api/admin/products/${locale}/${id}`, { method: 'DELETE' });
      toast.success('Proizvod je obrisan.');
      router.push('/admin/products');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Greška pri brisanju proizvoda.');
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Učitavanje…</p>;
  }

  if (loadError || !draft) {
    return (
      <div className="space-y-4">
        <Link href="/admin/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Nazad na proizvode
        </Link>
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {loadError ?? 'Proizvod nije učitan.'}
        </p>
      </div>
    );
  }

  const defaultCurrency = LOCALE_DEFAULT_CURRENCY[locale] ?? 'RSD';
  const uploadFolder = isNew ? (draft.id.trim() ? `products/${draft.id.trim()}` : 'products') : `products/${id}`;

  const tabLabel = (tabId: TabId, label: string): string => {
    if (tabId === 'faq' && draft.productFAQ.length > 0) return `FAQ (${draft.productFAQ.length})`;
    if (tabId === 'testimonijali' && draft.testimonials.length > 0) return `Testimonijali (${draft.testimonials.length})`;
    return label;
  };

  return (
    <div className="pb-8">
      {/* Sticky header: nazad, naziv + badge-ovi, indikator izmena, link na sajt, Sačuvaj */}
      <div className="sticky top-14 lg:top-0 z-30 -mx-4 lg:-mx-8 -mt-4 lg:-mt-8 border-b bg-white px-4 lg:px-8 py-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 min-w-0">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground shrink-0"
          >
            <ArrowLeft className="h-4 w-4" /> Nazad
          </Link>
          <span className="hidden sm:inline text-gray-300">|</span>
          <h1 className="text-base lg:text-lg font-bold truncate max-w-[40vw]">{isNew ? 'Novi proizvod' : draft.name || id}</h1>
          <Badge variant="outline" className="uppercase shrink-0">{locale}</Badge>
          {!draft.published && (
            <Badge className="bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-100 shrink-0">Draft</Badge>
          )}
          {draft.isBundle && <Badge className="bg-brand-orange text-white hover:bg-brand-orange shrink-0">Bundle</Badge>}
          {dirty && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 shrink-0">
              <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden />
              Nesnimljene izmene
            </span>
          )}
          <div className="ml-auto flex items-center gap-3 shrink-0">
            {locale === 'hr' ? (
              <span className="hidden sm:inline text-xs text-muted-foreground">HR nije aktivan</span>
            ) : (
              !isNew &&
              draft.slug && (
                <a
                  href={`/${locale}/products/${draft.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:inline-flex items-center gap-1 text-sm text-brand-green hover:underline"
                >
                  Otvori na sajtu <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )
            )}
            <Button
              type="button"
              className="bg-brand-orange hover:bg-brand-orange/90 text-white"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Snimanje…' : 'Sačuvaj'}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {/* Panel validacionih grešaka (422) — iznad tabova, vidljiv bez skrolovanja */}
        {issues.length > 0 && (
          <div className="bg-red-50 border border-red-300 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-red-800">
              <AlertTriangle className="h-4 w-4" /> Proizvod nije sačuvan — ispravi sledeće greške:
            </div>
            <ul className="list-disc pl-6 space-y-1">
              {issues.map((issue, index) => (
                <li key={index} className="text-sm text-red-700">{issue}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Panel compliance upozorenja */}
        {complianceWarnings.length > 0 && (
          <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-800">
              <AlertTriangle className="h-4 w-4" /> Upozorenja o rizičnim rečima ({complianceWarnings.length})
            </div>
            <p className="text-xs text-amber-700">
              Snimanje nije blokirano, ali ovi izrazi mogu da naprave problem sa Meta/TikTok oglasima.
            </p>
            <ul className="space-y-1.5">
              {complianceWarnings.map((warning, index) => (
                <li key={index} className="text-sm text-amber-800">
                  <span className="font-mono text-xs bg-amber-100 border border-amber-200 rounded px-1 py-0.5">{warning.field}</span>{' '}
                  <span className="font-semibold">„{warning.match}&rdquo;</span>
                  <span className="text-amber-700"> — {warning.excerpt}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tab traka — horizontalno skrolabilna na užim ekranima */}
        <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
          <div className="inline-flex min-w-max rounded-lg border bg-white p-1 gap-1">
            {TABS.map(({ id: tabId, label }) => (
              <button
                key={tabId}
                type="button"
                onClick={() => setTab(tabId)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
                  tab === tabId ? 'bg-brand-green text-white' : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {tabLabel(tabId, label)}
              </button>
            ))}
          </div>
        </div>

        {/* TAB: OSNOVNO */}
        {tab === 'osnovno' && (
          <>
            <Section title="Osnovni podaci">
              <div className="space-y-4">
                {isNew && (
                  <Field
                    label="ID proizvoda"
                    hint={'Jedinstven identifikator u katalogu — mala slova, brojevi i crtice (npr. „novi-proizvod"). Kasnije ne može da se menja.'}
                  >
                    <Input value={draft.id} onChange={(e) => update('id', e.target.value)} placeholder="npr. novi-proizvod" />
                  </Field>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Naziv">
                    <Input value={draft.name} onChange={(e) => update('name', e.target.value)} placeholder="npr. FUNGEL" />
                  </Field>
                  <Field label="Kategorija">
                    <Select value={draft.category || undefined} onValueChange={(category) => update('category', category)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Izaberi kategoriju…" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
                <Field label="Kratak opis">
                  <Input value={draft.shortDescription} onChange={(e) => update('shortDescription', e.target.value)} />
                </Field>
                <Field label="Opis">
                  <Textarea value={draft.description} onChange={(e) => update('description', e.target.value)} rows={4} className="resize-y" />
                </Field>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Hero naslov">
                    <Input value={draft.heroTitle} onChange={(e) => update('heroTitle', e.target.value)} />
                  </Field>
                  <Field label="Namena (purpose)">
                    <Input value={draft.purpose} onChange={(e) => update('purpose', e.target.value)} />
                  </Field>
                </div>
                <Field label="Zemlje" hint="U kojim zemljama je proizvod dostupan.">
                  <div className="flex flex-wrap gap-3">
                    {VALID_LOCALES.map((country) => (
                      <label key={country} className="flex items-center gap-2 text-sm cursor-pointer border rounded-md px-3 py-2 bg-white">
                        <Checkbox
                          checked={draft.availableCountries.includes(country)}
                          onCheckedChange={(checked) => {
                            if (checked === true) {
                              update('availableCountries', [...draft.availableCountries, country]);
                            } else {
                              update('availableCountries', draft.availableCountries.filter((existing) => existing !== country));
                            }
                          }}
                        />
                        {COUNTRY_LABELS[country] ?? country.toUpperCase()}
                      </label>
                    ))}
                  </div>
                </Field>
                <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <Checkbox checked={draft.published} onCheckedChange={(checked) => update('published', checked === true)} />
                  Objavljen na sajtu (neoznačen = draft, sakriven sa sajta)
                </label>
              </div>
            </Section>

            {!isNew && (
              <Card className="border-red-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-red-700">Opasna zona</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">
                    Brisanje trajno uklanja proizvod iz lokala {locale.toUpperCase()} — ova akcija ne može da se opozove.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-1 text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
                    onClick={() => setDeleteOpen(true)}
                  >
                    <Trash2 className="h-4 w-4" /> Obriši proizvod
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* TAB: SLIKE */}
        {tab === 'slike' && (
          <Section title="Slike" description="Prevuci fajl na zonu, klikni za upload ili izaberi postojeću sliku iz galerije fajlova.">
            <ImagesSection value={draft.images} onChange={(images) => update('images', images)} uploadFolder={uploadFolder} />
          </Section>
        )}

        {/* TAB: CENE I VARIJANTE */}
        {tab === 'cene' && (
          <Section title="Cene i varijante" description="Bar jedna varijanta je obavezna; tačno jedna mora biti podrazumevana.">
            <VariantsSection variants={draft.variants} onChange={(variants) => update('variants', variants)} defaultCurrency={defaultCurrency} />
          </Section>
        )}

        {/* TAB: SADRŽAJ */}
        {tab === 'sadrzaj' && (
          <>
            <Section title="Benefiti">
              <StringListEditor values={draft.benefits} onChange={(benefits) => update('benefits', benefits)} placeholder="npr. Umiruje i neguje kožu" addLabel="Dodaj benefit" />
            </Section>
            <Section title="Upotreba">
              <div className="space-y-4">
                <Field label="Uputstvo za upotrebu">
                  <Textarea value={draft.usage} onChange={(e) => update('usage', e.target.value)} rows={3} className="resize-y" />
                </Field>
                <Field label="Koraci upotrebe (opciono)">
                  <StringListEditor values={draft.usageSteps} onChange={(usageSteps) => update('usageSteps', usageSteps)} placeholder="npr. Nanesite tanak sloj na čistu kožu" addLabel="Dodaj korak" />
                </Field>
              </div>
            </Section>
            <Section title="Upozorenja">
              <StringListEditor values={draft.warnings} onChange={(warnings) => update('warnings', warnings)} placeholder="npr. Samo za spoljašnju upotrebu" addLabel="Dodaj upozorenje" />
            </Section>
          </>
        )}

        {/* TAB: SASTOJCI */}
        {tab === 'sastojci' && (
          <Section title="Sastojci">
            <IngredientsSection
              selected={draft.ingredients}
              onChangeSelected={(ingredients) => update('ingredients', ingredients)}
              descriptions={draft.ingredientDescriptions}
              onChangeDescriptions={(descriptions) => update('ingredientDescriptions', descriptions)}
            />
          </Section>
        )}

        {/* TAB: FAQ */}
        {tab === 'faq' && (
          <Section title="Česta pitanja (FAQ)">
            <FaqSection items={draft.productFAQ} onChange={(productFAQ) => update('productFAQ', productFAQ)} />
          </Section>
        )}

        {/* TAB: TESTIMONIJALI */}
        {tab === 'testimonijali' && (
          <Section title={`Testimonijali (${draft.testimonials.length})`}>
            <TestimonialsSection
              items={draft.testimonials}
              onChange={(testimonials) => update('testimonials', testimonials)}
              productName={draft.name}
            />
          </Section>
        )}

        {/* TAB: SEO */}
        {tab === 'seo' && (
          <Section title="SEO i slugovi">
            <div className="space-y-4">
              <Field label="SEO naslov" hint={`${draft.seoTitle.length} karaktera (preporuka do 60)`}>
                <Input value={draft.seoTitle} onChange={(e) => update('seoTitle', e.target.value)} />
              </Field>
              <Field label="SEO opis" hint={`${draft.seoDescription.length} karaktera (preporuka do 160)`}>
                <Textarea value={draft.seoDescription} onChange={(e) => update('seoDescription', e.target.value)} rows={3} className="resize-y" />
              </Field>
              <Field label="Slug" hint="Samo mala slova, brojevi i crtice — deo URL-a stranice proizvoda.">
                <Input value={draft.slug} onChange={(e) => update('slug', e.target.value)} placeholder="npr. fungel" />
              </Field>
              <Field label="Alternativni slugovi" hint="Dodatni URL-ovi koji vode na isti proizvod (A/B landing stranice, SEO).">
                <StringListEditor values={draft.alternativeSlugs} onChange={(alternativeSlugs) => update('alternativeSlugs', alternativeSlugs)} placeholder="npr. fungel-akcija" addLabel="Dodaj slug" compact />
              </Field>
            </div>
          </Section>
        )}

        {/* TAB: MARKETING */}
        {tab === 'marketing' && (
          <>
            <Section title="Urgency elementi">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Ograničene zalihe (broj, opciono)">
                    <Input
                      type="number"
                      min={0}
                      value={draft.urgency.limitedStock}
                      onChange={(e) => update('urgency', { ...draft.urgency, limitedStock: e.target.value })}
                      placeholder="—"
                    />
                  </Field>
                  <Field label="Ograničeno vreme (tekst, opciono)">
                    <Input
                      value={draft.urgency.limitedTime}
                      onChange={(e) => update('urgency', { ...draft.urgency, limitedTime: e.target.value })}
                      placeholder="npr. Akcija traje do petka"
                    />
                  </Field>
                  <Field label="Social proof — broj skorašnjih kupovina">
                    <Input
                      type="number"
                      min={0}
                      value={draft.urgency.recentPurchases}
                      onChange={(e) => update('urgency', { ...draft.urgency, recentPurchases: e.target.value })}
                      placeholder="—"
                    />
                  </Field>
                  <Field label="Social proof — vremenski okvir" hint="Oba social proof polja moraju biti popunjena, ili nijedno.">
                    <Input
                      value={draft.urgency.timeFrame}
                      onChange={(e) => update('urgency', { ...draft.urgency, timeFrame: e.target.value })}
                      placeholder="npr. u poslednja 24 sata"
                    />
                  </Field>
                </div>
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                  ⚠ Ovi brojevi se prikazuju kao stvarni podaci — koristi realne vrednosti ili ostavi prazno.
                </p>
              </div>
            </Section>

            <Section title="Povezani proizvodi">
              <div className="space-y-5">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Cross-sell proizvodi</p>
                  <ProductMultiSelect
                    products={localeProducts}
                    selected={draft.crossSells}
                    onChange={(crossSells) => update('crossSells', crossSells)}
                    excludeId={draft.id || undefined}
                  />
                </div>
                <div className="space-y-2 border-t pt-4">
                  <p className="text-sm font-medium">Upsell proizvodi</p>
                  <ProductMultiSelect
                    products={localeProducts}
                    selected={draft.upsellProducts}
                    onChange={(upsellProducts) => update('upsellProducts', upsellProducts)}
                    excludeId={draft.id || undefined}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    <Field label="Popust (%)">
                      <Input
                        type="number"
                        min={0}
                        value={draft.upsellDiscountPercentage}
                        onChange={(e) => update('upsellDiscountPercentage', e.target.value)}
                        placeholder="—"
                        disabled={draft.upsellProducts.length === 0}
                      />
                    </Field>
                    <Field label="Cena bundle-a">
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={draft.upsellBundlePrice}
                        onChange={(e) => update('upsellBundlePrice', e.target.value)}
                        placeholder="—"
                        disabled={draft.upsellProducts.length === 0}
                      />
                    </Field>
                  </div>
                  {draft.upsellProducts.length === 0 && (
                    <p className="text-xs text-muted-foreground">Bez izabranih proizvoda upsell se ne šalje (polja su isključena).</p>
                  )}
                </div>
              </div>
            </Section>

            <Section title="Bundle / set">
              <BundleSection
                isBundle={draft.isBundle}
                onToggleBundle={(isBundle) => update('isBundle', isBundle)}
                items={draft.bundleItems}
                onChangeItems={(bundleItems) => update('bundleItems', bundleItems)}
                products={localeProducts}
                excludeId={draft.id || undefined}
              />
            </Section>
          </>
        )}
      </div>

      {/* Dialog potvrde brisanja */}
      <Dialog open={deleteOpen} onOpenChange={(open) => !open && !deleting && setDeleteOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Obriši proizvod</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Da li sigurno želiš da obrišeš proizvod <span className="font-semibold text-foreground">{draft.name || id}</span> iz
            lokala {locale.toUpperCase()}? Ova akcija ne može da se opozove.
          </p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)} disabled={deleting}>
              Otkaži
            </Button>
            <Button type="button" className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Brisanje…' : 'Obriši'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
