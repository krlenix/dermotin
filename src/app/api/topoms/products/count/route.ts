import { handleProductPull } from '@/lib/topoms/pull';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  return handleProductPull(request, 'count');
}
