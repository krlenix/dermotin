'use client';

import { ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

interface CartButtonProps {
  className?: string;
}

export function CartButton({ className }: CartButtonProps) {
  const t = useTranslations();
  const { totalItems, openDrawer, isHydrated } = useCart();

  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label={t('cart.open_cart')}
      className={cn(
        'relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#358055]/15 bg-white/92 text-slate-700 shadow-[0_8px_18px_rgba(15,23,42,0.06)] backdrop-blur-md transition-colors hover:border-[#F3765D]/35 hover:text-[#F3765D]',
        className
      )}
    >
      <ShoppingBag className="h-5 w-5" />
      {isHydrated && totalItems > 0 && (
        <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F3765D] px-1 text-[11px] font-black text-white shadow-[0_6px_14px_rgba(243,118,93,0.4)]">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
}
