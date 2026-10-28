# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Authoritative domain mapping — confirmed by Nikola, 2026-09-06

- `dermotin.rs` remains the WordPress/WooCommerce site on our own server, NOT Vercel. The planned migration was not continued because the old site works better.
- `dermotin.com` and `dermotin.shop` point to the same Vercel site; this repository is their source code.
- A stale Vercel alias for `dermotin.rs` does not change this mapping. Work on `.rs` requires the separate WooCommerce source and server access.
- See `AGENTS.md` for the persistent project instructions. This mapping supersedes older deployment notes that group `.com` with the WordPress site.

## Commands

```bash
npm run dev          # Start dev server (Next.js) on http://localhost:3000
npm run build        # Production build
npm run start        # Serve production build
npm run lint         # ESLint (eslint-config-next)
npm test             # node:test suites: TopOMS mapping/outbox + server order guard (no live services)
```

Tests are plain `node --test` files in `tests/` loaded through `scripts/register-ts.cjs` (ts-node). Run `npm test` after touching `src/app/api/orders`, `src/lib/order-guard.ts`, `src/lib/topoms/*`, coupons, shipping or product prices. For a safe local preview use `POKRENI-PREGLED.bat` (orders, OMS, Supabase, Meta and pixels disabled).

Local URLs always require a locale prefix: `/rs`, `/ba`, or `/me` (e.g. `http://localhost:3000/rs/checkouts/fungel`). The bare `/` redirects via geolocation.

## High-level architecture

Multilingual, multi-country cash-on-delivery e-commerce site for the DERMOTIN cosmetics brand. Next.js 15 App Router + React 19 + TypeScript, Tailwind CSS v4, shadcn/ui (Radix), next-intl v3, Supabase (orders), Meta CAPI (server-side conversion tracking). Path alias `@/*` → `src/*`.

### Locales and countries are two separate axes

- **Locale** (`rs` | `ba` | `me`) drives translations and the product catalog. Defined in `src/i18n.ts` and `src/middleware.ts`. `rs` is the fallback everywhere. Note `hr` product data exists under `src/config/locales/hr/` but `hr` is **not** an active locale in the middleware/i18n matchers — do not assume it's routable.
- **Country** (`src/config/countries.ts`) drives currency, company/legal entity, couriers, shipping, webhooks, and pixel IDs. `CountryConfig` is the single source of truth for per-market business data.

When adding a locale you must update **both** `src/i18n.ts` and the `locales` array **and** the `matcher` regex in `src/middleware.ts` (the `/(rs|ba|me)/:path*` pattern is hardcoded in several places, including `next.config.ts` headers).

### Products are localized modules loaded dynamically

`src/config/products.ts` is a thin re-export barrel. The real data lives per-locale in `src/config/locales/{rs,ba,me,hr}/products.ts`, each exporting a `PRODUCTS: Record<string, Product>`. Access is always through the async helpers in `src/config/locales/index.ts` (`getProductsForLocale`, `getProductBySlug`, `getProductsForCountry`, `getProductVariantsForCountry`, etc.) — these `await import()` the right locale module. **Never import a locale's `products.ts` directly**; go through these helpers so the fallback-to-`rs` behavior is preserved.

- A product has one canonical `slug` plus `alternativeSlugs[]` — multiple URLs resolve to the same product (used for A/B landing pages and SEO). `getProductBySlug` matches both.
- Prices are stored in each variant's own `currency` (usually RSD; BA/ME catalogs are native BAM/EUR) and converted at read time via `convertCurrency` / `getProductVariantsForCountry`. Rates live only in `CURRENCY_RATES` in `src/config/countries.ts`.

### Routing surface (`src/app`)

- `[locale]/checkouts/[slug]` — ad landing (the primary conversion flow): `ProductLanding` → `CheckoutLander` (port of the old dermotin.rs lander) + `QuickOrderForm`. No site header, one action. Old `/checkouts/X` ad URLs are rewritten by `src/middleware.ts` + `src/config/legacy-urls.ts`.
- `[locale]/products/[slug]` — same lander with `storefront`: site header (`ShopHeader`) and an „Dodaj u korpu“ button under the form.
- `[locale]/products` — catalog (`ProductsPage`); `[locale]` — home (`HomeStore`); `[locale]/v/[offer]` — Viber campaign (`ViberLanding`, no pixels/CAPI).
- `[locale]/checkout` — cart checkout (`CartCheckoutPage`, cart in `CartDrawer` + `CartContext`). `[locale]/thank-you`, `[locale]/contact`.
- `/admin` — local content editor (writes source files; cannot save on Vercel).

### Order & tracking pipeline

`POST /api/orders` (`src/app/api/orders/route.ts`) is the core order intake. Before anything is persisted it rate-limits per IP and runs `src/lib/order-guard.ts`: zod field validation, then `verifyOrderPricing` re-prices every line from the catalog, re-validates the coupon on the server (`src/lib/coupons-server.ts`) and checks shipping and total — a cheaper-than-catalog order is rejected with 422. Then it persists via `OrderService` (`src/lib/supabase.ts`, service-role key), queues TopOMS + legacy delivery (`src/lib/topoms/*`, durable outbox) and fires the Meta CAPI Purchase (`src/lib/capi.ts`). Responses and logs never contain customer data or internal errors. The in-memory idempotency cache keyed on `eventId` is per-instance; the TopOMS path is deduped in the database.

Coupons: the browser calls `POST /api/coupons/validate`; static coupons (admin panel) and OMS affiliate codes are resolved only on the server. The OMS key is server-only (`AFFILIATE_API_KEY`) — never `NEXT_PUBLIC_*`, never a fallback in source. `/api/capi` accepts browser events except `purchase` (Purchase comes only from `/api/orders`). Pixels: `src/components/tracking/PixelTracker.tsx` + `src/config/pixels.ts` — do not change while doing UI work.

`GET /api/products-sync?locale=rs` (`src/lib/products-sync.ts`) exposes the catalog in an external OMS/feed format — used for downstream integration. Webhook targets per country live in `CountryConfig.webhooks`.

### Config-driven content

Most page content is data, not JSX: `src/config/` holds `lander-content.ts` (lander copy per product), `store-content.ts` (offers, packshots), `store-proof.ts` + `review-shots.ts` (owner-approved proof: customer count, testimonials, review screenshots), `viber-offers.ts`, `faq.ts`, `ingredients.ts`, `coupons.ts`, `constants.ts` (+ `app-config.ts`). Claims must come from `docs/products/*.md`. UI strings are in `src/messages/{rs,ba,me}.json` (rs ekavica, ba/me ijekavica, formal „Vi“). When changing copy, check whether it belongs in a `messages/*.json` file or a `config/*.ts` module before editing components.

### Environment / integrations

Env vars (see `.env.example`): `NEXT_PUBLIC_DOMAIN`, `NEXT_PUBLIC_APP_URL`, and per-country tracking pixel IDs (`NEXT_PUBLIC_META_PIXEL_{CC}`, `NEXT_PUBLIC_TIKTOK_PIXEL_{CC}`, `NEXT_PUBLIC_GOOGLE_TAG_{CC}`). Supabase and CAPI tokens are also read from env. Geolocation uses `@vercel/functions` `geolocation()` (Vercel-only; wrapped in try/catch so it degrades gracefully off-Vercel).

## Conventions

- The `README.md` is partly outdated (references an `eu` locale and next-intl v4 that no longer match the code) — trust the source files over the README for locale/version details.
- Design system: `DESIGN.md` (tokens, contrast rules, components) and `PRODUCT.md` (users, positioning, text rules). Colors come only from the `@theme` tokens in `src/app/globals.css` (`green #2E8655`, `coral #EA684E`, `coral-deep`, `forest`, `mint`, `ink`…) — never hex in components. Font: Poppins (`landerFontClass`), sizes in rem, nothing below 0.75rem.
- After adding new Tailwind classes, clear `.next` before checking locally (stale CSS cache; `npm run build` already clears the webpack cache).
- Serbian (Latin) is the primary content language; preserve diacritics (č, ć, š, ž, đ) in all copy and JSON.
