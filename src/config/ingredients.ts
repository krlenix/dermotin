import { Ingredient } from './types';

// Clean ingredients database - only confirmed ingredients from fungel.txt
export const INGREDIENTS: Record<string, Ingredient> = {
  // Herbal Extracts - 6 powerful medicinal plants
  'calendula-extract': {
    id: 'calendula-extract',
    inciName: 'Calendula Officinalis Flower Extract',
    serbianName: 'Ekstrakt cveta nevena',
    bulgarianName: 'Екстракт от цвят на невен',
    description: 'Smiruje iritiranu kožu, ublažava crvenilo i pomaže u brzoj obnovi oštećene kože',
    bulgarianDescription: 'Успокоява раздразнената кожа, облекчава червенината и помага за бързо възстановяване',
    category: 'herbal_extract'
  },
  'chelidonium-extract': {
    id: 'chelidonium-extract',
    inciName: 'Chelidonium Majus Extract',
    serbianName: 'Ekstrakt rusa',
    bulgarianName: 'Екстракт от змийско мляко',
    description: 'Efikasno čisti problematičnu kožu, pomaže kod upornih kožnih problema i podržava zdravlje kože',
    bulgarianDescription: 'Ефективно почиства проблемната кожа, помага при упорити кожни проблеми',
    category: 'herbal_extract'
  },
  'salvia-leaf-extract': {
    id: 'salvia-leaf-extract',
    inciName: 'Salvia Officinalis Leaf Extract',
    serbianName: 'Ekstrakt lista žalfije',
    bulgarianName: 'Екстракт от листа на градинска салвия',
    description: 'Prirodno čisti i dezinfikuje kožu, regulira masnoću i steže pore za zdraviji izgled kože',
    bulgarianDescription: 'Природно почиства и дезинфектира кожата, регулира мазнината и стяга порите',
    category: 'herbal_extract'
  },
  'echinacea-extract': {
    id: 'echinacea-extract',
    inciName: 'Echinacea Purpurea Extract',
    serbianName: 'Ekstrakt ehinaceje',
    bulgarianName: 'Екстракт от ехинацея',
    description: 'Jača prirodnu otpornost kože i pomaže u odbrani od štetnih uticaja iz okoline',
    bulgarianDescription: 'Укрепва природната устойчивост на кожата и помага в отбраната от вредни въздействия',
    category: 'herbal_extract'
  },
  'galium-extract': {
    id: 'galium-extract',
    inciName: 'Galium Verum Extract',
    serbianName: 'Ekstrakt podmarenka',
    bulgarianName: 'Екстракт от жълт звездан',
    description: 'Tradicionalni biljni lek koji nežno čisti i smiruje problematičnu kožu',
    bulgarianDescription: 'Традиционно билково лекарство което нежно почиства и успокоява проблемната кожа',
    category: 'herbal_extract'
  },
  'hypericum-extract': {
    id: 'hypericum-extract',
    inciName: 'Hypericum Perforatum Extract',
    serbianName: 'Ekstrakt kantariona',
    bulgarianName: 'Екстракт от жълт кантарион',
    description: 'Ubrzava regeneraciju i obnovu oštećene kože, pomaže u zaceljenju',
    bulgarianDescription: 'Ускорява регенерацията и възстановяването на увредената кожа, помага в зацеляването',
    category: 'herbal_extract'
  },

  // Essential Oils (5 confirmed oils)
  'tea-tree-oil': {
    id: 'tea-tree-oil',
    inciName: 'Melaleuca Alternifolia Leaf Oil',
    serbianName: 'Ulje čajnog drveta',
    bulgarianName: 'Масло от чаено дърво',
    description: 'Najpoznatije prirodno sredstvo protiv gljivica i bakterija, efikasno čisti i dezinfikuje kožu',
    bulgarianDescription: 'Най-познатото природно средство против гъбички и бактерии, ефективно почиства и дезинфектира',
    category: 'essential_oil'
  },
  'oregano-oil': {
    id: 'oregano-oil',
    inciName: 'Origanum Vulgare Oil',
    serbianName: 'Ulje origana',
    bulgarianName: 'Масло от риган',
    description: 'Moćno prirodno sredstvo koje štiti kožu od štetnih mikroorganizama i infekcija',
    bulgarianDescription: 'Мощно природно средство което защитава кожата от вредни микроорганизми',
    category: 'essential_oil'
  },
  'lavender-oil': {
    id: 'lavender-oil',
    inciName: 'Lavandula Hybrida Oil',
    serbianName: 'Ulje lavande',
    bulgarianName: 'Масло от лавандула',
    description: 'Smirujuće dejstvo na kožu, pomaže u relaksaciji i ima blag antiseptički efekat',
    bulgarianDescription: 'Концентрация 0.08% - Успокояващо действие върху кожата, релаксация, антисептичен ефект. Съдържа линалоол и лимонен',
    category: 'essential_oil'
  },
  'sage-oil': {
    id: 'sage-oil',
    inciName: 'Salvia Officinalis Oil',
    serbianName: 'Eterično ulje žalfije',
    bulgarianName: 'Етерично масло от салвия',
    description: 'Prirodno čisti i dezinfikuje kožu, regulira masnoću i steže pore za zdraviji izgled kože',
    bulgarianDescription: 'Концентрация 0.08% - Антимикробни свойства, регулиране на мазнината на кожата, стягащо действие. Съдържа туяон',
    category: 'essential_oil'
  },
  'eucalyptus-oil': {
    id: 'eucalyptus-oil',
    inciName: 'Eucalyptus Globulus Leaf Oil',
    serbianName: 'Ulje eukaliptusa',
    bulgarianName: 'Масло от евкалипт',
    description: 'Osvežavajuće dejstvo, antimikrobna svojstva i pomaže u čišćenju kože',
    bulgarianDescription: 'Концентрация 0.08% - Освежаващо действие, антимикробни свойства, почистване на кожата. Изключително висока безопасност',
    category: 'essential_oil'
  },

  // Active Compounds (5 confirmed actives)
  'panthenol': {
    id: 'panthenol',
    inciName: 'Panthenol',
    serbianName: 'Panthenol (Pro-vitamin B5)',
    bulgarianName: 'Пантенол (Про-витамин B5)',
    description: 'Duboko hidrira kožu, podstiče regeneraciju ćelija kože i smiruje iritacije',
    bulgarianDescription: 'Концентрация 0.94% - Дълбоко хидратира кожата, стимулира регенерацията на клетките и успокоява иритациите',
    category: 'active_compound'
  },
  'urea': {
    id: 'urea',
    inciName: 'Urea',
    serbianName: 'Urea',
    bulgarianName: 'Урея',
    description: 'Prirodni hidratantni faktor, pomaže u zadržavanju vlage u koži i omekšava rožnati sloj',
    bulgarianDescription: 'Концентрация 0.94% - Природен хидратиращ фактор, задържане на влагата в кожата, омекотяване на рожестия слой',
    category: 'active_compound'
  },
  'sweet-almond-oil': {
    id: 'sweet-almond-oil',
    inciName: 'Prunus Amygdalus Dulcis Oil',
    serbianName: 'Ulje slatkog badema',
    bulgarianName: 'Масло от сладък бадем',
    description: 'Bogato vitaminima A i E, duboko hidrira i hrani kožu, pogodan za osetljivu kožu',
    bulgarianDescription: 'Концентрация 0.94% - Богато на витамини A и E, дълбоко хидратира и храни кожата, подходящо за чувствителна кожа',
    category: 'active_compound'
  },
  'vitamin-e': {
    id: 'vitamin-e',
    inciName: 'Tocopheryl Acetate',
    serbianName: 'Vitamin E',
    bulgarianName: 'Витамин E',
    description: 'Snažan antioksidans, štiti kožu od slobodnih radikala i usporava proces starenja',
    bulgarianDescription: 'Концентрация 0.09% - Силен антиоксидант, защитава кожата от свободни радикали, забавя процеса на стареене',
    category: 'active_compound'
  },
  'vitamin-a': {
    id: 'vitamin-a',
    inciName: 'Retinyl Palmitate',
    serbianName: 'Vitamin A',
    bulgarianName: 'Витамин A',
    description: 'Podstiče obnovu ćelija kože, poboljšava teksturu kože i pomaže u regeneraciji',
    bulgarianDescription: 'Концентрация 0.09% - Стимулира обновяването на клетките на кожата, подобрява текстурата на кожата, помага в регенерацията',
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
  },

  // BIOMELIS-specific ingredients
  'achillea-extract': {
    id: 'achillea-extract',
    inciName: 'Achillea Millefolium Extract',
    serbianName: 'Ekstrakt hajdučke trave',
    bulgarianName: 'Екстракт от бял равнец',
    description: 'Tradicionalno se koristi za negu kože, pomaže u smirenju i obnovi osetljive kože',
    bulgarianDescription: 'Традиционно се използва за грижа за кожата, помага за успокояване и възстановяване на чувствителната кожа',
    category: 'herbal_extract'
  },
  'equisetum-extract': {
    id: 'equisetum-extract',
    inciName: 'Equisetum Arvense Extract',
    serbianName: 'Ekstrakt preslice',
    bulgarianName: 'Екстракт от полска хвощ',
    description: 'Bogat prirodnim silikatima, pomaže u jačanju i obnovi kože',
    bulgarianDescription: 'Богат на природни силикати, помага за укрепване и възстановяване на кожата',
    category: 'herbal_extract'
  },
  'quercus-extract': {
    id: 'quercus-extract',
    inciName: 'Quercus Robur Extract',
    serbianName: 'Ekstrakt hrasta',
    bulgarianName: 'Екстракт от дъб',
    description: 'Sadrži prirodne tanine, tradicionalno se koristi za stezanje i zaštitu kože',
    bulgarianDescription: 'Съдържа природни танини, традиционно се използва за стягане и защита на кожата',
    category: 'herbal_extract'
  },
  'quercus-bark-extract': {
    id: 'quercus-bark-extract',
    inciName: 'Quercus Robur Bark Extract',
    serbianName: 'Ekstrakt hrastove kore',
    bulgarianName: 'Екстракт от кора на дъб',
    description: 'Bogat prirodnim taninima (8-20%), deluje adstringentno i smanjuje iritacije kože',
    bulgarianDescription: 'Богат на природни танини (8-20%), действа стягащо и намалява раздразненията на кожата',
    category: 'herbal_extract'
  },
  'rosemary-oil': {
    id: 'rosemary-oil',
    inciName: 'Rosmarinus Officinalis Oil',
    serbianName: 'Ulje ruzmarina',
    bulgarianName: 'Масло от розмарин',
    description: 'Stimuliše cirkulaciju i ima antioksidativna svojstva, osvežava kožu',
    bulgarianDescription: 'Стимулира циркулацията и има антиоксидантни свойства, освежава кожата',
    category: 'essential_oil'
  },
  'thyme-oil': {
    id: 'thyme-oil',
    inciName: 'Thymus Vulgaris Oil',
    serbianName: 'Ulje majčine dušice',
    bulgarianName: 'Масло от мащерка',
    description: 'Tradicionalno antimikrobno eterično ulje, pomaže u čišćenju i zaštiti kože',
    bulgarianDescription: 'Традиционно антимикробно етерично масло, помага за почистване и защита на кожата',
    category: 'essential_oil'
  },

  // BIOWART-specific ingredients
  'peppermint-oil': {
    id: 'peppermint-oil',
    inciName: 'Mentha Piperita Oil',
    serbianName: 'Eterično ulje nane',
    bulgarianName: 'Етерично масло от мента',
    description: 'Umiruje i osvežava kožu, pruža hlađenje i smirujući efekat',
    bulgarianDescription: 'Успокоява и освежава кожата, осигурява охлаждащ и успокояващ ефект',
    category: 'essential_oil'
  },
  'clove-oil': {
    id: 'clove-oil',
    inciName: 'Eugenia Caryophyllus Leaf Oil',
    serbianName: 'Eterično ulje karanfilića',
    bulgarianName: 'Етерично масло от карамфил',
    description: 'Pomaže u eliminaciji virusa na koži, ima antiseptičko dejstvo',
    bulgarianDescription: 'Помага за елиминиране на вируси на кожата, има антисептично действие',
    category: 'essential_oil'
  },
  'anise-oil': {
    id: 'anise-oil',
    inciName: 'Pimpinella Anisum Seed Oil',
    serbianName: 'Eterično ulje anisa',
    bulgarianName: 'Етерично масло от анасон',
    description: 'Deluje protivupalno i osvežava kožu, ima umirujuće svojstva',
    bulgarianDescription: 'Действа противовъзпалително и освежава кожата, има успокояващи свойства',
    category: 'essential_oil'
  },
  'lemon-oil': {
    id: 'lemon-oil',
    inciName: 'Citrus Limon Peel Oil',
    serbianName: 'Eterično ulje limuna',
    bulgarianName: 'Етерично масло от лимон',
    description: 'Osvežava i čisti kožu, ima prirodna antiseptička svojstva',
    bulgarianDescription: 'Освежава и почиства кожата, има естествени антисептични свойства',
    category: 'essential_oil'
  },

  // BIOROID-specific ingredients
  'aesculus-extract': {
    id: 'aesculus-extract',
    inciName: 'Aesculus Hippocastanum Seed Extract',
    serbianName: 'Ekstrakt divljeg kestena',
    bulgarianName: 'Екстракт от див кестен',
    description: 'Poznato po jačajućem i tonizujućem efektu, tradicionalno se koristi za negu osetljive kože',
    bulgarianDescription: 'Известен със своя укрепващ и тонизиращ ефект, традиционно се използва за грижа за чувствителна кожа',
    category: 'herbal_extract'
  },
  'capsella-extract': {
    id: 'capsella-extract',
    inciName: 'Capsella Bursa-Pastoris Extract',
    serbianName: 'Ekstrakt pastirske torbice',
    bulgarianName: 'Екстракт от овчарска торбичка',
    description: 'Doprinosi održavanju komfora kože, tradicionalno se koristi u nezi osetljive kože',
    bulgarianDescription: 'Допринася за поддържане на комфорта на кожата, традиционно се използва в грижата за чувствителна кожа',
    category: 'herbal_extract'
  },
  'geranium-extract': {
    id: 'geranium-extract',
    inciName: 'Geranium Robertianum Extract',
    serbianName: 'Ekstrakt zdravca',
    bulgarianName: 'Екстракт от здравец',
    description: 'Osvežavajući i umirujući efekat na kožu, tradicionalno se koristi za negu problematične kože',
    bulgarianDescription: 'Освежаващ и успокояващ ефект върху кожата, традиционно се използва за грижа за проблемна кожа',
    category: 'herbal_extract'
  },
  'chamomile-extract': {
    id: 'chamomile-extract',
    inciName: 'Chamomilla Recutita Flower Extract',
    serbianName: 'Ekstrakt kamilice',
    bulgarianName: 'Екстракт от лайка',
    description: 'Nežno umirujuće dejstvo, pogodan za nežnu kožu, tradicionalno se koristi za smirenje iritacija',
    bulgarianDescription: 'Нежно успокояващо действие, подходящ за нежна кожа, традиционно се използва за успокояване на раздразнения',
    category: 'herbal_extract'
  },
  'menthol': {
    id: 'menthol',
    inciName: 'Menthol',
    serbianName: 'Mentol',
    bulgarianName: 'Ментол',
    description: 'Pruža hlađenje i osvežavajući osećaj, smiruje kožu i daje prijatnu svežinu',
    bulgarianDescription: 'Осигурява охлаждане и освежаващо усещане, успокоява кожата и дава приятна свежест',
    category: 'active_compound'
  },
  'patchouli-oil': {
    id: 'patchouli-oil',
    inciName: 'Pogostemon Cablin Leaf Oil',
    serbianName: 'Eterično ulje pačulija',
    bulgarianName: 'Етерично масло от пачули',
    description: 'Aromatično ulje tradicionalno korišćeno u nezi kože, ima umirujuće svojstva',
    bulgarianDescription: 'Ароматично масло традиционно използвано в грижата за кожата, има успокояващи свойства',
    category: 'essential_oil'
  },
  'limonene': {
    id: 'limonene',
    inciName: 'Limonene',
    serbianName: 'Limonen',
    bulgarianName: 'Лимонен',
    description: 'Prirodna komponenta eteričnih ulja, daje prijatan miris i ima blago antiseptičko dejstvo',
    bulgarianDescription: 'Естествена съставка на етеричните масла, придава приятен аромат и има слабо антисептично действие',
    category: 'other'
  }
};
