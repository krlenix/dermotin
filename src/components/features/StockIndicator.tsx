'use client';

import { AlertTriangle, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';

interface StockIndicatorProps {
  stock: number;
  lowStockThreshold?: number;
  className?: string;
}

export function StockIndicator({ 
  stock, 
  lowStockThreshold = 10,
  className 
}: StockIndicatorProps) {
  const t = useTranslations('urgency');
  
  const isLowStock = stock <= lowStockThreshold;
  const isOutOfStock = stock === 0;

  if (isOutOfStock) {
    return (
      <div className={`flex items-center gap-2 p-3 bg-red-100 border border-red-200 rounded-lg ${className}`}>
        <Package className="h-5 w-5 text-red-600" />
        <span className="text-red-800 font-medium">Nema na stanju</span>
      </div>
    );
  }

  if (isLowStock) {
    return (
      <div className={`flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg ${className}`}>
        <AlertTriangle className="h-5 w-5 text-orange-600" />
        <div className="flex items-center gap-2">
          <span className="text-orange-800 font-medium">{t('hurry')} {t('last_items')}</span>
          <Badge variant="destructive">
            {t('limited_stock', { count: stock })}
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg ${className}`}>
      <Package className="h-5 w-5 text-green-600" />
      <span className="text-green-800 font-medium">Na stanju: {stock} komada</span>
    </div>
  );
}
