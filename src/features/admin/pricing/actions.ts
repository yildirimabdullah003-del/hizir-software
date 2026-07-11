"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/features/admin/auth/session";
import { isPreviewMode, PREVIEW_WRITE_MESSAGE } from "@/features/admin/preview";
import { pricingContentSchema } from "./schema";
import { saveStoredPricing } from "./data";

export type SavePricingState = { error?: string; success?: boolean };

/**
 * Fiyatlandırma içeriğini (bir locale için) kaydeder. Form, tüm içerik
 * nesnesini gizli bir JSON alanında gönderir; Zod ile doğrulanır, üzerine
 * ana sayfa yeniden doğrulanır (tr + en).
 */
export async function savePricing(
  _prev: SavePricingState,
  formData: FormData
): Promise<SavePricingState> {
  await requireRole("ADMIN");
  if (isPreviewMode()) return { error: PREVIEW_WRITE_MESSAGE };

  const locale = String(formData.get("locale") ?? "");
  if (!["tr", "en"].includes(locale)) return { error: "Geçersiz dil." };

  let raw: unknown;
  try {
    raw = JSON.parse(String(formData.get("content") ?? ""));
  } catch {
    return { error: "İçerik çözümlenemedi." };
  }

  const parsed = pricingContentSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { error: `Doğrulanamadı: ${first.path.join(".")} — ${first.message}` };
  }

  await saveStoredPricing(locale, parsed.data);
  revalidatePath(`/${locale}`);
  revalidatePath("/admin/pricing");
  return { success: true };
}
