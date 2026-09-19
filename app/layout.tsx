import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { siteConfig } from "@/lib/seo/site";
import { SmoothScrollProvider } from "@/lib/scroll/SmoothScrollProvider";
import { Preloader } from "@/components/preloader/Preloader";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";

const jakarta = localFont({
  src: "./fonts/plus-jakarta-sans-latin.woff2",
  variable: "--font-jakarta",
  weight: "500 800",
  style: "normal",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
  adjustFontFallback: false,
});

const archivoBlack = localFont({
  src: "./fonts/archivo-black-latin.woff2",
  variable: "--font-archivo-black",
  weight: "400",
  style: "normal",
  display: "swap",
  fallback: ["Arial Black", "Arial", "sans-serif"],
  adjustFontFallback: false,
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Chinese Automotive Parts Supplier — UAE`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [siteConfig.ogImage],
    locale: "en_AE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export const viewport = {
  themeColor: "#161616",
};

import { LanguageProvider } from "@/lib/i18n/LanguageContext";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${archivoBlack.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: siteConfig.legalName,
            url: siteConfig.url,
            logo: `${siteConfig.url}/icon.svg`,
            description: siteConfig.description,
            contactPoint: {
              "@type": "ContactPoint",
              telephone: siteConfig.phone,
              email: siteConfig.email,
              contactType: "sales",
              areaServed: "AE",
            },
          }}
        />
        <LanguageProvider>
          <Preloader />
          <CustomCursor />
          <SmoothScrollProvider>
            <TopBar />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </SmoothScrollProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
