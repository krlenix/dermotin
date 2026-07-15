import { NextRequest, NextResponse } from 'next/server';
import { Ingredient } from '@/config/types';
import { requireAdminApi, jsonError } from '@/lib/admin/api-guard';
import { getIngredientUsage, readIngredients, writeIngredients } from '@/lib/admin/config-io';
import { ingredientSchema } from '@/lib/admin/schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteContext = { params: Promise<{ id: string }> };

/** PUT /api/admin/ingredients/{id} → snima izmene sastojka */
export async function PUT(request: NextRequest, context: RouteContext) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  const { id } = await context.params;

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
  if (ingredient.id !== id) {
    return jsonError(`ID sastojka ne može da se menja ("${ingredient.id}" ≠ "${id}").`);
  }

  try {
    const ingredients = await readIngredients();
    if (!ingredients[id]) return jsonError(`Sastojak "${id}" ne postoji.`, 404);
    await writeIngredients({ ...ingredients, [id]: ingredient });
    return NextResponse.json({ success: true, ingredient });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Greška pri snimanju sastojka.', 500);
  }
}

/** DELETE /api/admin/ingredients/{id} → briše sastojak ako ga nijedan proizvod ne koristi */
export async function DELETE(request: NextRequest, context: RouteContext) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  const { id } = await context.params;

  try {
    const ingredients = await readIngredients();
    if (!ingredients[id]) return jsonError(`Sastojak "${id}" ne postoji.`, 404);

    const usage = await getIngredientUsage();
    if (usage[id]?.length) {
      return jsonError(`Sastojak "${id}" koriste proizvodi: ${usage[id].join(', ')}. Prvo ga ukloni iz njih.`, 409);
    }

    const remaining: Record<string, Ingredient> = {};
    for (const [key, value] of Object.entries(ingredients)) {
      if (key !== id) remaining[key] = value;
    }
    await writeIngredients(remaining);
    return NextResponse.json({ success: true });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Greška pri brisanju sastojka.', 500);
  }
}
