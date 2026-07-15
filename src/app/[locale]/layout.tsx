import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { CartProvider } from '@/contexts/CartContext';
import { BogoPairProvider } from '@/components/shop/BogoPairModal';

const locales = ['rs', 'ba', 'me'];

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  
  // Validate locale
  if (!locales.includes(locale as typeof locales[number])) {
    notFound();
  }

  // Providing all messages to the client side
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <CartProvider locale={locale}>
        <BogoPairProvider>{children}</BogoPairProvider>
      </CartProvider>
    </NextIntlClientProvider>
  );
}
