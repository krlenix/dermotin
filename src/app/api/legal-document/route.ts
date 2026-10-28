import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getWebsiteDomainFromRequest } from '@/lib/utils';

// Samo poznati dokumenti — putanja se nikada ne gradi iz slobodnog unosa
const DOCUMENTS = new Set([
  'contact-info',
  'cookie-policy',
  'disclaimer',
  'privacy-policy',
  'returns-policy',
  'terms-of-service',
]);
const LOCALES = new Set(['rs', 'ba', 'me']);
// Šabloni postoje samo na srpskom; podaci firme za BA/ME se upisuju iz CountryConfig na klijentu
const TEMPLATE_LOCALES = new Set(['rs']);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const documentType = searchParams.get('type') || '';
  const requestedLocale = searchParams.get('locale') || 'rs';

  if (!DOCUMENTS.has(documentType) || !LOCALES.has(requestedLocale)) {
    return NextResponse.json({ error: 'Nepoznat dokument' }, { status: 400 });
  }

  const locale = TEMPLATE_LOCALES.has(requestedLocale) ? requestedLocale : 'rs';

  try {
    const filePath = path.join(process.cwd(), 'src', 'templates', locale, `${documentType}.txt`);
    const content = await fs.readFile(filePath, 'utf-8');

    return NextResponse.json(
      { content, domain: getWebsiteDomainFromRequest(request) },
      { headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  } catch (error) {
    console.error('Error reading legal document:', documentType, error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Dokument nije pronađen ili nije dostupan' }, { status: 404 });
  }
}
