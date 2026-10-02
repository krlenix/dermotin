import { timingSafeEqual } from 'node:crypto';

export function topomsConfig(selector?: string) {
  const com = selector === 'dermotin.com' || selector === 'www.dermotin.com' ||
    (!!selector && selector === process.env.TOPOMS_COM_API_BASE_URL?.replace(/\/$/, '').split('/').at(-1));
  const prefix = com ? 'TOPOMS_COM' : 'TOPOMS';
  const baseUrl = process.env[`${prefix}_API_BASE_URL`]?.replace(/\/$/, '') || '';
  if (!/^https:\/\/app\.topoms\.com\/custom-api\/v1\/[a-z0-9]+$/.test(baseUrl)) {
    throw new Error('TOPOMS_API_BASE_URL must be the HTTPS store URL supplied by TopOMS');
  }
  const apiKey = process.env[`${prefix}_API_KEY`];
  if (!apiKey) throw new Error('Missing TOPOMS_API_KEY');
  const storeId = baseUrl.split('/').at(-1)!;
  if (selector && !selector.includes('.') && selector !== storeId) throw new Error('Unknown TopOMS store');
  return { baseUrl, apiKey, storeId, locale: process.env.TOPOMS_LOCALE || 'rs',
    catalogUrl: com ? 'https://dermotin.com' : process.env.NEXT_PUBLIC_APP_URL || 'https://dermotin.shop' };
}

export function topomsConfigs() {
  return [topomsConfig(), ...(process.env.TOPOMS_COM_API_BASE_URL ? [topomsConfig('dermotin.com')] : [])];
}

export function topomsEnabledFor(locale: string, domain?: string): boolean {
  if (process.env.TOPOMS_ENABLED !== 'true' || process.env.WEBHOOK_DRY_RUN === 'true') return false;
  if (locale !== (process.env.TOPOMS_LOCALE || 'rs')) return false;
  if (!domain) return true; // Internal catalog operations, never a public request.
  if (['dermotin.com', 'www.dermotin.com'].includes(domain.toLowerCase())) return !!process.env.TOPOMS_COM_API_BASE_URL;
  const allowed = (process.env.TOPOMS_ALLOWED_DOMAINS || '').split(',').map(s => s.trim().toLowerCase());
  return allowed.includes(domain.toLowerCase());
}

export function authorizeWorker(request: Request): boolean {
  return authorizeBearer(request, process.env.OMS_WORKER_SECRET || '');
}

export function authorizeCron(request: Request): boolean {
  return authorizeBearer(request, process.env.CRON_SECRET || '');
}

function authorizeBearer(request: Request, expected: string): boolean {
  const actual = request.headers.get('authorization')?.replace(/^Bearer /, '') || '';
  const expectedBytes = Buffer.from(expected);
  const actualBytes = Buffer.from(actual);
  return expected.length >= 32 && actualBytes.length === expectedBytes.length &&
    timingSafeEqual(actualBytes, expectedBytes);
}
