# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Odrasli 35–70 godina iz Srbije, Bosne i Hercegovine i Crne Gore, skoro uvek na telefonu. Dolaze sa Facebook/Instagram/Viber oglasa sa jednim konkretnim problemom (koža i nokti skloni gljivicama, koža sklona ekcemu i psorijazi, bradavice, osetljiva intimna regija, biljna podrška varenju, jetri, venama i imunitetu). Često su stariji i manje vešti sa internetom: čitaju pažljivo, sumnjičavi su prema obećanjima, žele da čuju da mogu da pozovu telefonom i da plaćaju tek kada paket stigne.

Posao koji obavljaju: proveriti da li je proizvod pravi i bezbedan, videti koliko košta sa dostavom i poručiti za manje od minut, bez naloga i bez kartice.

## Product Purpose

Sajt prodaje DERMOTIN prirodnu kozmetiku i biljne dodatke ishrani uz plaćanje pouzećem. Uspeh je primljena, ispravna porudžbina sa tačnim podacima za isporuku, uz što manje odustajanja na formi i što manje vraćenih paketa (kupac mora tačno da zna šta i po kojoj ceni naručuje).

Domeni: dermotin.com i dermotin.shop (ovaj repozitorijum, Vercel). dermotin.rs je zaseban WooCommerce sajt.

## Positioning

- **Prirodni biljni sastav:** biljni ekstrakti i ulja, bez parabena; kozmetika po EU Regulativi 1223/2009 (CPSR), kapi kao dodaci ishrani sa odobrenim tekstom deklaracije.
- **Registracija i domaća proizvodnja:** rešenja Ministarstva zdravlja / ALIMS, proizvedeno u Srbiji. Na BA/ME stranicama to ostaje „proizvedeno u Srbiji“, nikada „kod vas“.
- **30.000+ kupaca i garancija:** jedan broj kupaca na celom sajtu (`SITE_CUSTOMERS` u `src/config/store-proof.ts`), „Garantujemo rezultate ili vraćamo novac“, pravi komentari kupaca.
- **Plaćanje pouzećem i brza dostava:** bez kartice, plaća se kuriru, isporuka 1–2 radna dana, besplatna dostava preko praga (RS 4.700 din).

## Operating Context

- Glavni tok: oglas → prodajna stranica proizvoda (`/[locale]/checkouts/[slug]`, `/[locale]/products/[slug]`) → kratka forma na istoj stranici → hvala stranica. Viber kampanje: `/[locale]/v/[offer]` (bez piksela i CAPI-ja).
- Katalog (`/[locale]/products`), početna, korpa i checkout korpe (`/[locale]/checkout`) za kupce koji uzimaju više proizvoda.
- Tri tržišta i valute: RS (din), BA (KM, ijekavica), ME (€). Lokal određuje prevod i katalog; zemlja određuje valutu, kurira, firmu i piksele (`src/config/countries.ts`).
- Porudžbine idu u TopOMS (outbox u Supabase) i stari OMS webhook; Meta Purchase ide sa servera iz `/api/orders`, ostali događaji preko `/api/capi`.
- Server proverava svaku porudžbinu prema katalogu (`src/lib/order-guard.ts`).

## Capabilities and Constraints

- Jedna ponuda po prodajnoj stranici, bez biranja varijante; setovi i „gratis“ ponude su zasebni proizvodi.
- Kuponi: statički iz admin panela (npr. POPUST20 iz oglasa) i OMS afilijacijski kodovi (10%), uvek provereni na serveru.
- 1+1 (BOGO) akcija postoji u kodu, trenutno isključena.
- Admin panel (`/admin`) menja konfiguraciju lokalno (piše u izvorne fajlove); na Vercelu ne može da čuva.
- `hr` lokal postoji samo kao podaci za budući rad; nije rutabilan.

## Brand Commitments

- Ime **DERMOTIN** velikim slovima; nazivi proizvoda velikim slovima (FUNGEL, BIOMELIS, BIOWART, BIOROID, FUNGOMAX, IMMUNIS KAPI…).
- Ton: formalno „Vi“, topao i direktan, srpska latinica sa svim dijakritikama (č, ć, š, ž, đ); ijekavica na /ba.
- Prodajne stranice prate stari dermotin.rs lander koji je najbolje konvertovao; vlasnik je tražio da dokazi sa starog sajta ostanu.

## Evidence on Hand

- Broj kupaca 30.000+ (jedna vrednost), 850+ recenzija, imenovana svedočanstva sa fotografijama, snimci pravih komentara (`src/config/store-proof.ts`, `src/config/review-shots.ts`).
- Registracioni brojevi i datumi rešenja Ministarstva / EU laboratorije (`src/config/lander-content.ts`).
- Verifikovani podaci i dozvoljene tvrdnje po proizvodu: `docs/products/*.md` (claim bank).
- Packshotovi: `public/images/store/`, lander slike `public/images/lander/`.
- Ne izmišljati: nove brojeve kupaca, recenzije, ocene, rokove dejstva, medicinske tvrdnje.

## Product Principles

1. Poverenje pre ubeđivanja: registracija, pravi kupci, telefon i plaćanje pouzećem moraju biti vidljivi tamo gde se odlučuje.
2. Cena bez iznenađenja: kupac pre slanja vidi tačan iznos koji plaća kuriru, sa dostavom.
3. Jedna jasna radnja po ekranu; naglasak se troši samo na novac i obećanja koja imaju pokriće.
4. Svaka tvrdnja ima izvor u `docs/products`; kozmetika nije lek, suplement nije lek.
5. Ništa ne sme da prekine porudžbinu: piksele, TopOMS i proveru porudžbine ne menjati usput.

## Accessibility & Inclusion

Stariji kupci na telefonu: čitljiv tekst (kontrast WCAG AA, bez sitnog teksta), veliki dodirni ciljevi, poštovanje sistemske veličine slova i `prefers-reduced-motion`, forme sa vidljivim labelama i jasnim greškama.

## Text Rules

- Tvrdnje samo iz claim bank-a u `docs/products`; bez sekcije „Zabranjene / rizične tvrdnje“.
- Ime Farmaceutskog fakulteta se ne koristi u marketingu.
- Kozmetika je namenjena odraslima; bez tvrdnji o deci.
- Dokazi sa starog sajta (brojevi, imenovani kupci, garancija, ministarstvo, snimci komentara) ostaju — odluka vlasnika.
