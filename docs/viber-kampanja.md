# Viber kampanja — linkovi i pravila (oktobar 2026)

Kratke prodajne stranice za Viber. Rade na `dermotin.com` (Vercel okruženje bez pixela).

| Ponuda | Tržište | Cena | Link |
|---|---|---|---|
| FUNGEL + FUNGOMAX gratis | Srbija | 1.990 din | https://dermotin.com/rs/v/fungel-gratis?utm_source=viber&utm_campaign=fungel-gratis |
| FUNGEL + FUNGOMAX gratis | BiH | 33,90 KM | https://dermotin.com/ba/v/fungel-gratis?utm_source=viber&utm_campaign=fungel-gratis-ba |
| BIOMELIS + BIOMELIS KAPI | Srbija | 2.890 din | https://dermotin.com/rs/v/biomelis-set?utm_source=viber&utm_campaign=biomelis-set |
| BIOWART + IMMUNIS KAPI gratis | Srbija | 1.990 din | https://dermotin.com/rs/v/biowart-gratis?utm_source=viber&utm_campaign=biowart-gratis |

Dostava se naplaćuje po pravilima zemlje (Srbija: 400 din ispod 4.700 din).

## Zašto nema dodira sa Meta oglasima

- Stranice `/[locale]/v/*` ne učitavaju Meta/TikTok/Google pixel i ne beleže fbclid/UTM kolačiće.
- Porudžbina šalje `channel: "viber"` → `/api/orders` **preskače CAPI Purchase** (`capiStatus: "skipped"`) na svakom domenu.
- Thank-you stranica posle Viber porudžbine ne učitava pixel.
- U OMS stiže `marketing.medium = "viber"`, a `campaign_id` = `utm_campaign` (ili slug ponude).
- Stranice su `noindex, nofollow`, nisu u sitemap-u, Meta katalogu ni u listi proizvoda.

## Izmena ponude

Tekst: `src/config/viber-offers.ts`. Cena i sastav paketa: proizvodi `fungel_fungomax_gratis`
i `biowart_immunis_gratis` u `src/config/locales/{rs,ba}/products.ts` (`salesChannel: 'viber'`,
`hidden: true`). Gratis komponenta (`bundleItems[].gratis`) ide u OMS po punoj ceni sa 100% popusta.
