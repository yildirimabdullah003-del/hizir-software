"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/features/admin/auth/session";
import { upsertSetting } from "@/features/admin/settings/data";
import { isPreviewMode, PREVIEW_WRITE_MESSAGE } from "@/features/admin/preview";

export type SaveSettingState = { error?: string; success?: boolean };

const siteMetaSchema = z.object({
  url: z.string().url("Geçerli bir URL girin (örn. https://hizirsoftware.com)"),
  contactEmail: z.string().email("Geçerli bir e-posta adresi girin"),
});

const socialLinksSchema = z.array(
  z.object({
    name: z.string().min(1),
    href: z.string().url(),
    icon: z.enum(["linkedin", "github", "x"]),
  })
);

/** siteMeta (site adresi + iletişim e-postası) kaydı. */
export async function saveSiteMeta(
  _prev: SaveSettingState,
  formData: FormData
): Promise<SaveSettingState> {
  await requireRole("ADMIN");
  if (isPreviewMode()) return { error: PREVIEW_WRITE_MESSAGE };

  const parsed = siteMetaSchema.safeParse({
    url: String(formData.get("url") ?? "").trim(),
    contactEmail: String(formData.get("contactEmail") ?? "").trim(),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await upsertSetting("siteMeta", parsed.data);
  revalidatePath("/admin/settings");
  return { success: true };
}

/**
 * Sosyal bağlantılar. Form, sabit üç platform satırı gönderir; boş
 * bırakılan satır listeden çıkarılır (footer o ikonu göstermez).
 */
export async function saveSocialLinks(
  _prev: SaveSettingState,
  formData: FormData
): Promise<SaveSettingState> {
  await requireRole("ADMIN");
  if (isPreviewMode()) return { error: PREVIEW_WRITE_MESSAGE };

  const platforms = [
    { icon: "linkedin" as const, name: "LinkedIn" },
    { icon: "github" as const, name: "GitHub" },
    { icon: "x" as const, name: "X" },
  ];

  const links = platforms
    .map((p) => ({
      name: p.name,
      icon: p.icon,
      href: String(formData.get(p.icon) ?? "").trim(),
    }))
    .filter((l) => l.href.length > 0);

  const parsed = socialLinksSchema.safeParse(links);
  if (!parsed.success) {
    return { error: "Bağlantılar geçerli birer URL olmalıdır." };
  }

  await upsertSetting("socialLinks", parsed.data);
  revalidatePath("/admin/settings");
  return { success: true };
}
