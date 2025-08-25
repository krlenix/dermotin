'use client';

import { AlertTriangle, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import { STOCK_THRESHOLDS } from '@/config/constants';

interface StockIndicatorProps {
  stock: number;
  lowStockThreshold?: number;
  className?: string;
}

export function StockIndicator({ 
  stock, 
  lowStockThreshold = STOCK_THRESHOLDS.lowStock,
  className 
}: StockIndicatorProps) {
  const tUrgency = useTranslations('urgency');
  const tProduct = useTranslations('product');
  
  const isLowStock = stock <= lowStockThreshold;
  const isOutOfStock = stock === STOCK_THRESHOLDS.outOfStock;

  if (isOutOfStock) {
    return (
      <div className={`flex items-center gap-2 p-3 bg-red-100 border border-red-200 rounded-lg ${className}`}>
        <Package className="h-5 w-5 text-red-600" />
        <span className="text-red-800 font-medium">{tProduct('out_of_stock')}</span>
      </div>
    );
  }

  if (isLowStock) {
    return (
      <div className={`flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg ${className}`}>
        <AlertTriangle className="h-5 w-5 text-orange-600" />
        <div className="flex items-center gap-2">
          <span className="text-orange-800 font-medium">{tUrgency('hurry')} {tUrgency('last_items')}</span>
          <Badge variant="destructive">
            {tUrgency('limited_stock', { count: stock })}
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg ${className}`}>
      <Package className="h-5 w-5 text-green-600" />
      <span className="text-green-800 font-medium">{tProduct('in_stock_count', { count: stock })}</span>
    </div>
  );
}
