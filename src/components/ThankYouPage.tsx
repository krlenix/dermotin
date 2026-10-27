'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowRight, Check, CheckCircle2, CreditCard, Gift, Mail, MapPin, Package, Phone, Truck, User } from 'lucide-react';
import { CountryConfig, getDefaultCourier } from '@/config/countries';
import { CookieConsent } from '@/components/features/CookieConsent';
import { landerFontClass } from '@/components/store/fonts';
import { LANDER_BG, LanderFooter, Marked } from '@/components/store/LanderKit';
import { cn } from '@/lib/utils';
import { OrderData } from '@/app/api/orders/route';
import { PixelTracker } from '@/components/tracking/PixelTracker';

/** Stavka porudžbine pripremljena za prikaz (1+1 grupe sa ugnježdenim gratis linijama). */
export interface OrderDisplayItem {
  type: 'regular' | 'bogo';
  name: string;
  variant: string;
  quantity: number;
  image: string;
  linePrice: number;
  regularPrice: number;
  free?: Array<{ name: string; variant: string; quantity: number; image: string }>;
}

type ThankYouOrder = OrderData & { displayItems?: OrderDisplayItem[] };

interface ThankYouPageProps {
  countryConfig: CountryConfig;
  locale?: string;
}

export function ThankYouPage({ countryConfig, locale = 'rs' }: ThankYouPageProps) {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState<ThankYouOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const courier = getDefaultCourier(countryConfig);

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat('sr-RS', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);

  useEffect(() => {
    const previewMode = searchParams.get('preview') === '1';

    // Get order data from session storage
    const storedOrder = sessionStorage.getItem('completedOrder');
    if (storedOrder) {
      try {
        const order = JSON.parse(storedOrder);
        setOrderData(order);
      } catch (error) {
        console.error('Error parsing order data:', error);
        if (previewMode) {
          const previewShippingCost = courier.shipping.cost;
          setOrderData({
            orderId: '123456',
            customerName: 'Pera Peric',
            customerEmail: 'pera@example.com',
            customerPhone: '061234567',
            customerAddress: 'Bulevar 1',
            customerCity: 'Beograd',
            customerPostalCode: '11000',
            productName: 'FUNGEL',
            productVariant: '1 kom',
            quantity: 1,
            totalPrice: 1990 + previewShippingCost,
            subtotal: 1990,
            shippingCost: previewShippingCost,
            currency: countryConfig.currencySymbol,
            courierName: courier.name,
            deliveryTime: courier.deliveryTime,
            paymentMethod: 'cod',
            bundleItems: {},
            locale,
          });
        } else {
          router.push(`/${locale}`);
        }
      }
    } else if (previewMode) {
      const previewShippingCost = courier.shipping.cost;
      setOrderData({
        orderId: '123456',
        customerName: 'Pera Peric',
        customerEmail: 'pera@example.com',
        customerPhone: '061234567',
        customerAddress: 'Bulevar 1',
        customerCity: 'Beograd',
        customerPostalCode: '11000',
        productName: 'FUNGEL',
        productVariant: '1 kom',
        quantity: 1,
        totalPrice: 1990 + previewShippingCost,
        subtotal: 1990,
        shippingCost: previewShippingCost,
        currency: countryConfig.currencySymbol,
        courierName: courier.name,
        deliveryTime: courier.deliveryTime,
        paymentMethod: 'cod',
        bundleItems: {},
        locale,
      });
    } else {
      // No order data found, redirect to homepage
      router.push(`/${locale}`);
    }
    setLoading(false);
  }, [countryConfig.currencySymbol, courier.deliveryTime, courier.name, courier.shipping.cost, locale, router, searchParams]);


  // Animated progress steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3000); // Change step every 3 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={cn(landerFontClass, 'flex min-h-screen items-center justify-center', LANDER_BG)}>
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-[#2E8655]/15 border-t-[#2E8655]"></div>
          <p className="mt-4 text-sm font-medium text-[#555]">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return null;
  }

  const steps = [t('thank_you.step_1'), t('thank_you.step_2'), t('thank_you.step_3'), t('thank_you.step_4')];

  return (
    <div className={cn(landerFontClass, 'min-h-screen overflow-x-hidden', LANDER_BG)}>
      {/* Viber porudžbine ne smeju da uključe Meta/TikTok pixel ni na jednom domenu */}
      {(orderData as { channel?: string }).channel !== 'viber' && <PixelTracker countryCode={countryConfig.code} />}

      <header className="bg-white shadow-[0_4px_18px_rgba(0,0,0,0.07)]">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between gap-4 px-3 md:h-[72px] md:px-6">
          <Link href={`/${locale}`} className="inline-flex items-center">
            <Image src={countryConfig.logo} alt={t('ui.alt_logo')} width={150} height={42} className="h-8 w-auto md:h-9" />
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#2E8655] px-3.5 py-1.5 text-[12.5px] font-semibold text-white">
            <CheckCircle2 className="h-4 w-4" />
            {t('thank_you.order_completed')}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] space-y-5 px-3 pb-10 pt-3 md:space-y-8 md:px-6 md:pt-6">
        {/* ── POTVRDA ──────────────────────────────────────────── */}
        <section className="relative overflow-hidden rounded-[28px] bg-[#7FCB95] bg-[url('/images/lander/bg2-h17.jpg')] bg-cover bg-center px-4 py-9 text-center text-white md:py-14">
          <span className="lander-pop mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-white text-[#2E8655] shadow-[0_14px_30px_-12px_rgba(0,0,0,0.35)]">
            <Check className="h-11 w-11" strokeWidth={3.5} />
          </span>
          <h1 className="mt-5 text-[32px] font-extrabold leading-[1.2] [text-shadow:0_1px_2px_rgba(0,0,0,0.12)] md:text-[48px]">
            <Marked tone="green" animate>{t('thank_you.success_title_highlight')}</Marked> {t('thank_you.success_title_rest')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[16px] font-medium leading-relaxed md:text-[18px]">
            {t('thank_you.order_confirmation')}. {t('thank_you.contact_soon')}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2 text-[13px] font-semibold">
            <span className="rounded-full bg-white px-3.5 py-1.5 text-[#2E8655]">#{orderData.orderId}</span>
            <span className="rounded-full bg-white/20 px-3.5 py-1.5 backdrop-blur-[2px]">{t('thank_you.cod')}</span>
          </div>
        </section>

        {/* ── ŠTA SLEDI ────────────────────────────────────────── */}
        <section className="rounded-[24px] border-l-4 border-[#2E8655] bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)] md:p-8">
          <p className="text-center text-[12.5px] font-bold uppercase tracking-[0.16em] text-[#2E8655]">{t('thank_you.what_happens_next')}</p>
          <h2 className="mt-2 text-center text-[26px] font-extrabold leading-tight md:text-[34px]">
            {t('thank_you.next_steps_title_prefix')} <Marked tone="coral">{t('thank_you.next_steps_title_highlight')}</Marked>
          </h2>

          <div className="mx-auto mt-5 flex max-w-xl items-center gap-3 rounded-[16px] bg-[#F4F8F5] p-3.5">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2E8655] text-white">
              <Truck className="h-5 w-5" />
            </span>
            <p className="text-[14.5px] leading-snug">
              <strong className="font-bold">{courier.name}</strong> {t('thank_you.courier_delivery')} {t('thank_you.delivery_within')}{' '}
              <strong className="font-bold text-[#2E8655]">{orderData.deliveryTime}</strong>
            </p>
          </div>

          <ol className="mx-auto mt-5 grid max-w-3xl gap-2.5 md:grid-cols-2">
            {steps.map((step, index) => (
              <li
                key={step}
                className={cn(
                  'flex items-center gap-3 rounded-[14px] border-2 px-3.5 py-3 transition-all duration-500',
                  activeStep === index ? 'border-[#F0735A] bg-[#FFF6F3] shadow-[0_10px_22px_-14px_rgba(240,115,90,0.8)]' : 'border-transparent bg-[#F6F6F4]'
                )}
              >
                <span
                  className={cn(
                    'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[14px] font-extrabold transition-all duration-500',
                    activeStep === index ? 'bg-[#F0735A] text-white' : 'bg-[#2E8655] text-white'
                  )}
                >
                  {index + 1}
                </span>
                <span className="text-[14.5px] font-semibold leading-snug">{step}</span>
              </li>
            ))}
          </ol>
          <div className="mx-auto mt-4 max-w-3xl">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#2E8655]/10">
              <div className="h-full rounded-full bg-[linear-gradient(90deg,#2E8655,#F0735A)] transition-all duration-1000 ease-in-out" style={{ width: `${((activeStep + 1) / 4) * 100}%` }} />
            </div>
            <p className="mt-2 text-center text-[13px] font-semibold text-[#666]">{t('thank_you.step_of', { current: activeStep + 1, total: 4 })}</p>
          </div>
        </section>

        {/* ── DETALJI ──────────────────────────────────────────── */}
        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
          <section className="rounded-[22px] bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)] md:p-6">
            <p className="flex items-center gap-2.5 text-[19px] font-extrabold">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#2E8655] text-white">
                <Package className="h-[18px] w-[18px]" />
              </span>
              {t('thank_you.order_details')}
            </p>

            <div className="mt-4 space-y-2.5">
              {orderData.displayItems && orderData.displayItems.length > 0 ? (
                orderData.displayItems.map((item, index) => (
                  <div key={index} className="overflow-hidden rounded-[14px] ring-1 ring-black/5">
                    <div className="flex items-center gap-3 bg-[#FAFAF8] p-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[10px] bg-white">
                        <Image src={item.image} alt={item.name} fill className="object-contain p-1" sizes="56px" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-extrabold uppercase">{item.name}</p>
                        <p className="truncate text-[12.5px] text-[#666]">
                          {item.variant} · {item.quantity} {t('thank_you.pieces')}
                        </p>
                      </div>
                      <p className="shrink-0 text-[14px] font-extrabold">
                        {formatMoney(item.linePrice)} {orderData.currency}
                      </p>
                    </div>
                    {item.free && item.free.length > 0 && (
                      <ul className="space-y-1.5 border-t border-black/5 bg-[#F3FAF6] px-3 py-2">
                        {item.free.map((freeLine, freeIndex) => (
                          <li key={freeIndex} className="flex items-center gap-2">
                            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md bg-white">
                              <Image src={freeLine.image} alt={freeLine.name} fill className="object-contain p-0.5" sizes="32px" />
                            </div>
                            <p className="min-w-0 flex-1 truncate text-[12.5px] font-bold">{freeLine.name}</p>
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#F0735A] px-2 py-0.5 text-[10.5px] font-bold uppercase text-white">
                              <Gift className="h-3 w-3" />
                              {t('bogo.pair_gratis')}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              ) : (
                <div className="divide-y divide-black/5 rounded-[14px] bg-[#FAFAF8] text-[14px] ring-1 ring-black/5">
                  <div className="flex justify-between gap-4 px-3.5 py-3">
                    <span className="text-[#666]">{t('thank_you.product')}</span>
                    <span className="text-right font-semibold">{orderData.productName}</span>
                  </div>
                  <div className="flex justify-between gap-4 px-3.5 py-3">
                    <span className="text-[#666]">{t('thank_you.variant')}</span>
                    <span className="text-right font-semibold">{orderData.productVariant}</span>
                  </div>
                  <div className="flex justify-between gap-4 px-3.5 py-3">
                    <span className="text-[#666]">{t('thank_you.quantity')}</span>
                    <span className="font-semibold">
                      {orderData.quantity} {t('thank_you.pieces')}
                    </span>
                  </div>
                </div>
              )}

              <div className="divide-y divide-black/5 rounded-[14px] text-[14px] ring-1 ring-black/5">
                <div className="flex justify-between gap-4 px-3.5 py-3">
                  <span className="text-[#666]">{t('thank_you.product_price')}</span>
                  <span className="font-semibold">
                    {formatMoney(orderData.subtotal)} {orderData.currency}
                  </span>
                </div>
                <div className="flex justify-between gap-4 px-3.5 py-3">
                  <span className="text-[#666]">
                    {t('thank_you.shipping_cost')} ({orderData.courierName || courier.name})
                  </span>
                  <span className={cn('shrink-0 font-semibold', orderData.shippingCost > 0 ? '' : 'text-[#2E8655]')}>
                    {orderData.shippingCost > 0 ? `${formatMoney(orderData.shippingCost)} ${orderData.currency}` : t('order_summary.free')}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 px-3.5 py-3.5">
                  <span className="font-semibold">{t('thank_you.to_be_paid')}</span>
                  <span className="bg-[#2E8655] px-2 py-0.5 text-[22px] font-extrabold text-white [text-shadow:1px_1px_0_#14402a]">
                    {formatMoney(orderData.totalPrice)} {orderData.currency}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[22px] bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)] md:p-6">
            <p className="flex items-center gap-2.5 text-[19px] font-extrabold">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#F0735A] text-white">
                <User className="h-[18px] w-[18px]" />
              </span>
              {t('thank_you.delivery_info')}
            </p>
            <ul className="mt-4 divide-y divide-black/5 rounded-[14px] text-[14px] ring-1 ring-black/5">
              {orderData.customerName && (
                <li className="flex items-center gap-3 px-3.5 py-3">
                  <User className="h-4 w-4 shrink-0 text-[#2E8655]" />
                  <span className="font-semibold">{orderData.customerName}</span>
                </li>
              )}
              {orderData.customerPhone && (
                <li className="flex items-center gap-3 px-3.5 py-3">
                  <Phone className="h-4 w-4 shrink-0 text-[#2E8655]" />
                  {orderData.customerPhone}
                </li>
              )}
              {orderData.customerEmail && (
                <li className="flex items-center gap-3 px-3.5 py-3">
                  <Mail className="h-4 w-4 shrink-0 text-[#2E8655]" />
                  {orderData.customerEmail}
                </li>
              )}
              {(orderData.customerAddress || orderData.customerCity || orderData.customerPostalCode) && (
                <li className="flex items-start gap-3 px-3.5 py-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#2E8655]" />
                  <span>
                    {orderData.customerAddress && <span className="block font-semibold">{orderData.customerAddress}</span>}
                    {[orderData.customerPostalCode, orderData.customerCity].filter(Boolean).join(' ')}
                  </span>
                </li>
              )}
              <li className="flex items-center gap-3 px-3.5 py-3">
                <CreditCard className="h-4 w-4 shrink-0 text-[#2E8655]" />
                {t('thank_you.payment_method')}: <strong className="font-bold">{t('thank_you.cod')}</strong>
              </li>
            </ul>

            <div className="mt-5 rounded-[16px] bg-[#F4F8F5] p-4 text-center">
              <p className="text-[16px] font-extrabold">{t('thank_you.need_help')}</p>
              <div className={cn('mt-3 grid gap-2', countryConfig.company.phone && 'sm:grid-cols-2')}>
                {countryConfig.company.phone && (
                  <a href={`tel:${countryConfig.company.phone}`} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#2E8655] px-4 text-[14px] font-semibold text-white">
                    <Phone className="h-4 w-4" />
                    {countryConfig.company.phone}
                  </a>
                )}
                <a href={`mailto:${countryConfig.company.email}`} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-4 text-[14px] font-semibold text-[#2E8655] ring-2 ring-[#2E8655]/30">
                  <Mail className="h-4 w-4" />
                  {countryConfig.company.email}
                </a>
              </div>
            </div>
          </section>
        </div>

        <div className="text-center">
          <Link
            href={`/${locale}#akcije`}
            className="lander-shine inline-flex h-14 items-center gap-2 rounded-full bg-[#F0735A] px-8 text-[15px] font-bold uppercase tracking-wide text-white shadow-[0_6px_0_#c4533b] transition hover:scale-[1.02]"
          >
            {t('store.home.cta_offers')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>

      <LanderFooter countryConfig={countryConfig} locale={locale} className="pb-6" />
      <CookieConsent isEU={countryConfig.isEU} />
    </div>
  );
}
