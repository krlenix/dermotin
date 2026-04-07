'use client';

import { ShieldCheck, Truck, WalletCards } from 'lucide-react';
import { CountryConfig } from '@/config/countries';
import { Product } from '@/config/products';

interface GuaranteeSectionProps {
  product: Product;
  countryConfig: CountryConfig;
}

export function GuaranteeSection({ product, countryConfig }: GuaranteeSectionProps) {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="section-card-strong overflow-hidden px-6 py-8 md:px-10 md:py-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="section-card-dark px-6 py-7 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#F3765D]">Kupovina bez rizika</p>
              <h3 className="mt-4 text-3xl font-black leading-tight">
                Garancija poverenja za <span className="text-[#F3765D]">{product.name}</span>
              </h3>
              <p className="mt-4 text-sm leading-7 text-white/75">
                Umesto slabih pomocnih poruka, ovaj blok sada nosi jaci guarantee ton kakav korisnik ocekuje na
                advertorial landing stranici.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="section-card px-5 py-5">
                <div className="rounded-2xl bg-[#358055]/10 p-3 w-fit text-[#358055]">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <p className="mt-4 text-lg font-black text-slate-900">Podaci i narudzbina</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Postojeca checkout validacija i narudzbina ostaju netaknute, samo su sada prikazane unutar jacih trust
                  blokova.
                </p>
              </div>

              <div className="section-card px-5 py-5">
                <div className="rounded-2xl bg-[#358055]/10 p-3 w-fit text-[#358055]">
                  <Truck className="h-6 w-6" />
                </div>
                <p className="mt-4 text-lg font-black text-slate-900">Brza isporuka</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Isporuka za {countryConfig.name} ide u roku od {countryConfig.business.deliveryTimeMin}-
                  {countryConfig.business.deliveryTimeMax} {countryConfig.business.deliveryTimeUnit}.
                </p>
              </div>

              <div className="section-card px-5 py-5">
                <div className="rounded-2xl bg-[#358055]/10 p-3 w-fit text-[#358055]">
                  <WalletCards className="h-6 w-6" />
                </div>
                <p className="mt-4 text-lg font-black text-slate-900">Placanje pri preuzimanju</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Podrzan nacin placanja: {countryConfig.business.paymentMethods[0]}. Kupac dobija jasniji signal
                  sigurnosti pre forme.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
