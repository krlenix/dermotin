export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  size?: string;
  quantity?: number;
  price: number;
  currency: 'RSD' | 'BAM' | 'EUR' | 'BGN';
  discountPrice?: number;
  isDefault?: boolean;
}

export interface Ingredient {
  id: string;
  inciName: string;
  serbianName: string;
  bulgarianName?: string;
  description: string;
  bulgarianDescription?: string;
  category: 'herbal_extract' | 'essential_oil' | 'active_compound' | 'base_component' | 'preservative' | 'other';
}

export interface ProductFAQ {
  question: string;
  answer: string;
  category: 'usage' | 'ingredients' | 'effects' | 'safety' | 'storage' | 'general';
}

export interface ProductFAQByCountry {
  [countryCode: string]: ProductFAQ[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  images: {
    main: string;
    gallery: string[];
    thumbnail: string;
    fallback?: string;
  };
  variants: ProductVariant[];
  benefits: string[];
  ingredients: string[]; // Ingredient IDs referencing INGREDIENTS config
  usage: string;
  warnings: string[];
  slug: string;
  alternativeSlugs: string[]; // For different landing pages
  availableCountries: string[];
  seoTitle: string;
  seoDescription: string;
  urgencyElements: {
    limitedStock?: number;
    limitedTime?: string;
    socialProof?: {
      recentPurchases: number;
      timeFrame: string;
    };
  };
  upsells?: {
    products: string[]; // Product IDs
    discountPercentage?: number;
    bundlePrice?: number;
  };
  crossSells?: string[]; // Product IDs
  productFAQ?: ProductFAQByCountry; // Product-specific FAQs by country
}

// Clean ingredients database - only confirmed ingredients from fungel.txt
export const INGREDIENTS: Record<string, Ingredient> = {
  // Herbal Extracts (6 confirmed extracts)
  'calendula-extract': {
    id: 'calendula-extract',
    inciName: 'Calendula Officinalis Flower Extract',
    serbianName: 'Ekstrakt cveta nevena',
    bulgarianName: 'Екстракт от цвят на невен',
    description: 'Tradicionalno se koristi za smiravanje kože, pomaže u obnovi oštećene kože i ima anti-inflamatorna svojstva',
    bulgarianDescription: 'Традиционно се използва за успокояване на кожата, помага за възстановяване на увредената кожа и има противовъзпалителни свойства',
    category: 'herbal_extract'
  },
  'chelidonium-extract': {
    id: 'chelidonium-extract',
    inciName: 'Chelidonium Majus Extract',
    serbianName: 'Ekstrakt rusa',
    description: 'Tradicionalno se koristi za problematičnu kožu, sadrži alkaloide koji mogu pomoći u čišćenju kože',
    category: 'herbal_extract'
  },
  'salvia-leaf-extract': {
    id: 'salvia-leaf-extract',
    inciName: 'Salvia Officinalis Leaf Extract',
    serbianName: 'Ekstrakt lista žalfije',
    description: 'Antimikrobna svojstva, pomaže u regulaciji masnoće kože i ima adstringentno dejstvo',
    category: 'herbal_extract'
  },
  'echinacea-extract': {
    id: 'echinacea-extract',
    inciName: 'Echinacea Purpurea Extract',
    serbianName: 'Ekstrakt ehinaceje',
    description: 'Podrška prirodnoj odbrani kože, tradicionalno se koristi za jačanje otpornosti kože',
    category: 'herbal_extract'
  },
  'galium-extract': {
    id: 'galium-extract',
    inciName: 'Galium Verum Extract',
    serbianName: 'Ekstrakt podmarenka',
    description: 'Tradicionalni biljni lek za kožu, pomaže u čišćenju i smiranju problematične kože',
    category: 'herbal_extract'
  },
  'hypericum-extract': {
    id: 'hypericum-extract',
    inciName: 'Hypericum Perforatum Extract',
    serbianName: 'Ekstrakt kantariona',
    description: 'Tradicionalno se koristi za regeneraciju kože, sadrži hipericin koji pomaže u obnovi oštećene kože',
    category: 'herbal_extract'
  },

  // Essential Oils (5 confirmed oils)
  'tea-tree-oil': {
    id: 'tea-tree-oil',
    inciName: 'Melaleuca Alternifolia Leaf Oil',
    serbianName: 'Ulje čajnog drveta',
    bulgarianName: 'Масло от чаено дърво',
    description: 'Snažna antimikrobna i antifungalna svojstva, tradicionalno se koristi za problematičnu kožu',
    bulgarianDescription: 'Силни антимикробни и антифунгални свойства, традиционно се използва за проблемна кожа',
    category: 'essential_oil'
  },
  'oregano-oil': {
    id: 'oregano-oil',
    inciName: 'Origanum Vulgare Oil',
    serbianName: 'Ulje origana',
    description: 'Prirodna antimikrobna svojstva, tradicionalno se koristi za zaštitu kože od mikroorganizama',
    category: 'essential_oil'
  },
  'lavender-oil': {
    id: 'lavender-oil',
    inciName: 'Lavandula Hybrida Oil',
    serbianName: 'Ulje lavande',
    description: 'Smirujuće dejstvo na kožu, pomaže u relaksaciji i ima blag antiseptički efekat',
    category: 'essential_oil'
  },
  'sage-oil': {
    id: 'sage-oil',
    inciName: 'Salvia Officinalis Oil',
    serbianName: 'Eterično ulje žalfije',
    description: 'Antimikrobna svojstva, pomaže u regulaciji masnoće kože i ima adstringentno dejstvo',
    category: 'essential_oil'
  },
  'eucalyptus-oil': {
    id: 'eucalyptus-oil',
    inciName: 'Eucalyptus Globulus Leaf Oil',
    serbianName: 'Ulje eukaliptusa',
    description: 'Osvežavajuće dejstvo, antimikrobna svojstva i pomaže u čišćenju kože',
    category: 'essential_oil'
  },

  // Active Compounds (5 confirmed actives)
  'panthenol': {
    id: 'panthenol',
    inciName: 'Panthenol',
    serbianName: 'Panthenol (Pro-vitamin B5)',
    description: 'Duboko hidrira kožu, podstiče regeneraciju ćelija kože i smiruje iritacije',
    category: 'active_compound'
  },
  'urea': {
    id: 'urea',
    inciName: 'Urea',
    serbianName: 'Urea',
    description: 'Prirodni hidratantni faktor, pomaže u zadržavanju vlage u koži i omekšava rožnati sloj',
    category: 'active_compound'
  },
  'sweet-almond-oil': {
    id: 'sweet-almond-oil',
    inciName: 'Prunus Amygdalus Dulcis Oil',
    serbianName: 'Ulje slatkog badema',
    description: 'Bogato vitaminima A i E, duboko hidrira i hrani kožu, pogodan za osetljivu kožu',
    category: 'active_compound'
  },
  'vitamin-e': {
    id: 'vitamin-e',
    inciName: 'Tocopheryl Acetate',
    serbianName: 'Vitamin E',
    description: 'Snažan antioksidans, štiti kožu od slobodnih radikala i usporava proces starenja',
    category: 'active_compound'
  },
  'vitamin-a': {
    id: 'vitamin-a',
    inciName: 'Retinyl Palmitate',
    serbianName: 'Vitamin A',
    description: 'Podstiče obnovu ćelija kože, poboljšava teksturu kože i pomaže u regeneraciji',
    category: 'active_compound'
  },

  // Base Components (8 confirmed base ingredients)
  'aqua': {
    id: 'aqua',
    inciName: 'Aqua (Water)',
    serbianName: 'Voda',
    description: 'Osnovna komponenta emulzije, obezbeđuje hidrataciju i služi kao nosač aktivnih sastojaka',
    category: 'base_component'
  },
  'alcohol': {
    id: 'alcohol',
    inciName: 'Alcohol',
    serbianName: 'Alkohol',
    description: 'Deo ekstraktnog rastvora, pomaže u ekstrakciji aktivnih sastojaka iz biljaka',
    category: 'base_component'
  },
  'glycerin': {
    id: 'glycerin',
    inciName: 'Glycerin',
    serbianName: 'Glicerin',
    description: 'Efikasan humektant koji privlači vlagu iz vazduha i zadržava je u koži',
    category: 'base_component'
  },
  'castor-oil': {
    id: 'castor-oil',
    inciName: 'Ricinus Communis Seed Oil',
    serbianName: 'Ricinusovo ulje',
    description: 'Prirodno ulje koje hidrira kožu i pomaže u formiranju zaštitnog sloja na koži',
    category: 'base_component'
  },
  'stearic-acid': {
    id: 'stearic-acid',
    inciName: 'Stearic Acid',
    serbianName: 'Stearinska kiselina',
    description: 'Emulgator koji pomaže u stvaranju stabilne emulzije i daje kremastost proizvodu',
    category: 'base_component'
  },
  'cetyl-alcohol': {
    id: 'cetyl-alcohol',
    inciName: 'Cetyl Alcohol',
    serbianName: 'Cetil alkohol',
    description: 'Emulgator i stabilizator koji daje glatku teksturu i pomaže u zadržavanju vlage',
    category: 'base_component'
  },
  'glyceryl-stearate': {
    id: 'glyceryl-stearate',
    inciName: 'Glyceryl Stearate SE',
    serbianName: 'Gliceril stearat SE',
    description: 'Emulgator koji pomaže u stvaranju stabilne emulzije i omogućava mešanje ulja i vode',
    category: 'base_component'
  },
  'synthetic-beeswax': {
    id: 'synthetic-beeswax',
    inciName: 'Synthetic Beeswax',
    serbianName: 'Sintetički pčelinji vosak',
    description: 'Stvara zaštitni sloj na koži i pomaže u zadržavanju vlage',
    category: 'base_component'
  },

  // Other Functional Ingredients (2 confirmed)
  'triethanolamine': {
    id: 'triethanolamine',
    inciName: 'Triethanolamine',
    serbianName: 'Trietanolamin',
    description: 'pH regulator koji održava optimalnu kiselost proizvoda za kožu',
    category: 'other'
  },
  'carbomer': {
    id: 'carbomer',
    inciName: 'Carbomer',
    serbianName: 'Karbomer',
    description: 'Reološki modifikator koji obezbeđuje idealnu teksturu i konzistenciju kreme',
    category: 'other'
  },

  // Preservatives (4 confirmed preservatives)
  'phenoxyethanol': {
    id: 'phenoxyethanol',
    inciName: 'Phenoxyethanol',
    serbianName: 'Fenoksietanol',
    description: 'Siguran konzervans odobren u EU, štiti proizvod od mikrobiološke kontaminacije',
    category: 'preservative'
  },
  'ethylhexylglycerin': {
    id: 'ethylhexylglycerin',
    inciName: 'Ethylhexylglycerin',
    serbianName: 'Etilheksil glicerin',
    description: 'Prirodni konzervans koji takođe ima kondicionirujuća svojstva za kožu',
    category: 'preservative'
  },
  'sodium-benzoate': {
    id: 'sodium-benzoate',
    inciName: 'Sodium Benzoate',
    serbianName: 'Natrijum benzoat',
    description: 'Konzervans koji štiti proizvod od bakterija i gljivica',
    category: 'preservative'
  },
  'potassium-sorbate': {
    id: 'potassium-sorbate',
    inciName: 'Potassium Sorbate',
    serbianName: 'Kalijum sorbat',
    description: 'Blagi konzervans koji sprečava rast mikroorganizama',
    category: 'preservative'
  }
};

export const PRODUCTS: Record<string, Product> = {
  fungel: {
    id: 'fungel',
    name: 'FUNGEL',
    description: 'FUNGEL je specijalizovana emulzija za kožu koja kombinuje 6 medicinskih biljnih ekstrakata (23.48% ukupno) sa 5 eteričnih ulja predvođenih čajnim drvetom i origanom. Obogaćena panthenolom (pro-vitamin B5), vitaminima A i E, plus hidratantnim agensima uključujući glicerin, ulje slatkog badema i ricinusovo ulje.',
    shortDescription: 'Emulzija za kožu sa 6 biljnih ekstrakata i 5 eteričnih ulja - 50ml',
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
      'Antimikrobna i antifungalna svojstva od čajnog drveta i origana',
      'Podrška obnovi kože sa panthenolom (Pro-vitamin B5)',
      'Antioksidativna zaštita sa vitaminima E i A',
      'Hidratacija sa glicerinom, uljem slatkog badema i ricinusovim uljem',
      '6 medicinskih biljnih ekstrakata uključujući nevena, kantariona i žalfije',
      'Leave-on formula za kontinuiranu negu - pH 6.7 kompatibilno sa kožom'
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
    usage: 'Dva puta dnevno nanesite proizvod na delove kože ili noktiju. Leave-on formula - ne ispirati. Sadržaj: 50ml.',
    warnings: [
      'Samo za spoljašnju upotrebu',
      'Oprez na osetljivost na bilo koji prisutan sastojak',
      'Oprati ruke nakon upotrebe',
      'Ne koristiti na ranama',
      'Izbegavati kontakt sa očima',
      'U slučaju kontakta odmah isprati vodom',
      'Prestati sa upotrebom i kontaktirati lekara ako dođe do iritacije',
      'Čuvati na hladnom, suvom mestu',
      'Sadržava alergene: Limonene, Linalool'
    ],
    slug: 'fungel',
    alternativeSlugs: ['fungel-promo', 'antifungal-gel', 'gljivice-stopala'],
    availableCountries: ['rs', 'ba', 'me', 'eu', 'bg'],
    seoTitle: 'DERMOTIN FUNGEL - Emulzija za kožu sa 6 biljnih ekstrakata | 50ml',
    seoDescription: 'DERMOTIN FUNGEL - specijalizovana emulzija za kožu sa 6 medicinskih biljnih ekstrakata i 5 eteričnih ulja. Čajno drvo, origano, nevena. EU-usklađena formula. 50ml.',
    urgencyElements: {
      limitedStock: 47,
      limitedTime: '24h',
      socialProof: {
        recentPurchases: 127,
        timeFrame: 'poslednja 24h'
      }
    },
    upsells: {
      products: ['antifungal-powder'],
      discountPercentage: 30,
      bundlePrice: 5990
    },
    crossSells: ['foot-cream', 'nail-oil'],
    productFAQ: {
      rs: [
        {
          question: "Kako se koristi FUNGEL?",
          answer: "Nanositi 2 puta dnevno na delove kože ili noktiju. FUNGEL je leave-on formula što znači da se ne ispira nakon nanošenja. Sadržaj od 50ml je dostatan za okvirno 2 nedelje redovne upotrebe.",
          category: "usage"
        },
        {
          question: "Kada mogu očekivati prve rezultate?",
          answer: "Prvi rezultati se mogu videti već nakon 3-5 dana redovne upotrebe. Za najbolje rezultate preporučuje se korišćenje 2-4 nedelje.",
          category: "effects"
        },
        {
          question: "Da li FUNGEL sadrži prirodne sastojke?",
          answer: "Da, FUNGEL sadrži 6 medicinskih biljnih ekstrakata (nevena, rus, žalfija, ehinacea, kantarion, podmarenok) i 5 eteričnih ulja (čajno drvo, origano, lavanda, žalfija, eukaliptus), plus hidratantne komponente.",
          category: "ingredients"
        },
        {
          question: "Da li je FUNGEL bezbedan za svakodnevnu upotrebu?",
          answer: "Da, FUNGEL je klinički testiran i sadrži prirodne sastojke. Formula je pH 6.7 što je kompatibilno sa kožom. Proizvod je registrovan i odobren za upotrebu.",
          category: "safety"
        },
        {
          question: "Mogu li koristiti FUNGEL na osetljivoj koži?",
          answer: "FUNGEL sadrži prirodne sastojke, ali preporučujemo test patch na maloj površini pre prve upotrebe. Ako dođe do iritacije, prestati sa upotrebom.",
          category: "safety"
        },
        {
          question: "Kako da čuvam FUNGEL?",
          answer: "Čuvati na hladnom, suvom mestu, van dosega dece. Zatvoriti nakon upotrebe. Rok trajanja je označen na pakovanju.",
          category: "storage"
        },
        {
          question: "Da li FUNGEL može da se koristi sa drugim proizvodima?",
          answer: "FUNGEL može da se koristi sa drugim proizvodima, ali preporučujemo da sačekate da se upije pre nanošenja drugih proizvoda. Izbegavajte mešanje sa drugim antimikrobnim proizvodima.",
          category: "usage"
        },
        {
          question: "Šta su glavni aktivni sastojci u FUNGEL-u?",
          answer: "Glavni aktivni sastojci su tea tree ulje i origano za antimikrobno dejstvo, panthenol (Pro-vitamin B5) za regeneraciju, vitamini E i A za antioksidativnu zaštitu, plus 6 biljnih ekstrakata.",
          category: "ingredients"
        }
      ],
      ba: [
        {
          question: "Kako se koristi FUNGEL?",
          answer: "Nanositi 2 puta dnevno na delove kože ili noktiju. FUNGEL je leave-on formula što znači da se ne ispira nakon nanošenja. Sadržaj od 50ml je dostatan za okvirno 2 nedelje redovne upotrebe.",
          category: "usage"
        },
        {
          question: "Kada mogu očekivati prve rezultate?",
          answer: "Prvi rezultati se mogu videti već nakon 3-5 dana redovne upotrebe. Za najbolje rezultate preporučuje se korišćenje 2-4 nedelje.",
          category: "effects"
        },
        {
          question: "Da li FUNGEL sadrži prirodne sastojke?",
          answer: "Da, FUNGEL sadrži 6 medicinskih biljnih ekstrakata i 5 eteričnih ulja, plus hidratantne komponente.",
          category: "ingredients"
        },
        {
          question: "Da li je FUNGEL bezbedan za svakodnevnu upotrebu?",
          answer: "Da, FUNGEL je klinički testiran i sadrži prirodne sastojke. Proizvod je registrovan i odobren za upotrebu.",
          category: "safety"
        }
      ],
      me: [
        {
          question: "Kako se koristi FUNGEL?",
          answer: "Nanositi 2 puta dnevno na delove kože ili noktiju. FUNGEL je leave-on formula što znači da se ne ispira nakon nanošenja.",
          category: "usage"
        },
        {
          question: "Kada mogu očekivati prve rezultate?",
          answer: "Prvi rezultati se mogu videti već nakon 3-5 dana redovne upotrebe. Za najbolje rezultate preporučuje se korišćenje 2-4 nedelje.",
          category: "effects"
        },
        {
          question: "Da li je FUNGEL bezbedan za upotrebu?",
          answer: "Da, FUNGEL je klinički testiran i sadrži prirodne sastojke. Proizvod je registrovan i odobren za upotrebu.",
          category: "safety"
        }
      ],
      eu: [
        {
          question: "How to use FUNGEL?",
          answer: "Apply twice daily to affected skin or nail areas. FUNGEL is a leave-on formula, do not rinse after application. 50ml content is sufficient for approximately 2 weeks of regular use.",
          category: "usage"
        },
        {
          question: "When can I expect first results?",
          answer: "First results can be seen after 3-5 days of regular use. For best results, 2-4 weeks of use is recommended.",
          category: "effects"
        },
        {
          question: "Does FUNGEL contain natural ingredients?",
          answer: "Yes, FUNGEL contains 6 medicinal plant extracts (calendula, chelidonium, sage, echinacea, galium, hypericum) and 5 essential oils (tea tree, oregano, lavender, sage, eucalyptus), plus moisturizing components.",
          category: "ingredients"
        },
        {
          question: "Is FUNGEL safe for daily use?",
          answer: "Yes, FUNGEL is clinically tested and contains natural ingredients. The formula is pH 6.7 which is skin-compatible. The product is registered and approved for use according to EU regulations.",
          category: "safety"
        },
        {
          question: "Can I use FUNGEL on sensitive skin?",
          answer: "FUNGEL contains natural ingredients, but we recommend a patch test on a small area before first use. If irritation occurs, discontinue use.",
          category: "safety"
        },
        {
          question: "How should I store FUNGEL?",
          answer: "Store in a cool, dry place, out of reach of children. Close after use. Expiry date is marked on the package.",
          category: "storage"
        }
      ],
      bg: [
        {
          question: "Как се използва FUNGEL?",
          answer: "Нанасяйте 2 пъти дневно на засегнатите участъци от кожата или ноктите. FUNGEL е leave-on формула, което означава, че не се изплаква след нанасяне.",
          category: "usage"
        },
        {
          question: "Кога мога да очаквам първи резултати?",
          answer: "Първите резултати могат да се видят след 3-5 дни редовна употреба. За най-добри резултати се препоръчва употреба 2-4 седмици.",
          category: "effects"
        },
        {
          question: "Съдържа ли FUNGEL естествени съставки?",
          answer: "Да, FUNGEL съдържа 6 медицински растителни екстракта и 5 етерични масла, плюс хидратиращи компоненти.",
          category: "ingredients"
        },
        {
          question: "Безопасен ли е FUNGEL за ежедневна употреба?",
          answer: "Да, FUNGEL е клинично тестван и съдържа естествени съставки. Продуктът е регистриран и одобрен за употреба.",
          category: "safety"
        }
      ]
    }
  },
  'foot-cream': {
    id: 'foot-cream',
    name: 'DERMOTIN Foot Cream (DEMO)',
    description: 'Hidratantna krema za stopala sa prirodnim ekstraktima.',
    shortDescription: 'Dubinska hidratacija i zaštita stopala - DEMO proizvod',
    category: 'skincare',
    images: {
      main: '/images/products/fungel/fungel-box-and-product-mockup.png',
      gallery: [
        'https://picsum.photos/id/431/400/400'
      ],
      thumbnail: 'https://picsum.photos/id/431/400/400'
    },
    variants: [
      {
        id: 'foot-cream-50ml',
        sku: 'DERM-FOOT-002',
        name: 'DERMOTIN Foot Cream',
        size: '50ml tube',
        quantity: 1,
        price: 1500,
        currency: 'RSD',
        discountPrice: 990,
        isDefault: true
      }
    ],
    benefits: [
      'Dubinska hidratacija',
      'Omekšava grubu kožu',
      'Sprečava pucanje',
      'Prirodni sastojci'
    ],
    ingredients: [
      'Shea Butter',
      'Urea 10%',
      'Aloe Vera',
      'Vitamin E'
    ],
    usage: 'Nanositi na čista i suva stopala jednom dnevno.',
    warnings: [
      'Samo za spoljašnju upotrebu',
      'Izbegavati kontakt sa očima'
    ],
    slug: 'foot-cream',
    alternativeSlugs: ['krema-za-stopala'],
    availableCountries: ['rs', 'ba', 'me', 'eu', 'bg'],
    seoTitle: 'DERMOTIN Foot Cream - Krema za stopala',
    seoDescription: 'Hidratantna krema za stopala sa prirodnim ekstraktima.',
    urgencyElements: {
      limitedStock: 25
    }
  },
  'face-serum': {
    id: 'face-serum',
    name: 'DERMOTIN Face Serum (DEMO)',
    description: 'Intenzivni serum za lice sa vitaminima i prirodnim uljima.',
    shortDescription: 'Anti-age serum sa vitamin C i E - DEMO proizvod',
    category: 'skincare',
    images: {
      main: '/images/products/fungel/fungel-box-and-product-mockup.png',
      gallery: [
        'https://picsum.photos/id/234/400/400'
      ],
      thumbnail: 'https://picsum.photos/id/234/400/400'
    },
    variants: [
      {
        id: 'face-serum-30ml',
        sku: 'DERM-SERUM-003',
        name: 'DERMOTIN Face Serum',
        size: '30ml dropper bottle',
        quantity: 1,
        price: 3200,
        currency: 'RSD',
        discountPrice: 2490,
        isDefault: true
      }
    ],
    benefits: [
      'Pomlađuje kožu',
      'Izglađuje bore',
      'Hidrira u dubinu',
      'Prirodni antioksidanti'
    ],
    ingredients: [
      'Vitamin C',
      'Vitamin E',
      'Hyaluronic Acid',
      'Retinol'
    ],
    usage: 'Nanositi ujutru i uveče na čisto lice.',
    warnings: [
      'Samo za spoljašnju upotrebu',
      'Izbegavati kontakt sa očima'
    ],
    slug: 'face-serum',
    alternativeSlugs: ['serum-za-lice'],
    availableCountries: ['rs', 'ba', 'me', 'eu', 'bg'],
    seoTitle: 'DERMOTIN Face Serum - Anti-age serum za lice',
    seoDescription: 'Intenzivni serum za lice sa vitaminima i prirodnim uljima.',
    urgencyElements: {
      limitedStock: 33
    }
  },
  'body-lotion': {
    id: 'body-lotion',
    name: 'DERMOTIN Body Lotion (DEMO)',
    description: 'Hidratantna losion za telo sa ekstraktima biljaka.',
    shortDescription: 'Nežna hidratacija za celo telo - DEMO proizvod',
    category: 'skincare',
    images: {
      main: '/images/products/fungel/fungel-box-and-product-mockup.png',
      gallery: [
        'https://picsum.photos/id/152/400/400'
      ],
      thumbnail: 'https://picsum.photos/id/152/400/400'
    },
    variants: [
      {
        id: 'body-lotion-200ml',
        sku: 'DERM-LOTION-004',
        name: 'DERMOTIN Body Lotion',
        size: '200ml pump bottle',
        quantity: 1,
        price: 2500,
        currency: 'RSD',
        discountPrice: 1890,
        isDefault: true
      }
    ],
    benefits: [
      '24h hidratacija',
      'Brza apsorpcija',
      'Prirodni sastojci',
      'Pogodno za osetljivu kožu'
    ],
    ingredients: [
      'Aloe Vera',
      'Shea Butter',
      'Coconut Oil',
      'Vitamin E'
    ],
    usage: 'Nanositi na čisto i suvo telo svakodnevno.',
    warnings: [
      'Samo za spoljašnju upotrebu',
      'Izbegavati kontakt sa očima'
    ],
    slug: 'body-lotion',
    alternativeSlugs: ['losion-za-telo'],
    availableCountries: ['rs', 'ba', 'me', 'eu', 'bg'],
    seoTitle: 'DERMOTIN Body Lotion - Hidratantna losion za telo',
    seoDescription: 'Hidratantna losion za telo sa ekstraktima biljaka.',
    urgencyElements: {
      limitedStock: 18
    }
  }
};

export const PRODUCT_CATEGORIES = {
  antifungal: {
    name: 'Antifungalni proizvodi',
    description: 'Proizvodi za lečenje gljivičnih infekcija'
  },
  skincare: {
    name: 'Nega kože',
    description: 'Proizvodi za svakodnevnu negu kože'
  },
  haircare: {
    name: 'Nega kose',
    description: 'Proizvodi za negu kose i vlasišta'
  }
} as const;

export function getProduct(id: string): Product | undefined {
  return PRODUCTS[id];
}

export function getProductBySlug(slug: string): Product | undefined {
  return Object.values(PRODUCTS).find(
    product => product.slug === slug || product.alternativeSlugs.includes(slug)
  );
}

export function getProductsForCountry(countryCode: string): Product[] {
  return Object.values(PRODUCTS).filter(
    product => product.availableCountries.includes(countryCode)
  );
}

export function getProductPrice(product: Product, currency: 'RSD' | 'BAM' | 'EUR' | 'BGN', variantId?: string): number {
  const variant = variantId 
    ? product.variants.find(v => v.id === variantId)
    : product.variants.find(v => v.isDefault) || product.variants[0];
    
  if (!variant) return 0;
  
  // For now, return the base price - implement currency conversion later
  return variant.discountPrice || variant.price;
}

export function getProductFAQ(product: Product, countryCode: string): ProductFAQ[] {
  if (!product.productFAQ) return [];
  return product.productFAQ[countryCode] || product.productFAQ['rs'] || [];
}

export function getProductFAQByCategory(product: Product, countryCode: string, category: string): ProductFAQ[] {
  return getProductFAQ(product, countryCode).filter(item => item.category === category);
}
