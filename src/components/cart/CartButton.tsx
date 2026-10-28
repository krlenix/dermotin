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
  const { totalItems, openDrawer, isDrawerOpen, isHydrated } = useCart();
  const count = isHydrated ? totalItems : 0;

  return (
    <button
      type="button"
      onClick={openDrawer}
      // CartDrawer vraća fokus na ovo dugme kada se korpa zatvori (i kada pregledač ne fokusira dugme na klik)
      data-cart-button=""
      aria-haspopup="dialog"
      aria-expanded={isDrawerOpen}
      aria-label={count > 0 ? `${t('cart.open_cart')} (${count})` : t('cart.open_cart')}
      className={cn(
        'relative inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-line bg-white text-ink transition-colors hover:border-green hover:text-forest',
        className
      )}
    >
      <ShoppingBag className="h-5 w-5" aria-hidden />
      {count > 0 && (
        <span
          className="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-coral-deep px-1 text-[0.75rem] font-bold leading-none text-white"
          aria-hidden
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}
