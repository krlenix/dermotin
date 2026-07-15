'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AlertTriangle, Gift } from 'lucide-react';
import type { Coupon } from '@/config/coupons';
import { adminFetch, AdminApiError } from '@/components/admin/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusToggle } from './StatusToggle';
import {
  COUPON_CODE_REGEX,
  isoToLocalInput,
  localInputToIso,
  type BogoSettings,
} from './coupon-meta';

interface BogoSettingsCardProps {
  bogo: BogoSettings;
  /** trenutni kuponi — za upozorenje ako BOGO kod ne pokazuje na validan bogo kupon */
  coupons: Record<string, Coupon>;
  /** poziva se posle uspešnog snimanja (osvežavanje podataka) */
  onSaved: () => void;
}

export function BogoSettingsCard({ bogo, coupons, onSaved }: BogoSettingsCardProps) {
  const [enabled, setEnabled] = useState(bogo.enabled);
  const [couponCode, setCouponCode] = useState(bogo.couponCode);
  const [expirationDate, setExpirationDate] = useState(isoToLocalInput(bogo.expirationDate));
  const [maxQuantity, setMaxQuantity] = useState(String(bogo.maxQuantity));
  const [issues, setIssues] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Kada stignu sveži podaci sa servera (posle snimanja/osvežavanja), resetuj formu
  useEffect(() => {
    setEnabled(bogo.enabled);
    setCouponCode(bogo.couponCode);
    setExpirationDate(isoToLocalInput(bogo.expirationDate));
    setMaxQuantity(String(bogo.maxQuantity));
    setIssues([]);
  }, [bogo]);

  // Upozorenje ako uneti kod ne odgovara postojećem, uključenom bogo kuponu
  const codeWarning = useMemo(() => {
    const trimmed = couponCode.trim();
    if (!trimmed) return null;
    const linked = coupons[trimmed];
    if (!linked) {
      return `Kupon „${trimmed}" ne postoji u listi iznad — kreiraj ga kao tip „1+1 GRATIS" da bi ponuda radila.`;
    }
    if (linked.type !== 'bogo') {
      return `Kupon „${trimmed}" postoji, ali nije tipa „1+1 GRATIS".`;
    }
    if (!linked.enabled) {
      return `Kupon „${trimmed}" je trenutno isključen u listi kupona.`;
    }
    return null;
  }, [couponCode, coupons]);

  const validate = (): string[] => {
    const errors: string[] = [];
    const trimmed = couponCode.trim();
    if (!COUPON_CODE_REGEX.test(trimmed)) {
      errors.push('couponCode: kod sme da sadrži samo velika slova, brojeve, crtice i donje crte.');
    }
    if (!expirationDate) {
      errors.push('expirationDate: datum isteka ponude je obavezan.');
    }
    const quantity = Number(maxQuantity);
    if (maxQuantity.trim() === '' || !Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
      errors.push('maxQuantity: maksimalna količina mora biti ceo broj između 1 i 10.');
    }
    return errors;
  };

  const handleSave = async () => {
    const errors = validate();
    if (errors.length > 0) {
      setIssues(errors);
      return;
    }

    setSaving(true);
    setIssues([]);
    try {
      await adminFetch('/api/admin/bogo', {
        method: 'PUT',
        body: JSON.stringify({
          enabled,
          couponCode: couponCode.trim(),
          expirationDate: localInputToIso(expirationDate),
          maxQuantity: Number(maxQuantity),
        }),
      });
      toast.success('BOGO podešavanja su sačuvana.');
      onSaved();
    } catch (error) {
      if (error instanceof AdminApiError) {
        if (error.issues?.length) setIssues(error.issues);
        toast.error(error.message);
      } else {
        toast.error('Greška pri snimanju BOGO podešavanja.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gift className="h-5 w-5 text-purple-600" />
          1+1 GRATIS ponuda
        </CardTitle>
        <CardDescription>
          Globalna podešavanja BOGO ponude — kontrolišu da li 1+1 kupon važi na sajtu i do kada.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3">
          <div>
            <p className="text-sm font-medium">Status ponude</p>
            <p className="text-xs text-muted-foreground">
              Kada je isključena, 1+1 kupon ne važi bez obzira na datum isteka.
            </p>
          </div>
          <StatusToggle
            enabled={enabled}
            onToggle={() => setEnabled((prev) => !prev)}
            disabled={saving}
            onLabel="Uključena"
            offLabel="Isključena"
            ariaLabel="Status 1+1 ponude"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="bogo-coupon-code">Kupon kod</Label>
            <Input
              id="bogo-coupon-code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="npr. 1PLUS1"
              className="font-mono uppercase"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bogo-expiration">Ponuda važi do</Label>
            <Input
              id="bogo-expiration"
              type="datetime-local"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bogo-max-quantity">Maks. količina (parova)</Label>
            <Input
              id="bogo-max-quantity"
              type="number"
              min={1}
              max={10}
              step={1}
              value={maxQuantity}
              onChange={(e) => setMaxQuantity(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Npr. 3 znači najviše 3+3 artikla.</p>
          </div>
        </div>

        {codeWarning && (
          <div className="flex items-start gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <p>{codeWarning}</p>
          </div>
        )}

        {issues.length > 0 && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            <p className="font-medium mb-1">Podešavanja nisu validna:</p>
            <ul className="list-disc pl-5 space-y-0.5">
              {issues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Promena automatski povećava verziju konfiguracije (trenutno v{bogo.configVersion}) i poništava keš u
          browserima kupaca.
        </p>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-brand-green hover:bg-brand-green/90 text-white"
        >
          {saving ? 'Snimanje…' : 'Sačuvaj BOGO podešavanja'}
        </Button>
      </CardContent>
    </Card>
  );
}
