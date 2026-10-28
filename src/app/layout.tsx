import type { Metadata, Viewport } from "next";
import { getLocale } from 'next-intl/server';
import { getCountryConfig } from '@/config/countries';
import { getSiteUrl } from '@/lib/seo';
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "DERMOTIN - Prirodni proizvodi za zdravu kožu",
    template: "%s | DERMOTIN",
  },
  description: "DERMOTIN - Otkrijte našu ekskluzivnu kolekciju dermatoloških proizvoda za zdravu i negovanu kožu.",
  applicationName: "DERMOTIN",
  icons: {
    icon: "/images/main/favicon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    siteName: "DERMOTIN",
    title: "DERMOTIN - Prirodni proizvodi za zdravu kožu",
    description: "Otkrijte našu ekskluzivnu kolekciju dermatoloških proizvoda za zdravu i negovanu kožu.",
    type: "website",
    locale: "sr_RS",
    images: [{ url: "/images/main/hero-image.webp" }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  // Boja trake pretraživača na telefonu = zelena gornja traka sajta
  themeColor: '#2E8655',
  colorScheme: 'light',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Rute van [locale] segmenta (/admin) nemaju locale u putanji — tada sr-RS.
  // Prevodi se daju samo u [locale]/layout (jedan NextIntlClientProvider po stranici).
  let locale = 'rs';
  try {
    locale = await getLocale();
  } catch {
    // ostaje rs
  }

  return (
    <html lang={getCountryConfig(locale).locale} dir="ltr">
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
