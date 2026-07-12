"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/features/admin/auth/session";
import { isPreviewMode, PREVIEW_WRITE_MESSAGE } from "@/features/admin/preview";
import { showcaseContentSchema } from "./schema";
import { saveStoredShowcase } from "./data";

export type SaveShowcaseState = { error?: string; success?: boolean };

/**
 * Vitrin (Örnek Çalışmalar) içeriğini kaydeder. Form, TR ve EN içeriği
 * gizli JSON alanlarında birlikte gönderir (görsel seçimi iki dilde
 * ortaktır); Zod ile doğrulanır, ana sayfa + çalışmalar sayfası yeniden
 * doğrulanır.
 */
export async function saveShowcase(
  _prev: SaveShowcaseState,
  formData: FormData
): Promise<SaveShowcaseState> {
  await requireRole("ADMIN");
  if (isPreviewMode()) return { error: PREVIEW_WRITE_MESSAGE };

  const contents: Record<"tr" | "en", unknown> = { tr: null, en: null };
  for (const locale of ["tr", "en"] as const) {
    try {
      contents[locale] = JSON.parse(String(formData.get(`content-${locale}`) ?? ""));
    } catch {
      return { error: `İçerik çözümlenemedi (${locale}).` };
    }
  }

  for (const locale of ["tr", "en"] as const) {
    const parsed = showcaseContentSchema.safeParse(contents[locale]);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return {
        error: `Doğrulanamadı (${locale}): ${first.path.join(".")} — ${first.message}`,
      };
    }
    await saveStoredShowcase(locale, parsed.data);
  }

  for (const locale of ["tr", "en"] as const) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/calismalar`);
  }
  revalidatePath("/admin/showcase");
  return { success: true };
}
