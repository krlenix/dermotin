import { Ingredient } from './types';

// Baza sastojaka — INCI podaci verifikovani protiv CPSR izveštaja i stručnih
// mišljenja u docs/newdocs/ (interna dokumentacija: docs/products/*.md)
export const INGREDIENTS: Record<string, Ingredient> = {
  // Herbal Extracts - 6 powerful medicinal plants
  'calendula-extract': {
    id: 'calendula-extract',
    inciName: 'Calendula Officinalis Flower Extract',
    serbianName: 'Ekstrakt cveta nevena',
    bulgarianName: 'Екстракт от цвят на невен',
    description: 'Klasik u nezi kože - umiruje kožu i doprinosi negovanom i zdravom izgledu',
    bulgarianDescription: 'Класика в грижата за кожата - успокоява кожата и допринася за поддържан вид',
    category: 'herbal_extract'
  },
  'chelidonium-extract': {
    id: 'chelidonium-extract',
    inciName: 'Chelidonium Majus Extract',
    serbianName: 'Ekstrakt rusa',
    bulgarianName: 'Екстракт от змийско мляко',
    description: 'Biljka sa dugom tradicijom u nezi problematične kože, posebno kože sklone pojavi bradavica',
    bulgarianDescription: 'Растение с дълга традиция в грижата за проблемна кожа',
    category: 'herbal_extract'
  },
  'salvia-leaf-extract': {
    id: 'salvia-leaf-extract',
    inciName: 'Salvia Officinalis Leaf Extract',
    serbianName: 'Ekstrakt lista žalfije',
    bulgarianName: 'Екстракт от листа на градинска салвия',
    description: 'Tradicionalno cenjena biljka koja doprinosi osećaju čistoće i svežine kože',
    bulgarianDescription: 'Традиционно ценено растение което допринася за усещане на чистота и свежест на кожата',
    category: 'herbal_extract'
  },
  'echinacea-extract': {
    id: 'echinacea-extract',
    inciName: 'Echinacea Purpurea Extract',
    serbianName: 'Ekstrakt ehinaceje',
    bulgarianName: 'Екстракт от ехинацея',
    description: 'Tradicionalno cenjena biljka u nezi kože izložene spoljašnjim uticajima',
    bulgarianDescription: 'Традиционно ценено растение в грижата за кожа изложена на външни влияния',
    category: 'herbal_extract'
  },
  'galium-extract': {
    id: 'galium-extract',
    inciName: 'Galium Verum Extract',
    serbianName: 'Ekstrakt ivanjskog cveća (podmarenka)',
    bulgarianName: 'Екстракт от жълт звездан',
    description: 'Tradicionalno cenjena biljka u kozmetičkoj nezi kože',
    bulgarianDescription: 'Традиционно ценено растение което нежно се грижи и успокоява кожата',
    category: 'herbal_extract'
  },
  'hypericum-extract': {
    id: 'hypericum-extract',
    inciName: 'Hypericum Perforatum Extract',
    serbianName: 'Ekstrakt kantariona',
    bulgarianName: 'Екстракт от жълт кантарион',
    description: 'Tradicionalno omiljena biljka u nezi kože, doprinosi negovanom izgledu i osećaju komfora',
    bulgarianDescription: 'Традиционно любимо растение в грижата за кожата, допринася за поддържан вид',
    category: 'herbal_extract'
  },

  // Essential Oils (5 confirmed oils)
  'tea-tree-oil': {
    id: 'tea-tree-oil',
    inciName: 'Melaleuca Alternifolia Leaf Oil',
    serbianName: 'Ulje čajnog drveta',
    bulgarianName: 'Масло от чаено дърво',
    description: 'Jedno od najpoznatijih eteričnih ulja u nezi problematične kože, sa vekovnom tradicijom upotrebe',
    bulgarianDescription: 'Едно от най-познатите етерични масла в грижата за проблемна кожа',
    category: 'essential_oil'
  },
  'oregano-oil': {
    id: 'oregano-oil',
    inciName: 'Origanum Vulgare Oil',
    serbianName: 'Ulje origana',
    bulgarianName: 'Масло от риган',
    description: 'Aromatično eterično ulje tradicionalno cenjeno u nezi kože sklone promenama',
    bulgarianDescription: 'Ароматично етерично масло традиционно ценено в грижата за кожата',
    category: 'essential_oil'
  },
  'lavender-oil': {
    id: 'lavender-oil',
    inciName: 'Lavandula Hybrida Oil',
    serbianName: 'Ulje lavandina (hibridna lavanda)',
    bulgarianName: 'Масло от лавандула',
    description: 'Umirujuće eterično ulje prijatnog mirisa koje doprinosi osećaju opuštenosti i nege',
    bulgarianDescription: 'Успокояващо етерично масло с приятен аромат',
    category: 'essential_oil'
  },
  'sage-oil': {
    id: 'sage-oil',
    inciName: 'Salvia Officinalis Oil',
    serbianName: 'Eterično ulje žalfije',
    bulgarianName: 'Етерично масло от салвия',
    description: 'Aromatično eterično ulje koje doprinosi osećaju čistoće i svežine kože',
    bulgarianDescription: 'Ароматично етерично масло което допринася за усещане на чистота и свежест',
    category: 'essential_oil'
  },
  'eucalyptus-oil': {
    id: 'eucalyptus-oil',
    inciName: 'Eucalyptus Globulus Leaf Oil',
    serbianName: 'Ulje eukaliptusa',
    bulgarianName: 'Масло от евкалипт',
    description: 'Osvežavajuće eterično ulje koje koži daje osećaj čistoće i svežine',
    bulgarianDescription: 'Освежаващо етерично масло което дава на кожата усещане за чистота и свежест',
    category: 'essential_oil'
  },

  // Active Compounds (5 confirmed actives)
  'panthenol': {
    id: 'panthenol',
    inciName: 'Panthenol',
    serbianName: 'Panthenol (Pro-vitamin B5)',
    bulgarianName: 'Пантенол (Про-витамин B5)',
    description: 'Pro-vitamin B5 - hidrira kožu, umiruje je i doprinosi mekom, negovanom osećaju',
    bulgarianDescription: 'Про-витамин B5 - хидратира кожата, успокоява я и допринася за мек, поддържан вид',
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
    description: 'Antioksidans i sastojak za negu koji doprinosi stabilnosti formule i negovanom izgledu kože',
    bulgarianDescription: 'Антиоксидант и съставка за грижа, която допринася за стабилността на формулата и поддържания вид на кожата',
    category: 'active_compound'
  },
  'tocopherol': {
    id: 'tocopherol',
    inciName: 'Tocopherol',
    serbianName: 'Vitamin E (prirodni tokoferol)',
    bulgarianName: 'Витамин E (натурален токоферол)',
    description: 'Prirodni oblik vitamina E — antioksidans koji doprinosi zaštiti formule i negovanom izgledu kože',
    bulgarianDescription: 'Натурална форма на витамин E — антиоксидант, който допринася за защитата на формулата и поддържания вид на кожата',
    category: 'active_compound'
  },
  'vitamin-a': {
    id: 'vitamin-a',
    inciName: 'Retinyl Palmitate',
    serbianName: 'Vitamin A',
    bulgarianName: 'Витамин A',
    description: 'Poznati kozmetički sastojak koji doprinosi glatkom izgledu i lepšoj teksturi kože',
    bulgarianDescription: 'Познат козметичен съставка който допринася за гладък вид и по-добра текстура на кожата',
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
    serbianName: 'Ekstrakt rastavića (preslice)',
    bulgarianName: 'Екстракт от полска хвощ',
    description: 'Biljni ekstrakt koji je deo BIOMELIS formule za svakodnevnu negu kože',
    bulgarianDescription: 'Растителен екстракт, който е част от формулата BIOMELIS за ежедневна грижа за кожата',
    category: 'herbal_extract'
  },
  'quercus-bark-extract': {
    id: 'quercus-bark-extract',
    inciName: 'Quercus Robur Bark Extract',
    serbianName: 'Ekstrakt hrastove kore',
    bulgarianName: 'Екстракт от кора на дъб',
    description: 'Bogat prirodnim taninima, tradicionalno cenjen zbog adstringentnog (stežućeg) osećaja na koži',
    bulgarianDescription: 'Богат на природни танини, традиционно ценен заради стягащото усещане върху кожата',
    category: 'herbal_extract'
  },
  'rosemary-oil': {
    id: 'rosemary-oil',
    inciName: 'Rosmarinus Officinalis Leaf Oil',
    serbianName: 'Ulje ruzmarina',
    bulgarianName: 'Масло от розмарин',
    description: 'Aromatično eterično ulje koje osvežava kožu i daje joj negovan izgled',
    bulgarianDescription: 'Ароматично етерично масло което освежава кожата',
    category: 'essential_oil'
  },
  'thyme-oil': {
    id: 'thyme-oil',
    inciName: 'Thymus Vulgaris Flower/Leaf Oil',
    serbianName: 'Ulje timijana',
    bulgarianName: 'Масло от мащерка',
    description: 'Tradicionalno cenjeno eterično ulje u nezi problematične kože',
    bulgarianDescription: 'Традиционно ценено етерично масло в грижата за проблемна кожа',
    category: 'essential_oil'
  },

  // BIOWART-specific ingredients
  'peppermint-oil': {
    id: 'peppermint-oil',
    inciName: 'Mentha Piperita Oil',
    serbianName: 'Eterično ulje nane',
    bulgarianName: 'Етерично масло от мента',
    description: 'Umiruje i osvežava kožu, pruža osećaj prijatne svežine',
    bulgarianDescription: 'Успокоява и освежава кожата, осигурява усещане за приятна свежест',
    category: 'essential_oil'
  },
  'clove-oil': {
    id: 'clove-oil',
    inciName: 'Eugenia Caryophyllus Leaf Oil',
    serbianName: 'Eterično ulje karanfilića (list)',
    bulgarianName: 'Етерично масло от карамфил',
    description: 'Toplo, aromatično eterično ulje sa dugom tradicijom u nezi kože',
    bulgarianDescription: 'Топло, ароматично етерично масло с дълга традиция в грижата за кожата',
    category: 'essential_oil'
  },
  'clove-bud-oil': {
    id: 'clove-bud-oil',
    inciName: 'Eugenia Caryophyllus Bud Oil',
    serbianName: 'Eterično ulje karanfilića (pupoljak)',
    bulgarianName: 'Етерично масло от карамфилови пъпки',
    description: 'Toplo, aromatično eterično ulje sa dugom tradicijom u nezi kože',
    bulgarianDescription: 'Топло, ароматично етерично масло с дълга традиция в грижата за кожата',
    category: 'essential_oil'
  },
  'anise-oil': {
    id: 'anise-oil',
    inciName: 'Illicium Verum Leaf Oil',
    serbianName: 'Eterično ulje zvezdastog anisa',
    bulgarianName: 'Етерично масло от звезден анасон',
    description: 'Aromatično eterično ulje koje osvežava kožu i doprinosi osećaju komfora',
    bulgarianDescription: 'Ароматично етерично масло което освежава кожата',
    category: 'essential_oil'
  },
  'lemon-oil': {
    id: 'lemon-oil',
    inciName: 'Citrus Limon Peel Oil',
    serbianName: 'Eterično ulje limuna',
    bulgarianName: 'Етерично масло от лимон',
    description: 'Osvežavajuće citrusno ulje koje koži daje osećaj čistoće i svežine',
    bulgarianDescription: 'Освежаващо цитрусово масло което дава на кожата усещане за чистота',
    category: 'essential_oil'
  },

  // BIOROID-specific ingredients
  'aesculus-extract': {
    id: 'aesculus-extract',
    inciName: 'Aesculus Hippocastanum Seed Extract',
    serbianName: 'Ekstrakt semena divljeg kestena',
    bulgarianName: 'Екстракт от див кестен',
    description: 'Tradicionalno cenjen biljni ekstrakt u nezi osetljive kože',
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
  'sodium-gluconate': {
    id: 'sodium-gluconate',
    inciName: 'Sodium Gluconate',
    serbianName: 'Natrijum glukonat',
    bulgarianName: 'Натриев глюконат',
    description: 'Stabilizator prirodnog porekla koji doprinosi stabilnosti i kvalitetu formule',
    bulgarianDescription: 'Стабилизатор от естествен произход, който допринася за стабилността и качеството на формулата',
    category: 'other'
  },

  // BIOMELIS KAPI-specific ingredients
  'milk-thistle-extract': {
    id: 'milk-thistle-extract',
    inciName: 'Silybum Marianum Fruit Extract',
    serbianName: 'Vodeno-etanolni ekstrakt ploda badelja (sikavice)',
    bulgarianName: 'Екстракт от плод на бодлив магарешки трън',
    description: 'Zahvaljujući sadržaju silimarina, badelj ispoljava regenerativno delovanje na hepatocite, deluje kao hepatoprotektiv i doprinosi zdravlju jetre',
    bulgarianDescription: 'Благодарение на съдържанието на силимарин, бодливият магарешки трън проявява регенеративно действие върху хепатоцитите, действа като хепатопротектив',
    category: 'herbal_extract'
  },
  'nettle-leaf-extract': {
    id: 'nettle-leaf-extract',
    inciName: 'Urtica Dioica Leaf Extract',
    serbianName: 'Vodeno-etanolni ekstrakt lista koprive',
    bulgarianName: 'Екстракт от листа на коприва',
    // Neutralan opis — imuno tvrdnja je odobrena samo za IMMUNIS KAPI i tamo se
    // postavlja kroz product.ingredientDescriptions override
    description: 'Kopriva — tradicionalno cenjena biljka sa dugom istorijom upotrebe u biljnim preparatima',
    bulgarianDescription: 'Коприва — традиционно ценено растение с дълга история на употреба в билкови препарати',
    category: 'herbal_extract'
  },
  'dandelion-root-extract': {
    id: 'dandelion-root-extract',
    inciName: 'Taraxacum Officinale Root Extract',
    serbianName: 'Vodeno-etanolni ekstrakt korena maslačka',
    bulgarianName: 'Екстракт от корен на глухарче',
    description: 'Maslačak doprinosi normalnoj funkciji želuca i jetre i normalnom funkcionisanju digestivnog trakta',
    bulgarianDescription: 'Глухарчето допринася за нормалната функция на стомаха и черния дроб',
    category: 'herbal_extract'
  },
  'burdock-root-extract': {
    id: 'burdock-root-extract',
    inciName: 'Arctium Lappa Root Extract',
    serbianName: 'Vodeno-etanolni ekstrakt korena čička',
    bulgarianName: 'Екстракт от корен на репей',
    description: 'Čičak poboljšava varenje i podstiče metabolizam masti i glukoze',
    bulgarianDescription: 'Репеят подобрява храносмилането и стимулира метаболизма на мазнините и глюкозата',
    category: 'herbal_extract'
  },
  'horsetail-herb-extract': {
    id: 'horsetail-herb-extract',
    inciName: 'Equisetum Arvense Extract',
    serbianName: 'Vodeno-etanolni ekstrakt herbe rastavića',
    bulgarianName: 'Екстракт от билка полски хвощ',
    description: 'Rastavić ima zaštitni efekat na hepatocite',
    bulgarianDescription: 'Полският хвощ има защитен ефект върху хепатоцитите',
    category: 'herbal_extract'
  },
  'woodruff-herb-extract': {
    id: 'woodruff-herb-extract',
    inciName: 'Asperula Odorata Herb Extract',
    serbianName: 'Vodeno-etanolni ekstrakt herbe lazarkinje',
    bulgarianName: 'Екстракт от билка еньовче',
    description: 'Lazarkinja povoljno utiče na proces varenja',
    bulgarianDescription: 'Еньовчето благоприятно влияе на процеса на храносмилане',
    category: 'herbal_extract'
  },
  'ethanol': {
    id: 'ethanol',
    inciName: 'Ethanol',
    serbianName: 'Etanol',
    bulgarianName: 'Етанол',
    description: 'Prirodni konzervans i ekstraktni rastvarač, omogućava ekstrakciju aktivnih komponenti iz biljaka',
    bulgarianDescription: 'Естествен консервант и екстрактен разтворител, позволява екстракция на активни компоненти от лечебни растения',
    category: 'base_component'
  },

  // BIOROID KAPI-specific ingredients
  'achillea-herb-extract': {
    id: 'achillea-herb-extract',
    inciName: 'Achillea Millefolium Extract',
    serbianName: 'Vodeno-etanolni ekstrakt herbe hajdučke trave',
    bulgarianName: 'Водно-етанолов екстракт от бял равнец',
    description: 'Hajdučka trava podržava normalan vaskularni tonus, zdravlje venskog sistema i digestivni komfor',
    bulgarianDescription: 'Белият равнец подпомага нормалния съдов тонус, здравето на венозната система и храносмилателния комфорт',
    category: 'herbal_extract'
  },
  'arctium-root-extract': {
    id: 'arctium-root-extract',
    inciName: 'Arctium Lappa Root Extract',
    serbianName: 'Vodeno-etanolni ekstrakt korena čička',
    bulgarianName: 'Екстракт от корен на репей',
    description: 'Čičak pomaže varenje i doprinosi osećaju digestivnog komfora',
    bulgarianDescription: 'Репеят помага на храносмилането и допринася за усещане на храносмилателен комфорт',
    category: 'herbal_extract'
  },
  'calendula-flower-oral-extract': {
    id: 'calendula-flower-oral-extract',
    inciName: 'Calendula Officinalis Flower Extract',
    serbianName: 'Vodeno-etanolni ekstrakt cveta nevena',
    bulgarianName: 'Водно-етанолов екстракт от цвят на невен',
    description: 'Neven podstiče procese isceljivanja tkiva i osnaživanja tela',
    bulgarianDescription: 'Невенът подпомага процесите на възстановяване на тъканите и укрепване на тялото',
    category: 'herbal_extract'
  },
  'quercus-bark-oral-extract': {
    id: 'quercus-bark-oral-extract',
    inciName: 'Quercus Robur Bark Extract',
    serbianName: 'Vodeno-etanolni ekstrakt kore hrasta',
    bulgarianName: 'Водно-етанолов екстракт от дъбова кора',
    description: 'Hrast doprinosi intestinalnoj pokretljivosti, mikroflori i digestivnom komforu',
    bulgarianDescription: 'Дъбът допринася за чревната моторика, микрофлората и храносмилателния комфорт',
    category: 'herbal_extract'
  },
  'juniper-fruit-extract': {
    id: 'juniper-fruit-extract',
    inciName: 'Juniperus Communis Fruit Extract',
    serbianName: 'Vodeno-etanolni ekstrakt ploda kleke',
    bulgarianName: 'Екстракт от плод на хвойна',
    description: 'Kleka doprinosi odbrambenim sposobnostima organizma protiv spoljnih agenasa',
    bulgarianDescription: 'Хвойната допринася за защитните способности на организма',
    category: 'herbal_extract'
  },

  // IMMUNIS KAPI-specific ingredients
  'echinacea-root-extract': {
    id: 'echinacea-root-extract',
    inciName: 'Echinacea Purpurea Root Extract',
    serbianName: 'Vodeno-etanolni ekstrakt korena purpurne ehinacee',
    bulgarianName: 'Екстракт от корен на ехинацея',
    description: 'Purpurna ehinacea doprinosi pravilnom funkcionisanju imunog sistema i prirodnoj odbrambenoj sposobnosti organizma',
    bulgarianDescription: 'Ехинацеята допринася за правилното функциониране на имунната система',
    category: 'herbal_extract'
  },
  'walnut-leaf-extract': {
    id: 'walnut-leaf-extract',
    inciName: 'Juglans Regia Leaf Extract',
    serbianName: 'Vodeno-etanolni ekstrakt lista oraha',
    bulgarianName: 'Екстракт от листа на орех',
    description: 'Tradicionalno cenjena biljka, deo pažljivo odabrane kombinacije ekstrakata',
    bulgarianDescription: 'Традиционно ценено растение, част от внимателно подбрана комбинация',
    category: 'herbal_extract'
  },
  'thyme-herb-extract': {
    id: 'thyme-herb-extract',
    inciName: 'Thymus Serpyllum Extract',
    serbianName: 'Vodeno-etanolni ekstrakt herbe majčine dušice',
    bulgarianName: 'Екстракт от билка дива мащерка',
    description: 'Majčina dušica doprinosi zdravlju organa za disanje',
    bulgarianDescription: 'Дивата мащерка допринася за здравето на дихателните органи',
    category: 'herbal_extract'
  },
  'olive-leaf-extract': {
    id: 'olive-leaf-extract',
    inciName: 'Olea Europaea Leaf Extract',
    serbianName: 'Vodeno-etanolni ekstrakt lista masline',
    bulgarianName: 'Екстракт от маслинови листа',
    description: 'Maslina doprinosi odbrani organizma od spoljašnjih agenasa i zdravlju gornjih disajnih puteva',
    bulgarianDescription: 'Маслината допринася за защитата на организма от външни агенти',
    category: 'herbal_extract'
  },
  'lavender-flower-extract': {
    id: 'lavender-flower-extract',
    inciName: 'Lavandula Angustifolia Flower Extract',
    serbianName: 'Vodeno-etanolni ekstrakt cveta lavande',
    bulgarianName: 'Екстракт от цвят на лавандула',
    description: 'Lavanda doprinosi relaksaciji i uspavljivanju',
    bulgarianDescription: 'Лавандулата допринася за релаксация и заспиване',
    category: 'herbal_extract'
  },

  // FUNGOMAX-specific ingredients
  'thymus-extract': {
    id: 'thymus-extract',
    inciName: 'Thymus Vulgaris Extract',
    serbianName: 'Ekstrakt timijana',
    bulgarianName: 'Екстракт от мащерка',
    description: 'Tradicionalno cenjena biljka u nezi kože i noktiju, glavni biljni sastojak FUNGOMAX formule',
    bulgarianDescription: 'Традиционно ценено растение в грижата за кожата и ноктите',
    category: 'herbal_extract'
  },
  'juglans-leaf-extract': {
    id: 'juglans-leaf-extract',
    inciName: 'Juglans Regia Leaf Extract',
    serbianName: 'Ekstrakt orahovog lista',
    bulgarianName: 'Екстракт от листа на орех',
    description: 'Tradicionalno cenjena biljka u nezi kože sklone promenama',
    bulgarianDescription: 'Традиционно ценено растение в грижата за кожата',
    category: 'herbal_extract'
  },
  'salvia-extract': {
    id: 'salvia-extract',
    inciName: 'Salvia Officinalis Leaf Extract',
    serbianName: 'Ekstrakt lista žalfije',
    bulgarianName: 'Екстракт от листа на градинска салвия',
    description: 'Tradicionalno cenjena biljka koja doprinosi osećaju čistoće i svežine kože',
    bulgarianDescription: 'Традиционно ценено растение което допринася за усещане на чистота и свежест',
    category: 'herbal_extract'
  },
  'allantoin': {
    id: 'allantoin',
    inciName: 'Allantoin',
    serbianName: 'Alantoin',
    bulgarianName: 'Алантоин',
    description: 'Poznat sastojak za negu kože koji doprinosi mekom i negovanom osećaju kože',
    bulgarianDescription: 'Познат съставка за грижа за кожата която допринася за мек и поддържан вид',
    category: 'active_compound'
  }
};
