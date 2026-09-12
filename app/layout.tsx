import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Big_Shoulders, Archivo_Black, Manrope } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/seo/site";
import { SmoothScrollProvider } from "@/lib/scroll/SmoothScrollProvider";
import { Preloader } from "@/components/preloader/Preloader";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

const bigShoulders = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz"],
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: "400",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${bigShoulders.variable} ${archivoBlack.variable} ${manrope.variable} h-full antialiased`}
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
        <Preloader />
        <CustomCursor />
        <SmoothScrollProvider>
          <TopBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
