export interface FAQItem {
  question: string;
  answer: string;
  category: 'delivery' | 'product' | 'payment' | 'returns' | 'general';
}

export interface CountryFAQ {
  [countryCode: string]: FAQItem[];
}

export const FAQ_DATA: CountryFAQ = {
  rs: [
    {
      question: "Koliko traje dostava?",
      answer: "Dostava traje 1-3 radna dana za teritoriju Srbije. Kurirske službe rade radnim danima od 8h do 17h.",
      category: "delivery"
    },
    {
      question: "Koliko košta dostava?",
      answer: "Dostava za pakovanje do 2kg košta 280 dinara. Besplatna dostava za porudžbine preko 3000 dinara.",
      category: "delivery"
    },
    {
      question: "Da li mogu da platim pouzećem?",
      answer: "Da, podržavamo plaćanje pouzećem (cash on delivery). Platite kada vam kurir dostavi paket.",
      category: "payment"
    },
    {
      question: "Da li je proizvod bezbedan za upotrebu?",
      answer: "Da, FUNGEL je klinički testiran i sadrži prirodne sastojke. Proizvod je registrovan i odobren za upotrebu.",
      category: "product"
    },
    {
      question: "Koliko dugo treba da koristim proizvod?",
      answer: "Preporučuje se korišćenje 2-4 nedelje za najbolje rezultate. Prvi rezultati se mogu videti već nakon 3-5 dana.",
      category: "product"
    },
    {
      question: "Mogu li da vratim proizvod ako nisam zadovoljan?",
      answer: "Da, nudimo 30 dana garancije povraćaja novca. Kontaktirajte nas na telefon ili email za povraćaj.",
      category: "returns"
    },
    {
      question: "Da li je potreban recept lekara?",
      answer: "Ne, FUNGEL je dostupan bez recepta. To je kozmetički proizvod za negu kože.",
      category: "product"
    },
    {
      question: "Kako da pratim moju porudžbinu?",
      answer: "Nakon slanja proizvoda, dobićete SMS sa brojem za praćenje pošiljke kod kurirske službe.",
      category: "delivery"
    }
  ],
  ba: [
    {
      question: "Koliko traje dostava?",
      answer: "Dostava traje 2-4 radna dana za teritoriju BiH. Kurirske službe rade radnim danima od 8h do 17h.",
      category: "delivery"
    },
    {
      question: "Koliko košta dostava?",
      answer: "Dostava košta 5 KM. Besplatna dostava za porudžbine preko 50 KM.",
      category: "delivery"
    },
    {
      question: "Da li mogu da platim pouzećem?",
      answer: "Da, podržavamo plaćanje pouzećem. Platite kada vam kurir dostavi paket.",
      category: "payment"
    },
    {
      question: "Da li je proizvod bezbedan za upotrebu?",
      answer: "Da, FUNGEL je klinički testiran i sadrži prirodne sastojke. Proizvod je registrovan i odobren za upotrebu.",
      category: "product"
    },
    {
      question: "Mogu li da vratim proizvod ako nisam zadovoljan?",
      answer: "Da, nudimo 30 dana garancije povraćaja novca. Kontaktirajte nas za povraćaj.",
      category: "returns"
    }
  ],
  me: [
    {
      question: "Koliko traje dostava?",
      answer: "Dostava traje 1-3 radna dana za teritoriju Crne Gore. Kurirske službe rade radnim danima od 8h do 17h.",
      category: "delivery"
    },
    {
      question: "Koliko košta dostava?",
      answer: "Dostava košta 3€. Besplatna dostava za porudžbine preko 30€.",
      category: "delivery"
    },
    {
      question: "Da li mogu da platim pouzećem?",
      answer: "Da, podržavamo plaćanje pouzećem. Platite kada vam kurir dostavi paket.",
      category: "payment"
    },
    {
      question: "Da li je proizvod bezbedan za upotrebu?",
      answer: "Da, FUNGEL je klinički testiran i sadrži prirodne sastojke. Proizvod je registrovan i odobren za upotrebu.",
      category: "product"
    },
    {
      question: "Mogu li da vratim proizvod ako nisam zadovoljan?",
      answer: "Da, nudimo 30 dana garancije povraćaja novca. Kontaktirajte nas za povraćaj.",
      category: "returns"
    }
  ],
  eu: [
    {
      question: "How long does delivery take?",
      answer: "Delivery takes 3-7 business days within EU. Courier services operate on weekdays from 8am to 5pm.",
      category: "delivery"
    },
    {
      question: "How much does shipping cost?",
      answer: "Shipping costs €5. Free shipping for orders over €50.",
      category: "delivery"
    },
    {
      question: "Can I pay cash on delivery?",
      answer: "Yes, we support cash on delivery in most EU countries. Pay when the courier delivers your package.",
      category: "payment"
    },
    {
      question: "Is the product safe to use?",
      answer: "Yes, FUNGEL is clinically tested and contains natural ingredients. The product is registered and approved for use.",
      category: "product"
    },
    {
      question: "Can I return the product if I'm not satisfied?",
      answer: "Yes, we offer a 30-day money-back guarantee. Contact us for returns according to EU consumer rights.",
      category: "returns"
    },
    {
      question: "GDPR and data protection?",
      answer: "We fully comply with GDPR regulations. Your personal data is protected and used only for order processing.",
      category: "general"
    }
  ]
};

export function getFAQForCountry(countryCode: string): FAQItem[] {
  return FAQ_DATA[countryCode] || FAQ_DATA['rs'];
}

export function getFAQByCategory(countryCode: string, category: string): FAQItem[] {
  return getFAQForCountry(countryCode).filter(item => item.category === category);
}
