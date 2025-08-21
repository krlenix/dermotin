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
      question: "Koje načine plaćanja prihvatate?",
      answer: "Prihvatamo plaćanje pouzećem (cash on delivery), kao i kartice putem sigurnog online plaćanja.",
      category: "payment"
    },
    {
      question: "Mogu li da vratim proizvod ako nisam zadovoljan?",
      answer: "Da, nudimo 30 dana garancije povraćaja novca. Kontaktirajte nas na telefon ili email za povraćaj.",
      category: "returns"
    },
    {
      question: "Kako mogu da kontaktiram vašu korisničku podršku?",
      answer: "Možete nas kontaktirati putem telefona ili email-a. Naš tim za podršku je dostupan radnim danima od 8h do 17h.",
      category: "general"
    },
    {
      question: "Kako da pratim moju porudžbinu?",
      answer: "Nakon slanja proizvoda, dobićete SMS sa brojem za praćenje pošiljke kod kurirske službe.",
      category: "delivery"
    },
    {
      question: "Da li su vaši proizvodi testirani i sigurni?",
      answer: "Da, svi naši proizvodi su dermatološki testirani, klinički odobreni i registrovani za upotrebu.",
      category: "general"
    },
    {
      question: "Da li nudite garanciju na vaše proizvode?",
      answer: "Da, nudimo 30 dana garancije zadovoljstva. Ako niste zadovoljni rezultatima, možete vratiti proizvod za punu refundaciju.",
      category: "returns"
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
      question: "Koje načine plaćanja prihvatate?",
      answer: "Prihvatamo plaćanje pouzećem (cash on delivery), kao i kartice putem sigurnog online plaćanja.",
      category: "payment"
    },
    {
      question: "Mogu li da vratim proizvod ako nisam zadovoljan?",
      answer: "Da, nudimo 30 dana garancije povraćaja novca. Kontaktirajte nas za povraćaj.",
      category: "returns"
    },
    {
      question: "Da li su vaši proizvodi testirani i sigurni?",
      answer: "Da, svi naši proizvodi su dermatološki testirani, klinički odobreni i registrovani za upotrebu.",
      category: "general"
    },
    {
      question: "Kako mogu da kontaktiram vašu korisničku podršku?",
      answer: "Možete nas kontaktirati putem telefona ili email-a. Naš tim za podršku je dostupan radnim danima od 8h do 17h.",
      category: "general"
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
      question: "Mogu li da vratim proizvod ako nisam zadovoljan?",
      answer: "Da, nudimo 30 dana garancije povraćaja novca. Kontaktirajte nas za povraćaj.",
      category: "returns"
    },
    {
      question: "Da li su vaši proizvodi testirani i sigurni?",
      answer: "Da, svi naši proizvodi su dermatološki testirani, klinički odobreni i registrovani za upotrebu.",
      category: "general"
    },
    {
      question: "Kako mogu da kontaktiram vašu korisničku podršku?",
      answer: "Možete nas kontaktirati putem telefona ili email-a. Naš tim za podršku je dostupan radnim danima od 8h do 17h.",
      category: "general"
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
      question: "What payment methods do you accept?",
      answer: "We accept cash on delivery, credit/debit cards, and secure online payment methods.",
      category: "payment"
    },
    {
      question: "Are your products tested and safe?",
      answer: "Yes, all our products are dermatologically tested, clinically approved and registered for use according to EU regulations.",
      category: "general"
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
    },
    {
      question: "How can I contact customer support?",
      answer: "You can contact us via phone or email. Our support team is available on weekdays from 8am to 5pm.",
      category: "general"
    }
  ],
  bg: [
    {
      question: "Колко време отнема доставката?",
      answer: "Доставката отнема 1-3 работни дни за територията на България. Куриерските служби работят в работни дни от 8ч до 17ч.",
      category: "delivery"
    },
    {
      question: "Колко струва доставката?",
      answer: "Доставката за опаковка до 2кг струва 5 лева. Безплатна доставка за поръчки над 50 лева.",
      category: "delivery"
    },
    {
      question: "Мога ли да платя при доставка?",
      answer: "Да, поддържаме плащане при доставка. Платете когато куриерът ви достави пакета.",
      category: "payment"
    },
    {
      question: "Какви методи на плащане приемате?",
      answer: "Приемаме плащане при доставка, както и карти чрез сигурно онлайн плащане.",
      category: "payment"
    },
    {
      question: "Мога ли да върна продукта, ако не съм доволен?",
      answer: "Да, предлагаме 30 дни гаранция за връщане на парите. Свържете се с нас на телефон или имейл за връщане.",
      category: "returns"
    },
    {
      question: "Тествани ли са вашите продукти и безопасни ли са?",
      answer: "Да, всички наши продукти са дерматологично тествани, клинично одобрени и регистрирани за употреба.",
      category: "general"
    },
    {
      question: "Как да проследя моята поръчка?",
      answer: "След изпращане на продукта ще получите SMS с номер за проследяване на пратката в куриерската служба.",
      category: "delivery"
    },
    {
      question: "Как мога да се свържа с клиентската ви поддръжка?",
      answer: "Можете да се свържете с нас по телефон или имейл. Нашият екип за поддръжка е на разположение в работни дни от 8ч до 17ч.",
      category: "general"
    },
    {
      question: "Предлагате ли гаранция на вашите продукти?",
      answer: "Да, предлагаме 30 дни гаранция за удовлетвореност. Ако не сте доволни от резултатите, можете да върнете продукта за пълна компенсация.",
      category: "returns"
    }
  ]
};

export function getFAQForCountry(countryCode: string): FAQItem[] {
  return FAQ_DATA[countryCode] || FAQ_DATA['rs'];
}

export function getFAQByCategory(countryCode: string, category: string): FAQItem[] {
  return getFAQForCountry(countryCode).filter(item => item.category === category);
}
