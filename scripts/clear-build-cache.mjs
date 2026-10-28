/**
 * Briše webpack keš pre `next build`.
 *
 * Tailwind v4 (@tailwindcss/postcss) ne prijavljuje webpack-u TSX fajlove kao zavisnosti
 * globals.css, pa Vercel (koji vraća .next/cache iz prethodnog build-a) ume da isporuči
 * ZASTARELI CSS bez novih utility klasa (npr. gap-7, space-y-10) kad se globals.css ne menja.
 * Posledica na produkciji 2026-10-28: slepljen meni i preklopljene sekcije.
 */
import fs from 'node:fs';
import path from 'node:path';

const target = path.join(process.cwd(), '.next', 'cache', 'webpack');
fs.rmSync(target, { recursive: true, force: true });
console.log('[build] webpack keš obrisan:', target);
