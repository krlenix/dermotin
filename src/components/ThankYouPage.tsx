'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  CheckCircle2,
  CreditCard,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  User,
} from 'lucide-react';
import { CountryConfig, getDefaultCourier } from '@/config/countries';
import { CookieConsent } from '@/components/features/CookieConsent';
import { Footer } from '@/components/ui/footer';
import { OrderData } from '@/app/api/orders/route';
import { PixelTracker } from '@/components/tracking/PixelTracker';

interface ThankYouPageProps {
  countryConfig: CountryConfig;
  locale?: string;
}

export function ThankYouPage({ countryConfig, locale = 'rs' }: ThankYouPageProps) {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
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
  }, [countryConfig.currencySymbol, courier.deliveryTime, courier.name, locale, router, searchParams]);


  // Animated progress steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3000); // Change step every 3 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f6f8f6_0%,#ffffff_30%,#f8fbf9_65%,#ffffff_100%)]">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-[#358055]/15 border-t-[#F3765D]"></div>
          <p className="mt-4 text-sm font-medium text-slate-500">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#f6f8f6_0%,#ffffff_30%,#f8fbf9_65%,#ffffff_100%)]">
      <PixelTracker countryCode={countryConfig.code} />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-28 right-0 h-96 w-96 rounded-full bg-[#358055]/8 blur-3xl" />
        <div className="absolute top-[26rem] -left-16 h-80 w-80 rounded-full bg-[#F3765D]/8 blur-3xl" />
      </div>

      <header className="absolute inset-x-0 top-0 z-[80] md:fixed">
        <div className="container mx-auto px-4">
          <div className="mx-auto mt-3 flex max-w-6xl items-center justify-between gap-4 rounded-full border border-white/55 bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(244,248,246,0.86))] px-4 py-3 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <Link href={`/${locale}`} className="inline-flex items-center">
              <Image
                src={countryConfig.logo}
                alt={t('ui.alt_logo')}
                width={140}
                height={40}
                className="h-8 w-auto md:h-9"
              />
            </Link>
            <div className="flex items-center gap-2 rounded-full border border-[#358055]/12 bg-white/82 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-[0_8px_18px_rgba(15,23,42,0.05)] md:text-sm">
              <span className="h-2 w-2 rounded-full bg-[#358055]"></span>
              <span>{t('thank_you.order_completed')}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative pb-16 pt-24 md:pb-20 md:pt-30">
        <section className="pb-6 md:pb-8">
          <div className="container mx-auto px-4">
            <div className="section-card-strong mx-auto max-w-6xl overflow-hidden px-5 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10">
              <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center rounded-full border border-[#358055]/20 bg-[#358055]/10 px-3 py-1 text-[13px] font-extrabold tracking-[0.01em] text-[#2f6f4a]">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      {t('thank_you.order_completed')}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-[#F3765D]/20 bg-[#F3765D]/10 px-3 py-1 text-[13px] font-extrabold tracking-[0.01em] text-[#ba5a47]">
                      #{orderData.orderId}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-[#358055]/20 bg-white px-3 py-1 text-[13px] font-semibold text-slate-700">
                      {t('thank_you.cod')}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <h1 className="max-w-3xl text-4xl font-black leading-[1.08] tracking-[-0.02em] text-slate-950 sm:text-5xl lg:text-6xl">
                      <span className="highlight-reveal highlight-reveal--green is-visible">Hvala vam</span> na porudžbini!
                    </h1>
                    <p className="max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
                      {t('thank_you.order_confirmation')}. {t('thank_you.contact_soon')}
                    </p>
                  </div>

                  <div className="max-w-md">
                    <div className="rounded-[1.5rem] border border-[#358055]/10 bg-white px-5 py-5 shadow-[0_14px_34px_rgba(15,23,42,0.04)]">
                      <div className="flex items-start gap-4">
                        <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-[0_12px_22px_rgba(53,128,85,0.12)] ring-1 ring-[#358055]/10">
                          <Image
                            src={courier.logo}
                            alt={courier.name}
                            width={28}
                            height={28}
                            className="h-6 w-auto object-contain"
                          />
                        </div>
                        <div>
                          <p className="text-lg font-black leading-tight text-slate-950">{courier.name}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {t('thank_you.courier_delivery')} u roku od <span className="font-semibold text-[#358055]">{orderData.deliveryTime}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="relative mx-auto w-full max-w-2xl">
                  <div className="absolute -top-5 -left-5 hidden h-24 w-24 rounded-full bg-[#F3765D]/15 blur-2xl md:block" />
                  <div className="absolute -right-4 bottom-10 hidden h-28 w-28 rounded-full bg-[#358055]/15 blur-2xl md:block" />
                  <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(242,247,244,0.94))] p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
                    <div className="rounded-[1.6rem] bg-[radial-gradient(circle_at_top_left,rgba(53,128,85,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(243,118,93,0.12),transparent_24%),linear-gradient(180deg,rgba(248,251,249,1),rgba(255,255,255,1))] p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#358055]">{t('thank_you.what_happens_next')}</p>
                          <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950 md:text-[2.5rem]">
                            Potvrda, pakovanje i <span className="highlight-reveal highlight-reveal--orange is-visible">brza dostava</span>
                          </h2>
                        </div>
                        <div className="rounded-2xl bg-white/80 p-3 shadow-[0_10px_24px_rgba(53,128,85,0.08)]">
                          <ShieldCheck className="h-6 w-6 text-[#358055]" />
                        </div>
                      </div>

                      <div className="mt-6 space-y-3">
                        {[t('thank_you.step_1'), t('thank_you.step_2'), t('thank_you.step_3'), t('thank_you.step_4')].map((step, index) => (
                          <div
                            key={step}
                            className={`flex items-center gap-4 rounded-[1.4rem] border px-4 py-3 transition-all duration-500 ${
                              activeStep === index
                                ? 'border-[#F3765D]/20 bg-white shadow-[0_12px_26px_rgba(243,118,93,0.12)]'
                                : 'border-white/70 bg-white/72'
                            }`}
                          >
                            <div
                              className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-black transition-all duration-500 ${
                                activeStep === index
                                  ? 'bg-[#F3765D] text-white shadow-[0_10px_22px_rgba(243,118,93,0.24)]'
                                  : 'bg-[#358055]/10 text-[#358055]'
                              }`}
                            >
                              {index + 1}
                            </div>
                            <p className={`text-sm font-semibold leading-6 ${activeStep === index ? 'text-slate-950' : 'text-slate-700'}`}>
                              {step}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-5">
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#358055]/10">
                          <div
                            className="h-full rounded-full bg-[linear-gradient(90deg,#358055,#F3765D)] transition-all duration-1000 ease-in-out"
                            style={{ width: `${((activeStep + 1) / 4) * 100}%` }}
                          />
                        </div>
                        <p className="mt-3 text-sm font-semibold text-slate-500">
                          Korak {activeStep + 1} / 4
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <section className="pb-10 md:pb-14">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto">
            <div className="section-card px-5 py-6 md:px-6 md:py-7">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#358055]/10 text-[#358055]">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#358055]">{t('thank_you.order_details')}</p>
                  <h3 className="mt-1 text-2xl font-black text-slate-950">{t('thank_you.product_info')}</h3>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between rounded-[1.2rem] bg-[#f7faf8] px-4 py-3">
                  <span className="text-sm font-medium text-slate-500">{t('thank_you.order_number')}</span>
                  <span className="text-base font-black text-slate-950">#{orderData.orderId}</span>
                </div>

                <div className="divide-y divide-[#358055]/8 rounded-[1.4rem] border border-[#358055]/10 bg-white">
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-slate-500">{t('thank_you.product')}</span>
                    <span className="text-sm font-semibold text-slate-900">{orderData.productName}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-slate-500">{t('thank_you.variant')}</span>
                    <span className="text-sm font-semibold text-slate-900">{orderData.productVariant}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-slate-500">{t('thank_you.quantity')}</span>
                    <span className="text-sm font-semibold text-slate-900">{orderData.quantity} {t('thank_you.pieces')}</span>
                  </div>
                  {(orderData.isBOGO || orderData.bogoDetails) && (
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm text-slate-500">BOGO</span>
                      <span className="text-sm font-semibold text-slate-900">
                        {orderData.bogoDetails
                          ? `${orderData.bogoDetails.paidQuantity}+${orderData.bogoDetails.freeQuantity}`
                          : 'Aktivno'}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-slate-500">Cena proizvoda</span>
                    <span className="text-sm font-semibold text-slate-900">
                      {formatMoney(orderData.subtotal)} {orderData.currency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-slate-500">Troškovi dostave ({orderData.courierName || courier.name})</span>
                    <span className={`text-sm font-semibold ${orderData.shippingCost > 0 ? 'text-slate-900' : 'text-[#358055]'}`}>
                      {orderData.shippingCost > 0
                        ? `${formatMoney(orderData.shippingCost)} ${orderData.currency}`
                        : t('order_summary.free')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-4">
                    <span className="text-sm font-semibold text-slate-600">{t('thank_you.to_be_paid')}</span>
                    <span className="text-lg font-black text-[#F3765D]">{formatMoney(orderData.totalPrice)} {orderData.currency}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="section-card px-5 py-6 md:px-6 md:py-7">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F3765D]/10 text-[#F3765D]">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#F3765D]">{t('thank_you.customer_info')}</p>
                  <h3 className="mt-1 text-2xl font-black text-slate-950">{t('thank_you.customer_info')}</h3>
                </div>
              </div>

              <div className="mt-6 divide-y divide-[#358055]/8 rounded-[1.4rem] border border-[#358055]/10 bg-white">
                {orderData.customerName && (
                  <div className="flex items-start gap-3 px-4 py-3">
                    <User className="mt-0.5 h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-800">{orderData.customerName}</span>
                  </div>
                )}
                {orderData.customerPhone && (
                  <div className="flex items-start gap-3 px-4 py-3">
                    <Phone className="mt-0.5 h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-800">{orderData.customerPhone}</span>
                  </div>
                )}
                {orderData.customerEmail && (
                  <div className="flex items-start gap-3 px-4 py-3">
                    <Mail className="mt-0.5 h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-800">{orderData.customerEmail}</span>
                  </div>
                )}
                {(orderData.customerAddress || orderData.customerCity || orderData.customerPostalCode) && (
                  <div className="flex items-start gap-3 px-4 py-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
                    <div className="text-sm text-slate-700">
                      {orderData.customerAddress && <p className="font-medium text-slate-800">{orderData.customerAddress}</p>}
                      <p>
                        {[orderData.customerPostalCode, orderData.customerCity].filter(Boolean).join(' ')}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 px-4 py-3">
                  <CreditCard className="mt-0.5 h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-800">
                    {t('thank_you.payment_method')}: {t('thank_you.cod')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="section-card mt-8 mx-auto max-w-4xl px-5 py-6 md:px-8 md:py-8">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#358055]">{t('thank_you.need_help')}</p>
              <h3 className="mt-2 text-3xl font-black text-slate-950">{t('thank_you.contact_support')}</h3>
            </div>

            <div className={`mt-6 grid gap-4 ${countryConfig.company.phone ? 'md:grid-cols-2' : 'grid-cols-1'} max-w-2xl mx-auto`}>
              {countryConfig.company.phone && (
                <a
                  href={`tel:${countryConfig.company.phone}`}
                  className="flex items-center justify-center gap-3 rounded-[1.4rem] border border-[#358055]/10 bg-white px-5 py-4 text-slate-800 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition-colors hover:border-[#F3765D]/25 hover:text-[#F3765D]"
                >
                  <Phone className="h-4 w-4" />
                  <span className="font-semibold">{countryConfig.company.phone}</span>
                </a>
              )}
              <a
                href={`mailto:${countryConfig.company.email}`}
                className="flex items-center justify-center gap-3 rounded-[1.4rem] border border-[#358055]/10 bg-white px-5 py-4 text-slate-800 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition-colors hover:border-[#F3765D]/25 hover:text-[#F3765D]"
              >
                <Mail className="h-4 w-4" />
                <span className="font-semibold">{countryConfig.company.email}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer countryConfig={countryConfig} locale={locale} />
      <CookieConsent isEU={countryConfig.isEU} />
    </div>
  );
}
