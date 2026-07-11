import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  isPreviewMode,
  PREVIEW_STATS,
  PREVIEW_SUBMISSIONS,
} from "@/features/admin/preview";
import {
  getDailySeries,
  getTotals,
  getWhatsappBreakdown,
  getTopPaths,
  type DailyPoint,
  type Totals,
  type LabelCount,
  type PathCount,
} from "@/features/admin/analytics/data";
import { TrafficChart } from "./traffic-chart";

export const dynamic = "force-dynamic";

// WhatsApp label -> okunur ürün adı.
const PRODUCT_LABELS: Record<string, string> = {
  "qr-menu": "QR Menü",
  "web-site": "Web Sitesi",
  pos: "POS Sistemi",
  complete: "Kapsamlı İşletme",
  float: "Yüzen buton",
};

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

  // Analitik (grafik + kırılımlar). DB'ye ulaşılamazsa boş kalır, panel çökmez.
  let series: DailyPoint[] = [];
  let today: Totals = { pageviews: 0, visitors: 0 };
  let last7: Totals = { pageviews: 0, visitors: 0 };
  let last30: Totals = { pageviews: 0, visitors: 0 };
  let whatsapp: LabelCount[] = [];
  let topPaths: PathCount[] = [];

  if (isPreviewMode()) {
    // Önizleme: DB'ye gitmeden demo sayılar ve son mesajlar.
    stats = PREVIEW_STATS;
    recent = PREVIEW_SUBMISSIONS.slice(0, 5).map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      createdAt: s.createdAt,
    }));
    [series, today, last7, last30, whatsapp, topPaths] = await Promise.all([
      getDailySeries(14),
      getTotals(1),
      getTotals(7),
      getTotals(30),
      getWhatsappBreakdown(30),
      getTopPaths(30),
    ]);
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

      [series, today, last7, last30, whatsapp, topPaths] = await Promise.all([
        getDailySeries(14),
        getTotals(1),
        getTotals(7),
        getTotals(30),
        getWhatsappBreakdown(30),
        getTopPaths(30),
      ]);
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

  const hasTraffic = series.some((d) => d.pageviews > 0);

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

      {/* --- Trafik / analitik --- */}
      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">Site trafiği</h2>
        <span className="text-xs text-muted-foreground">Çerezsiz · anonim</span>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <TrafficTile title="Bugün" totals={today} />
        <TrafficTile title="Son 7 gün" totals={last7} />
        <TrafficTile title="Son 30 gün" totals={last30} />
      </div>

      <div className="mt-4">
        {hasTraffic ? (
          <TrafficChart data={series} />
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-background p-8 text-center text-sm text-muted-foreground">
            Henüz ziyaret verisi yok. Site ziyaret edildikçe grafik burada
            dolmaya başlayacak.
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {/* WhatsApp tıklama kırılımı */}
        <div className="rounded-xl border border-border bg-background p-5">
          <h3 className="text-sm font-semibold">
            WhatsApp tıklamaları{" "}
            <span className="font-normal text-muted-foreground">(son 30 gün)</span>
          </h3>
          {whatsapp.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Henüz tıklama yok.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {whatsapp.map((w) => {
                const max = whatsapp[0].count || 1;
                return (
                  <li key={w.label} className="text-sm">
                    <div className="mb-1 flex justify-between">
                      <span>{PRODUCT_LABELS[w.label] ?? w.label}</span>
                      <span className="font-medium">{w.count}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${(w.count / max) * 100}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* En çok görüntülenen sayfalar */}
        <div className="rounded-xl border border-border bg-background p-5">
          <h3 className="text-sm font-semibold">
            En çok görüntülenen sayfalar{" "}
            <span className="font-normal text-muted-foreground">(son 30 gün)</span>
          </h3>
          {topPaths.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Henüz veri yok.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {topPaths.map((p) => (
                <li
                  key={p.path}
                  className="flex items-center justify-between py-2 text-sm"
                >
                  <span className="truncate text-muted-foreground">{p.path}</span>
                  <span className="ml-3 shrink-0 font-medium">{p.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
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

function TrafficTile({ title, totals }: { title: string; totals: Totals }) {
  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <p className="text-sm text-muted-foreground">{title}</p>
      <div className="mt-2 flex items-end gap-5">
        <div>
          <p className="text-2xl font-semibold tracking-tight">
            {totals.visitors}
          </p>
          <p className="text-xs text-muted-foreground">ziyaretçi</p>
        </div>
        <div>
          <p className="text-2xl font-semibold tracking-tight text-muted-foreground">
            {totals.pageviews}
          </p>
          <p className="text-xs text-muted-foreground">görüntülenme</p>
        </div>
      </div>
    </div>
  );
}
