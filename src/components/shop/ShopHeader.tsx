'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Banknote, Menu, Phone, RotateCcw, Truck, X } from 'lucide-react';
import { getCountryConfig, getDefaultCourier } from '@/config/countries';
import { getStoreOffers } from '@/config/store-content';
import { CountrySwitcher } from '@/components/features/CountrySwitcher';
import { CartButton } from '@/components/cart/CartButton';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { formatMoney } from '@/components/store/format';
import { landerFontClass } from '@/components/store/fonts';
import { cn } from '@/lib/utils';

interface ShopHeaderProps {
  /** Viber/kampanjske stranice: bez korpe i navigacije koja odvodi sa ponude */
  minimal?: boolean;
  /** Stranica proizvoda: header se ne lepi za vrh (vidi se samo kada se skroluje skroz gore) */
  sticky?: boolean;
}

/**
 * Zajednički header sajta: zelena traka sa prednostima + beli sticky meni.
 * Na telefonu: logo, poziv, korpa i meni (akcije, proizvodi, kontakt, zemlja).
 */
export function ShopHeader({ minimal = false, sticky = true }: ShopHeaderProps) {
  const t = useTranslations('store');
  const tNav = useTranslations();
  const locale = useLocale();
  const countryConfig = getCountryConfig(locale);
  const courier = getDefaultCourier(countryConfig);
  const phone = countryConfig.company.phone;
  // Akcije postoje samo gde ih početna prikazuje (#akcije) — bez mrtvog linka na /ba i /me
  const hasOffers = getStoreOffers(locale).length > 0;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const perks = [
    { icon: Banknote, text: t('bar.cod') },
    { icon: Truck, text: t('bar.delivery', { time: courier.deliveryTime }) },
    { icon: Truck, text: t('bar.free_shipping', { amount: formatMoney(countryConfig.business.freeShippingThreshold, countryConfig) }) },
    { icon: RotateCcw, text: t('bar.returns', { days: countryConfig.business.returnPeriodDays }) },
  ];

  const links = [
    ...(hasOffers ? [{ href: `/${locale}#akcije`, label: t('nav.offers'), badge: true }] : []),
    { href: `/${locale}/products`, label: t('nav.all_products'), badge: false },
    { href: `/${locale}/contact`, label: tNav('navigation.contact'), badge: false },
  ];

  return (
    <>
      <div className={cn(landerFontClass, 'relative z-[141] bg-green text-white')}>
        <div className="mx-auto hidden h-9 max-w-[1180px] items-center justify-center gap-7 px-6 text-[0.8125rem] font-medium md:flex">
          {perks.map(({ icon: Icon, text }) => (
            <span key={text} className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Icon className="h-4 w-4 text-mint" aria-hidden />
              {text}
            </span>
          ))}
        </div>
        {/* Telefon: dve najvažnije poruke u jednom mirnom redu */}
        <p className="flex min-h-9 items-center justify-center gap-1.5 px-3 py-1.5 text-center text-[0.8125rem] font-medium md:hidden">
          <Banknote className="h-4 w-4 shrink-0 text-mint" aria-hidden />
          {perks[0].text} · {perks[1].text}
        </p>
      </div>

      <header className={cn(landerFontClass, 'z-[140] bg-white/95 shadow-[0_4px_18px_rgb(0_0_0/0.07)] backdrop-blur', sticky ? 'sticky top-0' : 'relative')}>
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between gap-3 px-3 md:h-[72px] md:px-6">
          <div className="flex items-center gap-9">
            <Link href={`/${locale}`} className="inline-flex shrink-0 items-center">
              <Image src={countryConfig.logo} alt={tNav('ui.alt_logo')} width={150} height={42} className="h-8 w-auto md:h-9" priority />
            </Link>

            {!minimal && (
              <nav className="hidden items-center gap-7 text-[0.9375rem] font-semibold text-ink md:flex">
                {links.map((link) => (
                  <Link key={link.href} href={link.href} className="relative transition-colors hover:text-forest">
                    {link.label}
                    {link.badge && (
                      <span className="absolute -right-4 -top-2.5 rounded-full bg-coral-deep px-1.5 text-[0.75rem] font-bold leading-5 text-white" aria-hidden>
                        %
                      </span>
                    )}
                  </Link>
                ))}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-1.5 md:gap-3">
            {phone && (
              <a
                href={`tel:${phone}`}
                className={cn(
                  'items-center gap-2 rounded-full border-2 border-green/25 px-4 py-2 text-[0.875rem] font-semibold text-ink transition-colors hover:border-green',
                  minimal ? 'inline-flex' : 'hidden lg:inline-flex'
                )}
              >
                <Phone className="h-4 w-4 text-green" aria-hidden />
                {phone}
              </a>
            )}
            {!minimal && phone && (
              <a
                href={`tel:${phone}`}
                aria-label={t('nav.call', { phone })}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-green text-white lg:hidden"
              >
                <Phone className="h-5 w-5" aria-hidden />
              </a>
            )}
            {!minimal && (
              <div className="hidden md:block">
                <CountrySwitcher variant="ghost" />
              </div>
            )}
            {!minimal && <CartButton />}
            {!minimal && (
              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? t('nav.close_menu') : t('nav.open_menu')}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-line text-ink md:hidden"
              >
                {menuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
              </button>
            )}
          </div>
        </div>

        {!minimal && menuOpen && (
          <nav id="mobile-menu" className="border-t border-line bg-white px-3 pb-4 pt-2 md:hidden">
            <ul className="divide-y divide-line">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-12 items-center justify-between text-[1rem] font-semibold text-ink"
                  >
                    {link.label}
                    {link.badge && <span className="rounded-full bg-coral-deep px-2 text-[0.75rem] font-bold leading-5 text-white">%</span>}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between gap-3">
              <CountrySwitcher variant="outline" />
              {phone && (
                <a href={`tel:${phone}`} className="inline-flex min-h-11 items-center gap-2 font-semibold text-forest">
                  <Phone className="h-4 w-4" aria-hidden />
                  {phone}
                </a>
              )}
            </div>
          </nav>
        )}
      </header>

      {!minimal && <CartDrawer />}
    </>
  );
}
