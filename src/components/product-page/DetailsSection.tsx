'use client';

import { AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import { Product } from '@/config/products';

interface DetailsSectionProps {
  product: Product;
}

export function DetailsSection({ product }: DetailsSectionProps) {
  const usageSteps = (product.usageSteps ?? []).slice(0, 4);
  const warnings = product.warnings.slice(0, 4);

  return (
    <section className="py-8 md:py-10">
      <div className="container mx-auto px-4">
        <div className="section-card-strong px-5 py-8 md:px-8 md:py-9">
          <div className="text-center">
            <span className="highlight-chip-orange">Detaljnije informacije</span>
            <h2 className="mt-4 text-3xl md:text-5xl font-black leading-tight text-slate-950">
              Kako se koristi <span className="highlight-block">{product.name}</span> i sta je vazno da znate
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-base md:text-lg text-slate-600">
              Umesto starog detaljnog akordeona, najvaznije informacije su sada sabrane u jednom preglednom bloku.
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <div className="rounded-[1.7rem] border border-[#358055]/12 bg-white/90 px-5 py-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#358055]/10 p-3">
                  <CheckCircle2 className="h-5 w-5 text-[#358055]" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#358055]">Nacin upotrebe</p>
                  <p className="mt-1 text-lg font-black text-slate-900">{product.shortDescription}</p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {usageSteps.map((step, index) => (
                  <div key={step} className="flex items-start gap-3 rounded-2xl bg-[#358055]/5 px-4 py-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#358055] text-xs font-bold text-white">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-7 text-slate-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-[1.7rem] border border-[#358055]/12 bg-white/90 px-5 py-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-[#F3765D]/10 p-3">
                    <Sparkles className="h-5 w-5 text-[#F3765D]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#F3765D]">Za koga je proizvod</p>
                    <p className="mt-1 text-lg font-black text-slate-900">{product.purpose}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">{product.usage}</p>
              </div>

              <div className="rounded-[1.7rem] border border-[#358055]/12 bg-white/90 px-5 py-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-red-50 p-3">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Napomene</p>
                    <p className="mt-1 text-lg font-black text-slate-900">Najvaznije smernice za upotrebu</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {warnings.map((warning) => (
                    <div key={warning} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                      {warning}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
