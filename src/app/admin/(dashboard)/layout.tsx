import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { requireSession } from "@/features/admin/auth/session";
import { logout } from "@/features/admin/auth/actions";
import { isPreviewMode, PREVIEW_STATS } from "@/features/admin/preview";
import { prisma } from "@/lib/prisma";
import { SidebarNav } from "./sidebar-nav";

// Oturum kontrolü her istekte yapılır; bu segment statik üretilemez.
export const dynamic = "force-dynamic";

const ROLE_LABELS: Record<string, string> = {
  OWNER: "Sahip",
  ADMIN: "Yönetici",
  EDITOR: "Editör",
};

/** İsimden baş harfleri üretir (avatar için). */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await requireSession();

  // Menüdeki "Mesajlar" rozeti için okunmamış (NEW) mesaj sayısı. DB'ye
  // ulaşılamazsa rozet gösterilmez; panel çökmez. Önizlemede demo sayı.
  let newSubmissions = 0;
  if (isPreviewMode()) {
    newSubmissions = PREVIEW_STATS.newSubmissions;
  } else {
    try {
      newSubmissions = await prisma.contactSubmission.count({
        where: { status: "NEW" },
      });
    } catch {
      newSubmissions = 0;
    }
  }

  return (
    <div className="flex min-h-screen bg-surface">
      {/* --- Yan menü (koyu premium zemin) --- */}
      <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col bg-[#0d0d0f] text-white">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white">
            H
          </span>
          <Link href="/admin" className="text-sm font-semibold tracking-tight">
            HIZIR <span className="text-white/50">Admin</span>
          </Link>
        </div>

        <SidebarNav newSubmissions={newSubmissions} />

        {/* --- Kullanıcı kartı + çıkış --- */}
        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">
              {initials(auth.name || "?")}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {auth.name || "Yönetici"}
              </p>
              <p className="truncate text-xs text-white/45">
                {ROLE_LABELS[auth.role] ?? auth.role}
              </p>
            </div>
            <form action={logout}>
              <button
                type="submit"
                aria-label="Çıkış yap"
                title="Çıkış yap"
                className="flex h-8 w-8 items-center justify-center rounded-md text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* --- İçerik alanı --- */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Üst bar */}
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-background/80 px-8 backdrop-blur">
          <p className="text-sm text-muted-foreground">
            Yönetim paneli
          </p>
          <a
            href="https://hizirsoftware.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Siteyi görüntüle
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </header>

        <main className="flex-1 overflow-x-auto">
          {isPreviewMode() ? (
            <div className="border-b border-amber-200 bg-amber-50 px-8 py-2.5 text-center text-xs text-amber-800">
              <strong>Önizleme modu</strong> — örnek verilerle gösterim; giriş ve
              veritabanı olmadan gezinti. Değişiklikler kaydedilmez.
            </div>
          ) : null}
          <div className="px-8 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
