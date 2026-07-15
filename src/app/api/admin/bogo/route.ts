import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi, jsonError } from '@/lib/admin/api-guard';
import { readBogoConfig, writeBogoConfig, type BogoConfig } from '@/lib/admin/config-io';
import { bogoConfigSchema } from '@/lib/admin/schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** PUT /api/admin/bogo → snima BOGO (1+1) podešavanja; configVersion se uvećava automatski */
export async function PUT(request: NextRequest) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError('Telo zahteva nije validan JSON.');
  }

  try {
    const current = await readBogoConfig();
    const candidate = { ...(body as Record<string, unknown>), configVersion: current.configVersion + 1 };

    const parsed = bogoConfigSchema.safeParse(candidate);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
      return NextResponse.json({ success: false, error: 'BOGO podešavanja nisu validna.', issues }, { status: 422 });
    }

    await writeBogoConfig(parsed.data as BogoConfig);
    return NextResponse.json({ success: true, bogo: parsed.data });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Greška pri snimanju BOGO podešavanja.', 500);
  }
}
