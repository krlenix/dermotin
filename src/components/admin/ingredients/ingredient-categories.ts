import type { Ingredient } from '@/config/types';

export type IngredientCategory = Ingredient['category'];

/** Srpske labele kategorija sastojaka. */
export const INGREDIENT_CATEGORY_LABELS: Record<IngredientCategory, string> = {
  herbal_extract: 'Biljni ekstrakt',
  essential_oil: 'Eterično ulje',
  active_compound: 'Aktivna komponenta',
  base_component: 'Bazna komponenta',
  preservative: 'Konzervans',
  other: 'Ostalo',
};

export const INGREDIENT_CATEGORIES = Object.keys(INGREDIENT_CATEGORY_LABELS) as IngredientCategory[];

/** Boje badge-a po kategoriji (koristi se uz variant="outline"). */
export const INGREDIENT_CATEGORY_BADGE_CLASSES: Record<IngredientCategory, string> = {
  herbal_extract: 'bg-green-50 text-green-800 border-green-200',
  essential_oil: 'bg-purple-50 text-purple-800 border-purple-200',
  active_compound: 'bg-blue-50 text-blue-800 border-blue-200',
  base_component: 'bg-gray-100 text-gray-700 border-gray-200',
  preservative: 'bg-amber-50 text-amber-800 border-amber-200',
  other: 'bg-slate-100 text-slate-700 border-slate-200',
};
