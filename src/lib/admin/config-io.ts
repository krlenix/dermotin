import { promises as fs } from 'fs';
import path from 'path';
import { Ingredient, Product } from '@/config/types';
import type { Coupon } from '@/config/coupons';
import { bogoConfigSchema, couponSchema, ingredientSchema, productSchema } from './schemas';

/**
 * IO sloj admin panela: čita i piše config fajlove sa podacima
 * (src/config/locales/{locale}/products.ts i src/config/ingredients.ts).
 *
 * Fajlovi su čisti objektni literali, pa se čitaju izdvajanjem literala
 * (brace-matching skener) + evaluacijom, a pišu se determinističkim
 * TS codegen-om. Pre svakog pisanja pravi se backup u .admin-backups/
 * (uz to je sve i u git-u). Pisanje je serijalizovano po fajlu.
 */

const REPO_ROOT = process.cwd();
const BACKUP_DIR = path.join(REPO_ROOT, '.admin-backups');
const MAX_BACKUPS_PER_FILE = 30;

export const PRODUCT_LOCALES = ['rs', 'ba', 'me', 'hr'] as const;
export type ProductLocale = (typeof PRODUCT_LOCALES)[number];

export function isProductLocale(value: string): value is ProductLocale {
  return (PRODUCT_LOCALES as readonly string[]).includes(value);
}

function productsFilePath(locale: ProductLocale): string {
  return path.join(REPO_ROOT, 'src', 'config', 'locales', locale, 'products.ts');
}

const INGREDIENTS_FILE = path.join(REPO_ROOT, 'src', 'config', 'ingredients.ts');

// ---------------------------------------------------------------------------
// Izdvajanje objektnog literala iz TS fajla
// ---------------------------------------------------------------------------

/**
 * Nalazi granice objektnog literala dodeljenog `export const <name>`.
 * Vraća [start, end) indekse u izvornom kodu (uključujući spoljne zagrade).
 * Skener poštuje stringove i komentare.
 */
function locateObjectLiteral(source: string, constName: string): { start: number; end: number } {
  const declMatch = source.match(new RegExp(`export const ${constName}[^=]*=`));
  if (!declMatch || declMatch.index === undefined) {
    throw new Error(`Nije pronađen "export const ${constName}" u fajlu.`);
  }
  const start = source.indexOf('{', declMatch.index + declMatch[0].length);
  if (start === -1) {
    throw new Error(`Nije pronađen početak objektnog literala za ${constName}.`);
  }

  let depth = 0;
  let inString: string | null = null;
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = start; i < source.length; i++) {
    const ch = source[i];
    const next = source[i + 1];

    if (inLineComment) {
      if (ch === '\n') inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      if (ch === '*' && next === '/') {
        inBlockComment = false;
        i++;
      }
      continue;
    }
    if (inString) {
      if (ch === '\\') {
        i++; // preskoči escapovan karakter
      } else if (ch === inString) {
        inString = null;
      }
      continue;
    }

    if (ch === "'" || ch === '"' || ch === '`') {
      inString = ch;
      continue;
    }
    if (ch === '/' && next === '/') {
      inLineComment = true;
      i++;
      continue;
    }
    if (ch === '/' && next === '*') {
      inBlockComment = true;
      i++;
      continue;
    }
    if (ch === '{') depth++;
    if (ch === '}') {
      depth--;
      if (depth === 0) {
        return { start, end: i + 1 };
      }
    }
  }
  throw new Error(`Objektni literal za ${constName} nije zatvoren (neuparene zagrade).`);
}

/** Vraća objektni literal kao string (uključujući spoljne zagrade). */
function extractObjectLiteral(source: string, constName: string): string {
  const { start, end } = locateObjectLiteral(source, constName);
  return source.slice(start, end);
}

function evaluateLiteral<T>(literal: string): T {
  // Literal je čist podatak (bez identifikatora) — proveravaju ga i zod šeme posle.
  return new Function(`"use strict"; return (${literal});`)() as T;
}

// ---------------------------------------------------------------------------
// TS codegen (serijalizacija)
// ---------------------------------------------------------------------------

function isValidIdentifier(key: string): boolean {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key);
}

function quoteString(value: string): string {
  return (
    "'" +
    value
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\r/g, '\\r')
      .replace(/\n/g, '\\n')
      .replace(/\t/g, '\\t') +
    "'"
  );
}

export function serializeToTs(value: unknown, indent = 0): string {
  const pad = '  '.repeat(indent);
  const padInner = '  '.repeat(indent + 1);

  if (value === null) return 'null';
  if (typeof value === 'string') return quoteString(value);
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'undefined') return 'undefined';

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const items = value.map((item) => padInner + serializeToTs(item, indent + 1));
    return '[\n' + items.join(',\n') + '\n' + pad + ']';
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).filter(([, v]) => v !== undefined);
    if (entries.length === 0) return '{}';
    const lines = entries.map(
      ([key, v]) => padInner + (isValidIdentifier(key) ? key : quoteString(key)) + ': ' + serializeToTs(v, indent + 1)
    );
    return '{\n' + lines.join(',\n') + '\n' + pad + '}';
  }

  throw new Error(`Vrednost tipa ${typeof value} ne može da se serijalizuje u config fajl.`);
}

// ---------------------------------------------------------------------------
// Backup + serijalizovano pisanje
// ---------------------------------------------------------------------------

const writeQueues = new Map<string, Promise<unknown>>();

/** Serijalizuje operacije nad istim fajlom (jedan admin, ali dupli klik je realan). */
function enqueue<T>(filePath: string, operation: () => Promise<T>): Promise<T> {
  const previous = writeQueues.get(filePath) ?? Promise.resolve();
  const next = previous.then(operation, operation);
  writeQueues.set(filePath, next.catch(() => undefined));
  return next;
}

async function backupFile(filePath: string): Promise<void> {
  await fs.mkdir(BACKUP_DIR, { recursive: true });
  const original = await fs.readFile(filePath, 'utf8');
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const base = path.relative(REPO_ROOT, filePath).replace(/[\\/]/g, '__');
  await fs.writeFile(path.join(BACKUP_DIR, `${base}.${stamp}.bak`), original, 'utf8');

  // Zadrži samo poslednjih MAX_BACKUPS_PER_FILE backup-a po fajlu
  const entries = (await fs.readdir(BACKUP_DIR))
    .filter((name) => name.startsWith(`${base}.`) && name.endsWith('.bak'))
    .sort();
  const excess = entries.length - MAX_BACKUPS_PER_FILE;
  for (let i = 0; i < excess; i++) {
    await fs.unlink(path.join(BACKUP_DIR, entries[i])).catch(() => undefined);
  }
}

async function writeConfigFile(filePath: string, content: string): Promise<void> {
  await backupFile(filePath);
  const tempPath = `${filePath}.tmp`;
  await fs.writeFile(tempPath, content, 'utf8');
  await fs.rm(filePath, { force: true });
  await fs.rename(tempPath, filePath);
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

const PRODUCTS_HEADER = `import { Product } from '../../types';

// ⚠️ Ovaj fajl održava admin panel (/admin/products). Ručne izmene su dozvoljene,
// ali će formatiranje i komentari biti pregaženi pri sledećem snimanju iz admina.
`;

export async function readProducts(locale: ProductLocale): Promise<Record<string, Product>> {
  const source = await fs.readFile(productsFilePath(locale), 'utf8');
  return evaluateLiteral<Record<string, Product>>(extractObjectLiteral(source, 'PRODUCTS'));
}

export async function writeProducts(locale: ProductLocale, products: Record<string, Product>): Promise<void> {
  // Validacija svakog zapisa pre pisanja — pokvaren fajl ruši ceo sajt
  for (const [key, product] of Object.entries(products)) {
    const result = productSchema.safeParse(product);
    if (!result.success) {
      const issues = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
      throw new Error(`Proizvod "${key}" (${locale}) nije validan: ${issues}`);
    }
    if (product.id !== key) {
      throw new Error(`Proizvod "${key}" (${locale}): polje id ("${product.id}") mora biti isto kao ključ zapisa.`);
    }
  }

  const content = PRODUCTS_HEADER + 'export const PRODUCTS: Record<string, Product> = ' + serializeToTs(products) + ';\n';

  // Round-trip provera: generisan fajl mora da se parsira nazad u iste podatke
  const reparsed = evaluateLiteral<Record<string, Product>>(extractObjectLiteral(content, 'PRODUCTS'));
  if (JSON.stringify(reparsed) !== JSON.stringify(products)) {
    throw new Error(`Round-trip provera nije prošla za ${locale}/products.ts — pisanje je otkazano.`);
  }

  await enqueue(productsFilePath(locale), () => writeConfigFile(productsFilePath(locale), content));
}

// ---------------------------------------------------------------------------
// Ingredients
// ---------------------------------------------------------------------------

const INGREDIENTS_HEADER = `import { Ingredient } from './types';

// ⚠️ Ovaj fajl održava admin panel (/admin/ingredients). Ručne izmene su dozvoljene,
// ali će formatiranje i komentari biti pregaženi pri sledećem snimanju iz admina.
`;

export async function readIngredients(): Promise<Record<string, Ingredient>> {
  const source = await fs.readFile(INGREDIENTS_FILE, 'utf8');
  return evaluateLiteral<Record<string, Ingredient>>(extractObjectLiteral(source, 'INGREDIENTS'));
}

export async function writeIngredients(ingredients: Record<string, Ingredient>): Promise<void> {
  for (const [key, ingredient] of Object.entries(ingredients)) {
    const result = ingredientSchema.safeParse(ingredient);
    if (!result.success) {
      const issues = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
      throw new Error(`Sastojak "${key}" nije validan: ${issues}`);
    }
    if (ingredient.id !== key) {
      throw new Error(`Sastojak "${key}": polje id ("${ingredient.id}") mora biti isto kao ključ zapisa.`);
    }
  }

  const content =
    INGREDIENTS_HEADER + 'export const INGREDIENTS: Record<string, Ingredient> = ' + serializeToTs(ingredients) + ';\n';

  const reparsed = evaluateLiteral<Record<string, Ingredient>>(extractObjectLiteral(content, 'INGREDIENTS'));
  if (JSON.stringify(reparsed) !== JSON.stringify(ingredients)) {
    throw new Error('Round-trip provera nije prošla za ingredients.ts — pisanje je otkazano.');
  }

  await enqueue(INGREDIENTS_FILE, () => writeConfigFile(INGREDIENTS_FILE, content));
}

// ---------------------------------------------------------------------------
// Splice: zamena samo jednog literala u fajlu koji sadrži i drugi kod
// (koristi se za COUPONS u coupons.ts i BOGO_CONFIG u bogo-cookies.ts)
// ---------------------------------------------------------------------------

async function spliceObjectLiteral(filePath: string, constName: string, value: unknown): Promise<void> {
  const source = await fs.readFile(filePath, 'utf8');
  const { start, end } = locateObjectLiteral(source, constName);
  const content = source.slice(0, start) + serializeToTs(value) + source.slice(end);

  // Round-trip provera pre pisanja
  const reparsed = evaluateLiteral(extractObjectLiteral(content, constName));
  if (JSON.stringify(reparsed) !== JSON.stringify(value)) {
    throw new Error(`Round-trip provera nije prošla za ${constName} u ${path.basename(filePath)} — pisanje je otkazano.`);
  }

  await enqueue(filePath, () => writeConfigFile(filePath, content));
}

// ---------------------------------------------------------------------------
// Coupons (src/config/coupons.ts — COUPONS literal)
// ---------------------------------------------------------------------------

const COUPONS_FILE = path.join(REPO_ROOT, 'src', 'config', 'coupons.ts');

export async function readCoupons(): Promise<Record<string, Coupon>> {
  const source = await fs.readFile(COUPONS_FILE, 'utf8');
  return evaluateLiteral<Record<string, Coupon>>(extractObjectLiteral(source, 'COUPONS'));
}

export async function writeCoupons(coupons: Record<string, Coupon>): Promise<void> {
  for (const [key, coupon] of Object.entries(coupons)) {
    const result = couponSchema.safeParse(coupon);
    if (!result.success) {
      const issues = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
      throw new Error(`Kupon "${key}" nije validan: ${issues}`);
    }
    if (coupon.code !== key) {
      throw new Error(`Kupon "${key}": polje code ("${coupon.code}") mora biti isto kao ključ zapisa.`);
    }
  }
  await spliceObjectLiteral(COUPONS_FILE, 'COUPONS', coupons);
}

// ---------------------------------------------------------------------------
// BOGO konfiguracija (src/utils/bogo-cookies.ts — BOGO_CONFIG literal)
// ---------------------------------------------------------------------------

const BOGO_FILE = path.join(REPO_ROOT, 'src', 'utils', 'bogo-cookies.ts');

// Mora da prati oblik BOGO_CONFIG literala u src/utils/bogo-cookies.ts
export interface BogoConfig {
  enabled: boolean;
  couponCode: string;
  expirationDate: string;
  maxQuantity: number;
  configVersion: number;
}

export async function readBogoConfig(): Promise<BogoConfig> {
  const source = await fs.readFile(BOGO_FILE, 'utf8');
  return evaluateLiteral<BogoConfig>(extractObjectLiteral(source, 'BOGO_CONFIG'));
}

export async function writeBogoConfig(config: BogoConfig): Promise<void> {
  const result = bogoConfigSchema.safeParse(config);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`BOGO konfiguracija nije validna: ${issues}`);
  }
  await spliceObjectLiteral(BOGO_FILE, 'BOGO_CONFIG', config);
}

// ---------------------------------------------------------------------------
// Pomoćne funkcije
// ---------------------------------------------------------------------------

/** Za svaki sastojak vraća listu "locale/productId" zapisa koji ga koriste. */
export async function getIngredientUsage(): Promise<Record<string, string[]>> {
  const usage: Record<string, string[]> = {};
  for (const locale of PRODUCT_LOCALES) {
    const products = await readProducts(locale);
    for (const product of Object.values(products)) {
      for (const ingredientId of product.ingredients) {
        (usage[ingredientId] ??= []).push(`${locale}/${product.id}`);
      }
    }
  }
  return usage;
}

/** Da li je fajl-sistem upisiv (na serverless hostingu poput Vercel-a nije). */
export async function isFileSystemWritable(): Promise<boolean> {
  try {
    const probe = path.join(REPO_ROOT, '.admin-write-probe');
    await fs.writeFile(probe, 'ok', 'utf8');
    await fs.rm(probe, { force: true });
    return true;
  } catch {
    return false;
  }
}
