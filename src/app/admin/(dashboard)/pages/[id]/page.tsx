import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPage } from "@/features/admin/pages/data";
import { PageEditor } from "./page-editor";

export const dynamic = "force-dynamic";

export default async function AdminPageEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const page = await getPage(id);
  if (!page) notFound();

  // Prisma Json alanları client component'e düz JSON olarak geçirilir.
  const translations = Object.fromEntries(
    page.translations.map((t) => [
      t.locale,
      {
        content: t.content as Record<string, unknown>,
        seoTitle: t.seoTitle ?? "",
        seoDescription: t.seoDescription ?? "",
      },
    ])
  );

  return (
    <div className="max-w-4xl">
      <Link
        href="/admin/pages"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Sayfalara dön
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">
        {page.slug}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Metinleri düzenleyin; kaydettiğinizde sitedeki sayfa güncellenir.
        İçerik yapısı (bölüm/madde sayısı) buradan değiştirilemez.
      </p>
      <PageEditor pageId={page.id} translations={translations} />
    </div>
  );
}
