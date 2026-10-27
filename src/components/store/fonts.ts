import { Instrument_Sans, Instrument_Serif, Poppins } from 'next/font/google';

// Fontovi izloga — učitavaju se samo na stranicama koje koriste store komponente.
const serif = Instrument_Serif({
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-store-serif',
  display: 'swap',
});

const sans = Instrument_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-store-sans',
  display: 'swap',
});

/** Klase koje definišu font promenljive i uključuju tipografiju izloga. */
export const storeFontClass = `${serif.variable} ${sans.variable} store-font`;

// Prodajna stranica proizvoda (preslikana sa starog sajta) — Poppins kao na dermotin.rs
const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-lander',
  display: 'swap',
});

export const landerFontClass = `${poppins.variable} lander-font`;
