'use client';

import { CircleCheckBig, ClipboardCheck, Headset, PackageCheck } from 'lucide-react';
import { CountryConfig } from '@/config/countries';
import { AnimatedHighlight } from '@/components/ui/AnimatedHighlight';

interface TrustStepsSectionProps {
  countryConfig: CountryConfig;
}

const steps = [
  {
    title: 'Ostavite podatke',
    description: 'Popunite kratku formu i izaberite opciju koja vam odgovara.',
    icon: ClipboardCheck,
  },
  {
    title: 'Potvrda porudzbine',
    description: 'Postojeci checkout tok ostaje isti, uz jasniju prezentaciju i vise poverenja.',
    icon: Headset,
  },
  {
    title: 'Placanje pri preuzimanju',
    description: 'Kupac zavrsava placanje nakon prijema posiljke, bez dodatne komplikacije.',
    icon: PackageCheck,
  },
];

export function TrustStepsSection({ countryConfig }: TrustStepsSectionProps) {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="section-card-strong px-6 py-8 md:px-10 md:py-10">
          <div className="text-center">
            <span className="highlight-chip">Jednostavan proces kupovine</span>
            <h2 className="mt-4 text-3xl md:text-5xl font-black leading-tight text-slate-950">
              Evo kako porucujete u <AnimatedHighlight>{countryConfig.name}</AnimatedHighlight>
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-base md:text-lg text-slate-600">
              Zavrsni donji deo stranice sada vise lici na referentni landing, sa jasnim koracima i dodatnim trust
              ikonama pre FAQ bloka.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div key={step.title} className="section-card px-5 py-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#358055] text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#F3765D]">Korak {index + 1}</p>
                      <p className="text-xl font-black text-slate-900">{step.title}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{step.description}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-[#358055]/15 bg-[#358055]/5 px-5 py-4 text-sm font-medium text-slate-700">
              <div className="flex items-center gap-2 text-[#358055]">
                <CircleCheckBig className="h-4 w-4" />
                Brza isporuka
              </div>
              <p className="mt-2 text-slate-600">
                Rok isporuke: {countryConfig.business.deliveryTimeMin}-{countryConfig.business.deliveryTimeMax}{' '}
                {countryConfig.business.deliveryTimeUnit}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-[#358055]/15 bg-[#358055]/5 px-5 py-4 text-sm font-medium text-slate-700">
              <div className="flex items-center gap-2 text-[#358055]">
                <CircleCheckBig className="h-4 w-4" />
                Placanje pouzecem
              </div>
              <p className="mt-2 text-slate-600">{countryConfig.business.paymentMethods[0]}</p>
            </div>
            <div className="rounded-[1.5rem] border border-[#358055]/15 bg-[#358055]/5 px-5 py-4 text-sm font-medium text-slate-700">
              <div className="flex items-center gap-2 text-[#358055]">
                <CircleCheckBig className="h-4 w-4" />
                Podrska kupcima
              </div>
              <p className="mt-2 text-slate-600">Kontakt i pravne informacije ostaju vezane za trenutno trziste i kompaniju.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
