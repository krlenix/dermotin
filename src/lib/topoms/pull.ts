import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { topomsConfig } from './config';
import { currentCatalog } from './outbox';
import { digest } from './mapping';

type Config = ReturnType<typeof topomsConfig>;
type Cursor = { version: 1; store: string; locale: string; revision: string; after: string; since: string | null };
// TopOMS SyncStoreProducts requests 200 rows from the SHOP's Pull API.
// The 100-row cap in TopOMS's own outbound read feed is a different contract.
const MAX_PULL_PAGE_SIZE = 200;

class PullError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: {
    'Cache-Control': 'private, no-store, max-age=0',
    'Vary': 'X-API-Key, Authorization',
    'X-Robots-Tag': 'noindex, nofollow',
  } });
}

function equalSecret(actual: string, expected: string) {
  const a = Buffer.from(actual);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function authorized(request: Request, key: string) {
  const apiKey = request.headers.get('x-api-key');
  const authorization = request.headers.get('authorization');
  if (apiKey === null && authorization === null) return false;
  // TopOMS sends both. Each supplied header must be valid; either alone works.
  if (apiKey !== null && !equalSecret(apiKey, key)) return false;
  if (authorization !== null && !equalSecret(authorization, `Bearer ${key}`)) return false;
  return true;
}

function dateFilter(value: string | null): string | null {
  if (!value) return null;
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value) || !Number.isFinite(Date.parse(value))) {
    throw new PullError('updated_since must be an ISO-8601 timestamp with timezone');
  }
  return new Date(value).toISOString();
}

function sign(value: string, config: Config) {
  return createHmac('sha256', config.apiKey).update(`topoms-products-pull:${value}`).digest('base64url');
}

function encodeCursor(cursor: Cursor, config: Config) {
  const value = Buffer.from(JSON.stringify(cursor)).toString('base64url');
  return `${value}.${sign(value, config)}`;
}

function decodeCursor(raw: string, config: Config): Cursor {
  if (raw.length > 2048 || !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(raw)) throw new PullError('Invalid cursor');
  const [value, signature] = raw.split('.');
  if (!equalSecret(signature, sign(value, config))) throw new PullError('Invalid cursor');
  let cursor: Cursor;
  try { cursor = JSON.parse(Buffer.from(value, 'base64url').toString()); }
  catch { throw new PullError('Invalid cursor'); }
  if (!cursor || cursor.version !== 1 || cursor.store !== config.storeId || cursor.locale !== config.locale ||
      typeof cursor.revision !== 'string' || typeof cursor.after !== 'string' ||
      (cursor.since !== null && typeof cursor.since !== 'string')) throw new PullError('Invalid cursor');
  return cursor;
}

/** Read-only, independently authenticated catalog API. Never drains or sends webhooks. */
export async function handleProductPull(request: Request, resource: 'ping' | 'count' | 'products') {
  try {
    const config = topomsConfig(new URL(request.url).hostname);
    if (!authorized(request, config.apiKey)) return json({ error: 'Unauthorized' }, 401);
    // Resolve the same full-state catalog used by push; no caller-controlled locale,
    // host or currency can select another store or change product image URLs.
    const catalog = (await currentCatalog(undefined, undefined, config.storeId)).sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    if (resource === 'ping') return json({ ok: true });

    const params = new URL(request.url).searchParams;
    for (const name of ['cursor', 'updated_since', 'limit']) {
      if (params.getAll(name).length > 1) throw new PullError(`Duplicate ${name} parameter`);
    }
    let since = dateFilter(params.get('updated_since'));
    const rawCursor = params.get('cursor');
    const cursor = rawCursor ? decodeCursor(rawCursor, config) : null;
    if (cursor) {
      if (params.get('updated_since') && since !== cursor.since) throw new PullError('Cursor does not match updated_since');
      since = cursor.since; // TopOMS may follow the next page using only cursor.
      if (cursor.revision !== digest(catalog)) throw new PullError('Catalog changed; restart pagination without a cursor', 409);
    }
    // Inclusive boundary: a client replaying the last timestamp cannot skip changes.
    const products = catalog.filter(p => !since || Date.parse(p.updated_at) >= Date.parse(since));
    if (resource === 'count') return json({ count: products.length });

    const rawLimit = params.get('limit') || '50';
    if (!/^\d+$/.test(rawLimit) || Number(rawLimit) < 1 || Number(rawLimit) > MAX_PULL_PAGE_SIZE) {
      throw new PullError(`limit must be an integer between 1 and ${MAX_PULL_PAGE_SIZE}`);
    }
    const limit = Number(rawLimit);
    const previousIndex = cursor ? products.findIndex(p => p.id === cursor.after) : -1;
    if (cursor && previousIndex === -1) throw new PullError('Invalid cursor position');
    const page = products.slice(previousIndex + 1, previousIndex + 1 + limit);
    const hasNextPage = previousIndex + 1 + page.length < products.length;
    const nextCursor = hasNextPage ? encodeCursor({ version: 1, store: config.storeId, locale: config.locale,
      revision: digest(catalog), after: page[page.length - 1].id, since }, config) : null;
    return json({ products: page, next_cursor: nextCursor, has_next_page: hasNextPage });
  } catch (error) {
    if (error instanceof PullError) return json({ error: error.message }, error.status);
    // Configuration failures must not disclose keys or backend details.
    return json({ error: 'TopOMS catalog is unavailable; check server configuration' }, 503);
  }
}
