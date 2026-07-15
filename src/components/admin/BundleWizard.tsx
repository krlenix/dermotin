'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, ImagePlus, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product, ProductVariant } from '@/config/types';
import { adminFetch, AdminApiError } from './api';
import { ImagePickerDialog } from './ImagePickerDialog';
import {
  formatPrice,
  getDefaultVariant,
  isValidSlug,
  kebabCase,
  LOCALE_CURRENCY,
  ProductSaveResponse,
  sortedProducts,
  truncateSeo,
} from './akcije/helpers';

interface BundleWizardProps {
  open: boolean;
  onClose: () => void;
  locale: string;
  /** Kompletan katalog lokala (za izbor komponenti i proveru zauzetih ID/slugova) */
  products: Record<string, Product>;
  /** Poziva se posle uspešnog kreiranja (osvežavanje liste) */
  onCreated: () => Promise<void> | void;
}

interface SelectedComponent {
  productId: string;
  variantId: string;
  quantity: number;
}

const STEPS = ['Osnovno', 'Komponente', 'Cena', 'Slike', 'Pregled'] as const;

/** Čarobnjak za kreiranje novog bundle (set) proizvoda u 5 koraka */
export function BundleWizard({ open, onClose, locale, products, onCreated }: BundleWizardProps) {
  const [step, setStep] = useState(1);
  const [stepError, setStepError] = useState<string | null>(null);

  // Korak 1 — osnovno
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [idTouched, setIdTouched] = useState(false);
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [sku, setSku] = useState('');
  const [skuTouched, setSkuTouched] = useState(false);
  const [shortDescription, setShortDescription] = useState('');

  // Korak 2 — komponente (redosled izbora se čuva)
  const [components, setComponents] = useState<SelectedComponent[]>([]);

  // Korak 3 — cena
  const [fullPrice, setFullPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [discountTouched, setDiscountTouched] = useState(false);

  // Korak 4 — slike
  const [mainImage, setMainImage] = useState('');
  const [thumbnailImage, setThumbnailImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [pickerTarget, setPickerTarget] = useState<'main' | 'thumbnail' | 'gallery' | null>(null);

  // Korak 5 — slanje
  const [creating, setCreating] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitIssues, setSubmitIssues] = useState<string[]>([]);

  const currency = LOCALE_CURRENCY[locale] ?? 'RSD';
  const availableComponents = useMemo(
    () => sortedProducts(products).filter((product) => !product.isBundle),
    [products]
  );

  const findVariant = (component: SelectedComponent): ProductVariant | undefined => {
    const product = products[component.productId];
    if (!product) return undefined;
    return product.variants.find((variant) => variant.id === component.variantId) ?? getDefaultVariant(product);
  };

  /** Zbir pojedinačnih cena komponenti (discountPrice ?? price × količina) */
  const individualSum = useMemo(
    () =>
      components.reduce((sum, component) => {
        const variant = findVariant(component);
        return variant ? sum + (variant.discountPrice ?? variant.price) * component.quantity : sum;
      }, 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [components, products]
  );

  const suggestedDiscount = Math.round((individualSum * 0.85) / 10) * 10;

  // --- Izvedena polja iz koraka 1 ---

  const handleNameChange = (value: string) => {
    setName(value);
    if (!idTouched) {
      const generated = kebabCase(value);
      setId(generated);
      if (!slugTouched) setSlug(generated);
      if (!skuTouched) setSku(generated.toUpperCase());
    }
  };

  const handleIdChange = (value: string) => {
    setId(value);
    setIdTouched(true);
    if (!slugTouched) setSlug(value);
    if (!skuTouched) setSku(value.toUpperCase());
  };

  // --- Komponente ---

  const toggleComponent = (product: Product, checked: boolean) => {
    if (checked) {
      const defaultVariant = getDefaultVariant(product);
      if (!defaultVariant) return;
      setComponents((prev) => [
        ...prev,
        { productId: product.id, variantId: defaultVariant.id, quantity: 1 },
      ]);
    } else {
      setComponents((prev) => prev.filter((component) => component.productId !== product.id));
    }
  };

  const updateComponent = (productId: string, patch: Partial<SelectedComponent>) => {
    setComponents((prev) =>
      prev.map((component) => (component.productId === productId ? { ...component, ...patch } : component))
    );
  };

  // --- Validacija po koraku ---

  const validateStep = (current: number): string | null => {
    if (current === 1) {
      if (!name.trim()) return 'Unesi naziv bundla.';
      if (!isValidSlug(id)) return 'ID sme da sadrži samo mala slova, brojeve i crtice (npr. bioroid-set).';
      if (products[id]) return `ID „${id}" je već zauzet u ovom lokalu.`;
      if (!isValidSlug(slug)) return 'Slug sme da sadrži samo mala slova, brojeve i crtice.';
      const slugTaken = Object.values(products).some(
        (existing) => existing.slug === slug || existing.alternativeSlugs.includes(slug)
      );
      if (slugTaken) return `Slug „${slug}" je već zauzet u ovom lokalu.`;
      if (!sku.trim()) return 'Unesi SKU.';
      if (!shortDescription.trim()) return 'Unesi kratak opis.';
    }
    if (current === 2) {
      if (components.length < 1) return 'Izaberi bar jednu komponentu bundla.';
    }
    if (current === 3) {
      const price = Number(fullPrice);
      if (fullPrice.trim() === '' || Number.isNaN(price) || price <= 0) {
        return 'Puna cena mora biti pozitivan broj.';
      }
      if (discountPrice.trim() !== '') {
        const discount = Number(discountPrice);
        if (Number.isNaN(discount) || discount <= 0) return 'Akcijska cena mora biti pozitivan broj.';
        if (discount >= price) return 'Akcijska cena mora biti manja od pune cene.';
      }
    }
    if (current === 4) {
      if (!mainImage) return 'Izaberi glavnu sliku bundla.';
      if (!thumbnailImage) return 'Izaberi thumbnail sliku bundla.';
    }
    return null;
  };

  const goNext = () => {
    const error = validateStep(step);
    if (error) {
      setStepError(error);
      return;
    }
    setStepError(null);
    // Ulazak u korak cene — predloži cene na osnovu zbira komponenti
    if (step === 2) {
      if (fullPrice.trim() === '') setFullPrice(String(individualSum));
      if (discountPrice.trim() === '' && !discountTouched && suggestedDiscount > 0) {
        setDiscountPrice(String(suggestedDiscount));
      }
    }
    setStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const goBack = () => {
    setStepError(null);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  // --- Sastavljanje kompletnog Product objekta ---

  const buildProduct = (): Product => {
    const entries = components
      .map((component) => ({ component, product: products[component.productId] }))
      .filter((entry): entry is { component: SelectedComponent; product: Product } => Boolean(entry.product));

    const componentNames = entries.map(
      ({ component, product }) => `${product.name}${component.quantity > 1 ? ` × ${component.quantity}` : ''}`
    );
    const listing = componentNames.join(' + ');
    const trimmedName = name.trim();
    const trimmedShort = shortDescription.trim();
    const description = `SET: ${listing}. ${trimmedShort}`;

    // Unija sastojaka — redosled: prva komponenta, pa nove iz sledećih
    const ingredients: string[] = [];
    for (const { product } of entries) {
      for (const ingredientId of product.ingredients) {
        if (!ingredients.includes(ingredientId)) ingredients.push(ingredientId);
      }
    }

    // Upotreba — „NAZIV: usage" po redosledu komponenti
    const usage = entries.map(({ product }) => `${product.name}: ${product.usage}`).join('\n\n');

    // Unija upozorenja (dedupe)
    const warnings: string[] = [];
    for (const { product } of entries) {
      for (const warning of product.warnings) {
        if (!warnings.includes(warning)) warnings.push(warning);
      }
    }

    // Galerija — ako je prazna, koriste se glavne slike komponenti
    const gallery =
      galleryImages.length > 0
        ? galleryImages
        : [...new Set(entries.map(({ product }) => product.images.main))];

    const price = Number(fullPrice);
    const discount = discountPrice.trim() !== '' ? Number(discountPrice) : undefined;

    return {
      id,
      name: trimmedName,
      description,
      shortDescription: trimmedShort,
      heroTitle: trimmedName,
      purpose: `Set proizvoda — ${trimmedShort}`,
      category: 'bundle',
      images: { main: mainImage, gallery, thumbnail: thumbnailImage },
      variants: [
        {
          id: `${id}-set`,
          sku: sku.trim(),
          name: '1 SET',
          quantity: 1,
          price,
          ...(discount !== undefined ? { discountPrice: discount } : {}),
          currency,
          isDefault: true,
        },
      ],
      benefits: [
        `Komplet: ${listing}`,
        'Povoljnije nego pojedinačna kupovina',
        'Proizvodi koji se dopunjuju u svakodnevnoj rutini',
      ],
      ingredients,
      usage,
      warnings,
      slug,
      alternativeSlugs: [],
      availableCountries: [locale],
      seoTitle: `${trimmedName} | DERMOTIN`,
      seoDescription: truncateSeo(description),
      urgencyElements: {},
      published: false,
      isBundle: true,
      bundleItems: components.map((component) => ({
        productId: component.productId,
        variantId: component.variantId,
        quantity: component.quantity,
      })),
    };
  };

  const handleCreate = async () => {
    setCreating(true);
    setSubmitError(null);
    setSubmitIssues([]);
    try {
      await adminFetch<ProductSaveResponse>(`/api/admin/products/${locale}`, {
        method: 'POST',
        body: JSON.stringify(buildProduct()),
      });
      toast.success('Bundle kreiran kao draft — doradi ga i objavi');
      await onCreated();
      onClose();
    } catch (error) {
      if (error instanceof AdminApiError) {
        setSubmitError(error.message);
        setSubmitIssues(error.issues ?? []);
      } else {
        setSubmitError('Kreiranje nije uspelo. Pokušaj ponovo.');
      }
    } finally {
      setCreating(false);
    }
  };

  // --- Render pojedinačnih koraka ---

  const renderStepOsnovno = () => (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="bw-name">Naziv bundla</Label>
        <Input
          id="bw-name"
          placeholder="npr. BIOROID SET — melem + kapi"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="bw-id">ID</Label>
          <Input id="bw-id" placeholder="bioroid-set" value={id} onChange={(e) => handleIdChange(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bw-slug">Slug (URL)</Label>
          <Input
            id="bw-slug"
            placeholder="bioroid-set"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bw-sku">SKU</Label>
          <Input
            id="bw-sku"
            placeholder="BIOROID-SET"
            value={sku}
            onChange={(e) => {
              setSku(e.target.value.toUpperCase());
              setSkuTouched(true);
            }}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="bw-short">Kratak opis</Label>
        <Textarea
          id="bw-short"
          rows={3}
          placeholder="npr. Kompletna nega — melem za spoljašnju upotrebu i kapi za unutrašnju podršku."
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
        />
      </div>
    </div>
  );

  const renderStepKomponente = () => (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Izaberi proizvode koji ulaze u set. Preporuka: bundle ima najviše smisla sa 2 ili više komponenti.
      </p>
      {availableComponents.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nema dostupnih proizvoda u ovom lokalu.</p>
      ) : (
        <div className="space-y-2">
          {availableComponents.map((product) => {
            const selected = components.find((component) => component.productId === product.id);
            const variant = selected ? findVariant(selected) : undefined;
            return (
              <div key={product.id} className="border rounded-md bg-white px-3 py-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`bw-comp-${product.id}`}
                    checked={Boolean(selected)}
                    onCheckedChange={(checked) => toggleComponent(product, checked === true)}
                  />
                  <Label htmlFor={`bw-comp-${product.id}`} className="flex-1 cursor-pointer text-sm">
                    {product.name}
                    <span className="text-muted-foreground font-normal"> — {product.slug}</span>
                  </Label>
                  {product.published === false && (
                    <span className="text-xs text-amber-600 font-semibold">draft</span>
                  )}
                </div>
                {selected && (
                  <div className="mt-2 flex flex-wrap items-center gap-3 pl-6">
                    <Select
                      value={selected.variantId}
                      onValueChange={(value) => updateComponent(product.id, { variantId: value })}
                    >
                      <SelectTrigger className="h-8 w-full sm:w-64">
                        <SelectValue placeholder="Varijanta" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.variants.map((productVariant) => (
                          <SelectItem key={productVariant.id} value={productVariant.id}>
                            {productVariant.name} —{' '}
                            {formatPrice(
                              productVariant.discountPrice ?? productVariant.price,
                              productVariant.currency
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-1.5">
                      <Label htmlFor={`bw-qty-${product.id}`} className="text-xs text-muted-foreground">
                        Količina
                      </Label>
                      <Input
                        id={`bw-qty-${product.id}`}
                        type="number"
                        min={1}
                        className="h-8 w-20"
                        value={selected.quantity}
                        onChange={(e) => {
                          const parsed = Math.max(1, Math.floor(Number(e.target.value) || 1));
                          updateComponent(product.id, { quantity: parsed });
                        }}
                      />
                    </div>
                    {variant && (
                      <span className="text-xs text-muted-foreground">
                        = {formatPrice((variant.discountPrice ?? variant.price) * selected.quantity, variant.currency)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {components.length === 1 && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          Izabrana je samo jedna komponenta — set obično kombinuje 2 ili više proizvoda.
        </p>
      )}
    </div>
  );

  const renderStepCena = () => (
    <div className="space-y-4">
      <div className="rounded-md border bg-gray-50 px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Vrednost pojedinačno</p>
          <p className="text-xs text-muted-foreground">
            Zbir cena izabranih komponenti (akcijska cena komponente ako postoji × količina)
          </p>
        </div>
        <p className="text-lg font-bold whitespace-nowrap">{formatPrice(individualSum, currency)}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="bw-price">Puna cena ({currency})</Label>
          <Input
            id="bw-price"
            type="number"
            min={0}
            value={fullPrice}
            onChange={(e) => setFullPrice(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bw-discount">Akcijska cena ({currency}, opciono)</Label>
          <Input
            id="bw-discount"
            type="number"
            min={0}
            value={discountPrice}
            onChange={(e) => {
              setDiscountPrice(e.target.value);
              setDiscountTouched(true);
            }}
          />
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={() => {
          setFullPrice(String(individualSum));
          setDiscountPrice(suggestedDiscount > 0 ? String(suggestedDiscount) : '');
        }}
      >
        <Sparkles className="h-3.5 w-3.5" /> Predloži cene (zbir + 15% popusta)
      </Button>
      <p className="text-xs text-muted-foreground">
        Valuta se dodeljuje automatski prema lokalu: {locale.toUpperCase()} → {currency}.
      </p>
    </div>
  );

  const renderImageSlot = (label: string, value: string, target: 'main' | 'thumbnail') => (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <div className="relative w-20 h-20 border rounded-md bg-gray-50 shrink-0 overflow-hidden">
          {value ? (
            <Image src={value} alt={label} fill sizes="80px" className="object-contain p-1" />
          ) : (
            <ImagePlus className="h-6 w-6 text-gray-300 absolute inset-0 m-auto" />
          )}
        </div>
        <div className="space-y-1 min-w-0">
          <Button type="button" variant="outline" size="sm" onClick={() => setPickerTarget(target)}>
            {value ? 'Promeni sliku' : 'Izaberi sliku'}
          </Button>
          {value && <p className="text-xs text-muted-foreground truncate max-w-56">{value.split('/').pop()}</p>}
        </div>
      </div>
    </div>
  );

  const renderStepSlike = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderImageSlot('Glavna slika', mainImage, 'main')}
        {renderImageSlot('Thumbnail', thumbnailImage, 'thumbnail')}
      </div>
      {mainImage && !thumbnailImage && (
        <Button type="button" variant="outline" size="sm" onClick={() => setThumbnailImage(mainImage)}>
          Koristi glavnu sliku i kao thumbnail
        </Button>
      )}
      <Separator />
      <div className="space-y-2">
        <Label>Galerija (opciono)</Label>
        <p className="text-xs text-muted-foreground">
          Ako ostaviš prazno, kao galerija će se koristiti glavne slike izabranih komponenti.
        </p>
        {galleryImages.length > 0 && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {galleryImages.map((url, index) => (
              <div key={`${url}-${index}`} className="relative border rounded-md bg-gray-50 aspect-square group">
                <Image src={url} alt={`Galerija ${index + 1}`} fill sizes="100px" className="object-contain p-1" />
                <button
                  type="button"
                  aria-label="Ukloni sliku"
                  className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setGalleryImages((prev) => prev.filter((_, i) => i !== index))}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => setPickerTarget('gallery')}>
          <ImagePlus className="h-3.5 w-3.5" /> Dodaj sliku u galeriju
        </Button>
      </div>
    </div>
  );

  const renderStepPregled = () => {
    const price = Number(fullPrice);
    const discount = discountPrice.trim() !== '' ? Number(discountPrice) : undefined;
    const componentLabels = components.map((component) => {
      const product = products[component.productId];
      const variant = findVariant(component);
      return `${product?.name ?? component.productId}${variant ? ` (${variant.name})` : ''} × ${component.quantity}`;
    });
    return (
      <div className="space-y-4 text-sm">
        <div className="rounded-md border bg-gray-50 px-4 py-3 space-y-2">
          <p className="font-semibold text-base">{name.trim()}</p>
          <p className="text-xs text-muted-foreground">
            ID: {id} · slug: /{slug} · SKU: {sku}
          </p>
          <Separator />
          <div>
            <p className="font-medium">Komponente</p>
            <ul className="list-disc pl-5 text-muted-foreground">
              {componentLabels.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          </div>
          <Separator />
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            <p>
              <span className="text-muted-foreground">Vrednost pojedinačno:</span>{' '}
              {formatPrice(individualSum, currency)}
            </p>
            <p>
              <span className="text-muted-foreground">Puna cena:</span>{' '}
              {Number.isNaN(price) ? '—' : formatPrice(price, currency)}
            </p>
            {discount !== undefined && !Number.isNaN(discount) && (
              <p>
                <span className="text-muted-foreground">Akcijska cena:</span>{' '}
                <span className="font-semibold text-brand-orange">{formatPrice(discount, currency)}</span>
              </p>
            )}
          </div>
          <Separator />
          <p className="text-muted-foreground">
            <span className="font-medium text-gray-700">Opis:</span> SET:{' '}
            {components.map((component) => products[component.productId]?.name ?? component.productId).join(' + ')}.{' '}
            {shortDescription.trim()}
          </p>
          <p className="text-xs text-muted-foreground">
            Slike: glavna + thumbnail{galleryImages.length > 0 ? ` + ${galleryImages.length} u galeriji` : ' (galerija: glavne slike komponenti)'}
          </p>
        </div>
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          Bundle se kreira kao <strong>draft</strong> — neće biti vidljiv na sajtu dok ga ne objaviš. Tekstove
          (opis, benefite, upotrebu) možeš doraditi u editoru proizvoda.
        </p>
        {submitError && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2 space-y-1">
            <p className="font-medium">{submitError}</p>
            {submitIssues.length > 0 && (
              <ul className="list-disc pl-5 text-xs">
                {submitIssues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && !creating && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Novi bundle — {STEPS[step - 1]}</DialogTitle>
        </DialogHeader>

        {/* Indikator koraka */}
        <div className="flex items-center gap-1 flex-wrap">
          {STEPS.map((label, index) => {
            const number = index + 1;
            const active = number === step;
            const done = number < step;
            return (
              <div key={label} className="flex items-center gap-1">
                {index > 0 && <div className="w-4 h-px bg-gray-300" />}
                <div
                  className={cn(
                    'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium',
                    active ? 'bg-brand-green text-white' : done ? 'text-brand-green' : 'text-gray-400'
                  )}
                >
                  <span
                    className={cn(
                      'flex items-center justify-center w-4 h-4 rounded-full text-[10px] border',
                      active
                        ? 'border-white/70'
                        : done
                          ? 'border-brand-green bg-brand-green text-white'
                          : 'border-gray-300'
                    )}
                  >
                    {number}
                  </span>
                  <span className="hidden sm:inline">{label}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto py-1 pr-1">
          {step === 1 && renderStepOsnovno()}
          {step === 2 && renderStepKomponente()}
          {step === 3 && renderStepCena()}
          {step === 4 && renderStepSlike()}
          {step === 5 && renderStepPregled()}
        </div>

        {stepError && <p className="text-sm text-red-600">{stepError}</p>}

        <div className="flex items-center justify-between gap-2 pt-2 border-t">
          <Button type="button" variant="ghost" disabled={creating} onClick={onClose}>
            Otkaži
          </Button>
          <div className="flex items-center gap-2">
            {step > 1 && (
              <Button type="button" variant="outline" className="gap-1.5" disabled={creating} onClick={goBack}>
                <ArrowLeft className="h-4 w-4" /> Nazad
              </Button>
            )}
            {step < STEPS.length ? (
              <Button
                type="button"
                className="bg-brand-green hover:bg-brand-green/90 text-white gap-1.5"
                onClick={goNext}
              >
                Dalje <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                className="bg-brand-orange hover:bg-brand-orange/90 text-white"
                disabled={creating}
                onClick={handleCreate}
              >
                {creating ? 'Kreiranje…' : 'Kreiraj bundle'}
              </Button>
            )}
          </div>
        </div>

        <ImagePickerDialog
          open={pickerTarget !== null}
          onClose={() => setPickerTarget(null)}
          uploadFolder={`products/${id || 'bundles'}`}
          onSelect={(url) => {
            if (pickerTarget === 'main') setMainImage(url);
            else if (pickerTarget === 'thumbnail') setThumbnailImage(url);
            else if (pickerTarget === 'gallery') setGalleryImages((prev) => [...prev, url]);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
