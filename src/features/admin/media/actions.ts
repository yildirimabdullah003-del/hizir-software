"use server";

import { revalidatePath } from "next/cache";
import { put, del } from "@vercel/blob";
import { requireSession } from "@/features/admin/auth/session";
import { createMediaAsset, deleteMediaAsset } from "@/features/admin/media/data";
import { prisma } from "@/lib/prisma";
import { isPreviewMode, PREVIEW_WRITE_MESSAGE } from "@/features/admin/preview";

export type UploadState = { error?: string; success?: boolean };

/**
 * Blob kullanılabilir mi? Vercel'in güncel modeli (2026):
 * - OIDC (varsayılan): Vercel fonksiyonlarında token çalışma anında
 *   `x-vercel-oidc-token` İSTEK BAŞLIĞIYLA gelir (env değişkeni DEĞİL) ve
 *   SDK bunu kendisi edinir. Bu yüzden burada OIDC token'ı aranmaz;
 *   store'un bağlı olduğunun kanıtı olan BLOB_STORE_ID yeterli sayılır,
 *   kimlik doğrulama denemesi SDK'ya bırakılır (hata aşağıda yakalanır).
 * - Statik BLOB_READ_WRITE_TOKEN: Vercel dışı ortam/yerel geliştirme için.
 *   Yerelde: `npx vercel env pull` kısa ömürlü OIDC token'ı da indirir.
 */
function hasBlobCredentials(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      process.env.BLOB_STORE_ID ||
      process.env.VERCEL_OIDC_TOKEN
  );
}

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/avif",
  "application/pdf",
];

export async function uploadMedia(
  _prev: UploadState,
  formData: FormData
): Promise<UploadState> {
  const auth = await requireSession();
  if (isPreviewMode()) return { error: PREVIEW_WRITE_MESSAGE };

  if (!hasBlobCredentials()) {
    return {
      error:
        "Dosya deposu kimlik bilgisi bulunamadı. Vercel'de Blob store'un bu " +
        "projeye bağlı olduğundan emin olun (OIDC otomatik çalışır); yerel " +
        "geliştirmede `npx vercel env pull` çalıştırın veya BLOB_READ_WRITE_TOKEN girin.",
    };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Lütfen bir dosya seçin." };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { error: "Dosya 10 MB'den büyük olamaz." };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Yalnızca görsel (JPEG/PNG/WebP/SVG/AVIF) ve PDF yüklenebilir." };
  }

  const altText = String(formData.get("altText") ?? "").trim() || null;

  let blob;
  try {
    blob = await put(`media/${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
    });
  } catch (err) {
    // OIDC/token edinimi başarısızsa SDK burada fırlatır — paneli
    // kilitlemek yerine teşhis edilebilir bir mesaj göster.
    console.error("[media] Blob yükleme hatası:", err);
    return {
      error:
        "Dosya deposuna yüklenemedi: " +
        (err instanceof Error ? err.message : "bilinmeyen hata") +
        ". Blob store'un bu projeye bağlı olduğunu ve son deploy'un store " +
        "bağlandıktan SONRA yapıldığını kontrol edin.",
    };
  }

  await createMediaAsset({
    url: blob.url,
    filename: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
    altText,
    uploadedById: auth.userId,
  });

  revalidatePath("/admin/media");
  return { success: true };
}

export async function removeMedia(formData: FormData) {
  await requireSession();
  if (isPreviewMode()) return;
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset) return;

  // Önce Blob'dan sil; DB kaydı en son gider ki yarım silmede kayıt
  // (dolayısıyla URL) elde kalsın ve tekrar denenebilsin.
  if (hasBlobCredentials()) {
    try {
      await del(asset.url);
    } catch {
      // Blob silinemese de devam et — dosya öksüz kalabilir ama panel akışı kilitlenmez.
    }
  }
  await deleteMediaAsset(id);
  revalidatePath("/admin/media");
}
