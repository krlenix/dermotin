import { Product } from '../../types';

export const PRODUCTS: Record<string, Product> = {
  fungel: {
    id: 'fungel',
    name: 'FUNGEL',
    description: 'Namijenjena borbi protiv gljivičnih infekcija na stopalima i noktima. Pomaže u smanjenju neprijatnih simptoma kao što su zadebljali i žuti nokti, svrab, crvenilo i perutanje kože. Redovnom upotrebom doprinosi zdravijem izgledu kože i noktiju, sprečavajući ponovno širenje infekcije.',
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
        size: 'Okvirno 3 sedmice upotrebe',
        quantity: 1,
        price: 27.9,
        currency: 'EUR',
        discountPrice: 16.9,
        isDefault: true
      },
      {
        id: 'fungel-2pak',
        sku: 'FUNGEL',
        name: '2 PAKOVANJA (100ml)',
        size: 'Okvirno mjesec i po upotrebe',
        quantity: 2,
        price: 53.9,
        currency: 'EUR',
        discountPrice: 29.9
      },
      {
        id: 'fungel-3pak',
        sku: 'FUNGEL',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 2 mjeseca i pol upotrebe',
        quantity: 3,
        price: 77.9,
        currency: 'EUR',
        discountPrice: 39.9
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
      'aqua',
      'alcohol',
      'glycerin',
      'castor-oil',
      'stearic-acid',
      'cetyl-alcohol',
      'glyceryl-stearate',
      'synthetic-beeswax',
      'triethanolamine',
      'carbomer',
      'phenoxyethanol',
      'ethylhexylglycerin',
      'sodium-benzoate',
      'potassium-sorbate'
    ],
    usage: 'Nanositi 2 puta dnevno na problematične dijelove kože ili noktiju. Ne ispirati nakon nanošenja. Sadržaj: 50ml (dovoljno za 3 sedmice redovne upotrebe).',
    usageSteps: [
      'Očistite i osušite pogođeno mjesto',
      'Nanesite tanak sloj FUNGEL-a na problematičnu kožu ili nokte',
      'Nježno umasirajte dok se potpuno ne upije',
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
    availableCountries: ['rs', 'ba', 'me'],
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
        answer: "Vrlo jednostavno! Nanositi 2 puta dnevno na problemske dijelove kože ili noktiju. Ne treba da se ispira - samo ostaviti da se upije. Jedna tubica od 50ml traje oko 3 sedmice pri redovnoj upotrebi.",
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
        answer: "Možete, ali sačekajte da se FUNGEL upije prije nanošenja drugih proizvoda. Takođe, preporučujemo zaštitu od sunca tokom korištenja.",
        category: "usage"
      },
      {
        question: "Šta čini FUNGEL tako efikasnim?",
        answer: "Prirodna formula koja podržava njegu problematične kože. Smiruje iritacije, podržava obnovu kože i pruža dugotrajnu hidrataciju. Sve prirodno, bez štetnih hemikalija!",
        category: "ingredients"
      }
    ],
    testimonials: [
      {
        id: "me1",
        name: "Marko P.",
        city: "Podgorica",
        rating: 5,
        text: "FUNGEL mi je pomogao kada ništa drugo nije. Imao sam hronične probleme sa kožom i ovaj prirodni proizvod je konačno donio olakšanje. Preporučujem svima koji traže efikasno rješenje.",
        verified: true,
        productUsed: "FUNGEL",
        dateAdded: "2024-12-12",
        featured: true,
        likes: 43
      },
      {
        id: "me2",
        name: "Ana S.",
        city: "Nikšić",
        rating: 5,
        text: "Kao osoba koja radi fizički posao, često imam problema sa kožom na rukama. FUNGEL sa čajnim drvetom i origanom je bio prava stvar. Prirodan, bez hemikalija i stvarno efikasan.",
        verified: true,
        productUsed: "FUNGEL",
        dateAdded: "2024-12-09",
        featured: true,
        likes: 39
      },
      {
        id: "me3",
        name: "Jelena M.",
        city: "Budva",
        rating: 5,
        text: "Moj sin je imao problematičnu kožu oko noktiju. FUNGEL je jedini proizvod koji je stvarno pomogao. Prirodni sastojci su mi bili važni, a rezultati su vidljivi već nakon sedmicu dana.",
        verified: true,
        productUsed: "FUNGEL",
        dateAdded: "2024-12-06",
        featured: true,
        likes: 36
      },
      {
        id: "me4",
        name: "Nikola D.",
        city: "Bar",
        rating: 4,
        text: "Dobar proizvod, radi postupno ali sigurno. Trebalo mi je oko tri sedmice da vidim potpunu promjenu, ali vrijedi čekanja. Cijena je prihvatljiva za kvalitet.",
        verified: true,
        productUsed: "FUNGEL",
        dateAdded: "2024-12-03",
        featured: false,
        likes: 30
      },
      {
        id: "me5",
        name: "Milica K.",
        city: "Herceg Novi",
        rating: 5,
        text: "Radim u vlažnoj sredini i često imam problema sa kožom. FUNGEL mi je ne samo riješio problem, već i učinio kožu mekšom i zdravijom. Sada ga koristim preventivno.",
        verified: true,
        productUsed: "FUNGEL",
        dateAdded: "2024-11-30",
        featured: true,
        likes: 33
      },
      {
        id: "me6",
        name: "Stefan R.",
        city: "Cetinje",
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
    description: 'Ublažava tegobe izazvane ekcemima i psorijazom. Njegova biljna formula njeguje kožu, smanjuje upalu i osjećaj svraba. Pogodan je za svakodnevnu upotrebu i doprinosi obnavljanju prirodne barijere kože.',
    shortDescription: 'Umirujuća njega za osjetljivu kožu',
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
        size: 'Okvirno 3 sedmice upotrebe',
        quantity: 1,
        price: 27.9,
        currency: 'EUR',
        discountPrice: 16.9,
        isDefault: true
      },
      {
        id: 'biomelis-2pak',
        sku: 'BIOMELIS',
        name: '2 PAKOVANJA (100ml)',
        size: 'Okvirno mjesec i po upotrebe', 
        quantity: 2,
        price: 53.9,
        currency: 'EUR',
        discountPrice: 29.9
      },
      {
        id: 'biomelis-3pak',
        sku: 'BIOMELIS',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 2 mjeseca i pol upotrebe',
        quantity: 3,
        price: 77.9,
        currency: 'EUR',
        discountPrice: 39.9
      }
    ],
    benefits: [
      'Umiruje i njeguje osjetljivu kožu',
      'Pomaže u smanjenju upale i svraba',
      'Podržava obnovu prirodne barijere kože',
      'Pruža intenzivnu hidrataciju',
      'Blaga formula pogodna za svakodnevnu upotrebu',
      'Bez parabena i sintetskih mirisa',
      'Sadrži 6 biljnih ekstrakata',
      'Testirana na osjetljivoj koži'
    ],
    ingredients: [
      'calendula-extract',
      'chelidonium-extract',
      'salvia-leaf-extract',
      'echinacea-extract',
      'galium-extract',
      'hypericum-extract',
      'sweet-almond-oil',
      'panthenol',
      'vitamin-e',
      'vitamin-a',
      'aqua',
      'glycerin',
      'alcohol',
      'castor-oil',
      'stearic-acid',
      'cetyl-alcohol',
      'glyceryl-stearate',
      'synthetic-beeswax',
      'triethanolamine',
      'carbomer',
      'phenoxyethanol',
      'ethylhexylglycerin',
      'sodium-benzoate',
      'potassium-sorbate'
    ],
    usage: 'Nanositi 2-3 puta dnevno na pogođene dijelove kože. Blago umasirati dok se ne upije. Ne ispirati. Sadržaj: 50ml (dovoljno za 3 sedmice redovne upotrebe).',
    usageSteps: [
      'Očistite i osušite pogođeno područje',
      'Nanesite tanak sloj BIOMELIS-a',
      'Nježno umasirajte dok se ne upije',
      'Koristite 2-3 puta dnevno',
      'Za najbolje rezultate koristiti redovno najmanje 3-4 sedmice',
      'Ne ispirati nakon nanošenja'
    ],
    warnings: [
      'Samo za spoljašnju upotrebu',
      'Izbegavati kontakt sa očima',
      'Ne koristiti na otvorenim ranama',
      'Prestati sa upotrebom ako dođe do iritacije',
      'Čuvati van domašaja djece',
      'Čuvati na hladnom i suhom mjestu',
      'Testirajte na maloj površini prije prve upotrebe'
    ],
    slug: 'biomelis',
    alternativeSlugs: ['biomelis-ekcem', 'biomelis-psorijaza'],
    availableCountries: ['rs', 'ba', 'me'],
    seoTitle: 'BIOMELIS - Prirodna njega za osjetljivu kožu | DERMOTIN',
    seoDescription: 'BIOMELIS od DERMOTIN brenda - biljna formula sa 6 ekstrakata za njegu osjetljive kože pogođene ekcemom i psorijazom. Smanjuje upalu i svrab. 50ml.',
    urgencyElements: {
      limitedStock: 38,
      limitedTime: '24h',
      socialProof: {
        recentPurchases: 89,
        timeFrame: 'posljednja 24h'
      }
    },
    productFAQ: [
      {
        question: "Kako se koristi BIOMELIS?",
        answer: "Vrlo jednostavno! Nanositi 2 puta dnevno na očišćenu kožu i nježno masirati. Ne treba da se ispira - samo ostaviti da se upije. Jedna tuba od 50ml traje oko 3 sedmice pri redovnoj upotrebi.",
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
        id: "memb1",
        name: "Amira S.",
        city: "Podgorica",
        rating: 5,
        text: "BIOMELIS mi je spasio kožu! Imala sam hronične probleme sa ekcemom i ništa nije pomagalo. Nakon 3 sedmice korišćenja, koža mi je konačno mirna i zdrava. Prirodni sastojci su ono što sam tražila.",
        verified: true,
        productUsed: "BIOMELIS",
        dateAdded: "2024-12-13",
        featured: true,
        likes: 44
      },
      {
        id: "memb2",
        name: "Kemal H.",
        city: "Nikšić",
        rating: 5,
        text: "Kao neko ko se bori sa psorijazom godinama, mogu reći da je BIOMELIS najbolji proizvod koji sam probao. Smiruje svrab i crvenilo, a koža postaje mekša. Preporučujem svima!",
        verified: true,
        productUsed: "BIOMELIS",
        dateAdded: "2024-12-10",
        featured: true,
        likes: 40
      },
      {
        id: "memb3",
        name: "Merima K.",
        city: "Budva",
        rating: 5,
        text: "Moja kćerka ima atopijski dermatitis i BIOMELIS je jedini proizvod koji joj stvarno pomaže. Prirodan je, bez hemikalija, a rezultati su vidljivi već nakon sedmicu dana korišćenja.",
        verified: true,
        productUsed: "BIOMELIS",
        dateAdded: "2024-12-08",
        featured: true,
        likes: 37
      },
      {
        id: "memb4",
        name: "Haris M.",
        city: "Bar",
        rating: 4,
        text: "Koristim BIOMELIS već mjesec dana za problematičnu kožu na rukama. Vidim poboljšanje, manje je iritacije i crvenila. Trebalo mi je malo vremena, ali vrijedi.",
        verified: true,
        productUsed: "BIOMELIS",
        dateAdded: "2024-12-05",
        featured: false,
        likes: 31
      },
      {
        id: "memb5",
        name: "Lejla P.",
        city: "Herceg Novi",
        rating: 5,
        text: "Imala sam osjetljivu kožu koja je reagovala na sve. BIOMELIS je bio blag i efikasan - konačno proizvod koji ne izaziva dodatne iritacije. Koža mi je sada zdrava i hidratisana.",
        verified: true,
        productUsed: "BIOMELIS",
        dateAdded: "2024-12-02",
        featured: true,
        likes: 35
      },
      {
        id: "memb6",
        name: "Emir J.",
        city: "Cetinje",
        rating: 5,
        text: "Borba sa ekcemom je bila dugogodišnja, ali BIOMELIS mi je konačno donio olakšanje. Prirodan, bezbedan i efikasan. Preporučujem svima sa osjetljivom kožom!",
        verified: true,
        productUsed: "BIOMELIS",
        dateAdded: "2024-11-29",
        featured: false,
        likes: 32
      }
    ]
  },

  biowart: {
    id: 'biowart',
    name: 'BIOWART',
    description: 'Prirodna pomoć kod uklanjanja virusnih bradavica. Djeluje lokalno, ubrzava povlačenje promjena i regeneraciju kože. Redovnom primjenom smanjuje rizik od ponovnog pojavljivanja bradavica.',
    shortDescription: 'Biljna formula za ciljanu njegu kože',
    purpose: 'Podržava regeneraciju kože pogođene virusnim bradavicama',
    category: 'skincare',
    slug: 'biowart',
    alternativeSlugs: [],
    availableCountries: ['rs', 'ba', 'me'],
    seoTitle: 'BIOWART - Prirodna pomoć protiv virusnih bradavica | DERMOTIN',
    seoDescription: 'BIOWART od DERMOTIN brenda - prirodna formula sa 6 biljnih ekstrakata i 7 eteričnih ulja za njegu kože pogođene virusnim bradavicama. Bez parabena, pogodan za osjetljivu kožu. 50ml.',
    urgencyElements: {
      limitedStock: 15,
      limitedTime: '24h',
      socialProof: {
        recentPurchases: 23,
        timeFrame: 'posljednja 24h'
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
        size: 'Okvirno 3 sedmice upotrebe',
        quantity: 1,
        price: 27.9,
        currency: 'EUR',
        discountPrice: 16.9,
        isDefault: true
      },
      {
        id: 'biowart-2pak',
        sku: 'BIOWART',
        name: '2 PAKOVANJA (100ml)',
        size: 'Okvirno mjesec i po upotrebe',
        quantity: 2,
        price: 53.9,
        currency: 'EUR',
        discountPrice: 29.9
      },
      {
        id: 'biowart-3pak',
        sku: 'BIOWART',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 2 mjeseca i pol upotrebe',
        quantity: 3,
        price: 77.9,
        currency: 'EUR',
        discountPrice: 39.9
      }
    ],
    benefits: [
      'Prirodna pomoć kod uklanjanja virusnih bradavica',
      'Djeluje lokalno i ciljano',
      'Ubrzava povlačenje promjena',
      'Podržava regeneraciju kože',
      'Smanjuje rizik od ponovnog pojavljivanja',
      'Sadrži 6 biljnih ekstrakata i 7 eteričnih ulja',
      'Bez parabena i agresivnih hemikalija',
      'Pogodan za osjetljivu kožu'
    ],
    ingredients: [
      'chelidonium-extract',
      'calendula-extract',
      'salvia-leaf-extract',
      'echinacea-extract',
      'galium-extract',
      'hypericum-extract',
      'tea-tree-oil',
      'thyme-oil',
      'oregano-oil',
      'sage-oil',
      'lavender-oil',
      'eucalyptus-oil',
      'lemon-oil',
      'vitamin-e',
      'sweet-almond-oil',
      'aqua',
      'alcohol',
      'glycerin',
      'propolis-extract',
      'castor-oil',
      'stearic-acid',
      'cetyl-alcohol',
      'glyceryl-stearate',
      'triethanolamine',
      'carbomer',
      'phenoxyethanol',
      'ethylhexylglycerin'
    ],
    usage: 'Nanositi 2-3 puta dnevno direktno na bradavicu. Ne ispirati. Koristiti dok promjene ne počnu da se povlače. Sadržaj: 50ml.',
    usageSteps: [
      'Očistite i osušite pogođeno područje',
      'Nanesite BIOWART direktno na bradavicu',
      'Ostavite da se upije',
      'Koristite 2-3 puta dnevno',
      'Redovno koristiti dok promjene ne počnu da se povlače',
      'Nastavite još 1-2 sedmice nakon što bradavica nestane'
    ],
    warnings: [
      'Samo za spoljašnju upotrebu',
      'Nanositi samo na bradavicu',
      'Izbegavati kontakt sa zdravom kožom',
      'Ne koristiti na licu',
      'Ne koristiti u trudnoći',
      'Čuvati van domašaja djece',
      'Prestati sa upotrebom ako dođe do jake iritacije'
    ],
    productFAQ: [
      {
        question: "Kako se koristi BIOWART?",
        answer: "Nanositi 2-3 puta dnevno direktno na bradavicu. Ne ispirati nakon nanošenja. Koristiti dok promjene ne počnu da se povlače. Jedna tubica od 50ml traje oko 3 sedmice.",
        category: "usage"
      },
      {
        question: "Kada ću vidjeti prve rezultate?",
        answer: "Vrijeme zavisi od veličine i dubine bradavice. Obično je potrebno 4-8 sedmica redovne upotrebe. Budite strpljivi i redovno nanositeproizvod.",
        category: "effects"
      },
      {
        question: "Da li je BIOWART prirodan?",
        answer: "Da! Prirodna formula sa 6 biljnih ekstrakata i 7 eteričnih ulja. Bez parabena i agresivnih hemikalija - idealan za prirodnu njegu kože.",
        category: "ingredients"
      },
      {
        question: "Da li je bezbedan za upotrebu?",
        answer: "Da, BIOWART je testiran i odobren. Ipak, nanositi samo na bradavicu i izbegavati kontakt sa zdravom kožom. Ne koristiti u trudnoći.",
        category: "safety"
      },
      {
        question: "Mogu li da koristim na licu?",
        answer: "Ne preporučujemo upotrebu BIOWART-a na licu zbog intenzivne formule. Koristiti samo na tijelu, na mjestima gdje su bradavice.",
        category: "safety"
      },
      {
        question: "Kako da čuvam BIOWART?",
        answer: "Čuvajte na hladnom, suhom mjestu, daleko od djece. Zatvorite dobro nakon upotrebe. Rok trajanja je označen na pakovanju.",
        category: "storage"
      },
      {
        question: "Šta da radim ako dođe do iritacije?",
        answer: "Ako dođe do jake iritacije, prestanite sa upotrebom i konsultujte ljekara. Blaga iritacija je normalna, ali jaka iritacija zahtijeva prekid upotrebe.",
        category: "usage"
      },
      {
        question: "Šta čini BIOWART efikasnim?",
        answer: "Kombinacija 6 biljnih ekstrakata i 7 eteričnih ulja koja ciljano djeluju na bradavice. Rus (chelidonium) je glavna aktivna komponenta poznata po djelovanju na bradavice.",
        category: "ingredients"
      }
    ],
    testimonials: [
      {
        id: "mebw1",
        name: "Danilo M.",
        city: "Podgorica",
        rating: 5,
        text: "Imao sam bradavice na prstima koje su me smetale godinama. BIOWART je bio jedini prirodni proizvod koji je stvarno pomogao. Trebalo je vremena, ali rezultat je odličan.",
        verified: true,
        productUsed: "BIOWART",
        dateAdded: "2024-12-05",
        featured: true,
        likes: 28
      },
      {
        id: "mebw2",
        name: "Jelena S.",
        city: "Nikšić",
        rating: 4,
        text: "Koristim BIOWART već dva mjeseca i vidim poboljšanje. Bradavica se polako povlači. Treba biti strpljiv, ali prirodan pristup mi je bio važan.",
        verified: true,
        productUsed: "BIOWART",
        dateAdded: "2024-12-02",
        featured: false,
        likes: 24
      },
      {
        id: "mebw3",
        name: "Mirko P.",
        city: "Budva",
        rating: 5,
        text: "Moj sin je imao bradavicu na ruci koja mu je smetala. BIOWART je djelovao postupno ali sigurno. Nakon 6 sedmica bradavica je potpuno nestala. Preporučujem!",
        verified: true,
        productUsed: "BIOWART",
        dateAdded: "2024-11-29",
        featured: true,
        likes: 31
      },
      {
        id: "mebw4",
        name: "Ana K.",
        city: "Bar",
        rating: 5,
        text: "Prirodan proizvod bez agresivnih hemikalija - to je bilo najvažnije za mene. BIOWART je djelovao efikasno i bez neželjenih efekata. Zadovoljna sam rezultatom.",
        verified: true,
        productUsed: "BIOWART",
        dateAdded: "2024-11-26",
        featured: true,
        likes: 27
      },
      {
        id: "mebw5",
        name: "Nikola J.",
        city: "Herceg Novi",
        rating: 4,
        text: "Trebalo mi je oko 7 sedmica da vidim potpune rezultate, ali vrijedi čekanja. BIOWART je efikasan i prirodan. Cijena je prihvatljiva za kvalitet.",
        verified: true,
        productUsed: "BIOWART",
        dateAdded: "2024-11-23",
        featured: false,
        likes: 22
      },
      {
        id: "mebw6",
        name: "Marija D.",
        city: "Cetinje",
        rating: 5,
        text: "Imala sam više malih bradavica na rukama. BIOWART je djelovao na sve njih postupno. Sada su potpuno nestale i koža je glatka. Odličan proizvod!",
        verified: true,
        productUsed: "BIOWART",
        dateAdded: "2024-11-20",
        featured: false,
        likes: 25
      }
    ]
  },

  fungomax: {
    id: 'fungomax',
    name: 'FUNGOMAX',
    description: 'Djeluje dubinski na gljivične infekcije noktiju i kože stopala. Prodire u nokatnu ploču i pomaže u njenom jačanju i obnavljanju. Dugotrajnom upotrebom obezbijeđuje zaštitu i zdrav izgled noktiju.',
    shortDescription: 'Intenzivna njega noktiju i stopala',
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
        size: 'Okvirno 3 sedmice upotrebe',
        quantity: 1,
        price: 27.9,
        currency: 'EUR',
        discountPrice: 16.9,
        isDefault: true
      },
      {
        id: 'fungomax-2pak',
        sku: 'FUNGOMAX',
        name: '2 PAKOVANJA (100ml)',
        size: 'Okvirno mjesec i po upotrebe',
        quantity: 2,
        price: 53.9,
        currency: 'EUR',
        discountPrice: 29.9
      },
      {
        id: 'fungomax-3pak',
        sku: 'FUNGOMAX',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 2 mjeseca i pol upotrebe',
        quantity: 3,
        price: 77.9,
        currency: 'EUR',
        discountPrice: 39.9
      }
    ],
    benefits: [
      'Dubinsko djelovanje na gljivične infekcije',
      'Prodire u nokatnu ploču',
      'Pomaže u jačanju i obnavljanju noktiju',
      'Obezbijeđuje dugotrajnu zaštitu',
      'Pogodan za svakodnevnu upotrebu',
      'Intenzivna formula sa eteričnim uljima',
      'Bez parabena i štetnih hemikalija',
      'Testiran za bezbjednost'
    ],
    ingredients: [
      'tea-tree-oil',
      'oregano-oil',
      'thyme-oil',
      'sage-oil',
      'eucalyptus-oil',
      'lavender-oil',
      'lemon-oil',
      'calendula-extract',
      'chelidonium-extract',
      'salvia-leaf-extract',
      'echinacea-extract',
      'galium-extract',
      'hypericum-extract',
      'urea',
      'panthenol',
      'vitamin-e',
      'sweet-almond-oil',
      'aqua',
      'alcohol',
      'glycerin',
      'propolis-extract',
      'castor-oil',
      'stearic-acid',
      'cetyl-alcohol',
      'glyceryl-stearate',
      'triethanolamine',
      'carbomer',
      'phenoxyethanol',
      'ethylhexylglycerin',
      'sodium-benzoate',
      'potassium-sorbate'
    ],
    usage: 'Nanositi 2 puta dnevno na pogođene nokte i okolnu kožu. Ne ispirati. Za najbolje rezultate koristiti redovno najmanje 2-3 mjeseca. Sadržaj: 50ml.',
    usageSteps: [
      'Očistite i osušite stopala i nokte',
      'Nanesite FUNGOMAX direktno na pogođene nokte',
      'Nanesite i na okolnu kožu',
      'Ostavite da se upije, ne ispirajte',
      'Koristite 2 puta dnevno',
      'Za najbolje rezultate koristiti najmanje 2-3 mjeseca'
    ],
    warnings: [
      'Samo za spoljašnju upotrebu',
      'Ne koristiti na otvorenim ranama',
      'Izbegavati kontakt sa očima',
      'Prestati sa upotrebom ako dođe do jake iritacije',
      'Čuvati van domašaja djece',
      'Čuvati na hladnom i suhom mjestu',
      'Preporučuje se zaštita od sunca tokom upotrebe'
    ],
    slug: 'fungomax',
    alternativeSlugs: ['fungomax-nokti', 'gljivice-noktiju'],
    availableCountries: ['rs', 'ba', 'me'],
    seoTitle: 'FUNGOMAX - Intenzivna njega noktiju i stopala | DERMOTIN',
    seoDescription: 'FUNGOMAX od DERMOTIN brenda - intenzivna formula sa 7 eteričnih ulja i 6 biljnih ekstrakata za njegu noktiju i kože sklonim gljivičnim infekcijama. 50ml.',
    urgencyElements: {
      limitedStock: 25,
      limitedTime: '24h',
      socialProof: {
        recentPurchases: 56,
        timeFrame: 'posljednja 24h'
      }
    },
    productFAQ: [
      {
        question: "Kako se koristi FUNGOMAX?",
        answer: "Nanositi 2 puta dnevno na pogođene nokte i okolnu kožu. Ne ispirati nakon nanošenja. Jedna tubica od 50ml traje oko 3 sedmice pri redovnoj upotrebi.",
        category: "usage"
      },
      {
        question: "Kada ću vidjeti prve rezultate?",
        answer: "Za vidljive rezultate potrebno je najmanje 2-3 mjeseca redovne upotrebe. Nokti rastu sporo, pa budite strpljivi. Prvi znaci poboljšanja obično se vide nakon 4-6 sedmica.",
        category: "effects"
      },
      {
        question: "Da li je FUNGOMAX prirodan?",
        answer: "Da! Prirodna formula sa 7 eteričnih ulja i 6 biljnih ekstrakata. Bez parabena i štetnih hemikalija - idealan za prirodnu njegu noktiju i stopala.",
        category: "ingredients"
      },
      {
        question: "Da li je bezbedan za svakodnevnu upotrebu?",
        answer: "Apsolutno! FUNGOMAX je testiran i odobren za svakodnevnu upotrebu. Formula je intenzivna ali bezbjedna, prilagođena za dugotrajnu upotrebu.",
        category: "safety"
      },
      {
        question: "Kako se razlikuje od FUNGEL-a?",
        answer: "FUNGOMAX ima intenzivniju formulu sa više eteričnih ulja (7) i posebno je formulisan za dubinsko djelovanje na gljivične infekcije noktiju. Prodire dublje u nokatnu ploču.",
        category: "usage"
      },
      {
        question: "Kako da čuvam FUNGOMAX?",
        answer: "Čuvajte na hladnom, suhom mjestu, daleko od djece. Zatvorite dobro nakon upotrebe. Rok trajanja je označen na pakovanju.",
        category: "storage"
      },
      {
        question: "Mogu li da koristim sa drugim proizvodima?",
        answer: "Možete, ali sačekajte da se FUNGOMAX upije prije nanošenja drugih proizvoda. Takođe, preporučujemo zaštitu od sunca tokom korištenja.",
        category: "usage"
      },
      {
        question: "Šta čini FUNGOMAX tako efikasnim?",
        answer: "Intenzivna kombinacija 7 eteričnih ulja (čajno drvo, origano, timijan) sa 6 biljnih ekstrakata. Prodire duboko u nokatnu ploču i djeluje dugoročno. Sve prirodno, bez štetnih hemikalija!",
        category: "ingredients"
      }
    ],
    testimonials: [
      {
        id: "mefm1",
        name: "Mihailo D.",
        city: "Podgorica",
        rating: 5,
        text: "Godinama sam se borio sa problemom noktiju. FUNGOMAX je jedini proizvod koji je stvarno pomogao. Trebalo je vremena, ali rezultat je fantastičan. Preporučujem!",
        verified: true,
        productUsed: "FUNGOMAX",
        dateAdded: "2024-12-01",
        featured: true,
        likes: 41
      },
      {
        id: "mefm2",
        name: "Jelena K.",
        city: "Nikšić",
        rating: 5,
        text: "Imala sam gljivične infekcije na noktima stopala koje su me mučile godinama. FUNGOMAX je djelovao dubinski - nakon 3 mjeseca nokti su zdravi i normalno rastu. Zadovoljna sam!",
        verified: true,
        productUsed: "FUNGOMAX",
        dateAdded: "2024-11-28",
        featured: true,
        likes: 38
      },
      {
        id: "mefm3",
        name: "Nikola M.",
        city: "Budva",
        rating: 4,
        text: "Koristim FUNGOMAX već 2 mjeseca i vidim značajno poboljšanje. Nokti su manje zadebljali i počinju da rastu normalno. Trebalo je strpljenja, ali vrijeđi.",
        verified: true,
        productUsed: "FUNGOMAX",
        dateAdded: "2024-11-25",
        featured: false,
        likes: 33
      },
      {
        id: "mefm4",
        name: "Ana P.",
        city: "Bar",
        rating: 5,
        text: "Prirodna formula bez agresivnih hemikalija - to mi je bilo najvažnije. FUNGOMAX djeluje efikasno i nakon 10 sedmica nokti mi izgledaju mnogo bolje. Preporučujem!",
        verified: true,
        productUsed: "FUNGOMAX",
        dateAdded: "2024-11-22",
        featured: true,
        likes: 35
      },
      {
        id: "mefm5",
        name: "Stefan R.",
        city: "Herceg Novi",
        rating: 5,
        text: "Kao neko ko radi u vlažnoj sredini, često sam imao problema sa noktima. FUNGOMAX mi je pomogao da riješim problem i sada ga koristim preventivno. Odličan proizvod!",
        verified: true,
        productUsed: "FUNGOMAX",
        dateAdded: "2024-11-19",
        featured: true,
        likes: 37
      },
      {
        id: "mefm6",
        name: "Marko J.",
        city: "Cetinje",
        rating: 4,
        text: "Trebalo mi je skoro 3 mjeseca da vidim potpune rezultate, ali FUNGOMAX je djelovao. Nokti su sada zdravi i izgledaju normalno. Cijena je prihvatljiva za kvalitet.",
        verified: true,
        productUsed: "FUNGOMAX",
        dateAdded: "2024-11-16",
        featured: false,
        likes: 31
      }
    ]
  }
};

