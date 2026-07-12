import Link from "next/link";
import { FileText, Pencil, ExternalLink } from "lucide-react";
import { listPages } from "@/features/admin/pages/data";
import { togglePagePublished } from "@/features/admin/pages/actions";
import { isServiceDetailSlug } from "@/config/services";

export const dynamic = "force-dynamic";

const TYPE_LABELS: Record<string, string> = {
  "service-detail": "Hizmet Detayı",
  static: "Statik Sayfa",
};

/** Yönetilen sayfanın public sitedeki (TR) adresi — yoksa null. */
function publicPath(type: string, slug: string): string | null {
  if (type === "service-detail" && isServiceDetailSlug(slug)) {
    return `/tr/hizmetler/${slug}`;
  }
  return null;
}

export default async function AdminPagesPage() {
  const pages = await listPages();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Sayfalar</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Panelden yönetilen sayfa içerikleri — {pages.length} sayfa. Yayından
        kaldırılan sayfa, sitede koddaki varsayılan içeriğe geri döner.
      </p>

      {pages.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border bg-background p-10 text-center text-sm text-muted-foreground">
          Henüz yönetilen sayfa yok. Mevcut site içeriğini panele almak için
          seed komutunu çalıştırın: <code>npm run db:seed</code>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-border rounded-xl border border-border bg-background shadow-soft">
          {pages.map((page) => {
            const href = publicPath(page.type, page.slug);
            return (
              <li
                key={page.id}
                className="flex items-center gap-4 px-5 py-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/pages/${page.id}`}
                    className="text-sm font-medium hover:text-accent"
                  >
                    {page.slug}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {TYPE_LABELS[page.type] ?? page.type} · Çeviriler:{" "}
                    {page.translations.length > 0
                      ? page.translations.map((t) => t.locale.toUpperCase()).join(", ")
                      : "yok"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2.5">
                  <span
                    className={
                      page.isPublished
                        ? "inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800"
                        : "inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                    }
                  >
                    {page.isPublished ? "Yayında" : "Yayında değil"}
                  </span>
                  {href && page.isPublished ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Sitede görüntüle"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  ) : null}
                  <Link
                    href={`/admin/pages/${page.id}`}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    Düzenle
                  </Link>
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
            );
          })}
        </ul>
      )}
    </div>
  );
}
