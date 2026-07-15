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
    usage: 'Nanositi 2 puta dnevno na dijelove kože ili noktiju. Ne ispirati nakon nanošenja. Sadržaj: 50ml.',
    usageSteps: [
      'Očistite i osušite kožu ili nokte prije nanošenja',
      'Nanesite tanak sloj FUNGEL-a na željeno mjesto',
      'Nježno umasirajte dok se ne upije',
      'Koristite 2 puta dnevno (ujutru i uveče)',
      'Ne ispirati nakon nanošenja',
      'Za najbolji efekat njege koristite redovno'
    ],
    warnings: [
      'Samo za spoljašnju upotrebu',
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
    availableCountries: ['rs', 'ba', 'me'],
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
        question: "Mogu li da koristim FUNGEL sa drugim kremovima?",
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
      'Namjenski razvijen za njegu kože sklone ekcemima i psorijazi',
      'Sadrži 8 biljnih ekstrakata: neven, rusa, žalfija, hajdučka trava, rastavić, ivanjsko cvijeće, kantarion i hrastova kora',
      '5 eteričnih ulja: žalfija, eukaliptus, lavandin, ruzmarin i timijan',
      'Panthenol, urea i glicerin doprinose hidrataciji i mekšem osjećaju kože',
      'Obogaćen vitaminima A i E i uljem slatkog badema',
      'Bez parabena i bez vještačkih boja',
      'Pogodna za svakodnevnu upotrebu, 2 puta dnevno',
      'Bezbjednosno procijenjen u skladu sa EU regulativom (EC) 1223/2009'
    ],
    ingredients: [
      'calendula-extract',
      'chelidonium-extract',
      'salvia-leaf-extract',
      'achillea-extract',
      'equisetum-extract',
      'galium-extract',
      'hypericum-extract',
      'quercus-bark-extract',
      'sage-oil',
      'eucalyptus-oil',
      'lavender-oil',
      'rosemary-oil',
      'thyme-oil',
      'panthenol',
      'vitamin-e',
      'vitamin-a',
      'castor-oil',
      'sweet-almond-oil',
      'urea',
      'aqua',
      'alcohol',
      'glycerin',
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
    usage: 'Nanositi 2 puta dnevno na kožu i nježno utrljati. Ne ispirati nakon nanošenja. Sadržaj: 50ml.',
    usageSteps: [
      'Očistite kožu blagim sredstvom za pranje i osušite',
      'Nanesite malu količinu BIOMELIS-a na željeno mjesto',
      'Nježno umasirajte kružnim pokretima dok se ne upije',
      'Koristite 2 puta dnevno (ujutru i uveče)',
      'Ne ispirati nakon nanošenja',
      'Za najbolji efekat njege koristite redovno'
    ],
    warnings: [
      'Samo za spoljašnju upotrebu',
      'Obratiti pažnju na preosjetljivost na bilo koji sastojak',
      'Nanositi samo na neoštećenu kožu',
      'Izbjegavati kontakt sa očima; u slučaju kontakta isprati sa dosta vode',
      'Ako iritacija ne prestane, potražiti savjet ljekara',
      'Čuvati na hladnom, suhom mjestu',
      'Sadrži prirodne alergene iz eteričnih ulja (Limonene, Linalool)',
      'Čuvati van domašaja djece'
    ],
    slug: 'biomelis',
    alternativeSlugs: ['biomelis-ekcem', 'biomelis-psorijaza'],
    availableCountries: ['rs', 'ba', 'me'],
    seoTitle: 'BIOMELIS - Krema za njegu kože sklone ekcemima i psorijazi | DERMOTIN',
    seoDescription: 'BIOMELIS od DERMOTIN brenda - krema za njegu kože osoba sklonih ekcemima i psorijazi. 8 biljnih ekstrakata i 5 eteričnih ulja, panthenol, urea, vitamini A i E. Bez parabena. 50ml.',
    // Povezani proizvod: FUNGEL (srodna njega kože; kapi ne postoje u ME katalogu)
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
    availableCountries: ['rs', 'ba', 'me'],
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
      'Namjenski razvijen za njegu kože sklone pojavi bradavica',
      'Rusa (Chelidonium majus) i neven u najvišim koncentracijama među biljnim ekstraktima',
      'Ukupno 7 biljnih ekstrakata: rusa, neven, hajdučka trava, ivanjsko cvijeće, kantarion, hrastova kora i žalfija',
      '7 eteričnih ulja: žalfija, eukaliptus, nana, karanfilić, timijan, zvjezdasti anis i limun',
      'Panthenol, urea i glicerin doprinose hidrataciji kože',
      'Obogaćen vitaminima A i E i uljem slatkog badema',
      'Bez parabena i bez vještačkih boja',
      'Bezbjednosno procijenjen u skladu sa EU regulativom (EC) 1223/2009'
    ],
    ingredients: [
      'chelidonium-extract',
      'calendula-extract',
      'achillea-extract',
      'salvia-leaf-extract',
      'hypericum-extract',
      'galium-extract',
      'quercus-bark-extract',
      'sage-oil',
      'eucalyptus-oil',
      'peppermint-oil',
      'clove-bud-oil',
      'thyme-oil',
      'anise-oil',
      'lemon-oil',
      'panthenol',
      'urea',
      'sweet-almond-oil',
      'vitamin-e',
      'vitamin-a',
      'aqua',
      'alcohol',
      'stearic-acid',
      'glycerin',
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
      'Samo za spoljašnju upotrebu',
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
      'thymus-extract',
      'juglans-leaf-extract',
      'salvia-extract',
      'quercus-bark-extract',
      'lavender-oil',
      'rosemary-oil',
      'clove-oil',
      'allantoin',
      'glycerin',
      'aqua',
      'alcohol'
    ],
    usage: 'Nakapati dva puta dnevno i nježno utrljati na ciljano područje. Ne ispirati nakon nanošenja. Sadržaj: 50ml.',
    usageSteps: [
      'Očistite i osušite kožu ili nokte prije nanošenja',
      'Nakapajte nekoliko kapi seruma na željeno mjesto',
      'Nježno utrljajte serum',
      'Koristite 2 puta dnevno (ujutru i uveče)',
      'Ne ispirati nakon nanošenja',
      'Za kompletnu rutinu njege kombinujte sa FUNGEL kremom'
    ],
    warnings: [
      'Proizvod je namijenjen isključivo za spoljašnju upotrebu',
      'Obratiti pažnju na preosjetljivost na bilo koji sastojak',
      'Ne nanositi na otvorene rane',
      'Oprati ruke nakon upotrebe',
      'Izbjegavati kontakt sa očima; u slučaju kontakta isprati sa dosta vode',
      'U slučaju produžene iritacije potražiti medicinsku pomoć',
      'Čuvati na suhom mjestu, van domašaja djece',
      'Sadrži prirodne alergene iz eteričnih ulja (Eugenol, Linalool, Limonene)'
    ],
    slug: 'fungomax',
    alternativeSlugs: ['fungomax-nokti', 'gljivice-noktiju'],
    availableCountries: ['rs', 'ba', 'me'],
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
        answer: "FUNGOMAX je tečni serum sa kapaljkom za preciznu, ciljanu primjenu na nokte i manje površine. FUNGEL je krema pogodna za njegu šire površine kože. Mnogi korisnici ih kombinuju.",
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

