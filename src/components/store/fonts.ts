import { Poppins } from 'next/font/google';

// Tipografija sajta — Poppins kao na starom dermotin.rs (jedina porodica fontova)
const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-lander',
  display: 'swap',
});

export const landerFontClass = `${poppins.variable} lander-font`;
