import { prisma } from "@/lib/prisma";
import { isPreviewMode, previewAnalytics } from "@/features/admin/preview";

export type DailyPoint = { day: string; pageviews: number; visitors: number };
export type Totals = { pageviews: number; visitors: number };
export type LabelCount = { label: string; count: number };
export type PathCount = { path: string; count: number };

// Postgres bigint -> number güvenli dönüşümü (count'lar bigint döner).
function n(v: unknown): number {
  return typeof v === "bigint" ? Number(v) : Number(v ?? 0);
}

/** Son `days` günün günlük görüntülenme + tekil ziyaretçi serisi. */
export async function getDailySeries(days = 14): Promise<DailyPoint[]> {
  if (isPreviewMode()) return previewAnalytics.daily(days);

  const rows = await prisma.$queryRaw<
    { day: Date; pageviews: bigint; visitors: bigint }[]
  >`
    SELECT date_trunc('day', "createdAt") AS day,
           count(*) FILTER (WHERE type = 'pageview') AS pageviews,
           count(DISTINCT "visitorId") FILTER (WHERE type = 'pageview') AS visitors
    FROM "AnalyticsEvent"
    WHERE "createdAt" >= now() - make_interval(days => ${days}::int)
    GROUP BY day
    ORDER BY day ASC;
  `;

  // Boş günleri 0'la doldur (grafikte kesintisiz eksen için).
  const byDay = new Map(
    rows.map((r) => [
      r.day.toISOString().slice(0, 10),
      { pageviews: n(r.pageviews), visitors: n(r.visitors) },
    ])
  );
  const out: DailyPoint[] = [];
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    const hit = byDay.get(key);
    out.push({ day: key, pageviews: hit?.pageviews ?? 0, visitors: hit?.visitors ?? 0 });
  }
  return out;
}

/** Belirli gün aralığı için toplam görüntülenme + tekil ziyaretçi. */
export async function getTotals(days: number): Promise<Totals> {
  if (isPreviewMode()) return previewAnalytics.totals(days);

  const rows = await prisma.$queryRaw<{ pageviews: bigint; visitors: bigint }[]>`
    SELECT count(*) FILTER (WHERE type = 'pageview') AS pageviews,
           count(DISTINCT "visitorId") FILTER (WHERE type = 'pageview') AS visitors
    FROM "AnalyticsEvent"
    WHERE "createdAt" >= now() - make_interval(days => ${days}::int);
  `;
  return { pageviews: n(rows[0]?.pageviews), visitors: n(rows[0]?.visitors) };
}

/** WhatsApp tıklamalarının ürün (label) bazında kırılımı — son `days` gün. */
export async function getWhatsappBreakdown(days = 30): Promise<LabelCount[]> {
  if (isPreviewMode()) return previewAnalytics.whatsapp();

  const rows = await prisma.$queryRaw<{ label: string | null; count: bigint }[]>`
    SELECT label, count(*) AS count
    FROM "AnalyticsEvent"
    WHERE type = 'whatsapp_click'
      AND "createdAt" >= now() - make_interval(days => ${days}::int)
    GROUP BY label
    ORDER BY count DESC;
  `;
  return rows.map((r) => ({ label: r.label ?? "—", count: n(r.count) }));
}

/** En çok görüntülenen sayfalar — son `days` gün. */
export async function getTopPaths(days = 30, limit = 6): Promise<PathCount[]> {
  if (isPreviewMode()) return previewAnalytics.topPaths();

  const rows = await prisma.$queryRaw<{ path: string; count: bigint }[]>`
    SELECT path, count(*) AS count
    FROM "AnalyticsEvent"
    WHERE type = 'pageview'
      AND "createdAt" >= now() - make_interval(days => ${days}::int)
    GROUP BY path
    ORDER BY count DESC
    LIMIT ${limit};
  `;
  return rows.map((r) => ({ path: r.path, count: n(r.count) }));
}
