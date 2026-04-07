'use client';

import { INGREDIENTS, Product } from '@/config/products';
import { AnimatedHighlight } from '@/components/ui/AnimatedHighlight';

interface IngredientsShowcaseProps {
  product: Product;
}

const categoryColors = {
  herbal_extract: 'from-emerald-400 to-emerald-600',
  essential_oil: 'from-amber-400 to-amber-600',
  active_compound: 'from-sky-400 to-sky-600',
  base_component: 'from-slate-300 to-slate-500',
  preservative: 'from-slate-300 to-slate-500',
  other: 'from-slate-300 to-slate-500',
} as const;

export function IngredientsShowcase({ product }: IngredientsShowcaseProps) {
  const highlightedIngredients = product.ingredients
    .map((id) => INGREDIENTS[id])
    .filter(Boolean)
    .slice(0, 4);

  return (
    <section className="py-8 md:py-10">
      <div className="container mx-auto px-4">
        <div className="section-card px-5 py-6 md:px-8 md:py-8">
          <div className="mb-8 md:mb-10 text-center">
            <span className="highlight-chip">Nauka iza formule</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-black leading-tight text-slate-950">
              Svaki sastojak ima razlog zasto je u <AnimatedHighlight>{product.name}</AnimatedHighlight> formuli
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-500">
              Nismo birali sastojke nasumicno. Ovo su oni koji nose celokupan efekat proizvoda.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {highlightedIngredients.map((ingredient, index) => {
              const gradientColor = categoryColors[ingredient.category];
              const num = String(index + 1).padStart(2, '0');

              return (
                <div
                  key={ingredient.id}
                  className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 transition-shadow duration-300 hover:shadow-[0_12px_32px_rgba(53,128,85,0.1)]"
                >
                  <div className="flex items-start gap-3">
                    <div className={`shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${gradientColor} text-base font-black text-white shadow-lg`}>
                      {num}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-black leading-snug text-slate-950">
                        {ingredient.serbianName}
                      </h3>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                        {ingredient.inciName}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {ingredient.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <div className="hidden h-px flex-1 bg-gradient-to-r from-[#358055]/20 to-transparent sm:block" />
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              {product.ingredients.length}+ pazljivo odabranih sastojaka
            </p>
            <div className="hidden h-px flex-1 bg-gradient-to-l from-[#358055]/20 to-transparent sm:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
