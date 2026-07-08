import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isPreviewMode, PREVIEW_SETTINGS } from "@/features/admin/preview";

/**
 * Site geneli ayarlar — key/value JSON. Bilinen anahtarlar:
 * "nav", "footer", "socialLinks", "siteMeta". Yapı değişiklikleri migration
 * gerektirmesin diye değerler serbest JSON'dur; formlar anahtar bazında
 * bilinçli olarak ayrı tasarlanır.
 */
export async function getSetting(key: string) {
  if (isPreviewMode()) return PREVIEW_SETTINGS[key] ?? null;
  return prisma.siteSetting.findUnique({ where: { key } });
}

export async function listSettings() {
  if (isPreviewMode()) return Object.values(PREVIEW_SETTINGS);
  return prisma.siteSetting.findMany({ orderBy: { key: "asc" } });
}

export function upsertSetting(key: string, value: Prisma.InputJsonValue) {
  return prisma.siteSetting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
}
