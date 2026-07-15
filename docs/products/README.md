# Verifikovane informacije o proizvodima (izvor istine)

Ovaj folder sadrži po jedan `.md` fajl za svaki DERMOTIN proizvod. Svi podaci su izvučeni **isključivo** iz zvanične dokumentacije u `docs/newdocs/`:

- **Kozmetika** — Cosmetic Product Safety Report (CPSR) po Regulation (EC) 1223/2009:
  - `fungel.md` — DERMOTIN FUNGEL (krema, 50 ml)
  - `biomelis.md` — DERMOTIN BIOMELIS (krema, 50 ml)
  - `biowart.md` — DERMOTIN BIOWART (krema, 50 ml)
  - `bioroid.md` — DERMOTIN BIOROID (krema, 50 ml)
  - `fungomax.md` — FUNGOMAX (serum/losion sa kapaljkom, 50 ml)
- **Dodaci ishrani** — stručno mišljenje i odobreni tekst deklaracije (Katedra za farmakognoziju, 2024):
  - `biomelis-kapi.md` — BIOMELIS KAPI (50 ml)
  - `bioroid-kapi.md` — BIOROID KAPI (50 ml)
  - `immunis-kapi.md` — IMMUNIS KAPI (50 ml)

## Pravila korišćenja

1. **Svaka tvrdnja na sajtu mora imati pokriće** u odgovarajućem fajlu (sekcija „Dozvoljene tvrdnje / claim bank").
2. **Nikada ne koristiti tvrdnje iz sekcije „Zabranjene / rizične tvrdnje"** — one krše regulativu (kozmetika ≠ lek; suplement ≠ lek) i/ili Meta (Facebook/Instagram) pravila oglašavanja.
3. **Ime Farmaceutskog fakulteta se ne sme koristiti u marketingu** (izričita zabrana u stručnim mišljenjima za sve tri vrste kapi).
4. Kozmetički proizvodi su namenjeni **odraslima** — bez tvrdnji o upotrebi kod dece.
5. Za Meta oglase: bez prozivanja zdravstvenog stanja korisnika u 2. licu, bez pre/posle slika, bez obećavanja rezultata u roku, bez senzacionalizma.

Kada se menja tekst na sajtu (`src/config/locales/*/products.ts`), prvo proveriti odgovarajući `.md` fajl.
