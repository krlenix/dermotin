'use client';

import { FlaskConical, Leaf, Shield, Sparkles } from 'lucide-react';
import { Product } from '@/config/products';
import { AnimatedHighlight } from '@/components/ui/AnimatedHighlight';

interface BenefitsSectionProps {
  product: Product;
}

const icons = [Leaf, FlaskConical, Sparkles, Shield];

export function BenefitsSection({ product }: BenefitsSectionProps) {
  const featuredBenefits = product.benefits.slice(0, 3);
  const benefitLabels = ['01', '02', '03'];

  return (
    <section id="benefits" className="py-8 md:py-10">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-black leading-tight text-slate-950">
            Po cemu se <AnimatedHighlight>{product.name}</AnimatedHighlight> izdvaja od drugih proizvoda?
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base md:text-lg text-slate-600">
            Tri kljucne prednosti zbog kojih ga kupci najcesce biraju za svoju svakodnevnu rutinu.
          </p>
        </div>

        <div className="mt-8">
          <div className="group relative overflow-hidden rounded-[1.8rem] border border-[#358055]/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,250,248,0.96))] px-5 py-4 shadow-[0_16px_40px_rgba(53,128,85,0.06)] transition-all duration-300 hover:shadow-[0_22px_50px_rgba(53,128,85,0.10)] md:px-6 md:py-5">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#358055] via-emerald-400 to-[#F3765D] opacity-80" />
            <div className="divide-y divide-[#358055]/10">
              {featuredBenefits.map((benefit, index) => {
                const Icon = icons[index % icons.length];

                return (
                  <div key={benefit} className="flex items-center gap-4 py-4 first:pt-2 last:pb-2">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F3765D]/10 text-[#F3765D] ring-1 ring-[#F3765D]/10">
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="flex-1 text-base font-black leading-snug text-slate-900 md:text-lg">{benefit}</p>
                    <span className="shrink-0 text-xs font-black tracking-[0.24em] text-[#358055]/55">
                      {benefitLabels[index]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
