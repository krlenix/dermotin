# Migracija URL-ova sa starih sajtova (dermotin.rs + dermotin.co → novi Next.js sajt)

Stari sajtovi: dva WordPress projekta sa WooCommerce + FunnelKit (jezici: bez prefiksa = srpski, `/bs/`, `/me/`, `/bg/`, `/hr/`).
Plan migracije: domen se preusmerava na novi sajt uz **očuvanje putanje**, a novi sajt servira svaki stari URL.

## Kako radi

Sav legacy routing je u **`src/config/legacy-urls.ts`** i primenjuje ga `src/middleware.ts`:

- **REWRITE (URL ostaje isti u browseru)** — za sve URL-ove na koje pokazuju aktivne reklame:
  - FunnelKit checkout funneli: `/checkouts/*`, `/bs/checkouts/*`, `/bg/checkouts/*` (+ automatska normalizacija A/B varijanti `-v1/-v2/-v3` na kanonski slug)
  - WooCommerce proizvodi: `/product/*`, `/bs/product/*`, `/me/product/*`, `/bg/product/*`
- **REDIRECT 301** — za sve ostalo (shop, cart, pravne stranice, thank-you, upsell offer koraci, Elementor šabloni, `/bg/` i `/hr/` tržišta koja ne postoje).
- Query parametri (`utm_*`, `fbclid`…) se automatski prenose u oba slučaja.
- Stari Redirection aliasi koji su dodavali `coupon_code=POPUST20` zadržavaju taj podrazumevani kupon, ali nikada ne prepisuju kupon koji je već stigao iz oglasa.
- Funnel/checkout stranice canonicalizuju se na jednu kanonsku product stranicu na `dermotin.rs`, pa ad URL ostaje funkcionalan bez SEO duplikata.
- Meta Pixel, Meta CAPI, TikTok, Google Ads i GA4 biraju konfiguraciju po stvarnom domenu. `dermotin.rs` i `dermotin.co` imaju odvojene `SITE_RS` / `SITE_CO` promenljive i nema prelaska na parametre drugog sajta.

## Verifikacija

Inventar je izvučen sa starog sajta preko Yoast sitemap-a + WP REST API + WooCommerce API
(38 stranica, 30 proizvoda, 32 FunnelKit checkout-a, 32 thank-you, 11 offer koraka).

Početni sitemap/WP inventar sadrži 151 jedinstvenu putanju. Redirection audit je dodao još 15 marketinških putanja i `/qrkod`, ukupno 167 pravila po domenu.

- Početna mapa putanja: [`legacy-url-map.csv`](./legacy-url-map.csv)
- Kompletna mapa oba domena (generiše se sa `npm run migration:map`): [`legacy-domain-map.csv`](./legacy-domain-map.csv)
- Audit izvora i pixela: [`audit-2026-08-29.md`](./audit-2026-08-29.md)

## Poslovne odluke i otvorene stavke

1. **Dostupnost proizvoda po državi je namerna** — katalog se razlikuje po tržištu (npr. bioroid
   se ne prodaje u CG, suplementi takođe variraju). Redirect `/me/checkouts/bioroid` → `/me/products`
   je ispravno i trajno rešenje.
2. **BIOROID SET je dodat** — `/checkouts/bioroid-set` i `/product/set-bioroid-melem-kapi`
   serviraju kanonski `bioroid-set` proizvod.
3. **Pravne stranice** (uslovi, privatnost, reklamacije…) na novom sajtu postoje samo kao footer
   modali — stari URL-ovi vode na početnu/kontakt. Za SEO i compliance razmotriti prave rute.
4. **`/wp-content/uploads/*`** (stare slike) nije moguće mapirati — ako stari Meta katalog feed
   referencira te slike, prebaciti katalog na novi feed (`/api/meta-catalog?country=…`) pre gašenja
   starog hostinga.
5. **Tracking za `dermotin.co`** — WordPress audit je pronašao Google Ads/GA4 vrednosti, ali nije
   pronašao javni Meta ili TikTok ID. Oni ostaju isključeni dok se u Vercel ne unesu sopstveni
   `SITE_CO` ID-jevi i CAPI token.
