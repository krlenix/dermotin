/**
 * Prodajni sadržaj izloga (početna, product stranice, Viber stranice).
 *
 * Sve tvrdnje moraju imati pokriće u docs/products/*.md (claim bank):
 * kozmetika = "nega", nikad "lečenje"; dodaci ishrani = samo odobrene tvrdnje iz
 * deklaracije; bez obećavanja rezultata u roku i bez pominjanja Farmaceutskog fakulteta.
 *
 * Sadržaj je napisan za rs. Za ostale lokale vraća se rs tekst (fallback) dok se ne prevede.
 */

export interface StoreOffer {
  productId: string;
  /** Kratka oznaka na kartici, npr. "ZIMSKA AKCIJA" */
  badge: string;
  title: string;
  pitch: string;
  /** Linija ispod cene, npr. "3 bočice za celu sezonu" */
  priceNote?: string;
  tone: 'coral' | 'green' | 'sand' | 'night';
}

export interface NeedTile {
  productId: string;
  title: string;
  text: string;
}

export interface SalesCopy {
  eyebrow: string;
  headline: string;
  paragraphs: string[];
  forWhom: string[];
  /** Kratki razlozi za kupovinu prikazani kao kartice */
  reasons: { title: string; text: string }[];
}

const RS_OFFERS: StoreOffer[] = [
  {
    productId: 'immunis_kapi',
    badge: 'Zimska akcija',
    title: 'IMMUNIS KAPI — zimski paket',
    pitch: '3 bočice biljne podrške imunitetu i disajnim putevima za celu sezonu gripa i prehlada — **po ceni koja je skoro kao za jednu**.',
    priceNote: '3 bočice · za celu zimsku sezonu',
    tone: 'night',
  },
  {
    productId: 'bioroid_set',
    badge: 'Kompletna rutina',
    title: 'BIOROID SET — krema + kapi',
    pitch: 'Diskretna, kompletna rutina: **krema sa mentolom za osećaj svežine spolja** i biljne kapi za podršku venama i varenju iznutra.',
    priceNote: 'krema 50ml + kapi 50ml',
    tone: 'coral',
  },
  {
    productId: 'fungel_fungomax_set',
    badge: 'Novo u ponudi',
    title: 'FUNGEL + FUNGOMAX',
    pitch: 'Krema za širu površinu i serum sa kapaljkom za precizan nanos na nokte — **kompletna rutina nege za uredne nokte i negovanu kožu**.',
    priceNote: 'krema 50ml + serum 50ml',
    tone: 'green',
  },
  {
    productId: 'biomelis_set',
    badge: 'Povoljnije u setu',
    title: 'BIOMELIS + BIOMELIS KAPI',
    pitch: 'Umirujuća svakodnevna nega suve, zategnute kože i biljna podrška jetri i varenju — **dva proizvoda po ceni koja se isplati**.',
    priceNote: 'krema 50ml + kapi 50ml',
    tone: 'sand',
  },
];

const RS_NEEDS: NeedTile[] = [
  { productId: 'fungel_fungomax_set', title: 'Nokti i stopala', text: 'Nega kože i noktiju sklonih pojavi gljivica' },
  { productId: 'biomelis', title: 'Suva i osetljiva koža', text: 'Nega kože sklone ekcemima i psorijazi' },
  { productId: 'biowart', title: 'Ciljana nega kože', text: 'Za kožu sklonu pojavi bradavica' },
  { productId: 'bioroid_set', title: 'Intimni komfor', text: 'Diskretna nega osetljive regije' },
  { productId: 'immunis_kapi', title: 'Imunitet i disanje', text: 'Biljna podrška kroz zimsku sezonu' },
  { productId: 'biomelis_kapi', title: 'Jetra i varenje', text: 'Badelj, maslačak, čičak i lazarkinja' },
];

const RS_SALES_COPY: Record<string, SalesCopy> = {
  immunis_kapi: {
    eyebrow: 'Sezona gripa i prehlada je počela',
    headline: 'Spremite se za zimu na vreme — jedan paket, cela sezona',
    paragraphs: [
      'Kraći dani, hladnoća, grejanje, gužve u prevozu i na poslu — zima je period kada organizmu treba više pažnje. Upravo zato smo složili zimski paket IMMUNIS KAPI: **tri bočice koje vas prate kroz celu sezonu**, bez razmišljanja da li ste zaboravili da dopunite zalihu.',
      'IMMUNIS KAPI su dodatak ishrani sa **6 biljnih ekstrakata**. **Purpurna ehinacea doprinosi pravilnom funkcionisanju imunog sistema** i prirodnoj odbrambenoj sposobnosti organizma, a kopriva podržava odbrambene sposobnosti organizma. Majčina dušica doprinosi zdravlju organa za disanje, maslina odbrani organizma od spoljašnjih agenasa i zdravlju gornjih disajnih puteva, a lavanda relaksaciji i lakšem uspavljivanju.',
      'Uzimaju se jednostavno — **3 puta dnevno po 40 kapi** u malo vode, posle obroka. Jedna navika, svakog dana, uz uravnoteženu ishranu, san i kretanje.',
    ],
    forWhom: [
      'Odrasle koji žele dnevnu biljnu podršku imunitetu tokom jeseni i zime',
      'One koji provode dosta vremena u zatvorenom, u prevozu i na poslu među ljudima',
      'Sve koji vole da su spremni na vreme — jedan paket za celu sezonu',
    ],
    reasons: [
      { title: '3 bočice po ceni skoro kao 1', text: 'Zimski paket je najisplativiji način da pokrijete celu sezonu.' },
      { title: '6 biljnih ekstrakata', text: 'Ehinacea, kopriva, orah, majčina dušica, maslina i lavanda.' },
      { title: 'Imunitet + disajni putevi', text: 'Odobrene tvrdnje iz deklaracije, bez preterivanja.' },
      { title: 'Lako doziranje', text: '3 × 40 kapi dnevno, rastvoreno u malo vode.' },
    ],
  },
  bioroid_set: {
    eyebrow: 'Diskretno. Jednostavno. Kompletno.',
    headline: 'Nega spolja i podrška iznutra — u jednom setu',
    paragraphs: [
      'Neke teme se ne pominju naglas, ali svakodnevni komfor je važan. BIOROID SET objedinjuje **dva proizvoda koja se dopunjuju**: kremu za spoljašnju negu kože i sluzokože analne regije i biljne kapi za podršku iznutra.',
      'BIOROID krema sadrži **6 biljnih ekstrakata** — hajdučku travu, divlji kesten, neven, pastirsku torbicu, zdravac i kamilicu — uz panthenol i vitamine A i E. **Mentol pruža prijatan osećaj svežine i hlađenja** već pri nanošenju. Biljnog je porekla i može se koristiti duži vremenski period bez prekida.',
      'BIOROID KAPI su dodatak ishrani: **hajdučka trava podržava normalan vaskularni tonus i zdravlje venskog sistema**, a čičak, maslačak i hrast doprinose varenju i digestivnom komforu. Poručujete online, za par minuta, a **plaćate tek kuriru pri preuzimanju**.',
    ],
    forWhom: [
      'Odrasle koji žele svakodnevni komfor i higijensku negu osetljive regije',
      'One kojima je važna diskretna kupovina — bez odlaska u prodavnicu',
      'Sve koji žele kompletnu rutinu: negu spolja i biljnu podršku iznutra',
    ],
    reasons: [
      { title: 'Osećaj svežine', text: 'Mentol u kremi pruža prijatno hlađenje već pri nanošenju.' },
      { title: 'Dva proizvoda, jedna rutina', text: 'Krema + kapi u setu, po povoljnijoj ceni.' },
      { title: 'Biljni sastav', text: '6 biljnih ekstrakata u kremi i 6 u kapima.' },
      { title: 'Diskretna kupovina', text: 'Online porudžbina i plaćanje pouzećem.' },
    ],
  },
  fungel_fungomax_set: {
    eyebrow: 'Krema + serum = kompletna rutina',
    headline: 'Uredni nokti i negovana stopala, bez kompromisa',
    paragraphs: [
      'Zimske čizme, bazen, teretana, cela radna nedelja u zatvorenoj obući — koža i nokti stopala trpe više nego što mislimo. Zato smo spojili **dva proizvoda koja se savršeno dopunjuju** u jednu jednostavnu rutinu.',
      'FUNGOMAX je tečni serum sa kapaljkom: **preko 79% formule čini biljna tinktura** sa 4 ekstrakta (timijan, orahov list, žalfija i hrastova kora), uz alantoin i **čak 20% glicerina**. Kapaljka omogućava preciznu, ciljanu primenu tačno na nokte i manja mesta.',
      'FUNGEL je krema za širu površinu kože: **6 biljnih ekstrakata i 5 eteričnih ulja**, obogaćena panthenolom, ureom, glicerinom i vitaminima A i E koji doprinose hidrataciji i negovanom izgledu. **Prvo serum, zatim krema** — ujutru i uveče. To je cela rutina.',
    ],
    forWhom: [
      'Odrasle sa kožom i noktima sklonim pojavi gljivica',
      'One koji nose zatvorenu obuću, treniraju ili posećuju bazene i saune',
      'Sve koji žele uredne nokte i negovana stopala bez komplikovanih rutina',
    ],
    reasons: [
      { title: 'Ciljano + široko', text: 'Serum sa kapaljkom za nokte, krema za širu površinu kože.' },
      { title: '10 biljnih ekstrakata', text: '6 u kremi i 4 u serumu, uz 8 eteričnih ulja ukupno.' },
      { title: 'Bez parabena', text: 'I bez veštačkih boja, uz EU bezbednosnu procenu.' },
      { title: 'Ušteda u setu', text: 'Oba proizvoda po ceni nižoj nego pojedinačno.' },
    ],
  },
  fungel: {
    eyebrow: 'Nega kože i noktiju',
    headline: 'Jednostavna rutina za uredne nokte i negovana stopala',
    paragraphs: [
      'Zatvorena obuća, teretana, bazen, svlačionice — koža i nokti stopala svakodnevno su izloženi uslovima koji im ne prijaju. FUNGEL je **krema razvijena baš za negu kože i noktiju osoba sklonih pojavi gljivica**.',
      'Formula kombinuje **6 biljnih ekstrakata** (neven, rusa, žalfija, ehinacea, ivanjsko cveće i kantarion) i **5 eteričnih ulja** (čajno drvo, origano, lavandin, žalfija i eukaliptus). Panthenol, urea i glicerin doprinose hidrataciji i negovanom izgledu kože, a vitamini A i E zaokružuju negu.',
      'Nanosi se tanak sloj dva puta dnevno i ne ispira se. Za kompletnu rutinu, FUNGEL odlično ide uz FUNGOMAX serum sa kapaljkom — pogledajte naš set po povoljnijoj ceni.',
    ],
    forWhom: [
      'Odrasle sa kožom i noktima sklonim pojavi gljivica',
      'Sportiste i sve koji nose zatvorenu obuću ceo dan',
      'Sve koji žele negovan izgled noktiju i stopala',
    ],
    reasons: [
      { title: '6 + 5 biljnih sastojaka', text: 'Biljni ekstrakti i eterična ulja u jednoj kremi.' },
      { title: 'Hidratacija', text: 'Panthenol, urea i glicerin za negovan izgled.' },
      { title: 'Bez parabena', text: 'I bez veštačkih boja.' },
      { title: 'EU bezbednosna procena', text: 'U skladu sa regulativom (EC) 1223/2009.' },
    ],
  },
  biomelis_set: {
    eyebrow: 'Dva proizvoda, dve namene, jedna cena',
    headline: 'Umirujuća nega kože spolja i biljna podrška jetri iznutra',
    paragraphs: [
      'Suva, zategnuta koža traži nežnu, redovnu negu — svakog dana, bez prekida. BIOMELIS krema nastala je upravo **za negu kože osoba sklonih ekcemima i psorijazi**: **8 biljnih ekstrakata i 5 eteričnih ulja**, obogaćenih panthenolom, ureom, glicerinom i vitaminima A i E, koji doprinose hidrataciji i mekšem osećaju kože.',
      'Uz kremu, u setu dobijate i BIOMELIS KAPI — dodatak ishrani u kome **badelj, zahvaljujući silimarinu, doprinosi zdravlju jetre**, maslačak normalnoj funkciji želuca i jetre, a čičak i lazarkinja povoljno utiču na varenje.',
      'Kupljeni zajedno, ovi proizvodi **koštaju znatno manje nego pojedinačno**. Krema se nanosi dva puta dnevno uz nežnu masažu, a kapi se uzimaju **3 puta dnevno po 40 kapi** u malo vode.',
    ],
    forWhom: [
      'Odrasle sa suvom, osetljivom kožom sklonom ekcemima i psorijazi',
      'One koji žele biljnu podršku jetri i varenju',
      'Sve koji koriste oba proizvoda i žele da uštede',
    ],
    reasons: [
      { title: '8 biljnih ekstrakata', text: 'U kremi, uz 5 eteričnih ulja.' },
      { title: 'Hidratacija i komfor', text: 'Panthenol, urea i glicerin za mekši osećaj kože.' },
      { title: 'Silimarin iz badelja', text: 'Doprinosi zdravlju jetre (dodatak ishrani).' },
      { title: 'Ušteda u setu', text: 'Dva proizvoda po povoljnijoj ceni.' },
    ],
  },
  biomelis: {
    eyebrow: 'Svakodnevna nega osetljive kože',
    headline: 'Za kožu koja traži više nežnosti',
    paragraphs: [
      'Kada je koža suva, zategnuta i osetljiva, svaki dan je važan. BIOMELIS je krema **za negu kože osoba sklonih ekcemima i psorijazi**, napravljena da bude deo vaše svakodnevne rutine.',
      'Sadrži **8 biljnih ekstrakata** (neven, rusa, žalfija, hajdučka trava, rastavić, ivanjsko cveće, kantarion i hrastova kora) i **5 eteričnih ulja**. Panthenol, urea i glicerin doprinose hidrataciji i mekšem osećaju kože, uz vitamine A i E.',
      'Nanosi se dva puta dnevno uz nežnu masažu i ne ispira se. **Bez parabena i bez veštačkih boja**.',
    ],
    forWhom: [
      'Odrasle sa suvom, osetljivom kožom',
      'Kožu sklonu ekcemima i psorijazi',
      'Sve koji žele nežnu, redovnu negu biljnog sastava',
    ],
    reasons: [
      { title: '8 biljnih ekstrakata', text: 'Uz 5 eteričnih ulja.' },
      { title: 'Mekši osećaj kože', text: 'Panthenol, urea i glicerin.' },
      { title: 'Bez parabena', text: 'I bez veštačkih boja.' },
      { title: 'EU bezbednosna procena', text: 'U skladu sa regulativom (EC) 1223/2009.' },
    ],
  },
  biowart: {
    eyebrow: 'Ciljana nega kože',
    headline: 'Nega kože sklone pojavi bradavica — biljnim putem',
    paragraphs: [
      'BIOWART je krema za negu kože osoba sklonih pojavi bradavica, sa **čak 7 biljnih ekstrakata i 7 eteričnih ulja** u jednoj formuli.',
      '**Rusa (Chelidonium majus) i neven** su u najvišim koncentracijama među biljnim ekstraktima, uz hajdučku travu, ivanjsko cveće, kantarion, hrastovu koru i žalfiju. Panthenol, urea, glicerin i vitamini A i E zaokružuju negu.',
      '**Bez parabena i bez veštačkih boja**, sa bezbednosnom procenom u skladu sa EU regulativom.',
    ],
    forWhom: [
      'Odrasle sa kožom sklonom pojavi bradavica',
      'Sve koji žele ciljanu negu biljnog sastava',
      'One kojima je važan transparentan sastav',
    ],
    reasons: [
      { title: '7 + 7 biljnih sastojaka', text: 'Biljni ekstrakti i eterična ulja.' },
      { title: 'Rusa i neven', text: 'U najvišim koncentracijama među ekstraktima.' },
      { title: 'Bez parabena', text: 'I bez veštačkih boja.' },
      { title: 'EU bezbednosna procena', text: 'U skladu sa regulativom (EC) 1223/2009.' },
    ],
  },
  biomelis_kapi: {
    eyebrow: 'Biljna podrška iznutra',
    headline: 'Podrška jetri i varenju, iz prirode',
    paragraphs: [
      'Neredovni obroci, teška hrana, stres — sve to se oseti. BIOMELIS KAPI su dodatak ishrani sa **6 pažljivo odabranih biljnih ekstrakata**.',
      '**Badelj, zahvaljujući silimarinu, doprinosi zdravlju jetre**. Maslačak doprinosi normalnoj funkciji želuca i jetre, rastavić ima zaštitni efekat na ćelije jetre, a čičak i lazarkinja povoljno utiču na varenje.',
      'Odrasli uzimaju **3 puta dnevno po 40 kapi**, rastvoreno u malo vode.',
    ],
    forWhom: [
      'Odrasle koji žele biljnu podršku jetri',
      'One kojima je važan digestivni komfor',
      'Sve koji vole jasno doziranje i prirodne ekstrakte',
    ],
    reasons: [
      { title: 'Silimarin iz badelja', text: 'Doprinosi zdravlju jetre.' },
      { title: '6 biljnih ekstrakata', text: 'Vodeno-etanolni ekstrakti.' },
      { title: 'Varenje', text: 'Čičak i lazarkinja povoljno utiču na varenje.' },
      { title: 'Manje od 12 kcal', text: 'Energetska vrednost dnevnog unosa.' },
    ],
  },
};

// Viber ponude dele tekst sa izlogom
RS_SALES_COPY.fungel_fungomax_gratis = RS_SALES_COPY.fungel_fungomax_set;

export function getStoreOffers(locale: string): StoreOffer[] {
  return locale === 'rs' ? RS_OFFERS : [];
}

export function getNeedTiles(locale: string): NeedTile[] {
  return locale === 'rs' ? RS_NEEDS : [];
}

export function getSalesCopy(productId: string, locale: string): SalesCopy | null {
  void locale;
  return RS_SALES_COPY[productId] ?? null;
}

/**
 * Ujednačeni packshot-ovi izloga: providna pozadina, isti kadar i ista linija poda, pa
 * kartice i galerije izgledaju kao jedna kolekcija. Ključ je product.id (isti u svim
 * lokalima); proizvod bez unosa koristi svoje slike iz products.ts.
 */
// single = slika JEDNOG komada (za komponente setova), kada je glavni packshot višepak
const STORE_VISUALS: Record<string, { packshot: string; single?: string; extra?: string[] }> = {
  immunis_kapi: { packshot: '/images/store/immunis-3pak.png', single: '/images/store/immunis-kapi.png', extra: ['/images/store/immunis-kapi.png'] },
  bioroid_set: {
    packshot: '/images/store/bioroid-set.png',
    extra: ['/images/store/bioroid.png', '/images/store/bioroid-kapi.png'],
  },
  fungel_fungomax_set: {
    packshot: '/images/store/fungel-fungomax-set.png',
    extra: ['/images/store/fungel.png', '/images/store/fungomax.png', '/images/store/fungel-open.png', '/images/main/banner-image.jpg'],
  },
  fungel_fungomax_gratis: {
    packshot: '/images/store/fungel-fungomax-set.png',
    extra: ['/images/store/fungel.png', '/images/store/fungomax.png', '/images/store/fungel-open.png'],
  },
  biomelis_set: {
    packshot: '/images/store/biomelis-set.png',
    extra: ['/images/store/biomelis.png', '/images/store/biomelis-kapi.png'],
  },
  biowart_immunis_gratis: {
    packshot: '/images/store/biowart-immunis-set.png',
    extra: ['/images/store/biowart.png', '/images/store/immunis-kapi.png', '/images/store/biowart-open.png'],
  },
  fungel: { packshot: '/images/store/fungel.png', extra: ['/images/store/fungel-open.png', '/images/main/banner-image.jpg'] },
  fungomax: { packshot: '/images/store/fungomax.png' },
  biomelis: { packshot: '/images/store/biomelis.png' },
  biomelis_kapi: { packshot: '/images/store/biomelis-kapi.png' },
  biowart: { packshot: '/images/store/biowart.png', extra: ['/images/store/biowart-open.png'] },
  bioroid: { packshot: '/images/store/bioroid.png' },
  bioroid_kapi: { packshot: '/images/store/bioroid-kapi.png' },
};

export const STORE_HERO_IMAGE = '/images/store/hero-group.png';

/** Packshot (providan PNG) se prikazuje na „sceni“; ostale slike preko celog okvira. */
export function isPackshot(src: string): boolean {
  return src.startsWith('/images/store/');
}

export function getStoreVisual(product: { id: string; images: { main: string; gallery: string[] } }): {
  packshot: string;
  gallery: string[];
} {
  const visual = STORE_VISUALS[product.id];
  if (!visual) {
    return { packshot: product.images.main, gallery: Array.from(new Set([product.images.main, ...product.images.gallery])) };
  }
  return { packshot: visual.packshot, gallery: [visual.packshot, ...(visual.extra ?? [])] };
}

/**
 * Ključne karakteristike proizvoda u brojkama — za kartice, izdvojene proizvode i
 * stranicu proizvoda. Sve vrednosti su iz prodajnih tekstova iznad (claim bank);
 * oznake su neutralne (bez ekavice/ijekavice) jer važe za sve lokale.
 */
export interface ProductFact {
  value: string;
  label: string;
}

const PRODUCT_FACTS: Record<string, ProductFact[]> = {
  immunis_kapi: [
    { value: '3', label: 'bočice za sezonu' },
    { value: '6', label: 'biljnih ekstrakata' },
    { value: '3×40', label: 'kapi dnevno' },
  ],
  bioroid_set: [
    { value: '6+6', label: 'biljnih ekstrakata' },
    { value: '2', label: 'proizvoda u setu' },
    { value: '0', label: 'parabena u kremi' },
  ],
  fungel_fungomax_set: [
    { value: '10', label: 'biljnih ekstrakata' },
    { value: '8', label: 'eteričnih ulja' },
    { value: '2', label: 'proizvoda u setu' },
  ],
  biomelis_set: [
    { value: '8', label: 'ekstrakata u kremi' },
    { value: '6', label: 'ekstrakata u kapima' },
    { value: '2', label: 'proizvoda u setu' },
  ],
  fungel: [
    { value: '6', label: 'biljnih ekstrakata' },
    { value: '5', label: 'eteričnih ulja' },
    { value: '0', label: 'parabena' },
  ],
  fungomax: [
    { value: '79%', label: 'biljne tinkture' },
    { value: '4', label: 'biljna ekstrakta' },
    { value: '20%', label: 'glicerina' },
  ],
  biomelis: [
    { value: '8', label: 'biljnih ekstrakata' },
    { value: '5', label: 'eteričnih ulja' },
    { value: '0', label: 'parabena' },
  ],
  biowart: [
    { value: '7', label: 'biljnih ekstrakata' },
    { value: '7', label: 'eteričnih ulja' },
    { value: '0', label: 'parabena' },
  ],
  bioroid: [
    { value: '6', label: 'biljnih ekstrakata' },
    { value: 'A+E', label: 'vitamini i panthenol' },
    { value: '0', label: 'parabena' },
  ],
  biomelis_kapi: [
    { value: '6', label: 'biljnih ekstrakata' },
    { value: '3×40', label: 'kapi dnevno' },
    { value: '<12', label: 'kcal dnevno' },
  ],
  bioroid_kapi: [
    { value: '6', label: 'biljnih ekstrakata' },
    { value: '3×40', label: 'kapi dnevno' },
  ],
};
PRODUCT_FACTS.fungel_fungomax_gratis = PRODUCT_FACTS.fungel_fungomax_set;
PRODUCT_FACTS.biowart_immunis_gratis = [
  { value: '7+7', label: 'ekstrakata i ulja u kremi' },
  { value: '6', label: 'ekstrakata u kapima' },
  { value: '2', label: 'proizvoda u paketu' },
];

export function getProductFacts(productId: string): ProductFact[] {
  return PRODUCT_FACTS[productId] ?? [];
}

/** Slika jednog komada proizvoda — za prikaz komponenti seta (npr. 1 bočica IMMUNIS, ne zimski paket). */
export function getUnitPackshot(product: { id: string; images: { main: string; gallery: string[] } }): string {
  const visual = STORE_VISUALS[product.id];
  return visual?.single ?? getStoreVisual(product).packshot;
}

/** Tesno isečen providni packshot (bez praznog kadra) — za male prikaze jedan pored drugog. */
export function tightPackshot(src: string): string {
  return isPackshot(src) && !src.includes('/tight/') && !src.endsWith('hero-group.png') ? src.replace('/images/store/', '/images/store/tight/') : src;
}
