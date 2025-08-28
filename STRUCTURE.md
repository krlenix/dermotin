# Dermotin Project Structure

## Overview
This document provides a comprehensive overview of the Dermotin e-commerce project structure, including architecture, configuration, and potential hardcoded values that need attention.

## Project Architecture

### Root Level
```
dermotin/
├── components.json          # Shadcn/ui component configuration
├── DEPLOYMENT_CHECKLIST.md  # Deployment guidelines
├── eslint.config.mjs        # ESLint configuration
├── LOCALIZATION_SETUP.md    # Localization setup guide
├── next.config.ts           # Next.js configuration
├── package.json             # Dependencies and scripts
├── postcss.config.mjs       # PostCSS configuration
├── tsconfig.json            # TypeScript configuration
├── WHEEL_OF_FORTUNE_*.md    # Wheel of Fortune documentation
└── README.md                # Project documentation
```

### Source Code Structure (`src/`)

#### Application Routes (`app/`)
```
app/
├── [locale]/                # Internationalized routes
│   ├── checkouts/[slug]/    # Localized checkout pages
│   ├── contact/             # Contact page
│   ├── thank-you/           # Thank you page
│   └── layout.tsx           # Localized layout
├── api/                     # API routes
│   ├── legal-document/      # Legal document API
│   └── orders/              # Order processing API
├── checkouts/[slug]/        # Non-localized checkout fallback
├── favicon.ico              # Site favicon
├── globals.css              # Global styles
├── layout.tsx               # Root layout
└── page.tsx                 # Root page
```

#### Components (`components/`)
```
components/
├── features/                # Feature-specific components
│   ├── AdvancedFAQ.tsx
│   ├── AdvancedTestimonials.tsx
│   ├── BundleSelector.tsx
│   ├── CheckoutForm.tsx     # Main checkout functionality
│   ├── ComparisonTable.tsx
│   ├── CookieConsent.tsx
│   ├── CourierSelector.tsx
│   ├── EnhancedImageGallery.tsx
│   ├── LegalDocumentModal.tsx
│   ├── ProductDetailsAccordion.tsx
│   ├── PurchaseNotifications.tsx
│   ├── RotatingReview.tsx
│   ├── SocialProof.tsx
│   ├── StockIndicator.tsx
│   ├── UpsellCrossSell.tsx
│   └── UrgencyTimer.tsx
├── tracking/                # Analytics and tracking
│   ├── index.ts
│   └── PixelTracker.tsx
├── ui/                      # Reusable UI components
├── wheel-of-fortune/        # Wheel of Fortune feature
└── [Page Components]        # Main page components
```

#### Configuration (`config/`)
```
config/
├── locales/                 # Localization configurations
│   ├── ba/products.ts       # Bosnian product data
│   ├── rs/products.ts       # Serbian product data
│   └── index.ts             # Locale configuration
├── wheel/                   # Wheel of Fortune config
├── app-config.ts            # Application configuration
├── constants.ts             # Application constants
├── countries.ts             # Country data
├── faq.ts                   # FAQ configuration
├── images.ts                # Image paths
├── ingredients.ts           # Product ingredients
├── pixels.ts                # Tracking pixels
├── products.ts              # Product configuration
├── testimonials.ts          # Testimonials data
└── types.ts                 # Type definitions
```

#### Internationalization
```
messages/
├── ba.json                  # Bosnian translations
└── rs.json                  # Serbian translations

i18n.ts                      # i18n configuration
middleware.ts                # Locale middleware
```

#### Utilities and Hooks
```
hooks/                       # Custom React hooks
lib/                         # Utility libraries
utils/                       # Utility functions
types/                       # TypeScript type definitions
```

### Public Assets (`public/`)
```
public/
├── images/
│   ├── couriers/            # Courier logos
│   ├── main/                # Main site images
│   ├── products/            # Product images
│   └── testimonials/        # Testimonial images
└── [SVG icons]              # Site icons
```

## Configuration Analysis

### Localization Structure
- **Supported Locales**: `ba` (Bosnian), `rs` (Serbian)
- **Translation Files**: JSON format in `messages/` directory
- **Product Localization**: Separate files in `config/locales/[locale]/products.ts`

### Product Configuration
- **Main Config**: `config/products.ts` - Contains product slugs and basic info
- **Localized Data**: Detailed product information in locale-specific files
- **Images**: Organized by product in `public/images/products/`

### Tracking and Analytics
- **Pixel Configuration**: `config/pixels.ts`
- **Tracking Components**: `components/tracking/`

## Potential Areas for Hardcoded Values Review

### High Priority
1. **API Endpoints**: Check for hardcoded URLs in API routes
2. **External Services**: Payment processors, shipping APIs
3. **Contact Information**: Email addresses, phone numbers
4. **Currency and Pricing**: Fixed currency codes or prices
5. **Domain References**: Hardcoded domain names or URLs

### Medium Priority
1. **Image Paths**: Absolute paths that should be relative
2. **Color Codes**: CSS colors that should use design tokens
3. **Text Content**: Strings that should be localized
4. **Configuration Values**: Settings that should be environment-based

### Low Priority
1. **Component Props**: Default values that could be configurable
2. **Animation Timings**: Fixed durations that could be variables
3. **Layout Dimensions**: Fixed sizes that could be responsive

## Maintenance Guidelines

### Adding New Products
1. Add product slug to `config/products.ts`
2. Create localized product data in `config/locales/[locale]/products.ts`
3. Add product images to `public/images/products/[product-name]/`
4. Update translations in `messages/[locale].json`

### Adding New Locales
1. Create new locale directory in `config/locales/[locale]/`
2. Add translation file in `messages/[locale].json`
3. Update locale configuration in `config/locales/index.ts`
4. Update middleware.ts for new locale routing

### Configuration Management
- Environment variables should be used for API keys, URLs, and deployment-specific settings
- Hardcoded values should be moved to configuration files
- Design tokens should be used for consistent styling

## Hardcoded Values Audit Results

### ✅ GOOD - Already Configurable
The project shows excellent configuration management with most values properly externalized:

1. **Company Information**: All company details (addresses, phone numbers, tax numbers) are in `config/countries.ts`
2. **Product Data**: Properly organized in locale-specific files under `config/locales/`
3. **Translations**: All user-facing text is in `messages/[locale].json` files
4. **Templates**: Legal documents use placeholder templates in `src/templates/`
5. **Pixel Tracking**: Organized in `config/pixels.ts` with clear placeholders
6. **Business Logic**: Animation timings, thresholds, and UI constants in `config/app-config.ts`

### ⚠️ ATTENTION NEEDED - Hardcoded Values Found

#### High Priority Issues
1. **Social Media URLs** (`src/config/app-config.ts:153-155`):
   ```typescript
   facebook: 'https://facebook.com/dermotin',
   instagram: 'https://instagram.com/dermotin',
   youtube: 'https://youtube.com/@dermotin',
   ```
   **Recommendation**: Move to country-specific configuration or environment variables

2. **Domain Fallback** (`src/lib/utils.ts:30`):
   ```typescript
   : 'https://dermotin.com'
   ```
   **Recommendation**: Use environment variable `NEXT_PUBLIC_DOMAIN`

3. **Email Addresses** (`src/config/countries.ts:128,197`):
   ```typescript
   email: 'info@dermotin.com',
   ```
   **Recommendation**: Already using COMPANY_EMAIL placeholder in memory - good practice!

4. **Placeholder Pixel IDs** (`src/config/pixels.ts:26,30`):
   ```typescript
   pixelId: '12345', // Replace with actual Meta Pixel ID for Serbia
   pixelId: '54321', // Replace with actual TikTok Pixel ID for Serbia
   ```
   **Status**: Clearly marked as placeholders - needs real IDs for production

#### Medium Priority Issues
1. **Bosnia Example URLs** (`src/config/countries.ts:240-241`):
   ```typescript
   ministryWebsite: 'https://example.ba',
   disputeResolutionListUrl: 'https://example.ba/disputes'
   ```
   **Status**: Clearly marked as examples - needs real URLs

2. **Tracking URLs**: PostExpress and Pošte Srpske URLs are hardcoded but appear to be correct
   **Status**: Acceptable as these are official courier websites

#### Low Priority Issues
1. **Root Page Hardcoded Text** (`src/app/page.tsx:26,107`):
   - Contains "dermatološki" and "klinički" terms that user prefers to avoid [[memory:7512797]]
   - Text: "Prirodni dermatološki proizvodi" and "Klinički testirani"
   **Recommendation**: Update to use "laboratorijski" terminology

### 🔧 Recommended Actions

#### Immediate (Before Production)
1. **Replace Pixel IDs**: Update `src/config/pixels.ts` with real tracking IDs
2. **Update Bosnia URLs**: Replace example.ba URLs with real government websites
3. **Set Environment Variables**:
   ```bash
   NEXT_PUBLIC_DOMAIN=dermotin.com
   NEXT_PUBLIC_META_PIXEL_RS=your_real_pixel_id
   NEXT_PUBLIC_TIKTOK_PIXEL_RS=your_real_pixel_id
   ```

#### Content Updates
1. **Fix Terminology** (`src/app/page.tsx`):
   - Change "dermatološki" → "laboratorijski"
   - Change "klinički testirani" → "laboratorijski testirani"

#### Optional Improvements
1. **Social Media Configuration**: Move to country-specific or environment-based configuration
2. **Email Configuration**: Consider country-specific email addresses if needed

### 🎯 Configuration Quality Score: 8.5/10

**Strengths**:
- Excellent separation of concerns
- Comprehensive country-specific configuration
- Proper use of translation files
- Template-based legal documents
- Clear placeholder marking

**Areas for Improvement**:
- A few remaining hardcoded URLs
- Some placeholder values need real data
- Minor terminology preferences not followed

### Environment Variables Setup
Create a `.env.local` file with:
```bash
# Domain Configuration
NEXT_PUBLIC_DOMAIN=dermotin.com
NEXT_PUBLIC_APP_URL=https://dermotin.com

# Tracking Pixels - Serbia
NEXT_PUBLIC_META_PIXEL_RS=your_meta_pixel_id
NEXT_PUBLIC_TIKTOK_PIXEL_RS=your_tiktok_pixel_id

# Tracking Pixels - Bosnia
NEXT_PUBLIC_META_PIXEL_BA=your_meta_pixel_id_ba
NEXT_PUBLIC_TIKTOK_PIXEL_BA=your_tiktok_pixel_id_ba

# Social Media (Optional)
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/dermotin
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/dermotin
NEXT_PUBLIC_YOUTUBE_URL=https://youtube.com/@dermotin
```

## Next Steps
- [x] Complete hardcoded values audit
- [ ] Update pixel IDs with real values
- [ ] Fix terminology in root page
- [ ] Add Bosnia government URLs
- [ ] Set up environment variables
- [ ] Create design token system (optional)
- [ ] Document API integrations

---
*Last updated: January 2025*
*Status: ✅ Hardcoded values audit completed - 8.5/10 configuration quality*
