import { Product } from '../../types';

// EU Products - Only 3 products available for Croatian and other EU markets
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
  }
};
