import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { pricingContentSchema, type PricingContent } from "./schema";

const key = (locale: string) => `pricing:${locale}`;

/**
 * Kaydedilmiş fiyatlandırma içeriğini döndürür. Yoksa veya şemaya uymuyorsa
 * null döner (ana sayfa o zaman messages'taki koddaki içeriğe düşer).
 * DB'ye ulaşılamazsa da null.
 */
export async function getStoredPricing(
  locale: string
): Promise<PricingContent | null> {
  try {
    const row = await prisma.siteSetting.findUnique({
      where: { key: key(locale) },
    });
    if (!row) return null;
    const parsed = pricingContentSchema.safeParse(row.value);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export async function saveStoredPricing(
  locale: string,
  value: PricingContent
): Promise<void> {
  await prisma.siteSetting.upsert({
    where: { key: key(locale) },
    create: { key: key(locale), value: value as unknown as Prisma.InputJsonValue },
    update: { value: value as unknown as Prisma.InputJsonValue },
  });
}
