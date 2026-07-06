import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageTransition } from "@/components/motion/page-transition";

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
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <SiteFooter />
    </div>
  );
}
