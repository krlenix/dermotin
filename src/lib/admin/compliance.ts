import { Product } from '@/config/types';

/**
 * Skener "rizičnih" reči za Meta/TikTok compliance. Ne blokira snimanje —
 * samo vraća upozorenja koja admin UI prikazuje, da medicinske tvrdnje
 * ne uđu u javne tekstove nenamerno.
 */

export interface ComplianceWarning {
  field: string;
  match: string;
  excerpt: string;
}

// Koreni reči (mala slova, latinica) koji ukazuju na medicinske tvrdnje
const RISKY_ROOTS = [
  'leči', 'lečenje', 'izleč', 'lijek', 'lječ', 'liječ',
  'ubija', 'uništava',
  'dermatolog', 'farmaceutsk',
  'antivirus', 'antibakterij', 'antifungal', 'antimikot', 'antigljivič',
  'protiv gljivic', 'protiv hemoroid', 'protiv bradavic',
  'infekcij', 'terapij', 'dijagnoz', 'medicinsk',
];

function scanText(field: string, text: string, warnings: ComplianceWarning[]): void {
  const lower = text.toLowerCase();
  for (const root of RISKY_ROOTS) {
    let index = lower.indexOf(root);
    while (index !== -1) {
      const start = Math.max(0, index - 40);
      const end = Math.min(text.length, index + root.length + 40);
      warnings.push({
        field,
        match: root,
        excerpt: (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : ''),
      });
      index = lower.indexOf(root, index + root.length);
    }
  }
}

export function checkProductCompliance(product: Product): ComplianceWarning[] {
  const warnings: ComplianceWarning[] = [];

  scanText('name', product.name, warnings);
  scanText('description', product.description, warnings);
  scanText('shortDescription', product.shortDescription, warnings);
  scanText('heroTitle', product.heroTitle, warnings);
  scanText('purpose', product.purpose, warnings);
  scanText('usage', product.usage, warnings);
  scanText('seoTitle', product.seoTitle, warnings);
  scanText('seoDescription', product.seoDescription, warnings);
  scanText('slug', product.slug, warnings);
  product.alternativeSlugs.forEach((slug, i) => scanText(`alternativeSlugs[${i}]`, slug, warnings));
  product.benefits.forEach((text, i) => scanText(`benefits[${i}]`, text, warnings));
  (product.usageSteps ?? []).forEach((text, i) => scanText(`usageSteps[${i}]`, text, warnings));
  product.warnings.forEach((text, i) => scanText(`warnings[${i}]`, text, warnings));
  (product.productFAQ ?? []).forEach((faq, i) => {
    scanText(`productFAQ[${i}].question`, faq.question, warnings);
    scanText(`productFAQ[${i}].answer`, faq.answer, warnings);
  });
  (product.testimonials ?? []).forEach((t, i) => scanText(`testimonials[${i}].text`, t.text, warnings));
  Object.entries(product.ingredientDescriptions ?? {}).forEach(([ingredientId, text]) => {
    scanText(`ingredientDescriptions.${ingredientId}`, text, warnings);
  });
  if (
    product.urgencyElements.limitedStock !== undefined ||
    product.urgencyElements.limitedTime ||
    product.urgencyElements.socialProof
  ) {
    warnings.push({
      field: 'urgencyElements',
      match: 'dinamički prodajni podatak',
      excerpt: 'Pre objave potvrdite da zaliha, trajanje ponude i broj kupovina dolaze iz stvarnog izvora podataka.',
    });
  }

  return warnings;
}
