/**
 * Sadržaj prodajne stranice proizvoda — preslikan 1:1 sa starog sajta dermotin.rs
 * (checkouts/*-v3), po izričitoj odluci vlasnika (2026-10-27): stara stranica je
 * najbolje konvertovala. Tekstovi su sa srpskog sajta (bs stranice prevedene na ekavicu).
 *
 * Ključ je product.id (isti u svim lokalima).
 */
import type { Registration } from './store-proof';

export type Mark = 'green' | 'coral';

export interface LanderTestimonial {
  name: string;
  age?: number;
  photo?: string;
  text: string;
}

export interface LanderContent {
  /** Naslov u hero delu, red po red; mark = obojena podloga iza teksta */
  hero: Array<{ text: string; mark?: Mark }>;
  /** „10,000 +“ */
  customers: string;
  /** Naslov iznad liste prednosti (npr. „IMMUNIS kapi pomažu“) */
  benefitsTitle?: string;
  benefits: string[];
  /** Citat ispod liste prednosti */
  quote: string;
  /** Uvod u sastojke; **tekst** se podebljava */
  ingredientsIntro: string;
  /** [naziv, opis] — bez naziva za stavke koje su samo tekst */
  ingredients: Array<[string | null, string]>;
  ingredientsLead?: string;
  registration?: Registration & { title?: string; text?: string };
  checks: [string, string, string];
  testimonials: LanderTestimonial[];
  /** Tekstovi ikonica: prirodna efikasnost, bez štetnih hemikalija, provereni sastojci */
  cards: { natural: string; safe: string; tested: string };
  /** Tekst dugmeta u koralnoj traci */
  cta?: string;
  /** „bočice“ / „kutije“ u tekstu garancije */
  unit: 'bočice' | 'kutije';
}

const P = '/images/lander';
const SAFE = 'Blaga i sigurna formula, bez veštačkih dodataka, parabena i GMO — pogodna i za dugotrajnu upotrebu';
const CHECKS: [string, string, string] = [
  'Sigurna i jednostavna primena',
  'Formulacija bazirana na prirodnim sastojcima',
  'Bez parabena, veštačkih boja i mirisa',
];
const EU_LAB = {
  kind: 'lab' as const,
  number: 'ID-57155/2025',
  date: '25.06.2025.',
  title: 'Proizveden u Srbiji, usklađen sa EU standardima',
  text: 'Proizvod je razvijen i proizveden u Srbiji, u skladu sa važećim EU propisima za kozmetiku. Kvalitet formulacije potvrđen je mikrobiološkim analizama u ovlašćenoj laboratoriji.',
};
const MINISTRY = (number: string) => ({ kind: 'ministry' as const, number, date: '25.03.2025.' });

const FUNGEL_INGREDIENTS: Array<[string, string]> = [
  ['Žalfija', 'antiseptičko i antifungalno dejstvo'],
  ['Rusa', 'umiruje iritiranu kožu i deluje protivupalno'],
  ['Neven', 'podstiče regeneraciju i obnavlja oštećenu kožu'],
  ['Ehinacea', 'jača prirodnu otpornost kože'],
  ['Kantarion', 'smanjuje iritacije i ubrzava zarastanje'],
  ['Hajdučka trava', 'pomaže kod upala i gljivičnih infekcija'],
];
const FUNGEL_BENEFITS = [
  'Brzo delovanje već nakon nekoliko nedelja',
  'Eliminiše neprijatne mirise stopala',
  'Jača zaštitnu barijeru kože i štiti je od razvoja gljivica',
  'Obnavlja nokte i vraća im prirodnu boju',
  'Bez parabena, veštačkih boja i mirisa',
];
const FUNGEL_QUOTE =
  'Godinama sam se mučio sa upornom gljivičnom infekcijom na stopalima, koja mi je stvarala veliku nelagodu. Otkako sam počeo da koristim Fungel kremu, moji problemi su se drastično smanjili. Krema je veoma efikasna, lako se nanosi i ne ostavlja masne tragove.';
const FUNGEL_TESTIMONIALS: LanderTestimonial[] = [
  {
    name: 'Dragan',
    age: 50,
    photo: `${P}/2024-03-20_021527.png`,
    text: 'Godinama sam se mučio sa upornom gljivičnom infekcijom na stopalima, koja mi je stvarala veliku nelagodu. Otkako sam počeo da koristim Fungel, moji problemi su se drastično smanjili. Krema je veoma efikasna, lako se nanosi i ne ostavlja masne tragove.',
  },
  {
    name: 'Jelena',
    age: 37,
    photo: `${P}/2024-03-20_021708.png`,
    text: 'Kao neko ko redovno ide na trčanje, često sam imala problema sa gljivicama na nogama. Probala sam razne proizvode, ali Fungel je jedini koji je dao trajne rezultate. Osim što je efikasan, veoma mi se dopada i što je krema lagana i brzo se upija. Definitivno 5 zvezdica od mene!',
  },
];
const FUNGOMAX_TESTIMONIALS: LanderTestimonial[] = [
  {
    name: 'Ivan',
    age: 39,
    photo: `${P}/2025-07-24_114105.png`,
    text: 'Počelo je kao blagi svrab između prstiju nakon treninga, ali se brzo razvilo u ozbiljnu gljivičnu infekciju. Kao neko ko svakodnevno nosi zatvorenu sportsku obuću, bilo mi je jako teško da se izborim s tim. FUNGOMAX mi je preporučila koleginica iz teretane i iskreno – spasio me. Već posle nedelju dana crvenilo se smanjilo, svrab je nestao, a koža se regenerisala. Sada ga koristim preventivno i nosim ga u torbi!',
  },
  {
    name: 'Jovana',
    age: 56,
    photo: `${P}/2025-07-24_114130.png`,
    text: 'Godinama sam radila kao pedikir i često sam imala kontakt sa klijentima koji su imali gljivična oboljenja. Nažalost, i sama sam razvila infekciju na palcu koja nikako nije prolazila. Probala sam apotekarske kreme, prirodna ulja, pa čak i tinkture, ali ništa nije dalo dugoročni efekat. Otkako koristim FUNGOMAX serum, infekcija se povukla, a nokat je konačno počeo da se obnavlja. Prijatno sam iznenađena koliko brzo deluje.',
  },
];
const FUNGEL_CARDS = {
  natural: 'Naša formula sadrži pažljivo odabrane biljne sastojke koji podržavaju kožu i nokte sklone gljivicama',
  safe: SAFE,
  tested: 'Biljni ekstrakti pažljivo odabrani zbog dokazanih svojstava podrške zdravoj koži',
};

const BIOMELIS_KAPI: LanderContent = {
  hero: [
    { text: 'Prirodna podrška', mark: 'green' },
    { text: 'za jetru i metabolizam' },
    { text: 'Bez osećaja nadutosti, težine i umora nakon obroka', mark: 'coral' },
  ],
  customers: '10,000 +',
  benefits: [
    'Pomažu jetri u neutralisanju toksina',
    'Podstiču izbacivanje viška tečnosti',
    'Ublažavaju osećaj nadutosti i težine',
    'Podržavaju pravilan metabolizam masti i ugljenih hidrata',
    'Bez parabena, veštačkih boja i mirisa',
  ],
  quote: 'Nakon jela više ne osećam onaj balon u stomaku. Osećam se lakše i imam više energije. Odlična podrška za jetru',
  ingredientsIntro: '**BIOMELIS** kapi sadrže pažljivo odabrane **100% prirodne sastojke**, **bez GMO**, čija je efikasnost i bezbednost potvrđena istraživanjima.',
  ingredients: [
    ['Badelj', 'podržava regeneraciju jetre'],
    ['Kopriva', 'pomaže eliminaciju toksina'],
    ['Maslačak', 'utiče na normalnu funkciju jetre i žuči'],
    ['Čičak', 'doprinosi boljem varenju i balansu glukoze'],
    ['Rastavić', 'ima blago diuretičko dejstvo'],
    ['Lazarkinja', 'tradicionalno korišćena za varenje i relaksaciju'],
  ],
  registration: MINISTRY('26731/2025'),
  checks: CHECKS,
  testimonials: [
    {
      name: 'Nemanja',
      age: 42,
      photo: `${P}/v3_0059274.jpg`,
      text: 'Godinama sam tražio nešto što će prirodno podržati moju jetru, bez hemije. Ove kapi su mi prijale, probava mi je bolja, a osećam se lakše i bistrije tokom dana.',
    },
    {
      name: 'Milica',
      age: 36,
      photo: `${P}/v3_0601967.jpg`,
      text: 'BIOMELIS mi je pomogao da se rešim konstantnog osećaja nadutosti i umora posle obroka. Već posle nekoliko dana korišćenja, stomak mi je bio ravniji, a energija primetno bolja.',
    },
  ],
  cards: {
    natural: 'Naša formula sadrži pažljivo odabrane biljne sastojke koji podržavaju rad jetre i metabolizma.',
    safe: SAFE,
    tested: 'Biljni ekstrakti pažljivo odabrani zbog dokazanih svojstava podrške jetri, metabolizmu i prirodnoj detoksikaciji.',
  },
  unit: 'bočice',
};

const IMMUNIS_KAPI: LanderContent = {
  hero: [
    // Zadatak: akcenat na sezonu gripa — 3 bočice za celu zimsku sezonu
    { text: 'Zimski paket', mark: 'green' },
    { text: '3 bočice za celu sezonu gripa i prehlada' },
    { text: 'za jači imunitet i zdravije disajne puteve', mark: 'coral' },
  ],
  customers: '10,000 +',
  benefitsTitle: 'IMMUNIS kapi pomažu',
  benefits: [
    'Aktivaciju prirodne odbrane organizma',
    'Zaštitu disajnih puteva od spoljnih uticaja',
    'Relaksaciju tela i lakši san',
    'Antioksidativnu ravnotežu i detoks podršku',
  ],
  quote: 'IMMUNIS mi je postao deo jutarnje rutine. Imam više energije, lakše izdržim dan i nekako se ređe zadržim u onim tipičnim sezonskim prehladama.',
  ingredientsIntro: '**IMMUNIS** kapi sadrže pažljivo odabrane **100% prirodne sastojke**, **bez GMO**, čija je efikasnost i bezbednost potvrđena istraživanjima.',
  ingredients: [
    ['Ehinacea', 'doprinosi funkciji imunog sistema'],
    ['Kopriva', 'podržava vitalnost, bogata mineralima'],
    ['List oraha', 'prirodna antioksidativna zaštita'],
    ['Majčina dušica', 'čuva disajne puteve, deluje antiseptično'],
    ['List masline', 'doprinosi otpornosti na spoljašnje uticaje'],
    ['Lavanda', 'pomaže opuštanje i kvalitetniji san'],
  ],
  registration: MINISTRY('26511/2025'),
  checks: CHECKS,
  testimonials: [
    {
      name: 'Sanja',
      age: 37,
      photo: `${P}/Sanja.jpg`,
      text: 'Uzimam IMMUNIS svako jutro, pogotovo kad osetim da mi opada energija. Ne mogu da tvrdim da me ništa ne ‘hvata’, ali se definitivno oporavim brže i lakše preguram dan.',
    },
    {
      name: 'Dragana',
      age: 45,
      photo: `${P}/Dragana.jpg`,
      text: 'Već godinama imam osetljive sinuse i često mi nos bude zapušen. Od kada koristim ove kapi, dišem lakše i spavam mirnije. Prijaju mi, pogotovo u prelaznim periodima.',
    },
  ],
  cards: {
    natural: 'Formulisane sa pažnjom i znanjem, naše kapi sadrže kombinaciju lekovitih biljaka koje podržavaju prirodne odbrambene mehanizme tela.',
    safe: SAFE,
    tested: 'Biljni ekstrakti pažljivo odabrani zbog dokazanih svojstava u podršci imunom sistemu, zdravlju disajnih puteva i prirodnoj otpornosti organizma.',
  },
  unit: 'bočice',
};

const BIOROID_INGREDIENTS: Array<[string, string]> = [
  ['Hajdučka trava', 'hemostatsko i protivupalno dejstvo'],
  ['Čičak', 'doprinosi venskom zdravlju i olakšava varenje'],
  ['Neven', 'podržava zarastanje i umiruje sluzokožu'],
  ['Hrastova kora', 'bogata taninima, stvara zaštitni sloj i smanjuje sekreciju'],
  ['Maslačak', 'blago diuretično i detoksikaciono dejstvo'],
  ['Kleka', 'prirodni antiseptik, doprinosi izlučivanju viška tečnosti'],
];

const BIOROID_KAPI: LanderContent = {
  hero: [
    { text: 'Prirodna biljna podrška', mark: 'green' },
    { text: 'za ublažavanje hemoroidalnih tegoba' },
    { text: 'i regeneraciju osetljivog tkiva', mark: 'coral' },
  ],
  customers: '10,000 +',
  benefitsTitle: 'BIOROID kapi pomažu',
  benefits: [
    'Ublažavanju neprijatnosti kod hemoroida (svrab, peckanje, osećaj nelagodnosti)',
    'Regeneraciji iritiranog tkiva analne regije',
    'Jačanju venskih zidova i poboljšanju cirkulacije',
    'Zaštiti sluzokože zahvaljujući taninima i antioksidansima',
    'Oporavku posle perioda intenzivnog napora ili sedenja',
  ],
  quote: 'Nakon više pokušaja sa kremama, konačno nešto što deluje iznutra. Osetio sam olakšanje već nakon nekoliko dana.',
  ingredientsIntro: '**BIOROID** kapi sadrže pažljivo odabrane **100% prirodne sastojke**, **bez GMO**, čija je efikasnost i bezbednost potvrđena istraživanjima.',
  ingredients: BIOROID_INGREDIENTS,
  registration: MINISTRY('26517/2025'),
  checks: CHECKS,
  testimonials: [
    {
      name: 'Nikola',
      age: 43,
      photo: `${P}/Nikola.jpg`,
      text: 'Radim kao vozač i već godinama se borim sa povremenim hemoroidima. Kreme su mi pomagale privremeno, ali nisam želeo da stalno koristim kortikosteroide. BIOROID kapi koristim preventivno – kada osetim prve simptome. Prijatno me je iznenadilo to što već nakon par dana osetim olakšanje i što se stanje ne pogoršava. Dodatni plus je to što deluje iznutra, a ne ostavlja tragove kao masti.',
    },
    {
      name: 'Ivana',
      age: 35,
      photo: `${P}/Ivana-35.jpg`,
      text: 'Nisam osoba koja često ostavlja recenzije, ali sam se baš prijatno iznenadila. Imala sam povremene tegobe koje su se javljale nakon dužeg sedenja – osećaj pritiska, nelagodnosti i blagog krvarenja. Počela sam da koristim BIOROID kapi uz blagu dijetu, i nakon nekoliko dana primetila sam da mi je sedenje lakše, a neprijatnosti se sve ređe javljaju. Posebno mi se dopada što je biljno i što ne izaziva nuspojave.',
    },
  ],
  cards: {
    natural: 'Formulisane sa pažnjom i stručnošću, BIOROID kapi sadrže pažljivo odabranu kombinaciju biljaka koje doprinose umirenju iritacija, zaštiti sluzokože i oporavku osetljivih tkiva.',
    safe: SAFE,
    tested: 'Biljni ekstrakti odabrani zbog svojih potvrđenih svojstava u ublažavanju upale, jačanju venskih zidova i podršci prirodnoj regeneraciji kod hemoroidalnih tegoba.',
  },
  unit: 'bočice',
};

const BIOROID_SET: LanderContent = {
  hero: [
    { text: 'Moćna kombinacija', mark: 'green' },
    { text: 'protiv hemoroida' },
    { text: 'Deluju iznutra i spolja – za brže i potpunije olakšanje', mark: 'coral' },
  ],
  customers: '20,000 +',
  benefitsTitle: 'Prva prirodna kombinacija koja istovremeno',
  benefits: [
    'Umiruje upale i svrab iznutra',
    'Ublažava neprijatnosti tokom sedenja',
    'Pomaže regeneraciju sluzokože i kože',
    'Deluje na osetljivost, peckanje i krvarenje',
    'Pogodna i za unutrašnje i za spoljašnje hemoroide',
  ],
  quote:
    'Imala sam jake bolove pri sedenju, svrab i povremeno krvarenje zbog hemoroida. Uzela sam komplet – kapi i melem – i već posle par dana osetila olakšanje. Melem trenutno smiri peckanje, a kapi su mi pomogle da se pritisak iznutra smanji. Posle dve nedelje gotovo da nemam simptome. Sve je prirodno i nije mi izazvalo nikakve nuspojave. Preporučujem svakome ko želi stvarno rešenje bez hemije.',
  ingredientsIntro:
    'Dok **BIOROID KAPI** deluju iznutra, smanjujući upale vena i osetljivost rektuma, **BIOROID MELEM** pruža momentalno olakšanje spolja, ublažava žarenje i ubrzava zarastanje kože.',
  ingredients: BIOROID_INGREDIENTS,
  registration: MINISTRY('26517/2025'),
  checks: CHECKS,
  testimonials: [
    {
      name: 'Jelena V.',
      age: 29,
      photo: `${P}/2025-03-07_183539.png`,
      text: 'Posle porođaja sam imala spoljašnje hemoroide koji su me baš mučili. Nisam htela da koristim lekove dok dojim, pa sam probala Bioroid kapi i melem jer su na biljnoj bazi. Melem mi je momentalno olakšao svakodnevicu, a kapi su rešile problem iz korena. Sve je prošlo bez hemije i bez stresa.',
    },
    {
      name: 'Dragan R.',
      age: 61,
      photo: `${P}/milovan.png`,
      text: 'Više od 10 godina sam se borio sa hemoroidima – naročito ujutru i tokom dužeg sedenja. Probao sam masti, tablete, čak i čepiće, ali ništa nije davalo dugotrajan efekat. Ova kombinacija kapi i melema me je prijatno iznenadila. Prvi put sam se osećao bolje već nakon nekoliko dana. Sada nemam bolove, nema krvarenja, i mogu da funkcionišem normalno.',
    },
  ],
  cards: {
    natural: 'BIOROID kapi i melem su stručno formulisani da deluju iznutra i spolja. Prirodne biljke umiruju iritacije, štite sluzokožu i kožu, i ubrzavaju oporavak osetljivih tkiva.',
    safe: SAFE,
    tested: 'Biljni ekstrakti odabrani zbog svojih potvrđenih svojstava u ublažavanju upale, jačanju venskih zidova i podršci prirodnoj regeneraciji kod hemoroidalnih tegoba.',
  },
  cta: 'Poruči komplet po sniženoj ceni',
  unit: 'bočice',
};

const BIOROID: LanderContent = {
  hero: [
    { text: '100% prirodno i efikasno', mark: 'green' },
    { text: 'Pomoć u nezi hemoroida.' },
    { text: 'Osećaj olakšanja i blago umirenje kože već nakon nekoliko primena', mark: 'coral' },
  ],
  customers: '10,000 +',
  benefits: [
    'Brzo umiruje iritaciju, svrab i nelagodnost analne regije',
    'Podstiče regeneraciju osetljive kože',
    'Dubinski hidrira i sprečava dodatne iritacije',
    'Formira zaštitni sloj koji štiti od spoljnih faktora',
    'Potpuno prirodni sastojci bez štetnih efekata',
  ],
  quote:
    'Isprobala sam mnogo proizvoda, ali tek je BIOROID melem doneo pravo olakšanje. Nakon redovne upotrebe koža mi je potpuno oporavljena, a nelagodnosti su gotovo nestale.',
  ingredientsIntro:
    'Kombinacija pažljivo odabranih biljnih ekstrakata poput **nevena, hajdučke trave, divljeg kestena i kamilice**, u kombinaciji sa **mentolom** i uljem lavande, obezbeđuje snažno prirodno rešenje za probleme analne regije.',
  ingredients: [
    ['Neven', 'Poznat po svom umirujućem i regenerativnom dejstvu, smanjuje iritacije i ubrzava obnavljanje kože.'],
    ['Divlji kesten', 'Blagotvorno deluje na kožu, smanjujući osećaj neprijatnosti i umanjujući iritaciju.'],
    ['Hajdučka trava', 'Deluje protivupalno, smanjuje svrab i doprinosi bržem oporavku kože.'],
  ],
  registration: EU_LAB,
  checks: CHECKS,
  testimonials: [
    {
      name: 'Marko',
      age: 46,
      text: 'Nakon samo nedelju dana korišćenja BIOROID melema, osećam se kao potpuno nova osoba! Iritacije su nestale, svakodnevni problemi smanjeni, a konačno mogu normalno da funkcionišem bez nelagodnosti.',
    },
    {
      name: 'Dragica',
      age: 57,
      text: 'Već nakon nekoliko dana osećala sam veliko poboljšanje. Koristim ga svakodnevno i stanje se drastično popravilo. Odličan proizvod koji zaista vredi probati, svima ga toplo preporučujem!',
    },
  ],
  cards: {
    natural: 'Melem se nanosi 2-3 puta dnevno, poželjno nakon pražnjenja, što omogućava praktičnu svakodnevnu negu bez komplikacija.',
    safe: SAFE,
    tested: 'Dubinski hrani i obnavlja kožu analne regije, pružajući zaštitu od spoljnih iritacija i faktora koji mogu pogoršati stanje.',
  },
  unit: 'kutije',
};

const FUNGOMAX: LanderContent = {
  hero: [
    { text: 'Prirodna podrška', mark: 'green' },
    { text: 'za kožu i nokte' },
    { text: 'sklone pojavi gljivica', mark: 'coral' },
  ],
  customers: '10,000 +',
  benefits: [
    'Brzo delovanje već nakon par nedelja',
    'Eliminiše neprijatne mirise stopala',
    'Jača kožnu barijeru i štiti je od razvoja gljivica',
    'Obnavlja nokte i vraća im prirodnu boju',
    'Bez parabena, veštačkih boja i mirisa',
  ],
  quote:
    'Godinama sam se mučio sa upornom gljivičnom infekcijom na stopalima, koja mi je stvarala veliku nelagodu. Otkako sam počeo da koristim Fungomax, moji problemi su se drastično smanjili. Serum je veoma efikasan, lako se nanosi i ne ostavlja masne tragove.',
  ingredientsIntro: '**FUNGOMAX** serum sadrži pažljivo odabrane **100% prirodne sastojke**, **bez GMO**, čija je efikasnost i bezbednost potvrđena istraživanjima.',
  ingredients: [
    ['Ekstrakt hrastove kore', 'stvara nepovoljno okruženje za razvoj gljivica'],
    ['Majčina dušica', 'snažno antiseptično dejstvo'],
    ['List oraha', 'umiruje iritacije i podstiče obnovu kože'],
    ['Žalfija', 'ublažava crvenilo i osvežava kožu'],
    ['Karanfilić', 'prirodno fungicidno dejstvo'],
    ['Lavanda i ruzmarin', 'regeneracija i antibakterijska zaštita'],
    ['Alantoin i glicerin', 'dubinska hidratacija i zaštita kože'],
  ],
  registration: EU_LAB,
  checks: CHECKS,
  testimonials: FUNGOMAX_TESTIMONIALS,
  cards: FUNGEL_CARDS,
  unit: 'bočice',
};

const FUNGEL: LanderContent = {
  hero: FUNGOMAX.hero,
  customers: '20,000 +',
  benefits: FUNGEL_BENEFITS,
  quote: FUNGEL_QUOTE,
  ingredientsIntro: '**FUNGEL** krema sadrži pažljivo odabrane **100% prirodne sastojke**, **bez GMO**, čija je efikasnost i bezbednost potvrđena istraživanjima.',
  ingredients: FUNGEL_INGREDIENTS,
  registration: EU_LAB,
  checks: CHECKS,
  testimonials: FUNGEL_TESTIMONIALS,
  cards: FUNGEL_CARDS,
  unit: 'kutije',
};

const FUNGEL_FUNGOMAX: LanderContent = {
  ...FUNGEL,
  hero: [
    { text: 'FUNGEL + FUNGOMAX', mark: 'green' },
    { text: 'prirodna podrška za kožu i nokte' },
    { text: 'sklone pojavi gljivica', mark: 'coral' },
  ],
  ingredientsIntro:
    '**FUNGEL** krema i **FUNGOMAX** serum sadrže pažljivo odabrane **100% prirodne sastojke**, **bez GMO**, čija je efikasnost i bezbednost potvrđena istraživanjima.',
  ingredients: [...FUNGEL_INGREDIENTS, ['Karanfilić', 'prirodno fungicidno dejstvo'], ['Alantoin i glicerin', 'dubinska hidratacija i zaštita kože']],
  testimonials: [FUNGEL_TESTIMONIALS[0], FUNGOMAX_TESTIMONIALS[0], FUNGEL_TESTIMONIALS[1], FUNGOMAX_TESTIMONIALS[1]],
  cta: 'Poruči komplet po sniženoj ceni',
};

const BIOMELIS: LanderContent = {
  hero: [
    { text: 'Prirodna podrška', mark: 'green' },
    { text: 'za kožu sklonu' },
    { text: 'ekcemima i psorijazi', mark: 'coral' },
  ],
  customers: '20,000 +',
  benefits: [
    'Brzo delovanje već nakon par primena',
    'Ublažava crvenilo, svrab i perutanje kože uzrokovano ekcemom i psorijazom',
    'Podstiče brzu i efikasnu regeneraciju oštećene kože',
    'Dubinski hidrira, sprečavajući suvoću i pucanje',
    'Formira zaštitni sloj koji štiti kožu od spoljnih iritacija',
    'Bez parabena, veštačkih boja i mirisa',
  ],
  quote:
    'Nikada nisam mislila da ću naći olakšanje za moj ekcem dok nisam probala ovaj melem. Promene su bile vidljive već nakon nekoliko dana. Sada mogu slobodno da kažem da je moja koža mnogo zdravija.',
  ingredientsIntro: '**BIOMELIS** melem sadrži pažljivo odabrane **100% prirodne sastojke**, **bez GMO**, čija je efikasnost i bezbednost potvrđena istraživanjima.',
  ingredients: [
    ['Neven', 'umiruje kožu i podstiče njenu regeneraciju'],
    ['Rusa', 'pomaže u čišćenju kože i smanjuje iritacije'],
    ['Žalfija', 'deluje antiseptično i osvežava kožu'],
    ['Hajdučka trava', 'ublažava upale i obnavlja oštećenu kožu'],
    ['Ivanjsko cveće', 'tonira i osvežava kožu'],
    ['Kantarion', 'podstiče regeneraciju i zaceljivanje kože'],
    ['Rastavić', 'jača kožu i poboljšava njenu elastičnost'],
  ],
  registration: EU_LAB,
  checks: CHECKS,
  testimonials: [
    {
      name: 'Ivan',
      age: 50,
      photo: `${P}/Ivan-1.png`,
      text: 'Psorijaza mi je dugo godina otežavala život. Ovaj melem mi je preporučio prijatelj koji je imao iste probleme i veoma sam zadovoljan rezultatima. Moja koža je sada mnogo čistija i smirenija.',
    },
    {
      name: 'Sara',
      age: 35,
      photo: `${P}/Sara-1.png`,
      text: 'Borba sa psorijazom je bila iscrpljujuća. Ovaj melem je promenio sve. Nisam samo ja primetila razliku - i moji prijatelji i porodica su takođe. Toplo preporučujem svima koji se bore sa sličnim problemima.',
    },
  ],
  cards: {
    natural: 'Naša formula sadrži pažljivo odabrane biljne sastojke koji podržavaju borbu protiv ekcema i psorijaze',
    safe: SAFE,
    tested: 'Biljni ekstrakti pažljivo odabrani zbog dokazanih svojstava podrške zdravoj koži',
  },
  unit: 'kutije',
};

const BIOMELIS_SET: LanderContent = {
  ...BIOMELIS,
  hero: [
    { text: 'Prirodna podrška', mark: 'green' },
    { text: 'za kožu sklonu ekcemima i psorijazi' },
    { text: '+ biljna podrška jetri iznutra', mark: 'coral' },
  ],
  benefits: [...BIOMELIS.benefits.slice(1, 4), ...BIOMELIS_KAPI.benefits.slice(0, 2), 'Bez parabena, veštačkih boja i mirisa'],
  ingredientsIntro:
    '**BIOMELIS** melem neguje kožu spolja, a **BIOMELIS KAPI** pružaju biljnu podršku jetri iznutra — **100% prirodni sastojci**, **bez GMO**.',
  registration: MINISTRY('26731/2025'),
  testimonials: [...BIOMELIS.testimonials, ...BIOMELIS_KAPI.testimonials],
  cta: 'Poruči komplet po sniženoj ceni',
};

const BIOWART: LanderContent = {
  hero: [
    { text: 'Prirodna podrška', mark: 'green' },
    { text: 'za zdravu kožu' },
    { text: 'BEZ BRADAVICA', mark: 'coral' },
  ],
  customers: '10,000 +',
  benefits: [
    'Podržava prirodnu otpornost kože',
    'Podstiče regeneraciju tretiranih područja',
    'Nežno hidrira i neguje kožu',
    'Pogodan za sve tipove kože',
  ],
  quote:
    'Nakon dugogodišnje borbe sa virusnim bradavicama, ovaj melem je bio spas. Bradavice su se smanjile, a koža je zacelila bez ožiljaka. Neverovatno sam zahvalna za ovaj efikasan i prirodan tretman.',
  ingredientsIntro: '**BIOWART** melem sadrži pažljivo odabrane **100% prirodne sastojke**, **bez GMO**, čija je efikasnost i bezbednost potvrđena istraživanjima.',
  ingredientsLead: 'Ovaj sveobuhvatni prirodni tretman može pružiti brze i dugotrajne efekte zahvaljujući:',
  ingredients: [
    [null, 'Optimalnoj kombinaciji biljnih ekstrakata sa proverenim delovanjem'],
    [null, 'Naprednoj formuli jednostavnoj za svakodnevnu primenu'],
    [null, 'Aktivnim sastojcima koji podržavaju zdravlje kože i njenu regeneraciju'],
  ],
  checks: ['Sigurna i jednostavna primena', 'Formulacija bazirana na prirodnim sastojcima', 'Pogodno za sve tipove kože'],
  testimonials: [
    {
      name: 'Mila',
      age: 34,
      photo: `${P}/2024-03-21_231311.png`,
      text: 'Nakon dugogodišnje borbe sa virusnim bradavicama, ovaj melem je bio spas. Bradavice su se smanjile, a koža je zacelila bez ožiljaka. Neverovatno sam zahvalna za ovaj efikasan i prirodan tretman.',
    },
    {
      name: 'Jovana',
      age: 32,
      photo: `${P}/2024-03-21_231402.png`,
      text: 'Oduševljena sam brzinom i efikasnošću ovog melema. Virusne bradavice su mi predstavljale veliki problem, ali su se povukle nakon redovne upotrebe melema. Koža mi je sada čista i zdrava.',
    },
  ],
  cards: {
    natural: 'Naša formula sadrži pažljivo odabrane biljne sastojke koji podržavaju zdrav izgled kože na prirodan način.',
    safe: 'Blaga i sigurna formula pogodna za sve tipove kože, bez agresivnih hemikalija.',
    tested: 'Kombinacija naučno potvrđenih biljnih ekstrakata koji neguju i štite kožu uz dugoročne benefite.',
  },
  unit: 'kutije',
};

const LANDERS: Record<string, LanderContent> = {
  biomelis_kapi: BIOMELIS_KAPI,
  immunis_kapi: IMMUNIS_KAPI,
  bioroid_kapi: BIOROID_KAPI,
  bioroid_set: BIOROID_SET,
  bioroid: BIOROID,
  fungomax: FUNGOMAX,
  fungel: FUNGEL,
  fungel_fungomax_set: FUNGEL_FUNGOMAX,
  fungel_fungomax_gratis: FUNGEL_FUNGOMAX,
  biomelis: BIOMELIS,
  biomelis_set: BIOMELIS_SET,
  biowart: BIOWART,
  biowart_immunis_gratis: BIOWART,
};

export function getLanderContent(productId: string): LanderContent | null {
  return LANDERS[productId] ?? null;
}
