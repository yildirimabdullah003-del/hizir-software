import Link from "next/link";
import { listPages } from "@/features/admin/pages/data";
import { togglePagePublished } from "@/features/admin/pages/actions";

export const dynamic = "force-dynamic";

const TYPE_LABELS: Record<string, string> = {
  "service-detail": "Hizmet Detayı",
  static: "Statik Sayfa",
};

export default async function AdminPagesPage() {
  const pages = await listPages();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Sayfalar</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Panelden yönetilen sayfa içerikleri. Yayından kaldırılan sayfa, sitede
        koddaki varsayılan içeriğe geri döner.
      </p>

      {pages.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border bg-background p-6 text-sm text-muted-foreground">
          Henüz yönetilen sayfa yok. Mevcut site içeriğini panele almak için
          seed komutunu çalıştırın: <code>npm run db:seed</code>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-border rounded-xl border border-border bg-background">
          {pages.map((page) => (
            <li
              key={page.id}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <div>
                <Link
                  href={`/admin/pages/${page.id}`}
                  className="text-sm font-medium hover:text-accent"
                >
                  {page.slug}
                </Link>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {TYPE_LABELS[page.type] ?? page.type} · Çeviriler:{" "}
                  {page.translations.length > 0
                    ? page.translations.map((t) => t.locale).join(", ")
                    : "yok"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={
                    page.isPublished
                      ? "inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800"
                      : "inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                  }
                >
                  {page.isPublished ? "Yayında" : "Yayında değil"}
                </span>
                <form action={togglePagePublished}>
                  <input type="hidden" name="pageId" value={page.id} />
                  <input
                    type="hidden"
                    name="isPublished"
                    value={String(!page.isPublished)}
                  />
                  <button
                    type="submit"
                    className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {page.isPublished ? "Yayından kaldır" : "Yayınla"}
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
