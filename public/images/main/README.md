# Homepage Images

This directory contains all images used on the homepage. All images are now centralized and configurable through the `src/config/images.ts` file.

## Image Structure

### Hero Section
- `hero-image.webp` - Main hero image (woman with product boxes)
- `hero-bg.jpg` - Hero background image

### Before/After Section
- `banner-image.jpg` - Main before/after comparison image (woman touching neck)
- `before-after-comparison.jpg` - Additional comparison image

### Natural Science Section
- `third-image.jpg` - Main natural science image (woman in fur coat with product)
- `natural-science-bg.jpg` - Natural science background image

## Localization

To add locale-specific images:
1. Create subdirectories for each locale (e.g., `rs/`, `en/`, `hr/`)
2. Update the `getImagePath` function in `src/config/images.ts`
3. Add locale-specific image paths

## Maintenance

- All image paths are managed through `HOMEPAGE_IMAGES` configuration
- No hardcoded image URLs in components
- Easy to update and maintain across different locales
