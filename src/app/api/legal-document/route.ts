import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const documentType = searchParams.get('type');
  const locale = searchParams.get('locale') || 'rs';

  if (!documentType) {
    return NextResponse.json({ error: 'Document type is required' }, { status: 400 });
  }

  try {
    // Construct the file path
    const filePath = path.join(process.cwd(), 'src', 'templates', locale, `${documentType}.txt`);
    
    // Check if file exists and read it
    const content = await fs.readFile(filePath, 'utf-8');
    
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error reading legal document:', error);
    
    // Return a user-friendly error message
    return NextResponse.json(
      { error: 'Dokument nije pronađen ili nije dostupan' }, 
      { status: 404 }
    );
  }
}
