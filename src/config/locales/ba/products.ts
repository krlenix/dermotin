import { Product } from '../../types';

export const PRODUCTS: Record<string, Product> = {
  fungel: {
    id: 'fungel',
    name: 'FUNGEL',
    description: 'Krema za njegu kože i noktiju osoba sklonih pojavi gljivica. Kombinuje 6 biljnih ekstrakata i 5 eteričnih ulja sa panthenolom, ureom i vitaminima A i E. Redovnom upotrebom, 2 puta dnevno, doprinosi njegovanom i urednom izgledu kože i noktiju.',
    shortDescription: 'Njega kože i noktiju sklonih gljivicama',
    heroTitle: 'Njegovana koža i uredni nokti, bez kompromisa',
    purpose: 'Za njegu kože i noktiju osoba sklonih pojavi gljivica',
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
        price: 54.9,
        currency: 'BAM',
        discountPrice: 33.9,
        isDefault: true
      },
      {
        id: 'fungel-2pak',
        sku: 'FUNGEL',
        name: '2 PAKOVANJA (100ml)',
        size: 'Okvirno mjesec i po upotrebe',
        quantity: 2,
        price: 109.8,
        currency: 'BAM',
        discountPrice: 59.9
      },
      {
        id: 'fungel-3pak',
        sku: 'FUNGEL',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 2 mjeseca i pol upotrebe',
        quantity: 3,
        price: 164.7,
        currency: 'BAM',
        discountPrice: 79.9
      }
    ],
    benefits: [
      'Namjenski razvijen za njegu kože i noktiju sklonih pojavi gljivica',
      'Sadrži 6 biljnih ekstrakata: neven, rusa, žalfija, ehinacea, ivanjsko cvijeće i kantarion',
      '5 eteričnih ulja: čajno drvo, origano, lavandin, žalfija i eukaliptus',
      'Panthenol, urea i glicerin doprinose hidrataciji kože',
      'Obogaćen vitaminima A i E i uljem slatkog badema',
      'Bez parabena i bez vještačkih boja',
      'Leave-on formula - nanosi se 2x dnevno i ne ispira se',
      'Bezbjednosno procijenjen u skladu sa EU regulativom (EC) 1223/2009'
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
    usage: 'Nanositi 2 puta dnevno na dijelove kože ili noktiju. Ne ispirati nakon nanošenja. Sadržaj: 50ml.',
    usageSteps: [
      'Očistite i osušite kožu ili nokte prije nanošenja',
      'Nanesite tanak sloj FUNGEL-a na željeno mjesto',
      'Nježno umasirajte dok se ne upije',
      'Koristite 2 puta dnevno (ujutru i navečer)',
      'Ne ispirati nakon nanošenja',
      'Za najbolji efekat njege koristite redovno'
    ],
    warnings: [
      'Samo za vanjsku upotrebu',
      'Obratiti pažnju na preosjetljivost na bilo koji sastojak',
      'Oprati ruke nakon nanošenja',
      'Ne koristiti na ranama',
      'Izbjegavati kontakt sa očima; u slučaju kontakta odmah isprati vodom',
      'Prekinuti upotrebu i javiti se ljekaru ako dođe do iritacije',
      'Čuvati na hladnom, suhom mjestu',
      'Sadrži prirodne alergene iz eteričnih ulja (Limonene, Linalool)'
    ],
    slug: 'fungel',
    alternativeSlugs: ['fungel-promo', 'njega-noktiju', 'gljivice-stopala'],
    availableCountries: ['rs', 'ba'],
    seoTitle: 'FUNGEL - Krema za njegu kože i noktiju sklonih gljivicama | DERMOTIN',
    seoDescription: 'FUNGEL od DERMOTIN brenda - krema za njegu kože i noktiju osoba sklonih pojavi gljivica. 6 biljnih ekstrakata i 5 eteričnih ulja (čajno drvo, origano), panthenol, urea, vitamini A i E. Bez parabena. 50ml.',
    // Povezani proizvodi: FUNGOMAX (ista namjena, serum za nokte), BIOWART (njega kože)
    upsells: {
      products: ['fungomax'],
      discountPercentage: 10
    },
    crossSells: ['fungomax', 'biowart'],
    urgencyElements: {},
    productFAQ: [
      {
        question: "Kako se koristi FUNGEL?",
        answer: "Vrlo jednostavno! Nanesite tanak sloj 2 puta dnevno na kožu ili nokte i nježno umasirajte. Ne ispira se - samo ostavite da se upije. Pakovanje sadrži 50ml.",
        category: "usage"
      },
      {
        question: "Šta FUNGEL sadrži?",
        answer: "6 biljnih ekstrakata (neven, rusa, žalfija, ehinacea, ivanjsko cvijeće i kantarion) i 5 eteričnih ulja (čajno drvo, origano, lavandin, žalfija i eukaliptus), uz panthenol, ureu, glicerin i vitamine A i E.",
        category: "ingredients"
      },
      {
        question: "Da li je FUNGEL lijek?",
        answer: "Ne. FUNGEL je kozmetički proizvod za njegu kože i noktiju osoba sklonih pojavi gljivica. Ako imate zdravstveni problem, obratite se ljekaru ili farmaceutu.",
        category: "safety"
      },
      {
        question: "Da li je bezbjedan za svakodnevnu upotrebu?",
        answer: "Da, FUNGEL je namijenjen redovnoj upotrebi 2 puta dnevno. Prošao je bezbjednosnu procjenu u skladu sa EU regulativom o kozmetičkim proizvodima (EC) 1223/2009, a pH formule je 6,7.",
        category: "safety"
      },
      {
        question: "Mogu li ga koristiti ako imam osjetljivu kožu?",
        answer: "Ako imate vrlo osjetljivu kožu, preporučujemo da prvo testirate na maloj površini. Proizvod sadrži prirodne alergene iz eteričnih ulja (limonen, linalol). Ako dođe do iritacije, prekinite upotrebu i posavjetujte se sa ljekarom.",
        category: "safety"
      },
      {
        question: "Kako da čuvam FUNGEL?",
        answer: "Čuvajte na hladnom, suhom mjestu, van domašaja djece. Zatvorite dobro nakon upotrebe. Rok trajanja je označen na pakovanju.",
        category: "storage"
      },
      {
        question: "Mogu li da koristim FUNGEL sa drugim kremama?",
        answer: "Možete - sačekajte da se FUNGEL upije prije nanošenja drugih proizvoda. Za nokte se odlično uklapa u rutinu sa FUNGOMAX serumom.",
        category: "usage"
      },
      {
        question: "Da li je FUNGEL namijenjen djeci?",
        answer: "Ne, FUNGEL je namijenjen odraslima. To je definirano bezbjednosnom procjenom proizvoda.",
        category: "safety"
      }
    ],
    testimonials: []
  },

  biomelis: {
    id: 'biomelis',
    name: 'BIOMELIS',
    description: 'Krema za njegu kože osoba sklonih ekcemima i psorijazi. Formula sa 8 biljnih ekstrakata i 5 eteričnih ulja, obogaćena panthenolom, ureom i vitaminima A i E, njeguje i hidrira kožu i doprinosi osjećaju komfora. Pogodna za svakodnevnu upotrebu.',
    shortDescription: 'Njega kože sklone ekcemima i psorijazi',
    heroTitle: 'Svakodnevna njega za kožu koja traži više',
    purpose: 'Za njegu kože osoba sklonih ekcemima i psorijazi',
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
        price: 54.9,
        currency: 'BAM',
        discountPrice: 33.9,
        isDefault: true
      },
      {
        id: 'biomelis-2pak',
        sku: 'BIOMELIS',
        name: '2 PAKOVANJA (100ml)',
        size: 'Okvirno mjesec i po upotrebe', 
        quantity: 2,
        price: 109.8,
        currency: 'BAM',
        discountPrice: 59.9
      },
      {
        id: 'biomelis-3pak',
        sku: 'BIOMELIS',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 2 mjeseca i pol upotrebe',
        quantity: 3,
        price: 164.7,
        currency: 'BAM',
        discountPrice: 79.9
      }
    ],
    benefits: [
      'Namjenski razvijena za njegu kože sklone ekcemima i psorijazi',
      'Sadrži 8 biljnih ekstrakata: neven, rusa, žalfija, hajdučka trava, rastavić, ivanjsko cvijeće, kantarion i hrastova kora',
      '5 eteričnih ulja: žalfija, eukaliptus, lavandin, ruzmarin i timijan',
      'Panthenol, urea i glicerin doprinose hidrataciji i mekšem osjećaju kože',
      'Obogaćena vitaminima A i E i uljem slatkog badema',
      'Bez parabena i bez vještačkih boja',
      'Pogodna za svakodnevnu upotrebu, 2 puta dnevno',
      'Bezbjednosno procijenjena u skladu sa EU regulativom (EC) 1223/2009'
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
      'quercus-bark-extract',
      // Essential oils - 5 oils per CPSR
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
    usage: 'Nanositi 2 puta dnevno na kožu i nježno utrljati. Ne ispirati nakon nanošenja. Sadržaj: 50ml.',
    usageSteps: [
      'Očistite kožu blagim sredstvom za pranje i osušite',
      'Nanesite malu količinu BIOMELIS-a na željeno mjesto',
      'Nježno umasirajte kružnim pokretima dok se ne upije',
      'Koristite 2 puta dnevno (ujutru i navečer)',
      'Ne ispirati nakon nanošenja',
      'Za najbolji efekat njege koristite redovno'
    ],
    warnings: [
      'Samo za vanjsku upotrebu',
      'Obratiti pažnju na preosjetljivost na bilo koji sastojak',
      'Nanositi samo na neoštećenu kožu',
      'Izbjegavati kontakt sa očima; u slučaju kontakta isprati sa dosta vode',
      'Ako iritacija ne prestane, potražiti savjet ljekara',
      'Čuvati na hladnom, suhom mjestu',
      'Sadrži prirodne alergene iz eteričnih ulja (Limonene, Linalool)',
      'Čuvati van domašaja djece'
    ],
    slug: 'biomelis',
    alternativeSlugs: ['biomelis-melem', 'ekcem-psorijaza', 'osjetljiva-koza'],
    availableCountries: ['rs', 'ba'],
    seoTitle: 'BIOMELIS - Krema za njegu kože sklone ekcemima i psorijazi | DERMOTIN',
    seoDescription: 'BIOMELIS od DERMOTIN brenda - krema za njegu kože osoba sklonih ekcemima i psorijazi. 8 biljnih ekstrakata i 5 eteričnih ulja, panthenol, urea, vitamini A i E. Bez parabena. 50ml.',
    // Povezani proizvod: FUNGEL (srodna njega kože; kapi ne postoje u BA katalogu)
    crossSells: ['fungel'],
    urgencyElements: {},
    productFAQ: [
      {
        question: "Kako se koristi BIOMELIS?",
        answer: "Vrlo jednostavno! Nanesite malu količinu 2 puta dnevno na očišćenu, neoštećenu kožu i nježno utrljajte. Ne ispira se - samo ostavite da se upije. Pakovanje sadrži 50ml.",
        category: "usage"
      },
      {
        question: "Šta BIOMELIS sadrži?",
        answer: "8 biljnih ekstrakata (neven, rusa, žalfija, hajdučka trava, rastavić, ivanjsko cvijeće, kantarion i hrastova kora) i 5 eteričnih ulja (žalfija, eukaliptus, lavandin, ruzmarin i timijan), uz panthenol, ureu, glicerin i vitamine A i E.",
        category: "ingredients"
      },
      {
        question: "Da li je BIOMELIS lijek?",
        answer: "Ne. BIOMELIS je kozmetički proizvod za njegu kože osoba sklonih ekcemima i psorijazi i ne zamjenjuje terapiju koju je propisao ljekar. Za zdravstvene tegobe obratite se ljekaru.",
        category: "safety"
      },
      {
        question: "Da li je BIOMELIS pogodan za svakodnevnu upotrebu?",
        answer: "Da, BIOMELIS je namijenjen redovnoj upotrebi 2 puta dnevno. Prošao je bezbjednosnu procjenu u skladu sa EU regulativom o kozmetičkim proizvodima (EC) 1223/2009, a pH formule je 6,7.",
        category: "safety"
      },
      {
        question: "Šta mogu da očekujem od BIOMELIS-a?",
        answer: "BIOMELIS njeguje i hidrira kožu - panthenol, urea i glicerin doprinose hidrataciji i mekšem osjećaju kože, dok biljni ekstrakti i eterična ulja doprinose osjećaju komfora i njegovanom izgledu.",
        category: "effects"
      },
      {
        question: "Kako da čuvam BIOMELIS?",
        answer: "Čuvajte na hladnom, suhom mjestu, van domašaja djece. Zatvorite dobro nakon upotrebe. Rok trajanja je označen na pakovanju.",
        category: "storage"
      },
      {
        question: "Da li mogu da koristim BIOMELIS sa drugim proizvodima?",
        answer: "Možete - sačekajte da se BIOMELIS upije prije nanošenja drugih proizvoda. Ako imate vrlo osjetljivu kožu, prvo testirajte na maloj površini jer proizvod sadrži prirodne alergene iz eteričnih ulja.",
        category: "usage"
      },
      {
        question: "Da li je BIOMELIS namijenjen djeci?",
        answer: "Ne, BIOMELIS je namijenjen odraslima. To je definirano bezbjednosnom procjenom proizvoda.",
        category: "safety"
      }
    ],
    testimonials: []
  },

  biowart: {
    id: 'biowart',
    name: 'BIOWART',
    description: 'Krema za njegu kože osoba sklonih pojavi bradavica. Formula sa 7 biljnih ekstrakata - među kojima su rusa i neven u najvišim koncentracijama - i 7 eteričnih ulja, obogaćena panthenolom, ureom i vitaminima A i E. Za ciljanu, svakodnevnu njegu kože.',
    shortDescription: 'Ciljana njega kože sklone pojavi bradavica',
    heroTitle: 'Ciljana njega za kožu sklonu bradavicama',
    purpose: 'Za njegu kože osoba sklonih pojavi bradavica',
    category: 'skincare',
    slug: 'biowart',
    alternativeSlugs: [],
    availableCountries: ['rs', 'ba'],
    seoTitle: 'BIOWART - Krema za njegu kože sklone pojavi bradavica | DERMOTIN',
    seoDescription: 'BIOWART od DERMOTIN brenda - krema za njegu kože osoba sklonih pojavi bradavica. 7 biljnih ekstrakata (rusa, neven, hrastova kora) i 7 eteričnih ulja, panthenol, urea, vitamini A i E. Bez parabena. 50ml.',
    // Povezani proizvod: FUNGEL (srodna njega kože)
    crossSells: ['fungel'],
    urgencyElements: {},
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
        price: 54.9,
        currency: 'BAM',
        discountPrice: 33.9,
        isDefault: true
      },
      {
        id: 'biowart-2pak',
        sku: 'BIOWART',
        name: '2 PAKOVANJA (100ml)',
        size: 'Okvirno mjesec i po upotrebe',
        quantity: 2,
        price: 109.8,
        currency: 'BAM',
        discountPrice: 59.9
      },
      {
        id: 'biowart-3pak',
        sku: 'BIOWART',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 2 mjeseca i pol upotrebe',
        quantity: 3,
        price: 164.7,
        currency: 'BAM',
        discountPrice: 79.9
      }
    ],
    benefits: [
      'Namjenski razvijena za njegu kože sklone pojavi bradavica',
      'Rusa (Chelidonium majus) i neven u najvišim koncentracijama među biljnim ekstraktima',
      'Ukupno 7 biljnih ekstrakata: rusa, neven, hajdučka trava, ivanjsko cvijeće, kantarion, hrastova kora i žalfija',
      '7 eteričnih ulja: žalfija, eukaliptus, nana, karanfilić, timijan, zvjezdasti anis i limun',
      'Panthenol, urea i glicerin doprinose hidrataciji kože',
      'Obogaćena vitaminima A i E i uljem slatkog badema',
      'Bez parabena i bez vještačkih boja',
      'Bezbjednosno procijenjena u skladu sa EU regulativom (EC) 1223/2009'
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
      'clove-bud-oil', // Eterično ulje karanfilića (pupoljak)
      'thyme-oil', // Eterično ulje timijana
      'anise-oil', // Eterično ulje zvjezdastog anisa
      'lemon-oil', // Eterično ulje limuna
      // Vitamins and nutrients
      'panthenol', // Pro-Vitamin B5 (0.91%)
      'urea', // Urea (0.91%)
      'sweet-almond-oil', // Prunus Amygdalus Dulcis Oil
      'vitamin-e', // Tocopheryl Acetate
      'vitamin-a', // Retinyl Palmitate
      // Base components
      'aqua',
      'alcohol', // U sastavu biljne tinkture
      'stearic-acid',
      'glycerin', // 1.83%
      'cetyl-alcohol',
      'glyceryl-stearate',
      'synthetic-beeswax',
      // Functional ingredients
      'triethanolamine',
      'carbomer',
      // Preservatives
      'phenoxyethanol',
      'ethylhexylglycerin',
      'sodium-benzoate',
      'potassium-sorbate'
    ],
    usage: 'Nanositi tanak sloj na čistu i suhu kožu 1-2 puta dnevno. Ne ispirati nakon nanošenja. Sadržaj: 50ml.',
    usageSteps: [
      'Očistite i osušite kožu prije nanošenja',
      'Nanesite tanak sloj BIOWART-a na željeno mjesto',
      'Ostavite da se upije',
      'Koristite 1-2 puta dnevno',
      'Ne ispirati nakon nanošenja',
      'Za najbolji efekat njege koristite redovno'
    ],
    warnings: [
      'Samo za vanjsku upotrebu',
      'Obratiti pažnju na preosjetljivost na bilo koji sastojak',
      'Izbjegavati kontakt sa očima; u slučaju kontakta isprati sa dosta vode',
      'Ako iritacija ne prestane, potražiti savjet ljekara',
      'Čuvati van domašaja djece',
      'Sadrži prirodne alergene iz eteričnih ulja: Limonene, Linalool, Eugenol, Citral'
    ],
    productFAQ: [
      {
        question: 'Kako se koristi BIOWART?',
        answer: 'Nanesite tanak sloj na čistu i suhu kožu 1-2 puta dnevno. Ne ispira se nakon nanošenja. Pakovanje sadrži 50ml.',
        category: 'usage'
      },
      {
        question: 'Koji su glavni sastojci BIOWART-a?',
        answer: 'BIOWART sadrži 7 biljnih ekstrakata (rusa, neven, hajdučka trava, ivanjsko cvijeće, kantarion, hrastova kora i žalfija) i 7 eteričnih ulja (žalfija, eukaliptus, nana, karanfilić, timijan, zvjezdasti anis i limun), uz panthenol, ureu i vitamine A i E. Rusa i neven su u najvišim koncentracijama.',
        category: 'ingredients'
      },
      {
        question: 'Da li je BIOWART lijek?',
        answer: 'Ne. BIOWART je kozmetički proizvod za njegu kože osoba sklonih pojavi bradavica i ne zamjenjuje ljekarsku intervenciju. Za zdravstvene tegobe obratite se ljekaru.',
        category: 'safety'
      },
      {
        question: 'Da li je BIOWART bezbjedan za upotrebu?',
        answer: 'Da, BIOWART je prošao bezbjednosnu procjenu u skladu sa EU regulativom o kozmetičkim proizvodima (EC) 1223/2009. Bez parabena i bez vještačkih boja. Namijenjen je odraslima.',
        category: 'safety'
      },
      {
        question: 'Zašto baš rusa i neven?',
        answer: 'Rusa (Chelidonium majus) je tradicionalno najpoznatija biljka u kontekstu njege kože sklone bradavicama, a neven je klasik u njezi kože. U BIOWART formuli upravo ove dvije biljke su u najvišim koncentracijama među ekstraktima.',
        category: 'ingredients'
      }
    ],
    testimonials: []
  },

  bioroid: {
    id: 'bioroid',
    name: 'BIOROID',
    description: 'Krema za njegu kože i sluzokože analne regije. Formula sa 6 biljnih ekstrakata (hajdučka trava, divlji kesten, neven, pastirska torbica, zdravac i kamilica) i mentolom koji pruža osjećaj svježine. Biljnog je porijekla i može se koristiti duži vremenski period bez prekida.',
    shortDescription: 'Nježna njega osjetljive intimne regije',
    heroTitle: 'Svakodnevni komfor i diskretna njega',
    purpose: 'Za njegu kože i sluzokože analne regije',
    category: 'skincare',
    slug: 'bioroid',
    alternativeSlugs: [],
    availableCountries: ['rs', 'ba'],
    seoTitle: 'BIOROID - Krema za njegu kože analne regije | DERMOTIN',
    seoDescription: 'BIOROID od DERMOTIN brenda - krema za njegu kože i sluzokože analne regije. 6 biljnih ekstrakata, mentol za osjećaj svježine, panthenol i vitamini A i E. Bez parabena. 50ml.',
    // Povezani proizvod: BIOMELIS (njega kože iz iste linije; kapi ne postoje u BA katalogu)
    crossSells: ['biomelis'],
    urgencyElements: {},
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
        size: 'Okvirno 3 sedmice upotrebe',
        quantity: 1,
        price: 64.9,
        currency: 'BAM',
        discountPrice: 33.9,
        isDefault: true
      },
      {
        id: 'bioroid-2pak',
        sku: 'BIOROID',
        name: '2 PAKOVANJA (100ml)',
        size: 'Okvirno mjesec i po upotrebe',
        quantity: 2,
        price: 129.8,
        currency: 'BAM',
        discountPrice: 59.9
      },
      {
        id: 'bioroid-3pak',
        sku: 'BIOROID',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 2 mjeseca i pol upotrebe',
        quantity: 3,
        price: 194.7,
        currency: 'BAM',
        discountPrice: 79.9
      }
    ],
    benefits: [
      'Namjenski razvijena za njegu kože i sluzokože analne regije',
      'Sadrži 6 biljnih ekstrakata: hajdučka trava, divlji kesten, neven, pastirska torbica, zdravac i kamilica',
      'Mentol pruža osjećaj svježine i prijatnog hlađenja',
      'Eterična ulja pačulija, lavandina, čajnog drveta i karanfilića',
      'Panthenol, glicerin i vitamini A i E doprinose hidrataciji i njezi',
      'Biljnog porijekla - može se koristiti duži vremenski period bez prekida',
      'Bez parabena i bez vještačkih boja',
      'Bezbjednosno procijenjena u skladu sa EU regulativom (EC) 1223/2009'
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
      'tocopherol', // Tocopherol (prirodni vitamin E, antioksidans iz CPSR)
      'vitamin-a', // Retinyl Palmitate
      'sweet-almond-oil', // Prunus amygdalus dulcis oil
      'menthol', // Menthol for cooling effect
      // Essential oils blend
      'patchouli-oil', // Pogostemon Cablin Leaf Oil
      'lavender-oil', // Lavandula Hybrida Oil (lavandin)
      'tea-tree-oil', // Melaleuca Alternifolia Leaf Oil
      'clove-oil', // Eugenia Caryophyllus Leaf Oil
      // Base components
      'aqua',
      'alcohol', // U sastavu biljne tinkture
      'stearic-acid',
      'glycerin',
      'cetyl-alcohol',
      'glyceryl-stearate',
      'synthetic-beeswax',
      'urea',
      // Functional ingredients
      'triethanolamine',
      'carbomer',
      'sodium-gluconate',
      // Preservatives
      'phenoxyethanol',
      'ethylhexylglycerin',
      'potassium-sorbate'
    ],
    usage: 'Nanositi dva puta dnevno, uz redovnu higijenu. Krema je biljnog porijekla i može se koristiti duži vremenski period bez prekida. Sadržaj: 50ml.',
    usageSteps: [
      'Održavajte redovnu higijenu regije',
      'Nanesite kremu na čistu i suhu kožu',
      'Koristite dva puta dnevno',
      'Operite ruke nakon upotrebe',
      'Krema se može koristiti duži vremenski period bez prekida'
    ],
    warnings: [
      'Proizvod je namijenjen isključivo za vanjsku upotrebu',
      'Obratiti pažnju na preosjetljivost na bilo koji sastojak',
      'Oprati ruke nakon upotrebe',
      'Izbjegavati kontakt sa očima; u slučaju kontakta isprati sa dosta vode',
      'U slučaju produžene iritacije potražiti medicinsku pomoć',
      'Čuvati van domašaja djece',
      'Sadrži prirodne alergene iz eteričnih ulja (Limonene, Eugenol, Linalool)'
    ],
    productFAQ: [
      {
        question: 'Kako se koristi BIOROID?',
        answer: 'Nanesite kremu dva puta dnevno na čistu kožu, uz redovnu higijenu. Krema je biljnog porijekla i može se koristiti duži vremenski period bez prekida.',
        category: 'usage'
      },
      {
        question: 'Koji su glavni sastojci BIOROID-a?',
        answer: 'BIOROID sadrži 6 biljnih ekstrakata (hajdučka trava, divlji kesten, neven, pastirska torbica, zdravac i kamilica), mentol za osjećaj svježine i eterična ulja pačulija, lavandina, čajnog drveta i karanfilića, uz panthenol i vitamine A i E.',
        category: 'ingredients'
      },
      {
        question: 'Da li je BIOROID bezbjedan za dugotrajnu upotrebu?',
        answer: 'Da, krema je biljnog porijekla i prema uputstvu sa ambalaže može se koristiti duži vremenski period bez prekida. Prošla je bezbjednosnu procjenu u skladu sa EU regulativom (EC) 1223/2009.',
        category: 'safety'
      },
      {
        question: 'Kakav je osjećaj nakon nanošenja?',
        answer: 'Zahvaljujući mentolu, krema pruža osjećaj svježine i prijatnog hlađenja, a panthenol i glicerin doprinose hidrataciji i osjećaju komfora.',
        category: 'effects'
      },
      {
        question: 'Da li je BIOROID lijek?',
        answer: 'Ne. BIOROID je kozmetički proizvod za njegu kože, a ne lijek. Za zdravstvene tegobe obratite se ljekaru.',
        category: 'safety'
      }
    ],
    testimonials: []
  },
  fungomax: {
    id: 'fungomax',
    name: 'FUNGOMAX',
    description: 'Serum za njegu kože i noktiju osoba sklonih pojavi gljivica. Koncentrovana tečna formula sa kapaljkom za preciznu, ciljanu primjenu - preko 79% formule čini biljna tinktura sa 4 ekstrakta, uz alantoin i čak 20% glicerina za njegovan izgled kože i noktiju.',
    shortDescription: 'Serum za ciljanu njegu noktiju i kože',
    heroTitle: 'Precizna serum-njega za nokte i kožu',
    purpose: 'Za njegu kože i noktiju osoba sklonih pojavi gljivica',
    category: 'skincare',
    images: {
      main: '/images/products/fungomax/fungomax-box-and-product-mockup.png',
      gallery: [
        '/images/products/fungomax/fungomax-box-and-product-mockup.png'
      ],
      thumbnail: '/images/products/fungomax/fungomax-box-and-product-mockup.png',
      fallback: '/images/products/fungomax/fungomax-box-and-product-mockup.png'
    },
    variants: [
      {
        id: 'fungomax-1pak',
        sku: 'FUNGOMAX',
        name: '1 PAKOVANJE (50ml)',
        size: 'Okvirno 3 sedmice upotrebe',
        quantity: 1,
        price: 54.9,
        currency: 'BAM',
        discountPrice: 33.9,
        isDefault: true
      },
      {
        id: 'fungomax-2pak',
        sku: 'FUNGOMAX',
        name: '2 PAKOVANJA (100ml)',
        size: 'Okvirno mjesec i po upotrebe',
        quantity: 2,
        price: 109.8,
        currency: 'BAM',
        discountPrice: 59.9
      },
      {
        id: 'fungomax-3pak',
        sku: 'FUNGOMAX',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 2 mjeseca i pol upotrebe',
        quantity: 3,
        price: 164.7,
        currency: 'BAM',
        discountPrice: 79.9
      }
    ],
    benefits: [
      'Namjenski razvijen za njegu kože i noktiju sklonih pojavi gljivica',
      'Koncentrovana tečna formula sa kapaljkom za preciznu, ciljanu primjenu',
      'Visok udio biljne tinkture - preko 79% formule',
      '4 biljna ekstrakta: timijan, orahov list, žalfija i hrastova kora',
      '3 eterična ulja: lavandin, ruzmarin i karanfilić',
      'Alantoin i čak 20% glicerina doprinose hidrataciji i njegovanom izgledu',
      'Idealan u kombinaciji sa FUNGEL kremom kao rutina njege',
      'Bezbjednosno procijenjen u skladu sa EU regulativom (EC) 1223/2009'
    ],
    ingredients: [
      // Key active ingredients first
      'thymus-extract',
      'juglans-leaf-extract',
      'salvia-extract',
      'quercus-bark-extract',
      'lavender-oil',
      'rosemary-oil',
      'clove-oil',
      'allantoin',
      'glycerin',
      // Base components
      'aqua',
      'alcohol'
    ],
    usage: 'Nakapati dva puta dnevno i nježno utrljati na ciljano područje. Ne ispirati nakon nanošenja. Sadržaj: 50ml.',
    usageSteps: [
      'Očistite i osušite kožu ili nokte prije nanošenja',
      'Nakapajte nekoliko kapi seruma na željeno mjesto',
      'Nježno utrljajte serum',
      'Koristite 2 puta dnevno (ujutru i navečer)',
      'Ne ispirati nakon nanošenja',
      'Za kompletnu rutinu njege kombinujte sa FUNGEL kremom'
    ],
    warnings: [
      'Proizvod je namijenjen isključivo za vanjsku upotrebu',
      'Obratiti pažnju na preosjetljivost na bilo koji sastojak',
      'Ne nanositi na otvorene rane',
      'Oprati ruke nakon upotrebe',
      'Izbjegavati kontakt sa očima; u slučaju kontakta isprati sa dosta vode',
      'U slučaju produžene iritacije potražiti medicinsku pomoć',
      'Čuvati na suhom mjestu, van domašaja djece',
      'Sadrži prirodne alergene iz eteričnih ulja (Eugenol, Linalool, Limonene)'
    ],
    slug: 'fungomax',
    alternativeSlugs: ['fungomax-serum', 'gljivice-serum', 'njega-noktiju-serum'],
    availableCountries: ['rs', 'ba'],
    seoTitle: 'FUNGOMAX - Serum za njegu kože i noktiju sklonih gljivicama | DERMOTIN',
    seoDescription: 'FUNGOMAX od DERMOTIN brenda - serum sa kapaljkom za njegu kože i noktiju osoba sklonih pojavi gljivica. 4 biljna ekstrakta (timijan, orahov list, žalfija, hrastova kora), alantoin i 20% glicerina. 50ml.',
    // Povezani proizvodi: FUNGEL (ista namjena, krema), BIOWART
    upsells: {
      products: ['fungel'],
      discountPercentage: 10
    },
    crossSells: ['fungel', 'biowart'],
    urgencyElements: {},
    productFAQ: [
      {
        question: "Kako se koristi FUNGOMAX serum?",
        answer: "Vrlo jednostavno! Nakapajte 2 puta dnevno nekoliko kapi na ciljano područje i nježno utrljajte. Ne ispira se. Bočica sa kapaljkom sadrži 50ml.",
        category: "usage"
      },
      {
        question: "Šta FUNGOMAX sadrži?",
        answer: "4 biljna ekstrakta (timijan, orahov list, žalfija i hrastova kora) i 3 eterična ulja (lavandin, ruzmarin i karanfilić), uz alantoin i čak 20% glicerina. Biljna tinktura čini preko 79% formule.",
        category: "ingredients"
      },
      {
        question: "Da li je FUNGOMAX lijek?",
        answer: "Ne. FUNGOMAX je kozmetički proizvod za njegu kože i noktiju osoba sklonih pojavi gljivica. Ako imate zdravstveni problem, obratite se ljekaru ili farmaceutu.",
        category: "safety"
      },
      {
        question: "Da li je bezbjedan za svakodnevnu upotrebu?",
        answer: "Da, FUNGOMAX je namijenjen redovnoj upotrebi 2 puta dnevno. Prošao je bezbjednosnu procjenu u skladu sa EU regulativom o kozmetičkim proizvodima (EC) 1223/2009.",
        category: "safety"
      },
      {
        question: "Mogu li ga koristiti sa FUNGEL kremom?",
        answer: "Da! FUNGOMAX serum sa kapaljkom je zgodan za preciznu, ciljanu primjenu, a FUNGEL krema za njegu šire površine kože. Zajedno čine kompletnu rutinu njege.",
        category: "usage"
      },
      {
        question: "Kako da čuvam FUNGOMAX?",
        answer: "Čuvajte na suhom mjestu, van domašaja djece. Zatvorite dobro nakon upotrebe. Rok trajanja je označen na pakovanju.",
        category: "storage"
      },
      {
        question: "Koja je razlika između FUNGOMAX-a i FUNGEL-a?",
        answer: "FUNGOMAX je tečni serum sa kapaljkom za preciznu, ciljanu primjenu na nokte i manje površine. FUNGEL je krema/emulzija pogodna za njegu šire površine kože. Mnogi korisnici ih kombinuju.",
        category: "usage"
      },
      {
        question: "Da li je FUNGOMAX namijenjen djeci?",
        answer: "Ne, FUNGOMAX je namijenjen odraslima. To je definirano bezbjednosnom procjenom proizvoda.",
        category: "safety"
      }
    ],
    testimonials: []
  }
};
