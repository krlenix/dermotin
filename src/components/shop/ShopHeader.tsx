'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Mail, Phone } from 'lucide-react';
import { getCountryConfig } from '@/config/countries';
import { CountrySwitcher } from '@/components/features/CountrySwitcher';
import { CartButton } from '@/components/cart/CartButton';
import { CartDrawer } from '@/components/cart/CartDrawer';

/**
 * Shared header for the classical shop pages (product listing, product page,
 * cart checkout). Simpler and lighter than the animated funnel/homepage headers.
 */
export function ShopHeader() {
  const t = useTranslations();
  const locale = useLocale();
  const countryConfig = getCountryConfig(locale);

  const supportHref = countryConfig.company.phone
    ? `tel:${countryConfig.company.phone}`
    : `mailto:${countryConfig.company.email}`;

  return (
    <>
      <header className="sticky top-0 z-[140] px-2 pt-2 md:px-4 md:pt-3">
        <div className="container mx-auto">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border border-white/55 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(244,248,246,0.88))] px-4 py-3 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl md:px-6">
            <div className="flex items-center gap-3 md:gap-6">
              <Link href={`/${locale}`} className="inline-flex items-center">
                <Image
                  src={countryConfig.logo}
                  alt={t('ui.alt_logo')}
                  width={150}
                  height={40}
                  className="h-8 w-auto md:h-9"
                  priority
                />
              </Link>

              <nav className="hidden items-center gap-5 text-sm font-semibold text-slate-700 md:flex">
                <Link href={`/${locale}/products`} className="transition-colors hover:text-[#F3765D]">
                  {t('navigation.products')}
                </Link>
                <Link href={`/${locale}/contact`} className="transition-colors hover:text-[#F3765D]">
                  {t('navigation.contact')}
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <Link
                href={`/${locale}/products`}
                className="text-sm font-semibold text-slate-700 transition-colors hover:text-[#F3765D] md:hidden"
              >
                {t('navigation.products')}
              </Link>
              <a
                href={supportHref}
                className="liquid-glass-soft hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 lg:inline-flex"
              >
                {countryConfig.company.phone ? (
                  <Phone className="h-4 w-4 text-[#F3765D]" />
                ) : (
                  <Mail className="h-4 w-4 text-[#F3765D]" />
                )}
                {countryConfig.company.phone || countryConfig.company.email}
              </a>
              <CountrySwitcher variant="ghost" />
              <CartButton />
            </div>
          </div>
        </div>
      </header>

      <CartDrawer />
    </>
  );
}
