'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Product } from '@/config/products';
import { CountryConfig } from '@/config/countries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UrgencyTimer } from '@/components/features/UrgencyTimer';
import { SocialProof } from '@/components/features/SocialProof';
import { StockIndicator } from '@/components/features/StockIndicator';
import { CookieConsent } from '@/components/features/CookieConsent';
import { EnhancedImageGallery } from '@/components/features/EnhancedImageGallery';
import { ProductDetailsAccordion } from '@/components/features/ProductDetailsAccordion';
import { Footer } from '@/components/ui/footer';
import { useCurrency } from '@/hooks/useCurrency';
import { SupportedCurrency } from '@/config/countries';
import { ShoppingCart, Star, Shield, Truck } from 'lucide-react';

interface LandingPageProps {
  product: Product;
  countryConfig: CountryConfig;
  slug: string;
  locale?: string;
}

export function LandingPage({ product, countryConfig, locale = 'rs' }: LandingPageProps) {
  const t = useTranslations();
  const { formatPrice } = useCurrency(countryConfig.currency as SupportedCurrency);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log('Adding to cart:', {
      product: product.id,
      variant: selectedVariant.id,
      quantity,
      price: selectedVariant.discountPrice || selectedVariant.price
    });
  };

  const totalPrice = (selectedVariant.discountPrice || selectedVariant.price) * quantity;
  const originalPrice = selectedVariant.price * quantity;
  const hasDiscount = selectedVariant.discountPrice && selectedVariant.discountPrice < selectedVariant.price;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-brand-green">{t('ui.alt_logo')}</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600">
                {countryConfig.currencySymbol}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <EnhancedImageGallery 
            images={product.images}
            productName={product.name}
            className="w-full"
          />

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-600 text-lg">{product.shortDescription}</p>
            </div>

            {/* Urgency Elements */}
            <div className="space-y-4">
              {product.urgencyElements.limitedTime && (
                <UrgencyTimer duration={24} />
              )}
              {product.urgencyElements.limitedStock && (
                <StockIndicator stock={product.urgencyElements.limitedStock} />
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-brand-orange">
                  {formatPrice(totalPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>
              {hasDiscount && (
                <Badge variant="destructive" className="text-sm">
                  {t('ui.save_money')} {formatPrice(originalPrice - totalPrice)}
                </Badge>
              )}
            </div>

            {/* Variant Selection */}
            {product.variants.length > 1 && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('product.variants')}
                </label>
                <Select value={selectedVariant.id} onValueChange={(value) => {
                  const variant = product.variants.find(v => v.id === value);
                  if (variant) setSelectedVariant(variant);
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {product.variants.map((variant) => (
                      <SelectItem key={variant.id} value={variant.id}>
                        {variant.name} - {formatPrice(variant.discountPrice || variant.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-2">{t('ui.quantity')}</label>
              <Select value={quantity.toString()} onValueChange={(value) => setQuantity(parseInt(value))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Add to Cart */}
            <div className="space-y-3">
              <Button 
                onClick={handleAddToCart}
                className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white text-lg py-6"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {t('common.add_to_cart')} - {formatPrice(totalPrice)}
              </Button>
              
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600 bg-brand-green/10 rounded-lg py-3 px-4">
                <div className="flex items-center gap-1">
                  <Truck className="h-4 w-4 text-brand-green" />
                  <span>{t('common.free_shipping')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-brand-green" />
                  <span>{t('social_proof.money_back_guarantee')}</span>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <SocialProof 
              recentPurchases={product.urgencyElements.socialProof?.recentPurchases}
              timeFrame={product.urgencyElements.socialProof?.timeFrame}
            />
          </div>
        </div>

        {/* Product Benefits - Quick Overview */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-8">{t('product.benefits')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {product.benefits.map((benefit, index) => (
              <div key={index} className="text-center p-4 border rounded-lg bg-green-50 border-green-200">
                <div className="w-12 h-12 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-brand-orange" />
                </div>
                <p className="text-sm font-medium">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Product Information Accordion */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">{t('sections.detailed_information')}</h2>
          <ProductDetailsAccordion product={product} />
        </div>
      </main>

      {/* Footer */}
      <Footer countryConfig={countryConfig} locale={locale} />

      {/* GDPR Cookie Consent for EU */}
      <CookieConsent isEU={countryConfig.isEU} />
    </div>
  );
}
