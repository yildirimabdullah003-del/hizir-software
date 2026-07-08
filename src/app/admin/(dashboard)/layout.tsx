import Link from "next/link";
import {
  LayoutDashboard,
  Inbox,
  FileText,
  Image as ImageIcon,
  Settings,
  Users,
  LogOut,
} from "lucide-react";
import { requireSession } from "@/features/admin/auth/session";
import { logout } from "@/features/admin/auth/actions";
import { isPreviewMode } from "@/features/admin/preview";

// Oturum kontrolü her istekte yapılır; bu segment statik üretilemez.
export const dynamic = "force-dynamic";

const NAV_ITEMS = [
  { href: "/admin", label: "Genel Bakış", icon: LayoutDashboard },
  { href: "/admin/submissions", label: "Mesajlar", icon: Inbox },
  { href: "/admin/pages", label: "Sayfalar", icon: FileText },
  { href: "/admin/media", label: "Medya", icon: ImageIcon },
  { href: "/admin/settings", label: "Ayarlar", icon: Settings },
  { href: "/admin/users", label: "Kullanıcılar", icon: Users },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await requireSession();

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-background">
        <div className="border-b border-border px-5 py-5">
          <Link href="/admin" className="text-sm font-semibold tracking-tight">
            HIZIR <span className="text-accent">Admin</span>
          </Link>
        </div>
        <nav aria-label="Panel navigasyonu" className="flex-1 space-y-1 p-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <p className="px-3 pb-2 text-xs text-muted-foreground">
            {auth.name} · {auth.role}
          </p>
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Çıkış yap
            </button>
          </form>
        </div>
      </aside>
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
  );
}
