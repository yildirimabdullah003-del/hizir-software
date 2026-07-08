import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * Admin panelin kök layout'u — [locale] segmentinin DIŞINDA, ayrı bir
 * uygulama yüzeyi. Panel arayüzü tek dildir (Türkçe); TR/EN *içerik*
 * düzenlemesi form içindeki dil sekmeleriyle yapılır (bkz. plan, karar 3).
 * Arama motorlarına kapalıdır.
 */
export const metadata: Metadata = {
  title: {
    default: "Yönetim Paneli · HIZIR Software",
    template: "%s · HIZIR Admin",
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={inter.variable} suppressHydrationWarning>
      <body className="bg-surface text-foreground antialiased">{children}</body>
    </html>
  );
}
