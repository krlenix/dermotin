import { Product } from '../../types';

// ⚠️ Ovaj fajl održava admin panel (/admin/products). Ručne izmene su dozvoljene,
// ali će formatiranje i komentari biti pregaženi pri sledećem snimanju iz admina.
export const PRODUCTS: Record<string, Product> = {
  fungel: {
    id: 'fungel',
    name: 'FUNGEL',
    description: 'Krema za negu kože i noktiju osoba sklonih pojavi gljivica. Kombinuje 6 biljnih ekstrakata i 5 eteričnih ulja sa panthenolom, ureom i vitaminima A i E. Redovnom upotrebom, 2 puta dnevno, doprinosi negovanom i urednom izgledu kože i noktiju.',
    shortDescription: 'Nega kože i noktiju sklonih gljivicama',
    heroTitle: 'Negovana koža i uredni nokti, bez kompromisa',
    purpose: 'Za negu kože i noktiju osoba sklonih pojavi gljivica',
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
      'Namenski razvijen za negu kože i noktiju sklonih pojavi gljivica',
      'Sadrži 6 biljnih ekstrakata: neven, rusa, žalfija, ehinacea, ivanjsko cveće i kantarion',
      '5 eteričnih ulja: čajno drvo, origano, lavandin, žalfija i eukaliptus',
      'Panthenol, urea i glicerin doprinose hidrataciji kože',
      'Obogaćen vitaminima A i E i uljem slatkog badema',
      'Bez parabena i bez veštačkih boja',
      'Leave-on formula - nanosi se 2x dnevno i ne ispira se',
      'Bezbednosno procenjen u skladu sa EU regulativom (EC) 1223/2009'
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
    usage: 'Nanositi 2 puta dnevno na delove kože ili noktiju. Ne ispirati nakon nanošenja. Sadržaj: 50ml.',
    usageSteps: [
      'Očistite i osušite kožu ili nokte pre nanošenja',
      'Nanesite tanak sloj FUNGEL-a na željeno mesto',
      'Nežno umasirajte dok se ne upije',
      'Koristite 2 puta dnevno (ujutru i uveče)',
      'Ne ispirati nakon nanošenja',
      'Za najbolji efekat nege koristite redovno'
    ],
    warnings: [
      'Samo za spoljašnju upotrebu',
      'Obratiti pažnju na preosetljivost na bilo koji sastojak',
      'Oprati ruke nakon nanošenja',
      'Ne koristiti na ranama',
      'Izbegavati kontakt sa očima; u slučaju kontakta odmah isprati vodom',
      'Prekinuti upotrebu i javiti se lekaru ako dođe do iritacije',
      'Čuvati na hladnom, suvom mestu',
      'Sadrži prirodne alergene iz eteričnih ulja (Limonene, Linalool)'
    ],
    slug: 'fungel',
    alternativeSlugs: [
      'fungel-promo',
      'nega-noktiju',
      'gljivice-stopala'
    ],
    availableCountries: [
      'rs',
      'ba'
    ],
    seoTitle: 'FUNGEL - Krema za negu kože i noktiju sklonih gljivicama | DERMOTIN',
    seoDescription: 'FUNGEL od DERMOTIN brenda - krema za negu kože i noktiju osoba sklonih pojavi gljivica. 6 biljnih ekstrakata i 5 eteričnih ulja (čajno drvo, origano), panthenol, urea, vitamini A i E. Bez parabena. 50ml.',
    upsells: {
      products: [
        'fungomax'
      ],
      discountPercentage: 10
    },
    crossSells: [
      'fungomax',
      'biowart'
    ],
    urgencyElements: {},
    productFAQ: [
      {
        question: 'Kako se koristi FUNGEL?',
        answer: 'Vrlo jednostavno! Nanesite tanak sloj 2 puta dnevno na kožu ili nokte i nežno umasirajte. Ne ispira se - samo ostavite da se upije. Pakovanje sadrži 50ml.',
        category: 'usage'
      },
      {
        question: 'Šta FUNGEL sadrži?',
        answer: '6 biljnih ekstrakata (neven, rusa, žalfija, ehinacea, ivanjsko cveće i kantarion) i 5 eteričnih ulja (čajno drvo, origano, lavandin, žalfija i eukaliptus), uz panthenol, ureu, glicerin i vitamine A i E.',
        category: 'ingredients'
      },
      {
        question: 'Da li je FUNGEL lek?',
        answer: 'Ne. FUNGEL je kozmetički proizvod za negu kože i noktiju osoba sklonih pojavi gljivica. Ako imate zdravstveni problem, obratite se lekaru ili farmaceutu.',
        category: 'safety'
      },
      {
        question: 'Da li je bezbedan za svakodnevnu upotrebu?',
        answer: 'Da, FUNGEL je namenjen redovnoj upotrebi 2 puta dnevno. Prošao je bezbednosnu procenu u skladu sa EU regulativom o kozmetičkim proizvodima (EC) 1223/2009, a pH formule je 6,7.',
        category: 'safety'
      },
      {
        question: 'Mogu li ga koristiti ako imam osetljivu kožu?',
        answer: 'Ako imate vrlo osetljivu kožu, preporučujemo da prvo testirate na maloj površini. Proizvod sadrži prirodne alergene iz eteričnih ulja (limonen, linalol). Ako dođe do iritacije, prekinite upotrebu i posavetujte se sa lekarom.',
        category: 'safety'
      },
      {
        question: 'Kako da čuvam FUNGEL?',
        answer: 'Čuvajte na hladnom, suvom mestu, van domašaja dece. Zatvorite dobro nakon upotrebe. Rok trajanja je označen na pakovanju.',
        category: 'storage'
      },
      {
        question: 'Mogu li da koristim FUNGEL sa drugim kremama?',
        answer: 'Možete - sačekajte da se FUNGEL upije pre nanošenja drugih proizvoda. Za nokte se odlično uklapa u rutinu sa FUNGOMAX serumom.',
        category: 'usage'
      },
      {
        question: 'Da li je FUNGEL namenjen deci?',
        answer: 'Ne, FUNGEL je namenjen odraslima. To je definisano bezbednosnom procenom proizvoda.',
        category: 'safety'
      }
    ],
    testimonials: []
  },
  biomelis: {
    id: 'biomelis',
    name: 'BIOMELIS',
    description: 'Krema za negu kože osoba sklonih ekcemima i psorijazi. Formula sa 8 biljnih ekstrakata i 5 eteričnih ulja, obogaćena panthenolom, ureom i vitaminima A i E, neguje i hidrira kožu i doprinosi osećaju komfora. Pogodna za svakodnevnu upotrebu.',
    shortDescription: 'Nega kože sklone ekcemima i psorijazi',
    heroTitle: 'Svakodnevna nega za kožu koja traži više',
    purpose: 'Za negu kože osoba sklonih ekcemima i psorijazi',
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
      'Namenski razvijen za negu kože sklone ekcemima i psorijazi',
      'Sadrži 8 biljnih ekstrakata: neven, rusa, žalfija, hajdučka trava, rastavić, ivanjsko cveće, kantarion i hrastova kora',
      '5 eteričnih ulja: žalfija, eukaliptus, lavandin, ruzmarin i timijan',
      'Panthenol, urea i glicerin doprinose hidrataciji i mekšem osećaju kože',
      'Obogaćen vitaminima A i E i uljem slatkog badema',
      'Bez parabena i bez veštačkih boja',
      'Pogodna za svakodnevnu upotrebu, 2 puta dnevno',
      'Bezbednosno procenjen u skladu sa EU regulativom (EC) 1223/2009'
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
    usage: 'Nanositi 2 puta dnevno na kožu i nežno utrljati. Ne ispirati nakon nanošenja. Sadržaj: 50ml.',
    usageSteps: [
      'Očistite kožu blagim sredstvom za pranje i osušite',
      'Nanesite malu količinu BIOMELIS-a na željeno mesto',
      'Nežno umasirajte kružnim pokretima dok se ne upije',
      'Koristite 2 puta dnevno (ujutru i uveče)',
      'Ne ispirati nakon nanošenja',
      'Za najbolji efekat nege koristite redovno'
    ],
    warnings: [
      'Samo za spoljašnju upotrebu',
      'Obratiti pažnju na preosetljivost na bilo koji sastojak',
      'Nanositi samo na neoštećenu kožu',
      'Izbegavati kontakt sa očima; u slučaju kontakta isprati sa dosta vode',
      'Ako iritacija ne prestane, potražiti savet lekara',
      'Čuvati na hladnom, suvom mestu',
      'Sadrži prirodne alergene iz eteričnih ulja (Limonene, Linalool)',
      'Čuvati van domašaja dece'
    ],
    slug: 'biomelis',
    alternativeSlugs: [
      'biomelis-melem',
      'ekcem-psorijaza',
      'osetljiva-koza'
    ],
    availableCountries: [
      'rs',
      'ba'
    ],
    seoTitle: 'BIOMELIS - Krema za negu kože sklone ekcemima i psorijazi | DERMOTIN',
    seoDescription: 'BIOMELIS od DERMOTIN brenda - krema za negu kože osoba sklonih ekcemima i psorijazi. 8 biljnih ekstrakata i 5 eteričnih ulja, panthenol, urea, vitamini A i E. Bez parabena. 50ml.',
    urgencyElements: {},
    upsells: {
      products: [
        'biomelis_kapi'
      ],
      discountPercentage: 10
    },
    crossSells: [
      'biomelis_kapi',
      'immunis_kapi'
    ],
    productFAQ: [
      {
        question: 'Kako se koristi BIOMELIS?',
        answer: 'Vrlo jednostavno! Nanesite malu količinu 2 puta dnevno na očišćenu, neoštećenu kožu i nežno utrljajte. Ne ispira se - samo ostavite da se upije. Pakovanje sadrži 50ml.',
        category: 'usage'
      },
      {
        question: 'Šta BIOMELIS sadrži?',
        answer: '8 biljnih ekstrakata (neven, rusa, žalfija, hajdučka trava, rastavić, ivanjsko cveće, kantarion i hrastova kora) i 5 eteričnih ulja (žalfija, eukaliptus, lavandin, ruzmarin i timijan), uz panthenol, ureu, glicerin i vitamine A i E.',
        category: 'ingredients'
      },
      {
        question: 'Da li je BIOMELIS lek?',
        answer: 'Ne. BIOMELIS je kozmetički proizvod za negu kože osoba sklonih ekcemima i psorijazi i ne zamenjuje terapiju koju je propisao lekar. Za zdravstvene tegobe obratite se lekaru.',
        category: 'safety'
      },
      {
        question: 'Da li je BIOMELIS pogodan za svakodnevnu upotrebu?',
        answer: 'Da, BIOMELIS je namenjen redovnoj upotrebi 2 puta dnevno. Prošao je bezbednosnu procenu u skladu sa EU regulativom o kozmetičkim proizvodima (EC) 1223/2009, a pH formule je 6,7.',
        category: 'safety'
      },
      {
        question: 'Šta mogu da očekujem od BIOMELIS-a?',
        answer: 'BIOMELIS neguje i hidrira kožu - panthenol, urea i glicerin doprinose hidrataciji i mekšem osećaju kože, dok biljni ekstrakti i eterična ulja doprinose osećaju komfora i negovanom izgledu.',
        category: 'effects'
      },
      {
        question: 'Kako da čuvam BIOMELIS?',
        answer: 'Čuvajte na hladnom, suvom mestu, van domašaja dece. Zatvorite dobro nakon upotrebe. Rok trajanja je označen na pakovanju.',
        category: 'storage'
      },
      {
        question: 'Da li mogu da koristim BIOMELIS sa drugim proizvodima?',
        answer: 'Možete - sačekajte da se BIOMELIS upije pre nanošenja drugih proizvoda. Ako imate vrlo osetljivu kožu, prvo testirajte na maloj površini jer proizvod sadrži prirodne alergene iz eteričnih ulja.',
        category: 'usage'
      },
      {
        question: 'Da li je BIOMELIS namenjen deci?',
        answer: 'Ne, BIOMELIS je namenjen odraslima. To je definisano bezbednosnom procenom proizvoda.',
        category: 'safety'
      }
    ],
    testimonials: [],
    published: true
  },
  biowart: {
    id: 'biowart',
    name: 'BIOWART',
    description: 'Krema za negu kože osoba sklonih pojavi bradavica. Formula sa 7 biljnih ekstrakata - među kojima su rusa i neven u najvišim koncentracijama - i 7 eteričnih ulja, obogaćena panthenolom, ureom i vitaminima A i E. Za ciljanu, svakodnevnu negu kože.',
    shortDescription: 'Ciljana nega kože sklone pojavi bradavica',
    heroTitle: 'Ciljana nega za kožu sklonu bradavicama',
    purpose: 'Za negu kože osoba sklonih pojavi bradavica',
    category: 'skincare',
    slug: 'biowart',
    alternativeSlugs: [],
    availableCountries: [
      'rs',
      'ba'
    ],
    seoTitle: 'BIOWART - Krema za negu kože sklone pojavi bradavica | DERMOTIN',
    seoDescription: 'BIOWART od DERMOTIN brenda - krema za negu kože osoba sklonih pojavi bradavica. 7 biljnih ekstrakata (rusa, neven, hrastova kora) i 7 eteričnih ulja, panthenol, urea, vitamini A i E. Bez parabena. 50ml.',
    upsells: {
      products: [
        'immunis_kapi'
      ],
      discountPercentage: 10
    },
    crossSells: [
      'fungel',
      'immunis_kapi'
    ],
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
      'Namenski razvijen za negu kože sklone pojavi bradavica',
      'Rusa (Chelidonium majus) i neven u najvišim koncentracijama među biljnim ekstraktima',
      'Ukupno 7 biljnih ekstrakata: rusa, neven, hajdučka trava, ivanjsko cveće, kantarion, hrastova kora i žalfija',
      '7 eteričnih ulja: žalfija, eukaliptus, nana, karanfilić, timijan, zvezdasti anis i limun',
      'Panthenol, urea i glicerin doprinose hidrataciji kože',
      'Obogaćen vitaminima A i E i uljem slatkog badema',
      'Bez parabena i bez veštačkih boja',
      'Bezbednosno procenjen u skladu sa EU regulativom (EC) 1223/2009'
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
    usage: 'Nanositi tanak sloj na čistu i suvu kožu 1-2 puta dnevno. Ne ispirati nakon nanošenja. Sadržaj: 50ml.',
    usageSteps: [
      'Očistite i osušite kožu pre nanošenja',
      'Nanesite tanak sloj BIOWART-a na željeno mesto',
      'Ostavite da se upije',
      'Koristite 1-2 puta dnevno',
      'Ne ispirati nakon nanošenja',
      'Za najbolji efekat nege koristite redovno'
    ],
    warnings: [
      'Samo za spoljašnju upotrebu',
      'Obratiti pažnju na preosetljivost na bilo koji sastojak',
      'Izbegavati kontakt sa očima; u slučaju kontakta isprati sa dosta vode',
      'Ako iritacija ne prestane, potražiti savet lekara',
      'Čuvati van domašaja dece',
      'Sadrži prirodne alergene iz eteričnih ulja: Limonene, Linalool, Eugenol, Citral'
    ],
    productFAQ: [
      {
        question: 'Kako se koristi BIOWART?',
        answer: 'Nanesite tanak sloj na čistu i suvu kožu 1-2 puta dnevno. Ne ispira se nakon nanošenja. Pakovanje sadrži 50ml.',
        category: 'usage'
      },
      {
        question: 'Koji su glavni sastojci BIOWART-a?',
        answer: 'BIOWART sadrži 7 biljnih ekstrakata (rusa, neven, hajdučka trava, ivanjsko cveće, kantarion, hrastova kora i žalfija) i 7 eteričnih ulja (žalfija, eukaliptus, nana, karanfilić, timijan, zvezdasti anis i limun), uz panthenol, ureu i vitamine A i E. Rusa i neven su u najvišim koncentracijama.',
        category: 'ingredients'
      },
      {
        question: 'Da li je BIOWART lek?',
        answer: 'Ne. BIOWART je kozmetički proizvod za negu kože osoba sklonih pojavi bradavica i ne zamenjuje lekarsku intervenciju. Za zdravstvene tegobe obratite se lekaru.',
        category: 'safety'
      },
      {
        question: 'Da li je BIOWART bezbedan za upotrebu?',
        answer: 'Da, BIOWART je prošao bezbednosnu procenu u skladu sa EU regulativom o kozmetičkim proizvodima (EC) 1223/2009. Bez parabena i bez veštačkih boja. Namenjen je odraslima.',
        category: 'safety'
      },
      {
        question: 'Zašto baš rusa i neven?',
        answer: 'Rusa (Chelidonium majus) je tradicionalno najpoznatija biljka u kontekstu nege kože sklone bradavicama, a neven je klasik u nezi kože. U BIOWART formuli upravo ove dve biljke su u najvišim koncentracijama među ekstraktima.',
        category: 'ingredients'
      }
    ],
    testimonials: []
  },
  bioroid: {
    id: 'bioroid',
    name: 'BIOROID',
    description: 'Krema za negu kože i sluzokože analne regije. Formula sa 6 biljnih ekstrakata (hajdučka trava, divlji kesten, neven, pastirska torbica, zdravac i kamilica) i mentolom koji pruža osećaj svežine. Biljnog je porekla i može se koristiti duži vremenski period bez prekida.',
    shortDescription: 'Nežna nega osetljive intimne regije',
    heroTitle: 'Svakodnevni komfor i diskretna nega',
    purpose: 'Za negu kože i sluzokože analne regije',
    category: 'skincare',
    slug: 'bioroid',
    alternativeSlugs: [],
    availableCountries: [
      'rs',
      'ba'
    ],
    seoTitle: 'BIOROID - Krema za negu kože analne regije | DERMOTIN',
    seoDescription: 'BIOROID od DERMOTIN brenda - krema za negu kože i sluzokože analne regije. 6 biljnih ekstrakata, mentol za osećaj svežine, panthenol i vitamini A i E. Bez parabena. 50ml.',
    upsells: {
      products: [
        'bioroid_kapi'
      ],
      discountPercentage: 10
    },
    crossSells: [
      'bioroid_kapi'
    ],
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
      'Namenski razvijen za negu kože i sluzokože analne regije',
      'Sadrži 6 biljnih ekstrakata: hajdučka trava, divlji kesten, neven, pastirska torbica, zdravac i kamilica',
      'Mentol pruža osećaj svežine i prijatnog hlađenja',
      'Eterična ulja pačulija, lavandina, čajnog drveta i karanfilića',
      'Panthenol, glicerin i vitamini A i E doprinose hidrataciji i nezi',
      'Biljnog porekla - može se koristiti duži vremenski period bez prekida',
      'Bez parabena i bez veštačkih boja',
      'Bezbednosno procenjen u skladu sa EU regulativom (EC) 1223/2009'
    ],
    ingredients: [
      'achillea-extract',
      'aesculus-extract',
      'calendula-extract',
      'capsella-extract',
      'geranium-extract',
      'chamomile-extract',
      'panthenol',
      'vitamin-e',
      'tocopherol',
      'vitamin-a',
      'sweet-almond-oil',
      'menthol',
      'patchouli-oil',
      'lavender-oil',
      'tea-tree-oil',
      'clove-oil',
      'aqua',
      'alcohol',
      'stearic-acid',
      'glycerin',
      'cetyl-alcohol',
      'glyceryl-stearate',
      'synthetic-beeswax',
      'urea',
      'triethanolamine',
      'carbomer',
      'sodium-gluconate',
      'phenoxyethanol',
      'ethylhexylglycerin',
      'potassium-sorbate'
    ],
    usage: 'Nanositi dva puta dnevno, uz redovnu higijenu. Krema je biljnog porekla i može se koristiti duži vremenski period bez prekida. Sadržaj: 50ml.',
    usageSteps: [
      'Održavajte redovnu higijenu regije',
      'Nanesite kremu na čistu i suvu kožu',
      'Koristite dva puta dnevno',
      'Operite ruke nakon upotrebe',
      'Krema se može koristiti duži vremenski period bez prekida'
    ],
    warnings: [
      'Proizvod je namenjen isključivo za spoljašnju upotrebu',
      'Obratiti pažnju na preosetljivost na bilo koji sastojak',
      'Oprati ruke nakon upotrebe',
      'Izbegavati kontakt sa očima; u slučaju kontakta isprati sa dosta vode',
      'U slučaju produžene iritacije potražiti medicinsku pomoć',
      'Čuvati van domašaja dece',
      'Sadrži prirodne alergene iz eteričnih ulja (Limonene, Eugenol, Linalool)'
    ],
    productFAQ: [
      {
        question: 'Kako se koristi BIOROID?',
        answer: 'Nanesite kremu dva puta dnevno na čistu kožu, uz redovnu higijenu. Krema je biljnog porekla i može se koristiti duži vremenski period bez prekida.',
        category: 'usage'
      },
      {
        question: 'Koji su glavni sastojci BIOROID-a?',
        answer: 'BIOROID sadrži 6 biljnih ekstrakata (hajdučka trava, divlji kesten, neven, pastirska torbica, zdravac i kamilica), mentol za osećaj svežine i eterična ulja pačulija, lavandina, čajnog drveta i karanfilića, uz panthenol i vitamine A i E.',
        category: 'ingredients'
      },
      {
        question: 'Da li je BIOROID bezbedan za dugotrajnu upotrebu?',
        answer: 'Da, krema je biljnog porekla i prema uputstvu sa ambalaže može se koristiti duži vremenski period bez prekida. Prošla je bezbednosnu procenu u skladu sa EU regulativom (EC) 1223/2009.',
        category: 'safety'
      },
      {
        question: 'Kakav je osećaj nakon nanošenja?',
        answer: 'Zahvaljujući mentolu, krema pruža osećaj svežine i prijatnog hlađenja, a panthenol i glicerin doprinose hidrataciji i osećaju komfora.',
        category: 'effects'
      },
      {
        question: 'Da li je BIOROID lek?',
        answer: 'Ne. BIOROID je kozmetički proizvod za negu kože, a ne lek. Za zdravstvene tegobe obratite se lekaru.',
        category: 'safety'
      }
    ],
    testimonials: []
  },
  biomelis_kapi: {
    id: 'biomelis_kapi',
    name: 'BIOMELIS KAPI',
    description: 'Dodatak ishrani na bazi vodeno-etanolnih ekstrakata 6 biljaka. Zahvaljujući sadržaju silimarina, badelj deluje kao hepatoprotektiv i doprinosi zdravlju jetre, dok maslačak doprinosi normalnoj funkciji želuca i jetre, a čičak i lazarkinja podržavaju varenje.',
    shortDescription: 'Biljna podrška za jetru i varenje',
    heroTitle: 'Podrška vašoj jetri, iz prirode',
    purpose: 'Podržava normalnu funkciju jetre i varenje',
    category: 'supplements',
    images: {
      main: '/images/products/biomelis-kapi/biomelis-kapi-box-and-product-mockup.png',
      gallery: [
        '/images/products/biomelis-kapi/biomelis-kapi-box-and-product-mockup.png'
      ],
      thumbnail: '/images/products/biomelis-kapi/biomelis-kapi-box-and-product-mockup.png',
      fallback: '/images/products/biomelis-kapi/biomelis-kapi-box-and-product-mockup.png'
    },
    variants: [
      {
        id: 'biomelis-kapi-1pak',
        sku: 'BIOMELIS-KAPI',
        name: '1 PAKOVANJE (50ml)',
        size: 'Okvirno mesec dana upotrebe',
        quantity: 1,
        price: 2390,
        currency: 'RSD',
        discountPrice: 1890,
        isDefault: true
      },
      {
        id: 'biomelis-kapi-2pak',
        sku: 'BIOMELIS-KAPI',
        name: '2 PAKOVANJA (100ml)',
        size: 'Okvirno 2 meseca upotrebe',
        quantity: 2,
        price: 4780,
        currency: 'RSD',
        discountPrice: 3590
      },
      {
        id: 'biomelis-kapi-3pak',
        sku: 'BIOMELIS-KAPI',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 3 meseca upotrebe',
        quantity: 3,
        price: 7170,
        currency: 'RSD',
        discountPrice: 4790
      }
    ],
    benefits: [
      'Zahvaljujući sadržaju silimarina, badelj ispoljava regenerativno delovanje na hepatocite',
      'Badelj deluje kao hepatoprotektiv i doprinosi zdravlju jetre',
      'Maslačak doprinosi normalnoj funkciji želuca i jetre',
      'Rastavić ima zaštitni efekat na hepatocite',
      'Čičak poboljšava varenje i podstiče metabolizam masti i glukoze',
      'Lazarkinja povoljno utiče na proces varenja',
      '6 pažljivo odabranih vodeno-etanolnih biljnih ekstrakata',
      'Energetska vrednost dnevnog unosa manja od 50 kJ (12 kcal)'
    ],
    ingredients: [
      'milk-thistle-extract',
      'nettle-leaf-extract',
      'dandelion-root-extract',
      'burdock-root-extract',
      'horsetail-herb-extract',
      'woodruff-herb-extract',
      'aqua',
      'ethanol'
    ],
    usage: 'Odrasli, 3 puta dnevno po 40 kapi, rastvoreno u malo vode. Sadržaj: 50ml.',
    usageSteps: [
      'Uzimati 3 puta dnevno po 40 kapi',
      'Rastvoriti kapi u malo vode',
      'Ne prekoračiti preporučenu dnevnu dozu',
      'Za najbolji efekat koristiti redovno',
      'Kombinovati sa raznovrsnom i uravnoteženom ishranom'
    ],
    warnings: [
      'Dodatak ishrani se ne može koristiti kao zamena za raznovrsnu i uravnoteženu ishranu',
      'Čuvati van domašaja dece',
      'Proizvod čuvati dobro zatvoren u originalnom pakovanju, na suvom, tamnom i hladnom mestu',
      'Proizvod nije namenjen osobama preosetljivim na bilo koji sastojak',
      'Nije namenjen trudnicama, dojiljama i osobama mlađim od 18 godina',
      'Takođe, osobama kojima se preporučuje redukovan unos tečnosti (teška srčana ili bubrežna bolest)',
      'Ne preporučuje se istovremena primena sa diureticima',
      'Primenu proizvoda mogu da prate blagi i prolazni simptomi poremećaja funkcije gastrointestinalnog trakta',
      'Moguća je pojava kožnih reakcija',
      'Proizvod sadrži alkohol'
    ],
    slug: 'biomelis-kapi',
    alternativeSlugs: [
      'biomelis-drops',
      'jetra-kapi',
      'hepatoprotektiv'
    ],
    availableCountries: [
      'rs',
      'ba'
    ],
    seoTitle: 'BIOMELIS KAPI - Dodatak ishrani za zdravlje jetre i varenje | DERMOTIN',
    seoDescription: 'BIOMELIS KAPI od DERMOTIN brenda - dodatak ishrani sa ekstraktima badelja (silimarin), koprive, maslačka, čička, rastavića i lazarkinje. Doprinosi zdravlju jetre i varenju. 50ml.',
    upsells: {
      products: [
        'immunis_kapi'
      ],
      discountPercentage: 10
    },
    crossSells: [
      'biomelis',
      'immunis_kapi'
    ],
    urgencyElements: {},
    productFAQ: [
      {
        question: 'Kako se koriste BIOMELIS KAPI?',
        answer: 'Vrlo jednostavno! Odrasli uzimaju 3 puta dnevno po 40 kapi, rastvoreno u malo vode. Bočica sadrži 50ml.',
        category: 'usage'
      },
      {
        question: 'Šta BIOMELIS KAPI sadrže?',
        answer: 'Vodeno-etanolne ekstrakte 6 biljaka: badelj (sikavica), kopriva, maslačak, čičak, rastavić i lazarkinja. Proizvod sadrži alkohol iz vodeno-etanolnih ekstrakata.',
        category: 'ingredients'
      },
      {
        question: 'Da li su BIOMELIS KAPI lek?',
        answer: 'Ne, BIOMELIS KAPI su dodatak ishrani, a ne lek. Dodatak ishrani se ne može koristiti kao zamena za raznovrsnu i uravnoteženu ishranu. Za zdravstvene tegobe obratite se lekaru.',
        category: 'safety'
      },
      {
        question: 'Kako biljke iz sastava doprinose organizmu?',
        answer: 'Zahvaljujući silimarinu, badelj deluje kao hepatoprotektiv i doprinosi zdravlju jetre. Maslačak doprinosi normalnoj funkciji želuca i jetre, rastavić ima zaštitni efekat na hepatocite, čičak poboljšava varenje i podstiče metabolizam masti i glukoze, a lazarkinja povoljno utiče na varenje.',
        category: 'effects'
      },
      {
        question: 'Ko ne sme da koristi BIOMELIS KAPI?',
        answer: 'Proizvod nije namenjen osobama preosetljivim na bilo koji sastojak, trudnicama, dojiljama i osobama mlađim od 18 godina, kao ni osobama kojima se preporučuje redukovan unos tečnosti (teška srčana ili bubrežna bolest). Ne preporučuje se istovremena primena sa diureticima.',
        category: 'safety'
      },
      {
        question: 'Kako da čuvam BIOMELIS KAPI?',
        answer: 'Čuvajte dobro zatvoreno u originalnom pakovanju, na suvom, tamnom i hladnom mestu, van domašaja dece.',
        category: 'storage'
      },
      {
        question: 'Mogu li da koristim BIOMELIS KAPI sa lekovima?',
        answer: 'Ako uzimate lekove, posebno diuretike, posavetujte se sa lekarom ili farmaceutom pre upotrebe. Istovremena primena sa diureticima se ne preporučuje.',
        category: 'usage'
      },
      {
        question: 'Da li proizvod sadrži alkohol?',
        answer: 'Da, proizvod sadrži alkohol (etanol iz vodeno-etanolnih ekstrakata). Energetska vrednost dnevnog unosa je manja od 50 kJ (12 kcal).',
        category: 'ingredients'
      }
    ],
    testimonials: []
  },
  bioroid_kapi: {
    id: 'bioroid_kapi',
    name: 'BIOROID KAPI',
    description: 'Dodatak ishrani na bazi vodeno-etanolnih ekstrakata 6 biljaka. Hajdučka trava podržava normalan vaskularni tonus i integritet rektalnih vena i zdravlje venskog sistema, dok čičak, maslačak i hrast doprinose varenju i digestivnom komforu.',
    shortDescription: 'Biljna podrška venama i varenju',
    heroTitle: 'Podrška iznutra, kada je najpotrebnija',
    purpose: 'Podržava zdravlje venskog sistema i digestivni komfor',
    category: 'supplements',
    images: {
      main: '/images/products/bioroid-kapi/bioroid-kapi-box-and-product-mockup.png',
      gallery: [
        '/images/products/bioroid-kapi/bioroid-kapi-box-and-product-mockup.png'
      ],
      thumbnail: '/images/products/bioroid-kapi/bioroid-kapi-box-and-product-mockup.png',
      fallback: '/images/products/bioroid-kapi/bioroid-kapi-box-and-product-mockup.png'
    },
    variants: [
      {
        id: 'bioroid-kapi-1pak',
        sku: 'BIOROID-KAPI',
        name: '1 PAKOVANJE (50ml)',
        size: 'Okvirno mesec dana upotrebe',
        quantity: 1,
        price: 2390,
        currency: 'RSD',
        discountPrice: 1890,
        isDefault: true
      },
      {
        id: 'bioroid-kapi-2pak',
        sku: 'BIOROID-KAPI',
        name: '2 PAKOVANJA (100ml)',
        size: 'Okvirno 2 meseca upotrebe',
        quantity: 2,
        price: 4780,
        currency: 'RSD',
        discountPrice: 3590
      },
      {
        id: 'bioroid-kapi-3pak',
        sku: 'BIOROID-KAPI',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 3 meseca upotrebe',
        quantity: 3,
        price: 7170,
        currency: 'RSD',
        discountPrice: 4790
      }
    ],
    benefits: [
      'Hajdučka trava podržava normalan vaskularni tonus i integritet rektalnih vena',
      'Hajdučka trava podržava normalno funkcionisanje vena i zdravlje venskog sistema',
      'Čičak pomaže varenje i doprinosi osećaju digestivnog komfora',
      'Neven podstiče procese isceljivanja tkiva i osnaživanja tela',
      'Hrast doprinosi poboljšanju intestinalne pokretljivosti i mikroflore',
      'Maslačak doprinosi normalnom funkcionisanju digestivnog trakta i jetre',
      'Kleka doprinosi odbrambenim sposobnostima organizma',
      '6 pažljivo odabranih vodeno-etanolnih biljnih ekstrakata'
    ],
    ingredients: [
      'achillea-herb-extract',
      'arctium-root-extract',
      'calendula-flower-oral-extract',
      'quercus-bark-oral-extract',
      'dandelion-root-extract',
      'juniper-fruit-extract',
      'aqua',
      'ethanol'
    ],
    ingredientDescriptions: {
      'achillea-herb-extract': 'Hajdučka trava podržava normalan vaskularni tonus i integritet rektalnih vena, normalno funkcionisanje vena i zdravlje venskog sistema',
      'calendula-flower-oral-extract': 'Neven podstiče procese isceljivanja tkiva i osnaživanja tela',
      'quercus-bark-oral-extract': 'Hrast doprinosi poboljšanju intestinalne pokretljivosti i mikroflore, što pomaže smanjenju neprijatnog osećaja kod ubrzane pasaže crevnog sadržaja'
    },
    usage: 'Odrasli, 3 puta dnevno po 40 kapi, rastvoreno u malo vode, posle obroka. Sadržaj: 50ml.',
    usageSteps: [
      'Uzimati 3 puta dnevno po 40 kapi',
      'Rastvoriti kapi u malo vode',
      'Uzimati posle obroka',
      'Ne prekoračiti preporučenu dnevnu dozu',
      'Za najbolji efekat koristiti redovno',
      'Kombinovati sa raznovrsnom i uravnoteženom ishranom'
    ],
    warnings: [
      'Dodatak ishrani se ne može koristiti kao zamena za raznovrsnu i uravnoteženu ishranu',
      'Nije namenjen trudnicama, dojiljama i deci mlađoj od 18 godina',
      'Kontraindikovan kod osoba preosetljivih na sastojke i osoba sa teškim bubrežnim i srčanim oboljenjima',
      'Ne preporučuje se osobama sa gastričnim i duodenalnim ulkusom, ili sa oboljenjima žučnih puteva i žučne kesice',
      'Ne preporučuje se istovremena upotreba sa diureticima',
      'Kod preosetljivih osoba moguće su alergijske reakcije slabijeg intenziteta',
      'Proizvod sadrži alkohol',
      'Čuvati van domašaja dece, dobro zatvoren u originalnom pakovanju, na suvom, tamnom i hladnom mestu'
    ],
    slug: 'bioroid-kapi',
    alternativeSlugs: [
      'bioroid-drops',
      'vene-kapi',
      'digestivni-komfor'
    ],
    availableCountries: [
      'rs',
      'ba'
    ],
    seoTitle: 'BIOROID KAPI - Dodatak ishrani za vene i digestivni komfor | DERMOTIN',
    seoDescription: 'BIOROID KAPI od DERMOTIN brenda - dodatak ishrani sa ekstraktima hajdučke trave, čička, nevena, hrasta, maslačka i kleke. Podrška zdravlju venskog sistema i varenju. 50ml.',
    upsells: {
      products: [
        'immunis_kapi'
      ],
      discountPercentage: 10
    },
    crossSells: [
      'bioroid',
      'immunis_kapi'
    ],
    urgencyElements: {},
    productFAQ: [
      {
        question: 'Kako se koriste BIOROID KAPI?',
        answer: 'Vrlo jednostavno! Odrasli uzimaju 3 puta dnevno po 40 kapi, rastvoreno u malo vode, posle obroka. Bočica sadrži 50ml.',
        category: 'usage'
      },
      {
        question: 'Šta BIOROID KAPI sadrže?',
        answer: 'Vodeno-etanolne ekstrakte 6 biljaka: hajdučka trava, čičak, neven, hrastova kora, maslačak i kleka. Proizvod sadrži alkohol iz vodeno-etanolnih ekstrakata.',
        category: 'ingredients'
      },
      {
        question: 'Da li su BIOROID KAPI lek?',
        answer: 'Ne, BIOROID KAPI su dodatak ishrani, a ne lek. Dodatak ishrani se ne može koristiti kao zamena za raznovrsnu i uravnoteženu ishranu. Za zdravstvene tegobe obratite se lekaru.',
        category: 'safety'
      },
      {
        question: 'Kako biljke iz sastava doprinose organizmu?',
        answer: 'Hajdučka trava podržava normalan vaskularni tonus i integritet rektalnih vena i zdravlje venskog sistema. Čičak pomaže varenje i digestivni komfor, maslačak doprinosi normalnom funkcionisanju digestivnog trakta i jetre, hrast doprinosi intestinalnoj pokretljivosti i mikroflori, a kleka odbrambenim sposobnostima organizma.',
        category: 'effects'
      },
      {
        question: 'Ko ne sme da koristi BIOROID KAPI?',
        answer: 'Proizvod nije namenjen trudnicama, dojiljama i osobama mlađim od 18 godina. Kontraindikovan je kod preosetljivosti na sastojke i kod teških bubrežnih i srčanih oboljenja, a ne preporučuje se ni osobama sa čirom na želucu ili dvanaestopalačnom crevu i oboljenjima žučnih puteva.',
        category: 'safety'
      },
      {
        question: 'Kako da čuvam BIOROID KAPI?',
        answer: 'Čuvajte dobro zatvoreno u originalnom pakovanju, na suvom, tamnom i hladnom mestu, van domašaja dece.',
        category: 'storage'
      },
      {
        question: 'Mogu li da koristim BIOROID KAPI sa lekovima?',
        answer: 'Ako uzimate lekove, posebno diuretike, posavetujte se sa lekarom ili farmaceutom pre upotrebe. Istovremena upotreba sa diureticima se ne preporučuje.',
        category: 'usage'
      },
      {
        question: 'Mogu li BIOROID KAPI da kombinujem sa BIOROID kremom?',
        answer: 'Da, mnogi korisnici kombinuju kapi kao unutrašnju podršku sa BIOROID kremom za spoljašnju negu - kao kompletnu rutinu.',
        category: 'usage'
      }
    ],
    testimonials: []
  },
  immunis_kapi: {
    id: 'immunis_kapi',
    name: 'IMMUNIS KAPI',
    description: 'Dodatak ishrani na bazi vodeno-etanolnih ekstrakata 6 biljaka. Purpurna ehinacea doprinosi pravilnom funkcionisanju imunog sistema, majčina dušica i maslina doprinose zdravlju organa za disanje, a lavanda doprinosi relaksaciji i lakšem uspavljivanju.',
    shortDescription: 'Biljna podrška imunitetu i disanju',
    heroTitle: 'Dnevna doza podrške vašem imunitetu',
    purpose: 'Podržava pravilno funkcionisanje imunog sistema i prirodnu odbrambenu sposobnost organizma',
    category: 'supplements',
    images: {
      main: '/images/products/immunis-kapi/immunis-kapi-box-and-product-mockup.png',
      gallery: [
        '/images/products/immunis-kapi/immunis-kapi-box-and-product-mockup.png'
      ],
      thumbnail: '/images/products/immunis-kapi/immunis-kapi-box-and-product-mockup.png',
      fallback: '/images/products/immunis-kapi/immunis-kapi-box-and-product-mockup.png'
    },
    variants: [
      {
        id: 'immunis-kapi-1pak',
        sku: 'IMMUNIS-KAPI',
        name: '1 PAKOVANJE (50ml)',
        size: 'Okvirno mesec dana upotrebe',
        quantity: 1,
        price: 2390,
        currency: 'RSD',
        discountPrice: 1890,
        isDefault: true
      },
      {
        id: 'immunis-kapi-2pak',
        sku: 'IMMUNIS-KAPI',
        name: '2 PAKOVANJA (100ml)',
        size: 'Okvirno 2 meseca upotrebe',
        quantity: 2,
        price: 4780,
        currency: 'RSD',
        discountPrice: 3590
      },
      {
        id: 'immunis-kapi-3pak',
        sku: 'IMMUNIS-KAPI',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 3 meseca upotrebe',
        quantity: 3,
        price: 7170,
        currency: 'RSD',
        discountPrice: 4790
      }
    ],
    benefits: [
      'Purpurna ehinacea doprinosi pravilnom funkcionisanju imunog sistema',
      'Ehinacea doprinosi prirodnoj odbrambenoj sposobnosti organizma',
      'Kopriva podržava odbrambene sposobnosti organizma i imuni sistem',
      'Majčina dušica doprinosi zdravlju organa za disanje',
      'Maslina doprinosi odbrani organizma od spoljašnjih agenasa i zdravlju gornjih disajnih puteva',
      'Lavanda doprinosi relaksaciji i uspavljivanju',
      '6 pažljivo odabranih vodeno-etanolnih biljnih ekstrakata',
      'Energetska vrednost dnevnog unosa manja od 50 kJ (12 kcal)'
    ],
    ingredients: [
      'echinacea-root-extract',
      'nettle-leaf-extract',
      'walnut-leaf-extract',
      'thyme-herb-extract',
      'olive-leaf-extract',
      'lavender-flower-extract',
      'aqua',
      'ethanol'
    ],
    ingredientDescriptions: {
      'nettle-leaf-extract': 'Kopriva podržava odbrambene sposobnosti organizma i imuni sistem'
    },
    usage: 'Odrasli, 3 puta dnevno po 40 kapi, rastvoreno u malo vode, posle obroka. Sadržaj: 50ml.',
    usageSteps: [
      'Uzimati 3 puta dnevno po 40 kapi',
      'Rastvoriti kapi u malo vode',
      'Uzimati posle obroka',
      'Ne prekoračiti preporučenu dnevnu dozu',
      'Za najbolji efekat koristiti redovno',
      'Kombinovati sa raznovrsnom i uravnoteženom ishranom'
    ],
    warnings: [
      'Dodatak ishrani se ne može koristiti kao zamena za raznovrsnu i uravnoteženu ishranu',
      'Nije namenjen osobama preosetljivim na bilo koji sastojak, trudnicama, dojiljama i osobama mlađim od 18 godina',
      'Nije namenjen osobama kojima se preporučuje redukovan unos tečnosti (teška srčana ili bubrežna bolest)',
      'Nije namenjen osobama sa progresivnim sistemskim poremećajima, autoimunim oboljenjima, imunodeficijencijama, imunosupresijom ili oboljenjima ćelija bele krvne loze',
      'Primena proizvoda na bazi lavande može da dovede do pospanosti - u to vreme izbegavati upravljanje motornim vozilima ili radnim mašinama',
      'Primenu mogu da prate blagi i prolazni simptomi poremećaja funkcije gastrointestinalnog trakta; moguća je pojava blažih kožnih reakcija',
      'Proizvod sadrži alkohol',
      'Čuvati van domašaja dece, dobro zatvoren u originalnom pakovanju, na suvom, tamnom i hladnom mestu'
    ],
    slug: 'immunis-kapi',
    alternativeSlugs: [
      'immunis-drops',
      'imunitet-kapi',
      'ehinacea-kapi'
    ],
    availableCountries: [
      'rs',
      'ba'
    ],
    seoTitle: 'IMMUNIS KAPI - Dodatak ishrani za imunitet i disajne puteve | DERMOTIN',
    seoDescription: 'IMMUNIS KAPI od DERMOTIN brenda - dodatak ishrani sa ekstraktima purpurne ehinacee, koprive, oraha, majčine dušice, masline i lavande. Podrška imunom sistemu. 50ml.',
    crossSells: [
      'biomelis_kapi',
      'bioroid_kapi'
    ],
    urgencyElements: {},
    productFAQ: [
      {
        question: 'Kako se koriste IMMUNIS KAPI?',
        answer: 'Vrlo jednostavno! Odrasli uzimaju 3 puta dnevno po 40 kapi, rastvoreno u malo vode, posle obroka. Bočica sadrži 50ml.',
        category: 'usage'
      },
      {
        question: 'Šta IMMUNIS KAPI sadrže?',
        answer: 'Vodeno-etanolne ekstrakte 6 biljaka: purpurna ehinacea, kopriva, orah (list), majčina dušica, maslina (list) i lavanda. Proizvod sadrži alkohol iz vodeno-etanolnih ekstrakata.',
        category: 'ingredients'
      },
      {
        question: 'Da li su IMMUNIS KAPI lek?',
        answer: 'Ne, IMMUNIS KAPI su dodatak ishrani, a ne lek. Dodatak ishrani se ne može koristiti kao zamena za raznovrsnu i uravnoteženu ishranu. Za zdravstvene tegobe obratite se lekaru.',
        category: 'safety'
      },
      {
        question: 'Kako biljke iz sastava doprinose organizmu?',
        answer: 'Purpurna ehinacea doprinosi pravilnom funkcionisanju imunog sistema i prirodnoj odbrambenoj sposobnosti organizma, kopriva podržava odbrambene sposobnosti i imuni sistem, majčina dušica doprinosi zdravlju organa za disanje, maslina odbrani organizma od spoljašnjih agenasa i zdravlju gornjih disajnih puteva, a lavanda relaksaciji i uspavljivanju.',
        category: 'effects'
      },
      {
        question: 'Ko ne sme da koristi IMMUNIS KAPI?',
        answer: 'Proizvod nije namenjen osobama preosetljivim na bilo koji sastojak, trudnicama, dojiljama i osobama mlađim od 18 godina, kao ni osobama sa progresivnim sistemskim poremećajima, autoimunim oboljenjima, imunodeficijencijama, imunosupresijom ili oboljenjima ćelija bele krvne loze.',
        category: 'safety'
      },
      {
        question: 'Kako da čuvam IMMUNIS KAPI?',
        answer: 'Čuvajte dobro zatvoreno u originalnom pakovanju, na suvom, tamnom i hladnom mestu, van domašaja dece.',
        category: 'storage'
      },
      {
        question: 'Da li mogu da vozim nakon uzimanja?',
        answer: 'Oprez - proizvodi na bazi lavande mogu da dovedu do pospanosti. U to vreme izbegavajte upravljanje motornim vozilima ili radnim mašinama.',
        category: 'usage'
      },
      {
        question: 'Kada je pravi trenutak za IMMUNIS KAPI?',
        answer: 'Mnogi korisnici ih biraju kao dnevnu biljnu podršku tokom jeseni i zime, uz uravnoteženu ishranu, san i kretanje. Uzimaju se redovno, 3 puta dnevno po 40 kapi posle obroka.',
        category: 'usage'
      }
    ],
    testimonials: []
  },
  fungomax: {
    id: 'fungomax',
    name: 'FUNGOMAX',
    description: 'Serum za negu kože i noktiju osoba sklonih pojavi gljivica. Koncentrovana tečna formula sa kapaljkom za preciznu, ciljanu primenu - preko 79% formule čini biljna tinktura sa 4 ekstrakta, uz alantoin i čak 20% glicerina za negovan izgled kože i noktiju.',
    shortDescription: 'Serum za ciljanu negu noktiju i kože',
    heroTitle: 'Precizna serum-nega za nokte i kožu',
    purpose: 'Za negu kože i noktiju osoba sklonih pojavi gljivica',
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
        size: 'Okvirno 2 nedelje upotrebe',
        quantity: 1,
        price: 2390,
        currency: 'RSD',
        discountPrice: 1990,
        isDefault: true
      },
      {
        id: 'fungomax-2pak',
        sku: 'FUNGOMAX',
        name: '2 PAKOVANJA (100ml)',
        size: 'Okvirno mesec dana upotrebe',
        quantity: 2,
        price: 4780,
        currency: 'RSD',
        discountPrice: 3590
      },
      {
        id: 'fungomax-3pak',
        sku: 'FUNGOMAX',
        name: '3 PAKOVANJA (150ml)',
        size: 'Okvirno 2 meseca upotrebe',
        quantity: 3,
        price: 7170,
        currency: 'RSD',
        discountPrice: 4790
      }
    ],
    benefits: [
      'Namenski razvijen za negu kože i noktiju sklonih pojavi gljivica',
      'Koncentrovana tečna formula sa kapaljkom za preciznu, ciljanu primenu',
      'Visok udeo biljne tinkture - preko 79% formule',
      '4 biljna ekstrakta: timijan, orahov list, žalfija i hrastova kora',
      '3 eterična ulja: lavandin, ruzmarin i karanfilić',
      'Alantoin i čak 20% glicerina doprinose hidrataciji i negovanom izgledu',
      'Idealan u kombinaciji sa FUNGEL kremom kao rutina nege',
      'Bezbednosno procenjen u skladu sa EU regulativom (EC) 1223/2009'
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
    usage: 'Nakapati dva puta dnevno i nežno utrljati na ciljano područje. Ne ispirati nakon nanošenja. Sadržaj: 50ml.',
    usageSteps: [
      'Očistite i osušite kožu ili nokte pre nanošenja',
      'Nakapajte nekoliko kapi seruma na željeno mesto',
      'Nežno utrljajte serum',
      'Koristite 2 puta dnevno (ujutru i uveče)',
      'Ne ispirati nakon nanošenja',
      'Za kompletnu rutinu nege kombinujte sa FUNGEL kremom'
    ],
    warnings: [
      'Proizvod je namenjen isključivo za spoljašnju upotrebu',
      'Obratiti pažnju na preosetljivost na bilo koji sastojak',
      'Ne nanositi na otvorene rane',
      'Oprati ruke nakon upotrebe',
      'Izbegavati kontakt sa očima; u slučaju kontakta isprati sa dosta vode',
      'U slučaju produžene iritacije potražiti medicinsku pomoć',
      'Čuvati na suvom mestu, van domašaja dece',
      'Sadrži prirodne alergene iz eteričnih ulja (Eugenol, Linalool, Limonene)'
    ],
    slug: 'fungomax',
    alternativeSlugs: [
      'fungomax-serum',
      'gljivice-serum',
      'nega-noktiju-serum'
    ],
    availableCountries: [
      'rs',
      'ba'
    ],
    seoTitle: 'FUNGOMAX - Serum za negu kože i noktiju sklonih gljivicama | DERMOTIN',
    seoDescription: 'FUNGOMAX od DERMOTIN brenda - serum sa kapaljkom za negu kože i noktiju osoba sklonih pojavi gljivica. 4 biljna ekstrakta (timijan, orahov list, žalfija, hrastova kora), alantoin i 20% glicerina. 50ml.',
    upsells: {
      products: [
        'fungel'
      ],
      discountPercentage: 10
    },
    crossSells: [
      'fungel',
      'biowart'
    ],
    urgencyElements: {},
    productFAQ: [
      {
        question: 'Kako se koristi FUNGOMAX serum?',
        answer: 'Vrlo jednostavno! Nakapajte 2 puta dnevno nekoliko kapi na ciljano područje i nežno utrljajte. Ne ispira se. Bočica sa kapaljkom sadrži 50ml.',
        category: 'usage'
      },
      {
        question: 'Šta FUNGOMAX sadrži?',
        answer: '4 biljna ekstrakta (timijan, orahov list, žalfija i hrastova kora) i 3 eterična ulja (lavandin, ruzmarin i karanfilić), uz alantoin i čak 20% glicerina. Biljna tinktura čini preko 79% formule.',
        category: 'ingredients'
      },
      {
        question: 'Da li je FUNGOMAX lek?',
        answer: 'Ne. FUNGOMAX je kozmetički proizvod za negu kože i noktiju osoba sklonih pojavi gljivica. Ako imate zdravstveni problem, obratite se lekaru ili farmaceutu.',
        category: 'safety'
      },
      {
        question: 'Da li je bezbedan za svakodnevnu upotrebu?',
        answer: 'Da, FUNGOMAX je namenjen redovnoj upotrebi 2 puta dnevno. Prošao je bezbednosnu procenu u skladu sa EU regulativom o kozmetičkim proizvodima (EC) 1223/2009.',
        category: 'safety'
      },
      {
        question: 'Mogu li ga koristiti sa FUNGEL kremom?',
        answer: 'Da! FUNGOMAX serum sa kapaljkom je zgodan za preciznu, ciljanu primenu, a FUNGEL krema za negu šire površine kože. Zajedno čine kompletnu rutinu nege.',
        category: 'usage'
      },
      {
        question: 'Kako da čuvam FUNGOMAX?',
        answer: 'Čuvajte na suvom mestu, van domašaja dece. Zatvorite dobro nakon upotrebe. Rok trajanja je označen na pakovanju.',
        category: 'storage'
      },
      {
        question: 'Koja je razlika između FUNGOMAX-a i FUNGEL-a?',
        answer: 'FUNGOMAX je tečni serum sa kapaljkom za preciznu, ciljanu primenu na nokte i manje površine. FUNGEL je krema pogodna za negu šire površine kože. Mnogi korisnici ih kombinuju.',
        category: 'usage'
      },
      {
        question: 'Da li je FUNGOMAX namenjen deci?',
        answer: 'Ne, FUNGOMAX je namenjen odraslima. To je definisano bezbednosnom procenom proizvoda.',
        category: 'safety'
      }
    ],
    testimonials: []
  },
  bioroid_set: {
    id: 'bioroid_set',
    name: 'BIOROID SET',
    description: 'Komplet za kompletnu rutinu: BIOROID krema za spoljašnju negu kože i sluzokože analne regije + BIOROID KAPI, dodatak ishrani koji podržava normalan vaskularni tonus, zdravlje venskog sistema i digestivni komfor. Spoljašnja nega i unutrašnja podrška u jednom pakovanju, po povoljnijoj ceni.',
    shortDescription: 'BIOROID krema + BIOROID KAPI — kompletna rutina po povoljnijoj ceni',
    heroTitle: 'Kompletna rutina: nega spolja, podrška iznutra',
    purpose: 'Set za spoljašnju negu analne regije i unutrašnju podršku zdravlju vena i varenju',
    category: 'bundle',
    images: {
      main: '/images/products/bioroid/bioroid-box-and-product-mockup.png',
      gallery: [
        '/images/products/bioroid/bioroid-box-only.png',
        '/images/products/bioroid-kapi/bioroid-kapi-box-and-product-mockup.png'
      ],
      thumbnail: '/images/products/bioroid/bioroid-box-only.png',
      fallback: '/images/products/bioroid/bioroid-box-and-product-mockup.png'
    },
    variants: [
      {
        id: 'bioroid-set-1',
        sku: 'BIOROID-SET',
        name: '1 SET (krema 50ml + kapi 50ml)',
        size: 'Okvirno mesec dana upotrebe',
        quantity: 1,
        price: 5380,
        currency: 'RSD',
        discountPrice: 3290,
        isDefault: true
      }
    ],
    benefits: [
      'Komplet: BIOROID krema (50ml) + BIOROID KAPI (50ml)',
      'Krema neguje kožu i sluzokožu analne regije, uz mentol za osećaj svežine',
      'Kapi podržavaju normalan vaskularni tonus, zdravlje venskog sistema i digestivni komfor',
      'Povoljnije nego pojedinačna kupovina',
      'Prirodni biljni ekstrakti u oba proizvoda'
    ],
    ingredients: [
      'achillea-extract',
      'aesculus-extract',
      'calendula-extract',
      'capsella-extract',
      'geranium-extract',
      'chamomile-extract',
      'panthenol',
      'vitamin-e',
      'tocopherol',
      'vitamin-a',
      'sweet-almond-oil',
      'menthol',
      'patchouli-oil',
      'lavender-oil',
      'tea-tree-oil',
      'clove-oil',
      'aqua',
      'alcohol',
      'stearic-acid',
      'glycerin',
      'cetyl-alcohol',
      'glyceryl-stearate',
      'synthetic-beeswax',
      'urea',
      'triethanolamine',
      'carbomer',
      'sodium-gluconate',
      'phenoxyethanol',
      'ethylhexylglycerin',
      'potassium-sorbate',
      'achillea-herb-extract',
      'arctium-root-extract',
      'calendula-flower-oral-extract',
      'quercus-bark-oral-extract',
      'dandelion-root-extract',
      'juniper-fruit-extract',
      'ethanol'
    ],
    usage: 'KREMA: nanositi dva puta dnevno, uz redovnu higijenu (50ml). KAPI: odrasli, 3 puta dnevno po 40 kapi, rastvoreno u malo vode, posle obroka (50ml).',
    usageSteps: [
      'Kremu nanesite na čistu i suvu kožu, dva puta dnevno',
      'Kapi uzimajte 3 puta dnevno po 40 kapi, rastvorene u malo vode, posle obroka',
      'Za najbolji efekat koristite oba proizvoda redovno',
      'Operite ruke nakon upotrebe kreme'
    ],
    warnings: [
      'KREMA: namenjena isključivo za spoljašnju upotrebu; oprati ruke nakon upotrebe',
      'KREMA: izbegavati kontakt sa očima; u slučaju kontakta isprati sa dosta vode',
      'KREMA: sadrži prirodne alergene iz eteričnih ulja (Limonene, Eugenol, Linalool)',
      'KAPI: dodatak ishrani se ne može koristiti kao zamena za raznovrsnu i uravnoteženu ishranu',
      'KAPI: nije namenjen trudnicama, dojiljama i deci mlađoj od 18 godina',
      'KAPI: kontraindikovan kod osoba preosetljivih na sastojke i osoba sa teškim bubrežnim i srčanim oboljenjima',
      'KAPI: ne preporučuje se osobama sa gastričnim i duodenalnim ulkusom, ili sa oboljenjima žučnih puteva i žučne kesice',
      'KAPI: ne preporučuje se istovremena upotreba sa diureticima; proizvod sadrži alkohol',
      'Obratiti pažnju na preosetljivost na bilo koji sastojak',
      'Čuvati van domašaja dece'
    ],
    slug: 'bioroid-set',
    alternativeSlugs: [
      'set-bioroid-melem-kapi',
      'bioroid-komplet'
    ],
    availableCountries: [
      'rs'
    ],
    seoTitle: 'BIOROID SET — krema + kapi | DERMOTIN',
    seoDescription: 'BIOROID SET od DERMOTIN brenda — BIOROID krema za negu kože i sluzokože analne regije i BIOROID KAPI za podršku zdravlju venskog sistema i varenju. Kompletna rutina po povoljnijoj ceni.',
    urgencyElements: {},
    crossSells: [
      'immunis_kapi'
    ],
    published: false,
    isBundle: true,
    bundleItems: [
      {
        productId: 'bioroid',
        variantId: 'bioroid-1pak',
        quantity: 1
      },
      {
        productId: 'bioroid_kapi',
        variantId: 'bioroid-kapi-1pak',
        quantity: 1
      }
    ]
  }
};
