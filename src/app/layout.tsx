import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Montserrat, Playfair_Display } from "next/font/google";
import { getCountryConfig } from '@/config/countries';
import { Toaster } from "@/components/ui/sonner";
import { PerformanceOptimizer } from "@/components/PerformanceOptimizer";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"], // Reduced font weights
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: false,
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair",
  weight: ["400", "600", "700"], // Reduced font weights
  display: 'swap',
  preload: false, // Only preload primary font
  fallback: ['serif'],
});

export const metadata: Metadata = {
  title: "DERMOTIN - Prirodni proizvodi za zdravu kožu",
  description: "DERMOTIN - Otkrijte našu ekskluzivnu kolekciju dermatoloških proizvoda za zdravu i negovanu kožu.",
  keywords: "dermotin, kozmetika, nega kože, prirodni proizvodi, antifungal",
  icons: {
    icon: "/images/main/favicon.png",
  },
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
      <head>
        {/* Preload critical resources with high priority */}
        <link
          rel="preload"
          href="/images/main/hero-image.webp"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />
        <link
          rel="preload"
          href="/images/main/logo.png"
          as="image"
          type="image/png"
          fetchPriority="high"
        />
        
        {/* Preload critical CSS for faster rendering */}
        <link
          rel="preload"
          href="/_next/static/css/app/layout.css"
          as="style"
        />
        
        {/* Viewport and performance meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#FF6B35" />
        <meta name="color-scheme" content="light" />
      </head>
      <body className={`${montserrat.variable} ${playfairDisplay.variable} font-montserrat antialiased bg-background text-foreground`}>
        <PerformanceOptimizer />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
