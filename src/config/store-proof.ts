/**
 * Dokazi i poverenje za prodajne stranice — preneto sa starog sajta dermotin.rs
 * (checkouts/*), po izričitoj odluci vlasnika (2026-10-27): broj kupaca i recenzija,
 * svedočanstva, garancija povraćaja novca, upis u bazu Ministarstva zdravlja,
 * laboratorijski izveštaj i snimci pravih komentara kupaca.
 *
 * Ključ je product.id (isti u svim lokalima). Tekstovi su sa srpskog sajta.
 */
import { REVIEW_SHOTS } from './review-shots';

export interface Testimonial {
  name: string;
  age?: number;
  city?: string;
  text: string;
}

export interface Registration {
  /** ministry = upis dodatka ishrani u bazu Ministarstva zdravlja RS; lab = kozmetika, laboratorijska analiza */
  kind: 'ministry' | 'lab';
  number: string;
  date: string;
}

export interface ProductProof {
  /** „2 godine i 30.000+ zadovoljnih kupaca“ — isti broj na celom sajtu (SITE_CUSTOMERS) */
  customers: string;
  years: number;
  /** „Ovo su samo neke od 850+ recenzija“ */
  reviewsCount: string;
  testimonials: Testimonial[];
  /** Jedinica u tekstu garancije: „nakon potrošene bočice/kutije“ */
  guaranteeUnit: 'bočice' | 'kutije';
  registrations: Registration[];
  /** Snimci komentara: [putanja, širina, visina] */
  shots: Array<[string, number, number]>;
}

const MINISTRY = {
  biomelis_kapi: { kind: 'ministry', number: '26731/2025', date: '25.03.2025.' },
  immunis_kapi: { kind: 'ministry', number: '26511/2025', date: '25.03.2025.' },
  bioroid_kapi: { kind: 'ministry', number: '26517/2025', date: '25.03.2025.' },
} satisfies Record<string, Registration>;

const FUNGOMAX_LAB: Registration = { kind: 'lab', number: 'ID-57155/2025', date: '25.06.2025.' };

const T = {
  biomelisKapi: [
    {
      name: 'Nemanja',
      age: 42,
      text: 'Godinama sam tražio nešto što će prirodno podržati moju jetru, bez hemije. Ove kapi su mi prijale, probava mi je bolja, a osećam se lakše i bistrije tokom dana.',
    },
    {
      name: 'Milica',
      age: 36,
      text: 'BIOMELIS mi je pomogao da se rešim konstantnog osećaja nadutosti i umora posle obroka. Već posle nekoliko dana korišćenja, stomak mi je bio ravniji, a energija primetno bolja.',
    },
    {
      name: 'Kupac BIOMELIS kapi',
      text: 'Nakon jela više ne osećam onaj balon u stomaku. Osećam se lakše i imam više energije. Odlična podrška za jetru.',
    },
  ],
  immunis: [
    {
      name: 'Kupac IMMUNIS kapi',
      text: 'IMMUNIS mi je postao deo jutarnje rutine. Imam više energije, lakše izdržim dan i nekako se ređe zadržim u onim tipičnim sezonskim prehladama.',
    },
  ],
  bioroidKapi: [
    {
      name: 'Kupac BIOROID kapi',
      text: 'Nakon više pokušaja sa kremama, konačno nešto što deluje iznutra. Osetio sam olakšanje već nakon nekoliko dana.',
    },
  ],
  bioroidSet: [
    {
      name: 'Kupac BIOROID seta',
      text: 'Imala sam jake bolove pri sedenju, svrab i povremeno krvarenje zbog hemoroida. Uzela sam komplet – kapi i melem – i već posle par dana osetila olakšanje. Melem trenutno smiri peckanje, a kapi su mi pomogle da se pritisak iznutra smanji. Posle dve nedelje gotovo da nemam simptome. Sve je prirodno i nije mi izazvalo nikakve nuspojave. Preporučujem svakome ko želi stvarno rešenje bez hemije.',
    },
  ],
  bioroid: [
    {
      name: 'Jelena',
      age: 37,
      city: 'Bor',
      text: 'Isprobala sam mnogo proizvoda, ali tek je BIOROID melem doneo pravo olakšanje. Nakon redovne upotrebe koža mi je potpuno oporavljena, a nelagodnosti su gotovo nestale. Preporučila bih ga svima koji imaju slične probleme.',
    },
    {
      name: 'Marko',
      age: 46,
      city: 'Batajnica',
      text: 'Nakon samo nedelju dana korišćenja BIOROID melema, osećam se kao potpuno nova osoba! Iritacije su nestale, svakodnevni problemi smanjeni, a konačno mogu normalno da funkcionišem bez nelagodnosti. Ovaj proizvod je definitivno opravdao moja očekivanja i ne planiram da prestanem sa korišćenjem.',
    },
    {
      name: 'Dragica',
      age: 57,
      city: 'Niš',
      text: 'Već nakon nekoliko dana osećala sam veliko poboljšanje. Koristim ga svakodnevno i stanje se drastično popravilo. Odličan proizvod koji zaista vredi probati, svima ga toplo preporučujem!',
    },
  ],
  biomelis: [
    {
      name: 'Milena',
      age: 28,
      city: 'Zemun',
      text: 'Nikada nisam mislila da ću naći olakšanje za moj ekcem dok nisam probala ovaj melem. Promene su bile vidljive već nakon nekoliko dana. Sada mogu slobodno da kažem da je moja koža mnogo zdravija.',
    },
    {
      name: 'Ivan',
      age: 50,
      city: 'Kikinda',
      text: 'Psorijaza mi je dugo godina otežavala život. Ovaj melem mi je preporučio prijatelj koji je imao iste probleme i veoma sam zadovoljan rezultatima. Moja koža je sada mnogo čistija i smirenija.',
    },
    {
      name: 'Sara',
      age: 35,
      city: 'Beograd',
      text: 'Borba sa psorijazom je bila iscrpljujuća. Ovaj melem je promenio sve. Nisam samo ja primetila razliku - i moji prijatelji i porodica su takođe. Toplo preporučujem svima koji se bore sa sličnim problemima.',
    },
  ],
  fungel: [
    {
      name: 'Dragan',
      age: 50,
      text: 'Godinama sam se mučio sa upornom gljivičnom infekcijom na stopalima, koja mi je stvarala veliku nelagodu. Otkako sam počeo da koristim Fungel, moji problemi su se drastično smanjili. Krema je veoma efikasna, lako se nanosi i ne ostavlja masne tragove.',
    },
    {
      name: 'Marko',
      age: 35,
      text: 'Nakon meseci borbe sa gljivičnom infekcijom na noktima, konačno sam pronašao rešenje u Fungel kremi. Već posle nekoliko dana upotrebe, primetio sam značajno poboljšanje. Infekcija se povukla, a moji nokti izgledaju zdravije nego ikada. Preporučujem svima!',
    },
    {
      name: 'Jelena',
      age: 37,
      text: 'Kao neko ko redovno ide na trčanje, često sam imala problema sa gljivicama na nogama. Probala sam razne proizvode, ali Fungel je jedini koji je dao trajne rezultate. Osim što je efikasan, veoma mi se dopada i što je krema lagana i brzo se upija. Definitivno 5 zvezdica od mene!',
    },
  ],
  fungomax: [
    {
      name: 'Kupac FUNGOMAX seruma',
      text: 'Godinama sam se mučio sa upornom gljivičnom infekcijom na stopalima, koja mi je stvarala veliku nelagodu. Otkako sam počeo da koristim Fungomax, moji problemi su se drastično smanjili. Serum je veoma efikasan, lako se nanosi i ne ostavlja masne tragove.',
    },
  ],
  biowart: [
    {
      name: 'Mila',
      age: 34,
      text: 'Nakon dugogodišnje borbe sa virusnim bradavicama, ovaj melem je bio spas. Bradavice su se smanjile, a koža je zacelila bez ožiljaka. Neverovatno sam zahvalna za ovaj efikasan i prirodan tretman.',
    },
    {
      name: 'Jovana',
      age: 32,
      text: 'Oduševljena sam brzinom i efikasnošću ovog melema. Virusne bradavice su mi predstavljale veliki problem, ali su se povukle nakon redovne upotrebe melema. Koža mi je sada čista i zdrava.',
    },
    {
      name: 'Milica',
      age: 48,
      text: 'Isprobala sam razne proizvode, ali ništa nije delovalo kao ovaj melem. Virusne bradavice su nestale, a moja koža je opet glatka i zdrava. Preporučujem svima koji imaju slične probleme.',
    },
  ],
} satisfies Record<string, Testimonial[]>;

const shots = (...folders: string[]) => folders.flatMap((folder) => REVIEW_SHOTS[folder] ?? []);

/** Broj zadovoljnih kupaca — jedan za ceo sajt (odluka vlasnika, 2026-10-28). */
export const SITE_CUSTOMERS = '30.000+';

const base = { customers: SITE_CUSTOMERS, years: 2, reviewsCount: '850+', guaranteeUnit: 'bočice' as const };

const PROOF: Record<string, ProductProof> = {
  biomelis_kapi: { ...base, testimonials: T.biomelisKapi, registrations: [MINISTRY.biomelis_kapi], shots: shots('biomelis-kapi', 'mixed-biomelis-family') },
  immunis_kapi: { ...base, testimonials: T.immunis, registrations: [MINISTRY.immunis_kapi], shots: shots('immunis-kapi', 'mixed-dermotin-pack') },
  bioroid_kapi: { ...base, testimonials: T.bioroidKapi, registrations: [MINISTRY.bioroid_kapi], shots: shots('mixed-dermotin-pack') },
  bioroid_set: {
    ...base,
    testimonials: [...T.bioroidSet, ...T.bioroid, ...T.bioroidKapi],
    registrations: [MINISTRY.bioroid_kapi],
    shots: shots('mixed-dermotin-pack'),
  },
  bioroid: { ...base, guaranteeUnit: 'kutije', testimonials: T.bioroid, registrations: [], shots: shots('mixed-dermotin-pack') },
  biomelis: { ...base, guaranteeUnit: 'kutije', testimonials: T.biomelis, registrations: [], shots: shots('biomelis', 'mixed-biomelis-family') },
  biomelis_set: {
    ...base,
    testimonials: [...T.biomelis, ...T.biomelisKapi],
    registrations: [MINISTRY.biomelis_kapi],
    shots: shots('biomelis', 'biomelis-kapi', 'mixed-biomelis-family'),
  },
  fungel: { ...base, guaranteeUnit: 'kutije', testimonials: T.fungel, registrations: [], shots: shots('fungel') },
  fungomax: { ...base, testimonials: T.fungomax, registrations: [FUNGOMAX_LAB], shots: shots('fungel') },
  fungel_fungomax_set: { ...base, testimonials: [...T.fungel, ...T.fungomax], registrations: [FUNGOMAX_LAB], shots: shots('fungel') },
  biowart: { ...base, guaranteeUnit: 'kutije', testimonials: T.biowart, registrations: [], shots: shots('biowart') },
  biowart_immunis_gratis: {
    ...base,
    guaranteeUnit: 'kutije',
    testimonials: [...T.biowart, ...T.immunis],
    registrations: [MINISTRY.immunis_kapi],
    shots: shots('biowart', 'immunis-kapi'),
  },
};
PROOF.fungel_fungomax_gratis = PROOF.fungel_fungomax_set;

/** Za početnu: svi komentari, izmešani po proizvodima */
export const STORE_PROOF = {
  customers: SITE_CUSTOMERS,
  years: 2,
  reviewsCount: '850+',
  testimonials: [T.fungel[0], T.biomelis[0], T.biowart[1], T.biomelisKapi[0], T.immunis[0], T.bioroid[2]],
  shots: [
    ...shots('fungel').slice(0, 4),
    ...shots('biomelis').slice(0, 4),
    ...shots('biowart').slice(0, 3),
    ...shots('mixed-dermotin-pack'),
    ...shots('biomelis-kapi').slice(0, 2),
  ],
};

export function getProductProof(productId: string): ProductProof | null {
  return PROOF[productId] ?? null;
}
