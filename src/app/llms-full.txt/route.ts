import { getCountryConfig } from '@/config/countries';
import { getProductVariantsForCountry, getProductsForLocale } from '@/config/locales';
import { SITE_LOCALES, getSiteUrl } from '@/lib/seo';

export const revalidate = 86400;

const LOCALE_NAMES: Record<string, string> = {
  rs: 'Srbija',
  ba: 'Bosna i Hercegovina',
  me: 'Crna Gora',
};

export async function GET() {
  const base = getSiteUrl();
  const lines: string[] = [
    '# DERMOTIN — prošireni kontekst',
    '',
    '> Zvanični, strukturirani pregled javno dostupnih informacija o DERMOTIN ponudi.',
    '',
    'Ovaj dokument pomaže agentima da pronađu kanonske izvore. Za najnoviju cenu, dostupnost i uslove uvek proveriti povezanu HTML stranicu. Proizvodi nisu zamena za medicinski savet, dijagnozu ili terapiju.',
  ];

  for (const locale of SITE_LOCALES) {
    const country = getCountryConfig(locale);
    const products = await getProductsForLocale(locale);
    const available = Object.values(products).filter((product) =>
      product.availableCountries.includes(locale)
    );

    lines.push('', `## ${LOCALE_NAMES[locale]}`, '');
    lines.push(
      `- Valuta: ${country.currency}`,
      `- Dostava: ${country.business.deliveryTimeMin}–${country.business.deliveryTimeMax} radna dana`,
      `- Povrat: ${country.business.returnPeriodDays} dana`,
      `- Kontakt: ${country.company.email}`
    );

    for (const product of available) {
      const variants = getProductVariantsForCountry(product, locale);
      const prices = variants.map((variant) => variant.discountPrice ?? variant.price);

      lines.push(
        '',
        `### ${product.name}`,
        '',
        `Kanonski URL: ${base}/${locale}/products/${product.slug}`,
        '',
        product.description,
        '',
        `Namena: ${product.purpose}`,
        '',
        `Upotreba: ${product.usage}`,
        '',
        `Raspon cena: ${Math.min(...prices).toFixed(2)}–${Math.max(...prices).toFixed(2)} ${country.currency}`,
        '',
        'Ključne osobine:',
        ...product.benefits.map((benefit) => `- ${benefit}`),
        '',
        'Upozorenja:',
        ...product.warnings.map((warning) => `- ${warning}`)
      );
    }
  }

  return new Response(`${lines.join('\n')}\n`, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
      'X-Robots-Tag': 'noindex, follow',
    },
  });
}
