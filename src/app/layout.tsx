import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Montserrat, Playfair_Display } from "next/font/google";
import { getCountryConfig } from '@/config/countries';
import { getSiteUrl } from '@/lib/seo';
import { Toaster } from "@/components/ui/sonner";
import { PerformanceOptimizer } from "@/components/PerformanceOptimizer";
import { DebugPixelLoader } from "@/components/tracking/DebugPixelLoader";
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

const googleTagId = process.env.NEXT_PUBLIC_GOOGLE_TAG || process.env.NEXT_PUBLIC_GOOGLE_TAG_RS || '';
const isGoogleTagEnabled = googleTagId &&
  !googleTagId.startsWith('your_google_tag_id') &&
  !googleTagId.startsWith('your_actual_google_tag_id');

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Rute van [locale] segmenta (/admin, /checkouts/[slug]) nemaju locale u putanji,
  // pa getMessages() ume da baci notFound() (npr. kad postoji NEXT_LOCALE kolačić a
  // middleware nije obradio zahtev). Root layout nikada ne sme sam da izazove 404 —
  // padamo na rs poruke; [locale] grana ionako ima sopstveni NextIntlClientProvider.
  let messages;
  try {
    messages = await getMessages();
  } catch {
    messages = (await import('@/messages/rs.json')).default;
  }
  const countryConfig = getCountryConfig('rs');

  return (
    <html lang={countryConfig.locale} dir="ltr">
      <head>
        {isGoogleTagEnabled && (
          <>
            {/* Google tag (gtag.js) */}
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());

                  gtag('config', '${googleTagId}');
                `,
              }}
            />
          </>
        )}

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
      <body className={`${montserrat.variable} ${playfairDisplay.variable} font-sans antialiased bg-background text-foreground`}>
        <PerformanceOptimizer />
        <DebugPixelLoader />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
