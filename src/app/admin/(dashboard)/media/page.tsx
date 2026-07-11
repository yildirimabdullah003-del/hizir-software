import { Info, FileText } from "lucide-react";
import { listMedia } from "@/features/admin/media/data";
import { removeMedia } from "@/features/admin/media/actions";
import { UploadForm } from "./upload-form";
import { CopyUrlButton } from "./copy-url-button";

export const dynamic = "force-dynamic";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function AdminMediaPage() {
  const assets = await listMedia();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Medya</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Sitede kullanılacak görsel ve dosyalar — {assets.length} dosya.
      </p>

      <UploadForm />

      {/* Görsellerin sitede nasıl kullanılacağına dair yol gösterici */}
      <div className="mt-4 flex gap-3 rounded-xl border border-accent/20 bg-accent/5 p-4 text-sm">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
        <p className="text-muted-foreground">
          Buraya yüklenen dosyalar siteye <strong>otomatik yerleşmez</strong>;
          bir kütüphane gibi burada saklanır. Bir görseli sitede kullanmak için{" "}
          <strong>&quot;URL kopyala&quot;</strong> ile adresini alın ve içerik
          düzenlerken (örn. Sayfalar sekmesindeki metinlere) yapıştırın. Örnek
          çalışmalar galerisini panelden yönetme özelliği yol haritasında.
        </p>
      </div>

      {assets.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border bg-background p-10 text-center text-sm text-muted-foreground">
          Henüz dosya yüklenmemiş. Yukarıdaki formdan ilk görselinizi yükleyin.
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {assets.map((asset) => (
            <li
              key={asset.id}
              className="group overflow-hidden rounded-xl border border-border bg-background shadow-soft transition-shadow hover:shadow-lifted"
            >
              {asset.mimeType.startsWith("image/") ? (
                // Blob URL'leri dinamik ve harici olduğundan next/image
                // yerine bilinçli olarak düz img kullanıldı.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={asset.url}
                  alt={asset.altText ?? asset.filename}
                  className="aspect-video w-full bg-muted object-cover"
                />
              ) : (
                <div className="flex aspect-video flex-col items-center justify-center gap-2 bg-muted text-muted-foreground">
                  <FileText className="h-8 w-8" aria-hidden="true" />
                  <span className="text-xs uppercase">
                    {asset.mimeType.split("/")[1] ?? asset.mimeType}
                  </span>
                </div>
              )}
              <div className="px-4 py-3">
                <p className="truncate text-sm font-medium" title={asset.filename}>
                  {asset.filename}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatBytes(asset.sizeBytes)} ·{" "}
                  {asset.createdAt.toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "short",
                  })}
                  {asset.uploadedBy ? ` · ${asset.uploadedBy.name}` : ""}
                </p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <CopyUrlButton url={asset.url} />
                  <form action={removeMedia}>
                    <input type="hidden" name="id" value={asset.id} />
                    <button
                      type="submit"
                      className="rounded-md border border-border px-2.5 py-1 text-xs text-red-600 transition-colors hover:border-red-200 hover:bg-red-50"
                    >
                      Sil
                    </button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
