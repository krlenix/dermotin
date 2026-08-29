import { getProductsForLocale } from '@/config/locales';
import { SITE_LOCALES, getSiteUrl } from '@/lib/seo';

export const revalidate = 86400;

const LOCALE_NAMES: Record<string, string> = {
  rs: 'Srbija',
  ba: 'Bosna i Hercegovina',
  me: 'Crna Gora',
};

export async function GET() {
  const base = getSiteUrl();
  const sections: string[] = [
    '# DERMOTIN',
    '',
    '> Zvanična internet prodavnica DERMOTIN prirodne kozmetike i suplemenata za Srbiju, Bosnu i Hercegovinu i Crnu Goru.',
    '',
    'Informacije o nameni, sastavu, upotrebi, upozorenjima, ceni i dostupnosti proizvoda treba uzimati sa kanonskih stranica ispod. Kozmetički proizvodi i suplementi nisu zamena za pregled, dijagnozu ili terapiju lekara.',
    '',
    '## Tržišta',
    '',
  ];

  for (const locale of SITE_LOCALES) {
    sections.push(`- [DERMOTIN — ${LOCALE_NAMES[locale]}](${base}/${locale}): Zvanična početna stranica i ponuda za ovo tržište.`);
  }

  for (const locale of SITE_LOCALES) {
    const products = await getProductsForLocale(locale);
    const available = Object.values(products).filter((product) =>
      product.availableCountries.includes(locale)
    );

    sections.push('', `## Proizvodi — ${LOCALE_NAMES[locale]}`, '');
    for (const product of available) {
      sections.push(
        `- [${product.name}](${base}/${locale}/products/${product.slug}): ${product.shortDescription}`
      );
    }
  }

  sections.push(
    '',
    '## Podrška',
    '',
    ...SITE_LOCALES.map(
      (locale) =>
        `- [Kontakt — ${LOCALE_NAMES[locale]}](${base}/${locale}/contact): Kontakt podaci i korisnička podrška za ovo tržište.`
    ),
    '',
    '## Optional',
    '',
    `- [XML sitemap](${base}/sitemap.xml): Kanonske stranice dostupne pretraživačima.`,
    `- [Prošireni AI kontekst](${base}/llms-full.txt): Sažeti podaci o proizvodima, načinu upotrebe i upozorenjima.`,
    ''
  );

  return new Response(sections.join('\n'), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
      'X-Robots-Tag': 'noindex, follow',
    },
  });
}
