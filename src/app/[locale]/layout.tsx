import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { absoluteUrl, localeAlternates } from "@/lib/seo";
import { Analytics } from "@vercel/analytics/react";
import { PageTracker } from "@/components/analytics/page-tracker";
import { MotionProvider } from "@/components/motion/motion-provider";
import { OrganizationJsonLd } from "@/components/seo/organization-json-ld";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Her dil için statik sayfa üretimini mümkün kılar (SEO/performans).
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// bkz. src/app/icon.tsx — globals.css'teki --color-accent ile senkron tutulmalı.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2b59ff",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t("name"),
      template: `%s · ${t("name")}`,
    },
    description: t("tagline"),
    alternates: {
      canonical: absoluteUrl(locale),
      languages: localeAlternates(),
    },
    openGraph: {
      type: "website",
      locale,
      url: absoluteUrl(locale),
      siteName: t("name"),
      title: t("name"),
      description: t("tagline"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("name"),
      description: t("tagline"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Tanımsız dil isteğinde 404.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Statik üretim için aktif dili bildir.
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "site" });

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <body>
        <OrganizationJsonLd
          name={t("name")}
          description={t("tagline")}
          locale={locale}
        />
        <NextIntlClientProvider>
          <MotionProvider>{children}</MotionProvider>
        </NextIntlClientProvider>
        {/* Kendi barındırdığımız gizlilik dostu sayfa-görüntüleme takibi
            (panel grafikleri için) + Vercel Web Analytics. İkisi de çerezsiz
            ve kişisel veri toplamaz. */}
        <PageTracker />
        <Analytics />
        {/* Çerezsiz analitik (Plausible) — yalnızca env değişkeni tanımlıysa
            yüklenir; tanımlı değilken sıfır maliyet. bkz. .env.example */}
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ? (
          <Script
            src="https://plausible.io/js/script.js"
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
