'use client';

import { CheckCircle2, ShieldCheck, Star } from 'lucide-react';
import { Product } from '@/config/products';
import { CountryConfig } from '@/config/countries';
import { EnhancedImageGallery } from '@/components/features/EnhancedImageGallery';
import { SATISFIED_CUSTOMERS } from '@/components/product-page/ProofSection';

interface HeroSectionProps {
  product: Product;
  countryConfig: CountryConfig;
  onOrderClick: () => void;
  ctaText: string;
}

export function HeroSection({ product, countryConfig, onOrderClick, ctaText }: HeroSectionProps) {
  const reviewCount = product.testimonials?.length ?? 0;
  const benefitPreview = product.benefits.slice(0, 3);
  const featuredVariant = product.variants[0];
  const featuredPrice = featuredVariant.discountPrice ?? featuredVariant.price;
  const heroTitlePrefix = 'Recite stop ';
  const hasHighlightedHeroTitle = product.heroTitle.startsWith(heroTitlePrefix);
  const heroTitleLead = hasHighlightedHeroTitle ? heroTitlePrefix : '';
  const heroTitleAccent = hasHighlightedHeroTitle ? product.heroTitle.slice(heroTitlePrefix.length) : product.heroTitle;

  return (
    <section id="hero" className="relative overflow-hidden pt-24 md:pt-30 lg:pt-34 pb-8 md:pb-10">
      <div className="absolute inset-0 organic-hero-surface" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,142,126,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,107,53,0.08),transparent_20%)]" />

      <div className="container mx-auto px-4 relative">
        <div className="section-card-strong overflow-hidden px-5 py-6 md:px-8 md:py-8 lg:px-10 lg:py-9">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-6 order-2 lg:order-1">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full border border-[#358055]/20 bg-[#358055]/10 px-3 py-1 text-[13px] font-extrabold tracking-[0.01em] text-[#2f6f4a]">
                  {product.name}
                </span>
                <span className="inline-flex items-center rounded-full border border-[#F3765D]/20 bg-[#F3765D]/10 px-3 py-1 text-[13px] font-extrabold tracking-[0.01em] text-[#ba5a47]">
                  Akcijska cena
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.14] tracking-[-0.01em] text-slate-900">
                  {hasHighlightedHeroTitle ? (
                    <>
                      {heroTitleLead}
                      <span className="inline-block rounded-[5px] bg-[#F3765D] px-[8px] py-[4px] mr-[5px] text-white md:px-[5px] md:py-[2px] lg:px-[4px] lg:py-[1px]">
                        {heroTitleAccent}
                      </span>
                    </>
                  ) : (
                    product.heroTitle
                  )}
                </h1>
                <p className="max-w-2xl text-lg md:text-xl text-slate-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-700">
                <div className="liquid-glass-soft inline-flex items-center gap-2 rounded-full px-4 py-2">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="font-semibold">4.97/5</span>
                </div>
                <div className="liquid-glass-soft inline-flex items-center gap-2 rounded-full px-4 py-2">
                  <ShieldCheck className="h-4 w-4 text-[#358055]" />
                  <span className="font-medium">
                    Preko {SATISFIED_CUSTOMERS.toLocaleString('sr-RS')} zadovoljnih kupaca
                  </span>
                </div>
              </div>

              <div className="divide-y divide-[#358055]/10">
                {benefitPreview.map((benefit) => (
                  <div key={benefit} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full bg-[#358055]/10 p-1.5">
                        <CheckCircle2 className="h-4 w-4 text-[#358055]" />
                      </div>
                      <p className="text-sm font-medium text-slate-700">{benefit}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={onOrderClick}
                  className="inline-flex items-center justify-center rounded-full bg-[#F3765D] px-8 py-4 text-base font-extrabold text-white shadow-[0_18px_36px_rgba(243,118,93,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e0654d]"
                >
                  {ctaText}
                </button>
              </div>

            </div>

            <div className="order-1 lg:order-2">
              <div className="relative mx-auto max-w-2xl">
                <div className="absolute -top-5 -left-5 hidden h-24 w-24 rounded-full bg-[#F3765D]/15 blur-2xl md:block" />
                <div className="absolute -right-4 bottom-10 hidden h-28 w-28 rounded-full bg-[#358055]/15 blur-2xl md:block" />

                <EnhancedImageGallery
                  images={product.images}
                  productName={product.name}
                  className="w-full"
                  priority={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
