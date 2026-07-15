/**
 * Migracija URL-ova sa starog dermotin.rs sajta (WordPress + WooCommerce + FunnelKit).
 *
 * Cilj: SVAKI stari URL mora da radi na novom sajtu (1:1), a URL-ovi na koje
 * pokazuju aktivne reklame (FunnelKit checkouts + product stranice) moraju da
 * ostanu NEPROMENJENI u browseru — zato se za njih koristi REWRITE (interno
 * mapiranje), a za sve ostalo trajni REDIRECT (301) na kanonski novi URL.
 *
 * Mapiranje jezika: stari (bez prefiksa) = rs, /bs/ = ba, /me/ = me,
 * /bg/ i /hr/ tržišta ne postoje na novom sajtu → rs.
 *
 * Kompletan inventar starog sajta: docs/migration/legacy-url-map.csv
 * Koristi ga src/middleware.ts. Mora ostati edge-safe (bez Node API-ja).
 */

export interface LegacyResolution {
  type: 'rewrite' | 'redirect';
  destination: string;
}

/** Stari jezički prefiks → novi locale. */
const LOCALE_MAP: Record<string, string> = {
  '': 'rs',
  bs: 'ba',
  me: 'me',
  bg: 'rs',
  hr: 'rs',
};

/**
 * FunnelKit A/B varijante slugova → kanonski slug novog sajta
 * (fungel-v1, biowart-v3, …). Sve što se ne prepozna prolazi nepromenjeno.
 */
function normalizeFunnelSlug(slug: string): string {
  const variant = slug.match(/^(.+)-v\d+$/);
  return variant ? variant[1] : slug;
}

/** Tačna podudaranja koja čuvaju URL (rewrite). Prioritet nad pattern pravilima. */
const EXACT_REWRITES: Record<string, string> = {
  // BIOROID SET postoji kao DRAFT u rs katalogu (bioroid_set, slug 'bioroid-set').
  // Dok se ne objavi kroz admin panel, stari URL-ovi služe bioroid funnel.
  // PRI OBJAVI SETA promeniti destinacije u '/rs/checkouts/bioroid-set' i '/rs/products/bioroid-set'.
  '/checkouts/bioroid-set': '/rs/checkouts/bioroid',
  '/product/set-bioroid-melem-kapi': '/rs/products/bioroid',
  // FunnelKit globalni checkout za BA tržište
  '/checkouts/checkout-ba': '/ba/checkout',
};

/** Tačna podudaranja koja se preusmeravaju (301). Prioritet nad pattern pravilima. */
const EXACT_REDIRECTS: Record<string, string> = {
  // Interni FunnelKit preview / test funneli
  '/checkouts/wfacp_preview1': '/rs',
  '/checkouts/smania-copy': '/rs',
  '/me/checkouts/wfacp_preview1-2': '/me',
  // bioroid nije u me katalogu novog sajta
  '/me/checkouts/bioroid': '/me/products',
  '/me/product/bioroid': '/me/products',
  // Globalni BG checkout korak
  '/bg/checkouts/checkout': '/rs/checkout',

  // Shop / korpa / checkout stranice
  '/shop': '/rs/products',
  '/bs/shop': '/ba/products',
  '/me/shop': '/me/products',
  '/bg/shop': '/rs/products',
  '/cart': '/rs/checkout',
  '/bs/cart': '/ba/checkout',
  '/me/cart': '/me/checkout',
  '/bg/cart': '/rs/checkout',
  '/checkout': '/rs/checkout',
  '/bs/checkout': '/ba/checkout',
  '/bg/checkout': '/rs/checkout',

  // Info i pravne stranice (na novom sajtu su footer modali / kontakt)
  '/kontakt': '/rs/contact',
  '/bs/kontakt': '/ba/contact',
  '/me/kontakt': '/me/contact',
  '/bg/contact': '/rs/contact',
  '/reklamacije': '/rs/contact',
  '/cesta-pitanja': '/rs',
  '/bs/cesta-pitanja': '/ba',
  '/me/cesta-pitanja': '/me',
  '/bg/faq': '/rs',
  '/uslovi-koriscenja': '/rs',
  '/bs/uslovi-koriscenja': '/ba',
  '/me/uslovi-koriscenja': '/me',
  '/politika-privatnosti': '/rs',
  '/bs/politika-privatnosti': '/ba',
  '/me/politika-privatnosti': '/me',
  '/terms-and-conditions': '/rs',
  '/bg/terms-and-conditions': '/rs',
  '/bg/privacy-statement': '/rs',
  '/bg/cookie-policy': '/rs',
  '/bg/imprint': '/rs',

  // Stare početne stranice po jeziku
  '/bs/pocetna-bosanski': '/ba',
  '/me/pocetna-crnogorski': '/me',
  '/bg/home': '/rs',
  '/hr/pocetna-2': '/rs',

  // FunnelKit thank-you sa jezičkim sufiksom
  '/order-confirmed/hvala-na-porudzbini-ba': '/ba/thank-you',

  // FunnelKit upsell offer koraci sa poznatim proizvodom
  '/offer/bioroid-kapi': '/rs/checkouts/bioroid-kapi',
  '/offer/immunis-kapi': '/rs/checkouts/immunis-kapi',
  '/offer/immunis-kapi-2': '/rs/checkouts/immunis-kapi',
  '/offer/crn': '/me/products',
};

/**
 * Razrešava stari URL u novi. Vraća null ako putanja nije legacy
 * (tj. treba da nastavi kroz normalan i18n routing).
 */
export function resolveLegacyPath(pathname: string): LegacyResolution | null {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;

  if (EXACT_REWRITES[path]) {
    return { type: 'rewrite', destination: EXACT_REWRITES[path] };
  }
  if (EXACT_REDIRECTS[path]) {
    return { type: 'redirect', destination: EXACT_REDIRECTS[path] };
  }

  // FunnelKit checkout funneli — URL mora da ostane isti (aktivne reklame).
  // /checkouts/X, /bs/checkouts/X, /bg/checkouts/X (+ normalizacija -vN varijanti)
  let m = path.match(/^\/(?:(bs|bg|hr)\/)?checkouts\/([^/]+)$/);
  if (m) {
    const locale = LOCALE_MAP[m[1] || ''];
    return { type: 'rewrite', destination: `/${locale}/checkouts/${normalizeFunnelSlug(m[2])}` };
  }
  // /me/checkouts/X je već validna nova ruta — rewrite samo za -vN varijante
  m = path.match(/^\/me\/checkouts\/([^/]+)$/);
  if (m && m[1] !== normalizeFunnelSlug(m[1])) {
    return { type: 'rewrite', destination: `/me/checkouts/${normalizeFunnelSlug(m[1])}` };
  }

  // WooCommerce product stranice — URL ostaje isti.
  // /product/X → /{locale}/products/X
  m = path.match(/^\/(?:(bs|me|bg|hr)\/)?product\/([^/]+)$/);
  if (m) {
    const locale = LOCALE_MAP[m[1] || ''];
    return { type: 'rewrite', destination: `/${locale}/products/${m[2]}` };
  }

  // Kategorije proizvoda → listing
  m = path.match(/^\/(?:(bs|me|bg|hr)\/)?product-category(\/.*)?$/);
  if (m) {
    const locale = LOCALE_MAP[m[1] || ''];
    return { type: 'redirect', destination: `/${locale}/products` };
  }

  // FunnelKit thank-you koraci (post-purchase)
  m = path.match(/^\/(?:(bg)\/)?order-confirmed(\/.*)?$/);
  if (m) {
    return { type: 'redirect', destination: '/rs/thank-you' };
  }

  // FunnelKit upsell offer koraci
  if (/^\/offer(\/.*)?$/.test(path)) {
    return { type: 'redirect', destination: '/rs/products' };
  }

  // Elementor / ElementsKit interni šabloni (bili u starom sitemap-u)
  m = path.match(/^\/(?:(bs|me|bg|hr)\/)?(elementor-hf|elementskit-content)(\/.*)?$/);
  if (m) {
    const locale = LOCALE_MAP[m[1] || ''];
    return { type: 'redirect', destination: `/${locale}` };
  }

  // Catch-all za jezike koji ne postoje na novom sajtu.
  // VAŽNO: rs/ba/me ne smeju imati catch-all — pregazili bi validne nove rute.
  m = path.match(/^\/(bs|bg|hr)(\/.*)?$/);
  if (m) {
    return { type: 'redirect', destination: `/${LOCALE_MAP[m[1]]}` };
  }

  return null;
}
