import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { showcaseContentSchema, type ShowcaseContent } from "./schema";

const key = (locale: string) => `showcase:${locale}`;

/**
 * Kaydedilmiş vitrin (Örnek Çalışmalar) içeriğini döndürür. Yoksa veya
 * şemaya uymuyorsa null döner (sayfalar o zaman messages'taki içeriğe düşer).
 * DB'ye ulaşılamazsa da null — public sayfa asla çökmez.
 */
export async function getStoredShowcase(
  locale: string
): Promise<ShowcaseContent | null> {
  try {
    const row = await prisma.siteSetting.findUnique({
      where: { key: key(locale) },
    });
    if (!row) return null;
    const parsed = showcaseContentSchema.safeParse(row.value);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export async function saveStoredShowcase(
  locale: string,
  value: ShowcaseContent
): Promise<void> {
  await prisma.siteSetting.upsert({
    where: { key: key(locale) },
    create: { key: key(locale), value: value as unknown as Prisma.InputJsonValue },
    update: { value: value as unknown as Prisma.InputJsonValue },
  });
}
