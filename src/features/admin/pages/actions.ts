"use server";

import { revalidatePath } from "next/cache";
import type { Locale, Prisma } from "@prisma/client";
import { requireSession } from "@/features/admin/auth/session";
import {
  getPage,
  setPagePublished,
  upsertPageTranslation,
} from "@/features/admin/pages/data";
import { validatePageContent } from "@/features/admin/pages/schema";
import { isPreviewMode, PREVIEW_WRITE_MESSAGE } from "@/features/admin/preview";

export type SavePageState = { error?: string; success?: boolean };

/**
 * Sayfa çevirisini kaydeder. İçerik, editor formundan JSON string olarak
 * gelir (form alanları JSON'a client tarafında derlenir); yazmadan önce
 * sayfa tipine uygun Zod şemasıyla doğrulanır. Başarılı kayıtta ilgili
 * public sayfa yeniden doğrulanır (on-demand ISR).
 */
export async function savePageTranslation(
  _prev: SavePageState,
  formData: FormData
): Promise<SavePageState> {
  await requireSession();
  if (isPreviewMode()) return { error: PREVIEW_WRITE_MESSAGE };

  const pageId = String(formData.get("pageId") ?? "");
  const locale = String(formData.get("locale") ?? "") as Locale;
  const rawContent = String(formData.get("content") ?? "");
  const seoTitle = String(formData.get("seoTitle") ?? "").trim() || null;
  const seoDescription =
    String(formData.get("seoDescription") ?? "").trim() || null;

  if (!pageId || !["tr", "en"].includes(locale)) {
    return { error: "Geçersiz istek." };
  }

  const page = await getPage(pageId);
  if (!page) return { error: "Sayfa bulunamadı." };

  let content: unknown;
  try {
    content = JSON.parse(rawContent);
  } catch {
    return { error: "İçerik çözümlenemedi (geçersiz JSON)." };
  }

  const result = validatePageContent(page.type, content);
  if (!result.success) {
    const first = result.error.issues[0];
    return {
      error: `İçerik doğrulanamadı: ${first.path.join(".")} — ${first.message}`,
    };
  }

  await upsertPageTranslation({
    pageId,
    locale,
    content: result.data as Prisma.InputJsonValue,
    seoTitle,
    seoDescription,
  });

  revalidatePath(`/admin/pages/${pageId}`);
  if (page.type === "service-detail") {
    revalidatePath(`/${locale}/hizmetler/${page.slug}`);
  }

  return { success: true };
}

export async function togglePagePublished(formData: FormData) {
  await requireSession();
  if (isPreviewMode()) return;
  const pageId = String(formData.get("pageId") ?? "");
  const isPublished = formData.get("isPublished") === "true";
  if (!pageId) return;

  const page = await setPagePublished(pageId, isPublished);
  revalidatePath("/admin/pages");
  if (page.type === "service-detail") {
    revalidatePath(`/tr/hizmetler/${page.slug}`);
    revalidatePath(`/en/hizmetler/${page.slug}`);
  }
}
