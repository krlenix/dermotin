import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi, jsonError } from '@/lib/admin/api-guard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const IMAGES_ROOT = path.join(process.cwd(), 'public', 'images');
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg']);

async function walkImages(dir: string, results: string[]): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkImages(fullPath, results);
    } else if (IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      // URL relativan na public/ sa forward slash-evima
      results.push('/' + path.relative(path.join(process.cwd(), 'public'), fullPath).split(path.sep).join('/'));
    }
  }
}

/** GET /api/admin/images → sve slike iz public/images grupisane po folderu */
export async function GET(request: NextRequest) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  try {
    const images: string[] = [];
    await walkImages(IMAGES_ROOT, images);
    images.sort();

    const byFolder: Record<string, string[]> = {};
    for (const url of images) {
      const folder = url.slice(0, url.lastIndexOf('/'));
      (byFolder[folder] ??= []).push(url);
    }
    return NextResponse.json({ success: true, images, byFolder });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Greška pri listanju slika.', 500);
  }
}
