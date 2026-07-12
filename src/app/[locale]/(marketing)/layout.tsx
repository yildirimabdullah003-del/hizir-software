import { getTranslations, setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageTransition } from "@/components/motion/page-transition";
import { WhatsAppFloat } from "@/components/ui/whatsapp-float";
import { getSiteContact } from "@/lib/site-contact";

/**
 * (marketing) route group layout'u.
 * Kurumsal sitenin genel kabuğu: başlık + içerik + alt bilgi.
 * İletişim/sosyal bilgiler panelden yönetilir (Admin > Ayarlar) — burada
 * DB-öncelikli okunup footer'a ve WhatsApp butonuna aktarılır.
 */
export default async function MarketingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Statik üretim için aktif dili bildir (getTranslations'tan önce).
  setRequestLocale(locale);

  const [t, contact] = await Promise.all([
    getTranslations("whatsapp"),
    getSiteContact(),
  ]);

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <SiteFooter contact={contact} />
      <WhatsAppFloat
        message={t("defaultMessage")}
        whatsappNumber={contact.whatsappNumber}
      />
    </div>
  );
}
