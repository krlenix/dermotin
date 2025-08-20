import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Montserrat, Playfair_Display } from "next/font/google";
import { getCountryConfig } from '@/config/countries';
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "DERMOTIN - Prirodni proizvodi za zdravu kožu",
  description: "DERMOTIN - Otkrijte našu ekskluzivnu kolekciju dermatoloških proizvoda za zdravu i negovanu kožu.",
  keywords: "dermotin, kozmetika, nega kože, prirodni proizvodi, antifungal",
  openGraph: {
    title: "DERMOTIN - Prirodni proizvodi za zdravu kožu",
    description: "Otkrijte našu ekskluzivnu kolekciju dermatoloških proizvoda za zdravu i negovanu kožu.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  const countryConfig = getCountryConfig('rs');

  return (
    <html lang={countryConfig.locale} dir="ltr">
      <body className={`${montserrat.variable} ${playfairDisplay.variable} font-montserrat antialiased bg-background text-foreground`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
