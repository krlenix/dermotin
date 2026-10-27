'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Phone } from 'lucide-react';
import { getCountryConfig, getDefaultCourier } from '@/config/countries';
import { CountrySwitcher } from '@/components/features/CountrySwitcher';
import { CartButton } from '@/components/cart/CartButton';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { formatMoney } from '@/components/store/format';
import { storeFontClass } from '@/components/store/fonts';
import { cn } from '@/lib/utils';

interface ShopHeaderProps {
  /** Viber/kampanjske stranice: bez korpe i navigacije koja odvodi sa ponude */
  minimal?: boolean;
}

/**
 * Zajednički header izloga: tanka traka sa prednostima kupovine + sticky navigacija.
 */
export function ShopHeader({ minimal = false }: ShopHeaderProps) {
  const t = useTranslations('store');
  const tNav = useTranslations();
  const locale = useLocale();
  const countryConfig = getCountryConfig(locale);
  const courier = getDefaultCourier(countryConfig);

  const perks = [
    t('bar.cod'),
    t('bar.delivery', { time: courier.deliveryTime }),
    t('bar.free_shipping', { amount: formatMoney(countryConfig.business.freeShippingThreshold, countryConfig) }),
    t('bar.returns', { days: countryConfig.business.returnPeriodDays }),
  ];
  // Mobilni: jedna poruka u isto vreme (prva se ponavlja na kraju zbog besprekidne petlje)
  const ticker = [perks[0], perks[1], perks[3], perks[0]];

  return (
    <>
      <div className={cn(storeFontClass, 'relative z-[141] bg-forest text-paper')}>
        <div className="container mx-auto hidden h-9 items-center justify-center gap-3 px-4 text-[12.5px] tracking-[0.02em] text-paper/85 md:flex">
          {perks.map((text, index) => (
            <span key={text} className="inline-flex items-center gap-3 whitespace-nowrap">
              {index > 0 && <span className="h-1 w-1 rounded-full bg-paper/35" />}
              {text}
            </span>
          ))}
        </div>
        <div className="h-9 overflow-hidden md:hidden">
          <div className="store-ticker">
            {ticker.map((text, index) => (
              <p key={`${text}-${index}`} className="flex h-9 items-center justify-center text-[12.5px] tracking-[0.02em] text-paper/85">
                {text}
              </p>
            ))}
          </div>
        </div>
      </div>

      <header className={cn(storeFontClass, 'sticky top-0 z-[140] border-b border-line bg-paper/90 backdrop-blur-xl')}>
        <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 md:h-[76px]">
          <div className="flex items-center gap-10">
            <Link href={`/${locale}`} className="inline-flex shrink-0 items-center">
              <Image
                src={countryConfig.logo}
                alt={tNav('ui.alt_logo')}
                width={150}
                height={42}
                className="h-7 w-auto md:h-8"
                priority
              />
            </Link>

            {!minimal && (
              <nav className="hidden items-center gap-8 text-[14.5px] font-medium text-ink/75 md:flex">
                <Link href={`/${locale}#akcije`} className="relative transition-colors hover:text-ink">
                  {t('nav.offers')}
                  <span className="absolute -right-2.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-coral" />
                </Link>
                <Link href={`/${locale}/products`} className="transition-colors hover:text-ink">
                  {t('nav.all_products')}
                </Link>
                <Link href={`/${locale}/contact`} className="transition-colors hover:text-ink">
                  {tNav('navigation.contact')}
                </Link>
              </nav>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {!minimal && (
              <Link
                href={`/${locale}/products`}
                className="rounded-full border border-ink/15 px-4 py-2 text-[13px] font-semibold text-ink md:hidden"
              >
                {t('nav.shop')}
              </Link>
            )}
            {countryConfig.company.phone && (
              <a
                href={`tel:${countryConfig.company.phone}`}
                className={cn(
                  'items-center gap-2 text-[14px] font-medium text-ink/75 transition-colors hover:text-ink',
                  minimal ? 'inline-flex' : 'hidden lg:inline-flex'
                )}
              >
                <Phone className="h-4 w-4 text-moss" strokeWidth={1.6} />
                {countryConfig.company.phone}
              </a>
            )}
            {!minimal && <CountrySwitcher variant="ghost" />}
            {!minimal && <CartButton />}
          </div>
        </div>
      </header>

      {!minimal && <CartDrawer />}
    </>
  );
}
