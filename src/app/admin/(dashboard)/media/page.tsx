import { listMedia } from "@/features/admin/media/data";
import { removeMedia } from "@/features/admin/media/actions";
import { UploadForm } from "./upload-form";

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
        Sitede kullanılacak görsel ve dosyalar.
      </p>

      <UploadForm />

      {assets.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          Henüz dosya yüklenmemiş.
        </p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {assets.map((asset) => (
            <li
              key={asset.id}
              className="overflow-hidden rounded-xl border border-border bg-background"
            >
              {asset.mimeType.startsWith("image/") ? (
                // Blob URL'leri dinamik ve harici olduğundan next/image
                // yerine bilinçli olarak düz img kullanıldı.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={asset.url}
                  alt={asset.altText ?? asset.filename}
                  className="aspect-video w-full object-cover"
                />
              ) : (
                <div className="flex aspect-video items-center justify-center bg-muted text-xs text-muted-foreground">
                  {asset.mimeType}
                </div>
              )}
              <div className="flex items-center justify-between gap-2 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium">{asset.filename}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(asset.sizeBytes)}
                  </p>
                </div>
                <form action={removeMedia}>
                  <input type="hidden" name="id" value={asset.id} />
                  <button
                    type="submit"
                    className="rounded-md border border-border px-2.5 py-1 text-xs text-red-600 transition-colors hover:bg-red-50"
                  >
                    Sil
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
