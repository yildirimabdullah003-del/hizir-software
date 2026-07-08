import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Locale, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isPreviewMode, PREVIEW_PAGES } from "@/features/admin/preview";

/** Yönetilebilir sayfaların listesi (çeviri özetiyle). */
export async function listPages() {
  if (isPreviewMode()) return PREVIEW_PAGES;
  return prisma.page.findMany({
    orderBy: [{ type: "asc" }, { slug: "asc" }],
    include: {
      translations: { select: { locale: true, updatedAt: true } },
    },
  });
}

// Önizlemede sayfa içeriği messages dosyalarından okunur ki editör gerçek
// alanlarla dolu görünsün.
function previewPageContent(slug: string) {
  const meta = PREVIEW_PAGES.find((p) => p.id === `page-${slug}` || p.slug === slug);
  if (!meta) return null;
  const translations = (["tr", "en"] as const).map((locale) => {
    let content: unknown = {};
    try {
      const raw = readFileSync(
        join(process.cwd(), "messages", `${locale}.json`),
        "utf8"
      );
      const parsed = JSON.parse(raw) as {
        serviceDetails?: Record<string, unknown>;
      };
      content = parsed.serviceDetails?.[slug] ?? {};
    } catch {
      content = {};
    }
    return {
      id: `pt-${slug}-${locale}`,
      pageId: meta.id,
      locale,
      content,
      seoTitle: null,
      seoDescription: null,
      updatedAt: meta.updatedAt,
    };
  });
  return { ...meta, translations };
}

export async function getPage(id: string) {
  if (isPreviewMode()) {
    const slug = id.replace(/^page-/, "");
    return previewPageContent(slug);
  }
  return prisma.page.findUnique({
    where: { id },
    include: { translations: true },
  });
}

export async function getPublishedPageContent(
  type: string,
  slug: string,
  locale: Locale
) {
  // Önizlemede public site DB'ye gitmez; koddaki (messages) içeriğe düşer.
  if (isPreviewMode()) return null;
  return prisma.pageTranslation.findFirst({
    where: { locale, page: { type, slug, isPublished: true } },
  });
}

export function upsertPageTranslation(params: {
  pageId: string;
  locale: Locale;
  content: Prisma.InputJsonValue;
  seoTitle?: string | null;
  seoDescription?: string | null;
}) {
  const { pageId, locale, content, seoTitle, seoDescription } = params;
  return prisma.pageTranslation.upsert({
    where: { pageId_locale: { pageId, locale } },
    create: { pageId, locale, content, seoTitle, seoDescription },
    update: { content, seoTitle, seoDescription },
  });
}

export function setPagePublished(id: string, isPublished: boolean) {
  return prisma.page.update({ where: { id }, data: { isPublished } });
}
