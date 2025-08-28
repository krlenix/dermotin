'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getProduct, Product } from '@/config/products';

import { useTranslations } from 'next-intl';
import { Plus, Star, Gift, Sparkles, Check } from 'lucide-react';
import { CountryConfig, SupportedCurrency } from '@/config/countries';

interface UpsellCrossSellProps {
  mainProductId: string;
  onAddToBundle: (productId: string, price: number) => void;
  className?: string;
  countryConfig?: CountryConfig;
}

export function UpsellCrossSell({ mainProductId, onAddToBundle, className, countryConfig }: UpsellCrossSellProps) {
  // Simple price formatter using the country's currency symbol (no conversion)
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('sr-RS', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount) + ' ' + (countryConfig?.currencySymbol || 'din');
  };
  const t = useTranslations();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);


  const [mainProduct, setMainProduct] = useState<Product | null>(null);
  const [crossSellProducts, setCrossSellProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const product = await getProduct(mainProductId);
        setMainProduct(product || null);
        
        if (product?.crossSells) {
          const crossSells = await Promise.all(
            product.crossSells.map(id => getProduct(id))
          );
          setCrossSellProducts(crossSells.filter(Boolean) as Product[]);
        }
      } catch (error) {
        console.error('Failed to load products:', error);
        setMainProduct(null);
        setCrossSellProducts([]);
      }
    };
    
    loadProducts();
  }, [mainProductId]);

  if (!mainProduct?.crossSells) return null;

  const handleAddItem = (productId: string, price: number) => {
    if (selectedItems.includes(productId)) {
      setSelectedItems(prev => prev.filter(id => id !== productId));
    } else {
      setSelectedItems(prev => [...prev, productId]);

    }
    onAddToBundle(productId, price);
  };



  if (crossSellProducts.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Compact Header */}
      <div className="text-center mb-3">
        <Badge className="bg-brand-orange text-white px-3 py-1 text-sm font-bold mb-2">
          <Sparkles className="h-3 w-3 mr-1" />
          {t('upsell.special_offer')}
        </Badge>
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          {t('upsell.add_save_more')}
        </h3>
        <p className="text-sm text-gray-600">
          {t('upsell.combine_products')}
        </p>
      </div>

      {/* Cross-sell Products */}
      <div className="grid gap-2">
        {crossSellProducts.map((product, index) => {
          if (!product) return null;
          
          const isSelected = selectedItems.includes(product.id);
          const variant = product.variants[0];
          const price = variant.discountPrice || variant.price;
          
          return (
            <Card 
              key={product.id}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-md ${
                isSelected 
                  ? 'border-green-400 bg-green-50/30' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              {/* Compact {t('ui.added')} indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 z-10">
                  <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    {t('upsell.added')}
                  </div>
                </div>
              )}

              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {/* Compact Product Image */}
                  <div className="relative w-14 h-14 bg-white rounded-lg overflow-hidden flex-shrink-0 shadow-sm border">
                    <Image
                      src={product.images?.main || '/images/products/fungel/fungel-box-only.png'}
                      alt={product.name}
                      fill
                      className="object-contain p-1.5"
                    />
                    {/* Compact Gift icon */}
                    <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <Gift className="h-2 w-2 text-white" />
                    </div>
                  </div>

                  {/* Compact Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-base text-gray-900 mb-0.5 truncate">
                      {product.name}
                    </h4>
                    <p className="text-xs text-gray-600 mb-1 line-clamp-1">
                      {product.shortDescription}
                    </p>
                    
                    {/* Compact Rating */}
                    <div className="flex items-center gap-1 mb-1">
                      <div className="flex text-yellow-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-2.5 w-2.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">4.9</span>
                    </div>

                    {/* Single benefit */}
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      {product.benefits[0]}
                    </Badge>
                  </div>

                  {/* Compact Price & Action */}
                  <div className="text-right flex-shrink-0">
                    <div className="mb-2">
                      {variant.discountPrice && (
                        <p className="text-xs text-gray-400 line-through">
                          {formatPrice(variant.price)}
                        </p>
                      )}
                      <p className="text-lg font-bold text-brand-orange">
                        {formatPrice(price)}
                      </p>
                    </div>

                    <Button
                      type="button"
                      onClick={() => handleAddItem(product.id, price)}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className={`text-xs px-3 py-1.5 h-auto transition-all duration-300 ${
                        isSelected 
                          ? 'bg-green-500 hover:bg-green-600 text-white' 
                          : 'border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          {t('upsell.added')}
                        </>
                      ) : (
                        <>
                          <Plus className="h-3 w-3 mr-1" />
                          {t('upsell.add')}
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Compact Special Offer Banner */}
                {index === 0 && (
                  <div className="mt-2 p-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-md border border-yellow-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Gift className="h-4 w-4 text-orange-600" />
                        <span className="font-semibold text-orange-800 text-sm">
                          {t('upsell.perfect_combination')}
                        </span>
                      </div>
                      <Badge className="bg-orange-500 text-white text-xs px-2 py-0.5">
                        {t('upsell.most_popular_set')}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>



      <style jsx>{`
        @keyframes bounceIn {
          0% {
            transform: scale(0.3) rotate(180deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.05) rotate(10deg);
          }
          70% {
            transform: scale(0.9) rotate(-5deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
