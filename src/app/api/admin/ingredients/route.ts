import { NextRequest, NextResponse } from 'next/server';
import { Ingredient } from '@/config/types';
import { requireAdminApi, jsonError } from '@/lib/admin/api-guard';
import { getIngredientUsage, readIngredients, writeIngredients } from '@/lib/admin/config-io';
import { ingredientSchema } from '@/lib/admin/schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET /api/admin/ingredients → svi sastojci + gde se koriste */
export async function GET(request: NextRequest) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  try {
    const [ingredients, usage] = await Promise.all([readIngredients(), getIngredientUsage()]);
    return NextResponse.json({ success: true, ingredients, usage });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Greška pri čitanju sastojaka.', 500);
  }
}

/** POST /api/admin/ingredients → kreira nov sastojak */
export async function POST(request: NextRequest) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError('Telo zahteva nije validan JSON.');
  }

  const parsed = ingredientSchema.safeParse(body);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
    return NextResponse.json({ success: false, error: 'Sastojak nije validan.', issues }, { status: 422 });
  }
  const ingredient = parsed.data as Ingredient;

  try {
    const ingredients = await readIngredients();
    if (ingredients[ingredient.id]) {
      return jsonError(`Sastojak sa ID "${ingredient.id}" već postoji.`, 409);
    }
    await writeIngredients({ ...ingredients, [ingredient.id]: ingredient });
    return NextResponse.json({ success: true, ingredient });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Greška pri snimanju sastojka.', 500);
  }
}
