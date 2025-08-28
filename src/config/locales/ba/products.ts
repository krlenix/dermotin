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
        featured: true
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
        featured: true
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
        featured: true
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
        featured: false
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
        featured: true
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
        featured: false
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
        featured: true
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
        featured: true
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
        featured: true
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
        featured: false
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
        featured: true
      }
    ]
  }
};
