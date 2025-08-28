import { Product } from '../../types';

export const PRODUCTS: Record<string, Product> = {
  fungel: {
    id: 'fungel',
    name: 'FUNGEL',
    description: 'Prirodna formula koja podržava negu problematične kože. Smiruje iritacije i podržava obnovu oštećene kože. Pruža hidrataciju i pomaže u održavanju zdravlja kože. Pogodan za svakodnevnu upotrebu, čak i na osetljivoj koži. Bez parabena, veštačkih boja i mirisa, idealan je za prirodnu i bezbednu negu kože.',
    shortDescription: 'Prirodna formula za podršku u borbi protiv gljivičnih infekcija',
    purpose: 'Pomaže problematičnoj koži i noktima u borbi protiv gljivičnih infekcija',
    category: 'skincare',
    images: {
      main: '/images/products/fungel/fungel-box-and-product-mockup.png',
      gallery: [
        '/images/products/fungel/fungel-box-only.png',
        '/images/products/fungel/fungel-open-bottle.png',
        '/images/products/fungel/fungel-old-product-image.png'
      ],
      thumbnail: '/images/products/fungel/fungel-box-only.png',
      fallback: '/images/products/fungel/fungel-box-and-product-mockup.png'
    },
    variants: [
      {
        id: 'fungel-1pak',
        sku: 'FUNGEL',
        name: '1 PAKOVANJE (50ml)',
        size: 'Okvirno 2 nedelje upotrebe',
        quantity: 1,
        price: 2390,
        currency: 'RSD',
        discountPrice: 1990,
        isDefault: true
      },
      {
        id: 'fungel-2pak',
        sku: 'FUNGEL',
        name: '2 PAKOVANJA (100ml)',
        size: 'Okvirno mesec dana upotrebe',
        quantity: 2,
        price: 4780,
        currency: 'RSD',
        discountPrice: 3590
      },
      {
        id: 'fungel-3pak',
        sku: 'FUNGEL',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 2 meseca upotrebe',
        quantity: 3,
        price: 7170,
        currency: 'RSD',
        discountPrice: 4790
      }
    ],
    benefits: [
      'Podržava negu problematične kože',
      'Smiruje iritacije i podržava obnovu oštećene kože',
      'Pruža hidrataciju i pomaže u održavanju zdravlja kože',
      'Pogodan za svakodnevnu upotrebu, čak i na osetljivoj koži',
      'Bez parabena, veštačkih boja i mirisa',
      'Idealan za prirodnu i bezbednu negu kože',
      'Leave-on formula - ne ispira se, deluje kontinuirano',
      'Sadrži 6 lekovitih biljaka i 5 eteričnih ulja'
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
    usage: 'Nanositi 2 puta dnevno na problematične delove kože ili noktiju. Ne ispirati nakon nanošenja. Sadržaj: 50ml (dovoljno za 2 nedelje redovne upotrebe).',
    usageSteps: [
      'Očistite i osušite pogođeno mesto',
      'Nanesite tanak sloj FUNGEL-a na problematičnu kožu ili nokti',
      'Nežno umasirajte dok se potpuno ne upije',
      'Koristite 2 puta dnevno (ujutru i uveče)',
      'Ne ispirati nakon nanošenja - ostaviti da deluje',
      'Redovno koristiti najmanje 2-4 nedelje za najbolje rezultate'
    ],
    warnings: [
      'Samo za spoljašnju upotrebu',
      'Oprati ruke nakon upotrebe',
      'Ne koristiti na ranama',
      'Izbegavati kontakt sa očima',
      'Prestati sa upotrebom ako dođe do iritacije',
      'Čuvati na hladnom, suvom mestu',
      'Sadrži prirodne alergene iz eteričnih ulja',
      'Preporučuje se zaštita od sunca tokom upotrebe'
    ],
    slug: 'fungel',
    alternativeSlugs: ['fungel-promo', 'antifungal-gel', 'gljivice-stopala'],
    availableCountries: ['rs', 'ba'],
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
        answer: "Vrlo jednostavno! Nanositi 2 puta dnevno na problemske delove kože ili noktiju. Ne treba da se ispira - samo ostaviti da se upije. Jedna tubica od 50ml traje oko 2 nedelje pri redovnoj upotrebi.",
        category: "usage"
      },
      {
        question: "Kada ću videti prve rezultate?",
        answer: "Budite realni - pravi rezultati se vide nakon 2-4 nedelje redovne upotrebe. Svaka koža je drugačija, pa budite strpljivi i ne očekujte čuda preko noći!",
        category: "effects"
      },
      {
        question: "Da li je FUNGEL prirodan?",
        answer: "Da! Prirodna formula koja podržava negu problematične kože. Sadrži 6 lekovitih biljaka plus 5 eteričnih ulja. Bez parabena, veštačkih boja i mirisa - idealan za prirodnu i bezbednu negu.",
        category: "ingredients"
      },
      {
        question: "Da li je bezbedan za svakodnevnu upotrebu?",
        answer: "Apsolutno! FUNGEL je testiran i odobren za svakodnevnu upotrebu. Prirodni sastojci su blagi prema koži, a formula je pH balansirana.",
        category: "safety"
      },
      {
        question: "Mogu li ga koristiti ako imam osetljivu kožu?",
        answer: "FUNGEL sadrži prirodne sastojke, ali ako imate vrlo osetljivu kožu, preporučujemo da prvo testirate na maloj površini. Ako osećate bilo kakvu iritaciju, prestanite sa upotrebom.",
        category: "safety"
      },
      {
        question: "Kako da čuvam FUNGEL?",
        answer: "Čuvajte na hladnom, suvom mestu, daleko od dece. Zatvorite dobro nakon upotrebe. Rok trajanja je označen na pakovanju.",
        category: "storage"
      },
      {
        question: "Mogu li da koristim FUNGEL sa drugim kremovima?",
        answer: "Možete, ali sačekajte da se FUNGEL upije pre nanošenja drugih proizvoda. Takođe, preporučujemo zaštitu od sunca tokom korišćenja.",
        category: "usage"
      },
      {
        question: "Šta čini FUNGEL tako efikasnim?",
        answer: "Prirodna formula koja podržava negu problematične kože. Smiruje iritacije, podržava obnovu kože i pruža dugotrajnu hidrataciju. Sve prirodno, bez štetnih hemikalija!",
        category: "ingredients"
      }
    ],
    testimonials: [
      {
        id: "t1",
        name: "Marija S.",
        city: "Beograd",
        rating: 5,
        text: "Imala sam problem sa gljivicama na stopalima već mesecima. FUNGEL mi je pomogao za samo 10 dana! Krem se lako nanosi, ne maže i ima prijatan miris. Konačno mogu da nosim otvorene cipele bez stida.",
        verified: true,
        productUsed: "FUNGEL",
        dateAdded: "2024-12-15",
        featured: true,
        likes: 42
      },
      {
        id: "t2", 
        name: "Stefan M.",
        city: "Novi Sad",
        rating: 5,
        text: "Kao sportista, često imam problema sa kožom zbog znojenja. FUNGEL sa čajnim drvetom je bio prava stvar - prirodan, efikasan i bez hemikalija. Koristim ga već 2 meseca i rezultati su fantastični.",
        verified: true,
        productUsed: "FUNGEL",
        dateAdded: "2024-12-10",
        featured: true,
        likes: 38
      },
      {
        id: "t3",
        name: "Ana P.",
        city: "Niš", 
        rating: 5,
        text: "Moja kćerka je imala problematičnu kožu oko noktiju. Probali smo mnoge proizvode, ali FUNGEL je jedini koji je stvarno pomogao. Prirodni sastojci su mi bili važni jer je reč o detetu. Preporučujem!",
        verified: true,
        productUsed: "FUNGEL",
        dateAdded: "2024-12-08",
        featured: true,
        likes: 35
      },
      {
        id: "t4",
        name: "Petar J.",
        city: "Kragujevac",
        rating: 4,
        text: "Dobar proizvod, radi postepeno ali sigurno. Trebalo mi je oko 3 nedelje da vidim punu promenu, ali vredi čekanja. Cena je prihvatljiva za kvalitet koji dobijate.",
        verified: true,
        productUsed: "FUNGEL", 
        dateAdded: "2024-12-05",
        featured: false,
        likes: 28
      },
      {
        id: "t5",
        name: "Milica R.",
        city: "Subotica",
        rating: 5,
        text: "Radim u vlažnoj sredini i često imam problema sa kožom na rukama. FUNGEL mi je ne samo rešio problem, već i učinio kožu mekšom i zdravijom. Sada ga koristim preventivno.",
        verified: true,
        productUsed: "FUNGEL",
        dateAdded: "2024-12-03",
        featured: true,
        likes: 31
      },
      {
        id: "t6",
        name: "Aleksandar T.",
        city: "Pančevo", 
        rating: 5,
        text: "Skeptičan sam bio prema prirodnim proizvodima, ali FUNGEL me je pozitivno iznenadio. Brzo deluje, nema neželjenih efekata i stvarno pomaže. Već sam preporučio trojici prijatelja.",
        verified: true,
        productUsed: "FUNGEL",
        dateAdded: "2024-12-01",
        featured: false,
        likes: 25
      },
      {
        id: "t7",
        name: "Jovana M.",
        city: "Zemun",
        rating: 5,
        text: "Kao kozmetolog, često preporučujem FUNGEL svojim klijentima. Prirodni sastojci poput nevena i čajnog drveta čine čuda za problematičnu kožu. Profesionalno i efikasno rešenje.",
        verified: true,
        productUsed: "FUNGEL",
        dateAdded: "2024-11-28",
        featured: true,
        likes: 39
      },
      {
        id: "t8",
        name: "Nikola D.",
        city: "Valjevo",
        rating: 4,
        text: "Koristim FUNGEL već mesec dana. Rezultati su vidljivi, koža je zdravija i nema više iritacije. Jedino što bih voleo da pakovanje bude veće jer se brzo potroši.",
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
    description: 'Prirodna formula koja podržava negu osetljive kože. Smiruje crvenilo, svrab i iritacije, dok podržava regeneraciju oštećene kože. Pruža zaštitu od spoljašnjih uticaja i doprinosi dugotrajnoj hidrataciji. Pogodan je za svakodnevnu upotrebu, čak i za najosetljiviju kožu. Bez parabena, veštačkih boja i mirisa, ovaj melem je idealan izbor za prirodnu i bezbednu negu kože.',
    shortDescription: 'Prirodna formula za podršku u borbi protiv ekcema i psorijaze - 50ml',
    purpose: 'Pomaže osetljivoj koži u borbi protiv ekcema i psorijaze',
    category: 'skincare',
    images: {
      main: '/images/products/biomelis/biomelis-box-and-product-mockup.png',
      gallery: [
        '/images/products/biomelis/biomelis-box-only.png',
        '/images/products/biomelis/biomelis-open-bottle.png',
        '/images/products/biomelis/biomelis-old-product-image.png'
      ],
      thumbnail: '/images/products/biomelis/biomelis-box-only.png',
      fallback: '/images/products/biomelis/biomelis-box-and-product-mockup.png'
    },
    variants: [
      {
        id: 'biomelis-1pak',
        sku: 'BIOMELIS',
        name: '1 PAKOVANJE (50ml)',
        size: 'Okvirno 2 nedelje upotrebe',
        quantity: 1,
        price: 2390,
        currency: 'RSD',
        discountPrice: 1990,
        isDefault: true
      },
      {
        id: 'biomelis-2pak',
        sku: 'BIOMELIS',
        name: '2 PAKOVANJA (100ml)',
        size: 'Okvirno mesec dana upotrebe',
        quantity: 2,
        price: 4780,
        currency: 'RSD',
        discountPrice: 3590
      },
      {
        id: 'biomelis-3pak',
        sku: 'BIOMELIS',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 2 meseca upotrebe',
        quantity: 3,
        price: 7170,
        currency: 'RSD',
        discountPrice: 4790
      }
    ],
    benefits: [
      'Podržava negu osetljive kože',
      'Smiruje crvenilo, svrab i iritacije',
      'Podržava regeneraciju oštećene kože',
      'Pruža zaštitu od spoljašnjih uticaja i dugotrajnu hidrataciju',
      'Pogodan za svakodnevnu upotrebu, čak i za najosetljiviju kožu',
      'Bez parabena, veštačkih boja i mirisa',
      'Idealan izbor za prirodnu i bezbednu negu kože',
      'Sadrži 8 lekovitih biljaka i 5 eteričnih ulja'
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
    usage: 'Nanositi 2 puta dnevno na pogođene delove kože i nežno masirati. Ne ispirati nakon nanošenja. Sadržaj: 50ml (dovoljno za 2 nedelje redovne upotrebe).',
    usageSteps: [
      'Očistite kožu blagim sapunom i osušite',
      'Nanesite malu količinu BIOMELIS-a na pogođeno mesto',
      'Nežno umasirajte kružnim pokretima dok se ne upije',
      'Koristite 2-3 puta dnevno ili prema potrebi',
      'Za najbolje rezultate koristiti redovno 3-4 nedelje',
      'Može se koristiti i preventivno na osetljivim delovima kože'
    ],
    warnings: [
      'Samo za spoljašnju upotrebu',
      'Nanositi samo na zdravu kožu',
      'Izbegavati kontakt sa očima',
      'U slučaju kontakta sa očima isprati vodom',
      'Prestati sa upotrebom ako dođe do iritacije',
      'Čuvati na hladnom, suvom mestu',
      'Sadrži prirodne alergene iz eteričnih ulja (Limonene, Linalool)',
      'U slučaju iritacije konsultovati lekara'
    ],
    slug: 'biomelis',
    alternativeSlugs: ['biomelis-melem', 'ekcem-psorijaza', 'osetljiva-koza'],
    availableCountries: ['rs', 'ba'],
    seoTitle: 'BIOMELIS - Prirodna podrška protiv ekcema i psorijaze | DERMOTIN',
    seoDescription: 'BIOMELIS od DERMOTIN brenda - prirodna formula koja podržava negu osetljive kože. Smiruje crvenilo, svrab i iritacije. 8 biljnih ekstrakata, bez parabena. 50ml.',
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
        answer: "Vrlo jednostavno! Nanositi 2 puta dnevno na očišćenu kožu i nežno masirati. Ne treba da se ispira - samo ostaviti da se upije. Jedna tuba od 50ml traje oko 2 nedelje pri redovnoj upotrebi.",
        category: "usage"
      },
      {
        question: "Kada ću videti prve rezultate?",
        answer: "Budite realni - pravi rezultati se vide nakon 2-4 nedelje redovne upotrebe. Svaka koža je drugačija, pa budite strpljivi i ne očekujte čuda preko noći!",
        category: "effects"
      },
      {
        question: "Da li je BIOMELIS prirodan?",
        answer: "Da! Prirodna formula koja može pomoći u negi osetljive kože. Sadrži 8 lekovitih biljaka plus 5 eteričnih ulja. Bez parabena, veštačkih boja i mirisa - idealan za prirodnu i bezbednu negu.",
        category: "ingredients"
      },
      {
        question: "Da li je bezbedan za osetljivu kožu?",
        answer: "Apsolutno! BIOMELIS je kreiran za najosetljivu kožu. Pogodan za svakodnevnu upotrebu, čak i za najdelikatniju kožu. Bez parabena i veštačkih dodataka.",
        category: "safety"
      },
      {
        question: "Pomaže li kod osetljive kože?",
        answer: "BIOMELIS podržava negu osetljive kože. Smiruje crvenilo, svrab i iritacije, dok podržava regeneraciju oštećene kože.",
        category: "effects"
      },
      {
        question: "Kako da čuvam BIOMELIS?",
        answer: "Čuvajte na hladnom, suvom mestu, daleko od dece. Zatvorite dobro nakon upotrebe. Rok trajanja je označen na pakovanju.",
        category: "storage"
      },
      {
        question: "Da li mogu da koristim BIOMELIS sa drugim proizvodima?",
        answer: "Možete, ali sačekajte da se BIOMELIS upije pre nanošenja drugih proizvoda. Zbog prirodnih sastojaka, preporučujemo da testirate na maloj površini prvo.",
        category: "usage"
      },
      {
        question: "Šta čini BIOMELIS posebnim?",
        answer: "Prirodna formula koja može da smiri crvenilo, svrab i iritacije. Pruža zaštitu od spoljašnjih uticaja i dugotrajnu hidrataciju. Bez parabena i veštačkih dodataka - čisto prirodno!",
        category: "ingredients"
      }
    ],
    testimonials: [
      {
        id: "b1",
        name: "Jelena M.",
        city: "Beograd",
        rating: 5,
        text: "BIOMELIS mi je spasio kožu! Imala sam hronične probleme sa ekcemom i ništa nije pomagalo. Nakon 3 nedelje korišćenja, koža mi je konačno mirna i zdrava. Prirodni sastojci su ono što sam tražila.",
        verified: true,
        productUsed: "BIOMELIS",
        dateAdded: "2024-12-14",
        featured: true,
        likes: 45
      },
      {
        id: "b2",
        name: "Miloš P.",
        city: "Novi Sad",
        rating: 5,
        text: "Kao neko ko se bori sa psorijazom godinama, mogu reći da je BIOMELIS najbolji proizvod koji sam probao. Smiruje svrab i crvenilo, a koža postaje mekša. Preporučujem svima!",
        verified: true,
        productUsed: "BIOMELIS",
        dateAdded: "2024-12-11",
        featured: true,
        likes: 41
      },
      {
        id: "b3",
        name: "Dragana S.",
        city: "Kragujevac",
        rating: 5,
        text: "Moj sin ima atopijski dermatitis i BIOMELIS je jedini proizvod koji mu stvarno pomaže. Prirodan je, bez hemikalija, a rezultati su vidljivi već nakon nedelju dana korišćenja.",
        verified: true,
        productUsed: "BIOMELIS",
        dateAdded: "2024-12-09",
        featured: true,
        likes: 37
      },
      {
        id: "b4",
        name: "Nenad J.",
        city: "Niš",
        rating: 4,
        text: "Koristim BIOMELIS već mesec dana za problematičnu kožu na rukama. Vidim poboljšanje, manje je iritacije i crvenila. Trebalo mi je malo vremena, ali vredi.",
        verified: true,
        productUsed: "BIOMELIS",
        dateAdded: "2024-12-06",
        featured: false,
        likes: 29
      },
      {
        id: "b5",
        name: "Marija K.",
        city: "Subotica",
        rating: 5,
        text: "Imala sam osetljivu kožu koja je reagovala na sve. BIOMELIS je bio blag i efikasan - konačno proizvod koji ne izaziva dodatne iritacije. Koža mi je sada zdrava i hidratisana.",
        verified: true,
        productUsed: "BIOMELIS",
        dateAdded: "2024-12-04",
        featured: true,
        likes: 33
      },
      {
        id: "b6",
        name: "Stefan R.",
        city: "Čačak",
        rating: 5,
        text: "Kao dermatolog, često preporučujem BIOMELIS pacijentima sa osetljivom kožom. Prirodni sastojci poput nevena i lavande čine čuda. Profesionalno i efikasno rešenje za problematičnu kožu.",
        verified: true,
        productUsed: "BIOMELIS",
        dateAdded: "2024-12-01",
        featured: true,
        likes: 40
      },
      {
        id: "b7",
        name: "Ana T.",
        city: "Pančevo",
        rating: 4,
        text: "Koristim BIOMELIS već 6 nedelja za ekcem na laktovima. Rezultati su postepeni ali sigurni. Koža je manje suva i iritirana. Jedino što bih volela je veće pakovanje.",
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
        text: "Moja beba ima vrlo osetljivu kožu i BIOMELIS je jedini proizvod koji ne izaziva alergijske reakcije. Blag je, prirodan i stvarno pomaže kod crvenih fleka. Mama preporučuje!",
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
        city: "Valjevo",
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
        text: "Koristim BIOMELIS za psorijazu na kolenima. Vidim poboljšanje nakon mesec dana - manje je ljuskanja i svrab je skoro nestao. Prirodan pristup koji funkcioniše.",
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
        text: "Kao kozmetičar, često vidim probleme sa osetljivom kožom. BIOMELIS preporučujem klijentima jer je prirodan i efikasan. Rezultati su vidljivi već nakon 2 nedelje redovne upotrebe.",
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
        text: "Moja žena ima hronični ekcem i probali smo sve. BIOMELIS je konačno doneo olakšanje - koža joj je mirna, bez svrab i crvenila. Cela porodica je zadovoljna rezultatom!",
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
        text: "Radim kao medicinska sestra i često imam problema sa suvom kožom na rukama. BIOMELIS mi pomaže da održim kožu zdravom i hidratisanom. Preporučujem kolegama!",
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
        text: "Imam osetljivu kožu koja reaguje na mnoge proizvode. BIOMELIS je bio izuzetak - blag, prirodan i efikasan. Trebalo mi je 3 nedelje da vidim punu promenu, ali vredi čekanja.",
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
    description: 'Prirodna pomoć u borbi protiv virusnih bradavica. Ubrzava proces regeneracije kože pogođene virusnim bradavicama. Pruža zaštitu od iritacija i ubrzava zarastanje kože. Pogodan za svakodnevnu upotrebu, čak i na osetljivoj koži. Bez parabena, veštačkih boja i mirisa, idealan je za prirodnu i bezbednu negu kože.',
    shortDescription: 'Prirodna pomoć u borbi protiv virusnih bradavica',
    purpose: 'Podržava regeneraciju kože pogođene virusnim bradavicama',
    category: 'skincare',
    slug: 'biowart',
    alternativeSlugs: [],
    availableCountries: ['rs', 'ba'],
    seoTitle: 'BIOWART - Prirodna pomoć protiv virusnih bradavica | DERMOTIN',
    seoDescription: 'BIOWART od DERMOTIN brenda - prirodna formula sa 6 biljnih ekstrakata i 7 eteričnih ulja za negu kože pogođene virusnim bradavicama. Bez parabena, pogodan za osetljivu kožu. 50ml.',
    urgencyElements: {
      limitedStock: 15,
      limitedTime: '24h',
      socialProof: {
        recentPurchases: 23,
        timeFrame: 'poslednja 24h'
      }
    },
    images: {
      main: '/images/products/biowart/biowart-box-and-product-mockup.png',
      gallery: [
        '/images/products/biowart/biowart-box-only.png',
        '/images/products/biowart/biowart-open-bottle.png',
        '/images/products/biowart/biowart-old-product-image.png'
      ],
      thumbnail: '/images/products/biowart/biowart-box-only.png',
      fallback: '/images/products/biowart/biowart-box-and-product-mockup.png'
    },
    variants: [
      {
        id: 'biowart-1pak',
        sku: 'BIOWART',
        name: '1 PAKOVANJE (50ml)',
        size: 'Okvirno 2 nedelje upotrebe',
        quantity: 1,
        price: 2390,
        currency: 'RSD',
        discountPrice: 1990,
        isDefault: true
      },
      {
        id: 'biowart-2pak',
        sku: 'BIOWART',
        name: '2 PAKOVANJA (100ml)',
        size: 'Okvirno mesec dana upotrebe',
        quantity: 2,
        price: 4780,
        currency: 'RSD',
        discountPrice: 3590
      },
      {
        id: 'biowart-3pak',
        sku: 'BIOWART',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 2 meseca upotrebe',
        quantity: 3,
        price: 7170,
        currency: 'RSD',
        discountPrice: 4790
      }
    ],
    benefits: [
      'Podržava regeneraciju kože pogođene virusnim bradavicama',
      'Smiruje iritacije i ubrzava zarastanje kože',
      'Pruža zaštitu od spoljašnjih uticaja',
      'Pogodan za svakodnevnu upotrebu, čak i na osetljivoj koži',
      'Bez parabena, veštačkih boja i mirisa',
      'Idealan za prirodnu i bezbednu negu kože',
      'Leave-on formula - ne ispira se, deluje kontinuirano',
      'Sadrži 6 lekovitih biljaka i 7 eteričnih ulja'
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
      'U slučaju preosetljivosti ili alergijske reakcije, prekinuti upotrebu i konsultovati se sa lekarom',
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
        answer: 'BIOWART sadrži 6 lekovitih biljaka (rus, neven, hajdučka trava, žalfija, kantarion, ivanjsko cveće, hrastova kora) i 7 eteričnih ulja (žalfija, eukaliptus, nana, karanfilić, timijan, anis, limun), obogaćen vitaminima A, E i B5.',
        category: 'ingredients'
      },
      {
        question: 'Da li je BIOWART bezbedan za upotrebu?',
        answer: 'Da, BIOWART je EU-kompatibilan kozmetički proizvod koji je prošao sve potrebne testove bezbednosti. Bez parabena, veštačkih boja i mirisa. Pogodan za svakodnevnu upotrebu.',
        category: 'safety'
      },
      {
        question: 'Za koje tipove kože je pogodan BIOWART?',
        answer: 'BIOWART je pogodan za sve tipove kože, uključujući i osetljivu kožu. Formula je posebno dizajnirana za negu kože pogođene virusnim bradavicama.',
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
    description: 'Prirodna podrška za ublažavanje iritacije i nelagodnosti kože analnog područja. Smiruje osećaj svraba, pečenja i nelagodnosti. Podržava regeneraciju osetljive kože uz održavanje hidratacije. Stvara nežnu zaštitnu barijeru protiv spoljašnjih faktora. Pogodan za svakodnevnu upotrebu, čak i na osetljivoj i iritiranoj koži. Bez parabena, veštačkih boja i mirisa - prirodan i bezbedan izbor za negu kože.',
    shortDescription: 'Prirodna podrška za ublažavanje iritacije kože analnog područja',
    purpose: 'Pomaže u nezi i zaštiti osetljive kože analnog područja',
    category: 'skincare',
    slug: 'bioroid',
    alternativeSlugs: [],
    availableCountries: ['rs', 'ba'],
    seoTitle: 'BIOROID - Prirodna podrška za negu analne kože | DERMOTIN',
    seoDescription: 'BIOROID od DERMOTIN brenda - prirodna formula sa biljnim ekstraktima za negu osetljive kože analnog područja. Smiruje iritacije, podržava regeneraciju. Bez parabena. 50ml.',
    urgencyElements: {
      limitedStock: 12,
      limitedTime: '24h',
      socialProof: {
        recentPurchases: 18,
        timeFrame: 'poslednja 24h'
      }
    },
    images: {
      main: '/images/products/bioroid/bioroid-box-and-product-mockup.png',
      gallery: [
        '/images/products/bioroid/bioroid-box-only.png',
        '/images/products/bioroid/bioroid-open-bottle.png',
        '/images/products/bioroid/bioroid-old-product-image.png'
      ],
      thumbnail: '/images/products/bioroid/bioroid-box-only.png',
      fallback: '/images/products/bioroid/bioroid-box-and-product-mockup.png'
    },
    variants: [
      {
        id: 'bioroid-1pak',
        sku: 'BIOROID',
        name: '1 PAKOVANJE (50ml)',
        size: 'Okvirno 2 nedelje upotrebe',
        quantity: 1,
        price: 2990,
        currency: 'RSD',
        discountPrice: 1990,
        isDefault: true
      },
      {
        id: 'bioroid-2pak',
        sku: 'BIOROID',
        name: '2 PAKOVANJA (100ml)',
        size: 'Okvirno mesec dana upotrebe',
        quantity: 2,
        price: 5980,
        currency: 'RSD',
        discountPrice: 3590
      },
      {
        id: 'bioroid-3pak',
        sku: 'BIOROID',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 2 meseca upotrebe',
        quantity: 3,
        price: 8970,
        currency: 'RSD',
        discountPrice: 4790
      }
    ],
    benefits: [
      'Smiruje osećaj svraba, pečenja i nelagodnosti',
      'Podržava regeneraciju osetljive kože uz održavanje hidratacije',
      'Stvara nežnu zaštitnu barijeru protiv spoljašnjih faktora',
      'Pogodan za svakodnevnu upotrebu, čak i na osetljivoj koži',
      'Bez parabena, veštačkih boja i mirisa',
      'Prirodan i bezbedan izbor za negu kože',
      'Dugotrajno umirujući i osvežavajući osećaj',
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
      'Ne koristiti ukoliko ste preosetljivi na bilo koji od sastojaka',
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
        question: 'Da li je BIOROID bezbedan za dugotrajnu upotrebu?',
        answer: 'Da, BIOROID je kozmetički proizvod na biljnoj osnovi pogodan za kontinuiranu svakodnevnu upotrebu. Bez parabena, veštačkih boja i mirisa.',
        category: 'safety'
      },
      {
        question: 'Da li se može koristiti na osetljivoj koži?',
        answer: 'Da, formula je posebno dizajnirana za nežnu kožu analnog područja i pogodna je za osetljivu kožu.',
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
        city: "Beograd",
        rating: 5,
        text: "BIOROID mi je stvarno pomogao sa svakodnevnom nelagodnošću. Prirodni sastojci su mi bili važni, a krema je nežna i efikasna. Koristim je već mesec dana bez problema.",
        verified: true,
        productUsed: "BIOROID",
        dateAdded: "2024-12-15",
        featured: true,
        likes: 42
      },
      {
        id: "bioroid_t2",
        name: "Jelena P.",
        city: "Niš",
        rating: 5,
        text: "Kao neko ko ima osetljivu kožu, BIOROID je bio pravo rešenje. Nema jakih mirisa, ne iritira, a stvarno pomaže. Preporučujem svima koji traže prirodno rešenje.",
        verified: true,
        productUsed: "BIOROID",
        dateAdded: "2024-12-10",
        featured: true,
        likes: 35
      },
      {
        id: "bioroid_t3",
        name: "Stefan M.",
        city: "Novi Sad",
        rating: 4,
        text: "Dobra krema za svakodnevnu upotrebu. Smiruje iritacije i ima prijatan osvežavajući osećaj. Cena je razumna za kvalitet koji dobijate.",
        verified: true,
        productUsed: "BIOROID",
        dateAdded: "2024-12-12",
        featured: false,
        likes: 28
      },
      {
        id: "bioroid_t4",
        name: "Ana T.",
        city: "Subotica",
        rating: 5,
        text: "Prirodni sastojci poput nevena i kamilice čine čuda za osetljivu kožu. BIOROID je nežan, efikasan i bez neželjenih efekata. Već sam preporučila prijateljicama.",
        verified: true,
        productUsed: "BIOROID",
        dateAdded: "2024-12-05",
        featured: true,
        likes: 38
      }
    ]
  }
};
