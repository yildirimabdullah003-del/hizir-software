import { useTranslations } from "next-intl";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageTransition } from "@/components/motion/page-transition";
import { WhatsAppFloat } from "@/components/ui/whatsapp-float";

/**
 * (marketing) route group layout'u.
 * Kurumsal sitenin genel kabuğu: başlık + içerik + alt bilgi.
 * İleride (admin), (dashboard) gibi gruplar kendi layout'larıyla eklenebilir;
 * bu grubu etkilemez (ADR 0002).
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("whatsapp");

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <SiteFooter />
      <WhatsAppFloat message={t("defaultMessage")} />
    </div>
  );
}
