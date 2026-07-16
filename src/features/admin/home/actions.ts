"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/features/admin/auth/session";
import { isPreviewMode, PREVIEW_WRITE_MESSAGE } from "@/features/admin/preview";
import { homeContentSchema } from "./schema";
import { saveStoredHome } from "./data";

export type SaveHomeState = { error?: string; success?: boolean };

/**
 * Ana sayfa içeriğini kaydeder (TR + EN birlikte). Her dilin içeriği gizli
 * bir JSON alanında gelir; Zod ile doğrulanır, ana sayfa yeniden doğrulanır.
 */
export async function saveHome(
  _prev: SaveHomeState,
  formData: FormData
): Promise<SaveHomeState> {
  await requireRole("ADMIN");
  if (isPreviewMode()) return { error: PREVIEW_WRITE_MESSAGE };

  for (const locale of ["tr", "en"] as const) {
    let raw: unknown;
    try {
      raw = JSON.parse(String(formData.get(`content-${locale}`) ?? ""));
    } catch {
      return { error: `İçerik çözümlenemedi (${locale}).` };
    }
    const parsed = homeContentSchema.safeParse(raw);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return {
        error: `Doğrulanamadı (${locale}): ${first.path.join(".")} — ${first.message}`,
      };
    }
    await saveStoredHome(locale, parsed.data);
  }

  for (const locale of ["tr", "en"] as const) revalidatePath(`/${locale}`);
  revalidatePath("/admin/home");
  return { success: true };
}
