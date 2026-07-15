import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi, jsonError } from '@/lib/admin/api-guard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const IMAGES_ROOT = path.join(process.cwd(), 'public', 'images');
const ALLOWED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif']);
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

function sanitizeSegment(segment: string): string {
  return segment
    .toLowerCase()
    .replace(/[čć]/g, 'c')
    .replace(/š/g, 's')
    .replace(/ž/g, 'z')
    .replace(/đ/g, 'dj')
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * POST /api/admin/images/upload (multipart: file, folder)
 * Snima sliku u public/images/{folder}/ — folder npr. "products/fungel".
 */
export async function POST(request: NextRequest) {
  const authError = requireAdminApi(request);
  if (authError) return authError;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError('Očekivan je multipart/form-data zahtev.');
  }

  const file = formData.get('file');
  const folderRaw = String(formData.get('folder') || 'products');

  if (!(file instanceof File)) return jsonError('Nedostaje fajl ("file" polje).');
  if (file.size === 0) return jsonError('Fajl je prazan.');
  if (file.size > MAX_SIZE_BYTES) return jsonError('Fajl je veći od 8MB.');

  const extension = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(extension)) {
    return jsonError(`Dozvoljeni formati: ${[...ALLOWED_EXTENSIONS].join(', ')}.`);
  }

  // Sanitizuj folder (bez ../, samo bezbedni segmenti unutar public/images)
  const folderSegments = folderRaw
    .split('/')
    .map(sanitizeSegment)
    .filter((segment) => segment.length > 0 && segment !== '.' && segment !== '..');
  const targetDir = path.join(IMAGES_ROOT, ...folderSegments);
  if (!targetDir.startsWith(IMAGES_ROOT)) return jsonError('Nedozvoljen folder.');

  const baseName = sanitizeSegment(path.basename(file.name, extension)) || 'slika';

  try {
    await fs.mkdir(targetDir, { recursive: true });

    // Ne gazi postojeće fajlove — dodaj brojčani sufiks
    let fileName = `${baseName}${extension}`;
    let counter = 1;
    while (
      await fs
        .access(path.join(targetDir, fileName))
        .then(() => true)
        .catch(() => false)
    ) {
      fileName = `${baseName}-${counter}${extension}`;
      counter += 1;
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(targetDir, fileName), buffer);

    const url = ['/images', ...folderSegments, fileName].join('/');
    return NextResponse.json({ success: true, url });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Greška pri snimanju slike.', 500);
  }
}
