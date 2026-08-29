import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mapPath = path.join(root, 'docs', 'migration', 'legacy-domain-map.csv');
const localOrigin = process.env.AUDIT_ORIGIN || 'http://127.0.0.1:3100';

function parseCsvLine(line) {
  const values = [];
  const regex = /(?:^|,)(?:"((?:[^"]|"")*)"|([^,]*))/g;
  let match;
  while ((match = regex.exec(line))) {
    values.push((match[1] ?? match[2] ?? '').replaceAll('""', '"'));
  }
  return values;
}

const lines = readFileSync(mapPath, 'utf8').trim().split(/\r?\n/);
const headers = lines.shift().split(',');
const rows = lines.map((line) =>
  Object.fromEntries(headers.map((header, index) => [header, parseCsvLine(line)[index]]))
);

async function localRequest(url, host, redirect = 'manual') {
  return fetch(`${localOrigin}${url.pathname}${url.search}`, {
    headers: { host },
    redirect,
  });
}

async function followLocally(source) {
  let current = new URL(source);
  let host = current.host;
  const chain = [];

  for (let hop = 0; hop < 6; hop += 1) {
    const response = await localRequest(current, host);
    chain.push({ status: response.status, url: current.toString() });
    if (response.status < 300 || response.status >= 400) {
      return { response, chain, finalUrl: current };
    }

    const location = response.headers.get('location');
    if (!location) return { response, chain, finalUrl: current };
    current = new URL(location, current);
    host = current.host;
  }

  throw new Error(`Redirect loop: ${source}`);
}

const failures = [];
let cursor = 0;
const worker = async () => {
  while (cursor < rows.length) {
    const row = rows[cursor++];
    try {
      const result = await followLocally(row.old_url);
      if (result.response.status !== 200) {
        failures.push(`${row.old_url} -> ${result.response.status} (${result.chain.map((hop) => hop.status).join('>')})`);
      }
    } catch (error) {
      failures.push(`${row.old_url} -> ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

await Promise.all(Array.from({ length: 8 }, () => worker()));

const canonicalResponse = await localRequest(
  new URL('https://dermotin.co/checkouts/fungel-v1?utm_source=audit&fbclid=test'),
  'dermotin.co'
);
const canonicalHtml = await canonicalResponse.text();
const canonical = canonicalHtml.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
if (canonical !== 'https://dermotin.rs/rs/products/fungel') {
  failures.push(`Unexpected checkout canonical: ${canonical || '<missing>'}`);
}

const couponResponse = await localRequest(
  new URL('https://dermotin.rs/checkouts/krema-protiv-gljivica-lp1?utm_source=audit'),
  'dermotin.rs'
);
const couponLocation = new URL(couponResponse.headers.get('location'), 'https://dermotin.rs');
if (couponLocation.searchParams.get('coupon_code') !== 'POPUST20' || couponLocation.searchParams.get('utm_source') !== 'audit') {
  failures.push(`Coupon/query preservation failed: ${couponLocation}`);
}

const customCouponResponse = await localRequest(
  new URL('https://dermotin.rs/checkouts/krema-protiv-gljivica-lp1?coupon_code=CUSTOM'),
  'dermotin.rs'
);
const customCouponLocation = new URL(customCouponResponse.headers.get('location'), 'https://dermotin.rs');
if (customCouponLocation.searchParams.get('coupon_code') !== 'CUSTOM') {
  failures.push(`Explicit coupon was overwritten: ${customCouponLocation}`);
}

const [robots, sitemap, llms, product] = await Promise.all([
  fetch(`${localOrigin}/robots.txt`).then((response) => response.text()),
  fetch(`${localOrigin}/sitemap.xml`).then((response) => response.text()),
  fetch(`${localOrigin}/llms.txt`).then((response) => response.text()),
  fetch(`${localOrigin}/rs/products/fungel`).then((response) => response.text()),
]);

if (!robots.includes('OAI-SearchBot') || !robots.includes('https://dermotin.rs/sitemap.xml')) {
  failures.push('robots.txt is missing AI crawler or canonical sitemap declarations');
}
if (!sitemap.includes('https://dermotin.rs/rs/products/fungel') || sitemap.includes('/checkouts/')) {
  failures.push('sitemap canonicalization failed');
}
if (!llms.startsWith('# DERMOTIN') || !llms.includes('https://dermotin.rs/rs/products/fungel')) {
  failures.push('llms.txt format/content failed');
}
for (const schemaType of ['Product', 'Offer', 'BreadcrumbList', 'FAQPage']) {
  if (!product.includes(`"@type":"${schemaType}"`)) {
    failures.push(`Product HTML is missing ${schemaType} structured data`);
  }
}
if (failures.length) {
  console.error(`Migration audit failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Migration audit passed: ${rows.length}/${rows.length} mapped domain URLs return HTTP 200.`);
console.log('SEO audit passed: canonical, query/coupon preservation, robots, sitemap, llms.txt and product structured data.');
