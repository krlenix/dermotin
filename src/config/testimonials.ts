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
      text: "Imala sam problem sa gljivicama na stopalima već mesecima. FUNGEL mi je pomogao za samo 10 dana! Krem se lako nanosi, ne maže i ima prijatan miris. Konačno mogu da nosim otvorene cipele bez stida.",
      verified: true,
      productUsed: "FUNGEL",
      dateAdded: "2024-12-15",
      featured: true
    },
    {
      id: "t2", 
      name: "Stefan M.",
      city: "Novi Sad",
      rating: 5,
      text: "Kao sportista, često imam problema sa kožom zbog znojenja. FUNGEL sa čajnim drvetom je bio prava stvar - prirodan, efikasan i bez hemikalija. Koristim ga već 2 meseca i rezultati su fantastični.",
      verified: true,
      productUsed: "FUNGEL",
      dateAdded: "2024-12-10",
      featured: true
    },
    {
      id: "t3",
      name: "Ana P.",
      city: "Niš", 
      rating: 5,
      text: "Moja kćerka je imala problematičnu kožu oko noktiju. Probali smo mnoge proizvode, ali FUNGEL je jedini koji je stvarno pomogao. Prirodni sastojci su mi bili važni jer je reč o detetu. Preporučujem!",
      verified: true,
      productUsed: "FUNGEL",
      dateAdded: "2024-12-08",
      featured: true
    },
    {
      id: "t4",
      name: "Petar J.",
      city: "Kragujevac",
      rating: 4,
      text: "Dobar proizvod, radi postepeno ali sigurno. Trebalo mi je oko 3 nedelje da vidim punu promenu, ali vredi čekanja. Cena je prihvatljiva za kvalitet koji dobijate.",
      verified: true,
      productUsed: "FUNGEL", 
      dateAdded: "2024-12-05",
      featured: false
    },
    {
      id: "t5",
      name: "Milica R.",
      city: "Subotica",
      rating: 5,
      text: "Radim u vlažnoj sredini i često imam problema sa kožom na rukama. FUNGEL mi je ne samo rešio problem, već i učinio kožu mekšom i zdravijom. Sada ga koristim preventivno.",
      verified: true,
      productUsed: "FUNGEL",
      dateAdded: "2024-12-03",
      featured: true
    },
    {
      id: "t6",
      name: "Aleksandar T.",
      city: "Pančevo", 
      rating: 5,
      text: "Skeptičan sam bio prema prirodnim proizvodima, ali FUNGEL me je pozitivno iznenadio. Brzo deluje, nema neželjenih efekata i stvarno pomaže. Već sam preporučio trojici prijatelja.",
      verified: true,
      productUsed: "FUNGEL",
      dateAdded: "2024-12-01",
      featured: false
    },
    {
      id: "t7",
      name: "Jovana M.",
      city: "Zemun",
      rating: 5,
      text: "Kao kozmetolog, često preporučujem FUNGEL svojim klijentima. Prirodni sastojci poput nevena i čajnog drveta čine čuda za problematičnu kožu. Profesionalno i efikasno rešenje.",
      verified: true,
      productUsed: "FUNGEL",
      dateAdded: "2024-11-28",
      featured: true
    },
    {
      id: "t8",
      name: "Nikola D.",
      city: "Valjevo",
      rating: 4,
      text: "Koristim FUNGEL već mesec dana. Rezultati su vidljivi, koža je zdravija i nema više iritacije. Jedino što bih voleo da pakovanje bude veće jer se brzo potroši.",
      verified: true,
      productUsed: "FUNGEL",
      dateAdded: "2024-11-25",
      featured: false
    }
  ],
  ba: [
    {
      id: "ba1",
      name: "Amela H.",
      city: "Sarajevo",
      rating: 5,
      text: "FUNGEL mi je pomogao kada ništa drugo nije. Imala sam hronične probleme sa kožom i ovaj prirodni proizvod je konačno donio olakšanje. Preporučujem svima koji traže efikasno rešenje.",
      verified: true,
      productUsed: "FUNGEL",
      dateAdded: "2024-12-12",
      featured: true
    },
    {
      id: "ba2",
      name: "Emir K.",
      city: "Tuzla",
      rating: 5,
      text: "Kao čovjek koji radi fizički posao, često imam problema sa kožom na rukama. FUNGEL sa čajnim drvetom i origanom je bio prava stvar. Prirodan, bez kemikalija i stvarno efikasan.",
      verified: true,
      productUsed: "FUNGEL",
      dateAdded: "2024-12-09",
      featured: true
    },
    {
      id: "ba3",
      name: "Selma B.",
      city: "Zenica",
      rating: 5,
      text: "Moj sin je imao problematičnu kožu oko noktiju. FUNGEL je jedini proizvod koji je stvarno pomogao. Prirodni sastojci su mi bili važni, a rezultati su vidljivi već nakon nedelju dana.",
      verified: true,
      productUsed: "FUNGEL",
      dateAdded: "2024-12-06",
      featured: true
    },
    {
      id: "ba4",
      name: "Adnan M.",
      city: "Banja Luka",
      rating: 4,
      text: "Dobar proizvod, radi postupno ali sigurno. Trebalo mi je oko tri sedmice da vidim potpunu promjenu, ali vrijedi čekanja. Cijena je prihvatljiva za kvalitet.",
      verified: true,
      productUsed: "FUNGEL",
      dateAdded: "2024-12-03",
      featured: false
    },
    {
      id: "ba5",
      name: "Lejla S.",
      city: "Mostar",
      rating: 5,
      text: "Radim u vlažnoj sredini i često imam problema sa kožom. FUNGEL mi je ne samo riješio problem, već i učinio kožu mekšom i zdravijom. Sada ga koristim preventivno.",
      verified: true,
      productUsed: "FUNGEL",
      dateAdded: "2024-11-30",
      featured: true
    },
    {
      id: "ba6",
      name: "Mirsad J.",
      city: "Bijeljina",
      rating: 5,
      text: "Skeptičan sam bio prema prirodnim proizvodima, ali FUNGEL me pozitivno iznenadio. Brzo djeluje, nema neželjenih efekata i stvarno pomaže. Već sam preporučio dvojici prijatelja.",
      verified: true,
      productUsed: "FUNGEL",
      dateAdded: "2024-11-27",
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
