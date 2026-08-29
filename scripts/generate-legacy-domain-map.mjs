import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(root, 'docs', 'migration', 'legacy-url-map.csv');
const outputPath = path.join(root, 'docs', 'migration', 'legacy-domain-map.csv');

const sourceLines = readFileSync(sourcePath, 'utf8').trim().split(/\r?\n/);
const header = sourceLines.shift();

if (!header) {
  throw new Error('legacy-url-map.csv is empty');
}

const csv = (value) => `"${String(value).replaceAll('"', '""')}"`;
const row = (values) => values.map(csv).join(',');

const aliases = [
  ['/checkouts/biomelis-ba', 'REDIRECT 301', '/bs/checkouts/biomelis', '/ba/checkouts/biomelis', '200', 'WordPress Redirection alias.'],
  ['/checkouts/biowart-ba', 'REDIRECT 301', '/bs/checkouts/biowart', '/ba/checkouts/biowart', '200', 'WordPress Redirection alias.'],
  ['/checkouts/fungel-ba', 'REDIRECT 301', '/bs/checkouts/fungel', '/ba/checkouts/fungel', '200', 'WordPress Redirection alias.'],
  ['/checkouts/krema-protiv-gljivica-lp1', 'REDIRECT 301 + coupon', '/checkouts/fungel-v1?coupon_code=POPUST20', '/rs/checkouts/fungel', '200', 'Kupon se dodaje samo ako ga zahtev već nema.'],
  ['/checkouts/ulje-protiv-gljivica', 'REDIRECT 301 + coupon', '/checkouts/fungel-v1?coupon_code=POPUST20', '/rs/checkouts/fungel', '200', 'Kupon se dodaje samo ako ga zahtev već nema.'],
  ['/checkouts/v2-ulje-gljivice', 'REDIRECT 301 + coupon', '/checkouts/fungel-v1?coupon_code=POPUST20', '/rs/checkouts/fungel', '200', 'Kupon se dodaje samo ako ga zahtev već nema.'],
  ['/checkouts/melem-protiv-psorijaze-i-ekcema', 'REDIRECT 301 + coupon', '/checkouts/biomelis-v2?coupon_code=POPUST20', '/rs/checkouts/biomelis', '200', 'Kupon se dodaje samo ako ga zahtev već nema.'],
  ['/checkouts/v2-ekcem-i-psorijaza', 'REDIRECT 301 + coupon', '/checkouts/biomelis-v2?coupon_code=POPUST20', '/rs/checkouts/biomelis', '200', 'Kupon se dodaje samo ako ga zahtev već nema.'],
  ['/checkouts/melem-protiv-virusnih-bradavica', 'REDIRECT 301 + coupon', '/checkouts/biowart-v1?coupon_code=POPUST20', '/rs/checkouts/biowart', '200', 'Kupon se dodaje samo ako ga zahtev već nema.'],
  ['/checkouts/v2-virusne-bradavice', 'REDIRECT 301 + coupon', '/checkouts/biowart-v1?coupon_code=POPUST20', '/rs/checkouts/biowart', '200', 'Kupon se dodaje samo ako ga zahtev već nema.'],
  ['/product/krema-protiv-gljivica', 'REDIRECT 301 + coupon', '/product/fungel?coupon_code=POPUST20', '/rs/products/fungel', '200', 'Kupon se dodaje samo ako ga zahtev već nema.'],
  ['/product/ulje-protiv-gljivica', 'REDIRECT 301 + coupon', '/product/fungel?coupon_code=POPUST20', '/rs/products/fungel', '200', 'Kupon se dodaje samo ako ga zahtev već nema.'],
  ['/product/melem-protiv-ekcema-i-psorijaze', 'REDIRECT 301', '/product/biomelis', '/rs/products/biomelis', '200', 'WordPress Redirection alias.'],
  ['/product/melem-protiv-virusnih-bradavica', 'REDIRECT 301 + coupon', '/product/biowart?coupon_code=POPUST20', '/rs/products/biowart', '200', 'Kupon se dodaje samo ako ga zahtev već nema.'],
  ['/product/krema-za-lice-od-sluzi-puza', 'REDIRECT 301', '/rs/products', '/rs/products', '200', 'Stari proizvod nije u novom katalogu.'],
  ['/qrkod', 'REDIRECT 301', '/rs', '/rs', '200', 'WordPress Redirection alias.'],
];

const normalizedBase = sourceLines.map((line) =>
  line
    .replace('"/rs/checkouts/bioroid","200","SET proizvod', '"/rs/checkouts/bioroid-set","200","SET proizvod')
    .replace('"/rs/products/bioroid","200","SET proizvod', '"/rs/products/bioroid-set","200","SET proizvod')
);

const output = [header];
for (const domain of ['dermotin.rs', 'dermotin.co']) {
  for (const line of normalizedBase) {
    output.push(line.replace('https://dermotin.rs', `https://${domain}`));
  }
  for (const alias of aliases) {
    output.push(row([`https://${domain}${alias[0]}`, ...alias.slice(1)]));
  }
}

writeFileSync(outputPath, `${output.join('\n')}\n`, 'utf8');
console.log(`Generated ${output.length - 1} domain URL mappings at ${outputPath}`);
