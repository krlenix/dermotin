'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Banknote, Phone, RotateCcw, Truck } from 'lucide-react';
import { getCountryConfig, getDefaultCourier } from '@/config/countries';
import { CountrySwitcher } from '@/components/features/CountrySwitcher';
import { CartButton } from '@/components/cart/CartButton';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { formatMoney } from '@/components/store/format';
import { landerFontClass } from '@/components/store/fonts';
import { cn } from '@/lib/utils';

interface ShopHeaderProps {
  /** Viber/kampanjske stranice: bez korpe i navigacije koja odvodi sa ponude */
  minimal?: boolean;
}

/**
 * Zajednički header sajta u stilu prodajne stranice: zelena traka sa prednostima + beli sticky meni.
 */
export function ShopHeader({ minimal = false }: ShopHeaderProps) {
  const t = useTranslations('store');
  const tNav = useTranslations();
  const locale = useLocale();
  const countryConfig = getCountryConfig(locale);
  const courier = getDefaultCourier(countryConfig);

  const perks = [
    { icon: Banknote, text: t('bar.cod') },
    { icon: Truck, text: t('bar.delivery', { time: courier.deliveryTime }) },
    { icon: Truck, text: t('bar.free_shipping', { amount: formatMoney(countryConfig.business.freeShippingThreshold, countryConfig) }) },
    { icon: RotateCcw, text: t('bar.returns', { days: countryConfig.business.returnPeriodDays }) },
  ];
  // Mobilni: jedna poruka u isto vreme (prva se ponavlja na kraju zbog besprekidne petlje)
  const ticker = [perks[0], perks[1], perks[3], perks[0]];

  return (
    <>
      <div className={cn(landerFontClass, 'relative z-[141] bg-[#2E8655] text-white')}>
        <div className="mx-auto hidden h-9 max-w-[1180px] items-center justify-center gap-7 px-6 text-[13px] font-medium md:flex">
          {perks.map(({ icon: Icon, text }) => (
            <span key={text} className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Icon className="h-4 w-4 text-[#BDF0CF]" />
              {text}
            </span>
          ))}
        </div>
        <div className="h-9 overflow-hidden md:hidden">
          <div className="store-ticker">
            {ticker.map(({ icon: Icon, text }, index) => (
              <p key={`${text}-${index}`} className="flex h-9 items-center justify-center gap-1.5 text-[13px] font-medium">
                <Icon className="h-4 w-4 text-[#BDF0CF]" />
                {text}
              </p>
            ))}
          </div>
        </div>
      </div>

      <header className={cn(landerFontClass, 'sticky top-0 z-[140] bg-white/95 shadow-[0_4px_18px_rgba(0,0,0,0.07)] backdrop-blur')}>
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between gap-4 px-3 md:h-[72px] md:px-6">
          <div className="flex items-center gap-9">
            <Link href={`/${locale}`} className="inline-flex shrink-0 items-center">
              <Image src={countryConfig.logo} alt={tNav('ui.alt_logo')} width={150} height={42} className="h-8 w-auto md:h-9" priority />
            </Link>

            {!minimal && (
              <nav className="hidden items-center gap-7 text-[15px] font-semibold text-[#222] md:flex">
                <Link href={`/${locale}#akcije`} className="relative transition-colors hover:text-[#2E8655]">
                  {t('nav.offers')}
                  <span className="absolute -right-3 -top-2 rounded-full bg-[#F0735A] px-1.5 text-[9px] font-bold uppercase leading-4 text-white">%</span>
                </Link>
                <Link href={`/${locale}/products`} className="transition-colors hover:text-[#2E8655]">
                  {t('nav.all_products')}
                </Link>
                <Link href={`/${locale}/contact`} className="transition-colors hover:text-[#2E8655]">
                  {tNav('navigation.contact')}
                </Link>
              </nav>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {!minimal && (
              <Link href={`/${locale}/products`} className="rounded-full bg-[#2E8655] px-4 py-2 text-[13px] font-semibold text-white md:hidden">
                {t('nav.shop')}
              </Link>
            )}
            {countryConfig.company.phone && (
              <a
                href={`tel:${countryConfig.company.phone}`}
                className={cn(
                  'items-center gap-2 rounded-full border-2 border-[#2E8655]/25 px-4 py-2 text-[14px] font-semibold text-[#222] transition-colors hover:border-[#2E8655]',
                  minimal ? 'inline-flex' : 'hidden lg:inline-flex'
                )}
              >
                <Phone className="h-4 w-4 text-[#2E8655]" />
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
