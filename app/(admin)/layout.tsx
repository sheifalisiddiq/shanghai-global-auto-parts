import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./admin.css";
import { AuthProvider } from "@/lib/admin/auth/AuthContext";

// Same font files as the public site, but loaded only for /admin.
const jakarta = localFont({
  src: "../(site)/fonts/plus-jakarta-sans-latin.woff2",
  variable: "--font-jakarta",
  weight: "500 800",
  style: "normal",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
  adjustFontFallback: false,
});

const archivoBlack = localFont({
  src: "../(site)/fonts/archivo-black-latin.woff2",
  variable: "--font-archivo-black",
  weight: "400",
  style: "normal",
  display: "swap",
  fallback: ["Arial Black", "Arial", "sans-serif"],
  adjustFontFallback: false,
});

// Admin must never be indexed: no OG/canonical/JSON-LD, just noindex.
export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export const viewport: Viewport = {
  themeColor: "#141414",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${archivoBlack.variable} h-full antialiased`}>
      <body className="h-full">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
