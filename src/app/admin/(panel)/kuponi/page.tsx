'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Gift, Info, Pencil, Plus, TicketPercent, Trash2 } from 'lucide-react';
import type { Coupon } from '@/config/coupons';
import { adminFetch } from '@/components/admin/api';
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
import { BogoSettingsCard } from '@/components/admin/kuponi/BogoSettingsCard';
import { CouponFormDialog } from '@/components/admin/kuponi/CouponFormDialog';
import { StatusToggle } from '@/components/admin/kuponi/StatusToggle';
import {
  COUPON_TYPE_BADGE_CLASSES,
  COUPON_TYPE_LABELS,
  formatCouponValue,
  formatDateTimeDisplay,
  pluralAktivan,
  pluralKupon,
  type BogoSettings,
} from '@/components/admin/kuponi/coupon-meta';

interface CouponsResponse {
  success: boolean;
  coupons: Record<string, Coupon>;
  bogo: BogoSettings;
}

/** Ograničenja kupona kao sitni tekst — samo delovi koji postoje */
function constraintParts(coupon: Coupon): string[] {
  const parts: string[] = [];
  if (coupon.minOrderValue !== undefined && coupon.minOrderValue > 0) {
    parts.push(`min. porudžbina ${coupon.minOrderValue}`);
  }
  if (coupon.maxDiscount !== undefined && coupon.maxDiscount > 0) {
    parts.push(`maks. popust ${coupon.maxDiscount}`);
  }
  if (coupon.validUntil) {
    parts.push(`važi do ${formatDateTimeDisplay(coupon.validUntil)}`);
  }
  if (coupon.countries && coupon.countries.length > 0) {
    parts.push(`zemlje: ${coupon.countries.map((c) => c.toUpperCase()).join('/')}`);
  }
  return parts;
}

export default function AdminKuponiPage() {
  const [data, setData] = useState<CouponsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingCode, setTogglingCode] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const response = await adminFetch<CouponsResponse>('/api/admin/coupons');
      setData(response);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Greška pri učitavanju kupona.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const coupons = useMemo(() => (data ? Object.values(data.coupons) : []), [data]);
  const activeCount = useMemo(() => coupons.filter((coupon) => coupon.enabled).length, [coupons]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (coupon: Coupon) => {
    setEditing(coupon);
    setFormOpen(true);
  };

  /** Uključi/isključi kupon: optimistički update + PUT; na grešku vrati staro stanje */
  const handleToggle = async (coupon: Coupon) => {
    if (togglingCode) return;
    const updated: Coupon = { ...coupon, enabled: !coupon.enabled };

    setTogglingCode(coupon.code);
    setData((prev) =>
      prev ? { ...prev, coupons: { ...prev.coupons, [coupon.code]: updated } } : prev
    );
    try {
      await adminFetch(`/api/admin/coupons/${encodeURIComponent(coupon.code)}`, {
        method: 'PUT',
        body: JSON.stringify(updated),
      });
      toast.success(
        updated.enabled ? `Kupon „${coupon.code}" je uključen.` : `Kupon „${coupon.code}" je isključen.`
      );
    } catch (e) {
      setData((prev) =>
        prev ? { ...prev, coupons: { ...prev.coupons, [coupon.code]: coupon } } : prev
      );
      toast.error(e instanceof Error ? e.message : 'Greška pri izmeni statusa kupona.');
    } finally {
      setTogglingCode(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminFetch(`/api/admin/coupons/${encodeURIComponent(deleteTarget.code)}`, {
        method: 'DELETE',
      });
      toast.success(`Kupon „${deleteTarget.code}" je obrisan.`);
      setDeleteTarget(null);
      await load();
    } catch (e) {
      // 409 (kupon vezan za BOGO) i ostale greške stižu sa čitljivom porukom iz API-ja
      toast.error(e instanceof Error ? e.message : 'Greška pri brisanju kupona.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <TicketPercent className="h-6 w-6 text-brand-orange" />
            Kuponi
          </h1>
          {data && (
            <p className="text-sm text-muted-foreground mt-1">
              {coupons.length} {pluralKupon(coupons.length)} · {activeCount} {pluralAktivan(activeCount)}
            </p>
          )}
        </div>
        <Button onClick={openCreate} className="bg-brand-orange hover:bg-brand-orange/90 text-white shrink-0">
          <Plus className="h-4 w-4" />
          Nov kupon
        </Button>
      </div>

      <div className="flex items-start gap-2 text-sm text-sky-900 bg-sky-50 border border-sky-200 rounded-md px-3 py-2.5">
        <Info className="h-4 w-4 mt-0.5 shrink-0 text-sky-600" />
        <p>
          Kuponi iz ove liste imaju prednost nad kodovima iz OMS API-ja (API kodove sajt tretira kao generičkih
          10%). Kupci ih aktiviraju linkom{' '}
          <code className="rounded bg-sky-100 px-1 py-0.5 font-mono text-xs">?coupon_code=KOD</code> iz reklame
          ili unosom u korpi. BOGO (1+1) kupon se kontroliše u sekciji ispod.
        </p>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 flex items-center justify-between gap-3">
          <span>{error}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setLoading(true);
              load();
            }}
          >
            Pokušaj ponovo
          </Button>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <p className="text-sm text-muted-foreground px-4 py-8 text-center">Učitavanje…</p>
          ) : coupons.length === 0 ? (
            <p className="text-sm text-muted-foreground px-4 py-8 text-center">
              {'Nema definisanih kupona. Klikni „Nov kupon" da dodaš prvi.'}
            </p>
          ) : (
            <div className="divide-y">
              {coupons.map((coupon) => {
                const isBogoLinked = data?.bogo.couponCode === coupon.code;
                const constraints = constraintParts(coupon);
                return (
                  <div
                    key={coupon.code}
                    className="flex flex-col lg:flex-row lg:items-center gap-3 px-4 py-4"
                  >
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-base font-bold tracking-wide">{coupon.code}</span>
                        <Badge variant="outline" className={COUPON_TYPE_BADGE_CLASSES[coupon.type]}>
                          {COUPON_TYPE_LABELS[coupon.type]}
                        </Badge>
                        <span className="text-sm font-semibold text-gray-700">
                          {formatCouponValue(coupon.type, coupon.value)}
                        </span>
                        {isBogoLinked && (
                          <Badge className="border-transparent bg-purple-600 text-white">
                            <Gift />
                            Vezan za 1+1 ponudu
                          </Badge>
                        )}
                      </div>
                      {coupon.description && (
                        <p className="text-sm text-muted-foreground">{coupon.description}</p>
                      )}
                      {constraints.length > 0 && (
                        <p className="text-xs text-muted-foreground">{constraints.join(' · ')}</p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <StatusToggle
                        enabled={coupon.enabled}
                        onToggle={() => handleToggle(coupon)}
                        disabled={togglingCode === coupon.code}
                        ariaLabel={`Status kupona ${coupon.code}`}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(coupon)}
                        aria-label={`Uredi kupon ${coupon.code}`}
                      >
                        <Pencil className="h-4 w-4" />
                        Uredi
                      </Button>
                      {!isBogoLinked && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTarget(coupon)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          aria-label={`Obriši kupon ${coupon.code}`}
                        >
                          <Trash2 className="h-4 w-4" />
                          Obriši
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {data && <BogoSettingsCard bogo={data.bogo} coupons={data.coupons} onSaved={load} />}

      <CouponFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        coupon={editing}
        existingCodes={coupons.map((coupon) => coupon.code)}
        onSaved={load}
      />

      <Dialog open={deleteTarget !== null} onOpenChange={(open) => !open && !deleting && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Brisanje kupona</DialogTitle>
            <DialogDescription>
              Da li sigurno želiš da obrišeš kupon{' '}
              <span className="font-mono font-medium text-foreground">{deleteTarget?.code}</span>? Kupci više
              neće moći da ga iskoriste. Ova akcija je nepovratna.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Otkaži
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Brisanje…' : 'Obriši'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
