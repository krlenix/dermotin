# Theme System Documentation

## Overview

Your project now includes a comprehensive theme system with 10 beautiful, selectable design themes. Users can switch between themes in real-time to customize their experience.

## Available Themes

1. **Default** - Classic orange and green theme (your original design)
2. **Yellow & Black** - Bold yellow with black accents
3. **Orange & Black** - Vibrant orange with deep black
4. **Natural** - Earth tones and natural colors
5. **Neutral** - Sophisticated grays and neutrals
6. **Light Blue** - Calm and professional blues
7. **Neon** - Electric neon colors with dark background
8. **Sunset** - Warm sunset gradients
9. **Forest** - Deep forest greens
10. **Ocean** - Deep ocean blues and teals

## How to Use

### Theme Selector Component

The theme selector is automatically added to:
- Main landing page header (desktop only)
- Advanced landing page header (desktop and mobile menu)
- Available as a standalone component

### Accessing Theme Showcase

Visit `/rs/themes` (or your locale) to see all themes with live previews and detailed color palettes.

### Manual Theme Integration

To add the theme selector to other components:

```tsx
import { ThemeSelector } from '@/components/ui/theme-selector';

// Full theme selector with label
<ThemeSelector />

// Compact version without label
<ThemeSelector showLabel={false} />

// For mobile or tight spaces
import { CompactThemeSelector } from '@/components/ui/theme-selector';
<CompactThemeSelector />
```

### Theme Preview Cards

For settings pages or dedicated theme selection:

```tsx
import { ThemePreviewCard } from '@/components/ui/theme-selector';
import { useTheme } from 'next-themes';

const { theme, setTheme } = useTheme();

<ThemePreviewCard
  themeName="yellow-black"
  isSelected={theme === "yellow-black"}
  onSelect={() => setTheme("yellow-black")}
/>
```

## Technical Implementation

### CSS Variables

Each theme defines CSS variables for:
- `--color-primary` - Main brand color
- `--color-secondary` - Supporting color
- `--color-background` - Page background
- `--color-foreground` - Text color
- `--color-card` - Card backgrounds
- `--color-muted` - Subtle backgrounds
- `--color-accent` - Highlight colors
- `--color-border` - Border colors

### Theme Configuration

Themes are configured in `/src/config/themes.ts` with metadata including:
- Name and display label
- Description
- Primary/secondary colors
- Preview colors for the selector

### Storage

Theme preferences are automatically saved to localStorage and persist across sessions.

## Customization

### Adding New Themes

1. Add theme configuration to `/src/config/themes.ts`
2. Add CSS variables in `/src/app/globals.css` following the pattern:
   ```css
   [data-theme="your-theme-name"] {
     --color-primary: /* your color */;
     /* ... other variables */
   }
   ```
3. Add theme name to the themes array in `/src/app/layout.tsx`

### Customizing Colors

Edit the HSL values in the CSS variables. The system uses HSL format for better color manipulation and consistency.

## Browser Support

- Modern browsers with CSS custom properties support
- Fallback to default theme for unsupported browsers
- Automatic theme detection disabled (uses default theme)

## Performance

- Themes are applied via CSS custom properties for instant switching
- No JavaScript color calculations
- Minimal bundle size impact
- Optimized for production builds