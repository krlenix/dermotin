'use client';

import { INGREDIENTS, Product } from '@/config/products';

interface IngredientsShowcaseProps {
  product: Product;
}

const categoryColors = {
  herbal_extract: 'bg-emerald-500',
  essential_oil: 'bg-amber-500',
  active_compound: 'bg-sky-500',
  base_component: 'bg-slate-400',
  preservative: 'bg-slate-400',
  other: 'bg-slate-400',
} as const;

const categoryLabels = {
  herbal_extract: 'Lekovita biljka',
  essential_oil: 'Etericno ulje',
  active_compound: 'Aktivna supstanca',
  base_component: 'Nosac formule',
  preservative: 'Zastita formule',
  other: 'Pomocna komponenta',
} as const;

export function IngredientsShowcase({ product }: IngredientsShowcaseProps) {
  const highlightedIngredients = product.ingredients
    .map((id) => INGREDIENTS[id])
    .filter(Boolean)
    .slice(0, 4);

  return (
    <div>
      <div className="mb-10">
        <span className="highlight-chip">Nauka iza formule</span>
        <h2 className="mt-4 text-3xl md:text-4xl font-black leading-tight text-slate-950">
          Svaki sastojak ima razlog zasto je u <span className="highlight-block">{product.name}</span> formuli
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-500">
          Nismo birali sastojke nasumicno. Ovo su oni koji nose celokupan efekat proizvoda.
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-[15px] top-0 bottom-0 w-px bg-gradient-to-b from-[#358055]/30 via-[#358055]/10 to-transparent md:left-[19px]" />

        <div className="space-y-0">
          {highlightedIngredients.map((ingredient, index) => {
            const dotColor = categoryColors[ingredient.category];
            const label = categoryLabels[ingredient.category];

            return (
              <div key={ingredient.id} className="relative pl-10 pb-8 last:pb-0 md:pl-12">
                <div className={`absolute left-[10px] top-[6px] h-[11px] w-[11px] rounded-full ${dotColor} ring-[3px] ring-white md:left-[13px] md:h-[13px] md:w-[13px]`} />

                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {String(index + 1).padStart(2, '0')} &middot; {label}
                </p>

                <h3 className="mt-2 text-xl font-black text-slate-950 md:text-2xl">
                  {ingredient.serbianName}
                </h3>
                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  {ingredient.inciName}
                </p>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-[15px]">
                  {ingredient.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-10 flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-[#358055]/20 to-transparent" />
        <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Ukupno {product.ingredients.length}+ pazljivo odabranih sastojaka
        </p>
        <div className="h-px flex-1 bg-gradient-to-l from-[#358055]/20 to-transparent" />
      </div>
    </div>
  );
}
