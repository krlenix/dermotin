export interface Testimonial {
  id: string;
  name: string;
  city: string;
  rating: number;
  text: string;
  verified: boolean;
  image?: string; // Customer photo
  beforeAfter?: {
    before: string;
    after: string;
  };
  productUsed: string;
  dateAdded: string;
  featured?: boolean;
}

export const TESTIMONIALS: Record<string, Testimonial[]> = {
  rs: [
    {
      id: "t1",
      name: "Marija S.",
      city: "Beograd",
      rating: 5,
      text: "Neverovatno! Već nakon prve nedelje korišćenja vidim ogromnu razliku. Preporučujem svima!",
      verified: true,
      productUsed: "FUNGEL",
      dateAdded: "2024-01-15",
      featured: true
    },
    {
      id: "t2", 
      name: "Stefan M.",
      city: "Novi Sad",
      rating: 5,
      text: "Konačno sam našao proizvod koji stvarno radi. Prirodni sastojci i odličan efekat!",
      verified: true,
      productUsed: "FUNGEL",
      dateAdded: "2024-01-10",
      featured: true
    },
    {
      id: "t3",
      name: "Ana P.",
      city: "Niš", 
      rating: 5,
      text: "Brza dostava, odličan proizvod. Već naručujem drugo pakovanje!",
      verified: true,
      productUsed: "FUNGEL",
      dateAdded: "2024-01-08",
      featured: false
    },
    {
      id: "t4",
      name: "Petar J.",
      city: "Kragujevac",
      rating: 4,
      text: "Dobar proizvod, radi kako treba. Jedino što sam očekivao brže rezultate.",
      verified: true,
      productUsed: "FUNGEL", 
      dateAdded: "2024-01-05",
      featured: false
    },
    {
      id: "t5",
      name: "Milica R.",
      city: "Subotica",
      rating: 5,
      text: "Odličan gel, pomaže stvarno! Kožu mi je potpuno obnovio za 2 nedelje.",
      verified: true,
      productUsed: "FUNGEL",
      dateAdded: "2024-01-03",
      featured: true
    },
    {
      id: "t6",
      name: "Aleksandar T.",
      city: "Pančevo", 
      rating: 5,
      text: "Super proizvod! Koristi cela porodica. Prirodan i efikasan.",
      verified: true,
      productUsed: "FUNGEL",
      dateAdded: "2024-01-01",
      featured: false
    }
  ],
  ba: [
    {
      id: "t1",
      name: "Amira H.",
      city: "Sarajevo",
      rating: 5,
      text: "Odličan proizvod, već nakon nekoliko dana sam videla poboljšanje!",
      verified: true,
      productUsed: "FUNGEL",
      dateAdded: "2024-01-12",
      featured: true
    },
    {
      id: "t2",
      name: "Emir K.",
      city: "Tuzla",
      rating: 5,
      text: "Preporučujem svima. Prirodni sastojci i brz efekat.",
      verified: true,
      productUsed: "FUNGEL",
      dateAdded: "2024-01-08",
      featured: true
    }
  ],
  me: [
    {
      id: "t1",
      name: "Jovana M.",
      city: "Podgorica",
      rating: 5,
      text: "Fantastičan gel! Rešio je moj problem sa gljivicama za kratko vreme.",
      verified: true,
      productUsed: "FUNGEL",
      dateAdded: "2024-01-14",
      featured: true
    }
  ],
  eu: [
    {
      id: "t1",
      name: "Maria L.",
      city: "Amsterdam",
      rating: 5,
      text: "Amazing product! Natural ingredients and fast results. Highly recommended!",
      verified: true,
      productUsed: "FUNGEL",
      dateAdded: "2024-01-11",
      featured: true
    }
  ],
  bg: [
    {
      id: "t1",
      name: "Мария С.",
      city: "София",
      rating: 5,
      text: "Невероятно! Вече след първата седмица на употреба виждам огромна разлика. Препоръчвам на всички!",
      verified: true,
      productUsed: "FUNGEL",
      dateAdded: "2024-01-15",
      featured: true
    },
    {
      id: "t2", 
      name: "Стефан М.",
      city: "Пловдив",
      rating: 5,
      text: "Накрая намерих продукт, който наистина работи. Натурални съставки и отличен ефект!",
      verified: true,
      productUsed: "FUNGEL",
      dateAdded: "2024-01-10",
      featured: true
    },
    {
      id: "t3",
      name: "Ана П.",
      city: "Варна", 
      rating: 5,
      text: "Бърза доставка, отличен продукт. Вече поръчвам втора опаковка!",
      verified: true,
      productUsed: "FUNGEL",
      dateAdded: "2024-01-08",
      featured: false
    },
    {
      id: "t4",
      name: "Петър Й.",
      city: "Бургас",
      rating: 4,
      text: "Добър продукт, работи както трябва. Само че очаквах по-бързи резултати.",
      verified: true,
      productUsed: "FUNGEL", 
      dateAdded: "2024-01-05",
      featured: false
    },
    {
      id: "t5",
      name: "Милица Р.",
      city: "Русе",
      rating: 5,
      text: "Отличен гел, помага наистина! Кожата ми се възстанови напълно за 2 седмици.",
      verified: true,
      productUsed: "FUNGEL",
      dateAdded: "2024-01-03",
      featured: true
    },
    {
      id: "t6",
      name: "Александър Т.",
      city: "Стара Загора", 
      rating: 5,
      text: "Супер продукт! Използва цялото семейство. Натурален и ефикасен.",
      verified: true,
      productUsed: "FUNGEL",
      dateAdded: "2024-01-01",
      featured: false
    }
  ]
};

export function getTestimonialsForCountry(countryCode: string): Testimonial[] {
  return TESTIMONIALS[countryCode] || TESTIMONIALS['rs'];
}

export function getFeaturedTestimonials(countryCode: string): Testimonial[] {
  return getTestimonialsForCountry(countryCode).filter(t => t.featured);
}
