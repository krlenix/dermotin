import { Product } from '../../types';

export const PRODUCTS: Record<string, Product> = {
  fungel: {
    id: 'fungel',
    name: 'FUNGEL',
    description: 'Prirodna formula koja podržava njegu problematične kože. Smiruje iritacije i podržava obnovu oštećene kože. Pruža hidrataciju i pomaže u održavanju zdravlja kože. Pogodan za svakodnevnu upotrebu, čak i na osjetljivoj koži. Bez parabena, veštačkih boja i mirisa, idealan je za prirodnu i bezbjednu njegu kože.',
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
        size: 'Okvirno 2 sedmice upotrebe',
        quantity: 1,
        price: 39.9,
        currency: 'BAM',
        discountPrice: 33.9,
        isDefault: true
      },
      {
        id: 'fungel-2pak',
        sku: 'FUNGEL',
        name: '2 PAKOVANJA (100ml)',
        size: 'Okvirno mjesec dana upotrebe',
        quantity: 2,
        price: 79.8,
        currency: 'BAM',
        discountPrice: 59.9
      },
      {
        id: 'fungel-3pak',
        sku: 'FUNGEL',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 2 mjeseca upotrebe',
        quantity: 3,
        price: 119.7,
        currency: 'BAM',
        discountPrice: 79.9
      }
    ],
    benefits: [
      'Podržava njegu problematične kože',
      'Smiruje iritacije i podržava obnovu oštećene kože',
      'Pruža hidrataciju i pomaže u održavanju zdravlja kože',
      'Pogodan za svakodnevnu upotrebu, čak i na osjetljivoj koži',
      'Bez parabena, veštačkih boja i mirisa',
      'Idealan za prirodnu i bezbjednu njegu kože',
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
    usage: 'Nanositi 2 puta dnevno na problematične dijelove kože ili noktiju. Ne ispirati nakon nanošenja. Sadržaj: 50ml (dovoljno za 2 sedmice redovne upotrebe).',
    usageSteps: [
      'Očistite i osušite pogođeno mjesto',
      'Nanesite tanak sloj FUNGEL-a na problematičnu kožu ili nokte',
      'Nežno umasirajte dok se potpuno ne upije',
      'Koristite 2 puta dnevno (ujutru i navečer)',
      'Ne ispirati nakon nanošenja - ostaviti da djeluje',
      'Redovno koristiti najmanje 2-4 sedmice za najbolje rezultate'
    ],
    warnings: [
      'Samo za spoljašnju upotrebu',
      'Oprati ruke nakon upotrebe',
      'Ne koristiti na ranama',
      'Izbegavati kontakt sa očima',
      'Prestati sa upotrebom ako dođe do iritacije',
      'Čuvati na hladnom, suhom mjestu',
      'Sadrži prirodne alergene iz eteričnih ulja',
      'Preporučuje se zaštita od sunca tokom upotrebe'
    ],
    slug: 'fungel',
    alternativeSlugs: ['fungel-promo', 'antifungal-gel', 'gljivice-stopala'],
    availableCountries: ['rs', 'ba'],
    seoTitle: 'FUNGEL - Emulzija za kožu sa 6 biljnih ekstrakata + 5 eteričnih ulja | DERMOTIN',
    seoDescription: 'FUNGEL od DERMOTIN brenda kombinuje 6 biljnih ekstrakata sa 5 eteričnih ulja (čajno drvo, origano). Obogaćena panthenolom, vitaminima A&E. Prirodna njega problematične kože i noktiju. 50ml.',
    urgencyElements: {
      limitedStock: 47,
      limitedTime: '24h',
      socialProof: {
        recentPurchases: 127,
        timeFrame: 'posljednja 24h'
      }
    },
    productFAQ: [
      {
        question: "Kako se koristi FUNGEL?",
        answer: "Vrlo jednostavno! Nanositi 2 puta dnevno na problemske dijelove kože ili noktiju. Ne treba da se ispira - samo ostaviti da se upije. Jedna tubica od 50ml traje oko 2 sedmice pri redovnoj upotrebi.",
        category: "usage"
      },
      {
        question: "Kada ću vidjeti prve rezultate?",
        answer: "Budite realni - pravi rezultati se vide nakon 2-4 sedmice redovne upotrebe. Svaka koža je drugačija, pa budite strpljivi i ne očekujte čuda preko noći!",
        category: "effects"
      },
      {
        question: "Da li je FUNGEL prirodan?",
        answer: "Da! Prirodna formula koja podržava njegu problematične kože. Sadrži 6 ljekovitih biljaka plus 5 eteričnih ulja. Bez parabena, veštačkih boja i mirisa - idealan za prirodnu i bezbjednu njegu.",
        category: "ingredients"
      },
      {
        question: "Da li je bezbedan za svakodnevnu upotrebu?",
        answer: "Apsolutno! FUNGEL je testiran i odobren za svakodnevnu upotrebu. Prirodni sastojci su blagi prema koži, a formula je pH balansirana.",
        category: "safety"
      },
      {
        question: "Mogu li ga koristiti ako imam osjetljivu kožu?",
        answer: "FUNGEL sadrži prirodne sastojke, ali ako imate vrlo osjetljivu kožu, preporučujemo da prvo testirate na maloj površini. Ako osjećate bilo kakvu iritaciju, prestanite sa upotrebom.",
        category: "safety"
      },
      {
        question: "Kako da čuvam FUNGEL?",
        answer: "Čuvajte na hladnom, suhom mjestu, daleko od djece. Zatvorite dobro nakon upotrebe. Rok trajanja je označen na pakovanju.",
        category: "storage"
      },
      {
        question: "Mogu li da koristim FUNGEL sa drugim kremovima?",
        answer: "Možete, ali sačekajte da se FUNGEL upije prije nanošenja drugih proizvoda. Također, preporučujemo zaštitu od sunca tokom korišćenja.",
        category: "usage"
      },
      {
        question: "Šta čini FUNGEL tako efikasnim?",
        answer: "Prirodna formula koja podržava njegu problematične kože. Smiruje iritacije, podržava obnovu kože i pruža dugotrajnu hidrataciju. Sve prirodno, bez štetnih kemikalija!",
        category: "ingredients"
      }
    ],
    testimonials: [
      {
        id: "ba1",
        name: "Amela H.",
        city: "Sarajevo",
        rating: 5,
        text: "FUNGEL mi je pomogao kada ništa drugo nije. Imala sam hronične probleme sa kožom i ovaj prirodni proizvod je konačno donio olakšanje. Preporučujem svima koji traže efikasno rešenje.",
        verified: true,
        productUsed: "FUNGEL",
        dateAdded: "2024-12-12",
        featured: true,
        likes: 43
      },
      {
        id: "ba2",
        name: "Emir K.",
        city: "Tuzla",
        rating: 5,
        text: "Kao čovjek koji radi fizički posao, često imam problema sa kožom na rukama. FUNGEL sa čajnim drvetom i origanom je bio prava stvar. Prirodan, bez kemikalija i stvarno efikasan.",
        verified: true,
        productUsed: "FUNGEL",
        dateAdded: "2024-12-09",
        featured: true,
        likes: 39
      },
      {
        id: "ba3",
        name: "Selma B.",
        city: "Zenica",
        rating: 5,
        text: "Moj sin je imao problematičnu kožu oko noktiju. FUNGEL je jedini proizvod koji je stvarno pomogao. Prirodni sastojci su mi bili važni, a rezultati su vidljivi već nakon nedelju dana.",
        verified: true,
        productUsed: "FUNGEL",
        dateAdded: "2024-12-06",
        featured: true,
        likes: 36
      },
      {
        id: "ba4",
        name: "Adnan M.",
        city: "Banja Luka",
        rating: 4,
        text: "Dobar proizvod, radi postupno ali sigurno. Trebalo mi je oko tri sedmice da vidim potpunu promjenu, ali vrijedi čekanja. Cijena je prihvatljiva za kvalitet.",
        verified: true,
        productUsed: "FUNGEL",
        dateAdded: "2024-12-03",
        featured: false,
        likes: 30
      },
      {
        id: "ba5",
        name: "Lejla S.",
        city: "Mostar",
        rating: 5,
        text: "Radim u vlažnoj sredini i često imam problema sa kožom. FUNGEL mi je ne samo riješio problem, već i učinio kožu mekšom i zdravijom. Sada ga koristim preventivno.",
        verified: true,
        productUsed: "FUNGEL",
        dateAdded: "2024-11-30",
        featured: true,
        likes: 33
      },
      {
        id: "ba6",
        name: "Mirsad J.",
        city: "Bijeljina",
        rating: 5,
        text: "Skeptičan sam bio prema prirodnim proizvodima, ali FUNGEL me pozitivno iznenadio. Brzo djeluje, nema neželjenih efekata i stvarno pomaže. Već sam preporučio dvojici prijatelja.",
        verified: true,
        productUsed: "FUNGEL",
        dateAdded: "2024-11-27",
        featured: false,
        likes: 27
      }
    ]
  },

  biomelis: {
    id: 'biomelis',
    name: 'BIOMELIS',
    description: 'Prirodna formula koja podržava njegu osjetljive kože. Smiruje crvenilo, svrab i iritacije, dok podržava regeneraciju oštećene kože. Pruža zaštitu od spoljašnjih uticaja i doprinosi dugotrajnoj hidrataciji. Pogodan je za svakodnevnu upotrebu, čak i za najosjetljiviju kožu. Bez parabena, veštačkih boja i mirisa, ovaj melem je idealan izbor za prirodnu i bezbjednu njegu kože.',
    shortDescription: 'Prirodna formula za podršku u borbi protiv ekcema i psorijaze - 50ml',
    purpose: 'Pomaže osjetljivoj koži u borbi protiv ekcema i psorijaze',
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
        size: 'Okvirno 2 sedmice upotrebe',
        quantity: 1,
        price: 39.9,
        currency: 'BAM',
        discountPrice: 33.9,
        isDefault: true
      },
      {
        id: 'biomelis-2pak',
        sku: 'BIOMELIS',
        name: '2 PAKOVANJA (100ml)',
        size: 'Okvirno mjesec dana upotrebe', 
        quantity: 2,
        price: 79.8,
        currency: 'BAM',
        discountPrice: 59.9
      },
      {
        id: 'biomelis-3pak',
        sku: 'BIOMELIS',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 2 mjeseca upotrebe',
        quantity: 3,
        price: 119.7,
        currency: 'BAM',
        discountPrice: 79.9
      }
    ],
    benefits: [
      'Podržava njegu osjetljive kože',
      'Smiruje crvenilo, svrab i iritacije',
      'Podržava regeneraciju oštećene kože',
      'Pruža zaštitu od spoljašnjih uticaja i dugotrajnu hidrataciju',
      'Pogodan za svakodnevnu upotrebu, čak i za najosjetljiviju kožu',
      'Bez parabena, veštačkih boja i mirisa',
      'Idealan izbor za prirodnu i bezbjednu njegu kože',
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
    usage: 'Nanositi 2 puta dnevno na pogođene dijelove kože i nežno masirati. Ne ispirati nakon nanošenja. Sadržaj: 50ml (dovoljno za 2 sedmice redovne upotrebe).',
    usageSteps: [
      'Očistite kožu blagim sapunom i osušite',
      'Nanesite malu količinu BIOMELIS-a na pogođeno mjesto',
      'Nežno umasirajte kružnim pokretima dok se ne upije',
      'Koristite 2-3 puta dnevno ili prema potrebi',
      'Za najbolje rezultate koristiti redovno 3-4 sedmice',
      'Može se koristiti i preventivno na osjetljivim dijelovima kože'
    ],
    warnings: [
      'Samo za spoljašnju upotrebu',
      'Nanositi samo na zdravu kožu',
      'Izbegavati kontakt sa očima',
      'U slučaju kontakta sa očima isprati vodom',
      'Prestati sa upotrebom ako dođe do iritacije',
      'Čuvati na hladnom, suhom mjestu',
      'Sadrži prirodne alergene iz eteričnih ulja (Limonene, Linalool)',
      'U slučaju iritacije konsultovati ljekara'
    ],
    slug: 'biomelis',
    alternativeSlugs: ['biomelis-melem', 'ekcem-psorijaza', 'osjetljiva-koza'],
    availableCountries: ['rs', 'ba'],
    seoTitle: 'BIOMELIS - Prirodna podrška protiv ekcema i psorijaze | DERMOTIN',
    seoDescription: 'BIOMELIS od DERMOTIN brenda - prirodna formula koja podržava njegu osjetljive kože. Smiruje crvenilo, svrab i iritacije. 8 biljnih ekstrakata, bez parabena. 50ml.',
    urgencyElements: {
      limitedStock: 32,
      limitedTime: '24h',
      socialProof: {
        recentPurchases: 89,
        timeFrame: 'posljednja 24h'
      }
    },
    productFAQ: [
      {
        question: "Kako se koristi BIOMELIS?",
        answer: "Vrlo jednostavno! Nanositi 2 puta dnevno na očišćenu kožu i nežno masirati. Ne treba da se ispira - samo ostaviti da se upije. Jedna tuba od 50ml traje oko 2 sedmice pri redovnoj upotrebi.",
        category: "usage"
      },
      {
        question: "Kada ću vidjeti prve rezultate?",
        answer: "Budite realni - pravi rezultati se vide nakon 2-4 sedmice redovne upotrebe. Svaka koža je drugačija, pa budite strpljivi i ne očekujte čuda preko noći!",
        category: "effects"
      },
      {
        question: "Da li je BIOMELIS prirodan?",
        answer: "Da! Prirodna formula koja podržava njegu osjetljive kože. Sadrži 8 ljekovitih biljaka plus 5 eteričnih ulja. Bez parabena, veštačkih boja i mirisa - idealan za prirodnu i bezbjednu njegu.",
        category: "ingredients"
      },
      {
        question: "Da li je bezbedan za osjetljivu kožu?",
        answer: "Apsolutno! BIOMELIS je kreiran za najosjetljiviju kožu. Pogodan za svakodnevnu upotrebu, čak i za najdelikatniju kožu. Bez parabena i veštačkih dodataka.",
        category: "safety"
      },
      {
        question: "Pomaže li kod osjetljive kože?",
        answer: "BIOMELIS podržava njegu osjetljive kože. Smiruje crvenilo, svrab i iritacije, dok podržava regeneraciju oštećene kože.",
        category: "effects"
      },
      {
        question: "Kako da čuvam BIOMELIS?",
        answer: "Čuvajte na hladnom, suhom mjestu, daleko od djece. Zatvorite dobro nakon upotrebe. Rok trajanja je označen na pakovanju.",
        category: "storage"
      },
      {
        question: "Da li mogu da koristim BIOMELIS sa drugim proizvodima?",
        answer: "Možete, ali sačekajte da se BIOMELIS upije prije nanošenja drugih proizvoda. Zbog prirodnih sastojaka, preporučujemo da testirate na maloj površini prvo.",
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
        id: "bab1",
        name: "Amira S.",
        city: "Sarajevo",
        rating: 5,
        text: "BIOMELIS mi je spasio kožu! Imala sam hronične probleme sa ekcemom i ništa nije pomagalo. Nakon 3 sedmice korišćenja, koža mi je konačno mirna i zdrava. Prirodni sastojci su ono što sam tražila.",
        verified: true,
        productUsed: "BIOMELIS",
        dateAdded: "2024-12-13",
        featured: true,
        likes: 44
      },
      {
        id: "bab2",
        name: "Kemal H.",
        city: "Tuzla",
        rating: 5,
        text: "Kao neko ko se bori sa psorijazom godinama, mogu reći da je BIOMELIS najbolji proizvod koji sam probao. Smiruje svrab i crvenilo, a koža postaje mekša. Preporučujem svima!",
        verified: true,
        productUsed: "BIOMELIS",
        dateAdded: "2024-12-10",
        featured: true,
        likes: 40
      },
      {
        id: "bab3",
        name: "Merima K.",
        city: "Zenica",
        rating: 5,
        text: "Moja kćerka ima atopijski dermatitis i BIOMELIS je jedini proizvod koji joj stvarno pomaže. Prirodan je, bez kemikalija, a rezultati su vidljivi već nakon sedmicu dana korišćenja.",
        verified: true,
        productUsed: "BIOMELIS",
        dateAdded: "2024-12-08",
        featured: true,
        likes: 37
      },
      {
        id: "bab4",
        name: "Haris M.",
        city: "Mostar",
        rating: 4,
        text: "Koristim BIOMELIS već mjesec dana za problematičnu kožu na rukama. Vidim poboljšanje, manje je iritacije i crvenila. Trebalo mi je malo vremena, ali vrijedi.",
        verified: true,
        productUsed: "BIOMELIS",
        dateAdded: "2024-12-05",
        featured: false,
        likes: 31
      },
      {
        id: "bab5",
        name: "Lejla P.",
        city: "Banja Luka",
        rating: 5,
        text: "Imala sam osjetljivu kožu koja je reagovala na sve. BIOMELIS je bio blag i efikasan - konačno proizvod koji ne izaziva dodatne iritacije. Koža mi je sada zdrava i hidratisana.",
        verified: true,
        productUsed: "BIOMELIS",
        dateAdded: "2024-12-02",
        featured: true,
        likes: 35
      }
    ]
  },

  biowart: {
    id: 'biowart',
    name: 'BIOWART',
    description: 'Prirodna pomoć u borbi protiv virusnih bradavica. Ubrzava proces regeneracije kože pogođene virusnim bradavicama. Pruža zaštitu od iritacija i ubrzava zarastanje kože. Pogodan za svakodnevnu upotrebu, čak i na osjetljivoj koži. Bez parabena, veštačkih boja i mirisa, idealan je za prirodnu i bezbjednu njegu kože.',
    shortDescription: 'Prirodna pomoć u borbi protiv virusnih bradavica',
    purpose: 'Podržava regeneraciju kože pogođene virusnim bradavicama',
    category: 'skincare',
    slug: 'biowart',
    alternativeSlugs: [],
    availableCountries: ['rs', 'ba'],
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
        size: 'Okvirno 2 sedmice upotrebe',
        quantity: 1,
        price: 39.9,
        currency: 'BAM',
        discountPrice: 33.9,
        isDefault: true
      },
      {
        id: 'biowart-2pak',
        sku: 'BIOWART',
        name: '2 PAKOVANJA (100ml)',
        size: 'Okvirno mjesec dana upotrebe',
        quantity: 2,
        price: 79.8,
        currency: 'BAM',
        discountPrice: 59.9
      },
      {
        id: 'biowart-3pak',
        sku: 'BIOWART',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 2 mjeseca upotrebe',
        quantity: 3,
        price: 119.7,
        currency: 'BAM',
        discountPrice: 79.9
      }
    ],
    benefits: [
      'Podržava regeneraciju kože pogođene virusnim bradavicama',
      'Smiruje iritacije i ubrzava zarastanje kože',
      'Pruža zaštitu od spoljašnjih uticaja',
      'Pogodan za svakodnevnu upotrebu, čak i na osjetljivoj koži',
      'Bez parabena, veštačkih boja i mirisa',
      'Idealan za prirodnu i bezbjednu njegu kože',
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
      'galium-extract', // Ivanjsko cvijeće (3-4.5%)
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
    usage: 'Nanositi tanak sloj BIOWART melema na čistu i suhu kožu dva do tri puta dnevno ili po potrebi. Pogodan za svakodnevnu upotrebu. Sadržaj: 50ml.',
    warnings: [
      'Samo za spoljašnju upotrebu',
      'Izbjegavati kontakt sa očima',
      'U slučaju preosjetljivosti ili alergijske reakcije, prekinuti upotrebu i konsultovati se sa liječnikom',
      'Sadrži alergene: Limonene, Linalool, Eugenol, Citral'
    ],
    productFAQ: [
      {
        question: 'Kako se koristi BIOWART?',
        answer: 'Nanositi tanak sloj BIOWART melema na čistu i suhu kožu dva do tri puta dnevno ili po potrebi. Ne ispira se nakon nanošenja.',
        category: 'usage'
      },
      {
        question: 'Koji su glavni aktivni sastojci u BIOWART proizvodu?',
        answer: 'BIOWART sadrži 6 ljekovitih biljaka (rus, neven, hajdučka trava, žalfija, kantarion, ivanjsko cvijeće, hrastova kora) i 7 eteričnih ulja (žalfija, eukaliptus, nana, karanfilić, timijan, anis, limun), obogaćen vitaminima A, E i B5.',
        category: 'ingredients'
      },
      {
        question: 'Da li je BIOWART bezbijedan za upotrebu?',
        answer: 'Da, BIOWART je EU-kompatibilan kozmetički proizvod koji je prošao sve potrebne testove bezbjednosti. Bez parabena, veštačkih boja i mirisa. Pogodan za svakodnevnu upotrebu.',
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
    description: 'Prirodna podrška za ublažavanje iritacije i nelagodnosti kože analnog područja. Smiruje osjećaj svraba, pečenja i nelagodnosti. Podržava regeneraciju osjetljive kože uz održavanje hidratacije. Stvara nježnu zaštitnu barijeru protiv vanjskih faktora. Pogodan za svakodnevnu upotrebu, čak i na osjetljivoj i iritiranoj koži. Bez parabena, veštačkih boja i mirisa - prirodan i bezbijedan izbor za njegu kože.',
    shortDescription: 'Prirodna podrška za ublažavanje iritacije kože analnog područja',
    purpose: 'Pomaže u njezi i zaštiti osjetljive kože analnog područja',
    category: 'skincare',
    slug: 'bioroid',
    alternativeSlugs: [],
    availableCountries: ['rs', 'ba'],
    seoTitle: 'BIOROID - Prirodna podrška za njegu analne kože | DERMOTIN',
    seoDescription: 'BIOROID od DERMOTIN brenda - prirodna formula sa biljnim ekstraktima za njegu osjetljive kože analnog područja. Smiruje iritacije, podržava regeneraciju. Bez parabena. 50ml.',
    urgencyElements: {
      limitedStock: 12,
      limitedTime: '24h',
      socialProof: {
        recentPurchases: 18,
        timeFrame: 'zadnja 24h'
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
        size: 'Okvirno 2 sedmice upotrebe',
        quantity: 1,
        price: 49.9,
        currency: 'BAM',
        discountPrice: 33.9,
        isDefault: true
      },
      {
        id: 'bioroid-2pak',
        sku: 'BIOROID',
        name: '2 PAKOVANJA (100ml)',
        size: 'Okvirno mjesec dana upotrebe',
        quantity: 2,
        price: 99.8,
        currency: 'BAM',
        discountPrice: 59.9
      },
      {
        id: 'bioroid-3pak',
        sku: 'BIOROID',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 2 mjeseca upotrebe',
        quantity: 3,
        price: 149.7,
        currency: 'BAM',
        discountPrice: 79.9
      }
    ],
    benefits: [
      'Smiruje osjećaj svraba, pečenja i nelagodnosti',
      'Podržava regeneraciju osjetljive kože uz održavanje hidratacije',
      'Stvara nježnu zaštitnu barijeru protiv vanjskih faktora',
      'Pogodan za svakodnevnu upotrebu, čak i na osjetljivoj koži',
      'Bez parabena, veštačkih boja i mirisa',
      'Prirodan i bezbijedan izbor za njegu kože',
      'Dugotrajno umirujući i osvježavajući osjećaj',
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
    usage: 'Nanositi tanak sloj BIOROID kreme dva puta dnevno na čistu i suhu kožu analnog područja. Za najbolje rezultate, nanositi nakon defekacije i svakodnevne higijene. Pogodan za kontinuiranu, dugotrajnu upotrebu bez prekida. Sadržaj: 50ml.',
    warnings: [
      'Samo za vanjsku upotrebu',
      'Izbjegavati kontakt sa očima. Ukoliko dođe do kontakta, temeljno isprati vodom',
      'Ne koristiti ukoliko ste preosjetljivi na bilo koji od sastojaka',
      'U slučaju trajne iritacije, prekinuti upotrebu i potražiti liječničku pomoć',
      'Čuvati van dosega djece',
      'Čuvati na sobnoj temperaturi'
    ],
    productFAQ: [
      {
        question: 'Kako se koristi BIOROID?',
        answer: 'Nanositi tanak sloj BIOROID kreme dva puta dnevno na čistu i suhu kožu analnog područja. Za najbolje rezultate, nanositi nakon defekacije i svakodnevne higijene.',
        category: 'usage'
      },
      {
        question: 'Koji su glavni aktivni sastojci u BIOROID proizvodu?',
        answer: 'BIOROID sadrži pažljivo odabrane biljne ekstrakte (hajdučka trava, divlji kesten, neven, pastirska torbica, zdravac, kamilica) i eterična ulja (lavanda, čajno drvo, pačuli, karanfilić), obogaćen vitaminima A, E i B5.',
        category: 'ingredients'
      },
      {
        question: 'Da li je BIOROID bezbijedan za dugotrajnu upotrebu?',
        answer: 'Da, BIOROID je kozmetički proizvod na biljnoj osnovi pogodan za kontinuiranu svakodnevnu upotrebu. Bez parabena, veštačkih boja i mirisa.',
        category: 'safety'
      },
      {
        question: 'Da li se može koristiti na osjetljivoj koži?',
        answer: 'Da, formula je posebno dizajnirana za nježnu kožu analnog područja i pogodna je za osjetljivu kožu.',
        category: 'usage'
      },
      {
        question: 'Da li BIOROID zamjenjuje medicinsko liječenje?',
        answer: 'Ne. BIOROID je kozmetički proizvod, a ne lijek. Za medicinske probleme konsultirajte se sa liječnikom.',
        category: 'safety'
      }
    ],
    testimonials: [
      {
        id: "bioroid_t1",
        name: "Marija S.",
        city: "Sarajevo",
        rating: 5,
        text: "BIOROID mi je stvarno pomogao sa svakodnevnom nelagodnošću. Prirodni sastojci su mi bili važni, a krema je nježna i efikasna. Koristim je već mjesec dana bez problema.",
        verified: true,
        productUsed: "BIOROID",
        dateAdded: "2024-12-15",
        featured: true,
        likes: 42
      },
      {
        id: "bioroid_t2",
        name: "Jelena P.",
        city: "Tuzla",
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
        city: "Banja Luka",
        rating: 4,
        text: "Dobra krema za svakodnevnu upotrebu. Smiruje iritacije i ima prijatan osvježavajući osjećaj. Cijena je razumna za kvalitet koji dobijate.",
        verified: true,
        productUsed: "BIOROID",
        dateAdded: "2024-12-12",
        featured: false,
        likes: 28
      },
      {
        id: "bioroid_t4",
        name: "Ana T.",
        city: "Mostar",
        rating: 5,
        text: "Prirodni sastojci poput nevena i kamilice čine čuda za osjetljivu kožu. BIOROID je nježan, efikasan i bez neželjenih efekata. Već sam preporučila prijateljicama.",
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
    description: 'Dodatak ishrani na bazi vodeno-etanolnih ekstrakata ploda badelja, lista koprive, korena maslačka, korena čička, herbe rastavića i herbe lazarkinje. Zahvaljujući sadržaju silimarina, badel ispolja regenerativno djelovanje na hepatocite, djeluje kao hepatoprotektiv i doprinosi zdravlju jetre. Maslačak doprinosi normalnoj funkciji žlijezda i jetre.',
    shortDescription: 'Prirodni dodatak ishrani za podršku zdravlja jetre - 50ml',
    purpose: 'Podržava normalnu funkciju jetre i žlijezda',
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
        sku: 'BIOMELIS_KAPI',
        name: '1 PAKOVANJE (50ml)',
        size: 'Okvirno mjesec dana upotrebe',
        quantity: 1,
        price: 39.9,
        currency: 'BAM',
        discountPrice: 31.5,
        isDefault: true
      },
      {
        id: 'biomelis-kapi-2pak',
        sku: 'BIOMELIS_KAPI',
        name: '2 PAKOVANJA (100ml)',
        size: 'Okvirno 2 mjeseca upotrebe',
        quantity: 2,
        price: 79.8,
        currency: 'BAM',
        discountPrice: 59.9
      },
      {
        id: 'biomelis-kapi-3pak',
        sku: 'BIOMELIS_KAPI',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 3 mjeseca upotrebe',
        quantity: 3,
        price: 119.7,
        currency: 'BAM',
        discountPrice: 79.9
      }
    ],
    benefits: [
      'Zahvaljujući sadržaju silimarina, badel ispolja regenerativno djelovanje na hepatocite',
      'Djeluje kao hepatoprotektiv i doprinosi zdravlju jetre',
      'Maslačak doprinosi normalnoj funkciji žlijezda i jetre',
      'Rastić ima zaštitni efekat na hepatocite',
      'Čičak poboljšava varenje i podstiče metabolizam masti i glukoze',
      'Lazarkinja povoljno utiče na proces varenja',
      'Prirodni vodeno-etanolni ekstrakti ljekovitih biljaka',
      'Energetska vrijednost dnevnog unosa manja od 50 kJ (12 kcal)'
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
      'Najbolje uzimati prije obroka',
      'Redovno koristiti najmanje mjesec dana za najbolje rezultate',
      'Ne prekoračiti preporučenu dnevnu dozu',
      'Kombinovati sa uravnoteženom ishranom'
    ],
    warnings: [
      'Dodatak ishrani se ne može koristiti kao zamjena za raznovrsnu i uravnoteženu ishranu',
      'Čuvati van domašaja djece',
      'Proizvod čuvati dobro zatvoren u originalnom pakovanju, na suhom, tamnom i hladnom mjestu',
      'Proizvod nije namijenjen osobama preosjetljivim na bilo koji sastojak',
      'Nije namijenjen trudnicama, dojiljama i osobama mlađim od 18 godina',
      'Također, osobama kojima se preporučuje redukovan unos tečnosti (teška srčana ili bubrežna bolest)',
      'Ne preporučuje se istovremena primjena sa diureticima',
      'Primjena proizvoda mogu da prate blagi i prolazni simptomi poremećaja funkcije gastrointestinalnog trakta',
      'Moguća je pojava kožnih reakcija',
      'Proizvod sadrži alkohol'
    ],
    slug: 'biomelis-kapi',
    alternativeSlugs: ['biomelis-drops', 'jetra-kapi', 'hepatoprotektiv'],
    availableCountries: ['rs', 'ba'],
    seoTitle: 'BIOMELIS KAPI - Prirodni dodatak ishrani za zdravlje jetre | DERMOTIN',
    seoDescription: 'BIOMELIS KAPI od DERMOTIN brenda - dodatak ishrani sa ekstraktima badelja, koprive, maslačka. Hepatoprotektiv za podršku zdravlja jetre. Silimarin, prirodni sastojci. 50ml.',
    urgencyElements: {
      limitedStock: 25,
      limitedTime: '24h',
      socialProof: {
        recentPurchases: 67,
        timeFrame: 'zadnja 24h'
      }
    },
    productFAQ: [
      {
        question: "Kako se koriste BIOMELIS KAPI?",
        answer: "Vrlo jednostavno! Uzimati 3 puta dnevno po 40 kapi, rastvoreno u malo vode. Najbolje je uzimati prije obroka. Jedna bočica od 50ml traje oko mjesec dana pri redovnoj upotrebi.",
        category: "usage"
      },
      {
        question: "Kada ću vidjeti prve rezultate?",
        answer: "Budite realni - pravi rezultati se vide nakon mjesec dana redovne upotrebe. Jetra je organ koji se polako regeneriše, pa budite strpljivi i ne očekujte čuda preko noći!",
        category: "effects"
      },
      {
        question: "Da li su BIOMELIS KAPI prirodne?",
        answer: "Da! Dodatak ishrani na bazi vodeno-etanolnih ekstrakata ljekovitih biljaka: badel, kopriva, maslačak, čičak, rastić i lazarkinja. Sve prirodno, bez veštačkih dodataka.",
        category: "ingredients"
      },
      {
        question: "Da li je bezbijedno za dugotrajnu upotrebu?",
        answer: "BIOMELIS KAPI su dodatak ishrani kategorizovan od strane Farmaceutskog fakulteta. Pogodan za redovnu upotrebu, ali uvijek pratite preporučenu dozu i konsultirajte se sa liječnikom.",
        category: "safety"
      },
      {
        question: "Ko ne smije da koristi BIOMELIS KAPI?",
        answer: "Proizvod nije namijenjen trudnicama, dojiljama, osobama mlađim od 18 godina, kao ni osobama sa teškom srčanom ili bubrežnom bolešću. Također, ne preporučuje se istovremena primjena sa diureticima.",
        category: "safety"
      },
      {
        question: "Kako da čuvam BIOMELIS KAPI?",
        answer: "Čuvajte dobro zatvoreno u originalnom pakovanju, na suhom, tamnom i hladnom mjestu, daleko od djece. Proizvod sadrži alkohol kao prirodni konzervans.",
        category: "storage"
      },
      {
        question: "Mogu li da koristim BIOMELIS KAPI sa drugim lijekovima?",
        answer: "Ako uzimate lijekove, posebno diuretike, konsultirajte se sa liječnikom prije upotrebe. BIOMELIS KAPI su dodatak ishrani, a ne lijek.",
        category: "usage"
      },
      {
        question: "Šta čini BIOMELIS KAPI tako efikasnim?",
        answer: "Silimarin iz badelja djeluje hepatoprotektivno, maslačak podržava funkciju jetre i žlijezda, a čičak poboljšava varenje i metabolizam. Sve prirodno, naučno potvrđeno!",
        category: "ingredients"
      }
    ],
    testimonials: [
      {
        id: "bkba1",
        name: "Amela H.",
        city: "Sarajevo",
        rating: 5,
        text: "BIOMELIS KAPI mi je pomogao nakon što sam imala problema sa jetrom. Prirodni sastojci su mi bili važni, a rezultati su vidljivi već nakon mjesec dana korišćenja. Preporučujem svima!",
        verified: true,
        productUsed: "BIOMELIS KAPI",
        dateAdded: "2024-12-13",
        featured: true,
        likes: 42
      },
      {
        id: "bkba2",
        name: "Kemal M.",
        city: "Tuzla",
        rating: 5,
        text: "Kao neko ko voli da uživa u hrani, BIOMELIS KAPI mi pomaže da se osjećam bolje. Badel i maslačak su poznati po tome što pomažu jetri. Prirodno i efikasno!",
        verified: true,
        productUsed: "BIOMELIS KAPI",
        dateAdded: "2024-12-10",
        featured: true,
        likes: 38
      },
      {
        id: "bkba3",
        name: "Merima S.",
        city: "Zenica",
        rating: 5,
        text: "Moj muž ima problema sa varenjem i BIOMELIS KAPI su stvarno pomogle. Čičak poboljšava varenje, a lazarkinja također pomaže. Prirodni pristup koji funkcioniše.",
        verified: true,
        productUsed: "BIOMELIS KAPI",
        dateAdded: "2024-12-08",
        featured: true,
        likes: 35
      },
      {
        id: "bkba4",
        name: "Haris J.",
        city: "Mostar",
        rating: 4,
        text: "Koristim BIOMELIS KAPI već dva mjeseca. Osjećam se bolje, varenje mi je poboljšano. Trebalo mi je malo vremena da vidim rezultate, ali vrijedi čekanja.",
        verified: true,
        productUsed: "BIOMELIS KAPI",
        dateAdded: "2024-12-05",
        featured: false,
        likes: 30
      },
      {
        id: "bkba5",
        name: "Lejla P.",
        city: "Banja Luka",
        rating: 5,
        text: "Kao farmaceut, cijenim što su BIOMELIS KAPI kategorizovane od strane Farmaceutskog fakulteta. Silimarin iz badelja je naučno potvrđen hepatoprotektiv. Kvalitetan proizvod!",
        verified: true,
        productUsed: "BIOMELIS KAPI",
        dateAdded: "2024-12-02",
        featured: true,
        likes: 40
      }
    ]
  }
};
