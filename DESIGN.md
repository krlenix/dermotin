---
name: DERMOTIN
description: Prirodna kozmetika i biljni dodaci ishrani — prodaja pouzećem u Srbiji, BiH i Crnoj Gori
colors:
  green: "#2E8655"
  green-press: "#26774A"
  forest: "#1D5434"
  forest-ink: "#14402A"
  night: "#0F1A14"
  mint: "#7FCB95"
  mint-soft: "#EEF6F0"
  coral: "#EA684E"
  coral-deep: "#BC472E"
  coral-soft: "#FFF4F0"
  white: "#FFFFFF"
  ink: "#151515"
  ink-soft: "#444444"
  ink-muted: "#666666"
  mist: "#EAE9E6"
  paper: "#F7F4EE"
  sand: "#EEE7DD"
  line: "#E2D8CB"
  star: "#F5A623"
  viber: "#6650E6"
typography:
  proof-lg:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "5.25rem"
    fontWeight: 800
    lineHeight: 1
  proof:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3.625rem"
    fontWeight: 800
    lineHeight: 1
  display-lg:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3.125rem"
    fontWeight: 800
    lineHeight: 1.2
  display:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.625rem"
    fontWeight: 800
    lineHeight: 1.22
  headline-lg:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 800
    lineHeight: 1.2
  headline:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 800
    lineHeight: 1.2
  headline-sm:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.25
  title-lg:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
  title:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.35
  body-lg:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  small:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.45
  label:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.35
  caption:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.3
rounded:
  panel: "0.875rem"
  card: "1.375rem"
  hero: "1.75rem"
  pill: "9999px"
spacing:
  gutter-mobile: "12px"
  gutter-desktop: "24px"
  container: "1180px"
components:
  button-primary:
    backgroundColor: "{colors.green}"
    textColor: "#FFFFFF"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "48px"
  button-submit:
    backgroundColor: "{colors.green-press}"
    textColor: "#FFFFFF"
    rounded: "{rounded.pill}"
    height: "62px"
  button-on-color:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "56px"
  button-secondary:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.forest}"
    rounded: "{rounded.pill}"
    height: "56px"
  seal:
    backgroundColor: "{colors.coral-deep}"
    textColor: "#FFFFFF"
    rounded: "{rounded.pill}"
  highlight-green:
    backgroundColor: "{colors.green}"
    textColor: "#FFFFFF"
  highlight-coral:
    backgroundColor: "{colors.coral}"
    textColor: "#FFFFFF"
  input:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.ink}"
    rounded: "6px"
    height: "52px"
---

# Design System: DERMOTIN

## Overview

**North star: „Pijačna tezga od poverenja“** — glasna, topla prodajna stranica sa starog dermotin.rs (koja je najbolje prodavala), uređena tako da izgleda kao ozbiljan, registrovan brend. Karakter ostaje: zeleno-koralni naglasci, krupni brojevi, „pocepane“ koralne trake, prave fotografije i snimci komentara. Uređenost dolazi iz jedne palete, jedne porodice fontova, malo veličina i stroge štednje naglasaka.

Kupac je odrasla osoba na telefonu, iz oglasa, koja plaća pouzećem (vidi PRODUCT.md). Sve što smanjuje sumnju — registracija, telefon, tačna cena sa dostavom — ide ispred ukrasa.

Anti-reference: generički „wellness“ šabloni (traka sa 4 ikonice, tamni blok sa 2×2 kvačicama, stok fotografije), previše „čist“ minimalizam bez prodajne snage (vlasnik ga je odbio), kartice u karticama.

## Colors

Izvor istine: `@theme` u `src/app/globals.css`. **Nikada hex u komponentama** — samo tokeni (`bg-green`, `text-coral-deep`, `var(--color-forest)` u senkama/gradijentima).

- **green** — radnja (dugmad, ikonice u krugu, zeleno isticanje). Beli tekst 4,5:1.
- **green-press** — dugme za slanje porudžbine i hover. **forest** — sitan zeleni tekst na svetlom, ivica „pritisnutog“ dugmeta. **forest-ink**, **night** — tamne površine i preklop preko šumske fotografije.
- **mint** — pozadina hero dela. Na njoj **samo ink tekst** (9,5:1), nikad beli.
- **coral** — ponuda i ušteda: isticanje u krupnim naslovima, pocepane trake, okvir ponude. Beli tekst na njoj **samo krupan** (≥ 24px, ili ≥ 19px bold) — 3,2:1.
- **coral-deep** — pečati („−17%“, „100% garancija“), mali natpisi na koralnoj podlozi, sitan koralni tekst (samo na beloj/paper/coral-soft podlozi).
- **ink / ink-soft / ink-muted** — tekst; ink-muted (#666) je najsvetlija dozvoljena siva za tekst (precrtana cena, napomene, placeholder).
- **mist** — pozadina stranice; **paper**, **mint-soft**, **coral-soft** — tihe površine unutar kartica; **line** — linije i ivice polja.
- **star** — zvezdice ocene (ukras, uvek uz tekstualnu ocenu). **viber** — samo Viber kampanje.

Uloga boje: **zelena = uradi nešto, koralna = ovo je ponuda/ušteda.** Primarno dugme je uvek zeleno.

## Typography

Jedna porodica: **Poppins** (`src/components/store/fonts.ts`, klasa `landerFontClass`), težine 400–800. Veličine u **rem** (poštuju sistemsku veličinu slova starijih kupaca) i **samo sa skale** od 14 koraka: 0.75 · 0.8125 · 0.875 · 0.9375 · 1 · 1.125 · 1.25 · 1.5 · 1.875 · 2.25 · 2.625 · 3.125 · 3.625 · 5.25 rem.

| Uloga | Telefon | Desktop |
|---|---|---|
| Display (hero h1) | 1.875rem / 800 | 2.625rem |
| Headline (h2 sekcije) | 1.5–1.875rem / 800 | 1.875–2.25rem |
| Broj-dokaz („30.000+“) | 3.625rem / 800 | 5.25rem |
| Cena (akcijska) | 2.625rem / 800 | 3.125rem |
| Title (kartice, forma) | 1.125–1.25rem / 600–700 | isto |
| Body | 0.9375–1rem / 400, line-height 1.6 | isto |
| Small / label | 0.875 / 0.8125rem | isto |
| Caption (pečat, oznaka) | **0.75rem** — ništa sitnije | isto |

Naslovi `text-balance`; tekst najviše ~65 znakova u redu (`max-w-prose` / `max-w-xl`). Cena: extrabold, zelena podloga, bez tvrde senke.

## Layout

- Kontejner `max-w-[1180px]`, ivice 12px telefon / 24px desktop.
- Prodajna stranica: hero preko cele širine; ispod dve kolone (priča levo, porudžbina desno, `lg:sticky`).
- Jedna radnja po ekranu; na telefonu **jedna** lepljiva traka (donja, sa cenom i „Naruči odmah“). Traka hitnosti na vrhu je lepljiva samo na desktopu.
- Koraci, liste i kartice na telefonu idu jedno ispod drugog kada tekst ne staje u ≥ 15px.
- Stranica proizvoda iz kataloga (`/products/[slug]`) ima zaglavlje sajta i „Dodaj u korpu“; oglasni lander (`/checkouts/[slug]`, `/v/[offer]`) nema navigaciju.

## Elevation & Depth

Meke senke sa pomakom (`shadow-card`, `shadow-raised`, `shadow-float`). Jedini tvrdi pomak je **„pritisnuto dugme“** sa starog sajta (`shadow-press`, `shadow-press-lg` = ivica u forest boji) — samo na zelenim dugmadima za porudžbinu, sa `active:translate-y`. Nigde drugde tvrde senke ni tvrde senke teksta.

## Shapes

- Radijusi: `rounded-panel` (14px, polja/FAQ/manji blokovi), `rounded-card` (22px, kartice), 28px hero, `rounded-full` dugmad i pečati. Polja forme 6px (izgled starog sajta).
- **Bez kartica u karticama**: unutar kartice podela ide linijama (`border-line`, `divide-line`) i tihim površinama, ne novim okvirima. Izuzetak: okvir ponude (koralni) u kartici porudžbine.
- **Bez debele ivice sa jedne strane** (side-tab) na karticama.

## Components

- **Isticanje (`Marked`)**: obojena podloga iza teksta, samo u krupnim naslovima. Najviše jedno po ekranu i samo za novac, uštedu, garanciju ili glavnu tvrdnju. Pomoćni naslovi („Česta pitanja“, „Kako da poručite“) bez isticanja.
- **Dugmad**: primarno zeleno (≥ 48px), slanje porudžbine green-press 62px sa `shadow-press-lg`, belo dugme na koralnoj traci (ink tekst), sekundarno belo sa zelenom ivicom (npr. „Dodaj u korpu“).
- **Pečat**: krug u coral-deep, broj ≥ 24px, natpis 12px.
- **Forma porudžbine (`QuickOrderForm`)**: labele iznad polja, „Sva polja su obavezna“, greške ispod polja (povezane `aria-describedby`), obračun sa dostavom i ukupnim iznosom pre dugmeta.
- **Pokret**: jedan autorski trenutak — isticanje u naslovu se iscrta jednom; brojač „30.000+“ jednom; odsjaj samo na dugmetu za slanje. Bez beskonačnog lebdenja/rotiranja/pulsiranja. Sve poštuje `prefers-reduced-motion`.
- **Fokus**: globalni `:focus-visible` obris 3px zelen; selekcija teksta mint; `accent-color` zelen.

## Do's and Don'ts

- **Do** koristi tokene; **don't** piši hex u komponentama.
- **Do** beli tekst samo na green/green-press/forest/coral-deep (i krupan na coral); **don't** beli tekst na mint ili sitan na coral.
- **Do** jednu zelenu radnju po ekranu; **don't** šest istih CTA dugmadi jedno ispod drugog.
- **Do** cena + dostava zajedno pre forme; **don't** prikazuj „uštedu“ koja se poklapa sa dostavom bez objašnjenja.
- **Do** dokaze sa starog sajta (brojevi, imenovani kupci, garancija, ministarstvo, snimci); **don't** izmišljaj nove brojeve, ocene ili tvrdnje van `docs/products`.
- **Don't** eyebrow/kicker iznad naslova, gradijentni tekst, kartice u karticama, unicode simboli umesto ikonica (koristi lucide-react).
