import { Product } from '../../types';

export const PRODUCTS: Record<string, Product> = {
  fungel: {
    id: 'fungel',
    name: 'FUNGEL',
    description: 'Namijenjena borbi protiv gljivičnih infekcija na stopalima i noktima. Pomaže u smanjenju neugodnih simptoma kao što su zadebljali i žuti nokti, svrbež, crvenilo i ljuštenje kože. Redovitom uporabom doprinosi zdravijem izgledu kože i noktiju, sprječavajući ponovno širenje infekcije.',
    shortDescription: 'Blistavi nokti i koža stopala',
    purpose: 'Pomaže problematičnoj koži i noktima u borbi protiv gljivičnih infekcija',
    category: 'skincare',
    images: {
      main: '/images/products/fungel/fungel-old-product-image.png',
      gallery: [
        '/images/products/fungel/fungel-box-only.png',
        '/images/products/fungel/fungel-open-bottle.png',
        '/images/products/fungel/fungel-box-and-product-mockup.png'
      ],
      thumbnail: '/images/products/fungel/fungel-box-only.png',
      fallback: '/images/products/fungel/fungel-box-and-product-mockup.png'
    },
    variants: [
      {
        id: 'fungel-1pak',
        sku: 'FUNGEL',
        name: '1 PAKOVANJE (50ml)',
        size: 'Okvirno 2 tjedna upotrebe',
        quantity: 1,
        price: 20.9,
        currency: 'EUR',
        discountPrice: 17.9,
        isDefault: true
      },
      {
        id: 'fungel-2pak',
        sku: 'FUNGEL',
        name: '2 PAKOVANJA (100ml)',
        size: 'Okvirno mjesec dana upotrebe',
        quantity: 2,
        price: 40.9,
        currency: 'EUR',
        discountPrice: 30.9
      },
      {
        id: 'fungel-3pak',
        sku: 'FUNGEL',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 2 mjeseca upotrebe',
        quantity: 3,
        price: 60.9,
        currency: 'EUR',
        discountPrice: 40.9
      }
    ],
    benefits: [
      'Podržava njegu problematične kože',
      'Smiruje iritacije i podržava obnovu oštećene kože',
      'Pruža hidrataciju i pomaže u održavanju zdravlja kože',
      'Pogodan za svakodnevnu upotrebu, čak i na osjetljivoj koži',
      'Bez parabena, umjetnih boja i mirisa',
      'Idealan za prirodnu i bezbednu njegu kože',
      'Leave-on formula - ne ispira se, djeluje kontinuirano',
      'Sadrži 6 ljekovitih biljaka i 5 eteričnih ulja'
    ],
    ingredients: [
      // Key active ingredients first
      'calendula-extract',
      'chelidonium-extract', 
      'salvia-leaf-extract',
      'echinacea-extract',
      'galium-extract',
      'hypericum-extract',
      'tea-tree-oil',
      'oregano-oil',
      'lavender-oil',
      'sage-oil',
      'eucalyptus-oil',
      'panthenol',
      'urea',
      'sweet-almond-oil',
      'vitamin-e',
      'vitamin-a',
      // Base components
      'aqua',
      'alcohol',
      'glycerin',
      'castor-oil',
      'stearic-acid',
      'cetyl-alcohol',
      'glyceryl-stearate',
      'synthetic-beeswax',
      // Other functional ingredients
      'triethanolamine',
      'carbomer',
      // Preservatives
      'phenoxyethanol',
      'ethylhexylglycerin',
      'sodium-benzoate',
      'potassium-sorbate'
    ],
    usage: 'Nanositi 2 puta dnevno na problematične delove kože ili noktiju. Ne ispirati nakon nanošenja. Sadržaj: 50ml (dovoljno za 2 tjedna redovne upotrebe).',
    usageSteps: [
      'Očistite i osušite pogođeno mesto',
      'Nanesite tanak sloj FUNGEL-a na problematičnu kožu ili nokti',
      'Nežno umasirajte dok se potpuno ne upije',
      'Koristite 2 puta dnevno (ujutru i uveče)',
      'Ne ispirati nakon nanošenja - ostaviti da djeluje',
      'Redovno koristiti najmanje 2-4 tjedna za najbolje rezultate'
    ],
    warnings: [
      'Samo za spoljašnju upotrebu',
      'Oprati ruke nakon upotrebe',
      'Ne koristiti na ranama',
      'Izbegavati kontakt sa očima',
      'Prestati sa upotrebom ako dođe do iritacije',
      'Čuvati na hladnom, suhom mjestu',
      'Sadrži prirodne alergene iz eteričnih ulja',
      'Preporučuje se zaštita od sunca tijekom upotrebe'
    ],
    slug: 'fungel',
    alternativeSlugs: ['fungel-promo', 'antifungal-gel', 'gljivice-stopala'],
    availableCountries: ['hr'],
    seoTitle: 'FUNGEL - Emulzija za kožu sa 6 biljnih ekstrakata + 5 eteričnih ulja | DERMOTIN',
    seoDescription: 'FUNGEL od DERMOTIN brenda kombinuje 6 biljnih ekstrakata sa 5 eteričnih ulja (čajno drvo, origano). Obogaćena panthenolom, vitaminima A&E. Prirodna nega problematične kože i noktiju. 50ml.',
    urgencyElements: {
      limitedStock: 47,
      limitedTime: '24h',
      socialProof: {
        recentPurchases: 127,
        timeFrame: 'poslednja 24h'
      }
    },
    productFAQ: [
      {
        question: "Kako se koristi FUNGEL?",
        answer: "Vrlo jednostavno! Nanositi 2 puta dnevno na problemske dijelove kože ili noktiju. Ne treba ispirati - samo ostaviti da se upije. Jedna tubica od 50ml traje oko 2 tjedna pri redovitoj upotrebi.",
        category: "usage"
      },
      {
        question: "Kada ću vidjeti prve rezultate?",
        answer: "Budite realni - pravi rezultati se vide nakon 2-4 tjedna redovite upotrebe. Svaka koža je drugačija, pa budite strpljivi i ne očekujte čuda preko noći!",
        category: "effects"
      },
      {
        question: "Je li FUNGEL prirodan?",
        answer: "Da! Prirodna formula koja podržava njegu problematične kože. Sadrži 6 ljekovitih biljaka plus 5 eteričnih ulja. Bez parabena, umjetnih boja i mirisa - idealan za prirodnu i sigurnu njegu.",
        category: "ingredients"
      },
      {
        question: "Je li siguran za svakodnevnu upotrebu?",
        answer: "Apsolutno! FUNGEL je testiran i odobren za svakodnevnu upotrebu. Prirodni sastojci su blagi prema koži, a formula je pH balansirana.",
        category: "safety"
      },
      {
        question: "Mogu li ga koristiti ako imam osjetljivu kožu?",
        answer: "FUNGEL sadrži prirodne sastojke, ali ako imate vrlo osjetljivu kožu, preporučujemo da prvo testirate na maloj površini. Ako osjećate bilo kakvu iritaciju, prestanite s upotrebom.",
        category: "safety"
      },
      {
        question: "Kako čuvati FUNGEL?",
        answer: "Čuvajte na hladnom, suhom mjestu, daleko od djece. Zatvorite dobro nakon upotrebe. Rok trajanja je označen na pakovanju.",
        category: "storage"
      },
      {
        question: "Mogu li koristiti FUNGEL s drugim kremama?",
        answer: "Možete, ali sačekajte da se FUNGEL upije prije nanošenja drugih proizvoda. Takođerr, preporučujemo zaštitu od sunca tijekom korištenja.",
        category: "usage"
      },
      {
        question: "Što čini FUNGEL tako učinkovitim?",
        answer: "Prirodna formula koja podržava njegu problematične kože. Smiruje iritacije, podržava obnovu kože i pruža dugotrajnu hidrataciju. Sve prirodno, bez štetnih kemikalija!",
        category: "ingredients"
      }
    ],
    testimonials: [
      {
        id: "t1",
        name: "Marija S.",
        city: "Zagreb",
        rating: 5,
        text: "Imala sam problem s gljivicama na stopalima već mjesecima. FUNGEL mi je pomogao za samo 10 dana! Krema se lako nanosi, ne maže i ima ugodan miris. Konačno mogu nositi otvorene cipele bez stida.",
        verified: true,
        productUsed: "FUNGEL",
        dateAdded: "2024-12-15",
        featured: true,
        likes: 42
      },
      {
        id: "t2", 
        name: "Stefan M.",
        city: "Split",
        rating: 5,
        text: "Kao sportaš, često imam problema s kožom zbog znojenja. FUNGEL s čajnim drvetom je bio prava stvar - prirodan, učinkovit i bez kemikalija. Koristim ga već 2 mjeseca i rezultati su fantastični.",
        verified: true,
        productUsed: "FUNGEL",
        dateAdded: "2024-12-10",
        featured: true,
        likes: 38
      },
      {
        id: "t3",
        name: "Ana P.",
        city: "Rijeka", 
        rating: 5,
        text: "Moja kći je imala problematičnu kožu oko noktiju. Probali smo mnoge proizvode, ali FUNGEL je jedini koji je stvarno pomogao. Prirodni sastojci su mi bili važni jer je riječ o djetetu. Preporučujem!",
        verified: true,
        productUsed: "FUNGEL",
        dateAdded: "2024-12-08",
        featured: true,
        likes: 35
      },
      {
        id: "t4",
        name: "Petar J.",
        city: "Osijek",
        rating: 4,
        text: "Dobar proizvod, radi postupno ali sigurno. Trebalo mi je oko 3 tjedna da vidim punu promjenu, ali vrijedi čekanja. Cijena je prihvatljiva za kvalitetu koju dobivate.",
        verified: true,
        productUsed: "FUNGEL", 
        dateAdded: "2024-12-05",
        featured: false,
        likes: 28
      },
      {
        id: "t5",
        name: "Milica R.",
        city: "Zadar",
        rating: 5,
        text: "Radim u vlažnoj sredini i često imam problema s kožom na rukama. FUNGEL mi nije samo riješio problem, već i učinio kožu mekšom i zdravijom. Sada ga koristim preventivno.",
        verified: true,
        productUsed: "FUNGEL",
        dateAdded: "2024-12-03",
        featured: true,
        likes: 31
      },
      {
        id: "t6",
        name: "Aleksandar T.",
        city: "Pula", 
        rating: 5,
        text: "Skeptičan sam bio prema prirodnim proizvodima, ali FUNGEL me je pozitivno iznenadio. Brzo djeluje, nema neželjenih učinaka i stvarno pomaže. Već sam preporučio trojici prijatelja.",
        verified: true,
        productUsed: "FUNGEL",
        dateAdded: "2024-12-01",
        featured: false,
        likes: 25
      },
      {
        id: "t7",
        name: "Jovana M.",
        city: "Šibenik",
        rating: 5,
        text: "Kao kozmetolog, često preporučujem FUNGEL svojim klijentima. Prirodni sastojci poput nevena i čajnog drveta čine čuda za problematičnu kožu. Profesionalno i učinkovito rješenje.",
        verified: true,
        productUsed: "FUNGEL",
        dateAdded: "2024-11-28",
        featured: true,
        likes: 39
      },
      {
        id: "t8",
        name: "Nikola D.",
        city: "Karlovac",
        rating: 4,
        text: "Koristim FUNGEL već mjesec dana. Rezultati su vidljivi, koža je zdravija i nema više iritacije. Jedino što bih volio da pakiranje bude veće jer se brzo potroši.",
        verified: true,
        productUsed: "FUNGEL",
        dateAdded: "2024-11-25",
        featured: false,
        likes: 22
      }
    ]
  },

  biomelis: {
    id: 'biomelis',
    name: 'BIOMELIS',
    description: 'Ublažava tegobe izazvane ekcemima i psorijazom. Njegova biljna formula njeguje kožu, smanjuje upalu i osjećaj svrbeža. Pogodan je za svakodnevnu upotrebu i doprinosi obnavljanju prirodne barijere kože.',
    shortDescription: 'Umirujuća nega za osjetljivu kožu',
    purpose: 'Pomaže osjetljivoj koži u borbi protiv ekcema i psorijaze',
    category: 'skincare',
    images: {
      main: '/images/products/biomelis/biomelis-old-product-image.png',
      gallery: [
        '/images/products/biomelis/biomelis-box-only.png',
        '/images/products/biomelis/biomelis-open-bottle.png',
        '/images/products/biomelis/biomelis-box-and-product-mockup.png'
      ],
      thumbnail: '/images/products/biomelis/biomelis-box-only.png',
      fallback: '/images/products/biomelis/biomelis-box-and-product-mockup.png'
    },
    variants: [
      {
        id: 'biomelis-1pak',
        sku: 'BIOMELIS',
        name: '1 PAKOVANJE (50ml)',
        size: 'Okvirno 2 tjedna upotrebe',
        quantity: 1,
        price: 20.9,
        currency: 'EUR',
        discountPrice: 17.9,
        isDefault: true
      },
      {
        id: 'biomelis-2pak',
        sku: 'BIOMELIS',
        name: '2 PAKOVANJA (100ml)',
        size: 'Okvirno mjesec dana upotrebe',
        quantity: 2,
        price: 40.9,
        currency: 'EUR',
        discountPrice: 30.9
      },
      {
        id: 'biomelis-3pak',
        sku: 'BIOMELIS',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 2 mjeseca upotrebe',
        quantity: 3,
        price: 60.9,
        currency: 'EUR',
        discountPrice: 40.9
      }
    ],
    benefits: [
      'Podržava njegu osjetljive kože',
      'Smiruje crvenilo, svrbež i iritacije',
      'Podržava regeneraciju oštećene kože',
      'Pruža zaštitu od spoljašnjih uticaja i dugotrajnu hidrataciju',
      'Pogodan za svakodnevnu upotrebu, čak i za najosjetljiviju kožu',
      'Bez parabena, umjetnih boja i mirisa',
      'Idealan izbor za prirodnu i bezbednu njegu kože',
      'Sadrži 8 ljekovitih biljaka i 5 eteričnih ulja'
    ],
    ingredients: [
      // Herbal extracts - 8 medicinal plants
      'calendula-extract',
      'chelidonium-extract',
      'salvia-leaf-extract',
      'achillea-extract',
      'equisetum-extract',
      'galium-extract',
      'hypericum-extract',
      'quercus-extract',
      // Essential oils - 5 therapeutic oils
      'sage-oil',
      'eucalyptus-oil',
      'lavender-oil',
      'rosemary-oil',
      'thyme-oil',
      // Active compounds
      'panthenol',
      'vitamin-e',
      'vitamin-a',
      'castor-oil',
      'sweet-almond-oil',
      'urea',
      // Base components
      'aqua',
      'alcohol',
      'glycerin',
      'stearic-acid',
      'cetyl-alcohol',
      'glyceryl-stearate',
      'synthetic-beeswax',
      // Other functional ingredients
      'triethanolamine',
      'carbomer',
      // Preservatives
      'phenoxyethanol',
      'ethylhexylglycerin',
      'sodium-benzoate',
      'potassium-sorbate'
    ],
    usage: 'Nanositi 2 puta dnevno na pogođene delove kože i nežno masirati. Ne ispirati nakon nanošenja. Sadržaj: 50ml (dovoljno za 2 tjedna redovne upotrebe).',
    usageSteps: [
      'Očistite kožu blagim sapunom i osušite',
      'Nanesite malu količinu BIOMELIS-a na pogođeno mesto',
      'Nežno umasirajte kružnim pokretima dok se ne upije',
      'Koristite 2-3 puta dnevno ili prema potrebi',
      'Za najbolje rezultate koristiti redovno 3-4 tjedna',
      'Može se koristiti i preventivno na osjetljivim delovima kože'
    ],
    warnings: [
      'Samo za spoljašnju upotrebu',
      'Nanositi samo na zdravu kožu',
      'Izbegavati kontakt sa očima',
      'U slučaju kontakta sa očima isprati vodom',
      'Prestati sa upotrebom ako dođe do iritacije',
      'Čuvati na hladnom, suhom mjestu',
      'Sadrži prirodne alergene iz eteričnih ulja (Limonene, Linalool)',
      'U slučaju iritacije konsultovati lekara'
    ],
    slug: 'biomelis',
    alternativeSlugs: ['biomelis-melem', 'ekcem-psorijaza', 'osjetljiva-koza'],
    availableCountries: ['hr'],
    seoTitle: 'BIOMELIS - Prirodna podrška protiv ekcema i psorijaze | DERMOTIN',
    seoDescription: 'BIOMELIS od DERMOTIN brenda - prirodna formula koja podržava njegu osjetljive kože. Smiruje crvenilo, svrbež i iritacije. 8 biljnih ekstrakata, bez parabena. 50ml.',
    urgencyElements: {
      limitedStock: 32,
      limitedTime: '24h',
      socialProof: {
        recentPurchases: 89,
        timeFrame: 'poslednja 24h'
      }
    },
    productFAQ: [
      {
        question: "Kako se koristi BIOMELIS?",
        answer: "Vrlo jednostavno! Nanositi 2 puta dnevno na očišćenu kožu i nežno masirati. Ne treba da se ispira - samo ostaviti da se upije. Jedna tuba od 50ml traje oko 2 tjedna pri redovnoj upotrebi.",
        category: "usage"
      },
      {
        question: "Kada ću vidjeti prve rezultate?",
        answer: "Budite realni - pravi rezultati se vide nakon 2-4 tjedna redovite upotrebe. Svaka koža je drugačija, pa budite strpljivi i ne očekujte čuda preko noći!",
        category: "effects"
      },
      {
        question: "Je li BIOMELIS prirodan?",
        answer: "Da! Prirodna formula koja može pomoći u negi osjetljive kože. Sadrži 8 ljekovitih biljaka plus 5 eteričnih ulja. Bez parabena, umjetnih boja i mirisa - idealan za prirodnu i bezbednu njegu.",
        category: "ingredients"
      },
      {
        question: "Je li siguran za osjetljivu kožu?",
        answer: "Apsolutno! BIOMELIS je kreiran za najosjetljivu kožu. Pogodan za svakodnevnu upotrebu, čak i za najdelikatniju kožu. Bez parabena i umjetnih dodataka.",
        category: "safety"
      },
      {
        question: "Pomaže li kod osjetljive kože?",
        answer: "BIOMELIS podržava njegu osjetljive kože. Smiruje crvenilo, svrbež i iritacije, dok podržava regeneraciju oštećene kože.",
        category: "effects"
      },
      {
        question: "Kako čuvati BIOMELIS?",
        answer: "Čuvajte na hladnom, suhom mjestu, daleko od djece. Zatvorite dobro nakon upotrebe. Rok trajanja je označen na pakovanju.",
        category: "storage"
      },
      {
        question: "Da li mogu da koristim BIOMELIS sa drugim proizvodima?",
        answer: "Možete, ali sačekajte da se BIOMELIS upije prije nanošenja drugih proizvoda. Zbog prirodnih sastojaka, preporučujemo da testirate na maloj površini prvo.",
        category: "usage"
      },
      {
        question: "Što čini BIOMELIS posebnim?",
        answer: "Prirodna formula koja može da smiri crvenilo, svrbež i iritacije. Pruža zaštitu od spoljašnjih uticaja i dugotrajnu hidrataciju. Bez parabena i umjetnih dodataka - čisto prirodno!",
        category: "ingredients"
      }
    ],
    testimonials: [
      {
        id: "b1",
        name: "Jelena M.",
        city: "Zagreb",
        rating: 5,
        text: "BIOMELIS mi je spasio kožu! Imala sam kronične probleme s ekcemom i ništa nije pomagalo. Nakon 3 tjedna korištenja, koža mi je konačno mirna i zdrava. Prirodni sastojci su ono što sam tražila.",
        verified: true,
        productUsed: "BIOMELIS",
        dateAdded: "2024-12-14",
        featured: true,
        likes: 45
      },
      {
        id: "b2",
        name: "Miloš P.",
        city: "Split",
        rating: 5,
        text: "Kao netko tko se bori s psorijazom godinama, mogu reći da je BIOMELIS najbolji proizvod koji sam probao. Smiruje svrbež i crvenilo, a koža postaje mekša. Preporučujem svima!",
        verified: true,
        productUsed: "BIOMELIS",
        dateAdded: "2024-12-11",
        featured: true,
        likes: 41
      },
      {
        id: "b3",
        name: "Dragana S.",
        city: "Osijek",
        rating: 5,
        text: "Moj sin ima atopijski dermatitis i BIOMELIS je jedini proizvod koji mu stvarno pomaže. Prirodan je, bez kemikalija, a rezultati su vidljivi već nakon tjedan dana korištenja.",
        verified: true,
        productUsed: "BIOMELIS",
        dateAdded: "2024-12-09",
        featured: true,
        likes: 37
      },
      {
        id: "b4",
        name: "Nenad J.",
        city: "Rijeka",
        rating: 4,
        text: "Koristim BIOMELIS već mjesec dana za problematičnu kožu na rukama. Vidim poboljšanje, manje je iritacije i crvenila. Trebalo mi je malo vremena, ali vrijedi.",
        verified: true,
        productUsed: "BIOMELIS",
        dateAdded: "2024-12-06",
        featured: false,
        likes: 29
      },
      {
        id: "b5",
        name: "Marija K.",
        city: "Zadar",
        rating: 5,
        text: "Imala sam osjetljivu kožu koja je reagirala na sve. BIOMELIS je bio blag i učinkovit - konačno proizvod koji ne izaziva dodatne iritacije. Koža mi je sada zdrava i hidratizirana.",
        verified: true,
        productUsed: "BIOMELIS",
        dateAdded: "2024-12-04",
        featured: true,
        likes: 33
      },
      {
        id: "b6",
        name: "Stefan R.",
        city: "Varaždin",
        rating: 5,
        text: "Kao dermatolog, često preporučujem BIOMELIS pacijentima s osjetljivom kožom. Prirodni sastojci poput nevena i lavande čine čuda. Profesionalno i učinkovito rješenje za problematičnu kožu.",
        verified: true,
        productUsed: "BIOMELIS",
        dateAdded: "2024-12-01",
        featured: true,
        likes: 40
      },
      {
        id: "b7",
        name: "Ana T.",
        city: "Pula",
        rating: 4,
        text: "Koristim BIOMELIS već 6 tjedana za ekcem na laktovima. Rezultati su postepeni ali sigurni. Koža je manje suva i iritirana. Jedino što bih volela je veće pakiranje.",
        verified: true,
        productUsed: "BIOMELIS",
        dateAdded: "2024-11-28",
        featured: false,
        likes: 26
      },
      {
        id: "b8",
        name: "Milica D.",
        city: "Leskovac",
        rating: 5,
        text: "Moja beba ima vrlo osjetljivu kožu i BIOMELIS je jedini proizvod koji ne izaziva alergijske reakcije. Blag je, prirodan i stvarno pomaže kod crvenih mrlja. Mama preporučuje!",
        verified: true,
        productUsed: "BIOMELIS",
        dateAdded: "2024-11-25",
        featured: true,
        likes: 36
      },
      {
        id: "b9",
        name: "Aleksandar V.",
        city: "Smederevo",
        rating: 5,
        text: "Radim u hemijskoj industriji i često imam problema sa kontaktnim dermatitisom. BIOMELIS mi pomaže da se koža oporavi brže i sprečava dalje iritacije. Odličan proizvod!",
        verified: true,
        productUsed: "BIOMELIS",
        dateAdded: "2024-11-22",
        featured: false,
        likes: 24
      },
      {
        id: "b10",
        name: "Jovana L.",
        city: "Karlovac",
        rating: 5,
        text: "Imala sam seboreični dermatitis na licu i BIOMELIS mi je pomogao da se rešim problema. Koža je sada čista, bez ljuskanja i crvenila. Konačno mogu da izađem bez šminke!",
        verified: true,
        productUsed: "BIOMELIS",
        dateAdded: "2024-11-20",
        featured: true,
        likes: 34
      },
      {
        id: "b11",
        name: "Marko S.",
        city: "Zrenjanin",
        rating: 4,
        text: "Koristim BIOMELIS za psorijazu na koljenima. Vidim poboljšanje nakon mjesec dana - manje je ljuštenja i svrbež je gotovo nestao. Prirodan pristup koji funkcionira.",
        verified: true,
        productUsed: "BIOMELIS",
        dateAdded: "2024-11-18",
        featured: false,
        likes: 27
      },
      {
        id: "b12",
        name: "Tamara M.",
        city: "Užice",
        rating: 5,
        text: "Kao kozmetičar, često vidim probleme sa osjetljivom kožom. BIOMELIS preporučujem klijentima jer je prirodan i učinkovit. Rezultati su vidljivi već nakon 2 tjedna redovne upotrebe.",
        verified: true,
        productUsed: "BIOMELIS",
        dateAdded: "2024-11-15",
        featured: true,
        likes: 38
      },
      {
        id: "b13",
        name: "Petar K.",
        city: "Kraljevo",
        rating: 5,
        text: "Moja žena ima kronični ekcem i probali smo sve. BIOMELIS je konačno donio olakšanje - koža joj je mirna, bez svrbeža i crvenila. Cijela obitelj je zadovoljna rezultatom!",
        verified: true,
        productUsed: "BIOMELIS",
        dateAdded: "2024-11-12",
        featured: false,
        likes: 23
      },
      {
        id: "b14",
        name: "Snežana P.",
        city: "Jagodina",
        rating: 5,
        text: "Radim kao medicinska sestra i često imam problema sa suhom kožom na rukama. BIOMELIS mi pomaže da održavam kožu zdravom i hidratiziranom. Preporučujem kolegama!",
        verified: true,
        productUsed: "BIOMELIS",
        dateAdded: "2024-11-10",
        featured: true,
        likes: 32
      },
      {
        id: "b15",
        name: "Milan J.",
        city: "Prokuplje",
        rating: 4,
        text: "Imam osjetljivu kožu koja reagira na mnoge proizvode. BIOMELIS je bio iznimka - blag, prirodan i učinkovit. Trebalo mi je 3 tjedna da vidim potpunu promjenu, ali vrijedi čekanja.",
        verified: true,
        productUsed: "BIOMELIS",
        dateAdded: "2024-11-08",
        featured: false,
        likes: 21
      }
    ]
  },

  biowart: {
    id: 'biowart',
    name: 'BIOWART',
    description: 'Prirodna pomoć kod uklanjanja virusnih bradavica. Deluje lokalno, ubrzava povlačenje promena i regeneraciju kože. Redovnom primenom smanjuje rizik od ponovnog pojavljivanja bradavica.',
    shortDescription: 'Biljna formula za ciljanu njegu kože',
    purpose: 'Podržava regeneraciju kože pogođene virusnim bradavicama',
    category: 'skincare',
    slug: 'biowart',
    alternativeSlugs: [],
    availableCountries: ['hr'],
    seoTitle: 'BIOWART - Prirodna pomoć protiv virusnih bradavica | DERMOTIN',
    seoDescription: 'BIOWART od DERMOTIN brenda - prirodna formula sa 6 biljnih ekstrakata i 7 eteričnih ulja za njegu kože pogođene virusnim bradavicama. Bez parabena, pogodan za osjetljivu kožu. 50ml.',
    urgencyElements: {
      limitedStock: 15,
      limitedTime: '24h',
      socialProof: {
        recentPurchases: 23,
        timeFrame: 'poslednja 24h'
      }
    },
    images: {
      main: '/images/products/biowart/biowart-old-product-image.png',
      gallery: [
        '/images/products/biowart/biowart-box-only.png',
        '/images/products/biowart/biowart-open-bottle.png',
        '/images/products/biowart/biowart-box-and-product-mockup.png'
      ],
      thumbnail: '/images/products/biowart/biowart-box-only.png',
      fallback: '/images/products/biowart/biowart-box-and-product-mockup.png'
    },
    variants: [
      {
        id: 'biowart-1pak',
        sku: 'BIOWART',
        name: '1 PAKOVANJE (50ml)',
        size: 'Okvirno 2 tjedna upotrebe',
        quantity: 1,
        price: 20.9,
        currency: 'EUR',
        discountPrice: 17.9,
        isDefault: true
      },
      {
        id: 'biowart-2pak',
        sku: 'BIOWART',
        name: '2 PAKOVANJA (100ml)',
        size: 'Okvirno mjesec dana upotrebe',
        quantity: 2,
        price: 40.9,
        currency: 'EUR',
        discountPrice: 30.9
      },
      {
        id: 'biowart-3pak',
        sku: 'BIOWART',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 2 mjeseca upotrebe',
        quantity: 3,
        price: 60.9,
        currency: 'EUR',
        discountPrice: 40.9
      }
    ],
    benefits: [
      'Podržava regeneraciju kože pogođene virusnim bradavicama',
      'Smiruje iritacije i ubrzava zarastanje kože',
      'Pruža zaštitu od spoljašnjih uticaja',
      'Pogodan za svakodnevnu upotrebu, čak i na osjetljivoj koži',
      'Bez parabena, umjetnih boja i mirisa',
      'Idealan za prirodnu i bezbednu njegu kože',
      'Leave-on formula - ne ispira se, djeluje kontinuirano',
      'Sadrži 6 ljekovitih biljaka i 7 eteričnih ulja'
    ],
    ingredients: [
      // Key active ingredients first - based on BIOWART documentation
      'chelidonium-extract', // Rus - primary ingredient for warts (7-8.5%)
      'calendula-extract', // Neven - highest concentration (7-8.5%)
      'achillea-extract', // Hajdučka trava (3-4.5%)
      'salvia-leaf-extract', // Žalfija (3-4.5%)
      'hypericum-extract', // Kantarion (3-4.5%)
      'galium-extract', // Ivanjsko cveće (3-4.5%)
      'quercus-bark-extract', // Hrastova kora (3-4.5%)
      // Essential oils - 7 different oils
      'sage-oil', // Eterično ulje žalfije
      'eucalyptus-oil', // Eterično ulje eukaliptusa
      'peppermint-oil', // Eterično ulje nane
      'clove-oil', // Eterično ulje karanfilića
      'thyme-oil', // Eterično ulje timijana
      'anise-oil', // Eterično ulje anisa
      'lemon-oil', // Eterično ulje limuna
      // Vitamins and nutrients
      'panthenol', // Pro-Vitamin B5 (0.91%)
      'urea', // Urea (0.91%)
      'sweet-almond-oil', // Prunus Amygdalus Dulcis Oil
      'vitamin-e', // Tocopheryl Acetate
      'vitamin-a', // Retinyl Palmitate
      // Base components
      'aqua',
      'stearic-acid',
      'glycerin', // 1.83%
      'castor-oil', // Ricinus Communis Seed Oil
      'cetyl-alcohol',
      'glyceryl-stearate',
      'synthetic-beeswax', // Cera Alba
      // Functional ingredients
      'triethanolamine',
      'carbomer',
      // Preservatives
      'phenoxyethanol',
      'sodium-benzoate',
      'potassium-sorbate'
    ],
    usage: 'Nanositi tanak sloj BIOWART melema na čistu i suvu kožu dva do tri puta dnevno ili po potrebi. Pogodan za svakodnevnu upotrebu. Sadržaj: 50ml.',
    warnings: [
      'Samo za spoljašnju upotrebu',
      'Izbegavati kontakt sa očima',
      'U slučaju preosjetljivosti ili alergijske reakcije, prekinuti upotrebu i konsultovati se sa lekarom',
      'Sadrži alergene: Limonene, Linalool, Eugenol, Citral'
    ],
    productFAQ: [
      {
        question: 'Kako se koristi BIOWART?',
        answer: 'Nanositi tanak sloj BIOWART melema na čistu i suvu kožu dva do tri puta dnevno ili po potrebi. Ne ispira se nakon nanošenja.',
        category: 'usage'
      },
      {
        question: 'Koji su glavni aktivni sastojci u BIOWART proizvodu?',
        answer: 'BIOWART sadrži 6 ljekovitih biljaka (rus, neven, hajdučka trava, žalfija, kantarion, ivanjsko cveće, hrastova kora) i 7 eteričnih ulja (žalfija, eukaliptus, nana, karanfilić, timijan, anis, limun), obogaćen vitaminima A, E i B5.',
        category: 'ingredients'
      },
      {
        question: 'Da li je BIOWART siguran za upotrebu?',
        answer: 'Da, BIOWART je EU-kompatibilan kozmetički proizvod koji je prošao sve potrebne testove sigurnosti. Bez parabena, umjetnih boja i mirisa. Pogodan za svakodnevnu upotrebu.',
        category: 'safety'
      },
      {
        question: 'Za koje tipove kože je pogodan BIOWART?',
        answer: 'BIOWART je pogodan za sve tipove kože, uključujući i osjetljivu kožu. Formula je posebno dizajnirana za njegu kože pogođene virusnim bradavicama.',
        category: 'usage'
      },
      {
        question: 'Kada mogu očekivati rezultate?',
        answer: 'Rezultati mogu biti individualni. Preporučuje se redovna upotreba 2-3 puta dnevno. Za najbolje rezultate, koristiti kontinuirano prema uputstvu.',
        category: 'effects'
      }
    ]
  },

  bioroid: {
    id: 'bioroid',
    name: 'BIOROID',
    description: 'Može da pruža olakšanje kod bola, svrbeža i peckanja izazvanih hemoroidima. Zahvaljujući biljnim ekstraktima pomaže u smanjenju otoka i iritacije. Redovna upotreba doprinosi regeneraciji tkiva i boljoj udobnosti tijekom dana.',
    shortDescription: 'Blaga podrška osjetljivim regijama',
    purpose: 'Pomaže u nezi i zaštiti osjetljive kože analnog područja',
    category: 'skincare',
    slug: 'bioroid',
    alternativeSlugs: [],
    availableCountries: ['hr'],
    seoTitle: 'BIOROID - Prirodna podrška za njegu analne kože | DERMOTIN',
    seoDescription: 'BIOROID od DERMOTIN brenda - prirodna formula sa biljnim ekstraktima za njegu osjetljive kože analnog područja. Smiruje iritacije, podržava regeneraciju. Bez parabena. 50ml.',
    urgencyElements: {
      limitedStock: 12,
      limitedTime: '24h',
      socialProof: {
        recentPurchases: 18,
        timeFrame: 'poslednja 24h'
      }
    },
    images: {
      main: '/images/products/bioroid/bioroid-old-product-image.png',
      gallery: [
        '/images/products/bioroid/bioroid-box-only.png',
        '/images/products/bioroid/bioroid-open-bottle.png',
        '/images/products/bioroid/bioroid-box-and-product-mockup.png'
      ],
      thumbnail: '/images/products/bioroid/bioroid-box-only.png',
      fallback: '/images/products/bioroid/bioroid-box-and-product-mockup.png'
    },
    variants: [
      {
        id: 'bioroid-1pak',
        sku: 'BIOROID',
        name: '1 PAKOVANJE (50ml)',
        size: 'Okvirno 2 tjedna upotrebe',
        quantity: 1,
        price: 25.9,
        currency: 'EUR',
        discountPrice: 17.9,
        isDefault: true
      },
      {
        id: 'bioroid-2pak',
        sku: 'BIOROID',
        name: '2 PAKOVANJA (100ml)',
        size: 'Okvirno mjesec dana upotrebe',
        quantity: 2,
        price: 50.9,
        currency: 'EUR',
        discountPrice: 30.9
      },
      {
        id: 'bioroid-3pak',
        sku: 'BIOROID',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 2 mjeseca upotrebe',
        quantity: 3,
        price: 75.9,
        currency: 'EUR',
        discountPrice: 40.9
      }
    ],
    benefits: [
      'Smiruje osjećaj svrbeža, pečenja i nelagodnosti',
      'Podržava regeneraciju osjetljive kože uz održavanje hidratacije',
      'Stvara nežnu zaštitnu barijeru protiv spoljašnjih faktora',
      'Pogodan za svakodnevnu upotrebu, čak i na osjetljivoj koži',
      'Bez parabena, umjetnih boja i mirisa',
      'Prirodan i siguran izbor za njegu kože',
      'Dugotrajno umirujući i osvežavajući osjećaj',
      'Sadrži pažljivo odabrane biljne ekstrakte i eterična ulja'
    ],
    ingredients: [
      // Key active herbal extracts - based on BIOROID documentation
      'achillea-extract', // Hajdučka trava (Achillea millefolium L.)
      'aesculus-extract', // Divlji kesten (Aesculus hippocastanum L.)
      'calendula-extract', // Neven (Calendula officinalis L.)
      'capsella-extract', // Pastirska torbica (Capsella bursa-pastoris L.)
      'geranium-extract', // Zdravac (Geranium robertianum L.)
      'chamomile-extract', // Kamilica (Chamomilla recutita L.)
      // Vitamins and nutrients
      'panthenol', // Pro-Vitamin B5
      'vitamin-e', // Tocopheryl Acetate
      'vitamin-a', // Retinyl Palmitate
      'sweet-almond-oil', // Prunus amygdalus dulcis oil
      'menthol', // Menthol for cooling effect
      // Essential oils blend
      'lavender-oil', // Lavandula angustifolia oil
      'tea-tree-oil', // Melaleuca alternifolia leaf oil
      'patchouli-oil', // Pogostemon cablin leaf oil
      'clove-oil', // Eugenia caryophyllus leaf oil
      // Base components
      'aqua',
      'alcohol',
      'stearic-acid',
      'glycerin',
      'cetyl-alcohol',
      'glyceryl-stearate',
      'synthetic-beeswax',
      'urea',
      // Functional ingredients
      'triethanolamine',
      'carbomer',
      // Preservatives
      'phenoxyethanol',
      'ethylhexylglycerin',
      'potassium-sorbate',
      // Natural components
      'limonene'
    ],
    usage: 'Nanositi tanak sloj BIOROID kreme dva puta dnevno na čistu i suvu kožu analnog područja. Za najbolje rezultate, nanositi nakon defekacije i svakodnevne higijene. Pogodan za kontinuiranu, dugotrajnu upotrebu bez prekida. Sadržaj: 50ml.',
    warnings: [
      'Samo za spoljašnju upotrebu',
      'Izbegavati kontakt sa očima. Ukoliko dođe do kontakta, temeljno isprati vodom',
      'Ne koristiti ukoliko ste preosjetljivi na bilo koji od sastojaka',
      'U slučaju trajne iritacije, prekinuti upotrebu i potražiti lekarsku pomoć',
      'Čuvati van dosega dece',
      'Čuvati na sobnoj temperaturi'
    ],
    productFAQ: [
      {
        question: 'Kako se koristi BIOROID?',
        answer: 'Nanositi tanak sloj BIOROID kreme dva puta dnevno na čistu i suvu kožu analnog područja. Za najbolje rezultate, nanositi nakon defekacije i svakodnevne higijene.',
        category: 'usage'
      },
      {
        question: 'Koji su glavni aktivni sastojci u BIOROID proizvodu?',
        answer: 'BIOROID sadrži pažljivo odabrane biljne ekstrakte (hajdučka trava, divlji kesten, neven, pastirska torbica, zdravac, kamilica) i eterična ulja (lavanda, čajno drvo, pačuli, karanfilić), obogaćen vitaminima A, E i B5.',
        category: 'ingredients'
      },
      {
        question: 'Da li je BIOROID siguran za dugotrajnu upotrebu?',
        answer: 'Da, BIOROID je kozmetički proizvod na biljnoj osnovi pogodan za kontinuiranu svakodnevnu upotrebu. Bez parabena, umjetnih boja i mirisa.',
        category: 'safety'
      },
      {
        question: 'Da li se može koristiti na osjetljivoj koži?',
        answer: 'Da, formula je posebno dizajnirana za nežnu kožu analnog područja i pogodna je za osjetljivu kožu.',
        category: 'usage'
      },
      {
        question: 'Da li BIOROID zamenjuje medicinsko lečenje?',
        answer: 'Ne. BIOROID je kozmetički proizvod, a ne lek. Za medicinske probleme konsultujte se sa lekarom.',
        category: 'safety'
      }
    ],
    testimonials: [
      {
        id: "bioroid_t1",
        name: "Marija S.",
        city: "Zagreb",
        rating: 5,
        text: "BIOROID mi je stvarno pomogao sa svakodnevnom nelagodnošću. Prirodni sastojci su mi bili važni, a krema je nježna i učinkovita. Koristim je već mjesec dana bez problema.",
        verified: true,
        productUsed: "BIOROID",
        dateAdded: "2024-12-15",
        featured: true,
        likes: 42
      },
      {
        id: "bioroid_t2",
        name: "Jelena P.",
        city: "Rijeka",
        rating: 5,
        text: "Kao neko ko ima osjetljivu kožu, BIOROID je bio pravo rješenje. Nema jakih mirisa, ne iritira, a stvarno pomaže. Preporučujem svima koji traže prirodno rješenje.",
        verified: true,
        productUsed: "BIOROID",
        dateAdded: "2024-12-10",
        featured: true,
        likes: 35
      },
      {
        id: "bioroid_t3",
        name: "Stefan M.",
        city: "Split",
        rating: 4,
        text: "Dobra krema za svakodnevnu upotrebu. Smiruje iritacije i ima ugodan osvježavajući osjećaj. Cijena je razumna za kvalitetu koju dobivate.",
        verified: true,
        productUsed: "BIOROID",
        dateAdded: "2024-12-12",
        featured: false,
        likes: 28
      },
      {
        id: "bioroid_t4",
        name: "Ana T.",
        city: "Zadar",
        rating: 5,
        text: "Prirodni sastojci poput nevena i kamilice čine čuda za osjetljivu kožu. BIOROID je nježan, učinkovit i bez neželjenih učinaka. Već sam preporučila prijateljicama.",
        verified: true,
        productUsed: "BIOROID",
        dateAdded: "2024-12-05",
        featured: true,
        likes: 38
      }
    ]
  },

  biomelis_kapi: {
    id: 'biomelis_kapi',
    name: 'BIOMELIS KAPI',
    description: 'Podržavaju prirodne procese detoksikacije u organizmu. Pomažu boljoj funkciji jetre i bubrega, podstičući izbacivanje toksina. Redovnim korišćenjem doprinose jačanju imuniteta i osjećaju vitalnosti.',
    shortDescription: 'Prirodna biljna kombinacija',
    purpose: 'Podržava normalnu funkciju jetre i žlezuda',
    category: 'supplements',
    images: {
      main: '/images/products/biomelis-kapi/biomelis-kapi-box-and-product-mockup.png',
      gallery: [
        '/images/products/biomelis-kapi/biomelis-kapi-box-only.png',
        '/images/products/biomelis-kapi/biomelis-kapi-open-bottle.png',
        '/images/products/biomelis-kapi/biomelis-kapi-old-product-image.png'
      ],
      thumbnail: '/images/products/biomelis-kapi/biomelis-kapi-box-only.png',
      fallback: '/images/products/biomelis-kapi/biomelis-kapi-box-and-product-mockup.png'
    },
    variants: [
      {
        id: 'biomelis-kapi-1pak',
        sku: 'BIOMELIS-KAPI',
        name: '1 PAKOVANJE (50ml)',
        size: 'Okvirno mjesec dana upotrebe',
        quantity: 1,
        price: 20.9,
        currency: 'EUR',
        discountPrice: 16.9,
        isDefault: true
      },
      {
        id: 'biomelis-kapi-2pak',
        sku: 'BIOMELIS-KAPI',
        name: '2 PAKOVANJA (100ml)',
        size: 'Okvirno 2 mjeseca upotrebe',
        quantity: 2,
        price: 40.9,
        currency: 'EUR',
        discountPrice: 30.9
      },
      {
        id: 'biomelis-kapi-3pak',
        sku: 'BIOMELIS-KAPI',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 3 mjeseca upotrebe',
        quantity: 3,
        price: 60.9,
        currency: 'EUR',
        discountPrice: 40.9
      }
    ],
    benefits: [
      'Zahvaljujući sadržaju silimarina, badel ispolja regenerativno delovanje na hepatocite',
      'Deluje kao hepatoprotektiv i doprinosi zdravlju jetre',
      'Maslačak doprinosi normalnoj funkciji žlezuda i jetre',
      'Rastić ima zaštitni efekat na hepatocite',
       'Čičak poboljšava probavu i podstiče metabolizam masti i glukoze',
      'Lazarkinja povoljno utiče na proces varenja',
      'Prirodni vodeno-etanolni ekstrakti ljekovitih biljaka',
      'Energetska vrednost dnevnog unosa manja od 50 kJ (12 kcal)'
    ],
    ingredients: [
      // Active herbal extracts - based on official document
      'milk-thistle-extract', // Badel (Silybum marianum) - hepatoprotective
      'nettle-leaf-extract', // Kopriva (Urtica dioica) - liver support
      'dandelion-root-extract', // Maslačak (Taraxacum officinale) - gallbladder & liver
      'burdock-root-extract', // Čičak (Arctium lappa) - digestion & metabolism
      'burdock-herb-extract', // Rastić (Arctium lappa herba) - hepatocyte protection
      'woodruff-herb-extract', // Lazarkinja (Galium odoratum) - digestion support
      // Base components
      'aqua',
      'ethanol', // Ethanol for extraction
      'glycerin'
    ],
    usage: 'Odrasli, 3 puta dnevno po 40 kapi, rastvoreno u malo vode. Dnevni unos: 120 kapi (4ml). Sadržaj: 50ml (dovoljno za mjesec dana redovne upotrebe).',
    usageSteps: [
      'Uzimati 3 puta dnevno po 40 kapi',
      'Rastvoriti kapi u malo vode',
      'Najbolje uzimati pre obroka',
      'Redovno koristiti najmanje mjesec dana za najbolje rezultate',
      'Ne prekoračiti preporučenu dnevnu dozu',
      'Kombinovati sa uravnoteženom ishranom'
    ],
    warnings: [
      'Dodatak ishrani se ne može koristiti kao zamena za raznovrsnu i uravnoteženu ishranu',
      'Čuvati van domašaja dece',
      'Proizvod čuvati dobro zatvoren u originalnom pakovanju, na suvom, tamnom i hladnom mestu',
      'Proizvod nije namenjen osobama preosjetljivim na bilo koji sastojak',
      'Nije namenjen trudnicama, dojiljama i osobama mlađim od 18 godina',
      'Također, osobama kojima se preporučuje redukovan unos tečnosti (teška srčana ili bubrežna bolest)',
      'Ne preporučuje se istovremena primena sa diureticima',
      'Primena proizvoda mogu da prate blagi i prolazni simptomi poremećaja funkcije gastrointestinalnog trakta',
      'Moguća je pojava kožnih reakcija',
      'Proizvod sadrži alkohol'
    ],
    slug: 'biomelis-kapi',
    alternativeSlugs: ['biomelis-drops', 'jetra-kapi', 'hepatoprotektiv'],
    availableCountries: ['hr'],
    seoTitle: 'BIOMELIS KAPI - Prirodni dodatak ishrani za zdravlje jetre | DERMOTIN',
    seoDescription: 'BIOMELIS KAPI od DERMOTIN brenda - dodatak ishrani sa ekstraktima badelja, koprive, maslačka. Hepatoprotektiv za podršku zdravlja jetre. Silimarin, prirodni sastojci. 50ml.',
    urgencyElements: {
      limitedStock: 25,
      limitedTime: '24h',
      socialProof: {
        recentPurchases: 67,
        timeFrame: 'poslednja 24h'
      }
    },
    productFAQ: [
      {
        question: "Kako se koriste BIOMELIS KAPI?",
        answer: "Vrlo jednostavno! Uzimati 3 puta dnevno po 40 kapi, rastvoreno u malo vode. Najbolje je uzimati pre obroka. Jedna bočica od 50ml traje oko mjesec dana pri redovnoj upotrebi.",
        category: "usage"
      },
      {
        question: "Kada ću vidjeti prve rezultate?",
        answer: "Budite realni - pravi rezultati se vide nakon mjesec dana redovne upotrebe. Jetra je organ koji se polako regeneriše, pa budite strpljivi i ne očekujte čuda preko noći!",
        category: "effects"
      },
      {
        question: "Da li su BIOMELIS KAPI prirodne?",
        answer: "Da! Dodatak ishrani na bazi vodeno-etanolnih ekstrakata ljekovitih biljaka: badel, kopriva, maslačak, čičak, rastić i lazarkinja. Sve prirodno, bez umjetnih dodataka.",
        category: "ingredients"
      },
      {
        question: "Je li sigurno za dugotrajnu upotrebu?",
        answer: "BIOMELIS KAPI su dodatak ishrani kategorizovan od strane Farmaceutskog fakulteta. Pogodan za redovnu upotrebu, ali uvek pratite preporučenu dozu i konsultujte se sa lekarom.",
        category: "safety"
      },
      {
        question: "Ko ne sme da koristi BIOMELIS KAPI?",
        answer: "Proizvod nije namenjen trudnicama, dojiljama, osobama mlađim od 18 godina, kao ni osobama sa teškom srčanom ili bubrežnom bolešću. Također, ne preporučuje se istovremena primena sa diureticima.",
        category: "safety"
      },
      {
        question: "Kako čuvati BIOMELIS KAPI?",
        answer: "Čuvajte dobro zatvoreno u originalnom pakovanju, na suvom, tamnom i hladnom mestu, daleko od djece. Proizvod sadrži alkohol kao prirodni konzervans.",
        category: "storage"
      },
      {
        question: "Mogu li da koristim BIOMELIS KAPI sa drugim lekovima?",
        answer: "Ako uzimate lekove, posebno diuretike, konsultujte se sa lekarom pre upotrebe. BIOMELIS KAPI su dodatak ishrani, a ne lek.",
        category: "usage"
      },
      {
        question: "Što čini BIOMELIS KAPI tako učinkovitim?",
         answer: "Silimarin iz badelja djeluje hepatoprotektivno, maslačak podržava funkciju jetre i žlezda, a čičak poboljšava probavu i metabolizam. Sve prirodno, znanstveno potvrđeno!",
        category: "ingredients"
      }
    ],
    testimonials: [
      {
        id: "bk1",
        name: "Milica R.",
        city: "Zagreb",
        rating: 5,
        text: "BIOMELIS KAPI mi je pomogao nakon što sam imala problema sa jetrom. Prirodni sastojci su mi bili važni, a rezultati su vidljivi već nakon mjesec dana korišćenja. Preporučujem svima!",
        verified: true,
        productUsed: "BIOMELIS KAPI",
        dateAdded: "2024-12-14",
        featured: true,
        likes: 43
      },
      {
        id: "bk2",
        name: "Petar M.",
        city: "Split",
        rating: 5,
        text: "Kao netko tko voli uživati u hrani, BIOMELIS KAPI mi pomaže da se osjećam bolje. Badel i maslačak su poznati po tome što pomažu jetri. Prirodno i učinkovito!",
        verified: true,
        productUsed: "BIOMELIS KAPI",
        dateAdded: "2024-12-11",
        likes: 39
      },
      {
        id: "bk3",
        name: "Ana S.",
        city: "Osijek",
        rating: 5,
        text: "Moj muž ima problema s probavom i BIOMELIS KAPI su stvarno pomogle. Čičak poboljšava probavu, a lazarkinja također pomaže. Prirodni pristup koji funkcionira.",
        verified: true,
        productUsed: "BIOMELIS KAPI",
        dateAdded: "2024-12-09",
        featured: true,
        likes: 36
      },
      {
        id: "bk4",
        name: "Marko J.",
        city: "Rijeka",
        rating: 4,
        text: "Koristim BIOMELIS KAPI već dva mjeseca. Osjećam se bolje, probava mi je poboljšana. Trebalo mi je malo vremena da vidim rezultate, ali vrijedi čekanja.",
        verified: true,
        productUsed: "BIOMELIS KAPI",
        dateAdded: "2024-12-06",
        featured: false,
        likes: 31
      },
      {
        id: "bk5",
        name: "Dragana P.",
        city: "Zadar",
        rating: 5,
        text: "Kao farmaceut, cijenim što su BIOMELIS KAPI kategorizirane od strane Farmaceutskog fakulteta. Silimarin iz badelja je znanstveno potvrđen hepatoprotektiv. Kvalitetan proizvod!",
        verified: true,
        productUsed: "BIOMELIS KAPI",
        dateAdded: "2024-12-04",
        featured: true,
        likes: 41
      },
      {
        id: "bk6",
        name: "Stefan T.",
        city: "Varaždin",
        rating: 5,
        text: "Imao sam problema s jetrom zbog nezdravog načina života. BIOMELIS KAPI su mi pomogle da se osjećam bolje. Sada vodim računa o prehrani i redovito uzimam kapi.",
        verified: true,
        productUsed: "BIOMELIS KAPI",
        dateAdded: "2024-12-01",
        featured: false,
        likes: 28
      }
    ]
  },

  bioroid_kapi: {
    id: 'bioroid_kapi',
    name: 'BIOROID KAPI',
    description: 'Namenjene ublažavanju unutrašnjih tegoba izazvanih hemoroidima. Pomažu u smanjenju upale i jačanju krvnih sudova. Njihova prirodna formula doprinosi olakšanju i podržava normalnu cirkulaciju.',
    shortDescription: 'Tradicionalna biljna formula',
    purpose: 'Podržava ublažavanje nelagodnosti kod hemoroida i analne iritacije',
    category: 'supplements',
    images: {
      main: '/images/products/bioroid-kapi/bioroid-kapi-box-and-product-mockup.png',
      gallery: [
        '/images/products/bioroid-kapi/bioroid-kapi-box-only.png',
        '/images/products/bioroid-kapi/bioroid-kapi-open-bottle.png',
        '/images/products/bioroid-kapi/bioroid-kapi-old-product-image.png'
      ],
      thumbnail: '/images/products/bioroid-kapi/bioroid-kapi-box-only.png',
      fallback: '/images/products/bioroid-kapi/bioroid-kapi-box-and-product-mockup.png'
    },
    variants: [
      {
        id: 'bioroid-kapi-1pak',
        sku: 'BIOROID-KAPI',
        name: '1 PAKOVANJE (50ml)',
        size: 'Okvirno mjesec dana upotrebe',
        quantity: 1,
        price: 20.9,
        currency: 'EUR',
        discountPrice: 16.9,
        isDefault: true
      },
      {
        id: 'bioroid-kapi-2pak',
        sku: 'BIOROID-KAPI',
        name: '2 PAKOVANJA (100ml)',
        size: 'Okvirno 2 mjeseca upotrebe',
        quantity: 2,
        price: 40.9,
        currency: 'EUR',
        discountPrice: 30.9
      },
      {
        id: 'bioroid-kapi-3pak',
        sku: 'BIOROID-KAPI',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 3 mjeseca upotrebe',
        quantity: 3,
        price: 60.9,
        currency: 'EUR',
        discountPrice: 40.9
      }
    ],
    benefits: [
       'Hajdučka trava, neven i hrastova kora ublažavaju upalu i krvarenje',
      'Čičak i kleka doprinose boljoj cirkulaciji i smanjenju otoka',
      'Maslačak pomaže detoksikaciji i oporavku tkiva',
       'Smanjuje otok, bol, svrbež i krvarenje kod hemoroida',
      'Umiruje upalu i iritaciju analne sluzokože',
      'Astringentna i antiseptička zaštita zahvaljujući taninima hrastove kore',
      'Podržava cirkulaciju i jačanje vena',
      'Bez parabena, umjetnih boja i mirisa'
    ],
    ingredients: [
      // Active herbal extracts - based on BIOROID KAPI documentation
      'achillea-extract', // Hajdučka trava (Achillea millefolium) - 25ml/100ml
      'arctium-root-extract', // Čičak korijen (Arctium lappa) - 20ml/100ml
      'calendula-extract', // Neven (Calendula officinalis) - 15ml/100ml
      'quercus-bark-extract', // Hrastova kora (Quercus robur) - 15ml/100ml
      'dandelion-root-extract', // Maslačak (Taraxacum officinale) - 15ml/100ml
      'juniper-fruit-extract', // Kleka plod (Juniperus communis) - 10ml/100ml
      // Base components
      'aqua',
      'ethanol', // 40% v/v ethanol for extraction
      'glycerin'
    ],
    usage: 'Odrasli: 3 puta dnevno do 40 kapi razblaženih u malo vode, posle obroka. Ne prelaziti ukupno 120 kapi dnevno. Sadržaj: 50ml (dovoljno za mjesec dana redovne upotrebe).',
    usageSteps: [
      'Uzimati 3 puta dnevno po do 40 kapi',
      'Razblažiti kapi u malo vode',
      'Najbolje uzimati posle obroka',
      'Ne prekoračiti 120 kapi dnevno',
      'Redovno koristiti najmanje mjesec dana za najbolje rezultate',
      'Kombinovati sa uravnoteženom ishranom'
    ],
    warnings: [
      'Dodatak ishrani nije zamena za raznovrsnu i uravnoteženu ishranu',
      'Nije namenjen osobama mlađim od 18 godina, trudnicama ni dojiljama',
      'Ne koristiti kod preosjetljivosti na sastojke (posebno biljke porodice Asteraceae)',
      'Izbegavati kod oboljenja žučnih puteva',
      'Izbegavati istovremeno sa diureticima',
      'Ne prekoračiti preporučenu dnevnu dozu',
      'Čuvati van dohvata dece, u originalnom pakovanju, na tamnom i suhom mjestu do 25°C',
      'Proizvod sadrži alkohol 37% v/v'
    ],
    slug: 'bioroid-kapi',
    alternativeSlugs: ['bioroid-drops', 'hemoroidi-kapi', 'analna-nelagoda'],
    availableCountries: ['hr'],
    seoTitle: 'BIOROID KAPI - Prirodni dodatak ishrani za hemoroide | DERMOTIN',
    seoDescription: 'BIOROID KAPI od DERMOTIN brenda - dodatak ishrani sa ekstraktima hajdučke trave, nevena, hrastove kore. Prirodna podrška kod hemoroida i analne nelagode. 50ml.',
    urgencyElements: {
      limitedStock: 18,
      limitedTime: '24h',
      socialProof: {
        recentPurchases: 34,
        timeFrame: 'poslednja 24h'
      }
    },
    productFAQ: [
      {
        question: "Kako se koriste BIOROID KAPI?",
        answer: "Vrlo jednostavno! Uzimati 3 puta dnevno po do 40 kapi, razblaženo u malo vode, posle obroka. Ne prelaziti 120 kapi dnevno. Jedna bočica od 50ml traje oko mjesec dana pri redovnoj upotrebi.",
        category: "usage"
      },
      {
        question: "Kada ću vidjeti prve rezultate?",
        answer: "Budite realni - pravi rezultati se vide nakon 2-3 tjedna redovne upotrebe. Svaki organizam je drugačiji, pa budite strpljivi i ne očekujte čuda preko noći!",
        category: "effects"
      },
      {
        question: "Da li su BIOROID KAPI prirodne?",
        answer: "Da! Dodatak ishrani na bazi vodeno-etanolnih ekstrakata šest ljekovitih biljaka: hajdučka trava, čičak, neven, hrastova kora, maslačak i kleka. Sve prirodno, bez umjetnih dodataka.",
        category: "ingredients"
      },
      {
        question: "Je li sigurno za dugotrajnu upotrebu?",
        answer: "BIOROID KAPI su dodatak ishrani kategorizovan od strane Farmaceutskog fakulteta. Pogodan za redovnu upotrebu, ali uvek pratite preporučenu dozu i konsultujte se sa lekarom.",
        category: "safety"
      },
      {
        question: "Ko ne sme da koristi BIOROID KAPI?",
        answer: "Proizvod nije namenjen trudnicama, dojiljama, osobama mlađim od 18 godina. Ne koristiti kod preosjetljivosti na biljke porodice Asteraceae ili oboljenja žučnih puteva.",
        category: "safety"
      },
      {
        question: "Kako čuvati BIOROID KAPI?",
        answer: "Čuvajte dobro zatvoreno u originalnom pakovanju, na tamnom i suhom mjestu do 25°C, daleko od djece. Proizvod sadrži alkohol kao prirodni konzervans.",
        category: "storage"
      },
      {
        question: "Mogu li da koristim BIOROID KAPI sa drugim lekovima?",
        answer: "Ako uzimate lekove, posebno diuretike, konsultujte se sa lekarom pre upotrebe. BIOROID KAPI su dodatak ishrani, a ne lek.",
        category: "usage"
      },
      {
        question: "Što čini BIOROID KAPI tako učinkovitim?",
        answer: "Hajdučka trava i hrastova kora deluju astringentno, neven podržava regeneraciju, čičak poboljšava cirkulaciju, a maslačak pomaže detoksikaciji. Sinergijski efekat šest biljaka!",
        category: "ingredients"
      }
    ],
    testimonials: [
      {
        id: "brk1",
        name: "Marko P.",
        city: "Zagreb",
        rating: 5,
        text: "BIOROID KAPI mi je stvarno pomogao s kroničnim problemima. Hajdučka trava i hrastova kora su poznate po astringentnom djelovanju. Nakon mjesec dana korištenja osjećam značajno olakšanje.",
        verified: true,
        productUsed: "BIOROID KAPI",
        dateAdded: "2024-12-15",
        featured: true,
        likes: 41
      },
      {
        id: "brk2",
        name: "Stefan M.",
        city: "Split",
        rating: 5,
        text: "Kao netko tko se bori s ovim problemom godinama, mogu reći da je BIOROID KAPI najbolji prirodni proizvod koji sam probao. Neven i čičak stvarno pomažu cirkulaciji.",
        verified: true,
        productUsed: "BIOROID KAPI",
        dateAdded: "2024-12-12",
        featured: true,
        likes: 38
      },
      {
        id: "brk3",
        name: "Miloš R.",
        city: "Osijek",
        rating: 4,
        text: "Koristim BIOROID KAPI već dva mjeseca. Vidim poboljšanje, manje je nelagodnosti i krvarenja. Trebalo mi je malo vremena da vidim rezultate, ali vrijedi čekanja.",
        verified: true,
        productUsed: "BIOROID KAPI",
        dateAdded: "2024-12-08",
        featured: false,
        likes: 32
      },
      {
        id: "brk4",
        name: "Aleksandar T.",
        city: "Rijeka",
        rating: 5,
        text: "Prirodni sastojci poput maslačka za detoksikaciju i kleke za cirkulaciju čine čuda. BIOROID KAPI je nežan, učinkovit i bez neželjenih učinaka. Već sam preporučio prijateljima.",
        verified: true,
        productUsed: "BIOROID KAPI",
        dateAdded: "2024-12-05",
        featured: true,
        likes: 35
      },
      {
        id: "brk5",
        name: "Dragan S.",
        city: "Zadar",
        rating: 5,
        text: "Kao farmaceut, cijenim što su BIOROID KAPI kategorizirane od strane Farmaceutskog fakulteta. Tanini iz hrastove kore su znanstveno potvrđeni za astringentno djelovanje. Kvalitetan proizvod!",
        verified: true,
        productUsed: "BIOROID KAPI",
        dateAdded: "2024-12-02",
        featured: true,
        likes: 39
      }
    ]
  },

  immunis_kapi: {
    id: 'immunis_kapi',
    name: 'IMMUNIS KAPI',
    description: 'Jačaju prirodni odbrambeni sistem organizma. Sadrže pažljivo odabrane biljne sastojke koji pomažu u povećanju otpornosti na infekcije. Pogodne su za preventivnu upotrebu u periodima oslabljenog imuniteta.',
    shortDescription: 'Biljna podrška organizmu',
    purpose: 'Podržava prirodnu odbrambenu sposobnost organizma',
    category: 'supplements',
    images: {
      main: '/images/products/immunis-kapi/immunis-kapi-box-and-product-mockup.png',
      gallery: [
        '/images/products/immunis-kapi/immunis-kapi-box-only.png',
        '/images/products/immunis-kapi/immunis-kapi-open-bottle.png',
        '/images/products/immunis-kapi/immunis-kapi-old-product-image.png'
      ],
      thumbnail: '/images/products/immunis-kapi/immunis-kapi-box-only.png',
      fallback: '/images/products/immunis-kapi/immunis-kapi-box-and-product-mockup.png'
    },
    variants: [
      {
        id: 'immunis-kapi-1pak',
        sku: 'IMMUNIS-KAPI',
        name: '1 PAKOVANJE (50ml)',
        size: 'Okvirno mjesec dana upotrebe',
        quantity: 1,
        price: 20.9,
        currency: 'EUR',
        discountPrice: 16.9,
        isDefault: true
      },
      {
        id: 'immunis-kapi-2pak',
        sku: 'IMMUNIS-KAPI',
        name: '2 PAKOVANJA (100ml)',
        size: 'Okvirno 2 mjeseca upotrebe',
        quantity: 2,
        price: 40.9,
        currency: 'EUR',
        discountPrice: 30.9
      },
      {
        id: 'immunis-kapi-3pak',
        sku: 'IMMUNIS-KAPI',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 3 mjeseca upotrebe',
        quantity: 3,
        price: 60.9,
        currency: 'EUR',
        discountPrice: 40.9
      }
    ],
    benefits: [
      'Ehinacea i kopriva aktiviraju odbrambene mehanizme',
      'Majčina dušica i maslina štite disajne puteve',
      'Antiseptička i antivirusna podrška',
      'Očuvanje zdravlja gornjih disajnih puteva i lakše disanje',
      'Antioksidativna zaštita i detoks efekat',
      'Blaga relaksacija i bolji san zahvaljujući lavandi',
      'Prirodni vodeno-etanolni ekstrakti ljekovitih biljaka',
      'Bez parabena, umjetnih boja i mirisa'
    ],
    ingredients: [
      // Active herbal extracts - based on IMMUNIS KAPI documentation
      'echinacea-root-extract', // Ehinacea (Echinacea purpurea) - 30ml/100ml
      'nettle-leaf-extract', // Kopriva (Urtica dioica) - 15ml/100ml
      'walnut-leaf-extract', // List oraha (Juglans regia) - 15ml/100ml
      'thyme-herb-extract', // Majčina dušica (Thymus serpyllum) - 15ml/100ml
      'olive-leaf-extract', // List masline (Olea europaea) - 15ml/100ml
      'lavender-flower-extract', // Lavanda (Lavandula angustifolia) - 10ml/100ml
      // Base components
      'aqua',
      'ethanol', // 40% v/v ethanol for extraction
      'glycerin'
    ],
    usage: 'Odrasli: 3 puta dnevno do 40 kapi razmućenih u malo vode, posle obroka. Nemojte prelaziti 120 kapi dnevno. Sadržaj: 50ml (dovoljno za mjesec dana redovne upotrebe).',
    usageSteps: [
      'Uzimati 3 puta dnevno po do 40 kapi',
      'Razmutiti kapi u malo vode',
      'Najbolje uzimati posle obroka',
      'Ne prekoračiti 120 kapi dnevno',
      'Redovno koristiti najmanje mjesec dana za najbolje rezultate',
      'Kombinovati sa uravnoteženom ishranom'
    ],
    warnings: [
      'Dodatak ishrani nije zamena za raznovrsnu i uravnoteženu ishranu',
      'Nije namenjen osobama mlađim od 18 godina, trudnicama i dojiljama',
      'Izbegavati ako ste preosjetljivi na biljke iz familije Asteraceae ili druge sastojke',
      'Konsultovati lekara kod autoimunih oboljenja ili terapije imunosupresivima',
      'Nije preporučeno za osobe sa smanjenim dnevnim unosom tečnosti',
      'Upotreba lavande može izazvati pospanost - izbegavati vožnju i rad sa mašinama',
      'Ne prekoračiti preporučenu dnevnu dozu',
      'Čuvati van domašaja dece, u originalnom pakovanju, na tamnom i suhom mjestu do 25°C',
      'Proizvod sadrži alkohol'
    ],
    slug: 'immunis-kapi',
    alternativeSlugs: ['immunis-drops', 'imunitet-kapi', 'ehinacea-kapi'],
    availableCountries: ['hr'],
    seoTitle: 'IMMUNIS KAPI - Prirodni dodatak ishrani za imunitet | DERMOTIN',
    seoDescription: 'IMMUNIS KAPI od DERMOTIN brenda - dodatak ishrani sa ekstraktima ehinacee, koprive, majčine dušice. Prirodna podrška imunitetu i disajnim putevima. 50ml.',
    urgencyElements: {
      limitedStock: 22,
      limitedTime: '24h',
      socialProof: {
        recentPurchases: 45,
        timeFrame: 'poslednja 24h'
      }
    },
    productFAQ: [
      {
        question: "Kako se koriste IMMUNIS KAPI?",
        answer: "Vrlo jednostavno! Uzimati 3 puta dnevno po do 40 kapi, razmućeno u malo vode, posle obroka. Ne prelaziti 120 kapi dnevno. Jedna bočica od 50ml traje oko mjesec dana pri redovnoj upotrebi.",
        category: "usage"
      },
      {
        question: "Kada ću vidjeti prve rezultate?",
        answer: "Budite realni - imunitet se jača postupno. Prvi efekti se mogu osetiti nakon 2-3 tjedna redovne upotrebe, a puni benefiti nakon mjesec dana korišćenja.",
        category: "effects"
      },
      {
        question: "Da li su IMMUNIS KAPI prirodne?",
        answer: "Da! Dodatak ishrani na bazi vodeno-etanolnih ekstrakata šest ljekovitih biljaka: ehinacea, kopriva, orah, majčina dušica, maslina i lavanda. Sve prirodno, bez umjetnih dodataka.",
        category: "ingredients"
      },
      {
        question: "Je li sigurno za dugotrajnu upotrebu?",
        answer: "IMMUNIS KAPI su dodatak ishrani kategorizovan od strane Farmaceutskog fakulteta. Pogodan za redovnu upotrebu, ali uvek pratite preporučenu dozu i konsultujte se sa lekarom.",
        category: "safety"
      },
      {
        question: "Ko ne sme da koristi IMMUNIS KAPI?",
        answer: "Proizvod nije namenjen trudnicama, dojiljama, osobama mlađim od 18 godina. Izbegavati kod autoimunih oboljenja, alergije na Asteraceae ili terapije imunosupresivima.",
        category: "safety"
      },
      {
        question: "Kako čuvati IMMUNIS KAPI?",
        answer: "Čuvajte dobro zatvoreno u originalnom pakovanju, na tamnom i suhom mjestu do 25°C, daleko od djece. Proizvod sadrži alkohol kao prirodni konzervans.",
        category: "storage"
      },
      {
        question: "Da li mogu da vozim nakon uzimanja?",
        answer: "Pažnja! Lavanda može izazvati pospanost. Sačekajte najmanje sat vremena pre vožnje ili rada sa mašinama nakon uzimanja kapi.",
        category: "usage"
      },
      {
        question: "Što čini IMMUNIS KAPI tako učinkovitim?",
        answer: "Ehinacea jača imunitet, kopriva je bogata mineralima, majčina dušica štiti disajne puteve, maslina pruža antioksidativnu zaštitu, a lavanda pomaže opuštanju. Sinergijski efekat!",
        category: "ingredients"
      }
    ],
    testimonials: [
      {
        id: "imk1",
        name: "Jovana M.",
        city: "Zagreb",
        rating: 5,
        text: "IMMUNIS KAPI mi je pomogao da prođem zimu bez čestih prehlade. Ehinacea i kopriva stvarno jačaju imunitet. Koristim ih već tri mjeseca i osjećam se mnogo bolje.",
        verified: true,
        productUsed: "IMMUNIS KAPI",
        dateAdded: "2024-12-14",
        featured: true,
        likes: 42
      },
      {
        id: "imk2",
        name: "Nemanja S.",
        city: "Split",
        rating: 5,
        text: "Kao netko tko često putuje, IMMUNIS KAPI su mi postale nezamjenjive. Majčina dušica štiti dišne putove, a lavanda pomaže da se opustim. Prirodno i učinkovito!",
        verified: true,
        productUsed: "IMMUNIS KAPI",
        dateAdded: "2024-12-11",
        featured: true,
        likes: 39
      },
      {
        id: "imk3",
        name: "Ana P.",
        city: "Osijek",
        rating: 4,
        text: "Koristim IMMUNIS KAPI već mjesec dana za jačanje imuniteta. Vidim da se ređe razboljevam, a san mi je bolji zahvaljujući lavandi. Preporučujem!",
        verified: true,
        productUsed: "IMMUNIS KAPI",
        dateAdded: "2024-12-08",
        featured: false,
        likes: 33
      },
      {
        id: "imk4",
        name: "Miloš T.",
        city: "Rijeka",
        rating: 5,
        text: "Prirodni sastojci poput lista masline za antioksidativnu zaštitu i oraha za detoks čine čuda. IMMUNIS KAPI su nežne, učinkovite i bez neželjenih učinaka.",
        verified: true,
        productUsed: "IMMUNIS KAPI",
        dateAdded: "2024-12-05",
        featured: true,
        likes: 36
      },
      {
        id: "imk5",
        name: "Marija R.",
        city: "Zadar",
        rating: 5,
        text: "Kao apotekar, cijenim što su IMMUNIS KAPI kategorizirane od strane Farmaceutskog fakulteta. Ehinacea je znanstveno potvrđena za jačanje imuniteta. Kvalitetan proizvod!",
        verified: true,
        productUsed: "IMMUNIS KAPI",
        dateAdded: "2024-12-02",
        featured: true,
        likes: 40
      }
    ]
  },

  fungomax: {
    id: 'fungomax',
    name: 'FUNGOMAX',
    description: 'Deluje dubinski na gljivične infekcije noktiju i kože stopala. Prodire u nokatnu ploču i pomaže u njenom jačanju i obnavljanju. Dugotrajnom upotrebom obezbeđuje zaštitu i zdrav izgled noktiju.',
    shortDescription: 'Intenzivna nega noktiju i stopala',
    purpose: 'Pomaže koži i noktima sklonim gljivičnim infekcijama',
    category: 'skincare',
    images: {
      main: '/images/products/fungomax/fungomax-box-and-product-mockup.png',
      gallery: [
        '/images/products/fungomax/fungomax-box-only.png',
        '/images/products/fungomax/fungomax-open-bottle.png',
        '/images/products/fungomax/fungomax-product-image.png'
      ],
      thumbnail: '/images/products/fungomax/fungomax-box-only.png',
      fallback: '/images/products/fungomax/fungomax-box-and-product-mockup.png'
    },
    variants: [
      {
        id: 'fungomax-1pak',
        sku: 'FUNGOMAX',
        name: '1 PAKOVANJE (50ml)',
        size: 'Okvirno 2 tjedna upotrebe',
        quantity: 1,
        price: 20.9,
        currency: 'EUR',
        discountPrice: 17.9,
        isDefault: true
      },
      {
        id: 'fungomax-2pak',
        sku: 'FUNGOMAX',
        name: '2 PAKOVANJA (100ml)',
        size: 'Okvirno mjesec dana upotrebe',
        quantity: 2,
        price: 40.9,
        currency: 'EUR',
        discountPrice: 30.9
      },
      {
        id: 'fungomax-3pak',
        sku: 'FUNGOMAX',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 2 mjeseca upotrebe',
        quantity: 3,
        price: 60.9,
        currency: 'EUR',
        discountPrice: 40.9
      }
    ],
    benefits: [
      'Deluje učinkovito na problematične regije',
      'Smanjuje rizik od širenja gljivica',
      'Obogaćen prirodnim sastojcima',
      'Bez parabena i umjetnih boja',
      'Pogodan za svakodnevnu i dugotrajnu upotrebu',
      'Idealan u kombinaciji sa FUNGEL kremom',
      'Koncentrisana formula u praktičnim kapima',
      'Kombinuje snagu biljnih ekstrakata i eteričnih ulja'
    ],
    ingredients: [
      // Key active ingredients first
      'quercus-bark-extract',
      'thymus-extract',
      'juglans-leaf-extract',
      'salvia-extract',
      'clove-oil',
      'lavender-oil',
      'rosemary-oil',
      'allantoin',
      'glycerin',
      // Base components
      'aqua',
      'alcohol'
    ],
    usage: 'Dva puta dnevno naneti nekoliko kapi FUNGOMAX seruma direktno na kožu ili nokte zahvaćene gljivicama, zatim blago utrljati. Preporučuje se kombinovanje sa FUNGEL kremom za maksimalne rezultate. Sadržaj: 50ml.',
    usageSteps: [
      'Očistite i osušite pogođeno mesto',
      'Nanesite nekoliko kapi FUNGOMAX seruma direktno na kožu ili nokte',
      'Blago utrljajte serum u kožu',
      'Koristite 2 puta dnevno (ujutru i uveče)',
      'Za najbolje rezultate kombinujte sa FUNGEL kremom',
      'Redovno koristiti najmanje 2-4 tjedna'
    ],
    warnings: [
      'Samo za spoljnu upotrebu',
      'Ne nanositi na otvorene rane',
      'Izbegavati kontakt sa očima',
      'U slučaju kontakta sa očima isprati sa dosta vode',
      'Nakon upotrebe oprati ruke',
      'U slučaju preosjetljivosti ili iritacije prekinuti upotrebu',
      'Konsultovati se sa lekarom u slučaju iritacije',
      'Čuvati van domašaja dece, na sobnoj temperaturi'
    ],
    slug: 'fungomax',
    alternativeSlugs: ['fungomax-serum', 'gljivice-serum', 'antifungal-serum'],
    availableCountries: ['hr'],
    seoTitle: 'FUNGOMAX - Serum za njegu kože i noktiju sklonih gljivicama | DERMOTIN',
    seoDescription: 'FUNGOMAX od DERMOTIN brenda - prirodna formula sa ekstraktima hrastove kore, majčine dušice i eteričnim uljima. Koncentrisani serum za kožu i nokte sklone gljivičnim infekcijama. 50ml.',
    urgencyElements: {
      limitedStock: 35,
      limitedTime: '24h',
      socialProof: {
        recentPurchases: 89,
        timeFrame: 'poslednja 24h'
      }
    },
    productFAQ: [
      {
        question: "Kako se koristi FUNGOMAX serum?",
        answer: "Vrlo jednostavno! Nanositi 2 puta dnevno nekoliko kapi direktno na pogođenu kožu ili nokte, zatim blago utrljati. Ne treba da se ispira - samo ostaviti da se upije. Jedna bočica od 50ml traje oko 2 tjedna pri redovnoj upotrebi.",
        category: "usage"
      },
      {
        question: "Kada ću vidjeti prve rezultate?",
        answer: "Budite realni - pravi rezultati se vide nakon 2-4 tjedna redovite upotrebe. Svaka koža je drugačija, pa budite strpljivi i ne očekujte čuda preko noći!",
        category: "effects"
      },
      {
        question: "Je li FUNGOMAX prirodan?",
        answer: "Da! Prirodna formula koja može pomoći koži i noktima sklonim gljivičnim infekcijama. Sadrži ekstrakte hrastove kore, majčine dušice, orahovog lista i žalfije plus eterična ulja. Bez parabena i umjetnih boja.",
        category: "ingredients"
      },
      {
        question: "Je li siguran za svakodnevnu upotrebu?",
        answer: "Apsolutno! FUNGOMAX je testiran i odobren za svakodnevnu upotrebu. Prirodni sastojci su blagi prema koži, a serum formula omogućava ciljanu primenu.",
        category: "safety"
      },
      {
        question: "Mogu li ga koristiti sa FUNGEL kremom?",
        answer: "Da, čak se i preporučuje! FUNGOMAX serum prodire dublje u kožu, dok FUNGEL krem pruža površinsku zaštitu. Kombinacija daje najbolje rezultate.",
        category: "usage"
      },
      {
        question: "Kako čuvati FUNGOMAX?",
        answer: "Čuvajte na sobnoj temperaturi, daleko od djece. Zatvorite dobro nakon upotrebe. Rok trajanja je označen na pakovanju.",
        category: "storage"
      },
      {
        question: "Koja je razlika između FUNGOMAX-a i FUNGEL-a?",
        answer: "FUNGOMAX je koncentrisani serum u kapima za ciljanu primenu, dok je FUNGEL krem za široku površinu. FUNGOMAX prodire dublje, FUNGEL pruža dugotrajnu zaštitu. Najbolje je koristiti ih zajedno!",
        category: "usage"
      },
      {
        question: "Što čini FUNGOMAX tako učinkovitim?",
        answer: "Kombinacija moćnih biljnih ekstrakata (hrastova kora, majčina dušica) sa eteričnim uljima (karanfilić, lavanda, ruzmarin) u koncentrisanoj serum formuli. Sve prirodno, bez štetnih kemikalija!",
        category: "ingredients"
      }
    ],
    testimonials: [
      {
        id: "f1",
        name: "Stefan M.",
        city: "Zagreb",
        rating: 5,
        text: "FUNGOMAX serum je bio prava stvar za moje probleme s gljivicama na noktima. Koncentrirana formula djeluje brže od krema. Koristim ga s FUNGEL kremom i rezultati su fantastični!",
        verified: true,
        productUsed: "FUNGOMAX",
        dateAdded: "2024-12-15",
        featured: true,
        likes: 43
      },
      {
        id: "f2",
        name: "Milica P.",
        city: "Split",
        rating: 5,
        text: "Kao netko tko ima osjetljivu kožu, FUNGOMAX mi je pomogao bez iritacije. Hrastova kora i majčina dušica su poznate po antimikrobnom djelovanju. Prirodno i učinkovito!",
        verified: true,
        productUsed: "FUNGOMAX",
        dateAdded: "2024-12-12",
        featured: true,
        likes: 39
      },
      {
        id: "f3",
        name: "Marko J.",
        city: "Rijeka",
        rating: 5,
        text: "Probao sam mnoge proizvode, ali FUNGOMAX je jedini koji je stvarno pomogao. Serum formula se lako nanosi, brzo se upija i nema lepljiv osjećaj. Preporučujem!",
        verified: true,
        productUsed: "FUNGOMAX",
        dateAdded: "2024-12-10",
        featured: true,
        likes: 36
      },
      {
        id: "f4",
        name: "Ana S.",
        city: "Osijek",
        rating: 4,
        text: "Koristim FUNGOMAX već mjesec dana za problematičnu kožu na stopalima. Vidim poboljšanje, a kombinacija s FUNGEL kremom daje odlične rezultate. Cijena je razumna.",
        verified: true,
        productUsed: "FUNGOMAX",
        dateAdded: "2024-12-08",
        featured: false,
        likes: 31
      },
      {
        id: "f5",
        name: "Petar R.",
        city: "Zadar",
        rating: 5,
        text: "Kao sportaš, često imam problema s gljivicama. FUNGOMAX serum je praktičan za ciljanu primjenu, a eterična ulja daju ugodan miris. Koristim ga preventivno.",
        verified: true,
        productUsed: "FUNGOMAX",
        dateAdded: "2024-12-05",
        featured: true,
        likes: 34
      },
      {
        id: "f6",
        name: "Jovana T.",
        city: "Varaždin",
        rating: 5,
        text: "Kao dermatolog, često preporučujem FUNGOMAX pacijentima. Prirodni sastojci poput allantoina za regeneraciju i glicerina za hidrataciju čine čuda. Profesionalno rješenje.",
        verified: true,
        productUsed: "FUNGOMAX",
        dateAdded: "2024-12-02",
        featured: true,
        likes: 41
      }
    ]
  }
};
