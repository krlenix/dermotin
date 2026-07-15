'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { Coupon, CouponType } from '@/config/coupons';
import { adminFetch, AdminApiError } from '@/components/admin/api';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
  COUNTRY_OPTIONS,
  COUPON_CODE_REGEX,
  COUPON_TYPE_LABELS,
  COUPON_TYPE_ORDER,
  isoToLocalInput,
  localInputToIso,
  type CountryCode,
} from './coupon-meta';

interface CouponFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** null → kreiranje novog kupona */
  coupon: Coupon | null;
  /** postojeći kodovi za lokalnu proveru duplikata pri kreiranju */
  existingCodes: string[];
  /** poziva se posle uspešnog snimanja (osvežavanje liste) */
  onSaved: () => void;
}

export function CouponFormDialog({
  open,
  onOpenChange,
  coupon,
  existingCodes,
  onSaved,
}: CouponFormDialogProps) {
  const isNew = coupon === null;

  const [code, setCode] = useState('');
  const [type, setType] = useState<CouponType>('percentage');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [minOrderValue, setMinOrderValue] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [countries, setCountries] = useState<CountryCode[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [issues, setIssues] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Vrednost se ne unosi za besplatnu dostavu i BOGO — uvek je 0
  const valueLocked = type === 'free_shipping' || type === 'bogo';

  // Pri svakom otvaranju napuni formu podacima (ili je isprazni za nov kupon)
  useEffect(() => {
    if (!open) return;
    setCode(coupon?.code ?? '');
    setType(coupon?.type ?? 'percentage');
    setValue(coupon ? String(coupon.value) : '');
    setDescription(coupon?.description ?? '');
    setMinOrderValue(
      coupon?.minOrderValue !== undefined && coupon.minOrderValue > 0 ? String(coupon.minOrderValue) : ''
    );
    setMaxDiscount(coupon?.maxDiscount !== undefined ? String(coupon.maxDiscount) : '');
    setValidUntil(isoToLocalInput(coupon?.validUntil));
    setCountries(
      (coupon?.countries ?? []).filter((c): c is CountryCode =>
        (COUNTRY_OPTIONS as readonly string[]).includes(c)
      )
    );
    setEnabled(coupon?.enabled ?? true);
    setIssues([]);
    setSaving(false);
  }, [open, coupon]);

  const handleTypeChange = (next: CouponType) => {
    setType(next);
    if (next === 'free_shipping' || next === 'bogo') setValue('0');
  };

  const toggleCountry = (countryCode: CountryCode, checked: boolean) => {
    setCountries((prev) =>
      checked ? [...prev.filter((c) => c !== countryCode), countryCode] : prev.filter((c) => c !== countryCode)
    );
  };

  const validate = (): string[] => {
    const errors: string[] = [];
    const trimmedCode = code.trim();

    if (isNew) {
      if (!COUPON_CODE_REGEX.test(trimmedCode)) {
        errors.push('code: kod sme da sadrži samo velika slova, brojeve, crtice i donje crte (npr. „POPUST20").');
      } else if (existingCodes.includes(trimmedCode)) {
        errors.push(`code: kupon „${trimmedCode}" već postoji.`);
      }
    }

    if (!valueLocked) {
      const numeric = Number(value);
      if (value.trim() === '' || Number.isNaN(numeric) || numeric < 0) {
        errors.push('value: vrednost mora biti broj veći ili jednak 0.');
      } else if (type === 'percentage' && numeric > 100) {
        errors.push('value: procenat mora biti između 0 i 100.');
      }
    }

    if (minOrderValue.trim() !== '' && (Number.isNaN(Number(minOrderValue)) || Number(minOrderValue) < 0)) {
      errors.push('minOrderValue: minimalna vrednost porudžbine mora biti broj veći ili jednak 0.');
    }
    if (
      type === 'percentage' &&
      maxDiscount.trim() !== '' &&
      (Number.isNaN(Number(maxDiscount)) || Number(maxDiscount) < 0)
    ) {
      errors.push('maxDiscount: maksimalni popust mora biti broj veći ili jednak 0.');
    }

    return errors;
  };

  const handleSubmit = async () => {
    const errors = validate();
    if (errors.length > 0) {
      setIssues(errors);
      return;
    }

    // Opciona prazna polja se izostavljaju — server ne prima prazne stringove
    const trimmedDescription = description.trim();
    const payload: Coupon = {
      code: isNew ? code.trim() : coupon.code,
      type,
      value: valueLocked ? 0 : Number(value),
      ...(trimmedDescription ? { description: trimmedDescription } : {}),
      ...(minOrderValue.trim() !== '' ? { minOrderValue: Number(minOrderValue) } : {}),
      ...(type === 'percentage' && maxDiscount.trim() !== '' ? { maxDiscount: Number(maxDiscount) } : {}),
      ...(validUntil ? { validUntil: localInputToIso(validUntil) } : {}),
      ...(countries.length > 0 ? { countries } : {}),
      enabled,
    };

    setSaving(true);
    setIssues([]);
    try {
      await adminFetch(
        isNew ? '/api/admin/coupons' : `/api/admin/coupons/${encodeURIComponent(coupon.code)}`,
        {
          method: isNew ? 'POST' : 'PUT',
          body: JSON.stringify(payload),
        }
      );
      toast.success(isNew ? `Kupon „${payload.code}" je kreiran.` : `Izmene kupona „${payload.code}" su sačuvane.`);
      onOpenChange(false);
      onSaved();
    } catch (error) {
      if (error instanceof AdminApiError) {
        if (error.issues?.length) setIssues(error.issues);
        toast.error(error.message);
      } else {
        toast.error('Greška pri snimanju kupona.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !saving && onOpenChange(next)}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNew ? 'Nov kupon' : `Uredi kupon: ${coupon.code}`}</DialogTitle>
          <DialogDescription>
            {isNew
              ? 'Unesi podatke o novom kuponu. Kod mora biti jedinstven i piše se velikim slovima.'
              : 'Izmeni podatke o kuponu. Kod nije moguće menjati.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="coupon-code">Kod</Label>
              <Input
                id="coupon-code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                disabled={!isNew}
                placeholder="npr. POPUST20"
                className="font-mono uppercase"
              />
              {isNew && (
                <p className="text-xs text-muted-foreground">
                  Velika slova, brojevi, crtice i donje crte. Posle kreiranja se ne može menjati.
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="coupon-type">Tip</Label>
              <Select value={type} onValueChange={(next) => handleTypeChange(next as CouponType)}>
                <SelectTrigger id="coupon-type" className="w-full">
                  <SelectValue placeholder="Izaberi tip" />
                </SelectTrigger>
                <SelectContent>
                  {COUPON_TYPE_ORDER.map((couponType) => (
                    <SelectItem key={couponType} value={couponType}>
                      {COUPON_TYPE_LABELS[couponType]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="coupon-value">Vrednost</Label>
            <div className="relative">
              <Input
                id="coupon-value"
                type="number"
                min={0}
                max={type === 'percentage' ? 100 : undefined}
                value={valueLocked ? '0' : value}
                onChange={(e) => setValue(e.target.value)}
                disabled={valueLocked}
                placeholder={type === 'percentage' ? 'npr. 20' : 'npr. 500'}
                className={type === 'percentage' ? 'pr-10' : undefined}
              />
              {type === 'percentage' && (
                <span className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              )}
            </div>
            {valueLocked && (
              <p className="text-xs text-muted-foreground">
                {type === 'free_shipping'
                  ? 'Besplatna dostava nema vrednost — popust je jednak ceni dostave.'
                  : 'Za 1+1 GRATIS popust se računa po broju besplatnih artikala.'}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="coupon-description">Opis (opciono)</Label>
            <Textarea
              id="coupon-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="npr. 20% popusta na porudžbinu (reklamni kupon)"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="coupon-min-order">Min. vrednost porudžbine (opciono)</Label>
              <Input
                id="coupon-min-order"
                type="number"
                min={0}
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(e.target.value)}
                placeholder="npr. 2000"
              />
            </div>
            {type === 'percentage' && (
              <div className="space-y-1.5">
                <Label htmlFor="coupon-max-discount">Maks. iznos popusta (opciono)</Label>
                <Input
                  id="coupon-max-discount"
                  type="number"
                  min={0}
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(e.target.value)}
                  placeholder="npr. 1000"
                />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="coupon-valid-until">Važi do (opciono)</Label>
            <Input
              id="coupon-valid-until"
              type="datetime-local"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Prazno = kupon nema datum isteka.</p>
          </div>

          <div className="space-y-1.5">
            <Label>Zemlje</Label>
            <div className="flex flex-wrap gap-4">
              {COUNTRY_OPTIONS.map((countryCode) => (
                <label
                  key={countryCode}
                  className="flex cursor-pointer items-center gap-2 text-sm font-medium"
                >
                  <Checkbox
                    checked={countries.includes(countryCode)}
                    onCheckedChange={(checked) => toggleCountry(countryCode, checked === true)}
                  />
                  {countryCode.toUpperCase()}
                </label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Ništa štiklirano = kupon važi u svim zemljama.</p>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
            <Checkbox checked={enabled} onCheckedChange={(checked) => setEnabled(checked === true)} />
            Kupon je uključen
          </label>

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
            {saving ? 'Snimanje…' : isNew ? 'Kreiraj kupon' : 'Sačuvaj izmene'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
