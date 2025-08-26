export const HOMEPAGE_IMAGES = {
  hero: {
    main: "/images/main/hero-image.webp",
    background: "/images/main/hero-bg.jpg"
  },
  beforeAfter: {
    main: "/images/main/video-image.webp",
    comparison: "/images/main/before-after-comparison.jpg"
  },
  naturalScience: {
    main: "/images/main/third-image.webp",
    background: "/images/main/natural-science-bg.jpg"
  },
  trust: {
    dermatologicallyTested: "/images/main/trust-dermatologically-tested.jpg",
    naturalIngredients: "/images/main/trust-natural-ingredients.jpg",
    clinicallyProven: "/images/main/trust-clinically-proven.jpg",
    noParabens: "/images/main/trust-no-parabens.jpg"
  },
  products: {
    showcase: "/images/main/products-showcase.jpg",
    featured: "/images/main/products-featured.jpg"
  }
};

export const getImagePath = (key: string): string => {
  // For now, return the default path
  // In the future, this can be extended to support locale-specific images
  const imagePaths: Record<string, string> = {
    ...HOMEPAGE_IMAGES.hero,
    ...HOMEPAGE_IMAGES.beforeAfter,
    ...HOMEPAGE_IMAGES.naturalScience,
    ...HOMEPAGE_IMAGES.trust,
    ...HOMEPAGE_IMAGES.products
  };
  
  return imagePaths[key] || key;
};
