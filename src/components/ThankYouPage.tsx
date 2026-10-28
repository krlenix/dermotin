'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowRight, Check, CheckCircle2, CreditCard, Gift, Mail, MapPin, Package, Phone, Smartphone, User } from 'lucide-react';
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

  if (loading) {
    return (
      <div className={cn(landerFontClass, 'flex min-h-screen items-center justify-center', LANDER_BG)}>
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-green/15 border-t-green motion-reduce:animate-none"></div>
          <p className="mt-4 text-[0.875rem] font-medium text-ink-soft">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return null;
  }

  const money = (amount: number) => `${formatMoney(amount)} ${orderData.currency}`;
  const courierName = orderData.courierName || courier.name;
  const companyPhone = countryConfig.company.phone;
  // tel: prima samo cifre i + („011/44-100-22“ nije ispravan tel: link na svim telefonima)
  const phoneHref = companyPhone ? `tel:${companyPhone.replace(/[^\d+]/g, '')}` : null;

  // Iskren status, bez tajmera: porudžbina je primljena, sledi naš poziv za potvrdu, pa slanje i dostava
  const steps: Array<{ label: string; status: 'done' | 'next' | 'upcoming'; detail?: React.ReactNode }> = [
    { label: t('thank_you.step_received'), status: 'done' },
    { label: t('thank_you.step_1'), status: 'next' },
    { label: t('thank_you.step_2'), status: 'upcoming' },
    {
      label: t('thank_you.step_4'),
      status: 'upcoming',
      detail: (
        <>
          <strong className="font-semibold text-ink">{courierName}</strong> {t('thank_you.courier_delivery')} {t('thank_you.delivery_within')}{' '}
          <strong className="font-semibold text-ink">{orderData.deliveryTime}</strong>
        </>
      ),
    },
  ];

  // Stavke za prikaz; pregled (?preview=1) nema displayItems, pa se jedna stavka gradi iz osnovnih polja.
  // Količina se navodi jednom (uz varijantu, samo kada je veća od 1).
  const items: OrderDisplayItem[] =
    orderData.displayItems && orderData.displayItems.length > 0
      ? orderData.displayItems
      : [
          {
            type: 'regular',
            name: orderData.productName,
            variant: orderData.productVariant,
            quantity: orderData.quantity,
            image: '',
            linePrice: orderData.subtotal,
            regularPrice: orderData.subtotal,
          },
        ];
  // Popust kupona na proizvode — da bi zbir (cena − popust + dostava) bio jednak iznosu za plaćanje
  const couponDiscount = orderData.coupon?.productDiscount ?? 0;

  return (
    <div className={cn(landerFontClass, 'min-h-screen overflow-x-hidden', LANDER_BG)}>
      {/* Viber porudžbine ne smeju da uključe Meta/TikTok pixel ni na jednom domenu */}
      {(orderData as { channel?: string }).channel !== 'viber' && <PixelTracker countryCode={countryConfig.code} />}

      <header className="bg-white shadow-card">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between gap-4 px-3 md:h-[72px] md:px-6">
          <Link href={`/${locale}`} className="inline-flex items-center">
            <Image src={countryConfig.logo} alt={t('ui.alt_logo')} width={150} height={42} className="h-8 w-auto md:h-9" />
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full bg-green px-3.5 py-1.5 text-[0.8125rem] font-semibold text-white">
            <CheckCircle2 className="h-4 w-4" aria-hidden />
            {t('thank_you.order_completed')}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] space-y-5 px-3 pb-10 pt-3 md:space-y-8 md:px-6 md:pt-6">
        {/* ── POTVRDA ──────────────────────────────────────────── */}
        <section className="relative overflow-hidden rounded-[1.75rem] bg-paper px-4 py-9 text-center text-ink ring-1 ring-line md:py-14">
          <div
            className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-green)_16%,transparent)_0%,transparent_68%)]"
            aria-hidden
          />
          <span className="relative mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-green text-white shadow-float" aria-hidden>
            <Check className="h-11 w-11" strokeWidth={3.5} />
          </span>
          {/* Jedini pokret na stranici: isticanje u naslovu se iscrta jednom */}
          <h1 className="relative mt-5 text-balance text-[1.875rem] font-extrabold leading-[1.22] md:text-[2.625rem]">
            <Marked tone="green" animate>{t('thank_you.success_title_highlight')}</Marked> {t('thank_you.success_title_rest')}
          </h1>
          <p className="relative mx-auto mt-4 max-w-xl text-[1rem] leading-relaxed text-ink-soft md:text-[1.125rem]">{t('thank_you.order_confirmation')}.</p>
          <div className="relative mt-5 flex flex-wrap justify-center gap-2 text-[0.8125rem] font-semibold">
            <span className="rounded-full bg-white px-3.5 py-1.5 text-ink ring-1 ring-line">
              {t('thank_you.order_number')}: <span className="text-forest">{orderData.orderId}</span>
            </span>
            <span className="rounded-full bg-mint-soft px-3.5 py-1.5 text-forest">{t('thank_you.cod')}</span>
          </div>
        </section>

        {/* ── ŠTA SLEDI (stvarni status, bez tajmera) ──────────── */}
        <section aria-labelledby="ty-next-title" className="rounded-card bg-white p-4 shadow-card md:p-8">
          <h2 id="ty-next-title" className="text-balance text-center text-[1.5rem] font-extrabold leading-tight md:text-[1.875rem]">
            {t('thank_you.what_happens_next')}
          </h2>

          <ol className="mx-auto mt-6 max-w-xl">
            {steps.map((step, index) => (
              <li key={step.label} aria-current={step.status === 'next' ? 'step' : undefined} className="relative flex gap-4 pb-6 last:pb-0">
                {/* Linija između koraka (vremenska osa, ne ivica kartice) */}
                {index < steps.length - 1 && (
                  <span className={cn('absolute bottom-1 left-5 top-12 w-0.5 -translate-x-1/2 rounded-full', step.status === 'done' ? 'bg-green' : 'bg-line')} aria-hidden />
                )}
                <span
                  className={cn(
                    'relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[1rem] font-extrabold',
                    step.status === 'done' && 'bg-green text-white',
                    step.status === 'next' && 'border-2 border-green bg-white text-forest',
                    step.status === 'upcoming' && 'border-2 border-line bg-white text-ink-muted'
                  )}
                  aria-hidden
                >
                  {step.status === 'done' ? <Check className="h-5 w-5" strokeWidth={3} /> : index + 1}
                </span>
                <div className="min-w-0 pt-2">
                  <p className={cn('text-[1rem] leading-snug', step.status === 'upcoming' ? 'font-medium text-ink-soft' : 'font-bold text-ink')}>{step.label}</p>
                  {step.status === 'done' && <p className="mt-1 text-[0.8125rem] font-semibold text-forest">{t('thank_you.status_done')}</p>}
                  {step.status === 'next' && (
                    <p className="mt-1.5 inline-flex rounded-full bg-mint-soft px-2.5 py-0.5 text-[0.8125rem] font-semibold text-forest">{t('thank_you.status_next')}</p>
                  )}
                  {step.detail && <p className="mt-1 text-[0.875rem] leading-snug text-ink-soft">{step.detail}</p>}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── DETALJI ──────────────────────────────────────────── */}
        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
          <section aria-labelledby="ty-order-title" className="rounded-card bg-white p-4 shadow-card md:p-6">
            <h2 id="ty-order-title" className="flex items-center gap-2.5 text-[1.125rem] font-extrabold">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green text-white" aria-hidden>
                <Package className="h-[18px] w-[18px]" />
              </span>
              {t('thank_you.order_details')}
            </h2>

            <ul className="mt-4 divide-y divide-line border-y border-line">
              {items.map((item, index) => (
                <li key={index} className="py-3">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[0.625rem] bg-paper">
                        <Image src={item.image} alt={item.name} fill className="object-contain p-1" sizes="56px" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="break-words text-[0.9375rem] font-extrabold uppercase leading-snug">{item.name}</p>
                      <p className="mt-0.5 break-words text-[0.8125rem] text-ink-muted">
                        {item.variant}
                        {item.quantity > 1 ? ` × ${item.quantity}` : ''}
                      </p>
                    </div>
                    <p className="shrink-0 text-[0.9375rem] font-extrabold">{money(item.linePrice)}</p>
                  </div>
                  {item.free && item.free.length > 0 && (
                    <ul className={cn('mt-2 space-y-1.5', item.image && 'pl-[4.25rem]')}>
                      {item.free.map((freeLine, freeIndex) => (
                        <li key={freeIndex} className="flex items-center gap-2">
                          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md bg-paper">
                            <Image src={freeLine.image} alt={freeLine.name} fill className="object-contain p-0.5" sizes="32px" />
                          </div>
                          <p className="min-w-0 flex-1 break-words text-[0.8125rem] font-semibold">{freeLine.name}</p>
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-coral-deep px-2 py-0.5 text-[0.75rem] font-bold uppercase text-white">
                            <Gift className="h-3 w-3" aria-hidden />
                            {t('bogo.pair_gratis')}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            <dl className="divide-y divide-line text-[0.9375rem]">
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-ink-soft">{t('thank_you.product_price')}</dt>
                <dd className="font-semibold">{money(orderData.subtotal)}</dd>
              </div>
              {couponDiscount > 0 && orderData.coupon && (
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-ink-soft">{t('store.form.coupon', { code: orderData.coupon.code })}</dt>
                  <dd className="shrink-0 font-semibold text-forest">−{money(couponDiscount)}</dd>
                </div>
              )}
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-ink-soft">
                  {t('thank_you.shipping_cost')} ({courierName})
                </dt>
                <dd className={cn('shrink-0 font-semibold', orderData.shippingCost > 0 ? '' : 'text-forest')}>
                  {orderData.shippingCost > 0 ? money(orderData.shippingCost) : t('order_summary.free')}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3.5">
                <dt className="font-semibold">{t('thank_you.to_be_paid')}</dt>
                <dd className="shrink-0 bg-green px-2 py-0.5 text-[1.25rem] font-extrabold text-white">{money(orderData.totalPrice)}</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="ty-delivery-title" className="rounded-card bg-white p-4 shadow-card md:p-6">
            <h2 id="ty-delivery-title" className="flex items-center gap-2.5 text-[1.125rem] font-extrabold">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green text-white" aria-hidden>
                <User className="h-[18px] w-[18px]" />
              </span>
              {t('thank_you.delivery_info')}
            </h2>
            <ul className="mt-4 divide-y divide-line border-y border-line text-[0.9375rem]">
              {orderData.customerName && (
                <li className="flex items-center gap-3 py-3">
                  <User className="h-4 w-4 shrink-0 text-green" aria-hidden />
                  <span className="font-semibold">{orderData.customerName}</span>
                </li>
              )}
              {orderData.customerPhone && (
                <li className="flex items-center gap-3 py-3">
                  <Phone className="h-4 w-4 shrink-0 text-green" aria-hidden />
                  {orderData.customerPhone}
                </li>
              )}
              {orderData.customerEmail && (
                <li className="flex items-center gap-3 py-3">
                  <Mail className="h-4 w-4 shrink-0 text-green" aria-hidden />
                  <span className="min-w-0 [overflow-wrap:anywhere]">{orderData.customerEmail}</span>
                </li>
              )}
              {(orderData.customerAddress || orderData.customerCity || orderData.customerPostalCode) && (
                <li className="flex items-start gap-3 py-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green" aria-hidden />
                  <span>
                    {orderData.customerAddress && <span className="block font-semibold">{orderData.customerAddress}</span>}
                    {[orderData.customerPostalCode, orderData.customerCity].filter(Boolean).join(' ')}
                  </span>
                </li>
              )}
              <li className="flex items-center gap-3 py-3">
                <CreditCard className="h-4 w-4 shrink-0 text-green" aria-hidden />
                <span>
                  {t('thank_you.payment_method')}: <strong className="font-bold">{t('thank_you.cod')}</strong>
                </span>
              </li>
            </ul>
          </section>
        </div>

        {/* ── PRE DOSTAVE: telefon uključen, tačan iznos za kurira, naš broj ── */}
        <section aria-labelledby="ty-phone-title" className="rounded-card bg-white px-4 py-7 text-center shadow-card md:px-8 md:py-9">
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-mint-soft text-forest" aria-hidden>
            <Smartphone className="h-6 w-6" />
          </span>
          <h2 id="ty-phone-title" className="mt-3 text-balance text-[1.5rem] font-extrabold leading-tight md:text-[1.875rem]">
            {t('thank_you.keep_phone_title')}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-balance text-[1rem] leading-relaxed text-ink-soft md:text-[1.125rem]">
            {t.rich('thank_you.keep_phone_text', {
              total: money(orderData.totalPrice),
              b: (chunks) => <strong className="font-bold text-ink">{chunks}</strong>,
            })}
          </p>

          <div className="mx-auto mt-6 max-w-md border-t border-line pt-6">
            <p className="text-[1rem] font-semibold">{t('thank_you.need_help')}</p>
            {phoneHref && (
              <a
                href={phoneHref}
                className="mt-3 flex min-h-[3.75rem] w-full items-center justify-center gap-3 rounded-full bg-green px-6 text-white transition hover:bg-green-press"
              >
                <Phone className="h-5 w-5 shrink-0" aria-hidden />
                <span className="text-left leading-tight">
                  <span className="block text-[0.8125rem] font-medium">{t('faq_ui.call_us')}</span>
                  <span className="block text-[1.25rem] font-extrabold">{companyPhone}</span>
                </span>
              </a>
            )}
            <a
              href={`mailto:${countryConfig.company.email}`}
              className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 text-[0.9375rem] font-semibold text-forest underline decoration-green/40 underline-offset-4 hover:decoration-green"
            >
              <Mail className="h-4 w-4 shrink-0" aria-hidden />
              <span className="[overflow-wrap:anywhere]">{countryConfig.company.email}</span>
            </a>
          </div>
        </section>

        {/* Ponuda tek posle praktičnih informacija — sekundarno dugme */}
        <div className="text-center">
          <Link
            href={`/${locale}#akcije`}
            className="inline-flex min-h-14 items-center gap-2 rounded-full border-2 border-green bg-white px-8 text-[0.9375rem] font-bold uppercase tracking-wide text-forest transition hover:bg-mint-soft"
          >
            {t('store.home.cta_offers')}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </main>

      <LanderFooter countryConfig={countryConfig} locale={locale} className="pb-6" />
      <CookieConsent isEU={countryConfig.isEU} />
    </div>
  );
}
