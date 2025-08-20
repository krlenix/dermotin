# Localization Setup Guide

## Current Status
The application is currently configured for **Serbian (rs)** only, but the infrastructure is prepared for multi-language expansion.

## Prepared for Future Languages

### Supported Countries & Languages (Ready to Enable)
- **rs** (Serbia) - ✅ **ACTIVE** - Serbian with RSD currency
- **ba** (Bosnia) - 🔧 **PREPARED** - Bosnian with BAM currency 
- **me** (Montenegro) - 🔧 **PREPARED** - Montenegrin with EUR currency
- **eu** (European Union) - 🔧 **PREPARED** - English with EUR currency

## How to Add New Languages

### 1. Create Language File
Create a new JSON file in `src/messages/[locale].json` based on the structure of `src/messages/rs.json`:

```bash
# Example for Bosnia
cp src/messages/rs.json src/messages/ba.json
# Then translate all strings in ba.json to Bosnian
```

### 2. Update Configuration Files

#### `src/middleware.ts`
```typescript
const locales = ['rs', 'ba']; // Add new locale
```

#### `src/i18n.ts`
```typescript
if (!locale || !['rs', 'ba'].includes(locale)) { // Add new locale
  locale = 'rs';
}
```

#### `src/config/countries.ts`
Add the country configuration:
```typescript
export const COUNTRIES: Record<string, CountryConfig> = {
  rs: { /* existing config */ },
  ba: {
    code: 'ba',
    name: 'Bosnia and Herzegovina',
    locale: 'bs-BA',
    currency: 'BAM',
    currencySymbol: 'KM',
    // ... rest of config
  }
};
```

### 3. Update Routing (if using locale prefix)
If you want to use locale prefixes in URLs:

#### `src/middleware.ts`
```typescript
localePrefix: 'always' // Change from 'never' to 'always'
```

Then update routes from `/checkouts/[slug]` to `/[locale]/checkouts/[slug]`

## Current Translation Keys Structure

All translatable strings are organized in these sections:

- `common` - Common UI elements
- `homepage` - Homepage content  
- `product` - Product-related strings
- `urgency` - Urgency/scarcity messages
- `social_proof` - Social proof elements
- `forms` - Form labels and validation
- `checkout` - Checkout process
- `delivery` - Delivery information
- `navigation` - Navigation menu
- `sections` - Page sections
- `testimonials` - Customer testimonials
- `footer` - Footer content
- `gdpr` - GDPR/Cookie consent
- `success` - Success messages
- `bundles` - Product bundles
- `comparison` - Comparison table
- `order_summary` - Order summary
- `testimonials_ui` - Testimonial UI elements
- `upsell` - Upsell components
- `faq_ui` - FAQ interface
- `ingredients` - Product ingredients
- `usage` - Usage instructions
- `details` - Product details
- `offers` - Special offers
- `guarantee` - Guarantee information
- `delivery_schedule` - Delivery schedules
- `shipping` - Shipping information
- `payment_cod` - Cash on delivery
- `placeholders` - Form placeholders
- `cta` - Call-to-action buttons
- `ui` - UI elements (buttons, labels, etc.)
- `currencies` - Currency names
- `locations` - City/location names
- `purchase_notifications` - Purchase notification messages

## Currency Support

The system supports multiple currencies with automatic conversion:
- RSD (Serbian Dinar) - Base currency
- BAM (Bosnia-Herzegovina Convertible Mark) 
- EUR (Euro)

Currency rates are configured in `src/config/countries.ts` and can be updated as needed.

## Files Ready for Localization

### Components Using Translations
- ✅ All hardcoded strings have been extracted
- ✅ Components use `useTranslations()` hook
- ✅ Dynamic content is properly localized

### Infrastructure Ready
- ✅ Next.js i18n configuration
- ✅ Middleware for locale detection
- ✅ Currency conversion system
- ✅ Country-specific configurations
- ✅ Routing structure prepared

## Testing New Languages

1. Add the language file
2. Update configurations
3. Test the application with the new locale
4. Verify all strings are translated
5. Check currency conversion works
6. Test routing and navigation

## Notes

- All components are already using the translation system
- No hardcoded strings remain in the codebase
- The routing structure can handle both single-language and multi-language setups
- Currency selection is prepared but currently shows only the configured currency
