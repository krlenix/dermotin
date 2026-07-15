# DERMOTIN - E-commerce Cosmetic Brand Website

A modern, multilingual e-commerce platform for DERMOTIN cosmetic products with advanced landing pages, upselling capabilities, and country-specific customization.

## 🚀 Features

### Core Features
- **Multilingual Support**: Serbian, Bosnian, Montenegrin, and English (EU)
- **Multi-Currency**: RSD, BAM, EUR with automatic country-based defaults
- **Dynamic Routing**: `/[country]/checkouts/[product-slug]` pattern
- **Modular Architecture**: Easy to add new products, languages, and countries
- **GDPR Compliance**: Cookie consent and privacy controls for EU markets

### Sales Optimization
- **Urgency Elements**: Countdown timers, limited stock indicators
- **Social Proof**: Recent purchases, customer reviews, trust badges
- **Multiple Product Slugs**: Different landing pages for the same product
- **Country-specific Pricing**: Localized pricing and company information
- **Responsive Design**: Optimized for all devices

### ✨ Homepage Features
- **Animated Hero Section**: Professional fade-in animations with parallax effects
- **Interactive Product Grid**: Hover animations and staggered card reveals
- **Scroll-Triggered Animations**: Content animates as users scroll down
- **Floating Elements**: Subtle background animations for visual appeal
- **Professional Trust Indicators**: Clean, minimal design with icons
- **Before/After Showcase**: Interactive video preview with hover effects
- **Thank You Page**: Complete order confirmation with progress tracking

### Technical Stack
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **Internationalization**: next-intl v4
- **TypeScript**: Full type safety
- **Build Tool**: Optimized for production deployment

## 📁 Project Structure

```
dermotin/
├── src/
│   ├── app/
│   │   ├── [locale]/                    # Locale-based routing
│   │   │   ├── page.tsx                 # Country-specific homepage
│   │   │   ├── layout.tsx               # Locale layout
│   │   │   └── checkouts/[slug]/        # Product landing pages
│   │   └── layout.tsx                   # Root layout
│   ├── components/
│   │   ├── features/                    # Feature components
│   │   │   ├── UrgencyTimer.tsx         # Countdown timers
│   │   │   ├── SocialProof.tsx          # Social proof elements
│   │   │   ├── StockIndicator.tsx       # Stock status
│   │   │   └── CookieConsent.tsx        # GDPR compliance
│   │   ├── ui/                          # shadcn/ui components
│   │   └── LandingPage.tsx              # Main landing page component
│   ├── config/
│   │   ├── countries.ts                 # Country configurations
│   │   └── products.ts                  # Product definitions
│   ├── hooks/
│   │   ├── useCurrency.ts               # Currency management
│   │   └── useCountry.ts                # Country management
│   ├── messages/                        # Internationalization files
│   │   ├── rs.json                      # Serbian translations
│   │   ├── ba.json                      # Bosnian translations
│   │   ├── me.json                      # Montenegrin translations
│   │   └── eu.json                      # English translations
│   ├── types/                           # TypeScript definitions
│   └── i18n.ts                          # Internationalization config
```

## 🌍 Supported Countries & Currencies

| Country | Code | Currency | Company Entity |
|---------|------|----------|----------------|
| Serbia | `rs` | RSD (дин) | DERMOTIN Serbia DOO |
| Bosnia & Herzegovina | `ba` | BAM (KM) | DERMOTIN BiH DOO |
| Montenegro | `me` | EUR (€) | DERMOTIN Montenegro DOO |
| European Union | `eu` | EUR (€) | DERMOTIN EU B.V. |

## 🛍️ URL Structure

The application follows a specific URL pattern for maximum SEO and flexibility:

```
dermotin.com/[country]/checkouts/[product-slug]/

Examples:
- dermotin.com/rs/checkouts/fungel/
- dermotin.com/ba/checkouts/fungel-promo/
- dermotin.com/me/checkouts/nega-noktiju/
```

### Multiple Slugs Support
Products can have multiple slugs pointing to different landing page variants:
- `fungel` - Standard product page
- `fungel-promo` - Promotional landing page
- `nega-noktiju` - SEO-optimized slug (neutral wording — no medical claims in URLs)

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

4. **Access the Application**
   - Home: `http://localhost:3000/rs` (Serbian)
   - Product: `http://localhost:3000/rs/checkouts/fungel`
   - Thank You: `http://localhost:3000/rs/thank-you`
   - Other countries: `/ba`, `/me`, `/eu`

## 🏠 Homepage Structure

The homepage (`/[locale]/page.tsx`) features a modern, animated design:

### Sections
1. **Animated Header** - Transparent header with scroll effects
2. **Hero Section** - Large title with floating background elements
3. **Trust Indicators** - Clean, minimal trust badges
4. **Product Showcase** - 4-column grid with hover animations
5. **Before/After Section** - Interactive video preview
6. **Why Natural Section** - Educational content with animations
7. **Testimonials** - Customer reviews with business metrics
8. **Footer** - Company information and links

### Animation Features
- **Fade animations** on page load
- **Scroll-triggered reveals** for sections
- **Hover effects** on interactive elements
- **Parallax backgrounds** for visual depth
- **Staggered timing** for professional feel

### Image Sources
- **FUNGEL**: Real product images from `/public/images/products/fungel/`
- **Demo Products**: Professional placeholder images with transparent backgrounds
- **Hero/Content**: High-quality stock photography for lifestyle content

## 🎨 Brand Colors

- **Primary Orange**: `#FF6B35` (brand-orange)
- **Primary Green**: `#608E7E` (brand-green)

These colors are configured in Tailwind CSS and available as utility classes.

## ✨ Animation System

The homepage features a comprehensive animation system built with CSS and JavaScript:

### Animation Classes
- `animate-fadeInLeft` - Content slides in from left
- `animate-fadeInRight` - Content slides in from right  
- `animate-fadeInUp` - Elements rise from bottom
- `animate-float` - Gentle floating motion (6s cycle)
- `animate-slideInScale` - Combined scale and slide effect
- `animate-on-scroll` - Scroll-triggered animations

### Key Features
- **Parallax Effects**: Background elements move at different speeds
- **Staggered Timing**: Sequential appearance with delays
- **Hover Interactions**: Scale, rotate, and glow effects
- **Scroll Triggers**: Elements animate when entering viewport
- **Performance Optimized**: Hardware-accelerated CSS animations

### Usage Example
```tsx
<div className="animate-fadeInLeft">
  <h1 className="animate-fadeInUp" style={{animationDelay: '0.2s'}}>
    Content appears with delay
  </h1>
</div>
```

## 🛠️ Adding New Products

1. **Define Product in Configuration**
   ```typescript
   // src/config/products.ts
   export const PRODUCTS: Record<string, Product> = {
     'new-product': {
       id: 'new-product',
       name: 'New Product Name',
       description: '...',
       images: {
         main: '/images/products/new-product/main.png',
         gallery: ['/images/products/new-product/gallery1.png'],
         thumbnail: '/images/products/new-product/thumb.png'
       },
       variants: [...],
       availableCountries: ['rs', 'ba', 'me', 'eu'],
       slug: 'new-product',
       alternativeSlugs: ['new-product-promo'],
       // ... other properties
     }
   };
   ```

### Demo Products
The system includes demo products for testing:
- **DERMOTIN Foot Cream (DEMO)** - Green themed placeholder
- **DERMOTIN Face Serum (DEMO)** - Orange themed placeholder  
- **DERMOTIN Body Lotion (DEMO)** - Blue themed placeholder

These use transparent background placeholders that maintain consistent branding.

2. **Generate Static Paths**
   Update the `generateStaticParams` function in `/app/[locale]/checkouts/[slug]/page.tsx`

3. **Add Product Images**
   Place images in `public/images/products/[product-id]/`

## 🌐 Adding New Languages

1. **Add Locale to Configuration**
   ```typescript
   // src/i18n.ts
   export const locales = ['rs', 'ba', 'me', 'eu', 'new-locale'] as const;
   ```

2. **Create Translation File**
   ```bash
   # Create src/messages/new-locale.json
   ```

3. **Add Country Configuration**
   ```typescript
   // src/config/countries.ts
   export const COUNTRIES: Record<string, CountryConfig> = {
     'new-locale': {
       // ... country configuration
     }
   };
   ```

4. **Update Middleware**
   Add the new locale to the middleware matcher pattern.

## 🔧 Customization

### Currency Conversion
Update exchange rates in `src/config/countries.ts`:
```typescript
export const CURRENCY_RATES: Record<SupportedCurrency, number> = {
  RSD: 1,      // Base currency
  BAM: 0.5,    // Update with real rates
  EUR: 0.0085  // Update with real rates
};
```

### Urgency Elements
Configure urgency elements per product:
```typescript
urgencyElements: {
  limitedStock: 47,
  limitedTime: '24h',
  socialProof: {
    recentPurchases: 127,
    timeFrame: 'poslednja 24h'
  }
}
```

### GDPR Compliance
The application automatically shows cookie consent for EU countries (`isEU: true`).

## 📱 Mobile Optimization

- Responsive design for all screen sizes
- Touch-friendly interface
- Optimized images and loading
- Progressive Web App ready

## 🔒 Security & Compliance

- GDPR cookie consent for EU markets
- Secure image handling
- Input validation and sanitization
- CSP-ready configuration

## 🚀 Deployment

The application is production-ready and can be deployed to:
- Vercel (recommended for Next.js)
- Netlify
- Any Node.js hosting platform
- Docker containers

## 📊 Analytics & Tracking

The GDPR-compliant cookie system supports:
- Necessary cookies (always enabled)
- Analytics cookies (Google Analytics, etc.)
- Marketing cookies (Facebook Pixel, etc.)
- Functional cookies (chat widgets, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

Copyright © 2024 DERMOTIN. All rights reserved.

---

**Built with ❤️ for DERMOTIN cosmetic brand**#   d e r m o t i n  
 