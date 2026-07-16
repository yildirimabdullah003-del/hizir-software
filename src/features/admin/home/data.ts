import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { homeContentSchema, type HomeContent } from "./schema";

const key = (locale: string) => `home:${locale}`;

/**
 * Kaydedilmiş ana sayfa içeriğini döndürür. Yoksa/şemaya uymuyorsa null
 * (public sayfa messages'a düşer). DB'ye ulaşılamazsa da null — çökmez.
 */
export async function getStoredHome(locale: string): Promise<HomeContent | null> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: key(locale) } });
    if (!row) return null;
    const parsed = homeContentSchema.safeParse(row.value);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export async function saveStoredHome(locale: string, value: HomeContent): Promise<void> {
  await prisma.siteSetting.upsert({
    where: { key: key(locale) },
    create: { key: key(locale), value: value as unknown as Prisma.InputJsonValue },
    update: { value: value as unknown as Prisma.InputJsonValue },
  });
}
