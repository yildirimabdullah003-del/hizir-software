import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  isPreviewMode,
  PREVIEW_STATS,
  PREVIEW_SUBMISSIONS,
} from "@/features/admin/preview";

export const dynamic = "force-dynamic";

/**
 * Genel bakış: temel sayılar + son mesajlar. DB'ye ulaşılamıyorsa panel
 * çökmez; yapılandırma uyarısı gösterilir (ilk kurulum senaryosu).
 */
export default async function AdminDashboardPage() {
  let stats: {
    newSubmissions: number;
    totalSubmissions: number;
    pages: number;
    media: number;
  } | null = null;
  let recent: { id: string; name: string; email: string; createdAt: Date }[] =
    [];

  if (isPreviewMode()) {
    // Önizleme: DB'ye gitmeden demo sayılar ve son mesajlar.
    stats = PREVIEW_STATS;
    recent = PREVIEW_SUBMISSIONS.slice(0, 5).map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      createdAt: s.createdAt,
    }));
  } else {
    try {
      const [newSubmissions, totalSubmissions, pages, media, recentRows] =
        await Promise.all([
          prisma.contactSubmission.count({ where: { status: "NEW" } }),
          prisma.contactSubmission.count(),
          prisma.page.count(),
          prisma.mediaAsset.count(),
          prisma.contactSubmission.findMany({
            orderBy: { createdAt: "desc" },
            take: 5,
            select: { id: true, name: true, email: true, createdAt: true },
          }),
        ]);
      stats = { newSubmissions, totalSubmissions, pages, media };
      recent = recentRows;
    } catch {
      stats = null;
    }
  }

  if (!stats) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight">Genel Bakış</h1>
        <div className="mt-6 rounded-xl border border-dashed border-red-300 bg-red-50 p-6 text-sm text-red-800">
          <p className="font-medium">Veritabanına ulaşılamadı.</p>
          <p className="mt-2">
            <code>.env.local</code> içindeki <code>DATABASE_URL</code> değerini
            kontrol edin ve migration&apos;ları çalıştırın:{" "}
            <code>npx prisma migrate deploy</code>
          </p>
        </div>
      </div>
    );
  }

  const cards = [
    { label: "Yeni mesaj", value: stats.newSubmissions, href: "/admin/submissions" },
    { label: "Toplam mesaj", value: stats.totalSubmissions, href: "/admin/submissions" },
    { label: "Yönetilen sayfa", value: stats.pages, href: "/admin/pages" },
    { label: "Medya dosyası", value: stats.media, href: "/admin/media" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Genel Bakış</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-border bg-background p-6 transition-colors hover:border-accent/40"
          >
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight">
              {card.value}
            </p>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-semibold tracking-tight">
        Son mesajlar
      </h2>
      {recent.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">Henüz mesaj yok.</p>
      ) : (
        <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-background">
          {recent.map((s) => (
            <li key={s.id}>
              <Link
                href={`/admin/submissions/${s.id}`}
                className="flex items-center justify-between px-5 py-3.5 text-sm transition-colors hover:bg-muted"
              >
                <span>
                  <span className="font-medium">{s.name}</span>{" "}
                  <span className="text-muted-foreground">· {s.email}</span>
                </span>
                <time className="text-xs text-muted-foreground">
                  {s.createdAt.toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
