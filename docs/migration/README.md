# Migracija URL-ova sa starog sajta (dermotin.rs → novi Next.js sajt)

Stari sajt: WordPress + WooCommerce + FunnelKit (jezici: bez prefiksa = srpski, `/bs/`, `/me/`, `/bg/`, `/hr/`).
Plan migracije: domen se preusmerava na novi sajt uz **očuvanje putanje**, a novi sajt servira svaki stari URL.

## Kako radi

Sav legacy routing je u **`src/config/legacy-urls.ts`** i primenjuje ga `src/middleware.ts`:

- **REWRITE (URL ostaje isti u browseru)** — za sve URL-ove na koje pokazuju aktivne reklame:
  - FunnelKit checkout funneli: `/checkouts/*`, `/bs/checkouts/*`, `/bg/checkouts/*` (+ automatska normalizacija A/B varijanti `-v1/-v2/-v3` na kanonski slug)
  - WooCommerce proizvodi: `/product/*`, `/bs/product/*`, `/me/product/*`, `/bg/product/*`
- **REDIRECT 301** — za sve ostalo (shop, cart, pravne stranice, thank-you, upsell offer koraci, Elementor šabloni, `/bg/` i `/hr/` tržišta koja ne postoje).
- Query parametri (`utm_*`, `fbclid`…) se automatski prenose u oba slučaja.
- Canonical tagovi na rewrite stranicama pokazuju na kanonski novi URL, pa nema duplikata za SEO.

## Verifikacija

Inventar je izvučen sa starog sajta preko Yoast sitemap-a + WP REST API + WooCommerce API
(38 stranica, 30 proizvoda, 32 FunnelKit checkout-a, 32 thank-you, 11 offer koraka).

**Svih 151 starih URL-ova testirano lokalno → 151/151 vraća HTTP 200** (44 rewrite, 101 redirect, 6 nativno).
Kompletna mapa: [`legacy-url-map.csv`](./legacy-url-map.csv).

## Poslovne odluke i otvorene stavke

1. **Dostupnost proizvoda po državi je namerna** — katalog se razlikuje po tržištu (npr. bioroid
   se ne prodaje u CG, suplementi takođe variraju). Redirect `/me/checkouts/bioroid` → `/me/products`
   je ispravno i trajno rešenje.
2. **SET proizvodi dolaze** — kad se SET (npr. bioroid melem + kapi) doda u katalog novog sajta,
   ažurirati `EXACT_REWRITES` u `src/config/legacy-urls.ts` tako da `/checkouts/bioroid-set` i
   `/product/set-bioroid-melem-kapi` pokazuju na novi set slug (trenutno serviraju običan bioroid).
3. **Pravne stranice** (uslovi, privatnost, reklamacije…) na novom sajtu postoje samo kao footer
   modali — stari URL-ovi vode na početnu/kontakt. Za SEO i compliance razmotriti prave rute.
4. **`/wp-content/uploads/*`** (stare slike) nije moguće mapirati — ako stari Meta katalog feed
   referencira te slike, prebaciti katalog na novi feed (`/api/meta-catalog?country=…`) pre gašenja
   starog hostinga.
