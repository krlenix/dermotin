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
        sku: 'DERM-FUNGEL-001',
        name: '1 PAKOVANJE (50ml)',
        size: 'Okvirno 2 nedelje upotrebe',
        quantity: 1,
        price: 2100,
        currency: 'RSD',
        discountPrice: 1890,
        isDefault: true
      },
      {
        id: 'fungel-2pak',
        sku: 'DERM-FUNGEL-001',
        name: '2 PAKOVANJA (100ml)',
        size: 'Okvirno mesec dana upotrebe',
        quantity: 2,
        price: 4200,
        currency: 'RSD',
        discountPrice: 3290
      },
      {
        id: 'fungel-3pak',
        sku: 'DERM-FUNGEL-001',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 2 meseca upotrebe',
        quantity: 3,
        price: 6000,
        currency: 'RSD',
        discountPrice: 3990
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
        '/images/products/biomelis/biomelis-product-image.png'
      ],
      thumbnail: '/images/products/biomelis/biomelis-box-only.png',
      fallback: '/images/products/biomelis/biomelis-box-and-product-mockup.png'
    },
    variants: [
      {
        id: 'biomelis-1pak',
        sku: 'DERM-BIOMELIS-001',
        name: '1 PAKOVANJE (50ml)',
        size: 'Okvirno 2 nedelje upotrebe',
        quantity: 1,
        price: 2100,
        currency: 'RSD',
        discountPrice: 1890,
        isDefault: true
      },
      {
        id: 'biomelis-2pak',
        sku: 'DERM-BIOMELIS-001',
        name: '2 PAKOVANJA (100ml)',
        size: 'Okvirno mesec dana upotrebe',
        quantity: 2,
        price: 4200,
        currency: 'RSD',
        discountPrice: 3290
      },
      {
        id: 'biomelis-3pak',
        sku: 'DERM-BIOMELIS-001',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 2 meseca upotrebe',
        quantity: 3,
        price: 6000,
        currency: 'RSD',
        discountPrice: 3990
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
    ]
  }
};
