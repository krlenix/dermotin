# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Next.js) on http://localhost:3000
npm run build        # Production build
npm run start        # Serve production build
npm run lint         # ESLint (eslint-config-next)
npm run analyze      # Build with bundle analyzer (ANALYZE=true)
```

There is no test runner configured. `ts-node` is available and is used for standalone scripts.

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
- Prices are stored in each variant's own `currency` (usually RSD) and converted at read time via `convertCurrency` / `getProductVariantsForCountry`. Conversion rates are hardcoded in `src/config/countries.ts` and duplicated in `getProductPrice` — keep them in sync.

### Routing surface (`src/app`)

- `[locale]/checkouts/[slug]` — funnel-style landing + checkout (the primary conversion flow, `LandingPage.tsx` + `CheckoutFormV2.tsx`).
- `[locale]/products` and `[locale]/products/[slug]` — classic catalog/product pages with the shopping cart (`CartDrawer`).
- `[locale]/checkout` — cart checkout. `[locale]/thank-you`, `[locale]/contact`.
- `app/checkouts/[slug]` (no locale) also exists — legacy/non-localized entry.
- Various `*-test` / `*-demo` routes (`geolocation-test`, `test-marketing`, `capi-test`, …) are internal QA pages, not production surface.

### Order & tracking pipeline

`POST /api/orders` (`src/app/api/orders/route.ts`) is the core order intake: validates, computes totals (coupons/BOGO in `src/config/coupons.ts` + `src/utils/bogo-cookies.ts`), persists via `OrderService` (`src/lib/supabase.ts`), and fires the Meta CAPI Purchase event (`src/lib/capi.ts`). It has an **in-memory idempotency cache** keyed on browser-generated `eventId` to dedupe double-submits — this is per-instance and would need Redis for multi-instance deploys. Marketing attribution (fbc/fbp, UTMs) flows from cookies via `src/utils/marketing-cookies.ts`.

`GET /api/products-sync?locale=rs` (`src/lib/products-sync.ts`) exposes the catalog in an external OMS/feed format — used for downstream integration. Webhook targets per country live in `CountryConfig.webhooks`.

### Config-driven content

Most page content is data, not JSX: `src/config/` holds `faq.ts`, `ingredients.ts`, `testimonials.ts`, `coupons.ts`, `images.ts`, `constants.ts` (+ `app-config.ts` re-exported through it), and the `wheel/` gamification config. UI strings are in `src/messages/{rs,ba,me}.json`. When changing copy, check whether it belongs in a `messages/*.json` file or a `config/*.ts` module before editing components.

### Environment / integrations

Env vars (see `.env.example`): `NEXT_PUBLIC_DOMAIN`, `NEXT_PUBLIC_APP_URL`, and per-country tracking pixel IDs (`NEXT_PUBLIC_META_PIXEL_{CC}`, `NEXT_PUBLIC_TIKTOK_PIXEL_{CC}`, `NEXT_PUBLIC_GOOGLE_TAG_{CC}`). Supabase and CAPI tokens are also read from env. Geolocation uses `@vercel/functions` `geolocation()` (Vercel-only; wrapped in try/catch so it degrades gracefully off-Vercel).

## Conventions

- The `README.md` is partly outdated (references an `eu` locale and next-intl v4 that no longer match the code) — trust the source files over the README for locale/version details.
- Brand colors: `brand-orange` `#FF6B35`, `brand-green` `#608E7E` (Tailwind utilities).
- Serbian (Latin) is the primary content language; preserve diacritics (č, ć, š, ž, đ) in all copy and JSON.
