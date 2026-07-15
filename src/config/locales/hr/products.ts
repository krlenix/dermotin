import { Product } from '../../types';

// EU Products - Only 3 products available for Croatian and other EU markets
export const PRODUCTS: Record<string, Product> = {
  fungel: {
    id: 'fungel',
    name: 'FUNGEL',
    description: 'Krema za njegu kože i noktiju osoba sklonih pojavi gljivica. Kombinira 6 biljnih ekstrakata i 5 eteričnih ulja s pantenolom, ureom i vitaminima A i E. Redovitim korištenjem, 2 puta dnevno, doprinosi njegovanom i urednom izgledu kože i noktiju.',
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
        name: '1 PAKIRANJE (50ml)',
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
        price: 53.9,
        currency: 'EUR',
        discountPrice: 29.9
      },
      {
        id: 'fungel-3pak',
        sku: 'FUNGEL',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 2 mjeseca upotrebe',
        quantity: 3,
        price: 77.9,
        currency: 'EUR',
        discountPrice: 39.9
      }
    ],
    benefits: [
      'Namjenski razvijen za njegu kože i noktiju sklonih pojavi gljivica',
      'Sadrži 6 biljnih ekstrakata: neven, rosopas, kadulja, ehinacea, ivanjsko cvijeće i gospina trava',
      '5 eteričnih ulja: čajevac, origano, lavandin, kadulja i eukaliptus',
      'Pantenol, urea i glicerin doprinose hidrataciji kože',
      'Obogaćen vitaminima A i E te uljem slatkog badema',
      'Bez parabena i bez umjetnih boja',
      'Leave-on formula - nanosi se 2x dnevno i ne ispire se',
      'Sigurnosno procijenjen u skladu s EU regulativom (EC) 1223/2009'
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
      'Koristite 2 puta dnevno (ujutro i navečer)',
      'Ne ispirati nakon nanošenja',
      'Za najbolji učinak njege koristite redovito'
    ],
    warnings: [
      'Samo za vanjsku uporabu',
      'Obratiti pozornost na preosjetljivost na bilo koji sastojak',
      'Oprati ruke nakon nanošenja',
      'Ne koristiti na ranama',
      'Izbjegavati kontakt s očima; u slučaju kontakta odmah isprati vodom',
      'Prekinuti uporabu i javiti se liječniku ako dođe do iritacije',
      'Čuvati na hladnom, suhom mjestu',
      'Sadrži prirodne alergene iz eteričnih ulja (Limonene, Linalool)'
    ],
    slug: 'fungel',
    alternativeSlugs: ['fungel-promo', 'njega-noktiju', 'gljivice-stopala'],
    availableCountries: ['hr'],
    seoTitle: 'FUNGEL - Krema za njegu kože i noktiju sklonih gljivicama | DERMOTIN',
    seoDescription: 'FUNGEL od DERMOTIN brenda - krema za njegu kože i noktiju osoba sklonih pojavi gljivica. 6 biljnih ekstrakata i 5 eteričnih ulja (čajevac, origano), pantenol, urea, vitamini A i E. Bez parabena. 50ml.',
    // Povezani proizvod: BIOWART (njega kože; FUNGOMAX ne postoji u HR katalogu)
    crossSells: ['biowart'],
    urgencyElements: {},
    productFAQ: [
      {
        question: "Kako se koristi FUNGEL?",
        answer: "Vrlo jednostavno! Nanesite tanak sloj 2 puta dnevno na kožu ili nokte i nježno umasirajte. Ne ispire se - samo ostavite da se upije. Pakiranje sadrži 50ml.",
        category: "usage"
      },
      {
        question: "Što FUNGEL sadrži?",
        answer: "6 biljnih ekstrakata (neven, rosopas, kadulja, ehinacea, ivanjsko cvijeće i gospina trava) i 5 eteričnih ulja (čajevac, origano, lavandin, kadulja i eukaliptus), uz pantenol, ureu, glicerin i vitamine A i E.",
        category: "ingredients"
      },
      {
        question: "Je li FUNGEL lijek?",
        answer: "Ne. FUNGEL je kozmetički proizvod za njegu kože i noktiju osoba sklonih pojavi gljivica. Ako imate zdravstveni problem, obratite se liječniku ili ljekarniku.",
        category: "safety"
      },
      {
        question: "Je li siguran za svakodnevno korištenje?",
        answer: "Da, FUNGEL je namijenjen redovitom korištenju 2 puta dnevno. Prošao je sigurnosnu procjenu u skladu s EU regulativom o kozmetičkim proizvodima (EC) 1223/2009, a pH formule je 6,7.",
        category: "safety"
      },
      {
        question: "Mogu li ga koristiti ako imam osjetljivu kožu?",
        answer: "Ako imate vrlo osjetljivu kožu, preporučujemo da prvo testirate na maloj površini. Proizvod sadrži prirodne alergene iz eteričnih ulja (limonen, linalol). Ako dođe do iritacije, prekinite uporabu i posavjetujte se s liječnikom.",
        category: "safety"
      },
      {
        question: "Kako čuvati FUNGEL?",
        answer: "Čuvajte na hladnom, suhom mjestu, izvan dohvata djece. Zatvorite dobro nakon uporabe. Rok trajanja označen je na pakiranju.",
        category: "storage"
      },
      {
        question: "Mogu li koristiti FUNGEL s drugim kremama?",
        answer: "Možete - pričekajte da se FUNGEL upije prije nanošenja drugih proizvoda.",
        category: "usage"
      },
      {
        question: "Je li FUNGEL namijenjen djeci?",
        answer: "Ne, FUNGEL je namijenjen odraslima. To je definirano sigurnosnom procjenom proizvoda.",
        category: "safety"
      }
    ],
    testimonials: []
  },

  biomelis: {
    id: 'biomelis',
    name: 'BIOMELIS',
    description: 'Krema za njegu kože osoba sklonih ekcemima i psorijazi. Formula s 8 biljnih ekstrakata i 5 eteričnih ulja, obogaćena pantenolom, ureom i vitaminima A i E, njeguje i hidratizira kožu te doprinosi osjećaju komfora. Pogodna za svakodnevno korištenje.',
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
        name: '1 PAKIRANJE (50ml)',
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
        price: 53.9,
        currency: 'EUR',
        discountPrice: 29.9
      },
      {
        id: 'biomelis-3pak',
        sku: 'BIOMELIS',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 2 mjeseca upotrebe',
        quantity: 3,
        price: 77.9,
        currency: 'EUR',
        discountPrice: 39.9
      }
    ],
    benefits: [
      'Namjenski razvijen za njegu kože sklone ekcemima i psorijazi',
      'Sadrži 8 biljnih ekstrakata: neven, rosopas, kadulja, stolisnik, preslica, ivanjsko cvijeće, gospina trava i hrastova kora',
      '5 eteričnih ulja: kadulja, eukaliptus, lavandin, ružmarin i timijan',
      'Pantenol, urea i glicerin doprinose hidrataciji i mekšem osjećaju kože',
      'Obogaćen vitaminima A i E te uljem slatkog badema',
      'Bez parabena i bez umjetnih boja',
      'Pogodna za svakodnevno korištenje, 2 puta dnevno',
      'Sigurnosno procijenjen u skladu s EU regulativom (EC) 1223/2009'
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
      'Koristite 2 puta dnevno (ujutro i navečer)',
      'Ne ispirati nakon nanošenja',
      'Za najbolji učinak njege koristite redovito'
    ],
    warnings: [
      'Samo za vanjsku uporabu',
      'Obratiti pozornost na preosjetljivost na bilo koji sastojak',
      'Nanositi samo na neoštećenu kožu',
      'Izbjegavati kontakt s očima; u slučaju kontakta isprati s puno vode',
      'Ako iritacija ne prestane, potražiti savjet liječnika',
      'Čuvati na hladnom, suhom mjestu',
      'Sadrži prirodne alergene iz eteričnih ulja (Limonene, Linalool)',
      'Čuvati izvan dohvata djece'
    ],
    slug: 'biomelis',
    alternativeSlugs: ['biomelis-melem', 'ekcem-psorijaza', 'osjetljiva-koza'],
    availableCountries: ['hr'],
    seoTitle: 'BIOMELIS - Krema za njegu kože sklone ekcemima i psorijazi | DERMOTIN',
    seoDescription: 'BIOMELIS od DERMOTIN brenda - krema za njegu kože osoba sklonih ekcemima i psorijazi. 8 biljnih ekstrakata i 5 eteričnih ulja, pantenol, urea, vitamini A i E. Bez parabena. 50ml.',
    // Povezani proizvod: FUNGEL (srodna njega kože)
    crossSells: ['fungel'],
    urgencyElements: {},
    productFAQ: [
      {
        question: "Kako se koristi BIOMELIS?",
        answer: "Vrlo jednostavno! Nanesite malu količinu 2 puta dnevno na očišćenu, neoštećenu kožu i nježno utrljajte. Ne ispire se - samo ostavite da se upije. Pakiranje sadrži 50ml.",
        category: "usage"
      },
      {
        question: "Što BIOMELIS sadrži?",
        answer: "8 biljnih ekstrakata (neven, rosopas, kadulja, stolisnik, preslica, ivanjsko cvijeće, gospina trava i hrastova kora) i 5 eteričnih ulja (kadulja, eukaliptus, lavandin, ružmarin i timijan), uz pantenol, ureu, glicerin i vitamine A i E.",
        category: "ingredients"
      },
      {
        question: "Je li BIOMELIS lijek?",
        answer: "Ne. BIOMELIS je kozmetički proizvod za njegu kože osoba sklonih ekcemima i psorijazi i ne zamjenjuje terapiju koju je propisao liječnik. Za zdravstvene tegobe obratite se liječniku.",
        category: "safety"
      },
      {
        question: "Je li BIOMELIS pogodan za svakodnevno korištenje?",
        answer: "Da, BIOMELIS je namijenjen redovitom korištenju 2 puta dnevno. Prošao je sigurnosnu procjenu u skladu s EU regulativom o kozmetičkim proizvodima (EC) 1223/2009, a pH formule je 6,7.",
        category: "safety"
      },
      {
        question: "Što mogu očekivati od BIOMELIS-a?",
        answer: "BIOMELIS njeguje i hidratizira kožu - pantenol, urea i glicerin doprinose hidrataciji i mekšem osjećaju kože, dok biljni ekstrakti i eterična ulja doprinose osjećaju komfora i njegovanom izgledu.",
        category: "effects"
      },
      {
        question: "Kako čuvati BIOMELIS?",
        answer: "Čuvajte na hladnom, suhom mjestu, izvan dohvata djece. Zatvorite dobro nakon uporabe. Rok trajanja označen je na pakiranju.",
        category: "storage"
      },
      {
        question: "Mogu li koristiti BIOMELIS s drugim proizvodima?",
        answer: "Možete - pričekajte da se BIOMELIS upije prije nanošenja drugih proizvoda. Ako imate vrlo osjetljivu kožu, prvo testirajte na maloj površini jer proizvod sadrži prirodne alergene iz eteričnih ulja.",
        category: "usage"
      },
      {
        question: "Je li BIOMELIS namijenjen djeci?",
        answer: "Ne, BIOMELIS je namijenjen odraslima. To je definirano sigurnosnom procjenom proizvoda.",
        category: "safety"
      }
    ],
    testimonials: []
  },

  biowart: {
    id: 'biowart',
    name: 'BIOWART',
    description: 'Krema za njegu kože osoba sklonih pojavi bradavica. Formula sa sedam biljnih ekstrakata - među kojima su rosopas i neven u najvišim koncentracijama - i sedam eteričnih ulja, obogaćena pantenolom, ureom i vitaminima A i E. Za ciljanu, svakodnevnu njegu kože.',
    shortDescription: 'Ciljana njega kože sklone pojavi bradavica',
    heroTitle: 'Ciljana njega za kožu sklonu bradavicama',
    purpose: 'Za njegu kože osoba sklonih pojavi bradavica',
    category: 'skincare',
    slug: 'biowart',
    alternativeSlugs: [],
    availableCountries: ['hr'],
    seoTitle: 'BIOWART - Krema za njegu kože sklone pojavi bradavica | DERMOTIN',
    seoDescription: 'BIOWART od DERMOTIN brenda - krema za njegu kože osoba sklonih pojavi bradavica. 7 biljnih ekstrakata (rosopas, neven, hrastova kora) i 7 eteričnih ulja, pantenol, urea, vitamini A i E. Bez parabena. 50ml.',
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
        name: '1 PAKIRANJE (50ml)',
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
        price: 53.9,
        currency: 'EUR',
        discountPrice: 29.9
      },
      {
        id: 'biowart-3pak',
        sku: 'BIOWART',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 2 mjeseca upotrebe',
        quantity: 3,
        price: 77.9,
        currency: 'EUR',
        discountPrice: 39.9
      }
    ],
    benefits: [
      'Namjenski razvijen za njegu kože sklone pojavi bradavica',
      'Rosopas (Chelidonium majus) i neven u najvišim koncentracijama među biljnim ekstraktima',
      'Ukupno 7 biljnih ekstrakata: rosopas, neven, stolisnik, ivanjsko cvijeće, gospina trava, hrastova kora i kadulja',
      '7 eteričnih ulja: kadulja, eukaliptus, metvica, klinčić, timijan, zvjezdasti anis i limun',
      'Pantenol, urea i glicerin doprinose hidrataciji kože',
      'Obogaćen vitaminima A i E te uljem slatkog badema',
      'Bez parabena i bez umjetnih boja',
      'Sigurnosno procijenjen u skladu s EU regulativom (EC) 1223/2009'
    ],
    ingredients: [
      // Key active ingredients first - based on BIOWART documentation
      'chelidonium-extract', // Rosopas - highest concentration (7-8.5%)
      'calendula-extract', // Neven - highest concentration (7-8.5%)
      'achillea-extract', // Stolisnik (3-4.5%)
      'salvia-leaf-extract', // Kadulja (3-4.5%)
      'hypericum-extract', // Gospina trava (3-4.5%)
      'galium-extract', // Ivanjsko cvijeće (3-4.5%)
      'quercus-bark-extract', // Hrastova kora (3-4.5%)
      // Essential oils - 7 different oils
      'sage-oil', // Eterično ulje kadulje
      'eucalyptus-oil', // Eterično ulje eukaliptusa
      'peppermint-oil', // Eterično ulje metvice
      'clove-bud-oil', // Eterično ulje klinčića (pupoljak)
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
      'Za najbolji učinak njege koristite redovito'
    ],
    warnings: [
      'Samo za vanjsku uporabu',
      'Obratiti pozornost na preosjetljivost na bilo koji sastojak',
      'Izbjegavati kontakt s očima; u slučaju kontakta isprati s puno vode',
      'Ako iritacija ne prestane, potražiti savjet liječnika',
      'Čuvati izvan dohvata djece',
      'Sadrži prirodne alergene iz eteričnih ulja: Limonene, Linalool, Eugenol, Citral'
    ],
    productFAQ: [
      {
        question: 'Kako se koristi BIOWART?',
        answer: 'Nanesite tanak sloj na čistu i suhu kožu 1-2 puta dnevno. Ne ispire se nakon nanošenja. Pakiranje sadrži 50ml.',
        category: 'usage'
      },
      {
        question: 'Koji su glavni sastojci BIOWART-a?',
        answer: 'BIOWART sadrži 7 biljnih ekstrakata (rosopas, neven, stolisnik, ivanjsko cvijeće, gospina trava, hrastova kora i kadulja) i 7 eteričnih ulja (kadulja, eukaliptus, metvica, klinčić, timijan, zvjezdasti anis i limun), uz pantenol, ureu i vitamine A i E. Rosopas i neven su u najvišim koncentracijama.',
        category: 'ingredients'
      },
      {
        question: 'Je li BIOWART lijek?',
        answer: 'Ne. BIOWART je kozmetički proizvod za njegu kože osoba sklonih pojavi bradavica i ne zamjenjuje liječničku intervenciju. Za zdravstvene tegobe obratite se liječniku.',
        category: 'safety'
      },
      {
        question: 'Je li BIOWART siguran za korištenje?',
        answer: 'Da, BIOWART je prošao sigurnosnu procjenu u skladu s EU regulativom o kozmetičkim proizvodima (EC) 1223/2009. Bez parabena i bez umjetnih boja. Namijenjen je odraslima.',
        category: 'safety'
      },
      {
        question: 'Zašto baš rosopas i neven?',
        answer: 'Rosopas (Chelidonium majus) tradicionalno je najpoznatija biljka u kontekstu njege kože sklone bradavicama, a neven je klasik u njezi kože. U BIOWART formuli upravo su ove dvije biljke u najvišim koncentracijama među ekstraktima.',
        category: 'ingredients'
      }
    ],
    testimonials: []
  }
};
