/**
 * Viber kampanja — posebne, kratke prodajne stranice.
 *
 * URL: https://dermotin.com/{locale}/v/{slug}
 * Stranice nemaju Meta/TikTok/Google pixel, porudžbine ne šalju CAPI Purchase,
 * a u OMS stižu sa medium = "viber" i campaign_id = utm_campaign (ili slug ponude).
 * Ne indeksiraju se i ne pojavljuju se u izlogu, sitemap-u ni feed-ovima.
 */

export interface ViberOffer {
  slug: string;
  locale: 'rs' | 'ba' | 'me';
  productId: string;
  /** Kratak naslov iznad imena proizvoda */
  kicker: string;
  headline: string;
  subheadline: string;
  bullets: string[];
  /** Tekst na dugmetu / iznad forme */
  formTitle: string;
}

export const VIBER_OFFERS: ViberOffer[] = [
  {
    slug: 'fungel-gratis',
    locale: 'rs',
    productId: 'fungel_fungomax_gratis',
    kicker: 'Samo za Viber pratioce',
    headline: 'Kupite FUNGEL — FUNGOMAX serum dobijate GRATIS',
    subheadline: 'Krema + serum sa kapaljkom za kompletnu rutinu nege kože i noktiju. Platite samo kremu, serum je naš poklon.',
    bullets: [
      'FUNGEL krema 50ml + FUNGOMAX serum 50ml GRATIS',
      'Serum za nokte, krema za širu površinu kože',
      '10 biljnih ekstrakata, bez parabena',
      'Plaćanje pouzećem — tek kada preuzmete paket',
    ],
    formTitle: 'Uzmite poklon — poručite za 30 sekundi',
  },
  {
    slug: 'fungel-gratis',
    locale: 'ba',
    productId: 'fungel_fungomax_gratis',
    kicker: 'Samo za Viber pratioce',
    headline: 'Kupite FUNGEL — FUNGOMAX serum dobijate GRATIS',
    subheadline: 'Krema + serum sa kapaljkom za kompletnu rutinu njege kože i noktiju. Platite samo kremu, serum je naš poklon.',
    bullets: [
      'FUNGEL krema 50ml + FUNGOMAX serum 50ml GRATIS',
      'Serum za nokte, krema za širu površinu kože',
      '10 biljnih ekstrakata, bez parabena',
      'Plaćanje pouzećem — tek kada preuzmete paket',
    ],
    formTitle: 'Uzmite poklon — naručite za 30 sekundi',
  },
  {
    slug: 'biomelis-set',
    locale: 'rs',
    productId: 'biomelis_set',
    kicker: 'Viber akcija',
    headline: 'BIOMELIS krema + BIOMELIS KAPI po specijalnoj ceni',
    subheadline: 'Umirujuća nega suve, osetljive kože spolja i biljna podrška jetri i varenju iznutra — dva proizvoda, jedna cena.',
    bullets: [
      'BIOMELIS krema 50ml + BIOMELIS KAPI 50ml',
      'Krema: 8 biljnih ekstrakata, panthenol, urea i vitamini A i E',
      'Kapi: badelj (silimarin) doprinosi zdravlju jetre',
      'Plaćanje pouzećem — tek kada preuzmete paket',
    ],
    formTitle: 'Poručite set za 30 sekundi',
  },
  {
    slug: 'biowart-gratis',
    locale: 'rs',
    productId: 'biowart_immunis_gratis',
    kicker: 'Samo za Viber pratioce',
    headline: 'Kupite BIOWART — IMMUNIS KAPI dobijate GRATIS',
    subheadline: 'Ciljana nega kože sklone pojavi bradavica, a uz nju na poklon biljna podrška imunitetu za zimsku sezonu.',
    bullets: [
      'BIOWART krema 50ml + IMMUNIS KAPI 50ml GRATIS',
      'BIOWART: 7 biljnih ekstrakata i 7 eteričnih ulja',
      'IMMUNIS: ehinacea doprinosi pravilnom funkcionisanju imunog sistema',
      'Plaćanje pouzećem — tek kada preuzmete paket',
    ],
    formTitle: 'Uzmite poklon — poručite za 30 sekundi',
  },
];

export function getViberOffer(locale: string, slug: string): ViberOffer | undefined {
  return VIBER_OFFERS.find((offer) => offer.locale === locale && offer.slug === slug);
}
